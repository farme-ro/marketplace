/**
 * Unpicked Orders Donation Section
 * 
 * Secțiunea care explică mecanismul colete neridicate → donație
 */

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'
import { Heart, Package, Users } from 'lucide-react'

const points = [
  {
    icon: Package,
    text: 'Producătorul nu rămâne cu marfa stricată.',
  },
  {
    icon: Heart,
    text: 'Tu nu ești "pedepsit", dar îți reamintim că altcineva va beneficia de comanda ta.',
  },
  {
    icon: Users,
    text: 'Platforma urmărește valoarea donată pentru a măsura impactul social.',
  },
]

export function UnpickedOrdersDonationSection() {
  return (
    <section className="py-10 sm:py-16 lg:py-20 bg-primary-soft/20">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-4">
            Ce se întâmplă dacă nu ridici comanda?
          </h2>
        </motion.div>

        <Card className="border border-border rounded-2xl shadow-premium-lg bg-card">
          <CardContent className="p-6 md:p-8 lg:p-12">
            <div className="space-y-6">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-base text-foreground-body leading-relaxed"
              >
                Se întâmplă. Viața e aglomerată, uneori nu ajungi la timp la curier sau la easybox.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-base text-foreground-body leading-relaxed"
              >
                Ca să nu aruncăm mâncarea, dacă un colet nu este ridicat în intervalul de siguranță
                stabilit, produsele merg spre donație: centre de asistență, cantine sociale, persoane vulnerabile.
              </motion.p>

              <div className="grid md:grid-cols-3 gap-4 pt-6">
                {points.map((point, index) => {
                  const Icon = point.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <p className="text-sm text-foreground-body leading-relaxed pt-1.5">
                        {point.text}
                      </p>
                    </motion.div>
                  )
                })}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="pt-6 border-t border-border"
              >
                <p className="text-base text-foreground-body italic text-center leading-relaxed">
                  Dacă uiți să ridici comanda, practic ai făcut o faptă bună, doar că… un pic fără să vrei. 😉
                </p>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    </section>
  )
}

