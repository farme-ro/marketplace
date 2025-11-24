/**
 * Commission Table Component
 * 
 * Tabel cu nivelurile de comision
 */

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'
import { COMMISSION_TIERS, type CommissionTier } from '@/lib/config/commissions-config'

export function CommissionTable() {
  return (
    <Card className="border-2 border-border/60 rounded-2xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Nivel
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Cifră vânzări lunare
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Comision
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Beneficii principale
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {COMMISSION_TIERS.map((tier, index) => (
              <motion.tr
                key={tier.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="hover:bg-muted/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <span className="text-base font-semibold text-foreground">
                    {tier.label}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-muted-foreground">
                    {tier.range}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-2xl font-bold text-primary">
                    {tier.rate}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <ul className="space-y-1">
                    {tier.features.slice(0, 2).map((feature, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        • {feature}
                      </li>
                    ))}
                  </ul>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

