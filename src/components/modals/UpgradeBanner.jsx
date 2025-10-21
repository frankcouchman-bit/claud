import { motion } from 'framer-motion'
import { X, Crown, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/lib/auth'

export default function UpgradeBanner() {
  const [dismissed, setDismissed] = useState(false)
  const { upgradeToPro } = useAuth()

  if (dismissed) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 max-w-md z-40"
    >
      <div className="glass-card p-6 bg-gradient-primary/20 border-primary-500/30 shadow-2xl">
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
            <Crown className="w-6 h-6" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-1">Unlock Pro Features</h3>
            <p className="text-sm text-gray-300 mb-4">
              Generate 15 articles per day, access all tools unlimited times, and collaborate with your team.
            </p>
            
            <button
              onClick={upgradeToPro}
              className="btn-primary text-sm group"
            >
              Upgrade to Pro
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
