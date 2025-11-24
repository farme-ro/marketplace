/**
 * Client Subscriptions Hub
 * 
 * Page for managing client subscriptions (recurring orders)
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, Button } from 'farme-ui'
import { RequireAuth } from '@/components/auth/require-auth'
import { useI18n } from '@/lib/i18n/context'
import { typography } from '@/lib/design-system/typography'
import { cn } from '@/lib/utils/cn'
import { getClientSubscriptions, updateSubscriptionStatus } from '@/lib/api/subscriptions-unified'
import type { DomainSubscription, SubscriptionStatus } from '@/lib/types/domain'
import { Calendar, Package, Pause, Play, X, AlertCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils/format'
import { useToast } from '@/components/ui/toast'
import { StatusBadge } from '@/components/ui/status-badge'
import { EmptyState } from '@/components/ui/empty-state'
import { CardHover } from '@/components/ui/motion/card-hover'
import { ButtonPress } from '@/components/ui/motion/button-press'
import { SkeletonCard } from '@/components/ui/skeleton-loader'

export default function ClientSubscriptionsPage() {
  const { t, locale } = useI18n()
  const { showToast } = useToast()
  const [subscriptions, setSubscriptions] = useState<DomainSubscription[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    async function loadSubscriptions() {
      try {
        setIsLoading(true)
        const data = await getClientSubscriptions()
        setSubscriptions(data)
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('[Client Subscriptions] Failed to load:', error)
        }
        setSubscriptions([])
      } finally {
        setIsLoading(false)
      }
    }

    loadSubscriptions()
  }, [])

  const handleStatusUpdate = async (id: string, newStatus: SubscriptionStatus) => {
    try {
      setUpdatingId(id)
      await updateSubscriptionStatus(id, newStatus)
      setSubscriptions((prev) =>
        prev.map((sub) => (sub.id === id ? { ...sub, status: newStatus } : sub))
      )
      showToast(t('subscriptions.statusUpdatedDescription', 'Abonamentul a fost actualizat cu succes.'), 'success')
    } catch (error) {
      showToast(t('subscriptions.errorDescription', 'A apărut o eroare. Te rugăm să încerci din nou.'), 'error')
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusBadgeVariant = (status: SubscriptionStatus): 'success' | 'pending' | 'cancelled' | 'error' => {
    const statusMap: Record<SubscriptionStatus, 'success' | 'pending' | 'cancelled' | 'error'> = {
      active: 'success',
      paused: 'pending',
      canceled: 'cancelled',
      ended: 'error',
    }
    return statusMap[status] || 'success'
  }
  
  const getStatusLabel = (status: SubscriptionStatus): string => {
    const labels: Record<SubscriptionStatus, string> = {
      active: t('subscriptions.status.active', 'Activ'),
      paused: t('subscriptions.status.paused', 'Pauzat'),
      canceled: t('subscriptions.status.canceled', 'Anulat'),
      ended: t('subscriptions.status.ended', 'Terminat'),
    }
    return labels[status] || labels.active
  }

  const getFrequencyLabel = (frequency: string) => {
    return t(`subscriptions.frequency.${frequency}`, {
      weekly: 'Săptămânal',
      biweekly: 'Bilunar',
      monthly: 'Lunar',
    }[frequency] || frequency)
  }

  if (isLoading) {
    return (
      <RequireAuth>
        <div className="min-h-screen bg-background text-foreground">
          <div className="max-w-6xl mx-auto px-4 py-10 md:py-16">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        </div>
      </RequireAuth>
    )
  }

  return (
    <RequireAuth>
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-16">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className={cn(typography.pageTitle.base, 'mb-2')}>
              {t('subscriptions.title', 'Abonamente')}
            </h1>
            <p className="text-base md:text-lg text-foreground-body max-w-3xl leading-relaxed">
              {t(
                'subscriptions.subtitle',
                'Gestionează-ți abonamentele și comenzile recurente de la producători.'
              )}
            </p>
          </motion.div>

          {subscriptions.length === 0 ? (
            <EmptyState
              icon={Package}
              illustration="empty-subscriptions"
              title={t('subscriptions.empty', 'Nu ai abonamente active')}
              description={t(
                'subscriptions.emptyDescription',
                'Abonează-te la producătorii tăi preferați pentru a primi produse regulate.'
              )}
              action={{
                label: t('subscriptions.explore', 'Explorează abonamente'),
                href: '/products',
              }}
            />
          ) : (
            <div className="space-y-4">
              {subscriptions.map((subscription) => (
                <CardHover key={subscription.id} intensity="normal">
                  <Card className="border border-border rounded-xl shadow-sm bg-card">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-semibold text-foreground">
                              {subscription.producerName || t('subscriptions.producer', 'Producător')}
                            </h3>
                            <StatusBadge
                              label={getStatusLabel(subscription.status)}
                              variant={getStatusBadgeVariant(subscription.status)}
                              size="md"
                            />
                          </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Package className="w-4 h-4" />
                            <span>{getFrequencyLabel(subscription.frequency)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {t('subscriptions.nextDelivery', 'Următoarea livrare')}:{' '}
                              {formatDate(subscription.nextDeliveryDate, locale, {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>

                        {subscription.items.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-border">
                            <p className="text-sm font-medium text-foreground mb-2">
                              {t('subscriptions.items', 'Produse')}:
                            </p>
                            <ul className="space-y-1">
                              {subscription.items.map((item, idx) => (
                                <li key={idx} className="text-sm text-muted-foreground">
                                  {item.quantity}x {item.productName} - {item.price} {t('ui.currency.code', 'RON')}/{item.unit || t('ui.units.piece', 'buc')}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {subscription.status === 'active' && (
                          <ButtonPress>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusUpdate(subscription.id, 'paused')}
                              disabled={updatingId === subscription.id}
                            >
                              <Pause className="w-4 h-4 mr-2" />
                              {t('subscriptions.pause', 'Pauzează')}
                            </Button>
                          </ButtonPress>
                        )}
                        {subscription.status === 'paused' && (
                          <ButtonPress>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusUpdate(subscription.id, 'active')}
                              disabled={updatingId === subscription.id}
                            >
                              <Play className="w-4 h-4 mr-2" />
                              {t('subscriptions.resume', 'Reactivează')}
                            </Button>
                          </ButtonPress>
                        )}
                        {subscription.status !== 'canceled' && subscription.status !== 'ended' && (
                          <ButtonPress>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusUpdate(subscription.id, 'canceled')}
                              disabled={updatingId === subscription.id}
                            >
                              <X className="w-4 h-4 mr-2" />
                              {t('subscriptions.cancel', 'Anulează')}
                            </Button>
                          </ButtonPress>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                </CardHover>
              ))}
            </div>
          )}

          {/* Info Box */}
          <Card className="border border-border rounded-2xl shadow-sm bg-muted/30 mt-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {t('subscriptions.infoTitle', 'Informații importante')}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(
                      'subscriptions.infoDescription',
                      'Abonamentele îți permit să primești produsele preferate la intervale regulate. Poți pune pe pauză sau anula oricând.'
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RequireAuth>
  )
}

