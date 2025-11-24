/**
 * Transparency Zone Component
 * 
 * Carduri informative despre ambalare, păstrare, livrare, certificări
 */

'use client'

import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent } from 'farme-ui'

const transparencyItems = [
  {
    icon: '📦',
    title: 'Cum ambalăm',
    description: 'Produsele sunt ambalate cu grijă, folosind materiale reciclabile și respectând standardele de siguranță alimentară.',
  },
  {
    icon: '🌡️',
    title: 'Cum păstrăm',
    description: 'Produsele sunt păstrate în condiții optime de temperatură și umiditate, garantând proaspătatea și calitatea.',
  },
  {
    icon: '🚚',
    title: 'Timp livrare',
    description: 'Livrare în 2-5 zile lucrătoare, direct de la fermă. Produsele sunt procesate și expediate rapid după comandă.',
  },
  {
    icon: '✅',
    title: 'Certificări',
    description: 'Producător verificat, cu certificări de calitate și respect pentru standardele de siguranță alimentară.',
  },
]

export function TransparencyZone() {
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
            Zonă de Transparență
          </h2>
          <p className="text-base md:text-lg text-foreground-body max-w-2xl mx-auto leading-relaxed">
            Tot ce trebuie să știi despre produsele noastre și procesul de livrare.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {transparencyItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -8 }}
            >
              <Card className="border border-border rounded-[32px] shadow-premium hover:shadow-premium-lg transition-all duration-300 bg-card h-full">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary-soft flex items-center justify-center mx-auto mb-4 text-3xl">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base text-foreground-body leading-relaxed">
                    {item.description}
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

