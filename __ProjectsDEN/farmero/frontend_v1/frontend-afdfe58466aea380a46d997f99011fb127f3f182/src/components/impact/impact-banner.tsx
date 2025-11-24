/**
 * Impact Banner Component
 * 
 * Banda informativă pentru coș și checkout cu mesaj de impact social
 */

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'
import { cn } from '@/lib/utils/cn'

interface ImpactBannerProps {
  context?: 'cart' | 'checkout' | 'product'
  className?: string
}

const contextTexts = {
  cart: {
    title: 'Fiecare comandă are un impact',
    description: (
      <>
        <p className="mb-2">
          <strong>Susții direct producători locali.</strong>
        </p>
        <p className="text-sm">
          În cazurile în care comanda nu mai poate fi livrată la timp, încercăm să redirecționăm produsele spre donații (acolo unde este posibil), nu la gunoi.
        </p>
      </>
    ),
  },
  checkout: {
    title: 'Fiecare comandă are un impact',
    description: (
      <>
        <p className="mb-2">
          <strong>Susții direct producători locali.</strong>
        </p>
        <p className="text-sm">
          În cazurile în care comanda nu este ridicată la timp, încercăm să redirecționăm produsele spre donații (acolo unde este posibil), nu la gunoi. Vezi mai multe despre{' '}
          <a href="/how-it-works" className="underline hover:no-underline font-medium">
            cum funcționează
          </a>.
        </p>
      </>
    ),
  },
  product: {
    title: 'Comanda ta susține producători locali',
    description: (
      <p className="text-sm">
        Cumpărând de aici, ajuți producătorul să vândă direct, fără intermediari în plus.
      </p>
    ),
  },
}

export function ImpactBanner({ context = 'cart', className }: ImpactBannerProps) {
  const content = contextTexts[context]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn('w-full', className)}
    >
      <Card className="border-2 border-emerald-200 dark:border-emerald-800/50 rounded-xl shadow-sm bg-gradient-to-br from-emerald-50/50 to-green-50/30 dark:from-emerald-950/20 dark:to-green-950/20">
        <CardContent className="p-4 md:p-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 border border-emerald-500/20">
              <span className="text-lg">🤝</span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground mb-2 text-sm md:text-base">
                {content.title}
              </h4>
              <div className="text-muted-foreground leading-relaxed">
                {content.description}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

