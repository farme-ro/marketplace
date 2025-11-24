/**
 * Error Boundary Fallback Component
 * 
 * Fallback component pentru ErrorBoundary cu suport i18n
 */

'use client'

import { Button } from 'farme-ui'
import { useI18n } from '@/lib/i18n/context'
import { AlertCircle, Home, RefreshCw } from 'lucide-react'

export function I18nErrorFallback({ error, reset }: { error?: Error; reset?: () => void }) {
  const { t } = useI18n()

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-destructive" />
          <h2 className="text-2xl font-bold text-foreground">
            {t('errors.boundary.title', 'Ceva nu a mers bine')}
          </h2>
        </div>
        <p className="text-muted-foreground mb-4">
          {t('errors.boundary.description', 'A apărut o eroare neașteptată. Te rugăm să încerci din nou.')}
        </p>
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mb-4">
            <summary className="cursor-pointer text-sm text-muted-foreground mb-2">
              {t('errors.boundary.details', 'Detalii eroare (development)')}
            </summary>
            <pre className="text-xs bg-muted p-4 rounded overflow-auto">
              {error.toString()}
              {error.stack && (
                <>
                  {'\n\n'}
                  {error.stack}
                </>
              )}
            </pre>
          </details>
        )}
        <div className="flex gap-4">
          {reset && (
            <Button variant="default" onClick={reset} className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              {t('errors.boundary.retry', 'Încearcă din nou')}
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            {t('errors.boundary.goHome', 'Mergi la homepage')}
          </Button>
        </div>
      </div>
    </div>
  )
}

