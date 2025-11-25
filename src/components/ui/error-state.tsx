/**
 * Error State Component
 * 
 * Component unificat pentru error states în componente (nu pagini întregi).
 * 
 * Standard: Icon + Titlu + Mesaj + Opțional acțiune
 * 
 * Pentru pagini întregi de eroare, folosește componentele din `error-pages.tsx`
 * 
 * @example
 * ```tsx
 * <ErrorState
 *   title="Eroare la încărcare"
 *   message="Nu am putut încărca datele. Te rugăm să încerci din nou."
 *   onRetry={() => refetch()}
 * />
 * ```
 */

'use client'

import { ReactNode } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from 'farme-ui'
import { Card, CardContent } from 'farme-ui'
import { cn } from '@/lib/utils/cn'
import { useI18n } from '@/lib/i18n/context'

export interface ErrorStateProps {
  /**
   * Error title
   */
  title?: string
  
  /**
   * Error message/description
   */
  message: string
  
  /**
   * Optional retry action
   */
  onRetry?: () => void
  
  /**
   * Optional custom action
   */
  action?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'outline' | 'ghost'
  }
  
  /**
   * Optional custom content
   */
  children?: ReactNode
  
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg'
  
  /**
   * Whether to wrap in a Card
   */
  card?: boolean
  
  /**
   * Custom className
   */
  className?: string
}

const sizeClasses = {
  sm: {
    icon: 'w-8 h-8',
    iconContainer: 'w-12 h-12',
    title: 'text-lg',
    message: 'text-sm',
    spacing: 'py-6',
  },
  md: {
    icon: 'w-10 h-10',
    iconContainer: 'w-16 h-16',
    title: 'text-xl',
    message: 'text-base',
    spacing: 'py-8',
  },
  lg: {
    icon: 'w-12 h-12',
    iconContainer: 'w-20 h-20',
    title: 'text-2xl',
    message: 'text-lg',
    spacing: 'py-12',
  },
}

export function ErrorState({
  title,
  message,
  onRetry,
  action,
  children,
  size = 'md',
  card = true,
  className,
}: ErrorStateProps) {
  const { t } = useI18n()
  const sizes = sizeClasses[size]
  const finalTitle = title || t('common.error', 'Eroare')
  
  const content = (
    <div className={cn('text-center', sizes.spacing, className)}>
      {/* Icon */}
      <div className={cn(
        'mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center',
        sizes.iconContainer
      )}>
        <AlertCircle className={cn('text-destructive', sizes.icon)} />
      </div>
      
      {/* Title */}
      <h3 className={cn(
        'font-semibold text-foreground mb-2',
        sizes.title
      )}>
        {finalTitle}
      </h3>
      
      {/* Message */}
      <p className={cn(
        'text-muted-foreground mb-6 max-w-md mx-auto',
        sizes.message
      )}>
        {message}
      </p>
      
      {/* Custom content */}
      {children}
      
      {/* Actions */}
      {(onRetry || action) && (
        <div className="flex gap-4 justify-center mt-6">
          {onRetry && (
            <Button
              variant="outline"
              size="lg"
              onClick={onRetry}
              className="rounded-xl gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              {t('common.retry', 'Încearcă din nou')}
            </Button>
          )}
          {action && (
            <Button
              variant={action.variant || 'default'}
              size="lg"
              onClick={action.onClick}
              className="rounded-xl"
            >
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
  
  if (card) {
    return (
      <Card className="border-destructive/30 rounded-2xl shadow-sm bg-card">
        <CardContent className="p-8 md:p-12">
          {content}
        </CardContent>
      </Card>
    )
  }
  
  return content
}

