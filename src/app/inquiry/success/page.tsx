'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePlanStore } from '@/store/planStore';
import Navbar from '@/components/Navbar';
import { CheckCircle2, Copy, Home, Calendar, ThumbsUp, PartyPopper } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SuccessPage() {
    const router = useRouter();
    const { inquiryId, reset, selectedPlan, destination, days } = usePlanStore();

    useEffect(() => {
        if (!inquiryId) {
            router.push('/');
        }
    }, [inquiryId, router]);

    const copyId = () => {
        navigator.clipboard.writeText(inquiryId);
        toast.success('ID copied to clipboard!');
    };

    const handleGoHome = () => {
        reset();
        router.push('/');
    };

    if (!inquiryId) return null;

    return (
        <main className="min-h-screen bg-gray-950 text-white">
            <Navbar variant="public" />

            <div className="max-w-3xl mx-auto px-6 py-20 text-center">
                <div className="relative mb-12 no-print">
                    <div className="absolute inset-0 bg-green-500/20 blur-[100px] rounded-full -z-10" />
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-500/40 scale-110 animate-bounce">
                        <CheckCircle2 className="w-12 h-12 text-white" />
                    </div>
                </div>

                <div className="no-print">
                    <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                        Plan Confirmed!
                    </h1>
                    <p className="text-gray-400 text-xl mb-10 max-w-xl mx-auto leading-relaxed">
                        Your inquiry has been received. Our travel representative will get in touch with you within <span className="text-white font-bold">2-4 hours</span> to finalize the pricing and booking.
                    </p>
                </div>

                <div className="glass p-8 rounded-3xl border-green-500/20 max-w-lg mx-auto mb-12 shadow-2xl">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-3">Your Unique Inquiry ID</p>
                    <div className="flex items-center justify-between bg-black/40 p-4 rounded-xl border border-gray-700/50 group">
                        <span className="text-2xl font-mono text-green-400 font-bold tracking-widest">{inquiryId}</span>
                        <button
                            onClick={copyId}
                            className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-all flex items-center gap-2 text-sm no-print"
                        >
                            <Copy className="w-4 h-4" />
                            <span className="hidden sm:inline">Copy</span>
                        </button>
                    </div>
                    <div className="flex items-center gap-4 mt-8 justify-center border-t border-gray-800 pt-6 no-print">
                        <div className="flex flex-col items-center gap-1 group">
                            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">Call Scheduled</span>
                        </div>
                        <div className="w-12 h-px bg-gray-800" />
                        <div className="flex flex-col items-center gap-1 group">
                            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
                                <PartyPopper className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">Booking Done</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 no-print">
                    <button
                        onClick={handleGoHome}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3.5 px-8 rounded-xl transition-all border border-gray-700"
                    >
                        <Home className="w-5 h-5" />
                        Go Back Home
                    </button>
                    <button
                        className="w-full sm:w-auto flex items-center justify-center gap-2 btn-primary"
                        onClick={() => window.print()}
                    >
                        <ThumbsUp className="w-5 h-5" />
                        Download Summary PDF
                    </button>
                </div>

                {/* Print Only Itinerary */}
                {selectedPlan && (
                    <div className="hidden print-only text-left mt-20 border-t-2 border-black pt-10">
                        <div className="flex justify-between items-baseline mb-8">
                            <h2 className="text-3xl font-black">Travel Itinerary Summary</h2>
                            <p className="text-sm font-bold">Inquiry ID: {inquiryId}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-8 mb-10 pb-8 border-b border-gray-200">
                            <div>
                                <p className="text-xs uppercase font-bold text-gray-500 mb-1">Destination</p>
                                <p className="text-xl font-bold">{destination}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase font-bold text-gray-500 mb-1">Duration</p>
                                <p className="text-xl font-bold">{days} Days / {days - 1} Nights</p>
                            </div>
                        </div>

                        <div className="mb-10">
                            <h3 className="text-xl font-bold mb-4">{selectedPlan.title}</h3>
                            <p className="text-gray-700 leading-relaxed mb-6">{selectedPlan.description}</p>
                            
                            <div className="bg-gray-100 p-4 rounded-xl mb-10">
                                <p className="text-xs uppercase font-bold text-gray-500 mb-2">Estimated Cost</p>
                                <p className="text-lg font-bold text-green-700">{selectedPlan.estimatedCost}</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <h3 className="text-xl font-bold border-b-2 border-black pb-2">Full Schedule</h3>
                            {selectedPlan.days.map((day) => (
                                <div key={day.day} className="page-break-inside-avoid">
                                    <p className="font-black text-blue-700 uppercase text-xs mb-1">Day {day.day}</p>
                                    <h4 className="text-lg font-bold mb-2">{day.title}</h4>
                                    <div className="pl-4 border-l-2 border-gray-200 space-y-2">
                                        <p className="text-sm"><strong>Places:</strong> {day.places.join(', ')}</p>
                                        <p className="text-sm"><strong>Route:</strong> {day.route}</p>
                                        <p className="text-sm"><strong>Activities:</strong> {day.activities.join(', ')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-20 pt-10 border-t border-gray-200 text-center text-gray-400 text-xs">
                            <p>Generated by Holiday Planner Agent — Professional Travel Planning via AI</p>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
