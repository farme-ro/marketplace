/**
 * Producer Impact Page
 * 
 * Pagină shell pentru impact social și comunitar
 * Modulul este în curs de dezvoltare.
 */

'use client'

import { EmptyState } from '@/components/ui/empty-state'
import { Heart } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export default function ProducerImpactPage() {
  const { t } = useI18n()
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
          {t('producer.impact.title', 'Impact social & comunitar')}
        </h1>
        <p className="text-muted-foreground max-w-prose">
          {t('producer.impact.description', 'În viitor, aici vei putea vedea cum contribuie activitatea ta la comunitate: comenzi locale, produse salvate de la risipă, proiecte sociale și inițiative susținute pe Farmero.')}
        </p>
      </div>

      <EmptyState
        icon={Heart}
        title={t('producer.impact.emptyTitle', 'Modulul de impact social este în pregătire')}
        description={t('producer.impact.emptyDescription', 'În curând vei putea vedea cum contribuie activitatea ta la comunitate: comenzi locale, produse salvate de la risipă, proiecte sociale și inițiative susținute pe Farmero.')}
        card={true}
        size="md"
      />
    </div>
  )
}

