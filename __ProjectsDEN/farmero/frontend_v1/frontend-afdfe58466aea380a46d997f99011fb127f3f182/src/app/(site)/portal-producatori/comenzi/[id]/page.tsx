/**
 * Producer Order Detail Page
 * 
 * Pagină cu detalii comandă pentru producător
 * Integrat cu API pentru date reale
 */

'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, Button, Badge } from 'farme-ui'
import { ProducerDashboardLayout } from '@/components/producer-portal/producer-dashboard-layout'
import { ToastNotification } from '@/components/producer-portal/mobile/toast-notification'
import { getOrderById, updateOrderStatus, confirmOrder, prepareOrder, shipOrder, markOrderDelivered, cancelOrder } from '@/lib/api/producer/orders'
import type { ProducerOrder } from '@/lib/api/producer/orders'
import { 
  ArrowLeft, 
  Package, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  CheckCircle2,
  Clock,
  Truck,
  XCircle
} from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { routes } from '@/lib/routes'
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils/format'
import { formatUnit } from '@/lib/utils/format-units'

const statusConfig: Record<ProducerOrder['status'], { icon: typeof Clock; color: string; label: string }> = {
  pending: { icon: Clock, color: 'text-amber-600', label: 'În așteptare' },
  confirmed: { icon: CheckCircle2, color: 'text-blue-600', label: 'Confirmată' },
  preparing: { icon: Package, color: 'text-amber-600', label: 'În pregătire' },
  shipped: { icon: Truck, color: 'text-blue-600', label: 'Trimisă' },
  delivered: { icon: CheckCircle2, color: 'text-green-600', label: 'Livrată' },
  canceled: { icon: XCircle, color: 'text-red-600', label: 'Anulată' },
  uncollected: { icon: XCircle, color: 'text-red-600', label: 'Neridicată' },
}

export default function ProducerOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  const { locale, t } = useI18n()

  const [order, setOrder] = useState<ProducerOrder | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false,
  })

  useEffect(() => {
    async function loadOrder() {
      if (!orderId) {
        setError('ID comandă lipsă')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const orderData = await getOrderById(orderId)
        setOrder(orderData)
      } catch (err: unknown) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('Error loading order:', err)
        }
        let errorMessage = 'Eroare la încărcarea comenzii'
        
        if (err instanceof Error) {
          errorMessage = err.message
          
          // Handle specific error codes
          if (err.message.includes('404') || err.message.includes('nu a fost găsită')) {
            errorMessage = 'Comanda nu a fost găsită'
          } else if (err.message.includes('401') || err.message.includes('403') || err.message.includes('permisiune')) {
            errorMessage = 'Nu ai permisiunea de a vedea această comandă'
            router.push(routes.producerPortal.login)
            return
          }
        }
        
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    loadOrder()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId])

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type, isVisible: true })
    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }))
    }, 3000)
  }

  const handleStatusChange = async (newStatus: ProducerOrder['status']) => {
    if (!order) return

    setIsUpdating(true)
    try {
      // Update order status
      await updateOrderStatus(order.id, { status: newStatus })
      const refreshed = await getOrderById(order.id)
      setOrder(refreshed)
      
      // Show success message based on status
      const statusMessages: Record<ProducerOrder['status'], string> = {
        confirmed: 'Comandă confirmată cu succes!',
        preparing: 'Comandă marcată ca în pregătire!',
        shipped: 'Comandă marcată ca trimisă!',
        delivered: 'Comandă marcată ca livrată!',
        canceled: 'Comandă anulată!',
        pending: 'Status actualizat!',
        uncollected: 'Status actualizat!',
      }
      showToast(statusMessages[newStatus] || 'Status actualizat cu succes!', 'success')
    } catch (err: unknown) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Error updating order status:', err)
      }
      const errorMessage = err instanceof Error ? err.message : 'Eroare la actualizarea comenzii'
      showToast(errorMessage, 'error')
    } finally {
      setIsUpdating(false)
    }
  }


  if (isLoading) {
    return (
      <ProducerDashboardLayout>
        <div className="max-w-8xl mx-auto px-4 py-6">
          <div className="text-center py-20">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
            <p className="text-muted-foreground">Se încarcă detaliile comenzii...</p>
          </div>
        </div>
      </ProducerDashboardLayout>
    )
  }

  if (error || !order) {
    return (
      <ProducerDashboardLayout>
        <div className="max-w-8xl mx-auto px-4 py-6">
          <Card className="border border-border rounded-2xl">
            <CardContent className="p-12 text-center">
              <p className="text-destructive mb-4">{error || 'Comanda nu a fost găsită'}</p>
              <Link
                href="/portal-producatori/comenzi"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Înapoi la comenzi
              </Link>
            </CardContent>
          </Card>
        </div>
      </ProducerDashboardLayout>
    )
  }

  const statusInfo = statusConfig[order.status]
  const StatusIcon = statusInfo.icon

  // Build timeline from order status
  const timeline = [
    { status: 'pending', label: 'Comandă plasată', date: order.createdAt, completed: ['pending', 'confirmed', 'preparing', 'shipped', 'delivered'].includes(order.status) },
    { status: 'confirmed', label: 'Comandă confirmată', date: order.updatedAt, completed: ['confirmed', 'preparing', 'shipped', 'delivered'].includes(order.status) },
    { status: 'preparing', label: 'În pregătire', date: order.updatedAt, completed: ['preparing', 'shipped', 'delivered'].includes(order.status) },
    { status: 'shipped', label: 'Trimisă', date: order.updatedAt, completed: ['shipped', 'delivered'].includes(order.status) },
    { status: 'delivered', label: 'Livrată', date: order.updatedAt, completed: order.status === 'delivered' },
  ]

  return (
    <ProducerDashboardLayout>
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link
            href="/portal-producatori/comenzi"
            className="hover:text-foreground transition-colors"
          >
            Comenzi
          </Link>
          <span>/</span>
          <span className="text-foreground">{order.number}</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-2">
              {order.number}
            </h1>
            <p className="text-sm text-foreground-body">
              Plasată pe {formatDate(order.createdAt, locale, {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <Badge variant="default" className="text-sm flex items-center gap-1">
            <StatusIcon className="w-3 h-3" />
            {statusInfo.label}
          </Badge>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client Info */}
            <Card className="border border-border rounded-2xl shadow-sm bg-card">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informații client
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Nume</p>
                    <p className="text-base font-medium text-foreground">{order.customerName}</p>
                  </div>
                  {order.customerEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <a
                        href={`mailto:${order.customerEmail}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {order.customerEmail}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <a
                      href={`tel:${order.customerPhone}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {order.customerPhone}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Info */}
            <Card className="border border-border rounded-2xl shadow-sm bg-card">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Livrare
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Adresă</p>
                    <p className="text-base text-foreground">
                      {order.shippingAddress.address}
                      {order.shippingAddress.postalCode && `, ${order.shippingAddress.postalCode}`}
                      {`, ${order.shippingAddress.city}`}
                    </p>
                  </div>
                  {order.estimatedDeliveryDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm text-foreground-body">
                        Estimare livrare: {formatDate(order.estimatedDeliveryDate, locale)}
                      </p>
                    </div>
                  )}
                  {order.shippingAddress.notes && (
                    <div>
                      <p className="text-sm text-muted-foreground">Notițe</p>
                      <p className="text-sm text-foreground-body">{order.shippingAddress.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="border border-border rounded-2xl shadow-sm bg-card">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Produse comandate
                </h2>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-3 border-b border-border last:border-0"
                    >
                      <div>
                        <p className="text-base font-medium text-foreground">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} {formatUnit(1, item.unit || 'buc', locale, t)} × {formatCurrency(item.price, locale)}
                        </p>
                      </div>
                      <p className="text-base font-semibold text-foreground">
                        {formatCurrency(item.total, locale)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Summary & Timeline */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="border border-border rounded-2xl shadow-sm bg-card">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Rezumat comandă
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">{formatCurrency(order.total, locale, order.currency || 'RON')}</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-xl font-bold text-foreground">{formatCurrency(order.total, locale, order.currency || 'RON')}</span>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      Metodă plată: {order.paymentMethod === 'card' ? 'Card' : order.paymentMethod === 'cod' ? 'Ramburs' : order.paymentMethod}
                    </p>
                    {order.paymentStatus && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Status plată: {order.paymentStatus}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Timeline */}
            <Card className="border border-border rounded-2xl shadow-sm bg-card">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Status comandă
                </h2>
                <div className="space-y-4">
                  {timeline.map((step, index) => {
                    const stepConfig = statusConfig[step.status as ProducerOrder['status']]
                    const Icon = stepConfig?.icon || Clock
                    const isLast = index === timeline.length - 1

                    return (
                      <div key={step.status} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              step.completed
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          {!isLast && (
                            <div
                              className={`w-0.5 flex-1 ${
                                step.completed ? 'bg-primary' : 'bg-muted'
                              }`}
                            />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p
                            className={`text-sm font-medium ${
                              step.completed ? 'text-foreground' : 'text-muted-foreground'
                            }`}
                          >
                            {step.label}
                          </p>
                          {step.date && step.completed && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDateTime(step.date, locale)}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            {order.status !== 'delivered' && order.status !== 'canceled' && (
              <div className="space-y-2">
                {order.status === 'pending' && (
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => handleStatusChange('confirmed')}
                    disabled={isUpdating}
                  >
                    {t('producer.orders.confirmOrder', 'Confirmă comandă')}
                  </Button>
                )}
                {order.status === 'confirmed' && (
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => handleStatusChange('preparing')}
                    disabled={isUpdating}
                  >
                    {t('producer.orders.markAsPreparing', 'Marchează ca în pregătire')}
                  </Button>
                )}
                {(order.status === 'preparing' || order.status === 'confirmed') && (
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    size="lg"
                    onClick={() => handleStatusChange('shipped')}
                    disabled={isUpdating}
                  >
                    {t('producer.orders.markAsShipped', 'Marchează ca trimisă')}
                  </Button>
                )}
                {order.status === 'shipped' && (
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => handleStatusChange('delivered')}
                    disabled={isUpdating}
                  >
                    {t('producer.orders.markAsDelivered', 'Marchează ca livrată')}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Back Button */}
        <div>
          <Link
            href="/portal-producatori/comenzi"
            className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Înapoi la comenzi
          </Link>
        </div>
      </div>

      <ToastNotification
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </ProducerDashboardLayout>
  )
}
