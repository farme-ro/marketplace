/**
 * Server-side i18n helper
 * 
 * For use in server components and generateMetadata functions
 */

import { cookies } from 'next/headers'
import type { AppLocale } from './config'
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from './config'

export type Locale = AppLocale

interface Translations {
  [key: string]: string | Translations
}

// Cache for translations
const translationCache: Partial<Record<AppLocale, Translations | null>> = {
  ro: null,
  en: null,
  fr: null,
  it: null,
  es: null,
  de: null,
  uk: null,
  hu: null,
}

/**
 * Load translations for a locale (server-side)
 */
async function loadTranslations(locale: AppLocale = DEFAULT_LOCALE): Promise<Translations> {
  // Check cache first
  if (translationCache[locale]) {
    return translationCache[locale]!
  }

  try {
    const translations = await import(`./translations/${locale}.json`)
    const loaded = translations.default || translations
    translationCache[locale] = loaded
    return loaded
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error(`[I18n Server] Failed to load translations for locale: ${locale}`, error)
    }
    // Fallback to Romanian
    if (locale !== DEFAULT_LOCALE) {
      return loadTranslations(DEFAULT_LOCALE)
    }
    return {}
  }
}

/**
 * Get translation value from nested object
 */
function getNestedValue(obj: Translations, key: string): string | undefined {
  const keys = key.split('.')
  let value: string | Translations = obj

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      return undefined
    }
  }

  return typeof value === 'string' ? value : undefined
}

/**
 * Translation function for server components
 * 
 * @param locale - The locale to use (defaults to DEFAULT_LOCALE)
 * @param key - Translation key (e.g., 'about.hero.title')
 * @param fallback - Fallback text if key not found
 * @returns Translated string
 */
export async function getTranslation(
  locale: AppLocale = DEFAULT_LOCALE,
  key: string,
  fallback?: string
): Promise<string> {
  const translations = await loadTranslations(locale)
  const value = getNestedValue(translations, key)
  return value || fallback || key
}

/**
 * Get multiple translations at once
 */
export async function getTranslations(
  locale: AppLocale = DEFAULT_LOCALE,
  keys: string[]
): Promise<Record<string, string>> {
  const translations = await loadTranslations(locale)
  const result: Record<string, string> = {}

  for (const key of keys) {
    const value = getNestedValue(translations, key)
    result[key] = value || key
  }

  return result
}

/**
 * Get locale from cookies (server-side)
 * Falls back to DEFAULT_LOCALE if not found or invalid
 * 
 * @returns The locale from cookies or DEFAULT_LOCALE as default
 */
export async function getLocale(): Promise<AppLocale> {
  try {
    const cookieStore = await cookies()
    const localeCookie = cookieStore.get('locale')
    
    if (localeCookie?.value) {
      const locale = localeCookie.value
      // Validate locale
      if (SUPPORTED_LOCALES.includes(locale as AppLocale)) {
        return locale as AppLocale
      }
    }
  } catch (error) {
    // cookies() can throw in some edge cases (e.g., during static generation)
    // Fall back to default locale
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('[I18n Server] Could not read locale from cookies, using default:', error)
    }
  }
  
  return DEFAULT_LOCALE
}

