/**
 * For Logistics Landing Page
 * 
 * Pagină dedicată pentru parteneri de logistică și transport
 */

import type { Metadata } from 'next'
import { LogisticsHero } from './_components/logistics-hero'
import { ServicesSection } from './_components/services-section'
import { PartnershipSection } from './_components/partnership-section'
import { LogisticsCTASection } from './_components/logistics-cta-section'
import { generatePageMetadata } from '@/lib/seo/metadata'
import { getTranslation, getLocale } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const title = await getTranslation(locale, 'logistics.metadata.title', 'Pentru Logistică și Transport - farme.ro')
  const description = await getTranslation(locale, 'logistics.metadata.description', 'Devino partener în logistica farme.ro. Căutăm colaboratori pentru livrări cu mașini frigorifice, depozitare și pachetomate.')
  
  return generatePageMetadata(
    {
      title,
      description,
      keywords: locale === 'ro' 
        ? ['logistică românia', 'transport produse alimentare', 'mașini frigorifice', 'depozitare', 'pachetomate', 'farme.ro logistică']
        : [],
    },
    '/pentru-logistica',
    locale
  )
}

export const dynamic = 'force-static'
export const revalidate = 3600

export default function ForLogisticsPage() {
  return (
    <>
      <LogisticsHero />
      <ServicesSection />
      <PartnershipSection />
      <LogisticsCTASection />
    </>
  )
}

