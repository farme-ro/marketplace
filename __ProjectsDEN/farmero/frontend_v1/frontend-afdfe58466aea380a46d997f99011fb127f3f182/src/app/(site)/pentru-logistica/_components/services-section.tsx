/**
 * Services Section
 * 
 * Secțiunea cu serviciile oferite de partenerii de logistică
 */

'use client'

import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent } from 'farme-ui'
import { Truck, Warehouse, Package, Snowflake, MapPin, Clock } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function ServicesSection() {
  const { t } = useI18n()

  const services = [
    {
      icon: Truck,
      title: t('logistics.services.temperature.title', 'Livrări cu mașini frigorifice'),
      description: t('logistics.services.temperature.description', 'Transport specializat pentru produse alimentare care necesită temperatură controlată'),
      features: [
        t('logistics.services.temperature.feature1', 'Mașini frigorifice certificate'),
        t('logistics.services.temperature.feature2', 'Monitorizare temperatură în timp real'),
        t('logistics.services.temperature.feature3', 'Livrări programate'),
      ],
      id: undefined,
    },
    {
      icon: Warehouse,
      title: t('logistics.services.storage.title', 'Depozitare'),
      description: t('logistics.services.storage.description', 'Spații de depozitare pentru produse agricole cu condiții optimale'),
      features: [
        t('logistics.services.storage.feature1', 'Depozite climatizate'),
        t('logistics.services.storage.feature2', 'Control calitate'),
        t('logistics.services.storage.feature3', 'Gestionare stocuri'),
      ],
      id: 'depozitare',
    },
    {
      icon: Package,
      title: t('logistics.services.packaging.title', 'Pachetomate'),
      description: t('logistics.services.packaging.description', 'Servicii de ambalare și pregătire comenzi pentru livrare'),
      features: [
        t('logistics.services.packaging.feature1', 'Ambalare profesională'),
        t('logistics.services.packaging.feature2', 'Etichetare automată'),
        t('logistics.services.packaging.feature3', 'Verificare calitate'),
      ],
      id: 'ambalare',
    },
  ]

  const benefits = [
    {
      icon: MapPin,
      title: t('logistics.benefits.coverage.title', 'Acoperire națională'),
      description: t('logistics.benefits.coverage.description', 'Oportunități de livrare în toată România'),
      id: 'rute',
    },
    {
      icon: Clock,
      title: t('logistics.benefits.flexible.title', 'Program flexibil'),
      description: t('logistics.benefits.flexible.description', 'Adaptează-te la nevoile noastre și ale clienților'),
      id: 'programare',
    },
    {
      icon: Snowflake,
      title: t('logistics.benefits.quality.title', 'Standarde de calitate'),
      description: t('logistics.benefits.quality.description', 'Respectăm cele mai înalte standarde pentru produse alimentare'),
      id: undefined,
    },
  ]
  return (
    <section id="servicii" className="py-16 md:py-24 bg-muted/30 scroll-mt-20">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            {t('logistics.services.title', 'Servicii căutate')}
          </h2>
          <p className="text-lg text-foreground-body max-w-2xl mx-auto">
            {t('logistics.services.subtitle', 'Căutăm parteneri pentru servicii de logistică și transport de calitate')}
          </p>
        </motion.div>

        {/* Services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                id={service.id}
                className={service.id ? 'scroll-mt-20' : ''}
              >
                <Card className="border border-border rounded-2xl shadow-sm bg-card h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {service.description}
                    </p>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-2 text-xs text-foreground-body">
                          <span className="text-primary mt-1">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Benefits */}
        <div>
          <h3 className="text-2xl font-semibold text-foreground mb-6 text-center">
            {t('logistics.benefits.title', 'Beneficii pentru parteneri')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  id={benefit.id}
                  className={benefit.id ? 'scroll-mt-20' : ''}
                >
                  <Card className="border border-border rounded-xl shadow-sm bg-card">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center mx-auto mb-3">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="text-lg font-semibold text-foreground mb-2">
                        {benefit.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </PageContainer>
    </section>
  )
}

