/**
 * Language Switcher Component
 * 
 * Dropdown component pentru schimbarea limbii
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { useI18n, type Locale } from '@/lib/i18n/context'
import { SUPPORTED_LOCALES, LOCALE_LABELS, LOCALE_FLAGS } from '@/lib/i18n/config'
import { cn } from '@/lib/utils/cn'

const languages = SUPPORTED_LOCALES.map((code) => ({
  code,
  name: LOCALE_LABELS[code],
  flag: LOCALE_FLAGS[code],
}))

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const selectLanguage = t('common.language.select', 'Selectează limba')

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!mounted) return
    
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, mounted])

  // Close dropdown on Escape key
  useEffect(() => {
    if (!mounted) return
    
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, mounted])

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0]

  // Render placeholder during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="relative">
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground hover:bg-muted transition-colors"
          aria-label={selectLanguage}
          disabled
        >
          <span className="text-lg">🇷🇴</span>
          <svg
            className="w-4 h-4 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
    )
  }

  function handleSelectLanguage(newLocale: Locale) {
    setLocale(newLocale)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground hover:bg-muted transition-colors"
        aria-label={selectLanguage}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="text-lg">{currentLanguage.flag}</span>
        <svg
          className={cn(
            'w-4 h-4 transition-transform',
            isOpen && 'rotate-180'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-50">
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleSelectLanguage(language.code)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-muted transition-colors',
                  locale === language.code && 'bg-muted font-semibold'
                )}
              >
                <span className="text-lg">{language.flag}</span>
                <span>{language.name}</span>
                {locale === language.code && (
                  <svg
                    className="w-4 h-4 ml-auto text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

