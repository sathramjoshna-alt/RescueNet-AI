import React, { useState } from 'react'
import { Plane, Battery, MapPin, Eye, Thermometer, Clock, Target, Zap } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { StatCard, Badge, ProgressBar, GlassCard, SectionHeader } from '../components/UI'

function DroneCard({ drone }) {
  const batteryColor = drone.battery > 70 ? 'green' : drone.battery > 30 ? 'amber' : 'red'
  const statusColor = {
    Active: 'border-cyan-500/30 bg-cyan-500/5',
    Charging: 'border-amber-500/30 bg-amber-500/5',
    Standby: 'border-slate-500/30 bg-slate-500/5',
  }

  return (
    <GlassCard className={`border ${statusColor[drone.status] || 'border-white/10'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${drone.status === 'Active' ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-slate-700 border border-slate-600'}`}>
            🚁
          </div>
          <div>
            <div className="font-orbitron text-sm font-bold text-white">{drone.name}</div>
            <div className="text-xs text-slate-500 font-rajdhani">{drone.id}</div>
          </div>
        </div>
        <Badge text={drone.status} type={drone.status.toLowerCase()} />
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {[
          { icon: Battery, label: 'Battery', value: `${drone.battery.toFixed(0)}%`, color: drone.battery > 70 ? 'text-green-400' : drone.battery > 30 ? 'text-amber-400' : 'text-red-400' },
          { icon: MapPin, label: 'Altitude', value: `${drone.altitude}m`, color: 'text-cyan-400' },
          { icon: Zap, label: 'Speed', value: `${drone.speed} km/h`, color: 'text-purple-400' },
          { icon: Clock, label: 'Flight Time', value: `${drone.flightTime}m left`, color: 'text-slate-300' },
        ].map(m => {
          const Icon = m.icon
          return (
            <div key={m.label} className="bg-white/3 rounded p-2">
              <div className="flex items-center gap-1 mb-0.5">
                <Icon size={10} className="text-slate-500" />
                <span className="text-xs text-slate-500 font-rajdhani">{m.label}</span>
              </div>
              <div className={`font-orbitron text-xs font-bold ${m.color}`}>{m.value}</div>
            </div>
          )
        })}
      </div>

      {/* Capabilities */}
      <div className="flex gap-2 mb-3">
        <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-rajdhani border ${drone.thermal ? 'border-red-500/30 text-red-400 bg-red-500/5' : 'border-slate-700 text-slate-600'}`}>
          <Thermometer size={10} /> Thermal
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-rajdhani border ${drone.nightVision ? 'border-purple-500/30 text-purple-400 bg-purple-500/5' : 'border-slate-700 text-slate-600'}`}>
          <Eye size={10} /> Night Vision
        </div>
      </div>

      {/* Battery bar */}
      <ProgressBar value={drone.battery} color={batteryColor} label="Battery" />

      {/* Stats */}
      <div className="flex items-center justify-between mt-3 text-xs font-rajdhani">
        <div className="flex items-center gap-1 text-green-400">
          <Target size={10} />
          {drone.victimsFound} found
        </div>
        <div className="text-slate-500">{drone.mission}</div>
        <div className={`font-orbitron ${drone.successRate > 90 ? 'text-green-400' : 'text-amber-400'}`}>{drone.successRate}%</div>
      </div>
    </GlassCard>
  )
}

function DroneMap() {
  const { drones } = useApp()

  return (
    <GlassCard>
      <SectionHeader title="Drone Fleet Map" subtitle="Real-time positions" icon={Plane} />
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg h-48 overflow-hidden border border-white/5">
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="absolute border-t border-cyan-500" style={{ top: `${(i + 1) * 12.5}%`, left: 0, right: 0 }} />
          ))}
          {[...Array(8)].map((_, i) => (
            <div key={i} className="absolute border-l border-cyan-500" style={{ left: `${(i + 1) * 12.5}%`, top: 0, bottom: 0 }} />
          ))}
        </div>

        {/* India outline placeholder */}
        <div className="absolute inset-0 flex items-center justify-center text-slate-700 font-orbitron text-sm">INDIA — MISSION THEATER</div>

        {/* Drone positions */}
        {drones.map((drone, i) => (
          <div
            key={drone.id}
            className="absolute group"
            style={{
              left: `${15 + (i * 16)}%`,
              top: `${20 + (i % 3) * 22}%`,
            }}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${drone.status === 'Active' ? 'bg-cyan-500 animate-pulse' : 'bg-amber-500'}`}>
              ✈
            </div>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block whitespace-nowrap bg-slate-900 border border-cyan-500/30 rounded px-2 py-1 text-xs font-rajdhani text-white z-10">
              {drone.name} — {drone.battery.toFixed(0)}% batt
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}

export default function DroneDashboard() {
  const { drones } = useApp()

  const activeCount = drones.filter(d => d.status === 'Active').length
  const totalVictimsFound = drones.reduce((a, b) => a + b.victimsFound, 0)
  const avgBattery = Math.round(drones.reduce((a, b) => a + b.battery, 0) / drones.length)
  const avgSuccess = Math.round(drones.reduce((a, b) => a + b.successRate, 0) / drones.length)

  return (
    <div className="p-4 sm:p-6 max-w-screen-xl mx-auto">
      <div className="mb-6">
        <h1 className="font-orbitron text-lg font-bold text-white mb-1">DRONE FLEET MANAGEMENT</h1>
        <p className="text-xs text-slate-500 font-rajdhani">Autonomous UAV intelligence with thermal & night vision</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Active Drones" value={activeCount} icon={Plane} color="cyan" />
        <StatCard label="Victims Found" value={totalVictimsFound} icon={Target} color="green" />
        <StatCard label="Avg Battery" value={`${avgBattery}%`} icon={Battery} color="amber" />
        <StatCard label="Avg Success" value={`${avgSuccess}%`} icon={Zap} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <DroneMap />
        <div className="col-span-2 glass-card p-4">
          <SectionHeader title="Fleet Intelligence Summary" icon={Zap} />
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: 'Missions Completed Today', value: 14, max: 20, color: 'cyan' },
              { label: 'Thermal Coverage', value: 78, max: 100, color: 'red' },
              { label: 'Area Surveyed (km²)', value: 340, max: 500, color: 'purple' },
            ].map(m => (
              <div key={m.label}>
                <div className="text-xs text-slate-500 font-rajdhani mb-1">{m.label}</div>
                <div className="font-orbitron text-2xl font-bold text-cyan-400 mb-1">{m.value}</div>
                <ProgressBar value={m.value} max={m.max} color={m.color} showPercent />
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
            <div className="text-xs font-orbitron text-cyan-400 mb-2">AI DRONE RECOMMENDATIONS</div>
            <ul className="space-y-1 text-xs font-rajdhani text-slate-300">
              <li className="flex gap-2"><span className="text-cyan-400">▸</span> Kite-4 at 23% battery — auto-returning to base</li>
              <li className="flex gap-2"><span className="text-cyan-400">▸</span> Eagle-1 thermal detected 3 new heat signatures</li>
              <li className="flex gap-2"><span className="text-cyan-400">▸</span> Sector B-7 requires night vision coverage at 20:00</li>
              <li className="flex gap-2"><span className="text-cyan-400">▸</span> Suggest deploying Hawk-3 to Gangtok landslide</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {drones.map(drone => <DroneCard key={drone.id} drone={drone} />)}
      </div>
    </div>
  )
}
