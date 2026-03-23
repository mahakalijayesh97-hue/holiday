'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { usePlanStore } from '@/store/planStore';
import StepIndicator from '@/components/StepIndicator';
import Navbar from '@/components/Navbar';
import { MapPin, Calendar, ArrowRight, Sparkles, Loader2, Star, Quote } from 'lucide-react';
import './carting.css';
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
  { id: 1, name: 'Santorini', country: 'Greece', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=300&q=80', pos: { top: '14%', left: '3%' }, rotate: '-7deg', delay: '0s', badge: '🌊 Island' },
  { id: 2, name: 'Kyoto', country: 'Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=300&q=80', pos: { top: '12%', right: '3%' }, rotate: '6deg', delay: '0.5s', badge: '🌸 Cultural' },
  { id: 3, name: 'Machu Picchu', country: 'Peru', image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=300&q=80', pos: { top: '48%', left: '2%' }, rotate: '4deg', delay: '1s', badge: '🏔️ Adventure' },
  { id: 4, name: 'Maldives', country: 'Indian Ocean', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=300&q=80', pos: { top: '46%', right: '2%' }, rotate: '-5deg', delay: '0.3s', badge: '🏝️ Luxury' },
  { id: 5, name: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=300&q=80', pos: { bottom: '8%', left: '3%' }, rotate: '-4deg', delay: '0.8s', badge: '🗼 Romance' },
  { id: 6, name: 'Bali', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=300&q=80', pos: { bottom: '9%', right: '3%' }, rotate: '5deg', delay: '0.6s', badge: '🌴 Tropical' },
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
          <stop offset="0%" stopColor="#2d1f6e" />
          <stop offset="45%" stopColor="#160d3d" />
          <stop offset="100%" stopColor="#06041a" />
        </radialGradient>
        <radialGradient id="shine" cx="32%" cy="28%" r="52%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.13)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <radialGradient id="outerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(109,40,217,0.22)" />
          <stop offset="70%" stopColor="rgba(56,189,248,0.08)" />
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
            <animate attributeName="r" values={`${r * 0.055};${r * 0.13};${r * 0.055}`} dur="1.4s" repeatCount="indefinite" />
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
    if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
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


      <section className="gallery-section">
        <div className="gallery-header">
          <div>
            <h2 className="gallery-title">Our <span className="grad">Recommended</span></h2>
            <p className="gallery-subtitle">Check out our top picks for your next adventure</p>
          </div>
          <div className="hidden md:flex gap-2">
            <span className="hero-badge" style={{ marginBottom: 0 }}>View All</span>
          </div>
        </div>

        <div className="rec-grid">
          {[
            {
              title: "Goa Beach Trip",
              dest: "Goa, India",
              price: "₹25,000",
              days: "4 Days",
              type: "Beach",
              image: "https://s7ap1.scene7.com/is/image/incredibleindia/1-palolem-beach-goa-goa-city-hero?qlt=82&ts=1742182084999"
            },
            {
              title: "Kerala Backwaters",
              dest: "Kerala, India",
              price: "₹35,000",
              days: "7 Days",
              type: "Culture",
              image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuq7nc2jeceWsHZwqaHTsvMvG488pMxtNOTg&s"
            },
            {
              title: "Bali Beachfront Villa",
              dest: "Ubud, Indonesia",
              price: "₹42,000",
              days: "6 Days",
              type: "Tropical",
              image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=400&q=80"
            },
            {
              title: "Dubai Skyline Escape",
              dest: "Dubai, UAE",
              price: "₹55,000",
              days: "5 Days",
              type: "Luxury",
              image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80"
            },
            {
              title: "Swiss Alps Retreat",
              dest: "Zermatt, Switzerland",
              price: "₹1,10,000",
              days: "4 Days",
              type: "Mountain",
              image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80"
            },
            {
              title: "Tokyo Urban Tour",
              dest: "Shinjuku, Japan",
              price: "₹68,000",
              days: "7 Days",
              type: "Culture",
              image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80"
            }
          ].map((item, i) => (
            <div key={i} className="rec-card">
              <div className="rec-img-wrap">
                <img src={item.image} alt={item.title} />
                <div className="rec-price">{item.price}</div>
              </div>
              <div className="rec-content">
                <h3 className="rec-title">{item.title}</h3>
                <div className="rec-dest"><MapPin size={12} /> {item.dest}</div>
                <div className="rec-meta">
                  <div className="rec-item">Duration <span className="rec-val">{item.days}</span></div>
                  <div className="rec-item">Experience <span className="rec-val">{item.type}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="gallery-section">
        <div className="gallery-header">
          <div>
            <h2 className="gallery-title">Customer <span className="grad">Reviews</span></h2>
            <p className="gallery-subtitle">What our customers say about us</p>
          </div>
        </div>

        <div className="reviews-grid">
          {[
            {
              name: 'Sarah Jenkins',
              location: 'United Kingdom',
              avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
              text: 'The AI-generated plan for our Bali trip was absolutely spot on. Every recommendation felt like it was handpicked by a local expert. Highly recommend!',
              dest: 'Ubud, Bali',
              tripImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=200&q=80'
            },
            {
              name: 'Rajesh Mehta',
              location: 'India',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
              text: 'I was skeptical about AI planning but the Mumbai itinerary was surprisingly comprehensive. We discovered hidden gems we never would have found ourselves.',
              dest: 'Mumbai, India',
              tripImage: 'https://thumbs.dreamstime.com/b/gate-way-india-mumbai-flag-flying-mubai-independence-day-republic-inda-celebration-169248532.jpg'
            },
            {
              name: 'Elena Rodriguez',
              location: 'Spain',
              avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
              text: 'Breathtaking experience in Iceland! The smart routing helped us maximize our time under the Northern Lights. Simple, fast, and very effective.',
              dest: 'Reykjavik, Iceland',
              tripImage: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=200&q=80'
            }
          ].map((r, i) => (
            <div key={i} className="rv-card flex flex-col">
              <div className="rv-header">
                <img src={r.avatar} alt={r.name} className="rv-avatar" />
                <div className="rv-info">
                  <div className="rv-user-name">{r.name}</div>
                  <div className="rv-user-loc">{r.location}</div>
                </div>
              </div>
              <div className="rv-rating">
                {[...Array(5)].map((_, j) => <Star key={j} fill="#facc15" stroke="none" size={14} />)}
              </div>
              <p className="rv-text">{r.text}</p>
              <div className="rv-footer">
                <div className="rv-dest">
                  <MapPin size={12} />
                  {r.dest}
                </div>
                <img src={r.tripImage} className="rv-trip-img" alt="Trip context" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="gallery-section">
        <div className="gallery-header">
          <div>
            <h2 className="gallery-title">Gallery <span className="grad">Images</span></h2>
            <p className="gallery-subtitle">Explore some of the most breathtaking destinations curated for you.</p>
          </div>
          <div className="hidden md:flex gap-2">
            <span className="hero-badge" style={{ marginBottom: 0 }}>Discover More</span>
          </div>
        </div>

        <div className="gallery-grid">
          <div className="gi gi-w2 gi-h2">
            <img src="https://thumbs.dreamstime.com/b/gate-way-india-mumbai-flag-flying-mubai-independence-day-republic-inda-celebration-169248532.jpg" alt="Mumbai" />
            <div className="gi-badge">✨ Trending</div>
            <div className="gi-overlay">
              <div className="gi-name">Mumbai</div>
              <div className="gi-country">India</div>
            </div>
          </div>

          <div className="gi">
            <img src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80" alt="Santorini" />
            <div className="gi-overlay">
              <div className="gi-name">Santorini</div>
              <div className="gi-country">Greece</div>
            </div>
          </div>

          <div className="gi">
            <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80" alt="Kyoto" />
            <div className="gi-overlay">
              <div className="gi-name">Kyoto</div>
              <div className="gi-country">Japan</div>
            </div>
          </div>

          <div className="gi gi-w2">
            <img src="https://static.independent.co.uk/2025/07/30/13/15/iStock-1339814820.jpeg" alt="Cappadocia" />
            <div className="gi-overlay">
              <div className="gi-name">Cappadocia</div>
              <div className="gi-country">Turkey</div>
            </div>
          </div>

          <div className="gi">
            <img src="https://images.unsplash.com/photo-1526392060635-9d6019884377?w=400&q=80" alt="Machu Picchu" />
            <div className="gi-overlay">
              <div className="gi-name">Machu Picchu</div>
              <div className="gi-country">Peru</div>
            </div>
          </div>

          <div className="gi">
            <img src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&q=80" alt="Amalfi Coast" />
            <div className="gi-badge">💎 Luxury</div>
            <div className="gi-overlay">
              <div className="gi-name">Amalfi Coast</div>
              <div className="gi-country">Italy</div>
            </div>
          </div>

          <div className="gi gi-w2">
            <img src="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&q=80" alt="Maldives" />
            <div className="gi-overlay">
              <div className="gi-name">Maldives</div>
              <div className="gi-country">Indian Ocean</div>
            </div>
          </div>

          <div className="gi gi-w2">
            <img src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80" alt="Paris" />
            <div className="gi-overlay">
              <div className="gi-name">Paris</div>
              <div className="gi-country">France</div>
            </div>
          </div>

          <div className="gi gi-h2">
            <img src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80" alt="Bali" />
            <div className="gi-overlay">
              <div className="gi-name">Bali</div>
              <div className="gi-country">Indonesia</div>
            </div>
          </div>

          <div className="gi gi-h2">
            <img src="https://img.freepik.com/premium-photo/beach-goa-india_78361-4735.jpg?semt=ais_hybrid&w=740&q=80" alt="Goa" />
            <div className="gi-overlay">
              <div className="gi-name">Goa</div>
              <div className="gi-country">India</div>
            </div>
          </div>

          <div className="gi gi-w2">
            <img src="https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800&q=80" alt="Iceland" />
            <div className="gi-overlay">
              <div className="gi-name">Iceland</div>
              <div className="gi-country">Northern Lights, Reykjavik</div>
            </div>
          </div>

        </div>
      </section>




    </>
  );
}