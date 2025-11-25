/**
 * For Investors Landing Page
 * 
 * Pagină dedicată pentru investitori
 */

import type { Metadata } from 'next'
import { InvestorsHero } from './_components/investors-hero'
import { BusinessModelSection } from './_components/business-model-section'
import { FinancialsSection } from './_components/financials-section'
import { PitchDeckSection } from './_components/pitch-deck-section'
import { StrategySection } from './_components/strategy-section'
import { MarketAnalysisSection } from './_components/market-analysis-section'
import { InvestorsFAQSection } from './_components/investors-faq-section'
import { InvestorsCTASection } from './_components/investors-cta-section'
import { generatePageMetadata } from '@/lib/seo/metadata'
import { getTranslation, getLocale } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const title = await getTranslation(locale, 'investors.metadata.title', 'Pentru investitori - farme.ro')
  const description = await getTranslation(locale, 'investors.metadata.description', 'Oportunitate de investiție în viitorul alimentar al României. farme.ro conectează producătorii locali cu consumatorii, generând valoare și impact social măsurabil.')
  
  return generatePageMetadata(
    {
      title,
      description,
      keywords: locale === 'ro' 
        ? ['investiție românia', 'startup agricultură', 'marketplace investiție', 'farme.ro investitori', 'seed round', 'investiție tech']
        : [],
    },
    '/pentru-investitori',
    locale
  )
}

export const dynamic = 'force-static'
export const revalidate = 3600

export default function ForInvestorsPage() {
  return (
    <>
      <InvestorsHero />
      <BusinessModelSection />
      <FinancialsSection />
      <PitchDeckSection />
      <StrategySection />
      <MarketAnalysisSection />
      <InvestorsFAQSection />
      <InvestorsCTASection />
    </>
  )
}

