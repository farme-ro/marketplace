/**
 * Producer Portal Footer
 * 
 * Footer minim pentru portalul producătorilor
 * Nu folosește SiteFooter
 */

import Link from 'next/link'

const currentYear = new Date().getFullYear()

export function ProducerPortalFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>
            farme.ro © {currentYear}
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              Termeni
            </Link>
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Politica de confidențialitate
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

