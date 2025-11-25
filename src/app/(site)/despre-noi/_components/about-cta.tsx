'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent } from 'farme-ui'
import { useI18n } from '@/lib/i18n/context'

export function AboutCTA() {
  const { t } = useI18n()
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-muted relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 left-20 w-32 h-32 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3],
            x: [0, 30],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-10 right-20 w-40 h-40 bg-emerald-200/20 dark:bg-emerald-800/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2],
            x: [0, -20],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>

      <PageContainer className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-6 lg:gap-8"
        >
          {/* CTA pentru clienți */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -6 }}
            className="h-full"
          >
            <Card className="h-full border-border/60 rounded-2xl hover:shadow-2xl transition-all duration-500 hover:border-emerald-500/50 bg-card group overflow-hidden relative">
              {/* Animated gradient background */}
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              
              <CardContent className="p-8 md:p-10 text-center space-y-6 relative z-10">
                {/* Icon Container */}
                <motion.div
                  className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 mx-auto bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl mb-6 border border-border/40 group-hover:border-emerald-500/40 transition-all duration-300"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: [0, -5, 5, 0],
                  }}
                  transition={{ 
                    scale: { duration: 0.3 },
                    rotate: { duration: 0.5 }
                  }}
                >
                  <svg className="w-10 h-10 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </motion.div>
                
                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-xl md:text-2xl font-semibold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                    {t('about.cta.client.title', 'Începe să cumperi')}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {t('about.cta.client.description', 'Explorează gama variată de produse tradiționale și bio de la producători locali verificați')}
                  </p>
                </div>
                
                {/* Button */}
                <div className="pt-2">
                  <Link href="/produse" className="inline-block">
                    <Button size="lg" className="w-full sm:w-auto group/btn">
                      {t('about.cta.client.button', 'Vezi produsele')}
                      <svg className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* CTA pentru producători */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -6 }}
            className="h-full"
          >
            <Card className="h-full border border-border rounded-2xl hover:shadow-2xl transition-all duration-500 hover:border-primary/50 bg-card group overflow-hidden relative">
              {/* Animated gradient background */}
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              
              <CardContent className="p-8 md:p-10 text-center space-y-6 relative z-10">
                {/* Icon Container */}
                <motion.div
                  className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 mx-auto bg-primary/10 text-primary rounded-2xl mb-6 border border-border group-hover:border-primary/40 transition-all duration-300"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ 
                    scale: { duration: 0.3 },
                    rotate: { duration: 0.5 }
                  }}
                >
                  <svg className="w-10 h-10 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                  </svg>
                </motion.div>
                
                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-xl md:text-2xl font-semibold text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">
                    {t('about.cta.producer.title', 'Devino producător')}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {t('about.cta.producer.description', 'Intră în programul farme.ro și vinde produsele tale direct clienților, fără intermediari')}
                  </p>
                </div>
                
                {/* Button */}
                <div className="pt-2">
                  <Link href="/portal-producatori/register" className="inline-block">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto group/btn border-primary/30 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300">
                      {t('about.cta.producer.button', 'Află mai multe')}
                      <svg className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </PageContainer>
    </section>
  )
}
