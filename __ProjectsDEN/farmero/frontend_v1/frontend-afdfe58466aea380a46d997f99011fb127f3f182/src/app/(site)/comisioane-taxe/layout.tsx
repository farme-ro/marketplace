/**
 * Fees Layout
 * 
 * Layout pentru pagina de comisioane cu metadata SEO
 */

import type { Metadata } from 'next'
import { generatePageMetadata, getFeesMetadata } from '@/lib/seo/metadata'
import { getLocale } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return generatePageMetadata(
    getFeesMetadata(locale),
    '/fees',
    locale
  )
}

export default function FeesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
