/**
 * Payment Page Client Component
 * 
 * Client component pentru pagina de plată cu Stripe Elements
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useI18n } from '@/lib/i18n/context'
// Note: Stripe integration is ready but packages are commented out until backend is configured
// To enable: Install @stripe/stripe-js and @stripe/react-stripe-js packages
// import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js'
// import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

// const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
//   ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
//   : null

// Note: Re-enable Stripe components when packages are installed and backend is configured
// function CheckoutForm() {
//   const stripe = useStripe()
//   const elements = useElements()
//   const router = useRouter()
//   const [processing, setProcessing] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   ...
// }

function CheckoutForm() {
  const { t } = useI18n()
  return (
    <div className="p-4 bg-muted border border-border rounded-lg">
      <p className="text-foreground">{t('checkout.payment.stripeUnavailable', 'Plata Stripe nu este disponibilă momentan. Contactează administratorul.')}</p>
    </div>
  )
}

export default function PaymentPageClient() {
  const { t } = useI18n()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function createPaymentIntent() {
      if (!orderId) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch('/api/checkout/stripe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ orderId }),
        })

        if (!response.ok) {
          throw new Error(t('checkout.payment.errorCreatingSession', 'Eroare la crearea sesiunii de plată'))
        }

        const data = await response.json()
        setClientSecret(data.clientSecret)
      } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('Error creating payment intent:', err)
        }
      } finally {
        setLoading(false)
      }
    }

    createPaymentIntent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId])

  // Note: Re-enable Stripe integration when packages are installed and backend is configured
  // if (!stripePromise) { ... }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">{t('checkout.payment.title', 'Finalizează plata')}</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="p-4 bg-muted border border-border rounded-lg">
          <p className="text-foreground">{t('checkout.payment.stripeUnavailable', 'Plata Stripe nu este disponibilă momentan. Contactează administratorul.')}</p>
        </div>
      </div>
    </div>
  )
}

