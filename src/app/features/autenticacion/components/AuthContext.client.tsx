"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: () => void
  logout: () => void
  user: { username: string; email?: string; role?: string } | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<{ username: string; email?: string; role?: string } | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const validateSession = async () => {
      try {
        // For local development / vite preview, prefer localStorage fallback first
        const adminAuth = localStorage.getItem('adminAuth')
        const adminUser = localStorage.getItem('adminUser')
        if (adminAuth === 'true') {
          setIsAuthenticated(true)
          setUser(adminUser ? { username: adminUser } : null)
          setError(null)
          setIsLoading(false)
          return
        }

        // If not in localStorage, attempt to validate with backend if available
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        })

        if (!res.ok) {
          localStorage.removeItem('adminAuth')
          localStorage.removeItem('adminUser')
          setIsAuthenticated(false)
          setUser(null)
          setError('Sesión expirada. Por favor, inicia sesión nuevamente.')
          setIsLoading(false)
          return
        }

        const data = await res.json()
        if (data.ok && data.user) {
          setIsAuthenticated(true)
          setUser(data.user)
          setError(null)
          localStorage.setItem('adminAuth', 'true')
          if (data.user.username) localStorage.setItem('adminUser', data.user.username)
        } else {
          setIsAuthenticated(false)
          setUser(null)
          setError(data.message || 'Error validating session')
        }
      } catch (err) {
        console.error('Session validation error:', err)
        setIsAuthenticated(false)
        setUser(null)
        setError('Error validating session')
      } finally {
        setIsLoading(false)
      }
    }

    validateSession()

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'adminAuth') {
        setIsAuthenticated(e.newValue === 'true')
        if (e.newValue !== 'true') {
          setUser(null)
          setError(null)
        }
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  useEffect(() => {
    try {
      const adminAuth = localStorage.getItem('adminAuth')
      setIsAuthenticated(adminAuth === 'true')
    } catch (err) {
      setIsAuthenticated(false)
    }
  }, [location.pathname])

  const login = async () => {
    try {
      localStorage.setItem('adminAuth', 'true')
      setIsAuthenticated(true)
      setError(null)
      setIsLoading(true)

      try {
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        })
        if (res.ok) {
          const data = await res.json()
          if (data.ok && data.user) {
            setUser(data.user)
            if (data.user.username) localStorage.setItem('adminUser', data.user.username)
          }
        }
      } catch (err) {
        console.error('Error fetching user data:', err)
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      try {
        await fetch('/api/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include' })
      } catch (err) {
        console.error('Error notifying server of logout:', err)
      }
      localStorage.removeItem('adminAuth')
      localStorage.removeItem('adminUser')
      setIsAuthenticated(false)
      setUser(null)
      setError(null)
    } catch (err) {
      console.error('Logout error:', err)
      setError('Error al cerrar sesión')
    } finally {
      setIsLoading(false)
      navigate('/')
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, error, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    return {
      isAuthenticated: false,
      isLoading: false,
      error: null,
      user: null,
      login: () => {
        try {
          localStorage.setItem('adminAuth', 'true')
        } catch (err) {
          console.debug('AuthContext fallback login localStorage error', err)
        }
      },
      logout: () => {
        try {
          localStorage.removeItem('adminAuth')
          localStorage.removeItem('adminUser')
          localStorage.removeItem('token')
        } catch (err) {
          console.debug('AuthContext fallback logout localStorage error', err)
        }
      },
    }
  }
  return context
}
