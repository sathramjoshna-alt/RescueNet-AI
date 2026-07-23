import React from 'react'
import { X, CheckCircle, AlertTriangle, Info, Radio } from 'lucide-react'
import { useApp } from '../context/AppContext'

const typeConfig = {
  critical: { icon: Radio,         color: 'text-rose-400',    bg: 'bg-rose-500/10 border-rose-500/25',     label: '🚨' },
  success:  { icon: CheckCircle,   color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/25', label: '✅' },
  warning:  { icon: AlertTriangle, color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/25',   label: '⚠️' },
  info:     { icon: Info,          color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/25',      label: 'ℹ️' },
}

export default function NotificationToasts() {
  const { notifications, dismissNotification } = useApp()

  if (!notifications || notifications.length === 0) return null

  return (
    <div className="fixed top-16 right-4 z-[9999] flex flex-col gap-2 max-w-xs w-full pointer-events-none">
      {notifications.map(n => {
        const cfg = typeConfig[n.type] || typeConfig.info
        return (
          <div
            key={n.id}
            className={`notif-enter flex items-start gap-3 p-3 rounded-xl border ${cfg.bg} backdrop-blur-md shadow-lg pointer-events-auto`}
          >
            <span className="text-sm flex-shrink-0 mt-0.5">{cfg.label}</span>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-rajdhani font-semibold ${cfg.color} leading-snug`}>{n.message}</p>
              <p className="text-xs text-slate-600 font-rajdhani mt-0.5">{n.ts}</p>
            </div>
            <button
              onClick={() => dismissNotification(n.id)}
              className="flex-shrink-0 text-slate-600 hover:text-slate-400 transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
