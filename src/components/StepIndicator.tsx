'use client';

import { Check, Hexagon } from 'lucide-react';

interface StepIndicatorProps {
    currentStep: number;
}

const steps = [
    { number: 1, label: 'Destination', sub: 'Where to?' },
    { number: 2, label: 'Choose Plan', sub: 'Your vibe' },
    { number: 3, label: 'Confirm', sub: 'Lock it in' },
    { number: 4, label: 'Inquiry', sub: 'Sent!' },
];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
    return (
        <div className="flex items-center justify-center py-8 px-4 w-full max-w-4xl mx-auto">
            {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center group relative">
                        {/* Step Icon Container */}
                        <div className="relative">
                            {step.number < currentStep ? (
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-500">
                                    <Check className="w-6 h-6 stroke-[3]" />
                                </div>
                            ) : step.number === currentStep ? (
                                <div className="w-14 h-14 rounded-[20px] bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-[0_0_30px_rgba(79,70,229,0.5)] scale-110 z-10 transition-all duration-500 relative overflow-hidden">
                                     <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                     <span className="relative z-10 text-lg font-black">{step.number}</span>
                                </div>
                            ) : (
                                <div className="w-10 h-10 rounded-xl bg-white/[0.03] border-2 border-white/5 flex items-center justify-center text-gray-500 transition-all duration-300 group-hover:border-white/20">
                                    <span className="text-sm font-bold">{step.number}</span>
                                </div>
                            )}
                        </div>

                        {/* Labels */}
                        <div className="absolute top-full mt-4 flex flex-col items-center min-w-[max-content]">
                             <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${
                                 step.number === currentStep ? 'text-indigo-400' : step.number < currentStep ? 'text-emerald-400/80' : 'text-gray-600'
                             }`}>
                                 {step.label}
                             </span>
                        </div>
                    </div>

                    {/* Dynamic Connection Line */}
                    {index < steps.length - 1 && (
                        <div className="flex-1 mx-4 h-[2px] bg-white/5 relative overflow-hidden rounded-full">
                            <div 
                                className={`absolute inset-0 bg-gradient-to-r from-emerald-500 to-indigo-500 transition-transform duration-1000 origin-left ${
                                    step.number < currentStep ? 'scale-x-100' : 'scale-x-0'
                                }`} 
                            />
                            {step.number === currentStep - 1 && (
                                 <div className="absolute inset-x-0 h-full bg-indigo-500 animate-shimmer" 
                                      style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)', backgroundSize: '200% 100%' }} />
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
