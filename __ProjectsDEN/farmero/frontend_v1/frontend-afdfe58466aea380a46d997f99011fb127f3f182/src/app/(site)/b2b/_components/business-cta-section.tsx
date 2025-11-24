/**
 * Business CTA Section
 * 
 * Secțiunea finală cu call-to-action pentru B2B
 */

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, Button } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'
import { Building2, ArrowRight, Mail } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function BusinessCTASection() {
  const { t } = useI18n()
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-background">
      {/* Anchor for invoicing */}
      <div id="invoicing" className="scroll-mt-20" />
      {/* Anchor for success-stories */}
      <div id="success-stories" className="scroll-mt-20" />
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
                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto">
                  <Building2 className="w-8 h-8 text-primary-foreground" />
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                  {t('b2b.cta.title', 'Pregătește-ți afacerea pentru succes')}
                </h2>

                <p className="text-base md:text-lg text-foreground-body max-w-2xl mx-auto">
                  {t('b2b.cta.description', 'Dacă ești restaurator, hotelier sau ai o afacere care are nevoie de produse proaspete, creează cont B2B și începe să beneficiezi de prețuri speciale și livrare inclusă.')}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Link href="/b2b/register">
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-base md:text-lg font-semibold shadow-premium-lg flex items-center gap-2"
                    >
                      <Building2 className="w-5 h-5" />
                      {t('b2b.cta.button', 'Creează cont B2B')}
                    </Button>
                  </Link>
                  <a
                    href="mailto:b2b@farme.ro"
                    className="px-6 py-3 border-2 border-border hover:bg-muted rounded-full text-base font-medium transition-colors flex items-center gap-2"
                  >
                    <Mail className="w-5 h-5" />
                    b2b@farme.ro
                  </a>
                </div>

                <p className="text-xs text-muted-foreground pt-4">
                  {t('b2b.cta.responseTime', 'Răspundem la toate solicitările în maximum 24 de ore.')}
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </PageContainer>
    </section>
  )
}

