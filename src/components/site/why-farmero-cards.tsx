/**
 * Why Farmero Cards Component
 * 
 * 3 carduri pentru homepage: Preț de producător, Impact social, Produse verificate
 */

'use client'

import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'

const whyCards = [
  {
    icon: '⚖️',
    title: 'Prețuri de producător',
    description: 'Plătești prețul stabilit de producător, fără adaosuri artificiale.',
  },
  {
    icon: '🌿',
    title: 'Impact social real',
    description: 'Produsele neridicate sunt redirecționate către donații sociale, nu la gunoi. Fiecare comandă contează.',
  },
  {
    icon: '🛡️',
    title: 'Produse verificate',
    description: 'Toți producătorii sunt verificați și aprobați. Produse autentice, tradiționale, de calitate.',
  },
]

export function WhyFarmeroCards() {
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
            De ce Farme.ro?
          </h2>
          <p className="text-base md:text-lg text-foreground-body max-w-2xl mx-auto leading-relaxed">
            Prețuri de producător, impact social real și produse verificate de la ferme și producători din România.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {whyCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
            >
              <div className="bg-card border border-border rounded-[32px] p-8 shadow-premium hover:shadow-premium-lg transition-all duration-300 h-full group">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-soft mb-4 group-hover:bg-primary-bg transition-colors duration-300">
                  <span className="text-2xl">{card.icon}</span>
                </div>
                <h3 className="font-semibold text-lg mb-3 text-foreground">
                  {card.title}
                </h3>
                <p className="text-sm md:text-base text-foreground-body leading-relaxed">
                  {card.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </PageContainer>
    </section>
  )
}
