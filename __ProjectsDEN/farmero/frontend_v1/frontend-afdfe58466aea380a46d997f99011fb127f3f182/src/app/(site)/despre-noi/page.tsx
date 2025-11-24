/**
 * About Page
 * 
 * Pagină despre farme.ro - misiune, valori, echipa
 */

import type { Metadata } from 'next'
import { AboutHero } from './_components/about-hero'
import { OurStory } from './_components/our-story'
import { MissionValues } from './_components/mission-values'
import { HowWeWork } from './_components/how-we-work'
import { AboutCTA } from './_components/about-cta'
import { generatePageMetadata, getAboutMetadata } from '@/lib/seo/metadata'
import { getLocale } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return generatePageMetadata(
    await getAboutMetadata(locale),
    '/about',
    locale
  )
}

// Static generation - this page doesn't need dynamic data
export const dynamic = 'force-static'

export default function AboutPage() {
  return (
    <>
      {/* Anchor for team */}
      <div id="team" className="scroll-mt-20" />
      <AboutHero />
      <OurStory />
      <MissionValues />
      <HowWeWork />
      <AboutCTA />
    </>
  )
}
