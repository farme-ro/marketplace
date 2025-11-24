/**
 * Market Analysis Section
 * 
 * Secțiunea cu analiza pieței și concurenței
 */

'use client'

import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent } from 'farme-ui'
import { TrendingUp, Users, ShoppingBag, Target, Award, Zap } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function MarketAnalysisSection() {
  const { t } = useI18n()

  const marketData = [
    {
      icon: ShoppingBag,
      title: t('investors.market.data.marketSize.title', 'Dimensiunea pieței'),
      value: '€15B+',
      description: t('investors.market.data.marketSize.description', 'Piața alimentară românească anual'),
      growth: '+5%',
    },
    {
      icon: TrendingUp,
      title: t('investors.market.data.marketGrowth.title', 'Creștere piață'),
      value: '5-7%',
      description: t('investors.market.data.marketGrowth.description', 'Creștere anuală estimată'),
      growth: t('investors.market.data.marketGrowth.growth', 'Sustenabilă'),
    },
    {
      icon: Users,
      title: t('investors.market.data.potentialClients.title', 'Potențial clienți'),
      value: '19M',
      description: t('investors.market.data.potentialClients.description', 'Populație România + diaspora'),
      growth: t('investors.market.data.potentialClients.growth', 'Mare'),
    },
    {
      icon: Target,
      title: t('investors.market.data.targetMarket.title', 'Piața țintă'),
      value: '30%',
      description: t('investors.market.data.targetMarket.description', 'Consumatori interesați de produse locale'),
      growth: t('investors.market.data.targetMarket.growth', 'În creștere'),
    },
  ]

  const competitiveAdvantages = [
    {
      icon: Award,
      title: t('investors.market.advantages.localFocus.title', 'Focus pe producători locali'),
      description: t('investors.market.advantages.localFocus.description', 'Singura platformă dedicată exclusiv producătorilor români, cu suport și resurse specializate'),
    },
    {
      icon: Zap,
      title: t('investors.market.advantages.socialImpact.title', 'Impact social măsurabil'),
      description: t('investors.market.advantages.socialImpact.description', 'Fiecare comandă contribuie la susținerea producătorilor locali și la dezvoltarea comunităților rurale'),
    },
    {
      icon: Users,
      title: t('investors.market.advantages.activeCommunity.title', 'Comunitate activă'),
      description: t('investors.market.advantages.activeCommunity.description', 'Relații strânse cu producătorii și clienții, feedback continuu și îmbunătățiri bazate pe nevoile reale'),
    },
    {
      icon: TrendingUp,
      title: t('investors.market.advantages.scalableModel.title', 'Model scalabil'),
      description: t('investors.market.advantages.scalableModel.description', 'Tehnologie modernă care permite creșterea rapidă fără compromisuri de calitate'),
    },
  ]

  const marketTrends = [
    t('investors.market.trends.trend1', 'Creșterea interesului pentru produse locale și de sezon'),
    t('investors.market.trends.trend2', 'Tendința către alimentație sănătoasă și sustenabilă'),
    t('investors.market.trends.trend3', 'Digitalizarea crește în sectorul alimentar'),
    t('investors.market.trends.trend4', 'Consumatorii caută transparență și traceabilitate'),
    t('investors.market.trends.trend5', 'Diaspora română caută produse autentice de acasă'),
  ]
  return (
    <section id="market-analysis" className="py-16 md:py-24 bg-background scroll-mt-20">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            {t('investors.market.title', 'Piața și concurența')}
          </h2>
          <p className="text-lg text-foreground-body max-w-2xl mx-auto">
            {t('investors.market.subtitle', 'O piață mare și în creștere, cu oportunități semnificative pentru un model de business inovator.')}
          </p>
        </motion.div>

        {/* Market Data */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-foreground mb-6 text-center">
            {t('investors.market.data.title', 'Date despre piață')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {marketData.map((data, index) => {
              const Icon = data.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="border border-border rounded-xl shadow-sm bg-card">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center mx-auto mb-3">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <p className="text-3xl font-bold text-primary mb-1">
                        {data.value}
                      </p>
                      <p className="text-sm font-medium text-foreground mb-1">
                        {data.title}
                      </p>
                      <p className="text-xs text-muted-foreground mb-2">
                        {data.description}
                      </p>
                      <p className="text-xs font-semibold text-primary">
                        {data.growth}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Competitive Advantages */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-foreground mb-6 text-center">
            {t('investors.market.advantages.title', 'Avantaje competitive')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {competitiveAdvantages.map((advantage, index) => {
              const Icon = advantage.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="border border-border rounded-xl shadow-sm bg-card h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary-soft flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-foreground mb-2">
                            {advantage.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {advantage.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Market Trends */}
        <div>
          <h3 className="text-2xl font-semibold text-foreground mb-6 text-center">
            {t('investors.market.trends.title', 'Tendințe de piață')}
          </h3>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border border-border rounded-2xl shadow-sm bg-card">
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {marketTrends.map((trend, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-primary-soft flex items-center justify-center flex-shrink-0 mt-0.5">
                        <TrendingUp className="w-3 h-3 text-primary" />
                      </div>
                      <p className="text-sm text-foreground-body flex-1">
                        {trend}
                      </p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </PageContainer>
    </section>
  )
}

