import React, { useEffect, useRef } from 'react'
import { BarChart2, TrendingUp, PieChart, Activity, Satellite, Shield } from 'lucide-react'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js'
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2'
import { GlassCard, SectionHeader, StatCard } from '../components/UI'
import { analyticsData } from '../data/mockData'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler)

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#94a3b8', font: { family: 'Rajdhani', size: 11 } } },
    tooltip: { backgroundColor: '#0a1628', borderColor: '#00d4ff33', borderWidth: 1, titleColor: '#00d4ff', bodyColor: '#94a3b8' },
  },
  scales: {
    x: { grid: { color: '#ffffff08' }, ticks: { color: '#64748b', font: { family: 'Rajdhani' } } },
    y: { grid: { color: '#ffffff08' }, ticks: { color: '#64748b', font: { family: 'Rajdhani' } } },
  },
}

export default function Analytics() {
  const { rescueStats } = analyticsData

  return (
    <div className="p-4 sm:p-6 max-w-screen-xl mx-auto">
      <div className="mb-6">
        <h1 className="font-orbitron text-lg font-bold text-white mb-1">ANALYTICS DASHBOARD</h1>
        <p className="text-xs text-slate-500 font-rajdhani">Mission performance metrics & satellite network analytics</p>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Rescued" value={rescueStats.rescued.toLocaleString()} icon={Shield} color="green" />
        <StatCard label="Critical Cases" value={rescueStats.critical} icon={Activity} color="red" />
        <StatCard label="Satellite Uptime" value="98.7%" icon={Satellite} color="cyan" />
        <StatCard label="Avg Response Time" value="6.4min" icon={TrendingUp} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Mission Success Rate */}
        <GlassCard>
          <SectionHeader title="Mission Success Rate" subtitle="Last 6 months (%)" icon={TrendingUp} />
          <div style={{ height: 220 }}>
            <Line
              data={{
                labels: analyticsData.missionSuccess.labels,
                datasets: [{
                  label: 'Success Rate %',
                  data: analyticsData.missionSuccess.data,
                  borderColor: '#00d4ff',
                  backgroundColor: 'rgba(0,212,255,0.1)',
                  fill: true,
                  tension: 0.4,
                  pointBackgroundColor: '#00d4ff',
                  pointRadius: 4,
                }],
              }}
              options={{ ...chartDefaults, plugins: { ...chartDefaults.plugins, legend: { display: false } } }}
            />
          </div>
        </GlassCard>

        {/* Satellite Orbit Usage */}
        <GlassCard>
          <SectionHeader title="Satellite Orbit Usage" subtitle="Traffic distribution (%)" icon={Satellite} />
          <div className="flex items-center gap-4">
            <div style={{ height: 200, width: 200, flexShrink: 0 }}>
              <Doughnut
                data={{
                  labels: analyticsData.satelliteUsage.labels,
                  datasets: [{
                    data: analyticsData.satelliteUsage.data,
                    backgroundColor: ['rgba(0,212,255,0.8)', 'rgba(168,85,247,0.8)', 'rgba(245,158,11,0.8)'],
                    borderColor: ['#00d4ff', '#a855f7', '#f59e0b'],
                    borderWidth: 2,
                  }],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'right', labels: { color: '#94a3b8', font: { family: 'Rajdhani', size: 11 }, padding: 12 } },
                    tooltip: { backgroundColor: '#0a1628', borderColor: '#00d4ff33', borderWidth: 1, titleColor: '#00d4ff', bodyColor: '#94a3b8' },
                  },
                }}
              />
            </div>
            <div className="space-y-3">
              {[
                { orbit: 'LEO', value: 54, color: 'text-cyan-400', desc: 'Real-time rescue ops' },
                { orbit: 'MEO', value: 28, color: 'text-purple-400', desc: 'Area coverage' },
                { orbit: 'GEO', value: 18, color: 'text-amber-400', desc: 'Broadcast & monitoring' },
              ].map(o => (
                <div key={o.orbit}>
                  <div className="flex justify-between text-xs font-rajdhani mb-1">
                    <span className={`font-bold font-orbitron ${o.color}`}>{o.orbit}</span>
                    <span className="text-slate-400">{o.value}%</span>
                  </div>
                  <div className="text-xs text-slate-600">{o.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Network Latency */}
        <GlassCard>
          <SectionHeader title="Network Latency Comparison" subtitle="By orbit type (ms)" icon={Activity} />
          <div style={{ height: 220 }}>
            <Line
              data={{
                labels: analyticsData.networkLatency.labels,
                datasets: [
                  { label: 'LEO', data: analyticsData.networkLatency.leo, borderColor: '#00d4ff', backgroundColor: 'transparent', tension: 0.4, pointRadius: 3 },
                  { label: 'MEO', data: analyticsData.networkLatency.meo, borderColor: '#a855f7', backgroundColor: 'transparent', tension: 0.4, pointRadius: 3 },
                  { label: 'GEO', data: analyticsData.networkLatency.geo, borderColor: '#f59e0b', backgroundColor: 'transparent', tension: 0.4, pointRadius: 3 },
                ],
              }}
              options={chartDefaults}
            />
          </div>
        </GlassCard>

        {/* Bandwidth */}
        <GlassCard>
          <SectionHeader title="Bandwidth Usage" subtitle="Weekly (Mbps)" icon={BarChart2} />
          <div style={{ height: 220 }}>
            <Bar
              data={{
                labels: analyticsData.bandwidthUsage.labels,
                datasets: [{
                  label: 'Bandwidth (Mbps)',
                  data: analyticsData.bandwidthUsage.data,
                  backgroundColor: 'rgba(0,212,255,0.6)',
                  borderColor: '#00d4ff',
                  borderWidth: 1,
                  borderRadius: 4,
                }],
              }}
              options={{ ...chartDefaults, plugins: { ...chartDefaults.plugins, legend: { display: false } } }}
            />
          </div>
        </GlassCard>

        {/* Response time distribution */}
        <GlassCard>
          <SectionHeader title="Response Time Distribution" subtitle="% of incidents" icon={TrendingUp} />
          <div style={{ height: 220 }}>
            <Bar
              data={{
                labels: analyticsData.responseTime.labels,
                datasets: [{
                  label: 'Incidents (%)',
                  data: analyticsData.responseTime.data,
                  backgroundColor: ['rgba(16,185,129,0.7)', 'rgba(6,182,212,0.7)', 'rgba(245,158,11,0.7)', 'rgba(239,68,68,0.5)', 'rgba(239,68,68,0.3)'],
                  borderColor: ['#10b981', '#06b6d4', '#f59e0b', '#ef4444', '#ef4444'],
                  borderWidth: 1,
                  borderRadius: 4,
                }],
              }}
              options={{ ...chartDefaults, plugins: { ...chartDefaults.plugins, legend: { display: false } } }}
            />
          </div>
        </GlassCard>

        {/* Rescue statistics */}
        <GlassCard>
          <SectionHeader title="Rescue Statistics" subtitle="Overall mission data" icon={Shield} />
          <div className="grid grid-cols-2 gap-4 mb-4">
            {[
              { label: 'Total Victims', value: rescueStats.total.toLocaleString(), color: 'text-white' },
              { label: 'Rescued', value: rescueStats.rescued.toLocaleString(), color: 'text-green-400' },
              { label: 'Pending', value: rescueStats.pending.toLocaleString(), color: 'text-amber-400' },
              { label: 'Critical', value: rescueStats.critical, color: 'text-red-400' },
            ].map(s => (
              <div key={s.label} className="bg-white/3 rounded-lg p-3 text-center">
                <div className={`font-orbitron text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-slate-500 font-rajdhani mt-1">{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ height: 100 }}>
            <Bar
              data={{
                labels: ['Rescued', 'Pending', 'Critical'],
                datasets: [{
                  data: [rescueStats.rescued, rescueStats.pending, rescueStats.critical],
                  backgroundColor: ['rgba(16,185,129,0.7)', 'rgba(245,158,11,0.5)', 'rgba(239,68,68,0.6)'],
                  borderColor: ['#10b981', '#f59e0b', '#ef4444'],
                  borderWidth: 1,
                  borderRadius: 4,
                }],
              }}
              options={{
                ...chartDefaults,
                plugins: { ...chartDefaults.plugins, legend: { display: false } },
                indexAxis: 'y',
              }}
            />
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
