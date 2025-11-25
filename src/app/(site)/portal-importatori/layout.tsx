/**
 * Importer Portal Layout
 * 
 * Layout dedicat pentru portalul de importatori
 * Protejează toate rutele (except login/register)
 */

import type { Metadata } from 'next'
import { RequireAuth } from '@/components/auth/require-auth'
import { UnderConstruction } from '@/components/portal/under-construction'

export const metadata: Metadata = {
  title: 'Portal Importatori | farme.ro',
  description: 'Portal dedicat pentru importatorii farme.ro',
  robots: {
    index: false,
    follow: false,
  },
}

export default function ImporterPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RequireAuth role="importer">
      {children || <UnderConstruction portalName="Importatori" />}
    </RequireAuth>
  )
}

