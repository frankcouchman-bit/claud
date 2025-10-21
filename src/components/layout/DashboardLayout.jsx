import { useAuth } from '@/lib/auth'
import { Navigate } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function DashboardLayout({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  )
}
