/**
 * Producers Problems Section
 * 
 * Secțiunea cu problemele reale ale producătorilor
 */

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'
import { TrendingDown, Users, Clock, DollarSign } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function ProducersProblemsSection() {
  const { t } = useI18n()

  const problems = [
    {
      icon: TrendingDown,
      title: t('producers.problems.problem1.title', 'Vânzări imprevizibile'),
      description: t('producers.problems.problem1.description', 'Nu știi când și cât vei vinde. Dependența de piețe și evenimente te face vulnerabil.'),
    },
    {
      icon: Users,
      title: t('producers.problems.problem2.title', 'Clienți neserioși'),
      description: t('producers.problems.problem2.description', 'Comenzi anulate, neprezentări, negocieri interminabile. Timp și energie irosite.'),
    },
    {
      icon: Clock,
      title: t('producers.problems.problem3.title', 'Timp pierdut pe social media'),
      description: t('producers.problems.problem3.description', 'Trebuie să fii prezent constant, să creezi conținut, să răspunzi la mesaje. Nu ai timp pentru producție.'),
    },
    {
      icon: DollarSign,
      title: t('producers.problems.problem4.title', 'Intermediari care îți micșorează profitul'),
      description: t('producers.problems.problem4.description', 'Fiecare intermediar ia o parte din profitul tău. La final, rămâi cu prețuri mici și marje mici.'),
    },
  ]
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-4">
            {t('producers.problems.title', 'Știm prin ce treci')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {problems.map((problem, index) => {
            const Icon = problem.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="border border-border rounded-2xl shadow-premium hover:shadow-premium-lg transition-all duration-300 bg-card h-full">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
                      <Icon className="w-8 h-8 text-destructive" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      {problem.title}
                    </h3>
                    <p className="text-sm text-foreground-body leading-relaxed">
                      {problem.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center text-base text-foreground-body max-w-2xl mx-auto leading-relaxed"
        >
          {t('producers.problems.footer', 'farme.ro elimină aceste probleme și îți oferă un sistem stabil și predictibil.')}
        </motion.p>
      </PageContainer>
    </section>
  )
}

