import React, { useState, useEffect, useRef } from 'react'
import { Bot, X, Send, Minimize2, Maximize2, Satellite, AlertTriangle, CloudRain } from 'lucide-react'
import { useApp } from '../context/AppContext'

const quickActions = [
  'What is the current threat level?',
  'Which satellite has best signal?',
  'How many victims rescued?',
  'What is the weather forecast?',
  'Show active rescue teams',
  'Drone fleet status?',
]

const responses = {
  'threat': () => `⚠️ **THREAT LEVEL: CRITICAL**\n\nActive Disasters:\n• 🌊 Flood - West Bengal (1240 affected)\n• 🌀 Cyclone - Odisha (890 affected)\n• 🏔️ Landslide - Sikkim (280 affected)\n• 🔥 Wildfire - Goa (120 affected)\n\nTotal casualties at risk: **3,130 people**`,
  'satellite': () => `📡 **BEST SATELLITE: VIASAT-LEO-01**\n\nSignal Strength: 94%\nLatency: 28ms\nBandwidth: 450 Mbps\nCoverage: 87%\n\n🤖 AI Recommendation: LEO orbit preferred for disaster ops due to ultra-low latency critical for real-time coordination.`,
  'rescue': () => `🚁 **RESCUE PROGRESS UPDATE**\n\nTotal Victims: 3,130\n✅ Rescued: 1,451 (46.4%)\n⏳ Pending: 1,679\n🚨 Critical Cases: 234\n\n6 rescue teams deployed\n4 drones airborne\nETA Full Rescue: ~14 hours`,
  'weather': () => `☁️ **WEATHER INTELLIGENCE**\n\nCurrent: Heavy Rain, 32°C, Humidity 84%\nWind: 67 km/h NE\n⚠️ Active: Cyclone Warning\n\nForecast:\n• Today: Cyclone (120mm rainfall)\n• Tomorrow: Heavy Rain (85mm)\n• Day 3: Moderate Rain (45mm)\n\nRecommendation: Deploy amphibious units`,
  'team': () => `👥 **ACTIVE RESCUE TEAMS (6)**\n\n• Alpha Strike (Ground) - West Bengal\n• Bravo Medical - Odisha\n• Charlie Dive (Water) - West Bengal\n• Delta Heli - Punjab\n• Echo Search - Sikkim\n• Foxtrot Fire - Goa\n\nTotal rescued: 469 victims`,
  'drone': () => `🚁 **DRONE FLEET STATUS**\n\n• Eagle-1: Active, 87% battery, Flood Survey\n• Falcon-2: Active, 64% battery, SAR\n• Hawk-3: Active, 92% battery, Mapping\n• Kite-4: Charging, 23% battery\n• Swift-5: Active, 78% battery, Supply Drop\n\n📍 23 victims located via thermal`,
}

function getResponse(input) {
  const low = input.toLowerCase()
  if (low.includes('threat') || low.includes('level') || low.includes('disaster')) return responses.threat()
  if (low.includes('satellite') || low.includes('signal') || low.includes('orbit')) return responses.satellite()
  if (low.includes('rescue') || low.includes('victim') || low.includes('saved')) return responses.rescue()
  if (low.includes('weather') || low.includes('rain') || low.includes('cyclone') || low.includes('forecast')) return responses.weather()
  if (low.includes('team') || low.includes('unit') || low.includes('squad')) return responses.team()
  if (low.includes('drone') || low.includes('uav') || low.includes('fleet')) return responses.drone()
  return `🤖 **RescueNet AI** processing your query...\n\n"${input}"\n\nBased on current satellite data and field reports:\n• All systems nominal\n• 6 active rescue teams deployed\n• Satellite constellation fully operational\n• AI confidence: 94%\n\nFor specific queries try: satellite status, rescue progress, weather, threat level.`
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'ai', text: '👋 **RescueNet AI Online**\n\nI\'m your AI mission intelligence assistant. I have real-time access to:\n• Satellite telemetry\n• Rescue operations data\n• Weather systems\n• IoT sensor network\n• Victim tracking\n\nHow can I assist your mission today?', time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const sendMessage = (text) => {
    const msgText = text || input.trim()
    if (!msgText) return
    setInput('')
    const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    setMessages(prev => [...prev, { role: 'user', text: msgText, time }])
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages(prev => [...prev, { role: 'ai', text: getResponse(msgText), time }])
    }, 1200)
  }

  const formatText = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <div key={i} className="font-bold text-cyan-300 mb-1">{line.slice(2, -2)}</div>
      }
      if (line.startsWith('• ')) {
        return <div key={i} className="flex gap-1 text-slate-300 text-xs"><span className="text-cyan-400 mt-0.5">•</span><span>{line.slice(2)}</span></div>
      }
      if (line === '') return <div key={i} className="h-1" />
      return <div key={i} className="text-slate-300 text-xs">{line}</div>
    })
  }

  return (
    <>
      {/* FAB */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg hover:scale-110 transition-transform glow-blue"
          aria-label="Open AI Assistant"
        >
          <Bot size={24} className="text-white" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-space-dark" />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className={`fixed z-50 right-6 bottom-6 glass-card border border-cyan-500/30 flex flex-col transition-all ${minimized ? 'w-64 h-12' : 'w-80 sm:w-96 h-[520px]'}`}>
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-cyan-500/20">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                <Bot size={14} className="text-white" />
              </div>
              <div>
                <div className="font-orbitron text-xs text-cyan-400">RESCUENET AI</div>
                <div className="text-xs text-green-400 font-rajdhani">● Online</div>
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setMinimized(!minimized)} className="p-1 rounded hover:bg-white/10 text-slate-400">
                {minimized ? <Maximize2 size={12} /> : <Minimize2 size={12} />}
              </button>
              <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-white/10 text-slate-400">
                <X size={12} />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'ai' ? 'bg-gradient-to-br from-cyan-500 to-purple-600' : 'bg-slate-600'}`}>
                      {msg.role === 'ai' ? <Bot size={10} className="text-white" /> : <span className="text-xs text-white font-bold">U</span>}
                    </div>
                    <div className={`max-w-[75%] px-3 py-2 rounded-lg text-xs ${msg.role === 'ai' ? 'bg-slate-800/60 border border-cyan-500/20' : 'bg-cyan-500/20 border border-cyan-500/30 text-right'}`}>
                      {msg.role === 'ai' ? formatText(msg.text) : <span className="text-slate-200">{msg.text}</span>}
                      <div className="text-slate-600 mt-1 font-rajdhani" style={{ fontSize: '10px' }}>{msg.time}</div>
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                      <Bot size={10} className="text-white" />
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-slate-800/60 border border-cyan-500/20">
                      <div className="flex gap-1">
                        {[0, 1, 2].map(i => (
                          <div key={i} className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick Actions */}
              <div className="px-3 py-2 border-t border-white/5">
                <div className="flex gap-1 overflow-x-auto pb-1">
                  {quickActions.map((qa, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(qa)}
                      className="flex-shrink-0 px-2 py-1 rounded text-xs bg-white/5 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 transition-colors font-rajdhani border border-white/5 hover:border-cyan-500/30"
                    >
                      {qa}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="p-3 border-t border-cyan-500/20">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask RescueNet AI..."
                    className="flex-1 bg-white/5 border border-cyan-500/20 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 font-rajdhani"
                  />
                  <button
                    onClick={() => sendMessage()}
                    className="w-8 h-8 rounded bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center hover:bg-cyan-500/40 transition-colors text-cyan-400"
                  >
                    <Send size={12} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
