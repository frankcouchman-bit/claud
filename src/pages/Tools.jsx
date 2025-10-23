import { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import ToolsGrid from '@/components/dashboard/ToolsGrid'
import ModalQuotaReached from '@/components/modals/ModalQuotaReached'
import ModalNewArticle from '@/components/modals/ModalNewArticle'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

export default function Tools() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user, isPro, upgradeToPro, loadUser, setUser } = useAuth()
  const [showQuotaModal, setShowQuotaModal] = useState(false)
  const [showNewModal, setShowNewModal] = useState(false)
  const [busy, setBusy] = useState(false)
  const mounted = useRef(true)
  const openedFromQuery = useRef(false) // ⬅️ ensures we only open once per visit

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])

  useEffect(() => {
    const action = searchParams.get('action')
    if (action === 'generate' && !busy && !openedFromQuery.current) {
      openedFromQuery.current = true
      setShowNewModal(true)
      // ⬇️ Clear the query so the modal doesn’t re-open on rerender/back
      const next = new URLSearchParams(searchParams)
      next.delete('action')
      setSearchParams(next, { replace: true })
    }
  }, [searchParams, busy, setSearchParams])

  function normalizeArticleId(result) {
    return (
      result?.id ??
      result?.article?.id ??
      result?.data?.id ??
      result?.article_id ??
      result?.uuid ??
      null
    )
  }

  // ⬇️ NEW: fallback helper — get the newest article id from the list
  async function fetchNewestArticleId() {
    try {
      const list = await api.getArticles()
      if (!Array.isArray(list) || list.length === 0) return null
      const sorted = [...list].sort((a, b) => {
        const da = new Date(a?.created_at || a?.createdAt || 0).getTime()
        const db = new Date(b?.created_at || b?.createdAt || 0).getTime()
        return db - da
      })
      const newest = sorted[0]
      return (
        newest?.id ||
        newest?.article_id ||
        newest?.uuid ||
        newest?.data?.id ||
        null
      )
    } catch {
      return null
    }
  }

  async function refreshProfileSoft() {
    try {
      if (typeof loadUser === 'function') {
        await loadUser()
      } else if (typeof setUser === 'function') {
        const profile = await api.getProfile()
        setUser(profile)
      }
    } catch {
      // non-blocking
    }
  }

  async function startGeneration(values) {
    if (!user) {
      // preserve intent so users return to the modal after login
      navigate('/login?return=/tools%3Faction%3Dgenerate')
      return
    }

    const todayUsage = user?.usage?.today?.generations || 0
    const limit = isPro ? 15 : 1
    if (todayUsage >= limit) {
      setShowQuotaModal(true)
      return
    }

    if (busy) return
    setBusy(true)
    const toastId = toast.loading('Starting article generation…')

    try {
      const payload = {
        // map modal values directly to your backend fields
        topic: values.topic || values.keyword,
        keyword: values.keyword,
        tone: values.tone || 'professional',
        target_word_count: values.target_word_count || values.targetWords || 2500,
        region: values.region || 'us',
        research: !!values.research,
        generate_social: (values.generate_social ?? values.generateSocial) ? true : false,
      }

      const result = await api.generateDraft(payload)
      let id = normalizeArticleId(result)

      // ⬇️ Immediately refresh profile so quota UI updates everywhere
      await refreshProfileSoft()

      // ⬇️ PATCH: if backend didn’t return an ID, open the newest article
      if (!id) {
        id = await fetchNewestArticleId()
      }

      toast.success('Article generated!', { id: toastId })
      setShowNewModal(false)
      navigate(id ? `/articles/${id}` : '/articles?open=newest`)
    } catch (error) {
      const status = error?.status
      const msg = error?.data?.error || error?.data?.message || error?.message || 'Failed to generate'
      if (status === 401) {
        toast.error('Session expired — please sign in.', { id: toastId })
        navigate('/login?return=/tools%3Faction%3Dgenerate')
      } else if (status === 429) {
        toast.error('Daily limit reached. Upgrade to Pro for more runs.', { id: toastId })
      } else if (status === 408) {
        toast.error('Timed out. Please try again.', { id: toastId })
      } else {
        toast.error(msg, { id: toastId })
      }
      console.error('❌ startGeneration failed:', error)
    } finally {
      if (mounted.current) setBusy(false)
    }
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">SEO Tools</h1>
        <p className="text-gray-400">Professional tools to optimize your content</p>
      </div>

      <ToolsGrid user={user} />

      {/* quota modal */}
      {showQuotaModal && (
        <ModalQuotaReached
          title="Quota Reached"
          message={
            isPro
              ? "You've reached your daily limit of 15 articles. Resets tomorrow."
              : "You've used your 1 free article this month. Upgrade to Pro for 15 articles per day!"
          }
          onClose={() => setShowQuotaModal(false)}
          onUpgrade={upgradeToPro}
        />
      )}

      {/* new article modal */}
      <ModalNewArticle
        open={showNewModal}
        onClose={() => !busy && setShowNewModal(false)}
        busy={busy}
        onConfirm={startGeneration}
      />
    </div>
  )
}
