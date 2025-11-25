/**
 * How It Works Timeline Component
 * 
 * Timeline cu 4 pași pentru "Cum funcționează"
 */

'use client'

import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent } from 'farme-ui'
import { useI18n } from '@/lib/i18n/context'
import { ShoppingCart, Package, Truck, Heart } from 'lucide-react'

export function HowItWorksTimeline() {
  const { t } = useI18n()
  
  const steps = [
    {
      number: '1',
      icon: ShoppingCart,
      title: t('home.howItWorks.step1.title', 'Choose products'),
      description: t('home.howItWorks.step1.description', 'Browse products from local producers. Filter by category, region or preferences.'),
    },
    {
      number: '2',
      icon: Package,
      title: t('home.howItWorks.step2.title', 'Producer prepares'),
      description: t('home.howItWorks.step2.description', 'The producer receives the order and prepares fresh products, with care and respect.'),
    },
    {
      number: '3',
      icon: Truck,
      title: t('home.howItWorks.step3.title', 'Courier delivers'),
      description: t('home.howItWorks.step3.description', 'Fast and secure delivery directly to you or to a convenient pickup point.'),
    },
    {
      number: '4',
      icon: Heart,
      title: t('home.howItWorks.step4.title', 'You enjoy'),
      description: t('home.howItWorks.step4.description', 'You receive authentic, quality products at fair prices. And you know you\'ve done good.'),
    },
  ]
  return (
    <section className="py-16 md:py-24 bg-primary-bg/30">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            {t('home.howItWorks.title', 'Cum funcționează')}
          </h2>
          <p className="text-base md:text-lg text-foreground-body max-w-2xl mx-auto leading-relaxed">
            {t('home.howItWorks.subtitle', 'Proces simplu, transparent și eficient. De la comandă la livrare, totul este clar.')}
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Connecting line (desktop only - 1024px+) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-primary/20 transform -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <Card className="border border-border rounded-2xl shadow-sm bg-card hover:shadow-md transition-all duration-300 h-full">
                  <CardContent className="p-6 md:p-8 text-center">
                    {/* Step number badge - positioned above icon */}
                    <div className="relative mb-6 flex flex-col items-center">
                      {/* Number badge */}
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-base mb-4 shadow-lg z-20 relative">
                        {step.number}
                      </div>
                      
                      {/* Icon container - rounded background */}
                      <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-primary-soft/30 relative z-10">
                        <step.icon className="w-12 h-12 text-primary" strokeWidth={1.5} />
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-sm md:text-base text-foreground-body leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </PageContainer>
    </section>
  )
}

