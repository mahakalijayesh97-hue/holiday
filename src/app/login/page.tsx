'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { LogIn, Mail, Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '', captchaAnswer: '' });
    const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, expected: 0 });

    // Generate new captcha on mount or failed attempt
    const generateCaptcha = () => {
        const n1 = Math.floor(Math.random() * 10) + 1;
        const n2 = Math.floor(Math.random() * 10) + 1;
        setCaptcha({ num1: n1, num2: n2, expected: n1 + n2 });
        setFormData(prev => ({ ...prev, captchaAnswer: '' }));
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    useEffect(() => {
        if (status === 'authenticated') {
            const role = (session?.user as any)?.role;
            if (role === 'admin') router.push('/admin/dashboard');
            else if (role === 'customer_care') router.push('/customer-care/dashboard');
            else if (role === 'customer') router.push('/customer/dashboard');
        }
    }, [status, session, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check Captcha
        if (parseInt(formData.captchaAnswer) !== captcha.expected) {
            toast.error('Incorrect captcha answer. Try again.');
            generateCaptcha();
            return;
        }

        setLoading(true);

        try {
            const res = await signIn('credentials', {
                redirect: false,
                email: formData.email,
                password: formData.password,
            });

            if (res?.error) {
                toast.error('Invalid email or password');
                generateCaptcha(); // Generate new on failure
            } else {
                toast.success('Logged in successfully');
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
            generateCaptcha();
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-950 text-white flex flex-col">
            <Navbar variant="public" />

            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-md animate-fade-in">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-purple-500/20">
                            <ShieldCheck className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-extrabold mb-2">User Portal</h1>
                        <p className="text-gray-500">Log in to manage your inquiries or track your trips.</p>
                    </div>

                    <form onSubmit={handleLogin} className="glass p-8 rounded-3xl shadow-2xl space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-400 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        className="input-field pl-12"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-400 ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="input-field pl-12"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Mathematical Captcha */}
                            <div className="space-y-2 pt-2 border-t border-gray-800">
                                <div className="flex items-center justify-between ml-1 mb-1">
                                    <label className="text-sm font-semibold text-gray-400">Security Check</label>
                                    <span className="text-xs text-purple-400">Prove you are human</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-center font-bold text-lg text-white">
                                        {captcha.num1} + {captcha.num2} = ?
                                    </div>
                                    <input
                                        type="number"
                                        placeholder="Ans"
                                        className="w-24 input-field text-center py-3"
                                        required
                                        value={formData.captchaAnswer}
                                        onChange={(e) => setFormData({ ...formData, captchaAnswer: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-3 py-3.5"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    Sign In to Dashboard
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
