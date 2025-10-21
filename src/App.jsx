import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './lib/auth'

// Pages
import Home from './pages/Home'
import AiWriter from './pages/AiWriter'
import WritingTool from './pages/WritingTool'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Articles from './pages/Articles'
import Tools from './pages/Tools'
import Settings from './pages/Settings'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import NotFound from './pages/NotFound'

// Layout
import DashboardLayout from './components/layout/DashboardLayout'

/** Minimal ErrorBoundary so runtime errors don’t render a blank page */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, info: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, info) {
    // Helpful in prod with sourcemaps enabled
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught:', error, info)
    this.setState({ info })
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 16, background: '#0b0f1a', color: '#ff6b6b', fontFamily: 'ui-monospace, Menlo, monospace' }}>
          <h2 style={{ marginTop: 0 }}>Runtime error</h2>
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

/** Tiny smoke page to prove the app + router mounted (visit #/__works) */
function Works() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">✅ App mounted</h1>
      <p className="text-gray-400">If you can see this at <code>#/__works</code>, build + preview are fine.</p>
    </div>
  )
}

function App() {
  // Small boot log so you can see JS is executing in prod builds
  // eslint-disable-next-line no-console
  console.log('BOOT: App.jsx mounted')

  return (
    <AuthProvider>
      {/* HashRouter avoids needing server-side SPA rewrites during preview/static hosting */}
      <HashRouter>
        <ErrorBoundary>
          <Routes>
            {/* Smoke route */}
            <Route path="/__works" element={<Works />} />

            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/ai-writer" element={<AiWriter />} />
            <Route path="/writing-tool" element={<WritingTool />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />

            {/* Dashboard (wrapped by your layout/guard) */}
            <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
            <Route path="/articles"  element={<DashboardLayout><Articles /></DashboardLayout>} />
            <Route path="/tools"     element={<DashboardLayout><Tools /></DashboardLayout>} />
            <Route path="/settings"  element={<DashboardLayout><Settings /></DashboardLayout>} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>

          <Toaster position="top-right" />
        </ErrorBoundary>
      </HashRouter>
    </AuthProvider>
  )
}

export default App
