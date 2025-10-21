import { motion } from 'framer-motion'
import { Zap, TrendingUp, Crown } from 'lucide-react'
import { useAuth } from '@/lib/auth'

export default function QuotaCard({ user }) {
  const { isPro, upgradeToPro } = useAuth()
  
  const todayUsage = user?.usage?.today?.generations || 0
  const limit = isPro ? 15 : 1
  const percentage = (todayUsage / limit) * 100
  
  // Calculate days until reset for free users
  const today = new Date()
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)
  const daysUntilReset = Math.ceil((nextMonth - today) / (1000 * 60 * 60 * 24))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 mb-8"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold mb-1">
            {isPro ? 'Pro Plan' : 'Free Plan'}
          </h3>
          <p className="text-gray-400 text-sm">
            {isPro
              ? `${todayUsage} of ${limit} articles used today`
              : `${todayUsage} of ${limit} article used this month`}
          </p>
        </div>
        {isPro ? (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-primary text-sm font-medium">
            <Crown className="w-4 h-4" />
            PRO
          </div>
        ) : (
          <button
            onClick={upgradeToPro}
            className="btn-primary text-sm py-2 px-4"
          >
            Upgrade
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentage, 100)}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              percentage >= 100
                ? 'bg-red-500'
                : percentage >= 75
                ? 'bg-yellow-500'
                : 'bg-gradient-primary'
            }`}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-gray-400">
          <Zap className="w-4 h-4" />
          <span>
            {isPro
              ? 'Resets tomorrow'
              : `Resets in ${daysUntilReset} days`}
          </span>
        </div>
        {!isPro && todayUsage >= limit && (
          <span className="text-red-400 font-medium">Limit reached</span>
        )}
      </div>

      {!isPro && (
        <div className="mt-4 p-3 rounded-lg bg-primary-900/20 border border-primary-500/20">
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-accent-400" />
            <span className="text-gray-300">
              Upgrade to Pro for 15 articles per day
            </span>
          </div>
        </div>
      )}
    </motion.div>
  )
}
