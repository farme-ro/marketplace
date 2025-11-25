'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'
import { useI18n } from '@/lib/i18n/context'
import Link from 'next/link'
import { Heart } from 'lucide-react'

export function NewsletterSection() {
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Note: Newsletter subscription will be integrated when backend API endpoint is available
    // Endpoint: POST /newsletter/subscribe
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    setEmail('')
    
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  return (
    <section className="py-16 md:py-24 bg-background">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gradient-to-br from-primary-bg/50 to-primary-soft/30 rounded-[32px] shadow-premium border border-border p-8 md:p-12">
            <div className="text-center space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                {t('home.newsletter.title', 'Primește oferte direct de la producători')}
              </h2>
              <p className="text-base md:text-lg text-foreground-body max-w-xl mx-auto leading-relaxed">
                {t('home.newsletter.subtitle', 'Reduceri exclusive, rețete tradiționale și noutăți despre producători noi. Fără spam, doar conținut valoros.')}
              </p>
              
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center mt-6 max-w-lg mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('home.newsletter.placeholder', 'Adresa ta de email')}
                  required
                  disabled={isSubmitting || isSubmitted}
                  className="flex-1 rounded-full border-2 border-border bg-background px-6 py-3.5 text-base outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground placeholder:text-muted-foreground transition-all duration-300"
                />
                <button
                  type="submit"
                  disabled={isSubmitting || isSubmitted}
                  className="rounded-full bg-primary hover:bg-primary-hover text-primary-foreground px-8 py-3.5 text-base font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] shadow-premium"
                >
                  {isSubmitting ? t('home.newsletter.submitting', 'Se abonează...') : isSubmitted ? t('home.newsletter.submitted', 'Abonat!') : t('home.newsletter.submit', 'Abonează-mă')}
                </button>
              </form>
              
              {isSubmitted && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-primary mt-2 font-medium"
                >
                  {t('home.newsletter.success', '✓ Te-ai abonat cu succes!')}
                </motion.p>
              )}
              
              <p className="text-xs text-muted-foreground mt-6">
                {t('home.newsletter.privacy', 'Nu trimitem spam. Te poți dezabona oricând.')}
              </p>
              
              {/* Support Farmero Link */}
              <div className="mt-6 text-center">
                <Link
                  href="/sustine-farmero"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
                  aria-label={t('donations.supportLinkAria', 'Susține Farmero')}
                >
                  <Heart className="w-4 h-4" />
                  {t('donations.supportLink', 'Susține Farmero')}
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </PageContainer>
    </section>
  )
}
