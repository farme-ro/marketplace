import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ghid Producător | farme.ro',
  description: 'Ghid complet pentru producători - cum să folosești platforma farme.ro pentru a vinde produsele tale',
  openGraph: {
    title: 'Ghid Producător | farme.ro',
    description: 'Ghid complet pentru producători - cum să folosești platforma farme.ro pentru a vinde produsele tale',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function ProducerGuideLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

