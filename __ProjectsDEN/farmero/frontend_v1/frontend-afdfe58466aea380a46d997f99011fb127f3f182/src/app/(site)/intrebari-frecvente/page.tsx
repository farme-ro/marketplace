/**
 * FAQ Page
 * 
 * Pagină cu întrebări frecvente
 */

import type { Metadata } from 'next'
import FAQPageClient from './FAQPageClient'
import { generatePageMetadata, getFAQMetadata } from '@/lib/seo/metadata'
import { getLocale } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return generatePageMetadata(
    getFAQMetadata(locale),
    '/faq',
    locale
  )
}

// Static generation - this page doesn't need dynamic data
export const dynamic = 'force-static'

export default function FAQPage() {
  return <FAQPageClient />
}
