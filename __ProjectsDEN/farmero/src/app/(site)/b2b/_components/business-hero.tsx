/**
 * Business Hero Section
 * 
 * Hero section pentru pagina B2B
 */

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'
import { Building2, ArrowRight, ShoppingCart, Users } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function BusinessHero() {
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
            <Building2 className="w-3 h-3" />
            {t('b2b.hero.badge', 'Soluții B2B pentru restaurante, hoteluri și afaceri')}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground"
          >
            {t('b2b.hero.title', 'Produse proaspete')}{' '}
            <span className="text-primary">{t('b2b.hero.titleHighlight', 'pentru afacerea ta')}</span>
            <br />
            {t('b2b.hero.titleSubtitle', 'cu transport inclus.')}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg sm:text-xl md:text-2xl text-foreground-body max-w-3xl mx-auto leading-relaxed"
          >
            {t('b2b.hero.description', 'Comandă produse direct de la producători locali, gestionează comenzile pentru angajați și beneficiază de prețuri speciale B2B cu livrare inclusă.')}
          </motion.p>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-wrap items-center justify-center gap-6 pt-4"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShoppingCart className="w-4 h-4 text-primary" />
              <span>{t('b2b.hero.feature1', 'Coșuri pentru angajați')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4 text-primary" />
              <span>{t('b2b.hero.feature2', 'Gestionare centralizată')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowRight className="w-4 h-4 text-primary" />
              <span>{t('b2b.hero.feature3', 'Livrare inclusă')}</span>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <Link href="/b2b/register">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-4 text-base md:text-lg font-semibold shadow-premium flex items-center gap-2"
              >
                {t('b2b.hero.ctaCreate', 'Creează cont B2B')}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="#beneficii">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-primary text-primary hover:bg-primary-bg rounded-full px-8 py-4 text-base md:text-lg font-semibold"
              >
                {t('b2b.hero.ctaLearnMore', 'Află mai multe')}
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </PageContainer>
    </section>
  )
}

