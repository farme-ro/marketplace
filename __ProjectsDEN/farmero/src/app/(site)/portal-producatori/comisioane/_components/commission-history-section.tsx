/**
 * Commission History Section
 * 
 * Secțiunea cu istoricul comisioanelor
 */

'use client'

import { Card, CardContent } from 'farme-ui'
import { useI18n } from '@/lib/i18n/context'
import { formatCurrency } from '@/lib/utils/format'
import type { ProducerCommissionHistoryItem } from '@/lib/api/producer/commissions'

interface CommissionHistorySectionProps {
  history: ProducerCommissionHistoryItem[]
}

export function CommissionHistorySection({ history }: CommissionHistorySectionProps) {
  const { locale } = useI18n()
  if (history.length === 0) {
    return (
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">
          Rezumat pe luni
        </h2>
        <Card className="rounded-[32px] border border-border bg-card shadow-premium">
          <CardContent className="p-6 md:p-8">
            <p className="text-sm text-muted-foreground text-center">
              Nu avem încă suficiente date pentru a-ți afișa un istoric. Revino după primele comenzi.
            </p>
            {/* Note: Commission history will display real data when the backend endpoint is available */}
          </CardContent>
        </Card>
      </section>
    )
  }

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">
        Rezumat pe luni
      </h2>
      <p className="text-sm text-muted-foreground">
        Vezi cum au evoluat vânzările și comisioanele tale în ultimele luni.
      </p>

      <Card className="rounded-[32px] border border-border bg-card shadow-premium overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/60">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Lună
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Vânzări totale
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Comision
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Total comision
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {history.map((item) => (
                  <tr key={item.period} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-2 text-foreground">{item.label}</td>
                    <td className="px-4 py-2 text-foreground">{formatCurrency(item.salesTotal, locale)}</td>
                    <td className="px-4 py-2 text-foreground">{item.rate}%</td>
                    <td className="px-4 py-2 text-foreground font-semibold">{formatCurrency(item.commissionTotal, locale)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

