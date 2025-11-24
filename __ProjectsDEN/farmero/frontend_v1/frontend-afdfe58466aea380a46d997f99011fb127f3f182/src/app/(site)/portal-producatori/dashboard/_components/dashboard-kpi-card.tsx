/**
 * Dashboard KPI Card Component
 * 
 * Card îmbunătățit pentru afișarea unui KPI în dashboard cu trend indicators și acțiuni rapide
 */

'use client'

import { Card, CardContent } from 'farme-ui'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface DashboardKpiCardProps {
  label: string
  value: string | number
  icon?: string
  color?: string
  trend?: {
    value: string
    isPositive: boolean
    period?: string
  }
  description?: string
  actionHref?: string
  actionLabel?: string
}

export function DashboardKpiCard({
  label,
  value,
  icon,
  color = 'from-primary-soft/30 to-primary-bg/20',
  trend,
  description,
  actionHref,
  actionLabel,
}: DashboardKpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="h-full"
    >
      <Card className={`rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br ${color} h-full flex flex-col`}>
        <CardContent className="p-6 flex flex-col gap-3 flex-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-1">
                {label}
              </p>
              {description && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {description}
                </p>
              )}
            </div>
            {icon && (
              <div className="w-12 h-12 rounded-2xl bg-white/50 dark:bg-slate-800/50 flex items-center justify-center text-2xl flex-shrink-0">
                {icon}
              </div>
            )}
          </div>
          
          <div className="flex items-baseline gap-2">
            <p className="text-2xl md:text-3xl font-bold text-foreground">
              {value}
            </p>
            {trend && (
              <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                trend.isPositive
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-red-500/10 text-red-600 dark:text-red-400'
              }`}>
                <span>{trend.isPositive ? '↑' : '↓'}</span>
                <span>{trend.value}</span>
                {trend.period && (
                  <span className="text-[10px] opacity-70">vs {trend.period}</span>
                )}
              </div>
            )}
          </div>

          {actionHref && actionLabel && (
            <Link href={actionHref} className="mt-auto pt-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full text-xs font-medium text-primary hover:text-primary-hover transition-colors text-left"
              >
                {actionLabel} →
              </motion.button>
            </Link>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

