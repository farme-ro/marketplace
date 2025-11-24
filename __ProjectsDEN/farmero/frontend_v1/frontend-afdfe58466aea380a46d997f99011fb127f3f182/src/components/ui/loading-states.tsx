/**
 * Unified Loading States
 * 
 * Componente reutilizabile pentru loading states în întreaga aplicație
 */

'use client'

import { cn } from '@/lib/utils/cn'
import { Loader2 } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

// ============================================================================
// Spinner
// ============================================================================

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

export function Spinner({ size = 'md', className, text }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  )
}

// ============================================================================
// Page Loading
// ============================================================================

export function PageLoading({ message }: { message?: string }) {
  const { t } = useI18n()
  const finalMessage = message || t('common.loading', 'Se încarcă...')
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <Spinner size="lg" text={finalMessage} />
      </div>
    </div>
  )
}

// ============================================================================
// Button Loading
// ============================================================================

export function ButtonLoading({ className }: { className?: string }) {
  return (
    <Loader2 className={cn('animate-spin w-4 h-4', className)} />
  )
}

// ============================================================================
// Card Skeleton
// ============================================================================

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-2xl border border-border bg-card p-6', className)}>
      <div className="space-y-4">
        <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
        <div className="h-4 bg-muted rounded w-5/6 animate-pulse" />
      </div>
    </div>
  )
}

// ============================================================================
// List Skeleton
// ============================================================================

export function ListSkeleton({ count = 3, className }: { count?: number; className?: string }) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

// ============================================================================
// Grid Skeleton
// ============================================================================

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
    <div className={cn('grid gap-4', gridClasses[columns], className)}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

// ============================================================================
// Table Skeleton
// ============================================================================

export function TableSkeleton({ rows = 5, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className="grid grid-cols-4 gap-4 pb-2 border-b border-border">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-4 bg-muted rounded animate-pulse" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, j) => (
            <div key={j} className="h-4 bg-muted rounded animate-pulse" />
          ))}
        </div>
      ))}
    </div>
  )
}

