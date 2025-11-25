/**
 * Producer Commission Summary Component
 * 
 * Secțiunea "Status comision & plan" din dashboard
 */

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent } from 'farme-ui'
import { Button } from 'farme-ui'
import { useI18n } from '@/lib/i18n/context'
import { formatCurrency } from '@/lib/utils/format'

interface ProducerCommissionSummaryProps {
  currentCommission?: string
  currentTier?: string
  monthlySales?: number
}

export function ProducerCommissionSummary({
  currentCommission = '8.5%',
  currentTier = 'Începător',
  monthlySales = 0,
}: ProducerCommissionSummaryProps) {
  const { locale } = useI18n()
  
  // Commission calculation: Currently uses static tiers
  // In the future, this will be calculated from API based on actual sales data
  const nextTierThreshold = monthlySales < 5000 ? 5000 : monthlySales < 15000 ? 15000 : null
  const nextTierName = monthlySales < 5000 ? 'În creștere' : monthlySales < 15000 ? 'Partener stabil' : null
  const nextTierRate = monthlySales < 5000 ? '7.5%' : monthlySales < 15000 ? '6.5%' : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <Card className="border border-border rounded-[32px] shadow-premium bg-card">
        <CardContent className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center border-2 border-primary/20">
              <span className="text-2xl">💳</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Status comision & plan</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Comision actual</p>
              <p className="text-3xl font-bold text-foreground mb-2">{currentCommission}</p>
              <p className="text-sm text-muted-foreground">Nivel: {currentTier}</p>
            </div>
            {nextTierThreshold && nextTierName && nextTierRate && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Următorul nivel</p>
                <p className="text-lg font-semibold text-foreground mb-2">
                  {nextTierName} ({nextTierRate})
                </p>
                <p className="text-sm text-muted-foreground">
                  La {formatCurrency(nextTierThreshold, locale)} / lună
                </p>
              </div>
            )}
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Comisionul tău scade pe măsură ce vinzi mai mult. Obiectivul nostru este să câștigăm împreună, nu împotriva ta.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/portal-producatori/comisioane">
              <Button variant="outline" className="w-full sm:w-auto">
                Vezi toate detaliile de comision
              </Button>
            </Link>
            <Link href="/portal-producatori/abonamente">
              <Button className="w-full sm:w-auto">
                Vezi abonamente & beneficii
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

