/**
 * Subscription Plans Section
 * 
 * Secțiunea cu abonamente pentru producători
 * Folosește config din commission-model.ts
 */

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, Button } from 'farme-ui'
import { PRODUCER_SUBSCRIPTIONS } from '@/lib/config/commission-model'
import { Check } from 'lucide-react'

export function SubscriptionPlansSection() {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Abonamente opționale (vizibilitate & instrumente)
          </h2>
          <p className="mt-1 text-sm text-foreground-body leading-relaxed">
            Abonamentele sunt opționale – pentru mai multă vizibilitate, nu obligații.
            Nu schimbă comisionul de bază, îl îmbunătățește prin volum și vizibilitate.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {PRODUCER_SUBSCRIPTIONS.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="border border-border rounded-2xl shadow-premium bg-card h-full flex flex-col">
              <CardContent className="p-6 flex flex-col flex-1">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                    {plan.highlight && (
                      <span className="rounded-full bg-primary-soft/30 border border-primary/20 px-2.5 py-0.5 text-[10px] font-medium text-primary">
                        {plan.highlight}
                      </span>
                    )}
                  </div>
                  <div className="mb-3">
                    <span className="text-3xl font-bold text-foreground">
                      {plan.price === 0 ? 'Gratuit' : `${plan.price} ${plan.currency}/lună`}
                    </span>
                  </div>
                </div>

                <ul className="mt-4 space-y-2 text-sm text-foreground-body">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center">
                    Nu schimbă comisionul de bază – îl îmbunătățește prin volum și vizibilitate
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Link
          href="/portal-producatori/comisioane#commission-calculation"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          Află cum se calculează comisionul
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          Contactează-ne pentru un plan personalizat
        </Link>
      </div>
    </section>
  )
}

