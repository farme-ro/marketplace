/**
 * Logistics CTA Section
 * 
 * Secțiunea finală cu call-to-action
 */

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, Button } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'
import { Truck, ArrowRight, Mail } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function LogisticsCTASection() {
  const { t } = useI18n()
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-background">
      {/* Anchor for asigurari */}
      <div id="asigurari" className="scroll-mt-20" />
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
                  <Truck className="w-8 h-8 text-primary-foreground" />
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                  {t('logistics.cta.title', 'Devino partener în logistica farme.ro')}
                </h2>

                <p className="text-base md:text-lg text-foreground-body max-w-2xl mx-auto">
                  {t('logistics.cta.description', 'Dacă oferi servicii de livrare, depozitare sau pachetomate și vrei să colaborezi cu noi, suntem deschiși să discutăm despre oportunitățile de parteneriat.')}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Link href="/pentru-logistica/register">
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-base md:text-lg font-semibold shadow-premium-lg flex items-center gap-2"
                    >
                      <Truck className="w-5 h-5" />
                      {t('logistics.cta.button', 'Aplică acum')}
                    </Button>
                  </Link>
                  <a
                    href="mailto:logistica@farme.ro"
                    className="px-6 py-3 border-2 border-border hover:bg-muted rounded-full text-base font-medium transition-colors flex items-center gap-2"
                  >
                    <Mail className="w-5 h-5" />
                    logistica@farme.ro
                  </a>
                </div>

                <p className="text-xs text-muted-foreground pt-4">
                  {t('logistics.cta.responseTime', 'Răspundem la toate solicitările în maximum 24 de ore.')}
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </PageContainer>
    </section>
  )
}

