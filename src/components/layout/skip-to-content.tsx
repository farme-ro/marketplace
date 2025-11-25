/**
 * Skip to Content Link
 * 
 * Accessibility component for keyboard navigation
 * Allows users to skip navigation and go directly to main content
 */

'use client'

import { useI18n } from '@/lib/i18n/context'

export function SkipToContent() {
  const { t } = useI18n()

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      onClick={(e) => {
        e.preventDefault()
        const mainContent = document.getElementById('main-content')
        if (mainContent) {
          mainContent.focus()
          mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }}
    >
      {t('common.skipToContent', 'Sari la conținut')}
    </a>
  )
}

