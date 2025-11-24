/**
 * Business Dashboard Page
 * 
 * Dashboard dedicat pentru conturi B2B cu comenzi, coșuri pentru angajați, produse favorite
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent } from 'farme-ui'
import { RequireAuth } from '@/components/auth/require-auth'
import { useAuth } from '@/lib/auth/context'
import { 
  ShoppingCart, 
  DollarSign, 
  Package, 
  Users,
  BarChart3, 
  Calendar,
  TrendingUp,
  ArrowUpRight,
  CheckCircle2,
  Heart,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from 'farme-ui'
import { useI18n } from '@/lib/i18n/context'
import { formatCurrency } from '@/lib/utils/format'

// Mock data - will be replaced with API calls
const mockMetrics = {
  totalOrders: 45,
  ordersGrowth: 12.5,
  totalSpent: 125000, // RON
  spentGrowth: 8.3,
  activeCarts: 8,
  completedOrders: 42,
  favoriteProducts: 15,
  averageOrderValue: 2800, // RON
}

const recentOrders = [
  {
    id: 'ORD-001',
    date: '2024-01-15',
    items: 12,
    status: 'completed',
    value: 3200,
  },
  {
    id: 'ORD-002',
    date: '2024-01-14',
    items: 8,
    status: 'completed',
    value: 1850,
  },
  {
    id: 'ORD-003',
    date: '2024-01-13',
    items: 15,
    status: 'in_progress',
    value: 4200,
  },
]

const employeeCarts = [
  {
    id: 'CART-001',
    employee: 'Ion Popescu',
    items: 5,
    status: 'pending',
    value: 450,
  },
  {
    id: 'CART-002',
    employee: 'Maria Ionescu',
    items: 3,
    status: 'approved',
    value: 280,
  },
  {
    id: 'CART-003',
    employee: 'Gheorghe Georgescu',
    items: 7,
    status: 'pending',
    value: 620,
  },
]

export default function BusinessDashboardPage() {
  const { businessUser } = useAuth()
  const { locale } = useI18n()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <RequireAuth role="business">
      <PageContainer className="py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
            Dashboard B2B
          </h1>
          <p className="text-muted-foreground">
            Bine ai venit, {businessUser?.fullName || 'Business'}! Gestionează comenzile și coșurile pentru angajați.
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-border rounded-xl shadow-sm bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-primary" />
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

          {/* Total Spent */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-border rounded-xl shadow-sm bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    {mockMetrics.spentGrowth}%
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total cheltuit</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(mockMetrics.totalSpent, locale)}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Active Carts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-border rounded-xl shadow-sm bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Coșuri active</p>
                  <p className="text-2xl font-bold text-foreground">{mockMetrics.activeCarts}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Favorite Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="border-border rounded-xl shadow-sm bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Produse favorite</p>
                  <p className="text-2xl font-bold text-foreground">{mockMetrics.favoriteProducts}</p>
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
                  <Link href="/b2b/orders">
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
                        <p className="text-xs text-muted-foreground">
                          {order.items} produse • {order.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">{formatCurrency(order.value, locale)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Employee Carts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="border-border rounded-xl shadow-sm bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">Coșuri angajați</h2>
                  <Link href="/b2b/carts">
                    <Button variant="ghost" size="sm" className="text-primary">
                      Vezi toate
                      <ArrowUpRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
                <div className="space-y-4">
                  {employeeCarts.map((cart) => (
                    <div
                      key={cart.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-foreground">{cart.employee}</p>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              cart.status === 'approved'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            }`}
                          >
                            {cart.status === 'approved' ? 'Aprobat' : 'În așteptare'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {cart.items} produse
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">{formatCurrency(cart.value, locale)}</p>
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
                <Link href="/produse">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="w-4 h-4 mr-2" />
                    Explorează produse
                  </Button>
                </Link>
                <Link href="/b2b/carts/new">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Coș nou pentru angajat
                  </Button>
                </Link>
                <Link href="/b2b/orders/new">
                  <Button variant="outline" className="w-full justify-start">
                    <ShoppingCart className="w-4 h-4 mr-2" />
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

