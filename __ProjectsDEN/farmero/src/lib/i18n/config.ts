/**
 * i18n Configuration
 * 
 * Centralized configuration for supported locales and labels
 */

export type AppLocale = 'ro' | 'en' | 'fr' | 'it' | 'de' | 'es' | 'uk' | 'hu'

export const DEFAULT_LOCALE: AppLocale = 'ro'

export const SUPPORTED_LOCALES: AppLocale[] = [
  'ro',
  'en',
  'fr',
  'it',
  'de',
  'es',
  'uk',
  'hu',
]

export const LOCALE_LABELS: Record<AppLocale, string> = {
  ro: 'Română',
  en: 'English',
  fr: 'Français',
  it: 'Italiano',
  de: 'Deutsch',
  es: 'Español',
  uk: 'Українська',
  hu: 'Magyar',
}

// Short labels for footer divider links
export const LOCALE_SHORT_LABELS: Record<AppLocale, string> = {
  ro: 'RO',
  en: 'EN',
  fr: 'FR',
  it: 'IT',
  de: 'DE',
  es: 'ES',
  uk: 'UA',
  hu: 'HU',
}

// Flag emojis for language switcher
export const LOCALE_FLAGS: Record<AppLocale, string> = {
  ro: '🇷🇴',
  en: '🇬🇧',
  fr: '🇫🇷',
  it: '🇮🇹',
  de: '🇩🇪',
  es: '🇪🇸',
  uk: '🇺🇦',
  hu: '🇭🇺',
}

/**
 * Map browser language codes to our supported locales
 * Handles language variants (e.g., en-US -> en, uk-UA -> uk)
 */
export function mapBrowserLocaleToAppLocale(browserLocale: string): AppLocale | null {
  const normalized = browserLocale.toLowerCase().split('-')[0]
  
  // Direct matches
  if (SUPPORTED_LOCALES.includes(normalized as AppLocale)) {
    return normalized as AppLocale
  }
  
  // Special mappings
  const mappings: Record<string, AppLocale> = {
    'ru': 'uk', // Map Russian to Ukrainian for MVP (can be adjusted based on business needs)
  }
  
  return mappings[normalized] || null
}

/**
 * Validate if a locale is supported
 */
export function isValidLocale(locale: string): locale is AppLocale {
  return SUPPORTED_LOCALES.includes(locale as AppLocale)
}

