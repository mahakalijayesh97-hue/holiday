'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { MapPin, Globe, Mountain, Save, X, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AddDestination() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    district: '',
    region: '',
    type: 'Gujarat',
    morning: '',
    afternoon: '',
    evening: '',
    highlights: [''],
    hotels: {
      budget: [{ name: '', costPerNight: '' }],
      comfort: [{ name: '', costPerNight: '' }],
      luxury: [{ name: '', costPerNight: '' }],
    },
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleHighlightChange = (index: number, value: string) => {
    const newHighlights = [...formData.highlights];
    newHighlights[index] = value;
    setFormData((prev) => ({ ...prev, highlights: newHighlights }));
  };

  const addHighlight = () => {
    setFormData((prev) => ({ ...prev, highlights: [...prev.highlights, ''] }));
  };

  const removeHighlight = (index: number) => {
    const newHighlights = formData.highlights.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, highlights: newHighlights }));
  };

  const handleHotelChange = (category: 'budget' | 'comfort' | 'luxury', index: number, field: string, value: string) => {
    const newHotels = { ...formData.hotels };
    (newHotels[category] as any)[index][field] = value;
    setFormData((prev) => ({ ...prev, hotels: newHotels }));
  };

  const addHotel = (category: 'budget' | 'comfort' | 'luxury') => {
    const newHotels = { ...formData.hotels };
    newHotels[category].push({ name: '', costPerNight: '' });
    setFormData((prev) => ({ ...prev, hotels: newHotels }));
  };

  const removeHotel = (category: 'budget' | 'comfort' | 'luxury', index: number) => {
    const newHotels = { ...formData.hotels };
    newHotels[category] = newHotels[category].filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, hotels: newHotels }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/destinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success('Destination added successfully');
        router.push('/admin/destinations');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to add destination');
      }
    } catch (error) {
      toast.error('Error adding destination');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white pb-20">
      <Navbar variant="admin" />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-3 tracking-tighter uppercase">
              New Destination <span className="text-purple-500 text-sm font-mono tracking-tighter px-2 py-1 bg-purple-500/10 rounded-lg">REGISTRY ENTRY</span>
            </h1>
            <p className="text-gray-500">Provide comprehensive data for the new travel locale.</p>
          </div>
          <button
            onClick={() => router.back()}
            className="p-3 bg-gray-800 hover:bg-gray-700 rounded-2xl text-gray-400 hover:text-white transition-all border border-gray-700/50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* General Information */}
          <section className="glass p-8 rounded-3xl border-gray-800/50 space-y-6">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
              <Plus className="w-4 h-4 text-purple-400" /> Core Information
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-1">Internal Name (Slug)</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. ahmedabad"
                  className="w-full bg-gray-900 border border-gray-800 rounded-2xl px-5 py-4 text-sm focus:border-purple-500 outline-none transition-all"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-1">Display Name</label>
                <input
                  type="text"
                  name="displayName"
                  required
                  placeholder="e.g. Ahmedabad"
                  className="w-full bg-gray-900 border border-gray-800 rounded-2xl px-5 py-4 text-sm focus:border-purple-500 outline-none transition-all"
                  value={formData.displayName}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-1">District</label>
                <input
                  type="text"
                  name="district"
                  placeholder="District name"
                  className="w-full bg-gray-900 border border-gray-800 rounded-2xl px-5 py-4 text-sm focus:border-purple-500 outline-none transition-all"
                  value={formData.district}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-1">Region</label>
                <input
                  type="text"
                  name="region"
                  placeholder="e.g. Central Gujarat"
                  className="w-full bg-gray-900 border border-gray-800 rounded-2xl px-5 py-4 text-sm focus:border-purple-500 outline-none transition-all"
                  value={formData.region}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-1">Type</label>
                <select
                  name="type"
                  className="w-full bg-gray-900 border border-gray-800 rounded-2xl px-5 py-4 text-sm focus:border-purple-500 outline-none transition-all appearance-none cursor-pointer"
                  value={formData.type}
                  onChange={handleInputChange}
                >
                  <option value="Gujarat">Gujarat</option>
                  <option value="Global">Global</option>
                </select>
              </div>
            </div>
          </section>

          {/* Activity Timeline */}
          <section className="glass p-8 rounded-3xl border-gray-800/50 space-y-6">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-blue-400" /> Itinerary Schedule
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-purple-400 ml-1 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" /> Morning
                </label>
                <textarea
                  name="morning"
                  required
                  rows={3}
                  placeholder="Attractions & events..."
                  className="w-full bg-gray-900 border border-gray-800 rounded-2xl px-5 py-4 text-sm focus:border-purple-500 outline-none transition-all resize-none"
                  value={formData.morning}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-blue-400 ml-1 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" /> Afternoon
                </label>
                <textarea
                  name="afternoon"
                  required
                  rows={3}
                  placeholder="Mid-day plans..."
                  className="w-full bg-gray-900 border border-gray-800 rounded-2xl px-5 py-4 text-sm focus:border-blue-500 outline-none transition-all resize-none"
                  value={formData.afternoon}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-green-400 ml-1 flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Evening
                </label>
                <textarea
                  name="evening"
                  required
                  rows={3}
                  placeholder="Night & lights..."
                  className="w-full bg-gray-900 border border-gray-800 rounded-2xl px-5 py-4 text-sm focus:border-green-500 outline-none transition-all resize-none"
                  value={formData.evening}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </section>

          {/* Highlights */}
          <section className="glass p-8 rounded-3xl border-gray-800/50 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Plus className="w-4 h-4 text-yellow-500" /> Key Highlights
              </h3>
              <button
                type="button"
                onClick={addHighlight}
                className="text-xs font-bold text-yellow-500 flex items-center gap-1 hover:text-yellow-400"
              >
                <Plus className="w-3.5 h-3.5" /> Add New
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {formData.highlights.map((highlight, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder={`Highlight #${index + 1}`}
                    className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-xs focus:border-yellow-500/50 outline-none transition-all"
                    value={highlight}
                    onChange={(e) => handleHighlightChange(index, e.target.value)}
                  />
                  {formData.highlights.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeHighlight(index)}
                      className="p-3 bg-red-950/20 text-red-500 rounded-xl hover:bg-red-950/40 transition-all border border-red-900/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Hotels - Simplified for this layout */}
          <section className="glass p-8 rounded-3xl border-gray-800/50 space-y-8">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-emerald-400" /> Accommodation Fleet
            </h3>
            
            {(['budget', 'comfort', 'luxury'] as const).map((category) => (
              <div key={category} className="space-y-4 pt-4 first:pt-0">
                <div className="flex items-center justify-between">
                  <h4 className={`text-[10px] font-black uppercase tracking-widest ${
                    category === 'budget' ? 'text-gray-400' : category === 'comfort' ? 'text-blue-400' : 'text-purple-400'
                  }`}>
                    {category} class
                  </h4>
                  <button
                    type="button"
                    onClick={() => addHotel(category)}
                    className="text-[10px] font-black text-emerald-500 flex items-center gap-1 hover:text-emerald-400"
                  >
                    <Plus className="w-3 h-3" /> Add Choice
                  </button>
                </div>
                
                <div className="space-y-3">
                  {formData.hotels[category].map((hotel, index) => (
                    <div key={index} className="grid grid-cols-12 gap-3 group">
                      <div className="col-span-7">
                        <input
                          type="text"
                          placeholder="Hotel Name"
                          className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-xs focus:border-emerald-500/40 outline-none transition-all"
                          value={hotel.name}
                          onChange={(e) => handleHotelChange(category, index, 'name', e.target.value)}
                        />
                      </div>
                      <div className="col-span-4">
                        <input
                          type="text"
                          placeholder="Cost e.g. ₹800–₹1,200"
                          className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-xs focus:border-emerald-500/40 outline-none transition-all font-mono"
                          value={hotel.costPerNight}
                          onChange={(e) => handleHotelChange(category, index, 'costPerNight', e.target.value)}
                        />
                      </div>
                      <div className="col-span-1">
                        <button
                          type="button"
                          onClick={() => removeHotel(category, index)}
                          className="w-full h-full flex items-center justify-center text-gray-600 hover:text-red-500 transition-colors"
                          disabled={formData.hotels[category].length === 0}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 pb-20">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-4 bg-gray-900 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition-all border border-gray-800/50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-purple-900/30 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3 disabled:opacity-50 disabled:translate-y-0"
            >
              {loading ? 'Initializing...' : <><Save className="w-4 h-4" /> Create Registry Entry</>}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
