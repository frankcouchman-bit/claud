import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, TrendingUp, FileText, Clock, Zap } from 'lucide-react'
import { useAuth } from '../lib/auth'
import QuotaCard from '../components/dashboard/QuotaCard'
import OutputList from '../components/dashboard/OutputList'
import ToolsGrid from '../components/dashboard/ToolsGrid'
import AnalyticsWidget from '../components/dashboard/AnalyticsWidget'
import UpgradeBanner from '../components/modals/UpgradeBanner'
import ModalQuotaReached from '../components/modals/ModalQuotaReached'
import { api } from '../lib/api'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const { user, isPro, refreshUser, upgradeToPro } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showQuotaModal, setShowQuotaModal] = useState(false)

  useEffect(() => {
    loadData()
    
    // ✅ Check for upgrade success
    const upgradeStatus = searchParams.get('upgrade')
    if (upgradeStatus === 'success') {
      setTimeout(async () => {
        await refreshUser()
        toast.success('🎉 Welcome to Pro! You now have 15 articles per day.')
        setSearchParams({})
      }, 2000)
    }
  }, [])

  async function loadData() {
    try {
      const [articlesData] = await Promise.all([
        api.getArticles(),
        refreshUser()
      ])
      setArticles(articlesData)
    } catch (error) {
      console.error('Failed to load dashboard:', error)
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

    // ✅ Check quota before allowing generation
    const todayUsage = user.usage?.today?.generations || 0
    const limit = isPro ? 15 : 1
    
    if (todayUsage >= limit) {
      setShowQuotaModal(true)
      return
    }

    navigate('/tools?action=generate')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // ✅ Calculate stats
  const todayUsage = user?.usage?.today?.generations || 0
  const limit = isPro ? 15 : 1
  const canGenerate = todayUsage < limit

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Welcome back, {user?.email?.split('@')[0] || 'User'}
        </h1>
        <p className="text-gray-400">
          {isPro ? '👑 Pro Member' : 'Free Plan'} • {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric',
            year: 'numeric'
          })}
        </p>
      </div>

      {/* Quota Card */}
      <QuotaCard user={user} />

      {/* Primary Action */}
      <motion.button
        whileHover={canGenerate ? { scale: 1.02 } : {}}
        whileTap={canGenerate ? { scale: 0.98 } : {}}
        onClick={handleGenerateArticle}
        disabled={!canGenerate}
        className="w-full md:w-auto btn-primary text-lg mb-8 disabled:opacity-50 disabled:cursor-not-allowed"
        title={!canGenerate ? 'Daily limit reached' : 'Generate new article'}
      >
        <Plus className="w-5 h-5 mr-2" />
        {canGenerate ? 'Generate New Article' : 'Limit Reached - Upgrade to Continue'}
      </motion.button>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-5 h-5 text-primary-400" />
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold">{articles.length}</div>
          <div className="text-sm text-gray-400">Total Articles</div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-5 h-5 text-accent-400" />
          </div>
          <div className="text-2xl font-bold">
            {todayUsage}/{limit}
          </div>
          <div className="text-sm text-gray-400">
            {isPro ? "Today's Usage" : "This Month"}
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold">
            {articles.reduce((sum, a) => sum + (a.reading_time_minutes || 0), 0)}m
          </div>
          <div className="text-sm text-gray-400">Reading Time</div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold">
            {articles.length > 0 
              ? Math.round(articles.reduce((sum, a) => sum + (a.seo_score || 0), 0) / articles.length)
              : 0}
          </div>
          <div className="text-sm text-gray-400">Avg SEO Score</div>
        </div>
      </div>

      {/* Recent Articles */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Recent Articles</h2>
          {articles.length > 0 && (
            <button
              onClick={() => navigate('/articles')}
              className="text-primary-400 hover:text-primary-300 font-medium"
            >
              View All →
            </button>
          )}
        </div>
        <OutputList articles={articles.slice(0, 5)} onRefresh={loadData} />
      </div>

      {/* Tools Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">SEO Tools</h2>
        <ToolsGrid user={user} />
      </div>

      {/* Analytics (Pro Only) */}
      {isPro && articles.length > 0 && <AnalyticsWidget articles={articles} />}

      {/* Upgrade Banner for Free Users */}
      {!isPro && <UpgradeBanner />}

      {/* Quota Reached Modal */}
      {showQuotaModal && (
        <ModalQuotaReached
          title="Quota Reached"
          message={
            isPro
              ? `You've reached your daily limit of ${limit} articles. Your quota resets tomorrow.`
              : `You've used your ${limit} free article this month. Upgrade to Pro for 15 articles per day!`
          }
          onClose={() => setShowQuotaModal(false)}
          onUpgrade={() => {
            setShowQuotaModal(false)
            upgradeToPro()
          }}
        />
      )}
    </div>
  )
}
