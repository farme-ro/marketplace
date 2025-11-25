/**
 * Producer Price Badge Component
 * 
 * Badge care indică că prețul este stabilit direct de producător
 */

'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils/cn'

interface ProducerPriceBadgeProps {
  variant?: 'default' | 'compact'
  showTooltip?: boolean
  className?: string
}

export function ProducerPriceBadge({
  variant = 'default',
  showTooltip = true,
  className,
}: ProducerPriceBadgeProps) {
  const [showTooltipState, setShowTooltipState] = useState(false)

  const text = variant === 'compact' ? 'Preț de producător' : 'Preț de producător'
  const tooltipText =
    'Acest preț este stabilit direct de producător, fără adaosuri de supermarket sau intermediari.'

  return (
    <div className={cn('relative inline-flex items-center', className)}>
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium',
          'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300',
          'border border-emerald-200 dark:border-emerald-800/50',
          'transition-all duration-200 hover:shadow-sm'
        )}
        onMouseEnter={() => showTooltip && setShowTooltipState(true)}
        onMouseLeave={() => setShowTooltipState(false)}
      >
        <span className="text-emerald-600 dark:text-emerald-400">🟢</span>
        {text}
      </span>

      {showTooltip && showTooltipState && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50"
          onMouseEnter={() => setShowTooltipState(true)}
          onMouseLeave={() => setShowTooltipState(false)}
        >
          <div className="bg-foreground text-background px-3 py-2 rounded-lg text-xs max-w-[200px] shadow-lg">
            <p>{tooltipText}</p>
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
              <div className="w-2 h-2 bg-foreground rotate-45" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

