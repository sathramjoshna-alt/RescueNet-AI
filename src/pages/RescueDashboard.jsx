import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Shield, MapPin, Clock, CheckCircle, AlertTriangle, Satellite,
  Radio, Navigation, Activity, Users, ChevronRight, MessageSquare,
  Truck, Phone, Wifi, X
} from 'lucide-react'
import { useApp, RESCUE_STAGES } from '../context/AppContext'
import { GlassCard, Badge } from '../components/UI'

// ─── Elapsed timer ────────────────────────────────────────────────────────
function ElapsedTimer({ seconds }) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  const pad = n => String(n).padStart(2, '0')
  return (
    <span className="font-orbitron text-emerald-400">
      {h > 0 ? `${pad(h)}:` : ''}{pad(m)}:{pad(s)}
    </span>
  )
}

// ─── SOS Notification card ────────────────────────────────────────────────
function SOSNotifCard({ sos, onAccept, onReject }) {
  const [accepting, setAccepting] = useState(false)

  const handleAccept = () => {
    setAccepting(true)
    setTimeout(() => onAccept(sos.id), 800)
  }

  const priorityBorder = {
    Critical: 'border-rose-500/50 bg-rose-500/5',
    High:     'border-amber-500/40 bg-amber-500/5',
    Medium:   'border-blue-500/20',
    Low:      'border-slate-600/20',
  }

  return (
    <div className={`glass-card border rounded-xl p-4 critical-blink transition-all ${priorityBorder[sos.priority] || 'border-rose-500/40'}`}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center animate-pulse flex-shrink-0">
            <Radio size={16} className="text-rose-400" />
          </div>
          <div>
            <div className="font-orbitron text-xs font-bold text-rose-400">🚨 NEW SOS RECEIVED</div>
            <div className="font-rajdhani text-sm font-bold text-white">{sos.name}</div>
          </div>
        </div>
        <Badge text={sos.priority} type={sos.priority?.toLowerCase()} />
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3 text-xs font-rajdhani">
        <div className="flex items-center gap-1.5 text-slate-400">
          <MapPin size={11} className="text-blue-400 flex-shrink-0" />
          <span className="truncate">{sos.location}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <AlertTriangle size={11} className="text-amber-400 flex-shrink-0" />
          <span>{sos.type}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <Satellite size={11} className="text-blue-400 flex-shrink-0" />
          <span>{sos.satellite || sos.satelliteName || 'LEO-01'}</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
          <Activity size={11} className="flex-shrink-0" />
          Active via Satellite
        </div>
        {sos.medical && (
          <div className="col-span-2 flex items-center gap-1.5 text-rose-400 text-xs bg-rose-500/5 px-2 py-1 rounded">
            <span className="flex-shrink-0">⚕️</span>
            <span className="font-semibold">{sos.medical}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleAccept}
          disabled={accepting}
          className="flex-1 btn-emerald py-2 text-xs flex items-center justify-center gap-1.5"
        >
          {accepting ? <><div className="spinner w-3.5 h-3.5" />Accepting…</> : <><CheckCircle size={13} />Accept Mission</>}
        </button>
        <button
          onClick={() => onReject(sos.id)}
          className="flex-1 btn-danger py-2 text-xs flex items-center justify-center gap-1.5"
        >
          <X size={13} />Reject
        </button>
      </div>
    </div>
  )
}

// ─── Active mission card ──────────────────────────────────────────────────
function ActiveMissionCard({ mission, onComplete }) {
  const stage = RESCUE_STAGES[mission.stageIndex || 0]
  const etaMins = Math.floor((mission.etaSecondsLeft || 0) / 60)
  const etaSecs = (mission.etaSecondsLeft || 0) % 60
  const pad = n => String(n).padStart(2, '0')
  const navigate = useNavigate()

  return (
    <div className="glass-card border border-emerald-500/25">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-orbitron text-xs text-emerald-400">ACTIVE MISSION</div>
          <div className="font-rajdhani text-base font-bold text-white mt-0.5">{mission.victim}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500 font-rajdhani">Elapsed</div>
          <ElapsedTimer seconds={mission.elapsedSeconds || 0} />
        </div>
      </div>

      {/* Stage progress bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-rajdhani text-slate-400">Mission Progress</span>
          <span className="text-xs font-orbitron text-blue-400">{stage?.label}</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-500"
            style={{ width: `${(((mission.stageIndex || 0) + 1) / RESCUE_STAGES.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Stage list */}
      <div className="grid grid-cols-2 gap-1.5 mb-3">
        {RESCUE_STAGES.map((s, i) => {
          const done = i < (mission.stageIndex || 0)
          const active = i === (mission.stageIndex || 0)
          return (
            <div key={s.key} className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-rajdhani border ${active ? 'stage-active' : done ? 'stage-done' : 'stage-pending opacity-40'}`}>
              <span style={{ fontSize: 12 }}>{s.icon}</span>
              <span className={active ? 'text-blue-300' : done ? 'text-emerald-400' : 'text-slate-600'}>{s.label}</span>
              {done && <CheckCircle size={10} className="ml-auto text-emerald-400" />}
            </div>
          )
        })}
      </div>

      {/* Info row */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: 'ETA', value: etaMins > 0 ? `${pad(etaMins)}:${pad(etaSecs)}` : etaSecs > 0 ? `00:${pad(etaSecs)}` : 'Arrived', color: 'text-emerald-400' },
          { label: 'Satellite', value: mission.satellite, color: 'text-blue-400' },
          { label: 'Priority', value: mission.priority, color: mission.priority === 'Critical' ? 'text-rose-400' : 'text-amber-400' },
        ].map(item => (
          <div key={item.label} className="p-2 rounded-lg bg-white/3 border border-white/5 text-center">
            <div className={`font-orbitron text-sm font-bold ${item.color}`}>{item.value}</div>
            <div className="text-xs text-slate-600 font-rajdhani">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={() => navigate('/map')} className="flex-1 btn-primary py-2 text-xs flex items-center justify-center gap-1.5">
          <Navigation size={12} />Track on Map
        </button>
        {(mission.stageIndex || 0) >= RESCUE_STAGES.length - 2 && (
          <button onClick={() => onComplete(mission.id)} className="flex-1 btn-emerald py-2 text-xs flex items-center justify-center gap-1.5">
            <CheckCircle size={12} />Mission Complete
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Nearby teams panel ───────────────────────────────────────────────────
function NearbyTeams({ teams }) {
  return (
    <GlassCard className="border border-blue-500/15">
      <div className="font-orbitron text-xs text-blue-400 mb-3">NEARBY RESCUE TEAMS</div>
      <div className="space-y-2">
        {teams.slice(0, 4).map(team => (
          <div key={team.id} className="flex items-center gap-2 p-2 rounded-lg bg-white/3 border border-white/5 text-xs font-rajdhani">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${team.status === 'Active' ? 'status-online' : 'status-warning'}`} />
            <div className="flex-1 min-w-0">
              <div className="text-white font-semibold truncate">{team.name}</div>
              <div className="text-slate-500">{team.type} · {team.members} members</div>
            </div>
            <span className={`font-orbitron flex-shrink-0 ${team.status === 'Active' ? 'text-emerald-400' : 'text-amber-400'}`} style={{ fontSize: 9 }}>{team.status}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────
export default function RescueDashboard() {
  const { user, pendingSOS, activeMissions, rescueTeams, acceptMission, rejectMission, completeMission, satellites } = useApp()
  const navigate = useNavigate()

  const activeSat = satellites.find(s => s.type === 'LEO' && s.status === 'active')

  // For the rescue team user, show missions assigned to their team
  const myTeamId = user?.teamId || 'RT-001'
  const myMissions = activeMissions.filter(m => m.teamId === myTeamId || m.teamId === undefined)

  const statsData = [
    { label: 'Active Missions', value: myMissions.length, color: 'text-blue-400' },
    { label: 'Pending SOS', value: pendingSOS.length, color: 'text-rose-400' },
    { label: 'Victims Rescued', value: 156, color: 'text-emerald-400' },
    { label: 'Signal Strength', value: `${activeSat ? Math.round(activeSat.signal) : 94}%`, color: 'text-blue-400' },
  ]

  return (
    <div className="p-4 sm:p-6 max-w-screen-lg mx-auto">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <Shield size={14} className="text-emerald-400" />
          <span className="font-orbitron text-xs text-emerald-400 tracking-widest">RESCUE TEAM DASHBOARD</span>
        </div>
        <h1 className="font-orbitron text-xl font-black text-white">
          {user?.teamName || 'Alpha Strike Team'}
        </h1>
        <p className="text-xs text-slate-500 font-rajdhani mt-1">
          Commander: {user?.name} · Satellite: {activeSat?.name || 'VIASAT-LEO-01'} · Signal: {activeSat ? Math.round(activeSat.signal) : 94}%
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {statsData.map(s => (
          <div key={s.label} className="glass-card border border-blue-500/15 text-center py-3">
            <div className={`font-orbitron text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-500 font-rajdhani mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Comm status strip */}
      <div className="glass-card border border-blue-500/15 mb-5 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full status-online" />
          <span className="text-xs font-rajdhani text-emerald-400 font-semibold">Satellite Link Active</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-rajdhani text-slate-400">
          <span>Satellite: <span className="text-blue-400">{activeSat?.name?.split('-').slice(-2).join('-') || 'LEO-01'}</span></span>
          <span>Signal: <span className="text-emerald-400">{activeSat ? Math.round(activeSat.signal) : 94}%</span></span>
          <span>Latency: <span className="text-blue-400">{activeSat ? Math.round(activeSat.latency) : 28}ms</span></span>
        </div>
        <Link to="/mission-control" className="text-xs text-blue-400 hover:text-blue-300 font-rajdhani flex items-center gap-1">
          Open Comm Center <ChevronRight size={12} />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: SOS queue */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-orbitron text-xs text-rose-400">INCOMING SOS</div>
            {pendingSOS.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/25 text-rose-400 text-xs font-orbitron badge-pulse">
                {pendingSOS.length} NEW
              </span>
            )}
          </div>

          {pendingSOS.length === 0 && (
            <div className="glass-card border border-blue-500/10 py-8 text-center text-slate-600 font-rajdhani text-sm">
              <Radio size={24} className="mx-auto mb-2 text-slate-700" />
              No pending SOS requests
            </div>
          )}

          {pendingSOS.map(sos => (
            <SOSNotifCard key={sos.id} sos={sos} onAccept={acceptMission} onReject={rejectMission} />
          ))}
        </div>

        {/* Center: Active missions */}
        <div className="lg:col-span-1 space-y-3">
          <div className="font-orbitron text-xs text-blue-400">ACTIVE MISSIONS</div>

          {activeMissions.length === 0 && (
            <div className="glass-card border border-blue-500/10 py-8 text-center text-slate-600 font-rajdhani text-sm">
              <Shield size={24} className="mx-auto mb-2 text-slate-700" />
              No active missions
            </div>
          )}

          {activeMissions.map(mission => (
            <ActiveMissionCard key={mission.id} mission={mission} onComplete={completeMission} />
          ))}
        </div>

        {/* Right: Teams + map link */}
        <div className="lg:col-span-1 space-y-3">
          <NearbyTeams teams={rescueTeams} />

          <GlassCard className="border border-blue-500/15">
            <div className="font-orbitron text-xs text-blue-400 mb-3">QUICK ACTIONS</div>
            <div className="space-y-2">
              {[
                { label: 'Live Disaster Map', path: '/map', icon: MapPin, color: 'text-blue-400' },
                { label: 'Victim List', path: '/victims', icon: Users, color: 'text-blue-400' },
                { label: 'Mission Control', path: '/mission-control', icon: Satellite, color: 'text-blue-400' },
              ].map(item => {
                const Icon = item.icon
                return (
                  <Link key={item.path} to={item.path} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/3 border border-white/5 hover:bg-blue-500/8 hover:border-blue-500/20 transition-all">
                    <Icon size={14} className={item.color} />
                    <span className="text-xs font-rajdhani text-slate-300">{item.label}</span>
                    <ChevronRight size={12} className="ml-auto text-slate-600" />
                  </Link>
                )
              })}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
