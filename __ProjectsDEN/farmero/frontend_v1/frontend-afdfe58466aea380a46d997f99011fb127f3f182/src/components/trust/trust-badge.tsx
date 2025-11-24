/**
 * Trust Badge Component
 * 
 * Badge individual pentru elemente de încredere
 */

'use client'

import { cn } from '@/lib/utils/cn'

export type TrustBadgeType =
  | 'verified-producers'
  | 'producer-prices'
  | 'no-intermediaries'
  | 'social-impact'
  | 'secure-payment'

interface TrustBadgeProps {
  type: TrustBadgeType
  variant?: 'default' | 'compact'
  showIcon?: boolean
  className?: string
}

const trustConfig: Record<
  TrustBadgeType,
  {
    icon: string
    label: string
    description: string
    color: string
  }
> = {
  'verified-producers': {
    icon: '🛡️',
    label: 'Producători verificați',
    description: 'Toți producătorii sunt verificați și aprobați de echipa Farmero',
    color: 'from-blue-500/10 to-blue-600/5 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/50',
  },
  'producer-prices': {
    icon: '⚖️',
    label: 'Prețuri de producător',
    description: 'Preț stabilit direct de producător, fără adaosuri artificiale',
    color: 'from-emerald-500/10 to-emerald-600/5 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50',
  },
  'no-intermediaries': {
    icon: '🤝',
    label: 'Fără intermediari',
    description: 'Cumpărare directă de la producător, fără distribuitori sau supermarket-uri',
    color: 'from-primary/10 to-primary/20 text-primary border-primary/20',
  },
  'social-impact': {
    icon: '🌿',
    label: 'Impact social real',
    description: 'Produsele neridicate sunt redirecționate către donații, nu la gunoi',
    color: 'from-green-500/10 to-green-600/5 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800/50',
  },
  'secure-payment': {
    icon: '🔒',
    label: 'Plată sigură',
    description: 'Plăți securizate, fără taxe ascunse, fără surprize',
    color: 'from-purple-500/10 to-purple-600/5 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/50',
  },
}

export function TrustBadge({
  type,
  variant = 'default',
  showIcon = true,
  className,
}: TrustBadgeProps) {
  const config = trustConfig[type]

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium',
        'bg-gradient-to-br border',
        config.color,
        variant === 'compact' && 'px-2 py-1 text-[10px]',
        className
      )}
      title={config.description}
    >
      {showIcon && <span>{config.icon}</span>}
      <span>{config.label}</span>
    </div>
  )
}

