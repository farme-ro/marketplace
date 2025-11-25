/**
 * Investor Portal Dashboard
 * 
 * Dashboard pentru investitori cu metrici agregate și anonimizate.
 * Folosește FarmeroInvestorMetrics pentru date unificate.
 */

'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth/context'
import { useI18n } from '@/lib/i18n/context'
import { getInvestorMetrics } from '@/lib/api/farmero-investor'
import { getInvestorDashboardData } from '@/lib/api/investor-dashboard'
import type { FarmeroInvestorMetrics } from '@/lib/types/farmero-investor-metrics'
import type { InvestorDashboardData } from '@/lib/types/domain'
import { Card, CardContent, CardHeader, CardTitle } from 'farme-ui'
import { Button } from 'farme-ui'
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  MapPin,
  Loader2,
  RefreshCw,
  BarChart3,
} from 'lucide-react'
import { formatCurrency, formatNumber } from '@/lib/utils/format'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorState } from '@/components/ui/error-state'
import { GridSkeleton } from '@/components/ui/unified-skeletons'
import { trackEvent } from '@/lib/analytics'

// Simple Line Chart Component (reused from existing)
function SimpleLineChart({
  data,
  valueKey,
  labelKey,
  color = 'primary',
}: {
  data: Array<{ [key: string]: string | number }>
  valueKey: string
  labelKey: string
  color?: 'primary' | 'green' | 'blue' | 'orange'
}) {
  if (data.length === 0) return null

  const values = data.map((d) => Number(d[valueKey]))
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1

  const colorClasses = {
    primary: 'stroke-primary',
    green: 'stroke-green-500',
    blue: 'stroke-blue-500',
    orange: 'stroke-orange-500',
  }

  const fillClasses = {
    primary: 'fill-primary/10',
    green: 'fill-green-500/10',
    blue: 'fill-blue-500/10',
    orange: 'fill-orange-500/10',
  }

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100
    const y = 100 - ((Number(d[valueKey]) - min) / range) * 100
    return `${x},${y}`
  })

  const pathData = `M ${points.join(' L ')}`

  return (
    <div className="w-full h-48 relative" aria-label={`Chart showing ${valueKey} over time`}>
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`${pathData} L 100,100 L 0,100 Z`}
          fill={`url(#gradient-${color})`}
          className={fillClasses[color]}
        />
        <path
          d={pathData}
          fill="none"
          strokeWidth="2"
          className={colorClasses[color]}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

export default function InvestorDashboardPage() {
  const { user } = useAuth()
  const { t } = useI18n()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [metrics, setMetrics] = useState<FarmeroInvestorMetrics | null>(null)
  const [dashboardData, setDashboardData] = useState<InvestorDashboardData | null>(null)

  useEffect(() => {
    async function loadMetrics() {
      try {
        setIsLoading(true)
        setError(null)

        // Track dashboard view
        trackEvent('investor_dashboard_view', { timestamp: Date.now() })

        // Load both old metrics (for compatibility) and new dashboard data
        const [oldMetrics, newData] = await Promise.all([
          getInvestorMetrics().catch(() => null),
          getInvestorDashboardData().catch(() => null),
        ])

        if (oldMetrics === null && newData === null) {
          // Feature is disabled - show "coming soon" message
          setMetrics(null)
          setDashboardData(null)
        } else {
          setMetrics(oldMetrics)
          setDashboardData(newData)
        }
      } catch (err: unknown) {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('[Investor Dashboard] Error loading metrics:', err)
        }
        
        if (err instanceof Error) {
          if (err.message.includes('403') || err.message.includes('permisiune')) {
            setError(t('investor.dashboard.errorForbidden', 'Nu ai încă acces la acest dashboard. Verifică permisiunile contului tău.'))
          } else {
            setError(err.message || t('investor.dashboard.errorGeneric', 'A apărut o problemă la încărcarea datelor. Încearcă din nou mai târziu.'))
          }
        } else {
          setError(t('investor.dashboard.errorGeneric', 'A apărut o problemă la încărcarea datelor. Încearcă din nou mai târziu.'))
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadMetrics()
  }, [t])

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-8xl mx-auto px-4 space-y-6">
          <div className="space-y-2">
            <div className="h-10 w-64 bg-muted rounded animate-pulse" />
            <div className="h-4 w-96 bg-muted rounded animate-pulse" />
          </div>
          <GridSkeleton count={6} columns={3} />
        </div>
      </div>
    )
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-8xl mx-auto px-4">
          <ErrorState
            title={t('investor.dashboard.errorTitle', 'Eroare la încărcare')}
            message={error}
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    )
  }

  // Feature Disabled / Coming Soon
  if (metrics === null) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-8xl mx-auto px-4">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {t('investor.dashboard.title', 'Panou investitor')}
              </h1>
              <p className="text-muted-foreground">
                {t('investor.dashboard.subtitle', 'Statistici agregate despre utilizarea platformei și evoluția Farmero.')}
              </p>
            </div>

            <EmptyState
              icon={BarChart3}
              title={t('investor.dashboard.comingSoonTitle', 'Dashboard-ul de investitor este în curs de pregătire')}
              description={t('investor.dashboard.comingSoonDescription', 'În curând vei vedea aici date agregate despre activitatea din platformă.')}
              card={true}
              size="md"
            />
          </div>
        </div>
      </div>
    )
  }

  const investorName = user?.fullName || user?.email || 'Investitor'

  // Prepare KPI Cards
  const kpis = [
    {
      label: t('investor.dashboard.totalOrders', 'Comenzi totale'),
      value: formatNumber(metrics.snapshot.totalOrders),
      icon: ShoppingCart,
    },
    {
      label: t('investor.dashboard.totalGMV', 'GMV total'),
      value: formatCurrency(metrics.snapshot.totalGrossMerchandiseVolume),
      icon: DollarSign,
    },
    {
      label: t('investor.dashboard.totalFees', 'Comisioane Farmero'),
      value: formatCurrency(metrics.snapshot.totalFarmeroFeesCollected),
      icon: TrendingUp,
    },
    {
      label: t('investor.dashboard.activeProducers', 'Producători activi'),
      value: formatNumber(metrics.snapshot.totalProducersActive),
      icon: Package,
    },
    {
      label: t('investor.dashboard.activeClients', 'Clienți activi'),
      value: formatNumber(metrics.snapshot.totalClientsActive),
      icon: Users,
    },
    {
      label: t('investor.dashboard.activeRegions', 'Regiuni active'),
      value: formatNumber(metrics.snapshot.totalRegionsActive),
      icon: MapPin,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-8xl mx-auto px-4 py-8 lg:px-6 lg:py-10 space-y-6 lg:space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {t('investor.dashboard.title', 'Panou investitor')}
          </h1>
          <p className="text-muted-foreground">
            {t(
              'investor.dashboard.subtitle',
              'Date agregate, anonimizate despre sănătatea ecosistemului Farmero.'
            )}
          </p>
          {/* Anonymization Notice */}
          <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm text-foreground">
              <strong>{t('investor.dashboard.anonymizationTitle', 'Anonimizare:')}</strong>{' '}
              {t(
                'investor.dashboard.anonymizationNotice',
                'Nu se afișează date la nivel de persoană sau firmă, doar agregate. Nu se expune niciun identificator de client/producător.'
              )}
            </p>
          </div>
        </div>

        {/* KPI Cards - Snapshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {kpis.map((kpi) => {
            const Icon = kpi.icon
            return (
              <Card key={kpi.label} className="border-border/60">
                <CardContent className="p-5 lg:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
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

        {/* Charts Grid - Evolution Over Time */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Orders Over Time */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>{metrics.kpiSeries.ordersOverTime.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleLineChart
                data={metrics.kpiSeries.ordersOverTime.points.map((p) => ({
                  date: p.date,
                  value: p.value,
                }))}
                valueKey="value"
                labelKey="date"
                color="primary"
              />
            </CardContent>
          </Card>

          {/* GMV Over Time */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>{metrics.kpiSeries.gmvOverTime.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleLineChart
                data={metrics.kpiSeries.gmvOverTime.points.map((p) => ({
                  date: p.date,
                  value: p.value,
                }))}
                valueKey="value"
                labelKey="date"
                color="green"
              />
            </CardContent>
          </Card>

          {/* Fees Over Time */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>{metrics.kpiSeries.feesOverTime.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleLineChart
                data={metrics.kpiSeries.feesOverTime.points.map((p) => ({
                  date: p.date,
                  value: p.value,
                }))}
                valueKey="value"
                labelKey="date"
                color="blue"
              />
            </CardContent>
          </Card>
        </div>

        {/* Growth & Retention */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>
              {t('investor.dashboard.growthTitle', 'Creștere & retenție')} - {metrics.growth.periodLabel}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-foreground">
                  {formatNumber(metrics.growth.newClients)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('investor.dashboard.newClients', 'Clienți noi')}
                </p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-foreground">
                  {formatNumber(metrics.growth.returningClients)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('investor.dashboard.returningClients', 'Clienți recurenți')}
                </p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-foreground">
                  {(metrics.growth.repeatOrderRate * 100).toFixed(0)}%
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('investor.dashboard.repeatRate', 'Rata de revenire')}
                </p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(metrics.growth.averageOrderValue)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('investor.dashboard.averageOrderValue', 'Valoare medie comandă')}
                </p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-foreground">
                  {formatNumber(metrics.growth.newProducers)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('investor.dashboard.newProducers', 'Producători noi')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Segments & Regions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Segments */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>{t('investor.dashboard.segmentsTitle', 'Segmente')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-2 text-xs font-medium text-muted-foreground pb-2 border-b">
                  <div>{t('investor.dashboard.segment', 'Segment')}</div>
                  <div className="text-right">{t('investor.dashboard.orders', 'Comenzi')}</div>
                  <div className="text-right">{t('investor.dashboard.gmv', 'GMV')}</div>
                  <div className="text-right">{t('investor.dashboard.fees', 'Fees')}</div>
                </div>
                {metrics.segments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {t('investor.dashboard.noSegments', 'Nu există date de segmente disponibile.')}
                  </p>
                ) : (
                  metrics.segments.map((segment, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2 text-sm">
                      <div className="font-medium text-foreground">{segment.segmentLabel}</div>
                      <div className="text-right text-foreground">
                        {formatNumber(segment.ordersCount)}
                      </div>
                      <div className="text-right text-foreground">
                        {formatCurrency(segment.gmv)}
                      </div>
                      <div className="text-right text-foreground">
                        {formatCurrency(segment.fees)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Regions */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>{t('investor.dashboard.regionsTitle', 'Regiuni')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-2 text-xs font-medium text-muted-foreground pb-2 border-b">
                  <div>{t('investor.dashboard.region', 'Regiune')}</div>
                  <div className="text-right">{t('investor.dashboard.orders', 'Comenzi')}</div>
                  <div className="text-right">{t('investor.dashboard.gmv', 'GMV')}</div>
                  <div className="text-right">{t('investor.dashboard.producers', 'Producători')}</div>
                </div>
                {metrics.regions.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {t('investor.dashboard.noRegions', 'Nu există date de regiuni disponibile.')}
                  </p>
                ) : (
                  metrics.regions.map((region, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2 text-sm">
                      <div className="font-medium text-foreground">{region.regionName}</div>
                      <div className="text-right text-foreground">
                        {formatNumber(region.ordersCount)}
                      </div>
                      <div className="text-right text-foreground">
                        {formatCurrency(region.gmv)}
                      </div>
                      <div className="text-right text-foreground">
                        {formatNumber(region.producersCount)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights Section */}
        {dashboardData && dashboardData.notes && dashboardData.notes.length > 0 && (
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>{t('investor.dashboard.insightsTitle', 'Insights')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {dashboardData.notes.map((note, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="text-primary mt-1">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Empty State if no data */}
        {metrics.snapshot.totalOrders === 0 && metrics.segments.length === 0 && metrics.regions.length === 0 && (
          <EmptyState
            icon={BarChart3}
            title={t('investor.dashboard.noDataTitle', 'Nu există date disponibile')}
            description={t('investor.dashboard.noDataDescription', 'Încă nu există suficientă activitate pentru a afișa statistici relevante.')}
            card={true}
            size="md"
          />
        )}
      </div>
    </div>
  )
}
