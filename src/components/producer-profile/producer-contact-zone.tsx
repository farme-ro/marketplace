/**
 * Producer Contact & Local Zone Component
 * 
 * Hartă minimalistă + date transparență
 */

'use client'

import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent } from 'farme-ui'

interface ProducerContactZoneProps {
  regionName?: string
  deliveryMethods?: string[]
  processingDays?: string
}

export function ProducerContactZone({
  regionName = 'Argeș',
  deliveryMethods = ['Livrare la adresă', 'Easybox', 'Punct ridicare'],
  processingDays = '2-3 zile lucrătoare',
}: ProducerContactZoneProps) {
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
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            Contact & Zonă Locală
          </h2>
          <p className="text-base md:text-lg text-foreground-body max-w-2xl mx-auto leading-relaxed">
            Informații despre locație, metode de livrare și timp de procesare.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Map Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border border-border rounded-[32px] shadow-premium bg-card overflow-hidden h-full">
              <div className="relative h-64 md:h-80 bg-gradient-to-br from-primary-soft/30 to-primary-bg/20 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="text-5xl">🗺️</div>
                  <p className="text-sm text-foreground-body">Hartă interactivă</p>
                  <p className="text-xs text-muted-foreground">Zonă geografică: {regionName}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Card className="border border-border rounded-[32px] shadow-premium bg-card">
              <CardContent className="p-6 md:p-8">
                <h3 className="text-xl font-bold text-foreground mb-6">Informații Transparență</h3>
                
                <div className="space-y-6">
                  {/* Zonă Geografică */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">📍</span>
                      <h4 className="font-semibold text-foreground">Zonă Geografică</h4>
                    </div>
                    <p className="text-sm text-foreground-body ml-8">{regionName}</p>
                  </div>

                  {/* Metode Livrare */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🚚</span>
                      <h4 className="font-semibold text-foreground">Metode Livrare</h4>
                    </div>
                    <ul className="space-y-2 ml-8">
                      {deliveryMethods.map((method, index) => (
                        <li key={index} className="text-sm text-foreground-body flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {method}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Zile Procesare */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">⏱️</span>
                      <h4 className="font-semibold text-foreground">Zile Procesare</h4>
                    </div>
                    <p className="text-sm text-foreground-body ml-8">{processingDays}</p>
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

