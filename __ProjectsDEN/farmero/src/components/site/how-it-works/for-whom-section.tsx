/**
 * For Whom Section Component
 * 
 * Secțiunea "Pentru cine este Farmero?"
 */

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'

const targetGroups = [
  {
    icon: '👥',
    title: 'Pentru clienți individuali',
    description: 'Oameni care vor produse locale, de sezon, cu gust autentic.',
  },
  {
    icon: '🌍',
    title: 'Pentru diaspora',
    description:
      'Români de peste hotare care vor să trimită acasă ceva mai bun decât un pachet cu biscuiți din aeroport.',
  },
  {
    icon: '🏢',
    title: 'Pentru business-uri',
    description:
      'Restaurante, cafenele, mici magazine care vor să cumpere direct de la producători.',
  },
]

export function ForWhomSection() {
  return (
    <section className="py-12 md:py-16 bg-muted">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            Pentru cine este Farmero?
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {targetGroups.map((group, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="border-2 border-border/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full bg-card">
                <CardContent className="p-6 text-center">
                  <div className="text-5xl mb-4">{group.icon}</div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {group.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {group.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </PageContainer>
    </section>
  )
}

