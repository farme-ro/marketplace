/**
 * Producer Insights Page
 * 
 * Pagină pentru statistici și analize
 * Integrat cu API pentru date reale
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'
import { ProducerDashboardLayout } from '@/components/producer-portal/producer-dashboard-layout'
import { getProducerInsights } from '@/lib/api/producer/insights'
import type { ProducerInsights } from '@/lib/api/producer/insights'
import { useI18n } from '@/lib/i18n/context'
import { formatCurrency, formatNumber } from '@/lib/utils/format'
import { TrendingUp, Package, ShoppingBag, DollarSign } from 'lucide-react'

export default function ProducerInsightsPage() {
  const { locale } = useI18n()
  const [insights, setInsights] = useState<ProducerInsights | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadInsights() {
      try {
        setIsLoading(true)
        setError(null)
        const insightsData = await getProducerInsights()
        setInsights(insightsData)
      } catch (err: any) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('Error loading insights:', err)
        }
        setError(err.message || 'Eroare la încărcarea statisticilor')
      } finally {
        setIsLoading(false)
      }
    }

    loadInsights()
  }, [])

  if (isLoading) {
    return (
      <ProducerDashboardLayout>
        <div className="max-w-8xl mx-auto px-4 py-10">
          <div className="text-center py-20">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
            <p className="text-muted-foreground">Se încarcă statisticile...</p>
          </div>
        </div>
      </ProducerDashboardLayout>
    )
  }

  if (error && !insights) {
    return (
      <ProducerDashboardLayout>
        <div className="max-w-8xl mx-auto px-4 py-10">
          <Card className="border border-border rounded-2xl">
            <CardContent className="p-12 text-center">
              <p className="text-destructive mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-primary hover:underline"
              >
                Încearcă din nou
              </button>
            </CardContent>
          </Card>
        </div>
      </ProducerDashboardLayout>
    )
  }

  // If insights is null or has no data, show placeholder
  if (!insights || (insights.totalRevenueMonth === 0 && insights.totalOrdersMonth === 0)) {
    return (
      <ProducerDashboardLayout>
        {/* Mobile View */}
        <div className="md:hidden">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">
              Statistici
            </h1>
            <p className="text-sm text-foreground-body">
              Vezi performanța afacerii tale
            </p>
          </motion.div>

          <Card className="border border-border rounded-2xl shadow-premium bg-card">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Statisticile vor fi disponibile în curând
              </h3>
              <p className="text-sm text-foreground-body">
                Vei putea vedea produsele cele mai vândute, orele cu cele mai multe comenzi și multe altele.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
              Statistici & Analize
            </h1>
            <p className="text-base md:text-lg text-foreground-body leading-relaxed max-w-3xl">
              Vezi performanța produselor, comenzilor și clienților tăi
            </p>
          </motion.div>

          <Card className="border border-border rounded-[32px] shadow-premium bg-card">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <TrendingUp className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Secțiunea de statistici este în curs de dezvoltare
              </h3>
              <p className="text-foreground-body leading-relaxed max-w-md mx-auto">
                Vei putea vedea produsele cele mai vândute, orele cu cele mai multe comenzi și multe altele.
              </p>
            </CardContent>
          </Card>
        </div>
      </ProducerDashboardLayout>
    )
  }

  return (
    <ProducerDashboardLayout>
      {/* Mobile View */}
      <div className="md:hidden">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">
            Statistici
          </h1>
          <p className="text-sm text-foreground-body">
            Vezi performanța afacerii tale
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="border border-border rounded-2xl shadow-premium bg-card">
            <CardContent className="p-4">
              <p className="text-xs text-foreground-body mb-1">Venit luna aceasta</p>
              <p className="text-xl font-bold text-foreground">
                {formatCurrency(insights.totalRevenueMonth, locale)}
              </p>
            </CardContent>
          </Card>
          <Card className="border border-border rounded-2xl shadow-premium bg-card">
            <CardContent className="p-4">
              <p className="text-xs text-foreground-body mb-1">Comenzi</p>
              <p className="text-xl font-bold text-foreground">
                {insights.totalOrdersMonth}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Placeholder */}
        <Card className="border border-border rounded-2xl shadow-premium bg-card">
          <CardContent className="p-6">
            <h3 className="text-base font-semibold text-foreground mb-4">Venit săptămânal</h3>
            <div className="h-40 bg-muted rounded-xl flex items-center justify-center">
              <p className="text-sm text-foreground-body">Grafic va fi disponibil în curând</p>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        {insights.topProducts && insights.topProducts.length > 0 && (
          <Card className="border border-border rounded-2xl shadow-premium bg-card mt-4">
            <CardContent className="p-6">
              <h3 className="text-base font-semibold text-foreground mb-4">Produse best seller</h3>
              <div className="space-y-3">
                {insights.topProducts.slice(0, 5).map((product, index) => (
                  <div key={product.id || index} className="flex items-center justify-between">
                    <span className="text-sm text-foreground-body">{product.name}</span>
                    <span className="text-sm font-semibold text-foreground">
                      {product.orders} comenzi
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            Statistici & Analize
          </h1>
          <p className="text-base md:text-lg text-foreground-body leading-relaxed max-w-3xl">
            Vezi performanța produselor, comenzilor și clienților tăi
          </p>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border border-border rounded-2xl shadow-sm bg-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground">Venit luna aceasta</p>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(insights.totalRevenueMonth, locale)}
              </p>
              {insights.revenueGrowthMonth && (
                <p className={`text-xs mt-1 ${insights.revenueGrowthMonth > 0 ? 'text-primary' : 'text-destructive'}`}>
                  {insights.revenueGrowthMonth > 0 ? '+' : ''}{formatNumber(insights.revenueGrowthMonth, locale)}% față de luna trecută
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border border-border rounded-2xl shadow-sm bg-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Package className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground">Comenzi luna aceasta</p>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {insights.totalOrdersMonth}
              </p>
              {insights.ordersGrowthMonth && (
                <p className={`text-xs mt-1 ${insights.ordersGrowthMonth > 0 ? 'text-primary' : 'text-destructive'}`}>
                  {insights.ordersGrowthMonth > 0 ? '+' : ''}{formatNumber(insights.ordersGrowthMonth, locale)}% față de luna trecută
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border border-border rounded-2xl shadow-sm bg-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground">Valoare medie comandă</p>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(insights.averageOrderValue, locale)}
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border rounded-2xl shadow-sm bg-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground">Produse active</p>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {insights.activeProducts}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                din {insights.totalProducts} total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Placeholder */}
        <Card className="border border-border rounded-2xl shadow-sm bg-card mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Evoluție venituri</h3>
            <div className="h-64 bg-muted rounded-xl flex items-center justify-center">
              <p className="text-sm text-foreground-body">Grafic va fi disponibil în curând</p>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        {insights.topProducts && insights.topProducts.length > 0 && (
          <Card className="border border-border rounded-2xl shadow-sm bg-card">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Produse best seller</h3>
              <div className="space-y-4">
                {insights.topProducts.map((product, index) => (
                  <div key={product.id || index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-foreground">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.orders} comenzi • {product.quantity} bucăți
                      </p>
                    </div>
                    <p className="text-base font-semibold text-foreground">
                      {formatCurrency(product.revenue, locale)}
                    </p>
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
