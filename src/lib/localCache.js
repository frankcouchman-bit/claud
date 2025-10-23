// src/pages/Tools.jsx
import { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import ToolsGrid from '@/components/dashboard/ToolsGrid'
import ModalQuotaReached from '@/components/modals/ModalQuotaReached'
import ModalNewArticle from '@/components/modals/ModalNewArticle'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import { lc_isLocked, lc_upsertArticle, lc_incrementUsage } from '@/lib/localCache'
import QuotaBadge from '@/components/ui/QuotaBadge'

export default function Tools() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user, isPro, upgradeToPro, loadUser, setUser } = useAuth()
  const [showQuotaModal, setShowQuotaModal] = useState(false)
  const [showNewModal, setShowNewModal] = useState(false)
  const [busy, setBusy] = useState(false)
  const mounted = useRef(true)
  const openedFromQuery = useRef(false)

  useEffect(() => { mounted.current = true; return () => { mounted.current = false } }, [])

  useEffect(() => {
    const action = searchParams.get('action')
    if (action === 'generate' && !busy && !openedFromQuery.current) {
      openedFromQuery.current = true
      setShowNewModal(true)
      const next = new URLSearchParams(searchParams); next.delete('action')
      setSearchParams(next, { replace: true })
    }
  }, [searchParams, busy, setSearchParams])

  function normalizeArticleId(result) {
    return (
      result?.id ?? result?.article?.id ?? result?.data?.id ?? result?.article_id ?? result?.uuid ?? null
    )
  }

  async function fetchNewestArticleId() {
    try {
      const list = await api.getArticles()
      if (!Array.isArray(list) || list.length === 0) return null
      const sorted = [...list].sort((a, b) =>
        new Date(b?.created_at || b?.createdAt || 0) - new Date(a?.created_at || a?.createdAt || 0)
      )
      const n = sorted[0]
      return n?.id || n?.article_id || n?.uuid || n?.data?.id || null
    } catch { return null }
  }

  async function refreshProfileSoft() {
    try {
      if (typeof loadUser === 'function') await loadUser()
      else if (typeof setUser === 'function') setUser(await api.getProfile())
    } catch {}
  }

  async function startGeneration(values) {
    if (!user) {
      navigate('/login?return=/tools%3Faction%3Dgenerate')
      return
    }

    // 🔒 Client-side quota guard first (front-end visible)
    const clientLock = lc_isLocked(isPro)
    if (clientLock.locked) {
      setShowQuotaModal(true)
      return
    }

    // (Optional) You can keep your server-usage check too:
    const todayUsage = user?.usage?.today?.generations || 0
    const serverLimit = isPro ? 15 : 1
    if ((isPro && todayUsage >= serverLimit) || (!isPro && todayUsage >= 1)) {
      setShowQuotaModal(true)
      return
    }

    if (busy) return
    setBusy(true)
    const toastId = toast.loading('Starting article generation…')

    try {
      const payload = {
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

      // ✅ Save locally right away (so preview is instant)
      lc_upsertArticle({
        id: id || crypto.randomUUID(),
        title: result?.title || payload.topic,
        keyword: payload.keyword,
        tone: payload.tone,
        target_word_count: payload.target_word_count,
        data: result?.data || result?.content || result?.body || {},
        html: result?.html || result?.content?.html || result?.body?.html || null,
        created_at: new Date().toISOString(),
        status: 'draft',
      })

      // ✅ Increment client-side usage so UI shows lock immediately
      lc_incrementUsage(isPro)

      // Refresh server profile (so server-side pills match)
      await refreshProfileSoft()

      // If backend didn’t return an ID yet, try fetch newest from server; else use local cached ID
      if (!id) id = await fetchNewestArticleId()

      toast.success('Article generated!', { id: toastId })
      setShowNewModal(false)
      // Always navigate to something renderable; local cache will render even if server is slow
      navigate(id ? `/articles/${id}` : '/articles?open=newest')
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
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">SEO Tools</h1>
          <p className="text-gray-400">Professional tools to optimize your content</p>
        </div>
        {/* 🔎 Front-end visible quota */}
        <QuotaBadge isPro={!!isPro} />
      </div>

      <ToolsGrid user={user} />

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

      <ModalNewArticle
        open={showNewModal}
        onClose={() => !busy && setShowNewModal(false)}
        busy={busy}
        onConfirm={startGeneration}
      />
    </div>
  )
}
