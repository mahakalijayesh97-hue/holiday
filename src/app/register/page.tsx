'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Lock, Mail, User, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        email: searchParams.get('email') || '',
        name: searchParams.get('name') || '',
        password: '',
        confirmPassword: ''
    });

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return toast.error('Passwords do not match');
        }
        if (formData.password.length < 6) {
            return toast.error('Password must be at least 6 characters');
        }

        setLoading(true);
        try {
            const res = await fetch('/api/customers/complete-registration', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess(true);
                toast.success('Registration complete!');
                setTimeout(() => router.push('/login'), 3000);
            } else {
                toast.error(data.error || 'Registration failed');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-3xl font-black">Registration Complete!</h2>
                <p className="text-gray-400">Your account is ready. Redirecting you to login...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleRegister} className="glass p-8 rounded-3xl shadow-2xl space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-400 ml-1">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input
                            type="text"
                            className="input-field pl-12 bg-gray-900/50"
                            required
                            value={formData.name}
                            readOnly={!!searchParams.get('name')}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-400 ml-1">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input
                            type="email"
                            className="input-field pl-12 bg-gray-900/50"
                            required
                            readOnly
                            value={formData.email}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-400 ml-1">Create Password</label>
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

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-400 ml-1">Confirm Password</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="input-field pl-12"
                            required
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-3 py-3.5"
            >
                {loading ? 'Processing...' : 'Complete Registration'}
            </button>
        </form>
    );
}

export default function RegisterPage() {
    return (
        <main className="min-h-screen bg-gray-950 text-white flex flex-col">
            <Navbar variant="public" />

            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-md animate-fade-in">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-extrabold mb-2 text-purple-400">Join the Adventure</h1>
                        <p className="text-gray-500">Secure your account to access your holiday plans.</p>
                    </div>

                    <Suspense fallback={<div className="text-center">Loading form...</div>}>
                        <RegisterForm />
                    </Suspense>
                </div>
            </div>
        </main>
    );
}
