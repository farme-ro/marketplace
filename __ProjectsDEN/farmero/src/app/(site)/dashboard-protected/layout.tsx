import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Protected Page Example - farme.ro',
  description: 'Example of a protected page',
  robots: {
    index: false,
    follow: false,
  },
}

export default function DashboardProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

