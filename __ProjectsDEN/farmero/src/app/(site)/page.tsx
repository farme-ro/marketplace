/**
 * Homepage
 * 
 * Pagina principală a aplicației farme.ro
 */

import type { Metadata } from 'next'
import nextDynamic from 'next/dynamic'
import { HeroSection } from './_components/home/hero-section'
import { DifferenceSection } from '@/components/site/difference-section'
import { HowItWorksTimeline } from '@/components/site/how-it-works-timeline'
import { CategoriesSection } from './_components/home/categories-section'
import { generatePageMetadata, getHomepageMetadata } from '@/lib/seo/metadata'
import { getLocale } from '@/lib/i18n/server'
import { GrowthNudgeBanner } from '@/components/growth/growth-nudge-banner'
import { PageContainer } from '@/components/layout/page-container'

// Lazy load heavier sections below the fold
const ProducersSection = nextDynamic(() => import('./_components/home/producers-section').then(mod => ({ default: mod.ProducersSection })), {
  ssr: true,
  loading: () => <div className="h-96 bg-muted/30 animate-pulse rounded-lg" />,
})

const ProductsSection = nextDynamic(() => import('./_components/home/products-section').then(mod => ({ default: mod.ProductsSection })), {
  ssr: true,
  loading: () => <div className="h-96 bg-muted/30 animate-pulse rounded-lg" />,
})

const SubscriptionsTeaserSection = nextDynamic(() => import('./_components/home/subscriptions-teaser-section').then(mod => ({ default: mod.SubscriptionsTeaserSection })), {
  ssr: true,
  loading: () => <div className="h-64 bg-muted/30 animate-pulse rounded-lg" />,
})

const SocialImpactSection = nextDynamic(() => import('@/components/site/social-impact-section').then(mod => ({ default: mod.SocialImpactSection })), {
  ssr: true,
  loading: () => <div className="h-96 bg-muted/30 animate-pulse rounded-lg" />,
})

const NewsletterSection = nextDynamic(() => import('./_components/home/newsletter-section').then(mod => ({ default: mod.NewsletterSection })), {
  ssr: true,
  loading: () => <div className="h-64 bg-muted/30 animate-pulse rounded-lg" />,
})

const RegionsSection = nextDynamic(() => import('./_components/home/regions-section').then(mod => ({ default: mod.RegionsSection })), {
  ssr: true,
  loading: () => <div className="h-96 bg-muted/30 animate-pulse rounded-lg" />,
})

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return generatePageMetadata(
    getHomepageMetadata(locale),
    '/',
    locale
  )
}

export const dynamic = 'force-dynamic'
export const revalidate = 300

export default function HomePage() {
  return (
    <>
      {/* 1. HERO – Split layout modern cu badge overlay */}
      <HeroSection />
      
      {/* Growth Nudge Banner */}
      <PageContainer className="pt-6">
        <GrowthNudgeBanner page="homepage" />
      </PageContainer>
      
      {/* 2. Caută după categorie */}
      <CategoriesSection />
      
      {/* 3. 🔥 Produse populare săptămâna aceasta (optimizat pentru conversie) */}
      <ProductsSection />
      
      {/* 4. 🥕 Producători verificați din zona ta */}
      <ProducersSection />
      
      {/* 5. 📦 Abonamente flexibile pentru aprovizionare */}
      <SubscriptionsTeaserSection />
      
      {/* 6. 🌱 De ce Farmero sprijină agricultura locală */}
      <DifferenceSection />
      
      {/* 7. Cum funcționează – Timeline cu 4 pași */}
      <HowItWorksTimeline />
      
      {/* 8. Alege zona ta */}
      <RegionsSection />
      
      {/* 9. Impact Social – "Comanda ta face bine" */}
      <SocialImpactSection />
      
      {/* 11. Newsletter CTA – Premium */}
      <NewsletterSection />
    </>
  )
}

