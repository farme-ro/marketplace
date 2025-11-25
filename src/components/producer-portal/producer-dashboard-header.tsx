/**
 * Producer Dashboard Header Component
 * 
 * Header premium cu salut personalizat și status badges
 */

'use client'

import { motion } from 'framer-motion'

interface ProducerDashboardHeaderProps {
  producerName?: string
  isVerified?: boolean
  currentCommission?: string
  currentPlan?: string
}

export function ProducerDashboardHeader({ 
  producerName = 'Ferma Popescu',
  isVerified = true,
  currentCommission = '8%',
  currentPlan = 'Starter+'
}: ProducerDashboardHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
            Salut, {producerName} 👋
          </h1>
          <p className="text-base md:text-lg text-foreground-body leading-relaxed">
            Iată ce se întâmplă în ferma ta azi
          </p>
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex flex-wrap items-center gap-3">
        {isVerified && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-soft rounded-full border border-primary/20">
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium text-primary">Verificat</span>
          </div>
        )}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border">
          <span className="text-sm font-medium text-foreground-body">Comision curent:</span>
          <span className="text-sm font-bold text-primary">{currentCommission}</span>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border">
          <span className="text-sm font-medium text-foreground-body">Abonament activ:</span>
          <span className="text-sm font-bold text-primary">{currentPlan}</span>
        </div>
      </div>
    </motion.div>
  )
}

