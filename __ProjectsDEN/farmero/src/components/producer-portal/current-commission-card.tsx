/**
 * Current Commission Card Component
 * 
 * Afișează comisionul actual și următorul nivel
 */

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'
import { COMMISSION_TIERS, getCommissionTier } from '@/lib/config/commissions-config'

interface CurrentCommissionCardProps {
  currentCommission?: string
  monthlySales?: number
}

export function CurrentCommissionCard({
  currentCommission = '8.5%',
  monthlySales = 0,
}: CurrentCommissionCardProps) {
  const currentTier = getCommissionTier(monthlySales)
  const nextTierIndex = COMMISSION_TIERS.findIndex(t => t.id === currentTier.id) + 1
  const nextTier = nextTierIndex < COMMISSION_TIERS.length ? COMMISSION_TIERS[nextTierIndex] : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-2 border-primary/30 rounded-2xl shadow-lg bg-gradient-to-br from-primary/5 via-amber-500/5 to-orange-500/5">
        <CardContent className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center border-2 border-primary/20">
              <span className="text-2xl">💳</span>
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Cum vezi comisionul tău actual
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Comision actual</p>
              <p className="text-4xl font-bold text-primary mb-2">{currentCommission}</p>
              <p className="text-sm text-foreground font-semibold">
                Nivel: {currentTier.label}
              </p>
            </div>
            {nextTier && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Următorul nivel</p>
                <p className="text-2xl font-bold text-foreground mb-2">
                  {nextTier.rate}
                </p>
                <p className="text-sm text-muted-foreground">
                  {nextTier.range}
                </p>
              </div>
            )}
          </div>

          {nextTier && (
            <div className="p-4 bg-card/60 rounded-xl border border-border/60">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ești la nivelul <strong className="text-foreground">&quot;{currentTier.label}&quot;</strong>.{' '}
                {nextTier.range.includes('5.000') && monthlySales < 5000 && (
                  <>Dacă ajungi la 5.000 lei / lună, comisionul tău scade la {nextTier.rate}.</>
                )}
                {nextTier.range.includes('15.000') && monthlySales >= 5000 && monthlySales < 15000 && (
                  <>Dacă ajungi la 15.000 lei / lună, comisionul tău scade la {nextTier.rate}.</>
                )}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

