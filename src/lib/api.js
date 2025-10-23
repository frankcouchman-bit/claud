// src/lib/api.js
// Safe upgrade: timeouts, robust errors, JSON parsing, and /api/draft → /api/generate fallback.
// No breaking changes to exports, methods, IDs, classes, or routes.

const BASE_URL =
  (import.meta?.env?.VITE_API_URL || 'https://seoscribe.frank-couchman.workers.dev').replace(/\/+$/, '');

class ApiClient {
  constructor(baseUrl = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  getHeaders(includeAuth = false) {
    const headers = { 'Content-Type': 'application/json' };
    if (includeAuth) {
      try {
        const token = localStorage.getItem('access_token');
        if (token) headers['Authorization'] = `Bearer ${token}`;
      } catch { /* ignore storage issues */ }
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const {
      auth = false,
      timeoutMs = 60000, // default 60s; some generations can be longer—override per call if needed
      headers: extraHeaders,
      ...rest
    } = options;

    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, {
        ...rest,
        headers: { ...this.getHeaders(auth), ...(extraHeaders || {}) },
        signal: controller.signal,
      });

      // Non-2xx → surface structured error to UI
      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        let data;
        try { data = txt ? JSON.parse(txt) : undefined; } catch { /* leave undefined */ }
        const err = new Error((data && (data.error || data.message)) || txt || `HTTP ${res.status}`);
        err.status = res.status;
        err.data = data || { error: txt || 'Request failed' };
        throw err;
      }

      // 204/empty
      const contentLength = res.headers.get('content-length');
      const ct = (res.headers.get('content-type') || '').toLowerCase();

      if (res.status === 204 || contentLength === '0') return null;
      const bodyText = await res.text();

      if (!bodyText) return null;
      if (ct.includes('application/json')) {
        try { return JSON.parse(bodyText); }
        catch {
          console.error('Failed to parse JSON:', bodyText);
          throw new Error('Invalid JSON response');
        }
      }
      // fallback: return raw text if not JSON
      return bodyText;
    } catch (error) {
      if (error?.name === 'AbortError') {
        const e = new Error('Request timed out. Please try again.');
        e.status = 408;
        throw e;
      }
      console.error('API request failed:', error);
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }

  // ---------- Auth ----------
  async sendMagicLink(email, redirect) {
    return this.request('/auth/magic-link', {
      method: 'POST',
      body: JSON.stringify({ email, redirect }),
    });
  }

  // ---------- Profile ----------
  async getProfile() {
    const response = await this.request('/api/profile', { auth: true });
    return {
      plan: response?.plan || 'free',
      email: response?.email || '',
      usage: response?.usage || { today: { generations: 0 }, month: { generations: 0 } },
      tools_today: response?.tools_today ?? 0,
      tool_usage_today: response?.tool_usage_today ?? 0,
      tool_limit_daily: response?.tool_limit_daily ?? 1,
      pro_trial_remaining: response?.pro_trial_remaining ?? 0,
      pro_trial_used: response?.pro_trial_used ?? false,
      onboarding_completed: response?.onboarding_completed ?? false,
    };
  }

  async updateProfile(data) {
    return this.request('/api/profile', {
      method: 'PATCH',
      auth: true,
      body: JSON.stringify(data),
    });
  }

  // ---------- Articles ----------
  async getArticles() {
    const response = await this.request('/api/articles', { auth: true });
    return Array.isArray(response) ? response : [];
    // Keeps prior behavior but guarantees array for UI maps
  }

  async getArticle(id) {
    return this.request(`/api/articles/${id}`, { auth: true });
  }

  async createArticle(data) {
    return this.request('/api/articles', {
      method: 'POST',
      auth: true,
      body: JSON.stringify(data),
    });
  }

  async updateArticle(id, data) {
    return this.request(`/api/articles/${id}`, {
      method: 'PATCH',
      auth: true,
      body: JSON.stringify(data),
    });
  }

  async deleteArticle(id) {
    return this.request(`/api/articles/${id}`, {
      method: 'DELETE',
      auth: true,
    });
  }

  // ---------- Generation ----------
  async generateDraft(data) {
    const useAuth = !!localStorage.getItem('access_token');
    try {
      // Primary route your frontend already used
      return await this.request('/api/draft', {
        method: 'POST',
        auth: useAuth,
        body: JSON.stringify(data),
        timeoutMs: 90000, // allow longer for first token stream
      });
    } catch (e) {
      // Fallback to alt route if Worker publishes /api/generate
      if (e?.status === 404) {
        return await this.request('/api/generate', {
          method: 'POST',
          auth: useAuth,
          body: JSON.stringify(data),
          timeoutMs: 90000,
        });
      }
      throw e;
    }
  }

  async getTemplates() {
    const response = await this.request('/api/templates');
    return Array.isArray(response) ? response : [];
  }

  async generateFromTemplate(data) {
    return this.request('/api/templates/generate', {
      method: 'POST',
      auth: true,
      body: JSON.stringify(data),
    });
  }

  // ---------- Tools ----------
  async analyzeReadability(text) {
    return this.request('/api/tools/readability', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ text }),
    });
  }

  async analyzeHeadline(headline) {
    return this.request('/api/tools/headline', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ headline }),
    });
  }

  async generateSerpPreview(data) {
    return this.request('/api/tools/serp', {
      method: 'POST',
      auth: true,
      body: JSON.stringify(data),
    });
  }

  async checkPlagiarism(text) {
    return this.request('/api/tools/plagiarism', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ text }),
    });
  }

  async analyzeCompetitors(keyword, region) {
    return this.request('/api/tools/competitors', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ keyword, region }),
    });
  }

  async extractKeywords(topic, text, region) {
    return this.request('/api/tools/keywords', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ topic, text, region }),
    });
  }

  async generateContentBrief(keyword, region) {
    return this.request('/api/tools/brief', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ keyword, region }),
    });
  }

  async generateMetaDescription(content) {
    return this.request('/api/tools/meta', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ content }),
    });
  }

  async editSection(instruction, section) {
    return this.request('/api/tools/section', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ instruction, section }),
    });
  }

  async expandArticle(data) {
    return this.request('/api/tools/expand', {
      method: 'POST',
      auth: true,
      body: JSON.stringify(data),
    });
  }

  async getAIAssistance(prompt, context, keyword, region) {
    return this.request('/api/ai-assistant', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ prompt, context, keyword, region }),
    });
  }

  // ---------- Stripe ----------
  async createCheckoutSession(successUrl, cancelUrl) {
    return this.request('/api/stripe/create-checkout', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ successUrl, cancelUrl }),
    });
  }

  async createPortalSession(returnUrl) {
    return this.request('/api/stripe/portal', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ returnUrl }),
    });
  }
}

export const api = new ApiClient();
export default api;
