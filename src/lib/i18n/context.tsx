/**
 * i18n Context and Hook
 * 
 * Provides internationalization support with translations
 * Supports: ro, en, fr, it, es, de, uk, hu
 */

'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { AppLocale } from './config'
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, mapBrowserLocaleToAppLocale } from './config'

export type Locale = AppLocale

interface Translations {
  [key: string]: string | Translations
}

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, fallback?: string) => string
  translations: Translations
  isLoading: boolean
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

// Load translations dynamically
async function loadTranslations(locale: Locale): Promise<Translations> {
  try {
    const translations = await import(`./translations/${locale}.json`)
    return translations.default || translations
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error(`[I18n] Failed to load translations for locale: ${locale}`, error)
    }
    // Fallback to Romanian
    if (locale !== 'ro') {
      const roTranslations = await import(`./translations/ro.json`)
      return roTranslations.default || roTranslations
    }
    return {}
  }
}

// Helper function to get initial locale (can be called on both client and server)
function getInitialLocale(): Locale {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE // Server-side default
  }

  // Try to get from cookie first (to sync with server)
  let savedLocale: Locale | null = null
  let hasSavedPreference = false
  let cookieValue: string | null = null
  
  try {
    const cookies = document.cookie.split(';')
    const localeCookie = cookies.find(c => c.trim().startsWith('locale='))
    if (localeCookie) {
      cookieValue = localeCookie.split('=')[1]?.trim()
      if (cookieValue && SUPPORTED_LOCALES.includes(cookieValue as AppLocale)) {
        savedLocale = cookieValue as Locale
        hasSavedPreference = true
      }
    }
  } catch (error) {
    // Cookie might not be available
  }

  // Try to get from localStorage (this might be more recent than cookie)
  try {
    const localStorageValue = localStorage.getItem('locale')
    if (localStorageValue && SUPPORTED_LOCALES.includes(localStorageValue as AppLocale)) {
      // Prefer localStorage if it exists, as it's more reliable for client-side changes
      savedLocale = localStorageValue as Locale
      hasSavedPreference = true
      
      // Sync to cookie if they differ
      if (savedLocale && cookieValue !== savedLocale) {
        try {
          document.cookie = `locale=${savedLocale}; path=/; max-age=31536000; SameSite=Lax`
        } catch (e) {
          // Cookie setting might fail
        }
      }
    }
  } catch (error) {
    // localStorage might not be available (e.g., in incognito mode)
  }

  // If we found a saved preference, use it (this ensures user's manual selection is always respected)
  if (hasSavedPreference && savedLocale) {
    return savedLocale
  }

  // Only use browser language if NO explicit preference was saved
  // This ensures user's manual selection is always respected
  try {
    const browserLocale = navigator.language
    const mappedLocale = mapBrowserLocaleToAppLocale(browserLocale)
    if (mappedLocale) {
      // Save browser preference for future use
      try {
        localStorage.setItem('locale', mappedLocale)
        document.cookie = `locale=${mappedLocale}; path=/; max-age=31536000; SameSite=Lax`
      } catch (e) {
        // Saving might fail, but we can still use the locale
      }
      return mappedLocale
    }
    
    // Also try navigator.languages array
    for (const lang of navigator.languages || []) {
      const mapped = mapBrowserLocaleToAppLocale(lang)
      if (mapped) {
        // Save browser preference for future use
        try {
          localStorage.setItem('locale', mapped)
          document.cookie = `locale=${mapped}; path=/; max-age=31536000; SameSite=Lax`
        } catch (e) {
          // Saving might fail, but we can still use the locale
        }
        return mapped
      }
    }
  } catch (error) {
    // navigator might not be available
  }

  // Default to Romanian
  return DEFAULT_LOCALE
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const initialLocale = getInitialLocale()
  const [locale, setLocaleState] = useState<Locale>(initialLocale)
  const [translations, setTranslations] = useState<Translations>({})
  const [isLoading, setIsLoading] = useState(true)

  // Load translations immediately on mount and when locale changes
  useEffect(() => {
    let isMounted = true
    setIsLoading(true)
    
    loadTranslations(locale)
      .then((loadedTranslations) => {
        if (isMounted) {
          setTranslations(loadedTranslations)
          setIsLoading(false)
          if (process.env.NODE_ENV !== 'production') {
            // Count all nested keys recursively
            const countKeys = (obj: Translations, count = 0): number => {
              for (const key in obj) {
                count++
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                  count = countKeys(obj[key] as Translations, count)
                }
              }
              return count
            }
            const totalKeys = countKeys(loadedTranslations)
            // eslint-disable-next-line no-console
            console.log(`[I18n] Translations loaded for locale: ${locale}`, {
              topLevelKeys: Object.keys(loadedTranslations).length,
              totalKeys,
              sampleKeys: Object.keys(loadedTranslations).slice(0, 5)
            })
          }
        }
      })
      .catch((error) => {
        if (isMounted) {
          setIsLoading(false)
        }
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error(`[I18n] Error loading translations for ${locale}:`, error)
        }
      })

    return () => {
      isMounted = false
    }
  }, [locale])

  // Ensure cookie is set on mount if locale is different from default
  useEffect(() => {
    if (typeof document !== 'undefined') {
      // Check if cookie exists and matches current locale
      const cookies = document.cookie.split(';')
      const localeCookie = cookies.find(c => c.trim().startsWith('locale='))
      const cookieValue = localeCookie?.split('=')[1]?.trim()
      
      if (!cookieValue || cookieValue !== locale) {
        // Set cookie to match current locale
        document.cookie = `locale=${locale}; path=/; max-age=31536000; SameSite=Lax`
      }
    }
  }, [locale])

  // Save locale to localStorage and cookies when it changes
  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    
    // Save to localStorage (primary storage for client-side)
    try {
      localStorage.setItem('locale', newLocale)
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn('[I18n] Failed to save locale to localStorage:', error)
      }
    }
    
    // Update HTML lang attribute and save to cookie for server-side access
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLocale
      try {
        document.cookie = `locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.warn('[I18n] Failed to save locale to cookie:', error)
        }
      }
    }
  }, [])

  // Translation function
  const t = useCallback((key: string, fallback?: string): string => {
    // If translations are not loaded yet, return fallback
    if (!translations || Object.keys(translations).length === 0) {
      // In development, log when translations are not loaded (but only once per key to avoid spam)
      if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
        const logKey = `i18n-warn-${key}`
        if (!sessionStorage.getItem(logKey)) {
          sessionStorage.setItem(logKey, 'true')
          // eslint-disable-next-line no-console
          console.warn(`[I18n] Translations not loaded yet for locale: ${locale}, key: ${key}. Using fallback.`)
        }
      }
      return fallback || key
    }

    const keys = key.split('.')
    let value: string | Translations = translations

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // In development, log missing keys (but only once per key to avoid spam)
        if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
          const logKey = `i18n-missing-${key}-${locale}`
          if (!sessionStorage.getItem(logKey)) {
            sessionStorage.setItem(logKey, 'true')
            // eslint-disable-next-line no-console
            console.warn(`[I18n] Translation key not found: ${key} for locale: ${locale}. Using fallback.`, {
              availableKeys: value && typeof value === 'object' ? Object.keys(value).slice(0, 10) : [],
              currentKey: k,
              fullKey: key
            })
          }
        }
        return fallback || key
      }
    }

    let result = typeof value === 'string' ? value : fallback || key
    
    // If result is still the fallback, it means we didn't find a string value
    // This can happen if the key path exists but points to an object instead of a string
    if (result === fallback && typeof value === 'object' && value !== null) {
      if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
        const logKey = `i18n-object-${key}-${locale}`
        if (!sessionStorage.getItem(logKey)) {
          sessionStorage.setItem(logKey, 'true')
          // eslint-disable-next-line no-console
          console.warn(`[I18n] Translation key ${key} points to an object, not a string. Using fallback.`, {
            valueKeys: Object.keys(value).slice(0, 10)
          })
        }
      }
    }
    
    // Remove @@AUTO@@ or @@@AUTO@@@ placeholders from translations
    if (typeof result === 'string') {
      result = result.replace(/@@@?AUTO@@@?/g, '').trim()
    }
    
    // If we got the fallback, it means the translation wasn't found
    if (result === fallback && process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
      const logKey = `i18n-fallback-${key}-${locale}`
      if (!sessionStorage.getItem(logKey)) {
        sessionStorage.setItem(logKey, 'true')
        // eslint-disable-next-line no-console
        console.warn(`[I18n] Using fallback for key: ${key} in locale: ${locale}. Translation may be missing.`)
      }
    }
    
    return result
  }, [translations, locale])

  // Note: HTML lang attribute is updated by HtmlLangUpdater component
  // This ensures it works correctly with Next.js hydration

  const value: I18nContextType = {
    locale,
    setLocale,
    t,
    translations,
    isLoading,
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

/**
 * Hook to use i18n context
 * 
 * @throws Error if used outside I18nProvider
 */
export function useI18n(): I18nContextType {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

