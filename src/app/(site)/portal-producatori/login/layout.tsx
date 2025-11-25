import type { Metadata } from 'next'

interface ProducerLoginLayoutProps {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: 'Autentificare Producător | farme.ro',
  description: 'Intră în portalul farme.ro pentru a gestiona produsele și comenzile tale de producător.',
  openGraph: {
    title: 'Autentificare Producător | farme.ro',
    description: 'Accesează contul tău de producător și administrează-ți prezența pe farme.ro.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const dynamic = 'force-static'

export default function ProducerLoginLayout({
  children,
}: ProducerLoginLayoutProps) {
  return <>{children}</>
}

