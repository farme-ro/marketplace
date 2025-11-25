/**
 * Producer Products Overview Component
 * 
 * Secțiunea "Produse & stoc" din dashboard
 */

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent } from 'farme-ui'
import { Button } from 'farme-ui'

interface ProducerProductsOverviewProps {
  activeProducts?: number
  inactiveProducts?: number
}

export function ProducerProductsOverview({
  activeProducts = 0,
  inactiveProducts = 0,
}: ProducerProductsOverviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <Card className="border-2 border-border/60 rounded-2xl shadow-lg">
        <CardContent className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border-2 border-emerald-500/20">
              <span className="text-2xl">📦</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Produse & stoc</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800/40">
              <p className="text-sm text-muted-foreground mb-1">Produse active</p>
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {activeProducts}
              </p>
            </div>
            <div className="p-4 bg-muted rounded-xl border border-border/60">
              <p className="text-sm text-muted-foreground mb-1">Produse inactive</p>
              <p className="text-3xl font-bold text-foreground">
                {inactiveProducts}
              </p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Poți dezactiva oricând produsele pe care nu le mai ai în stoc. Clienții văd doar ce poți livra acum.
          </p>

          <Link href="/portal-producatori/produse">
            <Button size="lg" className="w-full sm:w-auto">
              Gestionează produsele
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  )
}

