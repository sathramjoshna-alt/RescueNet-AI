import React, { useState } from 'react'
import { Users, MapPin, Heart, AlertTriangle, Search, Satellite, Shield, Clock } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { StatCard, Badge, GlassCard, SectionHeader } from '../components/UI'
import { victims as staticVictims } from '../data/mockData'

const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 }

// ── Victim card — shows both static + live tracked victims ────────────────
function VictimCard({ victim }) {
  const priorityColor = {
    Critical: 'border-red-500/40 bg-red-500/5',
    High:     'border-amber-500/40 bg-amber-500/5',
    Medium:   'border-yellow-500/40 bg-yellow-500/5',
    Low:      'border-green-500/40 bg-green-500/5',
  }
  const statusColor = {
    'Awaiting Rescue':         'text-red-400',
    'Rescue Team Assigned':    'text-amber-400',
    'Rescue In Progress':      'text-amber-400',
    'SOS Received — Awaiting Team': 'text-orange-400',
    'Rescued':                 'text-green-400',
  }

  // Live tracking fields may override static defaults
  const displayStatus   = victim.rescueStatus || victim.status || 'Awaiting Rescue'
  const displayTeam     = victim.assignedTeam  || victim.assignedTeamName || null
  const displayETA      = victim.eta           || null
  const displayComm     = victim.commStatus    || victim.satellite ? `Active via ${victim.satellite}` : null
  const isLive          = Boolean(victim.trackingId)   // dispatched via simulation

  return (
    <div className={`glass-card p-4 border hover-glow transition-all relative ${priorityColor[victim.priority] || 'border-white/10'}`}>
      {/* Live badge */}
      {isLive && (
        <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/30">
          <span className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-orbitron text-cyan-400" style={{ fontSize: 9 }}>LIVE</span>
        </div>
      )}

      <div className="flex items-start justify-between mb-3 pr-12">
        <div>
          <div className="font-orbitron text-sm font-bold text-white">{victim.name}</div>
          <div className="text-xs text-slate-500 font-rajdhani mt-0.5">
            {victim.age ? (victim.age < 1 ? `${Math.round(victim.age * 12)} months` : `${victim.age} yrs`) : '—'} • {victim.id || victim.trackingId || '—'}
          </div>
        </div>
        <Badge text={victim.priority} type={victim.priority?.toLowerCase()} />
      </div>

      <div className="space-y-2 text-xs font-rajdhani">
        <div className="flex items-center gap-2 text-slate-400">
          <Heart size={12} className="text-red-400 flex-shrink-0" />
          <span>{victim.medical}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <MapPin size={12} className="text-cyan-400 flex-shrink-0" />
          <span>{victim.location}</span>
        </div>

        {/* Rescue status */}
        <div className="flex items-center justify-between">
          <span className={`font-semibold ${statusColor[displayStatus] || 'text-slate-400'}`}>
            {displayStatus}
          </span>
          {displayComm && (
            <div className="flex items-center gap-1 text-slate-500">
              <Satellite size={10} className="text-cyan-400" />
              <span className="text-cyan-400">{displayComm}</span>
            </div>
          )}
        </div>

        {/* Team assignment */}
        {displayTeam && (
          <div className="flex items-center gap-2 p-2 rounded bg-green-500/5 border border-green-500/20">
            <Shield size={10} className="text-green-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-slate-500" style={{ fontSize: 9 }}>ASSIGNED TEAM</div>
              <div className="text-green-400 font-semibold truncate">{displayTeam}</div>
            </div>
            {displayETA && (
              <div className="text-right">
                <div className="text-slate-600" style={{ fontSize: 9 }}>ETA</div>
                <div className="text-amber-400 font-orbitron font-bold">{displayETA}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Critical warning */}
      {victim.priority === 'Critical' && displayStatus !== 'Rescued' && !displayTeam && (
        <div className="mt-3 flex items-center gap-1 text-xs text-red-400 font-rajdhani critical-blink p-2 rounded border border-red-500/20">
          <AlertTriangle size={12} />
          IMMEDIATE EVACUATION REQUIRED
        </div>
      )}
    </div>
  )
}

export default function Victims() {
  const { victimTracking } = useApp()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  const priorities = ['All', 'Critical', 'High', 'Medium', 'Low']
  const statuses   = ['All', 'Awaiting Rescue', 'SOS Received — Awaiting Team', 'Rescue Team Assigned', 'Rescue In Progress', 'Rescued']

  // Merge static victims with live-tracked ones (live ones take precedence if same id)
  const liveIds = new Set(victimTracking.map(v => v.trackingId))
  const mergedVictims = [
    // Live-tracked victims first
    ...victimTracking,
    // Static victims that haven't been replaced
    ...staticVictims.filter(v => !liveIds.has(v.id)),
  ]

  const filtered = mergedVictims
    .filter(v => {
      const vStatus = v.rescueStatus || v.status || ''
      if (filter !== 'All' && v.priority !== filter) return false
      if (statusFilter !== 'All' && !vStatus.includes(statusFilter)) return false
      if (search) {
        const q = search.toLowerCase()
        if (!v.name?.toLowerCase().includes(q) && !v.location?.toLowerCase().includes(q)) return false
      }
      return true
    })
    .sort((a, b) => (priorityOrder[a.priority] ?? 4) - (priorityOrder[b.priority] ?? 4))

  const stats = {
    total:    mergedVictims.length,
    critical: mergedVictims.filter(v => v.priority === 'Critical').length,
    rescued:  mergedVictims.filter(v => (v.rescueStatus || v.status) === 'Rescued').length,
    assigned: mergedVictims.filter(v => (v.rescueStatus || '').includes('Team Assigned') || v.status === 'Dispatched').length,
    pending:  mergedVictims.filter(v => {
      const s = v.rescueStatus || v.status || ''
      return s.includes('Awaiting') || s.includes('SOS')
    }).length,
  }

  return (
    <div className="p-4 sm:p-6 max-w-screen-xl mx-auto">
      <div className="mb-5">
        <h1 className="font-orbitron text-lg font-bold text-white mb-1">VICTIM TRACKING</h1>
        <p className="text-xs text-slate-500 font-rajdhani">
          AI-tracked survivors · Satellite-linked status · Real-time rescue assignment
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
        <StatCard label="Total Tracked"   value={stats.total}    icon={Users}         color="cyan" />
        <StatCard label="Critical"        value={stats.critical} icon={AlertTriangle}  color="red" animate={stats.critical > 0} />
        <StatCard label="Team Assigned"   value={stats.assigned} icon={Shield}         color="amber" />
        <StatCard label="Rescued"         value={stats.rescued}  icon={Heart}          color="green" />
        <StatCard label="Awaiting"        value={stats.pending}  icon={Clock}          color="purple" />
      </div>

      {/* Live tracking banner */}
      {victimTracking.length > 0 && (
        <div className="mb-4 p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/30 flex items-center gap-3">
          <Satellite size={18} className="text-cyan-400 flex-shrink-0" />
          <div>
            <div className="font-orbitron text-xs text-cyan-400 mb-0.5">
              {victimTracking.length} LIVE-TRACKED VICTIM{victimTracking.length > 1 ? 'S' : ''} — Via Satellite
            </div>
            <div className="text-xs text-slate-400 font-rajdhani">
              Rescue assignments and comm status updating in real time from Mission Control
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="glass-card p-4 mb-5 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-40">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search victims…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-cyan-500/20 rounded-lg pl-8 pr-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 font-rajdhani"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {priorities.map(p => (
            <button key={p} onClick={() => setFilter(p)}
              className={`px-2 py-1 rounded text-xs font-rajdhani border transition-all ${filter === p ? 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10' : 'border-white/10 text-slate-500 hover:border-white/20'}`}>
              {p}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {['All', 'Awaiting', 'Assigned', 'Rescued'].map(s => {
            const key = s === 'All' ? 'All' : s === 'Awaiting' ? 'Awaiting Rescue' : s === 'Assigned' ? 'Rescue Team Assigned' : 'Rescued'
            return (
              <button key={s} onClick={() => setStatusFilter(s === 'All' ? 'All' : key)}
                className={`px-2 py-1 rounded text-xs font-rajdhani border transition-all ${statusFilter === key || (s === 'All' && statusFilter === 'All') ? 'border-purple-500/40 text-purple-400 bg-purple-500/10' : 'border-white/10 text-slate-500 hover:border-white/20'}`}>
                {s}
              </button>
            )
          })}
        </div>
      </div>

      <div className="text-xs text-slate-500 font-rajdhani mb-3">{filtered.length} victims shown</div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((v, i) => <VictimCard key={v.id || v.trackingId || i} victim={v} />)}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-500 font-rajdhani">No victims match the current filters</div>
      )}
    </div>
  )
}
