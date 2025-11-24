/**
 * Impact On Order Summary Component
 * 
 * Mesaj de impact pentru pagina de "Thank you" după comandă
 */

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'
import { cn } from '@/lib/utils/cn'

interface ImpactOnOrderSummaryProps {
  producerCount?: number
  orderId?: string
  className?: string
}

export function ImpactOnOrderSummary({
  producerCount = 1,
  orderId,
  className,
}: ImpactOnOrderSummaryProps) {
  const producerText =
    producerCount > 1
      ? 'Comanda ta ajută mai mulți producători locali să își vândă munca.'
      : 'Ai susținut un producător local să își vândă munca la un preț corect.'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={cn('w-full', className)}
    >
      <Card className="border-2 border-emerald-200 dark:border-emerald-800/50 rounded-2xl shadow-lg bg-gradient-to-br from-emerald-50/50 via-green-50/30 to-amber-50/30 dark:from-emerald-950/20 dark:via-green-950/20 dark:to-amber-950/20">
        <CardContent className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border-2 border-emerald-500/20">
              <span className="text-2xl">💚</span>
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Mulțumim! Comanda ta chiar contează.
            </h3>
          </div>

          <div className="space-y-3 text-muted-foreground leading-relaxed">
            <p>{producerText}</p>
            <p>Ai ales o variantă care poate reduce risipa alimentară.</p>
            <p>
              Vei primi notificări clare despre livrare. Dacă ceva merge prost, nu lăsăm lucrurile în aer.
            </p>
          </div>

          {orderId && (
            <div className="mt-4 pt-4 border-t border-border/40">
              <p className="text-xs text-muted-foreground">
                ID comandă: <span className="font-mono font-medium">{orderId}</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

