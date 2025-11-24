/**
 * Client Orders Page
 * 
 * Pagină pentru comenzile clientului logat
 * Integrat cu API pentru date reale
 */

'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, Button } from 'farme-ui'
import { RequireAuth } from '@/components/auth/require-auth'
import { getOrders } from '@/lib/api/orders'
import type { Order as DomainOrder, OrderStatus } from '@/lib/types/domain'
import { useCartStore } from '@/lib/store/cart'
import { useI18n } from '@/lib/i18n/context'
import { routes } from '@/lib/routes'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import { Package, Calendar, MapPin, CheckCircle2, Clock, Truck, XCircle, RotateCcw } from 'lucide-react'
import { StatusBadge } from '@/components/ui/status-badge'
import { EmptyState } from '@/components/ui/empty-state'
import { CardHover } from '@/components/ui/motion/card-hover'
import { ButtonPress } from '@/components/ui/motion/button-press'
import { SkeletonCard } from '@/components/ui/skeleton-loader'
import { AlertMessage } from '@/components/ui/alert-message'

export default function ClientOrdersPage() {
  const router = useRouter()
  const { addItem } = useCartStore()
  const { t, locale } = useI18n()
  const [orders, setOrders] = useState<DomainOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reorderingOrderId, setReorderingOrderId] = useState<string | null>(null)
  const [reorderWarning, setReorderWarning] = useState<string | null>(null)
  
  // Status config for UI with i18n - using StatusBadge variants
  const statusConfig: Record<OrderStatus, { variant: 'pending' | 'success' | 'processing' | 'info' | 'delivered' | 'cancelled' | 'error'; label: string; icon?: typeof Clock }> = {
    pending: {
      variant: 'pending',
      label: t('orders.status.pending', 'În așteptare'),
      icon: Clock,
    },
    paid: {
      variant: 'success',
      label: t('orders.status.paid', 'Plătită'),
      icon: CheckCircle2,
    },
    processing: {
      variant: 'processing',
      label: t('orders.status.processing', 'În procesare'),
      icon: Clock,
    },
    shipped: {
      variant: 'info',
      label: t('orders.status.shipped', 'În livrare'),
      icon: Truck,
    },
    delivered: {
      variant: 'delivered',
      label: t('orders.status.delivered', 'Livrată'),
      icon: CheckCircle2,
    },
    canceled: {
      variant: 'cancelled',
      label: t('orders.status.canceled', 'Anulată'),
      icon: XCircle,
    },
    uncollected: {
      variant: 'error',
      label: t('orders.status.uncollected', 'Neridicată'),
      icon: XCircle,
    },
    confirmed: {
      variant: 'info',
      label: t('orders.status.confirmed', 'Confirmată'),
      icon: CheckCircle2,
    },
    prepared: {
      variant: 'processing',
      label: t('orders.status.prepared', 'Pregătită'),
      icon: Package,
    },
    cancelled: {
      variant: 'cancelled',
      label: t('orders.status.cancelled', 'Anulată'),
      icon: XCircle,
    },
  }

  useEffect(() => {
    let isMounted = true
    
    async function loadOrders() {
      try {
        if (!isMounted) return
        setIsLoading(true)
        setError(null)
        const ordersData = await getOrders()
        if (isMounted) {
          setOrders(ordersData)
        }
      } catch (err: unknown) {
        if (!isMounted) return
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('Error loading orders:', err)
        }
        const errorMessage = err instanceof Error ? err.message : t('orders.errorLoading', 'Eroare la încărcarea comenzilor')
        setError(errorMessage)
        
        // Handle 401 - redirect to login
        if (err instanceof Error && (err.message.includes('401') || err.message.includes('autentificat'))) {
          router.push(`/login-client?redirect=/orders`)
          return
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadOrders()
    
    return () => {
      isMounted = false
    }
  }, [t, router])

  const handleReorder = async (order: DomainOrder) => {
    setReorderingOrderId(order.id)
    setReorderWarning(null)
    const unavailableItems: string[] = []

    try {
      for (const item of order.items) {
        try {
          await addItem({
            productId: item.productId,
            name: item.productName,
            producerId: item.producerId || '',
            producerName: item.producerName || '',
            price: item.price,
            quantity: item.quantity,
            unit: item.unit || 'buc',
            slug: item.productSlug,
            image: item.imageUrl,
          })
        } catch (err) {
          // Product might not be available
          unavailableItems.push(item.productName)
        }
      }

      if (unavailableItems.length > 0) {
        setReorderWarning(t('orders.reorderWarning', 'Unele produse din această comandă nu mai sunt disponibile') + ': ' + unavailableItems.join(', '))
        setTimeout(() => setReorderWarning(null), 5000)
      }

      // Redirect to cart after a short delay
      setTimeout(() => {
        router.push(routes.cart)
      }, 500)
    } catch (err: unknown) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Error reordering:', err)
      }
        const errorMessage = err instanceof Error ? err.message : t('errors.cart.addFailed', 'Eroare la adăugarea produselor în coș')
      setError(errorMessage)
    } finally {
      setReorderingOrderId(null)
    }
  }

  return (
    <RequireAuth role="client" fallbackRedirect="/login-client?redirect=/orders">
      <div className="min-h-screen bg-background text-foreground">
          <div className="max-w-8xl mx-auto px-4 py-10 md:py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
                {t('orders.title', 'Comenzile mele')}
              </h1>
              <p className="text-base text-foreground-body">
                {t('orders.title', 'Vezi toate comenzile tale și urmărește statusul livrărilor')}
              </p>
            </motion.div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : error ? (
              <AlertMessage
                variant="error"
                title={t('orders.errorLoading', 'Eroare la încărcarea comenzilor')}
                description={error}
              />
            ) : orders.length === 0 ? (
              <EmptyState
                icon={Package}
                illustration="empty-orders"
                title={t('orders.noOrders', 'Momentan nu ai comenzi')}
                description={t('orders.noOrdersDescription', 'Începe să cumperi pentru a vedea comenzile tale aici.')}
                action={{
                  label: t('common.products', 'Vezi produsele'),
                  href: '/products',
                }}
              />
            ) : (
              <>
                {reorderWarning && (
                  <AlertMessage
                    variant="warning"
                    description={reorderWarning}
                  />
                )}
                <div className="space-y-4">
                  {orders.map((order, index) => {
                  const statusInfo = statusConfig[order.status] || statusConfig.pending

                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <CardHover intensity="normal">
                        <Card className="border border-border rounded-2xl shadow-sm bg-card">
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                              {/* Left: Order Info */}
                              <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-3">
                                  <h3 className="text-lg font-semibold text-foreground">
                                    #{order.number}
                                  </h3>
                                  <StatusBadge
                                    label={statusInfo.label}
                                    variant={statusInfo.variant}
                                    icon={statusInfo.icon}
                                    size="md"
                                  />
                                </div>

                              <div className="flex flex-wrap items-center gap-4 text-sm text-foreground-body">
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="w-4 h-4" />
                                  <span>
                                    {formatDate(order.createdAt, locale, {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                    })}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Package className="w-4 h-4" />
                                  <span>
                                    {order.items.length} {order.items.length === 1 ? t('orders.items', 'produs') : t('orders.items', 'produse')}
                                  </span>
                                </div>
                                {order.shippingAddress.city && (
                                  <div className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4" />
                                    <span>{order.shippingAddress.city}</span>
                                  </div>
                                )}
                              </div>

                              {order.shippingAddress.address && (
                                <p className="text-xs text-muted-foreground">
                                  {order.shippingAddress.address}
                                </p>
                              )}
                            </div>

                            {/* Right: Total & Actions */}
                            <div className="flex flex-col items-end gap-3">
                              <div className="text-right">
                                <p className="text-2xl font-bold text-foreground">
                                  {formatCurrency(order.total, locale)}
                                </p>
                                {order.paymentMethod && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {order.paymentMethod === 'card' 
                                      ? t('ui.payment.method.card', 'Card') 
                                      : order.paymentMethod === 'cod' 
                                      ? t('ui.payment.method.cod', 'Ramburs') 
                                      : order.paymentMethod}
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-2">
                                {order.status !== 'canceled' && (
                                  <ButtonPress>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleReorder(order)}
                                      disabled={reorderingOrderId === order.id}
                                    >
                                      <RotateCcw className={`w-4 h-4 mr-2 ${reorderingOrderId === order.id ? 'animate-spin' : ''}`} />
                                      {reorderingOrderId === order.id ? t('orders.detail.reordering', 'Se adaugă...') : t('orders.reorder', 'Comandă din nou')}
                                    </Button>
                                  </ButtonPress>
                                )}
                                <ButtonPress>
                                  <Link
                                    href={`/orders/${order.id}`}
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                                  >
                                    {t('orders.viewDetails', 'Vezi detalii')}
                                  </Link>
                                </ButtonPress>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      </CardHover>
                    </motion.div>
                  )
                })}
                </div>
              </>
            )}
          </div>
        </div>
    </RequireAuth>
  )
}
