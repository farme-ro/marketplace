/**
 * For Importers Landing Page
 * 
 * Pagină dedicată pentru importatori
 */

import type { Metadata } from 'next'
import { ImportersHero } from './_components/importers-hero'
import { ImportersServicesSection } from './_components/services-section'
import { ImportersPartnershipSection } from './_components/partnership-section'
import { ImportersCTASection } from './_components/importers-cta-section'
import { generatePageMetadata } from '@/lib/seo/metadata'
import { getTranslation, getLocale } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const title = await getTranslation(locale, 'importers.metadata.title', 'Pentru importatori - farme.ro')
  const description = await getTranslation(locale, 'importers.metadata.description', 'Importă produse românești premium. Conectăm producătorii locali cu importatorii internaționali, oferind produse de calitate superioară și parteneriate de lungă durată.')
  
  return generatePageMetadata(
    {
      title,
      description,
      keywords: locale === 'ro' 
        ? ['importatori românia', 'produse agricole export', 'produse românești', 'import alimentar', 'farme.ro importatori']
        : [],
    },
    '/pentru-importatori',
    locale
  )
}

export const dynamic = 'force-static'
export const revalidate = 3600

export default function ForImportersPage() {
  return (
    <>
      <ImportersHero />
      <ImportersServicesSection />
      <ImportersPartnershipSection />
      <ImportersCTASection />
    </>
  )
}

