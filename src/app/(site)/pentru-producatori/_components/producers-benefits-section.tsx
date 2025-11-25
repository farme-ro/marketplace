/**
 * Producers Benefits Section
 * 
 * Secțiunea cu beneficiile farme.ro pentru producători
 */

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'
import {
  ShoppingCart,
  Package,
  Power,
  CreditCard,
  Heart,
  TrendingUp,
  MapPin,
} from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function ProducersBenefitsSection() {
  const { t } = useI18n()

  const benefits = [
    {
      icon: ShoppingCart,
      title: t('producers.benefits.benefit1.title', 'Comenzi centralizate'),
      description: t('producers.benefits.benefit1.description', 'Toate comenzile într-un singur loc. Nu mai pierzi timp cu telefoane și mesaje pe mai multe platforme.'),
    },
    {
      icon: Package,
      title: t('producers.benefits.benefit2.title', 'Control total asupra stocului'),
      description: t('producers.benefits.benefit2.description', 'Poți activa sau dezactiva produsele instant. Când nu mai ai stoc, clienții nu pot comanda.'),
    },
    {
      icon: Power,
      title: t('producers.benefits.benefit3.title', 'Poți activa/dezactiva produsele instant'),
      description: t('producers.benefits.benefit3.description', 'Fără așteptări, fără apeluri. Un click și produsul tău apare sau dispare din listă.'),
    },
    {
      icon: CreditCard,
      title: t('producers.benefits.benefit4.title', 'Clienți care plătesc în avans (card)'),
      description: t('producers.benefits.benefit4.description', 'Plăți securizate online. Nu mai ai riscul de neplată sau de comenzi anulate la ultimul moment.'),
    },
    {
      icon: Heart,
      title: t('producers.benefits.benefit5.title', 'Sistem anti-risipă (colete neridicate → donații)'),
      description: t('producers.benefits.benefit5.description', 'Dacă un client nu ridică comanda, produsele merg spre donație. Tu primești banii, comunitatea primește hrană.'),
    },
    {
      icon: TrendingUp,
      title: t('producers.benefits.benefit6.title', 'Creștere organică prin platformă'),
      description: t('producers.benefits.benefit6.description', 'Clienții te găsesc, comanda, revin. Construiești o bază de clienți recurenți fără efort de marketing.'),
    },
    {
      icon: MapPin,
      title: t('producers.benefits.benefit7.title', 'Vizibilitate națională'),
      description: t('producers.benefits.benefit7.description', 'Produsele tale sunt vizibile în toată țara. Nu mai depinzi doar de piața locală.'),
    },
  ]
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
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-4">
            {t('producers.benefits.title', 'Ce îți oferă farme.ro')}
          </h2>
          <p className="text-base text-foreground-body max-w-2xl mx-auto leading-relaxed">
            {t('producers.benefits.subtitle', 'O platformă gândită pentru tine, nu pentru intermediari')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -8 }}
              >
                <Card className="border border-border rounded-2xl shadow-premium hover:shadow-premium-lg transition-all duration-300 bg-card h-full">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-soft mb-4">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-foreground-body leading-relaxed">
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

