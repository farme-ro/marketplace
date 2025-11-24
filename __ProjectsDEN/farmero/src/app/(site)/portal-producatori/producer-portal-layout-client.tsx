/**
 * Producer Portal Layout Client Component
 * 
 * Client component that wraps producer portal with auth protection
 * Excludes login and register pages from protection
 */

'use client'

import { usePathname } from 'next/navigation'
import { RequireAuth } from '@/components/auth/require-auth'
import { ProducerPortalTopbar } from '@/components/producer-portal/producer-portal-topbar'
import { ProducerPortalFooter } from '@/components/producer-portal/producer-portal-footer'

export function ProducerPortalLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Pages that don't require auth
  const publicPages = ['/portal-producatori/login', '/portal-producatori/register']
  const isPublicPage = publicPages.includes(pathname)

  if (isPublicPage) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <ProducerPortalTopbar />
        <main className="flex-1">{children}</main>
        <ProducerPortalFooter />
      </div>
    )
  }

  return (
    <RequireAuth role="producer" fallbackRedirect="/portal-producatori/login">
      <div className="min-h-screen flex flex-col bg-background">
        <ProducerPortalTopbar />
        <main className="flex-1">{children}</main>
        <ProducerPortalFooter />
      </div>
    </RequireAuth>
  )
}

