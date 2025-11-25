/**
 * Skeleton Loader Component
 * 
 * Elegant skeleton loaders for loading states
 * Adapted to light/dark theme with subtle animation
 */

'use client'

import { cn } from '@/lib/utils/cn'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'card'
  width?: string | number
  height?: string | number
  className?: string
}

export function Skeleton({ 
  variant = 'rectangular', 
  width, 
  height,
  className,
  ...props 
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-muted rounded'

  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    card: 'rounded-2xl',
  }

  const style: React.CSSProperties = {}
  if (width) style.width = typeof width === 'number' ? `${width}px` : width
  if (height) style.height = typeof height === 'number' ? `${height}px` : height

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      style={style}
      {...props}
    />
  )
}

/**
 * Skeleton Card - Pre-configured skeleton for card layouts
 */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-2xl border border-border bg-card p-6 space-y-4', className)}>
      <Skeleton variant="rectangular" height={24} width="60%" />
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="80%" />
    </div>
  )
}

/**
 * Skeleton Product Card - For product grid loading
 */
export function SkeletonProductCard() {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <Skeleton variant="rectangular" height={200} className="w-full" />
      <div className="p-4 space-y-3">
        <Skeleton variant="text" width="70%" height={20} />
        <Skeleton variant="text" width="50%" height={16} />
        <Skeleton variant="text" width="40%" height={24} />
      </div>
    </div>
  )
}

/**
 * Skeleton Dashboard Stats - For KPI cards
 */
export function SkeletonDashboardStats() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton variant="circular" width={48} height={48} />
        <Skeleton variant="text" width={60} height={16} />
      </div>
      <Skeleton variant="text" width="50%" height={32} />
      <Skeleton variant="text" width="70%" height={16} />
    </div>
  )
}

