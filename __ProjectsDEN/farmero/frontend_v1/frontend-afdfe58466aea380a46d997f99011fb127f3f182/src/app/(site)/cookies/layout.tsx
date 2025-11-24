/**
 * Cookies Layout
 * 
 * Layout pentru pagina de politica de cookie-uri cu metadata
 */

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politica de cookie-uri - farme.ro',
  description: 'Politica de cookie-uri a platformei farme.ro',
  openGraph: {
    title: 'Politica de cookie-uri - farme.ro',
    description: 'Politica de cookie-uri a platformei farme.ro',
    url: 'https://farme.ro/cookies',
    type: 'website',
  },
  alternates: {
    canonical: 'https://farme.ro/cookies',
  },
  robots: {
    index: true,
    follow: true,
  },
}

// Static generation - this page doesn't need dynamic data
export const dynamic = 'force-static'

export default function CookiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

