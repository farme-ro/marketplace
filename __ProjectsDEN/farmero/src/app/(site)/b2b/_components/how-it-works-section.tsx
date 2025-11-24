/**
 * How It Works Section
 * 
 * Secțiunea care explică cum funcționează serviciul B2B
 */

'use client'

import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent } from 'farme-ui'
import { UserPlus, ShoppingCart, Truck, CheckCircle2 } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function BusinessHowItWorksSection() {
  const { t } = useI18n()
  
  const steps = [
    {
      icon: UserPlus,
      title: t('b2b.howItWorks.step1.title', 'Creează cont B2B'),
      description: t('b2b.howItWorks.step1.description', 'Înregistrează-ți afacerea și obține acces la platformă'),
    },
    {
      icon: ShoppingCart,
      title: t('b2b.howItWorks.step2.title', 'Comandă produse'),
      description: t('b2b.howItWorks.step2.description', 'Alege produsele și creează coșuri pentru angajați sau departamente'),
    },
    {
      icon: Truck,
      title: t('b2b.howItWorks.step3.title', 'Livrare inclusă'),
      description: t('b2b.howItWorks.step3.description', 'Produsele sunt livrate direct la locația ta, cu transport inclus'),
    },
    {
      icon: CheckCircle2,
      title: t('b2b.howItWorks.step4.title', 'Gestionare simplă'),
      description: t('b2b.howItWorks.step4.description', 'Urmărește comenzile, cheltuielile și istoricul într-un singur loc'),
    },
  ]
  return (
    <section id="payment-terms" className="py-16 md:py-24 bg-background scroll-mt-20">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            {t('b2b.howItWorks.title', 'Cum funcționează?')}
          </h2>
          <p className="text-lg text-foreground-body max-w-2xl mx-auto">
            {t('b2b.howItWorks.subtitle', 'Proces simplu în 4 pași pentru a începe să folosești farme.ro pentru afacerea ta')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="border border-border rounded-xl shadow-sm bg-card h-full relative">
                  <CardContent className="p-6">
                    <div className="absolute -top-4 left-6 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center mb-4 mt-2">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
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

