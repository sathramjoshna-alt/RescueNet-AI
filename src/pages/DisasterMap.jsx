import React, { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import { AlertTriangle, Filter, Layers, Eye, Radio, Satellite, WifiOff, Signal, Navigation } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { GlassCard, Badge, StatusDot } from '../components/UI'
import { disasterZones, rescueTeams, victims } from '../data/mockData'

// Custom icons
const createIcon = (color, size = 24) => L.divIcon({
  html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 0 10px ${color};display:flex;align-items:center;justify-content:center;"></div>`,
  iconSize: [size, size],
  iconAnchor: [size / 2, size / 2],
  className: '',
})

const disasterColors = {
  Flood: '#3b82f6',
  Cyclone: '#a855f7',
  Earthquake: '#f59e0b',
  Wildfire: '#ef4444',
  Landslide: '#92400e',
}

const disasterEmojis = {
  Flood: '🌊',
  Cyclone: '🌀',
  Earthquake: '🏔️',
  Wildfire: '🔥',
  Landslide: '⛰️',
}

function HeatmapLayer({ zones, show }) {
  const map = useMap()
  const layerRef = useRef(null)

  useEffect(() => {
    if (!show) {
      if (layerRef.current) { map.removeLayer(layerRef.current); layerRef.current = null }
      return
    }
    if (layerRef.current) map.removeLayer(layerRef.current)
    const group = L.layerGroup()
    zones.forEach(z => {
      const color = disasterColors[z.type] || '#00d4ff'
      const severityRadius = z.severity === 'Critical' ? 80000 : z.severity === 'High' ? 50000 : 30000
      ;[severityRadius, severityRadius * 0.6, severityRadius * 0.3].forEach((r, i) => {
        L.circle([z.lat, z.lng], {
          radius: r,
          color: color,
          fillColor: color,
          fillOpacity: (3 - i) * 0.08,
          weight: i === 0 ? 1 : 0,
        }).addTo(group)
      })
    })
    group.addTo(map)
    layerRef.current = group
    return () => { if (layerRef.current) map.removeLayer(layerRef.current) }
  }, [zones, show, map])

  return null
}

// ─── Communication Blackout Layer ────────────────────────────────────────
const BLACKOUT_ZONES = [
  { lat: 22.5726, lng: 88.3639, radius: 60000, label: 'Kolkata Blackout', status: 'blackout' },
  { lat: 20.2961, lng: 85.8245, radius: 50000, label: 'Bhubaneswar Blackout', status: 'blackout' },
  { lat: 27.5330, lng: 88.5122, radius: 35000, label: 'Gangtok Blackout', status: 'blackout' },
  { lat: 22.8, lng: 88.6, radius: 40000, label: 'Satellite Coverage LEO', status: 'satellite' },
  { lat: 20.5, lng: 85.5, radius: 55000, label: 'Satellite Coverage GEO', status: 'satellite' },
  { lat: 22.4, lng: 88.1, radius: 30000, label: 'Comm Restored — Alpha Zone', status: 'restored' },
]

function BlackoutLayer({ show }) {
  const map = useMap()
  const ref = useRef(null)
  useEffect(() => {
    if (!show) { if (ref.current) { map.removeLayer(ref.current); ref.current = null }; return }
    if (ref.current) map.removeLayer(ref.current)
    const g = L.layerGroup()
    BLACKOUT_ZONES.forEach(z => {
      const colors = {
        blackout: { color: '#ef4444', fill: '#ef4444', opacity: 0.12 },
        satellite: { color: '#10b981', fill: '#10b981', opacity: 0.08 },
        restored: { color: '#f59e0b', fill: '#f59e0b', opacity: 0.1 },
      }
      const c = colors[z.status]
      L.circle([z.lat, z.lng], { radius: z.radius, color: c.color, fillColor: c.fill, fillOpacity: c.opacity, weight: 1.5, dashArray: '6,4' })
        .bindTooltip(`<div style="background:#0a1628;color:white;border:1px solid ${c.color}40;padding:4px 8px;font-size:11px;font-family:Rajdhani,sans-serif;border-radius:4px">${z.label}</div>`, { sticky: true, opacity: 1 })
        .addTo(g)
    })
    g.addTo(map)
    ref.current = g
    return () => { if (ref.current) map.removeLayer(ref.current) }
  }, [show, map])
  return null
}

// ─── Animated dot along a polyline ───────────────────────────────────────
function AnimatedDot({ from, to }) {
  const map = useMap()
  const markerRef = useRef(null)
  const frameRef = useRef(null)
  const progressRef = useRef(0)

  useEffect(() => {
    const icon = L.divIcon({
      html: '<div style="width:10px;height:10px;border-radius:50%;background:#10b981;box-shadow:0 0 8px #10b981;border:2px solid white;"></div>',
      iconSize: [10, 10],
      iconAnchor: [5, 5],
      className: '',
    })
    const marker = L.marker(from, { icon, zIndexOffset: 1000 }).addTo(map)
    markerRef.current = marker

    const animate = () => {
      progressRef.current = (progressRef.current + 0.002) % 1
      const t = progressRef.current
      const lat = from[0] + (to[0] - from[0]) * t
      const lng = from[1] + (to[1] - from[1]) * t
      marker.setLatLng([lat, lng])
      frameRef.current = requestAnimationFrame(animate)
    }
    frameRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frameRef.current)
      map.removeLayer(marker)
    }
  }, [map, from, to])

  return null
}

// ─── Rescue route overlay for active missions ─────────────────────────────
function RescueRouteLayer({ missions, teams, show }) {
  if (!show || !missions.length) return null

  return missions.map(mission => {
    const team = teams.find(t => t.id === mission.teamId)
    if (!team) return null
    const from = [team.lat, team.lng]
    const to = [mission.victimLat, mission.victimLng]
    return (
      <React.Fragment key={mission.id}>
        <Polyline
          positions={[from, to]}
          pathOptions={{ color: '#10b981', weight: 2, dashArray: '8 6', opacity: 0.85 }}
        />
        <AnimatedDot from={from} to={to} />
        <Marker
          position={to}
          icon={L.divIcon({
            html: `<div style="background:#ef4444;color:white;font-size:9px;padding:2px 5px;border-radius:3px;white-space:nowrap;font-family:Rajdhani,sans-serif;font-weight:700;border:1px solid #ef4444;box-shadow:0 0 6px #ef444460">${mission.victim}</div>`,
            className: '',
            iconAnchor: [0, 12],
          })}
        />
      </React.Fragment>
    )
  })
}

export default function DisasterMap() {
  const { disasterZones: zones, satellites, activeMissions, rescueTeams: liveTeams } = useApp()
  const [activeFilters, setActiveFilters] = useState(['Flood', 'Cyclone', 'Earthquake', 'Wildfire', 'Landslide'])
  const [showTeams, setShowTeams] = useState(true)
  const [showVictims, setShowVictims] = useState(true)
  const [showHeatmap, setShowHeatmap] = useState(true)
  const [showBlackout, setShowBlackout] = useState(true)
  const [showRoutes, setShowRoutes] = useState(true)
  const [selected, setSelected] = useState(null)

  // Merge mockData teams with live teams from context
  const allTeams = liveTeams && liveTeams.length ? liveTeams : rescueTeams

  const toggleFilter = (type) => {
    setActiveFilters(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type])
  }

  const filteredZones = zones.filter(z => activeFilters.includes(z.type))

  return (
    <div className="h-[calc(100vh-56px)] flex flex-col">
      {/* Controls bar */}
      <div className="glass border-b border-cyan-500/20 px-4 py-2 flex flex-wrap items-center gap-3 z-20 relative">
        <div className="flex items-center gap-1 text-xs font-orbitron text-cyan-400">
          <Layers size={14} />
          LAYERS
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.keys(disasterColors).map(type => (
            <button
              key={type}
              onClick={() => toggleFilter(type)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-rajdhani transition-all ${activeFilters.includes(type) ? 'text-white border' : 'text-slate-500 border border-slate-700'}`}
              style={activeFilters.includes(type) ? { borderColor: disasterColors[type] + '80', background: disasterColors[type] + '20' } : {}}
            >
              {disasterEmojis[type]} {type}
            </button>
          ))}
        </div>
        <div className="flex gap-2 ml-auto flex-wrap">
          <button onClick={() => setShowHeatmap(p => !p)} className={`px-2 py-1 rounded text-xs font-rajdhani border transition-all ${showHeatmap ? 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10' : 'border-slate-700 text-slate-500'}`}>
            Heatmap
          </button>
          <button onClick={() => setShowBlackout(p => !p)} className={`px-2 py-1 rounded text-xs font-rajdhani border transition-all ${showBlackout ? 'border-red-500/40 text-red-400 bg-red-500/10' : 'border-slate-700 text-slate-500'}`}>
            <WifiOff size={10} className="inline mr-1" />Blackout
          </button>
          <button onClick={() => setShowTeams(p => !p)} className={`px-2 py-1 rounded text-xs font-rajdhani border transition-all ${showTeams ? 'border-green-500/40 text-green-400 bg-green-500/10' : 'border-slate-700 text-slate-500'}`}>
            Teams
          </button>
          <button onClick={() => setShowVictims(p => !p)} className={`px-2 py-1 rounded text-xs font-rajdhani border transition-all ${showVictims ? 'border-red-500/40 text-red-400 bg-red-500/10' : 'border-slate-700 text-slate-500'}`}>
            Victims
          </button>
          <button onClick={() => setShowRoutes(p => !p)} className={`relative px-2 py-1 rounded text-xs font-rajdhani border transition-all ${showRoutes ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' : 'border-slate-700 text-slate-500'}`}>
            <Navigation size={10} className="inline mr-1" />Routes
            {activeMissions.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full text-xs flex items-center justify-center text-white font-bold">{activeMissions.length}</span>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Map */}
        <div className="flex-1 relative">
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='© OpenStreetMap'
            />

            <HeatmapLayer zones={filteredZones} show={showHeatmap} />
            <BlackoutLayer show={showBlackout} />

            {/* Disaster zones */}
            {filteredZones.map(zone => (
              <React.Fragment key={zone.id}>
                <Circle
                  center={[zone.lat, zone.lng]}
                  radius={zone.severity === 'Critical' ? 45000 : zone.severity === 'High' ? 30000 : 20000}
                  color={disasterColors[zone.type]}
                  fillColor={disasterColors[zone.type]}
                  fillOpacity={0.15}
                  weight={2}
                />
                <Marker
                  position={[zone.lat, zone.lng]}
                  icon={createIcon(disasterColors[zone.type], zone.severity === 'Critical' ? 28 : 22)}
                  eventHandlers={{ click: () => setSelected({ ...zone, category: 'disaster' }) }}
                >
                  <Popup className="custom-popup">
                    <div className="bg-slate-900 text-white p-3 rounded min-w-48">
                      <div className="font-orbitron text-sm font-bold mb-2" style={{ color: disasterColors[zone.type] }}>
                        {disasterEmojis[zone.type]} {zone.type} — {zone.state}
                      </div>
                      <div className="text-xs space-y-1 font-rajdhani">
                        <div>Severity: <span className="text-red-400">{zone.severity}</span></div>
                        <div>Victims: <span className="text-amber-400">{zone.victims.toLocaleString()}</span></div>
                        <div>Rescued: <span className="text-green-400">{zone.rescued.toLocaleString()}</span></div>
                        <div>Status: <span className={zone.active ? 'text-cyan-400' : 'text-slate-400'}>{zone.active ? 'Active' : 'Contained'}</span></div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            ))}

            <RescueRouteLayer missions={activeMissions} teams={allTeams} show={showRoutes} />

            {/* Rescue teams */}
            {showTeams && allTeams.map(team => (
              <Marker
                key={team.id}
                position={[team.lat + 0.1, team.lng + 0.1]}
                icon={createIcon('#10b981', 16)}
              >
                <Popup>
                  <div className="bg-slate-900 text-white p-2 rounded min-w-40">
                    <div className="font-orbitron text-xs font-bold text-green-400 mb-1">{team.name}</div>
                    <div className="text-xs font-rajdhani space-y-0.5">
                      <div>{team.type}</div>
                      <div>Members: {team.members}</div>
                      <div>Rescued: {team.victims_rescued}</div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Victims */}
            {showVictims && victims.filter(v => v.status !== 'Rescued').map(victim => (
              <Marker
                key={victim.id}
                position={[victim.lat, victim.lng]}
                icon={createIcon(victim.priority === 'Critical' ? '#ef4444' : '#f59e0b', 14)}
              >
                <Popup>
                  <div className="bg-slate-900 text-white p-2 rounded min-w-40">
                    <div className="font-orbitron text-xs font-bold text-red-400 mb-1">{victim.name}</div>
                    <div className="text-xs font-rajdhani space-y-0.5">
                      <div>Priority: {victim.priority}</div>
                      <div>Medical: {victim.medical}</div>
                      <div>Status: {victim.status}</div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Map Legend */}
          <div className="absolute bottom-4 right-4 z-[1000] glass-card p-3 text-xs font-rajdhani space-y-1.5" style={{ maxWidth: 160 }}>
            <div className="font-orbitron text-xs text-cyan-400 mb-2">LEGEND</div>
            {Object.entries(disasterColors).map(([type, color]) => (
              <div key={type} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
                <span className="text-slate-300">{type}</span>
              </div>
            ))}
            <div className="pt-1 mt-1 border-t border-white/10 space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400 border border-red-400" style={{ background: 'transparent' }} />
                <span className="text-red-300">Comm Blackout</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border border-green-400" style={{ background: 'transparent' }} />
                <span className="text-green-300">Satellite Coverage</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border border-amber-400" style={{ background: 'transparent' }} />
                <span className="text-amber-300">Comm Restored</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-400" style={{ boxShadow: '0 0 6px #10b981' }} />
                <span className="text-slate-300">Rescue Team</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" style={{ boxShadow: '0 0 6px #ef4444' }} />
                <span className="text-slate-300">Victim (Critical)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 border-t-2 border-dashed border-emerald-400" />
                <span className="text-emerald-300">Rescue Route</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="hidden lg:flex flex-col w-72 glass border-l border-cyan-500/20 overflow-y-auto p-3 gap-3">
          <div className="font-orbitron text-xs text-cyan-400">DISASTER ZONES</div>
          {filteredZones.map(zone => (
            <div
              key={zone.id}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${selected?.id === zone.id ? 'border-cyan-500/40 bg-cyan-500/5' : 'border-white/5 hover:border-white/15'}`}
              onClick={() => setSelected({ ...zone, category: 'disaster' })}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">{disasterEmojis[zone.type]}</span>
                <div>
                  <div className="text-xs font-semibold text-white font-rajdhani">{zone.type}</div>
                  <div className="text-xs text-slate-500 font-rajdhani">{zone.state}</div>
                </div>
                <Badge text={zone.severity} type={zone.severity.toLowerCase()} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-rajdhani">
                <div className="text-slate-500">Victims: <span className="text-amber-400">{zone.victims}</span></div>
                <div className="text-slate-500">Rescued: <span className="text-green-400">{zone.rescued}</span></div>
              </div>
              <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-green-600 to-green-400" style={{ width: `${Math.round((zone.rescued / zone.victims) * 100)}%` }} />
              </div>
            </div>
          ))}

          <div className="font-orbitron text-xs text-cyan-400 mt-2">ACTIVE ALERTS</div>
          {[
            { msg: 'Flood spreading north — W. Bengal', time: '2m ago', type: 'critical' },
            { msg: 'Cyclone track updated — Odisha', time: '5m ago', type: 'warning' },
            { msg: 'Landslide risk elevated — Sikkim', time: '12m ago', type: 'warning' },
          ].map((a, i) => (
            <div key={i} className={`p-2 rounded text-xs font-rajdhani border ${a.type === 'critical' ? 'bg-red-500/5 border-red-500/20 text-red-300' : 'bg-amber-500/5 border-amber-500/20 text-amber-300'}`}>
              <div>{a.msg}</div>
              <div className="text-slate-600 mt-0.5">{a.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
