// src/pages/ArticleEditor.jsx
import { useParams } from 'react-router-dom'

export default function ArticleEditor() {
  const { id } = useParams()

  // You can fetch the article if needed:
  // useEffect(() => { api.getArticle(id).then(setState).catch(...) }, [id])

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-2">Article Editor</h1>
      <p className="text-gray-400">Article ID: <span className="font-mono">{id}</span></p>

      {/* TODO: mount your real editor UI here */}
      <div className="mt-6 rounded-xl border border-gray-800 p-4">
        The editor UI will render here once you plug it in.
      </div>
    </div>
  )
}
