/**
 * Client Order Detail Page
 * 
 * Pagină cu detalii comandă pentru client
 * Integrat cu API pentru date reale
 */

'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, Button, Badge } from 'farme-ui'
import { RequireAuth } from '@/components/auth/require-auth'
import { getOrderById } from '@/lib/api/orders'
import { useCartStore } from '@/lib/store/cart'
import type { Order as DomainOrder, OrderStatus } from '@/lib/types/domain'
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
  XCircle, 
  RotateCcw 
} from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import { formatUnit } from '@/lib/utils/format-units'

// Status config will be created dynamically with i18n

export default function ClientOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  const { addItem } = useCartStore()
  const { t, locale } = useI18n()

  const [order, setOrder] = useState<DomainOrder | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isReordering, setIsReordering] = useState(false)
  const [reorderWarning, setReorderWarning] = useState<string | null>(null)
  
  // Status config for UI with i18n
  const statusConfig: Record<OrderStatus, { icon: typeof Clock; label: string; color: string; bg: string; border: string }> = {
    pending: {
      icon: Clock,
      label: t('orders.status.pending', 'În așteptare'),
      color: 'text-amber-700 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/20',
      border: 'border-amber-200 dark:border-amber-800',
    },
    paid: {
      icon: CheckCircle2,
      label: t('orders.status.paid', 'Plătită'),
      color: 'text-blue-700 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/20',
      border: 'border-blue-200 dark:border-blue-800',
    },
    processing: {
      icon: Package,
      label: t('orders.status.processing', 'În procesare'),
      color: 'text-indigo-700 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/20',
      border: 'border-indigo-200 dark:border-indigo-800',
    },
    shipped: {
      icon: Truck,
      label: t('orders.status.shipped', 'În livrare'),
      color: 'text-purple-700 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-950/20',
      border: 'border-purple-200 dark:border-purple-800',
    },
    delivered: {
      icon: CheckCircle2,
      label: t('orders.status.delivered', 'Livrată'),
      color: 'text-green-700 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-950/20',
      border: 'border-green-200 dark:border-green-800',
    },
    canceled: {
      icon: XCircle,
      label: t('orders.status.canceled', 'Anulată'),
      color: 'text-red-700 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-950/20',
      border: 'border-red-200 dark:border-red-800',
    },
    uncollected: {
      icon: XCircle,
      label: t('orders.status.uncollected', 'Neridicată'),
      color: 'text-orange-700 dark:text-orange-400',
      bg: 'bg-orange-50 dark:bg-orange-950/20',
      border: 'border-orange-200 dark:border-orange-800',
    },
    confirmed: {
      icon: CheckCircle2,
      label: t('orders.status.confirmed', 'Confirmată'),
      color: 'text-blue-700 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/20',
      border: 'border-blue-200 dark:border-blue-800',
    },
    prepared: {
      icon: Package,
      label: t('orders.status.prepared', 'Pregătită'),
      color: 'text-indigo-700 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/20',
      border: 'border-indigo-200 dark:border-indigo-800',
    },
    cancelled: {
      icon: XCircle,
      label: t('orders.status.cancelled', 'Anulată'),
      color: 'text-red-700 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-950/20',
      border: 'border-red-200 dark:border-red-800',
    },
  }

  useEffect(() => {
    let isMounted = true
    
    async function loadOrder() {
      if (!orderId) {
        if (isMounted) {
          setError(t('orders.detail.notFound', 'ID comandă lipsă'))
          setIsLoading(false)
        }
        return
      }

      try {
        if (!isMounted) return
        setIsLoading(true)
        setError(null)
        const orderData = await getOrderById(orderId)
        if (isMounted) {
          setOrder(orderData)
        }
      } catch (err: unknown) {
        if (!isMounted) return
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('Error loading order:', err)
        }
        let errorMessage = t('orders.detail.notFound', 'Eroare la încărcarea comenzii')
        
        if (err instanceof Error) {
          errorMessage = err.message
          
          // Handle specific error codes
          if (err.message.includes('404') || err.message.includes('nu a fost găsită')) {
            errorMessage = t('orders.detail.notFound', 'Comanda nu a fost găsită')
          } else if (err.message.includes('401') || err.message.includes('403') || err.message.includes('permisiune')) {
            errorMessage = t('orders.detail.unauthorized', 'Nu ai permisiunea de a vedea această comandă')
            router.push(`/login-client?redirect=/orders/${orderId}`)
            return
          }
        }
        
        setError(errorMessage)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadOrder()
    
    return () => {
      isMounted = false
    }
  }, [orderId, t, router])

  const handleReorder = async () => {
    if (!order) return

    setIsReordering(true)
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
          unavailableItems.push(item.productName)
        }
      }

      if (unavailableItems.length > 0) {
        setReorderWarning(t('orders.reorderWarning', 'Unele produse din această comandă nu mai sunt disponibile') + ': ' + unavailableItems.join(', '))
      }

      setTimeout(() => {
        router.push('/cart')
      }, 500)
    } catch (err: unknown) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Error reordering:', err)
      }
      const errorMessage = err instanceof Error ? err.message : 'Eroare la adăugarea produselor în coș'
      setError(errorMessage)
    } finally {
      setIsReordering(false)
    }
  }

  if (!order && !isLoading && !error) {
    return null
  }

  const statusInfo = order ? (statusConfig[order.status] || statusConfig.pending) : statusConfig.pending
  const StatusIcon = statusInfo.icon

  return (
    <RequireAuth role="client" fallbackRedirect="/login-client?redirect=/orders">
      <div className="min-h-screen bg-background text-foreground">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center space-y-4">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                <p className="text-sm text-muted-foreground">{t('orders.detail.loading', 'Se încarcă detaliile comenzii...')}</p>
              </div>
            </div>
          ) : error || !order ? (
            <div className="max-w-8xl mx-auto px-4 py-6">
              <Card className="border border-border rounded-2xl">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center">
                    <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </div>
                  <p className="text-destructive mb-4">{error || t('orders.detail.notFound', 'Comanda nu a fost găsită')}</p>
                  <Link
                    href="/orders"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t('orders.detail.backToOrders', 'Înapoi la comenzi')}
                  </Link>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/orders" className="hover:text-foreground transition-colors">
                  {t('orders.title', 'Comenzi')}
                </Link>
                <span>/</span>
                <span className="text-foreground">{order.number}</span>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-2">
                    {t('orders.detail.title', 'Comanda #{number}').replace('{number}', order.number)}
                  </h1>
                  <p className="text-sm text-foreground-body">
                    {t('orders.detail.placedOn', 'Plasată pe')} {formatDate(order.createdAt, locale, {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <Badge 
                  variant="default" 
                  className={`text-sm flex items-center gap-1 ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}
                >
                  <StatusIcon className="w-3 h-3" />
                  {statusInfo.label}
                </Badge>
              </div>

              {reorderWarning && (
                <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-600 dark:text-amber-400">{reorderWarning}</p>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card className="border border-border rounded-2xl">
                    <CardContent className="p-6">
                      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        {t('orders.detail.productsTitle', 'Produse comandate')}
                      </h2>
                      <div className="space-y-4">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex gap-4 pb-4 border-b last:border-0">
                            {item.imageUrl && (
                              <Image
                                src={item.imageUrl}
                                alt={item.productName}
                                width={64}
                                height={64}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                            )}
                            <div className="flex-1">
                              <h3 className="font-medium">{item.productName}</h3>
                              <p className="text-sm text-muted-foreground">{item.producerName}</p>
                              <p className="text-sm mt-1">
                                {item.quantity} x {formatCurrency(item.price, locale)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{formatCurrency(item.quantity * item.price, locale)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="border border-border rounded-2xl">
                    <CardContent className="p-6">
                      <h2 className="text-lg font-semibold mb-4">{t('orders.detail.summaryTitle', 'Sumar comandă')}</h2>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t('orders.detail.subtotal', 'Subtotal')}</span>
                          <span>{formatCurrency(order.subtotal, locale)}</span>
                        </div>
                        {order.shippingCost && order.shippingCost > 0 && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{t('orders.detail.shipping', 'Transport')}</span>
                            <span>{formatCurrency(order.shippingCost, locale)}</span>
                          </div>
                        )}
                        <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                          <span>{t('orders.detail.total', 'Total')}</span>
                          <span>{formatCurrency(order.total, locale)}</span>
                        </div>
                      </div>
                      <Button
                        onClick={handleReorder}
                        disabled={isReordering}
                        className="w-full mt-4"
                        variant="outline"
                      >
                        {isReordering ? (
                          <>
                            <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2"></div>
                            {t('orders.detail.reordering', 'Se adaugă...')}
                          </>
                        ) : (
                          <>
                            <RotateCcw className="w-4 h-4 mr-2" />
                            {t('orders.detail.reorder', 'Comandă din nou')}
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border border-border rounded-2xl">
                    <CardContent className="p-6">
                      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        {t('checkout.detailsTitle', 'Detalii livrare')}
                      </h2>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">{t('orders.detail.name', 'Nume')}</p>
                          <p className="font-medium">{order.shippingAddress?.name || 'N/A'}</p>
                        </div>
                        {order.shippingAddress?.phone && (
                          <div>
                            <p className="text-muted-foreground">{t('orders.detail.phone', 'Telefon')}</p>
                            <p className="font-medium">{order.shippingAddress.phone}</p>
                          </div>
                        )}
                        {order.shippingAddress?.address && (
                          <div>
                            <p className="text-muted-foreground">{t('orders.detail.address', 'Adresă')}</p>
                            <p className="font-medium">{order.shippingAddress.address}</p>
                            {order.shippingAddress.city && (
                              <p className="font-medium">{order.shippingAddress.city}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex justify-start">
                <Link
                  href="/orders"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('orders.detail.backToOrders', 'Înapoi la comenzi')}
                </Link>
              </div>
            </div>
          )}
        </div>
    </RequireAuth>
  )
}

