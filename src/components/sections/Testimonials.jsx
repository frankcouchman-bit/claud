import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Mitchell',
      role: 'Content Marketing Manager',
      company: 'TechFlow Inc.',
      content: 'SEOScribe transformed our content workflow. We create comprehensive articles in minutes instead of hours. The built-in research and SEO optimization are game-changers.',
      avatar: 'SM',
      rating: 5
    },
    {
      name: 'David Chen',
      role: 'Freelance Writer',
      company: 'Independent',
      content: 'As a freelancer, this AI writer saves me 10+ hours per week. The article quality is exceptional and clients love the SEO scores. Definitely worth upgrading to Pro.',
      avatar: 'DC',
      rating: 5
    },
    {
      name: 'Emma Rodriguez',
      role: 'SEO Specialist',
      company: 'Digital Growth Agency',
      content: 'The writing tool is incredible. Research, citations, and SEO tools all in one place. Our agency now produces 3x more content without sacrificing quality.',
      avatar: 'ER',
      rating: 5
    },
    {
      name: 'Michael Thompson',
      role: 'Blog Owner',
      company: 'Lifestyle Blog',
      content: 'I was skeptical about AI content generators, but SEOScribe proved me wrong. The articles read naturally and rank well. The free plan alone is worth it.',
      avatar: 'MT',
      rating: 5
    },
    {
      name: 'Lisa Park',
      role: 'Marketing Director',
      company: 'E-commerce Startup',
      content: 'This article writer is a must-have for any content team. We cut our writing time by 70% while improving SEO performance across our blog.',
      avatar: 'LP',
      rating: 5
    }
  ]

  return (
    <section className="section-padding bg-gray-900/50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Trusted by <span className="text-gradient">Content Creators</span>
          </h2>
          <p className="text-xl text-gray-400">
            See what our users say about SEOScribe
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 6).map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-300 mb-4 leading-relaxed">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-bold">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">
                    {testimonial.role} • {testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
