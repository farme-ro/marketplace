/**
 * Thank You Page Client Component
 * 
 * Client component pentru pagina de confirmare după plasarea comenzii
 */

'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { PageContainer } from '@/components/layout/page-container'
import { Button, Card, CardHeader, CardTitle, CardContent } from 'farme-ui'
import { Badge } from 'farme-ui'
import { useI18n } from '@/lib/i18n/context'
import { formatCurrency } from '@/lib/utils/format'
import { getOrderById, getOrderSummaryById, type OrderSummary } from '@/lib/api/orders'
import { ImpactOnOrderSummary } from '@/components/impact/impact-on-order-summary'

export default function ThankYouPageClient() {
  const searchParams = useSearchParams()
  const { t, locale } = useI18n()
  const orderId = searchParams.get('orderId')
  const [isLoading, setIsLoading] = useState(true)
  const [order, setOrder] = useState<OrderSummary | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadOrder() {
      if (!orderId) {
        setIsLoading(false)
        return
      }

      try {
        // Try to get order summary (legacy format)
        const orderData = await getOrderSummaryById(orderId)
        if (orderData) {
          setOrder(orderData)
        } else {
          setError('Nu s-au putut încărca detaliile comenzii')
        }
      } catch (err: any) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('Error loading order:', err)
        }
        setError(err.message || 'Eroare la încărcarea comenzii')
      } finally {
        setIsLoading(false)
      }
    }

    loadOrder()
  }, [orderId])

  if (isLoading) {
    return (
      <PageContainer>
        <div className="text-center py-spacing-5xl">
          <p className="text-[var(--color-muted-foreground)]">{t('thankYou.loading', 'Se încarcă confirmarea comenzii...')}</p>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <Card variant="default" padding="lg" className="max-w-2xl mx-auto">
        <CardContent className="text-center">
          <svg
            className="mx-auto w-24 h-24 text-[var(--color-success)] mb-spacing-lg"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="text-4xl font-heading font-bold text-[var(--color-foreground)] mb-spacing-base">
            {t('thankYou.title', 'Mulțumim pentru comandă!')}
          </h1>
          <p className="text-lg text-[var(--color-muted-foreground)] mb-spacing-xl">
            {t('thankYou.confirmationEmail', 'Vei primi un email de confirmare în curând.')}
          </p>

          {/* Impact Summary */}
          <div className="mb-spacing-lg">
            <ImpactOnOrderSummary
              producerCount={order?.items?.length || 1}
              orderId={orderId || undefined}
            />
          </div>

          {error && (
            <div className="mb-spacing-lg p-4 bg-[var(--color-error-light)] border border-[var(--color-error)] rounded-lg text-[var(--color-error-dark)]">
              {error}
            </div>
          )}

          {orderId && (
            <Card variant="default" padding="md" className="mb-spacing-lg text-left">
              <CardHeader>
                <CardTitle className="text-lg">{t('thankYou.orderNumber', 'Număr comandă')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-spacing-sm mb-spacing-base">
                  <div className="flex justify-between">
                    <span className="text-[var(--color-muted-foreground)]">{t('thankYou.orderNumber', 'Număr comandă')}:</span>
                    <span className="font-mono font-semibold text-[var(--color-foreground)]">
                      #{orderId.slice(0, 8)}
                    </span>
                  </div>
                  {order && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-muted-foreground)]">Status:</span>
                        <Badge variant={order.status === 'PENDING' ? 'warning' : 'success'}>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-muted-foreground)]">Total:</span>
                        <span className="font-bold text-lg text-[var(--color-primary)]">
                          {formatCurrency(Number(order.totalAmount), locale)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-muted-foreground)]">Tip client:</span>
                        <Badge variant="outline">{order.customerType}</Badge>
                      </div>
                      {order.shippingFullName && (
                        <div className="pt-spacing-sm border-t border-[var(--color-border)]">
                          <p className="text-sm text-[var(--color-muted-foreground)] mb-spacing-xs">
                            Livrare la:
                          </p>
                          <p className="font-medium text-[var(--color-foreground)]">
                            {order.shippingFullName}
                          </p>
                          <p className="text-sm text-[var(--color-muted-foreground)]">
                            {order.shippingAddressLine1}
                          </p>
                          {order.shippingCity && (
                            <p className="text-sm text-[var(--color-muted-foreground)]">
                              {order.shippingCity}
                            </p>
                          )}
                          {order.shippingPhone && (
                            <p className="text-sm text-[var(--color-muted-foreground)] mt-spacing-xs">
                              Tel: {order.shippingPhone}
                            </p>
                          )}
                        </div>
                      )}
                      {order.items && order.items.length > 0 && (
                        <div className="pt-spacing-sm border-t border-[var(--color-border)] mt-spacing-sm">
                          <p className="text-sm font-medium text-[var(--color-foreground)] mb-spacing-xs">
                            Produse:
                          </p>
                          <ul className="space-y-spacing-xs">
                            {order.items.map((item, index) => (
                              <li key={index} className="flex justify-between text-sm">
                                <span className="text-[var(--color-foreground)]">
                                  {item.productNameSnapshot} x {item.quantity}
                                </span>
                                <span className="text-[var(--color-muted-foreground)]">
                                  {formatCurrency(Number(item.totalPrice), locale)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </div>
                <p className="text-sm text-[var(--color-muted-foreground)]">
                  Poți folosi acest număr pentru a urmări statusul comenzii tale.
                </p>
              </CardContent>
            </Card>
          )}

          <div className="flex flex-col sm:flex-row gap-spacing-base justify-center">
            <Link href="/">
              <Button variant="outline" size="lg">
                {t('thankYou.continueShopping', 'Continuă cumpărăturile')}
              </Button>
            </Link>
            <Link href="/orders">
              <Button variant="primary" size="lg">
                {t('thankYou.viewOrders', 'Vezi toate comenzile')}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  )
}

