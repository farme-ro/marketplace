/**
 * Logistics Portal Layout
 * 
 * Layout dedicat pentru portalul de logistică
 * Protejează toate rutele (except login/register)
 */

import type { Metadata } from 'next'
import { RequireAuth } from '@/components/auth/require-auth'
import { UnderConstruction } from '@/components/portal/under-construction'
import { LogisticsDashboardLayout } from '@/components/logistics-portal/logistics-dashboard-layout'

export const metadata: Metadata = {
  title: 'Portal Logistică | farme.ro',
  description: 'Portal dedicat pentru partenerii de logistică farme.ro',
  robots: {
    index: false,
    follow: false,
  },
}

export default function LogisticsPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RequireAuth role="logistics">
      <LogisticsDashboardLayout>
        {children || <UnderConstruction portalName="Logistică" />}
      </LogisticsDashboardLayout>
    </RequireAuth>
  )
}

