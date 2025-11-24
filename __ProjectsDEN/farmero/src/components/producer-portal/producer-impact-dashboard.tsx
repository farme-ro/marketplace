/**
 * Producer Impact Dashboard Component
 * 
 * Mic dashboard cu impact social
 */

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'

interface ProducerImpactDashboardProps {
  donatedProducts?: number // kg
  familiesHelped?: number
  centersSupported?: number
}

export function ProducerImpactDashboard({
  donatedProducts = 12,
  familiesHelped = 5,
  centersSupported = 1,
}: ProducerImpactDashboardProps) {
  return (
    <Card className="border border-border rounded-[32px] shadow-premium bg-gradient-to-br from-primary-bg/50 to-primary-soft/30">
      <CardContent className="p-6 md:p-8">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-foreground mb-2">Impact Social</h3>
          <p className="text-base text-foreground-body">Munca ta contează.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Donated Products */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center p-6 bg-card rounded-2xl border border-border"
          >
            <div className="text-4xl mb-3">🍞</div>
            <p className="text-3xl font-bold text-foreground mb-1">{donatedProducts} kg</p>
            <p className="text-sm text-foreground-body">produse donate</p>
          </motion.div>

          {/* Families Helped */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-center p-6 bg-card rounded-2xl border border-border"
          >
            <div className="text-4xl mb-3">👨‍👩‍👧</div>
            <p className="text-3xl font-bold text-foreground mb-1">{familiesHelped}</p>
            <p className="text-sm text-foreground-body">familii ajutate</p>
          </motion.div>

          {/* Centers Supported */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-center p-6 bg-card rounded-2xl border border-border"
          >
            <div className="text-4xl mb-3">🏢</div>
            <p className="text-3xl font-bold text-foreground mb-1">{centersSupported}</p>
            <p className="text-sm text-foreground-body">centru sprijinit</p>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  )
}

