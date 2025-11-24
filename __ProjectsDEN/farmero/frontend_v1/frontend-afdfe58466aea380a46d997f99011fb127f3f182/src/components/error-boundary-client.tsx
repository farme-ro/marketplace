/**
 * Error Boundary Client Component
 * 
 * Wrapper client component pentru ErrorBoundary cu suport i18n
 */

'use client'

import { ErrorBoundary as ErrorBoundaryClass } from './error-boundary'
import { I18nErrorFallback } from './error-boundary-fallback'

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundaryClass fallback={<I18nErrorFallback />}>
      {children}
    </ErrorBoundaryClass>
  )
}

