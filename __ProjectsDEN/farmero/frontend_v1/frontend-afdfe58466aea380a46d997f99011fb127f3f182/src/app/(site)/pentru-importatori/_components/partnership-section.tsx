/**
 * Partnership Section
 * 
 * Secțiunea cu detalii despre parteneriat pentru importatori
 */

'use client'

import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent } from 'farme-ui'
import { FileText, DollarSign, Globe, Users } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function ImportersPartnershipSection() {
  const { t } = useI18n()

  const partnershipDetails = [
    {
      icon: Globe,
      title: t('importers.partnership.coverage.title', 'Acoperire internațională'),
      description: t('importers.partnership.coverage.description', 'Conectează-te cu producători din toată România'),
      id: undefined,
    },
    {
      icon: DollarSign,
      title: t('importers.partnership.pricing.title', 'Prețuri competitive'),
      description: t('importers.partnership.pricing.description', 'Negocieri directe pentru volume mari'),
      id: 'pricing',
    },
    {
      icon: FileText,
      title: t('importers.partnership.documentation.title', 'Documentație completă'),
      description: t('importers.partnership.documentation.description', 'Toate certificările și documentele necesare'),
      id: undefined,
    },
    {
      icon: Users,
      title: t('importers.partnership.support.title', 'Suport dedicat'),
      description: t('importers.partnership.support.description', 'Echipa noastră te ajută în fiecare etapă'),
      id: undefined,
    },
  ]
  return (
    <section id="partnerships" className="py-16 md:py-24 bg-background scroll-mt-20">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            {t('importers.partnership.title', 'Cum funcționează parteneriatul')}
          </h2>
          <p className="text-lg text-foreground-body max-w-2xl mx-auto">
            {t('importers.partnership.subtitle', 'Proces simplu și transparent pentru a deveni partener importator')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {partnershipDetails.map((detail, index) => {
            const Icon = detail.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                id={detail.id}
                className={detail.id ? 'scroll-mt-20' : ''}
              >
                <Card className="border border-border rounded-xl shadow-sm bg-card h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">
                      {detail.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {detail.description}
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

