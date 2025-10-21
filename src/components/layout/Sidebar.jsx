import { Link, useLocation } from 'react-router-dom'
import { Home, FileText, Wrench, Settings, Crown, LogOut } from 'lucide-react'
import { useAuth } from '@/lib/auth'

export default function Sidebar() {
  const location = useLocation()
  const { user, isPro, logout, upgradeToPro } = useAuth()

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/articles', icon: FileText, label: 'Articles' },
    { path: '/tools', icon: Wrench, label: 'SEO Tools' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <aside className="w-64 h-screen bg-gray-900 border-r border-white/10 flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary"></div>
          <span className="text-xl font-bold">SEOScribe</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Upgrade Section (Free Users) */}
      {!isPro && (
        <div className="p-4 border-t border-white/10">
          <div className="glass-card p-4 bg-gradient-primary/10 border-primary-500/20">
            <Crown className="w-8 h-8 text-accent-400 mb-2" />
            <h3 className="font-bold mb-1">Upgrade to Pro</h3>
            <p className="text-xs text-gray-400 mb-3">
              15 articles/day + all tools unlocked
            </p>
            <button
              onClick={upgradeToPro}
              className="w-full btn-primary text-sm py-2"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      )}

      {/* User Section */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-bold">
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">
              {user?.email?.split('@')[0] || 'User'}
            </div>
            <div className="text-xs text-gray-400">
              {isPro ? 'Pro Member' : 'Free Plan'}
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
