import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, ArrowRight } from 'lucide-react'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

export default function ModalDemo({ onClose, onSuccess, onError, onSignupPrompt }) {
  const [topic, setTopic] = useState('')
  const [generating, setGenerating] = useState(false)

  async function handleGenerate() {
    if (!topic.trim()) {
      toast.error('Please enter a topic')
      return
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
      
      toast.success('Demo article generated!')
      onSuccess(result)
      
    } catch (error) {
      console.error('❌ Demo generation failed:', error)
      
      // ✅ Pass error to parent to handle quota enforcement
      if (error.message && (
        error.message.includes('Demo limit') || 
        error.message.includes('demo') ||
        error.message.includes('Quota')
      )) {
        toast.error('Demo limit reached. Sign up for free to continue!')
        onError(error)
        onClose()
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
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative glass-card p-8 max-w-2xl w-full"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Try SEOScribe Free</h2>
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
            {[
              'SEO optimized',
              'Research included',
              'AI-generated image',
              'Citations & sources',
            ].map((feature, i) => (
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
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
