/**
 * Strategy Section
 * 
 * Secțiunea cu strategia și planurile de expansiune
 */

'use client'

import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent } from 'farme-ui'
import { MapPin, Globe, TrendingUp, Target, Users, ShoppingBag } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function StrategySection() {
  const { t } = useI18n()

  const strategyPhases = [
    {
      phase: t('investors.strategy.phases.phase1.title', 'Faza 1: Consolidare (2024)'),
      icon: MapPin,
      goals: [
        t('investors.strategy.phases.phase1.goal1', 'Expansiune națională în toate regiunile'),
        t('investors.strategy.phases.phase1.goal2', '500+ producători activi'),
        t('investors.strategy.phases.phase1.goal3', 'Lansare servicii B2B'),
        t('investors.strategy.phases.phase1.goal4', 'Optimizare tehnologie și logistică'),
      ],
      timeline: 'Q1-Q4 2024',
    },
    {
      phase: t('investors.strategy.phases.phase2.title', 'Faza 2: Expansiune (2025)'),
      icon: TrendingUp,
      goals: [
        t('investors.strategy.phases.phase2.goal1', '1,500+ producători parteneri'),
        t('investors.strategy.phases.phase2.goal2', 'Expansiune în diaspora română'),
        t('investors.strategy.phases.phase2.goal3', 'Parteneriate cu restaurante mari'),
        t('investors.strategy.phases.phase2.goal4', 'Lansare aplicație mobilă'),
      ],
      timeline: 'Q1-Q4 2025',
    },
    {
      phase: t('investors.strategy.phases.phase3.title', 'Faza 3: Internaționalizare (2026)'),
      icon: Globe,
      goals: [
        t('investors.strategy.phases.phase3.goal1', 'Intrare pe piețe europene (Ungaria, Bulgaria)'),
        t('investors.strategy.phases.phase3.goal2', '5,000+ producători'),
        t('investors.strategy.phases.phase3.goal3', 'Servicii pentru importatori'),
        t('investors.strategy.phases.phase3.goal4', 'Brand recunoscut regional'),
      ],
      timeline: 'Q1-Q4 2026',
    },
    {
      phase: t('investors.strategy.phases.phase4.title', 'Faza 4: Consolidare & Profitabilitate (2027+)'),
      icon: Target,
      goals: [
        t('investors.strategy.phases.phase4.goal1', 'Profitabilitate sustenabilă'),
        t('investors.strategy.phases.phase4.goal2', '10,000+ producători'),
        t('investors.strategy.phases.phase4.goal3', 'Leader de piață în regiune'),
        t('investors.strategy.phases.phase4.goal4', 'Oportunități de exit strategic'),
      ],
      timeline: '2027+',
    },
  ]

  const keyInitiatives = [
    {
      icon: Users,
      title: t('investors.strategy.initiatives.recruitment.title', 'Recrutare producători'),
      description: t('investors.strategy.initiatives.recruitment.description', 'Programe dedicate pentru atragerea producătorilor locali de calitate'),
    },
    {
      icon: ShoppingBag,
      title: t('investors.strategy.initiatives.marketing.title', 'Marketing & Branding'),
      description: t('investors.strategy.initiatives.marketing.description', 'Campanii de conștientizare și construirea brandului farme.ro'),
    },
    {
      icon: TrendingUp,
      title: t('investors.strategy.initiatives.technology.title', 'Tehnologie & Inovație'),
      description: t('investors.strategy.initiatives.technology.description', 'Dezvoltare continuă a platformei și introducerea AI pentru recomandări'),
    },
    {
      icon: Globe,
      title: t('investors.strategy.initiatives.partnerships.title', 'Parteneriate strategice'),
      description: t('investors.strategy.initiatives.partnerships.description', 'Colaborări cu organizații agricole, restaurante și distribuitori'),
    },
  ]
  return (
    <section id="strategy" className="py-16 md:py-24 bg-muted/30 scroll-mt-20">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            {t('investors.strategy.title', 'Strategie și planuri de expansiune')}
          </h2>
          <p className="text-lg text-foreground-body max-w-2xl mx-auto">
            {t('investors.strategy.subtitle', 'O viziune clară pentru creșterea sustenabilă și transformarea farme.ro într-un leader de piață.')}
          </p>
        </motion.div>

        {/* Strategy Phases */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-foreground mb-8 text-center">
            {t('investors.strategy.phases.title', 'Faze de dezvoltare')}
          </h3>
          <div className="space-y-6">
            {strategyPhases.map((phase, index) => {
              const Icon = phase.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="border border-border rounded-2xl shadow-sm bg-card">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-xl font-semibold text-foreground">
                              {phase.phase}
                            </h4>
                            <span className="text-sm font-medium text-muted-foreground">
                              {phase.timeline}
                            </span>
                          </div>
                          <ul className="space-y-2">
                            {phase.goals.map((goal, goalIndex) => (
                              <li key={goalIndex} className="flex items-start gap-2 text-sm text-foreground-body">
                                <span className="text-primary mt-1">•</span>
                                <span>{goal}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Key Initiatives */}
        <div>
          <h3 className="text-2xl font-semibold text-foreground mb-6 text-center">
            {t('investors.strategy.initiatives.title', 'Inițiative cheie')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {keyInitiatives.map((initiative, index) => {
              const Icon = initiative.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
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
                            {initiative.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {initiative.description}
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
      </PageContainer>
    </section>
  )
}

