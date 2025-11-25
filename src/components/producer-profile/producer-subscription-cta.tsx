/**
 * Producer Subscription CTA Component
 * 
 * Mini secțiune pentru abonament producător
 */

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent } from 'farme-ui'

export function ProducerSubscriptionCTA() {
  return (
    <section className="py-16 md:py-24 bg-primary-bg/30">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border border-border rounded-[32px] shadow-premium-lg bg-gradient-to-br from-primary-bg/50 to-primary-soft/30">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-4">
                Primește produse regulate de la acest producător
              </h2>
              <p className="text-base md:text-lg text-foreground-body mb-8 leading-relaxed max-w-2xl mx-auto">
                Abonează-te și primești produse proaspete periodic, direct de la fermă. Convenabil, sigur și sustenabil.
              </p>

              {/* Plan Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {['Lunar', 'Bi-lunar', 'Trimestrial'].map((plan, index) => (
                  <motion.div
                    key={plan}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="p-4 bg-card rounded-2xl border border-border">
                      <p className="text-sm font-semibold text-foreground mb-1">{plan}</p>
                      <p className="text-xs text-foreground-body">Livrare regulată</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Link href="/producer-subscription">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-full px-8 py-3 text-base font-semibold shadow-premium"
                >
                  ➡️ Vezi planuri disponibile
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </PageContainer>
    </section>
  )
}

