import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import {
  Satellite, Shield, Map, AlertTriangle, Radio, Activity,
  Users, Cpu, Cloud, BarChart2, Bell, LogOut, Menu, X,
  Wifi, Plane, Thermometer, Info, Phone, Zap, Monitor,
  Navigation, Home
} from 'lucide-react'

// ─── Role-based navigation ─────────────────────────────────────────────────
const adminNav = [
  { path: '/dashboard',        label: 'Command Center',   icon: Cpu },
  { path: '/comm-simulation',  label: 'Comm Sim',         icon: Zap },
  { path: '/mission-control',  label: 'Mission Control',  icon: Monitor },
  { path: '/map',              label: 'Disaster Map',     icon: Map },
  { path: '/satellites',       label: 'Satellites',       icon: Satellite },
  { path: '/rescue',           label: 'Rescue Ops',       icon: Shield },
  { path: '/victims',          label: 'Victims',          icon: Users },
  { path: '/drones',           label: 'Drone Fleet',      icon: Plane },
  { path: '/iot',              label: 'IoT Sensors',      icon: Activity },
  { path: '/weather',          label: 'Weather',          icon: Cloud },
  { path: '/analytics',        label: 'Analytics',        icon: BarChart2 },
  { path: '/sos',              label: 'SOS System',       icon: Radio },
]

const rescueNav = [
  { path: '/rescue-dashboard', label: 'My Dashboard',    icon: Home },
  { path: '/rescue',           label: 'Rescue Ops',      icon: Shield },
  { path: '/map',              label: 'Disaster Map',    icon: Map },
  { path: '/victims',          label: 'Victims',         icon: Users },
  { path: '/mission-control',  label: 'Comm Center',     icon: Monitor },
]

const userNav = [
  { path: '/user-dashboard',   label: 'My Status',       icon: Home },
  { path: '/sos',              label: 'Send SOS',         icon: Radio },
  { path: '/comm-simulation',  label: 'Comm Test',       icon: Zap },
]

const publicNav = [
  { path: '/about',   label: 'About',   icon: Info },
  { path: '/contact', label: 'Contact', icon: Phone },
]

const roleColors = {
  admin:  { border: 'border-violet-500/30', text: 'text-violet-400', bg: 'bg-violet-500/10' },
  rescue: { border: 'border-emerald-500/30', text: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  user:   { border: 'border-blue-500/30', text: 'text-blue-400', bg: 'bg-blue-500/10' },
}

export default function Navbar() {
  const { user, logout, alerts, currentOrbit, networkStatus, pendingSOSCount } = useApp()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showAlerts, setShowAlerts] = useState(false)

  const unreadCount = alerts.filter(a => !a.read).length
  const role = user?.role || 'admin'
  const rc = roleColors[role] || roleColors.admin

  // Pick nav items based on role
  const navItems = role === 'rescue' ? rescueNav : role === 'user' ? userNav : adminNav
  const showItems = navItems.slice(0, role === 'admin' ? 9 : navItems.length)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const orbitColor = currentOrbit === 'LEO'
    ? 'border-blue-500/35 text-blue-400 bg-blue-500/8'
    : currentOrbit === 'MEO'
    ? 'border-violet-500/35 text-violet-400 bg-violet-500/8'
    : 'border-amber-500/35 text-amber-400 bg-amber-500/8'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-blue-500/15">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Logo */}
        <Link to={user ? (role === 'rescue' ? '/rescue-dashboard' : role === 'user' ? '/user-dashboard' : '/dashboard') : '/'} className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-glow-sm">
            <Satellite size={15} className="text-white" />
          </div>
          <div>
            <div className="font-orbitron text-xs font-bold text-blue-300 leading-none tracking-wider">RESCUENET</div>
            <div className="font-orbitron text-xs text-emerald-400 leading-none" style={{ fontSize: 9 }}>AI PLATFORM</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden xl:flex items-center gap-0.5">
          {showItems.map(item => {
            const Icon = item.icon
            const active = location.pathname === item.path
            const isRescue = item.path === '/rescue' || item.path === '/rescue-dashboard'
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-rajdhani font-semibold transition-all ${
                  active
                    ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                    : 'text-slate-400 hover:text-blue-300 hover:bg-blue-500/8'
                }`}
              >
                <Icon size={12} />
                {item.label}
                {isRescue && pendingSOSCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-xs flex items-center justify-center text-white font-bold badge-pulse z-10">
                    {pendingSOSCount > 9 ? '9+' : pendingSOSCount}
                  </span>
                )}
              </Link>
            )
          })}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Orbit badge */}
          <div className={`hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-orbitron border ${orbitColor}`} style={{ fontSize: 10 }}>
            <Wifi size={9} />
            {currentOrbit}
          </div>

          {/* Signal */}
          <div className="hidden sm:flex items-center gap-1 text-xs text-slate-500">
            <div className={`w-1.5 h-1.5 rounded-full ${networkStatus?.connected ? 'status-online' : 'status-offline'}`} />
            <span className="font-rajdhani" style={{ fontSize: 10 }}>{networkStatus?.signalStrength || 94}%</span>
          </div>

          {/* Alerts bell */}
          <div className="relative">
            <button
              onClick={() => setShowAlerts(!showAlerts)}
              className="relative p-1.5 rounded-lg hover:bg-blue-500/8 text-slate-400 hover:text-blue-400 transition-colors"
            >
              <Bell size={15} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 rounded-full text-xs flex items-center justify-center text-white font-bold badge-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showAlerts && (
              <div className="absolute right-0 top-9 w-80 glass-card z-50 overflow-hidden border border-blue-500/15">
                <div className="px-3 py-2 border-b border-blue-500/10 flex items-center justify-between">
                  <span className="font-orbitron text-xs text-blue-400">ALERTS</span>
                  <span className="text-xs text-slate-500 font-rajdhani">{unreadCount} unread</span>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {alerts.slice(0, 8).map(alert => (
                    <div key={alert.id} className={`px-3 py-2 border-b border-white/5 text-xs ${!alert.read ? 'bg-blue-500/4' : ''}`}>
                      <div className={`font-semibold mb-0.5 ${
                        alert.type === 'critical' ? 'text-rose-400' :
                        alert.type === 'warning'  ? 'text-amber-400' : 'text-blue-400'
                      }`}>{alert.message}</div>
                      <div className="text-slate-500 font-rajdhani">{alert.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User info */}
          {user && (
            <div className="flex items-center gap-2">
              <div className="hidden sm:block text-right">
                <div className="text-xs font-semibold text-slate-200 font-rajdhani leading-tight">{user.name}</div>
                <div className={`text-xs font-orbitron leading-tight ${rc.text}`} style={{ fontSize: 9 }}>{user.roleLabel || user.role?.toUpperCase()}</div>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg hover:bg-rose-500/15 text-slate-400 hover:text-rose-400 transition-colors"
                title="Logout"
              >
                <LogOut size={14} />
              </button>
            </div>
          )}

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="xl:hidden p-1.5 rounded-lg hover:bg-blue-500/8 text-slate-400 hover:text-blue-400"
          >
            {mobileOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="xl:hidden glass border-t border-blue-500/10 p-3 grid grid-cols-3 gap-1">
          {[...navItems, ...publicNav].map(item => {
            const Icon = item.icon
            const active = location.pathname === item.path
            const isRescue = item.path === '/rescue' || item.path === '/rescue-dashboard'
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`relative flex flex-col items-center gap-1 p-2 rounded-lg text-xs font-rajdhani transition-all ${
                  active ? 'bg-blue-500/15 text-blue-300' : 'text-slate-400 hover:text-blue-300 hover:bg-blue-500/8'
                }`}
              >
                <Icon size={14} />
                <span>{item.label}</span>
                {isRescue && pendingSOSCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-rose-500 rounded-full text-xs flex items-center justify-center text-white font-bold badge-pulse">
                    {pendingSOSCount > 9 ? '9+' : pendingSOSCount}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </nav>
  )
}
