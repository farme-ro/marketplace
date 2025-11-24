/**
 * Homepage How It Works Component
 * 
 * Secțiune simplificată "Cum funcționează" pentru homepage
 */

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'

const steps = [
  {
    number: '1',
    icon: '🍎',
    title: 'Alegi',
    description: 'Descoperi producători locali și produse autentice, cu prețuri de producător.',
  },
  {
    number: '2',
    icon: '🤝',
    title: 'Susții',
    description: 'Comanda ta susține direct producătorul local și economia comunității.',
  },
  {
    number: '3',
    icon: '📦',
    title: 'Primești',
    description: 'Produse proaspete, tradiționale, livrate direct de la producător. Dacă nu e ridicat, poate fi donat.',
  },
]

export function HomepageHowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">
            Cum funcționează
          </h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3 mb-10">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
            >
              <div className="bg-card border border-border rounded-[32px] p-8 relative shadow-premium hover:shadow-premium-lg transition-all duration-300 h-full group">
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary-soft text-primary font-bold text-sm">
                    {step.number}
                  </span>
                  <span className="text-2xl">{step.icon}</span>
                  <h3 className="font-semibold text-lg text-foreground">
                    {step.title}
                  </h3>
                </div>
                <p className="text-sm md:text-base text-foreground-body leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Link href="/how-it-works">
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-primary text-primary hover:bg-primary-bg rounded-full px-8 py-3 text-base font-medium transition-all duration-300 hover:scale-[1.02]"
            >
              Vezi procesul complet →
            </Button>
          </Link>
        </motion.div>
      </PageContainer>
    </section>
  )
}
