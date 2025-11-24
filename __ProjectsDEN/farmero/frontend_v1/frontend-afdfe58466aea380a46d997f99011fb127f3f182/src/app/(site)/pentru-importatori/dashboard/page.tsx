/**
 * Importers Dashboard Page
 * 
 * Dashboard dedicat pentru importatori cu statistici, parteneriate, comenzi și produse
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent } from 'farme-ui'
import { RequireAuth } from '@/components/auth/require-auth'
import { useAuth } from '@/lib/auth/context'
import { 
  Globe, 
  DollarSign, 
  Package, 
  Handshake,
  BarChart3, 
  Calendar,
  TrendingUp,
  ArrowUpRight,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from 'farme-ui'
import { useI18n } from '@/lib/i18n/context'
import { formatNumber, formatCurrency } from '@/lib/utils/format'
import { formatUnit } from '@/lib/utils/format-units'

// Mock data - will be replaced with API calls
const mockMetrics = {
  totalPartnerships: 12,
  partnershipsGrowth: 15.2,
  totalOrders: 156,
  ordersGrowth: 8.7,
  totalVolume: 1250, // tons
  volumeGrowth: 22.3,
  activeProducts: 45,
  pendingOrders: 8,
  completedOrders: 148,
  averageOrderValue: 12500, // EUR
  satisfactionRate: 4.8, // /5
}

const recentOrders = [
  {
    id: 'ORD-001',
    date: '2024-01-15',
    product: 'Mere Golden Delicious',
    quantity: 5000, // kg
    status: 'completed',
    value: 12500,
  },
  {
    id: 'ORD-002',
    date: '2024-01-15',
    product: 'Prune',
    quantity: 3000,
    status: 'in_progress',
    value: 8500,
  },
  {
    id: 'ORD-003',
    date: '2024-01-14',
    product: 'Căpșuni',
    quantity: 2000,
    status: 'completed',
    value: 6200,
  },
]

const partnerships = [
  {
    id: 'PRT-001',
    producer: 'Ferma Bio SRL',
    product: 'Legume bio',
    startDate: '2023-06-01',
    status: 'active',
    totalVolume: 500, // tons
    totalValue: 250000, // EUR
  },
  {
    id: 'PRT-002',
    producer: 'Fructe Premium SA',
    product: 'Fructe de sezon',
    startDate: '2023-08-15',
    status: 'active',
    totalVolume: 320,
    totalValue: 180000,
  },
]

export default function ImportersDashboardPage() {
  const { importerUser } = useAuth()
  const { t, locale } = useI18n()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // Check if importer user is approved
  if (importerUser?.status === 'PENDING') {
    return (
      <RequireAuth role="importer">
        <PageContainer className="max-w-4xl py-12">
          <Card className="border-border rounded-2xl shadow-xl bg-card">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Cont în așteptarea aprobării
              </h2>
              <p className="text-muted-foreground mb-6">
                Contul tău este în proces de aprobare. Vei primi un email când contul va fi activat.
              </p>
              <Link href="/pentru-importatori">
                <Button variant="outline">
                  Înapoi la pagina principală
                </Button>
              </Link>
            </CardContent>
          </Card>
        </PageContainer>
      </RequireAuth>
    )
  }

  return (
    <RequireAuth role="importer">
      <PageContainer className="py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
            Dashboard Importator
          </h1>
          <p className="text-muted-foreground">
            Bine ai venit, {importerUser?.fullName || 'Importator'}! Gestionează parteneriatele și comenzile tale.
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Partnerships */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-border rounded-xl shadow-sm bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center">
                    <Handshake className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    {mockMetrics.partnershipsGrowth}%
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Parteneriate active</p>
                  <p className="text-2xl font-bold text-foreground">{mockMetrics.totalPartnerships}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Total Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-border rounded-xl shadow-sm bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    {mockMetrics.ordersGrowth}%
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Comenzi totale</p>
                  <p className="text-2xl font-bold text-foreground">{mockMetrics.totalOrders}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Total Volume */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-border rounded-xl shadow-sm bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    {mockMetrics.volumeGrowth}%
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Volum total</p>
                  <p className="text-2xl font-bold text-foreground">{formatNumber(mockMetrics.totalVolume, locale)} t</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Average Order Value */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="border-border rounded-xl shadow-sm bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Valoare medie comandă</p>
                  <p className="text-2xl font-bold text-foreground">€{formatCurrency(mockMetrics.averageOrderValue, locale, 'EUR')}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="border-border rounded-xl shadow-sm bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">Comenzi recente</h2>
                  <Link href="/pentru-importatori/orders">
                    <Button variant="ghost" size="sm" className="text-primary">
                      Vezi toate
                      <ArrowUpRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-foreground">{order.id}</p>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              order.status === 'completed'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            }`}
                          >
                            {order.status === 'completed' ? 'Finalizată' : 'În proces'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{order.product}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatUnit(order.quantity, 'kg', locale, t)} • {order.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">€{formatCurrency(order.value, locale, 'EUR')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Active Partnerships */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="border-border rounded-xl shadow-sm bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">Parteneriate active</h2>
                  <Link href="/pentru-importatori/partnerships">
                    <Button variant="ghost" size="sm" className="text-primary">
                      Vezi toate
                      <ArrowUpRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
                <div className="space-y-4">
                  {partnerships.map((partnership) => (
                    <div
                      key={partnership.id}
                      className="p-4 rounded-lg border border-border bg-muted/30"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{partnership.producer}</p>
                          <p className="text-xs text-muted-foreground">{partnership.product}</p>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          Activ
                        </span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-muted-foreground">Volum total</p>
                          <p className="font-medium text-foreground">{partnership.totalVolume} t</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Valoare totală</p>
                          <p className="font-medium text-foreground">€{formatCurrency(partnership.totalValue, locale, 'EUR')}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="border-border rounded-xl shadow-sm bg-card">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Acțiuni rapide</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/pentru-importatori/products">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="w-4 h-4 mr-2" />
                    Explorează produse
                  </Button>
                </Link>
                <Link href="/pentru-importatori/partnerships/new">
                  <Button variant="outline" className="w-full justify-start">
                    <Handshake className="w-4 h-4 mr-2" />
                    Nou parteneriat
                  </Button>
                </Link>
                <Link href="/pentru-importatori/orders/new">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Comandă nouă
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </PageContainer>
    </RequireAuth>
  )
}

