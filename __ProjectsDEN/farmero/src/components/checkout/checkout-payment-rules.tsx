/**
 * Checkout Payment Rules Component
 * 
 * Reguli inteligente pentru modul de plată
 */

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'
import { useI18n } from '@/lib/i18n/context'

interface CheckoutPaymentRulesProps {
  isFirstOrder?: boolean
  hasGoodHistory?: boolean
  hasNegativeHistory?: boolean
  availablePaymentMethods: ('card' | 'cash_on_delivery')[]
}

export function CheckoutPaymentRules({
  isFirstOrder = false,
  hasGoodHistory = false,
  hasNegativeHistory = false,
  availablePaymentMethods,
}: CheckoutPaymentRulesProps) {
  const { t } = useI18n()
  const showRestrictionMessage = hasNegativeHistory && !availablePaymentMethods.includes('cash_on_delivery')

  return (
    <div className="space-y-4">
      {isFirstOrder && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl"
        >
          <p className="text-sm text-emerald-800 dark:text-emerald-200">
            <strong className="font-semibold">{t('checkout.paymentRules.firstOrder', 'Prima ta comandă: Pentru siguranță, acceptăm doar plăți online cu cardul.')}</strong>
          </p>
        </motion.div>
      )}

      {hasGoodHistory && availablePaymentMethods.includes('cash_on_delivery') && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl"
        >
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <strong className="font-semibold">{t('checkout.paymentRules.goodHistory', 'Istoric pozitiv: Ai acces la toate metodele de plată disponibile.')}</strong>
          </p>
        </motion.div>
      )}

      {showRestrictionMessage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-2 border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-amber-500/20">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                    {t('checkout.paymentRules.restriction', 'Pentru a menține calitatea serviciului, anumite plăți pot fi temporar disponibile doar online.')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

