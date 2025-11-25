/**
 * Producers Subscriptions Preview Section
 * 
 * Secțiunea cu preview-ul abonamentelor
 */

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, Button } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'
import { Check } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function ProducersSubscriptionsPreview() {
  const { t } = useI18n()

  const plans = [
    {
      name: t('producers.subscriptions.plan1.name', 'PLAN START'),
      price: t('producers.subscriptions.plan1.price', '19€/lună'),
      features: [
        t('producers.subscriptions.plan1.feature1', 'listare produse'),
        t('producers.subscriptions.plan1.feature2', 'profil producător'),
        t('producers.subscriptions.plan1.feature3', 'comenzi Nelimitate'),
        t('producers.subscriptions.plan1.feature4', 'tool auto-postare social media'),
        t('producers.subscriptions.plan1.feature5', 'statistici de bază'),
      ],
    },
    {
      name: t('producers.subscriptions.plan2.name', 'PLAN PRO'),
      price: t('producers.subscriptions.plan2.price', '39€/lună'),
      features: [
        t('producers.subscriptions.plan2.feature1', 'promovare în homepage'),
        t('producers.subscriptions.plan2.feature2', 'comision preferențial'),
        t('producers.subscriptions.plan2.feature3', 'statistici avansate'),
        t('producers.subscriptions.plan2.feature4', 'recomandări SEO'),
        t('producers.subscriptions.plan2.feature5', 'toate funcțiile din START'),
      ],
      popular: true,
    },
  ]
  return (
    <section className="py-16 md:py-24 bg-background">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-4">
            {t('producers.subscriptions.title', 'Abonamente care îți aduc stabilitate și vizibilitate')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className={`border rounded-2xl shadow-premium hover:shadow-premium-lg transition-all duration-300 bg-card h-full ${
                  plan.popular ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                }`}
              >
                <CardContent className="p-6 md:p-8">
                  {plan.popular && (
                    <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary-soft/30 px-3 py-1 text-xs font-medium text-primary mb-4">
                      {t('producers.subscriptions.recommended', 'Recomandat')}
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-3xl font-bold text-primary mb-6">
                    {plan.price}
                  </p>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground-body">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center space-y-4"
        >
          <p className="text-sm text-foreground-body">
            {t('producers.subscriptions.footer', 'Comisionul scade pe măsură ce vinzi mai mult.')}
          </p>
          <Link href="/portal-producatori/comisioane">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-primary text-primary hover:bg-primary-bg rounded-full px-8 py-4 text-base font-semibold"
            >
              {t('producers.subscriptions.cta', 'Vezi planurile complete')}
            </Button>
          </Link>
        </motion.div>
      </PageContainer>
    </section>
  )
}

