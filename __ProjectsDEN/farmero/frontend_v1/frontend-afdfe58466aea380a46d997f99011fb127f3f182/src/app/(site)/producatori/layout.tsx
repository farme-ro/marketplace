/**
 * Producers Layout
 * 
 * Layout pentru pagina de producători cu metadata
 */

import type { Metadata } from 'next'
import { generatePageMetadata, getProducersMetadata } from '@/lib/seo/metadata'
import { getLocale } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return generatePageMetadata(
    getProducersMetadata(locale),
    '/producatori',
    locale
  )
}

export default function ProducersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
