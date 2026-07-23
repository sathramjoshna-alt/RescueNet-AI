import React, { useState, useEffect } from 'react'
import { Satellite, Zap, Activity, Wifi, ArrowRight, RefreshCw, CheckCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { StatCard, Badge, ProgressBar, GlassCard, SectionHeader } from '../components/UI'

function OrbitVisualization({ satellites, currentOrbit }) {
  const [angle, setAngle] = useState({ leo: 0, meo: 0, geo: 0 })

  useEffect(() => {
    const id = requestAnimationFrame(function tick() {
      setAngle(a => ({ leo: (a.leo + 0.8) % 360, meo: (a.meo + 0.4) % 360, geo: (a.geo + 0.15) % 360 }))
      requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(id)
  }, [])

  const toXY = (angleDeg, rx, ry) => {
    const rad = (angleDeg * Math.PI) / 180
    return { x: 150 + rx * Math.cos(rad), y: 110 + ry * Math.sin(rad) }
  }

  const leoPos = toXY(angle.leo, 55, 20)
  const meoPos = toXY(angle.meo, 85, 32)
  const geoPos = toXY(angle.geo, 115, 44)

  return (
    <GlassCard>
      <SectionHeader title="Live Multi-Orbit Network" subtitle="Real-time constellation visualization" icon={Satellite} />
      <div className="flex justify-center">
        <svg width="300" height="220" viewBox="0 0 300 220">
          {/* Earth */}
          <defs>
            <radialGradient id="earth" cx="50%" cy="40%">
              <stop offset="0%" stopColor="#4ade80" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#2563eb" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </radialGradient>
            <radialGradient id="glow" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="150" cy="110" rx="130" ry="52" fill="url(#glow)" />
          {/* Orbit rings */}
          <ellipse cx="150" cy="110" rx="55" ry="20" fill="none" stroke={currentOrbit === 'LEO' ? '#00d4ff' : '#00d4ff33'} strokeWidth={currentOrbit === 'LEO' ? 1.5 : 0.8} strokeDasharray="4,2" />
          <ellipse cx="150" cy="110" rx="85" ry="32" fill="none" stroke={currentOrbit === 'MEO' ? '#a855f7' : '#a855f733'} strokeWidth={currentOrbit === 'MEO' ? 1.5 : 0.8} strokeDasharray="4,2" />
          <ellipse cx="150" cy="110" rx="115" ry="44" fill="none" stroke={currentOrbit === 'GEO' ? '#f59e0b' : '#f59e0b33'} strokeWidth={currentOrbit === 'GEO' ? 1.5 : 0.8} strokeDasharray="4,2" />
          {/* Earth */}
          <circle cx="150" cy="110" r="22" fill="url(#earth)" />
          <circle cx="150" cy="110" r="22" fill="none" stroke="#60a5fa" strokeWidth="1" strokeOpacity="0.5" />
          <text x="150" y="114" textAnchor="middle" fill="white" fontSize="8" fontFamily="Orbitron">INDIA</text>
          {/* Communication lines (when active) */}
          {currentOrbit === 'LEO' && <line x1="150" y1="110" x2={leoPos.x} y2={leoPos.y} stroke="#00d4ff" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="3,2" />}
          {currentOrbit === 'MEO' && <line x1="150" y1="110" x2={meoPos.x} y2={meoPos.y} stroke="#a855f7" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="3,2" />}
          {currentOrbit === 'GEO' && <line x1="150" y1="110" x2={geoPos.x} y2={geoPos.y} stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="3,2" />}
          {/* Satellites */}
          <circle cx={leoPos.x} cy={leoPos.y} r="5" fill="#00d4ff" />
          <circle cx={leoPos.x} cy={leoPos.y} r="5" fill="none" stroke="#00d4ff" strokeWidth="2" strokeOpacity="0.5">
            {currentOrbit === 'LEO' && <animate attributeName="r" from="5" to="12" dur="1.5s" repeatCount="indefinite" />}
            {currentOrbit === 'LEO' && <animate attributeName="stroke-opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />}
          </circle>
          <circle cx={meoPos.x} cy={meoPos.y} r="6" fill="#a855f7" />
          <circle cx={meoPos.x} cy={meoPos.y} r="6" fill="none" stroke="#a855f7" strokeWidth="2" strokeOpacity="0.5">
            {currentOrbit === 'MEO' && <animate attributeName="r" from="6" to="14" dur="1.5s" repeatCount="indefinite" />}
            {currentOrbit === 'MEO' && <animate attributeName="stroke-opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />}
          </circle>
          <circle cx={geoPos.x} cy={geoPos.y} r="7" fill="#f59e0b" />
          <circle cx={geoPos.x} cy={geoPos.y} r="7" fill="none" stroke="#f59e0b" strokeWidth="2" strokeOpacity="0.5">
            {currentOrbit === 'GEO' && <animate attributeName="r" from="7" to="16" dur="1.5s" repeatCount="indefinite" />}
            {currentOrbit === 'GEO' && <animate attributeName="stroke-opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />}
          </circle>
          {/* Labels */}
          <text x="25" y="195" fill="#00d4ff" fontSize="9" fontFamily="Orbitron">LEO 550km</text>
          <text x="105" y="205" fill="#a855f7" fontSize="9" fontFamily="Orbitron">MEO 8000km</text>
          <text x="205" y="195" fill="#f59e0b" fontSize="9" fontFamily="Orbitron">GEO</text>
        </svg>
      </div>
    </GlassCard>
  )
}

function SatelliteCard({ sat, active, onSelect }) {
  const orbitColor = sat.type === 'LEO' ? 'cyan' : sat.type === 'MEO' ? 'purple' : 'amber'
  const colorMap = {
    cyan: { text: 'text-cyan-400', border: active ? 'border-cyan-500/60' : 'border-cyan-500/20', bg: 'bg-cyan-500/5' },
    purple: { text: 'text-purple-400', border: active ? 'border-purple-500/60' : 'border-purple-500/20', bg: 'bg-purple-500/5' },
    amber: { text: 'text-amber-400', border: active ? 'border-amber-500/60' : 'border-amber-500/20', bg: 'bg-amber-500/5' },
  }
  const c = colorMap[orbitColor]

  return (
    <div
      onClick={() => onSelect(sat)}
      className={`glass-card p-4 border cursor-pointer transition-all hover-glow ${c.border} ${c.bg} ${active ? 'ring-1 ring-offset-0' : ''}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className={`font-orbitron text-xs font-bold ${c.text} mb-0.5`}>{sat.type}</div>
          <div className="text-xs text-slate-300 font-rajdhani">{sat.name}</div>
        </div>
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${sat.status === 'active' ? 'status-online' : 'status-offline'}`} />
          {active && <div className="text-xs text-green-400 font-orbitron">ACTIVE</div>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        {[
          { label: 'Signal', value: `${sat.signal.toFixed(0)}%`, color: sat.signal > 90 ? 'green' : sat.signal > 75 ? 'amber' : 'red' },
          { label: 'Latency', value: `${sat.latency.toFixed(0)}ms`, color: sat.latency < 50 ? 'green' : sat.latency < 100 ? 'amber' : 'red' },
          { label: 'Coverage', value: `${sat.coverage}%`, color: 'cyan' },
          { label: 'Battery', value: `${sat.battery}%`, color: sat.battery > 80 ? 'green' : sat.battery > 50 ? 'amber' : 'red' },
        ].map(m => {
          const mColor = { green: 'text-green-400', amber: 'text-amber-400', red: 'text-red-400', cyan: 'text-cyan-400' }
          return (
            <div key={m.label} className="bg-white/3 rounded p-1.5">
              <div className="text-xs text-slate-500 font-rajdhani">{m.label}</div>
              <div className={`font-orbitron text-xs font-bold ${mColor[m.color]}`}>{m.value}</div>
            </div>
          )
        })}
      </div>

      <div className="space-y-1.5">
        <ProgressBar value={sat.signal} label="Signal" color={sat.signal > 90 ? 'green' : 'amber'} />
        <ProgressBar value={sat.battery} label="Battery" color={sat.battery > 80 ? 'green' : 'red'} />
      </div>

      <div className="mt-2 text-xs text-slate-500 font-rajdhani">
        BW: {sat.bandwidth.toFixed(0)} Mbps | Orbit: {sat.orbit.toLocaleString()} km
      </div>
    </div>
  )
}

function SwitchingPanel() {
  const { currentOrbit, switchOrbit, switchingLog } = useApp()
  const [switching, setSwitching] = useState(false)

  const handleSwitch = (orbit, reason) => {
    if (orbit === currentOrbit) return
    setSwitching(true)
    setTimeout(() => {
      switchOrbit(orbit, reason)
      setSwitching(false)
    }, 2000)
  }

  return (
    <GlassCard>
      <SectionHeader title="Automatic Orbit Switching" subtitle="AI-managed constellation handoff" icon={RefreshCw} />
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { orbit: 'LEO', color: 'cyan', desc: 'Ultra-low latency' },
          { orbit: 'MEO', color: 'purple', desc: 'Wide coverage' },
          { orbit: 'GEO', color: 'amber', desc: 'Global broadcast' },
        ].map(o => {
          const colorMap = {
            cyan: { border: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400', inactive: 'border-white/10 text-slate-400 hover:border-cyan-500/30' },
            purple: { border: 'border-purple-500/40 bg-purple-500/10 text-purple-400', inactive: 'border-white/10 text-slate-400 hover:border-purple-500/30' },
            amber: { border: 'border-amber-500/40 bg-amber-500/10 text-amber-400', inactive: 'border-white/10 text-slate-400 hover:border-amber-500/30' },
          }
          const active = currentOrbit === o.orbit
          return (
            <button
              key={o.orbit}
              onClick={() => handleSwitch(o.orbit, 'Manual override by operator')}
              disabled={switching || active}
              className={`p-3 rounded-lg border font-rajdhani text-xs transition-all ${active ? colorMap[o.color].border : colorMap[o.color].inactive} disabled:opacity-60`}
            >
              <div className="font-orbitron font-bold text-sm mb-1">{o.orbit}</div>
              <div>{o.desc}</div>
              {active && <div className="mt-1 text-green-400 text-xs">● ACTIVE</div>}
            </button>
          )
        })}
      </div>

      {switching && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 mb-4 text-sm font-rajdhani text-cyan-400">
          <div className="spinner w-4 h-4" />
          Switching constellation link... AI handoff in progress
        </div>
      )}

      <div>
        <div className="text-xs font-orbitron text-slate-500 mb-2">SWITCHING LOG</div>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {switchingLog.map((log, i) => (
            <div key={i} className="flex items-center gap-3 text-xs font-rajdhani p-2 rounded bg-white/3">
              <span className="text-slate-500 font-orbitron">{log.time}</span>
              <span className="text-slate-400">{log.from}</span>
              <ArrowRight size={10} className="text-cyan-400 flex-shrink-0" />
              <span className="text-cyan-400">{log.to}</span>
              <span className="text-slate-500 flex-1 truncate">{log.reason}</span>
              <CheckCircle size={12} className="text-green-400 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  )
}

export default function Satellites() {
  const { satellites, activeSatellite, setActiveSatellite, currentOrbit } = useApp()

  const leoSats = satellites.filter(s => s.type === 'LEO')
  const meoSats = satellites.filter(s => s.type === 'MEO')
  const geoSats = satellites.filter(s => s.type === 'GEO')

  return (
    <div className="p-4 sm:p-6 max-w-screen-xl mx-auto">
      <div className="mb-6">
        <h1 className="font-orbitron text-lg font-bold text-white mb-1">SATELLITE MONITORING</h1>
        <p className="text-xs text-slate-500 font-rajdhani">Multi-orbit constellation health & telemetry</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Satellites Online" value={satellites.filter(s => s.status === 'active').length} icon={Satellite} color="cyan" />
        <StatCard label="Active Orbit" value={currentOrbit} icon={Activity} color="purple" />
        <StatCard label="Avg Signal" value={`${Math.round(satellites.reduce((a, b) => a + b.signal, 0) / satellites.length)}%`} icon={Wifi} color="green" />
        <StatCard label="Min Latency" value={`${Math.min(...satellites.map(s => s.latency)).toFixed(0)}ms`} icon={Zap} color="amber" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <OrbitVisualization satellites={satellites} currentOrbit={currentOrbit} />
        <div className="xl:col-span-2">
          <SwitchingPanel />
        </div>
      </div>

      {/* Satellite grids by type */}
      {[
        { type: 'LEO', sats: leoSats, color: 'text-cyan-400', desc: 'Low Earth Orbit — 550 km' },
        { type: 'MEO', sats: meoSats, color: 'text-purple-400', desc: 'Medium Earth Orbit — 8,000 km' },
        { type: 'GEO', sats: geoSats, color: 'text-amber-400', desc: 'Geostationary Orbit — 35,786 km' },
      ].map(({ type, sats, color, desc }) => (
        <div key={type} className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <h2 className={`font-orbitron text-sm font-bold ${color}`}>{type} CONSTELLATION</h2>
            <span className="text-xs text-slate-500 font-rajdhani">{desc}</span>
            <span className="text-xs text-slate-500 font-rajdhani ml-auto">{sats.length} satellites</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sats.map(sat => (
              <SatelliteCard
                key={sat.id}
                sat={sat}
                active={activeSatellite?.id === sat.id}
                onSelect={setActiveSatellite}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
