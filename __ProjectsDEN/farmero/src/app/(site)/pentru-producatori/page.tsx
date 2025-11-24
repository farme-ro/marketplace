/**
 * For Producers Landing Page
 * 
 * Pagină dedicată pentru recrutarea producătorilor
 */

import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ProducersHero } from './_components/producers-hero'
import { ProducersProblemsSection } from './_components/producers-problems-section'
import { ProducersBenefitsSection } from './_components/producers-benefits-section'
import { ProducersHowItWorksSection } from './_components/producers-how-it-works-section'
import { ProducersSubscriptionsPreview } from './_components/producers-subscriptions-preview'
import { ProducersTestimonial } from './_components/producers-testimonial'
import { ProducersFinalCta } from './_components/producers-final-cta'
import { generatePageMetadata, getProducersMetadata } from '@/lib/seo/metadata'
import { getLocale } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return generatePageMetadata(
    getProducersMetadata(locale),
    '/pentru-producatori',
    locale
  )
}

export default function ForProducersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ProducersHero />
      <ProducersProblemsSection />
      <ProducersBenefitsSection />
      <ProducersHowItWorksSection />
      <ProducersSubscriptionsPreview />
      <ProducersTestimonial />
      <ProducersFinalCta />
    </Suspense>
  )
}

