/**
 * Status Badge Component
 * 
 * Standardized badge for statuses (orders, subscriptions, deliveries, etc.)
 * Based on Farmero design: soft colors, consistent border-radius, icon support
 */

'use client'

import { cn } from '@/lib/utils/cn'
import type { LucideIcon } from 'lucide-react'
import { CheckCircle2, Clock, XCircle, AlertCircle, Package, Truck, CheckCircle } from 'lucide-react'

export type StatusBadgeVariant = 
  | 'success' 
  | 'pending' 
  | 'warning' 
  | 'error' 
  | 'info' 
  | 'processing'
  | 'delivered'
  | 'cancelled'

export interface StatusBadgeProps {
  label: string
  variant: StatusBadgeVariant
  icon?: LucideIcon
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const variantConfig: Record<StatusBadgeVariant, {
  bg: string
  text: string
  border: string
  icon?: LucideIcon
}> = {
  success: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-400',
    border: 'border-green-200 dark:border-green-800',
    icon: CheckCircle2,
  },
  pending: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    text: 'text-yellow-700 dark:text-yellow-400',
    border: 'border-yellow-200 dark:border-yellow-800',
    icon: Clock,
  },
  warning: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800',
    icon: AlertCircle,
  },
  error: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800',
    icon: XCircle,
  },
  info: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
    icon: AlertCircle,
  },
  processing: {
    bg: 'bg-primary/10 dark:bg-primary/15',
    text: 'text-primary',
    border: 'border-primary/20',
    icon: Package,
  },
  delivered: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-400',
    border: 'border-green-200 dark:border-green-800',
    icon: Truck,
  },
  cancelled: {
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-700 dark:text-gray-300',
    border: 'border-gray-200 dark:border-gray-700',
    icon: XCircle,
  },
}

const sizeClasses = {
  sm: {
    container: 'px-2 py-0.5 text-xs',
    icon: 'w-3 h-3',
  },
  md: {
    container: 'px-3 py-1 text-xs',
    icon: 'w-3.5 h-3.5',
  },
  lg: {
    container: 'px-4 py-1.5 text-sm',
    icon: 'w-4 h-4',
  },
}

export function StatusBadge({ 
  label, 
  variant, 
  icon: IconProp,
  size = 'md',
  className 
}: StatusBadgeProps) {
  const config = variantConfig[variant]
  const sizes = sizeClasses[size]
  const Icon = IconProp || config.icon

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        sizes.container,
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      {Icon && <Icon className={sizes.icon} />}
      {label}
    </span>
  )
}

