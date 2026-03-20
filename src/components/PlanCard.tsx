'use client';

import { ITravelPlan } from '@/models/Inquiry';
import { CheckCircle, DollarSign, Star, Users, Map, Clock, ArrowRight, ShieldCheck, Gem, Compass } from 'lucide-react';

interface PlanCardProps {
    plan: ITravelPlan;
    isSelected: boolean;
    onSelect: (plan: ITravelPlan) => void;
}

const budgetConfigs = {
    low: { 
        label: 'Budget', 
        color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', 
        icon: <Compass className="w-3 h-3" />, 
        gradient: 'from-emerald-600 to-teal-600' 
    },
    medium: { 
        label: 'Comfort', 
        color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30', 
        icon: <Clock className="w-3 h-3" />, 
        gradient: 'from-indigo-600 to-blue-600' 
    },
    high: { 
        label: 'Luxury', 
        color: 'bg-purple-500/10 text-purple-400 border-purple-500/30', 
        icon: <Gem className="w-3 h-3" />, 
        gradient: 'from-purple-600 to-pink-600' 
    },
};

export default function PlanCard({ plan, isSelected, onSelect }: PlanCardProps) {
    const config = budgetConfigs[plan.budget] || budgetConfigs.medium;

    return (
        <div
            onClick={() => onSelect(plan)}
            className={`group relative rounded-[32px] border-2 cursor-pointer transition-all duration-500 overflow-hidden ${
                isSelected
                    ? 'border-indigo-500/60 bg-[#0a0a0f]/95 shadow-[0_24px_80px_rgba(79,70,229,0.25),inset_0_1px_0_rgba(255,255,255,0.05)] scale-[1.02]'
                    : 'border-white/5 bg-[#0a0a0f]/60 hover:border-white/10 hover:bg-[#0a0a0f]/80 shadow-[0_16px_40px_rgba(0,0,0,0.4)]'
            }`}
        >
            {/* Top Identity Banner */}
            <div className={`h-1.5 w-full bg-gradient-to-r ${config.gradient}`} />

            <div className="p-7">
                {/* Header Row */}
                <div className="flex items-start justify-between mb-2">
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${config.color}`}>
                        {config.icon} {config.label}
                    </span>
                    {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center animate-in zoom-in-50 duration-300">
                             <CheckCircle className="w-4 h-4" />
                        </div>
                    )}
                </div>

                <h3 className="text-xl font-black text-white leading-tight mb-3 group-hover:text-indigo-300 transition-colors uppercase tracking-tight line-clamp-2">
                    {plan.title}
                </h3>

                <p className="text-gray-400 text-sm font-medium leading-relaxed line-clamp-2 mb-6 opacity-70">
                    {plan.description}
                </p>

                {/* Key Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                         <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Est. Cost</div>
                         <div className="text-sm font-black text-emerald-400 tracking-tight">{plan.estimatedCost}</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                         <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">For</div>
                         <div className="text-sm font-black text-indigo-300 tracking-tight line-clamp-1">{plan.bestFor}</div>
                    </div>
                </div>

                {/* Highlights Segment */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-3">
                         <Star className="w-3 h-3 text-yellow-400 fill-current" />
                         <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Premium Experiences</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {plan.highlights.slice(0, 3).map((h, i) => (
                            <span key={i} className="px-3 py-1.5 bg-white/[0.04] border border-white/5 text-gray-400 text-[11px] font-bold rounded-xl flex items-center gap-1.5 hover:bg-white/[0.08] transition-colors">
                                {h}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Itinerary Preview */}
                <div className="relative pt-6 border-t border-white/[0.08]">
                    <div className="flex items-center gap-2 mb-4">
                        <Map className="w-3 h-3 text-indigo-400" />
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Itinerary Peak</span>
                    </div>
                    
                    <div className="space-y-3">
                        {plan.days.slice(0, 2).map((d) => (
                            <div key={d.day} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-indigo-400">
                                        {d.day}
                                    </div>
                                    <div className="w-px flex-1 bg-gradient-to-b from-white/10 to-transparent my-1" />
                                </div>
                                <div className="space-y-1.5 flex-1">
                                    <div className="text-[11px] font-black text-white uppercase tracking-wider line-clamp-1">{d.title}</div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {d.places.slice(0, 2).map((place, pIdx) => (
                                            <span key={pIdx} className="text-[10px] text-gray-500 flex items-center gap-1 bg-white/[0.03] px-2 py-0.5 rounded-lg border border-white/[0.05]">
                                                📍 {place}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {plan.days.length > 2 && (
                        <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                            <ArrowRight className="w-3 h-3" /> and {plan.days.length - 2} more days...
                        </div>
                    )}
                </div>

                {/* Action button (Only visible if NOT selected) */}
                {!isSelected && (
                    <button className="w-full mt-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest text-white transition-all transform active:scale-[0.98]">
                        Select This Path
                    </button>
                )}
            </div>
            
            {/* Background texture overlay */}
            <div className="absolute inset-0 bg-[#0a0a0f] z-[-1] pointer-events-none" />
        </div>
    );
}