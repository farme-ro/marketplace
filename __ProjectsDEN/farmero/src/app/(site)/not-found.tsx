/**
 * Not Found Page for (site) route group
 * 
 * Handles 404 errors within the site route group
 */

'use client'

import Link from 'next/link'
import { Button } from 'farme-ui'
import { Home } from 'lucide-react'
import { SiteLayoutClient } from '@/components/layout/site-layout-client'

export default function SiteNotFound() {
  return (
    <SiteLayoutClient>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 md:py-16 lg:py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-8xl font-black text-primary/20 mb-6">404</h1>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Pagina nu a fost găsită
          </h2>
          <p className="text-base md:text-lg text-muted-foreground mb-8">
            Se pare că pagina pe care o cauți nu există sau a fost mutată.
          </p>
          <Link href="/">
            <Button size="lg" className="gap-2">
              <Home className="w-4 h-4" />
              Mergi la homepage
            </Button>
          </Link>
        </div>
      </div>
    </SiteLayoutClient>
  )
}

