'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePlanStore } from '@/store/planStore';
import StepIndicator from '@/components/StepIndicator';
import { ITravelPlan } from '@/models/Inquiry';
import Navbar from '@/components/Navbar';
import PlanCard from '@/components/PlanCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ArrowLeft, Sparkles, Map, Info, Compass, CheckCircle2, ArrowRight, MapPin, Gem } from 'lucide-react';

export default function PlansPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const destination = searchParams.get('destination') || '';
    const days = searchParams.get('days') || '1';
    const budget = searchParams.get('budget') || 'medium';

    const { selectedPlan, setSelectedPlan } = usePlanStore(); 

    const [plans, setPlans] = useState<ITravelPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasHydrated, setHasHydrated] = useState(false);
    const [masterData, setMasterData] = useState<any>(null);
    
    useEffect(() => {
        setHasHydrated(true);
    }, []);

    useEffect(() => {
        const fetchEverything = async () => {
            if (!destination) {
                setLoading(false); 
                router.replace('/');
                return;
            }
            setLoading(true);
            try {
                // Fetch registry info for context
                const masterRes = await fetch(`/api/destinations?name=${encodeURIComponent(destination)}`);
                const masterJson = await masterRes.json();
                if (masterJson.destinations?.length > 0) setMasterData(masterJson.destinations[0]);

                // Generate plans (will be DB-driven if possible)
                const res = await fetch('/api/plans/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ destination, days, budget }),
                });
                const data = await res.json();
                if (data.plans) setPlans(data.plans);
            } catch (err) {
                console.error("Error fetching data:", err);
                setPlans([]);
            } finally {
                setLoading(false);
            }
        };

        if (hasHydrated) fetchEverything();
    }, [hasHydrated, destination, days, budget]);

    useEffect(() => {
        if (hasHydrated && plans.length === 0 && !loading && destination) {
            router.push('/');
        }
    }, [hasHydrated, plans, loading, router, destination]);

    if (!hasHydrated || loading) return <LoadingSpinner text="Gathering itineraries..." />;

    const handleConfirmSelection = () => {
        if (selectedPlan) {
            router.push('/confirmation');
        }
    };

    return (
        <div className="min-h-screen bg-[#05050a] text-white selection:bg-indigo-500/30 overflow-x-hidden">
            <Navbar variant="public" />
            
            {/* Cinematic Background Blobs */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 blur-[100px] rounded-full" />
            </div>

            <main className="relative z-10 max-w-7xl mx-auto px-6 pb-24 pt-32">
                <StepIndicator currentStep={2} />

                {/* Header Section */}
                <div className="mt-12 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="space-y-4">
                        <button
                            onClick={() => router.back()}
                            className="group flex items-center gap-2 text-gray-500 hover:text-indigo-400 transition-all font-bold text-xs uppercase tracking-widest"
                        >
                            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Modify Trip
                        </button>
                        
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                               <Compass className="w-6 h-6" />
                           </div>
                           <div>
                               <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                                   Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{destination}</span>
                               </h1>
                               <div className="flex items-center gap-3 mt-1">
                                    <p className="text-gray-500 font-medium">Found 5 tailored paths for your adventure.</p>
                                    {masterData && (
                                        <>
                                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/30" />
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                                                <MapPin className="w-3 h-3 text-indigo-400" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">
                                                    {masterData.district}, {masterData.region}
                                                </span>
                                            </div>
                                        </>
                                    )}
                               </div>
                           </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                        <div className="flex items-center gap-6 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
                            {masterData && (
                                <div className="flex items-center gap-2 mr-2">
                                    <Sparkles className="w-3 h-3 text-amber-400" />
                                    <span className="text-[10px] font-black uppercase tracking-tighter text-amber-400/80">Premium Registry Data</span>
                                </div>
                            )}
                           <div className="text-center">
                               <div className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Duration</div>
                               <div className="text-sm font-bold">{days} Days</div>
                           </div>
                           <div className="w-px h-8 bg-white/10" />
                           <div className="text-center">
                               <div className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Budget</div>
                               <div className="text-sm font-bold capitalize">{budget}</div>
                           </div>
                        </div>
                    </div>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
                    {plans.map((plan: ITravelPlan, idx: number) => (
                        <div key={plan.id} style={{ animationDelay: `${idx * 100}ms` }} className="animate-in fade-in zoom-in-95 fill-mode-both">
                            <PlanCard
                                plan={plan}
                                isSelected={selectedPlan?.id === plan.id}
                                onSelect={setSelectedPlan}
                            />
                        </div>
                    ))}
                </div>

                {/* Floating Confirmation Bar */}
                {selectedPlan && (
                    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-50 animate-in slide-in-from-bottom-20 duration-500">
                        <div className="p-4 bg-[#0a0a0f]/90 border border-indigo-500/30 backdrop-blur-2xl rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.8)] flex items-center justify-between gap-6">
                            <div className="flex items-center gap-4 pl-2">
                                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black uppercase text-indigo-400/80 tracking-widest leading-none mb-1">Trip Selected</div>
                                    <div className="text-sm font-black line-clamp-1">{selectedPlan.title}</div>
                                </div>
                            </div>
                            
                            <button
                                onClick={handleConfirmSelection}
                                className="group px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 transition-all flex items-center gap-2"
                            >
                                Secure My Spot <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
