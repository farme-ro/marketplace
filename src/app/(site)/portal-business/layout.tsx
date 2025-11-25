/**
 * Business Portal Layout
 * 
 * Layout dedicat pentru portalul B2B
 * Protejează toate rutele (except login/register)
 * Permite acces pentru business și admin
 */

import type { Metadata } from 'next'
import { RequireAuth } from '@/components/auth/require-auth'
import { UnderConstruction } from '@/components/portal/under-construction'
import { BusinessDashboardLayout } from '@/components/business-portal/business-dashboard-layout'

export const metadata: Metadata = {
  title: 'Portal Business | farme.ro',
  description: 'Portal dedicat pentru partenerii B2B farme.ro',
  robots: {
    index: false,
    follow: false,
  },
}

export default function BusinessPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RequireAuth role={['business', 'admin']}>
      <BusinessDashboardLayout>
        {children || <UnderConstruction portalName="Business" />}
      </BusinessDashboardLayout>
    </RequireAuth>
  )
}

