/**
 * Producers Error State Component
 * 
 * Error state când apare o problemă la încărcarea producătorilor
 */

'use client'

import { Button } from 'farme-ui'
import { useI18n } from '@/lib/i18n/context'

interface ProducersErrorStateProps {
  onRetry: () => void
}

export function ProducersErrorState({ onRetry }: ProducersErrorStateProps) {
  const { t } = useI18n()
  return (
    <div className="text-center py-12 md:py-16">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
        <svg className="w-10 h-10 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
        {t('producers.errors.loadFailed', 'A apărut o problemă la încărcarea producătorilor')}
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
        {t('producers.errors.retryMessage', 'Te rugăm să încerci din nou în câteva momente.')}
      </p>
      <Button
        onClick={onRetry}
        className="rounded-xl bg-[#3BAF6A] hover:bg-[#2d8f54] dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-900"
      >
        {t('producers.errors.retry', 'Reîncearcă')}
      </Button>
    </div>
  )
}

