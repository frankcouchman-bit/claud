import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, TrendingUp, Clock, FileText, ExternalLink, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function ModalArticlePreview({ article, onClose }) {
  const navigate = useNavigate()

  if (!article) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative glass-card p-8 max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Article Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
                {article.seo_score?.overall || 0}/100
              </div>
            </div>
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                <ExternalLink className="w-4 h-4" />
                Citations
              </div>
              <div className="text-2xl font-bold">{article.citations?.length || 0}</div>
            </div>
          </div>

          {/* Hero Image (if generated) */}
          {(article.image?.image_url || article.image?.image_b64) && (
            <div className="mb-8">
              <div className="aspect-video rounded-xl overflow-hidden bg-gray-800">
                <img
                  src={article.image.image_url || `data:image/png;base64,${article.image.image_b64}`}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                AI-generated hero image • Created with {article.image.provider || 'AI'}
              </p>
            </div>
          )}

          {/* Article Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {article.title}
          </h1>

          {/* Meta Description */}
          {article.meta?.description && (
            <p className="text-lg text-gray-400 mb-6 leading-relaxed">
              {article.meta.description}
            </p>
          )}

          {/* Article Preview (First 2 sections) */}
          <div className="prose prose-invert max-w-none mb-8">
            {article.sections?.slice(0, 2).map((section, i) => (
              <div key={i} className="mb-6">
                <h2 className="text-2xl font-bold mb-3">{section.heading}</h2>
                {section.paragraphs?.slice(0, 2).map((para, j) => (
                  <p key={j} className="text-gray-300 leading-relaxed mb-4">
                    {para}
                  </p>
                ))}
              </div>
            ))}
          </div>

          {/* Blur overlay to indicate more content */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-950 z-10"></div>
            <div className="blur-sm opacity-50">
              <h2 className="text-2xl font-bold mb-3">More content below...</h2>
              <p className="text-gray-400">
                {article.sections?.length || 0} sections • {article.faqs?.length || 0} FAQs • 
                Full SEO optimization • Social media posts
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 p-6 glass-card bg-gradient-primary/10 border-primary-500/30 text-center">
            <h3 className="text-xl font-bold mb-2">Want to save and edit this article?</h3>
            <p className="text-gray-400 mb-4">
              Sign up for free to save this article, generate more content, and access all SEO tools
            </p>
            <button
              onClick={() => navigate('/signup')}
              className="btn-primary group"
            >
              Sign Up Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-sm text-gray-500 mt-3">
              No credit card required • 1 article per month free
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
