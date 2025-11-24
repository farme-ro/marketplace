/**
 * Producer Impact Visual Component
 * 
 * Diagramă simplă: Client → Fermă → Comunitate
 */

'use client'

import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent } from 'farme-ui'

export function ProducerImpactVisual() {
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
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            Impact Social
          </h2>
          <p className="text-base md:text-lg text-foreground-body max-w-2xl mx-auto leading-relaxed">
            Fiecare comandă susține direct această fermă.
          </p>
        </motion.div>

        <Card className="border border-border rounded-[32px] shadow-premium-lg bg-card">
          <CardContent className="p-8 md:p-12">
            {/* Flow Diagram */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mb-8">
              {/* Client */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                <div className="w-24 h-24 rounded-full bg-primary-soft flex items-center justify-center mb-4 text-4xl">
                  👤
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Client</h3>
                <p className="text-sm text-foreground-body">Comandă produse</p>
              </motion.div>

              {/* Arrow */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="hidden md:block"
              >
                <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="md:hidden"
              >
                <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </motion.div>

              {/* Fermă */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="text-center"
              >
                <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mb-4 text-4xl">
                  🧑‍🌾
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Fermă</h3>
                <p className="text-sm text-foreground-body">Primește suport direct</p>
              </motion.div>

              {/* Arrow */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="hidden md:block"
              >
                <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="md:hidden"
              >
                <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </motion.div>

              {/* Comunitate */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="text-center"
              >
                <div className="w-24 h-24 rounded-full bg-primary-soft flex items-center justify-center mb-4 text-4xl">
                  🌍
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Comunitate</h3>
                <p className="text-sm text-foreground-body">Economie locală susținută</p>
              </motion.div>
            </div>

            {/* Impact Message */}
            <div className="text-center pt-8 border-t border-border">
              <p className="text-base md:text-lg text-foreground-body leading-relaxed max-w-2xl mx-auto">
                Când cumperi de la această fermă, susții direct economia locală și contribui la creșterea comunității.
                <br />
                <strong className="text-foreground">Fiecare comandă contează.</strong>
              </p>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    </section>
  )
}

