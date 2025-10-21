import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import ToolsGrid from '@/components/dashboard/ToolsGrid'
import ModalQuotaReached from '@/components/modals/ModalQuotaReached'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

export default function Tools() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, isPro, upgradeToPro } = useAuth()
  const [showQuotaModal, setShowQuotaModal] = useState(false)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    const action = searchParams.get('action')
    if (action === 'generate') {
      handleGenerate()
    }
  }, [searchParams])

  async function handleGenerate() {
    if (!user) {
      navigate('/login')
      return
    }

    const todayUsage = user.usage?.today?.generations || 0
    const limit = isPro ? 15 : 1

    if (todayUsage >= limit) {
      setShowQuotaModal(true)
      return
    }

    setGenerating(true)
    try {
      // Show generation interface or modal
      toast.success('Starting article generation...')
      // Navigate to generation interface when built
      navigate('/dashboard')
    } catch (error) {
      toast.error('Failed to start generation')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">SEO Tools</h1>
        <p className="text-gray-400">
          Professional tools to optimize your content
        </p>
      </div>

      <ToolsGrid user={user} />

      {showQuotaModal && (
        <ModalQuotaReached
          title="Quota Reached"
          message={
            isPro
              ? 'You\'ve reached your daily limit of 15 articles. Resets tomorrow.'
              : 'You\'ve used your 1 free article this month. Upgrade to Pro for 15 articles per day!'
          }
          onClose={() => setShowQuotaModal(false)}
          onUpgrade={upgradeToPro}
        />
      )}
    </div>
  )
}
