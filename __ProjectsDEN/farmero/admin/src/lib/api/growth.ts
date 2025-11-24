/**
 * Growth Engine API Client
 * 
 * API functions for Growth Engine (events, campaigns, nudges)
 */

import { apiFetch } from './admin'

// ============================================================================
// Types
// ============================================================================

export interface GrowthEvent {
  id: string
  userId?: string
  producerId?: string
  type: string
  source: string
  metadata?: Record<string, any>
  createdAt: string
}

export interface UserTimelineEntry {
  id: string
  type: string
  source: string
  metadata?: Record<string, any>
  createdAt: string
}

export interface CampaignOverview {
  active: number
  upcoming: number
  finished: number
  total: number
}

export interface EligibleNudge {
  code: string
  description?: string
  priority: number
  message?: string
  actionUrl?: string
}

export interface GrowthNudgeRule {
  id: string
  code: string
  description?: string
  segment: string
  trigger: string
  priority: number
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface GrowthOverview {
  eventsLast7Days: number
  activeCampaigns: number
  subscriptionActivationRate: number | null
  timeline: UserTimelineEntry[]
  nudges: EligibleNudge[]
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get growth overview (KPI, timeline sample, nudges)
 */
export async function getGrowthOverview(): Promise<GrowthOverview> {
  try {
    // Get campaign overview
    const campaignOverview = await apiFetch<{ success: boolean; data: CampaignOverview }>(
      '/admin/growth/campaigns/overview'
    )

    // Get sample timeline (last 20 events - anonymized)
    // Note: This would need a new endpoint or we use a sample userId
    const timeline: UserTimelineEntry[] = []

    // Get sample nudges (with default context)
    const nudgesResponse = await apiFetch<{ success: boolean; data: EligibleNudge[] }>(
      '/admin/growth/nudges?role=client&page=homepage'
    )

    // Calculate events last 7 days (would need a new endpoint)
    // For now, return mock data
    const eventsLast7Days = 0

    // Subscription activation rate (would need calculation from subscriptions data)
    const subscriptionActivationRate = null

    return {
      eventsLast7Days,
      activeCampaigns: campaignOverview.data?.active || 0,
      subscriptionActivationRate,
      timeline,
      nudges: nudgesResponse.data || [],
    }
  } catch (error) {
    console.warn('[Growth API] Failed to get overview:', error)
    // Return fallback data
    return {
      eventsLast7Days: 0,
      activeCampaigns: 0,
      subscriptionActivationRate: null,
      timeline: [],
      nudges: [],
    }
  }
}

/**
 * Get user timeline
 */
export async function getUserTimeline(
  userId: string,
  limit: number = 20,
  offset: number = 0
): Promise<UserTimelineEntry[]> {
  try {
    const response = await apiFetch<{ success: boolean; data: UserTimelineEntry[] }>(
      `/admin/growth/timeline?userId=${userId}&limit=${limit}&offset=${offset}`
    )

    return response.data || []
  } catch (error) {
    console.warn('[Growth API] Failed to get user timeline:', error)
    return []
  }
}

/**
 * Get campaign overview
 */
export async function getCampaignOverview(): Promise<CampaignOverview | null> {
  try {
    const response = await apiFetch<{ success: boolean; data: CampaignOverview }>(
      '/admin/growth/campaigns/overview'
    )

    return response.data || null
  } catch (error) {
    console.warn('[Growth API] Failed to get campaign overview:', error)
    return null
  }
}

/**
 * Get eligible nudges for context
 */
export async function getEligibleNudges(context: {
  userId?: string
  producerId?: string
  role?: string
  page?: string
  subscriptionActive?: boolean
  hasJournalArticles?: boolean
  cartItemsCount?: number
}): Promise<EligibleNudge[]> {
  try {
    const params = new URLSearchParams()
    if (context.userId) params.append('userId', context.userId)
    if (context.producerId) params.append('producerId', context.producerId)
    if (context.role) params.append('role', context.role)
    if (context.page) params.append('page', context.page)
    if (context.subscriptionActive !== undefined) params.append('subscriptionActive', String(context.subscriptionActive))
    if (context.hasJournalArticles !== undefined) params.append('hasJournalArticles', String(context.hasJournalArticles))
    if (context.cartItemsCount !== undefined) params.append('cartItemsCount', String(context.cartItemsCount))

    const response = await apiFetch<{ success: boolean; data: EligibleNudge[] }>(
      `/admin/growth/nudges?${params.toString()}`
    )

    return response.data || []
  } catch (error) {
    console.warn('[Growth API] Failed to get eligible nudges:', error)
    return []
  }
}

