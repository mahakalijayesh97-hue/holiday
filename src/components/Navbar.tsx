'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, LayoutDashboard, Users, LogOut, Globe, Shield, ChevronDown } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

interface NavbarProps {
    variant?: 'public' | 'admin' | 'customer-care' | 'customer';
}

export default function Navbar({ variant = 'public' }: NavbarProps) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const adminLinks = [
        { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/customers', label: 'Customers', icon: Users },
        { href: '/admin/users', label: 'Staff', icon: Shield },
    ];

    const ccLinks = [{ href: '/customer-care/dashboard', label: 'My Inquiries', icon: LayoutDashboard }];
    const customerLinks = [{ href: '/customer/dashboard', label: 'My Trips', icon: LayoutDashboard }];
    
    const userRole = (session?.user as any)?.role;

    let navLinks: any[] = [];
    if (variant === 'admin') navLinks = adminLinks;
    else if (variant === 'customer-care') navLinks = ccLinks;
    else if (variant === 'customer') navLinks = customerLinks;

    // Auto-add dashboard link for logged-in users on the public site
    if (variant === 'public' && session) {
        if (userRole === 'admin') {
            navLinks = [{ href: '/admin/dashboard', label: 'Admin Panel', icon: LayoutDashboard }];
        } else if (userRole === 'customer_care') {
            navLinks = [{ href: '/customer-care/dashboard', label: 'Staff Panel', icon: LayoutDashboard }];
        } else if (userRole === 'customer') {
            navLinks = [{ href: '/customer/dashboard', label: 'My Trips', icon: LayoutDashboard }];
        }
    }

    return (
        <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Globe className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white font-bold text-lg">
                        Travel<span className="text-purple-400">Planner</span>
                    </span>
                </Link>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-4">
                        {navLinks.map(({ href, label, icon: Icon }) => (
                            <Link
                                key={href}
                                href={href}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${pathname === href
                                        ? 'bg-purple-600 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </Link>
                        ))}
                    </div>

                    {session ? (
                        <div className="relative">
                            <button 
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center gap-2 group hover:bg-gray-800 px-3 py-1.5 rounded-2xl transition-all"
                            >
                                <div className="w-8 h-8 rounded-full border-2 border-purple-500/30 overflow-hidden relative group-hover:border-purple-500 transition-all shadow-lg">
                                    <img 
                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(session.user?.name || 'U')}&background=581c87&color=fff&bold=true`} 
                                        alt="Avatar" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex flex-col -space-y-1 text-left hidden sm:flex">
                                    <span className="text-white text-[11px] font-black uppercase tracking-tighter">
                                        {session.user?.name}
                                    </span>
                                    <span className="text-purple-400 text-[9px] font-bold capitalize">
                                        {userRole?.replace('_', ' ')}
                                    </span>
                                </div>
                                <ChevronDown className={`w-3 h-3 text-gray-500 group-hover:text-purple-500 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                            </button>

                            {/* DROPDOWN MENU */}
                            {showProfileMenu && (
                                <>
                                    <div className="fixed inset-0 z-[60]" onClick={() => setShowProfileMenu(false)}></div>
                                    <div className="absolute right-0 mt-3 w-56 bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl z-[70] overflow-hidden backdrop-blur-3xl">
                                        <div className="p-4 border-b border-gray-800 bg-purple-500/5">
                                            <p className="text-xs font-black text-white uppercase tracking-widest">{session.user?.name}</p>
                                            <p className="text-[10px] text-gray-500 lowercase">{session.user?.email}</p>
                                        </div>
                                        <div className="p-2">
                                            <button
                                                onClick={() => signOut({ callbackUrl: '/login' })}
                                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all font-bold group"
                                            >
                                                <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2"
                        >
                            <Users className="w-4 h-4" />
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
