/**
 * Cookie Preferences Modal
 * 
 * Modal for managing cookie preferences
 * Allows users to customize which cookie categories they accept
 */

'use client'

import { useState, useEffect } from 'react'
import { Modal } from 'farme-ui'
import { useI18n } from '@/lib/i18n/context'
import { Button } from 'farme-ui'
import { 
  getCurrentConsent, 
  saveCookieConsent, 
  acceptAllCookies,
  type CookieConsentState
} from '@/lib/cookies/cookie-consent'
import { reinitializeScripts } from '@/lib/cookies/script-loader'
import { 
  Shield, 
  BarChart3, 
  Settings, 
  Megaphone,
  Check
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import Link from 'next/link'

interface CookiePreferencesModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CookiePreferencesModal({ isOpen, onClose }: CookiePreferencesModalProps) {
  const { t } = useI18n()
  const currentConsent = getCurrentConsent()
  
  const [consent, setConsent] = useState<CookieConsentState>({
    necessary: true, // Always true
    analytics: currentConsent.analytics,
    functional: currentConsent.functional,
    marketing: currentConsent.marketing,
  })

  useEffect(() => {
    if (isOpen) {
      const current = getCurrentConsent()
      setConsent({
        necessary: true,
        analytics: current.analytics,
        functional: current.functional,
        marketing: current.marketing,
      })
    }
  }, [isOpen])

  const handleSave = () => {
    saveCookieConsent(consent)
    reinitializeScripts()
    onClose()
  }

  const handleAcceptAll = () => {
    acceptAllCookies()
    reinitializeScripts()
    onClose()
  }

  const toggleCategory = (category: 'analytics' | 'functional' | 'marketing') => {
    setConsent((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const categories = [
    {
      key: 'necessary' as const,
      icon: Shield,
      label: t('cookies.modal.necessary.label', 'Necesare (obligatorii)'),
      description: t('cookies.modal.necessary.description', 'Asigură funcționarea de bază a platformei, logarea în cont și securitatea. Aceste cookie-uri nu pot fi dezactivate.'),
      disabled: true,
      value: true,
    },
    {
      key: 'analytics' as const,
      icon: BarChart3,
      label: t('cookies.modal.analytics.label', 'Analiză'),
      description: t('cookies.modal.analytics.description', 'Ne ajută să înțelegem cum este folosit site-ul pentru a-l îmbunătăți.'),
      disabled: false,
      value: consent.analytics,
    },
    {
      key: 'functional' as const,
      icon: Settings,
      label: t('cookies.modal.functional.label', 'Funcționalitate'),
      description: t('cookies.modal.functional.description', 'Memorează preferințe precum limba sau setările tale, pentru o experiență mai plăcută.'),
      disabled: false,
      value: consent.functional,
    },
    {
      key: 'marketing' as const,
      icon: Megaphone,
      label: t('cookies.modal.marketing.label', 'Marketing'),
      description: t('cookies.modal.marketing.description', 'Permite afișarea de conținut relevant și oferte personalizate.'),
      disabled: false,
      value: consent.marketing,
    },
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('cookies.modal.title', 'Setările tale privind confidențialitatea')}
      size="lg"
      showCloseButton
      closeOnBackdropClick
      closeOnEscape
    >
      <div className="space-y-6">
        {/* Intro */}
        <p className="text-sm text-muted-foreground">
          {t('cookies.modal.intro', 'Alege ce tipuri de cookie-uri dorești să permiți pe Farmero. Poți modifica oricând aceste opțiuni.')}
        </p>

        {/* Categories */}
        <div className="space-y-4">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <div
                key={category.key}
                className={cn(
                  'flex items-start gap-4 p-4 rounded-xl border',
                  category.disabled
                    ? 'bg-muted/50 border-border/50'
                    : 'bg-card border-border hover:border-primary/20 transition-colors'
                )}
              >
                <div className={cn(
                  'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
                  category.disabled
                    ? 'bg-muted'
                    : category.value
                    ? 'bg-primary/10'
                    : 'bg-muted'
                )}>
                  <Icon className={cn(
                    'w-5 h-5',
                    category.disabled
                      ? 'text-muted-foreground'
                      : category.value
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  )} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-semibold text-foreground">
                      {category.label}
                    </h4>
                    {category.disabled ? (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        {t('common.always', 'Întotdeauna')}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (category.key !== 'necessary') {
                            toggleCategory(category.key)
                          }
                        }}
                        className={cn(
                          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                          category.value ? 'bg-primary' : 'bg-muted',
                          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
                        )}
                        role="switch"
                        aria-checked={category.value}
                        aria-label={category.label}
                      >
                        <span
                          className={cn(
                            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                            category.value ? 'translate-x-6' : 'translate-x-1'
                          )}
                        />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
          <Link
            href="/cookies"
            className="text-xs text-primary hover:underline"
          >
            {t('cookies.banner.learnMore', 'Află mai multe despre cookie-uri')}
          </Link>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleSave}
              className="min-w-[140px]"
            >
              {t('cookies.modal.save', 'Salvează preferințele')}
            </Button>
            <Button
              onClick={handleAcceptAll}
              className="min-w-[140px] bg-primary hover:bg-primary-hover text-primary-foreground"
            >
              {t('cookies.modal.acceptAll', 'Accept toate')}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

