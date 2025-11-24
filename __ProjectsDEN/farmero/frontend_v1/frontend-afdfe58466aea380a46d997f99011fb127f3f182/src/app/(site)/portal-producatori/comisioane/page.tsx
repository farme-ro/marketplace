/**
 * Producer Commissions Page
 * 
 * Pagină pentru afișarea comisioanelor și plăților pentru producători
 * Folosește date reale din API când sunt disponibile
 */

import { Metadata } from 'next'
import { ProducerDashboardLayout } from '@/components/producer-portal/producer-dashboard-layout'
import { getProducerCommissionSummaryServer, getProducerCommissionHistoryServer } from '@/lib/api/producer/commissions'
import { CommissionSummaryCard } from './_components/commission-summary-card'
import { CommissionCalculationSection } from './_components/commission-calculation-section'
import { CommissionHistorySection } from './_components/commission-history-section'
import { CommissionFaqSection } from './_components/commission-faq-section'
import { SubscriptionPlansSection } from './_components/subscription-plans-section'
import { WhyThisModelSection } from './_components/why-this-model-section'

export const metadata: Metadata = {
  title: 'Comisioane & abonamente producători | farme.ro',
  description:
    'Află cum funcționează comisioanele și abonamentele pentru producători pe farme.ro. Model transparent, corect și gândit să te ajute să rămâi în platformă pe termen lung.',
}

export default async function ProducerCommissionsPage() {
  // Fetch date din API (server-side)
  const [summary, history] = await Promise.all([
    getProducerCommissionSummaryServer(),
    getProducerCommissionHistoryServer(),
  ])

  return (
    <ProducerDashboardLayout>
      <div className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-8xl px-4 py-6 md:py-8 space-y-8">
          {/* Header / Hero */}
          <section className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft/30 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              transparent & corect pentru producători
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
                Comisioane & abonamente pentru producători
              </h1>
              <p className="text-sm text-foreground-body max-w-2xl leading-relaxed">
                Model de monetizare gândit ca tu să vrei să rămâi în platformă, nu să o ocolești.
                Comision clar, transparent și, pe măsură ce vinzi mai mult, mai avantajos.
              </p>
            </div>
          </section>

          {/* Card rezumat - Comisionul tău actual */}
          <CommissionSummaryCard summary={summary} />

          {/* Secțiune: Cum scade comisionul */}
          <CommissionCalculationSection summary={summary} />

          {/* Secțiune: Abonamente pentru producători */}
          <SubscriptionPlansSection />

          {/* Secțiune: De ce am ales acest model */}
          <WhyThisModelSection />

          {/* Secțiune: Istoric comisioane / rezumat perioadă */}
          <CommissionHistorySection history={history} />

          {/* Secțiune: Întrebări frecvente */}
          <CommissionFaqSection />
        </div>
      </div>
    </ProducerDashboardLayout>
  )
}
