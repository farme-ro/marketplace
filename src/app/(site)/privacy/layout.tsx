/**
 * Privacy Layout
 * 
 * Layout pentru pagina de politica de confidențialitate cu metadata
 */

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politica de confidențialitate - farme.ro',
  description: 'Politica de confidențialitate a platformei farme.ro',
  openGraph: {
    title: 'Politica de confidențialitate - farme.ro',
    description: 'Politica de confidențialitate a platformei farme.ro',
    url: 'https://farme.ro/privacy',
    type: 'website',
  },
  alternates: {
    canonical: 'https://farme.ro/privacy',
  },
  robots: {
    index: true,
    follow: true,
  },
}

// Static generation - this page doesn't need dynamic data
export const dynamic = 'force-static'

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

