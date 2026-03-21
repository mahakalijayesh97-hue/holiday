'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { MapPin, Calendar, Clock, BaggageClaim, DollarSign, ChevronRight } from 'lucide-react';

export default function CustomerDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            const role = (session?.user as any)?.role;
            if (role === 'admin') router.push('/admin/dashboard');
            else if (role === 'customer_care') router.push('/customer-care/dashboard');
            else fetchInquiries();
        }
    }, [status, session, router]);

    const fetchInquiries = async () => {
        try {
            const res = await fetch('/api/inquiries');
            const data = await res.json();
            setInquiries(data.inquiries || []);
        } catch (error) {
            console.error('Failed to load inquiries');
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading' || loading) return <LoadingSpinner text="Loading your travel plans..." />;

    return (
        <main className="min-h-screen bg-gray-950 text-white pb-20">
            <Navbar variant="customer" />

            <div className="max-w-6xl mx-auto px-6 pt-12">
                <div className="mb-12">
                    <h1 className="text-4xl font-black mb-2">Welcome Back, {session?.user?.name || 'Traveler'}!</h1>
                    <p className="text-gray-500">Track your holiday inquiries and travel itineraries.</p>
                </div>

                {inquiries.length === 0 ? (
                    <div className="text-center py-20 bg-gray-900/30 border border-dashed border-gray-800 rounded-3xl">
                        <BaggageClaim className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-400">No trips found</h2>
                        <p className="text-gray-600 mt-2">Ready for your next adventure? Start planning on our home page!</p>
                        <button 
                            onClick={() => router.push('/')}
                            className="mt-6 px-6 py-2 bg-purple-600 rounded-xl font-bold hover:bg-purple-500 transition-all"
                        >
                            Plan a New Trip
                        </button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {inquiries.map((inq) => (
                            <div key={inq._id} className="glass p-6 rounded-3xl group hover:border-purple-500/50 transition-all border-purple-500/10 relative overflow-hidden flex flex-col">
                                <div className="absolute top-0 right-0 p-3">
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-gray-800 border border-gray-700 ${
                                        inq.status === 'Completed' ? 'text-emerald-400' : 
                                        inq.status === 'In Progress' ? 'text-blue-400' : 'text-yellow-500'
                                    }`}>
                                        {inq.status}
                                    </span>
                                </div>

                                <div className="mb-4">
                                    <span className="text-[10px] font-mono text-gray-500 tracking-tighter uppercase">{inq.inquiryId}</span>
                                    <h3 className="text-xl font-bold flex items-center gap-2 mt-1 lowercase first-letter:uppercase">
                                        <MapPin className="w-4 h-4 text-purple-400" /> {inq.destination}
                                    </h3>
                                </div>

                                <div className="space-y-3 mb-6 flex-1">
                                    <div className="flex items-center gap-3 text-sm text-gray-400">
                                        <Calendar className="w-4 h-4 opacity-50" /> {inq.days} Days Adventure
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-400">
                                        <DollarSign className="w-4 h-4 opacity-50 text-emerald-500" /> EST: {inq.selectedPlan.estimatedCost}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-400">
                                        <Clock className="w-4 h-4 opacity-50" /> {new Date(inq.createdAt).toLocaleDateString()}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-800 mt-auto">
                                    <button className="w-full flex items-center justify-between text-xs font-bold text-purple-400 hover:text-white transition-all group-hover:px-2">
                                        VIEW ITINERARY <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
