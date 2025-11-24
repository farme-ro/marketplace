import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact - farme.ro',
  description: 'Contactează echipa farme.ro pentru întrebări, suport sau colaborări.',
  openGraph: {
    title: 'Contact - farme.ro',
    description: 'Contactează echipa farme.ro pentru întrebări, suport sau colaborări.',
    url: 'https://farme.ro/contact',
    type: 'website',
  },
  alternates: {
    canonical: 'https://farme.ro/contact',
  },
}

// Static generation - metadata is static, page content is client-side
export const dynamic = 'force-static'

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

