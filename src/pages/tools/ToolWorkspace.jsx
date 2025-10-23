// src/pages/tools/ToolWorkspace.jsx
import { useParams } from 'react-router-dom'

const TITLES = {
  readability: 'Readability Analyzer',
  headline: 'Headline Analyzer',
  serp: 'SERP Preview',
  plagiarism: 'Plagiarism Checker',
  competitors: 'Competitor Analysis',
  keywords: 'Keyword Extractor',
  brief: 'Content Brief',
  expand: 'Article Expansion',
}

export default function ToolWorkspace() {
  const { id } = useParams()
  const name = TITLES[id] || 'Tool'

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-2">{name}</h1>
      <p className="text-gray-400">Tool ID: <span className="font-mono">{id}</span></p>

      {/* TODO: mount the actual tool component by id */}
      <div className="mt-6 rounded-xl border border-gray-800 p-4">
        Workspace for <b>{id}</b> goes here.
      </div>
    </div>
  )
}
