/**
 * Typography Scale
 * 
 * Standardized typography classes for consistent text styling across the app
 * Based on homepage design patterns
 */

export const typography = {
  // Page titles (h1)
  pageTitle: {
    base: 'text-3xl md:text-4xl font-bold tracking-tight text-foreground',
    // For very large hero titles
    hero: 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-foreground',
  },

  // Section titles (h2)
  sectionTitle: {
    base: 'text-2xl md:text-3xl font-semibold tracking-tight text-foreground',
    large: 'text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground',
  },

  // Card titles (h3)
  cardTitle: {
    base: 'text-base md:text-lg font-semibold text-foreground',
    large: 'text-lg md:text-xl font-bold text-foreground',
  },

  // Body text
  body: {
    base: 'text-base text-foreground-body leading-relaxed',
    small: 'text-sm text-muted-foreground leading-relaxed',
    large: 'text-lg md:text-xl text-foreground-body leading-relaxed',
  },

  // Descriptions
  description: {
    base: 'text-sm text-muted-foreground leading-relaxed',
    large: 'text-base md:text-lg text-muted-foreground leading-relaxed',
  },
} as const

