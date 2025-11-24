/**
 * Logistics Dashboard Page
 * 
 * Dashboard dedicat pentru parteneri de logistică cu statistici, comisioane, livrări și contracte
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent } from 'farme-ui'
import { RequireAuth } from '@/components/auth/require-auth'
import { useAuth } from '@/lib/auth/context'
import { useI18n } from '@/lib/i18n/context'
import { formatDate } from '@/lib/utils/format'
import { 
  Truck, 
  DollarSign, 
  Package, 
  FileText,
  BarChart3, 
  Calendar,
  MapPin,
  Clock,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from 'farme-ui'

// Mock data - will be replaced with API calls
const mockMetrics = {
  totalDeliveries: 245,
  deliveriesGrowth: 12.5,
  totalRevenue: 125000, // RON
  revenueGrowth: 8.3,
  activeContracts: 3,
  pendingDeliveries: 12,
  completedDeliveries: 233,
  averageDeliveryTime: 2.5, // hours
  onTimeRate: 96.5, // %
}

const recentDeliveries = [
  {
    id: 'DLV-001',
    date: '2024-01-15',
    destination: 'București, Sector 1',
    status: 'completed',
    value: 450,
  },
  {
    id: 'DLV-002',
    date: '2024-01-15',
    destination: 'Cluj-Napoca',
    status: 'in_transit',
    value: 320,
  },
  {
    id: 'DLV-003',
    date: '2024-01-14',
    destination: 'Timișoara',
    status: 'completed',
    value: 280,
  },
]

const contracts = [
  {
    id: 'CTR-001',
    type: 'Livrări',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'active',
    commissionRate: 15, // %
  },
  {
    id: 'CTR-002',
    type: 'Depozitare',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'active',
    commissionRate: 10, // %
  },
]

export default function LogisticsDashboardPage() {
  const { logisticsUser } = useAuth()
  const { locale } = useI18n()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // Check if logistics user is approved
  if (logisticsUser?.status === 'PENDING') {
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
                <a href="mailto:logistica@farme.ro" className="text-primary hover:underline">
                  logistica@farme.ro
                </a>
              </p>
            </CardContent>
          </Card>
        </PageContainer>
      </div>
    )
  }

  return (
    <RequireAuth role="logistics" fallbackRedirect="/pentru-logistica/login">
      <LogisticsDashboardContent logisticsUser={logisticsUser} />
    </RequireAuth>
  )
}

function LogisticsDashboardContent({ logisticsUser }: { logisticsUser: any }) {
  const { t, locale } = useI18n()
  const kpis = [
    {
      icon: Truck,
      label: 'Livrări totale',
      value: `${mockMetrics.totalDeliveries}`,
      sublabel: `+${mockMetrics.deliveriesGrowth}% față de luna trecută`,
      trend: 'up',
      trendValue: `+${mockMetrics.deliveriesGrowth}%`,
    },
    {
      icon: DollarSign,
      label: 'Venituri totale',
      value: `${(mockMetrics.totalRevenue / 1000).toFixed(0)}K RON`,
      sublabel: `+${mockMetrics.revenueGrowth}% creștere`,
      trend: 'up',
      trendValue: `+${mockMetrics.revenueGrowth}%`,
    },
    {
      icon: Package,
      label: 'Livrări în curs',
      value: `${mockMetrics.pendingDeliveries}`,
      sublabel: `${mockMetrics.completedDeliveries} finalizate`,
    },
    {
      icon: FileText,
      label: 'Contracte active',
      value: `${mockMetrics.activeContracts}`,
      sublabel: 'Toate active',
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
                Dashboard Logistică
              </h1>
              <p className="text-muted-foreground">
                {logisticsUser?.companyName && (
                  <span className="font-medium">{logisticsUser.companyName}</span>
                )}
                {' - '}
                Gestionează livrările, comisioanele și contractele tale
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/contact?type=logistics">
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
                      {kpi.trend === 'up' && (
                        <div className="flex items-center gap-1 text-primary text-xs font-semibold">
                          <ArrowUpRight className="w-4 h-4" />
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
          {/* Recent Deliveries */}
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
                    Livrări recente
                  </h2>
                  <Truck className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="space-y-4">
                  {recentDeliveries.map((delivery, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary-soft flex items-center justify-center">
                          <Package className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {delivery.id}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span>{delivery.destination}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">
                          {delivery.value} RON
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(delivery.date, locale)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  href="/pentru-logistica/dashboard/deliveries"
                  className="mt-4 block text-center text-sm text-primary hover:text-primary/80 font-medium"
                >
                  Vezi toate livrările →
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contracts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="border border-border rounded-xl shadow-sm bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">
                    Contracte
                  </h2>
                  <FileText className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="space-y-4">
                  {contracts.map((contract, index) => (
                    <div key={index} className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {contract.id}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {contract.type}
                          </p>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p>
                          {formatDate(contract.startDate, locale)} - {formatDate(contract.endDate, locale)}
                        </p>
                        <p className="font-semibold text-foreground">
                          Comision: {contract.commissionRate}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  href="/pentru-logistica/dashboard/contracts"
                  className="mt-4 block text-center text-sm text-primary hover:text-primary/80 font-medium"
                >
                  Vezi toate contractele →
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6"
        >
          <Card className="border border-border rounded-xl shadow-sm bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">
                  Metrici de performanță
                </h3>
                <BarChart3 className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Timp mediu livrare</p>
                      <p className="text-2xl font-bold text-primary">
                        {mockMetrics.averageDeliveryTime}h
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Rata la timp</p>
                      <p className="text-2xl font-bold text-primary">
                        {mockMetrics.onTimeRate}%
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3 mb-2">
                    <Package className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Livrări finalizate</p>
                      <p className="text-2xl font-bold text-primary">
                        {mockMetrics.completedDeliveries}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </PageContainer>
    </div>
  )
}

