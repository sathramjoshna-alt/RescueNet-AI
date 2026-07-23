import React, { useState, useEffect, useRef } from 'react'
import {
  Radio, MapPin, Satellite, Clock, Shield, CheckCircle, AlertTriangle,
  Wifi, Activity, Zap, Signal, MessageSquare, PhoneCall, ChevronRight
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { GlassCard, Badge, SectionHeader, ProgressBar } from '../components/UI'

// ─── Incoming SOS stream simulation ─────────────────────────────────────
const INIT_SOS = [
  { id: 'MC-001', name: 'Priya Sharma', gps: '22.5726°N 88.3639°E', disaster: 'Flood', satellite: 'LEO-01', signal: 94, priority: 'Critical', rescueETA: '18 min', commStatus: 'Active', time: '09:08', assigned: 'Alpha Strike', status: 'Active' },
  { id: 'MC-002', name: 'Baby Meera (infant)', gps: '27.5330°N 88.5122°E', disaster: 'Landslide', satellite: 'LEO-02', signal: 89, priority: 'Critical', rescueETA: '24 min', commStatus: 'Active', time: '09:14', assigned: 'Echo Search', status: 'Active' },
  { id: 'MC-003', name: 'Rajan Kumar', gps: '20.2961°N 85.8245°E', disaster: 'Cyclone', satellite: 'MEO-01', signal: 91, priority: 'High', rescueETA: '32 min', commStatus: 'Active', time: '09:02', assigned: 'Bravo Medical', status: 'En Route' },
  { id: 'MC-004', name: 'Sunita Devi', gps: '20.3000°N 85.8300°E', disaster: 'Cyclone', satellite: 'GEO-01', signal: 99, priority: 'High', rescueETA: '35 min', commStatus: 'Active', time: '08:55', assigned: 'Bravo Medical', status: 'En Route' },
  { id: 'MC-005', name: 'Vijay Patel', gps: '27.3300°N 88.5100°E', disaster: 'Landslide', satellite: 'LEO-02', signal: 85, priority: 'Medium', rescueETA: '45 min', commStatus: 'Degraded', time: '08:48', assigned: 'Delta Heli', status: 'Standby' },
  { id: 'MC-006', name: 'Meena Das', gps: '30.9000°N 75.8500°E', disaster: 'Earthquake', satellite: 'MEO-01', signal: 92, priority: 'High', rescueETA: '28 min', commStatus: 'Active', time: '08:40', assigned: 'Delta Heli', status: 'Resolved' },
]

// ─── Live console messages ────────────────────────────────────────────────
const CONSOLE_INIT = [
  { t: '09:28:42', src: 'SATLINK', msg: 'LEO-01 uplink nominal — SNR 28dB', type: 'info' },
  { t: '09:28:38', src: 'SOS-MC-001', msg: 'Victim audio channel open — Priya Sharma', type: 'success' },
  { t: '09:28:31', src: 'AI ENGINE', msg: 'Resource optimisation complete — 6 teams assigned', type: 'info' },
  { t: '09:28:22', src: 'SOS-MC-002', msg: 'CRITICAL: Infant hypothermia — expedite Echo Search', type: 'critical' },
  { t: '09:28:14', src: 'SATLINK', msg: 'MEO-01 beam switched — bandwidth 720 Mbps', type: 'info' },
  { t: '09:28:08', src: 'DRONE', msg: 'Eagle-1 thermal — 3 heat signatures at 22.58°N 88.36°E', type: 'success' },
  { t: '09:27:55', src: 'IOT', msg: 'Hooghly river: 8.7m (+0.3m/hr) — CRITICAL', type: 'critical' },
]

// ─── Signal strength widget ───────────────────────────────────────────────
function SignalBars({ value }) {
  const bars = 5
  const active = Math.round((value / 100) * bars)
  const color = value > 85 ? '#10b981' : value > 60 ? '#f59e0b' : '#ef4444'
  return (
    <div className="flex items-end gap-0.5 h-4">
      {[...Array(bars)].map((_, i) => (
        <div key={i} className="w-1.5 rounded-sm" style={{
          height: `${(i + 1) * 20}%`,
          background: i < active ? color : '#ffffff15',
        }} />
      ))}
    </div>
  )
}

// ─── Satellite comm status sidebar ───────────────────────────────────────
function CommSidebar({ satellites }) {
  return (
    <div className="flex flex-col gap-3">
      <GlassCard>
        <div className="text-xs font-orbitron text-cyan-400 mb-3">COMM STATUS PANEL</div>
        <div className="space-y-2">
          {[
            { label: 'Internet Link', status: 'OFFLINE', color: 'text-red-400', icon: Wifi, dot: 'status-offline' },
            { label: 'Cell Tower Grid', status: 'FAILED', color: 'text-red-400', icon: Radio, dot: 'status-offline' },
            { label: 'Satellite Link', status: 'CONNECTED', color: 'text-green-400', icon: Satellite, dot: 'status-online' },
            { label: 'Emerg. Channel', status: 'ACTIVE', color: 'text-green-400', icon: Activity, dot: 'status-online' },
          ].map(item => {
            const Icon = item.icon
            return (
              <div key={item.label} className="flex items-center gap-2 text-xs p-2 rounded bg-white/3 border border-white/5">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.dot}`} />
                <Icon size={12} className="text-slate-500 flex-shrink-0" />
                <span className="text-slate-400 font-rajdhani flex-1">{item.label}</span>
                <span className={`font-orbitron font-bold ${item.color}`} style={{ fontSize: 10 }}>{item.status}</span>
              </div>
            )
          })}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[
            { label: 'Signal', value: '94%', color: 'text-green-400' },
            { label: 'Latency', value: '28ms', color: 'text-cyan-400' },
            { label: 'Coverage', value: '87%', color: 'text-cyan-400' },
            { label: 'Bandwidth', value: '450 Mbps', color: 'text-purple-400' },
          ].map(m => (
            <div key={m.label} className="p-2 rounded bg-black/20 border border-white/5 text-center">
              <div className={`font-orbitron text-sm font-bold ${m.color}`}>{m.value}</div>
              <div className="text-xs text-slate-600 font-rajdhani">{m.label}</div>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <div className="text-xs font-orbitron text-purple-400 mb-3">SATELLITE STATUS</div>
        {satellites.slice(0, 4).map(sat => (
          <div key={sat.id} className="flex items-center gap-2 py-1.5 border-b border-white/5 last:border-0">
            <div className="w-1.5 h-1.5 rounded-full status-online flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-rajdhani text-slate-300 truncate">{sat.name}</div>
              <div className="text-xs text-slate-600 font-orbitron">{sat.type} · {sat.latency?.toFixed(0)}ms</div>
            </div>
            <SignalBars value={sat.signal} />
          </div>
        ))}
      </GlassCard>

      <GlassCard>
        <div className="text-xs font-orbitron text-amber-400 mb-3">AI COMMANDER</div>
        <div className="space-y-1.5 text-xs font-rajdhani text-slate-300">
          <p className="leading-relaxed">Based on current satellite data and victim priority analysis:</p>
          <ul className="space-y-1 mt-2">
            {[
              '▸ Redirect Eagle-1 drone to infant SOS (MC-002)',
              '▸ Switch LEO-02 to high-priority mode',
              '▸ Pre-position medical team at GPS 27.53°N',
              '▸ Activate GEO backup for Odisha cyclone zone',
            ].map((r, i) => (
              <li key={i} className="text-slate-400 flex gap-1.5">
                <span className="text-amber-400 flex-shrink-0">•</span>{r.replace('▸ ', '')}
              </li>
            ))}
          </ul>
        </div>
      </GlassCard>
    </div>
  )
}

// ─── SOS card ────────────────────────────────────────────────────────────
function SOSCard({ sos, onSelect, selected }) {
  const priorityBorder = { Critical: 'border-red-500/40 bg-red-500/3', High: 'border-amber-500/30 bg-amber-500/3', Medium: 'border-slate-500/20', Low: 'border-slate-600/20' }
  const statusColor = { Active: 'text-red-400', 'En Route': 'text-amber-400', Resolved: 'text-green-400', Standby: 'text-slate-400' }
  const commColor = { Active: 'text-green-400', Degraded: 'text-amber-400', Lost: 'text-red-400' }

  return (
    <div
      onClick={() => onSelect(sos)}
      className={`glass-card border p-3 cursor-pointer transition-all hover-glow ${priorityBorder[sos.priority] || ''} ${selected ? 'ring-1 ring-cyan-500/40' : ''}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-orbitron text-xs text-slate-400">{sos.id}</span>
            <Badge text={sos.priority} type={sos.priority.toLowerCase()} />
          </div>
          <div className="font-rajdhani text-sm font-semibold text-white mt-0.5">{sos.name}</div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className={`font-orbitron text-xs font-bold ${statusColor[sos.status]}`}>{sos.status}</div>
          <div className="text-slate-600 text-xs font-orbitron">{sos.time}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1 text-xs font-rajdhani mb-2">
        <div className="flex items-center gap-1 text-slate-400">
          <MapPin size={10} className="text-cyan-400" />
          <span className="truncate">{sos.disaster}</span>
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <Satellite size={10} className="text-purple-400" />
          <span>{sos.satellite}</span>
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <Clock size={10} className="text-amber-400" />
          ETA: {sos.rescueETA}
        </div>
        <div className={`flex items-center gap-1 font-semibold ${commColor[sos.commStatus]}`}>
          <Activity size={10} />
          {sos.commStatus}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <SignalBars value={sos.signal} />
          <span className="text-xs text-slate-500 font-rajdhani">{sos.signal}%</span>
        </div>
        <div className="text-xs text-slate-500 font-rajdhani">{sos.assigned}</div>
      </div>
    </div>
  )
}

// ─── Detail panel ─────────────────────────────────────────────────────────
function SOSDetail({ sos }) {
  if (!sos) return (
    <GlassCard className="h-full flex items-center justify-center">
      <div className="text-center text-slate-600">
        <Radio size={32} className="mx-auto mb-2" />
        <div className="font-rajdhani text-sm">Select an SOS to view details</div>
      </div>
    </GlassCard>
  )

  return (
    <GlassCard className={`border ${sos.priority === 'Critical' ? 'border-red-500/30' : 'border-cyan-500/20'}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="font-orbitron text-xs text-cyan-400 mb-0.5">MISSION DETAIL — {sos.id}</div>
          <div className="font-orbitron text-lg font-bold text-white">{sos.name}</div>
        </div>
        <Badge text={sos.priority} type={sos.priority.toLowerCase()} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: 'GPS Location', value: sos.gps, icon: MapPin, color: 'text-cyan-400' },
          { label: 'Disaster Type', value: sos.disaster, icon: AlertTriangle, color: 'text-red-400' },
          { label: 'Satellite Used', value: sos.satellite, icon: Satellite, color: 'text-purple-400' },
          { label: 'Signal Quality', value: `${sos.signal}%`, icon: Signal, color: 'text-green-400' },
          { label: 'Rescue ETA', value: sos.rescueETA, icon: Clock, color: 'text-amber-400' },
          { label: 'Comm Status', value: sos.commStatus, icon: Activity, color: sos.commStatus === 'Active' ? 'text-green-400' : 'text-amber-400' },
          { label: 'Team Assigned', value: sos.assigned, icon: Shield, color: 'text-cyan-400' },
          { label: 'Received', value: sos.time, icon: Clock, color: 'text-slate-400' },
        ].map(item => {
          const Icon = item.icon
          return (
            <div key={item.label} className="p-2 rounded bg-white/3 border border-white/5">
              <div className="flex items-center gap-1 mb-0.5">
                <Icon size={10} className="text-slate-500" />
                <span className="text-xs text-slate-500 font-rajdhani">{item.label}</span>
              </div>
              <div className={`font-rajdhani text-sm font-semibold ${item.color}`}>{item.value}</div>
            </div>
          )
        })}
      </div>

      <div className="mb-3">
        <div className="text-xs text-slate-500 font-rajdhani mb-1">Signal Quality</div>
        <ProgressBar value={sos.signal} color={sos.signal > 85 ? 'green' : 'amber'} label={`${sos.signal}%`} />
      </div>

      <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
        <div className="text-xs font-orbitron text-amber-400 mb-1.5">COMMANDER RECOMMENDATION</div>
        <p className="text-xs font-rajdhani text-slate-300 leading-relaxed">
          {sos.priority === 'Critical'
            ? `Immediate extraction required. Dispatch additional aerial support. Maintain continuous satellite link via ${sos.satellite}. Medical team on standby at LZ.`
            : `Standard rescue protocol. Monitor via satellite. ${sos.assigned} team coordinating. Update ETA based on terrain conditions.`}
        </p>
      </div>
    </GlassCard>
  )
}

// ─── Live console ─────────────────────────────────────────────────────────
function LiveConsole() {
  const [logs, setLogs] = useState(CONSOLE_INIT)
  const bottomRef = useRef(null)
  const newLogs = useRef([
    { src: 'SATLINK', msg: 'GEO-01 handover complete — Odisha zone covered', type: 'info' },
    { src: 'DRONE', msg: 'Falcon-2 — new victim coordinates relayed', type: 'success' },
    { src: 'SOS-NEW', msg: 'Incoming SOS from Bihar — flood zone sector 4', type: 'critical' },
    { src: 'AI ENGINE', msg: 'Satellite switch LEO→MEO for higher bandwidth', type: 'info' },
    { src: 'IOT', msg: 'Seismograph alert: 4.2 Richter — Chandigarh', type: 'critical' },
    { src: 'TEAM', msg: 'Alpha Strike: 12 victims secured, requesting evac', type: 'success' },
  ])

  useEffect(() => {
    let i = 0
    const t = setInterval(() => {
      const log = newLogs.current[i % newLogs.current.length]
      const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
      setLogs(prev => [{ ...log, t: time }, ...prev.slice(0, 24)])
      i++
    }, 2500)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  const typeColor = { info: 'text-cyan-400', success: 'text-green-400', critical: 'text-red-400', warning: 'text-amber-400' }

  return (
    <GlassCard className="border border-green-500/20">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-orbitron text-green-400">LIVE COMM CONSOLE</div>
        <div className="flex items-center gap-1 text-xs text-green-400 font-rajdhani">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          LIVE
        </div>
      </div>
      <div className="font-mono text-xs space-y-0.5 max-h-48 overflow-y-auto bg-black/30 rounded p-2 border border-white/5">
        {logs.map((log, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-slate-600 flex-shrink-0">{log.t}</span>
            <span className={`flex-shrink-0 font-bold ${typeColor[log.type] || 'text-slate-400'}`}>[{log.src}]</span>
            <span className="text-slate-400">{log.msg}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </GlassCard>
  )
}

// ─── Analytics bar ───────────────────────────────────────────────────────
function CommAnalytics() {
  const [stats, setStats] = useState({
    delivered: 847, failed: 12, restored: 34, avgDelay: 28, successRate: 98.6, packetRate: 99.2
  })
  useEffect(() => {
    const t = setInterval(() => {
      setStats(s => ({ ...s, delivered: s.delivered + Math.floor(Math.random() * 3), avgDelay: Math.max(22, Math.min(38, s.avgDelay + (Math.random() - 0.5) * 2)) }))
    }, 3000)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
      {[
        { label: 'Msgs Delivered', value: stats.delivered, color: 'text-green-400' },
        { label: 'Failed Attempts', value: stats.failed, color: 'text-red-400' },
        { label: 'Restored Conns', value: stats.restored, color: 'text-cyan-400' },
        { label: 'Avg Delay', value: `${stats.avgDelay.toFixed(0)}ms`, color: 'text-purple-400' },
        { label: 'Success Rate', value: `${stats.successRate}%`, color: 'text-green-400' },
        { label: 'Packet Rate', value: `${stats.packetRate}%`, color: 'text-cyan-400' },
      ].map(s => (
        <div key={s.label} className="glass-card p-3 text-center">
          <div className={`font-orbitron text-lg font-bold ${s.color}`}>{s.value}</div>
          <div className="text-xs text-slate-500 font-rajdhani mt-0.5">{s.label}</div>
        </div>
      ))}
    </div>
  )
}

// ─── Normalize a live pendingSOS/activeMission entry to SOSCard shape ─────
function normalizeLiveSOS(s) {
  return {
    id: s.id,
    name: s.name || s.victim || 'Unknown',
    gps: s.gps || `${s.lat?.toFixed(4)}°N, ${s.lng?.toFixed(4)}°E`,
    disaster: s.type || s.disaster || 'Unknown',
    satellite: s.satelliteName || s.satellite || 'LEO-01',
    signal: s.signal || 90,
    priority: s.priority || 'High',
    rescueETA: s.eta || s.rescueETA || '—',
    commStatus: s.commStatus === 'Active via Satellite' ? 'Active' : (s.commStatus || 'Active'),
    time: s.time || '—',
    assigned: s.nearestTeam || s.teamName || s.assigned || '—',
    status: s.status === 'Pending' ? 'Active' : (s.status || 'Active'),
  }
}

// ─── Main export ──────────────────────────────────────────────────────────
export default function MissionControlComm() {
  const { satellites, pendingSOS, activeMissions, sosRequests } = useApp()
  const [selected, setSelected] = useState(null)
  const [signal, setSignal] = useState({})
  const [filterPriority, setFilterPriority] = useState('All')

  // Build merged SOS list: live pending + active missions + static queue
  const livePending = pendingSOS.map(normalizeLiveSOS)
  const liveMissions = activeMissions.map(m => normalizeLiveSOS({ ...m, status: 'En Route', commStatus: 'Active via Satellite' }))
  const staticBase = INIT_SOS.filter(s => !livePending.find(l => l.name === s.name) && !liveMissions.find(l => l.name === s.name))
  const sosList = [...livePending, ...liveMissions, ...staticBase]

  // Simulate signal fluctuation on static entries
  useEffect(() => {
    const t = setInterval(() => {
      setSignal(prev => {
        const next = { ...prev }
        INIT_SOS.forEach(s => {
          next[s.id] = Math.max(60, Math.min(99, (prev[s.id] || s.signal) + (Math.random() - 0.5) * 3))
        })
        return next
      })
    }, 3000)
    return () => clearInterval(t)
  }, [])

  // Apply signal fluctuation to static entries only
  const sosList_display = sosList.map(s => signal[s.id] ? { ...s, signal: Math.round(signal[s.id]) } : s)

  // Auto-select first item
  useEffect(() => {
    if (!selected && sosList_display.length) setSelected(sosList_display[0])
  }, [sosList_display.length])

  const filtered = filterPriority === 'All' ? sosList_display : sosList_display.filter(s => s.priority === filterPriority)

  return (
    <div className="p-4 sm:p-6 max-w-screen-xl mx-auto">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="font-orbitron text-xs text-green-400 tracking-widest">MISSION CONTROL COMMUNICATION CENTER</span>
        </div>
        <h1 className="font-orbitron text-xl font-black text-white">Live Satellite Communication Console</h1>
        <p className="text-xs text-slate-500 font-rajdhani mt-1">Real-time SOS monitoring, satellite-linked rescue coordination, and AI decision support</p>
      </div>

      {/* Analytics */}
      <div className="mb-4">
        <CommAnalytics />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {/* SOS list */}
        <div className="xl:col-span-1 flex flex-col gap-3">
          <div className="glass-card p-3 border border-cyan-500/20">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-orbitron text-cyan-400">SOS QUEUE</div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500 font-rajdhani">{sosList_display.length} active</span>
                {livePending.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded bg-red-500/20 border border-red-500/30 text-xs font-orbitron text-red-400 badge-pulse">
                    {livePending.length} NEW
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-1 flex-wrap">
              {['All', 'Critical', 'High', 'Medium'].map(p => (
                <button key={p} onClick={() => setFilterPriority(p)}
                  className={`px-2 py-0.5 rounded text-xs font-rajdhani border transition-all ${filterPriority === p ? 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10' : 'border-white/10 text-slate-500 hover:border-white/20'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2 max-h-[calc(100vh-320px)] overflow-y-auto">
            {filtered.length === 0 && (
              <div className="text-center py-8 text-slate-600 font-rajdhani text-sm">No SOS in this category</div>
            )}
            {filtered.map(sos => (
              <SOSCard key={sos.id} sos={sos} selected={selected?.id === sos.id} onSelect={setSelected} />
            ))}
          </div>
        </div>

        {/* Detail + console */}
        <div className="xl:col-span-2 flex flex-col gap-4">
          <SOSDetail sos={selected} />
          <LiveConsole />
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-1">
          <CommSidebar satellites={satellites} />
        </div>
      </div>
    </div>
  )
}
