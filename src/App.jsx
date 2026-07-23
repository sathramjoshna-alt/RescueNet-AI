import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import StarField from './components/StarField'
import Navbar from './components/Navbar'
import AIAssistant from './components/AIAssistant'
import NotificationToasts from './components/NotificationToasts'

// Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import UserDashboard from './pages/UserDashboard'
import RescueDashboard from './pages/RescueDashboard'
import DisasterMap from './pages/DisasterMap'
import Satellites from './pages/Satellites'
import RescueOps from './pages/RescueOps'
import Victims from './pages/Victims'
import DroneDashboard from './pages/DroneDashboard'
import IoTMonitor from './pages/IoTMonitor'
import WeatherPage from './pages/WeatherPage'
import Analytics from './pages/Analytics'
import SOSSystem from './pages/SOSSystem'
import About from './pages/About'
import Contact from './pages/Contact'
import CommSimulation from './pages/CommSimulation'
import MissionControlComm from './pages/MissionControlComm'

// ─── Protected route (auth required) ─────────────────────────────────────
function ProtectedRoute({ children, roles }) {
  const { user } = useApp()
  if (!user) return <Navigate to="/login" replace />
  // If roles specified, check access
  if (roles && !roles.includes(user.role)) {
    // Redirect to their dashboard
    const redirects = { admin: '/dashboard', rescue: '/rescue-dashboard', user: '/user-dashboard' }
    return <Navigate to={redirects[user.role] || '/dashboard'} replace />
  }
  return children
}

// ─── App layout (auth pages) ──────────────────────────────────────────────
function AppLayout({ children }) {
  return (
    <div className="min-h-screen relative">
      <StarField />
      <Navbar />
      <main className="relative z-10 pt-14">
        {children}
      </main>
      <AIAssistant />
      <NotificationToasts />
    </div>
  )
}

// ─── Public layout (landing, login, etc.) ────────────────────────────────
function PublicLayout({ children }) {
  return (
    <div className="min-h-screen relative">
      <StarField />
      <NotificationToasts />
      {children}
    </div>
  )
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<PublicLayout><Landing /></PublicLayout>} />
      <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
      <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* Admin Dashboard (admin only) */}
      <Route path="/dashboard" element={
        <ProtectedRoute roles={['admin']}>
          <AppLayout><Dashboard /></AppLayout>
        </ProtectedRoute>
      } />

      {/* Rescue Team Dashboard */}
      <Route path="/rescue-dashboard" element={
        <ProtectedRoute roles={['rescue', 'admin']}>
          <AppLayout><RescueDashboard /></AppLayout>
        </ProtectedRoute>
      } />

      {/* User Dashboard */}
      <Route path="/user-dashboard" element={
        <ProtectedRoute roles={['user', 'admin']}>
          <AppLayout><UserDashboard /></AppLayout>
        </ProtectedRoute>
      } />

      {/* Shared protected routes */}
      <Route path="/map" element={
        <ProtectedRoute>
          <AppLayout><DisasterMap /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/satellites" element={
        <ProtectedRoute roles={['admin']}>
          <AppLayout><Satellites /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/rescue" element={
        <ProtectedRoute roles={['rescue', 'admin']}>
          <AppLayout><RescueOps /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/victims" element={
        <ProtectedRoute roles={['rescue', 'admin']}>
          <AppLayout><Victims /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/drones" element={
        <ProtectedRoute roles={['admin']}>
          <AppLayout><DroneDashboard /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/iot" element={
        <ProtectedRoute roles={['admin']}>
          <AppLayout><IoTMonitor /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/weather" element={
        <ProtectedRoute roles={['admin']}>
          <AppLayout><WeatherPage /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute roles={['admin']}>
          <AppLayout><Analytics /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/sos" element={
        <ProtectedRoute>
          <AppLayout><SOSSystem /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/comm-simulation" element={
        <ProtectedRoute>
          <AppLayout><CommSimulation /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/mission-control" element={
        <ProtectedRoute roles={['rescue', 'admin']}>
          <AppLayout><MissionControlComm /></AppLayout>
        </ProtectedRoute>
      } />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  )
}
