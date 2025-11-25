/**
 * Partnership Section
 * 
 * Secțiunea cu detalii despre parteneriat
 */

'use client'

import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent } from 'farme-ui'
import { FileText, DollarSign, Handshake, CheckCircle2 } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function PartnershipSection() {
  const { t } = useI18n()

  const partnershipDetails = [
    {
      icon: FileText,
      title: t('logistics.partnership.contracts.title', 'Contracte clare'),
      description: t('logistics.partnership.contracts.description', 'Acorduri transparente cu termeni și condiții definite'),
      id: undefined,
    },
    {
      icon: DollarSign,
      title: t('logistics.partnership.commission.title', 'Comisioane competitive'),
      description: t('logistics.partnership.commission.description', 'Remunerație corectă pentru serviciile tale'),
      id: 'comisioane',
    },
    {
      icon: Handshake,
      title: t('logistics.partnership.longTerm.title', 'Parteneriat pe termen lung'),
      description: t('logistics.partnership.longTerm.description', 'Relații stabile și oportunități de creștere'),
      id: 'parteneriat',
    },
    {
      icon: CheckCircle2,
      title: t('logistics.partnership.support.title', 'Suport dedicat'),
      description: t('logistics.partnership.support.description', 'Echipa noastră te ajută în fiecare etapă'),
      id: undefined,
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
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            {t('logistics.partnership.title', 'Cum funcționează parteneriatul')}
          </h2>
          <p className="text-lg text-foreground-body max-w-2xl mx-auto">
            {t('logistics.partnership.subtitle', 'Proces simplu și transparent pentru a deveni partener de logistică')}
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

