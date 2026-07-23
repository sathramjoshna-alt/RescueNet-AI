import React, { useState, useEffect, useRef } from 'react'
import { Radio, AlertTriangle, MapPin, Clock, Send, CheckCircle, Wifi, WifiOff, RefreshCw, MessageSquare, PhoneOff, Satellite, Zap } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { GlassCard, StatCard, SectionHeader, Badge } from '../components/UI'
import { offlineMessages } from '../data/mockData'

// ─── Animated SOS Transmission ───────────────────────────────────────────
const TX_STEPS = [
  { msg: 'Searching Cellular Network...', icon: PhoneOff, color: 'text-red-400', status: 'scanning' },
  { msg: '✗ No Network Found — 0 bars', icon: PhoneOff, color: 'text-red-400', status: 'fail' },
  { msg: 'Searching WiFi / Broadband...', icon: Wifi, color: 'text-red-400', status: 'scanning' },
  { msg: '✗ No Internet Connection', icon: WifiOff, color: 'text-red-400', status: 'fail' },
  { msg: 'Activating Satellite Emergency Mode...', icon: Satellite, color: 'text-amber-400', status: 'switching' },
  { msg: 'Scanning LEO Constellation...', icon: Satellite, color: 'text-cyan-400', status: 'scanning' },
  { msg: '✓ VIASAT-LEO-01 Locked — 28ms, 94% signal', icon: Satellite, color: 'text-cyan-400', status: 'found' },
  { msg: 'Encrypting Emergency Packet (AES-256)...', icon: Zap, color: 'text-purple-400', status: 'encrypting' },
  { msg: 'Sending Emergency Packet via Satellite...', icon: Radio, color: 'text-cyan-400', status: 'sending' },
  { msg: '✅ Message Delivered to Mission Control', icon: CheckCircle, color: 'text-green-400', status: 'delivered' },
  { msg: '✅ Mission Control Confirmed Receipt', icon: CheckCircle, color: 'text-green-400', status: 'confirmed' },
  { msg: '🚁 Nearest Rescue Team Assigned — ETA 18 min', icon: CheckCircle, color: 'text-green-400', status: 'assigned' },
]

function SOSTransmissionAnim({ name, location, onComplete }) {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    const delays = [800, 600, 600, 500, 900, 800, 700, 800, 900, 1000, 800, 1200]
    let i = 0
    const next = () => {
      i++
      if (i >= TX_STEPS.length) { setDone(true); onComplete?.(); return }
      setStep(i)
      timerRef.current = setTimeout(next, delays[i] || 700)
    }
    timerRef.current = setTimeout(next, delays[0])
    return () => clearTimeout(timerRef.current)
  }, [onComplete])

  return (
    <div className="glass-card border border-cyan-500/30 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span className="font-orbitron text-xs text-cyan-400 tracking-widest">SATELLITE TRANSMISSION IN PROGRESS</span>
      </div>
      <div className="mb-3 p-3 rounded-lg bg-black/30 border border-white/5">
        <div className="text-xs text-slate-500 font-rajdhani mb-1">SOS PACKET</div>
        <div className="text-xs font-rajdhani text-slate-300">
          <span className="text-cyan-400">Sender:</span> {name} •{' '}
          <span className="text-cyan-400">Location:</span> {location} •{' '}
          <span className="text-red-400">Priority: CRITICAL</span>
        </div>
      </div>
      <div className="space-y-1.5 font-mono text-xs max-h-56 overflow-y-auto">
        {TX_STEPS.slice(0, step + 1).map((s, i) => {
          const Icon = s.icon
          return (
            <div key={i} className={`flex items-center gap-2 py-1 ${s.color} ${i === step && !done ? 'animate-pulse' : ''}`}>
              <Icon size={12} className="flex-shrink-0" />
              <span className="font-rajdhani">{s.msg}</span>
              {i === step && !done && <div className="spinner w-3 h-3 ml-auto flex-shrink-0" />}
            </div>
          )
        })}
      </div>
      {done && (
        <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
          <CheckCircle size={24} className="text-green-400 mx-auto mb-1" />
          <div className="font-orbitron text-sm text-green-400">RESCUE TEAM DISPATCHED</div>
          <div className="text-xs text-slate-400 font-rajdhani mt-1">
            Communication restored via LEO satellite · Rescue ETA: 18 minutes
          </div>
        </div>
      )}
    </div>
  )
}

function SOSForm() {
  const { addAlert, setSosRequests } = useApp()
  const [form, setForm] = useState({ name: '', location: '', type: 'Flood', description: '', priority: 'High', lat: '', lng: '' })
  const [submitted, setSubmitted] = useState(false)
  const [transmitting, setTransmitting] = useState(false)
  const [sending, setSending] = useState(false)

  const disasterTypes = ['Flood', 'Cyclone', 'Earthquake', 'Landslide', 'Wildfire', 'Medical', 'Structural Collapse', 'Other']
  const priorities = ['Critical', 'High', 'Medium', 'Low']

  const handleSubmit = (e) => {
    e.preventDefault()
    setTransmitting(true)
    const newSOS = {
      id: `SOS-${Date.now()}`,
      name: form.name,
      location: form.location,
      lat: parseFloat(form.lat) || 20.5937,
      lng: parseFloat(form.lng) || 78.9629,
      priority: form.priority,
      type: form.type,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      status: 'Active',
    }
    setSosRequests(prev => [newSOS, ...prev])
    addAlert(form.priority.toLowerCase() === 'critical' ? 'critical' : 'warning', `New SOS: ${form.name} — ${form.type} at ${form.location}`)
  }

  const handleTxComplete = () => {
    setSubmitted(true)
    setTransmitting(false)
    setTimeout(() => { setSubmitted(false); setForm({ name: '', location: '', type: 'Flood', description: '', priority: 'High', lat: '', lng: '' }) }, 5000)
  }

  if (transmitting) {
    return <SOSTransmissionAnim name={form.name || 'Victim'} location={form.location || 'Unknown'} onComplete={handleTxComplete} />
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <CheckCircle size={48} className="text-green-400 mb-4" />
        <div className="font-orbitron text-lg text-white mb-2">SOS TRANSMITTED</div>
        <p className="text-slate-400 font-rajdhani text-sm">Emergency signal relayed via LEO satellite.<br />Rescue team dispatched — ETA 18 minutes.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-rajdhani text-slate-400 mb-1 uppercase">Your Name</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
            className="w-full bg-white/5 border border-cyan-500/20 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 font-rajdhani"
            placeholder="Full name" />
        </div>
        <div>
          <label className="block text-xs font-rajdhani text-slate-400 mb-1 uppercase">Location</label>
          <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} required
            className="w-full bg-white/5 border border-cyan-500/20 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 font-rajdhani"
            placeholder="City / Village / Area" />
        </div>
        <div>
          <label className="block text-xs font-rajdhani text-slate-400 mb-1 uppercase">Disaster Type</label>
          <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
            className="w-full bg-white/5 border border-cyan-500/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/60 font-rajdhani">
            {disasterTypes.map(t => <option key={t} value={t} className="bg-slate-800">{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-rajdhani text-slate-400 mb-1 uppercase">Priority Level</label>
          <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
            className="w-full bg-white/5 border border-cyan-500/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/60 font-rajdhani">
            {priorities.map(p => <option key={p} value={p} className="bg-slate-800">{p}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-rajdhani text-slate-400 mb-1 uppercase">Latitude (GPS)</label>
          <input value={form.lat} onChange={e => setForm(f => ({ ...f, lat: e.target.value }))}
            className="w-full bg-white/5 border border-cyan-500/20 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 font-rajdhani"
            placeholder="e.g. 22.5726" />
        </div>
        <div>
          <label className="block text-xs font-rajdhani text-slate-400 mb-1 uppercase">Longitude (GPS)</label>
          <input value={form.lng} onChange={e => setForm(f => ({ ...f, lng: e.target.value }))}
            className="w-full bg-white/5 border border-cyan-500/20 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 font-rajdhani"
            placeholder="e.g. 88.3639" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-rajdhani text-slate-400 mb-1 uppercase">Emergency Description</label>
        <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          className="w-full bg-white/5 border border-cyan-500/20 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 font-rajdhani h-20 resize-none"
          placeholder="Describe the emergency situation, number of people affected, medical conditions..." />
      </div>
      <button type="submit"
        className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-800 text-white font-orbitron font-bold text-base hover:from-red-500 hover:to-red-700 transition-all flex items-center justify-center gap-2 critical-blink border border-red-500/60"
        style={{ boxShadow: '0 0 20px rgba(239,68,68,0.4)' }}>
        <Radio size={18} /> 🆘 SEND EMERGENCY SOS
      </button>
      <div className="text-center text-xs text-slate-500 font-rajdhani mt-1">
        When cellular fails, AI automatically routes via satellite
      </div>
    </form>
  )
}

function OfflineSync() {
  const [syncing, setSyncing] = useState(false)
  const [messages, setMessages] = useState(offlineMessages)

  const handleSync = () => {
    setSyncing(true)
    setTimeout(() => {
      setMessages(prev => prev.map(m => ({ ...m, status: 'delivered' })))
      setSyncing(false)
    }, 2500)
  }

  const queued = messages.filter(m => m.status === 'queued').length
  const delivered = messages.filter(m => m.status === 'delivered').length

  return (
    <GlassCard>
      <SectionHeader title="Offline Communication" subtitle="Store & sync messaging" icon={MessageSquare} />

      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-4 text-xs font-rajdhani">
          <div className="flex items-center gap-1 text-amber-400"><MessageSquare size={12} /> Queued: {queued}</div>
          <div className="flex items-center gap-1 text-green-400"><CheckCircle size={12} /> Delivered: {delivered}</div>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing || queued === 0}
          className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-rajdhani border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={12} className={syncing ? 'animate-spin' : ''} />
          {syncing ? 'Syncing...' : 'Sync via Satellite'}
        </button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {messages.map(msg => (
          <div key={msg.id} className={`flex items-start gap-3 p-2 rounded text-xs font-rajdhani border ${msg.status === 'queued' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-white/3 border-white/5'}`}>
            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${msg.status === 'delivered' ? 'bg-green-400' : 'bg-amber-400'}`} />
            <div className="flex-1 min-w-0">
              <span className="text-slate-400 font-semibold">{msg.from}: </span>
              <span className="text-slate-300">{msg.message}</span>
            </div>
            <div className="flex flex-col items-end flex-shrink-0">
              <span className="text-slate-600">{msg.time}</span>
              <span className={msg.status === 'delivered' ? 'text-green-400' : 'text-amber-400'}>{msg.status}</span>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}

export default function SOSSystem() {
  const { sosRequests, networkStatus } = useApp()

  return (
    <div className="p-4 sm:p-6 max-w-screen-xl mx-auto">
      <div className="mb-6">
        <h1 className="font-orbitron text-lg font-bold text-white mb-1">EMERGENCY SOS SYSTEM</h1>
        <p className="text-xs text-slate-500 font-rajdhani">Satellite-relayed emergency distress signals with offline capability</p>
      </div>

      {/* Network status */}
      <div className={`mb-6 flex items-center gap-3 p-4 rounded-xl border ${networkStatus.connected ? 'bg-green-500/5 border-green-500/30' : 'bg-red-500/5 border-red-500/30'}`}>
        {networkStatus.connected ? <Wifi size={20} className="text-green-400" /> : <WifiOff size={20} className="text-red-400" />}
        <div>
          <div className={`font-orbitron text-sm ${networkStatus.connected ? 'text-green-400' : 'text-red-400'}`}>
            {networkStatus.connected ? '✓ SATELLITE LINK ACTIVE' : '✗ OFFLINE — QUEUING MESSAGES'}
          </div>
          <div className="text-xs text-slate-400 font-rajdhani">
            Signal: {networkStatus.signalStrength}% | Last sync: {networkStatus.lastSync} | Queued: {networkStatus.offlineQueue}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Active SOS" value={sosRequests.filter(s => s.status === 'Active').length} icon={Radio} color="red" animate />
        <StatCard label="Dispatched" value={sosRequests.filter(s => s.status === 'Dispatched').length} icon={MapPin} color="amber" />
        <StatCard label="Resolved" value={sosRequests.filter(s => s.status === 'Resolved').length} icon={CheckCircle} color="green" />
        <StatCard label="Total Today" value={sosRequests.length + 18} icon={Clock} color="cyan" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <GlassCard>
          <SectionHeader title="Send Emergency SOS" subtitle="Transmitted via satellite constellation" icon={Radio} />
          <SOSForm />
        </GlassCard>

        <div className="flex flex-col gap-4">
          <GlassCard>
            <SectionHeader title="Active SOS Requests" icon={AlertTriangle} />
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {sosRequests.map(sos => (
                <div key={sos.id} className={`flex items-center gap-3 p-3 rounded-lg border text-xs font-rajdhani ${
                  sos.status === 'Active' ? 'bg-red-500/5 border-red-500/20' :
                  sos.status === 'Dispatched' ? 'bg-amber-500/5 border-amber-500/20' :
                  'bg-green-500/5 border-green-500/20'
                }`}>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    sos.status === 'Active' ? 'bg-red-400 animate-pulse' :
                    sos.status === 'Dispatched' ? 'bg-amber-400' : 'bg-green-400'
                  }`} />
                  <div className="flex-1">
                    <div className="font-semibold text-white">{sos.name}</div>
                    <div className="text-slate-500">{sos.location} — {sos.type}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge text={sos.priority} type={sos.priority.toLowerCase()} />
                    <span className="text-slate-600">{sos.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <OfflineSync />
        </div>
      </div>
    </div>
  )
}
