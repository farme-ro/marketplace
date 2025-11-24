/**
 * Producers Final CTA Section
 * 
 * Secțiunea finală cu CTA masiv
 */

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, Button } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'
import { useI18n } from '@/lib/i18n/context'

export function ProducersFinalCta() {
  const { t } = useI18n()
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-background">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border border-primary/20 rounded-2xl shadow-premium-lg bg-primary-soft/10 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12 lg:p-16 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="space-y-8"
              >
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                  {t('producers.finalCta.title', 'E timpul ca produsele tale să ajungă unde merită.')}
                </h2>
                <div className="space-y-4">
                  <Link href="/portal-producatori/register">
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-full px-12 py-6 text-lg md:text-xl font-semibold shadow-premium-lg"
                    >
                      {t('producers.finalCta.button', 'Devino producător farme.ro')}
                    </Button>
                  </Link>
                  <p className="text-sm text-foreground-body">
                    {t('producers.finalCta.subtitle', 'Înscrierea durează sub 5 minute.')}
                  </p>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </PageContainer>
    </section>
  )
}

