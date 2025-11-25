/**
 * HTML Lang Updater
 * 
 * Client component that updates the HTML lang attribute based on i18n locale
 * This ensures the lang attribute is always in sync with the current locale
 */

'use client'

import { useEffect } from 'react'
import { useI18n } from '@/lib/i18n/context'

export function HtmlLangUpdater() {
  const { locale } = useI18n()

  useEffect(() => {
    // Update HTML lang attribute when locale changes
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale
    }
  }, [locale])

  // This component doesn't render anything
  return null
}

