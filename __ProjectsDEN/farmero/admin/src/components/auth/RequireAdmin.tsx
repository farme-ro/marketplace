'use client'

/**
 * Route Guard Component
 * 
 * Protects routes that require admin authentication
 * Redirects to login if not authenticated
 */

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/lib/auth/admin-auth-context'

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { admin, loading } = useAdminAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !admin) {
      const currentPath = window.location.pathname
      router.push(`/login?returnUrl=${encodeURIComponent(currentPath)}`)
    }
  }, [admin, loading, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-farmero-olive border-r-transparent"></div>
          <p className="text-muted-foreground">Se încarcă...</p>
        </div>
      </div>
    )
  }

  if (!admin) {
    return null // Will redirect in useEffect
  }

  return <>{children}</>
}

