'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { usePlanStore } from '@/store/planStore';
import StepIndicator from '@/components/StepIndicator';
import Navbar from '@/components/Navbar';
import { MapPin, Calendar, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Suggestion {
  name: string;
  country: string;
  emoji: string;
  lat: number;
  lng: number;
}

// ─── Floating destination cards ───────────────────────────────────────────────
const DESTINATION_CARDS = [
  { id: 1, name: 'Santorini',    country: 'Greece',        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=300&q=80',  pos: { top: '14%',  left: '3%'  }, rotate: '-7deg',  delay: '0s',    badge: '🌊 Island'    },
  { id: 2, name: 'Kyoto',        country: 'Japan',         image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=300&q=80',  pos: { top: '12%',  right: '3%' }, rotate: '6deg',   delay: '0.5s',  badge: '🌸 Cultural'  },
  { id: 3, name: 'Machu Picchu', country: 'Peru',          image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=300&q=80',  pos: { top: '48%',  left: '2%'  }, rotate: '4deg',   delay: '1s',    badge: '🏔️ Adventure' },
  { id: 4, name: 'Maldives',     country: 'Indian Ocean',  image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=300&q=80',  pos: { top: '46%',  right: '2%' }, rotate: '-5deg',  delay: '0.3s',  badge: '🏝️ Luxury'    },
  { id: 5, name: 'Paris',        country: 'France',        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=300&q=80',  pos: { bottom: '8%', left: '3%' }, rotate: '-4deg',  delay: '0.8s',  badge: '🗼 Romance'   },
  { id: 6, name: 'Bali',         country: 'Indonesia',     image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=300&q=80',  pos: { bottom: '9%', right: '3%'}, rotate: '5deg',   delay: '0.6s',  badge: '🌴 Tropical'  },
];

// ─── Globe helpers ────────────────────────────────────────────────────────────
function latLngToXY(lat: number, lng: number, cx: number, cy: number, r: number, rot: number) {
  const lngRad = ((lng + rot) * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(latRad) * Math.sin(lngRad),
    y: cy - r * Math.sin(latRad),
    visible: Math.cos(latRad) * Math.cos(lngRad) > 0,
  };
}

const CITY_COORDS: Record<string, [number, number]> = {
  Santorini: [36.4, 25.4], Kyoto: [35.0, 135.8], 'Machu Picchu': [-13.2, -72.5],
  Maldives: [4.2, 73.2], Paris: [48.9, 2.3], Bali: [-8.4, 115.2],
};

function Globe({ size = 380, highlightLat, highlightLng }: { size?: number; highlightLat?: number; highlightLng?: number }) {
  const [rotation, setRotation] = useState(0);
  const rafRef = useRef<number>();
  useEffect(() => {
    let last = performance.now();
    const tick = (now: number) => {
      setRotation(r => (r + (now - last) * 0.014) % 360);
      last = now;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current!);
  }, []);

  const cx = size / 2, cy = size / 2, r = size * 0.42;
  const latLines = [-60, -30, 0, 30, 60];
  const lngLines = [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150, 180];
  const dots = Object.entries(CITY_COORDS).map(([name, [la, ln]]) => ({ name, ...latLngToXY(la, ln, cx, cy, r, rotation) }));
  const hl = highlightLat != null && highlightLng != null ? latLngToXY(highlightLat, highlightLng, cx, cy, r, rotation) : null;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      style={{ filter: `drop-shadow(0 0 ${size * 0.14}px rgba(109,40,217,0.55)) drop-shadow(0 0 ${size * 0.06}px rgba(56,189,248,0.3))` }}>
      <defs>
        <radialGradient id="gg" cx="38%" cy="32%" r="68%">
          <stop offset="0%"   stopColor="#2d1f6e" />
          <stop offset="45%"  stopColor="#160d3d" />
          <stop offset="100%" stopColor="#06041a" />
        </radialGradient>
        <radialGradient id="shine" cx="32%" cy="28%" r="52%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.13)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <radialGradient id="outerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="rgba(109,40,217,0.22)" />
          <stop offset="70%"  stopColor="rgba(56,189,248,0.08)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
        <clipPath id="gc"><circle cx={cx} cy={cy} r={r} /></clipPath>
      </defs>

      {/* Outer atmosphere glow */}
      <circle cx={cx} cy={cy} r={r + size * 0.1} fill="url(#outerGlow)" />

      {/* Globe body */}
      <circle cx={cx} cy={cy} r={r} fill="url(#gg)" />

      {/* Grid */}
      <g clipPath="url(#gc)" opacity="0.22">
        {latLines.map(lat => {
          const pts: string[] = [];
          for (let ln = -180; ln <= 180; ln += 3) {
            const p = latLngToXY(lat, ln, cx, cy, r, rotation);
            if (p.visible) pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
          }
          return pts.length > 2 ? <polyline key={`la${lat}`} points={pts.join(' ')} fill="none" stroke="#a78bfa" strokeWidth="0.7" /> : null;
        })}
        {lngLines.map(ln => {
          const pts: string[] = [];
          for (let lat = -85; lat <= 85; lat += 3) {
            const p = latLngToXY(lat, ln, cx, cy, r, rotation);
            if (p.visible) pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
          }
          return pts.length > 2 ? <polyline key={`ln${ln}`} points={pts.join(' ')} fill="none" stroke="#818cf8" strokeWidth="0.7" /> : null;
        })}
      </g>

      {/* City dots */}
      {dots.map(d => d.visible ? (
        <g key={d.name}>
          <circle cx={d.x} cy={d.y} r={r * 0.028} fill="#c4b5fd" opacity="0.95" />
          <circle cx={d.x} cy={d.y} r={r * 0.052} fill="#a78bfa" opacity="0.25" />
        </g>
      ) : null)}

      {/* Highlight pin */}
      {hl?.visible && (
        <g>
          <circle cx={hl.x} cy={hl.y} r={r * 0.055} fill="#f0abfc" opacity="0.97" />
          <circle cx={hl.x} cy={hl.y} r={r * 0.055} fill="#f0abfc" opacity="0.15">
            <animate attributeName="r" values={`${r*0.055};${r*0.13};${r*0.055}`} dur="1.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0;0.4" dur="1.4s" repeatCount="indefinite" />
          </circle>
        </g>
      )}

      {/* Shine */}
      <circle cx={cx} cy={cy} r={r} fill="url(#shine)" />
      {/* Rim */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(167,139,250,0.3)" strokeWidth="1.5" />
      {/* Equator highlight */}
      <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.12} fill="none" stroke="rgba(56,189,248,0.18)" strokeWidth="1" />
    </svg>
  );
}

function useDebounce<T>(value: T, delay: number): T {
  const [dv, setDv] = useState(value);
  useEffect(() => { const t = setTimeout(() => setDv(value), delay); return () => clearTimeout(t); }, [value, delay]);
  return dv;
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const router = useRouter();
  const { setDestination, setDays, setPlans } = usePlanStore();

  const [dest, setDest] = useState('');
  const [numDays, setNumDays] = useState(3);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [sugLoading, setSugLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selected, setSelected] = useState<Suggestion | null>(null);
  const [activeIdx, setActiveIdx] = useState(-1);

  const debouncedDest = useDebounce(dest, 350);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // Parallax
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!containerRef.current) return;
      containerRef.current.querySelectorAll<HTMLElement>('.fc').forEach((el, i) => {
        const d = 0.006 + i * 0.0018;
        const x = (e.clientX - window.innerWidth / 2) * d;
        const y = (e.clientY - window.innerHeight / 2) * d;
        el.style.transform = `translate(${x}px,${y}px) rotate(${el.dataset.r})`;
      });
    };
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, []);

  // Autocomplete
  useEffect(() => {
    if (debouncedDest.length < 2) { setSuggestions([]); setShowDropdown(false); return; }
    setSugLoading(true);
    fetch(`/api/destinations/autocomplete?q=${encodeURIComponent(debouncedDest)}`)
      .then(r => r.json()).then(d => { setSuggestions(d.suggestions ?? []); setShowDropdown(true); setActiveIdx(-1); })
      .catch(() => setSuggestions([])).finally(() => setSugLoading(false));
  }, [debouncedDest]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dropdownRef.current?.contains(e.target as Node) || inputRef.current?.contains(e.target as Node)) return;
      setShowDropdown(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const pick = (s: Suggestion) => { setDest(`${s.name}, ${s.country}`); setSelected(s); setShowDropdown(false); setSuggestions([]); };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || !suggestions.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, suggestions.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter') {
      // Allow form to submit naturally, but pick the highlighted item if any
      const idx = activeIdx >= 0 ? activeIdx : 0;
      if (suggestions[idx]) {
        setDest(`${suggestions[idx].name}, ${suggestions[idx].country}`);
        setSelected(suggestions[idx]);
      }
      setShowDropdown(false);
    }
    if (e.key === 'Escape') setShowDropdown(false);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dest.trim()) { toast.error('Please enter a destination'); return; }

    // Use current selection OR auto-pick top suggestion OR use raw text
    let target = selected;
    if (!target && suggestions.length > 0) {
      target = suggestions[0];
    }
    
    // Fallback to raw text if still nothing (OpenAI will try to figure it out anyway)
    const cleanDest = target ? `${target.name}, ${target.country}` : dest;
    
    setLoading(true);
    setDestination(cleanDest);
    setDays(numDays);
    setDestination(cleanDest); setDays(numDays);
    try {
      const res = await fetch('/api/plans/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ destination: cleanDest, days: numDays }) });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Failed to generate plans', { duration: 5000 }); return; }
      if (data.plans?.length) { setPlans(data.plans); router.push('/plans'); }
      else toast.error('No plans returned. Please try again.');
    } catch { toast.error('Network error. Please check your connection.'); }
    finally { setLoading(false); }
  };

  return (
    <>
      <style>{`
        /* @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap'); */

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .lp-root {
          min-height: 100vh; width: 100%;
          background: #06080f;
          font-family: 'DM Sans', sans-serif;
          position: relative; overflow: hidden;
        }

        /* ── Background layers ── */
        .lp-bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 80% 70% at 20% 50%, rgba(109,40,217,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 60% 55% at 80% 20%, rgba(56,189,248,0.10) 0%, transparent 55%),
            radial-gradient(ellipse 50% 50% at 60% 80%, rgba(139,92,246,0.08) 0%, transparent 55%);
        }

        /* Star field */
        .lp-stars {
          position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden;
        }
        .lp-stars::before, .lp-stars::after {
          content: '';
          position: absolute; inset: 0;
          background-image:
            radial-gradient(1.5px 1.5px at 15% 25%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 75% 12%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 42% 68%, rgba(255,255,255,0.45) 0%, transparent 100%),
            radial-gradient(1px 1px at 88% 55%, rgba(255,255,255,0.35) 0%, transparent 100%),
            radial-gradient(1px 1px at 8%  60%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 62% 88%, rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 52% 18%, rgba(255,255,255,0.45) 0%, transparent 100%),
            radial-gradient(1px 1px at 28% 82%, rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 93% 35%, rgba(255,255,255,0.35) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 35% 45%, rgba(255,255,255,0.25) 0%, transparent 100%);
        }
        .lp-stars::after {
          transform: rotate(45deg) scale(1.4);
          opacity: 0.4;
        }

        /* ── Floating cards ── */
        .fc {
          position: fixed; width: 162px; border-radius: 18px; overflow: hidden; z-index: 2;
          box-shadow: 0 20px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.1);
          animation: fc-float 6s ease-in-out infinite;
          will-change: transform; cursor: default;
          transition: box-shadow 0.3s ease;
        }
        .fc:hover {
          box-shadow: 0 28px 70px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.15), 0 0 35px rgba(109,40,217,0.3);
          z-index: 6;
        }
        .fc img { width: 100%; height: 108px; object-fit: cover; display: block; }
        .fc-info {
          background: rgba(8,11,22,0.97); backdrop-filter: blur(12px);
          padding: 9px 11px; display: flex; align-items: center; justify-content: space-between; gap: 6px;
        }
        .fc-name { font-family:'Syne',sans-serif; font-weight:700; font-size:12px; color:#fff; }
        .fc-country { font-size:10px; color:rgba(255,255,255,0.38); margin-top:1px; }
        .fc-badge {
          font-size:9px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1);
          border-radius:100px; padding:3px 7px; color:rgba(255,255,255,0.5); white-space:nowrap; flex-shrink:0;
        }
        @keyframes fc-float {
          0%,100% { translate: 0 0; }
          50%      { translate: 0 -14px; }
        }

        /* ── Main layout ── */
        .lp-wrap {
          position: relative; z-index: 10;
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: auto 1fr;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
        }

        /* Navbar row spans full width */
        .lp-nav-row {
          grid-column: 1 / -1;
        }

        /* Left: Globe column */
        .lp-left {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px 24px 60px 0;
          gap: 16px;
        }

        /* Right: Content column */
        .lp-right {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 20px 0 60px 40px;
          gap: 0;
        }

        /* ── Globe wrapper ── */
        .globe-wrap {
          position: relative;
          display: flex; flex-direction: column; align-items: center;
          gap: 12px;
        }

        .globe-ring {
          position: absolute;
          width: 420px; height: 420px;
          border-radius: 50%;
          border: 1px solid rgba(139,92,246,0.12);
          animation: ring-spin 20s linear infinite;
          pointer-events: none;
        }
        .globe-ring-2 {
          width: 480px; height: 480px;
          border: 1px dashed rgba(56,189,248,0.08);
          animation-duration: 35s;
          animation-direction: reverse;
        }
        @keyframes ring-spin { to { transform: rotate(360deg); } }

        .globe-tagline {
          font-size: 11px; font-weight: 600; letter-spacing: 0.14em;
          text-transform: uppercase; color: rgba(255,255,255,0.3);
          text-align: center;
        }

        .globe-selected-label {
          display: flex; align-items: center; gap: 7px;
          background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.25);
          border-radius: 100px; padding: 6px 14px;
          font-size: 12.5px; font-weight: 600; color: #c4b5fd;
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }

        /* ── Right panel ── */
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(109,40,217,0.1); border: 1px solid rgba(109,40,217,0.3);
          border-radius: 100px; padding: 5px 14px 5px 10px;
          font-size: 12px; font-weight: 500; color: rgba(192,160,255,0.9);
          margin-bottom: 22px; width: fit-content;
          animation: slideRight 0.5s ease both;
        }
        .badge-dot {
          width: 7px; height: 7px; background: #a78bfa; border-radius: 50%;
          box-shadow: 0 0 8px #a78bfa, 0 0 16px rgba(167,139,250,0.4);
          animation: pulse 2s ease infinite; flex-shrink: 0;
        }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.7)} }

        .hero-h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(32px, 3.2vw, 52px);
          font-weight: 800; line-height: 1.08;
          color: #fff; letter-spacing: -0.03em;
          margin-bottom: 16px;
          animation: slideRight 0.6s 0.08s ease both;
        }
        .grad {
          background: linear-gradient(130deg, #c084fc 0%, #818cf8 45%, #38bdf8 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        .hero-sub {
          font-size: 14.5px; line-height: 1.75; color: rgba(255,255,255,0.4);
          margin-bottom: 28px; max-width: 400px;
          animation: slideRight 0.6s 0.14s ease both;
        }

        /* ── Form card ── */
        .form-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px; padding: 24px;
          box-shadow: 0 30px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);
          backdrop-filter: blur(20px);
          animation: slideRight 0.7s 0.2s ease both;
        }

        .form-row {
          display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px;
        }

        .f-label {
          display: block; font-size: 10.5px; font-weight: 700;
          letter-spacing: 0.09em; text-transform: uppercase;
          color: rgba(255,255,255,0.28); margin-bottom: 7px;
        }

        .f-wrap { position: relative; }

        .f-ico {
          position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
          color: rgba(255,255,255,0.2); width: 14px; height: 14px;
          pointer-events: none; z-index: 1;
        }

        .f-input, .f-select {
          width: 100%;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; padding: 11px 12px 11px 36px;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
          color: #fff; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          appearance: none; -webkit-appearance: none;
        }
        .f-input::placeholder { color: rgba(255,255,255,0.17); }
        .f-input:focus, .f-select:focus {
          border-color: rgba(167,139,250,0.5);
          box-shadow: 0 0 0 3px rgba(167,139,250,0.1);
          background: rgba(255,255,255,0.06);
        }
        .f-select option { background: #131624; color: #fff; }

        /* Autocomplete */
        .ac-wrap { position: relative; }
        .ac-spin {
          position: absolute; right: 11px; top: 50%; transform: translateY(-50%);
          color: rgba(255,255,255,0.3); width: 13px; height: 13px;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .dropdown {
          position: absolute; top: calc(100% + 7px); left: 0; right: 0; z-index: 200;
          background: rgba(11,14,26,0.98); border: 1px solid rgba(255,255,255,0.09);
          border-radius: 13px; overflow: hidden;
          box-shadow: 0 16px 50px rgba(0,0,0,0.65), 0 0 0 1px rgba(139,92,246,0.15);
          backdrop-filter: blur(20px);
          animation: dropIn 0.16s ease both;
        }
        @keyframes dropIn { from{opacity:0;transform:translateY(-5px)} to{opacity:1;transform:translateY(0)} }

        .dd-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 13px; cursor: pointer;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.12s;
        }
        .dd-item:last-child { border-bottom: none; }
        .dd-item:hover, .dd-item.on { background: rgba(139,92,246,0.13); }
        .dd-emoji { font-size: 19px; flex-shrink: 0; }
        .dd-name { font-family:'Syne',sans-serif; font-weight:700; font-size:13px; color:#fff; }
        .dd-country { font-size:11px; color:rgba(255,255,255,0.37); margin-top:1px; }
        .dd-arrow { margin-left:auto; color:rgba(255,255,255,0.18); font-size:12px; flex-shrink:0; }
        .dd-empty { padding:14px; font-size:12.5px; color:rgba(255,255,255,0.3); text-align:center; font-style:italic; }

        .sel-chip {
          display: inline-flex; align-items: center; gap: 5px;
          background: rgba(139,92,246,0.14); border: 1px solid rgba(139,92,246,0.28);
          border-radius: 7px; padding: 3px 9px; font-size: 11.5px; color: #c4b5fd; margin-top: 5px;
        }

        /* CTA button */
        .btn-go {
          width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 13px 20px; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 700;
          color: #fff; border: none; border-radius: 12px; cursor: pointer;
          background: linear-gradient(130deg, #7c3aed 0%, #4f46e5 55%, #0284c7 100%);
          position: relative; overflow: hidden;
          transition: transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 8px 28px rgba(109,60,220,0.4);
        }
        .btn-go::after {
          content:''; position:absolute; inset:0;
          background: linear-gradient(140deg, rgba(255,255,255,0.13) 0%, transparent 55%);
          pointer-events:none;
        }
        .btn-go:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 14px 40px rgba(109,60,220,0.5); }
        .btn-go:active:not(:disabled) { transform:translateY(0); }
        .btn-go:disabled { opacity:0.5; cursor:not-allowed; }
        .sp { width:16px; height:16px; border:2px solid rgba(255,255,255,0.25); border-top-color:#fff; border-radius:50%; animation:spin 0.65s linear infinite; }

        /* Stats */
        .stats {
          display: flex; gap: 0; margin-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.06); padding-top: 18px;
          animation: slideRight 0.7s 0.35s ease both;
        }
        .stat { flex:1; text-align:center; position:relative; }
        .stat+.stat::before { content:''; position:absolute; left:0; top:10%; height:80%; width:1px; background:rgba(255,255,255,0.06); }
        .s-val { font-family:'Syne',sans-serif; font-size:20px; font-weight:700; color:#fff; line-height:1; margin-bottom:4px; }
        .s-lbl { font-size:10px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:rgba(255,255,255,0.27); }

        /* ── Animations ── */
        @keyframes slideRight { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }

        /* ── Responsive ── */
        @media (max-width: 860px) {
          .lp-wrap { grid-template-columns: 1fr; padding: 0 20px; }
          .lp-left { padding: 16px 0 0; }
          .lp-right { padding: 16px 0 40px; }
          .fc { display: none; }
          .globe-ring, .globe-ring-2 { display: none; }
        }
      `}</style>

      <div className="lp-root" ref={containerRef}>
        <div className="lp-bg" />
        <div className="lp-stars" />

        {/* Floating cards — fixed position, behind content */}
        {mounted && DESTINATION_CARDS.map((c, i) => (
          <div
            key={c.id} className="fc" data-r={c.rotate}
            style={{
              ...c.pos,
              animationDelay: c.delay,
              animationDuration: `${5 + i * 0.7}s`,
              transform: `rotate(${c.rotate})`,
            }}
          >
            <img src={c.image} alt={c.name} loading="lazy" />
            <div className="fc-info">
              <div>
                <div className="fc-name">{c.name}</div>
                <div className="fc-country">{c.country}</div>
              </div>
              <div className="fc-badge">{c.badge}</div>
            </div>
          </div>
        ))}

        <div className="lp-wrap">
          {/* Navbar row */}
          <div className="lp-nav-row">
            <Navbar variant="public" />
            <StepIndicator currentStep={1} />
          </div>

          {/* LEFT — Globe */}
          <div className="lp-left">
            <div className="globe-wrap">
              <div className="globe-ring" />
              <div className="globe-ring globe-ring-2" />
              <Globe
                size={380}
                highlightLat={selected?.lat}
                highlightLng={selected?.lng}
              />
              {selected ? (
                <div className="globe-selected-label">
                  📍 {selected.emoji} {selected.name}, {selected.country}
                </div>
              ) : (
                <div className="globe-tagline">Spin the world • Pick your destination</div>
              )}
            </div>
          </div>

          {/* RIGHT — Content + Form */}
          <div className="lp-right">
            <div className="hero-badge">
              <span className="badge-dot" />
              AI-Powered Travel Planning
            </div>

            <h1 className="hero-h1">
              Your Dream Holiday,{' '}
              <span className="grad">Generated<br />in Seconds.</span>
            </h1>

            <p className="hero-sub">
              Tell us where you want to go and for how long —
              our AI crafts 5 personalised itineraries in seconds.
            </p>

            <div className="form-card">
              <form onSubmit={handleGenerate}>
                <div className="form-row">
                  {/* Destination */}
                  <div>
                    <label className="f-label">Destination</label>
                    <div className="ac-wrap">
                      <div className="f-wrap">
                        <MapPin className="f-ico" />
                        <input
                          ref={inputRef}
                          type="text" className="f-input"
                          placeholder="Paris, Bali, Tokyo…"
                          value={dest}
                          onChange={e => { setDest(e.target.value); setSelected(null); }}
                          onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                          onKeyDown={handleKeyDown}
                          autoComplete="off" required
                        />
                        {sugLoading && <Loader2 className="ac-spin" />}
                      </div>

                      {showDropdown && (
                        <div className="dropdown" ref={dropdownRef}>
                          {suggestions.length > 0 ? suggestions.map((s, idx) => (
                            <div
                              key={`${s.name}-${s.country}`}
                              className={`dd-item${idx === activeIdx ? ' on' : ''}`}
                              onMouseDown={() => pick(s)}
                            >
                              <span className="dd-emoji">{s.emoji}</span>
                              <div>
                                <div className="dd-name">{s.name}</div>
                                <div className="dd-country">{s.country}</div>
                              </div>
                              <span className="dd-arrow">↗</span>
                            </div>
                          )) : (
                            <div className="dd-empty">No destinations found</div>
                          )}
                        </div>
                      )}
                    </div>
                    {selected && (
                      <div className="sel-chip">{selected.emoji} {selected.name} • {selected.country}</div>
                    )}
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="f-label">Duration</label>
                    <div className="f-wrap">
                      <Calendar className="f-ico" />
                      <select className="f-select" value={numDays} onChange={e => setNumDays(parseInt(e.target.value))}>
                        {[...Array(14)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? 'Day' : 'Days'}</option>
                        ))}
                        <option value={21}>3 Weeks</option>
                        <option value={30}>1 Month</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-go"
                >
                  {loading ? (
                    <><span className="sp" />Generating Plans...</>
                  ) : (
                    <>{selected ? <><Sparkles style={{ width: 15, height: 15, marginRight: 8 }} />Generate for {selected.name}</> : 'Begin Generation'} <ArrowRight style={{ width: 15, height: 15, marginLeft: 8 }} /></>
                  )}
                </button>
              </form>
            </div>

            <div className="stats">
              <div className="stat"><div className="s-val">5+</div><div className="s-lbl">Diverse Plans</div></div>
              <div className="stat"><div className="s-val">AI</div><div className="s-lbl">Smart Routing</div></div>
              <div className="stat"><div className="s-val">24/7</div><div className="s-lbl">Assistance</div></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}