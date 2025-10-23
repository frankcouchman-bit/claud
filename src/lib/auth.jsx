import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { api } from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    initAuth()
  }, [location.search]) // Re-run when URL params change

  async function initAuth() {
    try {
      // Check for tokens in URL first (OAuth/Magic Link callback)
      const params = new URLSearchParams(window.location.search)
      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')
      const errorParam = params.get('error')

      // Handle errors
      if (errorParam) {
        console.error('Auth error:', errorParam)
        setLoading(false)
        return
      }

      // If we have tokens in URL, save them
      if (accessToken) {
        console.log('✅ Tokens found in URL, saving...')
        localStorage.setItem('access_token', accessToken)
        if (refreshToken) {
          localStorage.setItem('refresh_token', refreshToken)
        }
        
        // Clean URL immediately
        const cleanUrl = window.location.pathname
        window.history.replaceState({}, '', cleanUrl)
        
        // Load user with the new token
        await loadUser()
        return
      }

      // Check for existing token in localStorage
      const existingToken = localStorage.getItem('access_token')
      if (existingToken) {
        console.log('✅ Found existing token, loading user...')
        await loadUser()
      } else {
        console.log('ℹ️ No auth token found')
        setLoading(false)
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
      setLoading(false)
    }
  }

  async function loadUser() {
    try {
      console.log('📡 Loading user profile...')
      const profile = await api.getProfile()
      console.log('✅ User loaded:', profile)
      setUser(profile)
    } catch (error) {
      console.error('❌ Failed to load user:', error)
      // Token might be invalid, clear it
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  async function loginWithGoogle() {
    const redirect = `${window.location.origin}/dashboard`
    const authUrl = `${api.baseUrl}/auth/google?redirect=${encodeURIComponent(redirect)}`
    console.log('🔗 Redirecting to Google OAuth:', authUrl)
    window.location.href = authUrl
  }

  async function loginWithMagicLink(email) {
    const redirect = `${window.location.origin}/dashboard`
    console.log('📧 Sending magic link to:', email)
    await api.sendMagicLink(email, redirect)
  }

  function logout() {
    console.log('👋 Logging out...')
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
    window.location.href = '/login'
  }

  async function upgradeToPro() {
    try {
      const successUrl = `${window.location.origin}/dashboard?upgrade=success`
      const cancelUrl = `${window.location.origin}/dashboard`
      const { url } = await api.createCheckoutSession(successUrl, cancelUrl)
      window.location.href = url
    } catch (error) {
      console.error('Upgrade error:', error)
    }
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
