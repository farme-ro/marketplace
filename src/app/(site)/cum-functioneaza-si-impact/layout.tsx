/**
 * Layout for How It Works & Social Impact Page
 * 
 * Adds metadata for SEO
 */

import type { Metadata } from 'next'
import { generatePageMetadata, getHowItWorksMetadata } from '@/lib/seo/metadata'
import { getLocale } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return generatePageMetadata(
    await getHowItWorksMetadata(locale),
    '/cum-functioneaza-si-impact',
    locale
  )
}

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
