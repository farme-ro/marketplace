/**
 * Empty State Component
 * 
 * Component unificat pentru empty states în întreaga aplicație.
 * 
 * Standard: Icon + Titlu + Subtitlu + Opțional CTA
 * 
 * @example
 * ```tsx
 * <EmptyState
 *   icon={Package}
 *   title="Nu ai comenzi"
 *   description="Începe să cumperi pentru a vedea comenzile tale aici."
 *   action={{
 *     label: "Vezi produsele",
 *     href: "/products"
 *   }}
 * />
 * ```
 */

'use client'

import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'
import { Button } from 'farme-ui'
import { Card, CardContent } from 'farme-ui'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

export interface EmptyStateAction {
  label: string
  href?: string
  onClick?: () => void
  variant?: 'default' | 'outline' | 'ghost'
}

export interface EmptyStateProps {
  /**
   * Icon component (from lucide-react)
   */
  icon?: LucideIcon
  
  /**
   * Optional illustration type (for animated SVG)
   */
  illustration?: 'empty-box' | 'empty-cart' | 'empty-orders' | 'empty-products' | 'empty-subscriptions'
  
  /**
   * Title text (empathic, warm tone)
   */
  title: string
  
  /**
   * Description/subtitle text (encouraging, helpful)
   */
  description?: string
  
  /**
   * Optional action button
   */
  action?: EmptyStateAction
  
  /**
   * Optional custom content (rendered below description)
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
    icon: 'w-12 h-12',
    iconContainer: 'w-16 h-16',
    title: 'text-lg',
    description: 'text-sm',
    spacing: 'py-8',
  },
  md: {
    icon: 'w-14 h-14',
    iconContainer: 'w-20 h-20',
    title: 'text-xl',
    description: 'text-base',
    spacing: 'py-12 md:py-16',
  },
  lg: {
    icon: 'w-16 h-16',
    iconContainer: 'w-24 h-24',
    title: 'text-2xl',
    description: 'text-lg',
    spacing: 'py-16 md:py-20',
  },
}

export function EmptyState({
  icon: Icon,
  illustration,
  title,
  description,
  action,
  children,
  size = 'md',
  card = true,
  className,
}: EmptyStateProps) {
  const sizes = sizeClasses[size]
  
  const content = (
    <div className={cn('text-center', sizes.spacing, className)}>
      {/* Icon or Illustration */}
      {illustration ? (
        <div className={cn('mx-auto mb-6', sizes.iconContainer)}>
          {/* Note: Animated illustrations can be added when Lottie or similar library is integrated */}
          <div className={cn(
            'w-full h-full rounded-2xl bg-primary/10 flex items-center justify-center',
            'animate-pulse'
          )}>
            {Icon && <Icon className={cn('text-primary', sizes.icon)} />}
          </div>
        </div>
      ) : Icon ? (
        <div className={cn(
          'mx-auto mb-6 rounded-full bg-muted flex items-center justify-center',
          sizes.iconContainer
        )}>
          <Icon className={cn('text-muted-foreground', sizes.icon)} />
        </div>
      ) : null}
      
      {/* Title */}
      <h3 className={cn(
        'font-semibold text-foreground mb-2',
        sizes.title
      )}>
        {title}
      </h3>
      
      {/* Description */}
      {description && (
        <p className={cn(
          'text-muted-foreground mb-6 max-w-md mx-auto',
          sizes.description
        )}>
          {description}
        </p>
      )}
      
      {/* Custom content */}
      {children}
      
      {/* Action button */}
      {action && (
        <div className="mt-6">
          {action.href ? (
            <Link href={action.href}>
              <Button
                variant={action.variant || 'default'}
                size="lg"
                className="rounded-xl"
              >
                {action.label}
              </Button>
            </Link>
          ) : action.onClick ? (
            <Button
              variant={action.variant || 'default'}
              size="lg"
              onClick={action.onClick}
              className="rounded-xl"
            >
              {action.label}
            </Button>
          ) : null}
        </div>
      )}
    </div>
  )
  
  if (card) {
    return (
      <Card className="border-border/60 rounded-2xl shadow-sm">
        <CardContent className="p-8 md:p-12">
          {content}
        </CardContent>
      </Card>
    )
  }
  
  return content
}

