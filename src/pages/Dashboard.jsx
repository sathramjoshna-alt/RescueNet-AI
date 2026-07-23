import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Satellite, Shield, Users, AlertTriangle, Activity, Zap,
  TrendingUp, Clock, Map, Cpu, ChevronRight, Radio, Plane,
  Wifi, WifiOff, PhoneOff, Globe, Signal, Play
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { StatCard, Badge, ProgressBar, ThreatBadge, GlassCard } from '../components/UI'
import { missionTimeline, aiPredictions, analyticsData } from '../data/mockData'

// ─── Communication Status Panel ──────────────────────────────────────────
function CommStatusPanel() {
  const { currentOrbit, networkStatus, activeSatellite } = useApp()
  const [cellStatus] = useState('FAILED')   // simulating disaster scenario
  const [internetStatus] = useState('OFFLINE')
  const [signalStrength, setSignalStrength] = useState(94)
  const [latency, setLatency] = useState(28)

  useEffect(() => {
    const t = setInterval(() => {
      setSignalStrength(s => Math.max(80, Math.min(99, s + (Math.random() - 0.5) * 3)))
      setLatency(l => Math.max(24, Math.min(38, l + (Math.random() - 0.5) * 2)))
    }, 2500)
    return () => clearInterval(t)
  }, [])

  const statusItems = [
    {
      label: 'Internet Status',
      value: internetStatus,
      icon: internetStatus === 'ONLINE' ? Wifi : WifiOff,
      ok: internetStatus === 'ONLINE',
      desc: 'Terrestrial link',
    },
    {
      label: 'Cell Tower Status',
      value: cellStatus,
      icon: PhoneOff,
      ok: cellStatus === 'ACTIVE',
      desc: 'Ground network',
    },
    {
      label: 'Satellite Status',
      value: 'CONNECTED',
      icon: Satellite,
      ok: true,
      desc: activeSatellite?.name?.split('-').slice(0,2).join('-') || 'LEO-01',
    },
    {
      label: 'Comm Status',
      value: 'RESTORED',
      icon: Radio,
      ok: true,
      desc: 'Via satellite link',
    },
  ]

  return (
    <GlassCard className="border border-cyan-500/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-cyan-500/10 flex items-center justify-center">
            <Signal size={13} className="text-cyan-400" />
          </div>
          <span className="font-orbitron text-xs font-bold text-cyan-400">COMMUNICATION STATUS</span>
        </div>
        <Link to="/comm-simulation" className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 font-rajdhani transition-colors">
          <Play size={11} /> Simulation
        </Link>
      </div>

      {/* Story banner */}
      <div className="mb-3 p-2 rounded-lg bg-gradient-to-r from-red-500/5 via-purple-500/5 to-cyan-500/5 border border-white/5">
        <div className="text-xs font-rajdhani text-center text-slate-400">
          <span className="text-red-400 font-semibold">📵 Towers FAILED</span>
          <span className="text-slate-600 mx-2">→</span>
          <span className="text-amber-400 font-semibold">🤖 AI Detected</span>
          <span className="text-slate-600 mx-2">→</span>
          <span className="text-cyan-400 font-semibold">🛰️ Satellite Active</span>
          <span className="text-slate-600 mx-2">→</span>
          <span className="text-green-400 font-semibold">✅ Comm Restored</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
        {statusItems.map(item => {
          const Icon = item.icon
          return (
            <div key={item.label} className={`p-2 rounded-lg border text-center ${item.ok ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20 critical-blink'}`}>
              <Icon size={16} className={`mx-auto mb-1 ${item.ok ? 'text-green-400' : 'text-red-400'}`} />
              <div className={`font-orbitron text-xs font-bold ${item.ok ? 'text-green-400' : 'text-red-400'}`}>{item.value}</div>
              <div className="text-xs text-slate-500 font-rajdhani mt-0.5">{item.label}</div>
              <div className="text-xs text-slate-600 font-rajdhani">{item.desc}</div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Signal', value: `${signalStrength.toFixed(0)}%`, color: 'text-green-400' },
          { label: 'Latency', value: `${latency.toFixed(0)}ms`, color: 'text-cyan-400' },
          { label: 'Emergency Ch.', value: 'ACTIVE', color: 'text-green-400' },
          { label: 'Coverage', value: '87%', color: 'text-cyan-400' },
          { label: 'Bandwidth', value: '450 Mbps', color: 'text-purple-400' },
          { label: 'Active Orbit', value: currentOrbit, color: currentOrbit === 'LEO' ? 'text-cyan-400' : currentOrbit === 'MEO' ? 'text-purple-400' : 'text-amber-400' },
        ].map(m => (
          <div key={m.label} className="p-2 rounded bg-white/3 border border-white/5 text-center">
            <div className={`font-orbitron text-xs font-bold ${m.color}`}>{m.value}</div>
            <div className="text-xs text-slate-600 font-rajdhani">{m.label}</div>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}

function AIRecommendationEngine() {
  const { currentOrbit, activeSatellite, switchOrbit } = useApp()
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState({
    orbit: 'LEO',
    confidence: 94,
    reason: 'Flood rescue requires ultra-low latency for real-time drone coordination. LEO provides optimal 28ms response time with 87% coverage of affected areas.',
    latency: '28ms',
    coverage: '87%',
    factors: ['Flood disaster type', 'Ground team coordination', 'Drone telemetry', 'Low-latency priority'],
  })

  const runAnalysis = () => {
    setAnalyzing(true)
    setTimeout(() => {
      const orbits = ['LEO', 'MEO', 'GEO']
      const picks = [
        { orbit: 'LEO', confidence: 94, reason: 'Real-time flood coordination needs ultra-low latency. LEO optimal.', latency: '28ms', coverage: '87%' },
        { orbit: 'MEO', confidence: 88, reason: 'Cyclone coverage requires wider beam. MEO provides superior area coverage.', latency: '82ms', coverage: '95%' },
        { orbit: 'GEO', confidence: 79, reason: 'Earthquake monitoring benefits from stable GEO link for seismic data relay.', latency: '550ms', coverage: '99%' },
      ]
      const pick = picks[Math.floor(Math.random() * picks.length)]
      setResult({ ...pick, factors: ['Disaster type analyzed', 'Signal strength checked', 'Congestion evaluated', 'Coverage mapped'] })
      setAnalyzing(false)
    }, 2000)
  }

  return (
    <GlassCard className="col-span-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Cpu size={16} className="text-cyan-400" />
          </div>
          <div>
            <h3 className="font-orbitron text-sm font-bold text-white">AI Satellite Recommendation</h3>
            <p className="text-xs text-slate-500 font-rajdhani">Machine learning orbit selection engine</p>
          </div>
        </div>
        <button
          onClick={runAnalysis}
          disabled={analyzing}
          className="px-3 py-1.5 rounded border border-cyan-500/30 text-cyan-400 text-xs font-rajdhani hover:bg-cyan-500/10 transition-colors disabled:opacity-50 flex items-center gap-1"
        >
          {analyzing ? <><div className="spinner w-3 h-3" /> Analyzing...</> : <><Zap size={12} /> Run Analysis</>}
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Result */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
            <div>
              <div className="text-xs text-slate-500 font-rajdhani">Recommended Orbit</div>
              <div className={`font-orbitron text-xl font-bold ${result.orbit === 'LEO' ? 'text-cyan-400' : result.orbit === 'MEO' ? 'text-purple-400' : 'text-amber-400'}`}>{result.orbit}</div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-xs text-slate-500 font-rajdhani">Confidence</div>
              <div className="font-orbitron text-lg text-green-400">{result.confidence}%</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Latency', value: result.latency, color: 'text-cyan-400' },
              { label: 'Coverage', value: result.coverage, color: 'text-green-400' },
            ].map(m => (
              <div key={m.label} className="p-2 rounded bg-white/3 border border-white/5">
                <div className="text-xs text-slate-500 font-rajdhani">{m.label}</div>
                <div className={`font-orbitron text-sm font-bold ${m.color}`}>{m.value}</div>
              </div>
            ))}
          </div>

          <ProgressBar value={result.confidence} color="cyan" label="AI Confidence" />
        </div>

        {/* Reasoning */}
        <div className="space-y-3">
          <div>
            <div className="text-xs text-slate-500 font-rajdhani mb-1 uppercase">AI Reasoning</div>
            <p className="text-xs text-slate-300 font-rajdhani leading-relaxed">{result.reason}</p>
          </div>
          <div>
            <div className="text-xs text-slate-500 font-rajdhani mb-2 uppercase">Analysis Factors</div>
            <div className="space-y-1">
              {result.factors.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-400 font-rajdhani">
                  <div className="w-1 h-1 rounded-full bg-cyan-400" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}

function MissionTimeline() {
  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-4">
        <Clock size={16} className="text-cyan-400" />
        <h3 className="font-orbitron text-sm font-bold text-white">Emergency Timeline</h3>
      </div>
      <div className="space-y-3">
        {missionTimeline.map((item, i) => (
          <div key={item.id} className="flex gap-3 items-start">
            <div className={`flex flex-col items-center ${i < missionTimeline.length - 1 ? 'pb-3' : ''}`}>
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs flex-shrink-0 ${
                item.status === 'completed' ? 'bg-green-500/20 border-green-500/50 text-green-400' :
                item.status === 'active' ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 animate-pulse' :
                'bg-slate-700 border-slate-600 text-slate-500'
              }`}>
                {item.status === 'completed' ? '✓' : item.status === 'active' ? '●' : '○'}
              </div>
              {i < missionTimeline.length - 1 && (
                <div className={`w-0.5 flex-1 mt-1 ${item.status === 'completed' ? 'bg-green-500/30' : 'bg-slate-700'}`} style={{ minHeight: '16px' }} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <span className={`text-xs font-semibold font-rajdhani ${
                  item.status === 'completed' ? 'text-green-400' :
                  item.status === 'active' ? 'text-cyan-400' : 'text-slate-500'
                }`}>{item.event}</span>
                <span className="text-xs text-slate-600 font-orbitron flex-shrink-0">{item.time}</span>
              </div>
              <p className="text-xs text-slate-500 font-rajdhani mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}

function AIPredictions() {
  return (
    <GlassCard className="col-span-2">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle size={16} className="text-amber-400" />
        <h3 className="font-orbitron text-sm font-bold text-white">AI Disaster Predictions</h3>
        <span className="ml-auto text-xs text-slate-500 font-rajdhani">Next 72 hours</span>
      </div>
      <div className="space-y-2">
        {aiPredictions.map(p => (
          <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/3 border border-white/5 hover:border-cyan-500/20 transition-colors">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0 ${
              p.disaster === 'Flood' ? 'bg-blue-500/20' :
              p.disaster === 'Cyclone' ? 'bg-purple-500/20' :
              p.disaster === 'Earthquake' ? 'bg-orange-500/20' :
              p.disaster === 'Wildfire' ? 'bg-red-500/20' : 'bg-amber-500/20'
            }`}>
              {p.disaster === 'Flood' ? '🌊' : p.disaster === 'Cyclone' ? '🌀' : p.disaster === 'Earthquake' ? '🏔️' : p.disaster === 'Wildfire' ? '🔥' : '⛰️'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-white font-rajdhani">{p.disaster}</span>
                <span className="text-xs text-slate-500 font-rajdhani">— {p.location}</span>
                <Badge text={`${p.risk}% risk`} type={p.risk > 80 ? 'critical' : p.risk > 60 ? 'high' : 'medium'} />
              </div>
              <ProgressBar value={p.risk} color={p.risk > 80 ? 'red' : p.risk > 60 ? 'amber' : 'cyan'} showPercent={false} />
              <div className="flex gap-4 mt-1 text-xs text-slate-500 font-rajdhani">
                <span>Pop: {p.affectedPop.toLocaleString()}</span>
                <span>Damage: {p.damage}</span>
                <span>ETA: {p.timeframe}</span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xs text-slate-500 font-rajdhani">Confidence</div>
              <div className="font-orbitron text-sm text-cyan-400">{p.confidence}%</div>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}

function ResourceAllocation() {
  const resources = [
    { name: 'Rescue Teams', deployed: 6, total: 8, icon: '👥', color: 'cyan' },
    { name: 'Medical Teams', deployed: 3, total: 5, icon: '🏥', color: 'green' },
    { name: 'Helicopters', deployed: 4, total: 6, icon: '🚁', color: 'purple' },
    { name: 'Boats', deployed: 12, total: 15, icon: '⛵', color: 'cyan' },
    { name: 'Drones (UAV)', deployed: 4, total: 5, icon: '🚁', color: 'amber' },
    { name: 'Food Packs', deployed: 1240, total: 2000, icon: '🍱', color: 'green' },
    { name: 'Water Supply', deployed: 890, total: 1500, icon: '💧', color: 'cyan' },
    { name: 'Medicine Kits', deployed: 456, total: 800, icon: '💊', color: 'red' },
  ]
  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-4">
        <Cpu size={16} className="text-purple-400" />
        <h3 className="font-orbitron text-sm font-bold text-white">AI Resource Allocation</h3>
      </div>
      <div className="space-y-3">
        {resources.map(r => (
          <div key={r.name}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-slate-400 font-rajdhani">{r.icon} {r.name}</span>
              <span className="font-orbitron text-xs text-slate-300">{r.deployed}/{r.total}</span>
            </div>
            <ProgressBar value={r.deployed} max={r.total} color={r.color} showPercent={false} />
          </div>
        ))}
      </div>
    </GlassCard>
  )
}

export default function Dashboard() {
  const { missionStats, threatLevel, currentOrbit, activeSatellite, satellites } = useApp()

  return (
    <div className="p-4 sm:p-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-orbitron text-lg sm:text-xl font-bold text-white">AI COMMAND CENTER</h1>
            <ThreatBadge level={threatLevel} />
          </div>
          <p className="text-xs text-slate-500 font-rajdhani">Mission Control — Real-time Disaster Response Intelligence</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs font-rajdhani text-slate-400 glass px-3 py-1.5 rounded border border-white/5">
            <span className="text-green-400">●</span> LIVE — {new Date().toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
          </div>
          <Link to="/map" className="flex items-center gap-1 px-3 py-1.5 rounded border border-cyan-500/30 text-cyan-400 text-xs font-rajdhani hover:bg-cyan-500/10">
            <Map size={12} /> Live Map
          </Link>
        </div>
      </div>

      {/* Communication Status Panel — core mission story */}
      <div className="mb-6">
        <CommStatusPanel />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Victims" value={missionStats.totalVictims.toLocaleString()} icon={Users} color="red" />
        <StatCard label="Rescued" value={missionStats.rescued.toLocaleString()} icon={Shield} color="green" />
        <StatCard label="Active Satellites" value={missionStats.satellitesOnline} icon={Satellite} color="cyan" />
        <StatCard label="Drones Airborne" value={missionStats.dronesActive} icon={Plane} color="purple" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Critical Cases" value={missionStats.criticalCases} icon={AlertTriangle} color="red" animate />
        <StatCard label="Teams Deployed" value={missionStats.teamsDeployed} icon={Users} color="amber" />
        <StatCard label="Mission Duration" value={missionStats.missionDuration} icon={Clock} color="cyan" />
        <StatCard label="Active Orbit" value={currentOrbit} icon={Activity} color="purple" sub={`${activeSatellite?.latency}ms latency`} />
      </div>

      {/* Rescue Progress */}
      <GlassCard className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-orbitron text-sm font-bold text-white">Mission Progress</h3>
          <span className="text-xs text-cyan-400 font-orbitron">{Math.round((missionStats.rescued / missionStats.totalVictims) * 100)}% Complete</span>
        </div>
        <div className="grid sm:grid-cols-4 gap-4">
          {[
            { label: 'Rescued', value: missionStats.rescued, max: missionStats.totalVictims, color: 'green' },
            { label: 'Critical', value: missionStats.criticalCases, max: missionStats.totalVictims, color: 'red' },
            { label: 'Teams Active', value: missionStats.teamsDeployed, max: 10, color: 'cyan' },
            { label: 'Satellites', value: missionStats.satellitesOnline, max: 6, color: 'purple' },
          ].map(m => (
            <div key={m.label}>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-slate-400 font-rajdhani">{m.label}</span>
                <span className="font-orbitron text-xs text-slate-300">{m.value}</span>
              </div>
              <ProgressBar value={m.value} max={m.max} color={m.color} showPercent={false} />
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AIRecommendationEngine />
          <AIPredictions />
        </div>
        <div className="flex flex-col gap-4">
          <MissionTimeline />
          <ResourceAllocation />
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {[
          { to: '/map', label: 'Disaster Map', icon: Map, color: 'cyan' },
          { to: '/comm-simulation', label: 'Comm Sim', icon: Radio, color: 'red' },
          { to: '/mission-control', label: 'Mission Ctrl', icon: Activity, color: 'purple' },
          { to: '/satellites', label: 'Satellites', icon: Satellite, color: 'cyan' },
          { to: '/rescue', label: 'Rescue Ops', icon: Shield, color: 'green' },
          { to: '/sos', label: 'SOS System', icon: Radio, color: 'amber' },
        ].map(l => {
          const Icon = l.icon
          const colorMap = { cyan: 'text-cyan-400 border-cyan-500/20 hover:border-cyan-500/40 hover:bg-cyan-500/10', purple: 'text-purple-400 border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-500/10', green: 'text-green-400 border-green-500/20 hover:border-green-500/40 hover:bg-green-500/10', amber: 'text-amber-400 border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/10', red: 'text-red-400 border-red-500/20 hover:border-red-500/40 hover:bg-red-500/10' }
          return (
            <Link key={l.to} to={l.to} className={`flex flex-col items-center gap-2 p-3 rounded-lg glass-card border transition-all font-rajdhani text-xs ${colorMap[l.color]}`}>
              <Icon size={20} />
              {l.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
