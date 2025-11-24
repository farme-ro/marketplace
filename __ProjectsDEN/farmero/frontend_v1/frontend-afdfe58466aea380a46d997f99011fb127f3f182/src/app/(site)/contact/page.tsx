/**
 * Contact Page
 * 
 * Pagină de contact cu formular și informații de contact
 */

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'
import { Button } from 'farme-ui'
import { Input } from 'farme-ui'
import { Textarea } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'
import { useI18n } from '@/lib/i18n/context'

export default function ContactPage() {
  const { t } = useI18n()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    // Submit contact form
    try {
      const { submitContactForm } = await import('@/lib/api/contact')
      await submitContactForm(formData)
      setSubmitStatus('success')
    } catch (error) {
      console.error('Error submitting contact form:', error)
      setSubmitStatus('error')
      return
    }
    setIsSubmitting(false)
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2],
            x: [0, 50],
            y: [0, 30],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-40 h-40 bg-emerald-200/20 dark:bg-emerald-800/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3],
            x: [0, -40],
            y: [0, -20],
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center max-w-3xl mx-auto"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-4">
            {t('nav.contactPage.title', 'Contactează-ne')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary via-primary to-primary rounded-full mx-auto mb-6" />
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            {t('nav.contactPage.subtitle', 'Ai întrebări? Suntem aici să te ajutăm. Trimite-ne un mesaj și îți vom răspunde în cel mai scurt timp.')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            <Card className="border-border/60 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-8 md:p-10">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">{t('nav.contactPage.email', 'Email')}</h3>
                    </div>
                    <a 
                      href="mailto:contact@farme.ro" 
                      className="text-primary hover:underline font-medium"
                    >
                      contact@farme.ro
                    </a>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">{t('nav.contactPage.schedule', 'Program')}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {t('nav.contactPage.scheduleWeekdays', 'Luni - Vineri: 9:00 - 18:00')}<br />
                      {t('nav.contactPage.scheduleWeekend', 'Sâmbătă - Duminică: Închis')}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">{t('nav.contactPage.response', 'Răspuns')}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {t('nav.contactPage.responseTime', 'Răspundem la toate mesajele în maximum 24 de ore.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 bg-muted/30">
              <CardContent className="p-8 md:p-10">
                <h3 className="text-xl font-semibold text-foreground mb-4">{t('nav.contactPage.support', 'Suport')}</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
                  {t('nav.contactPage.supportDescription', 'Pentru întrebări despre comenzi, produse sau contul tău, te rugăm să folosești formularul de contact.')}
                </p>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {t('nav.contactPage.supportProducers', 'Pentru producători:')}{' '}
                  <a href="/for-producers" className="text-primary hover:underline font-medium">
                    {t('nav.contactPage.supportProducersLink', 'Vezi pagina pentru producători')}
                  </a>
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-border/60 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-8 md:p-10">
                <h2 className="text-2xl font-semibold text-foreground mb-6">{t('nav.contactPage.formTitle', 'Trimite un mesaj')}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      {t('nav.contactPage.formName', 'Nume complet')}
                    </label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder={t('nav.contactPage.formNamePlaceholder', 'Ion Popescu')}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      {t('nav.contactPage.formEmail', 'Email')}
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder={t('nav.contactPage.formEmailPlaceholder', 'ion@example.com')}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                      {t('nav.contactPage.formSubject', 'Subiect')}
                    </label>
                    <Input
                      id="subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      placeholder={t('nav.contactPage.formSubjectPlaceholder', 'Despre ce este mesajul tău?')}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      {t('nav.contactPage.formMessage', 'Mesaj')}
                    </label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={6}
                      placeholder={t('nav.contactPage.formMessagePlaceholder', 'Scrie mesajul tău aici...')}
                      className="w-full"
                    />
                  </div>

                  {submitStatus === 'success' && (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-800 dark:text-emerald-200 text-sm">
                      {t('nav.contactPage.formSuccess', '✓ Mesajul tău a fost trimis cu succes! Vom răspunde în cel mai scurt timp.')}
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-sm">
                      {t('nav.contactPage.formError', '✗ A apărut o eroare. Te rugăm să încerci din nou.')}
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t('nav.contactPage.formSubmitting', 'Se trimite...') : t('nav.contactPage.formSubmit', 'Trimite mesaj')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </PageContainer>
    </section>
  )
}
