/**
 * Trust Stack Component
 * 
 * Stack de badge-uri de încredere pentru afișare împreună
 */

'use client'

import { motion } from 'framer-motion'
import { TrustBadge, type TrustBadgeType } from './trust-badge'
import { cn } from '@/lib/utils/cn'

interface TrustStackProps {
  badges: TrustBadgeType[]
  variant?: 'default' | 'compact'
  layout?: 'horizontal' | 'vertical' | 'grid'
  className?: string
  showAll?: boolean
}

export function TrustStack({
  badges,
  variant = 'default',
  layout = 'horizontal',
  className,
  showAll = false,
}: TrustStackProps) {
  const displayBadges = showAll ? badges : badges.slice(0, 3)

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2',
        layout === 'vertical' && 'flex-col items-start',
        layout === 'grid' && 'grid grid-cols-2 gap-2',
        className
      )}
    >
      {displayBadges.map((badge, index) => (
        <motion.div
          key={badge}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <TrustBadge type={badge} variant={variant} />
        </motion.div>
      ))}
    </div>
  )
}

