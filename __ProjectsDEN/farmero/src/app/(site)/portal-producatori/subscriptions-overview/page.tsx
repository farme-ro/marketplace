/**
 * Producer Subscriptions Overview
 * 
 * Page for producers to view subscriptions from clients
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'
import { ProducerDashboardLayout } from '@/components/producer-portal/producer-dashboard-layout'
import { useI18n } from '@/lib/i18n/context'
import { getProducerSubscriptions } from '@/lib/api/subscriptions-unified'
import type { DomainSubscription } from '@/lib/types/domain'
import { Calendar, Package, Users, TrendingUp } from 'lucide-react'
import { formatDate } from '@/lib/utils/format'

export default function ProducerSubscriptionsOverviewPage() {
  const { t, locale } = useI18n()
  const [subscriptions, setSubscriptions] = useState<DomainSubscription[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadSubscriptions() {
      try {
        setIsLoading(true)
        const data = await getProducerSubscriptions()
        setSubscriptions(data)
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('[Producer Subscriptions] Failed to load:', error)
        }
        setSubscriptions([])
      } finally {
        setIsLoading(false)
      }
    }

    loadSubscriptions()
  }, [])

  // Calculate statistics
  const activeSubscriptions = subscriptions.filter((s) => s.status === 'active')
  const weeklyCount = activeSubscriptions.filter((s) => s.frequency === 'weekly').length
  const biweeklyCount = activeSubscriptions.filter((s) => s.frequency === 'biweekly').length
  const monthlyCount = activeSubscriptions.filter((s) => s.frequency === 'monthly').length

  // Estimate volume for next week
  const nextWeekDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const nextWeekSubscriptions = activeSubscriptions.filter((sub) => {
    const nextDelivery = new Date(sub.nextDeliveryDate)
    return nextDelivery <= nextWeekDate
  })

  const getFrequencyLabel = (frequency: string) => {
    return t(`subscriptions.frequency.${frequency}`, {
      weekly: 'Săptămânal',
      biweekly: 'Bilunar',
      monthly: 'Lunar',
    }[frequency] || frequency)
  }

  if (isLoading) {
    return (
      <ProducerDashboardLayout>
        <Card className="border border-border rounded-2xl shadow-sm bg-card">
          <CardContent className="p-6">
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">{t('common.loading', 'Se încarcă...')}</p>
            </div>
          </CardContent>
        </Card>
      </ProducerDashboardLayout>
    )
  }

  return (
    <ProducerDashboardLayout>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
          {t('producer.subscriptions.title', 'Abonamente Clienți')}
        </h1>
        <p className="text-base md:text-lg text-foreground-body max-w-3xl leading-relaxed">
          {t(
            'producer.subscriptions.subtitle',
            'Vizualizează abonamentele clienților tăi și planifică-ți producția.'
          )}
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border border-border rounded-xl shadow-sm bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{activeSubscriptions.length}</p>
                  <p className="text-xs text-muted-foreground">
                    {t('producer.subscriptions.active', 'Abonamente active')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border rounded-xl shadow-sm bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{nextWeekSubscriptions.length}</p>
                  <p className="text-xs text-muted-foreground">
                    {t('producer.subscriptions.nextWeek', 'Livrări săptămâna viitoare')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border rounded-xl shadow-sm bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{weeklyCount}</p>
                  <p className="text-xs text-muted-foreground">
                    {t('producer.subscriptions.weekly', 'Săptămânal')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border rounded-xl shadow-sm bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{monthlyCount}</p>
                  <p className="text-xs text-muted-foreground">
                    {t('producer.subscriptions.monthly', 'Lunar')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscriptions List */}
        {subscriptions.length === 0 ? (
          <Card className="border border-border rounded-2xl shadow-sm bg-card">
            <CardContent className="p-6">
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-base text-foreground mb-2 font-medium">
                  {t('producer.subscriptions.empty', 'Nu ai abonamente încă')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t(
                    'producer.subscriptions.emptyDescription',
                    'Când clienții vor crea abonamente pentru produsele tale, acestea vor apărea aici.'
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border border-border rounded-2xl shadow-sm bg-card">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                {t('producer.subscriptions.list', 'Lista abonamentelor')}
              </h2>
              <div className="space-y-4">
                {subscriptions.map((subscription) => (
                  <div
                    key={subscription.id}
                    className="p-4 rounded-lg border border-border bg-muted/30"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-foreground">
                            {getFrequencyLabel(subscription.frequency)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({subscription.items.length} {t('producer.subscriptions.items', 'produse')})
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {t('producer.subscriptions.nextDelivery', 'Următoarea livrare')}:{' '}
                            {formatDate(subscription.nextDeliveryDate, locale, {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        {subscription.items.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {subscription.items.map((item, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground">
                                {item.quantity}x {item.productName}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ProducerDashboardLayout>
  )
}

