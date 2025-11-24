/**
 * Marketing & Growth API Functions
 * 
 * Functions for marketing analytics, funnels, and campaigns
 */

import { apiFetch } from './client'
import type { PaginatedResponse } from './types'

// ==================== TYPES ====================

export interface MarketingOverviewStats {
  activePromotedProducers: number
  activeRecurringClients: number
  newJournalArticles30d: number
  journalProducerCtr30d: number
  promoPlanMix: {
    free: number
    promo: number
    premium?: number
  }
  monthlyPromoRevenueEstimate: number | null
}

export interface MarketingOverviewResponse {
  stats: MarketingOverviewStats
  readOnly: boolean // true if data is from fallback/demo
}

export interface MarketingFunnelStep {
  label: string
  value: number
  conversionFromPrevious: number | null // percentage
}

export interface MarketingFunnels {
  producers: MarketingFunnelStep[]
  clients: MarketingFunnelStep[]
}

export interface PromotedProducer {
  id: string
  producerId: string
  producerName: string
  planName: string
  tier: string
  status: 'active' | 'expired' | 'upcoming'
  activeFrom: string
  activeTo: string
  slug?: string
}

export interface JournalArticlePerformance {
  id: string
  title: string
  producerName: string
  producerId: string
  views: number
  clicks: number
  ctr: number
}

// ==================== OVERVIEW ====================

/**
 * Get marketing overview stats
 */
export async function getMarketingOverview(): Promise<MarketingOverviewResponse> {
  try {
    const stats = await apiFetch<MarketingOverviewStats>('/admin/marketing/overview')
    return {
      stats,
      readOnly: false,
    }
  } catch (err) {
    console.warn('Backend endpoint for marketing overview not found, using fallback data.', err)
    
    // Try to compose from existing endpoints
    try {
      // Try to get journal metrics if available
      const journalMetrics = await apiFetch<any>('/admin/journal/metrics')
      
      // Try to get subscriptions if available
      const subscriptions = await apiFetch<any>('/admin/subscriptions')
      
      // Compose partial stats
      return {
        stats: {
          activePromotedProducers: subscriptions?.activePromotedProducers || 0,
          activeRecurringClients: subscriptions?.activeRecurringClients || 0,
          newJournalArticles30d: journalMetrics?.newArticles30d || 0,
          journalProducerCtr30d: journalMetrics?.averageCtr || 0,
          promoPlanMix: {
            free: subscriptions?.freePlanCount || 0,
            promo: subscriptions?.promoPlanCount || 0,
            premium: subscriptions?.premiumPlanCount || 0,
          },
          monthlyPromoRevenueEstimate: null,
        },
        readOnly: true,
      }
    } catch (fallbackErr) {
      // Return demo static data
      return {
        stats: {
          activePromotedProducers: 0,
          activeRecurringClients: 0,
          newJournalArticles30d: 0,
          journalProducerCtr30d: 0,
          promoPlanMix: {
            free: 0,
            promo: 0,
            premium: 0,
          },
          monthlyPromoRevenueEstimate: null,
        },
        readOnly: true,
      }
    }
  }
}

// ==================== FUNNELS ====================

/**
 * Get marketing funnels
 */
export async function getMarketingFunnels(params?: {
  days?: number
}): Promise<MarketingFunnels | null> {
  const queryParams = new URLSearchParams()
  if (params?.days) queryParams.append('days', params.days.toString())

  const query = queryParams.toString()
  try {
    return await apiFetch<MarketingFunnels>(
      `/admin/marketing/funnels${query ? `?${query}` : ''}`
    )
  } catch (err) {
    console.warn('Backend endpoint for marketing funnels not found.', err)
    return null
  }
}

// ==================== PROMOTED PRODUCERS ====================

/**
 * Get promoted producers
 */
export async function getPromotedProducers(): Promise<PromotedProducer[]> {
  try {
    return await apiFetch<PromotedProducer[]>('/admin/marketing/promoted-producers')
  } catch (err) {
    console.warn('Backend endpoint for promoted producers not found.', err)
    return []
  }
}

// ==================== JOURNAL PERFORMANCE ====================

/**
 * Get top journal articles by performance
 */
export async function getJournalTopArticles(limit: number = 10): Promise<JournalArticlePerformance[]> {
  try {
    // Try to use existing journal metrics endpoint
    const metrics = await apiFetch<any>('/admin/journal/metrics')
    if (metrics?.topArticles) {
      return metrics.topArticles.slice(0, limit)
    }
    
    // Try dedicated endpoint
    return await apiFetch<JournalArticlePerformance[]>(
      `/admin/marketing/journal-top-articles?limit=${limit}`
    )
  } catch (err) {
    console.warn('Backend endpoint for journal top articles not found.', err)
    return []
  }
}

