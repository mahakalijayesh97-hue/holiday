'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, LayoutDashboard, Users, LogOut, Globe } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

interface NavbarProps {
    variant?: 'public' | 'admin' | 'customer-care';
}

export default function Navbar({ variant = 'public' }: NavbarProps) {
    const pathname = usePathname();
    const { data: session } = useSession();

    const adminLinks = [
        { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/users', label: 'Users', icon: Users },
    ];

    const ccLinks = [{ href: '/customer-care/dashboard', label: 'My Inquiries', icon: LayoutDashboard }];
    const userRole = (session?.user as any)?.role;

    let navLinks = variant === 'admin' ? adminLinks : variant === 'customer-care' ? ccLinks : [];

    // Auto-add dashboard link for logged-in users on the public site
    if (variant === 'public' && session) {
        if (userRole === 'admin') {
            navLinks = [{ href: '/admin/dashboard', label: 'Admin Panel', icon: LayoutDashboard }];
        } else if (userRole === 'customer_care') {
            navLinks = [{ href: '/customer-care/dashboard', label: 'Staff Panel', icon: LayoutDashboard }];
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

                    {session ? (
                        <div className="flex items-center gap-3">
                            <span className="text-gray-400 text-sm hidden sm:block">
                                {session.user?.name} <span className="text-purple-400 capitalize">({userRole?.replace('_', ' ')})</span>
                            </span>
                            <button
                                onClick={() => signOut({ callbackUrl: '/login' })}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:block">Logout</span>
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2"
                        >
                            <Users className="w-4 h-4" />
                            Admin Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
