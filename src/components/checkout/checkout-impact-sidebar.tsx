/**
 * Checkout Impact Sidebar Component
 * 
 * Side panel block pentru checkout cu impactul comenzii
 */

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from 'farme-ui'
import { useI18n } from '@/lib/i18n/context'

export function CheckoutImpactSidebar() {
  const { t } = useI18n()
  
  const impactPoints = [
    {
      icon: '🌾',
      text: t('checkout.impactSidebar.supportDirect', 'Susții direct producători locali'),
    },
    {
      icon: '🌱',
      text: t('checkout.impactSidebar.reduceWaste', 'Reduci risipa alimentară'),
    },
    {
      icon: '🤝',
      text: t('checkout.impactSidebar.contributeDonations', 'Contribui la donații sociale'),
    },
  ]
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-4"
    >
      <Card className="border-2 border-emerald-200 dark:border-emerald-800/50 rounded-2xl shadow-lg bg-gradient-to-br from-emerald-50/50 to-green-50/30 dark:from-emerald-950/20 dark:to-green-950/20">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-foreground">
            {t('checkout.impactSidebar.title', 'Impactul comenzii tale')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-3">
            {impactPoints.map((point, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-start gap-3"
              >
                <span className="text-2xl flex-shrink-0">{point.icon}</span>
                <span className="text-sm text-muted-foreground leading-relaxed pt-1">
                  {point.text}
                </span>
              </motion.li>
            ))}
          </ul>

          <div className="pt-4 border-t border-border/40">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">{t('checkout.impactSidebar.pricesNote', 'Prețurile sunt stabilite de producători, nu de platformă.')}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs text-muted-foreground">
              {t('checkout.impactSidebar.securePayment', 'Plată 100% securizată')}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

