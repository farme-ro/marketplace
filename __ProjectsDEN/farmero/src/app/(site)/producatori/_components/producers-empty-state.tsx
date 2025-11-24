/**
 * Producers Empty State Component
 * 
 * Empty state când nu se găsesc producători
 */

'use client'

import { Button } from 'farme-ui'
import { useI18n } from '@/lib/i18n/context'

interface ProducersEmptyStateProps {
  onResetFilters: () => void
}

export function ProducersEmptyState({ onResetFilters }: ProducersEmptyStateProps) {
  const { t } = useI18n()
  return (
    <div className="text-center py-12 md:py-16">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <svg className="w-10 h-10 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H3" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
        {t('emptyStates.producers.title', 'Nu am găsit producători pentru filtrele selectate')}
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
        {t('emptyStates.producers.description', 'Resetează filtrele sau încearcă o altă regiune.')}
      </p>
      <Button
        onClick={onResetFilters}
        variant="outline"
        className="rounded-xl"
      >
        {t('emptyStates.producers.resetFilters', 'Resetează filtrele')}
      </Button>
    </div>
  )
}

