/**
 * Social Impact Section Component - Premium Design
 * 
 * Secțiunea "Comanda ta face bine" cu design premium
 */

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent } from 'farme-ui'
import { useI18n } from '@/lib/i18n/context'
import { AnimatedIllustration } from '@/components/illustrations/animated-illustration'
import { Heart } from 'lucide-react'
import dynamic from 'next/dynamic'

// Lazy load Lottie player
const LottiePlayer = dynamic(() => import('@/components/ui/lottie-player').then(mod => ({ default: mod.LottiePlayer })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <AnimatedIllustration
        type="community-support"
        width={300}
        height={240}
        className="text-primary"
      />
    </div>
  ),
})

export function SocialImpactSection() {
  const { t } = useI18n()
  return (
    <section className="py-16 md:py-24 bg-primary-bg/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-soft/20 via-transparent to-primary-bg/30" />
      
      <PageContainer className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-soft rounded-full border border-primary/20 mb-4">
              <Heart className="w-4 h-4 text-primary" fill="currentColor" strokeWidth={2} />
              <span className="text-sm font-semibold text-primary">{t('home.socialImpact.badge', 'Real impact')}</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              {t('home.socialImpact.title', 'Comanda ta face bine.')}
            </h2>

            <p className="text-base md:text-lg text-foreground-body leading-relaxed">
              {t('home.socialImpact.description', 'Produsele neridicate sunt donate către centre sociale.')}
              <br />
              <strong className="text-foreground">{t('home.socialImpact.descriptionHighlight', 'Tu ajuți comunitatea și reduci risipa.')}</strong>
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/cum-functioneaza-si-impact">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-full px-8 py-3"
                  aria-label={t('home.socialImpact.ctaAria', 'Află mai multe despre impactul social al comenzilor')}
                >
                  {t('home.socialImpact.cta', 'Află mai multe')}
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <Card className="border border-border rounded-[32px] shadow-premium-lg bg-card p-8">
              <div className="space-y-6">
                {/* Lottie Animation or Fallback */}
                <div className="relative h-64 bg-gradient-to-br from-primary-soft/30 to-primary-bg/20 rounded-2xl flex items-center justify-center overflow-hidden">
                  {/* Placeholder pentru Lottie - va fi înlocuit cu fișier real */}
                  <AnimatedIllustration
                    type="community-support"
                    width={300}
                    height={240}
                    className="text-primary"
                  />
                  {/* TODO: Adaugă fișier Lottie pentru impact social */}
                  {/* <LottiePlayer
                    animationData={socialImpactAnimation}
                    loop={true}
                    autoplay={true}
                    width={300}
                    height={240}
                  /> */}
                </div>

                {/* Impact Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-primary-soft/30 rounded-xl">
                    <p className="text-2xl font-bold text-primary mb-1">45 kg</p>
                    <p className="text-xs text-foreground-body">{t('home.socialImpact.statsDonated', 'produse donate')}</p>
                  </div>
                  <div className="text-center p-4 bg-primary-soft/30 rounded-xl">
                    <p className="text-2xl font-bold text-primary mb-1">12</p>
                    <p className="text-xs text-foreground-body">{t('home.socialImpact.statsCenters', 'centre ajutate')}</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </PageContainer>
    </section>
  )
}

