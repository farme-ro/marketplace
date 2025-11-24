import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard Producător | farme.ro',
  description: 'Hub central pentru producători: comenzile, veniturile și cum te ajută platforma să crești.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function ProducerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

