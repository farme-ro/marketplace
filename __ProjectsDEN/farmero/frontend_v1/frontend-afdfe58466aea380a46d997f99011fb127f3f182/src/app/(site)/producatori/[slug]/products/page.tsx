/**
 * Producer Products Page
 * 
 * Pagină cu lista de produse ale unui producător specific
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { fetchPublicProducerBySlug, fetchPublicProductsForProducer } from '@/lib/api/public/producers'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent, Button } from 'farme-ui'
import { ArrowLeft, Package } from 'lucide-react'
import { ProducerProductsClient } from './_components/producer-products-client'
import { ProducerProductsPageContent } from './_components/producer-products-page-content'
import { ProducerProductsListContent } from './_components/producer-products-list-content'
import { getTranslation, getLocale } from '@/lib/i18n/server'

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const producer = await fetchPublicProducerBySlug(params.slug)

  const locale = await getLocale()
  
  if (!producer) {
    const notFoundTitle = await getTranslation(locale, 'producers.metadata.notFound', 'Producător negăsit')
    const notFoundDesc = await getTranslation(locale, 'producers.metadata.notFoundDescription', 'Producătorul căutat nu a fost găsit.')
    return {
      title: `${notFoundTitle} - farme.ro`,
      description: notFoundDesc,
    }
  }

  const productsFromText = await getTranslation(locale, 'producers.metadata.productsFrom', 'Produse de la')
  const discoverAllText = await getTranslation(locale, 'producers.metadata.discoverAll', 'Descoperă toate produsele de la')
  const producerLocalText = await getTranslation(locale, 'producers.metadata.producerLocal', 'producător local')
  const fromRomaniaText = await getTranslation(locale, 'producers.metadata.fromRomania', 'din România')

  return {
    title: `${productsFromText} ${producer.name} - farme.ro`,
    description: `${discoverAllText} ${producer.name}, ${producerLocalText} ${fromRomaniaText}.`,
    openGraph: {
      title: `${productsFromText} ${producer.name} - farme.ro`,
      description: `${discoverAllText} ${producer.name}.`,
      url: `https://farme.ro/producers/${producer.slug}/products`,
      type: 'website',
    },
    alternates: {
      canonical: `https://farme.ro/producers/${producer.slug}/products`,
    },
  }
}

export default async function ProducerProductsPage({
  params,
}: {
  params: { slug: string }
}) {
  const producer = await fetchPublicProducerBySlug(params.slug)

  if (!producer) {
    notFound()
  }

  const products = await fetchPublicProductsForProducer(params.slug)
  
  // Map products to ensure all required ProductSummary fields are present
  const productsWithUnit = products.map(p => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    unit: p.unit || 'buc',
    producerName: p.producerName || producer.name,
    producerSlug: p.producerSlug || producer.slug,
    regionName: p.regionName,
    regionId: p.regionId,
    isTraditional: p.isTraditional ?? false,
    isBio: p.isBio ?? false,
    imageUrl: p.imageUrl,
    stock: p.stock ?? 0,
    status: p.status || 'APPROVED',
  }))

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageContainer className="py-10 md:py-16">
        <ProducerProductsPageContent producer={producer} products={productsWithUnit} />

        {/* Products List */}
        <ProducerProductsListContent 
          products={productsWithUnit}
          producer={producer}
        />
      </PageContainer>
    </div>
  )
}

