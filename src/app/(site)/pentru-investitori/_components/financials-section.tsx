/**
 * Financials Section
 * 
 * Secțiunea cu proiecții financiare și potențial de creștere
 */

'use client'

import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent } from 'farme-ui'
import { TrendingUp, DollarSign, BarChart3, Target } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function FinancialsSection() {
  const { t } = useI18n()

  const projections = [
    {
      year: '2024',
      revenue: '2.5M',
      growth: '150%',
      description: t('investors.financials.projections.2024.description', 'Lansare și primul an de operațiuni'),
    },
    {
      year: '2025',
      revenue: '8M',
      growth: '220%',
      description: t('investors.financials.projections.2025.description', 'Expansiune națională și B2B'),
    },
    {
      year: '2026',
      revenue: '20M',
      growth: '150%',
      description: t('investors.financials.projections.2026.description', 'Internaționalizare și noi servicii'),
    },
    {
      year: '2027',
      revenue: '50M',
      growth: '150%',
      description: t('investors.financials.projections.2027.description', 'Consolidare și profitabilitate'),
    },
  ]

  const investmentHighlights = [
    {
      icon: DollarSign,
      title: t('investors.financials.highlights.currentRound.title', 'Runda actuală'),
      value: '€500K - €1M',
      description: t('investors.financials.highlights.currentRound.description', 'Seed round pentru expansiune'),
    },
    {
      icon: Target,
      title: t('investors.financials.highlights.fundUsage.title', 'Utilizare fonduri'),
      value: t('investors.financials.highlights.fundUsage.value', '60% Marketing'),
      description: t('investors.financials.highlights.fundUsage.description', '40% Tech & Operațiuni'),
    },
    {
      icon: TrendingUp,
      title: t('investors.financials.highlights.valuation.title', 'Valuation target'),
      value: '€5M - €8M',
      description: t('investors.financials.highlights.valuation.description', 'Pre-money valuation'),
    },
    {
      icon: BarChart3,
      title: t('investors.financials.highlights.exitStrategy.title', 'Exit strategy'),
      value: t('investors.financials.highlights.exitStrategy.value', '5-7 ani'),
      description: t('investors.financials.highlights.exitStrategy.description', 'Strategic acquisition sau IPO'),
    },
  ]
  return (
    <section id="financials" className="py-16 md:py-24 bg-muted/30 scroll-mt-20">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            {t('investors.financials.title', 'Proiecții financiare și potențial de creștere')}
          </h2>
          <p className="text-lg text-foreground-body max-w-2xl mx-auto">
            {t('investors.financials.subtitle', 'Model de business scalabil cu potențial de creștere exponențială pe piața românească și europeană.')}
          </p>
        </motion.div>

        {/* Revenue Projections */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-foreground mb-6 text-center">
            {t('investors.financials.projections.title', 'Proiecții de venituri (RON)')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {projections.map((projection, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="border border-border rounded-2xl shadow-sm bg-card h-full">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        {projection.year}
                      </p>
                      <p className="text-3xl font-bold text-primary mb-2">
                        {projection.revenue}
                      </p>
                      <p className="text-sm font-semibold text-foreground mb-2">
                        +{projection.growth}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {projection.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Investment Highlights */}
        <div>
          <h3 className="text-2xl font-semibold text-foreground mb-6 text-center">
            {t('investors.financials.highlights.title', 'Detalii investiție')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {investmentHighlights.map((highlight, index) => {
              const Icon = highlight.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="border border-border rounded-xl shadow-sm bg-card">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center mx-auto mb-3">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <p className="text-sm font-medium text-foreground mb-2">
                        {highlight.title}
                      </p>
                      <p className="text-xl font-bold text-primary mb-1">
                        {highlight.value}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {highlight.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 p-4 rounded-lg bg-muted border border-border"
        >
          <p className="text-xs text-muted-foreground text-center">
            {t('investors.financials.disclaimer', '* Proiecțiile financiare sunt estimări bazate pe date actuale și ipoteze de piață. Rezultatele reale pot varia. Pentru informații detaliate, contactează echipa noastră.')}
          </p>
        </motion.div>
      </PageContainer>
    </section>
  )
}

