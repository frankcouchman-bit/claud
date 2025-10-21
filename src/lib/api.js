const API_URL = import.meta.env.VITE_API_URL || 'https://seoscribe.frank-couchman.workers.dev'

class ApiClient {
  constructor() {
    this.baseUrl = API_URL
  }

  getHeaders(includeAuth = false) {
    const headers = {
      'Content-Type': 'application/json',
    }
    
    if (includeAuth) {
      const token = localStorage.getItem('access_token')
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }
    
    return headers
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(options.auth),
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }))
      throw new Error(error.error || error.message || 'Request failed')
    }

    return response.json()
  }

  // Auth
  async sendMagicLink(email, redirect) {
    return this.request('/auth/magic-link', {
      method: 'POST',
      body: JSON.stringify({ email, redirect }),
    })
  }

  // Profile
  async getProfile() {
    return this.request('/api/profile', { auth: true })
  }

  async updateProfile(data) {
    return this.request('/api/profile', {
      method: 'PATCH',
      auth: true,
      body: JSON.stringify(data),
    })
  }

  // Articles
  async getArticles() {
    return this.request('/api/articles', { auth: true })
  }

  async getArticle(id) {
    return this.request(`/api/articles/${id}`, { auth: true })
  }

  async createArticle(data) {
    return this.request('/api/articles', {
      method: 'POST',
      auth: true,
      body: JSON.stringify(data),
    })
  }

  async updateArticle(id, data) {
    return this.request(`/api/articles/${id}`, {
      method: 'PATCH',
      auth: true,
      body: JSON.stringify(data),
    })
  }

  async deleteArticle(id) {
    return this.request(`/api/articles/${id}`, {
      method: 'DELETE',
      auth: true,
    })
  }

  // Generation
  async generateDraft(data) {
    return this.request('/api/draft', {
      method: 'POST',
      auth: !!localStorage.getItem('access_token'), // Optional auth
      body: JSON.stringify(data),
    })
  }

  async getTemplates() {
    return this.request('/api/templates')
  }

  async generateFromTemplate(data) {
    return this.request('/api/templates/generate', {
      method: 'POST',
      auth: true,
      body: JSON.stringify(data),
    })
  }

  // Tools
  async analyzeReadability(text) {
    return this.request('/api/tools/readability', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ text }),
    })
  }

  async analyzeHeadline(headline) {
    return this.request('/api/tools/headline', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ headline }),
    })
  }

  async generateSerpPreview(data) {
    return this.request('/api/tools/serp', {
      method: 'POST',
      auth: true,
      body: JSON.stringify(data),
    })
  }

  async checkPlagiarism(text) {
    return this.request('/api/tools/plagiarism', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ text }),
    })
  }

  async analyzeCompetitors(keyword, region) {
    return this.request('/api/tools/competitors', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ keyword, region }),
    })
  }

  async extractKeywords(topic, text, region) {
    return this.request('/api/tools/keywords', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ topic, text, region }),
    })
  }

  async generateContentBrief(keyword, region) {
    return this.request('/api/tools/brief', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ keyword, region }),
    })
  }

  async generateMetaDescription(content) {
    return this.request('/api/tools/meta', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ content }),
    })
  }

  async editSection(instruction, section) {
    return this.request('/api/tools/section', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ instruction, section }),
    })
  }

  async expandArticle(data) {
    return this.request('/api/tools/expand', {
      method: 'POST',
      auth: true,
      body: JSON.stringify(data),
    })
  }

  async getAIAssistance(prompt, context, keyword, region) {
    return this.request('/api/ai-assistant', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ prompt, context, keyword, region }),
    })
  }

  // Stripe
  async createCheckoutSession(successUrl, cancelUrl) {
    return this.request('/api/stripe/create-checkout', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ successUrl, cancelUrl }),
    })
  }

  async createPortalSession(returnUrl) {
    return this.request('/api/stripe/portal', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ returnUrl }),
    })
  }
}

export const api = new ApiClient()
export default api
