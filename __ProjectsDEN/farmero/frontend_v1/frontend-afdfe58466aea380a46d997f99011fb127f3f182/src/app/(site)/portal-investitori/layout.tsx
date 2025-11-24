/**
 * Investor Portal Layout
 * 
 * Layout dedicat pentru portalul de investitori
 * Protejează toate rutele (except login/register)
 * Permite acces pentru investor și admin
 */

import type { Metadata } from 'next'
import { RequireAuth } from '@/components/auth/require-auth'
import { UnderConstruction } from '@/components/portal/under-construction'

export const metadata: Metadata = {
  title: 'Portal Investitori | farme.ro',
  description: 'Portal dedicat pentru investitorii farme.ro',
  robots: {
    index: false,
    follow: false,
  },
}

export default function InvestorPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RequireAuth role={['investor', 'admin']}>
      {children || <UnderConstruction portalName="Investitori" />}
    </RequireAuth>
  )
}

