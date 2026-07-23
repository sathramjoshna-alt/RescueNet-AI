import React, { useState, useEffect } from 'react'
import { Activity, AlertTriangle, Thermometer, Wind, Droplets, Waves, Zap } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { StatCard, Badge, ProgressBar, GlassCard, SectionHeader, StatusDot } from '../components/UI'
import { iotSensors } from '../data/mockData'

const sensorIcons = {
  'River Level': Waves,
  'Rainfall': Droplets,
  'Earthquake': Activity,
  'Gas Leakage': AlertTriangle,
  'Air Quality': Wind,
  'Temperature': Thermometer,
  'Humidity': Droplets,
  'Wind Speed': Wind,
}

const sensorColors = {
  Critical: { text: 'text-red-400', border: 'border-red-500/30', bg: 'bg-red-500/5', icon: 'bg-red-500/20' },
  Warning: { text: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/5', icon: 'bg-amber-500/20' },
  Normal: { text: 'text-green-400', border: 'border-green-500/30', bg: 'bg-green-500/5', icon: 'bg-green-500/20' },
}

function SensorCard({ sensor }) {
  const Icon = sensorIcons[sensor.type] || Activity
  const c = sensorColors[sensor.status]
  const pct = Math.min(100, Math.round((sensor.value / (sensor.threshold * 1.5)) * 100))

  return (
    <GlassCard className={`border ${c.border} ${c.bg} hover-glow`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-9 h-9 rounded-lg ${c.icon} flex items-center justify-center`}>
            <Icon size={16} className={c.text} />
          </div>
          <div>
            <div className="font-orbitron text-xs font-bold text-white">{sensor.type}</div>
            <div className="text-xs text-slate-500 font-rajdhani">{sensor.location}</div>
          </div>
        </div>
        <Badge text={sensor.status} type={sensor.status.toLowerCase() === 'normal' ? 'active' : sensor.status.toLowerCase()} />
      </div>

      <div className="text-center mb-3">
        <div className={`font-orbitron text-3xl font-black ${c.text}`}>
          {typeof sensor.value === 'number' ? sensor.value.toFixed(sensor.unit === 'Richter' || sensor.unit === '°C' ? 1 : 0) : sensor.value}
        </div>
        <div className="text-xs text-slate-500 font-rajdhani">{sensor.unit}</div>
        <div className="text-xs text-slate-600 font-rajdhani mt-0.5">Threshold: {sensor.threshold} {sensor.unit}</div>
      </div>

      <ProgressBar value={pct} color={sensor.status === 'Critical' ? 'red' : sensor.status === 'Warning' ? 'amber' : 'green'} label={sensor.name.split(' - ')[0]} />

      {sensor.status !== 'Normal' && (
        <div className={`mt-2 text-xs font-rajdhani flex items-center gap-1 ${c.text}`}>
          <AlertTriangle size={10} />
          {sensor.status === 'Critical' ? 'IMMEDIATE ACTION REQUIRED' : 'Monitoring closely — threshold exceeded'}
        </div>
      )}
    </GlassCard>
  )
}

function LiveFeed() {
  const [events, setEvents] = useState([
    { time: '09:28:14', sensor: 'Hooghly River', msg: 'Level rising: 8.7m (+0.3m/hr)', type: 'critical' },
    { time: '09:27:02', sensor: 'Gas Sensor Panaji', msg: 'PPM: 320 — Critical threshold exceeded', type: 'critical' },
    { time: '09:25:44', sensor: 'Seismograph Chandigarh', msg: 'Tremor detected: 4.2 Richter', type: 'warning' },
    { time: '09:24:11', sensor: 'Rain Gauge Bhubaneswar', msg: 'Rainfall: 185mm/hr — Warning level', type: 'warning' },
    { time: '09:22:30', sensor: 'Wind Sensor Chennai', msg: 'Wind: 95km/h — Cyclone track confirmed', type: 'warning' },
    { time: '09:20:18', sensor: 'Air Quality Mumbai', msg: 'AQI: 187 — Unhealthy for sensitive groups', type: 'info' },
  ])

  useEffect(() => {
    const t = setInterval(() => {
      const msgs = [
        { sensor: 'River Monitor', msg: 'Water level update: ' + (8 + Math.random()).toFixed(1) + 'm', type: 'warning' },
        { sensor: 'Wind Sensor', msg: 'Wind speed: ' + Math.round(80 + Math.random() * 20) + 'km/h', type: 'info' },
        { sensor: 'Seismograph', msg: 'Micro-tremor: ' + (2 + Math.random() * 2).toFixed(1) + ' Richter', type: 'info' },
      ]
      const msg = msgs[Math.floor(Math.random() * msgs.length)]
      setEvents(prev => [{ ...msg, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) }, ...prev.slice(0, 14)])
    }, 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <GlassCard>
      <SectionHeader title="Live Sensor Feed" subtitle="Real-time telemetry stream" icon={Activity} />
      <div className="space-y-1.5 max-h-64 overflow-y-auto">
        {events.map((e, i) => (
          <div key={i} className={`flex gap-2 text-xs p-2 rounded font-rajdhani ${e.type === 'critical' ? 'bg-red-500/5 border border-red-500/20' : e.type === 'warning' ? 'bg-amber-500/5 border border-amber-500/20' : 'bg-white/3 border border-white/5'}`}>
            <span className="font-orbitron text-slate-600 flex-shrink-0">{e.time}</span>
            <span className={`flex-shrink-0 ${e.type === 'critical' ? 'text-red-400' : e.type === 'warning' ? 'text-amber-400' : 'text-cyan-400'}`}>{e.sensor}</span>
            <span className="text-slate-400 flex-1 truncate">{e.msg}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}

export default function IoTMonitor() {
  const critical = iotSensors.filter(s => s.status === 'Critical').length
  const warning = iotSensors.filter(s => s.status === 'Warning').length
  const normal = iotSensors.filter(s => s.status === 'Normal').length

  return (
    <div className="p-4 sm:p-6 max-w-screen-xl mx-auto">
      <div className="mb-6">
        <h1 className="font-orbitron text-lg font-bold text-white mb-1">IoT SENSOR NETWORK</h1>
        <p className="text-xs text-slate-500 font-rajdhani">500+ ground sensors monitoring environmental conditions</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Sensors" value={iotSensors.length} icon={Activity} color="cyan" />
        <StatCard label="Critical" value={critical} icon={AlertTriangle} color="red" animate={critical > 0} />
        <StatCard label="Warning" value={warning} icon={Zap} color="amber" />
        <StatCard label="Normal" value={normal} icon={Thermometer} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="grid sm:grid-cols-2 gap-4">
            {iotSensors.map(s => <SensorCard key={s.id} sensor={s} />)}
          </div>
        </div>
        <div>
          <LiveFeed />
        </div>
      </div>
    </div>
  )
}
