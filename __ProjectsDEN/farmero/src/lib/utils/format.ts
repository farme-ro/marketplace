/**
 * Formatting Utilities
 * 
 * Utility functions for formatting numbers, currency, dates, etc.
 * All functions support locale-aware formatting for internationalization.
 * 
 * Locale mapping:
 * - 'ro' -> 'ro-RO'
 * - 'en' -> 'en-US'
 * - 'fr' -> 'fr-FR'
 * - 'it' -> 'it-IT'
 * - 'es' -> 'es-ES'
 * - 'de' -> 'de-DE'
 * - 'uk' -> 'uk-UA'
 * - 'hu' -> 'hu-HU'
 */

import type { AppLocale } from '@/lib/i18n/config'

type Locale = AppLocale

/**
 * Map locale code to Intl locale string
 */
function getIntlLocale(locale: Locale): string {
  const localeMap: Record<AppLocale, string> = {
    'ro': 'ro-RO',
    'en': 'en-US',
    'fr': 'fr-FR',
    'it': 'it-IT',
    'es': 'es-ES',
    'de': 'de-DE',
    'uk': 'uk-UA',
    'hu': 'hu-HU',
  }
  return localeMap[locale] || 'ro-RO'
}

/**
 * Get currency code for locale
 * Default: RON for all locales (can be extended for multi-currency support)
 */
function getCurrencyForLocale(locale: Locale): string {
  // For now, all locales use RON
  // In the future, this can be extended to support EUR, USD, etc. based on locale
  return 'RON'
}

/**
 * Format a number as currency
 * 
 * @param amount - Amount to format
 * @param locale - Locale code (default: 'ro')
 * @param currency - Currency code (default: based on locale, fallback: 'RON')
 * @returns Formatted currency string
 * 
 * @example
 * formatCurrency(1234.56, 'ro') // "1.234,56 RON"
 * formatCurrency(1234.56, 'en') // "RON 1,234.56"
 * formatCurrency(1234.56, 'fr') // "1 234,56 RON"
 */
export function formatCurrency(
  amount: number,
  locale: Locale = 'ro',
  currency?: string
): string {
  const intlLocale = getIntlLocale(locale)
  const currencyCode = currency || getCurrencyForLocale(locale)
  
  return new Intl.NumberFormat(intlLocale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format a number with thousand separators
 * 
 * @param number - Number to format
 * @param locale - Locale code (default: 'ro')
 * @returns Formatted number string
 * 
 * @example
 * formatNumber(1234567.89, 'ro') // "1.234.567,89"
 * formatNumber(1234567.89, 'en') // "1,234,567.89"
 */
export function formatNumber(number: number, locale: Locale = 'ro'): string {
  const intlLocale = getIntlLocale(locale)
  return new Intl.NumberFormat(intlLocale).format(number)
}

/**
 * Format a date
 * 
 * @param date - Date string or Date object
 * @param locale - Locale code (default: 'ro')
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 * 
 * @example
 * formatDate(new Date(), 'ro') // "15.01.2024"
 * formatDate(new Date(), 'en') // "1/15/2024"
 * formatDate(new Date(), 'ro', { year: 'numeric', month: 'long', day: 'numeric' }) // "15 ianuarie 2024"
 */
export function formatDate(
  date: string | Date,
  locale: Locale = 'ro',
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const intlLocale = getIntlLocale(locale)
  return new Intl.DateTimeFormat(intlLocale, options).format(dateObj)
}

/**
 * Format a date and time
 * 
 * @param date - Date string or Date object
 * @param locale - Locale code (default: 'ro')
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date and time string
 */
export function formatDateTime(
  date: string | Date,
  locale: Locale = 'ro',
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const intlLocale = getIntlLocale(locale)
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  }
  
  return new Intl.DateTimeFormat(intlLocale, defaultOptions).format(dateObj)
}

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 * 
 * @param date - Date string or Date object
 * @param locale - Locale code (default: 'ro')
 * @returns Formatted relative time string
 */
export function formatRelativeTime(
  date: string | Date,
  locale: Locale = 'ro'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const intlLocale = getIntlLocale(locale)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)
  
  const rtf = new Intl.RelativeTimeFormat(intlLocale, { numeric: 'auto' })
  
  const intervals = [
    { unit: 'year' as const, seconds: 31536000 },
    { unit: 'month' as const, seconds: 2592000 },
    { unit: 'week' as const, seconds: 604800 },
    { unit: 'day' as const, seconds: 86400 },
    { unit: 'hour' as const, seconds: 3600 },
    { unit: 'minute' as const, seconds: 60 },
  ]
  
  for (const interval of intervals) {
    const count = Math.floor(Math.abs(diffInSeconds) / interval.seconds)
    if (count >= 1) {
      return rtf.format(diffInSeconds > 0 ? -count : count, interval.unit)
    }
  }
  
  return rtf.format(0, 'second')
}

