/**
 * Producer Dashboard KPIs Component
 * 
 * Carduri KPI principale pentru dashboard
 */

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'

interface KPI {
  label: string
  value: string | number
  icon: string
  color: string
  description?: string
  trend?: {
    value: string
    isPositive: boolean
  }
}

interface ProducerDashboardKPIsProps {
  kpis?: KPI[]
}

const defaultKPIs: KPI[] = [
  {
    label: 'Venit total luna curentă',
    value: '0 lei',
    icon: '💰',
    color: 'from-emerald-500/10 to-emerald-600/5',
  },
  {
    label: 'Comenzi luna curentă',
    value: 0,
    icon: '🧺',
    color: 'from-amber-500/10 to-amber-600/5',
  },
  {
    label: 'Produse active',
    value: 0,
    icon: '📦',
    color: 'from-orange-500/10 to-orange-600/5',
  },
  {
    label: 'Rata de livrare',
    value: '100%',
    icon: '🔄',
    color: 'from-primary/10 to-primary/5',
  },
]

export function ProducerDashboardKPIs({ kpis = defaultKPIs }: ProducerDashboardKPIsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpis.map((kpi, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          whileHover={{ scale: 1.02, y: -4 }}
        >
          <Card className="border border-border rounded-[32px] shadow-premium hover:shadow-premium-lg transition-all duration-300 bg-card h-full">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary-soft flex items-center justify-center text-2xl">
                  {kpi.icon}
                </div>
                {kpi.trend && (
                  <div className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    kpi.trend.isPositive
                      ? 'bg-primary-soft text-primary'
                      : 'bg-destructive/10 text-destructive'
                  }`}>
                    {kpi.trend.isPositive ? '↑' : '↓'} {kpi.trend.value}
                  </div>
                )}
              </div>
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {kpi.value}
              </div>
              <p className="text-sm md:text-base text-foreground-body leading-relaxed">
                {kpi.label}
                {kpi.description && (
                  <span className="block text-xs text-muted-foreground mt-1">{kpi.description}</span>
                )}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

