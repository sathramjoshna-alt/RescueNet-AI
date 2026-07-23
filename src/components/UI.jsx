import React from 'react'

export function StatCard({ label, value, icon: Icon, color = 'blue', sub, animate = false }) {
  const colors = {
    blue:    { text: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/18' },
    cyan:    { text: 'text-teal-400',    bg: 'bg-teal-500/10',    border: 'border-teal-500/18' },
    emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/18' },
    green:   { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/18' },
    purple:  { text: 'text-violet-400',  bg: 'bg-violet-500/10',  border: 'border-violet-500/18' },
    red:     { text: 'text-rose-400',    bg: 'bg-rose-500/10',    border: 'border-rose-500/18' },
    amber:   { text: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/18' },
  }
  const c = colors[color] || colors.blue
  return (
    <div className={`glass-card hover-glow transition-all ${animate ? 'animate-pulse-slow' : ''}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-500 font-rajdhani uppercase tracking-wider mb-1">{label}</p>
          <p className={`text-2xl font-orbitron font-bold ${c.text}`}>{value}</p>
          {sub && <p className="text-xs text-slate-500 mt-1 font-rajdhani">{sub}</p>}
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl ${c.bg} ${c.border} border flex items-center justify-center flex-shrink-0`}>
            <Icon size={18} className={c.text} />
          </div>
        )}
      </div>
    </div>
  )
}

export function ProgressBar({ value, max = 100, color = 'blue', label, showPercent = true }) {
  const pct = Math.round((value / max) * 100)
  const colors = {
    blue:    'bg-gradient-to-r from-blue-700 to-blue-400',
    cyan:    'bg-gradient-to-r from-teal-600 to-teal-400',
    emerald: 'bg-gradient-to-r from-emerald-600 to-emerald-400',
    green:   'bg-gradient-to-r from-emerald-600 to-emerald-400',
    purple:  'bg-gradient-to-r from-violet-600 to-violet-400',
    red:     'bg-gradient-to-r from-rose-600 to-rose-400',
    amber:   'bg-gradient-to-r from-amber-600 to-amber-400',
  }
  return (
    <div>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-xs text-slate-400 font-rajdhani">{label}</span>}
          {showPercent && <span className="text-xs text-slate-400 font-orbitron">{pct}%</span>}
        </div>
      )}
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${colors[color] || colors.blue} progress-bar-fill`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export function Badge({ text, type = 'info' }) {
  const types = {
    critical: 'bg-rose-500/15 text-rose-400 border-rose-500/25',
    high:     'bg-orange-500/15 text-orange-400 border-orange-500/25',
    medium:   'bg-amber-500/15 text-amber-400 border-amber-500/25',
    low:      'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    info:     'bg-blue-500/15 text-blue-400 border-blue-500/25',
    warning:  'bg-amber-500/15 text-amber-400 border-amber-500/25',
    active:   'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    offline:  'bg-rose-500/15 text-rose-400 border-rose-500/25',
    standby:  'bg-slate-500/15 text-slate-400 border-slate-500/25',
    success:  'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  }
  const cls = types[type?.toLowerCase()] || types.info
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border font-rajdhani ${cls}`}>
      {text}
    </span>
  )
}

export function SectionHeader({ title, subtitle, icon: Icon, action }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/18 flex items-center justify-center">
            <Icon size={16} className="text-blue-400" />
          </div>
        )}
        <div>
          <h2 className="font-orbitron text-sm font-bold text-white">{title}</h2>
          {subtitle && <p className="text-xs text-slate-500 font-rajdhani">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

export function StatusDot({ status }) {
  const map = {
    active:   'status-online',
    online:   'status-online',
    warning:  'status-warning',
    offline:  'status-offline',
    charging: 'status-warning',
    standby:  'status-warning',
    critical: 'status-offline',
  }
  return <span className={`inline-block w-2 h-2 rounded-full ${map[status?.toLowerCase()] || 'bg-slate-600'}`} />
}

export function GlassCard({ children, className = '', onClick }) {
  return (
    <div
      className={`glass-card hover-glow transition-all ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export function LoadingSpinner({ size = 24 }) {
  return (
    <div className="spinner" style={{ width: size, height: size, borderWidth: Math.max(2, size / 12) }} />
  )
}

export function ThreatBadge({ level }) {
  const map = {
    CRITICAL: 'bg-rose-500/15 text-rose-400 border-rose-500/30 animate-pulse',
    HIGH:     'bg-orange-500/15 text-orange-400 border-orange-500/30',
    MEDIUM:   'bg-amber-500/15 text-amber-400 border-amber-500/30',
    LOW:      'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  }
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-orbitron font-bold border ${map[level] || map.LOW}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      THREAT: {level}
    </span>
  )
}
