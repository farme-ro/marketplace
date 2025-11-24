/**
 * Grid System
 * 
 * Standardized grid and container system for consistent layout
 */

import { cn } from '@/lib/utils/cn'

/**
 * Main container max-width
 */
export const containerMaxWidth = 'max-w-8xl'

/**
 * Standard container classes
 */
export const container = cn(
  containerMaxWidth,
  'mx-auto',
  'px-4 sm:px-6 lg:px-8'
)

/**
 * Section spacing classes
 */
export const sectionSpacing = {
  vertical: 'py-12 md:py-16 lg:py-20',
  verticalSmall: 'py-8 md:py-12',
  verticalLarge: 'py-16 md:py-24 lg:py-32',
}

/**
 * Grid gap classes
 */
export const gridGap = {
  small: 'gap-3',
  medium: 'gap-4 lg:gap-6',
  large: 'gap-6 lg:gap-8',
}

