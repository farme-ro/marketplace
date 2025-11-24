/**
 * Language Footer Links Component
 * 
 * Fallback language switcher for footer
 * Simple divider links: RO | EN | FR | IT | DE | ES
 */

'use client'

import { useState, useEffect } from 'react'
import { useI18n, type Locale } from '@/lib/i18n/context'
import { SUPPORTED_LOCALES, LOCALE_SHORT_LABELS } from '@/lib/i18n/config'
import { cn } from '@/lib/utils/cn'

const languages = SUPPORTED_LOCALES.map((code) => ({
  code,
  label: LOCALE_SHORT_LABELS[code],
}))

export function LanguageFooterLinks() {
  const { locale, setLocale } = useI18n()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  function handleLanguageChange(newLocale: Locale) {
    setLocale(newLocale)
  }

  // Prevent hydration mismatch by using default locale on server
  const currentLocale = mounted ? locale : 'ro'

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground" role="group" aria-label="Select language">
      {languages.map((language, index) => (
        <span key={language.code} className="flex items-center gap-2">
          {index > 0 && <span className="text-muted-foreground/50" aria-hidden="true">|</span>}
          <button
            type="button"
            onClick={() => handleLanguageChange(language.code)}
            className={cn(
              'hover:text-foreground transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-1',
              currentLocale === language.code && 'font-semibold text-foreground'
            )}
            aria-label={`Schimbă limba în ${language.label}`}
            aria-pressed={currentLocale === language.code}
          >
            {language.label}
          </button>
        </span>
      ))}
    </div>
  )
}

