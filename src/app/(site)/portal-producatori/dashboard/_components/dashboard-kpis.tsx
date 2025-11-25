/**
 * Dashboard KPIs Component
 * 
 * Secțiunea cu metrici principale (Top KPIs)
 */

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'
import { spacing } from '@/lib/design-system/spacing'
import { cn } from '@/lib/utils/cn'
// Using react-icons instead of lucide-react for compatibility
import { TrendingUp, PackageSearch, ShoppingBasket, Star, Truck } from 'lucide-react'

interface KPIData {
  label: string
  value: string | number
  sublabel?: string
  icon: React.ComponentType<{ className?: string }>
  trend?: {
    value: string
    isPositive: boolean
  }
}

interface DashboardKPIsProps {
  kpis?: KPIData[]
}

export function DashboardKPIs({ kpis }: DashboardKPIsProps) {
  return (
    <section className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4", spacing.grid.gap, "mb-6 lg:mb-8")}>
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
          >
            <Card className="border border-border/60 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 bg-card h-full">
              <CardContent className="p-5 lg:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  {kpi.trend && (
                    <span
                      className={`text-xs font-medium ${
                        kpi.trend.isPositive ? 'text-primary' : 'text-destructive'
                      }`}
                    >
                      {kpi.trend.value}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-2xl md:text-3xl font-bold text-foreground">
                    {kpi.value}
                  </p>
                  <p className="text-xs md:text-sm text-foreground-body font-medium">
                    {kpi.label}
                  </p>
                  {kpi.sublabel && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {kpi.sublabel}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </section>
  )
}

