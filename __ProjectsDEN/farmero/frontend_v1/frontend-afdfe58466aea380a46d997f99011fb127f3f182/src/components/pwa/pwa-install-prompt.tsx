/**
 * PWA Install Prompt Component
 * 
 * Displays a non-intrusive banner/toast prompting users to install the PWA
 * Only shows when:
 * - beforeinstallprompt event is available
 * - User hasn't dismissed it (localStorage check)
 * - Not already in standalone mode
 */

'use client'

import { useState, useEffect } from 'react'
import { useI18n } from '@/lib/i18n/context'
import { cn } from '@/lib/utils/cn'
import { X, Download } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const STORAGE_KEY = 'farmero_pwa_prompt_dismissed'

export function PwaInstallPrompt() {
  const { t } = useI18n()
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Listen for beforeinstallprompt event
  useEffect(() => {
    // Check if already dismissed
    const dismissed = localStorage.getItem(STORAGE_KEY) === 'true'
    if (dismissed) return

    // Check if already in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    if (isStandalone) return

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the default mini-infobar
      e.preventDefault()
      
      // Save the event for later use
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    try {
      setIsInstalling(true)
      
      // Show the install prompt
      await deferredPrompt.prompt()

      // Wait for user choice
      const { outcome } = await deferredPrompt.userChoice

      // Log the outcome (optional, for analytics)
      // Note: Using logger utility which only logs in development
      if (process.env.NODE_ENV !== 'production') {
        if (outcome === 'accepted') {
          // eslint-disable-next-line no-console
          console.log('[PWA] User accepted the install prompt')
        } else {
          // eslint-disable-next-line no-console
          console.log('[PWA] User dismissed the install prompt')
        }
      }

      // Clear the deferred prompt
      setDeferredPrompt(null)
      setIsVisible(false)
      
      // Mark as dismissed
      localStorage.setItem(STORAGE_KEY, 'true')
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Error showing install prompt:', error)
      }
    } finally {
      setIsInstalling(false)
    }
  }

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem(STORAGE_KEY, 'true')
  }

  if (!isVisible || !deferredPrompt) {
    return null
  }

  return (
    <div
      className={cn(
        'fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto',
        'bg-background border border-border rounded-lg shadow-lg',
        'p-4 sm:p-5',
        'flex items-start gap-4',
        prefersReducedMotion ? '' : 'animate-in slide-in-from-bottom-4 fade-in duration-300'
      )}
      role="alert"
      aria-live="polite"
      aria-label={t('pwa.installPrompt.title', 'Instalează Farmero pe dispozitivul tău')}
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Download className="w-5 h-5 text-primary" aria-hidden="true" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-foreground mb-1">
          {t('pwa.installPrompt.title', 'Instalează Farmero pe dispozitivul tău')}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 leading-relaxed">
          {t(
            'pwa.installPrompt.subtitle',
            'Acces rapid la producătorii tăi preferați, direct de pe ecranul principal.'
          )}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleInstall}
            disabled={isInstalling}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg',
              'bg-primary text-primary-foreground',
              'hover:bg-primary/90',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
              'transition-colors duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            aria-label={t('pwa.installPrompt.installButton', 'Instalează acum')}
          >
            {isInstalling
              ? t('pwa.installPrompt.installing', 'Se instalează...')
              : t('pwa.installPrompt.installButton', 'Instalează acum')}
          </button>
          <button
            onClick={handleDismiss}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg',
              'text-muted-foreground hover:text-foreground',
              'hover:bg-muted',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
              'transition-colors duration-200'
            )}
            aria-label={t('pwa.installPrompt.dismissButton', 'Nu acum')}
          >
            {t('pwa.installPrompt.dismissButton', 'Nu acum')}
          </button>
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={handleDismiss}
        className={cn(
          'flex-shrink-0 p-1 rounded-md',
          'text-muted-foreground hover:text-foreground',
          'hover:bg-muted',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          'transition-colors duration-200'
        )}
        aria-label={t('common.close', 'Închide')}
      >
        <X className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  )
}

