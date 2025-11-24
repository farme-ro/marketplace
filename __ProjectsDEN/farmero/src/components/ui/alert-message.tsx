/**
 * Alert Message Component
 * 
 * Standardized alert/message component for success, warning, error, info
 * Visual system: icon + border left color + background soft
 */

'use client'

import { cn } from '@/lib/utils/cn'
import { CheckCircle2, AlertCircle, XCircle, Info, type LucideIcon } from 'lucide-react'

export type AlertVariant = 'success' | 'warning' | 'error' | 'info'

export interface AlertMessageProps {
  variant: AlertVariant
  title?: string
  description: string
  className?: string
  icon?: LucideIcon
}

const variantConfig: Record<AlertVariant, {
  bg: string
  border: string
  text: string
  icon: LucideIcon
}> = {
  success: {
    bg: 'bg-green-50 dark:bg-green-950/20',
    border: 'border-l-4 border-green-500',
    text: 'text-green-800 dark:text-green-200',
    icon: CheckCircle2,
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    border: 'border-l-4 border-amber-500',
    text: 'text-amber-800 dark:text-amber-200',
    icon: AlertCircle,
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-950/20',
    border: 'border-l-4 border-red-500',
    text: 'text-red-800 dark:text-red-200',
    icon: XCircle,
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    border: 'border-l-4 border-blue-500',
    text: 'text-blue-800 dark:text-blue-200',
    icon: Info,
  },
}

export function AlertMessage({ 
  variant, 
  title, 
  description, 
  className,
  icon: IconProp 
}: AlertMessageProps) {
  const config = variantConfig[variant]
  const Icon = IconProp || config.icon

  return (
    <div
      className={cn(
        'rounded-lg p-4',
        config.bg,
        config.border,
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', config.text)} />
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={cn('font-semibold mb-1', config.text)}>
              {title}
            </h4>
          )}
          <p className={cn('text-sm leading-relaxed', config.text)}>
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}

