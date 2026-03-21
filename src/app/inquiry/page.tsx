'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePlanStore } from '@/store/planStore';
import StepIndicator from '@/components/StepIndicator';
import Navbar from '@/components/Navbar';
import { Send, User, Phone, Mail, ShieldCheck, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

import { useSession } from 'next-auth/react';

export default function InquiryPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const { selectedPlan, destination, days, setInquiryId } = usePlanStore();
    const [hasHydrated, setHasHydrated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
    });

    useEffect(() => {
        setHasHydrated(true);
    }, []);

    // AUTO-FILL FOR LOGGED IN CUSTOMERS
    useEffect(() => {
        if (session?.user) {
            setFormData(prev => ({
                ...prev,
                name: prev.name || session.user?.name || '',
                email: prev.email || session.user?.email || '',
            }));
        }
    }, [session]);

    useEffect(() => {
        if (hasHydrated && !selectedPlan) {
            router.push('/');
        }
    }, [hasHydrated, selectedPlan, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    destination,
                    days,
                    selectedPlan,
                }),
            });

            const data = await res.json();
            if (data.inquiryId) {
                setInquiryId(data.inquiryId);
                toast.success('Inquiry submitted successfully!');
                router.push('/inquiry/success');
            } else {
                toast.error(data.error || 'Failed to submit inquiry');
            }
        } catch (error) {
            toast.error('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!selectedPlan) return null;

    return (
        <main className="min-h-screen bg-gray-950 text-white pb-20">
            <Navbar variant="public" />

            <div className="max-w-4xl mx-auto px-6 py-12">
                <StepIndicator currentStep={4} />

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-white mb-4">Almost There!</h1>
                    <p className="text-gray-400 text-lg">
                        Let our travel experts finalize the logistics for your <span className="text-purple-400 font-bold">{destination}</span> trip.
                    </p>
                </div>

                <div className="grid lg:grid-cols-5 gap-12 items-start">
                    {/* Inquiry Form */}
                    <div className="lg:col-span-3 space-y-8">
                        <form onSubmit={handleSubmit} className="glass p-8 rounded-3xl shadow-xl space-y-6">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-400 ml-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 transition-colors group-focus-within:text-purple-500" />
                                        <input
                                            type="text"
                                            placeholder="User Name"
                                            className="input-field pl-12"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-400 ml-1">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                        <input
                                            type="tel"
                                            placeholder="+91 98765-43210"
                                            className="input-field pl-12"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-400 ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                        <input
                                            type="email"
                                            placeholder="User Email"
                                            className="input-field pl-12"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-lg"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        Submit Inquiry
                                    </>
                                )}
                            </button>

                            <div className="flex items-center justify-center gap-2 text-gray-500 text-xs pt-2">
                                <ShieldCheck className="w-4 h-4" />
                                Your data is safe with us. We don't share with 3rd parties.
                            </div>
                        </form>
                    </div>

                    {/* Side Summary/Benefits */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="glass p-6 rounded-2xl border-purple-500/20">
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                <Heart className="w-4 h-4 text-pink-500" /> Why choose us?
                            </h3>
                            <ul className="space-y-4">
                                {[
                                    { title: 'Best Price Guarantee', desc: 'We match or beat any official quote.' },
                                    { title: '24/7 Ground Support', desc: 'Real humans to help you during your trip.' },
                                    { title: 'Flexible Booking', desc: 'Reschedule easily with minimal fees.' },
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-3">
                                        <div className="w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-200">{item.title}</p>
                                            <p className="text-xs text-gray-500">{item.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-gray-800/40 p-6 rounded-2xl border border-gray-700/50">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Plan Summary</h4>
                            <p className="text-white font-bold mb-1">{selectedPlan.title}</p>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-400">{destination} • {days} Days</span>
                                <span className="text-green-400 font-mono tracking-tight">{selectedPlan.estimatedCost}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
