/**
 * Testimonials Section Component
 * 
 * Placeholder pentru testimoniale (date statice pentru moment)
 */

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'
import { useI18n } from '@/lib/i18n/context'

export function TestimonialsSection() {
  const { t } = useI18n()
  
  const testimonials = [
    {
      name: 'Maria P.',
      location: 'București',
      text: t('home.testimonials.testimonial1', 'Produse excelente, direct de la producător. Am comandat miere și brânzeturi și au fost exact cum mi le-am imaginat. Livrare rapidă și prețuri corecte.'),
      rating: 5,
    },
    {
      name: 'Ion D.',
      location: 'Cluj-Napoca',
      text: t('home.testimonials.testimonial2', 'Îmi place că pot susține producători locali și în același timp să primesc produse de calitate. Sistemul de donații pentru comenzile neridicate este o idee excelentă.'),
      rating: 5,
    },
    {
      name: 'Ana M.',
      location: 'Timișoara',
      text: t('home.testimonials.testimonial3', 'Am descoperit producători noi prin platformă. Produsele sunt autentice, tradiționale, exact ce căutam. Recomand cu încredere!'),
      rating: 5,
    },
  ]
  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-4">
            {t('home.testimonials.title', 'Ce spun clienții noștri')}
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground">
            {t('home.testimonials.subtitle', 'Povești reale despre experiențele clienților cu producătorii de pe farme.ro')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="border-2 border-border/60 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 h-full bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-500 text-sm">★</span>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    &quot;{testimonial.text}&quot;
                  </p>
                  <div className="pt-4 border-t border-border/40">
                    <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </PageContainer>
    </section>
  )
}

