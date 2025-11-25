/**
 * Checkout Responsibility Component
 * 
 * Secțiunea "Responsabilitatea ta contează"
 */

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n/context'

const ZeroWasteIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
)

const SolidarityIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
)

const CommunityIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
)

export function CheckoutResponsibility() {
  const { t } = useI18n()
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mt-8"
    >
      <Card className="border-2 border-border/60 rounded-2xl shadow-lg bg-gradient-to-br from-emerald-50/50 to-amber-50/50 dark:from-emerald-950/20 dark:to-amber-950/20">
        <CardContent className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-foreground">
              {t('checkout.responsibility.title', 'Impactul tău contează')}
            </h3>
          </div>

          <p className="text-base text-muted-foreground leading-relaxed mb-6">
            {t('checkout.responsibility.description', 'Dacă o comandă nu este ridicată la timp, aceasta poate fi redirecționată către centre sociale sau persoane vulnerabile.')}
            <br />
            <strong className="text-foreground">{t('checkout.responsibility.highlight', 'Nu aruncăm alimente. Le transformăm în sprijin.')}</strong>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-card/60 rounded-xl border border-border/40">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                <ZeroWasteIcon className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-foreground">{t('checkout.responsibility.zeroWaste', 'Zero risipă')}</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-card/60 rounded-xl border border-border/40">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                <SolidarityIcon className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-foreground">{t('checkout.responsibility.solidarity', 'Solidaritate')}</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-card/60 rounded-xl border border-border/40">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0">
                <CommunityIcon className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-foreground">{t('checkout.responsibility.community', 'Comunitate')}</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border/40">
            <Link
              href="/cum-functioneaza-si-impact"
              className="text-sm text-primary hover:underline font-medium inline-flex items-center gap-1"
            >
              {t('checkout.responsibility.learnMore', 'Află mai multe despre impactul social →')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

