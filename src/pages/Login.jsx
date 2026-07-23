import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Satellite, Eye, EyeOff, Shield, AlertCircle, Radio } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { authenticateUser } from '../context/AppContext'

const CREDENTIALS = [
  { role: 'Admin', email: 'admin@rescuenet.ai', password: 'Mission@2026', color: 'violet' },
  { role: 'Rescue Team', email: 'rescue01@rescuenet.ai', password: 'Rescue@2026', color: 'emerald' },
  { role: 'User', email: 'user01@rescuenet.ai', password: 'User@2026', color: 'blue' },
]

const colorMap = {
  violet: { bg: 'bg-violet-500/10 hover:bg-violet-500/20 border-violet-500/20', label: 'text-violet-400', dot: 'bg-violet-400' },
  emerald: { bg: 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20', label: 'text-emerald-400', dot: 'bg-emerald-400' },
  blue: { bg: 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20', label: 'text-blue-400', dot: 'bg-blue-400' },
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useApp()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please enter email and password'); return }
    setLoading(true)
    setTimeout(() => {
      const userData = authenticateUser(email.trim(), password)
      if (!userData) {
        setLoading(false)
        setError('Invalid credentials. Check the demo accounts below.')
        return
      }
      login(userData)
      navigate(userData.redirectTo || '/dashboard')
    }, 1200)
  }

  const quickLogin = (cred) => {
    setEmail(cred.email)
    setPassword(cred.password)
    setLoading(true)
    setTimeout(() => {
      const userData = authenticateUser(cred.email, cred.password)
      login(userData)
      navigate(userData.redirectTo)
    }, 900)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle background orbits */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-blue-500/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-emerald-500/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-blue-400/8" />
        <div className="absolute top-1/4 right-1/4 w-2 h-2 rounded-full bg-blue-400/20 animate-pulse-slow" />
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 rounded-full bg-emerald-400/20 animate-pulse-slow" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 mb-4 shadow-glow-sm">
            <Satellite size={28} className="text-white" />
          </div>
          <h1 className="font-orbitron text-2xl font-bold text-white tracking-wide">RESCUENET AI</h1>
          <p className="text-slate-400 font-rajdhani mt-1 text-sm">Disaster Response Platform — Secure Access</p>
        </div>

        {/* Login Card */}
        <div className="glass-card border border-blue-500/20">
          <div className="flex items-center gap-2 mb-5 text-xs font-rajdhani text-slate-500 bg-blue-500/5 px-3 py-2 rounded-lg border border-blue-500/10">
            <Shield size={11} className="text-blue-400 flex-shrink-0" />
            VIASAT SPACE FOR GOOD INDIA 2026 — AUTHORIZED ACCESS ONLY
          </div>

          {error && (
            <div className="flex items-center gap-2 mb-4 px-3 py-2.5 bg-rose-500/10 border border-rose-500/25 rounded-lg text-rose-400 text-sm font-rajdhani">
              <AlertCircle size={14} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-rajdhani text-slate-400 mb-1.5 font-semibold uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-white/5 border border-blue-500/15 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-400/50 focus:bg-white/8 transition-all font-rajdhani"
              />
            </div>
            <div>
              <label className="block text-xs font-rajdhani text-slate-400 mb-1.5 font-semibold uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-blue-500/15 rounded-lg px-4 py-2.5 pr-10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-400/50 transition-all font-rajdhani"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-400 transition-colors">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-700 to-blue-500 text-white font-rajdhani font-bold text-sm hover:from-blue-600 hover:to-blue-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-glow-sm"
            >
              {loading ? (
                <><div className="spinner w-4 h-4" />Authenticating...</>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-slate-600 font-rajdhani">DEMO ACCOUNTS</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Quick login buttons */}
          <div className="space-y-2">
            {CREDENTIALS.map(cred => {
              const c = colorMap[cred.color]
              return (
                <button
                  key={cred.role}
                  onClick={() => quickLogin(cred)}
                  disabled={loading}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all disabled:opacity-40 ${c.bg}`}
                >
                  <div className={`w-2 h-2 rounded-full ${c.dot} flex-shrink-0`} />
                  <div className="flex-1 text-left">
                    <div className={`text-xs font-orbitron font-bold ${c.label}`}>{cred.role}</div>
                    <div className="text-xs text-slate-500 font-rajdhani">{cred.email}</div>
                  </div>
                  <div className="text-xs text-slate-600 font-rajdhani">Click to login →</div>
                </button>
              )
            })}
          </div>
        </div>

        <p className="text-center text-xs text-slate-700 mt-5 font-rajdhani">
          MULTI-ORBIT SATELLITE CONSTELLATION PLATFORM · INDIA 2026
        </p>
      </div>
    </div>
  )
}
