'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent } from 'farme-ui'
import { useI18n } from '@/lib/i18n/context'
import type { ProducerSummary } from '@/lib/api/public/producers'
import type { ProductSummary } from '@/types/public'

interface ProducerProductsPageContentProps {
  producer: ProducerSummary
  products: ProductSummary[]
}

export function ProducerProductsPageContent({ producer, products }: ProducerProductsPageContentProps) {
  const { t } = useI18n()
  
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <Link href={`/producers/${producer.slug}`} className="inline-flex items-center gap-2 mb-4 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {t('producers.detail.backToProfile', 'Înapoi la profilul producătorului')}
        </Link>
        
        <div className="flex items-start gap-4">
          {producer.avatarUrl && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={producer.avatarUrl}
              alt={producer.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
              {t('producers.detail.productsFrom', 'Produse de la {name}').replace('{name}', producer.name)}
            </h1>
            {producer.regionName && (
              <p className="text-sm text-muted-foreground">
                {producer.regionName}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
