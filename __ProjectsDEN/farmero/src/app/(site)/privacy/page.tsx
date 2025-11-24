/**
 * Privacy Policy Page
 * 
 * Pagină cu politica de confidențialitate
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'
import { useI18n } from '@/lib/i18n/context'
import { formatDate } from '@/lib/utils/format'
import Link from 'next/link'

export default function PrivacyPage() {
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
            {t('privacy.title', 'Politica de confidențialitate')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary via-primary to-primary rounded-full mx-auto mb-6" />
          <p className="text-sm md:text-base text-muted-foreground">
            {t('privacy.lastUpdated', 'Ultima actualizare')}: {formattedDate || formatDate(new Date(), 'ro', { year: 'numeric', month: 'long', day: 'numeric' })}
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
                  <h2 className="text-2xl font-semibold text-foreground mb-4">{t('privacy.section1.title', '1. Introducere')}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('privacy.section1.content', 'farme.ro respectă confidențialitatea utilizatorilor și se angajează să protejeze datele personale colectate prin intermediul platformei. Această politică de confidențialitate explică cum colectăm, utilizăm, stocăm și protejăm informațiile tale personale.')}
                  </p>
                </motion.section>

                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-foreground mb-4">{t('privacy.section2.title', '2. Datele pe care le colectăm')}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">{t('privacy.section2.subtitle', 'Colectăm următoarele tipuri de date:')}</p>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{t('privacy.section2.identification.title', 'Date de identificare')}</h3>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                        <li>{t('privacy.section2.identification.list1', 'Nume complet')}</li>
                        <li>{t('privacy.section2.identification.list2', 'Adresă de email')}</li>
                        <li>{t('privacy.section2.identification.list3', 'Număr de telefon (opțional)')}</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{t('privacy.section2.usage.title', 'Date de utilizare')}</h3>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                        <li>{t('privacy.section2.usage.list1', 'Istoricul comenzilor')}</li>
                        <li>{t('privacy.section2.usage.list2', 'Preferințe de produse')}</li>
                        <li>{t('privacy.section2.usage.list3', 'Date de navigare pe platformă')}</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{t('privacy.section2.technical.title', 'Date tehnice')}</h3>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                        <li>{t('privacy.section2.technical.list1', 'Adresă IP')}</li>
                        <li>{t('privacy.section2.technical.list2', 'Tip de browser')}</li>
                        <li>{t('privacy.section2.technical.list3', 'Dispozitiv utilizat')}</li>
                      </ul>
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
                  <h2 className="text-2xl font-semibold text-foreground mb-4">{t('privacy.section3.title', '3. Cum utilizăm datele')}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">{t('privacy.section3.subtitle', 'Utilizăm datele tale pentru:')}</p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>{t('privacy.section3.list1', 'Procesarea și livrarea comenzilor')}</li>
                    <li>{t('privacy.section3.list2', 'Comunicarea cu tine despre comenzi și servicii')}</li>
                    <li>{t('privacy.section3.list3', 'Îmbunătățirea experienței tale pe platformă')}</li>
                    <li>{t('privacy.section3.list4', 'Prevenirea fraudelor și asigurarea securității')}</li>
                    <li>{t('privacy.section3.list5', 'Conformarea cu obligațiile legale')}</li>
                  </ul>
                </motion.section>

                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-foreground mb-4">{t('privacy.section4.title', '4. Partajarea datelor')}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {t('privacy.section4.content', 'Nu vindem datele tale personale către terți. Putem partaja datele doar în următoarele situații:')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>{t('privacy.section4.list1', 'Producători: Pentru procesarea și livrarea comenzilor')}</li>
                    <li>{t('privacy.section4.list2', 'Furnizori de servicii: Pentru procesarea plăților, livrare, etc.')}</li>
                    <li>{t('privacy.section4.list3', 'Obligații legale: Când este necesar conform legii')}</li>
                  </ul>
                </motion.section>

                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-foreground mb-4">{t('privacy.section5.title', '5. Securitatea datelor')}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('privacy.section5.content', 'Implementăm măsuri de securitate tehnice și organizaționale pentru a proteja datele tale personale împotriva accesului neautorizat, pierderii sau distrugerii.')}
                  </p>
                </motion.section>

                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-foreground mb-4">{t('privacy.section6.title', '6. Cookie-uri')}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('privacy.section6.content', 'Utilizăm cookie-uri pentru a îmbunătăți experiența ta pe platformă. Pentru mai multe detalii, vezi')}{' '}
                    <Link href="/cookies" className="text-primary hover:underline font-medium">
                      {t('privacy.section6.link', 'Politica de cookie-uri')}
                    </Link>.
                  </p>
                </motion.section>

                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-foreground mb-4">{t('privacy.section7.title', '7. Drepturile tale (GDPR)')}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">{t('privacy.section7.subtitle', 'Conform GDPR, ai următoarele drepturi:')}</p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>{t('privacy.section7.right1', 'Dreptul de acces: Poți solicita o copie a datelor tale personale')}</li>
                    <li>{t('privacy.section7.right2', 'Dreptul de rectificare: Poți solicita corectarea datelor incorecte')}</li>
                    <li>{t('privacy.section7.right3', 'Dreptul de ștergere: Poți solicita ștergerea datelor tale')}</li>
                    <li>{t('privacy.section7.right4', 'Dreptul de opoziție: Poți te opune procesării datelor tale')}</li>
                    <li>{t('privacy.section7.right5', 'Dreptul la portabilitate: Poți solicita transferul datelor tale')}</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    {t('privacy.section7.moreInfo', 'Pentru mai multe detalii, vezi')}{' '}
                    <Link href="/gdpr" className="text-primary hover:underline font-medium">
                      {t('privacy.section7.link', 'Pagina GDPR')}
                    </Link>.
                  </p>
                </motion.section>

                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-foreground mb-4">{t('privacy.section8.title', '8. Contact')}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('privacy.section8.content', 'Pentru întrebări despre această politică de confidențialitate sau pentru a-ți exercita drepturile, te rugăm să ne contactezi la:')}{' '}
                    <a href={`mailto:${t('privacy.section8.email', 'privacy@farme.ro')}`} className="text-primary hover:underline font-medium">
                      {t('privacy.section8.email', 'privacy@farme.ro')}
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
