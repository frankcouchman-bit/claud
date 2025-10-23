import { motion } from 'framer-motion'
import { Zap, TrendingUp, Crown, Calendar, Clock } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { useState, useEffect } from 'react'

export default function QuotaCard({ user }) {
  const { isPro, upgradeToPro } = useAuth()
  const [timeUntilReset, setTimeUntilReset] = useState('')
  
  // ✅ Calculate quota from user data
  const todayGenerations = user?.usage?.today?.generations || 0
  const monthGenerations = user?.usage?.month?.generations || 0
  const limit = isPro ? 15 : 1
  const isDaily = isPro // Pro resets daily, Free resets monthly
  
  // ✅ Calculate percentage
  const used = isDaily ? todayGenerations : monthGenerations
  const percentage = Math.min((used / limit) * 100, 100)
  
  // ✅ Determine status
  const isLimitReached = used >= limit
  const isWarning = percentage >= 75 && !isLimitReached
  
  // ✅ Calculate time until reset
  useEffect(() => {
    function updateResetTime() {
      const now = new Date()
      
      if (isDaily) {
        // Reset at midnight
        const tomorrow = new Date(now)
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(0, 0, 0, 0)
        const hours = Math.floor((tomorrow - now) / (1000 * 60 * 60))
        const minutes = Math.floor((tomorrow - now) / (1000 * 60)) % 60
        setTimeUntilReset(`${hours}h ${minutes}m`)
      } else {
        // Reset on 1st of next month
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
        const days = Math.ceil((nextMonth - now) / (1000 * 60 * 60 * 24))
        setTimeUntilReset(`${days} day${days !== 1 ? 's' : ''}`)
      }
    }
    
    updateResetTime()
    const interval = setInterval(updateResetTime, 60000) // Update every minute
    
    return () => clearInterval(interval)
  }, [isDaily])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 mb-8 border-2 border-white/10"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-2xl font-bold">
              {isPro ? 'Pro Plan' : 'Free Plan'}
            </h3>
            {isPro && (
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-primary text-sm font-medium">
                <Crown className="w-4 h-4" />
                PRO
              </div>
            )}
          </div>
          <p className="text-gray-400 text-sm">
            {used} of {limit} article{limit !== 1 ? 's' : ''} used {isDaily ? 'today' : 'this month'}
          </p>
        </div>
        
        {!isPro && (
          <button
            onClick={upgradeToPro}
            className="btn-primary text-sm py-2 px-4 whitespace-nowrap"
          >
            Upgrade to Pro
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              isLimitReached
                ? 'bg-red-500'
                : isWarning
                ? 'bg-yellow-500'
                : 'bg-gradient-primary'
            }`}
          />
        </div>
      </div>

      {/* Status Row */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          {isLimitReached ? (
            <>
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-red-400 font-medium">Limit Reached</span>
            </>
          ) : isWarning ? (
            <>
              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
              <span className="text-yellow-400 font-medium">
                {limit - used} remaining
              </span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-green-400 font-medium">
                {limit - used} remaining
              </span>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Resets in {timeUntilReset}</span>
        </div>
      </div>

      {/* Upgrade CTA for Free Users */}
      {!isPro && (
        <div className="mt-4 p-4 rounded-lg bg-primary-900/20 border border-primary-500/20">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-accent-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-gray-300 font-medium mb-1">
                Want more? Upgrade to Pro
              </p>
              <p className="text-xs text-gray-400">
                Generate 15 articles per day + unlock all SEO tools
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Limit Reached Warning */}
      {isLimitReached && (
        <div className="mt-4 p-4 rounded-lg bg-red-900/20 border border-red-500/20">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-300 font-medium mb-1">
                {isPro ? 'Daily limit reached' : 'Monthly limit reached'}
              </p>
              <p className="text-xs text-gray-400">
                {isPro 
                  ? `You can generate more articles in ${timeUntilReset}` 
                  : `Upgrade to Pro for 15 articles per day`
                }
              </p>
              {!isPro && (
                <button
                  onClick={upgradeToPro}
                  className="mt-2 text-xs text-primary-400 hover:text-primary-300 font-medium"
                >
                  Upgrade Now →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
