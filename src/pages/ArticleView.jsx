import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Share2, Download, Edit, Trash2,
  Copy, Check, ExternalLink, Sparkles,
  TrendingUp, Clock, FileText
} from 'lucide-react'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import { useAuth } from '@/lib/auth'

export default function ArticleView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { loadUser, setUser } = useAuth?.() || {}
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copiedPlatform, setCopiedPlatform] = useState(null)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])

  useEffect(() => {
    loadArticle()
    // refresh profile/usage so quota pills reflect the new generation
    ;(async () => {
      try {
        if (typeof loadUser === 'function') {
          await loadUser()
        } else if (typeof setUser === 'function') {
          const profile = await api.getProfile()
          setUser(profile)
        }
      } catch { /* non-blocking */ }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function loadArticle() {
    setLoading(true)
    try {
      const data = await api.getArticle(id)
      if (!mounted.current) return
      setArticle(data || null)
      if (!data) throw new Error('Article not found')
    } catch (error) {
      toast.error(error?.data?.error || error?.message || 'Failed to load article')
      navigate('/articles')
    } finally {
      if (mounted.current) setLoading(false)
    }
  }

  async function handleCopy(text, platform) {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedPlatform(platform)
      toast.success(`${platform} post copied!`)
      setTimeout(() => setCopiedPlatform(null), 2000)
    } catch {
      toast.error('Copy failed — select the text and copy manually.')
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this article?')) return
    try {
      await api.deleteArticle(id)
      toast.success('Article deleted')
      navigate('/articles')
    } catch (error) {
      toast.error(error?.data?.error || 'Failed to delete')
    }
  }

  // ---------- Normalization ----------
  const normalized = useMemo(() => {
    const a = article || {}

    // Prefer nested `data` but fall back gracefully
    const d = a.data || a.content || a.body || {}

    // Title / keyword / tone
    const title =
      a.title ??
      d.title ??
      a.meta_title ??
      a.seo_title ??
      d.meta?.title ??
      a.topic ??
      d.topic ??
      'Untitled article'

    const keyword =
      a.keyword ?? d.keyword ?? a.primary_keyword ?? d.primary_keyword ?? null

    const tone =
      a.tone ?? d.tone ?? a.style ?? d.style ?? null

    // Word count / reading time
    const wordCount =
      a.word_count ?? d.word_count ?? a.target_word_count ?? d.target_word_count ?? 0

    const readingMinutes =
      a.reading_time_minutes ?? d.reading_time_minutes ?? Math.max(1, Math.round((wordCount || 0) / 220))

    // SEO/meta
    const metaTitle = a.meta_title ?? d.meta?.title ?? a.seo_title ?? null
    const metaDescription = a.meta_description ?? d.meta?.description ?? a.seo_description ?? null

    // Image
    const image =
      d.image ||
      a.image ||
      (d.hero && (d.hero.image || d.hero)) ||
      null
    const imageUrl =
      image?.image_url || image?.url || image?.src || null
    const imageProvider =
      image?.provider || image?.source || null

    // Body HTML (various places)
    const html =
      a.html ??
      d.html ??
      a.body?.html ??
      d.body?.html ??
      null

    // Sections (fallback to structured rendering)
    const sections =
      d.sections ??
      a.sections ??
      d.outline ??
      null

    // Citations
    const citations =
      d.citations ?? a.citations ?? d.sources ?? a.sources ?? []

    // SEO score (if provided)
    const seoScore =
      a.seo_score ?? d.seo_score ?? null

    // Social posts: accept several shapes
    const social =
      d.social_media_posts ??
      a.social_media_posts ??
      d.social ??
      a.social ??
      {}

    // Created at
    const createdAt =
      a.created_at ?? d.created_at ?? a.createdAt ?? d.createdAt ?? new Date().toISOString()

    return {
      title,
      keyword,
      tone,
      wordCount,
      readingMinutes,
      metaTitle,
      metaDescription,
      html,
      sections: Array.isArray(sections) ? sections : null,
      citations: Array.isArray(citations) ? citations : [],
      imageUrl,
      imageProvider,
      seoScore,
      createdAt,
      socialPosts: social || {},
    }
  }, [article])

  const {
    title, keyword, tone, wordCount, readingMinutes,
    metaTitle, metaDescription, html, sections, citations,
    imageUrl, imageProvider, seoScore, createdAt, socialPosts
  } = normalized

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner" />
      </div>
    )
  }

  if (!article) return null

  // For your existing social card grid
  const socialPlatforms = [
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: 'bg-blue-600' },
    { id: 'twitter',  name: 'Twitter',  icon: '🐦', color: 'bg-sky-500' },
    { id: 'facebook', name: 'Facebook', icon: '👥', color: 'bg-blue-700' },
    { id: 'instagram',name: 'Instagram',icon: '📷', color: 'bg-pink-600' },
    { id: 'reddit',   name: 'Reddit',   icon: '🤖', color: 'bg-orange-600' },
    { id: 'tiktok',   name: 'TikTok',   icon: '🎵', color: 'bg-black' },
    { id: 'pinterest',name: 'Pinterest',icon: '📌', color: 'bg-red-600' },
    { id: 'youtube',  name: 'YouTube',  icon: '📺', color: 'bg-red-700' },
    { id: 'tumblr',   name: 'Tumblr',   icon: '📝', color: 'bg-indigo-600' },
  ]

  return (
    <div className="min-h-screen bg-gray-950 p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/articles')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Articles
          </button>

          <div className="flex items-center gap-2">
            <button className="p-2 glass-card hover:bg-white/10 rounded-lg transition-colors">
              <Edit className="w-5 h-5" />
            </button>
            <button className="p-2 glass-card hover:bg-white/10 rounded-lg transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 glass-card hover:bg-white/10 rounded-lg transition-colors">
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 glass-card hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
              <FileText className="w-4 h-4" />
              Words
            </div>
            <div className="text-2xl font-bold">{wordCount || 0}</div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
              <Clock className="w-4 h-4" />
              Read Time
            </div>
            <div className="text-2xl font-bold">{readingMinutes || 0}m</div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
              <TrendingUp className="w-4 h-4" />
              SEO Score
            </div>
            <div className="text-2xl font-bold text-green-400">
              {seoScore ?? 0}/100
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
              <ExternalLink className="w-4 h-4" />
              Citations
            </div>
            <div className="text-2xl font-bold">{citations?.length || 0}</div>
          </div>
        </div>

        {/* Hero Image */}
        {imageUrl && (
          <div className="mb-8">
            <div className="aspect-video rounded-xl overflow-hidden bg-gray-800">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
              <Sparkles className="w-4 h-4 text-accent-400" />
              <span>AI-generated image {imageProvider ? `• ${imageProvider}` : ''}</span>
            </div>
          </div>
        )}

        {/* Article Content */}
        <article className="glass-card p-8 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>

          {metaDescription && (
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              {metaDescription}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-400 pb-6 mb-6 border-b border-gray-800">
            <span>By SEOScribe</span>
            <span>•</span>
            <span>
              {new Date(createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
            <span>•</span>
            <span>{readingMinutes || 0} min read</span>
            {keyword && (
              <>
                <span>•</span>
                <span>Keyword: <span className="font-medium text-gray-300">{keyword}</span></span>
              </>
            )}
            {tone && (
              <>
                <span>•</span>
                <span>Tone: <span className="font-medium text-gray-300">{tone}</span></span>
              </>
            )}
          </div>

          {/* SEO Preview */}
          {(metaTitle || metaDescription) && (
            <div className="mb-6 rounded-xl border border-gray-800 p-4">
              <div className="text-[#1a0dab] text-xl leading-6">
                {metaTitle || title}
              </div>
              <div className="text-[#006621] text-sm">seoscribe.pro/example</div>
              <div className="text-[#545454] text-sm">
                {metaDescription || ''}
              </div>
            </div>
          )}

          {/* Body: prefer HTML; fallback to sections/paragraphs */}
          {html ? (
            <div className="prose prose-invert prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <div className="prose prose-invert prose-lg max-w-none">
              {Array.isArray(sections) && sections.length > 0 ? (
                sections.map((section, i) => (
                  <div key={i} id={`section-${i}`} className="mb-8">
                    {section.heading && <h2 className="text-3xl font-bold mb-4">{section.heading}</h2>}
                    {/* Support paragraphs (string[]) or html */}
                    {Array.isArray(section.paragraphs) ? (
                      section.paragraphs.map((para, j) => (
                        <p key={j} className="text-gray-300 leading-relaxed mb-4">
                          {para}
                        </p>
                      ))
                    ) : section.html ? (
                      <div dangerouslySetInnerHTML={{ __html: section.html }} />
                    ) : section.text ? (
                      <p className="text-gray-300 leading-relaxed mb-4">{section.text}</p>
                    ) : null}
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-gray-800 p-4 text-gray-400">
                  This article doesn’t have visible content yet.
                </div>
              )}
            </div>
          )}

          {/* FAQs */}
          {Array.isArray(article?.data?.faqs) && article.data.faqs.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-800">
              <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {article.data.faqs.map((faq, i) => (
                  <div key={i} className="p-6 bg-gray-800/50 rounded-lg">
                    <h3 className="text-xl font-bold mb-3">{faq.q}</h3>
                    <p className="text-gray-300 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Citations */}
          {Array.isArray(citations) && citations.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-800">
              <h2 className="text-2xl font-bold mb-6">📚 Citations</h2>
              <ol className="space-y-3">
                {citations.map((citation, i) => (
                  <li key={i} className="text-gray-300">
                    {citation.url ? (
                      <a
                        href={citation.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-400 hover:text-primary-300 transition-colors"
                      >
                        [{i + 1}] {citation.title || citation.url}
                        <ExternalLink className="inline w-4 h-4 ml-1" />
                      </a>
                    ) : (
                      <span>[{i + 1}] {citation.title || 'Source'}</span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </article>

        {/* Social Media Drafts */}
        <div className="glass-card p-8">
          <h2 className="text-3xl font-bold mb-6">📱 Social Media Posts</h2>
          <p className="text-gray-400 mb-8">
            Ready-to-post content for all major platforms. Click to copy.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {socialPlatforms.map((platform) => {
              const post = socialPosts?.[platform.id]
              if (!post) return null

              return (
                <motion.div
                  key={platform.id}
                  whileHover={{ scale: 1.02 }}
                  className="glass-card p-4 cursor-pointer"
                  onClick={() => handleCopy(post, platform.name)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-10 h-10 ${platform.color} rounded-lg flex items-center justify-center text-2xl`}>
                        {platform.icon}
                      </div>
                      <span className="font-bold">{platform.name}</span>
                    </div>
                    {copiedPlatform === platform.name ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <p className="text-sm text-gray-300 line-clamp-3">
                    {post}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
