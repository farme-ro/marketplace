/**
 * Checkout Trust Bar Component
 * 
 * Bară de încredere pentru checkout cu mesaje psihologice
 */

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'
import { TrustStack } from './trust-stack'
import { cn } from '@/lib/utils/cn'
import { useI18n } from '@/lib/i18n/context'

interface CheckoutTrustBarProps {
  variant?: 'default' | 'compact'
  className?: string
}

export function CheckoutTrustBar({
  variant = 'default',
  className,
}: CheckoutTrustBarProps) {
  const { t } = useI18n()
  
  const trustMessages = [
    t('checkout.trustBar.message1', 'Comanda ta susține direct producătorul'),
    t('checkout.trustBar.message2', 'Plată sigură, fără taxe ascunse'),
    t('checkout.trustBar.message3', 'Preț corect, muncă respectată'),
  ]
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn('w-full', className)}
    >
      <Card className="border-2 border-emerald-200 dark:border-emerald-800/50 rounded-xl shadow-sm bg-gradient-to-br from-emerald-50/30 to-green-50/20 dark:from-emerald-950/10 dark:to-green-950/10">
        <CardContent className="p-4 md:p-5">
          <div className="space-y-4">
            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <TrustStack
                badges={['verified-producers', 'producer-prices', 'secure-payment']}
                variant={variant === 'compact' ? 'compact' : 'default'}
                layout="horizontal"
              />
            </div>

            {/* Trust Messages */}
            <div className="space-y-2 text-center">
              {trustMessages.map((message, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="text-xs md:text-sm text-muted-foreground flex items-center justify-center gap-2"
                >
                  <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                  {message}
                </motion.p>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

