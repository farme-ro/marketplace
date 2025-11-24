/**
 * Investors Dashboard Page
 * 
 * Dashboard dedicat pentru investitori cu metrici relevante
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent } from 'farme-ui'
import { RequireAuth } from '@/components/auth/require-auth'
import { useAuth } from '@/lib/auth/context'
import { useI18n } from '@/lib/i18n/context'
import { formatCurrency, formatDate, formatNumber } from '@/lib/utils/format'
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  BarChart3, 
  Target,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  FileText,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from 'farme-ui'

// Mock data - will be replaced with API calls
const mockMetrics = {
  totalRevenue: 2500000, // RON
  revenueGrowth: 25.5, // %
  activeProducers: 520,
  producersGrowth: 15.2,
  totalOrders: 12500,
  ordersGrowth: 30.1,
  averageOrderValue: 150,
  orderValueGrowth: 5.3,
  totalProducts: 3500,
  activeUsers: 8500,
  usersGrowth: 22.4,
}

const recentUpdates = [
  {
    date: '2024-01-15',
    title: 'Lansare servicii B2B',
    description: 'Am lansat serviciile dedicate pentru restaurante și afaceri',
    type: 'feature',
  },
  {
    date: '2024-01-10',
    title: '500+ producători activi',
    description: 'Am atins un milestone important: peste 500 de producători parteneri',
    type: 'milestone',
  },
  {
    date: '2024-01-05',
    title: 'Raport financiar Q4 2023',
    description: 'Raportul financiar pentru trimestrul 4 este disponibil pentru descărcare',
    type: 'report',
  },
]

export default function InvestorsDashboardPage() {
  const { investorUser } = useAuth()
  const { locale } = useI18n()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // Check if investor is approved
  if (investorUser?.status === 'PENDING') {
    return (
      <div className="min-h-screen bg-background py-8 md:py-12">
        <PageContainer className="max-w-2xl">
          <Card className="border-border rounded-2xl shadow-xl bg-card">
            <CardContent className="p-12 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Cont în așteptarea aprobării
              </h2>
              <p className="text-muted-foreground mb-6">
                Contul tău este în așteptarea aprobării echipei. 
                Vei primi un email când contul tău va fi aprobat și vei putea accesa dashboard-ul complet.
              </p>
              <p className="text-sm text-muted-foreground">
                Pentru întrebări, contactează-ne la{' '}
                <a href="mailto:investitori@farme.ro" className="text-primary hover:underline">
                  investitori@farme.ro
                </a>
              </p>
            </CardContent>
          </Card>
        </PageContainer>
      </div>
    )
  }

  return (
    <RequireAuth role="investor" fallbackRedirect="/pentru-investitori/login">
      <InvestorsDashboardContent investorUser={investorUser} />
    </RequireAuth>
  )
}

function InvestorsDashboardContent({ investorUser }: { investorUser: any }) {
  const { locale } = useI18n()

  const kpis = [
    {
      icon: DollarSign,
      label: 'Venituri totale',
      value: `${formatNumber(mockMetrics.totalRevenue / 1000000, locale)}M RON`,
      sublabel: `+${formatNumber(mockMetrics.revenueGrowth, locale)}% față de luna trecută`,
      trend: mockMetrics.revenueGrowth > 0 ? 'up' : 'down',
      trendValue: `+${mockMetrics.revenueGrowth}%`,
    },
    {
      icon: Users,
      label: 'Producători activi',
      value: `${mockMetrics.activeProducers}+`,
      sublabel: `+${mockMetrics.producersGrowth}% creștere`,
      trend: 'up',
      trendValue: `+${mockMetrics.producersGrowth}%`,
    },
    {
      icon: ShoppingCart,
      label: 'Comenzi totale',
      value: `${(mockMetrics.totalOrders / 1000).toFixed(1)}K`,
      sublabel: `+${mockMetrics.ordersGrowth}% față de luna trecută`,
      trend: 'up',
      trendValue: `+${mockMetrics.ordersGrowth}%`,
    },
    {
      icon: Target,
      label: 'Valoare medie comandă',
      value: `${mockMetrics.averageOrderValue} RON`,
      sublabel: `+${mockMetrics.orderValueGrowth}% creștere`,
      trend: 'up',
      trendValue: `+${mockMetrics.orderValueGrowth}%`,
    },
  ]

  return (
    <div className="min-h-screen bg-background py-8 md:py-12">
      <PageContainer>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
                Dashboard Investitori
              </h1>
              <p className="text-muted-foreground">
                Metrici și actualizări despre performanța farme.ro
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/contact?type=investor">
                <Button variant="outline" size="sm">
                  Contactează echipa
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="border border-border rounded-xl shadow-sm bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg bg-primary-soft flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      {kpi.trend === 'up' ? (
                        <div className="flex items-center gap-1 text-primary text-xs font-semibold">
                          <ArrowUpRight className="w-4 h-4" />
                          {kpi.trendValue}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-destructive text-xs font-semibold">
                          <ArrowDownRight className="w-4 h-4" />
                          {kpi.trendValue}
                        </div>
                      )}
                    </div>
                    <p className="text-2xl font-bold text-foreground mb-1">
                      {kpi.value}
                    </p>
                    <p className="text-sm font-medium text-foreground mb-1">
                      {kpi.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {kpi.sublabel}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Growth Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="border border-border rounded-xl shadow-sm bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">
                    Metrici de creștere
                  </h2>
                  <BarChart3 className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Creștere venituri</p>
                        <p className="text-xs text-muted-foreground">Lună peste lună</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">+{mockMetrics.revenueGrowth}%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Creștere utilizatori</p>
                        <p className="text-xs text-muted-foreground">Lună peste lună</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">+{mockMetrics.usersGrowth}%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Creștere comenzi</p>
                        <p className="text-xs text-muted-foreground">Lună peste lună</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">+{mockMetrics.ordersGrowth}%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Updates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="border border-border rounded-xl shadow-sm bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">
                    Actualizări recente
                  </h2>
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="space-y-4">
                  {recentUpdates.map((update, index) => (
                    <div key={index} className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary-soft flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground mb-1">
                            {formatDate(update.date, locale, {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </p>
                          <p className="text-sm font-semibold text-foreground mb-1">
                            {update.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {update.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  href="/pentru-investitori#pitch-deck"
                  className="mt-4 block text-center text-sm text-primary hover:text-primary/80 font-medium"
                >
                  Vezi toate actualizările →
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6"
        >
          <Card className="border border-border rounded-xl shadow-sm bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Rapoarte și documente
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Accesează rapoarte financiare detaliate, pitch deck-uri și alte documente relevante
                  </p>
                </div>
                <Link href="/contact?type=investor">
                  <Button variant="outline">
                    Solicită acces
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </PageContainer>
    </div>
  )
}

