'use client'

/**
 * Admin Authentication Context
 * 
 * Provides authentication state and methods for admin users
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { loginAdmin, logoutAdmin, getCurrentAdmin } from '@/lib/api/admin-auth'
import type { AdminMe, LoginCredentials } from '@/lib/api/types'

interface AdminAuthContextType {
  admin: AdminMe | null
  loading: boolean
  error: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminMe | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  const refreshSession = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const currentAdmin = await getCurrentAdmin()
      setAdmin(currentAdmin)
    } catch (err) {
      setAdmin(null)
      // Don't set error for 401 - it's expected when not logged in
      if (err instanceof Error && !err.message.includes('Neautorizat')) {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Try to get current admin on mount
    refreshSession()
  }, [refreshSession])

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        setLoading(true)
        setError(null)
        const response = await loginAdmin(credentials)
        setAdmin(response.user as AdminMe)
        // Redirect to dashboard or returnUrl
        const returnUrl = new URLSearchParams(window.location.search).get('returnUrl') || '/dashboard'
        router.push(returnUrl)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Eroare la autentificare'
        setError(message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [router]
  )

  const logout = useCallback(async () => {
    try {
      setLoading(true)
      await logoutAdmin()
      setAdmin(null)
      router.push('/login')
    } catch (err) {
      console.error('Logout error:', err)
      // Even if logout fails, clear local state
      setAdmin(null)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }, [router])

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        loading,
        error,
        login,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}

