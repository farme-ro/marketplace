import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AdminAuthProvider } from '@/lib/auth/admin-auth-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Farmero Admin',
  description: 'Admin dashboard pentru platforma Farmero',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <body className={inter.className}>
        <AdminAuthProvider>{children}</AdminAuthProvider>
      </body>
    </html>
  )
}

