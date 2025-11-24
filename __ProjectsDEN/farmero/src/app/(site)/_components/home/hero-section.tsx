/**
 * Hero Section Component - Premium Design
 * 
 * Secțiunea principală a homepage-ului cu split layout modern
 * Stânga: text + CTAs, Dreapta: imagine atmosferică cu badge overlay
 */

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'
import { useI18n } from '@/lib/i18n/context'
import { routes } from '@/lib/routes'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'
import { AnimatedIllustration } from '@/components/illustrations/animated-illustration'
import { ShoppingCart, Store, Tag, MapPin, Leaf } from 'lucide-react'
import { AgriculturalBackground } from '@/components/ui/agricultural-background'

export function HeroSection() {
  const { t } = useI18n()
  const reducedMotion = useReducedMotion()
  return (
    <section className="bg-background py-16 md:py-24 lg:py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-bg/30 via-background to-background pointer-events-none" />
      
      {/* Agricultural background animation */}
      <AgriculturalBackground />
      
      <PageContainer className="relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Left Column - Text & CTAs */}
          <motion.div
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.h1
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reducedMotion ? { duration: 0 } : { duration: 0.5, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-foreground"
              >
                {t('home.hero.title', 'Produse direct de la')}{' '}
                <span className="text-primary">{t('home.hero.titleHighlight', 'producători locali.')}</span>
                <br />
                {t('home.hero.titleSubtitle', 'Fără intermediari.')}
              </motion.h1>

              <motion.p
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reducedMotion ? { duration: 0 } : { duration: 0.5, delay: 0.2 }}
                className="text-lg md:text-xl text-foreground-body leading-relaxed max-w-lg"
              >
                {t('home.hero.description', 'Prețuri corecte, gust autentic și impact real pentru comunitățile românești.')}
              </motion.p>
            </div>

            <motion.div
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link href={routes.products.list}>
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-full px-8 py-4 text-base md:text-lg font-semibold shadow-premium-lg transition-all duration-300 hover:scale-[1.02] flex items-center gap-2"
                  aria-label={t('home.hero.ctaExploreAria', 'Explorează produse de la producători locali')}
                >
                  <ShoppingCart className="w-5 h-5" strokeWidth={2} />
                  <span>{t('home.hero.ctaExplore', 'Explore products')}</span>
                </Button>
              </Link>
              <Link href={routes.producers.list}>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-primary text-primary bg-transparent hover:bg-primary-bg rounded-full px-8 py-4 text-base md:text-lg font-semibold transition-all duration-300 hover:scale-[1.02] flex items-center gap-2"
                  aria-label={t('home.hero.ctaProducersAria', 'Vezi lista producătorilor locali')}
                >
                  <Store className="w-5 h-5" strokeWidth={2} />
                  <span>{t('home.hero.ctaProducers', 'See producers')}</span>
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column - Image with Badge Overlay */}
          <motion.div
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-[32px] overflow-hidden shadow-premium-lg bg-card border border-border aspect-[4/3] lg:aspect-square">
              {/* Simple gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-soft/50 via-primary-bg/30 to-background" />
              
              {/* Overlay gradient for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-card/40 via-transparent to-transparent" />

              {/* Badge Pills Overlay */}
              <div className="absolute top-6 left-6 right-6 flex flex-wrap gap-3 z-20">
                <motion.div
                  initial={reducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={reducedMotion ? { duration: 0 } : { duration: 0.4, delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-background/95 backdrop-blur-sm rounded-full border border-border/60 shadow-sm hover:shadow-md transition-all"
                >
                  <Tag className="w-3.5 h-3.5 text-primary" strokeWidth={2.5} />
                  <span className="text-sm font-semibold text-foreground">{t('home.hero.badgeProducerPrice', 'Producer price')}</span>
                </motion.div>
                <motion.div
                  initial={reducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={reducedMotion ? { duration: 0 } : { duration: 0.4, delay: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-background/95 backdrop-blur-sm rounded-full border border-border/60 shadow-sm hover:shadow-md transition-all"
                >
                  <MapPin className="w-3.5 h-3.5 text-primary" strokeWidth={2.5} />
                  <span className="text-sm font-semibold text-foreground">{t('home.hero.badgeLocal', '100% local')}</span>
                </motion.div>
                <motion.div
                  initial={reducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={reducedMotion ? { duration: 0 } : { duration: 0.4, delay: 0.7 }}
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-background/95 backdrop-blur-sm rounded-full border border-border/60 shadow-sm hover:shadow-md transition-all"
                >
                  <Leaf className="w-3.5 h-3.5 text-primary" strokeWidth={2.5} />
                  <span className="text-sm font-semibold text-foreground">{t('home.hero.badgeSustainable', 'Sustainable')}</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </PageContainer>
    </section>
  )
}
