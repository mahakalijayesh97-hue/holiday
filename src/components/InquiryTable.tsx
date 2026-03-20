'use client';

import Link from 'next/link';
import StatusBadge from './StatusBadge';
import { MapPin, Calendar, User, ExternalLink } from 'lucide-react';

interface Inquiry {
    _id: string;
    inquiryId: string;
    name: string;
    email: string;
    phone: string;
    destination: string;
    days: number;
    selectedPlan: { title: string; budget: string };
    status: string;
    assignedTo?: { name: string; email: string } | null;
    createdAt: string;
}

interface InquiryTableProps {
    inquiries: Inquiry[];
    basePath: string; // '/admin' or '/customer-care'
}

export default function InquiryTable({ inquiries, basePath }: InquiryTableProps) {
    if (inquiries.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-gray-600" />
                </div>
                <p className="text-gray-500 text-lg">No inquiries found</p>
            </div>
        );
    }

    const budgetColor: Record<string, string> = {
        low: 'text-green-400',
        medium: 'text-yellow-400',
        high: 'text-purple-400',
    };

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-700">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-gray-800/80 text-gray-400 uppercase text-xs tracking-wider">
                        <th className="px-4 py-3 text-left">Inquiry ID</th>
                        <th className="px-4 py-3 text-left">Customer</th>
                        <th className="px-4 py-3 text-left">Destination</th>
                        <th className="px-4 py-3 text-left">Plan</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Assigned To</th>
                        <th className="px-4 py-3 text-left">Date</th>
                        <th className="px-4 py-3 text-left">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                    {inquiries.map((inq) => (
                        <tr key={inq._id} className="hover:bg-gray-800/40 transition-colors group">
                            <td className="px-4 py-3">
                                <span className="font-mono text-purple-400 text-xs bg-purple-900/20 px-2 py-0.5 rounded">
                                    {inq.inquiryId}
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                        {inq.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{inq.name}</p>
                                        <p className="text-gray-500 text-xs">{inq.email}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                                    <div>
                                        <p className="text-white">{inq.destination}</p>
                                        <p className="text-gray-500 text-xs flex items-center gap-1">
                                            <Calendar className="w-3 h-3" /> {inq.days} days
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <p className="text-gray-300 max-w-[160px] truncate">{inq.selectedPlan?.title}</p>
                                <span className={`text-xs font-semibold capitalize ${budgetColor[inq.selectedPlan?.budget] ?? 'text-gray-400'}`}>
                                    {inq.selectedPlan?.budget} budget
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                <StatusBadge status={inq.status} />
                            </td>
                            <td className="px-4 py-3">
                                {inq.assignedTo ? (
                                    <div className="flex items-center gap-1.5">
                                        <User className="w-3.5 h-3.5 text-gray-400" />
                                        <span className="text-gray-300 text-xs">{inq.assignedTo.name}</span>
                                    </div>
                                ) : (
                                    <span className="text-gray-600 text-xs">Unassigned</span>
                                )}
                            </td>
                            <td className="px-4 py-3">
                                <span className="text-gray-400 text-xs">
                                    {new Date(inq.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                <Link
                                    href={`${basePath}/inquiry/${inq._id}`}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 hover:bg-purple-600 text-gray-300 hover:text-white rounded-lg text-xs font-medium transition-all"
                                >
                                    View <ExternalLink className="w-3 h-3" />
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
