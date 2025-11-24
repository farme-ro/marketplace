/**
 * Social Impact Section
 * 
 * Secțiunea cu impactul social
 */

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'
import { Heart, Leaf, Users, MapPin } from 'lucide-react'

const stats = [
  {
    icon: Heart,
    label: 'Porții de mâncare donate',
    value: 'În curând',
    badge: 'În curând metrice reale',
  },
  {
    icon: Leaf,
    label: 'Kg de mâncare salvate de la risipă',
    value: 'În curând',
    badge: 'În curând metrice reale',
  },
  {
    icon: Users,
    label: 'Producători susținuți',
    value: 'În curând',
    badge: 'În curând metrice reale',
  },
  {
    icon: MapPin,
    label: 'Localități acoperite',
    value: 'În curând',
    badge: 'În curând metrice reale',
  },
]

export function SocialImpactSection() {
  return (
    <section className="py-10 sm:py-16 lg:py-20 bg-background">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-4">
            Impactul tău social
          </h2>
          <p className="text-base text-foreground-body max-w-2xl mx-auto leading-relaxed">
            farme.ro este gândit ca un loc corect pentru toată lumea: clienți, producători și comunitate. Fiecare comandă lasă o urmă bună.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
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
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-soft mb-4">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                      {stat.value}
                    </p>
                    <p className="text-sm text-foreground-body mb-3 leading-relaxed">
                      {stat.label}
                    </p>
                    <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary-soft/30 px-2.5 py-0.5 text-[10px] font-medium text-primary">
                      {stat.badge}
                    </span>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </PageContainer>
    </section>
  )
}

