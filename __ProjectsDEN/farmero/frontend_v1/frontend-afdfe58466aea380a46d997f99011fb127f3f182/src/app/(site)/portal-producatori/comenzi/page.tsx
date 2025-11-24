/**
 * Producer Orders Page
 * 
 * Pagină pentru gestionarea comenzilor (mobile + desktop)
 * Integrat cu API pentru date reale
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ProducerDashboardLayout } from '@/components/producer-portal/producer-dashboard-layout'
import { MobileOrderCard } from '@/components/producer-portal/mobile/mobile-order-card'
import { SwipeableOrderCard } from '@/components/producer-portal/mobile/swipeable-order-card'
import { RecentOrdersTable } from '@/components/producer-portal/recent-orders-table'
import { ToastNotification } from '@/components/producer-portal/mobile/toast-notification'
import { Card, CardContent, Button } from 'farme-ui'
import { 
  getProducerOrders, 
  confirmOrder, 
  prepareOrder,
  shipOrder, 
  markOrderDelivered,
  cancelOrder,
  type ProducerOrder 
} from '@/lib/api/producer/orders'
import { useI18n } from '@/lib/i18n/context'
import { typography } from '@/lib/design-system/typography'
import { spacing } from '@/lib/design-system/spacing'
import { cn } from '@/lib/utils/cn'

export default function ProducerOrdersPage() {
  const { t } = useI18n()
  const [orders, setOrders] = useState<ProducerOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set())
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false,
  })

  // Fetch orders on mount and when filter changes
  useEffect(() => {
    async function loadOrders() {
      try {
        setIsLoading(true)
        setError(null)
        
        const filter = statusFilter === 'all' ? undefined : { status: statusFilter as ProducerOrder['status'] }
        const ordersData = await getProducerOrders(filter)
        setOrders(ordersData)
      } catch (error: unknown) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('Error loading orders:', error)
        }
        const errorMessage = error instanceof Error ? error.message : t('producer.orders.errorLoading', 'Eroare la încărcarea comenzilor')
        setError(errorMessage)
        
        // Handle 401 - redirect to login
        if (error instanceof Error && (error.message.includes('401') || error.message.includes('autentificat'))) {
          showToast(t('producer.orders.errorAuth', 'Trebuie să fii autentificat pentru a vedea comenzile.'), 'error')
          return
        }
        
        showToast(
          errorMessage || t('producer.orders.errorGeneric', 'Nu s-au putut încărca comenzile. Te rugăm să încerci din nou.'),
          'error'
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter])

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type, isVisible: true })
    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }))
    }, 3000)
  }

  const handleConfirm = async (orderId: string) => {
    const order = orders.find(o => o.id === orderId)
    if (!order) return

    setUpdatingIds(prev => new Set(prev).add(orderId))
    
    // Optimistic update
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status: 'confirmed' as const } : o
    ))

    try {
      await confirmOrder(orderId)
      showToast(t('producer.orders.successConfirmed', 'Comandă confirmată!'), 'success')
    } catch (error: unknown) {
      // Revert on error
      setOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, status: order.status } : o
      ))
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Error confirming order:', error)
      }
      const errorMessage = error instanceof Error ? error.message : t('producer.orders.errorConfirm', 'Eroare la confirmarea comenzii. Te rugăm să încerci din nou.')
      showToast(errorMessage, 'error')
    } finally {
      setUpdatingIds(prev => {
        const next = new Set(prev)
        next.delete(orderId)
        return next
      })
    }
  }

  const handlePrepare = async (orderId: string) => {
    const order = orders.find(o => o.id === orderId)
    if (!order) return

    setUpdatingIds(prev => new Set(prev).add(orderId))
    
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status: 'preparing' as const } : o
    ))

    try {
      await prepareOrder(orderId)
      showToast(t('producer.orders.successPreparing', 'Comandă marcată ca în pregătire!'), 'success')
    } catch (error: unknown) {
      setOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, status: order.status } : o
      ))
      const errorMessage = error instanceof Error ? error.message : t('producer.orders.errorPreparing', 'Eroare la marcarea comenzii ca în pregătire. Te rugăm să încerci din nou.')
      showToast(errorMessage, 'error')
    } finally {
      setUpdatingIds(prev => {
        const next = new Set(prev)
        next.delete(orderId)
        return next
      })
    }
  }

  const handleShip = async (orderId: string) => {
    const order = orders.find(o => o.id === orderId)
    if (!order) return

    setUpdatingIds(prev => new Set(prev).add(orderId))
    
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status: 'shipped' as const } : o
    ))

    try {
      await shipOrder(orderId)
      showToast(t('producer.orders.successShipped', 'Comandă marcată ca expediată!'), 'success')
    } catch (error: any) {
      setOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, status: order.status } : o
      ))
      showToast(
        error?.message || t('producer.orders.errorShip', 'Eroare la marcarea comenzii ca expediată. Te rugăm să încerci din nou.'),
        'error'
      )
    } finally {
      setUpdatingIds(prev => {
        const next = new Set(prev)
        next.delete(orderId)
        return next
      })
    }
  }

  const handleMarkDelivered = async (orderId: string) => {
    const order = orders.find(o => o.id === orderId)
    if (!order) return

    setUpdatingIds(prev => new Set(prev).add(orderId))
    
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status: 'delivered' as const } : o
    ))

    try {
      await markOrderDelivered(orderId)
      showToast(t('producer.orders.successDelivered', 'Comandă marcată ca livrată!'), 'success')
    } catch (error: any) {
      setOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, status: order.status } : o
      ))
      showToast(
        error?.message || t('producer.orders.errorDelivered', 'Eroare la marcarea comenzii ca livrată. Te rugăm să încerci din nou.'),
        'error'
      )
    } finally {
      setUpdatingIds(prev => {
        const next = new Set(prev)
        next.delete(orderId)
        return next
      })
    }
  }

  // Status label translations
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      all: t('producer.orders.status.all', 'Toate'),
      pending: t('producer.orders.status.pending', 'În așteptare'),
      confirmed: t('producer.orders.status.confirmed', 'Confirmate'),
      preparing: t('producer.orders.status.preparing', 'În pregătire'),
      shipped: t('producer.orders.status.shipped', 'Trimise'),
      delivered: t('producer.orders.status.delivered', 'Livrate'),
      canceled: t('producer.orders.status.canceled', 'Anulate'),
      uncollected: t('producer.orders.status.uncollected', 'Neridicate'),
    }
    return labels[status] || status
  }

  // Convert ProducerOrder to format expected by components
  const formatOrderForComponent = (order: ProducerOrder): {
    id: string
    orderNumber: string
    client: string
    amount: number
    status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'canceled' | 'uncollected'
    paymentMethod: 'card' | 'cash' | 'cod' | 'bank_transfer' | 'other'
    date: string
    deliveryAddress: string
    items: Array<{
      id: string
      productId: string
      productName: string
      quantity: number
      price: number
      total: number
    }>
    isUpdating: boolean
  } => ({
    id: order.id,
    orderNumber: order.number,
    client: order.customerName,
    amount: order.total,
    status: order.status as 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'canceled' | 'uncollected',
    paymentMethod: order.paymentMethod === 'card' ? 'card' : order.paymentMethod === 'cod' ? 'cod' : order.paymentMethod === 'bank_transfer' ? 'bank_transfer' : 'other',
    date: order.createdAt,
    deliveryAddress: order.shippingAddress.address,
    items: order.items.map(item => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      price: item.price,
      total: item.total,
    })),
    isUpdating: updatingIds.has(order.id),
  })

  // Loading state
  if (isLoading) {
    return (
      <ProducerDashboardLayout>
        <div className="min-h-screen bg-background text-foreground py-8">
          <div className="mx-auto max-w-8xl px-4">
            <Card className="rounded-2xl border border-border bg-card shadow-sm">
              <CardContent className="p-12 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
                <p className="text-muted-foreground">{t('producer.orders.loading', 'Se încarcă comenzile...')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </ProducerDashboardLayout>
    )
  }

  // Error state
  if (error && orders.length === 0) {
    return (
      <ProducerDashboardLayout>
        <div className="min-h-screen bg-background text-foreground py-8">
          <div className="mx-auto max-w-8xl px-4">
            <Card className="rounded-2xl border border-border bg-card shadow-sm">
              <CardContent className="p-12 text-center">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>
                  {t('actions.retry', 'Încearcă din nou')}
                </Button>
              </CardContent>
            </Card>
          </div>
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
          className={spacing.section.verticalSmall.split(' ')[0].replace('py-', 'mb-')}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className={cn(typography.pageTitle.base, 'mb-1')}>
                {t('producer.orders.title', 'Comenzi')}
              </h1>
              <p className="text-sm text-foreground-body">
                {orders.length} {orders.length === 1 ? t('producer.orders.orderSingular', 'comandă') : t('producer.orders.orderPlural', 'comenzi')}
              </p>
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['all', 'pending', 'confirmed', 'preparing', 'shipped', 'delivered'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  statusFilter === status
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                {getStatusLabel(status)}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-4">
          {orders.map((order) => (
            <SwipeableOrderCard
              key={order.id}
              order={formatOrderForComponent(order)}
              onConfirm={() => handleConfirm(order.id)}
              onShip={() => handleShip(order.id)}
              onMarkDelivered={() => handleMarkDelivered(order.id)}
            />
          ))}
        </div>

        {orders.length === 0 && !isLoading && (
          <Card className="border border-border rounded-2xl shadow-sm bg-card mt-4">
            <CardContent className="p-12 text-center">
              <p className="text-foreground-body">
                {statusFilter === 'all' 
                  ? t('producer.orders.empty', 'Nu ai comenzi încă.')
                  : t('producer.orders.emptyFiltered', 'Nu există comenzi cu statusul "{status}".').replace('{status}', getStatusLabel(statusFilter))}
              </p>
            </CardContent>
          </Card>
        )}

        <ToastNotification
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
        />
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={spacing.section.verticalSmall.split(' ')[0].replace('py-', 'mb-')}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className={cn(typography.pageTitle.base, 'mb-2')}>
                {t('producer.orders.titleDesktop', 'Comenzile tale')}
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed max-w-3xl">
                {t('producer.orders.description', 'Gestionează comenzile primite și statusul livrărilor.')}
              </p>
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 mb-6">
            {['all', 'pending', 'confirmed', 'preparing', 'shipped', 'delivered'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  statusFilter === status
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                {getStatusLabel(status)}
              </button>
            ))}
          </div>
        </motion.div>

          <RecentOrdersTable
            orders={undefined}
            updatingIds={updatingIds}
          />

        {orders.length === 0 && !isLoading && (
          <Card className="border border-border rounded-2xl shadow-sm bg-card">
            <CardContent className="p-12 text-center">
              <p className="text-foreground-body">
                {statusFilter === 'all' 
                  ? t('producer.orders.empty', 'Nu ai comenzi încă.')
                  : t('producer.orders.emptyFiltered', 'Nu există comenzi cu statusul "{status}".').replace('{status}', getStatusLabel(statusFilter))}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </ProducerDashboardLayout>
  )
}
