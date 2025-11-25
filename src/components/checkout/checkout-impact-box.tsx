/**
 * Checkout Impact Box Component
 * 
 * Badge informativ pentru utilizatori cu istoric negativ
 */

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'
import { useI18n } from '@/lib/i18n/context'

interface CheckoutImpactBoxProps {
  hasUncollectedOrders?: boolean
}

export function CheckoutImpactBox({ hasUncollectedOrders = false }: CheckoutImpactBoxProps) {
  const { t } = useI18n()
  
  if (!hasUncollectedOrders) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-6"
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
              <h4 className="font-semibold text-foreground mb-2">
                {t('checkout.impactBox.title', 'Ai avut comenzi neridicate anterior')}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('checkout.impactBox.description', 'Pentru transparență, următoarele comenzi pot include o taxă logistică suplimentară temporară.')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

