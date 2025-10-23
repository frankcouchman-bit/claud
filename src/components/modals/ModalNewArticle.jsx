import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export default function ModalNewArticle({ open, onClose, onConfirm, busy }) {
  const [keyword, setKeyword] = useState('')
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState('professional')
  const [targetWords, setTargetWords] = useState(2500)
  const [region, setRegion] = useState('us')
  const [research, setResearch] = useState(true)
  const [generateSocial, setGenerateSocial] = useState(true)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  function submit() {
    const payload = {
      keyword: keyword.trim(),
      topic: (topic || keyword).trim(),
      tone,
      target_word_count: Number(targetWords) || 2500,
      region,
      research,
      generate_social: generateSocial,
    }
    onConfirm?.(payload)
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => !busy && onClose?.()}
          />
          <motion.div
            className="relative glass-card w-full max-w-2xl p-6"
            initial={{ opacity: 0, scale: 0.98, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 12 }}
            role="dialog" aria-modal="true" aria-labelledby="new-article-title"
          >
            <button
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
              onClick={() => !busy && onClose?.()} aria-label="Close" disabled={busy}
            >
              <X className="w-5 h-5" />
            </button>

            <h2 id="new-article-title" className="text-xl font-semibold mb-4">New Article</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Primary keyword *</label>
                <input
                  ref={inputRef}
                  className="mt-1 w-full rounded-xl border border-gray-700 bg-gray-800 p-3 outline-none focus:border-primary-500"
                  placeholder="e.g. programmatic SEO for SaaS"
                  value={keyword} onChange={(e) => setKeyword(e.target.value)} disabled={busy}
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium">Topic (optional)</label>
                <input
                  className="mt-1 w-full rounded-xl border border-gray-700 bg-gray-800 p-3 outline-none focus:border-primary-500"
                  placeholder="Use different angle or keep empty to reuse the keyword"
                  value={topic} onChange={(e) => setTopic(e.target.value)} disabled={busy}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Tone</label>
                <select
                  className="mt-1 w-full rounded-xl border border-gray-700 bg-gray-800 p-3 outline-none"
                  value={tone} onChange={(e) => setTone(e.target.value)} disabled={busy}
                >
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly</option>
                  <option value="authoritative">Authoritative</option>
                  <option value="conversational">Conversational</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Target words</label>
                <input
                  type="number" min={800} max={6000} step={100}
                  className="mt-1 w-full rounded-xl border border-gray-700 bg-gray-800 p-3 outline-none"
                  value={targetWords}
                  onChange={(e) => setTargetWords(e.target.value)}
                  disabled={busy}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Region</label>
                <select
                  className="mt-1 w-full rounded-xl border border-gray-700 bg-gray-800 p-3 outline-none"
                  value={region} onChange={(e) => setRegion(e.target.value)} disabled={busy}
                >
                  <option value="us">United States</option>
                  <option value="uk">United Kingdom</option>
                  <option value="ca">Canada</option>
                  <option value="au">Australia</option>
                  <option value="se">Sweden</option>
                  <option value="de">Germany</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input id="research" type="checkbox" className="h-4 w-4" checked={research}
                  onChange={(e) => setResearch(e.target.checked)} disabled={busy} />
                <label htmlFor="research" className="text-sm">Include research (SERP scan, citations)</label>
              </div>

              <div className="flex items-center gap-2">
                <input id="gensocial" type="checkbox" className="h-4 w-4" checked={generateSocial}
                  onChange={(e) => setGenerateSocial(e.target.checked)} disabled={busy} />
                <label htmlFor="gensocial" className="text-sm">Generate social posts</label>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button className="px-4 py-2 rounded-lg border border-gray-700"
                      onClick={() => !busy && onClose?.()} disabled={busy}>Cancel</button>
              <button
                className="btn-primary px-4 py-2 rounded-lg"
                onClick={submit} disabled={busy || !keyword.trim()}
                aria-busy={busy}
              >
                {busy ? 'Starting…' : 'Generate'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
