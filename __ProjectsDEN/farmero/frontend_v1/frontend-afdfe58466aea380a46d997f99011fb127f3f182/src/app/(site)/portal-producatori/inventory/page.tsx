/**
 * Producer Inventory Page
 * 
 * Pagină shell pentru gestionarea stocurilor și logisticii
 * Modulul este în curs de dezvoltare.
 */

'use client'

import { EmptyState } from '@/components/ui/empty-state'
import { Package } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export default function ProducerInventoryPage() {
  const { t } = useI18n()
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
          {t('producer.inventory.title', 'Stoc & Logistică')}
        </h1>
        <p className="text-muted-foreground max-w-prose">
          {t('producer.inventory.description', 'Modulul de gestionare a stocurilor și logisticii este în curs de dezvoltare. În curând vei putea urmări aici stocul, rezerva produse pentru comenzi recurente și vedea ce ai de pregătit pentru următoarele zile.')}
        </p>
      </div>

      <EmptyState
        icon={Package}
        title={t('producer.inventory.emptyTitle', 'Modulul de stoc este în pregătire')}
        description={t('producer.inventory.emptyDescription', 'În curând vei putea gestiona stocul produselor, rezerva produse pentru comenzi recurente și vedea ce ai de pregătit pentru următoarele zile.')}
        card={true}
        size="md"
      />
    </div>
  )
}

