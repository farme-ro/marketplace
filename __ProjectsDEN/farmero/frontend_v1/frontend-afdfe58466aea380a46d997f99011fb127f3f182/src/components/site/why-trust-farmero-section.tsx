/**
 * Why Trust Farmero Section Component
 * 
 * Secțiune pentru homepage: "De ce poți avea încredere în Farmero"
 */

'use client'

import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'

const trustPoints = [
  {
    icon: '🌿',
    title: 'Produse direct de la producători reali',
    description:
      'Fiecare produs vine direct de la producătorul care l-a crescut sau produs. Fără intermediari, fără distribuitori, fără lanțuri comerciale complexe.',
  },
  {
    icon: '⚖️',
    title: 'Prețuri transparente',
    description:
      'Vezi exact cât plătești și de ce. Prețul este stabilit de producător, nu de noi. Nu există marje ascunse sau taxe surpriză.',
  },
  {
    icon: '🤝',
    title: 'Sistem de donații pentru produse neridicate',
    description:
      'Când o comandă nu este ridicată, încercăm să redirecționăm produsele către centre sociale și persoane nevoiașe, nu la gunoi.',
  },
  {
    icon: '🛡️',
    title: 'Conturi verificate',
    description:
      'Respectăm atât producătorii, cât și clienții. Comisioane transparente, reguli clare, comunicare deschisă. Fără trucuri, fără ascunzături.',
  },
]

export function WhyTrustFarmeroSection() {
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
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">
            De ce poți avea încredere în Farmero
          </h2>
          <p className="text-base md:text-lg text-foreground-body max-w-2xl mx-auto leading-relaxed">
            Construim o platformă bazată pe onestitate, transparență și respect pentru toți cei implicați.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {trustPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
            >
              <div className="bg-card border border-border rounded-[32px] p-8 shadow-premium hover:shadow-premium-lg transition-all duration-300 h-full group">
                <div className="flex items-start gap-5">
                  <div className="text-4xl flex-shrink-0">{point.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      {point.title}
                    </h3>
                    <p className="text-sm md:text-base text-foreground-body leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust System Chip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-4 py-2 text-sm text-primary font-medium border border-primary/20">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Farmero Trust System
          </div>
        </motion.div>
      </PageContainer>
    </section>
  )
}
