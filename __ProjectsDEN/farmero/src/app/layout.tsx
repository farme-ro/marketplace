/**
 * Root Layout
 * 
 * Layout-ul principal al aplicației Next.js
 * Include providerii necesari și structura de bază
 */

import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display, Manrope } from 'next/font/google'
import { AuthProvider } from '@/lib/auth/context'
import { I18nProvider } from '@/lib/i18n/context'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { AccountProvider } from '@/components/providers/AccountProvider'
import { ToastProvider } from '@/components/ui/toast'
import { HtmlLangUpdater } from '@/components/layout/html-lang-updater'
import { ColorFixScript } from '@/components/layout/color-fix-script'
import { I18nInitScript } from '@/components/layout/i18n-init-script'
import { ServiceWorkerRegister } from '@/components/pwa/service-worker-register'
import { ErrorBoundary } from '@/components/error-boundary-client'
import { SkipToContent } from '@/components/layout/skip-to-content'
import { getLocale } from '@/lib/i18n/server'
import { cn } from '@/lib/utils/cn'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
})

const manrope = Manrope({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body-alt',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://farme.ro'),
  title: {
    default: 'farme.ro - Marketplace pentru produse agricole tradiționale',
    template: '%s | farme.ro',
  },
  description: 'Descoperă produse agricole tradiționale și bio de la producători locali din România.',
  keywords: ['produse agricole', 'produse tradiționale', 'produse bio', 'producători locali', 'România', 'marketplace'],
  authors: [{ name: 'farme.ro' }],
  creator: 'farme.ro',
  publisher: 'farme.ro',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Farmero',
  },
  icons: {
    icon: '/icons/favicon-196.png',
    apple: '/icons/apple-icon-180.png',
  },
  openGraph: {
    type: 'website',
    locale: 'ro_RO',
    url: 'https://farme.ro',
    siteName: 'farme.ro',
    title: 'farme.ro - Marketplace pentru produse agricole tradiționale',
    description: 'Descoperă produse agricole tradiționale și bio de la producători locali din România.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'farme.ro - Marketplace pentru produse agricole tradiționale',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'farme.ro - Marketplace pentru produse agricole tradiționale',
    description: 'Descoperă produse agricole tradiționale și bio de la producători locali din România.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://farme.ro',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#4A8B5F' },
    { media: '(prefers-color-scheme: dark)', color: '#46C070' },
  ],
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get locale from cookies to sync server and client
  const locale = await getLocale()
  
  return (
    <html lang={locale} suppressHydrationWarning className={cn(inter.variable, manrope.variable, 'bg-background text-foreground')}>
      <head>
        {/* Color fix is handled by ColorFixScript component */}
        <link rel="apple-touch-icon" href="/farmero.png" />
        <link rel="icon" type="image/png" href="/farmero.png" />
        {/* Modern mobile web app capability (replaces deprecated apple-mobile-web-app-capable) */}
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={cn(inter.variable, manrope.variable, 'font-body min-h-screen bg-background text-foreground transition-colors duration-300 antialiased')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <ColorFixScript />
          <I18nInitScript />
          <ServiceWorkerRegister />
          <I18nProvider>
            <HtmlLangUpdater />
            <SkipToContent />
            <AuthProvider>
              <AccountProvider>
                <ToastProvider>
                  <ErrorBoundary>
                    {children}
                  </ErrorBoundary>
                </ToastProvider>
              </AccountProvider>
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

