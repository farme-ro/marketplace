/**
 * Analytics Configuration
 * 
 * Configurare pentru sistemul de tracking analytics.
 * Momentan nu este implementat un tool concret (GA, Plausible, etc.),
 * dar structura este pregătită pentru viitoarele integrări.
 */

/**
 * Enable/disable analytics tracking
 * 
 * Setează la `true` când vrei să activezi tracking-ul (chiar dacă e doar console.debug pentru moment)
 * Setează la `false` pentru a dezactiva complet tracking-ul
 */
export const ANALYTICS_ENABLED = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true' || false

/**
 * Analytics provider type
 * 
 * Poate fi: 'google-analytics' | 'plausible' | 'custom' | 'none'
 * Momentan este 'none' - doar console.debug
 */
export type AnalyticsProvider = 'google-analytics' | 'plausible' | 'custom' | 'none'

/**
 * Current analytics provider
 * 
 * Note: Update this when a concrete analytics provider is integrated
 */
export const ANALYTICS_PROVIDER: AnalyticsProvider = 'none'

/**
 * Debug mode - log events to console even when disabled
 * 
 * Setează la `true` pentru a vedea toate evenimentele în consolă (development)
 */
export const ANALYTICS_DEBUG = process.env.NODE_ENV === 'development' || false

