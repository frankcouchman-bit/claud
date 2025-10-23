// src/lib/localCache.js
// Local article cache + client-side quota guard (free = 1/month, pro = 15/day)

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
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// ---------- Articles ----------
export function lc_listArticles() {
  const list = readJSON(KEY_ARTICLES, []);
  return Array.isArray(list) ? list : [];
}

export function lc_getArticle(id) {
  return lc_listArticles().find((a) => a && a.id === id) || null;
}

export function lc_upsertArticle(article) {
  if (!article || !article.id) return;
  const list = lc_listArticles();
  const idx = list.findIndex((a) => a && a.id === article.id);
  const now = new Date().toISOString();
  const toSave = {
    id: article.id,
    title:
      article.title ||
      article.topic ||
      article?.data?.title ||
      'Untitled article',
    created_at: article.created_at || article.createdAt || now,
    updated_at: now,
    word_count:
      article.word_count ||
      article?.data?.word_count ||
      article.target_word_count ||
      0,
    reading_time_minutes:
      article.reading_time_minutes ||
      Math.max(1, Math.round((article.word_count || 800) / 220)),
    seo_score: article.seo_score ?? null,
    keyword: article.keyword || article?.data?.keyword || null,
    tone: article.tone || article?.data?.tone || null,
    meta_title: article.meta_title || article?.data?.meta?.title || null,
    meta_description:
      article.meta_description || article?.data?.meta?.description || null,
    data: article.data || article.content || article.body || {},
    html:
      article.html ||
      article?.content?.html ||
      article?.body?.html ||
      null,
    image: article.image || article?.data?.image || null,
    sources: article.sources || article?.data?.citations || [],
    status: article.status || 'draft',
  };
  if (idx >= 0) list[idx] = { ...list[idx], ...toSave };
  else list.unshift(toSave); // newest first
  writeJSON(KEY_ARTICLES, list);
  return toSave;
}

// ---------- Quota ----------
function fmtKeyDay(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function fmtKeyMonth(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

// Plan limits: Free = 1 / month, Pro = 15 / day
export function lc_getPlanWindow(isPro) {
  return isPro
    ? { limit: 15, window: 'day' }
    : { limit: 1, window: 'month' };
}

export function lc_getUsage(isPro) {
  const usage = readJSON(KEY_USAGE, {});
  const { window } = lc_getPlanWindow(isPro);
  const k = window === 'day' ? fmtKeyDay() : fmtKeyMonth();
  const c = usage[k] || 0;
  return { key: k, count: c, window };
}

export function lc_incrementUsage(isPro) {
  const usage = readJSON(KEY_USAGE, {});
  const { window } = lc_getPlanWindow(isPro);
  const k = window === 'day' ? fmtKeyDay() : fmtKeyMonth();
  usage[k] = (usage[k] || 0) + 1;
  writeJSON(KEY_USAGE, usage);
  return { key: k, count: usage[k], window };
}

export function lc_isLocked(isPro) {
  const { limit } = lc_getPlanWindow(isPro);
  const { count, window } = lc_getUsage(isPro);
  return { locked: count >= limit, count, limit, window };
}

export function lc_nextResetAt(isPro) {
  const now = new Date();
  if (isPro) {
    // next local midnight
    const next = new Date(now);
    next.setHours(24, 0, 0, 0);
    return next.toISOString();
  } else {
    // first day of next month local
    const next = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1,
      0, 0, 0, 0
    );
    return next.toISOString();
  }
}
