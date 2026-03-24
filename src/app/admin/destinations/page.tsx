'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import DestinationTable from '@/components/DestinationTable';
import { Plus, Search, MapPin, Map, Globe, Mountain } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AdminDestinations() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated' || (session?.user as any)?.role !== 'admin') {
      router.push('/login');
    }
  }, [status, session, router]);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        let url = '/api/destinations';
        if (filterType !== 'all') url += `?type=${filterType}`;
        
        const res = await fetch(url);
        const data = await res.json();
        setDestinations(data.destinations || []);
      } catch (error) {
        toast.error('Failed to load destinations');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') fetchDestinations();
  }, [status, filterType]);

  if (status === 'loading' || loading) return <LoadingSpinner text="Connecting to Central Map Registry..." />;

  const filtered = destinations.filter((d: any) => 
    d.displayName.toLowerCase().includes(search.toLowerCase()) || 
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    (d.district && d.district.toLowerCase().includes(search.toLowerCase()))
  );

  const stats = [
    { label: 'Total', value: destinations.length, icon: Map, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Gujarat', value: destinations.filter((d: any) => d.type === 'Gujarat').length, icon: Mountain, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { label: 'Global', value: destinations.filter((d: any) => d.type === 'Global').length, icon: Globe, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  ];

  return (
    <main className="min-h-screen bg-gray-950 text-white pb-20">
      <Navbar variant="admin" />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-3">
              Destination Registry <span className="text-purple-500 text-sm font-mono tracking-tighter px-2 py-1 bg-purple-500/10 rounded-lg">MASTER LIST</span>
            </h1>
            <p className="text-gray-500">Managing global destination data and itinerary patterns.</p>
          </div>

          <Link
            href="/admin/destinations/add"
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-purple-900/40 transition-all hover:-translate-y-1 active:scale-95"
          >
            <Plus className="w-5 h-5" /> Add Destination
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="glass p-6 rounded-2xl border-gray-800 flex items-center justify-between group hover:border-purple-500/30 transition-all">
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

        {/* Controls */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
          <div className="relative flex-1 w-full md:w-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, district, or slug..."
              className="w-full bg-gray-900 border border-gray-750 rounded-2xl pl-12 pr-6 py-4 text-sm focus:border-purple-500/50 outline-none transition-all placeholder:text-gray-600"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-2 p-1.5 bg-gray-900/50 rounded-2xl border border-gray-800/50">
            {['all', 'Gujarat', 'Global'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  filterType === type 
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30' 
                  : 'text-gray-500 hover:text-white hover:bg-gray-800'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Table Section */}
        <div className="glass overflow-hidden rounded-3xl shadow-xl border-gray-800/50">
          <div className="bg-gray-900/10 px-6 py-5 border-b border-gray-800/50 flex items-center justify-between">
            <h3 className="font-bold text-sm tracking-tight flex items-center gap-2 uppercase">
              <MapPin className="w-4 h-4 text-purple-400" /> Catalog Registry
            </h3>
            <span className="text-[10px] text-gray-500 px-3 py-1 bg-gray-950 rounded-full font-black tracking-widest border border-gray-800">
              {filtered.length} Destinations Found
            </span>
          </div>
          <div className="p-2">
            <DestinationTable 
              destinations={filtered} 
              onDelete={(id) => setDestinations(prev => prev.filter((d: any) => d._id !== id))} 
            />
          </div>
        </div>
      </div>
    </main>
  );
}
