import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, ArrowRight } from 'lucide-react'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

const DEMO_KEY = 'seoscribe_demo_used'
const DEMO_COOLDOWN_DAYS = 30

function getDaysSince(timestamp) {
  const used = new Date(Number(timestamp))
  return (Date.now() - used.getTime()) / (1000 * 60 * 60 * 24)
}

function safeGet(key) {
  try {
    if (typeof window === 'undefined') return null
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSet(key, value) {
  try {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(key, value)
  } catch {
    // ignore write failures (private mode, quota, etc.)
  }
}

export default function ModalDemo({
  onClose,
  onSuccess,
  onError,
  onSignupPrompt,
}) {
  const [topic, setTopic] = useState('')
  const [generating, setGenerating] = useState(false)

  async function handleGenerate() {
    if (!topic.trim()) {
      toast.error('Please enter a topic')
      return
    }

    // ✅ Fast client-side quota check
    const demoTimestamp = safeGet(DEMO_KEY)
    if (demoTimestamp) {
      const daysSince = getDaysSince(demoTimestamp)
      if (daysSince < DEMO_COOLDOWN_DAYS) {
        toast.error(
          `Demo already used ${Math.floor(daysSince)} days ago. Sign up for free!`
        )
        onError?.(new Error('Demo limit reached'))
        onClose?.()
        return
      }
    }

    setGenerating(true)
    try {
      const result = await api.generateDraft({
        topic: topic.trim(),
        tone: 'professional',
        target_word_count: 3000,
        research: true,
        generate_social: true,
      })

      // ✅ Mark as used locally on success
      safeSet(DEMO_KEY, Date.now().toString())
      toast.success('Demo article generated!')
      onSuccess?.(result)
    } catch (error) {
      console.error('❌ Demo generation failed:', error)

      const msg = (error?.message || '').toLowerCase()
      const quotaHit =
        msg.includes('demo limit') ||
        msg.includes('demo') ||
        msg.includes('quota') ||
        msg.includes('ip')

      if (quotaHit) {
        // Mirror server enforcement locally
        safeSet(DEMO_KEY, Date.now().toString())
        toast.error('Demo limit reached. Sign up for free!')
        onError?.(error)
        onClose?.()
      } else {
        toast.error('Failed to generate demo. Please try again.')
      }
    } finally {
      setGenerating(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onClose?.()}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative glass-card p-8 max-w-2xl w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="demo-title"
        >
          <button
            onClick={() => onClose?.()}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 id="demo-title" className="text-3xl font-bold mb-2">
              Try SEOScribe Free
            </h2>
            <p className="text-gray-400">
              Generate a professional 3000+ word article with SEO optimization, research, and AI-generated images
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              What would you like to write about?
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !generating && handleGenerate()}
              placeholder="e.g., 'The Future of AI in Healthcare' or 'Best Marketing Strategies 2025'"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
              disabled={generating}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 text-sm">
            {['SEO optimized', 'Research included', 'AI-generated image', 'Citations & sources'].map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating || !topic.trim()}
            className="w-full btn-primary text-lg group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <>
                <div className="spinner mr-2"></div>
                Generating Article... (~2 min)
              </>
            ) : (
              <>
                Generate Free Demo
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            No credit card required • 1 free demo • Takes ~2 minutes
          </p>

          {/* Optional tiny CTA if you want to nudge sign-up right here */}
          <div className="text-center mt-3">
            <button
              type="button"
              className="text-sm text-primary-300 hover:underline"
              onClick={() => onSignupPrompt?.()}
            >
              Prefer unlimited runs? Create a free account →
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
