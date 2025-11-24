/**
 * Logistics Portal Dashboard
 * 
 * Dashboard principal pentru Logistics portal cu statistici, delivery status și overview
 */

'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth/context'
import { useI18n } from '@/lib/i18n/context'
import { formatDate } from '@/lib/utils/format'
import {
  getLogisticsDashboardStats,
  getLogisticsDeliveries,
  getLogisticsDeliveryStatus,
} from '@/lib/api/logistics/dashboard'
import type {
  LogisticsDashboardStats,
  LogisticsDelivery,
  LogisticsDeliveryStatus,
} from '@/lib/types/logistics'
import { Card, CardContent, CardHeader, CardTitle } from 'farme-ui'
import { Button } from 'farme-ui'
import {
  Truck,
  TrendingUp,
  PackageCheck,
  Clock,
  ArrowRight,
  Loader2,
  MapPin,
} from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils/format'

export default function LogisticsDashboardPage() {
  const { logisticsUser } = useAuth()
  const { t, locale } = useI18n()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Data state
  const [stats, setStats] = useState<LogisticsDashboardStats | null>(null)
  const [recentDeliveries, setRecentDeliveries] = useState<LogisticsDelivery[]>([])
  const [deliveryStatus, setDeliveryStatus] = useState<LogisticsDeliveryStatus | null>(null)

  useEffect(() => {
    let isMounted = true
    
    async function loadDashboardData() {
      try {
        if (!isMounted) return
        setIsLoading(true)
        setError(null)

        // Load all data in parallel
        const [statsData, deliveriesData, statusData] = await Promise.allSettled([
          getLogisticsDashboardStats(),
          getLogisticsDeliveries({ limit: 10 }),
          getLogisticsDeliveryStatus(),
        ])

        if (!isMounted) return

        // Handle stats
        if (statsData.status === 'fulfilled') {
          setStats(statsData.value)
        } else if (statsData.status === 'rejected') {
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.error('[Logistics Dashboard] Failed to load stats:', statsData.reason)
          }
        }

        // Handle deliveries - get first 5 most recent
        if (deliveriesData.status === 'fulfilled') {
          const sorted = deliveriesData.value
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
          setRecentDeliveries(sorted)
        } else if (deliveriesData.status === 'rejected') {
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.error('[Logistics Dashboard] Failed to load deliveries:', deliveriesData.reason)
          }
        }

        // Handle delivery status
        if (statusData.status === 'fulfilled') {
          setDeliveryStatus(statusData.value)
        } else if (statusData.status === 'rejected') {
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.error('[Logistics Dashboard] Failed to load delivery status:', statusData.reason)
          }
        }
      } catch (err: unknown) {
        if (!isMounted) return
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('Error loading dashboard data:', err)
        }
        setError(err instanceof Error ? err.message : 'Eroare la încărcarea datelor dashboard-ului')
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadDashboardData()
    
    return () => {
      isMounted = false
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">
            {t('logistics.dashboard.loading', 'Se încarcă dashboard-ul...')}
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>{t('common.error', 'Eroare')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              {t('common.retry', 'Încearcă din nou')}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const logisticsName = logisticsUser?.companyName || logisticsUser?.fullName || 'Logistică'

  // Prepare KPIs
  const kpis = stats
    ? [
        {
          label: t('logistics.dashboard.totalDeliveries', 'Livrări totale'),
          value: stats.totalDeliveries,
          icon: Truck,
          trend: stats.deliveriesGrowth
            ? {
                value: `${stats.deliveriesGrowth > 0 ? '+' : ''}${stats.deliveriesGrowth}%`,
                isPositive: stats.deliveriesGrowth > 0,
              }
            : undefined,
        },
        {
          label: t('logistics.dashboard.totalRevenue', 'Venit total'),
          value: formatCurrency(stats.totalRevenue),
          icon: TrendingUp,
          trend: stats.revenueGrowth
            ? {
                value: `${stats.revenueGrowth > 0 ? '+' : ''}${stats.revenueGrowth}%`,
                isPositive: stats.revenueGrowth > 0,
              }
            : undefined,
        },
        {
          label: t('logistics.dashboard.inTransit', 'În tranzit'),
          value: stats.inTransitDeliveries,
          icon: PackageCheck,
        },
        {
          label: t('logistics.dashboard.pending', 'În așteptare'),
          value: stats.pendingDeliveries,
          icon: Clock,
        },
      ]
    : []

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-8xl mx-auto px-4 py-8 lg:px-6 lg:py-10 space-y-6 lg:space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {t('logistics.dashboard.title', 'Dashboard Logistică')}
          </h1>
          <p className="text-muted-foreground">
            {t('logistics.dashboard.welcome', 'Bun venit, {name}!').replace('{name}', logisticsName)}
          </p>
        </div>

        {/* KPIs */}
        {kpis.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {kpis.map((kpi, index) => {
              const Icon = kpi.icon
              return (
                <Card key={index} className="border-border/60">
                  <CardContent className="p-5 lg:p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      {kpi.trend && (
                        <span
                          className={`text-xs font-medium ${
                            kpi.trend.isPositive ? 'text-primary' : 'text-destructive'
                          }`}
                        >
                          {kpi.trend.value}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl md:text-3xl font-bold text-foreground">
                        {kpi.value}
                      </p>
                      <p className="text-sm text-muted-foreground">{kpi.label}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Delivery Status & Recent Deliveries */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Status Overview */}
            {deliveryStatus && (
              <Card className="border-border/60">
                <CardHeader>
                  <CardTitle>
                    {t('logistics.dashboard.deliveryStatus', 'Status Livrări')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold text-foreground">{deliveryStatus.pending}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('logistics.deliveries.status.pending', 'În așteptare')}
                      </p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold text-foreground">{deliveryStatus.assigned}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('logistics.deliveries.status.assigned', 'Atribuite')}
                      </p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold text-foreground">{deliveryStatus.inTransit}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('logistics.deliveries.status.inTransit', 'În tranzit')}
                      </p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold text-foreground">{deliveryStatus.delivered}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('logistics.deliveries.status.delivered', 'Livrate')}
                      </p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold text-foreground">{deliveryStatus.failed}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('logistics.deliveries.status.failed', 'Eșuate')}
                      </p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold text-foreground">{deliveryStatus.canceled}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('logistics.deliveries.status.canceled', 'Anulate')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Deliveries */}
            <Card className="border-border/60">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  {t('logistics.dashboard.recentDeliveries', 'Livrări recente')}
                </CardTitle>
                <Link href="/logistics-portal/deliveries">
                  <Button variant="ghost" size="sm">
                    {t('common.viewAll', 'Vezi toate')}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {recentDeliveries.length === 0 ? (
                  <div className="text-center py-12">
                    <Truck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">
                      {t('logistics.dashboard.noDeliveries', 'Nu există livrări încă')}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentDeliveries.map((delivery) => (
                      <div
                        key={delivery.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border/60 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-foreground">
                            {t('logistics.deliveries.deliveryNumber', 'Livrare #{number}').replace('{number}', delivery.deliveryNumber)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {delivery.clientName} • {formatCurrency(delivery.totalValue)}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{delivery.deliveryAddress.city}</span>
                            </div>
                            <span>
                              {formatDate(delivery.createdAt, locale, {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              delivery.status === 'DELIVERED'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : delivery.status === 'FAILED' || delivery.status === 'CANCELED'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                : delivery.status === 'IN_TRANSIT'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            }`}
                          >
                            {t(
                              `logistics.deliveries.status.${delivery.status.toLowerCase()}`,
                              delivery.status
                            )}
                          </span>
                          <Link href={`/logistics-portal/deliveries/${delivery.id}`}>
                            <Button variant="ghost" size="sm">
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Overview */}
          <div className="space-y-6">
            {/* Monthly Stats */}
            {stats && (
              <Card className="border-border/60">
                <CardHeader>
                  <CardTitle>
                    {t('logistics.dashboard.thisMonth', 'Luna aceasta')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {t('logistics.dashboard.deliveriesThisMonth', 'Livrări')}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.deliveriesThisMonth}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {t('logistics.dashboard.revenueThisMonth', 'Venit')}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {formatCurrency(stats.revenueThisMonth)}
                    </p>
                  </div>
                  {stats.completedDeliveries > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {t('logistics.dashboard.completed', 'Finalizate')}
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {stats.completedDeliveries}
                      </p>
                    </div>
                  )}
                  {stats.onTimeDeliveryRate !== undefined && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {t('logistics.dashboard.onTimeRate', 'Rata la timp')}
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {stats.onTimeDeliveryRate.toFixed(1)}%
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle>
                  {t('logistics.dashboard.quickActions', 'Acțiuni rapide')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/logistics-portal/deliveries">
                  <Button variant="outline" className="w-full justify-start">
                    <Truck className="mr-2 w-4 h-4" />
                    {t('logistics.dashboard.viewDeliveries', 'Vezi toate livrările')}
                  </Button>
                </Link>
                <Link href="/logistics-portal/routes">
                  <Button variant="outline" className="w-full justify-start">
                    <MapPin className="mr-2 w-4 h-4" />
                    {t('logistics.dashboard.viewRoutes', 'Vezi rutele')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
