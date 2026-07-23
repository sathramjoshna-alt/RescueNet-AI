import React, { useState, useEffect } from 'react'
import { Shield, Users, MapPin, Target, CheckCircle, Clock, AlertTriangle, Satellite, Radio, X, Navigation, Zap, Activity } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { StatCard, Badge, ProgressBar, GlassCard, SectionHeader } from '../components/UI'

const teamColors = {
  'Ground Rescue': 'cyan', 'Medical': 'green', 'Water Rescue': 'blue',
  'Aerial Rescue': 'purple', 'Search & Rescue': 'amber', 'Firefighting': 'red',
}
const teamIcons = {
  'Ground Rescue': '🚒', 'Medical': '🏥', 'Water Rescue': '⛵',
  'Aerial Rescue': '🚁', 'Search & Rescue': '🔍', 'Firefighting': '🔥',
}

// ── Elapsed timer display ────────────────────────────────────────────────
function ElapsedTimer({ seconds }) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  const pad = n => String(n).padStart(2, '0')
  return (
    <span className="font-orbitron text-cyan-400">
      {h > 0 ? `${pad(h)}:` : ''}{pad(m)}:{pad(s)}
    </span>
  )
}

// ── SOS Notification Card ─────────────────────────────────────────────────
function SOSNotificationCard({ sos, onAccept, onReject }) {
  const [accepting, setAccepting] = useState(false)
  const [rejecting, setRejecting] = useState(false)

  const handleAccept = () => {
    setAccepting(true)
    setTimeout(() => { onAccept(sos.id) }, 800)
  }
  const handleReject = () => {
    setRejecting(true)
    setTimeout(() => { onReject(sos.id) }, 600)
  }

  const priorityBorder = {
    Critical: 'border-red-500/60 bg-red-500/5',
    High:     'border-amber-500/50 bg-amber-500/5',
    Medium:   'border-yellow-500/40 bg-yellow-500/5',
    Low:      'border-slate-500/30',
  }

  return (
    <div className={`glass-card border rounded-xl p-4 transition-all critical-blink ${priorityBorder[sos.priority] || 'border-red-500/40'}`}>
      {/* Title row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center animate-pulse flex-shrink-0">
            <Radio size={15} className="text-red-400" />
          </div>
          <div>
            <div className="font-orbitron text-xs font-bold text-red-400 tracking-wide">🚨 NEW SOS RECEIVED</div>
            <div className="font-rajdhani text-sm font-bold text-white">{sos.name}</div>
          </div>
        </div>
        <Badge text={sos.priority} type={sos.priority.toLowerCase()} />
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-xs font-rajdhani">
        {[
          { icon: MapPin,    label: 'Location',   value: sos.location,         color: 'text-cyan-400' },
          { icon: Navigation, label: 'GPS',       value: sos.gps || `${sos.lat?.toFixed(4)}°N`, color: 'text-cyan-400' },
          { icon: AlertTriangle, label: 'Disaster', value: sos.type,           color: 'text-amber-400' },
          { icon: Satellite, label: 'Satellite',  value: sos.satellite || 'LEO', color: 'text-purple-400' },
          { icon: Clock,     label: 'Time Rcvd',  value: sos.time,             color: 'text-slate-300' },
          { icon: Clock,     label: 'Est. Arrival', value: sos.eta || 'Calculating…', color: 'text-green-400' },
          { icon: Shield,    label: 'Nearest Team', value: sos.nearestTeam || '—', color: 'text-amber-400' },
          { icon: Activity,  label: 'Signal',     value: `${sos.signal || 94}%`, color: 'text-green-400' },
        ].map(item => {
          const Icon = item.icon
          return (
            <div key={item.label} className="flex items-start gap-1.5 p-2 rounded bg-white/3 border border-white/5">
              <Icon size={10} className="text-slate-500 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-slate-500" style={{ fontSize: 9 }}>{item.label}</div>
                <div className={`font-semibold truncate ${item.color}`}>{item.value}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Medical note */}
      {sos.medical && (
        <div className="mb-3 px-2 py-1.5 rounded bg-red-500/5 border border-red-500/20 text-xs font-rajdhani text-red-300">
          ⚕️ Medical: {sos.medical}
        </div>
      )}

      {/* Comm status */}
      <div className="flex items-center gap-2 mb-3 text-xs font-rajdhani">
        <Satellite size={11} className="text-cyan-400" />
        <span className="text-slate-400">Comm:</span>
        <span className="text-green-400 font-semibold">{sos.commStatus || 'Active via Satellite'}</span>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button onClick={handleAccept} disabled={accepting || rejecting}
          className="flex-1 py-2.5 rounded-lg font-orbitron text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all hover:opacity-90 disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg,#10b981,#059669)', boxShadow: '0 0 12px rgba(16,185,129,0.35)' }}>
          {accepting ? <><div className="spinner w-3 h-3" /> Accepting…</> : <><CheckCircle size={13} /> Accept Mission</>}
        </button>
        <button onClick={handleReject} disabled={accepting || rejecting}
          className="flex-1 py-2.5 rounded-lg font-orbitron text-xs font-bold text-red-400 flex items-center justify-center gap-1.5 border border-red-500/40 hover:bg-red-500/10 transition-all disabled:opacity-60">
          {rejecting ? <><div className="spinner w-3 h-3" /> Rejecting…</> : <><X size={13} /> Reject Mission</>}
        </button>
      </div>
    </div>
  )
}

// ── Active mission card ───────────────────────────────────────────────────
function ActiveMissionCard({ mission }) {
  const navigate = useNavigate()
  return (
    <div className="glass-card border border-green-500/40 bg-green-500/3 p-4 rounded-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="font-orbitron text-xs text-green-400 font-bold">MISSION ACTIVE</span>
        </div>
        <div className="font-orbitron text-xs text-slate-400">{mission.id}</div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3 text-xs font-rajdhani">
        {[
          { label: 'Victim',   value: mission.victim,   color: 'text-white' },
          { label: 'Team',     value: mission.teamName,  color: 'text-amber-400' },
          { label: 'Disaster', value: mission.disaster,  color: 'text-amber-400' },
          { label: 'GPS',      value: mission.gps,       color: 'text-cyan-400' },
          { label: 'Satellite',value: mission.satellite, color: 'text-purple-400' },
          { label: 'ETA',      value: mission.eta,       color: 'text-green-400' },
          { label: 'Comm',     value: mission.commStatus,color: 'text-green-400' },
          { label: 'Accepted', value: mission.acceptedAt,color: 'text-slate-300' },
        ].map(m => (
          <div key={m.label} className="p-2 rounded bg-white/3 border border-white/5">
            <div className="text-slate-500" style={{ fontSize: 9 }}>{m.label}</div>
            <div className={`font-semibold truncate ${m.color}`}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Live timer */}
      <div className="flex items-center justify-between p-2 rounded bg-black/20 border border-green-500/20 mb-3">
        <div className="text-xs text-slate-400 font-rajdhani">Mission Elapsed Time</div>
        <ElapsedTimer seconds={mission.elapsedSeconds} />
      </div>

      <div className="flex gap-2">
        <button onClick={() => navigate('/map')}
          className="flex-1 py-2 rounded text-xs font-rajdhani border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 flex items-center justify-center gap-1">
          <MapPin size={11} /> Track on Map
        </button>
        <button onClick={() => navigate('/victims')}
          className="flex-1 py-2 rounded text-xs font-rajdhani border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 flex items-center justify-center gap-1">
          <Users size={11} /> Victim Status
        </button>
      </div>
    </div>
  )
}

// ── Team card ─────────────────────────────────────────────────────────────
function TeamCard({ team }) {
  const color = teamColors[team.type] || 'cyan'
  const cMap = {
    cyan:   { text: 'text-cyan-400',   border: 'border-cyan-500/20',   bg: 'bg-cyan-500/10' },
    green:  { text: 'text-green-400',  border: 'border-green-500/20',  bg: 'bg-green-500/10' },
    purple: { text: 'text-purple-400', border: 'border-purple-500/20', bg: 'bg-purple-500/10' },
    amber:  { text: 'text-amber-400',  border: 'border-amber-500/20',  bg: 'bg-amber-500/10' },
    red:    { text: 'text-red-400',    border: 'border-red-500/20',    bg: 'bg-red-500/10' },
    blue:   { text: 'text-blue-400',   border: 'border-blue-500/20',   bg: 'bg-blue-500/10' },
  }
  const c = cMap[color]
  return (
    <GlassCard>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${c.bg} ${c.border} border flex items-center justify-center text-xl`}>
            {teamIcons[team.type]}
          </div>
          <div>
            <div className="font-orbitron text-sm font-bold text-white">{team.name}</div>
            <div className={`text-xs ${c.text} font-rajdhani`}>{team.type}</div>
          </div>
        </div>
        <Badge text={team.status} type={team.status.toLowerCase()} />
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3 text-xs font-rajdhani">
        <div className="bg-white/3 rounded p-2">
          <div className="text-slate-500">Location</div>
          <div className="text-slate-200 flex items-center gap-1 mt-0.5">
            <MapPin size={10} className="text-cyan-400" />{team.location}
          </div>
        </div>
        <div className="bg-white/3 rounded p-2">
          <div className="text-slate-500">Members</div>
          <div className={`font-orbitron font-bold ${c.text}`}>{team.members}</div>
        </div>
        <div className="bg-white/3 rounded p-2">
          <div className="text-slate-500">Rescued</div>
          <div className="text-green-400 font-orbitron font-bold">{team.victims_rescued}</div>
        </div>
        <div className="bg-white/3 rounded p-2">
          <div className="text-slate-500">Status</div>
          <div className={`${team.status === 'Active' ? 'text-green-400' : 'text-slate-400'} font-semibold`}>{team.status}</div>
        </div>
      </div>
      <div className="p-2 rounded bg-white/3 border border-white/5 text-xs font-rajdhani">
        <span className="text-slate-500">Mission: </span>
        <span className="text-slate-300">{team.mission}</span>
      </div>
    </GlassCard>
  )
}

// ── AI Rescue Prioritization ──────────────────────────────────────────────
function AIRescuePriority() {
  const victims = [
    { name: 'Baby Meera',    age: 0.5, type: 'Infant — Hypothermia',  score: 98, priority: 'Critical', factors: ['Infant','Medical Emergency','Temperature'] },
    { name: 'Priya Sharma',  age: 34,  type: 'Head Injury — Flood',   score: 92, priority: 'Critical', factors: ['Head Trauma','Rising Water','Isolated'] },
    { name: 'Sunita Devi',   age: 28,  type: 'Pregnant — 8 Months',   score: 88, priority: 'High',     factors: ['Pregnant','Flood Zone','No Shelter'] },
    { name: 'Rajan Kumar',   age: 67,  type: 'Elderly — Exhaustion',   score: 81, priority: 'High',     factors: ['Elderly','Heart Risk','Remote'] },
    { name: 'Arjun Singh',   age: 12,  type: 'Child — Fracture',       score: 76, priority: 'High',     factors: ['Child','Injury','Flood Zone'] },
    { name: 'Deepak Nair',   age: 38,  type: 'Minor Injuries',         score: 52, priority: 'Medium',   factors: ['Minor Injury','Shelter Available'] },
  ]
  return (
    <GlassCard>
      <SectionHeader title="AI Rescue Prioritization" subtitle="ML urgency ranking" icon={Target} />
      <div className="space-y-2">
        {victims.map((v, i) => (
          <div key={i} className={`flex items-center gap-3 p-2.5 rounded-lg border ${v.priority === 'Critical' ? 'bg-red-500/5 border-red-500/20' : v.priority === 'High' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-white/3 border-white/5'}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-orbitron font-bold flex-shrink-0 ${v.priority === 'Critical' ? 'bg-red-500/20 text-red-400' : v.priority === 'High' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700 text-slate-300'}`}>{i+1}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-semibold text-white font-rajdhani">{v.name}</span>
                <span className="text-xs text-slate-500 font-rajdhani">Age: {v.age < 1 ? `${Math.round(v.age*12)}mo` : `${v.age}y`}</span>
                <Badge text={v.priority} type={v.priority.toLowerCase()} />
              </div>
              <div className="text-xs text-slate-500 font-rajdhani">{v.type}</div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-orbitron text-base font-bold text-cyan-400">{v.score}</div>
              <div className="text-xs text-slate-600 font-rajdhani">AI Score</div>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}

// ── Main export ───────────────────────────────────────────────────────────
export default function RescueOps() {
  const navigate = useNavigate()
  const {
    missionStats, pendingSOS, pendingSOSCount,
    activeMissions, rescueTeams, acceptMission, rejectMission,
  } = useApp()

  const [showNotifPanel, setShowNotifPanel] = useState(true)

  // Auto-open panel when new SOS arrives
  useEffect(() => {
    if (pendingSOS.length > 0) setShowNotifPanel(true)
  }, [pendingSOS.length])

  const handleAccept = (sosId) => acceptMission(sosId)
  const handleReject = (sosId) => rejectMission(sosId)

  return (
    <div className="p-4 sm:p-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="font-orbitron text-lg font-bold text-white mb-0.5">RESCUE OPERATIONS</h1>
          <p className="text-xs text-slate-500 font-rajdhani">Active field teams · AI dispatch · Real-time satellite coordination</p>
        </div>
        <div className="flex items-center gap-2">
          {pendingSOSCount > 0 && (
            <button onClick={() => setShowNotifPanel(p => !p)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg font-orbitron text-xs font-bold text-white critical-blink"
              style={{ background: 'linear-gradient(135deg,#ef4444,#b91c1c)', boxShadow: '0 0 16px rgba(239,68,68,0.45)' }}>
              <Radio size={14} />
              🚨 {pendingSOSCount} PENDING SOS
            </button>
          )}
          <button onClick={() => navigate('/comm-simulation')}
            className="px-3 py-2 rounded text-xs font-rajdhani border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
            + Send SOS
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <StatCard label="Teams Deployed"   value={missionStats.teamsDeployed}          icon={Users}          color="cyan" />
        <StatCard label="Victims Rescued"  value={missionStats.rescued.toLocaleString()} icon={Shield}        color="green" />
        <StatCard label="Critical Cases"   value={missionStats.criticalCases}          icon={Target}         color="red" animate />
        <StatCard label="Active Missions"  value={activeMissions.length}               icon={Activity}       color="amber" />
      </div>

      {/* ── SOS Notification Panel ── */}
      {showNotifPanel && pendingSOS.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <span className="font-orbitron text-sm font-bold text-red-400">
                INCOMING SOS ALERTS — {pendingSOS.length} Pending
              </span>
            </div>
            <button onClick={() => setShowNotifPanel(false)}
              className="text-slate-500 hover:text-slate-300 text-xs font-rajdhani flex items-center gap-1">
              <X size={12} /> Minimize
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingSOS.map(sos => (
              <SOSNotificationCard
                key={sos.id}
                sos={sos}
                onAccept={handleAccept}
                onReject={handleReject}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Active Missions ── */}
      {activeMissions.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="font-orbitron text-sm font-bold text-green-400">
              ACTIVE MISSIONS — {activeMissions.length} in progress
            </span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeMissions.map(m => (
              <ActiveMissionCard key={m.id} mission={m} />
            ))}
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <AIRescuePriority />
        </div>
        <div>
          <GlassCard>
            <SectionHeader title="Mission Summary" icon={CheckCircle} />
            <div className="space-y-3">
              {[
                { label: 'Overall Progress',   value: missionStats.rescued, max: missionStats.totalVictims, color: 'green' },
                { label: 'Critical Resolved',  value: 78,  max: 100, color: 'red' },
                { label: 'Resource Util.',     value: 84,  max: 100, color: 'cyan' },
                { label: 'Communication',      value: 96,  max: 100, color: 'purple' },
              ].map(m => <ProgressBar key={m.label} value={m.value} max={m.max} color={m.color} label={m.label} />)}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
              <div className="text-xs font-orbitron text-amber-400 mb-2">AI RECOMMENDATIONS</div>
              <ul className="space-y-1.5 text-xs font-rajdhani text-slate-300">
                <li className="flex gap-2"><span className="text-amber-400">▸</span>Deploy 2 medical teams to Odisha</li>
                <li className="flex gap-2"><span className="text-amber-400">▸</span>Redirect UAV-003 to infant SOS GPS</li>
                <li className="flex gap-2"><span className="text-amber-400">▸</span>Switch MEO for cyclone track coverage</li>
                <li className="flex gap-2"><span className="text-amber-400">▸</span>Forward camp at Hooghly River bend</li>
              </ul>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* ── Field Teams ── */}
      <div className="mt-5">
        <SectionHeader title="Field Teams" subtitle={`${rescueTeams.length} teams`} icon={Users} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rescueTeams.map(team => <TeamCard key={team.id} team={team} />)}
        </div>
      </div>
    </div>
  )
}
