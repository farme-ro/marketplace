/**
 * Cookies Policy Page
 * 
 * Pagină cu politica de cookie-uri
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'
import { useI18n } from '@/lib/i18n/context'
import { formatDate } from '@/lib/utils/format'

export default function CookiesPage() {
  const { t, locale } = useI18n()
  const [formattedDate, setFormattedDate] = useState<string>('')

  useEffect(() => {
    setFormattedDate(formatDate(new Date(), locale, { year: 'numeric', month: 'long', day: 'numeric' }))
  }, [locale])
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <PageContainer className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center max-w-3xl mx-auto"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-4">
            {t('cookies.title', 'Politica de cookie-uri')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary via-primary to-primary rounded-full mx-auto mb-6" />
          <p className="text-sm md:text-base text-muted-foreground">
            {t('cookies.lastUpdated', 'Ultima actualizare')}: {formattedDate || formatDate(new Date(), 'ro', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>

        {/* Content */}
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="border-border/60 rounded-2xl shadow-sm">
            <CardContent className="p-8 md:p-10">
              <div className="prose prose-sm md:prose-base max-w-none space-y-8">
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-foreground mb-4">{t('cookies.section1.title', '1. Ce sunt cookie-urile?')}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('cookies.section1.content', 'Cookie-urile sunt fișiere text mici stocate pe dispozitivul tău când vizitezi un site web. Acestea permit site-ului să-ți amintească preferințele și să îmbunătățească experiența ta de navigare.')}
                  </p>
                </motion.section>

                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-foreground mb-4">{t('cookies.section2.title', '2. Tipuri de cookie-uri folosite')}</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{t('cookies.section2.essential.title', 'Cookie-uri esențiale')}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {t('cookies.section2.essential.content', 'Aceste cookie-uri sunt necesare pentru funcționarea platformei și nu pot fi dezactivate. Ele includ autentificarea, securitatea și funcționalitățile de bază.')}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{t('cookies.section2.performance.title', 'Cookie-uri de performanță')}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {t('cookies.section2.performance.content', 'Aceste cookie-uri ne ajută să înțelegem cum utilizatorii interacționează cu platforma, permițându-ne să îmbunătățim funcționalitatea și performanța.')}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{t('cookies.section2.functionality.title', 'Cookie-uri de funcționalitate')}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {t('cookies.section2.functionality.content', 'Aceste cookie-uri permit platformei să-ți amintească preferințele (de exemplu, limba selectată) pentru a oferi o experiență personalizată.')}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{t('cookies.section2.marketing.title', 'Cookie-uri de marketing')}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {t('cookies.section2.marketing.content', 'Aceste cookie-uri sunt folosite pentru a-ți afișa conținut relevant și pentru a măsura eficacitatea campaniilor de marketing.')}
                      </p>
                    </div>
                  </div>
                </motion.section>

                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-foreground mb-4">{t('cookies.section3.title', '3. Gestionarea cookie-urilor')}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {t('cookies.section3.subtitle', 'Poți gestiona preferințele cookie-urilor în setările browser-ului tău. Poți:')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>{t('cookies.section3.list1', 'Bloca toate cookie-urile')}</li>
                    <li>{t('cookies.section3.list2', 'Permite doar cookie-uri de la site-uri de încredere')}</li>
                    <li>{t('cookies.section3.list3', 'Șterge cookie-urile existente')}</li>
                    <li>{t('cookies.section3.list4', 'Configura notificări când sunt setate cookie-uri')}</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    <strong>{t('cookies.section3.note', 'Notă: Blocarea anumitor cookie-uri poate afecta funcționalitatea platformei.')}</strong>
                  </p>
                </motion.section>

                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-foreground mb-4">{t('cookies.section4.title', '4. Cookie-uri terțe')}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {t('cookies.section4.subtitle', 'Utilizăm servicii terțe care pot seta cookie-uri pe dispozitivul tău:')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>{t('cookies.section4.list1', 'Analiză: Pentru a înțelege cum este utilizată platforma')}</li>
                    <li>{t('cookies.section4.list2', 'Plăți: Pentru procesarea plăților securizate')}</li>
                    <li>{t('cookies.section4.list3', 'Marketing: Pentru a măsura eficacitatea campaniilor')}</li>
                  </ul>
                </motion.section>

                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-foreground mb-4">{t('cookies.section5.title', '5. Contact')}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('cookies.section5.content', 'Pentru întrebări despre politica de cookie-uri, te rugăm să ne contactezi la:')}{' '}
                    <a href={`mailto:${t('cookies.section5.email', 'contact@farme.ro')}`} className="text-primary hover:underline font-medium">
                      {t('cookies.section5.email', 'contact@farme.ro')}
                    </a>
                  </p>
                </motion.section>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </section>
  )
}

