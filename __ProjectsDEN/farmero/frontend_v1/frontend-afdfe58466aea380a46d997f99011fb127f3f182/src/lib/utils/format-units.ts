/**
 * Unit Formatting Utilities
 * 
 * Utility functions for formatting units (weight, volume, pieces, etc.)
 * with locale-aware formatting and i18n support.
 */

import type { Locale } from '@/lib/i18n/context'

/**
 * Format a unit value with its unit label
 * 
 * @param value - Numeric value
 * @param unit - Unit code (e.g., 'kg', 'g', 'l', 'ml', 'piece')
 * @param locale - Locale code (default: 'ro')
 * @param t - Translation function from useI18n()
 * @returns Formatted string (e.g., "2.5 kg", "10 buc")
 * 
 * @example
 * const { t, locale } = useI18n()
 * formatUnit(2.5, 'kg', locale, t) // "2.5 kg" (RO) or "2.5 kg" (EN)
 * formatUnit(10, 'piece', locale, t) // "10 buc" (RO) or "10 pcs" (EN)
 */
export function formatUnit(
  value: number,
  unit: string,
  locale: Locale,
  t: (key: string, fallback?: string) => string
): string {
  // Get translated unit label
  const unitKey = `ui.units.${unit}`
  const unitLabel = t(unitKey, unit) // Fallback to unit code if translation not found
  
  // Format number based on locale
  const formattedValue = new Intl.NumberFormat(
    locale === 'ro' ? 'ro-RO' : 
    locale === 'en' ? 'en-US' :
    locale === 'fr' ? 'fr-FR' :
    locale === 'it' ? 'it-IT' :
    locale === 'es' ? 'es-ES' :
    'de-DE',
    {
      minimumFractionDigits: unit === 'piece' ? 0 : 2,
      maximumFractionDigits: unit === 'piece' ? 0 : 2,
    }
  ).format(value)
  
  return `${formattedValue} ${unitLabel}`
}

/**
 * Format weight (kg, g)
 * 
 * @param weight - Weight in grams
 * @param locale - Locale code
 * @param t - Translation function
 * @returns Formatted weight string
 */
export function formatWeight(
  weight: number,
  locale: Locale,
  t: (key: string, fallback?: string) => string
): string {
  if (weight >= 1000) {
    return formatUnit(weight / 1000, 'kg', locale, t)
  }
  return formatUnit(weight, 'g', locale, t)
}

/**
 * Format volume (l, ml)
 * 
 * @param volume - Volume in milliliters
 * @param locale - Locale code
 * @param t - Translation function
 * @returns Formatted volume string
 */
export function formatVolume(
  volume: number,
  locale: Locale,
  t: (key: string, fallback?: string) => string
): string {
  if (volume >= 1000) {
    return formatUnit(volume / 1000, 'l', locale, t)
  }
  return formatUnit(volume, 'ml', locale, t)
}

