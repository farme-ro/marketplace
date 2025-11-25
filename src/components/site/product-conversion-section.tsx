/**
 * Product Conversion Section Component
 * 
 * Secțiune pentru paginile de produs: "Ce înseamnă să comanzi de la Farmero?"
 */

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent } from 'farme-ui'
import { Button } from 'farme-ui'
import { TrustStack } from '@/components/trust/trust-stack'

const conversionPoints = [
  {
    icon: '🛡️',
    title: 'Producător real, verificat',
    description: 'Fiecare producător este verificat și aprobat de echipa Farmero.',
  },
  {
    icon: '🌾',
    title: 'Clientul susține economia locală',
    description: 'Bani rămân în comunitate, nu în lanțuri comerciale mari.',
  },
  {
    icon: '🤝',
    title: 'Produsele neridicate sunt donate',
    description: 'În loc să ajungă la gunoi, produsele sunt redirecționate către centre sociale.',
  },
  {
    icon: '⚖️',
    title: 'Comerț echitabil',
    description: 'Prețuri corecte, comisioane transparente, respect pentru toți.',
  },
]

export function ProductConversionSection() {
  return (
    <section className="py-8 md:py-12 bg-muted">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-4">
            Ce înseamnă să comanzi de la Farmero?
          </h3>
          <div className="w-24 h-1 bg-gradient-to-r from-primary via-primary to-primary rounded-full mb-6" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {conversionPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="border-2 border-border/60 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 h-full bg-card">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl flex-shrink-0">{point.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1 text-sm md:text-base">
                        {point.title}
                      </h4>
                      <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                        {point.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <Card className="border-2 border-emerald-200 dark:border-emerald-800/50 rounded-xl shadow-sm bg-gradient-to-br from-emerald-50/50 to-green-50/30 dark:from-emerald-950/20 dark:to-green-950/20">
            <CardContent className="p-5 md:p-6">
              <p className="text-base text-muted-foreground leading-relaxed mb-4">
                <strong className="text-foreground">Comanda ta susține un producător local și reduce risipa alimentară.</strong>
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <TrustStack
                    badges={['verified-producers', 'social-impact', 'producer-prices']}
                    variant="compact"
                    layout="horizontal"
                  />
                </div>
                <Link href="/how-it-works#social-impact">
                  <Button variant="outline" size="sm">
                    Vezi impactul comenzii tale
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

