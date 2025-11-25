/**
 * Focus States
 * 
 * Standardized focus styles for accessibility
 * Clear, visible outline that works in both light and dark mode
 */

import { cn } from '@/lib/utils/cn'

/**
 * Standard focus ring classes
 * 
 * Usage:
 * className={cn('...', focusRing)}
 */
export const focusRing = cn(
  'focus:outline-none',
  'focus:ring-2',
  'focus:ring-primary',
  'focus:ring-offset-2',
  'focus:ring-offset-background',
  'dark:focus:ring-offset-background'
)

/**
 * Focus ring for interactive elements (buttons, links)
 */
export const focusRingInteractive = cn(
  focusRing,
  'focus-visible:ring-2',
  'focus-visible:ring-primary'
)

/**
 * Focus ring for form inputs
 */
export const focusRingInput = cn(
  'focus:outline-none',
  'focus:ring-2',
  'focus:ring-primary',
  'focus:border-primary',
  'transition-all duration-200'
)

