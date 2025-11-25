/**
 * Spacing Constants
 * 
 * Standardized spacing values for consistent layout
 */

export const spacing = {
  // Section spacing
  section: {
    vertical: 'py-12 md:py-16 lg:py-20',
    verticalSmall: 'py-8 md:py-12',
    verticalLarge: 'py-16 md:py-24 lg:py-32',
  },

  // Card spacing
  card: {
    padding: 'p-6 md:p-8',
    paddingSmall: 'p-4 md:p-5',
    paddingLarge: 'p-8 md:p-10',
    gap: 'gap-4 lg:gap-6',
    gapSmall: 'gap-3',
    gapLarge: 'gap-6 lg:gap-8',
  },

  // Grid spacing
  grid: {
    gap: 'gap-4 lg:gap-6',
    gapSmall: 'gap-3',
    gapLarge: 'gap-6 lg:gap-8',
  },
} as const

