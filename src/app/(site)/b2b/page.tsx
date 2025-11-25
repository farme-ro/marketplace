/**
 * B2B Landing Page
 * 
 * Pagină dedicată pentru afaceri (restaurante, hoteluri, etc.)
 */

import type { Metadata } from 'next'
import { BusinessHero } from './_components/business-hero'
import { BusinessBenefitsSection } from './_components/benefits-section'
import { BusinessHowItWorksSection } from './_components/how-it-works-section'
import { BusinessCTASection } from './_components/business-cta-section'
import { generatePageMetadata, getB2BMetadata } from '@/lib/seo/metadata'
import { getLocale } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return generatePageMetadata(
    await getB2BMetadata(locale),
    '/b2b',
    locale
  )
}

export const dynamic = 'force-dynamic'
export const revalidate = 3600

export default function B2BPage() {
  return (
    <>
      <BusinessHero />
      <BusinessBenefitsSection />
      <BusinessHowItWorksSection />
      <BusinessCTASection />
    </>
  )
}

