/**
 * Lazy Loading Utilities
 * 
 * Utilități pentru lazy loading de componente
 */

'use client'

import { lazy, Suspense, ComponentType } from 'react'
import { Skeleton } from './loading-skeleton'

/**
 * Lazy load a component with a loading fallback
 */
export function lazyLoad<P = {}>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFunc)

  return function LazyWrapper(props: P) {
    return (
      <Suspense fallback={fallback || <Skeleton className="h-64 w-full" />}>
        {/* @ts-expect-error - Props type inference issue with lazy components */}
        <LazyComponent {...props} />
      </Suspense>
    )
  }
}

/**
 * Lazy load with custom loading component
 */
export function lazyLoadWithFallback<P = {}>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  FallbackComponent: ComponentType
) {
  const LazyComponent = lazy(importFunc)

  return function LazyWrapper(props: P) {
    return (
      <Suspense fallback={<FallbackComponent />}>
        {/* @ts-expect-error - Props type inference issue with lazy components */}
        <LazyComponent {...props} />
      </Suspense>
    )
  }
}

