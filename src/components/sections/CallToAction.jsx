import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function CallToAction() {
  const navigate = useNavigate()

  return (
    <section className="section-padding">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card p-12 md:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-primary opacity-10"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
              <Sparkles className="w-4 h-4 text-accent-400" />
              <span className="text-sm font-medium">Start Creating Today</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Ready to Transform Your
              <br />
              <span className="text-gradient">Content Creation?</span>
            </h2>

            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of content creators using SEOScribe to generate high-quality, SEO-optimized articles in minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/signup')}
                className="btn-primary text-lg group"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/#pricing')}
                className="btn-ghost text-lg"
              >
                View Pricing
              </button>
            </div>

            <p className="text-sm text-gray-400 mt-6">
              No credit card required • 1 free article • Upgrade anytime
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
