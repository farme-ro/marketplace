/**
 * Unified Skeleton Components
 * 
 * Componente unificate pentru loading skeletons în întreaga aplicație.
 * 
 * Standard: animate-pulse, bg-muted, rounded-md
 * 
 * @example
 * ```tsx
 * {isLoading ? (
 *   <GridSkeleton count={6} columns={3} />
 * ) : (
 *   <ProductsList products={products} />
 * )}
 * ```
 */

'use client'

import { cn } from '@/lib/utils/cn'

/**
 * Base Skeleton component
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted',
        className
      )}
    />
  )
}

/**
 * Card Skeleton - pentru card-uri generice
 */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-2xl border border-border bg-card p-6', className)}>
      <div className="space-y-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  )
}

/**
 * Product Card Skeleton - pentru card-uri de produse
 */
export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('border border-border rounded-2xl overflow-hidden bg-card', className)}>
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-10 w-24 rounded-full" />
        </div>
      </div>
    </div>
  )
}

/**
 * Producer Card Skeleton - pentru card-uri de producători
 */
export function ProducerCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('border border-border rounded-2xl p-6 bg-card', className)}>
      <div className="flex items-center gap-4 mb-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  )
}

/**
 * List Skeleton - pentru liste de elemente
 */
export function ListSkeleton({ 
  count = 3, 
  className 
}: { 
  count?: number
  className?: string 
}) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

/**
 * Grid Skeleton - pentru grid-uri de elemente
 */
export function GridSkeleton({ 
  count = 6, 
  columns = 3,
  className 
}: { 
  count?: number
  columns?: 1 | 2 | 3 | 4
  className?: string 
}) {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={cn('grid gap-4 md:gap-6', gridClasses[columns], className)}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

/**
 * Table Skeleton - pentru tabele
 */
export function TableSkeleton({ 
  rows = 5, 
  columns = 4,
  className 
}: { 
  rows?: number
  columns?: number
  className?: string 
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className={cn('grid gap-4 pb-2 border-b border-border')} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={cn('grid gap-4')} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} className="h-4" />
          ))}
        </div>
      ))}
    </div>
  )
}

/**
 * Page Skeleton - pentru pagini întregi
 */
export function PageSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('container mx-auto px-4 py-8', className)}>
      <Skeleton className="h-10 w-1/3 mb-8" />
      <GridSkeleton count={6} columns={3} />
    </div>
  )
}

