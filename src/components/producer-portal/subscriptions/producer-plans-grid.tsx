/**
 * Producer Plans Grid Component
 * 
 * Grid cu planurile de abonament pentru producători
 */

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from 'farme-ui'
import { Button } from 'farme-ui'
import { PRODUCER_SUBSCRIPTION_PLANS, type SubscriptionPlan } from '@/lib/config/subscriptions-config'

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

interface ProducerPlansGridProps {
  currentPlanId?: string
}

export function ProducerPlansGrid({ currentPlanId = 'starter' }: ProducerPlansGridProps) {
  const handlePlanSelect = (planId: string) => {
    // Note: Subscription plan selection will be integrated when backend API is available
    // Endpoint: POST /producers/subscriptions/upgrade
    // For now, shows "Coming soon" message to users
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
      {PRODUCER_SUBSCRIPTION_PLANS.map((plan, index) => {
        const isCurrentPlan = plan.id === currentPlanId
        const isPopular = plan.isPopular

        return (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`relative ${isPopular ? 'md:-mt-4 md:mb-4' : ''}`}
          >
            {isPopular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">
                  Cel mai popular
                </span>
              </div>
            )}
            <Card
              className={`border rounded-[32px] shadow-premium hover:shadow-premium-lg transition-all duration-300 h-full flex flex-col ${
                isCurrentPlan
                  ? 'border-primary bg-primary-bg'
                  : isPopular
                  ? 'border-secondary/30 bg-gradient-to-br from-secondary-soft/30 to-secondary/10'
                  : 'border-border bg-card'
              }`}
            >
              {isPopular && (
                <div className="h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-primary" />
              )}
              <CardHeader className="text-center pb-6 pt-8">
                <div className={`inline-block ${plan.badgeColor} px-4 py-1.5 rounded-full text-xs font-bold mb-6 border`}>
                  {plan.badge}
                </div>
                <CardTitle className="text-2xl md:text-3xl font-bold mb-4">
                  {plan.name}
                </CardTitle>
                <div className="space-y-1">
                  <p className="text-3xl md:text-4xl font-bold text-foreground">
                    {plan.price}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col px-6 pb-8">
                <ul className="space-y-3 flex-1 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-500/20">
                        <CheckIcon className="w-3 h-3" />
                      </div>
                      <span className="text-sm text-muted-foreground leading-relaxed flex-1">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button
                  size="lg"
                  className="w-full"
                  variant={isCurrentPlan ? 'outline' : 'default'}
                  disabled={isCurrentPlan}
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  {isCurrentPlan ? 'Plan activ' : 'Alege acest plan'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

