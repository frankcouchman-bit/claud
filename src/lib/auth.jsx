import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Check for tokens in URL (OAuth callback)
    const params = new URLSearchParams(window.location.search)
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')

    if (accessToken) {
      localStorage.setItem('access_token', accessToken)
      if (refreshToken) localStorage.setItem('refresh_token', refreshToken)
      
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname)
      
      // Fetch profile
      loadUser()
    } else {
      // Check existing token
      const token = localStorage.getItem('access_token')
      if (token) {
        loadUser()
      } else {
        setLoading(false)
      }
    }
  }, [])

  async function loadUser() {
    try {
      const profile = await api.getProfile()
      setUser(profile)
    } catch (error) {
      console.error('Failed to load user:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  async function loginWithGoogle() {
    const redirect = `${window.location.origin}/dashboard`
    window.location.href = `${api.baseUrl}/auth/google?redirect=${encodeURIComponent(redirect)}`
  }

  async function loginWithMagicLink(email) {
    const redirect = `${window.location.origin}/dashboard`
    await api.sendMagicLink(email, redirect)
  }

  function logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
    navigate('/login')
  }

  async function upgradeToPro() {
    const successUrl = `${window.location.origin}/dashboard?upgrade=success`
    const cancelUrl = `${window.location.origin}/dashboard`
    const { url } = await api.createCheckoutSession(successUrl, cancelUrl)
    window.location.href = url
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isPro: user?.plan === 'pro',
    loginWithGoogle,
    loginWithMagicLink,
    logout,
    upgradeToPro,
    refreshUser: loadUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
