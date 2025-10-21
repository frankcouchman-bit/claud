import { motion } from 'framer-motion'
import { Zap, Search, Target, Globe, FileText, TrendingUp, Lock, Users } from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: FileText,
      title: '3000+ Word Articles',
      description: 'Generate comprehensive, long-form articles optimized for search engines and reader engagement.'
    },
    {
      icon: Search,
      title: 'Built-in Research',
      description: 'Automatically research top-ranking content, extract insights, and cite authoritative sources.'
    },
    {
      icon: Target,
      title: 'SEO Optimization',
      description: 'Real-time SEO scoring, keyword suggestions, and meta tag generation built into every article.'
    },
    {
      icon: Globe,
      title: 'Multi-Language Support',
      description: 'Create content in multiple languages with region-specific SEO optimization.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Generate publication-ready articles in under 2 minutes with our advanced AI engine.'
    },
    {
      icon: TrendingUp,
      title: 'Analytics & Insights',
      description: 'Track performance with built-in analytics. Monitor SEO scores, readability, and engagement.'
    },
    {
      icon: Lock,
      title: 'Enterprise Security',
      description: 'SOC 2 compliant with enterprise-grade encryption. Your content is always secure.'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together seamlessly. Share, comment, and edit articles with your entire team.'
    }
  ]

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to <span className="text-gradient">Create & Optimize</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Professional article writer with powerful SEO tools built for content teams
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-6 hover:bg-white/10 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
