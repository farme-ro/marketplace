import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Abonamente Producători | farme.ro',
  description: 'Planuri de abonament pentru producători cu beneficii reale: vizibilitate, unelte de promovare și creștere.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function ProducerSubscriptionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

