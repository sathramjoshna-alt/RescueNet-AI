import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Satellite, Eye, EyeOff, CheckCircle } from 'lucide-react'
import StarField from '../components/StarField'
import { useApp } from '../context/AppContext'

const roles = ['Mission Commander', 'Field Coordinator', 'Data Analyst', 'Rescue Operator', 'Satellite Engineer', 'Medical Officer']

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Field Coordinator', organization: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { login } = useApp()
  const navigate = useNavigate()

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) return
    setLoading(true)
    setTimeout(() => {
      setSuccess(true)
      setTimeout(() => {
        login({ name: form.name, email: form.email, role: form.role.toUpperCase(), clearance: 'BRAVO-4', organization: form.organization })
        navigate('/dashboard')
      }, 1500)
    }, 1500)
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6">
      <StarField />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center mx-auto mb-4">
            <Satellite size={30} className="text-white" />
          </div>
          <h1 className="font-orbitron text-2xl font-bold text-white">AGENT REGISTRATION</h1>
          <p className="text-slate-500 font-rajdhani mt-1">Request mission clearance</p>
        </div>

        <div className="glass-card p-8 border border-cyan-500/30">
          {success ? (
            <div className="text-center py-8">
              <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
              <div className="font-orbitron text-lg text-white mb-2">CLEARANCE GRANTED</div>
              <p className="text-slate-400 font-rajdhani text-sm">Redirecting to mission control...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Commander Jane Doe' },
                { label: 'Email Address', name: 'email', type: 'email', placeholder: 'agent@rescuenet.ai' },
                { label: 'Organization', name: 'organization', type: 'text', placeholder: 'NDRF / State Disaster Authority' },
              ].map(field => (
                <div key={field.name}>
                  <label className="block text-xs font-rajdhani text-slate-400 mb-1.5 uppercase tracking-wider">{field.label}</label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full bg-white/5 border border-cyan-500/20 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 transition-all font-rajdhani"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-rajdhani text-slate-400 mb-1.5 uppercase tracking-wider">Designation</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-cyan-500/20 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/60 transition-all font-rajdhani"
                >
                  {roles.map(r => <option key={r} value={r} className="bg-slate-800">{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-rajdhani text-slate-400 mb-1.5 uppercase tracking-wider">Access Code</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min. 8 characters"
                    className="w-full bg-white/5 border border-cyan-500/20 rounded-lg px-4 py-3 pr-10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 transition-all font-rajdhani"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-rajdhani font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <><div className="spinner w-4 h-4" /> Processing...</> : 'REQUEST CLEARANCE'}
              </button>
            </form>
          )}
          <div className="mt-6 text-center text-sm font-rajdhani text-slate-500">
            Already registered?{' '}
            <Link to="/login" className="text-cyan-400 hover:text-cyan-300">Access mission control</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
