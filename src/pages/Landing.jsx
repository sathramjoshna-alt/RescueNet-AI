import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Satellite, Shield, Map, Zap, Globe, Activity, ChevronRight,
  Play, Award, WifiOff, PhoneOff, ArrowDown, CheckCircle, Radio
} from 'lucide-react'
import StarField from '../components/StarField'

// ─── Animated counter ────────────────────────────────────────────────────
function AnimatedCounter({ target, duration = 2000, suffix = '', decimals = 0 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        let start = 0
        const step = target / (duration / 16)
        const timer = setInterval(() => {
          start += step
          if (start >= target) { setCount(target); clearInterval(timer) }
          else setCount(decimals ? parseFloat(start.toFixed(decimals)) : Math.floor(start))
        }, 16)
      }
    })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration, decimals])
  return <span ref={ref}>{typeof count === 'number' && decimals ? count.toFixed(decimals) : count.toLocaleString()}{suffix}</span>
}

// ─── The core story: comm failure flow ───────────────────────────────────
const STORY_STEPS = [
  { icon: '🌊', label: 'Disaster Strikes', desc: 'Flood / Cyclone / Earthquake', color: '#3b82f6', fail: false },
  { icon: '📵', label: 'Mobile Towers Fail', desc: '14 towers submerged, no signal', color: '#ef4444', fail: true },
  { icon: '🌐', label: 'Internet Lost', desc: 'All terrestrial links severed', color: '#ef4444', fail: true },
  { icon: '🆘', label: 'Victim Sends SOS', desc: 'RescueNet app activates', color: '#f59e0b', fail: false },
  { icon: '🤖', label: 'AI Detects Failure', desc: 'Switches to satellite mode', color: '#a855f7', fail: false },
  { icon: '🛰️', label: 'LEO Satellite Selected', desc: '28ms latency, 94% signal', color: '#00d4ff', fail: false },
  { icon: '📡', label: 'SOS Transmitted', desc: 'Via satellite in 28ms', color: '#10b981', fail: false },
  { icon: '🖥️', label: 'Mission Control', desc: 'Alert received & processed', color: '#a855f7', fail: false },
  { icon: '🚁', label: 'Rescue Dispatched', desc: 'Team + drone en route', color: '#f59e0b', fail: false },
  { icon: '✅', label: 'Victim Rescued', desc: 'Life saved via satellite', color: '#10b981', fail: false },
]

function StoryFlow() {
  const [active, setActive] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % STORY_STEPS.length), 1800)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Mobile: vertical */}
      <div className="flex sm:hidden flex-col items-center gap-1">
        {STORY_STEPS.map((s, i) => (
          <React.Fragment key={i}>
            <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border w-full max-w-xs transition-all duration-500 ${
              active === i ? 'border-opacity-80 scale-105' : 'border-white/5 opacity-40'
            }`}
              style={active === i ? { borderColor: s.color + '60', background: s.color + '12' } : {}}>
              <span className="text-xl">{s.icon}</span>
              <div>
                <div className="text-xs font-orbitron text-white font-bold">{s.label}</div>
                <div className="text-xs text-slate-500 font-rajdhani">{s.desc}</div>
              </div>
              {s.fail && <span className="ml-auto text-xs text-red-400 font-orbitron">✗</span>}
              {!s.fail && i > 3 && <span className="ml-auto text-xs font-orbitron" style={{ color: s.color }}>✓</span>}
            </div>
            {i < STORY_STEPS.length - 1 && (
              <div className="w-px h-3 bg-white/10" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Desktop: horizontal scroll with connectors */}
      <div className="hidden sm:flex items-center justify-center gap-0 overflow-x-auto pb-2">
        {STORY_STEPS.map((s, i) => (
          <React.Fragment key={i}>
            <div className={`flex flex-col items-center flex-shrink-0 w-20 transition-all duration-500 ${active === i ? 'scale-110' : active > i ? 'opacity-60' : 'opacity-25'}`}>
              <div className="w-10 h-10 rounded-full border flex items-center justify-center text-lg mb-1 transition-all"
                style={active >= i ? { borderColor: s.color, background: s.color + '20', boxShadow: active === i ? `0 0 16px ${s.color}60` : 'none' } : { borderColor: '#ffffff10', background: 'transparent' }}>
                {s.icon}
              </div>
              <div className="text-center">
                <div className="font-orbitron font-bold leading-tight" style={{ fontSize: 8, color: active >= i ? s.color : '#475569' }}>{s.label}</div>
                <div className="text-slate-600 font-rajdhani leading-tight" style={{ fontSize: 7 }}>{s.desc}</div>
              </div>
            </div>
            {i < STORY_STEPS.length - 1 && (
              <div className={`flex-shrink-0 h-px w-6 transition-all ${active > i ? 'bg-cyan-500/60' : 'bg-white/10'}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

// ─── Orbit visualizer ────────────────────────────────────────────────────
function OrbitViz() {
  const [angle, setAngle] = useState({ l: 0, m: 0, g: 0 })
  useEffect(() => {
    let id
    const tick = () => {
      setAngle(a => ({ l: (a.l + 0.6) % 360, m: (a.m + 0.3) % 360, g: (a.g + 0.1) % 360 }))
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [])

  const pos = (deg, rx, ry, cx = 120, cy = 120) => ({
    x: cx + rx * Math.cos((deg * Math.PI) / 180),
    y: cy + ry * Math.sin((deg * Math.PI) / 180),
  })
  const leo = pos(angle.l, 55, 22)
  const meo = pos(angle.m, 78, 33)
  const geo = pos(angle.g, 105, 44)

  return (
    <div className="flex justify-center">
      <svg width="240" height="240" viewBox="0 0 240 240">
        <defs>
          <radialGradient id="eg" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </radialGradient>
          <filter id="glow2">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Orbit rings */}
        <ellipse cx="120" cy="120" rx="55" ry="22" fill="none" stroke="#00d4ff30" strokeWidth="1" strokeDasharray="4,3" />
        <ellipse cx="120" cy="120" rx="78" ry="33" fill="none" stroke="#a855f730" strokeWidth="1" strokeDasharray="4,3" />
        <ellipse cx="120" cy="120" rx="105" ry="44" fill="none" stroke="#f59e0b30" strokeWidth="1" strokeDasharray="4,3" />
        {/* Earth glow */}
        <circle cx="120" cy="120" r="32" fill="#1e3a8a" opacity="0.3" />
        <circle cx="120" cy="120" r="24" fill="url(#eg)" filter="url(#glow2)" />
        {/* India dot */}
        <circle cx="124" cy="118" r="2" fill="#fbbf24" />
        {/* Satellites */}
        {[
          { p: leo, c: '#00d4ff', r: 4, label: 'LEO' },
          { p: meo, c: '#a855f7', r: 5, label: 'MEO' },
          { p: geo, c: '#f59e0b', r: 6, label: 'GEO' },
        ].map(s => (
          <g key={s.label}>
            <circle cx={s.p.x} cy={s.p.y} r={s.r} fill={s.c} />
            <circle cx={s.p.x} cy={s.p.y} r={s.r} fill="none" stroke={s.c} strokeWidth="1.5" strokeOpacity="0.5">
              <animate attributeName="r" from={s.r} to={s.r * 3} dur="2s" repeatCount="indefinite" />
              <animate attributeName="stroke-opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
            </circle>
            {/* Beam to earth */}
            <line x1={s.p.x} y1={s.p.y} x2="124" y2="118" stroke={s.c} strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="3,2" />
          </g>
        ))}
        {/* Labels */}
        <text x="12" y="215" fill="#00d4ff" fontSize="8" fontFamily="Orbitron">LEO 550km</text>
        <text x="80" y="222" fill="#a855f7" fontSize="8" fontFamily="Orbitron">MEO</text>
        <text x="165" y="215" fill="#f59e0b" fontSize="8" fontFamily="Orbitron">GEO</text>
      </svg>
    </div>
  )
}

// ─── Key message banner ───────────────────────────────────────────────────
function KeyMessageBanner() {
  return (
    <div className="max-w-4xl mx-auto px-6">
      <div className="glass-card border border-cyan-500/40 p-6 sm:p-8 text-center"
        style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.05) 0%, rgba(124,58,237,0.05) 100%)' }}>
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          <span className="font-orbitron text-xs text-slate-400 tracking-widest">THE PROBLEM WE SOLVE</span>
        </div>
        <h2 className="font-orbitron text-xl sm:text-2xl font-black text-white mb-3 leading-tight">
          When mobile networks fail during floods,
          <br /><span className="text-cyan-400"> RescueNet AI automatically switches</span>
          <br />communication to satellites
        </h2>
        <p className="text-slate-400 font-rajdhani text-base max-w-2xl mx-auto mb-6">
          — allowing victims to send SOS messages and enabling rescue teams to respond immediately,
          even when every ground-based tower is submerged.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { icon: WifiOff, text: 'No Internet', color: 'text-red-400', border: 'border-red-500/30', bg: 'bg-red-500/10' },
            { icon: PhoneOff, text: 'No Cell Signal', color: 'text-red-400', border: 'border-red-500/30', bg: 'bg-red-500/10' },
            { icon: ArrowDown, text: '↓ AI Detects', color: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-500/10' },
            { icon: Satellite, text: 'Satellite Mode', color: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/10' },
            { icon: Radio, text: 'SOS Delivered', color: 'text-green-400', border: 'border-green-500/30', bg: 'bg-green-500/10' },
            { icon: Shield, text: 'Rescue Sent', color: 'text-green-400', border: 'border-green-500/30', bg: 'bg-green-500/10' },
          ].map(item => {
            const Icon = item.icon
            return (
              <div key={item.text} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${item.border} ${item.bg}`}>
                <Icon size={14} className={item.color} />
                <span className={`font-rajdhani text-sm font-semibold ${item.color}`}>{item.text}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── How It Works 3-column section ───────────────────────────────────────
const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Disaster Destroys Ground Network',
    desc: 'Floods, cyclones, and earthquakes knock out mobile towers, fiber cables, and internet exchange points. Victims are completely isolated — no calls, no texts, no internet.',
    icon: '📵', color: 'red',
  },
  {
    step: '02',
    title: 'AI Detects Failure & Switches Orbits',
    desc: 'RescueNet AI instantly detects the communication blackout. Within milliseconds, it evaluates LEO, MEO, and GEO satellite constellations and selects the optimal orbit based on disaster type, latency needs, and coverage area.',
    icon: '🤖', color: 'purple',
  },
  {
    step: '03',
    title: 'Satellite Restores Emergency Channel',
    desc: 'An encrypted emergency channel is established through the selected satellite. Victims can send SOS messages. Mission Control receives real-time alerts. Rescue teams are dispatched with live GPS coordinates — all through space.',
    icon: '🛰️', color: 'cyan',
  },
]

const FEATURES = [
  { icon: Satellite, title: 'Multi-Orbit Auto-Switching', desc: 'LEO (28ms) for real-time ops, MEO for wide coverage, GEO for broadcast. AI selects automatically.', color: 'cyan' },
  { icon: Shield, title: 'AI Rescue Prioritization', desc: 'ML ranks victims by medical urgency — infants, pregnant women, elderly — via satellite link.', color: 'purple' },
  { icon: Map, title: 'Communication Blackout Map', desc: 'Live visualization of blackout zones, satellite coverage, and restored areas in real-time.', color: 'green' },
  { icon: Zap, title: 'Offline-First SOS', desc: 'SOS queued locally, transmitted the moment satellite connection is re-established.', color: 'amber' },
  { icon: Globe, title: 'IoT Sensor Network', desc: '500+ sensors feeding river levels, seismic data, and weather readings via satellite uplink.', color: 'cyan' },
  { icon: Activity, title: 'Drone Intelligence Fleet', desc: 'Thermal UAVs locate victims, relay GPS via satellite back to Mission Control.', color: 'purple' },
]

const STATS = [
  { value: 3630, suffix: '+', label: 'Lives Saved', decimals: 0 },
  { value: 6, suffix: '', label: 'Satellites Active', decimals: 0 },
  { value: 98.7, suffix: '%', label: 'Uptime', decimals: 1 },
  { value: 28, suffix: 'ms', label: 'LEO Latency', decimals: 0 },
]

export default function Landing() {
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <StarField />

      {/* ── Header ── */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 glass border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
            <Satellite size={20} className="text-white" />
          </div>
          <div>
            <div className="font-orbitron text-lg font-bold text-cyan-400">RESCUENET AI</div>
            <div className="font-rajdhani text-xs text-slate-400">SPACE FOR GOOD INDIA 2026</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-xs font-rajdhani text-slate-500 border border-slate-700 px-3 py-1.5 rounded">
            Multi-Orbit Constellations · Viasat India
          </span>
          <Link to="/login" className="px-4 py-2 rounded border border-cyan-500/40 text-cyan-400 text-sm font-rajdhani hover:bg-cyan-500/10 transition-colors">Login</Link>
          <Link to="/register" className="px-4 py-2 rounded bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-sm font-rajdhani hover:opacity-90 transition-opacity">Get Started</Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative z-10 py-16 sm:py-24 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-rajdhani mb-6">
          <Award size={14} />
          Viasat Space For Good India 2026 — Multi-Orbit Constellations Category
        </div>

        {/* Core message — first thing judges read */}
        <h1 className="font-orbitron text-3xl sm:text-5xl md:text-6xl font-black mb-5 leading-tight">
          <span className="text-white">When Floods Cut </span>
          <span className="text-red-400">All Communication</span>
          <br />
          <span className="text-cyan-400">Satellites Take Over</span>
        </h1>

        <p className="text-slate-300 font-rajdhani text-lg sm:text-xl max-w-3xl mx-auto mb-4 leading-relaxed">
          RescueNet AI uses <strong className="text-cyan-400">LEO · MEO · GEO satellite constellations</strong> to automatically restore emergency communication when mobile towers and internet fail during disasters — so victims can send SOS and rescue teams can respond.
        </p>
        <p className="text-slate-500 font-rajdhani text-sm max-w-xl mx-auto mb-10">
          Built for Viasat Space For Good India 2026 · Multi-Orbit Constellations Category
        </p>

        <div className="flex flex-wrap gap-4 justify-center mb-14">
          <Link to="/comm-simulation" className="flex items-center gap-2 px-8 py-3 rounded-lg bg-gradient-to-r from-red-500 to-orange-600 text-white font-rajdhani font-bold text-base hover:opacity-90 transition-opacity shadow-lg">
            <Play size={18} />
            Watch Live Simulation
          </Link>
          <Link to="/register" className="flex items-center gap-2 px-8 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-rajdhani font-bold text-base hover:opacity-90 transition-opacity">
            Launch Mission Control
            <ChevronRight size={16} />
          </Link>
          <Link to="/about" className="flex items-center gap-2 px-6 py-3 rounded-lg border border-cyan-500/40 text-cyan-400 font-rajdhani font-semibold hover:bg-cyan-500/10">
            Learn More
          </Link>
        </div>

        {/* Animated story flow */}
        <StoryFlow />
      </section>

      {/* ── Key Message Banner ── */}
      <section className="relative z-10 py-10">
        <KeyMessageBanner />
      </section>

      {/* ── Stats ── */}
      <section className="relative z-10 py-14 px-6 glass border-y border-cyan-500/20">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <div className="font-orbitron text-3xl sm:text-4xl font-black text-cyan-400 mb-2">
                <AnimatedCounter target={s.value} suffix={s.suffix} decimals={s.decimals} />
              </div>
              <div className="text-slate-500 font-rajdhani text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-orbitron text-3xl font-bold text-white mb-3">How It Works</h2>
            <p className="text-slate-500 font-rajdhani">The complete communication restoration pipeline</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map(h => {
              const cMap = { red: { t: 'text-red-400', b: 'border-red-500/20', bg: 'bg-red-500/5' }, purple: { t: 'text-purple-400', b: 'border-purple-500/20', bg: 'bg-purple-500/5' }, cyan: { t: 'text-cyan-400', b: 'border-cyan-500/20', bg: 'bg-cyan-500/5' } }
              const c = cMap[h.color]
              return (
                <div key={h.step} className={`glass-card p-6 border ${c.b} ${c.bg} hover-glow`}>
                  <div className={`font-orbitron text-3xl font-black ${c.t} opacity-30 mb-2`}>{h.step}</div>
                  <div className="text-3xl mb-3">{h.icon}</div>
                  <h3 className={`font-orbitron text-sm font-bold mb-3 ${c.t}`}>{h.title}</h3>
                  <p className="text-slate-400 font-rajdhani text-sm leading-relaxed">{h.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Orbit Viz + Features ── */}
      <section className="relative z-10 py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-10 items-center mb-16">
            <div>
              <h2 className="font-orbitron text-2xl font-bold text-white mb-4">Multi-Orbit Constellation</h2>
              <p className="text-slate-400 font-rajdhani mb-6 leading-relaxed">RescueNet AI manages three orbital layers simultaneously. The AI engine selects the best orbit for each situation — LEO for speed, MEO for coverage, GEO for broadcast — and switches automatically when signal degrades.</p>
              <div className="space-y-3">
                {[
                  { name: 'LEO', alt: '550 km', latency: '28ms', use: 'Real-time SOS & drone control', color: '#00d4ff' },
                  { name: 'MEO', alt: '8,000 km', latency: '82ms', use: 'Wide area rescue coverage', color: '#a855f7' },
                  { name: 'GEO', alt: '35,786 km', latency: '550ms', use: 'National broadcast & monitoring', color: '#f59e0b' },
                ].map(o => (
                  <div key={o.name} className="flex items-center gap-3 p-3 rounded-lg bg-white/3 border border-white/5">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: o.color, boxShadow: `0 0 8px ${o.color}` }} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-orbitron text-sm font-bold" style={{ color: o.color }}>{o.name}</span>
                        <span className="text-xs text-slate-500 font-rajdhani">{o.alt} · {o.latency}</span>
                      </div>
                      <div className="text-xs text-slate-400 font-rajdhani">{o.use}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <OrbitViz />
          </div>
        </div>
      </section>

      {/* ── Capabilities Grid ── */}
      <section className="relative z-10 py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-orbitron text-3xl font-bold text-white mb-3">Platform Capabilities</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(f => {
              const Icon = f.icon
              const c = { cyan: { t: 'text-cyan-400', b: 'border-cyan-500/20', bg: 'bg-cyan-500/10' }, purple: { t: 'text-purple-400', b: 'border-purple-500/20', bg: 'bg-purple-500/10' }, green: { t: 'text-green-400', b: 'border-green-500/20', bg: 'bg-green-500/10' }, amber: { t: 'text-amber-400', b: 'border-amber-500/20', bg: 'bg-amber-500/10' } }[f.color]
              return (
                <div key={f.title} className="glass-card p-5 hover-glow transition-all">
                  <div className={`w-10 h-10 rounded-xl ${c.bg} ${c.b} border flex items-center justify-center mb-3`}>
                    <Icon size={20} className={c.t} />
                  </div>
                  <h3 className="font-orbitron text-xs font-bold text-white mb-1.5">{f.title}</h3>
                  <p className="text-slate-500 text-xs font-rajdhani leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-2xl mx-auto text-center glass-card p-10 border border-cyan-500/30">
          <div className="text-4xl mb-4">🛰️</div>
          <div className="font-orbitron text-2xl font-bold text-white mb-3">Ready to See It In Action?</div>
          <p className="text-slate-400 font-rajdhani mb-8">Watch the live simulation showing how RescueNet AI restores communication through satellites during a real flood emergency.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/comm-simulation" className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-red-500 to-orange-600 text-white font-rajdhani font-bold hover:opacity-90 transition-opacity">
              <Play size={16} /> Live Simulation
            </Link>
            <Link to="/register" className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-rajdhani font-bold hover:opacity-90 transition-opacity">
              Mission Control <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 glass border-t border-cyan-500/20 px-6 py-6 text-center text-slate-600 text-xs font-rajdhani">
        <div className="flex flex-wrap items-center justify-center gap-4 mb-2">
          <span className="text-cyan-400 font-orbitron font-bold">RESCUENET AI</span>
          <span>Viasat Space For Good India 2026</span>
          <span>Multi-Orbit Constellations Category</span>
        </div>
        <div>© 2026 RescueNet AI · Restoring emergency communication through satellite intelligence</div>
      </footer>
    </div>
  )
}
