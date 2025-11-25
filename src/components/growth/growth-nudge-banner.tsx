/**
 * Growth Nudge Banner Component
 * 
 * Displays contextual nudges from the Growth Engine
 */

'use client'

import { useGrowthNudges } from '@/lib/growth/growth-hooks'
import { useI18n } from '@/lib/i18n/context'
import { X, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface GrowthNudgeBannerProps {
  page: string
  className?: string
}

export function GrowthNudgeBanner({ page, className = '' }: GrowthNudgeBannerProps) {
  const { t } = useI18n()
  const { nudges, loading } = useGrowthNudges({ page })
  const [dismissedNudges, setDismissedNudges] = useState<Set<string>>(new Set())

  // Get the highest priority nudge that hasn't been dismissed
  const activeNudge = nudges
    .filter(n => !dismissedNudges.has(n.code))
    .sort((a, b) => b.priority - a.priority)[0]

  const handleDismiss = (code: string) => {
    setDismissedNudges(prev => new Set([...prev, code]))
  }

  if (loading || !activeNudge) {
    return null
  }

  return (
    <AnimatePresence>
      {activeNudge && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6 ${className}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground mb-1">
                {activeNudge.message || activeNudge.description || t('growth.nudge.defaultMessage', 'Sugestie pentru tine')}
              </p>
              {activeNudge.actionUrl && (
                <Link
                  href={activeNudge.actionUrl}
                  className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  {t('growth.nudge.learnMore', 'Află mai multe')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
            <button
              onClick={() => handleDismiss(activeNudge.code)}
              className="flex-shrink-0 p-1 hover:bg-background/50 rounded transition-colors"
              aria-label={t('common.close', 'Închide')}
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

