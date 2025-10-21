import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Zap, Target, TrendingUp, ArrowRight, Sparkles } from 'lucide-react'

import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Hero from '../components/sections/Hero' // (kept in case you use it elsewhere)
import Features from '../components/sections/Features'
import Testimonials from '../components/sections/Testimonials'
import Pricing from '../components/sections/Pricing'
import CallToAction from '../components/sections/CallToAction'

import { updatePageSEO, addStructuredData } from '../lib/seo'
import { useAuth } from '../lib/auth'

// NEW: replace old quota modal with dedicated demo + preview modals
import ModalDemo from '../components/modals/ModalDemo'
import ModalArticlePreview from '../components/modals/ModalArticlePreview'

export default function Home() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  // NEW: state for the new flow
  const [showDemoModal, setShowDemoModal] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [generatedArticle, setGeneratedArticle] = useState(null)

  useEffect(() => {
    updatePageSEO({
      title: 'SEOScribe - AI-Powered Article Writer & SEO Content Generator',
      description:
        "Generate SEO-optimized articles in minutes with SEOScribe's AI article writer. Create 3000+ word content with built-in research, citations, and SEO tools. Start free today.",
      canonical: 'https://seoscribe.pro/',
      keywords: [
        'article writer',
        'SEO article writer',
        'AI content generator',
        'SEO writing tool',
        'content creation',
      ],
    })

    addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'SEOScribe - AI Article Writer',
      description: 'Professional AI-powered article writer for SEO-optimized content',
      url: 'https://seoscribe.pro/',
      mainEntity: {
        '@type': 'SoftwareApplication',
        name: 'SEOScribe',
        applicationCategory: 'BusinessApplication',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
    })
  }, [])

  // NEW: Launch demo modal if logged out; go to dashboard if authed
  function handleTryDemo() {
    if (isAuthenticated) {
      navigate('/dashboard')
    } else {
      setShowDemoModal(true)
    }
  }

  // NEW: Receive generated article from ModalDemo and open preview
  function handleDemoSuccess(article) {
    setGeneratedArticle(article)
    setShowDemoModal(false)
    setShowPreviewModal(true)
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
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8"
            >
              <Sparkles className="w-4 h-4 text-accent-400" />
              <span className="text-sm font-medium">Generate 3000+ word articles in minutes</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Write <span className="text-gradient">SEO-Optimized</span>
              <br />
              Articles in Minutes
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Professional AI article writer with built-in research, citations, and SEO tools. Create content
              that ranks and converts.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button onClick={handleTryDemo} className="btn-primary text-lg group">
                Try Free Demo
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => navigate('/signup')} className="btn-ghost text-lg">
                View Pricing
              </button>
            </div>

            <p className="text-sm text-gray-400 mt-6">
              No credit card required • 1 free demo • Upgrade anytime
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

      {/* How It Works */}
      <section className="section-padding bg-gray-900/50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              From Idea to <span className="text-gradient">Published Article</span>
            </h2>
            <p className="text-xl text-gray-400">Three simple steps to professional content</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Enter Your Topic',
                description:
                  'Simply describe what you want to write about. Our AI article writer understands context and intent.',
                icon: '✍️',
              },
              {
                step: '02',
                title: 'AI Researches & Writes',
                description:
                  'Our SEO article writer researches top-ranking content, analyzes competitors, and generates optimized articles.',
                icon: '🔍',
              },
              {
                step: '03',
                title: 'Edit & Publish',
                description: 'Review, refine with built-in SEO tools, and publish content that ranks on Google.',
                icon: '🚀',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative"
              >
                <div className="glass-card p-8 h-full">
                  <div className="text-6xl mb-4">{item.icon}</div>
                  <div className="text-4xl font-bold text-primary-400 mb-3">{item.step}</div>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-primary-500" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
          onSignupPrompt={() => navigate('/signup')}
        />
      )}

      {/* Article Preview Modal */}
      {showPreviewModal && generatedArticle && (
        <ModalArticlePreview
          article={generatedArticle}
          onClose={() => setShowPreviewModal(false)}
        />
      )}
    </div>
  )
}
