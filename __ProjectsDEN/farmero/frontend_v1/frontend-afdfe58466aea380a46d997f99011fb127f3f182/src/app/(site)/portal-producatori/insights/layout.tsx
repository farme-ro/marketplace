import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Statistici Producător | farme.ro',
  description: 'Analizează performanța produselor și comenzilor tale.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function ProducerInsightsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

