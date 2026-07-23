import React, { useState } from 'react'
import { Cloud, Thermometer, Wind, Droplets, Eye, AlertTriangle, Sun, CloudRain, Zap } from 'lucide-react'
import { GlassCard, StatCard, SectionHeader, Badge, ProgressBar } from '../components/UI'
import { weatherData, aiPredictions } from '../data/mockData'

const weatherIcons = {
  'Cyclone': '🌀',
  'Heavy Rain': '🌧️',
  'Moderate Rain': '🌦️',
  'Partly Cloudy': '⛅',
  'Sunny': '☀️',
}

function WeatherGauge({ label, value, unit, max, color, icon: Icon }) {
  const pct = Math.round((value / max) * 100)
  const colors = {
    red: '#ef4444', amber: '#f59e0b', cyan: '#00d4ff', green: '#10b981', purple: '#a855f7'
  }
  return (
    <div className="glass-card p-4 text-center">
      {Icon && <Icon size={20} className={`mx-auto mb-2`} style={{ color: colors[color] }} />}
      <div className="font-orbitron text-2xl font-bold mb-0.5" style={{ color: colors[color] }}>{value}{unit}</div>
      <div className="text-xs text-slate-500 font-rajdhani mb-2">{label}</div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: colors[color] }} />
      </div>
    </div>
  )
}

function ForecastCard({ day }) {
  return (
    <div className="glass-card p-4 text-center hover-glow">
      <div className="font-rajdhani text-sm text-slate-400 mb-2">{day.day}</div>
      <div className="text-3xl mb-2">{weatherIcons[day.condition] || '🌤️'}</div>
      <div className="font-rajdhani text-sm text-white mb-1">{day.condition}</div>
      <div className="flex justify-center gap-2 text-xs font-orbitron">
        <span className="text-red-400">{day.high}°</span>
        <span className="text-slate-600">/</span>
        <span className="text-cyan-400">{day.low}°</span>
      </div>
      <div className="mt-2 text-xs text-cyan-400 font-rajdhani flex items-center justify-center gap-1">
        <Droplets size={10} /> {day.rainfall}mm
      </div>
    </div>
  )
}

function DisasterRiskForecast() {
  return (
    <GlassCard>
      <SectionHeader title="AI Future Predictions" subtitle="Spread & impact modeling" icon={Zap} />
      <div className="space-y-4">
        {[
          { label: 'Flood Spread (Bihar)', value: 65, color: 'cyan', desc: '+340 km² in 48 hours' },
          { label: 'Fire Spread (Himachal)', value: 42, color: 'red', desc: '+120 km² if no rain' },
          { label: 'Road Closures', value: 78, color: 'amber', desc: '12 major highways at risk' },
          { label: 'Comm Outages (Risk)', value: 35, color: 'purple', desc: 'LEO backup activated' },
          { label: 'Rescue ETA', value: 58, color: 'green', desc: '~14 hours to 80% completion' },
        ].map(item => (
          <div key={item.label}>
            <div className="flex justify-between mb-1">
              <span className="text-xs font-rajdhani text-slate-400">{item.label}</span>
              <span className="text-xs font-rajdhani text-slate-500">{item.desc}</span>
            </div>
            <ProgressBar value={item.value} color={item.color} showPercent />
          </div>
        ))}
      </div>
    </GlassCard>
  )
}

export default function WeatherPage() {
  const { current, forecast } = weatherData

  return (
    <div className="p-4 sm:p-6 max-w-screen-xl mx-auto">
      <div className="mb-6">
        <h1 className="font-orbitron text-lg font-bold text-white mb-1">WEATHER INTELLIGENCE</h1>
        <p className="text-xs text-slate-500 font-rajdhani">Satellite-integrated meteorological monitoring & AI forecasting</p>
      </div>

      {/* Alert Banner */}
      <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 animate-pulse">
        <AlertTriangle size={20} className="text-red-400 flex-shrink-0" />
        <div>
          <div className="font-orbitron text-sm text-red-400">⚠️ ACTIVE WEATHER ALERT</div>
          <div className="text-xs text-slate-300 font-rajdhani">Cyclone Warning — Odisha Coast. Extremely heavy rainfall expected. Wind 95 km/h. Do not approach coastal areas.</div>
        </div>
      </div>

      {/* Current conditions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-6">
        <WeatherGauge label="Temperature" value={current.temperature} unit="°C" max={50} color="red" icon={Thermometer} />
        <WeatherGauge label="Humidity" value={current.humidity} unit="%" max={100} color="cyan" icon={Droplets} />
        <WeatherGauge label="Wind Speed" value={current.windSpeed} unit="km/h" max={200} color="amber" icon={Wind} />
        <WeatherGauge label="Rainfall" value={current.rainfall} unit="mm" max={200} color="cyan" icon={CloudRain} />
        <WeatherGauge label="Pressure" value={current.pressure} unit="hPa" max={1050} color="purple" icon={Eye} />
        <WeatherGauge label="Visibility" value={current.visibility} unit="km" max={20} color="green" icon={Eye} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Main weather card */}
        <GlassCard>
          <SectionHeader title="Current Conditions" icon={Cloud} />
          <div className="text-center py-4">
            <div className="text-6xl mb-3">🌀</div>
            <div className="font-orbitron text-2xl font-bold text-white mb-1">{current.condition}</div>
            <div className="font-orbitron text-4xl font-black text-red-400">{current.temperature}°C</div>
            <div className="text-slate-400 font-rajdhani mt-2">Wind {current.windDirection} at {current.windSpeed} km/h</div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3 text-xs font-rajdhani">
            {[
              { label: 'Humidity', value: `${current.humidity}%` },
              { label: 'Pressure', value: `${current.pressure} hPa` },
              { label: 'Visibility', value: `${current.visibility} km` },
              { label: 'Rainfall', value: `${current.rainfall}mm` },
            ].map(m => (
              <div key={m.label} className="bg-white/3 rounded p-2">
                <div className="text-slate-500">{m.label}</div>
                <div className="text-cyan-400 font-semibold">{m.value}</div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* 5-day forecast */}
        <GlassCard className="col-span-2">
          <SectionHeader title="5-Day Satellite Forecast" icon={Sun} />
          <div className="grid grid-cols-5 gap-3">
            {forecast.map(day => <ForecastCard key={day.day} day={day} />)}
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DisasterRiskForecast />

        <GlassCard>
          <SectionHeader title="AI Weather Impact Analysis" icon={Zap} />
          <div className="space-y-3">
            {[
              { title: 'Cyclone Amphan Track', desc: 'Moving NNE at 18 km/h. Expected landfall near Paradip, Odisha in 18 hours. Surge: 4-5m', severity: 'Critical' },
              { title: 'Flash Flood Risk', desc: 'West Bengal, Assam, Meghalaya: 150-200mm expected. Rivers above danger mark.', severity: 'High' },
              { title: 'Landslide Probability', desc: 'Sikkim, Darjeeling, Uttarakhand: Saturation index 87%. High risk slopes identified.', severity: 'High' },
              { title: 'Wildfire Suppression', desc: 'Rain forecast for Goa in 36 hours. Natural suppression likely for existing fires.', severity: 'Medium' },
            ].map(item => (
              <div key={item.title} className={`p-3 rounded-lg border text-xs font-rajdhani ${
                item.severity === 'Critical' ? 'bg-red-500/5 border-red-500/20' :
                item.severity === 'High' ? 'bg-amber-500/5 border-amber-500/20' :
                'bg-green-500/5 border-green-500/20'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-white">{item.title}</span>
                  <Badge text={item.severity} type={item.severity.toLowerCase()} />
                </div>
                <p className="text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
