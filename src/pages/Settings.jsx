import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Bell, CreditCard, Shield } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

export default function Settings() {
  const { user, isPro, upgradeToPro, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ]

  async function handleManageSubscription() {
    setLoading(true)
    try {
      const { url } = await api.createPortalSession(window.location.href)
      window.location.href = url
    } catch (error) {
      toast.error('Failed to open billing portal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="glass-card p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          {activeTab === 'profile' && (
            <div className="glass-card p-6">
              <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400"
                  />
                  <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Plan</label>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-primary-900/30 border border-primary-500/30 rounded-full text-sm">
                      {isPro ? 'Pro' : 'Free'}
                    </span>
                    {!isPro && (
                      <button onClick={upgradeToPro} className="text-sm text-primary-400 hover:text-primary-300">
                        Upgrade to Pro →
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-700">
                  <button
                    onClick={logout}
                    className="text-red-400 hover:text-red-300 font-medium"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="glass-card p-6">
              <h2 className="text-2xl font-bold mb-6">Billing & Subscription</h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{isPro ? 'Pro Plan' : 'Free Plan'}</h3>
                      <p className="text-sm text-gray-400">
                        {isPro ? '$29/month' : 'No payment required'}
                      </p>
                    </div>
                    {isPro && (
                      <button
                        onClick={handleManageSubscription}
                        disabled={loading}
                        className="btn-ghost"
                      >
                        {loading ? 'Loading...' : 'Manage Subscription'}
                      </button>
                    )}
                  </div>

                  {!isPro && (
                    <button onClick={upgradeToPro} className="btn-primary">
                      Upgrade to Pro
                    </button>
                  )}
                </div>

                <div className="pt-6 border-t border-gray-700">
                  <h3 className="font-bold mb-4">Usage This Month</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Articles Generated</span>
                      <span className="font-medium">
                        {user?.usage?.month?.generations || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="glass-card p-6">
              <h2 className="text-2xl font-bold mb-6">Notifications</h2>
              
              <div className="space-y-4">
                {[
                  { id: 'marketing', label: 'Marketing emails', description: 'Receive tips and product updates' },
                  { id: 'usage', label: 'Usage alerts', description: 'Get notified when approaching limits' },
                  { id: 'updates', label: 'Feature updates', description: 'Learn about new features' },
                ].map((item) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id={item.id}
                      defaultChecked
                      className="mt-1"
                    />
                    <label htmlFor={item.id} className="flex-1">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-sm text-gray-400">{item.description}</div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="glass-card p-6">
              <h2 className="text-2xl font-bold mb-6">Security</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold mb-2">Authentication Method</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    You're signed in with {user?.email}
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-700">
                  <h3 className="font-bold mb-2">Account Security</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    We use magic links for secure, passwordless authentication.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
