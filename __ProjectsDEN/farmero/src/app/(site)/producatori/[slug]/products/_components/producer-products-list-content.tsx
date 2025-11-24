'use client'

import Link from 'next/link'
import { Card, CardContent, Button } from 'farme-ui'
import { Package } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { ProducerProductsClient } from './producer-products-client'
import type { ProducerSummary } from '@/lib/api/public/producers'
import type { ProductSummary } from '@/types/public'

interface ProducerProductsListContentProps {
  products: ProductSummary[]
  producer: ProducerSummary
}

export function ProducerProductsListContent({ products, producer }: ProducerProductsListContentProps) {
  const { t } = useI18n()
  
  if (products.length === 0) {
    return (
      <Card className="border border-border rounded-2xl shadow-sm bg-card">
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Package className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {t('ui.noProducts', 'Nu există produse disponibile')}
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            {t('producers.detail.productsSubtitle', 'Acest producător nu are încă produse listate în platformă.')}
          </p>
          <Link href={`/producers/${producer.slug}`}>
            <Button variant="outline">
              {t('producers.detail.backToProfile', 'Vezi profilul producătorului')}
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <div>
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          {products.length} {products.length === 1 ? t('product.singular', 'produs disponibil') : t('product.plural', 'produse disponibile')}
        </p>
      </div>
      
      <ProducerProductsClient
        products={products}
        producerName={producer.name}
        producerSlug={producer.slug}
      />
    </div>
  )
}

