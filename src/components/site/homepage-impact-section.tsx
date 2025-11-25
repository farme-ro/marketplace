/**
 * Homepage Impact Section Component
 * 
 * Secțiune pentru homepage: "Comanda ta face mai mult decât o achiziție"
 */

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'

const impactPoints = [
  {
    icon: '🌾',
    title: 'Susții producători reali',
    description: 'Bani rămân în comunitate, nu în lanțuri comerciale',
  },
  {
    icon: '🌱',
    title: 'Reduci risipa',
    description: 'Produsele neridicate sunt donate, nu aruncate',
  },
  {
    icon: '🤝',
    title: 'Comerț echitabil',
    description: 'Prețuri corecte, comisioane transparente',
  },
]

export function HomepageImpactSection() {
  return (
    <section className="py-16 md:py-24 bg-primary-bg/30">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">
            Comanda ta face mai mult decât o achiziție
          </h2>
          <p className="text-base md:text-lg text-foreground-body max-w-2xl mx-auto leading-relaxed">
            Comanda ta ajută producători locali și reduce risipa alimentară. Dacă un colet nu este ridicat la timp, produsele merg către donații, nu la gunoi.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {impactPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-soft mb-4">
                <span className="text-3xl">{point.icon}</span>
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">
                {point.title}
              </h3>
              <p className="text-sm md:text-base text-foreground-body leading-relaxed">
                {point.description}
              </p>
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
          <Link href="/how-it-works#social-impact">
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-primary text-primary hover:bg-primary-bg rounded-full px-8 py-3 text-base font-medium transition-all duration-300 hover:scale-[1.02]"
            >
              Vezi cum funcționează
            </Button>
          </Link>
        </motion.div>
      </PageContainer>
    </section>
  )
}
