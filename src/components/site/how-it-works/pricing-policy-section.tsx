/**
 * Pricing Policy Section Component
 * 
 * Secțiunea "De ce sunt diferite prețurile pe Farmero?"
 */

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'
import { ProducerPriceBadge } from '@/components/impact/producer-price-badge'

const points = [
  {
    icon: '⚖️',
    title: 'Nu impunem marje artificiale',
    description:
      'Farmero nu umflă prețurile produselor. Prețul pe care îl vezi este exact prețul stabilit de producător.',
  },
  {
    icon: '🌿',
    title: 'Producătorul decide cât valorează munca lui',
    description:
      'Fiecare producător stabilește propriul preț, bazat pe costurile reale de producție și valoarea muncii sale.',
  },
  {
    icon: '🤝',
    title: 'Noi câștigăm din comision transparent, nu din umflarea produselor',
    description:
      'Platforma câștigă printr-un comision clar și transparent, nu prin manipularea prețurilor sau marje ascunse.',
  },
]

export function PricingPolicySection() {
  return (
    <section id="pricing-policy" className="py-12 md:py-16 bg-background scroll-mt-20">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            De ce sunt diferite prețurile pe Farmero?
          </h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary to-primary rounded-full mx-auto mb-6" />
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Prețurile pe care le vezi sunt stabilite direct de producători, fără intermediari care dublează costul.
          </p>
        </motion.div>

        <div className="space-y-6 mb-8">
          {points.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="border-2 border-border/60 rounded-2xl shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl flex-shrink-0">{point.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {point.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {point.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-2 border-emerald-200 dark:border-emerald-800/50 rounded-2xl shadow-lg bg-gradient-to-br from-emerald-50/50 to-green-50/30 dark:from-emerald-950/20 dark:to-green-950/20">
            <CardContent className="p-6 md:p-8 text-center">
              <div className="space-y-4">
                <p className="text-base text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Transparență totală:</strong> Vezi exact cât plătești și de ce. Fără surprize, fără taxe ascunse, fără marje artificiale.
                </p>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <ProducerPriceBadge variant="default" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </PageContainer>
    </section>
  )
}

