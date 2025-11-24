/**
 * For Producers Layout
 * 
 * Layout pentru pagina de producători cu metadata
 */

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pentru producători - farme.ro',
  description: 'Devino producător pe farme.ro și vinde produsele tale tradiționale direct clienților.',
  openGraph: {
    title: 'Pentru producători - farme.ro',
    description: 'Devino producător pe farme.ro și vinde produsele tale tradiționale direct clienților.',
    url: 'https://farme.ro/for-producers',
    type: 'website',
  },
  alternates: {
    canonical: 'https://farme.ro/for-producers',
  },
}

// Static generation - this page doesn't need dynamic data
export const dynamic = 'force-static'

export default function ForProducersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

