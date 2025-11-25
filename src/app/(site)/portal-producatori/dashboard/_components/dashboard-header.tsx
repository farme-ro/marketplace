/**
 * Dashboard Header Component
 * 
 * Header-ul paginii dashboard cu welcome message și badge abonament
 */

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from 'farme-ui'

interface DashboardHeaderProps {
  producerName?: string
  currentPlan?: string
}

export function DashboardHeader({ producerName, currentPlan }: DashboardHeaderProps) {
  return (
    <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6 lg:mb-8">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground">
          Bun venit{producerName ? `, ${producerName}` : ' în portalul tău'}
        </h1>
        <p className="text-sm md:text-base text-foreground-body leading-relaxed">
          Vezi dintr-o privire vânzările, comenzile și produsele tale.
        </p>
      </div>
      {currentPlan && (
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary-soft/30 px-3 py-1 text-xs font-medium text-primary">
          Plan: {currentPlan}
        </div>
      )}
    </section>
  )
}

