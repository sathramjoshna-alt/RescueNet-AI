import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Radio, Satellite, Wifi, WifiOff, PhoneOff, MapPin, Shield,
  Clock, CheckCircle, AlertTriangle, Activity, ChevronRight,
  Navigation, User, MessageSquare
} from 'lucide-react'
import { useApp, RESCUE_STAGES } from '../context/AppContext'
import { GlassCard } from '../components/UI'

// ─── Comm Status Banner ───────────────────────────────────────────────────
function CommBanner({ satellite, signal }) {
  return (
    <div className="glass-card border border-blue-500/20 mb-4">
      <div className="font-orbitron text-xs text-blue-400 mb-3">COMMUNICATION STATUS</div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { label: 'Internet', status: 'OFFLINE', ok: false, icon: WifiOff, desc: 'Terrestrial link down' },
          { label: 'Cell Tower', status: 'FAILED',  ok: false, icon: PhoneOff, desc: 'Tower damaged' },
          { label: 'Satellite',  status: 'CONNECTED', ok: true, icon: Satellite, desc: satellite || 'VIASAT-LEO-01' },
          { label: 'Comm Link',  status: 'ACTIVE', ok: true, icon: Activity, desc: `Signal: ${signal || 94}%` },
        ].map(item => {
          const Icon = item.icon
          return (
            <div key={item.label} className={`p-3 rounded-xl border ${item.ok ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-rose-500/20 bg-rose-500/5'}`}>
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2 h-2 rounded-full ${item.ok ? 'status-online' : 'status-offline'}`} />
                <span className="text-xs font-rajdhani text-slate-400">{item.label}</span>
              </div>
              <div className={`font-orbitron font-bold text-sm ${item.ok ? 'text-emerald-400' : 'text-rose-400'}`}>{item.status}</div>
              <div className="text-xs text-slate-600 font-rajdhani mt-0.5">{item.desc}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── SOS Button ───────────────────────────────────────────────────────────
function SOSButton({ onSOS, loading }) {
  return (
    <div className="glass-card border border-rose-500/25 mb-4 text-center">
      <div className="font-orbitron text-xs text-rose-400 mb-3">EMERGENCY SOS</div>
      <p className="text-sm text-slate-400 font-rajdhani mb-4">
        Press the SOS button if you are in danger. AI will automatically select the best satellite to send your distress signal.
      </p>
      <button
        onClick={onSOS}
        disabled={loading}
        className="relative w-32 h-32 rounded-full bg-gradient-to-br from-rose-700 to-rose-500 border-4 border-rose-400/40 mx-auto flex flex-col items-center justify-center gap-1 hover:scale-105 transition-transform shadow-glow-rd disabled:opacity-60"
        style={{ boxShadow: '0 0 40px rgba(244,63,94,0.35)' }}
      >
        {loading ? (
          <div className="spinner w-8 h-8" />
        ) : (
          <>
            <Radio size={28} className="text-white" />
            <span className="font-orbitron text-xs font-black text-white tracking-widest">SOS</span>
          </>
        )}
        {!loading && (
          <div className="absolute inset-0 rounded-full border-2 border-rose-400/30 animate-ping" />
        )}
      </button>
      <Link to="/comm-simulation" className="inline-flex items-center gap-1 mt-4 text-xs text-blue-400 hover:text-blue-300 font-rajdhani transition-colors">
        <Zap size={11} />View full communication simulation
      </Link>
    </div>
  )
}

// ─── Mission Tracker ──────────────────────────────────────────────────────
function MissionTracker({ mission }) {
  if (!mission) {
    return (
      <GlassCard className="border border-blue-500/15 mb-4">
        <div className="font-orbitron text-xs text-blue-400 mb-3">RESCUE STATUS</div>
        <div className="text-center py-6 text-slate-500 font-rajdhani">
          <CheckCircle size={28} className="mx-auto mb-2 text-slate-700" />
          No active rescue mission
        </div>
      </GlassCard>
    )
  }

  const stage = RESCUE_STAGES[mission.stageIndex || 0]
  const etaMins = Math.floor((mission.etaSecondsLeft || 0) / 60)
  const etaSecs = (mission.etaSecondsLeft || 0) % 60
  const pad = n => String(n).padStart(2, '0')

  return (
    <GlassCard className="border border-blue-500/20 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="font-orbitron text-xs text-blue-400">LIVE RESCUE TRACKING</div>
        <span className="text-xs bg-blue-500/15 border border-blue-500/25 text-blue-400 px-2 py-0.5 rounded-full font-orbitron">{stage?.label}</span>
      </div>

      {/* ETA countdown */}
      <div className="text-center mb-4 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
        <div className="text-xs text-slate-500 font-rajdhani mb-1">ETA TO RESCUE</div>
        <div className="font-orbitron text-3xl font-black eta-pulse">
          {etaMins > 0 ? `${pad(etaMins)}:${pad(etaSecs)}` : etaSecs > 0 ? `00:${pad(etaSecs)}` : '🚁 ARRIVED'}
        </div>
        <div className="text-xs text-slate-600 font-rajdhani mt-1">{mission.teamName} en route via {mission.satellite}</div>
      </div>

      {/* Stages */}
      <div className="space-y-1.5">
        {RESCUE_STAGES.map((s, i) => {
          const done = i < (mission.stageIndex || 0)
          const active = i === (mission.stageIndex || 0)
          return (
            <div key={s.key} className={`flex items-center gap-3 px-3 py-2 rounded-lg border text-xs font-rajdhani transition-all ${active ? 'stage-active' : done ? 'stage-done' : 'stage-pending opacity-50'}`}>
              <span className="w-5 text-center">{s.icon}</span>
              <span className={`font-semibold ${active ? 'text-blue-300' : done ? 'text-emerald-400' : 'text-slate-600'}`}>{s.label}</span>
              {done && <CheckCircle size={12} className="ml-auto text-emerald-400" />}
              {active && <div className="ml-auto w-2 h-2 rounded-full bg-blue-400 animate-pulse" />}
            </div>
          )
        })}
      </div>

      {/* Assigned team */}
      <div className="mt-3 p-2 rounded-lg bg-blue-500/5 border border-blue-500/10 flex items-center gap-3 text-xs font-rajdhani">
        <Shield size={14} className="text-blue-400 flex-shrink-0" />
        <div>
          <div className="text-white font-semibold">{mission.teamName}</div>
          <div className="text-slate-500">GPS: {mission.gps || 'Tracking…'}</div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-emerald-400 font-orbitron text-xs">{mission.satellite}</div>
          <div className="text-slate-600">Comm: Active</div>
        </div>
      </div>
    </GlassCard>
  )
}

// ─── Emergency Contacts ───────────────────────────────────────────────────
const CONTACTS = [
  { name: 'National Disaster Helpline', number: '1078', type: 'Disaster' },
  { name: 'Police Emergency', number: '100', type: 'Police' },
  { name: 'Ambulance', number: '108', type: 'Medical' },
  { name: 'Fire Department', number: '101', type: 'Fire' },
]

// Zap icon is needed
import { Zap } from 'lucide-react'

export default function UserDashboard() {
  const { user, activeMissions, victimTracking, satellites, dispatchSOS, pushNotification } = useApp()
  const navigate = useNavigate()
  const [sosLoading, setSosLoading] = useState(false)
  const [sosSubmitted, setSosSubmitted] = useState(false)

  // Find any active mission for this user (by name match)
  const myTracking = victimTracking.find(v => v.name === user?.name)
  const myMission = myTracking
    ? activeMissions.find(m => m.sosId === myTracking.trackingId)
    : null

  const activeSat = satellites.find(s => s.type === 'LEO' && s.status === 'active')

  const handleSOS = () => {
    setSosLoading(true)
    setTimeout(() => {
      dispatchSOS({
        name: user?.name || 'Emergency User',
        location: 'Current Location',
        lat: 22.5726,
        lng: 88.3639,
        gps: '22.5726°N, 88.3639°E',
        priority: 'Critical',
        type: 'Flood',
        medical: 'Requires immediate assistance',
      })
      setSosLoading(false)
      setSosSubmitted(true)
      pushNotification('critical', '🆘 SOS Sent via Satellite — Help is on the way!')
    }, 2000)
  }

  const missionHistory = [
    { date: '2025-08-12', type: 'Flood', status: 'Rescued', team: 'Alpha Strike', duration: '34 min' },
    { date: '2025-06-03', type: 'Cyclone', status: 'Rescued', team: 'Bravo Medical', duration: '48 min' },
  ]

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <User size={14} className="text-blue-400" />
          <span className="font-orbitron text-xs text-blue-400 tracking-widest">USER DASHBOARD</span>
        </div>
        <h1 className="font-orbitron text-xl font-black text-white">Welcome, {user?.name}</h1>
        <p className="text-xs text-slate-500 font-rajdhani mt-1">Emergency communication portal — satellite-connected</p>
      </div>

      {/* SOS success banner */}
      {sosSubmitted && !myMission && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-3">
          <Satellite size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm font-rajdhani">
            <div className="font-semibold text-emerald-400">🛰 SOS Transmitted via Satellite!</div>
            <div className="text-slate-400 text-xs mt-0.5">Your emergency signal was routed through {activeSat?.name || 'VIASAT-LEO-01'}. Mission Control notified. Rescue team being assigned.</div>
          </div>
        </div>
      )}

      {/* Comm status */}
      <CommBanner satellite={activeSat?.name} signal={activeSat ? Math.round(activeSat.signal) : 94} />

      {/* SOS button or mission tracker */}
      {myMission ? (
        <MissionTracker mission={myMission} />
      ) : (
        <SOSButton onSOS={handleSOS} loading={sosLoading} />
      )}

      {/* Current location */}
      <GlassCard className="border border-blue-500/15 mb-4">
        <div className="font-orbitron text-xs text-blue-400 mb-3">CURRENT LOCATION</div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
            <MapPin size={16} className="text-blue-400" />
          </div>
          <div>
            <div className="text-sm font-rajdhani font-semibold text-white">22.5726°N, 88.3639°E</div>
            <div className="text-xs text-slate-500 font-rajdhani">Kolkata, West Bengal · GPS Locked</div>
          </div>
          <div className="ml-auto text-xs text-emerald-400 font-orbitron">LIVE</div>
        </div>
      </GlassCard>

      {/* Mission history */}
      <GlassCard className="border border-blue-500/15 mb-4">
        <div className="font-orbitron text-xs text-blue-400 mb-3">MISSION HISTORY</div>
        {missionHistory.map((m, i) => (
          <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0 text-xs font-rajdhani">
            <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-white font-semibold">{m.type} — {m.date}</div>
              <div className="text-slate-500">Team: {m.team} · Duration: {m.duration}</div>
            </div>
            <span className="text-emerald-400 font-semibold">{m.status}</span>
          </div>
        ))}
      </GlassCard>

      {/* Emergency contacts */}
      <GlassCard className="border border-blue-500/15">
        <div className="font-orbitron text-xs text-blue-400 mb-3">EMERGENCY CONTACTS</div>
        <div className="grid grid-cols-2 gap-2">
          {CONTACTS.map(c => (
            <div key={c.name} className="flex items-center gap-2 p-2 rounded-lg bg-white/3 border border-white/5 text-xs font-rajdhani">
              <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-rose-400 font-bold text-sm">{c.number[0]}</span>
              </div>
              <div>
                <div className="text-white font-semibold leading-tight">{c.number}</div>
                <div className="text-slate-600 leading-tight" style={{ fontSize: 10 }}>{c.type}</div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
