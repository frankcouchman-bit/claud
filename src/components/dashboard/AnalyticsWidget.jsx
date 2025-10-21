import { motion } from 'framer-motion'
import { TrendingUp, FileText, Clock } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function AnalyticsWidget({ articles }) {
  // Generate mock weekly data
  const weekData = Array.from({ length: 7 }, (_, i) => ({
    day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
    articles: Math.floor(Math.random() * 5),
  }))

  const avgSeoScore = articles.length > 0
    ? Math.round(articles.reduce((sum, a) => sum + (a.seo_score || 0), 0) / articles.length)
    : 0

  const totalWords = articles.reduce((sum, a) => sum + (a.word_count || 0), 0)

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Analytics</h2>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5 text-primary-400" />
            <span className="text-sm text-gray-400">This Week</span>
          </div>
          <div className="text-3xl font-bold">{articles.length}</div>
          <div className="text-sm text-green-400 mt-1">+{Math.floor(Math.random() * 20)}% vs last week</div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-sm text-gray-400">Avg SEO Score</span>
          </div>
          <div className="text-3xl font-bold">{avgSeoScore}/100</div>
          <div className="text-sm text-gray-400 mt-1">
            {avgSeoScore >= 80 ? 'Excellent' : avgSeoScore >= 60 ? 'Good' : 'Needs improvement'}
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-gray-400">Total Words</span>
          </div>
          <div className="text-3xl font-bold">{(totalWords / 1000).toFixed(1)}k</div>
          <div className="text-sm text-gray-400 mt-1">{articles.length} articles</div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="font-bold mb-4">Article Generation Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={weekData}>
            <XAxis dataKey="day" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
              }}
            />
            <Line
              type="monotone"
              dataKey="articles"
              stroke="#7a5af8"
              strokeWidth={2}
              dot={{ fill: '#7a5af8', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
