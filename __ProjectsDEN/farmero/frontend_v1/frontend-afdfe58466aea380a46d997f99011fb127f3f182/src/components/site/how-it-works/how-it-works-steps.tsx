/**
 * How It Works Steps Component
 * 
 * Secțiunea "Pas cu pas – de la producător la tine"
 */

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'

const steps = [
  {
    icon: '🍎',
    title: 'Tu alegi produsele',
    description:
      'Cauți producători din țara ta, alegi produse de sezon, vezi detalii clare despre cine le produce.',
  },
  {
    icon: '📦',
    title: 'Producătorul pregătește comanda',
    description:
      'Producătorul primește comanda, își organizează producția și pregătește cutiile doar cu ce are efectiv disponibil.',
  },
  {
    icon: '🚚',
    title: 'Livrare sau pachetomat / easybox',
    description:
      'Comanda ajunge la tine acasă sau într-un punct de ridicare (easybox / pachetomat) ales, astfel încât să nu depindem toți de aceeași oră exactă.',
  },
  {
    icon: '🤝',
    title: 'Dacă nu e ridicată → nu aruncăm, ci donăm (acolo unde este posibil)',
    description:
      'În loc ca produsele să se întoarcă stricate, încercăm să redirecționăm aceste comenzi către centre sociale / cantine / persoane nevoiașe, în funcție de legislație și parteneriatele locale.',
  },
]

export function HowItWorksSteps() {
  return (
    <section className="py-12 md:py-16 bg-background">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            Pas cu pas – de la producător la tine
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="border-2 border-border/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                <CardContent className="p-6 text-center">
                  <div className="text-5xl mb-4">{step.icon}</div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
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

