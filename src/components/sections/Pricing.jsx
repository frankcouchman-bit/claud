import { motion } from 'framer-motion'
import { Check, Crown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'

export default function Pricing() {
  const navigate = useNavigate()
  const { isAuthenticated, upgradeToPro } = useAuth()

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for trying out our AI article writer',
      features: [
        '1 article per month',
        '3000+ word articles',
        'Built-in research & citations',
        'All SEO tools (1/day each)',
        'Basic support',
      ],
      cta: 'Start Free',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$24',
      period: 'per month',
      description: 'For professional content creators and teams',
      features: [
        '15 articles per day',
        'Unlimited word count',
        'Advanced research & citations',
        'All SEO tools (10/day each)',
        'Priority support',
        'Team collaboration',
        'Export options',
        'API access',
      ],
      cta: 'Upgrade to Pro',
      popular: true,
    },
  ]

  function handleCTA(plan) {
    if (plan.name === 'Free') {
      navigate('/signup')
    } else {
      if (isAuthenticated) {
        upgradeToPro()
      } else {
        navigate('/signup')
      }
    }
  }

  return (
    <section id="pricing" className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, <span className="text-gradient">Transparent Pricing</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Start free, upgrade when you need more. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className={`glass-card p-8 relative ${plan.popular ? 'border-2 border-primary-500' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-primary text-sm font-medium">
                    <Crown className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-gray-400">/{plan.period}</span>
                </div>
                <p className="text-sm text-gray-400">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCTA(plan)}
                className={plan.popular ? 'btn-primary w-full' : 'btn-ghost w-full'}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">
            Need more? Enterprise plans available for large teams.
          </p>
          <a
            href="mailto:enterprise@seoscribe.pro"
            className="text-primary-400 hover:text-primary-300 font-medium"
          >
            Contact Sales →
          </a>
        </div>
      </div>
    </section>
  )
}
