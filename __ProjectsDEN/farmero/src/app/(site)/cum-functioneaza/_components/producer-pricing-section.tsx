/**
 * Producer Pricing Section
 * 
 * Secțiunea "Prețuri de producător"
 */

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button, Card, CardContent } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'
import { Check } from 'lucide-react'

const pricingPoints = [
  'Transparent pentru producători',
  'Corect pentru clienți',
  'Sustenabil pentru platformă',
]

export function ProducerPricingSection() {
  return (
    <section className="py-10 sm:py-16 lg:py-20 bg-muted/30">
      <PageContainer>
        <Card className="border border-border rounded-2xl shadow-premium-lg bg-card">
          <CardContent className="p-6 md:p-8 lg:p-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
                  Prețuri de producător, nu adaos de supermarket
                </h2>
                <p className="text-base text-foreground-body max-w-3xl mx-auto leading-relaxed">
                  Pe farme.ro plătești direct producătorului. Platforma ia un comision mic, transparent, pentru a acoperi tehnologia și dezvoltarea. Nu adăugăm adaosuri ascunse.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                {pricingPoints.map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                    className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft/30 px-4 py-2"
                  >
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">{point}</span>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
                <Link href="/produse">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-full px-8 py-4 text-base font-semibold shadow-premium"
                  >
                    Vezi produsele
                  </Button>
                </Link>
                <Link href="/pentru-producatori">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-primary text-primary hover:bg-primary-bg rounded-full px-8 py-4 text-base font-semibold"
                  >
                    Vezi cum e pentru producători
                  </Button>
                </Link>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </PageContainer>
    </section>
  )
}

