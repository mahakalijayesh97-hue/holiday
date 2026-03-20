'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import InquiryTable from '@/components/InquiryTable';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Briefcase, BarChart3, Clock, CheckCircle, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CCDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (status === 'unauthenticated' || (session?.user as any)?.role !== 'customer_care') {
            if (status === 'authenticated' && (session?.user as any).role === 'admin') {
                router.push('/admin/dashboard');
            } else {
                router.push('/login');
            }
        }
    }, [status, session, router]);

    useEffect(() => {
        const fetchAssignedInquiries = async () => {
            try {
                const userId = (session?.user as any)?.id;
                let url = `/api/inquiries?assignedTo=${userId}`;
                if (search) url += `&search=${encodeURIComponent(search)}`;

                const res = await fetch(url);
                const data = await res.json();
                setInquiries(data.inquiries || []);
            } catch (error) {
                toast.error('Failed to load your inquiries');
            } finally {
                setLoading(false);
            }
        };

        if (status === 'authenticated' && (session?.user as any)?.id) fetchAssignedInquiries();
    }, [status, session, search]);

    if (status === 'loading' || loading) return <LoadingSpinner text="Loading your workspace..." />;

    const stats = [
        { label: 'Assigned to Me', value: inquiries.length, icon: Briefcase, color: 'text-blue-400' },
        { label: 'Active Tasks', value: inquiries.filter((i: any) => i.status === 'In Progress').length, icon: Clock, color: 'text-yellow-400' },
        { label: 'Completed', value: inquiries.filter((i: any) => i.status === 'Completed').length, icon: CheckCircle, color: 'text-green-400' },
    ];

    return (
        <main className="min-h-screen bg-gray-950 text-white">
            <Navbar variant="customer-care" />

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-extrabold flex items-center gap-3">
                            Hello, {session?.user?.name?.split(' ')[0]} 👋
                        </h1>
                        <p className="text-gray-500">Here are the holiday inquiries assigned specifically to you.</p>
                    </div>
                    <div className="relative w-64 hidden md:block">
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    {stats.map((stat, i) => (
                        <div key={i} className="glass p-6 rounded-2xl border-gray-800 flex items-center justify-between group hover:border-blue-500/30 transition-all">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">{stat.label}</p>
                                <p className="text-3xl font-black">{stat.value}</p>
                            </div>
                            <div className={`p-4 rounded-xl bg-gray-900 group-hover:bg-blue-500/10 transition-colors`}>
                                <stat.icon className={`w-7 h-7 ${stat.color}`} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="glass overflow-hidden rounded-2xl shadow-xl">
                    <div className="bg-blue-500/5 px-6 py-4 border-b border-gray-700/50 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-blue-400" />
                        <h3 className="font-bold text-sm">My Inquiry Queue</h3>
                    </div>
                    <div className="p-2">
                        <InquiryTable inquiries={inquiries} basePath="/admin" />
                    </div>
                </div>
            </div>
        </main>
    );
}
