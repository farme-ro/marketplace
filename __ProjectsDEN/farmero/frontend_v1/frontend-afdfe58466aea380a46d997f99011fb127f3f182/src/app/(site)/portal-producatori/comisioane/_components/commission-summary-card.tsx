/**
 * Commission Summary Card Component
 * 
 * Card cu rezumatul comisionului actual
 */

'use client'

import { Card, CardContent } from 'farme-ui'
import { useI18n } from '@/lib/i18n/context'
import { formatNumber, formatCurrency } from '@/lib/utils/format'
import type { ProducerCommissionSummary } from '@/lib/api/producer/commissions'

interface CommissionSummaryCardProps {
  summary: ProducerCommissionSummary | null
}

export function CommissionSummaryCard({ summary }: CommissionSummaryCardProps) {
  const { locale } = useI18n()
  
  // Fallback values dacă nu există date din API
  const currentCommission = summary?.currentCommissionPercent ?? 8.5
  const planName = summary?.planName || 'Producător activ'
  const monthlySales = summary?.monthlySales
  const nextTier = summary?.nextTier

  // Placeholder pentru tier labels
  const currentTierLabel = planName || 'Producător activ'
  const nextTierLabel = nextTier ? 'Producător de top' : 'Producător de top'
  const nextThreshold = nextTier
    ? `${formatCurrency(nextTier.threshold, locale)} / lună`
    : '15.000 lei / lună (exemplu)'

  return (
    <section className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
      {/* Main Card */}
      <Card className="rounded-[32px] border border-border bg-card shadow-premium">
        <CardContent className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-2">
                Comisionul tău actual
              </p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold tracking-tight text-foreground">
                  {formatNumber(currentCommission, locale)}
                  <span className="text-2xl text-muted-foreground">%</span>
                </span>
              </div>
              <p className="text-xs font-medium text-primary">
                {currentTierLabel}
              </p>
            </div>
            <Card className="rounded-xl border border-primary/20 bg-primary-soft/30 p-4 text-xs shadow-sm">
              <p className="font-semibold text-foreground mb-1">Comision care poate scădea</p>
              <p className="text-[11px] text-foreground-body leading-relaxed">
                Pe măsură ce crește volumul tău lunar, comisionul poate ajunge la nivelul minim.
                Preferăm un parteneriat pe termen lung, nu comisioane abuzive.
              </p>
            </Card>
          </div>

          <p className="text-sm text-foreground-body leading-relaxed mb-6">
            Comisionul tău poate scădea pe măsură ce vinzi mai mult. Vei vedea întotdeauna aici
            procentul actual aplicat comenzilor tale.
          </p>

          {/* Bara de progres simbolică */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-foreground-body">
              <span>Progres către nivelul următor ({nextTierLabel})</span>
              <span>prag exemplu: {nextThreshold}</span>
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div className="h-2 w-1/3 rounded-full bg-primary" />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Valorile afișate aici sunt de exemplu. În varianta finală, pragurile și comisionul
              vor fi calculate în funcție de vânzările tale reale.
            </p>
          </div>

          {/* Info volum / următorul prag */}
          {monthlySales !== undefined && (
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Vânzări luna curentă: <span className="font-semibold text-foreground">{formatCurrency(monthlySales, locale)}</span>
              </p>
            </div>
          )}

          {nextTier && (
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Dacă atingi vânzări de cel puțin <span className="font-semibold text-foreground">{formatCurrency(nextTier.threshold, locale)}</span> în perioada
                curentă, comisionul tău poate scădea la <span className="font-semibold text-foreground">{nextTier.rate}%</span> conform 
                condițiilor contractuale.
              </p>
            </div>
          )}

          {!summary && (
            <p className="text-xs text-muted-foreground italic">
              Detaliile exacte despre comisionul tău se găsesc în contractul tău cu farme.ro.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Info Card "Prețuri de producător" */}
      <Card className="rounded-[32px] border border-border bg-muted/40 shadow-premium">
        <CardContent className="p-5 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">
            Prețuri de producător
          </h3>
          <p className="text-xs text-foreground-body leading-relaxed">
            Clienții știu că pe farme.ro găsesc prețuri &ldquo;de producător&rdquo; – cât mai aproape de
            relația directă, dar cu infrastructură, plăți și organizare incluse.
          </p>
          <p className="text-xs text-foreground-body leading-relaxed">
            Scopul nostru este ca tu să vinzi corect și sustenabil, nu să îți &ldquo;mâncăm&rdquo; marja
            prin comisioane imprevizibile.
          </p>
        </CardContent>
      </Card>
    </section>
  )
}

