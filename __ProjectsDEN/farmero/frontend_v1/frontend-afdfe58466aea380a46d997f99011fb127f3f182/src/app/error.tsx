/**
 * Global Error Page
 * 
 * Pagină pentru erori globale (500, etc.)
 */

'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from 'farme-ui'
import { Card, CardContent } from 'farme-ui'
import { AlertCircle, Home, RefreshCw } from 'lucide-react'
import { captureException } from '@/lib/sentry'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Global error:', error)
    }
    
    // Log to error tracking service (Sentry)
    captureException(error, {
      digest: error.digest,
    })
  }, [error])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full text-center">
        <Card className="border border-destructive/30 rounded-2xl shadow-premium bg-card">
          <CardContent className="p-8 md:p-12">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Ceva nu a mers bine
              </h1>
              <p className="text-base md:text-lg text-foreground-body max-w-md mx-auto mb-2">
                A apărut o eroare neașteptată. Te rugăm să încerci din nou.
              </p>
              {process.env.NODE_ENV === 'development' && error.message && (
                <p className="text-sm text-muted-foreground mt-4 p-3 bg-muted rounded-lg">
                  <strong>Eroare:</strong> {error.message}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button onClick={reset} size="lg" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Încearcă din nou
              </Button>
              <Link href="/">
                <Button variant="outline" size="lg" className="gap-2">
                  <Home className="w-4 h-4" />
                  Mergi la homepage
                </Button>
              </Link>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Dacă problema persistă, te rugăm să ne contactezi la support@farme.ro</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

