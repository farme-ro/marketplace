/**
 * Producer Detail Page
 * 
 * Pagină publică de detaliu producător cu poveste, produse, impact social
 */

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProducerProfileHeader } from '@/components/producers/producer-profile-header'
import { fetchPublicProducerBySlug, fetchPublicProductsForProducer, type ProducerSummary } from '@/lib/api/public/producers'
import { Card, CardContent } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'
import { ProducerProductsList } from './_components/producer-products-list'
import { ProducerDetailContent } from './_components/producer-detail-content'
import { getTranslation, getLocale } from '@/lib/i18n/server'
import type { Locale } from '@/lib/i18n/context'

// Helper function to get delivery options translations
async function getDeliveryOptions(locale: Locale) {
  return [
    await getTranslation(locale, 'producers.delivery.home', 'Livrare la adresă'),
    await getTranslation(locale, 'producers.delivery.packageLocker', 'Pachetomat'),
    await getTranslation(locale, 'producers.delivery.easybox', 'Easybox'),
  ]
}

type ProducerPageParams = {
  params: {
    slug: string
  }
}

type ProducerProduct = {
  id: string
  name: string
  price: number
  priceText?: string
  unit?: string
  isBio?: boolean
  isTraditional?: boolean
  isLimited?: boolean
  stock?: number
  isActive?: boolean
}

// Extend ProducerSummary with additional fields for detail page
export type ProducerDetail = ProducerSummary & {
  storyFull?: string
  products?: ProducerProduct[]
  deliveryOptions?: string[]
}

async function getProducerBySlugWithProducts(slug: string, locale: Locale): Promise<ProducerDetail | null> {
  try {
    const producer = await fetchPublicProducerBySlug(slug)
    if (!producer) return null

    // Fetch products for this producer
    const products = await fetchPublicProductsForProducer(slug)
    
    // Get translations for price text
    const currencySymbol = await getTranslation(locale, 'ui.currency.symbol', 'lei')
    const unitPiece = await getTranslation(locale, 'ui.units.piece', 'buc')
    
    // Map products to ProducerProduct format
    // Note: slug is not included in ProducerProduct type, but is available in the original product data
    const mappedProducts = products.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      priceText: `${p.price} ${currencySymbol}/${p.unit || unitPiece}`,
      unit: p.unit,
      isBio: p.isBio,
      isTraditional: p.isTraditional,
      isLimited: p.stock !== undefined && p.stock < 10,
      stock: p.stock,
      isActive: true,
      // slug: p.slug, // Available but not in ProducerProduct type
    }))
    
    return {
      ...producer,
      products: mappedProducts,
      deliveryOptions: await getDeliveryOptions(locale),
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('[ProducerDetailPage] Error fetching producer:', error)
    }
    return null
  }
}

export async function generateMetadata({ params }: ProducerPageParams): Promise<Metadata> {
  const locale = await getLocale()
  const producer = await getProducerBySlugWithProducts(params.slug, locale)
  
  if (!producer) {
    const notFoundTitle = await getTranslation(locale, 'producers.metadata.notFound', 'Producător local')
    const notFoundDesc = await getTranslation(locale, 'producers.metadata.notFoundDescription', 'Producători locali, produse tradiționale și bio livrate direct de la sursă.')
    return {
      title: `${notFoundTitle} | farme.ro`,
      description: notFoundDesc,
    }
  }

  const discoverText = await getTranslation(locale, 'producers.metadata.discover', 'Descoperă produsele de la')
  const producerLocalText = await getTranslation(locale, 'producers.metadata.producerLocal', 'producător local')
  const fromText = await getTranslation(locale, 'producers.metadata.from', 'din')
  const traditionalBioText = await getTranslation(locale, 'producers.metadata.traditionalBio', 'Produse tradiționale și bio livrate direct de la sursă.')
  
  const locationText = producer.regionName || await getTranslation(locale, 'producers.metadata.romania', 'România')
  const description = producer.description || `${discoverText} ${producer.name}, ${producerLocalText} ${fromText} ${locationText}. ${traditionalBioText}`
  const producerLocalFromText = await getTranslation(locale, 'producers.metadata.producerLocalFrom', 'Producător local din')

  return {
    title: `${producer.name} - ${producerLocalFromText} ${locationText} | farme.ro`,
    description,
    keywords: [
      producer.name,
      producerLocalText,
      locationText,
      await getTranslation(locale, 'producers.metadata.keywords.traditional', 'produse tradiționale'),
      await getTranslation(locale, 'producers.metadata.keywords.bio', 'produse bio'),
      'farme.ro',
    ],
    openGraph: {
      title: `${producer.name} - ${producerLocalFromText} ${locationText}`,
      description,
      type: 'website',
      url: `https://farme.ro/producers/${producer.slug}`,
      siteName: 'farme.ro',
      images: producer.avatarUrl ? [
        {
          url: producer.avatarUrl,
          width: 1200,
          height: 630,
          alt: `${producer.name} - ${producerLocalText}`,
        },
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${producer.name} - ${producerLocalFromText} ${locationText}`,
      description,
      images: producer.avatarUrl ? [producer.avatarUrl] : undefined,
    },
  }
}

export default async function ProducerPage({ params }: ProducerPageParams) {
  const locale = await getLocale()
  const producer = await getProducerBySlugWithProducts(params.slug, locale)

  if (!producer) {
    notFound()
  }

  const products = producer.products || []
  const storyFull = producer.description

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageContainer>
        <div className="mx-auto max-w-5xl py-8 md:py-10">
          {/* Header producător */}
          <ProducerProfileHeader
            name={producer.name}
            regionName={producer.regionName}
            storyShort={producer.description}
            isVerified={producer.isVerified}
            specialties={producer.tags}
            tags={producer.tags}
            avatarUrl={producer.avatarUrl || undefined}
            productCount={producer.productCount}
          />

          {/* Layout 2 coloane */}
          <ProducerDetailContent 
            storyFull={storyFull}
            products={products}
            producer={producer}
          />
        </div>
      </PageContainer>
    </div>
  )
}
