import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
import ArticleView from './pages/ArticleView.jsx' // ✅ explicit .jsx
import Tools from './pages/Tools'
import Settings from './pages/Settings'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import NotFound from './pages/NotFound'

// 🔽 ADD: tool workspace page for /tools/:id
import ToolWorkspace from './pages/tools/ToolWorkspace'

// Layout
import DashboardLayout from './components/layout/DashboardLayout'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/ai-writer" element={<AiWriter />} />
          <Route path="/writing-tool" element={<WritingTool />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
          <Route path="/articles" element={<DashboardLayout><Articles /></DashboardLayout>} />
          <Route path="/articles/:id" element={<DashboardLayout><ArticleView /></DashboardLayout>} />
          <Route path="/tools" element={<DashboardLayout><Tools /></DashboardLayout>} />

          {/* 🔽 ADD: this prevents 404 when clicking a tool card */}
          <Route path="/tools/:id" element={<DashboardLayout><ToolWorkspace /></DashboardLayout>} />

          <Route path="/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#fff',
              border: '1px solid #374151',
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
