/**
 * Checkout Page
 * 
 * Pagină completă de checkout cu mesaje sociale și prevenție neridicare
 * Integrat cu API pentru crearea comenzilor
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, Input, Button, Alert } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'
import { CheckoutHeader } from '@/components/checkout/checkout-header'
import { CheckoutDeliverySelection } from '@/components/checkout/checkout-delivery-selection'
import { CheckoutResponsibility } from '@/components/checkout/checkout-responsibility'
import { CheckoutPaymentRules } from '@/components/checkout/checkout-payment-rules'
import { CheckoutImpactBox } from '@/components/checkout/checkout-impact-box'
import { CheckoutImpactSection } from '@/components/checkout/checkout-impact-section'
import { CheckoutImpactSidebar } from '@/components/checkout/checkout-impact-sidebar'
import { CheckoutTrustBar } from '@/components/trust/checkout-trust-bar'
import { GrowthNudgeBanner } from '@/components/growth/growth-nudge-banner'
import { useCart, useCartTotal, useCartStore } from '@/lib/store/cart'
import { useAuth } from '@/lib/auth/context'
import { useAccount } from '@/components/providers/AccountProvider'
import { useI18n } from '@/lib/i18n/context'
import { routes } from '@/lib/routes'
import { createOrder, type PaymentMethod as ApiPaymentMethod } from '@/lib/api/orders'
import { trackCheckoutStarted } from '@/lib/growth/growth-client'

type DeliveryMethod = 'address' | 'easybox' | null
// UI-friendly payment method type (maps to API type)
type PaymentMethod = 'card' | 'cash_on_delivery'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, status: cartStatus, loadCart } = useCart()
  const total = useCartTotal()
  const { isAuthenticated, role, clientUser } = useAuth()
  const { activeAccountId } = useAccount()
  const { t } = useI18n()
  
  // Form state
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Shipping address
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [address, setAddress] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [notes, setNotes] = useState('')

  // Load cart and user data
  useEffect(() => {
    if (isAuthenticated && role === 'client') {
      loadCart()
      if (clientUser) {
        setName(clientUser.fullName || '')
        setEmail(clientUser.email || '')
      }
    } else {
      // Redirect to login if not authenticated
      router.push(`/login-client?redirect=/checkout`)
    }
  }, [isAuthenticated, role, loadCart, clientUser, router])

  // Track checkout started
  useEffect(() => {
    if (items.length > 0) {
      trackCheckoutStarted(items.length)
    }
  }, [items.length])

  // Redirect if cart is empty
  useEffect(() => {
    if (cartStatus === 'idle' && items.length === 0) {
      router.push(routes.cart)
    }
  }, [items.length, cartStatus, router])

  // Mock data for payment rules
  const isFirstOrder = false
  const hasGoodHistory = true
  const hasNegativeHistory = false
  const hasUncollectedOrders = false
  const availablePaymentMethods: ('card' | 'cash_on_delivery')[] = hasGoodHistory
    ? ['card', 'cash_on_delivery']
    : ['card']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!deliveryMethod) {
      setError(t('checkout.selectDelivery', 'Te rugăm să selectezi un mod de livrare'))
      return
    }

    if (!name || !email || !phone || !city || !address) {
      setError(t('checkout.fillRequired', 'Te rugăm să completezi toate câmpurile obligatorii'))
      return
    }

    if (!agreedToTerms) {
      setError(t('checkout.agreeTerms', 'Te rugăm să confirmi că ai înțeles termenii'))
      return
    }

    if (items.length === 0) {
      setError(t('checkout.cartEmpty', 'Coșul este gol. Adaugă produse înainte de a plasa comanda.'))
      router.push(routes.cart)
      return
    }

    setIsProcessing(true)

    try {
      // Map UI payment method to API payment method
      const apiPaymentMethod: ApiPaymentMethod = paymentMethod === 'cash_on_delivery' ? 'cod' : paymentMethod
      
      // Create order
      // Note: Backend endpoint needs to support accountId in order creation
      // When backend supports it, uncomment: accountId: activeAccountId || undefined
      const response = await createOrder({
        name,
        email,
        phone,
        city,
        address,
        postalCode: postalCode || undefined,
        notes: notes || undefined,
        paymentMethod: apiPaymentMethod,
        // accountId: activeAccountId || undefined, // Uncomment when backend supports accountId
      })

      // Clear cart on success
      const clearCart = useCartStore.getState().clear
      await clearCart()

      // Redirect based on payment method
      if (response.paymentUrl) {
        // Redirect to payment URL (e.g., Stripe checkout)
        window.location.href = response.paymentUrl
      } else {
        // Redirect to thank you page
        router.push(`${routes.thankYou}?orderId=${response.order.id}`)
      }
    } catch (err: unknown) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Checkout error:', err)
      }
      
      // Handle specific error types
      if (err instanceof Error) {
        if (err.message.includes('401') || err.message.includes('autentificat')) {
          setError(t('checkout.authRequired', 'Trebuie să fii autentificat pentru a plasa o comandă. Te rugăm să te autentifici și să încerci din nou.'))
          router.push(`/login-client?redirect=${routes.checkout}`)
          return
        }
        if (err.message.includes('422') || err.message.includes('stoc') || err.message.includes('disponibil')) {
          setError(t('checkout.stockError', 'Unele produse nu mai sunt disponibile sau stocul este insuficient. Te rugăm să verifici coșul și să încerci din nou.'))
        } else if (err.message.includes('404') || err.message.includes('gol')) {
          setError(t('checkout.cartEmpty', 'Coșul este gol. Adaugă produse înainte de a plasa comanda.'))
          router.push(routes.cart)
          return
        } else {
          setError(err.message || t('checkout.errorPlacingOrder', 'A apărut o problemă la plasarea comenzii. Te rugăm să încerci din nou.'))
        }
      } else {
        setError(t('checkout.errorPlacingOrder', 'A apărut o problemă la plasarea comenzii. Te rugăm să încerci din nou.'))
      }
      
      setIsProcessing(false)
    }
  }

  // Show loading if cart is loading
  if (cartStatus === 'loading') {
    return (
      <div className="min-h-screen py-8 md:py-12 bg-background">
        <PageContainer>
          <div className="text-center py-20">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
            <p className="text-muted-foreground">{t('common.loading', 'Se încarcă...')}</p>
          </div>
        </PageContainer>
      </div>
    )
  }

  // Redirect if not authenticated (handled by useEffect)
  if (!isAuthenticated || role !== 'client') {
    return null
  }

  // Redirect if cart is empty (handled by useEffect)
  if (items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen py-8 md:py-12 bg-background">
      <PageContainer>
        <CheckoutHeader />

        {/* Growth Nudge Banner */}
        <GrowthNudgeBanner page="checkout" />

        {error && (
          <Alert variant="destructive" className="mb-6">
            {error}
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Shipping Address */}
              <Card className="border-2 border-border/60 rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">{t('checkout.shippingAddress', 'Adresă de livrare')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {t('checkout.name', 'Nume complet')} *
                      </label>
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Ion Popescu"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {t('checkout.email', 'Email')} *
                      </label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="ion@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('checkout.phone', 'Telefon')} *
                    </label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="0712345678"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {t('checkout.city', 'Oraș')} *
                      </label>
                      <Input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        placeholder="București"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {t('checkout.postalCode', 'Cod poștal')}
                      </label>
                      <Input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="123456"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('checkout.fullAddress', 'Adresă completă')} *
                    </label>
                    <Input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      placeholder="Str. Exemplu, Nr. 123, Bl. A, Sc. 1, Ap. 5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('checkout.notes', 'Note (opțional)')}
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full min-h-[100px] px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                      placeholder={t('checkout.notesPlaceholder', 'Instrucțiuni speciale pentru livrare...')}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Selection */}
              <Card className="border-2 border-border/60 rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">{t('checkout.deliveryMethod', 'Metodă de livrare')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CheckoutDeliverySelection
                    value={deliveryMethod}
                    onChange={setDeliveryMethod}
                  />
                </CardContent>
              </Card>

              {/* Responsibility Section */}
              <CheckoutResponsibility />

              {/* Payment Method Selection */}
              <Card className="border-2 border-border/60 rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">{t('checkout.paymentMethod', 'Metodă de plată')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CheckoutPaymentRules
                    isFirstOrder={isFirstOrder}
                    hasGoodHistory={hasGoodHistory}
                    hasNegativeHistory={hasNegativeHistory}
                    availablePaymentMethods={availablePaymentMethods}
                  />

                  <div className="space-y-3">
                    {availablePaymentMethods.includes('card') && (
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <Card
                          className={`cursor-pointer border-2 transition-all duration-300 ${
                            paymentMethod === 'card'
                              ? 'border-primary bg-primary/5 shadow-md'
                              : 'border-border/60 hover:border-primary/40'
                          }`}
                          onClick={() => setPaymentMethod('card')}
                        >
                          <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="text-2xl">💳</div>
                                <div>
                                  <h4 className="font-semibold text-foreground">Plată online cu cardul</h4>
                                  <p className="text-sm text-muted-foreground">Plată securizată prin Stripe</p>
                                </div>
                              </div>
                              {paymentMethod === 'card' && (
                                <div className="w-5 h-5 rounded-full bg-primary border-2 border-primary flex items-center justify-center">
                                  <div className="w-2 h-2 rounded-full bg-white" />
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}

                    {availablePaymentMethods.includes('cash_on_delivery') && (
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <Card
                          className={`cursor-pointer border-2 transition-all duration-300 ${
                            paymentMethod === 'cash_on_delivery'
                              ? 'border-primary bg-primary/5 shadow-md'
                              : 'border-border/60 hover:border-primary/40'
                          }`}
                          onClick={() => setPaymentMethod('cash_on_delivery')}
                        >
                          <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="text-2xl">💵</div>
                                <div>
                                  <h4 className="font-semibold text-foreground">Plată ramburs</h4>
                                  <p className="text-sm text-muted-foreground">Plătești la livrare</p>
                                </div>
                              </div>
                              {paymentMethod === 'cash_on_delivery' && (
                                <div className="w-5 h-5 rounded-full bg-primary border-2 border-primary flex items-center justify-center">
                                  <div className="w-2 h-2 rounded-full bg-white" />
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                        {paymentMethod === 'cash_on_delivery' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ duration: 0.3 }}
                            className="mt-3 p-4 bg-muted border border-border rounded-xl"
                          >
                            <p className="text-sm text-foreground">
                              <strong className="font-semibold">Notă:</strong> Pentru transparență și eficiență, unele produse perisabile pot necesita plata online.
                            </p>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Impact Box for users with negative history */}
              <CheckoutImpactBox hasUncollectedOrders={hasUncollectedOrders} />

              {/* Impact Section */}
              <CheckoutImpactSection />

              {/* Trust Bar */}
              <CheckoutTrustBar />

              {/* Terms Checkbox */}
              <Card className="border-2 border-border/60 rounded-2xl shadow-lg">
                <CardContent className="p-6">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-border text-primary focus:ring-primary focus:ring-2"
                      required
                    />
                    <div className="flex-1">
                      <p className="text-sm text-foreground leading-relaxed">
                        {t('checkout.confirmTerms', 'Confirm că am înțeles')}{' '}
                        <Link
                          href="/cum-functioneaza-si-impact"
                          className="text-primary hover:underline font-medium"
                          target="_blank"
                        >
                          {t('checkout.termsLink', 'termenul de ridicare și politica privind produsele alimentare perisabile')}
                        </Link>
                        .
                      </p>
                    </div>
                  </label>
                </CardContent>
              </Card>

              {/* Final CTA */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="space-y-4"
              >
                <Button
                  type="submit"
                  size="lg"
                  className="w-full font-bold text-lg py-6 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-xl"
                  disabled={isProcessing || !agreedToTerms || !deliveryMethod || items.length === 0}
                >
                  {isProcessing ? t('checkout.processing', 'Se procesează comanda...') : t('checkout.placeOrder', 'Plasează comanda')}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  {t('checkout.thankYou', 'Fiecare comandă contează. Mulțumim.')}
                </p>
              </motion.div>
            </form>
          </div>

          {/* Impact Sidebar */}
          <div className="lg:col-span-1">
            <CheckoutImpactSidebar />
          </div>
        </div>
      </PageContainer>
    </div>
  )
}
