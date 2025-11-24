/**
 * Non-Pickup Flow Section Component
 * 
 * Secțiunea "Ce se întâmplă cu comenzile neridicate"
 */

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'

const timelineSteps = [
  {
    number: '1',
    title: 'Curierul încearcă să livreze / notifică clientul',
    description:
      'Clientul primește notificări și are un timp clar în care poate ridica produsele (în special pentru produse perisabile, acest timp este limitat).',
  },
  {
    number: '2',
    title: 'Timp limitat de ridicare (în special pentru produse perisabile)',
    description:
      'După acest timp, considerăm comanda neridicată. Nu vrem carne stricată în pachetomat și nici recenzii negative pe nedrept.',
  },
  {
    number: '3',
    title: 'Redirecționare (acolo unde este posibil)',
    description:
      'În loc să returnăm produsele la producător sau să le aruncăm, încercăm să le donăm: centre sociale, cantine, persoane nevoiașe – în funcție de parteneriatele locale și de tipul produselor.',
  },
]

export function NonPickupFlowSection() {
  return (
    <section className="py-12 md:py-16 bg-background">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            Ce se întâmplă dacă o comandă nu este ridicată?
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            Se întâmplă. Oamenii uită, sunt plecați, intervin probleme.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            Important este ca producătorul să nu rămână doar cu pierdere, iar mâncarea să nu fie aruncată.
          </p>
        </motion.div>

        <div className="space-y-6 mb-8">
          {timelineSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="border-2 border-border/60 rounded-2xl shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 border-2 border-primary/20 font-bold text-lg">
                      {step.number}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {step.description}
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
        >
          <Card className="border-2 border-border rounded-xl bg-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Politica exactă</strong> poate varia în funcție de tipul produselor, de partenerii logistici și de legislația locală. Îți vom explica clar la checkout ce se întâmplă cu comanda ta.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </PageContainer>
    </section>
  )
}

