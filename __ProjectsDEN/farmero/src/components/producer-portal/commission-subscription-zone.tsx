/**
 * Commission & Subscription Zone Component
 * 
 * Card accent cu plan curent, comision și progres vizual
 */

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent } from 'farme-ui'
import { Button } from 'farme-ui'
import { useI18n } from '@/lib/i18n/context'
import { formatCurrency, formatNumber } from '@/lib/utils/format'

interface CommissionSubscriptionZoneProps {
  currentPlan?: string
  currentCommission?: string
  monthlySales?: number
  nextTierThreshold?: number
  nextTierCommission?: string
}

export function CommissionSubscriptionZone({
  currentPlan = '🌾 Producător Standard',
  currentCommission = '8%',
  monthlySales = 8500,
  nextTierThreshold = 12000,
  nextTierCommission = '6.5%',
}: CommissionSubscriptionZoneProps) {
  const { locale } = useI18n()
  const progress = Math.min((monthlySales / nextTierThreshold) * 100, 100)
  const remaining = Math.max(nextTierThreshold - monthlySales, 0)

  return (
    <Card className="border-2 border-primary/30 rounded-[32px] shadow-premium-lg bg-gradient-to-br from-primary-bg/50 to-primary-soft/30">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Left: Plan & Commission Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">Plan curent</h3>
              <p className="text-lg text-foreground-body">{currentPlan}</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">Comision actual</h3>
              <p className="text-3xl font-bold text-primary">{currentCommission}</p>
            </div>

            {/* Progress Visual */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground-body">Progres către următorul nivel</span>
                <span className="font-semibold text-foreground">{Math.round(progress)}%</span>
              </div>
              <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary-hover rounded-full"
                />
              </div>
              <p className="text-xs text-foreground-body">
                La {formatCurrency(nextTierThreshold, locale)} vânzări → comision {nextTierCommission}
                {remaining > 0 && (
                  <span className="block text-primary font-semibold mt-1">
                    Mai ai nevoie de {formatCurrency(remaining, locale)}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Right: CTA */}
          <div className="flex-shrink-0">
            <Link href="/portal-producatori/abonamente">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-full px-8 py-3 text-base font-semibold shadow-premium w-full md:w-auto"
              >
                ➡️ Vezi planuri & beneficii
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

