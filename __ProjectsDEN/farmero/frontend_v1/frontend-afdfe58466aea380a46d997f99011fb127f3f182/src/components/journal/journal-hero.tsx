/**
 * Journal Hero Component
 * 
 * Hero section for journal landing page or article detail page
 */

'use client'

import { motion } from 'framer-motion'
import { BookOpen, Leaf } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useI18n } from '@/lib/i18n/context'

export interface JournalHeroProps {
  title?: string
  subtitle?: string
  variant?: 'landing' | 'article'
  className?: string
}

export function JournalHero({
  title,
  subtitle,
  variant = 'landing',
  className,
}: JournalHeroProps) {
  const { t } = useI18n()

  const defaultTitle = t('journal.hero.title', 'Jurnal de farme.ro')
  const defaultSubtitle = t(
    'journal.hero.subtitle',
    'Povești adevărate despre oamenii care cresc mâncare cu sens.'
  )

  return (
    <section
      className={cn(
        'relative overflow-hidden bg-gradient-to-br from-farmero-olive/10 via-background to-farmero-terracotta/5',
        variant === 'landing' ? 'py-16 md:py-24' : 'py-12 md:py-16',
        className
      )}
    >
      <div className="relative mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-farmero-terracotta/10 p-4">
              <BookOpen className="h-8 w-8 text-farmero-terracotta" />
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-4 font-heading text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            {title || defaultTitle}
          </h1>

          {/* Subtitle */}
          {subtitle !== null && (
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
              {subtitle || defaultSubtitle}
            </p>
          )}

          {/* Decorative elements */}
          <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-farmero-olive/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-farmero-terracotta/5 blur-3xl" />
        </motion.div>
      </div>
    </section>
  )
}

