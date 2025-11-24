/**
 * Producer Pricing Section Component
 * 
 * Secțiune pentru homepage care explică prețurile de producător
 */

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { PageContainer } from '@/components/layout/page-container'

const benefits = [
  {
    icon: '⚖️',
    title: 'Preț stabilit de producător',
    description: 'Producătorul decide cât valorează munca lui, nu un lanț comercial.',
  },
  {
    icon: '🌿',
    title: 'Fără intermediari care dublează costul',
    description: 'Nu există distribuitori sau supermarket-uri care umflă prețurile artificial.',
  },
  {
    icon: '🤝',
    title: 'Plătești corect = producătorul câștigă corect',
    description: 'Noi câștigăm din comision transparent, nu din umflarea produselor.',
  },
]

export function ProducerPricingSection() {
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
            Prețuri de producător. Fără adaosuri artificiale.
          </h2>
          <p className="text-base md:text-lg text-foreground-body max-w-2xl mx-auto leading-relaxed">
            Prețul pe care îl vezi este stabilit direct de producător, nu umflat de lanțuri comerciale.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
            >
              <div className="bg-card border border-border rounded-[32px] p-8 shadow-premium hover:shadow-premium-lg transition-all duration-300 h-full group">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {benefit.title}
                </h3>
                <p className="text-sm md:text-base text-foreground-body leading-relaxed">
                  {benefit.description}
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
          <div className="bg-card border border-border rounded-[32px] p-8 md:p-12 shadow-premium">
            <p className="text-base md:text-lg text-foreground-body leading-relaxed mb-4">
              <strong className="text-foreground font-semibold">Farmero nu impune marje artificiale.</strong> Producătorul decide cât valorează munca lui. Noi câștigăm din comision transparent, nu din umflarea produselor.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              farmero își ia comision doar la vânzare, pentru a susține platforma.
            </p>
            <Link
              href="/how-it-works#pricing-policy"
              className="inline-block text-sm md:text-base text-primary hover:underline font-medium transition-all duration-300 hover:scale-105"
            >
              Află mai multe despre politica noastră de prețuri →
            </Link>
          </div>
        </motion.div>
      </PageContainer>
    </section>
  )
}
