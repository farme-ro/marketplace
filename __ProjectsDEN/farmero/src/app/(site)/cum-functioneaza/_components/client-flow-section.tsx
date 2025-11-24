/**
 * Client Flow Section
 * 
 * Secțiunea cu pașii pentru clienți
 */

'use client'

import { motion } from 'framer-motion'
import { ShoppingBasket, MapPin, Package, HeartHandshake } from 'lucide-react'
import { Card, CardContent } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'

const steps = [
  {
    icon: ShoppingBasket,
    title: 'Alegi producătorii',
    description: 'Cauți după zonă, tip de produs sau preferințe (bio, tradițional, de sezon).',
  },
  {
    icon: Package,
    title: 'Adaugi în coș',
    description: 'Produse de la unul sau mai mulți producători, toate într-o singură comandă.',
  },
  {
    icon: MapPin,
    title: 'Alegi livrarea',
    description: 'Livrare standard sau livrare la easybox/pachetomat (unde este disponibil).',
  },
  {
    icon: HeartHandshake,
    title: 'Gata – ai comandat local',
    description: 'Producătorul pregătește comanda și o trimite. Tu primești notificări pas cu pas.',
  },
]

export function ClientFlowSection() {
  return (
    <section className="py-10 sm:py-16 lg:py-20 bg-muted/30">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-4">
            Cum comanzi în 4 pași simpli
          </h2>
          <p className="text-base text-foreground-body max-w-2xl mx-auto leading-relaxed">
            Proces simplu, transparent și eficient
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -8 }}
              >
                <Card className="border border-border rounded-2xl shadow-premium hover:shadow-premium-lg transition-all duration-300 bg-card h-full">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-soft mb-4">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-sm text-foreground-body leading-relaxed">
                      {step.description}
                    </p>
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

