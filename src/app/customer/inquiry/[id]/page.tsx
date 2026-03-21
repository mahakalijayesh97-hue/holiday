'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import StatusBadge from '@/components/StatusBadge';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ArrowLeft, FileText, MapPin, Calendar, DollarSign, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CustomerInquiryDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { data: session, status } = useSession();
    const [inquiry, setInquiry] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    useEffect(() => {
        const fetchInquiry = async () => {
            try {
                const res = await fetch(`/api/inquiries/${id}`);
                const data = await res.json();
                
                // Security check on client side just in case (API also handles it)
                if (data.inquiry && data.inquiry.email !== session?.user?.email && (session?.user as any)?.role === 'customer') {
                    toast.error('Unauthorized access');
                    router.push('/customer/dashboard');
                    return;
                }
                
                setInquiry(data.inquiry);
            } catch (error) {
                toast.error('Failed to load trip details');
            } finally {
                setLoading(false);
            }
        };

        if (session && status === 'authenticated') {
            fetchInquiry();
        }
    }, [id, session, status, router]);

    if (status === 'loading' || loading) return <LoadingSpinner text="Opening your travel docs..." />;
    if (!inquiry) return <div className="p-20 text-center text-gray-500">Trip not found</div>;

    return (
        <main className="min-h-screen bg-gray-950 text-white pb-20">
            <Navbar variant="customer" />

            <div className="max-w-4xl mx-auto px-6 py-8">
                <button 
                    onClick={() => router.push('/customer/dashboard')} 
                    className="flex items-center gap-2 text-gray-500 hover:text-white mb-8 text-sm group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to My Trips
                </button>

                <div className="space-y-8">
                    {/* Hero Header */}
                    <div className="glass p-8 rounded-3xl border-purple-500/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 px-6 py-3 bg-purple-600/20 text-purple-400 font-mono text-xs border-b border-l border-purple-500/30">
                            TRIP REF: {inquiry.inquiryId}
                        </div>

                        <div className="mb-8">
                            <p className="text-xs font-black text-purple-400 uppercase tracking-widest mb-2">My Journey to</p>
                            <h1 className="text-4xl font-black flex items-center gap-3">
                                <MapPin className="w-8 h-8 text-blue-400" /> {inquiry.destination}
                            </h1>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-gray-800">
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Status</p>
                                <StatusBadge status={inquiry.status} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Duration</p>
                                <p className="text-sm font-bold flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-500" /> {inquiry.days} Days
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Plan Applied</p>
                                <p className="text-sm font-bold text-gray-300">{inquiry.selectedPlan.title}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Total Budget</p>
                                <p className="text-sm font-bold text-emerald-400 flex items-center gap-1 leading-none">
                                    <DollarSign className="w-4 h-4" /> {inquiry.selectedPlan.estimatedCost}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Itinerary */}
                    <div className="card border-gray-800">
                        <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                            <FileText className="w-6 h-6 text-purple-400" /> My Holiday Itinerary
                        </h3>

                        <div className="space-y-8 relative before:absolute before:left-[1.625rem] before:top-2 before:bottom-2 before:w-px before:bg-gray-800/50">
                            {inquiry.selectedPlan.days.map((day: any) => (
                                <div key={day.day} className="relative pl-16 group">
                                    <div className="absolute left-0 top-0 w-12 h-12 bg-gray-900 border-2 border-purple-500/30 rounded-2xl flex flex-col items-center justify-center group-hover:border-purple-500 transition-all">
                                        <span className="text-[8px] font-black leading-none text-gray-500">DAY</span>
                                        <span className="text-xl font-black leading-none mt-0.5">{day.day}</span>
                                    </div>
                                    <div className="p-6 bg-gray-900/30 rounded-2xl border border-gray-800/50 group-hover:bg-gray-800/20 transition-all">
                                        <h4 className="text-lg font-bold text-white mb-3">{day.title}</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {day.activities.map((act: string, idx: number) => (
                                                <span key={idx} className="text-[10px] font-bold px-3 py-1 bg-gray-800 rounded-full text-gray-400 border border-gray-700">
                                                    {act}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact Support */}
                    <div className="glass p-6 rounded-3xl border-blue-500/10 bg-gradient-to-br from-gray-900 to-blue-900/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div>
                            <h4 className="text-lg font-bold mb-1">Need help with your trip?</h4>
                            <p className="text-sm text-gray-500">Our customer care team is available 24/7 for you.</p>
                        </div>
                        <div className="flex gap-4">
                            <button className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-xs font-bold transition-all border border-gray-700">
                                CHAT WITH CUSTOMER CARE
                            </button>
                            <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold transition-all text-white shadow-lg shadow-blue-500/20">
                                CALL SUPPORT
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
