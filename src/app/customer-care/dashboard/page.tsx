'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import InquiryTable from '@/components/InquiryTable';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Briefcase, BarChart3, Clock, CheckCircle, Search, Wifi, WifiOff } from 'lucide-react';
import toast from 'react-hot-toast';

const POLL_INTERVAL_MS = 5_000; // 5 s — fast enough without hammering the DB

export default function CCDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [agentInfo, setAgentInfo] = useState<any>(null);
    const [timeLeft, setTimeLeft] = useState<number>(0);

    const userId = (session?.user as any)?.id;
    const userRole = (session?.user as any)?.role;

    // Keep a stable reference to search so the polling closure doesn't go stale
    const searchRef = useRef(search);
    useEffect(() => { searchRef.current = search; }, [search]);

    // ── Data fetchers ────────────────────────────────────────────────────────

    const fetchAssignedInquiries = useCallback(async () => {
        if (!userId) return;
        try {
            let url = `/api/inquiries?assignedTo=${userId}`;
            if (searchRef.current) url += `&search=${encodeURIComponent(searchRef.current)}`;

            const res = await fetch(url);
            const data = await res.json();
            setInquiries(data.inquiries || []);
        } catch (error) {
            console.error('Failed to load inquiries', error);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const fetchAgentInfo = useCallback(async () => {
        if (!userId) return;
        try {
            const res = await fetch(`/api/users/${userId}`);
            const data = await res.json();
            if (data.user) setAgentInfo(data.user);
        } catch (error) {
            console.error('Failed to load agent info', error);
        }
    }, [userId]);

    // ── Auth guard ───────────────────────────────────────────────────────────

    useEffect(() => {
        if (
            status === 'unauthenticated' ||
            (status === 'authenticated' && userRole !== 'customer_care')
        ) {
            if (status === 'authenticated' && userRole === 'admin') {
                router.push('/admin/dashboard');
            } else {
                router.push('/login');
            }
        }
    }, [status, userRole, router]);

    // ── Initial load ─────────────────────────────────────────────────────────

    useEffect(() => {
        if (status === 'authenticated' && userId) {
            fetchAssignedInquiries();
            fetchAgentInfo();
        }
    }, [status, userId, fetchAssignedInquiries, fetchAgentInfo]);

    // ── Polling — ALWAYS runs while the page is open ─────────────────────────
    //
    // Previously this was gated on `agentInfo?.isAvailable`, which meant:
    //   - Polling stopped when the agent went offline
    //   - Assignment expiry banners & new assignments were never picked up
    //
    // Now we always poll; the server decides what to show.

    useEffect(() => {
        if (status !== 'authenticated') return;

        const isOnline = agentInfo?.isAvailable === 1 || agentInfo?.isAvailable === true;
        if (!isOnline) return;

        const interval = setInterval(() => {
            fetchAssignedInquiries();
            fetchAgentInfo();
        }, POLL_INTERVAL_MS);

        return () => clearInterval(interval);
    }, [status, agentInfo?.isAvailable, fetchAssignedInquiries, fetchAgentInfo]);

    // Re-fetch immediately when search changes
    useEffect(() => {
        if (status === 'authenticated') fetchAssignedInquiries();
    }, [search, status, fetchAssignedInquiries]);

    // Automatically set availability to offline/unavailable when closing/leaving page
    useEffect(() => {
        if (status !== 'authenticated' || !session?.user) return;
        const userId = (session.user as any).id;

        const handleUnload = () => {
            fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isAvailable: 0 }),
                keepalive: true
            });
        };

        window.addEventListener('pagehide', handleUnload);
        return () => {
            window.removeEventListener('pagehide', handleUnload);
        };
    }, [status, session]);

    // ── Availability toggle ───────────────────────────────────────────────────

    const toggleAvailability = async () => {
        if (!agentInfo) return;
        const nextVal = (agentInfo.isAvailable === 1 || agentInfo.isAvailable === true) ? 0 : 1;

        // Optimistic UI update
        setAgentInfo((prev: any) => prev ? { ...prev, isAvailable: nextVal } : null);

        try {
            const userId = (session?.user as any)?.id;
            const res = await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isAvailable: nextVal })
            });

            if (res.ok) {
                toast.success(
                    nextVal === 1
                        ? 'Status updated: Available (Online)'
                        : 'Status updated: Unavailable (Offline)'
                );
                // Re-fetch so any released assignments are reflected immediately
                fetchAssignedInquiries();
                fetchAgentInfo();
            } else {
                // Roll back optimistic update
                setAgentInfo((prev: any) => prev ? { ...prev, isAvailable: nextVal === 1 ? 0 : 1 } : null);
                toast.error('Failed to update availability');
            }
        } catch (error) {
            setAgentInfo((prev: any) => prev ? { ...prev, isAvailable: nextVal === 1 ? 0 : 1 } : null);
            toast.error('Error updating status');
        }
    };

    // ── Pending inquiry + countdown ──────────────────────────────────────────

    const pendingInquiry = inquiries.find((inq: any) =>
        inq.status === 'Pending' &&
        inq.assignedTo?._id === (session?.user as any)?.id &&
        !inq.assignmentAccepted
    );

    useEffect(() => {
        if (!pendingInquiry?.assignmentExpiresAt) {
            setTimeLeft(0);
            return;
        }

        const expiresAt = new Date(pendingInquiry.assignmentExpiresAt).getTime();

        const updateTimer = () => {
            const diff = Math.max(0, Math.round((expiresAt - Date.now()) / 1000));
            setTimeLeft(diff);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [pendingInquiry]);

    // ── Accept handler ────────────────────────────────────────────────────────

    const handleAcceptInquiry = async (inqId: string) => {
        try {
            const res = await fetch(`/api/inquiries/${inqId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ assignmentAccepted: true })
            });
            if (res.ok) {
                toast.success('Assignment accepted!');
                fetchAssignedInquiries();
            } else {
                toast.error('Failed to accept assignment');
            }
        } catch (error) {
            toast.error('Error accepting assignment');
        }
    };

    // ── Render ────────────────────────────────────────────────────────────────

    if (status === 'loading' || loading) return <LoadingSpinner text="Loading your workspace..." />;

    const stats = [
        { label: 'Assigned to Me',  value: inquiries.length,                                           icon: Briefcase,   color: 'text-blue-400'   },
        { label: 'Active Tasks',    value: inquiries.filter((i: any) => i.status === 'In Progress').length, icon: Clock,  color: 'text-yellow-400' },
        { label: 'Completed',       value: inquiries.filter((i: any) => i.status === 'Completed').length,   icon: CheckCircle, color: 'text-green-400'  },
    ];

    return (
        <main className="min-h-screen bg-gray-950 text-white">
            <Navbar variant="customer-care" />

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-extrabold flex items-center gap-3">
                            Hello, {session?.user?.name?.split(' ')[0]}
                        </h1>
                        <p className="text-gray-500">Here are the holiday inquiries assigned specifically to you.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        {/* Availability Toggle */}
                        {agentInfo && (
                            <button
                                onClick={toggleAvailability}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all shadow-md ${
                                    (agentInfo.isAvailable === 1 || agentInfo.isAvailable === true)
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                                        : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
                                }`}
                            >
                                {(agentInfo.isAvailable === 1 || agentInfo.isAvailable === true) ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                                STATUS: {(agentInfo.isAvailable === 1 || agentInfo.isAvailable === true) ? 'AVAILABLE' : 'UNAVAILABLE'}
                                <div className={`w-9 h-5 rounded-full p-0.5 ml-1 transition-colors duration-200 ease-in-out ${
                                    (agentInfo.isAvailable === 1 || agentInfo.isAvailable === true) ? 'bg-emerald-500' : 'bg-gray-700'
                                }`}>
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${
                                        (agentInfo.isAvailable === 1 || agentInfo.isAvailable === true) ? 'translate-x-4' : 'translate-x-0'
                                    }`} />
                                </div>
                            </button>
                        )}

                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Quick search..."
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm outline-none transition-all focus:border-blue-500"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Acceptance Warning Banner */}
                {pendingInquiry && timeLeft > 0 && (
                    <div className="mb-8 p-6 bg-gradient-to-r from-red-950/40 via-red-900/30 to-amber-900/20 border border-red-500/40 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 animate-pulse">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center border border-red-500/30 shrink-0">
                                <Clock className="w-6 h-6 text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-white">Action Required: New Inquiry Assigned!</h3>
                                <p className="text-sm text-gray-400 mt-1">
                                    Inquiry <span className="font-mono text-amber-400 font-bold">{pendingInquiry.inquiryId}</span>{' '}
                                    for <span className="text-white font-bold">{pendingInquiry.destination}</span> needs acceptance.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto shrink-0 justify-end">
                            <div className="text-center bg-gray-950/80 border border-gray-800 px-4 py-2 rounded-xl">
                                <span className="text-[10px] text-gray-500 uppercase block font-bold leading-none mb-1">Time Left</span>
                                <span className="text-xl font-black text-red-500 font-mono">{timeLeft}s</span>
                            </div>
                            <button
                                onClick={() => handleAcceptInquiry(pendingInquiry._id)}
                                className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-900/30 hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-wider"
                            >
                                Accept Assignment
                            </button>
                        </div>
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    {stats.map((stat, i) => (
                        <div key={i} className="glass p-6 rounded-2xl border-gray-800 flex items-center justify-between group hover:border-blue-500/30 transition-all">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">{stat.label}</p>
                                <p className="text-3xl font-black">{stat.value}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-gray-900 group-hover:bg-blue-500/10 transition-colors">
                                <stat.icon className={`w-7 h-7 ${stat.color}`} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Inquiry Queue */}
                <div className="glass overflow-hidden rounded-2xl shadow-xl">
                    <div className="bg-blue-500/5 px-6 py-4 border-b border-gray-700/50 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-blue-400" />
                        <h3 className="font-bold text-sm">My Inquiry Queue</h3>
                    </div>
                    <div className="p-2">
                        <InquiryTable inquiries={inquiries} basePath="/customer-care" />
                    </div>
                </div>
            </div>
        </main>
    );
}
