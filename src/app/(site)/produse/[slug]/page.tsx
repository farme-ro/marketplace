/**
 * Product Detail Page
 * 
 * Pagină de detalii pentru un produs specific
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchPublicProductBySlug } from '@/lib/api/public/products'
import { formatCurrency } from '@/lib/utils/format'
import { PageContainer } from '@/components/layout/page-container'
import { ProductHeaderSection } from './_components/product-header-section'
import { ProductSections } from './_components/product-sections'
import { getTranslation, getTranslations, getLocale } from '@/lib/i18n/server'

// ProductDetail type matches PublicProduct from API
type ProductDetail = {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  unit: string
  imageUrl?: string
  producer: {
    id: string
    name: string
    slug: string
    region?: string
  }
  category?: {
    id: string
    name: string
    slug: string
  }
  isTraditional: boolean
  isBio: boolean
  stock: number
}

async function getProduct(slug: string): Promise<ProductDetail | null> {
  try {
    const product = await fetchPublicProductBySlug(slug)
    if (!product) {
      return null
    }
    
    // Map PublicProduct to ProductDetail format expected by components
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      unit: product.unit || 'buc',
      imageUrl: product.imageUrl,
      producer: product.producerId ? {
        id: product.producerId,
        name: product.producerName || 'Unknown',
        slug: product.producerSlug || '',
      } : {
        id: '',
        name: 'Unknown',
        slug: '',
      },
      category: undefined, // Category not available in PublicProduct type
      isTraditional: product.isTraditional ?? false,
      isBio: product.isBio ?? false,
      stock: product.stock ?? 0,
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('[ProductDetailPage] Error fetching product:', error)
    }
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const product = await getProduct(params.slug)

  const locale = await getLocale()
  
  if (!product) {
    const notFoundTitle = await getTranslation(locale, 'products.metadata.notFound', 'Produs negăsit')
    const notFoundDesc = await getTranslation(locale, 'products.metadata.notFoundDescription', 'Produsul căutat nu a fost găsit.')
    return {
      title: `${notFoundTitle} - farme.ro`,
      description: notFoundDesc,
    }
  }
  const producerNameFallback = await getTranslation(locale, 'products.metadata.producerLocal', 'producător local')
  const buyText = await getTranslation(locale, 'products.metadata.buy', 'Cumpără')
  const bioText = await getTranslation(locale, 'products.metadata.bio', 'Produs bio')
  const traditionalText = await getTranslation(locale, 'products.metadata.traditional', 'Produs tradițional')
  const priceText = await getTranslation(locale, 'products.metadata.price', 'Preț')
  const unitFallback = await getTranslation(locale, 'ui.units.piece', 'buc')
  
  const producerName = product.producer?.name || producerNameFallback
  const description = product.description || `${buyText} ${product.name} ${await getTranslation(locale, 'products.metadata.from', 'de la')} ${producerName} ${await getTranslation(locale, 'products.metadata.onPlatform', 'pe farme.ro')}. ${product.isBio ? bioText : ''} ${product.isTraditional ? traditionalText : ''}. ${priceText}: ${formatCurrency(product.price, locale)}/${product.unit || unitFallback}.`

  const keywordsLocale = await getTranslations(locale, [
    'products.metadata.keywords.agricultural',
    'products.metadata.keywords.traditional',
    'products.metadata.keywords.bio',
  ])

  const fromText = await getTranslation(locale, 'products.metadata.from', 'de la')
  
  return {
    title: `${product.name} ${fromText} ${producerName} | farme.ro`,
    description,
    keywords: [
      product.name,
      product.producer.name,
      keywordsLocale['products.metadata.keywords.agricultural'] || 'produse agricole',
      keywordsLocale['products.metadata.keywords.traditional'] || 'produse tradiționale',
      product.isBio ? (keywordsLocale['products.metadata.keywords.bio'] || 'produse bio') : '',
      product.category?.name || '',
    ].filter(Boolean),
    openGraph: {
      title: `${product.name} - farme.ro`,
      description,
      url: `https://farme.ro/products/${product.slug}`,
      type: 'website',
      siteName: 'farme.ro',
      images: product.imageUrl ? [
        {
          url: product.imageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} - farme.ro`,
      description,
      images: product.imageUrl ? [product.imageUrl] : undefined,
    },
    alternates: {
      canonical: `https://farme.ro/products/${product.slug}`,
    },
  }
}

// ISR - revalidate every 5 minutes for product pages
// This allows products to be statically generated but refreshed when they change
export const revalidate = 300

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const product = await getProduct(params.slug)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageContainer className="py-10 md:py-16">
        {/* Header Section - 2 columns */}
        <ProductHeaderSection product={product} />

        {/* Sections below */}
        <ProductSections product={product} />
      </PageContainer>
    </div>
  )
}

