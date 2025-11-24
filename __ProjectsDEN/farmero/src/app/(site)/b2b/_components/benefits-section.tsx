/**
 * Benefits Section
 * 
 * Secțiunea cu beneficii pentru B2B
 */

'use client'

import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent } from 'farme-ui'
import { ShoppingCart, Users, Truck, DollarSign, Package, Clock } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function BusinessBenefitsSection() {
  const { t } = useI18n()
  
  const benefits = [
    {
      icon: ShoppingCart,
      title: t('b2b.benefits.carts.title', 'Coșuri pentru angajați'),
      description: t('b2b.benefits.carts.description', 'Creează coșuri personalizate pentru fiecare angajat sau departament'),
      id: undefined,
    },
    {
      icon: Users,
      title: t('b2b.benefits.management.title', 'Gestionare centralizată'),
      description: t('b2b.benefits.management.description', 'Controlează toate comenzile și cheltuielile într-un singur loc'),
      id: 'analytics',
    },
    {
      icon: Truck,
      title: t('b2b.benefits.delivery.title', 'Livrare inclusă'),
      description: t('b2b.benefits.delivery.description', 'Transport gratuit pentru comenzile peste o anumită valoare'),
      id: undefined,
    },
    {
      icon: DollarSign,
      title: t('b2b.benefits.pricing.title', 'Prețuri speciale B2B'),
      description: t('b2b.benefits.pricing.description', 'Beneficiază de reduceri pentru volume mari și comenzi recurente'),
      id: 'bulk-orders',
    },
    {
      icon: Package,
      title: t('b2b.benefits.fresh.title', 'Produse proaspete'),
      description: t('b2b.benefits.fresh.description', 'Acces direct la producători locali cu produse de calitate superioară'),
      id: undefined,
    },
    {
      icon: Clock,
      title: t('b2b.benefits.scheduled.title', 'Livrări programate'),
      description: t('b2b.benefits.scheduled.description', 'Planifică livrările în avans pentru o organizare perfectă'),
      id: 'scheduled-delivery',
    },
  ]
  return (
    <section id="beneficii" className="py-16 md:py-24 bg-muted/30 scroll-mt-20">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            {t('b2b.benefits.title', 'De ce să alegi farme.ro pentru afacerea ta?')}
          </h2>
          <p className="text-lg text-foreground-body max-w-2xl mx-auto">
            {t('b2b.benefits.subtitle', 'Soluții complete pentru restaurante, hoteluri și alte afaceri care au nevoie de produse proaspete')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                id={benefit.id}
                className={benefit.id ? 'scroll-mt-20' : ''}
              >
                <Card className="border border-border rounded-xl shadow-sm bg-card h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </PageContainer>
    </section>
  )
}

