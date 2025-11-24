/**
 * Services Section
 * 
 * Secțiunea cu serviciile oferite pentru importatori
 */

'use client'

import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent } from 'farme-ui'
import { Package, Handshake, Scale, Truck, Award, CheckCircle2 } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function ImportersServicesSection() {
  const { t } = useI18n()

  const services = [
    {
      icon: Package,
      title: t('importers.services.products.title', 'Produse românești premium'),
      description: t('importers.services.products.description', 'Acces la o selecție curată de produse agricole tradiționale de cea mai înaltă calitate'),
      features: [
        t('importers.services.products.feature1', 'Produse certificate'),
        t('importers.services.products.feature2', 'Calitate garantată'),
        t('importers.services.products.feature3', 'Selecție variată'),
      ],
      id: 'products',
    },
    {
      icon: Handshake,
      title: t('importers.services.partnerships.title', 'Parteneriate strategice'),
      description: t('importers.services.partnerships.description', 'Colaborări directe cu producătorii locali pentru volume mari și prețuri competitive'),
      features: [
        t('importers.services.partnerships.feature1', 'Negocieri directe'),
        t('importers.services.partnerships.feature2', 'Contracte personalizate'),
        t('importers.services.partnerships.feature3', 'Relații pe termen lung'),
      ],
      id: 'volumes',
    },
    {
      icon: Scale,
      title: t('importers.services.certifications.title', 'Certificări & standarde'),
      description: t('importers.services.certifications.description', 'Produse care respectă standardele internaționale și certificările necesare'),
      features: [
        t('importers.services.certifications.feature1', 'Conformitate UE'),
        t('importers.services.certifications.feature2', 'Certificări bio'),
        t('importers.services.certifications.feature3', 'Documentație completă'),
      ],
      id: 'certifications',
    },
  ]

  const benefits = [
    {
      icon: Award,
      title: t('importers.benefits.quality.title', 'Calitate garantată'),
      description: t('importers.benefits.quality.description', 'Produse verificate și certificate'),
      id: undefined,
    },
    {
      icon: Truck,
      title: t('importers.benefits.logistics.title', 'Logistică internațională'),
      description: t('importers.benefits.logistics.description', 'Suport pentru transport și documentație'),
      id: 'logistics',
    },
    {
      icon: CheckCircle2,
      title: t('importers.benefits.transparency.title', 'Transparență totală'),
      description: t('importers.benefits.transparency.description', 'Informații complete despre producători și produse'),
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
            {t('importers.services.title', 'Ce oferim importatorilor')}
          </h2>
          <p className="text-lg text-foreground-body max-w-2xl mx-auto">
            {t('importers.services.subtitle', 'O platformă dedicată pentru conectarea importatorilor cu producătorii români de calitate')}
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
            {t('importers.benefits.title', 'Beneficii pentru importatori')}
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

