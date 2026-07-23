import React from 'react'
import { Link } from 'react-router-dom'
import { Satellite, Shield, Globe, Award, Users, Zap, ChevronRight } from 'lucide-react'
import StarField from '../components/StarField'

export default function About() {
  return (
    <div className="min-h-screen relative">
      <StarField />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 glass border-b border-cyan-500/20">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
            <Satellite size={16} className="text-white" />
          </div>
          <span className="font-orbitron text-cyan-400 font-bold">RESCUENET AI</span>
        </Link>
        <div className="flex gap-3">
          <Link to="/login" className="px-4 py-2 rounded border border-cyan-500/40 text-cyan-400 text-sm font-rajdhani hover:bg-cyan-500/10">Login</Link>
          <Link to="/register" className="px-4 py-2 rounded bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-sm font-rajdhani">Get Started</Link>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-rajdhani mb-6">
            <Award size={14} />
            Viasat Space For Good India 2026
          </div>
          <h1 className="font-orbitron text-4xl font-black text-white mb-4">About RescueNet AI</h1>
          <p className="text-slate-400 font-rajdhani text-lg max-w-2xl mx-auto">
            A next-generation disaster response platform built for the Multi-Orbit Constellations category, demonstrating how AI and satellite technology can save lives.
          </p>
        </div>

        {/* Mission */}
        <div className="glass-card p-8 mb-8 border border-cyan-500/20">
          <h2 className="font-orbitron text-xl font-bold text-cyan-400 mb-4">Our Mission</h2>
          <p className="text-slate-300 font-rajdhani text-base leading-relaxed mb-4">
            RescueNet AI was built to solve one of humanity's most critical challenges: maintaining reliable communication and coordinating rescue operations during natural disasters, when terrestrial infrastructure is destroyed.
          </p>
          <p className="text-slate-400 font-rajdhani leading-relaxed">
            By leveraging the unique capabilities of LEO, MEO, and GEO satellite constellations, our AI platform intelligently selects the optimal orbital path for every communication need — ensuring zero dead zones across India's most vulnerable disaster-prone regions.
          </p>
        </div>

        {/* How it works */}
        <div className="mb-8">
          <h2 className="font-orbitron text-xl font-bold text-white mb-6">How Multi-Orbit Works</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { orbit: 'LEO', altitude: '550 km', color: 'cyan', icon: '🛰️', title: 'Low Earth Orbit', desc: 'Ultra-low 28ms latency for real-time drone control, live video streaming, and instant rescue coordination.' },
              { orbit: 'MEO', altitude: '8,000 km', color: 'purple', icon: '📡', title: 'Medium Earth Orbit', desc: 'Wider coverage area for backing up LEO, providing redundancy during high-traffic disaster response.' },
              { orbit: 'GEO', altitude: '35,786 km', color: 'amber', icon: '🌍', title: 'Geostationary Orbit', desc: 'Constant position enables reliable broadcast of weather data, alerts, and command signals across India.' },
            ].map(o => {
              const colors = { cyan: 'border-cyan-500/30 bg-cyan-500/5 text-cyan-400', purple: 'border-purple-500/30 bg-purple-500/5 text-purple-400', amber: 'border-amber-500/30 bg-amber-500/5 text-amber-400' }
              return (
                <div key={o.orbit} className={`glass-card p-6 border ${colors[o.color].split(' ')[0]} hover-glow`}>
                  <div className="text-3xl mb-3">{o.icon}</div>
                  <div className={`font-orbitron text-lg font-bold mb-1 ${colors[o.color].split(' ')[2]}`}>{o.orbit}</div>
                  <div className="text-xs text-slate-500 font-rajdhani mb-3">{o.altitude} altitude</div>
                  <p className="text-slate-400 font-rajdhani text-sm leading-relaxed">{o.desc}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Key Features */}
        <div className="glass-card p-8 mb-8 border border-purple-500/20">
          <h2 className="font-orbitron text-xl font-bold text-white mb-6">Key Innovations</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Zap, title: 'AI Orbit Switching', desc: 'Automatic satellite handoff based on signal quality, disaster type, and emergency priority' },
              { icon: Shield, title: 'Rescue Prioritization', desc: 'ML model ranks victims by medical urgency — infants, pregnant women, elderly get critical priority' },
              { icon: Globe, title: 'IoT Sensor Network', desc: '500+ ground sensors feeding real-time river levels, seismic data, and weather readings' },
              { icon: Users, title: 'Offline Resilience', desc: 'Messages stored locally and synced automatically when satellite connection restores' },
            ].map(f => {
              const Icon = f.icon
              return (
                <div key={f.title} className="flex gap-3 p-4 rounded-lg bg-white/3 border border-white/5">
                  <Icon size={20} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-orbitron text-sm text-white mb-1">{f.title}</div>
                    <p className="text-xs text-slate-400 font-rajdhani">{f.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="glass-card p-8 mb-8">
          <h2 className="font-orbitron text-xl font-bold text-white mb-4">Technology Stack</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {['React.js', 'Tailwind CSS', 'Framer Motion', 'Chart.js', 'Leaflet Maps', 'Node.js', 'Express.js', 'MongoDB'].map(t => (
              <div key={t} className="text-center p-3 rounded-lg bg-white/3 border border-white/5 text-xs font-orbitron text-cyan-400">{t}</div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link to="/register" className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-rajdhani font-semibold hover:opacity-90 transition-opacity">
            Try the Platform <ChevronRight size={18} />
          </Link>
        </div>
      </main>
    </div>
  )
}
