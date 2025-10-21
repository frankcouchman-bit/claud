import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Filter } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'
import OutputList from '@/components/dashboard/OutputList'
import toast from 'react-hot-toast'

export default function Articles() {
  const navigate = useNavigate()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    loadArticles()
  }, [])

  async function loadArticles() {
    try {
      const data = await api.getArticles()
      setArticles(data)
    } catch (error) {
      toast.error('Failed to load articles')
    } finally {
      setLoading(false)
    }
  }

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || article.status === filterStatus
    return matchesSearch && matchesFilter
  })

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
        <button
          onClick={() => navigate('/tools?action=generate')}
          className="btn-primary"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Article
        </button>
      </div>

      {/* Search and Filters */}
      <div className="glass-card p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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

      {/* Articles List */}
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
