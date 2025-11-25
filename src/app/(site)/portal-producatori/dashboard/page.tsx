/**
 * Producer Dashboard Page
 * 
 * Dashboard principal pentru producători - integrat cu API
 */

'use client'

import { useEffect, useState } from 'react'
import { ProducerDashboardLayout } from '@/components/producer-portal/producer-dashboard-layout'
import { DashboardHeader } from './_components/dashboard-header'
import { DashboardKPIs } from './_components/dashboard-kpis'
import { RecentOrdersSection } from './_components/recent-orders-section'
import { ProductsAttentionSection } from './_components/products-attention-section'
import { SubscriptionCommissionSection } from './_components/subscription-commission-section'
import { HelpResourcesSection } from './_components/help-resources-section'
import { QuickActionsSection } from './_components/quick-actions-section'
import { VisibilitySuggestionsSection } from './_components/visibility-suggestions-section'
import { useAuth } from '@/lib/auth/context'
import { getProducerInsights } from '@/lib/api/producer/insights'
import { getProducerOrders } from '@/lib/api/producer/orders'
import { getProducerProducts } from '@/lib/api/producer/products'
import { getProducerCommissionSummary } from '@/lib/api/producer/commissions'
import { TrendingUp, PackageSearch, ShoppingBasket, Star } from 'lucide-react'
import type { ProducerOrder } from '@/lib/api/producer/orders'
import type { ProducerProduct } from '@/lib/api/producer/products'
import { useI18n } from '@/lib/i18n/context'
import { formatCurrency, formatDate } from '@/lib/utils/format'

export default function ProducerDashboardPage() {
  const { producerUser } = useAuth()
  const { t, locale } = useI18n()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Data state
  const [insights, setInsights] = useState<any>(null)
  const [recentOrders, setRecentOrders] = useState<ProducerOrder[]>([])
  const [products, setProducts] = useState<ProducerProduct[]>([])
  const [commissionSummary, setCommissionSummary] = useState<any>(null)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true)
        setError(null)

        // Load all data in parallel
        const [insightsData, ordersData, productsData, commissionData] = await Promise.allSettled([
          getProducerInsights(),
          getProducerOrders({ status: undefined }), // Get all orders
          getProducerProducts(),
          getProducerCommissionSummary(),
        ])

        // Handle insights
        if (insightsData.status === 'fulfilled') {
          setInsights(insightsData.value)
        } else if (insightsData.status === 'rejected') {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.error('[Producer Dashboard] Failed to load insights:', insightsData.reason)
          }
        }

        // Handle orders - get first 5 most recent
        if (ordersData.status === 'fulfilled') {
          const sorted = ordersData.value
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
          setRecentOrders(sorted)
        } else if (ordersData.status === 'rejected') {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.error('[Producer Dashboard] Failed to load orders:', ordersData.reason)
          }
        }

        // Handle products
        if (productsData.status === 'fulfilled') {
          setProducts(productsData.value)
        } else if (productsData.status === 'rejected') {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.error('[Producer Dashboard] Failed to load products:', productsData.reason)
          }
        }

        // Handle commission summary
        if (commissionData.status === 'fulfilled' && commissionData.value) {
          setCommissionSummary(commissionData.value)
        } else if (commissionData.status === 'rejected') {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.error('[Producer Dashboard] Failed to load commission summary:', commissionData.reason)
          }
        }
      } catch (err: any) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('Error loading dashboard data:', err)
        }
        setError(err.message || t('producer.dashboard.errorLoading', 'Eroare la încărcarea datelor dashboard-ului'))
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Prepare data for components
  const producerName = producerUser?.fullName || producerUser?.producerName || 'Producător'
  const currentPlan = commissionSummary?.planName || 'Gratuit'
  const currentCommission = commissionSummary?.currentCommissionPercent 
    ? `${commissionSummary.currentCommissionPercent}%`
    : '10%' // Default

  // Prepare KPIs from insights
  const kpis = insights ? [
    {
      label: t('producer.dashboard.salesThisMonth', 'Vânzări luna aceasta'),
      value: `${insights.totalRevenueMonth.toFixed(0)} lei`,
      sublabel: insights.revenueGrowthMonth 
        ? t('producer.dashboard.growthMonth', '{value}% față de luna trecută').replace('{value}', `${insights.revenueGrowthMonth > 0 ? '+' : ''}${insights.revenueGrowthMonth.toFixed(0)}`)
        : undefined,
      icon: TrendingUp,
      trend: insights.revenueGrowthMonth ? {
        value: `${insights.revenueGrowthMonth > 0 ? '+' : ''}${insights.revenueGrowthMonth.toFixed(0)}%`,
        isPositive: insights.revenueGrowthMonth > 0,
      } : undefined,
    },
    {
      label: t('producer.dashboard.activeOrders', 'Comenzi active'),
      value: `${insights.pendingOrders + insights.confirmedOrders} comenzi`,
      sublabel: `${insights.pendingOrders} noi, ${insights.confirmedOrders} confirmate`,
      icon: PackageSearch,
    },
    {
      label: t('producer.dashboard.activeProducts', 'Produse active'),
      value: `${insights.activeProducts} produse listate`,
      sublabel: insights.lowStockProducts > 0 
        ? `${insights.lowStockProducts} cu stoc redus – vezi detalii`
        : undefined,
      icon: ShoppingBasket,
    },
    {
      label: t('producer.dashboard.avgOrderValue', 'Valoare medie comandă'),
      value: formatCurrency(insights.averageOrderValue, locale),
      sublabel: undefined,
      icon: Star,
    },
  ] : undefined

  // Prepare recent orders for RecentOrdersSection
  const formattedOrders = recentOrders.map(order => ({
    id: order.number,
    date: formatDate(order.createdAt, locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    client: order.customerName,
    value: formatCurrency(order.total, locale),
    status: (order.status === 'pending' ? 'Nouă'
      : order.status === 'confirmed' || order.status === 'preparing' ? (t('producer.dashboard.inPreparation', 'În pregătire') as 'În pregătire')
      : order.status === 'shipped' ? 'În livrare'
      : order.status === 'delivered' ? 'Finalizată'
      : 'Anulată') as 'Nouă' | 'În pregătire' | 'În livrare' | 'Finalizată' | 'Anulată',
  }))

  // Prepare products needing attention
  const productsNeedingAttention = products
    .filter(p => !p.isActive || (p.stock !== undefined && p.stock <= 0) || (p.stock !== undefined && p.stock < 5))
    .slice(0, 5)
    .map(p => ({
      id: p.id,
      name: p.name,
      status: (!p.isActive ? (t('producer.dashboard.notVisible', 'Nu este vizibil') as 'Nu este vizibil')
        : p.stock === 0 ? 'Epuizat'
        : (p.stock !== undefined && p.stock < 5) ? 'Stoc redus'
        : (t('producer.dashboard.notVisible', 'Nu este vizibil') as 'Nu este vizibil')) as 'Nu este vizibil' | 'Stoc redus' | 'Epuizat',
      badge: (!p.isActive ? 'Inactiv' : undefined) as 'Inactiv' | 'Ascuns din listă' | undefined,
    }))

  if (isLoading) {
    return (
      <ProducerDashboardLayout>
        <div className="max-w-8xl mx-auto px-4 lg:px-6 space-y-6 lg:space-y-8">
          <div className="text-center py-20">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
            <p className="text-muted-foreground">{t('producer.dashboard.loading', 'Se încarcă dashboard-ul...')}</p>
          </div>
        </div>
      </ProducerDashboardLayout>
    )
  }

  if (error) {
    return (
      <ProducerDashboardLayout>
        <div className="max-w-8xl mx-auto px-4 lg:px-6 space-y-6 lg:space-y-8">
          <div className="text-center py-20">
            <p className="text-destructive mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-primary hover:underline"
            >
              Încearcă din nou
            </button>
          </div>
        </div>
      </ProducerDashboardLayout>
    )
  }

  return (
    <ProducerDashboardLayout>
      <div className="max-w-8xl mx-auto px-4 lg:px-6 space-y-6 lg:space-y-8">
        {/* Header */}
        <DashboardHeader
          producerName={producerName}
          currentPlan={currentPlan}
        />

        {/* KPIs */}
        <DashboardKPIs kpis={kpis} />

        {/* Quick Actions */}
        <QuickActionsSection />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Comenzi recente */}
          <div className="lg:col-span-2">
            <RecentOrdersSection orders={formattedOrders} />
          </div>

          {/* Right Column - Produse, Abonament, Ajutor */}
          <div className="space-y-6 lg:space-y-8">
            <VisibilitySuggestionsSection />
            <ProductsAttentionSection products={productsNeedingAttention} />
            <SubscriptionCommissionSection
              currentPlan={currentPlan}
              currentCommission={currentCommission}
            />
            <HelpResourcesSection />
          </div>
        </div>
      </div>
    </ProducerDashboardLayout>
  )
}
