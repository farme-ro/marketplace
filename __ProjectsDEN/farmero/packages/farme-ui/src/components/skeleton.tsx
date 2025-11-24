'use client'

import { cn } from '../utils/cn'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rectangular' | 'circular'
  width?: string | number
  height?: string | number
}

function Skeleton({ className, variant, width, height, style, ...props }: SkeletonProps) {
  const styles: React.CSSProperties = {
    ...style,
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  }

  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted',
        variant === 'circular' && 'rounded-full',
        variant === 'text' && 'h-4',
        variant === 'rectangular' && 'rounded-md',
        className
      )}
      style={styles}
      {...props}
    />
  )
}

export { Skeleton }

