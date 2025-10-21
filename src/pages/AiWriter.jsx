import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, Zap, Globe, Users, ArrowRight, CheckCircle } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Testimonials from '../components/sections/Testimonials'
import CallToAction from '../components/sections/CallToAction'
import { updatePageSEO, addStructuredData } from '../lib/seo'

export default function AiWriter() {
  const navigate = useNavigate()

  useEffect(() => {
    updatePageSEO({
      title: 'AI Writer - Professional Content Generation Tool | SEOScribe',
      description: 'Advanced AI writer for blog posts, articles, and marketing copy. Generate professional content with tone customization, multi-format support, and built-in SEO optimization.',
      canonical: 'https://seoscribe.pro/ai-writer',
      keywords: ['AI writer', 'AI content generator', 'blog writing tool', 'marketing copy AI', 'content creation tool']
    })

    addStructuredData({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "AI Writer - SEOScribe",
      "description": "Professional AI writer for content creation",
      "url": "https://seoscribe.pro/ai-writer"
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero"></div>
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
                <Zap className="w-4 h-4 text-accent-400" />
                <span className="text-sm font-medium">AI-Powered Content Creation</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                AI Writer for
                <br />
                <span className="text-gradient">Professional Content</span>
              </h1>

              <p className="text-xl text-gray-300 mb-8">
                Generate blog posts, articles, and marketing copy with our advanced AI writer. Customize tone, format, and style to match your brand voice perfectly.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => navigate('/signup')}
                  className="btn-primary group"
                >
                  Start Writing with AI
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="btn-ghost"
                >
                  See Examples
                </button>
              </div>

              <div className="flex items-center gap-8 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>No credit card</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>1 free demo</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="glass-card p-8 animate-float">
                <div className="space-y-4">
                  <div className="h-4 bg-gradient-primary rounded w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                  <div className="h-32 bg-gray-800 rounded-lg"></div>
                  <div className="flex gap-2">
                    <div className="h-10 bg-primary-600 rounded flex-1"></div>
                    <div className="h-10 bg-gray-700 rounded flex-1"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose Our <span className="text-gradient">AI Writer</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Advanced AI writing capabilities designed for content creators, marketers, and businesses
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: FileText,
                title: 'Multi-Format Support',
                description: 'Create blog posts, articles, social media content, email campaigns, and product descriptions with one AI writer.'
              },
              {
                icon: Zap,
                title: 'Tone Customization',
                description: 'Professional, casual, persuasive, or educational - our AI writer adapts to your brand voice perfectly.'
              },
              {
                icon: Globe,
                title: 'Real-Time Collaboration',
                description: 'Work with your team in real-time. Share, comment, and edit AI-generated content collaboratively.'
              },
              {
                icon: Users,
                title: 'Export Options',
                description: 'Download as PDF, Word, HTML, or Markdown. Integrate with your existing content workflow seamlessly.'
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="section-padding bg-gray-900/50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Perfect for Every <span className="text-gradient">Writing Need</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Blog Writing', description: 'Long-form articles and blog posts optimized for engagement and SEO' },
              { title: 'Social Posts', description: 'Engaging captions and posts for LinkedIn, Twitter, Facebook, and Instagram' },
              { title: 'Email Campaigns', description: 'Compelling email copy that drives opens, clicks, and conversions' },
              { title: 'Product Descriptions', description: 'Persuasive product copy that highlights features and benefits' }
            ].map((useCase, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <div className="text-4xl mb-4">
                  {i === 0 && '📝'}
                  {i === 1 && '📱'}
                  {i === 2 && '✉️'}
                  {i === 3 && '🛍️'}
                </div>
                <h3 className="text-xl font-bold mb-2">{useCase.title}</h3>
                <p className="text-gray-400">{useCase.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* CTA */}
      <CallToAction />

      <Footer />
    </div>
  )
}
