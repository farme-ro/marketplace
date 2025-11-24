'use client'

/**
 * Admin i18n Context
 * 
 * Minimal i18n infrastructure for admin (RO + EN only)
 * URLs remain stable (not localized)
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import roTranslations from './translations/ro.json'
import enTranslations from './translations/en.json'

export type AdminLocale = 'ro' | 'en'

type Translations = typeof roTranslations

interface I18nContextValue {
  locale: AdminLocale
  setLocale: (locale: AdminLocale) => void
  t: (key: string, fallback?: string) => string
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined)

const translations: Record<AdminLocale, Translations> = {
  ro: roTranslations,
  en: enTranslations,
}

function getNestedValue(obj: any, path: string): string | undefined {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

export function AdminI18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AdminLocale>('ro')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Try to get saved locale from localStorage
    const savedLocale = localStorage.getItem('admin-locale') as AdminLocale | null
    if (savedLocale && (savedLocale === 'ro' || savedLocale === 'en')) {
      setLocaleState(savedLocale)
    }
  }, [])

  const setLocale = (newLocale: AdminLocale) => {
    setLocaleState(newLocale)
    localStorage.setItem('admin-locale', newLocale)
  }

  const t = (key: string, fallback?: string): string => {
    if (!mounted) {
      return fallback || key
    }

    const translation = getNestedValue(translations[locale], key)
    if (translation) {
      return translation
    }

    // Fallback to RO if not found
    if (locale !== 'ro') {
      const roTranslation = getNestedValue(translations.ro, key)
      if (roTranslation) {
        return roTranslation
      }
    }

    return fallback || key
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useAdminI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useAdminI18n must be used within AdminI18nProvider')
  }
  return context
}

