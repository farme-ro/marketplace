import type { Metadata } from 'next'

interface ProducerRegisterLayoutProps {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: 'Înregistrare Producător | farme.ro',
  description: 'Devino producător pe farme.ro și vinde produsele tale direct clienților, fără intermediari.',
  openGraph: {
    title: 'Înregistrare Producător | farme.ro',
    description: 'Devino producător pe farme.ro și vinde produsele tale direct clienților, fără intermediari.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const dynamic = 'force-static'

export default function ProducerRegisterLayout({
  children,
}: ProducerRegisterLayoutProps) {
  return <>{children}</>
}

