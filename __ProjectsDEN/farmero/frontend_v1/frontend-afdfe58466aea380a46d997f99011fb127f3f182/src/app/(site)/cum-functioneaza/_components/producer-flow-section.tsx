/**
 * Producer Flow Section
 * 
 * Secțiunea cu flow-ul pentru producători
 */

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'
import { Check } from 'lucide-react'

const producerPoints = [
  'Primești comenzi direct din platformă.',
  'Poți activa/dezactiva produsele când nu mai ai stoc.',
  'Vezi clar comisionul, încasările și comenzile.',
]

export function ProducerFlowSection() {
  return (
    <section className="py-10 sm:py-16 lg:py-20 bg-background">
      <PageContainer>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
              Cum funcționează pentru producători
            </h2>
            <ul className="space-y-4">
              {producerPoints.map((point, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-primary-soft flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-base text-foreground-body leading-relaxed">
                    {point}
                  </span>
                </motion.li>
              ))}
            </ul>
            <div className="pt-4">
              <Link
                href="/portal-producatori/register"
                className="text-sm font-medium text-primary hover:text-primary-hover transition-colors inline-flex items-center gap-1"
              >
                Vrei să vinzi pe farme.ro? → Înregistrare producător
              </Link>
            </div>
          </motion.div>

          {/* Right Column - Dashboard Preview Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border border-border rounded-2xl shadow-premium-lg bg-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Dashboard producător
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground-body">Comenzi active</span>
                      <span className="font-semibold text-foreground">12</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div className="h-2 w-3/4 rounded-full bg-primary" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground-body">Vânzări luna curentă</span>
                      <span className="font-semibold text-foreground">8.500 lei</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div className="h-2 w-1/2 rounded-full bg-primary" />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground italic">
                      Exemplu de interfață. Datele reale vor fi afișate în contul tău.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </PageContainer>
    </section>
  )
}

