/**
 * Business Portal Dashboard
 * 
 * Dashboard principal pentru Business portal cu statistici, order flow și overview
 */

'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth/context'
import { useI18n } from '@/lib/i18n/context'
import { formatDate } from '@/lib/utils/format'
import {
  getBusinessDashboardStats,
  getBusinessOrders,
  getBusinessOrderFlow,
  getBusinessSubscriptions,
} from '@/lib/api/business/dashboard'
import type {
  BusinessDashboardStats,
  BusinessOrder,
  BusinessOrderFlow,
} from '@/lib/types/business'
import { Card, CardContent, CardHeader, CardTitle } from 'farme-ui'
import { Button } from 'farme-ui'
import {
  ShoppingCart,
  TrendingUp,
  Package,
  Clock,
  ArrowRight,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils/format'

export default function BusinessDashboardPage() {
  const { businessUser } = useAuth()
  const { t, locale } = useI18n()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Data state
  const [stats, setStats] = useState<BusinessDashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<BusinessOrder[]>([])
  const [orderFlow, setOrderFlow] = useState<BusinessOrderFlow | null>(null)

  useEffect(() => {
    let isMounted = true
    
    async function loadDashboardData() {
      try {
        if (!isMounted) return
        setIsLoading(true)
        setError(null)

        // Load all data in parallel
        const [statsData, ordersData, flowData] = await Promise.allSettled([
          getBusinessDashboardStats(),
          getBusinessOrders({ limit: 10 }),
          getBusinessOrderFlow(),
        ])

        if (!isMounted) return

        // Handle stats
        if (statsData.status === 'fulfilled') {
          setStats(statsData.value)
        } else if (statsData.status === 'rejected') {
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.error('[Business Dashboard] Failed to load stats:', statsData.reason)
          }
        }

        // Handle orders - get first 5 most recent
        if (ordersData.status === 'fulfilled') {
          const sorted = ordersData.value
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
          setRecentOrders(sorted)
        } else if (ordersData.status === 'rejected') {
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.error('[Business Dashboard] Failed to load orders:', ordersData.reason)
          }
        }

        // Handle order flow
        if (flowData.status === 'fulfilled') {
          setOrderFlow(flowData.value)
        } else if (flowData.status === 'rejected') {
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.error('[Business Dashboard] Failed to load order flow:', flowData.reason)
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
            {t('business.dashboard.loading', 'Se încarcă dashboard-ul...')}
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

  const businessName = businessUser?.companyName || businessUser?.fullName || 'Business'

  // Prepare KPIs
  const kpis = stats
    ? [
        {
          label: t('business.dashboard.totalOrders', 'Comenzi totale'),
          value: stats.totalOrders,
          icon: ShoppingCart,
          trend: stats.ordersGrowth
            ? {
                value: `${stats.ordersGrowth > 0 ? '+' : ''}${stats.ordersGrowth}%`,
                isPositive: stats.ordersGrowth > 0,
              }
            : undefined,
        },
        {
          label: t('business.dashboard.totalRevenue', 'Venit total'),
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
          label: t('business.dashboard.pendingOrders', 'Comenzi în așteptare'),
          value: stats.pendingOrders,
          icon: Clock,
        },
        {
          label: t('business.dashboard.activeSubscriptions', 'Abonamente active'),
          value: stats.activeSubscriptions,
          icon: Package,
        },
      ]
    : []

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-8xl mx-auto px-4 py-8 lg:px-6 lg:py-10 space-y-6 lg:space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {t('business.dashboard.title', 'Dashboard Business')}
          </h1>
          <p className="text-muted-foreground">
            {t('business.dashboard.welcome', 'Bun venit, {name}!').replace('{name}', businessName)}
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
          {/* Left Column - Order Flow */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Flow */}
            {orderFlow && (
              <Card className="border-border/60">
                <CardHeader>
                  <CardTitle>
                    {t('business.dashboard.orderFlow', 'Flow Comenzi')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold text-foreground">{orderFlow.new}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('business.orders.status.new', 'Noi')}
                      </p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold text-foreground">{orderFlow.confirmed}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('business.orders.status.confirmed', 'Confirmate')}
                      </p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold text-foreground">{orderFlow.preparing}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('business.orders.status.preparing', 'În pregătire')}
                      </p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold text-foreground">{orderFlow.shipped}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('business.orders.status.shipped', 'Expediate')}
                      </p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold text-foreground">{orderFlow.delivered}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('business.orders.status.delivered', 'Livrate')}
                      </p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold text-foreground">{orderFlow.canceled}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('business.orders.status.canceled', 'Anulate')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Orders */}
            <Card className="border-border/60">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  {t('business.dashboard.recentOrders', 'Comenzi recente')}
                </CardTitle>
                <Link href="/business-portal/orders">
                  <Button variant="ghost" size="sm">
                    {t('common.viewAll', 'Vezi toate')}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {recentOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">
                      {t('business.dashboard.noOrders', 'Nu există comenzi încă')}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border/60 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-foreground">
                            {t('business.orders.orderNumber', 'Comandă #{number}').replace('{number}', order.orderNumber)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {order.clientName} • {formatCurrency(order.total)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(order.createdAt, locale, {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === 'DELIVERED'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : order.status === 'CANCELED'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            }`}
                          >
                            {t(
                              `business.orders.status.${order.status.toLowerCase()}`,
                              order.status
                            )}
                          </span>
                          <Link href={`/business-portal/orders/${order.id}`}>
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
                    {t('business.dashboard.thisMonth', 'Luna aceasta')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {t('business.dashboard.ordersThisMonth', 'Comenzi')}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.ordersThisMonth}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {t('business.dashboard.revenueThisMonth', 'Venit')}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {formatCurrency(stats.revenueThisMonth)}
                    </p>
                  </div>
                  {stats.averageOrderValue > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {t('business.dashboard.averageOrderValue', 'Valoare medie comandă')}
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {formatCurrency(stats.averageOrderValue)}
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
                  {t('business.dashboard.quickActions', 'Acțiuni rapide')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/business-portal/orders">
                  <Button variant="outline" className="w-full justify-start">
                    <ShoppingCart className="mr-2 w-4 h-4" />
                    {t('business.dashboard.viewOrders', 'Vezi toate comenzile')}
                  </Button>
                </Link>
                <Link href="/business-portal/subscriptions">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="mr-2 w-4 h-4" />
                    {t('business.dashboard.viewSubscriptions', 'Vezi abonamentele')}
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
