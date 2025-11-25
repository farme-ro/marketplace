/**
 * Producer Impact and Trust Component
 * 
 * Secțiunea "Impact & relație cu clienții" din dashboard
 */

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

export function ProducerImpactAndTrust() {
  const benefits = [
    'Mai puține discuții despre comenzi întârziate',
    'Protecție în cazul comenzilor neridicate (platforma clarifică regulile cu clientul)',
    'Vizibilitate mai mare prin abonamente / promovare',
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-2 border-border/60 rounded-2xl shadow-lg bg-gradient-to-br from-rose-50/50 to-orange-50/50 dark:from-rose-950/20 dark:to-orange-950/20">
        <CardContent className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center border-2 border-rose-500/20">
              <span className="text-2xl">🤝</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Impact & relație cu clienții</h3>
            </div>
          </div>

          <p className="text-base text-muted-foreground leading-relaxed mb-6">
            Farmero te ajută să păstrezi o relație sănătoasă cu clienții: comunicare clară, livrări predictibile, zero surprize neplăcute.
          </p>

          <ul className="space-y-3">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-500/20">
                  <CheckIcon className="w-4 h-4" />
                </div>
                <span className="text-sm text-foreground leading-relaxed">{benefit}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  )
}

