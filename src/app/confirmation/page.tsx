'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePlanStore } from '@/store/planStore';
import StepIndicator from '@/components/StepIndicator';
import Navbar from '@/components/Navbar';
import { CheckCircle, ArrowLeft, ArrowRight, MapPin, Calendar, DollarSign, ListChecks } from 'lucide-react';

export default function ConfirmationPage() {
    const router = useRouter();
    const { selectedPlan, destination, days } = usePlanStore();
    const [hasHydrated, setHasHydrated] = useState(false);

    useEffect(() => {
        setHasHydrated(true);
    }, []);

    useEffect(() => {
        if (hasHydrated && !selectedPlan) {
            router.push('/plans');
        }
    }, [hasHydrated, selectedPlan, router]);

    if (!hasHydrated || !selectedPlan) return null;

    return (
        <main className="min-h-screen bg-gray-950 text-white">
            <Navbar variant="public" />

            <div className="max-w-4xl mx-auto px-6 py-12">
                <StepIndicator currentStep={3} />

                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" /> Change Plan
                    </button>
                    <div className="flex items-center gap-2 text-green-400 bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-bold">Plan Selected</span>
                    </div>
                </div>

                <div className="glass rounded-3xl overflow-hidden shadow-2xl animate-fade-in mb-8">
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8">
                        <div className="flex items-start justify-between mb-2">
                            <h1 className="text-3xl font-extrabold text-white">{selectedPlan.title}</h1>
                            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                {selectedPlan.budget} Budget
                            </span>
                        </div>
                        <p className="text-white/80 text-lg leading-relaxed">{selectedPlan.description}</p>
                    </div>

                    <div className="p-8 grid md:grid-cols-2 gap-8 bg-gray-900/40">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <ListChecks className="w-4 h-4 text-purple-400" /> Trip Details
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-gray-300 bg-gray-800/50 p-3 rounded-xl border border-gray-700/50">
                                        <MapPin className="w-5 h-5 text-blue-400" />
                                        <div>
                                            <p className="text-xs text-gray-500">Destination</p>
                                            <p className="font-bold">{destination}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-300 bg-gray-800/50 p-3 rounded-xl border border-gray-700/50">
                                        <Calendar className="w-5 h-5 text-purple-400" />
                                        <div>
                                            <p className="text-xs text-gray-500">Duration</p>
                                            <p className="font-bold">{days} Days / {days - 1} Nights</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-300 bg-gray-800/50 p-3 rounded-xl border border-gray-700/50">
                                        <DollarSign className="w-5 h-5 text-green-400" />
                                        <div>
                                            <p className="text-xs text-gray-500">Estimated Cost</p>
                                            <p className="font-bold text-green-400">{selectedPlan.estimatedCost}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Top Highlights</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedPlan.highlights.map((h, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg text-sm border border-gray-700">
                                            ✨ {h}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Itinerary Snapshot</h3>
                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {selectedPlan.days.map((day) => (
                                    <div key={day.day} className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/30">
                                        <p className="text-purple-400 font-bold text-xs mb-1">Day {day.day}</p>
                                        <p className="text-white text-sm font-semibold mb-2">{day.title}</p>
                                        <div className="flex flex-wrap gap-1">
                                            {day.places.slice(0, 2).map((p, i) => (
                                                <span key={i} className="text-[10px] bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded leading-none">
                                                    {p}
                                                </span>
                                            ))}
                                            {day.places.length > 2 && <span className="text-[10px] text-gray-600">+{day.places.length - 2} more</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <button
                        onClick={() => router.push('/inquiry')}
                        className="btn-primary w-full md:w-[400px] flex items-center justify-center gap-3 py-4 text-lg"
                    >
                        Confirm & Finalize Plan
                        <ArrowRight className="w-5 h-5" />
                    </button>
                    <p className="text-gray-500 text-xs text-center max-w-sm">
                        By clicking confirm, we will generate a formal inquiry for your travel Admin to review and contact you with the best prices.
                    </p>
                </div>
            </div>
        </main>
    );
}
