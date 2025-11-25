/**
 * Server-side Authentication Helpers
 * 
 * Functions for server components and API routes to check authentication
 */

import { redirect } from 'next/navigation'
import { serverRequest } from '@/lib/api/server'
import type { AuthUser } from '@/lib/api/auth'
import type { UserRole } from '@/types'

/**
 * Get current authenticated user (server-side)
 * 
 * @returns Current user or null if not authenticated
 * @throws Error if request fails
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const response = await serverRequest<AuthUser>('GET', '/auth/me')
    
    if (response.error) {
      // If 401, user is not authenticated
      if (response.error.status === 401) {
        return null
      }
      
      // For other errors, throw with proper message
      const errorMessage = response.error.message || 'Failed to get current user'
      throw new Error(errorMessage)
    }
    
    return response.data || null
  } catch (error) {
    // If network error or 401, return null (not authenticated)
    if (error instanceof Error) {
      // 401 errors - not authenticated
      if (error.message.includes('401')) {
        return null
      }
    }
    // Re-throw other errors
    throw error
  }
}

/**
 * Require authenticated user (server-side)
 * 
 * @returns Current user
 * @throws Redirects to login if not authenticated
 */
export async function requireUser(): Promise<AuthUser> {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login-client')
  }
  
  return user
}

/**
 * Require user with specific role (server-side)
 * 
 * @param role - Required role
 * @returns Current user
 * @throws Redirects to login if not authenticated or wrong role
 */
export async function requireRole(role: UserRole): Promise<AuthUser> {
  const user = await requireUser()
  
  if (user.role !== role) {
    redirect('/')
  }
  
  return user
}

