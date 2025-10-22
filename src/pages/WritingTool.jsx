import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Target, CheckCircle, BarChart, ArrowRight, Shield } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Testimonials from '../components/sections/Testimonials'
import CallToAction from '../components/sections/CallToAction'
import { updatePageSEO, addStructuredData } from '../lib/seo'

export default function WritingTool() {
  const navigate = useNavigate()

  useEffect(() => {
    updatePageSEO({
      title: 'Writing Tool - All-in-One Content Generator | SEOScribe',
      description: 'Complete writing tool with research assistant, SEO optimizer, and grammar checker. Generate professional content from idea to publication in minutes.',
      canonical: 'https://seoscribe.pro/writing-tool',
      keywords: ['writing tool', 'content generator', 'SEO writing software', 'content creation platform', 'article generator']
    })

    addStructuredData({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Writing Tool - SEOScribe",
      "description": "All-in-one writing tool for content creators",
      "url": "https://seoscribe.pro/writing-tool"
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      {/* Hero Section with Video */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero"></div>
        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
                <Shield className="w-4 h-4 text-accent-400" />
                <span className="text-sm font-medium text-gray-200">Enterprise-Grade Writing Tool</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                The Ultimate <span className="text-gradient">Writing Tool</span>
                <br />for Content Creators
              </h1>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                From idea to published article in minutes with our all-in-one writing tool. Research, write, optimize, and publish professional content faster than ever.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/signup')}
                  className="btn-primary text-lg group"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="btn-ghost text-lg"
                >
                  Watch Demo
                </button>
              </div>
            </motion.div>
          </div>

          {/* Fixed Interactive Demo Preview with Visible Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-5xl mx-auto"
          >
            <div className="glass-card p-4 rounded-2xl border border-white/10">
              <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
                {/* Browser Chrome */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800 bg-gray-900/50">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-sm text-gray-500 ml-4">SEOScribe Writing Tool</div>
                </div>

                {/* Content Area with Visible Elements */}
                <div className="p-8 space-y-6">
                  {/* Title Section */}
                  <div className="space-y-3">
                    <div className="h-8 bg-gradient-primary rounded-lg w-2/3"></div>
                    <div className="h-3 bg-gray-700 rounded w-full"></div>
                    <div className="h-3 bg-gray-700 rounded w-5/6"></div>
                  </div>

                  {/* Tool Cards with Labels */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'SEO Score', value: '92/100', color: 'text-green-400' },
                      { label: 'Readability', value: 'Excellent', color: 'text-blue-400' },
                      { label: 'Words', value: '3,247', color: 'text-purple-400' },
                    ].map((item, i) => (
                      <div key={i} className="p-4 bg-gray-800/80 rounded-lg border border-gray-700 text-center">
                        <div className={`text-2xl font-bold ${item.color} mb-1`}>{item.value}</div>
                        <div className="text-xs text-gray-400">{item.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Research Section with Content */}
                  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                        <Search className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">Researching topic...</div>
                        <div className="text-xs text-gray-400">Found 10 sources</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-700 rounded w-full"></div>
                      <div className="h-2 bg-gray-700 rounded w-4/5"></div>
                      <div className="h-2 bg-gray-700 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Spotlight - Research */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
                <Search className="w-4 h-4 text-accent-400" />
                <span className="text-sm font-medium text-gray-200">Research Assistant</span>
              </div>
              <h2 className="text-4xl font-bold mb-4">
                Built-in <span className="text-gradient">Research</span>
              </h2>
              <p className="text-xl text-gray-400 mb-6 leading-relaxed">
                Our writing tool automatically researches your topic, analyzes top-ranking content, and suggests data-backed insights to strengthen your articles.
              </p>
              <ul className="space-y-3">
                {[
                  'Analyze top 10 ranking pages',
                  'Extract key statistics and data',
                  'Identify content gaps',
                  'Suggest trending angles'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Fixed Research Card with Visible Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8 border border-white/10"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-800/80 rounded-lg border border-gray-700">
                  <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center flex-shrink-0">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">Researching topic...</div>
                    <div className="text-xs text-gray-400">Found 10 sources</div>
                  </div>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-700 rounded w-full"></div>
                    <div className="h-2 bg-gray-700 rounded w-5/6"></div>
                    <div className="h-2 bg-gray-700 rounded w-4/5"></div>
                    <div className="h-2 bg-gray-700 rounded w-full"></div>
                    <div className="h-2 bg-gray-700 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Feature Spotlight - SEO */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Fixed SEO Card with Visible Labels */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1 glass-card p-8 border border-white/10"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800/80 rounded-lg border border-gray-700">
                  <span className="text-sm text-gray-300 font-medium">SEO Score</span>
                  <span className="text-2xl font-bold text-green-400">92/100</span>
                </div>
                <div className="space-y-2 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Readability</span>
                    <span className="text-green-400 font-medium">Excellent</span>
                  </div>
                  <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-green-400 w-5/6 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-2 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Keyword Density</span>
                    <span className="text-blue-400 font-medium">Optimal</span>
                  </div>
                  <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 w-4/5 rounded-full"></div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
                <Target className="w-4 h-4 text-accent-400" />
                <span className="text-sm font-medium text-gray-200">SEO Optimizer</span>
              </div>
              <h2 className="text-4xl font-bold mb-4">
                Real-time <span className="text-gradient">SEO Analysis</span>
              </h2>
              <p className="text-xl text-gray-400 mb-6 leading-relaxed">
                Get instant SEO feedback as you write. Our content generator analyzes readability, keyword density, and provides actionable recommendations.
              </p>
              <ul className="space-y-3">
                {[
                  'Real-time SEO scoring',
                  'Keyword optimization suggestions',
                  'Readability analysis',
                  'Meta description generator'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="section-padding bg-gray-900/50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">SEOScribe</span> vs Others
            </h2>
            <p className="text-xl text-gray-400">See why our writing tool stands out</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="glass-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left p-4 text-white font-bold">Feature</th>
                    <th className="text-center p-4 text-white font-bold">SEOScribe</th>
                    <th className="text-center p-4 text-white font-bold">Others</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['3000+ Word Articles', true, false],
                    ['Built-in Research', true, false],
                    ['SEO Optimization', true, true],
                    ['Citation Support', true, false],
                    ['Content Expansion', true, false],
                    ['Export Options', true, true],
                  ].map(([feature, seoscribe, others], i) => (
                    <tr key={i} className="border-b border-gray-800/50">
                      <td className="p-4 text-gray-300">{feature}</td>
                      <td className="text-center p-4">
                        {seoscribe ? (
                          <CheckCircle className="w-6 h-6 text-green-400 mx-auto" />
                        ) : (
                          <span className="text-gray-600">—</span>
                        )}
                      </td>
                      <td className="text-center p-4">
                        {others ? (
                          <CheckCircle className="w-6 h-6 text-gray-600 mx-auto" />
                        ) : (
                          <span className="text-gray-600">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-gray-900/30">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center items-center gap-12">
            {[
              { label: 'SOC 2 Compliant', icon: '🔒' },
              { label: 'GDPR Ready', icon: '🇪🇺' },
              { label: '99.9% Uptime', icon: '⚡' },
              { label: 'Enterprise Support', icon: '💬' }
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-3xl">{badge.icon}</span>
                <span className="text-gray-400 font-medium">{badge.label}</span>
              </div>
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
