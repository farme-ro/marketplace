/**
 * RequireAuth Component
 * 
 * Protects routes by requiring authentication
 * Shows loading state while checking auth, redirects if not authenticated
 */

'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'
import type { UserRole } from '@/lib/types/domain'
import { ForbiddenError } from '@/components/ui/error-pages'

interface RequireAuthProps {
  role?: UserRole | UserRole[]
  children: React.ReactNode
  fallbackRedirect?: string
  showLoading?: boolean
}

/**
 * Get default redirect path for a role
 */
function getDefaultRedirectPath(role: UserRole | null): string {
  // Always redirect to unified login
  return '/login'
}

/**
 * Check if current role matches required role(s)
 */
function hasRequiredRole(currentRole: UserRole | null, requiredRole: UserRole | UserRole[] | undefined): boolean {
  if (!requiredRole) {
    // No role requirement - just need to be authenticated
    return currentRole !== null
  }
  
  if (!currentRole) return false
  
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(currentRole)
  }
  
  return currentRole === requiredRole
}

export function RequireAuth({ role, children, fallbackRedirect, showLoading = true }: RequireAuthProps) {
  const { status, isAuthenticated, role: currentRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If not authenticating and not authenticated, redirect
    if (status !== 'authenticating' && !isAuthenticated) {
      const redirectPath = fallbackRedirect || getDefaultRedirectPath(role as UserRole || null)
      router.push(redirectPath)
    }
  }, [status, isAuthenticated, router, fallbackRedirect, role])

  // Show loading state
  if (status === 'authenticating' && showLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-sm text-muted-foreground">Se verifică autentificarea...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, show nothing (redirect is happening)
  if (!isAuthenticated) {
    return null
  }

  // Check if user has required role
  if (!hasRequiredRole(currentRole, role)) {
    // Show forbidden error instead of redirect loop
    return <ForbiddenError />
  }

  // If authenticated with correct role, show children
  return <>{children}</>
}

