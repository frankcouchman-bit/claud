import { useEffect, useMemo, useRef, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '@/lib/api'
import OutputList from '@/components/dashboard/OutputList'
import toast from 'react-hot-toast'
import { lc_listArticles } from '@/lib/localCache'
import QuotaBadge from '@/components/ui/QuotaBadge'
import { useAuth } from '@/lib/auth'

export default function Articles() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isPro } = useAuth()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const autoOpened = useRef(false)

  useEffect(() => {
    loadArticles()
  }, [])

  async function loadArticles() {
    setLoading(true)
    try {
      const server = await api.getArticles().catch(() => [])
      const local = lc_listArticles()

      // merge by id, prefer server fields, keep local for anything missing
      const map = new Map()
      ;[...local, ...server].forEach(a => {
        if (!a || !a.id) return
        const prev = map.get(a.id) || {}
        map.set(a.id, { ...a, ...prev }) // server last will override local if same id
      })
      const merged = Array.from(map.values())
        .sort((a,b) => new Date(b?.created_at || b?.createdAt || 0) - new Date(a?.created_at || a?.createdAt || 0))
      setArticles(merged)
    } catch {
      toast.error('Failed to load articles')
    } finally {
      setLoading(false)
    }
  }

  function getId(a) { return a?.id || a?.article_id || a?.uuid || a?.data?.id || null }

  const newest = useMemo(() => {
    if (!articles.length) return null
    return articles[0]
  }, [articles])

  useEffect(() => {
    if (autoOpened.current) return
    if (loading) return
    if (!articles.length) return
    const openNewestParam = (searchParams.get('open') || '').toLowerCase() === 'newest'
    const noFilters = !searchTerm && filterStatus === 'all'
    if (openNewestParam || noFilters) {
      const id = getId(newest)
      if (id) {
        autoOpened.current = true
        navigate(`/articles/${id}`, { replace: true })
      }
    }
  }, [loading, articles, searchParams, searchTerm, filterStatus, newest, navigate])

  const filteredArticles = useMemo(() => {
    const q = (searchTerm || '').toLowerCase()
    return (articles || []).filter(article => {
      const title = (article?.title || article?.data?.title || article?.topic || '').toLowerCase()
      const status = (article?.status || 'draft').toLowerCase()
      const matchesSearch = !q || title.includes(q)
      const matchesFilter = filterStatus === 'all' || status === filterStatus
      return matchesSearch && matchesFilter
    })
  }, [articles, searchTerm, filterStatus])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Articles</h1>
          <p className="text-gray-400">Manage your generated content</p>
        </div>
        <div className="flex items-center gap-3">
          <QuotaBadge isPro={!!isPro} />
          <button
            onClick={() => navigate('/tools?action=generate')}
            className="btn-primary"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Article
          </button>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="glass-card p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      {/* List */}
      {filteredArticles.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-gray-400">
            {searchTerm || filterStatus !== 'all' 
              ? 'No articles match your filters'
              : 'No articles yet. Create your first one!'}
          </p>
        </div>
      ) : (
        <OutputList articles={filteredArticles} onRefresh={loadArticles} />
      )}
    </div>
  )
}
