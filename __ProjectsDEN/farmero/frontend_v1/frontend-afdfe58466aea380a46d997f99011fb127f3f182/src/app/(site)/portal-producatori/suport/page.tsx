/**
 * Producer Support Page
 * 
 * Pagină de suport pentru producători
 */

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, Button } from 'farme-ui'
import { ProducerDashboardLayout } from '@/components/producer-portal/producer-dashboard-layout'
import { submitSupportTicket, type SupportTicketSubject } from '@/lib/api/producer/support'
import { useI18n } from '@/lib/i18n/context'
import { MessageCircle, Mail, HelpCircle, BookOpen, Send, Upload, AlertCircle } from 'lucide-react'

export default function ProducerSupportPage() {
  const { t } = useI18n()

  const subjectOptions: { value: SupportTicketSubject; label: string }[] = [
    { value: 'order_issues', label: t('producer.support.subjectOrderIssues', 'Probleme comenzi') },
    { value: 'payment_issues', label: t('producer.support.subjectPaymentIssues', 'Probleme plăți') },
    { value: 'product_issues', label: t('producer.support.subjectProductIssues', 'Probleme produse') },
    { value: 'suggestions', label: t('producer.support.subjectSuggestions', 'Sugestii / feedback') },
    { value: 'other', label: t('producer.support.subjectOther', 'Altele') },
  ]

  const faqItems = [
    {
      question: t('producer.support.faqAddProduct.question', 'Cum adaug un produs nou?'),
      answer: t('producer.support.faqAddProduct.answer', 'Mergi la secțiunea Produse din dashboard și apasă butonul "Adaugă produs nou". Completează informațiile despre produs și salvează.'),
    },
    {
      question: t('producer.support.faqManageOrders.question', 'Cum gestionez comenzile?'),
      answer: t('producer.support.faqManageOrders.answer', 'Toate comenzile tale apar în secțiunea Comenzi. Poți confirma, marca ca trimisă sau livrată direct din dashboard.'),
    },
    {
      question: t('producer.support.faqCommission.question', 'Cum funcționează comisionul?'),
      answer: t('producer.support.faqCommission.answer', 'Comisionul este calculat din vânzările efectiv plătite. Pe măsură ce vinzi mai mult, comisionul scade. Vezi detalii în secțiunea Comisioane.'),
    },
    {
      question: t('producer.support.faqUncollected.question', 'Ce se întâmplă cu comenzile neridicate?'),
      answer: t('producer.support.faqUncollected.answer', 'Platforma gestionează redirecționarea către donații (acolo unde este posibil). Tu nu rămâi cu marfa stricată.'),
    },
  ]
  const [formData, setFormData] = useState({
    subject: '' as SupportTicketSubject | '',
    priority: 'normal' as 'normal' | 'high',
    description: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.subject || !formData.description) {
      setError(t('producer.support.errorRequired', 'Completează toate câmpurile obligatorii.'))
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await submitSupportTicket({
        subject: formData.subject as SupportTicketSubject,
        priority: formData.priority,
        description: formData.description,
      })
      setIsSubmitted(true)
    } catch (err: any) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Error submitting support ticket:', err)
      }
      setError(err.message || t('producer.support.errorSubmit', 'Eroare la trimiterea mesajului. Te rugăm să încerci din nou.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ProducerDashboardLayout>
      <div className="max-w-8xl mx-auto px-4 py-10 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
            {t('producer.support.title', 'Suport Producători')}
          </h1>
          <p className="text-base text-foreground-body">
            {t('producer.support.description', 'Ajutor și asistență pentru producători')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Form */}
          <Card className="border border-border rounded-2xl shadow-sm bg-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">
                  {t('producer.support.sendMessage', 'Trimite un mesaj')}
                </h2>
              </div>

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                      {t('producer.support.subject', 'Subiect')} <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value as SupportTicketSubject })}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">{t('producer.support.selectSubject', 'Selectează un subiect')}</option>
                      {subjectOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-foreground mb-2">
                      {t('producer.support.priority', 'Prioritate')}
                    </label>
                    <select
                      id="priority"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'normal' | 'high' })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="normal">{t('producer.support.priorityNormal', 'Normal')}</option>
                      <option value="high">{t('producer.support.priorityHigh', 'Ridicată')}</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                      {t('producer.support.descriptionLabel', 'Descriere detaliată')} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      placeholder={t('producer.support.descriptionPlaceholder', 'Descrie problema sau întrebarea ta în detaliu...')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('producer.support.attachment', 'Atașament (opțional)')}
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => {
                        // File upload functionality will be implemented when backend supports it
                        // For now, users can describe the issue in the message field
                        alert(t('producer.support.uploadComingSoon', 'Funcționalitatea de upload fișier va fi disponibilă în curând.'))
                      }}
                    >
                      <Upload className="w-4 h-4" />
                      {t('producer.support.selectFile', 'Selectează fișier')}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('producer.support.attachmentHint', 'Poți atașa screenshot-uri sau documente relevante (max 5MB)')}
                    </p>
                  </div>

                  <Button type="submit" size="lg" className="w-full gap-2" disabled={isSubmitting}>
                    <Send className="w-4 h-4" />
                    {isSubmitting ? t('producer.support.submitting', 'Se trimite...') : t('producer.support.submit', 'Trimite mesaj')}
                  </Button>
                </form>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-50 dark:bg-green-950/20 flex items-center justify-center">
                    <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t('producer.support.submitted', 'Mesaj trimis!')}
                  </h3>
                  <p className="text-sm text-foreground-body mb-4">
                    {t('producer.support.submittedMessage', 'Vom răspunde în cel mai scurt timp posibil.')}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsSubmitted(false)
                      setFormData({ subject: '', priority: 'normal', description: '' })
                      setError(null)
                    }}
                  >
                    {t('producer.support.submitAnother', 'Trimite alt mesaj')}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Links & FAQ */}
          <div className="space-y-6">
            {/* Email Support */}
            <Card className="border border-border rounded-2xl shadow-sm bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">
                    {t('producer.support.emailSupport', 'Email suport')}
                  </h2>
                </div>
                <a
                  href="mailto:support@farme.ro"
                  className="text-sm text-primary hover:underline"
                >
                  support@farme.ro
                </a>
                <p className="text-xs text-muted-foreground mt-2">
                  {t('producer.support.emailResponse', 'Răspundem în maximum 24 de ore')}
                </p>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="border border-border rounded-2xl shadow-sm bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">
                    {t('producer.support.usefulResources', 'Resurse utile')}
                  </h2>
                </div>
                <div className="space-y-2">
                  <Link 
                    href="/cum-functioneaza-si-impact"
                    className="inline-flex items-center justify-start w-full rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                  >
                    {t('producer.support.linkHowItWorks', 'Cum funcționează farme.ro')}
                  </Link>
                  <Link 
                    href="/portal-producatori/ghid-livrare"
                    className="inline-flex items-center justify-start w-full rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                  >
                    {t('producer.support.linkShippingGuide', 'Ghid livrări & logistică')}
                  </Link>
                  <Link 
                    href="/portal-producatori/comisioane"
                    className="inline-flex items-center justify-start w-full rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                  >
                    {t('producer.support.linkCommissions', 'Comisioane & abonamente')}
                  </Link>
                  <Link 
                    href="/contact"
                    className="inline-flex items-center justify-start w-full rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                  >
                    {t('producer.support.linkContact', 'Contact general')}
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card className="border border-border rounded-2xl shadow-sm bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">
                    {t('producer.support.faq', 'Întrebări frecvente')}
                  </h2>
                </div>
                <div className="space-y-4">
                  {faqItems.map((item, index) => (
                    <div key={index} className="border-b border-border last:border-0 pb-4 last:pb-0">
                      <p className="text-sm font-medium text-foreground mb-1">
                        {item.question}
                      </p>
                      <p className="text-xs text-foreground-body">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProducerDashboardLayout>
  )
}

