import { motion } from 'framer-motion'
import { Lock, FileText, Type, Eye, Shield, Target, Search, FileEdit, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import toast from 'react-hot-toast'

export default function ToolsGrid({ user }) {
  const navigate = useNavigate()
  const { isPro } = useAuth()

  const tools = [
    {
      id: 'readability',
      name: 'Readability Analyzer',
      description: 'Check content readability and grade level',
      icon: FileText,
      locked: false,
    },
    {
      id: 'headline',
      name: 'Headline Analyzer',
      description: 'Score and optimize your headlines',
      icon: Type,
      locked: false,
    },
    {
      id: 'serp',
      name: 'SERP Preview',
      description: 'Preview how content appears in search',
      icon: Eye,
      locked: false,
    },
    {
      id: 'plagiarism',
      name: 'Plagiarism Checker',
      description: 'Check content originality',
      icon: Shield,
      locked: !isPro,
    },
    {
      id: 'competitors',
      name: 'Competitor Analysis',
      description: 'Analyze top-ranking competitors',
      icon: Target,
      locked: !isPro,
    },
    {
      id: 'keywords',
      name: 'Keyword Extractor',
      description: 'Extract and cluster keywords',
      icon: Search,
      locked: !isPro,
    },
    {
      id: 'brief',
      name: 'Content Brief',
      description: 'Generate detailed content briefs',
      icon: FileEdit,
      locked: !isPro,
    },
    {
      id: 'expand',
      name: 'Article Expansion',
      description: 'Expand existing content',
      icon: Zap,
      locked: !isPro,
    },
  ]

  function handleToolClick(tool) {
    if (tool.locked) {
      toast.error('Upgrade to Pro to unlock this tool')
      return
    }

    // Check usage
    const toolUsage = user?.tool_usage_today || 0
    const limit = isPro ? 10 : 1

    if (toolUsage >= limit) {
      toast.error(`Daily tool limit reached (${limit}/day)`)
      return
    }

    // ⬇️ Patch: actually go to the tool instead of "coming soon"
    // If you have a single workspace page, you can swap this to:
    // navigate(`/writing-tool?tool=${tool.id}`)
    navigate(`/tools/${tool.id}`)
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      {tools.map((tool, i) => (
        <motion.button
          key={tool.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          onClick={() => handleToolClick(tool)}
          disabled={tool.locked}
          className={`glass-card p-6 text-left transition-all ${
            tool.locked
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-white/10 cursor-pointer'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <tool.icon className="w-5 h-5" />
            </div>
            {tool.locked && (
              <Lock className="w-5 h-5 text-gray-500" />
            )}
          </div>
          <h3 className="font-bold mb-2">{tool.name}</h3>
          <p className="text-sm text-gray-400">{tool.description}</p>
        </motion.button>
      ))}
    </div>
  )
}
