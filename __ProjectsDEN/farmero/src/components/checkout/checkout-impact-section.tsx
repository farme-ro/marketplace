/**
 * Checkout Impact Section Component
 * 
 * Secțiunea "Impactul tău în cifre"
 */

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'
import { useI18n } from '@/lib/i18n/context'

interface ImpactStat {
  label: string
  value: string | number
  icon: string
}

interface CheckoutImpactSectionProps {
  stats?: ImpactStat[]
}

export function CheckoutImpactSection({ stats }: CheckoutImpactSectionProps) {
  const { t } = useI18n()
  
  const defaultStats: ImpactStat[] = [
    {
      label: t('checkout.impactSection.supportProducers', 'Susții producători locali'),
      value: '3',
      icon: '🌾',
    },
    {
      label: t('checkout.impactSection.redirectWaste', 'Redirecționezi risipa alimentară'),
      value: '100%',
      icon: '♻️',
    },
    {
      label: t('checkout.impactSection.contributeCommunity', 'Contribui la sprijin comunitar'),
      value: '✓',
      icon: '🤝',
    },
  ]
  
  const displayStats = stats || defaultStats
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mt-8"
    >
      <Card className="border-2 border-border/60 rounded-2xl shadow-lg bg-gradient-to-br from-primary/5 via-amber-500/5 to-orange-500/5">
        <CardContent className="p-6 md:p-8">
          <h3 className="text-xl font-bold text-foreground mb-6 text-center">
            {t('checkout.impactSection.title', 'Impactul tău în cifre')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

