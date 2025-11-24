/**
 * Business Model Section
 * 
 * Secțiunea care explică modelul de business al farme.ro
 */

'use client'

import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent } from 'farme-ui'
import { DollarSign, Users, TrendingUp, ShoppingCart, Package, BarChart3 } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function BusinessModelSection() {
  const { t } = useI18n()

  const revenueStreams = [
    {
      icon: DollarSign,
      title: t('investors.businessModel.revenueStreams.commissions.title', 'Comisioane de vânzare'),
      description: t('investors.businessModel.revenueStreams.commissions.description', 'Comision transparent de 10-15% din fiecare vânzare, în funcție de abonament'),
      percentage: '70%',
    },
    {
      icon: Package,
      title: t('investors.businessModel.revenueStreams.subscriptions.title', 'Abonamente producători'),
      description: t('investors.businessModel.revenueStreams.subscriptions.description', 'Planuri premium pentru producători care doresc vizibilitate crescută'),
      percentage: '20%',
    },
    {
      icon: ShoppingCart,
      title: t('investors.businessModel.revenueStreams.b2b.title', 'Servicii B2B'),
      description: t('investors.businessModel.revenueStreams.b2b.description', 'Conturi dedicate pentru restaurante și afaceri cu prețuri speciale'),
      percentage: '10%',
    },
  ]

  const keyMetrics = [
    {
      icon: Users,
      label: t('investors.businessModel.metrics.activeProducers.label', 'Producători activi'),
      value: '500+',
      description: t('investors.businessModel.metrics.activeProducers.description', 'Și în creștere constantă'),
    },
    {
      icon: ShoppingCart,
      label: t('investors.businessModel.metrics.ordersProcessed.label', 'Comenzi procesate'),
      value: '10,000+',
      description: t('investors.businessModel.metrics.ordersProcessed.description', 'Luna curentă'),
    },
    {
      icon: TrendingUp,
      label: t('investors.businessModel.metrics.monthlyGrowth.label', 'Creștere lunară'),
      value: '25%',
      description: t('investors.businessModel.metrics.monthlyGrowth.description', 'Venituri și comenzi'),
    },
    {
      icon: BarChart3,
      label: t('investors.businessModel.metrics.avgOrderValue.label', 'Valoare medie comandă'),
      value: '150 RON',
      description: t('investors.businessModel.metrics.avgOrderValue.description', 'Per client'),
    },
  ]
  return (
    <section id="business-model" className="py-16 md:py-24 bg-background scroll-mt-20">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            {t('investors.businessModel.title', 'Model de business scalabil și sustenabil')}
          </h2>
          <p className="text-lg text-foreground-body max-w-2xl mx-auto">
            {t('investors.businessModel.subtitle', 'Generăm valoare prin conectarea directă între producători și consumatori, eliminând intermediarii și creând un ecosistem profitabil pentru toți.')}
          </p>
        </motion.div>

        {/* Revenue Streams */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-foreground mb-6 text-center">
            {t('investors.businessModel.revenueStreams.title', 'Surse de venit')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {revenueStreams.map((stream, index) => {
              const Icon = stream.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="border border-border rounded-2xl shadow-sm bg-card h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg font-semibold text-foreground">
                              {stream.title}
                            </h4>
                            <span className="text-sm font-bold text-primary">
                              {stream.percentage}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {stream.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Key Metrics */}
        <div>
          <h3 className="text-2xl font-semibold text-foreground mb-6 text-center">
            {t('investors.businessModel.metrics.title', 'Metrici cheie')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {keyMetrics.map((metric, index) => {
              const Icon = metric.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="border border-border rounded-xl shadow-sm bg-card">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center mx-auto mb-3">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <p className="text-3xl font-bold text-foreground mb-1">
                        {metric.value}
                      </p>
                      <p className="text-sm font-medium text-foreground mb-1">
                        {metric.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {metric.description}
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

