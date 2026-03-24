'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import InquiryTable from '@/components/InquiryTable';
import LoadingSpinner from '@/components/LoadingSpinner';
import { PieChart as LucidePieChart, TrendingUp, Users, Clock, Filter, Search } from 'lucide-react';
import toast from 'react-hot-toast';

import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, Legend 
} from 'recharts';

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

    // --- DATA AGGREGATION FOR CHARTS ---
    const statusCounts = [
        { name: 'Pending', value: inquiries.filter((i: any) => i.status === 'Pending').length, color: '#ff0000ff' },
        { name: 'In Progress', value: inquiries.filter((i: any) => i.status === 'In Progress').length, color: '#60a5fa' },
        { name: 'Completed', value: inquiries.filter((i: any) => i.status === 'Completed').length, color: '#4ade80' },
    ];

    // Improved trend data - last 14 days in chronological order
    const trendData = Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (13 - i)); // Go back 13 days to start from 14 days ago
        const dateLabel = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        const dayKey = d.toLocaleDateString('en-CA'); // 'YYYY-MM-DD' for grouping
        
        const count = inquiries.filter((inq: any) => 
            new Date(inq.createdAt).toLocaleDateString('en-CA') === dayKey
        ).length;

        return { date: dateLabel, count };
    });

    const today = new Date().toLocaleDateString('en-CA'); // 'YYYY-MM-DD'

    const stats = [
        { 
            label: "Today Inquiries", 
            value: inquiries.filter((i: any) => {
                const inqDate = new Date(i.createdAt).toLocaleDateString('en-CA');
                return inqDate === today;
            }).length, 
            icon: TrendingUp, 
            color: 'text-purple-400', 
            bg: 'bg-purple-500/10' ,
            url:"/admin/customers"
        },
        { label: 'Total Inquiries', value: inquiries.length, icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        { 
            label: 'Pending', 
            value: inquiries.filter((i: any) => i.status === 'Pending').length, 
            icon: Clock, 
            color: 'text-red-400', 
            bg: 'bg-yellow-500/10',
            url: "/admin/customers/pending"
        },
        { 
            label: 'In Progress', 
            value: inquiries.filter((i: any) => i.status === 'In Progress').length, 
            icon: Users, 
            color: 'text-blue-400', 
            bg: 'bg-blue-500/10',
            url: "/admin/inprogress"
        },
        { label: 'Success Rate', value: inquiries.length ? `${Math.round((inquiries.filter((i: any) => i.status === 'Completed').length / inquiries.length) * 100)}%` : '0%', icon: LucidePieChart, color: 'text-green-400', bg: 'bg-green-500/10' },
    ];

    return (
        <main className="min-h-screen bg-gray-950 text-white pb-20">
            <Navbar variant="admin" />

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-extrabold flex items-center gap-3">
                            Admin Dashboard <span className="text-purple-500 text-sm font-mono tracking-tighter px-2 py-1 bg-purple-500/10 rounded-lg">CORE V2</span>
                        </h1>
                        <p className="text-gray-500">Managing global inquiries and staff assignments.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Quick search..."
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-purple-500 outline-none transition-all"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                           <div className="relative flex items-center bg-gray-950/50 border border-gray-800 rounded-2xl px-4 py-3 group focus-within:border-purple-500 transition-all">
                            <Filter className="w-4 h-4 text-gray-600 group-focus-within:text-purple-500" />
                            <select
                                className="bg-transparent text-white text-sm outline-none cursor-pointer pl-2 appearance-none pr-8 min-w-[120px]"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                <option value="all" className="bg-gray-950">All Status</option>
                                <option value="Pending" className="bg-gray-950">Pending</option>
                                <option value="In Progress" className="bg-gray-950">In Progress</option>
                                <option value="Completed" className="bg-gray-950">Completed</option>
                            </select>
                            <div className="absolute right-4 pointer-events-none">
                                <Clock className="w-3 h-3 text-gray-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
                    {stats.map((stat: any, i) => (
                        <div 
                            key={i} 
                            onClick={() => stat.url && router.push(stat.url)}
                            className={`glass p-6 rounded-2xl border-gray-800 flex items-center justify-between group hover:border-purple-500/30 transition-all ${stat.url ? 'cursor-pointer hover:-translate-y-1' : ''}`}
                        >
                            <div>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
                                <p className="text-2xl font-black">{stat.value}</p>
                            </div>
                            <div className={`p-4 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* CHARTS SECTION */}
                <div className="grid lg:grid-cols-3 gap-8 mb-10">
                    {/* Inquiry Trend Analysis */}
                    <div className="lg:col-span-2 glass p-6 rounded-3xl border-gray-800 h-[400px] flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-bold flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-purple-400" /> Inquiry Trends
                            </h3>
                            <span className="text-[10px] text-gray-500 px-2 py-1 bg-gray-800 rounded uppercase font-black tracking-widest">Last 14 Days</span>
                        </div>
                        <div className="flex-1 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={trendData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '12px', fontSize: '10px' }}
                                        cursor={{ fill: '#374151', opacity: 0.2 }}
                                    />
                                    <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Status Distribution (Pie) */}
                    <div className="glass p-6 rounded-3xl border-gray-800 h-[400px] flex flex-col">
                        <h3 className="font-bold flex items-center gap-2 mb-8">
                            <LucidePieChart className="w-4 h-4 text-green-400" /> Distribution
                        </h3>
                        <div className="flex-1 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusCounts}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {statusCounts.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '12px', fontSize: '10px' }}
                                    />
                                    <Legend iconType="circle" fontSize={10} wrapperStyle={{ fontSize: '10px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Inquiry Table Section */}
                <div className="glass overflow-hidden rounded-3xl shadow-xl">
                    <div className="bg-gray-800/20 px-6 py-4 border-b border-gray-700/50 flex items-center justify-between">
                        <h3 className="font-bold text-sm">Operation Queue</h3>
                        <div className="flex items-center gap-2">
                             <span className="text-[10px] text-gray-500 px-2 py-0.5 bg-gray-900 rounded-full font-bold">{inquiries.length} Active Tickets</span>
                        </div>
                    </div>
                    <div className="p-2">
                        <InquiryTable inquiries={inquiries} basePath="/admin" />
                    </div>
                </div>
            </div>
        </main>
    );
}
