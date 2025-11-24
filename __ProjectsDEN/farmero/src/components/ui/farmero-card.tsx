/**
 * Farmero Card Component
 * 
 * Standardized card wrapper based on homepage design
 * Extends farme-ui Card with consistent styling
 */

'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from 'farme-ui'
import { cn } from '@/lib/utils/cn'
import type { CardProps as FarmeCardProps, CardContentProps } from 'farme-ui'

export interface FarmeroCardProps extends Omit<FarmeCardProps, 'variant'> {
  variant?: 'default' | 'elevated' | 'muted'
  rounded?: 'xl' | '2xl' | '3xl'
}

/**
 * Standardized Card wrapper
 * 
 * Default styling matches homepage:
 * - rounded-2xl
 * - border-border/60
 * - shadow-sm
 * - bg-card
 */
export function FarmeroCard({ 
  className, 
  variant = 'default',
  rounded = '2xl',
  ...props 
}: FarmeroCardProps) {
  const roundedClass = {
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-[32px]',
  }[rounded]

  const variantClasses = {
    default: 'border-border/60 shadow-sm hover:shadow-md bg-card',
    elevated: 'border-border/60 shadow-md hover:shadow-lg bg-card',
    muted: 'border-border/40 shadow-sm bg-muted/30',
  }

  return (
    <Card
      className={cn(
        roundedClass,
        variantClasses[variant],
        'transition-all duration-300',
        className
      )}
      {...props}
    />
  )
}

/**
 * Standardized CardContent with consistent padding
 */
export function FarmeroCardContent({ 
  className, 
  padding = 'md',
  ...props 
}: CardContentProps & { padding?: 'sm' | 'md' | 'lg' }) {
  const paddingClass = {
    sm: 'p-4 md:p-5',
    md: 'p-6 md:p-8',
    lg: 'p-8 md:p-10',
  }[padding]

  return (
    <CardContent
      className={cn(paddingClass, className)}
      {...props}
    />
  )
}

// Re-export other card components for convenience
export { CardHeader, CardTitle, CardDescription, CardFooter }

