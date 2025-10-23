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
  }, [location.pathname, location.search, location.hash])

  async function initAuth() {
    try {
      let accessToken = null
      let refreshToken = null
      let errorParam = null

      // ✅ Check URL HASH first (Supabase OAuth returns tokens in hash)
      if (window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        accessToken = hashParams.get('access_token')
        refreshToken = hashParams.get('refresh_token')
        errorParam = hashParams.get('error')
        
        console.log('🔍 Checking hash params:', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          error: errorParam
        })
      }

      // ✅ Also check query params (magic links use query params)
      if (!accessToken) {
        const queryParams = new URLSearchParams(window.location.search)
        accessToken = queryParams.get('access_token')
        refreshToken = queryParams.get('refresh_token')
        errorParam = queryParams.get('error')
        
        console.log('🔍 Checking query params:', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          error: errorParam
        })
      }

      // Handle errors
      if (errorParam) {
        console.error('❌ Auth error:', errorParam)
        setLoading(false)
        return
      }

      // If we have tokens in URL, save them and redirect
      if (accessToken) {
        console.log('✅ Tokens found, saving and loading user...')
        localStorage.setItem('access_token', accessToken)
        if (refreshToken) {
          localStorage.setItem('refresh_token', refreshToken)
        }
        
        // Clean URL completely (remove hash and query params)
        window.history.replaceState({}, '', '/dashboard')
        
        // Load user profile
        await loadUser()
        
        // Force navigation to dashboard
        window.location.href = '/dashboard'
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
      console.error('❌ Auth initialization error:', error)
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
      console.error('❌ Upgrade error:', error)
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
