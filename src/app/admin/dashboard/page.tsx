'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import InquiryTable from '@/components/InquiryTable';
import LoadingSpinner from '@/components/LoadingSpinner';
import { PieChart, TrendingUp, Users, Clock, Filter, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (status === 'unauthenticated' || (session?.user as any)?.role !== 'admin') {
            router.push('/login');
        }
    }, [status, session, router]);

    useEffect(() => {
        const fetchInquiries = async () => {
            try {
                let url = `/api/inquiries?status=${filter}`;
                if (filter === 'all') url = '/api/inquiries?';
                if (search) url += `&search=${encodeURIComponent(search)}`;

                const res = await fetch(url);
                const data = await res.json();
                setInquiries(data.inquiries || []);
            } catch (error) {
                toast.error('Failed to load inquiries');
            } finally {
                setLoading(false);
            }
        };

        if (status === 'authenticated') fetchInquiries();
    }, [filter, search, status]);

    if (status === 'loading' || loading) return <LoadingSpinner text="Accessing core systems..." />;

    const stats = [
        { label: 'Total Inquiries', value: inquiries.length, icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        { label: 'Pending', value: inquiries.filter((i: any) => i.status === 'Pending').length, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
        { label: 'In Progress', value: inquiries.filter((i: any) => i.status === 'In Progress').length, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { label: 'Success Rate', value: inquiries.length ? `${Math.round((inquiries.filter((i: any) => i.status === 'Completed').length / inquiries.length) * 100)}%` : '0%', icon: PieChart, color: 'text-green-400', bg: 'bg-green-500/10' },
    ];

    return (
        <main className="min-h-screen bg-gray-950 text-white">
            <Navbar variant="admin" />

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-extrabold">Admin Dashboard</h1>
                        <p className="text-gray-500">Managing global inquiries and travel Admin assignments.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search customer ID or name..."
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-purple-500 outline-none transition-all"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 focus-within:border-purple-500 transition-all">
                            <Filter className="w-4 h-4 text-gray-500" />
                            <select
                                className="bg-gray-900 text-white text-sm focus:outline-none cursor-pointer"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                <option value="all" className="bg-gray-900 text-white">All Status</option>
                                <option value="Pending" className="bg-gray-900 text-white">Pending</option>
                                <option value="In Progress" className="bg-gray-900 text-white">In Progress</option>
                                <option value="Completed" className="bg-gray-900 text-white">Completed</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {stats.map((stat, i) => (
                        <div key={i} className="glass p-6 rounded-2xl border-gray-800 flex items-center gap-4 transition-transform hover:scale-105">
                            <div className={`p-4 rounded-xl ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-2xl font-black">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Inquiry Table Section */}
                <div className="glass overflow-hidden rounded-2xl shadow-xl">
                    <div className="bg-gray-800/50 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
                        <h3 className="font-bold">Recent Inquiries</h3>
                        <span className="text-xs text-gray-500">{inquiries.length} results found</span>
                    </div>
                    <div className="p-2">
                        <InquiryTable inquiries={inquiries} basePath="/admin" />
                    </div>
                </div>
            </div>
        </main>
    );
}
