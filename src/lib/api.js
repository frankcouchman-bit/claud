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
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(options.auth),
          ...options.headers,
        },
      })

      // ✅ Handle non-200 responses
      if (!response.ok) {
        const errorText = await response.text()
        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { error: errorText || 'Request failed' }
        }
        
        const error = new Error(errorData.error || errorData.message || 'Request failed')
        error.status = response.status
        error.data = errorData
        throw error
      }

      // ✅ Handle empty responses
      const text = await response.text()
      if (!text) {
        return null
      }

      // ✅ Parse JSON safely
      try {
        return JSON.parse(text)
      } catch (e) {
        console.error('Failed to parse JSON:', text)
        throw new Error('Invalid JSON response')
      }
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
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
    const response = await this.request('/api/profile', { auth: true })
    // ✅ Ensure response has proper structure
    return {
      plan: response?.plan || 'free',
      email: response?.email || '',
      usage: response?.usage || { today: { generations: 0 }, month: { generations: 0 } },
      tools_today: response?.tools_today || 0,
      tool_usage_today: response?.tool_usage_today || 0,
      tool_limit_daily: response?.tool_limit_daily || 1,
      pro_trial_remaining: response?.pro_trial_remaining || 0,
      pro_trial_used: response?.pro_trial_used || false,
      onboarding_completed: response?.onboarding_completed || false,
    }
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
    const response = await this.request('/api/articles', { auth: true })
    // ✅ Ensure it's always an array
    return Array.isArray(response) ? response : []
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
      auth: !!localStorage.getItem('access_token'),
      body: JSON.stringify(data),
    })
  }

  async getTemplates() {
    const response = await this.request('/api/templates')
    return Array.isArray(response) ? response : []
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
