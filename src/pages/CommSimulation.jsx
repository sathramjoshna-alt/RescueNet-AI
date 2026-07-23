import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Wifi, WifiOff, Satellite, Radio, AlertTriangle, CheckCircle,
  Shield, Plane, MapPin, Clock, Zap, Activity,
  PhoneOff, Signal, Globe, Play, RotateCcw, ChevronRight,
  User, Navigation, Send
} from 'lucide-react'
import { useApp } from '../context/AppContext'

// ─── Simulation steps ──────────────────────────────────────────────────────
const STEPS = [
  { id: 0, phase: 'disaster', icon: '🌊', title: 'Disaster Detected', subtitle: 'Severe flood event — West Bengal', detail: 'IoT sensors report critical water level: 8.7m (+0.3m/hr). 1,240+ civilians at risk. AI predicts full submersion in 4 hours.', color: '#3b82f6', borderClass: 'border-blue-500/40', statusLabel: 'FLOOD ALERT', statusColor: 'text-blue-400', duration: 2000 },
  { id: 1, phase: 'tower_fail', icon: '📡', title: 'Mobile Towers Failing', subtitle: 'Ground infrastructure destroyed', detail: '14 cell towers submerged. Base stations offline. 99% of cellular coverage lost. Emergency calls impossible.', color: '#ef4444', borderClass: 'border-red-500/40', statusLabel: 'TOWERS OFFLINE', statusColor: 'text-red-400', duration: 2000 },
  { id: 2, phase: 'internet_lost', icon: '🌐', title: 'Internet Connection Lost', subtitle: 'All terrestrial links severed', detail: 'Fiber cables damaged. Internet: 0%. Victims cannot call, text, or send data via any ground network.', color: '#f59e0b', borderClass: 'border-amber-500/40', statusLabel: 'NO INTERNET', statusColor: 'text-amber-400', duration: 2000 },
  { id: 3, phase: 'sos', icon: '🆘', title: 'Victim Sends Emergency SOS', subtitle: 'GPS coordinates captured', detail: 'Victim activates RescueNet emergency SOS. Cellular: NO SIGNAL. App automatically enters Satellite Emergency Mode.', color: '#ef4444', borderClass: 'border-red-500/60', statusLabel: 'SOS ACTIVATED', statusColor: 'text-red-400', duration: 2200 },
  { id: 4, phase: 'ai_detect', icon: '🤖', title: 'AI Detects Communication Failure', subtitle: 'Scanning all channels…', detail: 'AI scans: 4G [FAILED] → 3G [FAILED] → WiFi [FAILED] → Broadband [FAILED]. Activating Satellite Emergency Protocol.', color: '#a855f7', borderClass: 'border-purple-500/40', statusLabel: 'AI ANALYZING', statusColor: 'text-purple-400', duration: 2400 },
  { id: 5, phase: 'sat_eval', icon: '🛰️', title: 'AI Evaluates Satellite Options', subtitle: 'Comparing LEO · MEO · GEO', detail: 'LEO: 28ms latency, 94% signal ✓\nMEO: 82ms latency, 91% signal ✓\nGEO: 550ms latency, 99% signal ✓', color: '#06b6d4', borderClass: 'border-cyan-500/40', statusLabel: 'EVALUATING', statusColor: 'text-cyan-400', duration: 2400 },
  { id: 6, phase: 'sat_select', icon: '✅', title: 'LEO Satellite Selected', subtitle: 'VIASAT-LEO-INDIA-01 — Confidence: 94%', detail: 'LEO selected: ultra-low 28ms latency for real-time rescue coordination. Coverage 87% of affected zone. AES-256 encryption active.', color: '#00d4ff', borderClass: 'border-cyan-500/60', statusLabel: 'LEO SELECTED', statusColor: 'text-cyan-400', duration: 2000 },
  { id: 7, phase: 'sat_connect', icon: '📶', title: 'Satellite Link Established', subtitle: 'Secure channel active — 28ms', detail: 'VIASAT-LEO-01 locked. Signal: 94%. Bandwidth: 450 Mbps. Emergency channel priority: ALPHA. Link stable and encrypted.', color: '#10b981', borderClass: 'border-green-500/40', statusLabel: 'SAT CONNECTED', statusColor: 'text-green-400', duration: 2000 },
  { id: 8, phase: 'sos_sent', icon: '📤', title: 'SOS Transmitted via Satellite', subtitle: 'Emergency packet delivered in 28ms', detail: 'Encrypted SOS packet sent via LEO constellation to Mission Control. Includes GPS, medical data, priority flag.', color: '#10b981', borderClass: 'border-emerald-500/40', statusLabel: 'SOS DELIVERED', statusColor: 'text-emerald-400', duration: 2000 },
  { id: 9, phase: 'mc_received', icon: '🖥️', title: 'Mission Control Receives Alert', subtitle: 'NDRF Command Center notified', detail: 'Alert received at Mission Control HQ. AI assigns priority score: 98/100. Auto-dispatching nearest available rescue team.', color: '#a855f7', borderClass: 'border-purple-500/40', statusLabel: 'MC NOTIFIED', statusColor: 'text-purple-400', duration: 2000 },
  { id: 10, phase: 'team_dispatch', icon: '🚁', title: 'Rescue Team Automatically Notified', subtitle: 'SOS forwarded to nearest team', detail: 'RescueNet AI identifies nearest available team. Emergency alert pushed to Rescue Operations dashboard in real-time via satellite uplink.', color: '#f59e0b', borderClass: 'border-amber-500/40', statusLabel: 'TEAM NOTIFIED', statusColor: 'text-amber-400', duration: 2200 },
  { id: 11, phase: 'tracking', icon: '📍', title: 'Live Rescue Tracking Active', subtitle: 'Full satellite coordination online', detail: 'Continuous uplink established. Victim GPS tracked every 30s. Drone thermal feed streaming. Two-way audio via satellite relay.', color: '#10b981', borderClass: 'border-teal-500/40', statusLabel: 'TRACKING LIVE', statusColor: 'text-teal-400', duration: 2000 },
]

// ─── SOS Form (step 0 — user fills in before simulation) ─────────────────
const DISASTER_TYPES = ['Flood', 'Cyclone', 'Earthquake', 'Landslide', 'Wildfire', 'Medical Emergency', 'Structural Collapse']
const PRIORITIES     = ['Critical', 'High', 'Medium', 'Low']

function SOSInputForm({ onStart }) {
  const [form, setForm] = useState({
    name: '',
    location: '',
    lat: '',
    lng: '',
    type: 'Flood',
    medical: '',
    priority: 'Critical',
  })
  const [errors, setErrors] = useState({})

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.name.trim())     e.name     = 'Name is required'
    if (!form.location.trim()) e.location = 'Location is required'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    onStart({
      ...form,
      lat: parseFloat(form.lat) || 20.5937,
      lng: parseFloat(form.lng) || 78.9629,
      gps: form.lat && form.lng
        ? `${parseFloat(form.lat).toFixed(4)}°N, ${parseFloat(form.lng).toFixed(4)}°E`
        : '20.5937°N, 78.9629°E',
    })
  }

  const inp = 'w-full bg-white/5 border border-cyan-500/20 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400/60 font-rajdhani transition-colors'

  return (
    <div className="glass-card border border-red-500/30 p-5"
      style={{ background: 'linear-gradient(135deg,rgba(239,68,68,0.04),rgba(10,22,40,0.97))' }}>

      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center animate-pulse">
          <Radio size={16} className="text-red-400" />
        </div>
        <div>
          <div className="font-orbitron text-sm font-bold text-red-400">EMERGENCY SOS</div>
          <div className="text-xs text-slate-500 font-rajdhani">Fill your details · AI selects best satellite · SOS transmitted</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {/* Name */}
          <div>
            <label className="block text-xs text-slate-400 font-rajdhani mb-1 uppercase tracking-wide">
              <User size={10} className="inline mr-1" />Your Name *
            </label>
            <input value={form.name} onChange={e => set('name', e.target.value)}
              placeholder="Full name" className={inp} />
            {errors.name && <p className="text-red-400 text-xs mt-0.5 font-rajdhani">{errors.name}</p>}
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs text-slate-400 font-rajdhani mb-1 uppercase tracking-wide">
              <MapPin size={10} className="inline mr-1" />Location *
            </label>
            <input value={form.location} onChange={e => set('location', e.target.value)}
              placeholder="City / Village" className={inp} />
            {errors.location && <p className="text-red-400 text-xs mt-0.5 font-rajdhani">{errors.location}</p>}
          </div>

          {/* GPS lat */}
          <div>
            <label className="block text-xs text-slate-400 font-rajdhani mb-1 uppercase tracking-wide">
              <Navigation size={10} className="inline mr-1" />Latitude (GPS)
            </label>
            <input value={form.lat} onChange={e => set('lat', e.target.value)}
              placeholder="e.g. 22.5726" className={inp} type="number" step="any" />
          </div>

          {/* GPS lng */}
          <div>
            <label className="block text-xs text-slate-400 font-rajdhani mb-1 uppercase tracking-wide">
              Longitude (GPS)
            </label>
            <input value={form.lng} onChange={e => set('lng', e.target.value)}
              placeholder="e.g. 88.3639" className={inp} type="number" step="any" />
          </div>

          {/* Disaster type */}
          <div>
            <label className="block text-xs text-slate-400 font-rajdhani mb-1 uppercase tracking-wide">Disaster Type</label>
            <select value={form.type} onChange={e => set('type', e.target.value)}
              className={inp + ' cursor-pointer'}>
              {DISASTER_TYPES.map(t => <option key={t} value={t} className="bg-slate-900">{t}</option>)}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs text-slate-400 font-rajdhani mb-1 uppercase tracking-wide">Priority Level</label>
            <select value={form.priority} onChange={e => set('priority', e.target.value)}
              className={inp + ' cursor-pointer'}>
              {PRIORITIES.map(p => <option key={p} value={p} className="bg-slate-900">{p}</option>)}
            </select>
          </div>
        </div>

        {/* Medical */}
        <div>
          <label className="block text-xs text-slate-400 font-rajdhani mb-1 uppercase tracking-wide">Medical Condition / Notes</label>
          <input value={form.medical} onChange={e => set('medical', e.target.value)}
            placeholder="e.g. Head injury, Elderly, Pregnant, Infant..." className={inp} />
        </div>

        {/* Submit */}
        <button type="submit"
          className="w-full py-3.5 rounded-xl font-orbitron font-bold text-sm text-white flex items-center justify-center gap-2 transition-all critical-blink"
          style={{
            background: 'linear-gradient(135deg,#dc2626,#991b1b)',
            boxShadow: '0 0 24px rgba(239,68,68,0.45)',
            border: '1px solid rgba(239,68,68,0.5)',
          }}>
          <Send size={16} />
          🆘 SEND EMERGENCY SOS VIA SATELLITE
        </button>
        <p className="text-center text-xs text-slate-600 font-rajdhani">
          When cellular fails · AI automatically routes via LEO / MEO / GEO satellite
        </p>
      </form>
    </div>
  )
}

// ─── Comm status row ───────────────────────────────────────────────────────
function CommStatusRow({ phase }) {
  const phases = STEPS.map(s => s.phase)
  const idx    = phases.indexOf(phase)
  const status = {
    cell:      idx >= 1 ? 'fail'      : 'ok',
    internet:  idx >= 2 ? 'fail'      : 'ok',
    satellite: idx >= 7 ? 'ok'        : idx >= 4 ? 'searching' : 'idle',
    channel:   idx >= 8 ? 'active'    : 'inactive',
  }
  const items = [
    { label: 'Cell Tower',     icon: PhoneOff,  state: status.cell,      okLabel: 'ACTIVE',    failLabel: 'FAILED' },
    { label: 'Internet',       icon: Globe,     state: status.internet,   okLabel: 'ONLINE',    failLabel: 'OFFLINE' },
    { label: 'Satellite',      icon: Satellite, state: status.satellite,  okLabel: 'LINKED',    searchLabel: 'SEARCHING', idleLabel: 'STANDBY' },
    { label: 'Emerg. Channel', icon: Radio,     state: status.channel,    okLabel: 'ACTIVE',    inactiveLabel: 'INACTIVE' },
  ]
  const stCls = s =>
    s === 'ok' || s === 'active'   ? 'text-green-400 border-green-500/30 bg-green-500/10' :
    s === 'searching'              ? 'text-amber-400 border-amber-500/30 bg-amber-500/10 animate-pulse' :
    s === 'fail' || s === 'inactive' ? 'text-red-400 border-red-500/30 bg-red-500/10' :
    'text-slate-500 border-slate-500/20 bg-slate-500/5'
  const stLabel = it =>
    it.state === 'ok' || it.state === 'active' ? (it.okLabel || 'OK') :
    it.state === 'fail'      ? (it.failLabel || 'FAILED') :
    it.state === 'searching' ? (it.searchLabel || 'SEARCHING') :
    it.state === 'inactive'  ? (it.inactiveLabel || 'INACTIVE') :
    (it.idleLabel || 'IDLE')

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {items.map(it => {
        const Icon = it.icon
        return (
          <div key={it.label} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-rajdhani ${stCls(it.state)}`}>
            <Icon size={13} className="flex-shrink-0" />
            <div>
              <div className="text-slate-500" style={{ fontSize: 9 }}>{it.label}</div>
              <div className="font-orbitron font-bold" style={{ fontSize: 10 }}>{stLabel(it)}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Satellite evaluation cards ────────────────────────────────────────────
function SatEvalCards({ phase }) {
  const show = ['sat_eval','sat_select','sat_connect','sos_sent','mc_received','team_dispatch','tracking'].includes(phase)
  if (!show) return null
  const selected = ['sat_select','sat_connect','sos_sent','mc_received','team_dispatch','tracking'].includes(phase)
  const sats = [
    { name: 'LEO', alt: '550 km',    latency: '28ms',  signal: 94, coverage: 87, best: true,  color: '#00d4ff' },
    { name: 'MEO', alt: '8,000 km',  latency: '82ms',  signal: 91, coverage: 95, best: false, color: '#a855f7' },
    { name: 'GEO', alt: '35,786 km', latency: '550ms', signal: 99, coverage: 99, best: false, color: '#f59e0b' },
  ]
  return (
    <div className="grid grid-cols-3 gap-2">
      {sats.map(s => (
        <div key={s.name} className={`p-3 rounded-lg border text-center transition-all ${
          selected && s.best ? 'border-cyan-500/60 bg-cyan-500/10 ring-1 ring-cyan-500/30' : 'border-white/10 bg-white/3'
        }`}>
          <div className="font-orbitron text-sm font-bold mb-1" style={{ color: s.color }}>{s.name}</div>
          <div className="text-xs text-slate-500 font-rajdhani">{s.alt}</div>
          <div className="font-orbitron text-xs mt-0.5" style={{ color: s.color }}>{s.latency}</div>
          <div className="text-xs text-slate-400 font-rajdhani">{s.signal}% sig</div>
          {selected && s.best && (
            <div className="mt-1 text-xs text-cyan-400 font-orbitron bg-cyan-500/10 rounded px-1 py-0.5">✓ SELECTED</div>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Data-flow SVG ─────────────────────────────────────────────────────────
function DataFlowDiagram({ activeStep }) {
  const nodes = [
    { id: 'victim', label: 'Victim Phone', icon: '📱', x: 60,  y: 200, color: '#ef4444' },
    { id: 'leo',    label: 'LEO Satellite', icon: '🛰️', x: 240, y: 60,  color: '#00d4ff' },
    { id: 'meo',    label: 'MEO Satellite', icon: '🛰️', x: 310, y: 130, color: '#a855f7' },
    { id: 'geo',    label: 'GEO Satellite', icon: '🛰️', x: 360, y: 200, color: '#f59e0b' },
    { id: 'mc',     label: 'Mission Control', icon: '🖥️', x: 530, y: 120, color: '#10b981' },
    { id: 'team',   label: 'Rescue Team', icon: '🚁', x: 530, y: 250, color: '#f59e0b' },
    { id: 'drone',  label: 'Drone UAV',   icon: '✈️', x: 390, y: 310, color: '#06b6d4' },
  ]
  const phase = STEPS[Math.min(activeStep, STEPS.length - 1)]?.phase || ''
  const activeLinks = {
    disaster: [], tower_fail: [], internet_lost: [],
    sos: [['victim','leo']],
    ai_detect: [['victim','leo'],['victim','meo'],['victim','geo']],
    sat_eval:  [['victim','leo'],['victim','meo'],['victim','geo']],
    sat_select:[['victim','leo']],
    sat_connect:[['victim','leo'],['leo','mc']],
    sos_sent:  [['victim','leo'],['leo','mc']],
    mc_received:[['leo','mc'],['mc','team']],
    team_dispatch:[['mc','team'],['mc','drone'],['drone','victim']],
    tracking:  [['victim','leo'],['leo','mc'],['mc','team'],['mc','drone'],['drone','victim']],
  }
  const links = activeLinks[phase] || []
  const getNode = id => nodes.find(n => n.id === id)

  return (
    <div className="glass-card p-4 border border-cyan-500/20">
      <div className="text-xs font-orbitron text-cyan-400 mb-2">LIVE DATA FLOW</div>
      <svg viewBox="0 0 620 380" className="w-full" style={{ maxHeight: 240 }}>
        {[...Array(6)].map((_,i) => <line key={`h${i}`} x1="0" y1={60*i+30} x2="620" y2={60*i+30} stroke="#ffffff05" strokeWidth="1"/>)}
        {[...Array(10)].map((_,i) => <line key={`v${i}`} x1={60*i+30} y1="0" x2={60*i+30} y2="380" stroke="#ffffff05" strokeWidth="1"/>)}

        {[['victim','leo'],['victim','meo'],['victim','geo'],['leo','mc'],['meo','mc'],['geo','mc'],['mc','team'],['mc','drone'],['drone','victim']].map(([a,b],i) => {
          const na = getNode(a), nb = getNode(b)
          if (!na || !nb) return null
          const active = links.some(([x,y]) => x===a && y===b)
          return (
            <g key={i}>
              <line x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} stroke={active ? na.color : '#ffffff08'} strokeWidth={active ? 2 : 1} strokeDasharray={active ? '6,3' : '3,4'} />
              {active && (
                <circle r="4" fill={na.color}>
                  <animateMotion dur="1.2s" repeatCount="indefinite" path={`M${na.x},${na.y} L${nb.x},${nb.y}`} />
                </circle>
              )}
            </g>
          )
        })}

        {nodes.map(node => {
          const inv = links.some(([a,b]) => a===node.id || b===node.id)
          return (
            <g key={node.id}>
              <circle cx={node.x} cy={node.y} r="22" fill={inv ? `${node.color}22` : '#0a162888'} stroke={inv ? node.color : '#ffffff12'} strokeWidth={inv ? 2 : 1} />
              {inv && (
                <circle cx={node.x} cy={node.y} r="22" fill="none" stroke={node.color} strokeWidth="1" strokeOpacity="0.4">
                  <animate attributeName="r" from="22" to="32" dur="1.5s" repeatCount="indefinite"/>
                  <animate attributeName="stroke-opacity" from="0.4" to="0" dur="1.5s" repeatCount="indefinite"/>
                </circle>
              )}
              <text x={node.x} y={node.y+1} textAnchor="middle" dominantBaseline="middle" fontSize="14">{node.icon}</text>
              <text x={node.x} y={node.y+34} textAnchor="middle" fill={inv ? node.color : '#64748b'} fontSize="8" fontFamily="Rajdhani,sans-serif" fontWeight="600">{node.label}</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// ─── AI decision panel ─────────────────────────────────────────────────────
function AIDecisionPanel({ phase, activeStep }) {
  const show = activeStep >= 4, decided = activeStep >= 6
  return (
    <div className="glass-card p-4 border border-purple-500/20">
      <div className="flex items-center gap-2 mb-3">
        <Zap size={13} className="text-purple-400" />
        <span className="font-orbitron text-xs text-purple-400">AI SATELLITE DECISION</span>
      </div>
      {!show ? (
        <p className="text-xs text-slate-600 font-rajdhani">Awaiting communication failure event…</p>
      ) : (
        <div className="space-y-1.5 text-xs font-rajdhani">
          <div className="flex gap-1.5"><span className="text-red-400 font-orbitron">✗</span><span className="text-slate-400">Cellular: <span className="text-red-400">FAILED</span></span></div>
          <div className="flex gap-1.5"><span className="text-red-400 font-orbitron">✗</span><span className="text-slate-400">Internet: <span className="text-red-400">FAILED</span></span></div>
          <div className="flex gap-1.5"><span className="text-amber-400 font-orbitron">→</span><span className="text-slate-400">Activating satellite emergency protocol…</span></div>
          {activeStep >= 5 && (<>
            <div className="flex gap-1.5"><span className="text-cyan-400 font-orbitron">✓</span><span className="text-slate-400">LEO: <span className="text-cyan-400">28ms</span> — optimal</span></div>
            <div className="flex gap-1.5"><span className="text-purple-400">~</span><span className="text-slate-400">MEO: 82ms — backup</span></div>
            <div className="flex gap-1.5"><span className="text-amber-400">~</span><span className="text-slate-400">GEO: 550ms — fallback</span></div>
          </>)}
          {decided && (
            <div className="border-t border-white/10 pt-2 mt-1">
              <div className="text-green-400 font-orbitron font-bold mb-1">▸ LEO SELECTED</div>
              <div className="text-slate-400 leading-relaxed">Flood rescue: LEO 28ms ensures real-time coordination. Confidence: <span className="text-cyan-400 font-orbitron">94%</span></div>
              <div className="text-slate-500 mt-1">Backup: MEO · Fallback: GEO</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Communication timeline ────────────────────────────────────────────────
function CommTimeline({ activeStep }) {
  const events = [
    { time: '08:25', label: 'Flood detected',       color: 'text-blue-400' },
    { time: '08:26', label: 'Cell tower failure',    color: 'text-red-400' },
    { time: '08:26', label: 'Internet disconnected', color: 'text-red-400' },
    { time: '08:27', label: 'Satellite search',      color: 'text-amber-400' },
    { time: '08:27', label: 'LEO connected',         color: 'text-cyan-400' },
    { time: '08:28', label: 'SOS delivered',         color: 'text-green-400' },
    { time: '08:29', label: 'Mission Control notified', color: 'text-purple-400' },
    { time: '08:30', label: 'Rescue team notified',  color: 'text-amber-400' },
    { time: '08:32', label: 'Mission accepted',      color: 'text-green-400' },
    { time: '08:48', label: 'Victim rescued',        color: 'text-green-400' },
  ]
  return (
    <div className="glass-card p-4 border border-cyan-500/20">
      <div className="text-xs font-orbitron text-cyan-400 mb-3">AI COMM TIMELINE</div>
      <div className="space-y-1.5">
        {events.map((e, i) => {
          const vis = activeStep >= Math.floor((i / events.length) * STEPS.length)
          return (
            <div key={i} className={`flex items-center gap-2 text-xs font-rajdhani transition-all ${vis ? 'opacity-100' : 'opacity-20'}`}>
              <span className="font-orbitron text-slate-600 w-10 flex-shrink-0">{e.time}</span>
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${vis ? 'bg-cyan-400' : 'bg-slate-700'}`} />
              <span className={vis ? e.color : 'text-slate-700'}>{e.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Dispatch confirmation card ────────────────────────────────────────────
function DispatchConfirm({ sosData, onGoRescue, onReplay }) {
  const navigate = useNavigate()
  return (
    <div className="glass-card border border-green-500/40 p-5 bg-green-500/5">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle size={22} className="text-green-400" />
        <div>
          <div className="font-orbitron text-sm font-bold text-green-400">SOS DISPATCHED TO RESCUE OPS</div>
          <div className="text-xs text-slate-400 font-rajdhani">Rescue team has been notified via satellite</div>
        </div>
      </div>

      {/* SOS summary */}
      <div className="grid grid-cols-2 gap-2 mb-4 text-xs font-rajdhani">
        {[
          { label: 'Victim',    value: sosData?.name     || '—', color: 'text-white' },
          { label: 'Location',  value: sosData?.location || '—', color: 'text-cyan-400' },
          { label: 'GPS',       value: sosData?.gps      || '—', color: 'text-cyan-400' },
          { label: 'Disaster',  value: sosData?.type     || '—', color: 'text-amber-400' },
          { label: 'Priority',  value: sosData?.priority || '—', color: sosData?.priority === 'Critical' ? 'text-red-400' : 'text-amber-400' },
          { label: 'Satellite', value: sosData?.satellite || 'LEO', color: 'text-cyan-400' },
          { label: 'Signal',    value: `${sosData?.signal || 94}%`,    color: 'text-green-400' },
          { label: 'Latency',   value: `${sosData?.latency || 28}ms`,  color: 'text-purple-400' },
          { label: 'Nearest Team', value: sosData?.nearestTeam || '—', color: 'text-amber-400' },
          { label: 'ETA',       value: sosData?.eta || '—',            color: 'text-green-400' },
          { label: 'Comm',      value: 'Active via Satellite',          color: 'text-green-400' },
          { label: 'Time',      value: sosData?.time || '—',            color: 'text-slate-400' },
        ].map(m => (
          <div key={m.label} className="p-2 rounded bg-white/3 border border-white/5">
            <div className="text-slate-500" style={{ fontSize: 10 }}>{m.label}</div>
            <div className={`font-rajdhani font-semibold truncate ${m.color}`}>{m.value}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => navigate('/rescue')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-rajdhani font-bold text-sm text-white transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', boxShadow: '0 0 16px rgba(245,158,11,0.35)' }}>
          <Shield size={15} /> View Rescue Ops →
        </button>
        <button onClick={() => navigate('/map')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-cyan-500/40 text-cyan-400 font-rajdhani text-sm hover:bg-cyan-500/10">
          <MapPin size={14} /> Disaster Map
        </button>
        <button onClick={onReplay}
          className="flex items-center gap-1 px-4 py-2 rounded border border-slate-500/40 text-slate-400 font-rajdhani text-sm hover:bg-white/5">
          <RotateCcw size={13} /> Replay
        </button>
      </div>
    </div>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────
export default function CommSimulation() {
  const navigate   = useNavigate()
  const { dispatchSOS } = useApp()

  // Phase: 'form' | 'running' | 'complete'
  const [phase, setPhase]         = useState('form')
  const [sosFormData, setSosFormData] = useState(null)
  const [dispatchedSOS, setDispatchedSOS] = useState(null)
  const [activeStep, setActiveStep] = useState(-1)
  const timerRef   = useRef(null)
  const stepRef    = useRef(-1)

  const currentStep = activeStep >= 0 ? STEPS[activeStep] : null
  const currentPhase = currentStep?.phase || ''

  // ── Run simulation ─────────────────────────────────────────────────────
  const runNext = useCallback(() => {
    stepRef.current += 1
    if (stepRef.current >= STEPS.length) {
      setPhase('complete')
      return
    }
    setActiveStep(stepRef.current)
    timerRef.current = setTimeout(runNext, STEPS[stepRef.current].duration)
  }, [])

  const startSim = useCallback((formData) => {
    clearTimeout(timerRef.current)
    stepRef.current = -1
    setActiveStep(-1)
    setSosFormData(formData)
    setPhase('running')
    timerRef.current = setTimeout(runNext, 300)
  }, [runNext])

  // When simulation completes, dispatch SOS through context
  useEffect(() => {
    if (phase === 'complete' && sosFormData && !dispatchedSOS) {
      const result = dispatchSOS(sosFormData)
      setDispatchedSOS(result)
    }
  }, [phase, sosFormData, dispatchedSOS, dispatchSOS])

  const handleReplay = useCallback(() => {
    clearTimeout(timerRef.current)
    setActiveStep(-1)
    setDispatchedSOS(null)
    setPhase('form')
  }, [])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  return (
    <div className="p-4 sm:p-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-orbitron text-xs text-cyan-400 tracking-widest">EMERGENCY COMMUNICATION SIMULATION</span>
          </div>
          <h1 className="font-orbitron text-xl sm:text-2xl font-black text-white">When Networks Fail, Satellites Save Lives</h1>
          <p className="text-slate-400 font-rajdhani text-sm mt-1 max-w-2xl">
            Fill the SOS form below and watch RescueNet AI automatically restore emergency communication through multi-orbit satellite constellations — then notify the nearest rescue team in real time.
          </p>
        </div>
        {phase === 'running' && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-orbitron text-xs flex-shrink-0">
            <div className="spinner w-4 h-4" /> SIMULATING…
          </div>
        )}
      </div>

      {/* Comm status row */}
      <div className="mb-4">
        <CommStatusRow phase={currentPhase} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* ── Left: pipeline ── */}
        <div className="glass-card p-4 border border-cyan-500/20">
          <div className="text-xs font-orbitron text-cyan-400 mb-3">RECOVERY PIPELINE</div>
          <div className="space-y-1">
            {STEPS.map((s, i) => {
              const done   = activeStep > i
              const active = activeStep === i
              return (
                <div key={s.id} className="flex items-start gap-2">
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs flex-shrink-0 transition-all ${
                      done   ? 'bg-green-500/20 border-green-500/50 text-green-400' :
                      active ? 'bg-cyan-500/30 border-cyan-500/60 text-cyan-400 animate-pulse' :
                               'bg-slate-800 border-slate-700 text-slate-600'
                    }`}>
                      {done ? '✓' : active ? '▶' : i + 1}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`w-px flex-1 my-0.5 ${done ? 'bg-green-500/30' : 'bg-slate-700/40'}`} style={{ minHeight: 8 }} />
                    )}
                  </div>
                  <div className={`pb-1 flex-1 min-w-0 transition-all ${active ? 'opacity-100' : done ? 'opacity-60' : 'opacity-30'}`}>
                    <div className={`text-xs font-rajdhani font-semibold leading-tight ${active ? 'text-white' : done ? 'text-slate-400' : 'text-slate-600'}`}>
                      <span className="mr-1">{s.icon}</span>{s.title}
                    </div>
                    {active && <div className="text-xs text-slate-500 font-rajdhani mt-0.5 leading-tight">{s.subtitle}</div>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Center ── */}
        <div className="flex flex-col gap-4">
          {/* SOS form (before simulation) */}
          {phase === 'form' && <SOSInputForm onStart={startSim} />}

          {/* Active step card */}
          {phase === 'running' && currentStep && (
            <div className={`glass-card border p-6 min-h-48 transition-all ${currentStep.borderClass}`}
              style={{ background: 'linear-gradient(135deg,rgba(2,8,23,0.95),rgba(10,22,40,0.98))' }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{currentStep.icon}</span>
                <div>
                  <div className={`font-orbitron text-xs font-bold tracking-widest ${currentStep.statusColor} mb-0.5`}>
                    STEP {currentStep.id + 1}/{STEPS.length} — {currentStep.statusLabel}
                  </div>
                  <div className="font-orbitron text-base sm:text-lg font-black text-white">{currentStep.title}</div>
                </div>
              </div>
              <div className="text-sm text-slate-300 font-rajdhani mb-3">{currentStep.subtitle}</div>
              <div className="p-3 rounded-lg bg-black/30 border border-white/5">
                <pre className="text-xs text-slate-400 font-rajdhani whitespace-pre-wrap leading-relaxed">{currentStep.detail}</pre>
              </div>

              {/* SOS victim info during run */}
              {sosFormData && currentPhase === 'sos' && (
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-rajdhani">
                  {[['Victim', sosFormData.name], ['Location', sosFormData.location], ['Disaster', sosFormData.type], ['Priority', sosFormData.priority]].map(([k,v]) => (
                    <div key={k} className="p-2 rounded bg-white/3 border border-white/5">
                      <div className="text-slate-500">{k}</div>
                      <div className="text-white font-semibold truncate">{v}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Satellite metrics on connect */}
              {(currentPhase === 'sat_connect' || currentPhase === 'tracking') && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[{ label:'Signal', value:'94%', color:'text-green-400' },{ label:'Latency', value:'28ms', color:'text-cyan-400' },{ label:'Bandwidth', value:'450 Mbps', color:'text-purple-400' }].map(m => (
                    <div key={m.label} className="p-2 rounded bg-white/3 border border-white/5 text-center">
                      <div className={`font-orbitron text-sm font-bold ${m.color}`}>{m.value}</div>
                      <div className="text-xs text-slate-500 font-rajdhani">{m.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* SOS transmission log */}
              {currentPhase === 'sos_sent' && (
                <div className="mt-3 space-y-1">
                  {['Cellular… No Signal','WiFi… No Signal','Satellite Mode Activated','LEO Locked ✓','Encrypting Packet ✓','Transmitting…','✅ Delivered to Mission Control'].map((line, i) => (
                    <div key={i} className={`text-xs font-rajdhani flex items-center gap-1 ${line.includes('✅') ? 'text-green-400' : line.includes('✓') ? 'text-cyan-400' : line.includes('No Signal') ? 'text-red-400' : 'text-amber-400'}`}>
                      <span className="font-orbitron">›</span> {line}
                    </div>
                  ))}
                </div>
              )}

              {/* Team dispatch notification */}
              {currentPhase === 'team_dispatch' && sosFormData && (
                <div className="mt-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/30">
                  <div className="text-xs font-orbitron text-amber-400 mb-1">🚨 RESCUE OPS NOTIFIED</div>
                  <div className="text-xs font-rajdhani text-slate-300">
                    Emergency alert pushed to Rescue Operations dashboard. Nearest team alerted. Check <span className="text-amber-400 font-semibold">Rescue Ops →</span> to Accept Mission.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sat eval */}
          <SatEvalCards phase={currentPhase} />

          {/* Complete / dispatch confirm */}
          {phase === 'complete' && (
            <DispatchConfirm sosData={dispatchedSOS} onReplay={handleReplay} />
          )}
        </div>

        {/* ── Right ── */}
        <div className="flex flex-col gap-4">
          <DataFlowDiagram activeStep={activeStep} />
          <AIDecisionPanel phase={currentPhase} activeStep={activeStep} />
          <CommTimeline activeStep={activeStep} />
        </div>
      </div>
    </div>
  )
}
