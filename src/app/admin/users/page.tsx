'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { toast } from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Check, Shield, User as UserIcon } from 'lucide-react';

interface User {
    _id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    role: 'admin' | 'customer_care';
    assignedLocations?: string[];
    assignedAreas?: string[];
    isAvailable?: number;
    createdAt: string;
}

export default function UserManagementPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({ name: '', email: '', phoneNumber: '', password: '', role: 'customer_care', assignedLocations: [] as string[], assignedAreas: [] as string[] });
    const [submitting, setSubmitting] = useState(false);
    const [availableDestinations, setAvailableDestinations] = useState<any[]>([]);

    useEffect(() => {
        if (status === 'unauthenticated' || (status === 'authenticated' && (session?.user as any)?.role !== 'admin')) {
            router.push('/login');
        }
    }, [status, session, router]);

    useEffect(() => {
        if (status === 'authenticated' && (session?.user as any)?.role === 'admin') {
            fetchUsers();
            fetchDestinations();
        }
    }, [status, session]);

    const fetchDestinations = async () => {
        try {
            const res = await fetch('/api/destinations');
            const data = await res.json();
            if (data.destinations) setAvailableDestinations(data.destinations);
        } catch (error) {
            console.error('Failed to load destinations');
        }
    };

    const uniqueLocations = Array.from(new Set(availableDestinations.map(d => d.displayName))).sort();
    const uniqueAreas = Array.from(new Set(availableDestinations.map(d => d.region || d.type).filter(Boolean))).sort();

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users');
            const data = await res.json();
            if (data.users) setUsers(data.users);
        } catch (error) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const url = editingUser ? `/api/users/${editingUser._id}` : '/api/users';
            const method = editingUser ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success(editingUser ? 'User updated' : 'User created');
                setIsModalOpen(false);
                setEditingUser(null);
                setFormData({ name: '', email: '', phoneNumber: '', password: '', role: 'customer_care', assignedLocations: [], assignedAreas: [] });
                fetchUsers();
            } else {
                toast.error(data.error || 'Operation failed');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('User deleted');
                fetchUsers();
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to delete user');
            }
        } catch (error) {
            toast.error('Failed to delete user');
        }
    };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber || '',
            password: '',
            role: user.role,
            assignedLocations: user.assignedLocations || [],
            assignedAreas: user.assignedAreas || []
        });
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white pb-20">
            <Navbar variant="admin" />

            <main className="max-w-7xl mx-auto px-4 pt-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                            User Management
                        </h1>
                        <p className="text-gray-400 mt-2">Manage staff accounts and permissions</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingUser(null);
                            setFormData({ name: '', email: '', phoneNumber: '', password: '', role: 'customer_care', assignedLocations: [], assignedAreas: [] });
                            setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold shadow-lg shadow-purple-900/20 hover:scale-105 transition-all"
                    >
                        <Plus className="w-5 h-5" /> Add New Staff
                    </button>
                </div>

                {status === 'loading' || loading ? (
                    <LoadingSpinner text="Fetching staff users..." />
                ) : (
                    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden backdrop-blur-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-[800px]">
                                <thead className="bg-gray-800/50 text-gray-400 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">Staff Member</th>
                                        <th className="px-6 py-4 font-semibold">Role</th>
                                        <th className="px-6 py-4 font-semibold">Phone Number</th>
                                        <th className="px-6 py-4 font-semibold">Created</th>
                                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {users.map((user) => (
                                        <tr key={user._id} className="hover:bg-gray-800/30 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
                                                        <UserIcon className="w-5 h-5 text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-100">{user.name}</div>
                                                        <div className="text-sm text-gray-500">{user.email}</div>
                                                        {user.role === 'customer_care' && (
                                                            <div className="mt-2 flex flex-wrap gap-1 max-w-xs">
                                                                {(user.assignedLocations || []).map(loc => (
                                                                    <span key={loc} className="text-[9px] font-bold uppercase tracking-tight bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-md">
                                                                        📍 {loc}
                                                                    </span>
                                                                ))}
                                                                {(user.assignedAreas || []).map(area => (
                                                                    <span key={area} className="text-[9px] font-bold uppercase tracking-tight bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-md">
                                                                        🌐 {area}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${user.role === 'admin'
                                                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                                    : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                    }`}>
                                                    <Shield className="w-3 h-3" />
                                                    {user.role === 'admin' ? 'Administrator' : 'Customer Care'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-sm text-gray-400">
                                                {user.phoneNumber || '-'}
                                            </td>
                                            <td className="px-6 py-5 text-sm text-gray-400">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => openEditModal(user)}
                                                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user._id)}
                                                        className="p-2 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="bg-gray-900 border border-gray-700 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in max-h-[90vh] flex flex-col">
                        <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-gradient-to-r from-gray-800 to-gray-900 shrink-0">
                            <h2 className="text-xl font-bold">{editingUser ? 'Edit Staff Member' : 'Add New Staff'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                    placeholder="User Name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5">Email Address</label>
                                <input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                    placeholder="User Email"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                                    {editingUser ? 'Change Password (Leave blank to keep current)' : 'Password'}
                                </label>
                                <input
                                    required={!editingUser}
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5">Phone Number</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                    placeholder="Phone Number"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5">Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none transition-all appearance-none text-white"
                                >
                                    <option value="customer_care" className="bg-gray-800 text-white">Customer Care</option>
                                    <option value="admin" className="bg-gray-800 text-white">Administrator</option>
                                </select>
                            </div>
                            {formData.role === 'customer_care' && (
                                <div className="space-y-4 border-t border-gray-800 pt-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 mb-1.5">Assign Locations (Destinations)</label>
                                        <div className="bg-gray-950 border border-gray-800 rounded-xl p-3 max-h-32 overflow-y-auto grid grid-cols-2 gap-1.5 custom-scrollbar">
                                            {uniqueLocations.length === 0 && <span className="col-span-2 text-xs text-gray-600 italic">No locations found</span>}
                                            {uniqueLocations.map(loc => {
                                                const checked = formData.assignedLocations.includes(loc);
                                                return (
                                                    <label key={loc} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg border text-[10px] cursor-pointer select-none transition-all ${checked
                                                            ? 'bg-purple-600/20 border-purple-500 text-white font-bold'
                                                            : 'bg-gray-900 border-gray-800 text-gray-400 hover:bg-gray-800 hover:text-white'
                                                        }`}>
                                                        <input
                                                            type="checkbox"
                                                            className="hidden"
                                                            checked={checked}
                                                            onChange={(e) => {
                                                                const next = e.target.checked
                                                                    ? [...formData.assignedLocations, loc]
                                                                    : formData.assignedLocations.filter(x => x !== loc);
                                                                setFormData(prev => ({ ...prev, assignedLocations: next }));
                                                            }}
                                                        />
                                                        {loc}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 mb-1.5">Assign Areas (Regions / Types)</label>
                                        <div className="bg-gray-950 border border-gray-800 rounded-xl p-3 max-h-32 overflow-y-auto grid grid-cols-2 gap-1.5 custom-scrollbar">
                                            {uniqueAreas.length === 0 && <span className="col-span-2 text-xs text-gray-600 italic">No areas found</span>}
                                            {uniqueAreas.map(area => {
                                                const checked = formData.assignedAreas.includes(area);
                                                return (
                                                    <label key={area} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg border text-[10px] cursor-pointer select-none transition-all ${checked
                                                            ? 'bg-blue-600/20 border-blue-500 text-white font-bold'
                                                            : 'bg-gray-900 border-gray-800 text-gray-400 hover:bg-gray-800 hover:text-white'
                                                        }`}>
                                                        <input
                                                            type="checkbox"
                                                            className="hidden"
                                                            checked={checked}
                                                            onChange={(e) => {
                                                                const next = e.target.checked
                                                                    ? [...formData.assignedAreas, area]
                                                                    : formData.assignedAreas.filter(x => x !== area);
                                                                setFormData(prev => ({ ...prev, assignedAreas: next }));
                                                            }}
                                                        />
                                                        {area}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 bg-gray-800 rounded-xl font-bold hover:bg-gray-700 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold shadow-lg shadow-purple-900/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {submitting ? 'Saving...' : editingUser ? 'Update User' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
