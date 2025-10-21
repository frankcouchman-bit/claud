import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertCircle, Crown } from 'lucide-react'

export default function ModalQuotaReached({ title, message, onClose, onUpgrade }) {
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
          className="relative glass-card p-8 max-w-md w-full"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-yellow-400" />
            </div>

            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <p className="text-gray-400 mb-6">{message}</p>

            <div className="space-y-3">
              <button
                onClick={onUpgrade}
                className="w-full btn-primary group"
              >
                <Crown className="w-5 h-5 mr-2" />
                Upgrade to Pro
              </button>
              <button
                onClick={onClose}
                className="w-full btn-ghost"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
