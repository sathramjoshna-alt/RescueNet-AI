import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Satellite, Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react'
import StarField from '../components/StarField'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSending(true)
    setTimeout(() => { setSending(false); setSubmitted(true) }, 1500)
  }

  return (
    <div className="min-h-screen relative">
      <StarField />

      <header className="relative z-10 flex items-center justify-between px-6 py-4 glass border-b border-cyan-500/20">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
            <Satellite size={16} className="text-white" />
          </div>
          <span className="font-orbitron text-cyan-400 font-bold">RESCUENET AI</span>
        </Link>
        <div className="flex gap-3">
          <Link to="/login" className="px-4 py-2 rounded border border-cyan-500/40 text-cyan-400 text-sm font-rajdhani hover:bg-cyan-500/10">Login</Link>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="font-orbitron text-4xl font-black text-white mb-3">Contact Mission Control</h1>
          <p className="text-slate-400 font-rajdhani text-lg">Get in touch with the RescueNet AI team</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Mail, title: 'Email', value: 'info@rescuenet.ai', sub: 'Response within 24 hours' },
            { icon: Phone, title: 'Emergency Hotline', value: '+91 1800-RESCUE-AI', sub: '24/7 during active disasters' },
            { icon: MapPin, title: 'Headquarters', value: 'Bengaluru, India', sub: 'Viasat India Operations' },
          ].map(c => {
            const Icon = c.icon
            return (
              <div key={c.title} className="glass-card p-6 text-center hover-glow">
                <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-3">
                  <Icon size={20} className="text-cyan-400" />
                </div>
                <div className="font-orbitron text-sm text-white mb-1">{c.title}</div>
                <div className="text-cyan-400 font-rajdhani text-sm mb-1">{c.value}</div>
                <div className="text-xs text-slate-500 font-rajdhani">{c.sub}</div>
              </div>
            )
          })}
        </div>

        <div className="glass-card p-8 border border-cyan-500/20">
          {submitted ? (
            <div className="text-center py-12">
              <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
              <div className="font-orbitron text-xl text-white mb-2">MESSAGE TRANSMITTED</div>
              <p className="text-slate-400 font-rajdhani">Your message has been sent via satellite relay. We'll respond shortly.</p>
            </div>
          ) : (
            <>
              <h2 className="font-orbitron text-xl font-bold text-white mb-6">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Your name' },
                    { label: 'Email', name: 'email', type: 'email', placeholder: 'your@email.com' },
                  ].map(f => (
                    <div key={f.name}>
                      <label className="block text-xs font-rajdhani text-slate-400 mb-1 uppercase">{f.label}</label>
                      <input type={f.type} value={form[f.name]} onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))} required placeholder={f.placeholder}
                        className="w-full bg-white/5 border border-cyan-500/20 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 font-rajdhani" />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-xs font-rajdhani text-slate-400 mb-1 uppercase">Subject</label>
                  <input type="text" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="Inquiry subject"
                    className="w-full bg-white/5 border border-cyan-500/20 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 font-rajdhani" />
                </div>
                <div>
                  <label className="block text-xs font-rajdhani text-slate-400 mb-1 uppercase">Message</label>
                  <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} required placeholder="Your message..."
                    className="w-full bg-white/5 border border-cyan-500/20 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 font-rajdhani h-32 resize-none" />
                </div>
                <button type="submit" disabled={sending}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-rajdhani font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                  {sending ? <><div className="spinner w-4 h-4" /> Sending...</> : <><Send size={16} /> Send Message</>}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
