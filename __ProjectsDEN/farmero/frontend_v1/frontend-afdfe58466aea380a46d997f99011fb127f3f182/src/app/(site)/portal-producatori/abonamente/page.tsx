/**
 * Producer Subscriptions Page
 * 
 * Pagină cu planurile de abonament și tool-ul de promovare social media
 * 
 * Note: Backend integration required for:
 * - Fetching current producer subscription plan
 * - Activating/upgrading subscription plans
 * - Managing subscription features
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, Button, Skeleton } from 'farme-ui'
import { ProducerDashboardLayout } from '@/components/producer-portal/producer-dashboard-layout'
import { ProducerPlansGrid } from '@/components/producer-portal/subscriptions/producer-plans-grid'
import { PromotionToolInfo } from '@/components/producer-portal/subscriptions/promotion-tool-info'
import {
  getProducerSubscriptionStatus,
  getProducerSubscriptionTiers,
  upgradeProducerSubscription,
} from '@/lib/api/farmero-subscriptions-producer'
import type {
  FarmeroProducerSubscriptionStatus,
  FarmeroProducerTier,
} from '@/lib/types/subscriptions'
import { formatDate, formatCurrency } from '@/lib/utils/format'
import { useI18n } from '@/lib/i18n/context'
import { useToast } from '@/components/ui/toast'
import { Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export default function ProducerSubscriptionsPage() {
  const { t, locale } = useI18n()
  const { showToast } = useToast()
  const [subscriptionStatus, setSubscriptionStatus] = useState<FarmeroProducerSubscriptionStatus | null>(null)
  const [tiers, setTiers] = useState<FarmeroProducerTier[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpgrading, setIsUpgrading] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        const [status, tiersData] = await Promise.all([
          getProducerSubscriptionStatus(),
          getProducerSubscriptionTiers(),
        ])
        setSubscriptionStatus(status)
        setTiers(tiersData)
      } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('Error loading subscription data:', err)
        }
        // Don't show error, just set defaults
        setSubscriptionStatus(null)
        setTiers([])
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleUpgrade = async (tierId: string) => {
    setIsUpgrading(true)
    try {
      const updated = await upgradeProducerSubscription(tierId)
      setSubscriptionStatus(updated)
      showToast(
        t('producer.subscriptions.upgraded', 'Abonamentul a fost actualizat cu succes'),
        'success'
      )
      // Reload tiers to refresh current plan
      const tiersData = await getProducerSubscriptionTiers()
      setTiers(tiersData)
    } catch (err: any) {
      showToast(err.message || t('common.error', 'Eroare'), 'error')
    } finally {
      setIsUpgrading(false)
    }
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
          {t('producer.subscriptions.title', 'Abonament & Vizibilitate')}
        </h1>
        <p className="text-base md:text-lg text-foreground-body max-w-3xl leading-relaxed">
          {t(
            'producer.subscriptions.subtitle',
            'Mai multă vizibilitate, mai mult control și unelte care te ajută să ajungi la clienții tăi, nu doar să apari într-o listă.'
          )}
        </p>
      </motion.div>

      {/* Current Subscription Status */}
      {isLoading ? (
        <Card className="border border-border rounded-2xl shadow-sm bg-card mb-8">
          <CardContent className="p-6">
            <Skeleton variant="rectangular" height="120px" className="rounded-xl" />
          </CardContent>
        </Card>
      ) : subscriptionStatus ? (
        <Card className="border border-border rounded-2xl shadow-sm bg-card mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center">
                <Check className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                {t('producer.subscriptions.currentPlan', 'Pachetul tău Farmero')}
              </h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {t('producer.subscriptions.plan', 'Plan curent')}
                </p>
                <p className="text-lg font-semibold text-foreground">
                  {subscriptionStatus.tierName || t('producer.subscriptions.planBasic', 'Basic')}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {t('producer.subscriptions.validUntil', 'Valabil până la')}
                </p>
                <p className="text-base text-foreground">
                  {formatDate(subscriptionStatus.validUntil, locale, {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              {subscriptionStatus.isAutoRenew && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  {t('producer.subscriptions.autoRenew', 'Reînnoire automată activă')}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-border rounded-2xl shadow-sm bg-card mb-8">
          <CardContent className="p-6">
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground mb-4">
                {t(
                  'producer.subscriptions.noSubscription',
                  'Nu ai un abonament activ. Alege un plan de mai jos pentru a începe.'
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plans Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="border border-border rounded-2xl">
              <CardContent className="p-6">
                <Skeleton variant="rectangular" height="300px" className="rounded-xl" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : tiers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {tiers.map((tier) => {
            const isCurrentTier = subscriptionStatus?.tierId === tier.id
            const isUpgradingThis = isUpgrading && subscriptionStatus?.tierId !== tier.id

            return (
              <Card
                key={tier.id}
                className={cn(
                  'border rounded-2xl shadow-sm bg-card overflow-hidden',
                  isCurrentTier ? 'border-primary/40 shadow-md' : 'border-border hover:border-primary/60'
                )}
              >
                <CardContent className="p-6">
                  {isCurrentTier && (
                    <div className="bg-primary/10 text-primary text-center py-2 text-xs font-semibold mb-4 -mx-6 -mt-6">
                      {t('producer.subscriptions.currentPlan', 'Plan curent')}
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-foreground mb-2">{tier.name}</h3>
                  {tier.description && (
                    <p className="text-sm text-muted-foreground mb-4">{tier.description}</p>
                  )}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-foreground">
                        {formatCurrency(tier.monthlyPrice, locale, tier.currency)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        / {t('producer.subscriptions.perMonth', 'lună')}
                      </span>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                        <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={isCurrentTier ? 'outline' : 'default'}
                    className="w-full"
                    onClick={() => {
                      if (isCurrentTier) return
                      if (
                        !confirm(
                          t(
                            'producer.subscriptions.confirmUpgrade',
                            'Ești sigur că vrei să faci upgrade la acest plan?'
                          )
                        )
                      )
                        return
                      handleUpgrade(tier.id)
                    }}
                    disabled={isCurrentTier || isUpgradingThis}
                  >
                    {isUpgradingThis ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t('common.loading', 'Se încarcă...')}
                      </>
                    ) : isCurrentTier ? (
                      t('producer.subscriptions.currentPlan', 'Plan curent')
                    ) : (
                      t('producer.subscriptions.selectPlan', 'Alege acest plan')
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="border border-border rounded-2xl shadow-sm bg-card mb-12">
          <CardContent className="p-6">
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                {t(
                  'producer.subscriptions.noTiers',
                  'Funcționalitatea de abonamente pentru producători este în dezvoltare.'
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Promotion Tool Info */}
      <PromotionToolInfo />

      {/* Why Subscriptions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-12"
      >
        <Card className="border border-border rounded-[32px] shadow-premium bg-card">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold text-foreground mb-6">
              {t('producer.subscriptions.whySubscriptions', 'De ce abonamente și nu doar comision?')}
            </h3>
            <div className="space-y-4">
              <p className="text-base text-foreground-body leading-relaxed">
                <strong className="text-foreground font-semibold">{t('producer.subscriptions.commission', 'Comisionul')}</strong>{' '}
                {t('producer.subscriptions.commissionDescription', 'acoperă funcționarea de bază a platformei.')}
              </p>
              <p className="text-base text-foreground-body leading-relaxed">
                <strong className="text-foreground font-semibold">{t('producer.subscriptions.subscriptions', 'Abonamentele')}</strong>{' '}
                {t('producer.subscriptions.subscriptionsDescription', 'sunt pentru producători care vor mai mult: vizibilitate, unelte, predictibilitate.')}
              </p>
              <p className="text-base text-foreground-body leading-relaxed">
                {t('producer.subscriptions.flexibility', 'Fără obligație, fără contracte pe ani — totul flexibil.')}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </ProducerDashboardLayout>
  )
}

