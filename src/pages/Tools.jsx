import { useEffect, useState, useRef } from 'react'
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
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])

  // Normalize possible API result shapes to get the new article id
  function getArticleId(result) {
    return (
      result?.id ??
      result?.article?.id ??
      result?.data?.id ??
      result?.article_id ??
      result?.uuid ??
      null
    )
  }

  useEffect(() => {
    const action = searchParams.get('action')
    // avoid re-entrancy if already generating
    if (action === 'generate' && !generating) {
      handleGenerate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    if (generating) return
    setGenerating(true)
    const toastId = toast.loading('Starting article generation…')

    try {
      // ✅ Actually call backend to create/generate the article
      const result = await api.generateDraft({
        topic: 'New SEO Article',
        tone: 'professional',
        target_word_count: 2500,
        research: true,
        generate_social: true,
      })

      const id = getArticleId(result)

      toast.success('Article generated!', { id: toastId })

      // Prefer your editor route if it exists; fallback to article detail
      if (id) {
        // Try /editor/:id first; if your app uses /articles/:id, update this line
        navigate(`/articles/${id}`)
      } else {
        // If backend responded without an id, go back to list
        navigate('/articles')
      }
    } catch (error) {
      const status = error?.status
      const msg =
        error?.data?.error ||
        error?.data?.message ||
        error?.message ||
        'Failed to generate'

      if (status === 401) {
        toast.error('Session expired — please sign in.', { id: toastId })
        navigate('/login')
      } else if (status === 429) {
        toast.error('Daily limit reached. Upgrade to Pro for more runs.', { id: toastId })
      } else if (status === 403) {
        toast.error('Access denied. Please check your plan/account.', { id: toastId })
      } else if (status === 408) {
        toast.error('Timed out. Please try again.', { id: toastId })
      } else {
        toast.error(msg, { id: toastId })
      }
      console.error('❌ handleGenerate failed:', error)
    } finally {
      if (mounted.current) setGenerating(false)
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
