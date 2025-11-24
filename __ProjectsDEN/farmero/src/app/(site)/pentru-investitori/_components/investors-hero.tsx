/**
 * Investors Hero Section
 * 
 * Hero section pentru pagina "Pentru Investitori"
 */

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'
import { TrendingUp, ArrowRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function InvestorsHero() {
  const { t } = useI18n()
  return (
    <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-primary-soft/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <PageContainer className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft/30 px-4 py-1.5 text-xs font-medium text-primary"
          >
            <TrendingUp className="w-3 h-3" />
            {t('investors.hero.badge', 'Oportunitate de investiție în agricultură și tech')}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground"
          >
            {t('investors.hero.title', 'Investește în')}{' '}
            <span className="text-primary">{t('investors.hero.titleHighlight', 'viitorul alimentar')}</span>{' '}
            {t('investors.hero.titleSuffix', 'al României.')}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg sm:text-xl md:text-2xl text-foreground-body max-w-3xl mx-auto leading-relaxed"
          >
            {t('investors.hero.description', 'farme.ro conectează producătorii locali cu consumatorii, generând valoare pentru toți și impact social măsurabil.')}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <Link href="/contact?type=investor">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-4 text-base md:text-lg font-semibold shadow-premium flex items-center gap-2"
              >
                {t('investors.hero.ctaPrimary', 'Programează o întâlnire')}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="#business-model">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-primary text-primary hover:bg-primary-bg rounded-full px-8 py-4 text-base md:text-lg font-semibold"
              >
                {t('investors.hero.ctaSecondary', 'Află mai multe')}
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </PageContainer>
    </section>
  )
}

