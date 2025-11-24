import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Backend Test - farme.ro',
  description: 'Test page for backend API connectivity',
  robots: {
    index: false,
    follow: false,
  },
}

export default function BackendTestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

