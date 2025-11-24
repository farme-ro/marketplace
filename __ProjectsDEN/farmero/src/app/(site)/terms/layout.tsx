/**
 * Terms Layout
 * 
 * Layout pentru pagina de termeni și condiții cu metadata
 */

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termeni și condiții - farme.ro',
  description: 'Termenii și condițiile de utilizare a platformei farme.ro',
  openGraph: {
    title: 'Termeni și condiții - farme.ro',
    description: 'Termenii și condițiile de utilizare a platformei farme.ro',
    url: 'https://farme.ro/terms',
    type: 'website',
  },
  alternates: {
    canonical: 'https://farme.ro/terms',
  },
  robots: {
    index: true,
    follow: true,
  },
}

// Static generation - this page doesn't need dynamic data
export const dynamic = 'force-static'

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

