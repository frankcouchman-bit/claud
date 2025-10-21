import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, TrendingUp, FileText, Clock, Zap } from 'lucide-react'
import { useAuth } from '../lib/auth'
import QuotaCard from '../components/dashboard/QuotaCard'
import OutputList from '../components/dashboard/OutputList'
import ToolsGrid from '../components/dashboard/ToolsGrid'
import AnalyticsWidget from '../components/dashboard/AnalyticsWidget'
import UpgradeBanner from '../components/modals/UpgradeBanner'
import { api } from '../lib/api'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const { user, isPro, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadData() {
    try {
      const [articlesData] = await Promise.all([
        api.getArticles(),
        refreshUser()
      ])
      setArticles(articlesData || [])
    } catch (error) {
      toast.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerateArticle() {
    if (!user) {
      navigate('/login')
      return
    }

    // Quotas
    if (!isPro && (user.usage?.today?.generations ?? 0) >= 1) {
      toast.error('Daily limit reached. Upgrade to Pro for 15 articles/day!')
      return
    }
    if (isPro && (user.usage?.today?.generations ?? 0) >= 15) {
      toast.error('Daily limit reached (15/day). Resets tomorrow.')
      return
    }

    navigate('/tools?action=generate')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Welcome back, {user?.email?.split('@')[0] || 'User'}
        </h1>
        <p className="text-gray-400">
          {isPro ? 'Pro Member' : 'Free Plan'} • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Quota Card */}
      <QuotaCard user={user} />

      {/* Primary Action */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleGenerateArticle}
        disabled={generating || (!isPro && (user?.usage?.today?.generations ?? 0) >= 1)}
        className="w-full md:w-auto btn-primary text-lg mb-8 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="w-5 h-5 mr-2" />
        Generate New Article
      </motion.button>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-5 h-5 text-primary-400" />
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold mb-1">{articles.length}</div>
          <div className="text-sm text-gray-400">Total Articles</div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-5 h-5 text-accent-400" />
          </div>
          <div className="text-2xl font-bold mb-1">
            {(user?.usage?.today?.generations ?? 0)}/{isPro ? 15 : 1}
          </div>
          <div className="text-sm text-gray-400">Today's Usage</div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold mb-1">
            {articles.reduce((sum, a) => sum + (a.reading_time_minutes || 0), 0)}m
          </div>
          <div className="text-sm text-gray-400">Reading Time</div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold mb-1">
            {articles.length > 0
              ? Math.round(
                  articles.reduce((sum, a) => sum + (a.seo_score || 0), 0) / articles.length
                )
              : 0}
          </div>
          <div className="text-sm text-gray-400">Avg SEO Score</div>
        </div>
      </div>

      {/* Recent Articles */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Recent Articles</h2>
          <button
            onClick={() => navigate('/articles')}
            className="text-primary-400 hover:text-primary-300 font-medium"
          >
            View All →
          </button>
        </div>
        <OutputList articles={articles.slice(0, 5)} onRefresh={loadData} />
      </div>

      {/* Tools Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">SEO Tools</h2>
        <ToolsGrid user={user} />
      </div>

      {/* Analytics */}
      {isPro && <AnalyticsWidget articles={articles} />}

      {/* Upgrade Banner for Free Users */}
      {!isPro && <UpgradeBanner />}
    </div>
  )
}
