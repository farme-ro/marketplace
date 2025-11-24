/**
 * Content & SEO Governance API Functions
 * 
 * Functions for SEO status monitoring and content governance
 */

import { apiFetch } from './client'
import type { PaginatedResponse } from './types'

// ==================== TYPES ====================

export type SeoStatus = 'ok' | 'warning' | 'missing' | 'stale'

export interface SeoPageMeta {
  path: string // ex: "/despre-noi"
  title?: string | null
  description?: string | null
  ogImage?: string | null
  canonicalUrl?: string | null
  lastUpdatedAt?: string | null // ISO
  seoStatus: SeoStatus
  issues: string[] // ex: ["missing_description", "title_too_short"]
  trafficScore?: number | null // optional, 0–100
}

export interface SeoArticleMeta {
  id: string
  slug: string
  title: string
  producerName?: string | null
  publishedAt?: string | null
  lastUpdatedAt?: string | null
  seoStatus: SeoStatus
  issues: string[]
  views30d?: number | null
  clicks30d?: number | null
  ctr30d?: number | null
}

export interface ContentSeoOverview {
  totalPages: number
  pagesOk: number
  pagesWithIssues: number
  stalePages: number
  totalArticles: number
  articlesOk: number
  articlesWithIssues: number
  avgJournalCtr30d?: number | null
}

export interface ContentSeoOverviewResponse {
  overview: ContentSeoOverview
  readOnly: boolean // true if data is from fallback/demo
}

// ==================== OVERVIEW ====================

/**
 * Get content & SEO overview stats
 */
export async function getContentSeoOverview(): Promise<ContentSeoOverviewResponse> {
  try {
    const overview = await apiFetch<ContentSeoOverview>('/admin/content-seo/overview')
    return {
      overview,
      readOnly: false,
    }
  } catch (err) {
    console.warn('Backend endpoint for content-seo overview not found, using fallback data.', err)
    
    // Return fallback static data
    return {
      overview: {
        totalPages: 10,
        pagesOk: 4,
        pagesWithIssues: 6,
        stalePages: 2,
        totalArticles: 50,
        articlesOk: 30,
        articlesWithIssues: 20,
        avgJournalCtr30d: null,
      },
      readOnly: true,
    }
  }
}

// ==================== PAGES ====================

/**
 * Get SEO status for pages
 */
export async function getSeoPages(params?: {
  search?: string
  status?: SeoStatus | 'all'
}): Promise<SeoPageMeta[]> {
  const queryParams = new URLSearchParams()
  if (params?.search) queryParams.append('search', params.search)
  if (params?.status && params.status !== 'all') queryParams.append('status', params.status)

  const query = queryParams.toString()
  try {
    return await apiFetch<SeoPageMeta[]>(
      `/admin/content-seo/pages${query ? `?${query}` : ''}`
    )
  } catch (err) {
    console.warn('Backend endpoint for SEO pages not found, using fallback data.', err)
    
    // Return fallback static list of important pages
    const importantPages: SeoPageMeta[] = [
      {
        path: '/',
        title: 'Farmero - Piață online pentru produse locale',
        description: null,
        ogImage: null,
        canonicalUrl: null,
        lastUpdatedAt: null,
        seoStatus: 'warning',
        issues: ['missing_description', 'missing_og_image'],
      },
      {
        path: '/despre-noi',
        title: 'Despre Noi',
        description: null,
        ogImage: null,
        canonicalUrl: null,
        lastUpdatedAt: '2024-01-01T00:00:00Z',
        seoStatus: 'stale',
        issues: ['missing_description', 'stale_content'],
      },
      {
        path: '/cum-functioneaza-si-impact',
        title: 'Cum Funcționează',
        description: 'Află cum funcționează platforma Farmero',
        ogImage: null,
        canonicalUrl: null,
        lastUpdatedAt: '2024-06-01T00:00:00Z',
        seoStatus: 'warning',
        issues: ['missing_og_image'],
      },
    ]
    
    // Filter by search if provided
    if (params?.search) {
      const searchLower = params.search.toLowerCase()
      return importantPages.filter(
        (p) =>
          p.path.toLowerCase().includes(searchLower) ||
          p.title?.toLowerCase().includes(searchLower)
      )
    }
    
    // Filter by status if provided
    if (params?.status && params.status !== 'all') {
      return importantPages.filter((p) => p.seoStatus === params.status)
    }
    
    return importantPages
  }
}

// ==================== JOURNAL ARTICLES ====================

/**
 * Get SEO status for journal articles
 */
export async function getSeoArticles(params?: {
  search?: string
  status?: SeoStatus | 'all'
}): Promise<SeoArticleMeta[]> {
  const queryParams = new URLSearchParams()
  if (params?.search) queryParams.append('search', params.search)
  if (params?.status && params.status !== 'all') queryParams.append('status', params.status)

  const query = queryParams.toString()
  try {
    return await apiFetch<SeoArticleMeta[]>(
      `/admin/content-seo/journal${query ? `?${query}` : ''}`
    )
  } catch (err) {
    console.warn('Backend endpoint for SEO journal articles not found, trying fallback.', err)
    
    // Try to compose from existing journal APIs
    try {
      const articles = await apiFetch<any[]>('/admin/journal/articles')
      const metrics = await apiFetch<any>('/admin/journal/metrics/summary?days=30')
      
      // Transform to SeoArticleMeta
      const seoArticles: SeoArticleMeta[] = articles.slice(0, 20).map((article) => {
        const issues: string[] = []
        let seoStatus: SeoStatus = 'ok'
        
        if (!article.title || article.title.length < 30) {
          issues.push('title_too_short')
          seoStatus = 'warning'
        }
        if (!article.excerpt || article.excerpt.length < 120) {
          issues.push('missing_description')
          seoStatus = seoStatus === 'ok' ? 'warning' : seoStatus
        }
        if (!article.coverImageUrl) {
          issues.push('missing_og_image')
          seoStatus = seoStatus === 'ok' ? 'warning' : seoStatus
        }
        
        // Check if stale (published more than 6 months ago)
        if (article.publishedAt) {
          const publishedDate = new Date(article.publishedAt)
          const sixMonthsAgo = new Date()
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
          if (publishedDate < sixMonthsAgo) {
            issues.push('stale_content')
            seoStatus = 'stale'
          }
        }
        
        return {
          id: article.id,
          slug: article.slug,
          title: article.title,
          producerName: article.producerName,
          publishedAt: article.publishedAt,
          lastUpdatedAt: article.updatedAt,
          seoStatus,
          issues,
          views30d: article.metrics?.views || null,
          clicks30d: article.metrics?.clicksToProducer || null,
          ctr30d: article.metrics?.ctr || null,
        }
      })
      
      // Filter by search if provided
      if (params?.search) {
        const searchLower = params.search.toLowerCase()
        return seoArticles.filter(
          (a) =>
            a.title.toLowerCase().includes(searchLower) ||
            a.producerName?.toLowerCase().includes(searchLower)
        )
      }
      
      // Filter by status if provided
      if (params?.status && params.status !== 'all') {
        return seoArticles.filter((a) => a.seoStatus === params.status)
      }
      
      return seoArticles
    } catch (fallbackErr) {
      console.warn('Could not compose SEO articles from existing APIs, using empty fallback.', fallbackErr)
      return []
    }
  }
}

// ==================== ISSUE EXPLANATIONS ====================

export const SEO_ISSUE_EXPLANATIONS: Record<string, string> = {
  missing_title: 'Pagina nu are titlu SEO configurat.',
  missing_description: 'Pagina nu are meta description.',
  missing_og_image: 'Lipsă imagine pentru sharing social.',
  title_too_short: 'Titlul SEO este prea scurt (recomandat: 50-60 caractere).',
  title_too_long: 'Titlul SEO este prea lung (recomandat: 50-60 caractere).',
  description_too_short: 'Meta description este prea scurtă (recomandat: 120-160 caractere).',
  description_too_long: 'Meta description este prea lungă (recomandat: 120-160 caractere).',
  stale_content: 'Conținutul nu a fost actualizat de peste 6 luni.',
  missing_canonical: 'Lipsă URL canonic (poate cauza duplicate content).',
  no_traffic: 'Pagina nu primește trafic (posibil să necesite optimizare SEO).',
}

