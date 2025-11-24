/**
 * Products Page
 * 
 * Pagina de produse cu filtre, căutare și paginare
 */

import type { Metadata } from 'next'
import { Suspense } from 'react'
import ProductsPageClient from './ProductsPageClient'
import { generatePageMetadata, getProductsMetadata } from '@/lib/seo/metadata'
import { getLocale } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return generatePageMetadata(
    await getProductsMetadata(locale),
    '/products',
    locale
  )
}

// ISR - revalidate every 5 minutes (300 seconds)
// This allows the page to be statically generated but refreshed periodically
export const revalidate = 300

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ProductsPageClient />
    </Suspense>
  )
}

