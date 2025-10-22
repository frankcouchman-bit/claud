import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Share2, Download, Edit, Trash2, 
  Copy, Check, ExternalLink, Sparkles,
  TrendingUp, Clock, FileText
} from 'lucide-react'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

export default function ArticleView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copiedPlatform, setCopiedPlatform] = useState(null)

  useEffect(() => {
    loadArticle()
  }, [id])

  async function loadArticle() {
    try {
      const data = await api.getArticle(id)
      setArticle(data)
    } catch (error) {
      toast.error('Failed to load article')
      navigate('/articles')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy(text, platform) {
    await navigator.clipboard.writeText(text)
    setCopiedPlatform(platform)
    toast.success(`${platform} post copied!`)
    setTimeout(() => setCopiedPlatform(null), 2000)
  }

  async function handleDelete() {
    if (!confirm('Delete this article?')) return
    
    try {
      await api.deleteArticle(id)
      toast.success('Article deleted')
      navigate('/articles')
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!article) return null

  const articleData = article.data || {}
  const socialPosts = articleData.social_media_posts || {}

  const socialPlatforms = [
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: 'bg-blue-600' },
    { id: 'twitter', name: 'Twitter', icon: '🐦', color: 'bg-sky-500' },
    { id: 'facebook', name: 'Facebook', icon: '👥', color: 'bg-blue-700' },
    { id: 'instagram', name: 'Instagram', icon: '📷', color: 'bg-pink-600' },
    { id: 'reddit', name: 'Reddit', icon: '🤖', color: 'bg-orange-600' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', color: 'bg-black' },
    { id: 'pinterest', name: 'Pinterest', icon: '📌', color: 'bg-red-600' },
    { id: 'youtube', name: 'YouTube', icon: '📺', color: 'bg-red-700' },
    { id: 'tumblr', name: 'Tumblr', icon: '📝', color: 'bg-indigo-600' },
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
            <div className="text-2xl font-bold">{article.word_count || 0}</div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
              <Clock className="w-4 h-4" />
              Read Time
            </div>
            <div className="text-2xl font-bold">{article.reading_time_minutes || 0}m</div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
              <TrendingUp className="w-4 h-4" />
              SEO Score
            </div>
            <div className="text-2xl font-bold text-green-400">
              {article.seo_score || 0}/100
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
              <ExternalLink className="w-4 h-4" />
              Citations
            </div>
            <div className="text-2xl font-bold">{articleData.citations?.length || 0}</div>
          </div>
        </div>

        {/* Hero Image */}
        {articleData.image?.image_url && (
          <div className="mb-8">
            <div className="aspect-video rounded-xl overflow-hidden bg-gray-800">
              <img
                src={articleData.image.image_url}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
              <Sparkles className="w-4 h-4 text-accent-400" />
              <span>AI-generated image • {articleData.image.provider || 'AI'}</span>
            </div>
          </div>
        )}

        {/* Article Content */}
        <article className="glass-card p-8 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{article.title}</h1>
          
          {articleData.meta?.description && (
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              {articleData.meta.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-400 pb-6 mb-6 border-b border-gray-800">
            <span>By SEOScribe</span>
            <span>•</span>
            <span>{new Date(article.created_at).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}</span>
            <span>•</span>
            <span>{article.reading_time_minutes || 0} min read</span>
          </div>

          {/* Table of Contents */}
          {articleData.sections?.length > 0 && (
            <div className="mb-8 p-6 bg-gray-800/50 rounded-lg">
              <h2 className="text-lg font-bold mb-4">Table of Contents</h2>
              <ol className="space-y-2">
                {articleData.sections.map((section, i) => (
                  <li key={i} className="text-gray-300 hover:text-primary-400 transition-colors">
                    <a href={`#section-${i}`}>
                      {i + 1}. {section.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Article Sections */}
          <div className="prose prose-invert prose-lg max-w-none">
            {articleData.sections?.map((section, i) => (
              <div key={i} id={`section-${i}`} className="mb-8">
                <h2 className="text-3xl font-bold mb-4">{section.heading}</h2>
                {section.paragraphs?.map((para, j) => (
                  <p key={j} className="text-gray-300 leading-relaxed mb-4">
                    {para}
                  </p>
                ))}
              </div>
            ))}
          </div>

          {/* FAQs */}
          {articleData.faqs?.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-800">
              <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {articleData.faqs.map((faq, i) => (
                  <div key={i} className="p-6 bg-gray-800/50 rounded-lg">
                    <h3 className="text-xl font-bold mb-3">{faq.q}</h3>
                    <p className="text-gray-300 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Citations */}
          {articleData.citations?.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-800">
              <h2 className="text-2xl font-bold mb-6">📚 Citations</h2>
              <ol className="space-y-3">
                {articleData.citations.map((citation, i) => (
                  <li key={i} className="text-gray-300">
                    <a 
                      href={citation.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      [{i + 1}] {citation.title || citation.url}
                      <ExternalLink className="inline w-4 h-4 ml-1" />
                    </a>
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
              const post = socialPosts[platform.id]
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
