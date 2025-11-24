/**
 * Impact Badge Component
 * 
 * Badge mic, reutilizabil pentru mesaje de impact social
 */

'use client'

import { cn } from '@/lib/utils/cn'

interface ImpactBadgeProps {
  variant?: 'default' | 'eco' | 'social'
  className?: string
}

const variantTexts = {
  default: 'Comanda ta susține producători locali 🤝',
  eco: 'Comanda ta susține producători locali 🤝',
  social: 'Ajută la reducerea risipei alimentare 🌱',
}

export function ImpactBadge({ variant = 'default', className }: ImpactBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium',
        'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300',
        'border border-emerald-200 dark:border-emerald-800/50',
        className
      )}
    >
      {variantTexts[variant]}
    </span>
  )
}

