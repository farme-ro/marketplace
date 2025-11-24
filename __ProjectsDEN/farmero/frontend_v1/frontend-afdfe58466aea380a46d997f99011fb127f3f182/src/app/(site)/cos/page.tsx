/**
 * Cart Page
 * 
 * Pagină pentru coșul de cumpărături
 * Afișează produsele din coș, permite modificarea cantităților și ștergerea
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, Button } from 'farme-ui'
import { useCart, useCartTotal } from '@/lib/store/cart'
import { useAuth } from '@/lib/auth/context'
import { calculateShippingCost, getShippingMessage } from '@/lib/utils/shipping'
import { useI18n } from '@/lib/i18n/context'
import { formatCurrency } from '@/lib/utils/format'
import { formatUnit } from '@/lib/utils/format-units'
import { Package, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { routes } from '@/lib/routes'

export default function CartPage() {
  const router = useRouter()
  const { items, status, loadCart, updateQuantity, removeItem, clear } = useCart()
  const total = useCartTotal()
  const { isAuthenticated, role } = useAuth()
  const { t, locale } = useI18n()
  const [isClearing, setIsClearing] = useState(false)

  // Load cart on mount
  useEffect(() => {
    if (isAuthenticated && role === 'client') {
      loadCart()
    } else {
      // For guest users, cart is already in localStorage
      // Just ensure it's loaded
    }
  }, [isAuthenticated, role, loadCart])

  const handleCheckout = () => {
    if (items.length === 0) {
      return
    }

    // If not authenticated, redirect to login with return path
    if (!isAuthenticated || role !== 'client') {
      router.push(`/login-client?redirect=${routes.checkout}`)
      return
    }

    router.push(routes.checkout)
  }

  const handleClear = async () => {
    if (!confirm(t('cart.confirmClear', 'Ești sigur că vrei să golești coșul?'))) {
      return
    }

    setIsClearing(true)
    try {
      await clear()
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Error clearing cart:', error)
      }
    } finally {
      setIsClearing(false)
    }
  }

  // Calculate shipping cost based on order total
  const shippingCost = calculateShippingCost(total)
  const finalTotal = total + shippingCost
  const shippingMessage = getShippingMessage(total, locale)

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-8xl mx-auto px-4">
          <div className="text-center py-20">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
            <p className="text-muted-foreground">{t('cart.loading', 'Se încarcă coșul...')}</p>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-8xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {t('cart.empty', 'Coșul tău este gol')}
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {t('cart.startShopping', 'Începe să cumperi')}
            </p>
            <Link href={routes.products.list}>
              <Button size="lg">
                {t('cart.startShopping', 'Începe să cumperi')}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12">
        <div className="max-w-8xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
              {t('navbar.cart', 'Coș')}
            </h1>
            <p className="text-base text-foreground-body">
              {items.length} {items.length === 1 ? t('common.products', 'produs') : t('common.products', 'produse')} {t('cart.inCart', 'în coș')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="border border-border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 bg-card">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <Link href={`/products/${item.slug}`} className="flex-shrink-0">
                          <div className="w-24 h-24 rounded-xl bg-muted overflow-hidden">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={96}
                                height={96}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-8 h-8 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                        </Link>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <Link href={`/products/${item.slug}`}>
                            <h3 className="text-lg font-semibold text-foreground mb-1 hover:text-primary transition-colors">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground mb-2">
                            {t('cart.fromProducer', 'de la')} {item.producerName}
                          </p>
                          <p className="text-sm text-muted-foreground mb-4">
                            {item.unit}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 border border-border rounded-lg">
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                disabled={status === 'submitting'}
                                className="p-2 hover:bg-muted transition-colors disabled:opacity-50"
                                aria-label={t('cart.decreaseQuantity', 'Scade cantitatea')}
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                disabled={status === 'submitting'}
                                className="p-2 hover:bg-muted transition-colors disabled:opacity-50"
                                aria-label={t('cart.increaseQuantity', 'Crește cantitatea')}
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem(item.productId)}
                              disabled={status === 'submitting'}
                              className="p-2 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                              aria-label={t('cart.removeProduct', 'Șterge produsul')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex-shrink-0 text-right">
                          <p className="text-xl font-bold text-foreground">
                            {formatCurrency(item.price * item.quantity, locale)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(item.price, locale)} / {formatUnit(1, item.unit, locale, t)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {/* Clear Cart Button */}
              <div className="pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  disabled={isClearing || status === 'submitting'}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t('cart.clearCart', 'Golește coșul')}
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="border border-border rounded-2xl shadow-lg bg-card sticky top-4">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6">
                    {t('cart.total', 'Total')}
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('cart.subtotal', 'Subtotal')}</span>
                      <span className="text-foreground">{formatCurrency(total, locale)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('cart.shipping', 'Transport')}</span>
                      <span className="text-foreground">
                        {shippingCost === 0 ? t('cart.shipping', 'Gratuit') : formatCurrency(shippingCost, locale)}
                      </span>
                    </div>
                    {shippingCost > 0 && (
                      <div className="text-xs text-muted-foreground italic">
                        {shippingMessage}
                      </div>
                    )}
                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between">
                        <span className="font-semibold text-foreground">{t('cart.total', 'Total')}</span>
                        <span className="text-2xl font-bold text-primary">
                          {formatCurrency(finalTotal, locale)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    disabled={items.length === 0 || status === 'submitting'}
                    size="lg"
                    className="w-full font-semibold"
                  >
                    {t('cart.proceedToCheckout', 'Continuă la checkout')}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>

                  {(!isAuthenticated || role !== 'client') && (
                    <p className="text-xs text-muted-foreground text-center mt-4">
                      {t('cart.redirectToLogin', 'Vei fi redirecționat la autentificare')}
                    </p>
                  )}

                  <Link
                    href={routes.products.list}
                    className="block text-center text-sm text-primary hover:underline mt-4"
                  >
                    {t('cart.continueShopping', 'Continuă cumpărăturile')}
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
  )
}

