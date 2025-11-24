/**
 * Subscription & Commission Section Component
 * 
 * Secțiunea cu abonament și comision
 */

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, Button } from 'farme-ui'
import { FiCreditCard, FiTrendingDown } from 'react-icons/fi'

interface SubscriptionCommissionSectionProps {
  currentPlan?: string
  currentCommission?: string
}

export function SubscriptionCommissionSection({
  currentPlan = 'Fără abonament',
  currentCommission = '8%',
}: SubscriptionCommissionSectionProps) {
  return (
    <section className="mb-6 lg:mb-8">
      <Card className="border border-border/60 rounded-2xl shadow-sm bg-card">
        <CardContent className="p-5 lg:p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center">
                <FiCreditCard className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Abonament & Comision
                </h3>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Abonament curent</p>
                <p className="text-sm font-medium text-foreground">{currentPlan}</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Comision actual</p>
                <p className="text-sm font-medium text-foreground">
                  Comision platformă: {currentCommission}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-border space-y-2">
              <p className="text-xs text-foreground-body leading-relaxed">
                Pe măsură ce vinzi mai mult, comisionul scade.
              </p>
              <p className="text-xs text-foreground-body leading-relaxed">
                Abonamentele îți oferă vizibilitate și stabilitate.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Link href="/portal-producatori/comisioane">
                <Button variant="outline" size="sm" className="rounded-full">
                  Vezi detalii abonamente
                </Button>
              </Link>
              <Link href="/portal-producatori/comisioane">
                <Button variant="ghost" size="sm" className="rounded-full">
                  Vezi istoricul vânzărilor
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

