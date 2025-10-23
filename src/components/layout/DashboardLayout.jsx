import { useAuth } from '@/lib/auth'
import { Navigate, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function DashboardLayout({ children }) {
  const { isAuthenticated, loading, user } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('❌ Not authenticated, redirecting to login...')
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  console.log('✅ Authenticated, showing dashboard. User:', user)

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  )
}
