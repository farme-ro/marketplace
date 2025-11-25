/**
 * Producer Messages Page
 * 
 * Pagină shell pentru mesajele de la clienți
 * Modulul este în curs de dezvoltare.
 */

'use client'

import { EmptyState } from '@/components/ui/empty-state'
import { MessageCircle } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export default function ProducerMessagesPage() {
  const { t } = useI18n()
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
          {t('producer.messages.title', 'Mesaje de la clienți')}
        </h1>
        <p className="text-muted-foreground max-w-prose">
          {t('producer.messages.description', 'Aici vei putea vedea mesajele primite de la clienți, întrebări despre produse și feedback direct. Modulul este în curs de pregătire.')}
        </p>
      </div>

      <EmptyState
        icon={MessageCircle}
        title={t('producer.messages.emptyTitle', 'Modulul de mesaje este în pregătire')}
        description={t('producer.messages.emptyDescription', 'În curând vei putea vedea mesajele primite de la clienți, întrebări despre produse și feedback direct.')}
        card={true}
        size="md"
      />
    </div>
  )
}

