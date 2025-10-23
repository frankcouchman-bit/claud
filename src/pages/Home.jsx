import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Zap, Target, TrendingUp, ArrowRight, Sparkles } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Features from '../components/sections/Features'
import Testimonials from '../components/sections/Testimonials'
import Pricing from '../components/sections/Pricing'
import CallToAction from '../components/sections/CallToAction'
import ModalDemo from '../components/modals/ModalDemo'
import ModalArticlePreview from '../components/modals/ModalArticlePreview'
import ModalQuotaReached from '../components/modals/ModalQuotaReached'
import { updatePageSEO, addStructuredData } from '../lib/seo'
import { useAuth } from '../lib/auth'

export default function Home() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [showDemoModal, setShowDemoModal] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [showQuotaModal, setShowQuotaModal] = useState(false)
  const [generatedArticle, setGeneratedArticle] = useState(null)
  const [demoUsed, setDemoUsed] = useState(false)

  useEffect(() => {
    updatePageSEO({
      title: 'SEOScribe - AI-Powered Article Writer & SEO Content Generator',
      description: 'Generate SEO-optimized articles in minutes with SEOScribe\'s AI article writer. Create 3000+ word content with built-in research, citations, and SEO tools. Start free today.',
      canonical: 'https://seoscribe.pro/',
      keywords: ['article writer', 'SEO article writer', 'AI content generator', 'SEO writing tool', 'content creation']
    })

    // ✅ Check if demo was already used (localStorage + timestamp)
    checkDemoStatus()
  }, [])

  function checkDemoStatus() {
    const demoTimestamp = localStorage.getItem('seoscribe_demo_used')
    
    if (demoTimestamp) {
      const usedDate = new Date(parseInt(demoTimestamp))
      const now = new Date()
      
      // Check if it's been less than 30 days
      const daysSinceDemo = (now - usedDate) / (1000 * 60 * 60 * 24)
      
      if (daysSinceDemo < 30) {
        console.log('⚠️ Demo already used', Math.floor(daysSinceDemo), 'days ago')
        setDemoUsed(true)
      } else {
        // More than 30 days, allow new demo
        console.log('✅ Demo expired, allowing new one')
        localStorage.removeItem('seoscribe_demo_used')
        setDemoUsed(false)
      }
    }
  }

  function handleTryDemo() {
    if (isAuthenticated) {
      navigate('/dashboard')
      return
    }

    // ✅ Check if demo already used
    if (demoUsed) {
      setShowQuotaModal(true)
      return
    }

    setShowDemoModal(true)
  }

  function handleDemoSuccess(article) {
    // ✅ Mark demo as used with timestamp
    localStorage.setItem('seoscribe_demo_used', Date.now().toString())
    setDemoUsed(true)
    
    setGeneratedArticle(article)
    setShowDemoModal(false)
    setShowPreviewModal(true)
  }

  function handleDemoError(error) {
    // ✅ If backend says demo limit reached, mark as used locally too
    if (error.message && error.message.includes('Demo limit')) {
      localStorage.setItem('seoscribe_demo_used', Date.now().toString())
      setDemoUsed(true)
      setShowQuotaModal(true)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8"
            >
              <Sparkles className="w-4 h-4 text-accent-400" />
              <span className="text-sm font-medium text-gray-200">Generate 3000+ word articles in minutes</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Write <span className="text-gradient">SEO-Optimized</span>
              <br />Articles in Minutes
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Professional AI article writer with built-in research, citations, and SEO tools. Create content that ranks and converts.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleTryDemo}
                disabled={demoUsed && !isAuthenticated}
                className="btn-primary text-lg group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {demoUsed && !isAuthenticated ? (
                  <>
                    Demo Used - Sign Up Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                ) : (
                  <>
                    Try Free Demo
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="btn-ghost text-lg"
              >
                View Pricing
              </button>
            </div>

            <p className="text-sm text-gray-400 mt-6">
              {demoUsed && !isAuthenticated ? (
                'Demo limit reached • Sign up for 1 free article per month'
              ) : (
                'No credit card required • 1 free demo • Upgrade anytime'
              )}
            </p>
          </motion.div>

          {/* Floating Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto"
          >
            {[
              { label: 'Word Articles', value: '3000+', icon: TrendingUp },
              { label: 'SEO Score', value: '95/100', icon: Target },
              { label: 'Generation Time', value: '2 min', icon: Zap },
              { label: 'Research Sources', value: '10+', icon: CheckCircle },
            ].map((stat, i) => (
              <div key={i} className="glass-card p-6 text-center">
                <stat.icon className="w-8 h-8 text-accent-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gradient mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <Features />

      {/* Testimonials */}
      <Testimonials />

      {/* Pricing */}
      <Pricing />

      {/* CTA Section */}
      <CallToAction />

      <Footer />

      {/* Demo Modal */}
      {showDemoModal && (
        <ModalDemo
          onClose={() => setShowDemoModal(false)}
          onSuccess={handleDemoSuccess}
          onError={handleDemoError}
          onSignupPrompt={() => {
            setShowDemoModal(false)
            navigate('/signup')
          }}
        />
      )}

      {/* Article Preview Modal */}
      {showPreviewModal && generatedArticle && (
        <ModalArticlePreview
          article={generatedArticle}
          onClose={() => {
            setShowPreviewModal(false)
            // Show signup prompt after viewing
            setTimeout(() => navigate('/signup'), 1000)
          }}
        />
      )}

      {/* Quota Reached Modal */}
      {showQuotaModal && (
        <ModalQuotaReached
          title="Demo Limit Reached"
          message="You've used your free demo. Sign up to generate 1 article per month free, or upgrade to Pro for 15 articles per day!"
          onClose={() => setShowQuotaModal(false)}
          onUpgrade={() => navigate('/signup')}
        />
      )}
    </div>
  )
}
