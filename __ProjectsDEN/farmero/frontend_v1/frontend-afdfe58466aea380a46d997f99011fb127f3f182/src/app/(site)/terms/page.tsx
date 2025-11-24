/**
 * Terms and Conditions Page
 * 
 * Pagină cu termenii și condițiile de utilizare
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'
import { useI18n } from '@/lib/i18n/context'
import { formatDate } from '@/lib/utils/format'

export default function TermsPage() {
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
            {t('terms.title', 'Termeni și condiții')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary via-primary to-primary rounded-full mx-auto mb-6" />
          <p className="text-sm md:text-base text-muted-foreground">
            {t('terms.lastUpdated', 'Ultima actualizare')}: {formattedDate || formatDate(new Date(), 'ro', { year: 'numeric', month: 'long', day: 'numeric' })}
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
                  <h2 className="text-2xl font-semibold text-foreground mb-4">{t('terms.section1.title', '1. Acceptarea termenilor')}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('terms.section1.content', 'Prin accesarea și utilizarea platformei farme.ro, accepti să fii legat de acești termeni și condiții. Dacă nu ești de acord cu oricare dintre acești termeni, te rugăm să nu utilizezi platforma.')}
                  </p>
                </motion.section>

                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-foreground mb-4">{t('terms.section2.title', '2. Utilizarea platformei')}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {t('terms.section2.content', 'farme.ro este o platformă online care conectează producătorii de produse agricole tradiționale cu clienții. Platforma este destinată utilizării legale și în conformitate cu toate legile și reglementările aplicabile.')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>{t('terms.section2.list1', 'Nu poți utiliza platforma în scopuri ilegale sau frauduloase')}</li>
                    <li>{t('terms.section2.list2', 'Nu poți încerca să accesezi zone restricționate ale platformei')}</li>
                    <li>{t('terms.section2.list3', 'Nu poți utiliza platforma pentru a transmite malware sau cod dăunător')}</li>
                    <li>{t('terms.section2.list4', 'Ești responsabil pentru toate activitățile care au loc sub contul tău')}</li>
                  </ul>
                </motion.section>

                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-foreground mb-4">{t('terms.section3.title', '3. Conturi de utilizator')}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {t('terms.section3.content', 'Pentru a utiliza anumite funcționalități ale platformei, poți fi nevoit să creezi un cont. Ești responsabil pentru:')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>{t('terms.section3.list1', 'Menținerea confidențialității informațiilor de conectare')}</li>
                    <li>{t('terms.section3.list2', 'Toate activitățile care au loc sub contul tău')}</li>
                    <li>{t('terms.section3.list3', 'Notificarea imediată a oricărei utilizări neautorizate a contului tău')}</li>
                  </ul>
                </motion.section>

                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-foreground mb-4">{t('terms.section4.title', '4. Produse și comenzi')}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {t('terms.section4.content', 'farme.ro acționează ca intermediar între producători și clienți. Nu suntem responsabili pentru:')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>{t('terms.section4.list1', 'Calitatea produselor vândute de producători')}</li>
                    <li>{t('terms.section4.list2', 'Livrarea produselor (responsabilitatea producătorului)')}</li>
                    <li>{t('terms.section4.list3', 'Orice dispută între producători și clienți')}</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    {t('terms.section4.note', 'Toate comenzile sunt supuse disponibilității produselor și confirmării de către producător.')}
                  </p>
                </motion.section>

                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-foreground mb-4">{t('terms.section5.title', '5. Plăți')}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('terms.section5.content', 'Plățile pentru produse sunt procesate prin intermediul unor servicii terțe sigure. farme.ro nu stochează informații despre cardurile de credit sau metodele de plată.')}
                  </p>
                </motion.section>

                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-foreground mb-4">{t('terms.section6.title', '6. Proprietate intelectuală')}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('terms.section6.content', 'Toate conținuturile platformei, inclusiv texte, imagini, logo-uri și design, sunt proprietatea farme.ro sau a licențiatorilor săi și sunt protejate de legile privind drepturile de autor.')}
                  </p>
                </motion.section>

                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-foreground mb-4">{t('terms.section7.title', '7. Limitarea răspunderii')}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {t('terms.section7.content', 'farme.ro nu este responsabil pentru:')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>{t('terms.section7.list1', 'Daune directe, indirecte, accidentale sau consecvente rezultate din utilizarea platformei')}</li>
                    <li>{t('terms.section7.list2', 'Pierzări de date sau întreruperi ale serviciului')}</li>
                    <li>{t('terms.section7.list3', 'Acțiuni ale terților, inclusiv producători sau furnizori de servicii')}</li>
                  </ul>
                </motion.section>

                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-foreground mb-4">{t('terms.section8.title', '8. Modificări ale termenilor')}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('terms.section8.content', 'Ne rezervăm dreptul de a modifica acești termeni și condiții în orice moment. Modificările vor intra în vigoare imediat ce sunt publicate pe platformă. Continuarea utilizării platformei după modificări constituie acceptarea noilor termeni.')}
                  </p>
                </motion.section>

                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-foreground mb-4">{t('terms.section9.title', '9. Contact')}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('terms.section9.content', 'Pentru întrebări despre acești termeni și condiții, te rugăm să ne contactezi la:')}{' '}
                    <a href={`mailto:${t('terms.section9.email', 'contact@farme.ro')}`} className="text-primary hover:underline font-medium">
                      {t('terms.section9.email', 'contact@farme.ro')}
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
