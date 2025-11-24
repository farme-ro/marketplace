/**
 * Subscriptions Teaser Section
 * 
 * Secțiune teaser pentru abonamente de la producători
 * Afișează planuri publice sau skeleton dacă feature-ul nu este activ
 */

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent } from 'farme-ui'
import { Button } from 'farme-ui'
import { Skeleton } from 'farme-ui'
import { getPublicSubscriptionPlans } from '@/lib/api/farmero-subscriptions-public'
import type { FarmeroSubscriptionPlan } from '@/lib/types/subscriptions'
import { useI18n } from '@/lib/i18n/context'
import { formatCurrency } from '@/lib/utils/format'
import { isBackendSyncEnabled } from '@/lib/backend-sync/status'
import { cn } from '@/lib/utils/cn'

function getFrequencyLabel(frequency: string, t: (key: string, fallback: string) => string): string {
  switch (frequency) {
    case 'weekly':
      return t('subscriptions.frequency.weekly', 'Săptămânal')
    case 'biweekly':
      return t('subscriptions.frequency.biweekly', 'La 2 săptămâni')
    case 'monthly':
      return t('subscriptions.frequency.monthly', 'Lunar')
    default:
      return frequency
  }
}

export function SubscriptionsTeaserSection() {
  const { t, locale } = useI18n()
  const [plans, setPlans] = useState<FarmeroSubscriptionPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPlans() {
      try {
        const data = await getPublicSubscriptionPlans()
        setPlans(data.slice(0, 3)) // Show max 3 plans
      } catch (error) {
        // Only log unexpected errors (not 404, 500, or network errors)
        if (error instanceof Error) {
          const isExpected = 
            error.message.includes('404') || 
            error.message.includes('500') || 
            error.message.includes('network') ||
            error.message.includes('Network') ||
            error.message.includes('429')
          
          if (!isExpected && process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.warn('[SubscriptionsTeaserSection] Unexpected error fetching plans:', error)
          }
        }
        setPlans([])
      } finally {
        setIsLoading(false)
      }
    }

    if (isBackendSyncEnabled('subscriptionsClient')) {
      fetchPlans()
    } else {
      setIsLoading(false)
    }
  }, [])

  const hasPlans = plans.length > 0 && isBackendSyncEnabled('subscriptionsClient')

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
              {t('home.subscriptions.title', 'Abonamente de la producători')}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t(
                'home.subscriptions.subtitle',
                'Coșuri periodice cu produse proaspete, direct de la producătorii tăi preferați.'
              )}
            </p>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="border border-border/60 rounded-xl">
                  <CardContent className="p-6 md:p-8">
                    <Skeleton variant="rectangular" height="200px" className="rounded-lg mb-4" />
                    <Skeleton variant="text" width="60%" className="mb-2" />
                    <Skeleton variant="text" width="40%" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : hasPlans ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <Card
                    className={cn(
                      'border rounded-xl overflow-hidden bg-card hover:shadow-lg transition-all duration-300 h-full flex flex-col',
                      plan.isRecommended
                        ? 'border-primary/40 shadow-md'
                        : 'border-border/60 hover:border-primary/60'
                    )}
                  >
                    {plan.isRecommended && (
                      <div className="bg-primary/10 text-primary text-center py-2 text-xs font-semibold">
                        {t('subscriptions.recommended', 'Recomandat')}
                      </div>
                    )}
                    <CardContent className="p-6 flex-1 flex flex-col">
                      {plan.imageUrl && (
                        <div className="relative aspect-video rounded-lg overflow-hidden mb-4 bg-muted">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={plan.imageUrl}
                            alt={plan.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <h3 className="font-semibold text-lg text-foreground mb-2">{plan.name}</h3>
                      {plan.description && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {plan.description}
                        </p>
                      )}
                      <div className="mt-auto space-y-3">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-foreground">
                            {formatCurrency(plan.basePrice, locale, plan.currency)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            / {getFrequencyLabel(plan.frequency, t)}
                          </span>
                        </div>
                        {plan.producerName && (
                          <p className="text-xs text-muted-foreground">
                            {t('subscriptions.byProducer', 'De la')} {plan.producerName}
                          </p>
                        )}
                        {plan.itemsCount && (
                          <p className="text-xs text-muted-foreground">
                            {plan.itemsCount} {plan.itemsCount === 1 ? t('subscriptions.product', 'produs') : t('subscriptions.products', 'produse')}
                          </p>
                        )}
                        <Link
                          href={`/account/subscriptions${plan.id ? `?plan=${plan.id}` : ''}`}
                          className="block"
                        >
                          <Button variant={plan.isRecommended ? 'default' : 'outline'} className="w-full">
                            {t('subscriptions.learnMore', 'Află mai multe')}
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="border border-border/60 rounded-xl opacity-50">
                    <CardContent className="p-6 md:p-8">
                      <Skeleton variant="rectangular" height="150px" className="rounded-lg mb-4" />
                      <Skeleton variant="text" width="70%" className="mb-2" />
                      <Skeleton variant="text" width="50%" />
                    </CardContent>
                  </Card>
                ))}
              </div>
              <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
                {t(
                  'home.subscriptions.comingSoon',
                  'Abonamentele Farmero vor fi disponibile în curând. Înscrie-te la newsletter ca să afli când lansăm.'
                )}
              </p>
            </div>
          )}
        </motion.div>
      </PageContainer>
    </section>
  )
}

