/**
 * Dashboard Page
 * 
 * Redirectează utilizatorul către dashboard-ul corespunzător bazat pe rol
 * Dacă user-ul are multiple roluri, redirectează la /select-account
 */

import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth-helpers'
import { routes } from '@/lib/routes'

/**
 * Normalize role from backend to canonical UserRole
 */
function normalizeRole(role: string | null | undefined): string | null {
  if (!role) return null
  
  const upperRole = role.toUpperCase()
  
  switch (upperRole) {
    case 'CUSTOMER':
    case 'CLIENT':
      return 'client'
    case 'PRODUCER':
      return 'producer'
    case 'ADMIN':
      return 'admin'
    case 'INVESTOR':
      return 'investor'
    case 'LOGISTICS':
      return 'logistics'
    case 'IMPORTER':
      return 'importer'
    case 'BUSINESS':
      return 'business'
    default:
      // Check if already in canonical form (lowercase)
      const lowerRole = role.toLowerCase()
      const canonicalRoles = ['client', 'producer', 'admin', 'investor', 'logistics', 'importer', 'business']
      if (canonicalRoles.includes(lowerRole)) {
        return lowerRole
      }
      return null
  }
}

export default async function DashboardPage() {
  try {
    // Get current user (server-side)
    const user = await getCurrentUser()
    
    if (!user) {
      redirect('/login')
    }

    // Normalize role
    const normalizedRole = normalizeRole(user.role)
    
    if (!normalizedRole) {
      redirect('/')
    }

    // Redirect bazat pe rol
    switch (normalizedRole) {
      case 'client':
        redirect(routes.account.home)
      case 'producer':
        redirect(routes.producerPortal.dashboard)
      case 'business':
        redirect(routes.businessPortal.dashboard)
      case 'logistics':
        redirect(routes.logisticsPortal.dashboard)
      case 'investor':
        redirect(routes.investorPortal.dashboard)
      case 'importer':
        redirect(routes.importerPortal.dashboard)
      case 'admin':
        redirect('/admin/dashboard')
      default:
        redirect(routes.home)
    }
  } catch (error) {
    // If error, redirect to login
    redirect('/login')
  }
}

