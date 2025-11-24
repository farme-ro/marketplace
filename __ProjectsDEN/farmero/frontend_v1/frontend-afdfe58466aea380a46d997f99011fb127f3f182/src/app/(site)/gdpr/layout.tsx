/**
 * GDPR Layout
 * 
 * Layout pentru pagina GDPR cu metadata
 */

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GDPR - Drepturile tale - farme.ro',
  description: 'Informații despre drepturile tale conform GDPR pe platforma farme.ro',
  openGraph: {
    title: 'GDPR - Drepturile tale - farme.ro',
    description: 'Informații despre drepturile tale conform GDPR pe platforma farme.ro',
    url: 'https://farme.ro/gdpr',
    type: 'website',
  },
  alternates: {
    canonical: 'https://farme.ro/gdpr',
  },
  robots: {
    index: true,
    follow: true,
  },
}

// Static generation - this page doesn't need dynamic data
export const dynamic = 'force-static'

export default function GDPRLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

