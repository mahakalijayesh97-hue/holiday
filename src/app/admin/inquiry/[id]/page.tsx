'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import StatusBadge from '@/components/StatusBadge';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ArrowLeft, UserPlus, FileText, CheckCircle2, MessageSquare, CalendarClock, Phone, Mail, MapPin, DollarSign, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function InquiryDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'unauthenticated' || (status === 'authenticated' && !['admin', 'customer_care'].includes((session?.user as any)?.role))) {
            router.push('/login');
        }
    }, [status, session, router]);

    const [inquiry, setInquiry] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newNote, setNewNote] = useState('');
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [inqRes, usersRes] = await Promise.all([
                    fetch(`/api/inquiries/${id}`),
                    fetch('/api/users?role=customer_care'),
                ]);
                const inqData = await inqRes.json();
                const usersData = await usersRes.json();

                setInquiry(inqData.inquiry);
                setUsers(usersData.users);
            } catch (error) {
                toast.error('Failed to load inquiry details');
            } finally {
                setLoading(false);
            }
        };
        if (session && ['admin', 'customer_care'].includes((session.user as any).role)) fetchData();
    }, [id, session]);

    const handleUpdate = async (updates: any) => {
        setUpdating(true);
        try {
            const res = await fetch(`/api/inquiries/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...updates,
                    noteAuthor: session?.user?.name,
                }),
            });
            const data = await res.json();
            if (data.inquiry) {
                setInquiry(data.inquiry);
                toast.success('Updated successfully');
            }
        } catch (error) {
            toast.error('Update failed');
        } finally {
            setUpdating(false);
        }
    };

    const addNote = () => {
        if (!newNote.trim()) return;
        handleUpdate({ note: newNote });
        setNewNote('');
    };

    if (status === 'loading' || loading) return <LoadingSpinner text="Fetching full inquiry file..." />;
    if (!inquiry) return <div className="p-20 text-center">Inquiry not found</div>;

    return (
        <main className="min-h-screen bg-gray-950 text-white pb-20">
            <Navbar variant={(session?.user as any)?.role === 'admin' ? 'admin' : 'customer-care'} />

            <div className="max-w-6xl mx-auto px-6 py-8">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-white mb-6 text-sm">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </button>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Info Columns */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Header Card */}
                        <div className="glass p-6 md:p-8 rounded-3xl border-purple-500/20 relative overflow-hidden">
                            <div className="md:absolute top-0 right-0 px-6 py-3 bg-purple-600/20 text-purple-400 font-mono text-sm border-b border-l border-purple-500/30 w-fit mb-6 md:mb-0 rounded-bl-2xl md:rounded-bl-none">
                                {inquiry.inquiryId}
                            </div>

                            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6 pt-4 md:pt-0">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl font-bold shrink-0 shadow-lg shadow-purple-500/20">
                                    {inquiry.name.charAt(0)}
                                </div>
                                <div>
                                    <h1 className="text-2xl md:text-4xl font-black tracking-tight">{inquiry.name}</h1>
                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 mt-2">
                                        <span className="flex items-center gap-1.5 text-xs md:text-sm text-gray-400 font-medium truncate max-w-[200px] md:max-w-none"><Mail className="w-3.5 h-3.5 text-purple-400" /> {inquiry.email}</span>
                                        <span className="flex items-center gap-1.5 text-xs md:text-sm text-gray-400 font-medium"><Phone className="w-3.5 h-3.5 text-purple-400" /> {inquiry.phone}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 md:p-6 border-t border-gray-800 bg-gray-900/20 rounded-2xl mt-4">
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-black mb-1 tracking-widest">Status</p>
                                    <StatusBadge status={inquiry.status} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-black mb-1 tracking-widest">Destination</p>
                                    <p className="text-sm font-bold flex items-center gap-1 truncate"><MapPin className="w-3.5 h-3.5 text-blue-400" /> {inquiry.destination}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-black mb-1 tracking-widest">Duration</p>
                                    <p className="text-sm font-bold text-gray-200">{inquiry.days} <span className="text-gray-500 font-normal">Days</span></p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-black mb-1 tracking-widest">Budget</p>
                                    <p className="text-sm font-black capitalize text-green-400">{inquiry.selectedPlan.budget}</p>
                                </div>
                            </div>
                        </div>

                        {/* Selected Plan Details */}
                        <div className="card">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-purple-400" /> Selected Itinerary
                            </h3>
                            <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-700/50 mb-6">
                                <h4 className="text-lg font-bold text-white mb-2">{inquiry.selectedPlan.title}</h4>
                                <p className="text-gray-400 text-sm italic mb-4">"{inquiry.selectedPlan.description}"</p>
                                <div className="flex items-center gap-3 text-sm text-green-400 font-mono bg-green-500/10 w-fit px-3 py-1 rounded-lg">
                                    <DollarSign className="w-4 h-4" /> Cost: {inquiry.selectedPlan.estimatedCost}
                                </div>
                            </div>
                            <div className="space-y-4">
                                {inquiry.selectedPlan.days.map((day: any) => (
                                    <div key={day.day} className="flex gap-4 p-4 border-l-2 border-purple-500/30 bg-gray-900/20 rounded-r-xl">
                                        <div className="shrink-0 w-12 text-center">
                                            <p className="text-xs text-purple-500 font-black">DAY</p>
                                            <p className="text-2xl font-black">{day.day}</p>
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-200 mb-1">{day.title}</p>
                                            <p className="text-xs text-gray-500 leading-relaxed">{day.activities.join(' • ')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Coordination */}
                    <div className="space-y-8">
                        {/* Actions Card */}
                        <div className="card border-purple-500/20">
                            <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-6">Coordination</h3>

                            <div className="space-y-6">
                                {/* Status Toggle */}
                                <div>
                                    <label className="text-xs font-bold text-gray-400 mb-2 block">Update Status</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['Pending', 'In Progress', 'Completed'].map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => handleUpdate({ status: s })}
                                                disabled={updating}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${inquiry.status === s
                                                        ? 'bg-purple-600 text-white shadow-lg'
                                                        : 'bg-gray-800 text-gray-500 hover:text-white'
                                                    }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Assignment */}
                                <div>
                                    <label className="text-xs font-bold text-gray-400 mb-2 block flex items-center gap-1.5">
                                        <UserPlus className="w-3.5 h-3.5" /> Assign To Agent
                                    </label>
                                    <select
                                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-sm outline-none focus:border-purple-500 text-white"
                                        value={inquiry.assignedTo?._id || ''}
                                        onChange={(e) => handleUpdate({ assignedTo: e.target.value })}
                                        disabled={updating}
                                    >
                                        <option value="" className="bg-gray-900 text-white">Unassigned</option>
                                        {users.map((u) => (
                                            <option key={u._id} value={u._id} className="bg-gray-900 text-white">{u.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Internal Notes */}
                        <div className="card">
                            <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-6 flex items-center justify-between">
                                <span>Internal Notes</span>
                                <MessageSquare className="w-4 h-4" />
                            </h3>

                            <div className="space-y-4 max-h-[400px] overflow-y-auto mb-6 pr-2 custom-scrollbar">
                                {inquiry.notes.length === 0 && <p className="text-xs text-gray-600 text-center py-4 italic">No notes added yet.</p>}
                                {inquiry.notes.map((note: any, i: number) => (
                                    <div key={i} className="bg-gray-900/50 p-3 rounded-xl border border-gray-800">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[10px] font-bold text-purple-400">{note.author}</span>
                                            <span className="text-[10px] text-gray-600">{new Date(note.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-xs text-gray-300">{note.text}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="relative">
                                <textarea
                                    className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-xs outline-none focus:border-purple-500 min-h-[80px]"
                                    placeholder="Type a follow-up note..."
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                />
                                <button
                                    onClick={addNote}
                                    disabled={!newNote.trim() || updating}
                                    className="absolute bottom-3 right-3 p-1.5 bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Schedule Meeting */}
                        <div className="card bg-gradient-to-br from-gray-800/40 to-blue-900/10">
                            <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <CalendarClock className="w-4 h-4 text-blue-400" /> Schedule Meeting
                            </h3>
                            <p className="text-[10px] text-gray-500 mb-4">Set a follow-up call time and date for the customer.</p>
                            <div className="space-y-3">
                                <input type="datetime-local" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs" />
                                <button className="w-full py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-bold hover:bg-blue-600/30 transition-all">
                                    Book Appointment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
