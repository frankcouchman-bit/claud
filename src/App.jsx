import React, { Suspense, lazy } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './lib/auth'

// Per-page lazy imports (failures will name the page)
const Home = lazy(() => import('./pages/Home').catch(e => { throw new Error('Home import failed: ' + e.message) }))
const AiWriter = lazy(() => import('./pages/AiWriter').catch(e => { throw new Error('AiWriter import failed: ' + e.message) }))
const WritingTool = lazy(() => import('./pages/WritingTool').catch(e => { throw new Error('WritingTool import failed: ' + e.message) }))
const Login = lazy(() => import('./pages/Login').catch(e => { throw new Error('Login import failed: ' + e.message) }))
const Signup = lazy(() => import('./pages/Signup').catch(e => { throw new Error('Signup import failed: ' + e.message) }))
const Dashboard = lazy(() => import('./pages/Dashboard').catch(e => { throw new Error('Dashboard import failed: ' + e.message) }))
const Articles = lazy(() => import('./pages/Articles').catch(e => { throw new Error('Articles import failed: ' + e.message) }))
const Tools = lazy(() => import('./pages/Tools').catch(e => { throw new Error('Tools import failed: ' + e.message) }))
const Settings = lazy(() => import('./pages/Settings').catch(e => { throw new Error('Settings import failed: ' + e.message) }))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy').catch(e => { throw new Error('PrivacyPolicy import failed: ' + e.message) }))
const TermsOfService = lazy(() => import('./pages/TermsOfService').catch(e => { throw new Error('TermsOfService import failed: ' + e.message) }))
const NotFound = lazy(() => import('./pages/NotFound').catch(e => { throw new Error('NotFound import failed: ' + e.message) }))

const DashboardLayout = lazy(() => import('./components/layout/DashboardLayout').catch(e => { throw new Error('DashboardLayout import failed: ' + e.message) }))

function Works() {
  return (
    <div style={{ padding: 24 }}>
      <h1 className="text-2xl font-bold">✅ App mounted</h1>
      <p className="text-gray-400">Router + Suspense are running.</p>
    </div>
  )
}

/** Route-scoped error boundary so one bad page won’t blank everything */
class RouteBoundary extends React.Component {
  constructor(p){ super(p); this.state = { error: null, info: null } }
  static getDerivedStateFromError(error){ return { error } }
  componentDidCatch(error, info){ console.error('Route error:', error, info); this.setState({ info }) }
  render(){
    if (this.state.error) {
      return (
        <div style={{ padding: 16, background: '#0b0f1a', color: '#ff6b6b', fontFamily: 'ui-monospace, Menlo, monospace' }}>
          <h2 style={{ marginTop: 0 }}>Route crashed</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{String(this.state.error)}</pre>
          {this.state.info?.componentStack && (
            <>
              <h3>Component stack</h3>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.info.componentStack}</pre>
            </>
          )}
        </div>
      )
    }
    return this.props.children
  }
}

function Loader() {
  return (
    <div style={{ padding: 24, opacity: 0.7 }}>
      <span>Loading…</span>
    </div>
  )
}

export default function App() {
  console.log('BOOT: App.jsx mounted')
  return (
    <AuthProvider>
      <HashRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* Smoke test */}
            <Route path="/__works" element={<Works />} />

            {/* Public routes */}
            <Route path="/" element={
              <RouteBoundary><Home /></RouteBoundary>
            } />
            <Route path="/ai-writer" element={
              <RouteBoundary><AiWriter /></RouteBoundary>
            } />
            <Route path="/writing-tool" element={
              <RouteBoundary><WritingTool /></RouteBoundary>
            } />
            <Route path="/login" element={
              <RouteBoundary><Login /></RouteBoundary>
            } />
            <Route path="/signup" element={
              <RouteBoundary><Signup /></RouteBoundary>
            } />
            <Route path="/privacy-policy" element={
              <RouteBoundary><PrivacyPolicy /></RouteBoundary>
            } />
            <Route path="/terms" element={
              <RouteBoundary><TermsOfService /></RouteBoundary>
            } />

            {/* Dashboard routes */}
            <Route path="/dashboard" element={
              <RouteBoundary><DashboardLayout><Dashboard /></DashboardLayout></RouteBoundary>
            } />
            <Route path="/articles" element={
              <RouteBoundary><DashboardLayout><Articles /></DashboardLayout></RouteBoundary>
            } />
            <Route path="/tools" element={
              <RouteBoundary><DashboardLayout><Tools /></DashboardLayout></RouteBoundary>
            } />
            <Route path="/settings" element={
              <RouteBoundary><DashboardLayout><Settings /></DashboardLayout></RouteBoundary>
            } />

            {/* 404 */}
            <Route path="*" element={
              <RouteBoundary><NotFound /></RouteBoundary>
            } />
          </Routes>
        </Suspense>
        <Toaster position="top-right" />
      </HashRouter>
    </AuthProvider>
  )
}
