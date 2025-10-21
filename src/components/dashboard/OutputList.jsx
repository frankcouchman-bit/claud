import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Trash2, Download, Share2, Clock, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

export default function OutputList({ articles, onRefresh }) {
  const navigate = useNavigate()
  const [deleting, setDeleting] = useState(null)

  async function handleDelete(id) {
    if (!confirm('Delete this article?')) return
    
    setDeleting(id)
    try {
      await api.deleteArticle(id)
      toast.success('Article deleted')
      onRefresh()
    } catch (error) {
      toast.error('Failed to delete')
    } finally {
      setDeleting(null)
    }
  }

  if (articles.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">No articles yet</h3>
        <p className="text-gray-400 mb-6">
          Generate your first article to get started
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {articles.map((article, i) => (
        <motion.div
          key={article.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="glass-card p-6 hover:bg-white/10 transition-all cursor-pointer"
          onClick={() => navigate(`/articles/${article.id}`)}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold mb-2 truncate">
                {article.title}
              </h3>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(article.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  <span>{article.word_count} words</span>
                </div>
                {article.seo_score && (
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className={article.seo_score >= 80 ? 'text-green-400' : 'text-yellow-400'}>
                      SEO: {article.seo_score}/100
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toast.success('Share feature coming soon!')
                }}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                title="Share"
              >
                <Share2 className="w-5 h-5 text-gray-400" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toast.success('Export feature coming soon!')
                }}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                title="Download"
              >
                <Download className="w-5 h-5 text-gray-400" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(article.id)
                }}
                disabled={deleting === article.id}
                className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors disabled:opacity-50"
                title="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
