/**
 * Producers Testimonial Section
 * 
 * Secțiunea cu testimonial
 */

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'
import { Quote } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function ProducersTestimonial() {
  const { t } = useI18n()
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border border-border rounded-2xl shadow-premium-lg bg-card">
            <CardContent className="p-8 md:p-12">
              <div className="space-y-6">
                <Quote className="w-12 h-12 text-primary/30" />
                <p className="text-xl md:text-2xl text-foreground-body leading-relaxed italic">
                  &ldquo;{t('producers.testimonial.quote', 'De când vând pe farme.ro, nu mai depind de piețe și intermediari. Vând constant și corect.')}&rdquo;
                </p>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm font-semibold text-foreground">
                    {t('producers.testimonial.author', 'Producător local, Prahova')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </PageContainer>
    </section>
  )
}

