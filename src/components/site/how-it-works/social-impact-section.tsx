/**
 * Social Impact Section Component
 * 
 * Secțiunea "Impactul tău social"
 */

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'

const impactCards = [
  {
    icon: '🌾',
    title: 'Susții producători locali',
    description: 'Mai mulți bani rămân în sat / județ, nu doar în lanțuri mari de magazine.',
  },
  {
    icon: '🌱',
    title: 'Reduci risipa alimentară',
    description:
      'Prin sistemul de comenzi neridicate → donații acolo unde se poate, evităm ca mâncarea bună să ajungă la gunoi.',
  },
  {
    icon: '🏠',
    title: 'Îi ajuți pe cei de acasă (diaspora)',
    description:
      'Poți comanda pentru părinți / bunici rămași în țară, cu produse mai sănătoase și mai aproape de ce își doresc ei.',
  },
]

export function SocialImpactSection() {
  return (
    <section className="py-12 md:py-16 bg-muted">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            Impactul tău când comanzi prin Farmero
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Nu e &quot;doar o comandă online&quot;. De fiecare dată când cumperi aici, ajuți pe cineva concret: un producător, familia lui, și uneori, prin donații, oameni care altfel nu ar avea acces la astfel de produse.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {impactCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="border-2 border-border/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full bg-card">
                <CardContent className="p-6 text-center">
                  <div className="text-5xl mb-4">{card.icon}</div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </PageContainer>
    </section>
  )
}

