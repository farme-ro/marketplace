/**
 * Commission Calculation Section
 * 
 * Secțiunea care explică cum se calculează comisionul și tiers-urile
 */

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'
import type { ProducerCommissionSummary } from '@/lib/api/producer/commissions'

interface CommissionCalculationSectionProps {
  summary: ProducerCommissionSummary | null
}

type Tier = {
  name: string
  range: string
  description: string
  notes?: string
}

const commissionTiers: Tier[] = [
  {
    name: 'Start / Producător nou',
    range: 'până la ~5.000 lei vânzări / lună',
    description:
      'La început ai un comision standard. E suficient de mic încât să poți testa platforma, dar acoperă costurile de funcționare, plăți, suport și dezvoltare.',
    notes: 'Comisioanele pot varia în intervalul 6.5% – 10%, în funcție de modelul final agreat.',
  },
  {
    name: 'Producător activ',
    range: 'între ~5.000 și ~15.000 lei vânzări / lună',
    description:
      'Pe măsură ce vinzi mai mult, comisionul scade. Preferăm volum + parteneriate pe termen lung, nu comisioane mari care te împing în afara platformei.',
  },
  {
    name: 'Producător de top',
    range: 'peste ~15.000 lei vânzări / lună',
    description:
      'Dacă vinzi constant volume mari, ajungi la nivelul minim de comision. Practic, e ca și cum am construi împreună un magazin online comun, nu doar o platformă de listare.',
  },
]

export function CommissionCalculationSection({ summary }: CommissionCalculationSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Cum scade comisionul pe măsură ce vinzi
          </h2>
          <p className="mt-1 text-sm text-foreground-body leading-relaxed">
            Nu folosim comisioane abuzive. Modelul este gândit să fie predictibil și să te
            recompenseze pentru activitate și loialitate.
          </p>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Exemplu de structură. Valorile finale pot fi ajustate în funcție de tipul de produse
          și de fluxul logistic.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {commissionTiers.map((tier, index) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="border border-border rounded-[32px] shadow-premium bg-card h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-foreground mb-2">
                    {tier.name}
                  </h3>
                  <p className="text-xs font-medium text-primary mb-3">
                    {tier.range}
                  </p>
                  <p className="text-sm text-foreground-body leading-relaxed mb-3">
                    {tier.description}
                  </p>
                </div>
                {tier.notes && (
                  <p className="mt-3 text-[11px] text-muted-foreground border-t border-border pt-3">
                    {tier.notes}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
