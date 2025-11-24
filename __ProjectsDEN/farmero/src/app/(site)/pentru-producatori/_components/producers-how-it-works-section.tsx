/**
 * Producers How It Works Section
 * 
 * Secțiunea cu flow-ul pentru producători (4 pași)
 */

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'
import { UserPlus, Package, ShoppingCart, DollarSign } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function ProducersHowItWorksSection() {
  const { t } = useI18n()

  const steps = [
    {
      icon: UserPlus,
      number: '1',
      title: t('producers.howItWorks.step1.title', 'Te înregistrezi'),
      description: t('producers.howItWorks.step1.description', 'Creezi contul în câteva minute. Verificăm rapid și ești gata să vinzi.'),
    },
    {
      icon: Package,
      number: '2',
      title: t('producers.howItWorks.step2.title', 'Îți adaugi produsele'),
      description: t('producers.howItWorks.step2.description', 'Adaugi produsele, prețurile, pozele și stocul. Totul într-un singur loc.'),
    },
    {
      icon: ShoppingCart,
      number: '3',
      title: t('producers.howItWorks.step3.title', 'Primești comenzi'),
      description: t('producers.howItWorks.step3.description', 'Clienții comanda direct. Tu primești notificări și vezi totul în dashboard.'),
    },
    {
      icon: DollarSign,
      number: '4',
      title: t('producers.howItWorks.step4.title', 'Livrezi și câștigi'),
      description: t('producers.howItWorks.step4.description', 'Livrezi comanda și primești banii. Simplu, transparent, predictibil.'),
    },
  ]
  return (
    <section className="py-16 md:py-24 bg-primary-soft/20">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-4">
            {t('producers.howItWorks.title', 'Cum funcționează pentru tine')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon
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
                  <CardContent className="p-6 text-center">
                    <div className="relative mb-6">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-soft">
                        <Icon className="w-10 h-10 text-primary" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                        {step.number}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-sm text-foreground-body leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Mini Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="border border-border rounded-2xl shadow-premium-lg bg-card">
            <CardContent className="p-6 md:p-8">
              <h3 className="text-xl font-semibold text-foreground mb-6">
                {t('producers.howItWorks.dashboard.title', 'Dashboard producător')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-sm text-foreground-body">{t('producers.howItWorks.dashboard.monthlySales', 'Vânzări lunare')}</p>
                  <p className="text-3xl font-bold text-foreground">12.450 lei</p>
                  <div className="h-2 rounded-full bg-muted">
                    <div className="h-2 w-3/4 rounded-full bg-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-foreground-body">{t('producers.howItWorks.dashboard.activeOrders', 'Comenzi active')}</p>
                  <p className="text-3xl font-bold text-foreground">18</p>
                  <div className="h-2 rounded-full bg-muted">
                    <div className="h-2 w-2/3 rounded-full bg-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-foreground-body">{t('producers.howItWorks.dashboard.paymentStatus', 'Status plăți')}</p>
                  <p className="text-3xl font-bold text-primary">✓ {t('producers.howItWorks.dashboard.onTime', 'On time')}</p>
                  <div className="h-2 rounded-full bg-muted">
                    <div className="h-2 w-full rounded-full bg-primary" />
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground italic mt-6 pt-6 border-t border-border">
                {t('producers.howItWorks.dashboard.footer', 'Exemplu de interfață. Datele reale vor fi afișate în contul tău.')}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </PageContainer>
    </section>
  )
}

