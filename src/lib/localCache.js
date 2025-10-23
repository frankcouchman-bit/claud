// src/lib/localCache.js
// Local article cache + client-side quota guard (free=monthly 1, pro=daily 15)

const KEY_ARTICLES = 'seoscribe_articles_v1';
const KEY_USAGE = 'seoscribe_usage_v1';

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function writeJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ---------- Articles ----------
export function lc_listArticles() {
  const list = readJSON(KEY_ARTICLES, []);
  // ensure shape
  return Array.isArray(list) ? list : [];
}
export function lc_getArticle(id) {
  return lc_listArticles().find(a => a?.id === id) || null;
}
export function lc_upsertArticle(article) {
  if (!article || !article.id) return;
  const list = lc_listArticles();
  const idx = list.findIndex(a => a?.id === article.id);
  const now = new Date().toISOString();
  const toSave = {
    // minimal normalized shape the UI can render
    id: article.id,
    title: article.title || article.topic || article?.data?.title || 'Untitled article',
    created_at: article.created_at || article.createdAt || now,
    updated_at: now,
    word_count: article.word_count || article?.data?.word_count || article.target_word_count || 0,
    reading_time_minutes: article.reading_time_minutes || Math.max(1, Math.round((article.word_count || 800) / 220)),
    seo_score: article.seo_score || null,
    keyword: article.keyword || article?.data?.keyword || null,
    tone: article.tone || article?.data?.tone || null,
    meta_title: article.meta_title || article?.data?.meta?.title || null,
    meta_description: article.meta_description || article?.data?.meta?.description || null,
    data: article.data || article.content || article.body || {},
    ht
