/**
 * Cookie Banner Component
 * 
 * GDPR-compliant cookie consent banner
 * Appears at the bottom of the page when user hasn't made a choice
 */

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '@/lib/i18n/context'
import { Button } from 'farme-ui'
import { hasUserMadeCookieChoice, acceptAllCookies, rejectOptionalCookies } from '@/lib/cookies/cookie-consent'
import { Leaf } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import Link from 'next/link'

interface CookieBannerProps {
  onCustomize?: () => void
}

export function CookieBanner({ onCustomize }: CookieBannerProps) {
  const { t } = useI18n()
  const [isVisible, setIsVisible] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    if (hasUserMadeCookieChoice()) {
      setIsVisible(false)
      return
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReducedMotion(prefersReducedMotion)

    // Show banner after a short delay (non-intrusive)
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleAcceptAll = () => {
    acceptAllCookies()
    setIsVisible(false)
    // Reinitialize scripts
    if (typeof window !== 'undefined') {
      import('@/lib/cookies/script-loader').then(({ reinitializeScripts }) => {
        reinitializeScripts()
      })
    }
  }

  const handleRejectAll = () => {
    rejectOptionalCookies()
    setIsVisible(false)
  }

  const handleCustomize = () => {
    setIsVisible(false)
    onCustomize?.()
  }

  if (!isVisible) {
    return null
  }

  const animationProps = reducedMotion
    ? { opacity: 1 }
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 },
        transition: { duration: 0.3 },
      }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          {...animationProps}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
          role="region"
          aria-label={t('cookies.banner.title', 'Folosim cookie-uri pentru ca Farmero să fie mai ușor de folosit și mai relevant pentru tine')}
        >
          <div className={cn(
            'mx-auto max-w-8xl',
            'bg-card border border-border rounded-2xl shadow-lg',
            'p-5 md:p-6 lg:p-8',
            'backdrop-blur-sm'
          )}>
            <div className="flex flex-col lg:flex-row lg:items-center gap-5 md:gap-6 lg:gap-8">
              {/* Icon & Content - Left side, adapts to content width */}
              <div className="flex items-start gap-4 flex-1 min-w-0 lg:max-w-none">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Leaf className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                </div>
                <div className="flex-1 min-w-0 space-y-2 md:space-y-3">
                  <h3 className="text-base md:text-lg font-semibold text-foreground leading-relaxed">
                    {t('cookies.banner.title', 'Folosim cookie-uri pentru ca Farmero să fie mai ușor de folosit și mai relevant pentru tine')}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {t('cookies.banner.description', 'Ne ajută să îți oferim o experiență personalizată și să îmbunătățim constant platforma. Poți alege ce tipuri de cookie-uri accepți.')}
                  </p>
                  <Link
                    href="/cookies"
                    className="text-sm md:text-base text-primary hover:underline inline-flex items-center font-medium"
                  >
                    {t('cookies.banner.learnMore', 'Află mai multe despre cookie-uri')}
                  </Link>
                </div>
              </div>

              {/* Actions - Right aligned, stacked vertically, all buttons same width */}
              <div className="flex flex-col gap-3 flex-shrink-0 lg:items-end lg:w-auto md:w-full">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRejectAll}
                  className="whitespace-nowrap w-full px-4"
                >
                  {t('cookies.banner.rejectAll', 'Resping opționalele')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCustomize}
                  className="whitespace-nowrap w-full px-4"
                >
                  {t('cookies.banner.customize', 'Personalizează')}
                </Button>
                <Button
                  size="sm"
                  onClick={handleAcceptAll}
                  className="whitespace-nowrap w-full px-4 bg-primary hover:bg-primary-hover text-primary-foreground"
                >
                  {t('cookies.banner.acceptAll', 'Accept toate')}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

