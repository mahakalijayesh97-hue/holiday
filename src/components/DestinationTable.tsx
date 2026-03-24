'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Edit2, Trash2, Globe, Mountain } from 'lucide-react';
import toast from 'react-hot-toast';

interface Destination {
  _id: string;
  name: string;
  displayName: string;
  district?: string;
  region?: string;
  type: string;
  morning: string;
  afternoon: string;
  evening: string;
}

interface DestinationTableProps {
  destinations: Destination[];
  onDelete: (id: string) => void;
}

export default function DestinationTable({ destinations, onDelete }: DestinationTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (destinations.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-gray-600" />
        </div>
        <p className="text-gray-500 text-lg">No destinations found</p>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this destination?')) {
      try {
        const res = await fetch(`/api/destinations/${id}`, { method: 'DELETE' });
        if (res.ok) {
          toast.success('Destination deleted');
          onDelete(id);
        } else {
          toast.error('Failed to delete');
        }
      } catch (error) {
        toast.error('Error deleting destination');
      }
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(destinations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = destinations.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 if destinations change and current page is out of bounds
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-gray-700/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-800/80 text-gray-400 uppercase text-[10px] font-black tracking-widest">
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Location</th>
              <th className="px-6 py-4 text-left">Activities (M/A/E)</th>
              <th className="px-6 py-4 text-left">Type</th>
              <th className="px-6 py-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/30">
            {currentItems.map((dest) => (
              <tr key={dest._id} className="hover:bg-gray-800/40 transition-colors group">
                <td className="px-6 py-4">
                  <p className="text-white font-bold tracking-tight">{dest.displayName}</p>
                  <p className="text-gray-500 text-[10px] font-mono uppercase tracking-tighter">{dest.name}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-0.5">
                    {dest.district && (
                      <span className="text-gray-300 text-xs font-medium flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-purple-500" /> {dest.district}
                      </span>
                    )}
                    {dest.region && <span className="text-gray-500 text-[10px] ml-4.5 font-bold uppercase tracking-widest">{dest.region}</span>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-[280px] space-y-1">
                    <div className="flex items-center gap-2 group/item">
                      <span className="w-4 h-4 rounded bg-purple-500/10 text-purple-400 text-[8px] font-black flex items-center justify-center shrink-0 border border-purple-500/20">M</span>
                      <p className="text-gray-400 text-[10px] truncate group-hover/item:text-gray-300 transition-colors">{dest.morning}</p>
                    </div>
                    <div className="flex items-center gap-2 group/item">
                      <span className="w-4 h-4 rounded bg-blue-500/10 text-blue-400 text-[8px] font-black flex items-center justify-center shrink-0 border border-blue-500/20">A</span>
                      <p className="text-gray-400 text-[10px] truncate group-hover/item:text-gray-300 transition-colors">{dest.afternoon}</p>
                    </div>
                    <div className="flex items-center gap-2 group/item">
                      <span className="w-4 h-4 rounded bg-green-500/10 text-green-400 text-[8px] font-black flex items-center justify-center shrink-0 border border-green-500/20">E</span>
                      <p className="text-gray-400 text-[10px] truncate group-hover/item:text-gray-300 transition-colors">{dest.evening}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    dest.type === 'Gujarat' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}>
                    {dest.type === 'Gujarat' ? <Mountain className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                    {dest.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      href={`/admin/destinations/edit/${dest._id}`}
                      className="p-2.5 bg-gray-800 hover:bg-blue-600/20 text-gray-400 hover:text-blue-400 rounded-xl transition-all border border-gray-700 hover:border-blue-500/30"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(dest._id)}
                      className="p-2.5 bg-gray-800 hover:bg-red-600/20 text-gray-400 hover:text-red-400 rounded-xl transition-all border border-gray-700 hover:border-red-500/30"
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-4">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
            Showing <span className="text-gray-300">{startIndex + 1}</span> to <span className="text-gray-300">{Math.min(startIndex + itemsPerPage, destinations.length)}</span> of <span className="text-purple-400">{destinations.length}</span> outcomes
          </p>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev: number) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-all"
            >
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-xl text-[10px] font-black transition-all ${
                    currentPage === page 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30 ring-1 ring-purple-500' 
                    : 'text-gray-500 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((prev: number) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
