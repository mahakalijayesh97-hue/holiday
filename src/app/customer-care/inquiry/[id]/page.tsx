'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import StatusBadge from '@/components/StatusBadge';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ArrowLeft, FileText, CheckCircle2, MessageSquare, CalendarClock, Phone, Mail, MapPin, DollarSign, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CCInquiryDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'unauthenticated' || (status === 'authenticated' && (session?.user as any)?.role !== 'customer_care')) {
            if (status === 'authenticated' && (session?.user as any).role === 'admin') {
                router.push(`/admin/inquiry/${id}`);
            } else {
                router.push('/login');
            }
        }
    }, [status, session, router, id]);

    const [inquiry, setInquiry] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [newNote, setNewNote] = useState('');
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchInquiry = async () => {
            try {
                const res = await fetch(`/api/inquiries/${id}`);
                const data = await res.json();
                setInquiry(data.inquiry);
            } catch (error) {
                toast.error('Failed to load inquiry details');
            } finally {
                setLoading(false);
            }
        };
        if (session && (session.user as any).role === 'customer_care') fetchInquiry();
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
    if (!inquiry) return <div className="p-20 text-center text-gray-400">Inquiry not found or access denied</div>;

    return (
        <main className="min-h-screen bg-gray-950 text-white pb-20">
            <Navbar variant="customer-care" />

            <div className="max-w-6xl mx-auto px-6 py-8">
                <button onClick={() => router.push('/customer-care/dashboard')} className="flex items-center gap-2 text-gray-500 hover:text-white mb-6 text-sm">
                    <ArrowLeft className="w-4 h-4" /> Back to Workspace
                </button>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Info Columns */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Header Card */}
                        <div className="glass p-8 rounded-3xl border-blue-500/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 px-6 py-3 bg-blue-600/20 text-blue-400 font-mono text-sm border-b border-l border-blue-500/30">
                                {inquiry.inquiryId}
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl font-bold">
                                    {inquiry.name.charAt(0)}
                                </div>
                                <div>
                                    <h1 className="text-3xl font-black">{inquiry.name}</h1>
                                    <div className="flex gap-4 mt-1">
                                        <span className="flex items-center gap-1.5 text-sm text-gray-500"><Mail className="w-3.5 h-3.5" /> {inquiry.email}</span>
                                        <span className="flex items-center gap-1.5 text-sm text-gray-500"><Phone className="w-3.5 h-3.5" /> {inquiry.phone}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-gray-800">
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Status</p>
                                    <StatusBadge status={inquiry.status} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Destination</p>
                                    <p className="text-sm font-bold flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-blue-400" /> {inquiry.destination}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Duration</p>
                                    <p className="text-sm font-bold">{inquiry.days} Days</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Budget</p>
                                    <p className="text-sm font-bold capitalize text-green-400">{inquiry.selectedPlan.budget}</p>
                                </div>
                            </div>
                        </div>

                        {/* Selected Plan Details */}
                        <div className="card">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-400" /> Selected Trip Plan
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
                                    <div key={day.day} className="flex gap-4 p-4 border-l-2 border-blue-500/30 bg-gray-900/20 rounded-r-xl">
                                        <div className="shrink-0 w-12 text-center">
                                            <p className="text-xs text-blue-500 font-black">DAY</p>
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
                        {/* Status Card */}
                        <div className="card border-blue-500/20">
                            <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-6 tracking-widest">Update Queue State</h3>
                            <div className="flex flex-wrap gap-2">
                                {['Pending', 'In Progress', 'Completed'].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => handleUpdate({ status: s })}
                                        disabled={updating}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${inquiry.status === s
                                                ? 'bg-blue-600 text-white shadow-lg'
                                                : 'bg-gray-800 text-gray-500 hover:text-white'
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Internal Notes */}
                        <div className="card">
                            <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-6 flex items-center justify-between tracking-widest">
                                <span>Follow-up History</span>
                                <MessageSquare className="w-4 h-4 text-blue-400" />
                            </h3>

                            <div className="space-y-4 max-h-[300px] overflow-y-auto mb-6 pr-2 custom-scrollbar">
                                {inquiry.notes.length === 0 && <p className="text-xs text-gray-600 text-center py-4 italic">No notes yet.</p>}
                                {inquiry.notes.map((note: any, i: number) => (
                                    <div key={i} className="bg-gray-900/50 p-3 rounded-xl border border-gray-800">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[10px] font-bold text-blue-400">{note.author}</span>
                                            <span className="text-[10px] text-gray-600">{new Date(note.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-xs text-gray-300">{note.text}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="relative">
                                <textarea
                                    className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-xs outline-none focus:border-blue-500 min-h-[80px]"
                                    placeholder="Add a progress update..."
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                />
                                <button
                                    onClick={addNote}
                                    disabled={!newNote.trim() || updating}
                                    className="absolute bottom-3 right-3 p-1.5 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Meeting Schedule */}
                        <div className="card bg-gradient-to-br from-blue-900/10 to-purple-900/5">
                            <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <CalendarClock className="w-4 h-4 text-blue-400" /> Set Follow-up Call
                            </h3>
                            <div className="space-y-3">
                                <input type="datetime-local" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs" />
                                <button className="w-full py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-bold hover:bg-blue-600/30 transition-all">
                                    Set Appointment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
