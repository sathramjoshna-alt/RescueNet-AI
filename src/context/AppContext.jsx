import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { satellites as initSatellites, disasterZones, rescueTeams as initRescueTeams, drones as initDrones, iotSensors } from '../data/mockData'

const AppContext = createContext()

// ─── Demo accounts (role detection by email) ─────────────────────────────
const DEMO_ACCOUNTS = [
  {
    email: 'admin@rescuenet.ai',
    password: 'Mission@2026',
    name: 'Arjun Sharma',
    role: 'admin',
    roleLabel: 'MISSION COMMANDER',
    clearance: 'ALPHA-7',
    redirectTo: '/dashboard',
  },
  {
    email: 'rescue01@rescuenet.ai',
    password: 'Rescue@2026',
    name: 'Priya Patel',
    role: 'rescue',
    roleLabel: 'RESCUE TEAM LEADER',
    clearance: 'BRAVO-3',
    teamId: 'RT-001',
    teamName: 'Alpha Strike Team',
    redirectTo: '/rescue-dashboard',
  },
  {
    email: 'user01@rescuenet.ai',
    password: 'User@2026',
    name: 'Ramesh Kumar',
    role: 'user',
    roleLabel: 'REGISTERED USER',
    clearance: 'USER',
    redirectTo: '/user-dashboard',
  },
]

export function authenticateUser(email, password) {
  const acc = DEMO_ACCOUNTS.find(a => a.email === email && a.password === password)
  if (acc) return { ...acc, password: undefined }
  // Fallback: any valid email/password → admin
  if (email && password.length >= 6) {
    return { email, name: email.split('@')[0], role: 'admin', roleLabel: 'MISSION COMMANDER', clearance: 'ALPHA-7', redirectTo: '/dashboard' }
  }
  return null
}

// ─── Nearest team selector ────────────────────────────────────────────────
function pickNearestTeam(teams, lat, lng) {
  const available = teams.filter(t => t.status === 'Active' || t.status === 'Standby')
  if (!available.length) return teams[0]
  return available.reduce((best, t) => {
    const d = Math.hypot(t.lat - lat, t.lng - lng)
    const bd = Math.hypot(best.lat - lat, best.lng - lng)
    return d < bd ? t : best
  })
}

// ─── Mission rescue stages ────────────────────────────────────────────────
export const RESCUE_STAGES = [
  { key: 'assigned',   label: 'Mission Assigned',   icon: '📋' },
  { key: 'started',    label: 'Vehicle Started',     icon: '🚒' },
  { key: 'enroute',    label: 'En Route',            icon: '🛣️' },
  { key: 'arrived',    label: 'Arrived',             icon: '📍' },
  { key: 'inprogress', label: 'Rescue In Progress',  icon: '🦺' },
  { key: 'safe',       label: 'Victim Safe',         icon: '✅' },
  { key: 'completed',  label: 'Mission Completed',   icon: '🎉' },
]

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)

  // ── Satellite state ───────────────────────────────────────────────────────
  const [activeSatellite, setActiveSatellite] = useState(initSatellites[0])
  const [satellites, setSatellites] = useState(initSatellites)
  const [drones, setDrones] = useState(initDrones)
  const [currentOrbit, setCurrentOrbit] = useState('LEO')
  const [switchingLog, setSwitchingLog] = useState([
    { time: '09:00', from: 'GEO', to: 'LEO', reason: 'Lower latency required', success: true },
    { time: '08:30', from: 'LEO', to: 'MEO', reason: 'Higher bandwidth needed', success: true },
    { time: '07:45', from: 'MEO', to: 'GEO', reason: 'Coverage expansion', success: true },
  ])

  // ── Alerts & notifications ────────────────────────────────────────────────
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'critical', message: 'Flood Level CRITICAL in West Bengal — 1240 affected', time: '09:14', read: false },
    { id: 2, type: 'warning',  message: 'Cyclone approaching Odisha coast — ETA 18 hours', time: '09:02', read: false },
    { id: 3, type: 'info',     message: 'SAT-LEO-01 signal strength optimal', time: '08:55', read: true },
    { id: 4, type: 'critical', message: '🆘 SOS signal received from Gangtok — Infant emergency', time: '08:48', read: false },
    { id: 5, type: 'warning',  message: 'IOT Gas Sensor threshold exceeded — Panaji', time: '08:30', read: true },
  ])

  // Pop-up notifications (slide-in toasts)
  const [notifications, setNotifications] = useState([])
  const notifTimerRef = useRef({})

  // ── SOS & mission state ───────────────────────────────────────────────────
  const [sosRequests, setSosRequests] = useState([
    { id: 'SOS-001', name: 'Ramesh Gupta', location: 'Kolkata', lat: 22.57, lng: 88.36, priority: 'Critical', type: 'Flood', time: '09:08', status: 'Active', satellite: 'LEO-01' },
    { id: 'SOS-002', name: 'Anitha Reddy', location: 'Bhubaneswar', lat: 20.30, lng: 85.82, priority: 'High', type: 'Cyclone', time: '09:02', status: 'Dispatched', satellite: 'MEO-01' },
    { id: 'SOS-003', name: 'Vijay Patel', location: 'Gangtok', lat: 27.33, lng: 88.51, priority: 'Critical', type: 'Landslide', time: '08:55', status: 'Active', satellite: 'LEO-02' },
    { id: 'SOS-004', name: 'Meena Das', location: 'Ludhiana', lat: 30.90, lng: 75.85, priority: 'High', type: 'Earthquake', time: '08:40', status: 'Resolved', satellite: 'GEO-01' },
  ])

  const [pendingSOS, setPendingSOS] = useState([])
  const [pendingSOSCount, setPendingSOSCount] = useState(0)
  const [activeMissions, setActiveMissions] = useState([])
  const [victimTracking, setVictimTracking] = useState([])
  const [rescueTeams, setRescueTeams] = useState(initRescueTeams)

  const [networkStatus, setNetworkStatus] = useState({
    connected: true,
    offlineQueue: 3,
    lastSync: new Date().toLocaleTimeString(),
    signalStrength: 94,
  })
  const [threatLevel, setThreatLevel] = useState('CRITICAL')
  const [missionStats, setMissionStats] = useState({
    totalVictims: 3130,
    rescued: 1451,
    pending: 1679,
    criticalCases: 234,
    teamsDeployed: 6,
    dronesActive: 4,
    satellitesOnline: 6,
    missionDuration: '14h 32m',
  })

  // ── Live telemetry simulation ─────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setSatellites(prev => prev.map(sat => ({
        ...sat,
        signal: Math.max(70, Math.min(99, sat.signal + (Math.random() - 0.5) * 4)),
        bandwidth: Math.max(200, Math.min(2000, sat.bandwidth + (Math.random() - 0.5) * 30)),
        latency: Math.max(20, Math.min(600, sat.latency + (Math.random() - 0.5) * 5)),
      })))
      setDrones(prev => prev.map(drone => ({
        ...drone,
        battery: drone.status === 'Charging'
          ? Math.min(100, drone.battery + 2)
          : Math.max(5, drone.battery - 0.2),
        altitude: drone.status === 'Active'
          ? Math.max(50, Math.min(200, drone.altitude + (Math.random() - 0.5) * 10))
          : 0,
      })))
      setMissionStats(prev => ({
        ...prev,
        rescued: Math.min(prev.totalVictims, prev.rescued + Math.floor(Math.random() * 3)),
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // ── Mission stage auto-advance ────────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => {
      setActiveMissions(prev => prev.map(m => {
        const elapsed = m.elapsedSeconds + 1
        // Stage advancement: assign each stage to a time window
        const stageTimes = [0, 8, 20, 45, 90, 150, 200]
        const stageIdx = stageTimes.findIndex((s, i) => elapsed < (stageTimes[i + 1] || 9999))
        const newStageIdx = Math.min(stageIdx, RESCUE_STAGES.length - 1)
        return { ...m, elapsedSeconds: elapsed, stageIndex: newStageIdx }
      }))
    }, 1000)
    return () => clearInterval(t)
  }, [])

  // ── Orbit switch ──────────────────────────────────────────────────────────
  const switchOrbit = useCallback((newOrbit, reason = 'Manual override') => {
    const bestSat = satellites.find(s => s.type === newOrbit && s.status === 'active')
    if (bestSat) {
      setSwitchingLog(prev => [
        { time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), from: currentOrbit, to: newOrbit, reason, success: true },
        ...prev.slice(0, 9),
      ])
      setCurrentOrbit(newOrbit)
      setActiveSatellite(bestSat)
    }
  }, [currentOrbit, satellites])

  // ── Alert helpers ─────────────────────────────────────────────────────────
  const addAlert = useCallback((type, message) => {
    const id = Date.now()
    const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    setAlerts(prev => [{ id, type, message, time, read: false }, ...prev.slice(0, 19)])
    return id
  }, [])

  const markAlertRead = useCallback((id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a))
  }, [])

  // ── Toast notifications ───────────────────────────────────────────────────
  const pushNotification = useCallback((type, message, duration = 5000) => {
    const id = Date.now()
    setNotifications(prev => [{ id, type, message, ts: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }, ...prev.slice(0, 4)])
    notifTimerRef.current[id] = setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, duration)
    return id
  }, [])

  const dismissNotification = useCallback((id) => {
    clearTimeout(notifTimerRef.current[id])
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  // ── CORE: dispatch SOS ────────────────────────────────────────────────────
  const dispatchSOS = useCallback((sosData) => {
    const now = new Date()
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    const leoSat = satellites.find(s => s.type === 'LEO' && s.status === 'active')
    const satName = leoSat?.name || 'VIASAT-LEO-01'
    const satType = leoSat?.type || 'LEO'
    const nearestTeam = pickNearestTeam(rescueTeams, sosData.lat || 20.5, sosData.lng || 78.9)
    const etaMinutes = Math.floor(Math.random() * 20) + 12

    const fullSOS = {
      id: `SOS-LIVE-${Date.now()}`,
      name: sosData.name || 'Unknown Victim',
      location: sosData.location || 'India',
      lat: sosData.lat || 20.5937,
      lng: sosData.lng || 78.9629,
      gps: sosData.gps || `${(sosData.lat || 20.59).toFixed(4)}°N, ${(sosData.lng || 78.96).toFixed(4)}°E`,
      priority: sosData.priority || 'Critical',
      type: sosData.type || 'Flood',
      medical: sosData.medical || 'Unknown — requires assessment',
      satellite: satType,
      satelliteName: satName,
      signal: leoSat ? Math.round(leoSat.signal) : 94,
      latency: leoSat ? Math.round(leoSat.latency) : 28,
      time: timeStr,
      receivedAt: now.toISOString(),
      nearestTeam: nearestTeam?.name || 'Alpha Strike Team',
      nearestTeamId: nearestTeam?.id || 'RT-001',
      etaMinutes,
      eta: `${etaMinutes} min`,
      status: 'Pending',
      commStatus: 'Active via Satellite',
    }

    setPendingSOS(prev => [fullSOS, ...prev])
    setPendingSOSCount(prev => prev + 1)
    setSosRequests(prev => [{ ...fullSOS, status: 'Active' }, ...prev])

    setVictimTracking(prev => [{
      ...fullSOS,
      trackingId: fullSOS.id,
      rescueStatus: 'SOS Received — Awaiting Team',
      assignedTeam: null,
      missionStarted: null,
    }, ...prev])

    addAlert('critical', `🆘 New SOS via ${satType}: ${fullSOS.name} — ${fullSOS.type} at ${fullSOS.location}`)
    pushNotification('critical', `🚨 New SOS: ${fullSOS.name} at ${fullSOS.location}`)

    return fullSOS
  }, [satellites, rescueTeams, addAlert, pushNotification])

  // ── Accept mission ────────────────────────────────────────────────────────
  const acceptMission = useCallback((sosId, teamId) => {
    const sos = pendingSOS.find(s => s.id === sosId)
    if (!sos) return
    const now = new Date()
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    const missionId = `MSN-${Date.now()}`

    const mission = {
      id: missionId,
      sosId,
      teamId: teamId || sos.nearestTeamId,
      teamName: sos.nearestTeam,
      victim: sos.name,
      victimLat: sos.lat,
      victimLng: sos.lng,
      gps: sos.gps,
      disaster: sos.type,
      priority: sos.priority,
      satellite: sos.satellite,
      eta: sos.eta,
      etaMinutes: sos.etaMinutes,
      etaSecondsLeft: sos.etaMinutes * 60,
      acceptedAt: timeStr,
      startedAt: now.toISOString(),
      status: 'Active',
      elapsedSeconds: 0,
      stageIndex: 0,
      commStatus: 'Active via Satellite',
      location: sos.location,
      medical: sos.medical,
    }

    setActiveMissions(prev => [mission, ...prev])
    setPendingSOS(prev => prev.filter(s => s.id !== sosId))
    setPendingSOSCount(prev => Math.max(0, prev - 1))
    setSosRequests(prev => prev.map(s => s.id === sosId ? { ...s, status: 'Dispatched' } : s))
    setRescueTeams(prev => prev.map(t =>
      t.id === (teamId || sos.nearestTeamId)
        ? { ...t, status: 'Active', mission: `${sos.type} Rescue — ${sos.location}` }
        : t
    ))
    setVictimTracking(prev => prev.map(v =>
      v.trackingId === sosId
        ? { ...v, rescueStatus: 'Rescue Team Assigned', assignedTeam: sos.nearestTeam, assignedTeamId: teamId || sos.nearestTeamId, missionStarted: timeStr, missionId, eta: sos.eta, commStatus: 'Active via Satellite' }
        : v
    ))

    addAlert('info', `✅ Mission accepted: ${sos.nearestTeam} → ${sos.name}`)
    pushNotification('success', `🚒 Rescue Team Assigned: ${sos.nearestTeam} → ${sos.name}`)
    pushNotification('info', `🛰 Satellite Link Active: ${sos.satellite} — ${sos.signal}% signal`)

    return mission
  }, [pendingSOS, addAlert, pushNotification])

  // ── Reject mission ────────────────────────────────────────────────────────
  const rejectMission = useCallback((sosId, reason = 'Team unavailable') => {
    const sos = pendingSOS.find(s => s.id === sosId)
    if (!sos) return
    const nextTeam = pickNearestTeam(
      rescueTeams.filter(t => t.id !== sos.nearestTeamId),
      sos.lat, sos.lng
    )
    setPendingSOS(prev => prev.map(s =>
      s.id === sosId
        ? { ...s, nearestTeam: nextTeam?.name || s.nearestTeam, nearestTeamId: nextTeam?.id || s.nearestTeamId }
        : s
    ))
    addAlert('warning', `⚠️ SOS ${sosId} reassigned to ${nextTeam?.name || 'next team'}`)
  }, [pendingSOS, rescueTeams, addAlert])

  // ── Complete mission ──────────────────────────────────────────────────────
  const completeMission = useCallback((missionId) => {
    setActiveMissions(prev => prev.map(m =>
      m.id === missionId ? { ...m, status: 'Completed', stageIndex: RESCUE_STAGES.length - 1 } : m
    ))
    const mission = activeMissions.find(m => m.id === missionId)
    if (mission) {
      pushNotification('success', `✅ Mission Completed: ${mission.victim} rescued!`)
      addAlert('info', `✅ Mission completed — ${mission.victim} rescued successfully`)
    }
  }, [activeMissions, pushNotification, addAlert])

  // ── ETA countdown ─────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => {
      setActiveMissions(prev => prev.map(m => ({
        ...m,
        etaSecondsLeft: Math.max(0, (m.etaSecondsLeft || 0) - 1),
      })))
    }, 1000)
    return () => clearInterval(t)
  }, [])

  // ── Auth ──────────────────────────────────────────────────────────────────
  const login = useCallback((userData) => {
    setUser(userData)
    localStorage.setItem('rescuenet_user', JSON.stringify(userData))
    pushNotification('success', `👋 Welcome, ${userData.name}! Logged in as ${userData.roleLabel}`)
  }, [pushNotification])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('rescuenet_user')
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('rescuenet_user')
    if (saved) {
      try { setUser(JSON.parse(saved)) } catch { /* ignore */ }
    }
  }, [])

  return (
    <AppContext.Provider value={{
      user, login, logout,
      satellites, activeSatellite, setActiveSatellite,
      drones, setDrones,
      alerts, addAlert, markAlertRead,
      notifications, pushNotification, dismissNotification,
      sosRequests, setSosRequests,
      pendingSOS, setPendingSOS,
      pendingSOSCount, setPendingSOSCount,
      activeMissions, setActiveMissions,
      victimTracking, setVictimTracking,
      rescueTeams, setRescueTeams,
      networkStatus, setNetworkStatus,
      currentOrbit, switchOrbit, switchingLog,
      threatLevel,
      missionStats,
      disasterZones,
      iotSensors,
      dispatchSOS,
      acceptMission,
      rejectMission,
      completeMission,
      DEMO_ACCOUNTS,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
