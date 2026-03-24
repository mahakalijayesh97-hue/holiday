'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { toast } from 'react-hot-toast';
import { User as UserIcon, Mail, Phone, Calendar, ExternalLink, Search, X } from 'lucide-react';
import Link from 'next/link';

interface Customer {
    name: string;
    email: string;
    phone: string;
    totalInquiries: number;
    lastInquiry: string;
}

export default function CustomerManagementPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [customerInquiries, setCustomerInquiries] = useState<any[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    const [registering, setRegistering] = useState<string | null>(null);

    useEffect(() => {
        if (status === 'unauthenticated' || (status === 'authenticated' && (session?.user as any)?.role !== 'admin')) {
            router.push('/login');
        }
    }, [status, session, router]);

    useEffect(() => {
        if (status === 'authenticated' && (session?.user as any)?.role === 'admin') {
            fetchCustomers();
        }
    }, [status, session]);

    const fetchCustomers = async () => {
        try {
            const res = await fetch('/api/inprogress');
            const data = await res.json();
            if (data.customers) setCustomers(data.customers);
        } catch (error) {
            toast.error('Failed to load customers');
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async (customer: Customer) => {
        setSelectedCustomer(customer);
        setHistoryLoading(true);
        try {
            const res = await fetch(`/api/inquiries?search=${encodeURIComponent(customer.email)}`);
            const data = await res.json();
            setCustomerInquiries(data.inquiries || []);
        } catch (error) {
            toast.error('Failed to load inquiry history');
        } finally {
            setHistoryLoading(false);
        }
    };

    const sendRegistrationEmail = async (customer: Customer) => {
        setRegistering(customer.email);
        try {
            const res = await fetch('/api/inprogress/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: customer.name, email: customer.email }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message || 'Credentials sent to customer');
            } else {
                toast.error(data.details || data.error || 'Failed to send registration');
            }
        } catch (error) {
            toast.error('Network error. Try again.');
        } finally {
            setRegistering(null);
        }
    };

    const filteredCustomers = customers.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm)
    );

    return (
        <div className="min-h-screen bg-gray-950 text-white pb-20 overflow-x-hidden">
            <Navbar variant="admin" />

            <main className="max-w-7xl mx-auto px-4 pt-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                            In Progress Data
                        </h1>
                        <p className="text-gray-400 mt-2">People who have submitted holiday inquiries</p>
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-purple-500 transition-all outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {status === 'loading' || loading ? (
                    <LoadingSpinner text="Analyzing customer directory..." />
                ) : filteredCustomers.length === 0 ? (
                    <div className="text-center py-20 bg-gray-900/30 border border-dashed border-gray-800 rounded-3xl">
                        <UserIcon className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-400">No customers found</h2>
                        <p className="text-gray-600 mt-2">{searchTerm ? 'Try a different search term' : 'No inquiry data available yet'}</p>
                    </div>
                ) : (
                    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-2xl animate-fade-in relative z-10">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-[1000px]">
                                <thead className="bg-gray-800/50 text-gray-400 text-[10px] uppercase font-bold tracking-widest border-b border-gray-800">
                                    <tr>
                                        <th className="px-6 py-4">Customer</th>
                                        <th className="px-6 py-4">Contact Info</th>
                                        <th className="px-6 py-4 text-center">Inquiries</th>
                                        <th className="px-6 py-4">Last Activity</th>
                                        <th className="px-6 py-4 text-right">Records</th>
                                        {/* <th className="px-6 py-4 text-right">Email</th> */}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {filteredCustomers.map((customer) => (
                                        <tr key={customer.email} className="hover:bg-purple-600/5 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/20 flex items-center justify-center font-bold text-purple-400 capitalize">
                                                        {customer.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-100 group-hover:text-purple-300 transition-colors uppercase text-xs tracking-tight">{customer.name}</div>
                                                        <div className="text-[11px] text-gray-500">{customer.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-400">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2"><Mail className="w-3 h-3 opacity-40" /> {customer.email}</div>
                                                    <div className="flex items-center gap-2"><Phone className="w-3 h-3 opacity-40" /> {customer.phone}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 border border-gray-700 text-sm font-black text-gray-300">
                                                    {customer.totalInquiries}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                                    <Calendar className="w-3 h-3 opacity-40 text-purple-400" />
                                                    {new Date(customer.lastInquiry).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => fetchHistory(customer)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-purple-600 border border-gray-700 hover:border-purple-500 rounded-xl text-xs font-bold transition-all"
                                                >
                                                    View History <ExternalLink className="w-3 h-3" />
                                                </button>
                                            </td>
                                            {/* <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => sendRegistrationEmail(customer)}
                                                    disabled={registering === customer.email}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600/10 hover:bg-emerald-600 border border-emerald-500/20 hover:border-emerald-500 rounded-xl text-xs font-bold transition-all text-emerald-400 hover:text-white disabled:opacity-50 disabled:pointer-events-none"
                                                >
                                                    {registering === customer.email ? 'Sending...' : 'Send Login'} 
                                                    <Mail className={`w-3 h-3 ${registering === customer.email ? 'animate-pulse' : ''}`} />
                                                </button>
                                            </td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            {/* History Flyout/Modal */}
            {selectedCustomer && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedCustomer(null)} />
                    <div className="relative w-full max-w-2xl bg-gray-950 border-l border-gray-800 h-screen overflow-y-auto shadow-2xl flex flex-col animate-slide-left">
                        <div className="p-8 border-b border-gray-800 bg-gray-900/50 flex items-center justify-between sticky top-0 z-20 backdrop-blur-xl">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-xl">
                                    {selectedCustomer.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{selectedCustomer.name}</h2>
                                    <p className="text-xs text-gray-500 tracking-widest uppercase font-black">{selectedCustomer.email}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setSelectedCustomer(null)}
                                className="p-2 hover:bg-gray-800 rounded-xl transition-all"
                            >
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-8 space-y-8 flex-1">
                            {historyLoading ? (
                                <LoadingSpinner text="Compiling history log..." />
                            ) : customerInquiries.length === 0 ? (
                                <div className="text-center py-20">
                                    <Calendar className="w-12 h-12 text-gray-800 mx-auto mb-4" />
                                    <p className="text-gray-500 font-bold">No inquiry history found</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest">Inquiry History</h3>
                                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-600/10 text-purple-400 font-bold border border-purple-500/20">{customerInquiries.length} Sessions</span>
                                    </div>
                                    
                                    {customerInquiries.map((inq: any) => (
                                        <div key={inq._id} className="group relative bg-gray-900/50 border border-gray-800 rounded-3xl p-6 transition-all hover:bg-gray-900/80 border-l-4 border-l-purple-600">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <span className="text-[10px] font-mono text-gray-500 mb-1 block uppercase tracking-tighter">{inq.inquiryId}</span>
                                                    <h4 className="font-bold text-lg text-gray-200">{inq.destination}</h4>
                                                    <div className="flex gap-2 mt-2">
                                                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${
                                                            inq.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' :
                                                            inq.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400' : 'bg-yellow-500/10 text-yellow-500'
                                                        }`}>
                                                            {inq.status}
                                                        </span>
                                                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-500 font-bold uppercase">{inq.days} Days</span>
                                                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-500 font-bold uppercase">{inq.selectedPlan.budget} Budget</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-500">{new Date(inq.createdAt).toLocaleDateString()}</p>
                                                    <Link 
                                                        href={`/admin/inquiry/${inq._id}`}
                                                        className="mt-4 inline-flex items-center gap-1 text-[10px] font-black text-purple-400 hover:text-purple-300 uppercase tracking-widest"
                                                    >
                                                        Details <ExternalLink className="w-3 h-3" />
                                                    </Link>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-gray-950/50 rounded-2xl p-4 border border-gray-800/30">
                                                <p className="text-xs font-bold text-gray-300 mb-1">{inq.selectedPlan.title}</p>
                                                <p className="text-[11px] text-gray-500 line-clamp-2 italic">"{inq.selectedPlan.description}"</p>
                                                <div className="mt-3 text-[10px] font-mono text-emerald-500/80 bg-emerald-500/5 w-fit px-2 py-0.5 rounded">
                                                    EST: {inq.selectedPlan.estimatedCost}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
