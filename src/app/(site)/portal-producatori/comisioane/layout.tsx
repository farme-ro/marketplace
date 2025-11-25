import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Comisioane & Plăți pentru Producători | farme.ro',
  description: 'Transparență totală despre comisioane, metode de plată și gestionarea comenzilor neridicate. Model de monetizare clar pentru producători.',
  openGraph: {
    title: 'Comisioane & Plăți pentru Producători | farme.ro',
    description: 'Transparență totală despre comisioane, metode de plată și gestionarea comenzilor neridicate. Model de monetizare clar pentru producători.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function ProducerCommissionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

