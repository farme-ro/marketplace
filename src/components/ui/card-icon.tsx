/**
 * Card Icon Component
 * 
 * Standardized icon container for cards
 * Based on homepage design: rounded-2xl, accent background, consistent sizing
 */

'use client'

import { cn } from '@/lib/utils/cn'
import type { LucideIcon } from 'lucide-react'

export interface CardIconProps {
  icon: LucideIcon | React.ComponentType<{ className?: string }>
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'emerald' | 'amber' | 'orange' | 'blue' | 'green'
  className?: string
}

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-20 h-20 md:w-24 md:h-24',
  lg: 'w-28 h-28 md:w-32 md:h-32',
}

const iconSizeClasses = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
}

const variantClasses = {
  primary: {
    bg: 'bg-primary/10 dark:bg-primary/15',
    text: 'text-primary',
    border: 'border-primary/20',
  },
  emerald: {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/20',
  },
  amber: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/15',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-500/20',
  },
  orange: {
    bg: 'bg-orange-500/10 dark:bg-orange-500/15',
    text: 'text-orange-600 dark:text-orange-400',
    border: 'border-orange-500/20',
  },
  blue: {
    bg: 'bg-blue-500/10 dark:bg-blue-500/15',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-500/20',
  },
  green: {
    bg: 'bg-green-500/10 dark:bg-green-500/15',
    text: 'text-green-600 dark:text-green-400',
    border: 'border-green-500/20',
  },
}

export function CardIcon({ icon: Icon, size = 'md', variant = 'primary', className }: CardIconProps) {
  const variantStyle = variantClasses[variant]

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-2xl',
        sizeClasses[size],
        variantStyle.bg,
        variantStyle.text,
        'border border-border/40',
        className
      )}
    >
      <Icon className={cn(iconSizeClasses[size])} />
    </div>
  )
}

