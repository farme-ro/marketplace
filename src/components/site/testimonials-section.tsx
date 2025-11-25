/**
 * Testimonials Section Component
 * 
 * Secțiunea cu testimoniale - 2 coloane (Client + Producător)
 */

'use client'

import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent } from 'farme-ui'

const clientTestimonials = [
  {
    quote: 'Produse excelente, prețuri corecte. Știu că susțin direct producătorul și asta mă face să mă simt bine.',
    author: 'Maria P.',
    role: 'Client',
    rating: 5,
  },
  {
    quote: 'Livrare rapidă, produse proaspete. Deja am comandat de 3 ori și sunt foarte mulțumită.',
    author: 'Ana M.',
    role: 'Client',
    rating: 5,
  },
]

const producerTestimonials = [
  {
    quote: 'Platforma mă ajută să ajung la clienți noi. Comisioanele sunt corecte și procesul e simplu.',
    author: 'Ferma Popescu',
    role: 'Producător',
    rating: 5,
  },
  {
    quote: 'Am crescut vânzările cu 40% de când sunt pe Farme.ro. Recomand cu încredere.',
    author: 'Ferma Ionescu',
    role: 'Producător',
    rating: 5,
  },
]

export function TestimonialsSection() {
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
            Ce spun clienții și producătorii
          </h2>
          <p className="text-base md:text-lg text-foreground-body max-w-2xl mx-auto leading-relaxed">
            Povești reale de la oameni reali. Comunitatea Farme.ro crește zilnic.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Client Testimonials */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-foreground mb-6">Clienți</h3>
            {clientTestimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="border border-border rounded-[32px] shadow-premium bg-card">
                  <CardContent className="p-6">
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400">⭐</span>
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-base text-foreground-body leading-relaxed mb-4 italic">
                      &quot;{testimonial.quote}&quot;
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center">
                        <span className="text-lg">👤</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{testimonial.author}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Producer Testimonials */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-foreground mb-6">Producători</h3>
            {producerTestimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="border border-border rounded-[32px] shadow-premium bg-card">
                  <CardContent className="p-6">
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400">⭐</span>
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-base text-foreground-body leading-relaxed mb-4 italic">
                      &quot;{testimonial.quote}&quot;
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center">
                        <span className="text-lg">🧑‍🌾</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{testimonial.author}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </PageContainer>
    </section>
  )
}

