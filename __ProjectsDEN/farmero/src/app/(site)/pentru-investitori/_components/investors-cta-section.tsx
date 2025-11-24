/**
 * Investors CTA Section
 * 
 * Secțiunea finală cu call-to-action pentru investitori
 */

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, Button } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'
import { Handshake, ArrowRight, Calendar, Mail } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function InvestorsCTASection() {
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
                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto">
                  <Handshake className="w-8 h-8 text-primary-foreground" />
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                  {t('investors.cta.title', 'Hai să construim viitorul alimentar al României împreună.')}
                </h2>

                <p className="text-base md:text-lg text-foreground-body max-w-2xl mx-auto">
                  {t('investors.cta.description', 'Dacă crezi în viziunea noastră și vrei să fii parte din această transformare, suntem deschiși să discutăm despre cum putem colabora.')}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Link href="/contact?type=investor">
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-base md:text-lg font-semibold shadow-premium-lg flex items-center gap-2"
                    >
                      <Calendar className="w-5 h-5" />
                      {t('investors.cta.button', 'Programează o întâlnire')}
                    </Button>
                  </Link>
                  <a
                    href="mailto:investitori@farme.ro"
                    className="px-6 py-3 border-2 border-border hover:bg-muted rounded-full text-base font-medium transition-colors flex items-center gap-2"
                  >
                    <Mail className="w-5 h-5" />
                    investitori@farme.ro
                  </a>
                </div>

                <p className="text-xs text-muted-foreground pt-4">
                  {t('investors.cta.responseTime', 'Răspundem la toate solicitările în maximum 24 de ore.')}
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </PageContainer>
    </section>
  )
}

