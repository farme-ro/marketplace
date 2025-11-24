/**
 * Growth Engine API
 * 
 * API functions for growth events, campaigns, and nudges
 */

import { apiFetch, ApiError } from './client'
import { isBackendSyncEnabled } from '@/lib/backend-sync/status'

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

export interface CreateGrowthEventInput {
  userId?: string
  producerId?: string
  type: string
  source: string
  metadata?: Record<string, any>
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

export interface GetEligibleNudgesContext {
  userId?: string
  producerId?: string
  role?: string
  page?: string
  subscriptionActive?: boolean
  hasJournalArticles?: boolean
  cartItemsCount?: number
  metadata?: Record<string, any>
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Record a growth event
 * Public endpoint - no authentication required
 */
export async function recordGrowthEvent(input: CreateGrowthEventInput): Promise<GrowthEvent> {
  if (!isBackendSyncEnabled('growthEngine')) {
    // Silently fail in development, log in console
    if (process.env.NODE_ENV === 'development') {
      console.debug('[Growth Engine] Feature disabled, skipping event:', input.type)
    }
    // Return a mock response to not break the flow
    return {
      id: 'mock-' + Date.now(),
      type: input.type,
      source: input.source,
      metadata: input.metadata,
      createdAt: new Date().toISOString(),
    }
  }

  try {
    const response = await apiFetch<{ success: boolean; data: GrowthEvent }>('/growth/events', {
      method: 'POST',
      body: JSON.stringify(input),
    })

    if (!response.success || !response.data) {
      throw new ApiError('Failed to record growth event', 500)
    }

    return response.data
  } catch (error) {
    // Silently fail - don't break UX if tracking fails
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Growth Engine] Failed to record event:', error)
    }
    // Return mock response
    return {
      id: 'mock-' + Date.now(),
      type: input.type,
      source: input.source,
      metadata: input.metadata,
      createdAt: new Date().toISOString(),
    }
  }
}

/**
 * Get user timeline (admin/support only)
 */
export async function getUserTimeline(
  userId: string,
  limit: number = 20,
  offset: number = 0
): Promise<UserTimelineEntry[]> {
  if (!isBackendSyncEnabled('growthEngine')) {
    return []
  }

  try {
    const response = await apiFetch<{ success: boolean; data: UserTimelineEntry[] }>(
      `/admin/growth/timeline?userId=${userId}&limit=${limit}&offset=${offset}`
    )

    if (!response.success || !response.data) {
      return []
    }

    return response.data
  } catch (error) {
    console.warn('[Growth Engine] Failed to get user timeline:', error)
    return []
  }
}

/**
 * Get campaign overview (admin only)
 */
export async function getCampaignOverview(): Promise<CampaignOverview | null> {
  if (!isBackendSyncEnabled('growthEngine')) {
    return null
  }

  try {
    const response = await apiFetch<{ success: boolean; data: CampaignOverview }>(
      '/admin/growth/campaigns/overview'
    )

    if (!response.success || !response.data) {
      return null
    }

    return response.data
  } catch (error) {
    console.warn('[Growth Engine] Failed to get campaign overview:', error)
    return null
  }
}

/**
 * Get eligible nudges for user context
 */
export async function getEligibleNudges(context: GetEligibleNudgesContext): Promise<EligibleNudge[]> {
  if (!isBackendSyncEnabled('growthEngine')) {
    // Return fallback nudges based on local config
    return getFallbackNudges(context)
  }

  try {
    const params = new URLSearchParams()
    if (context.userId) params.append('userId', context.userId)
    if (context.producerId) params.append('producerId', context.producerId)
    if (context.role) params.append('role', context.role)
    if (context.page) params.append('page', context.page)
    if (context.subscriptionActive !== undefined) params.append('subscriptionActive', String(context.subscriptionActive))
    if (context.hasJournalArticles !== undefined) params.append('hasJournalArticles', String(context.hasJournalArticles))
    if (context.cartItemsCount !== undefined) params.append('cartItemsCount', String(context.cartItemsCount))
    if (context.metadata) params.append('metadata', JSON.stringify(context.metadata))

    const response = await apiFetch<{ success: boolean; data: EligibleNudge[] }>(
      `/admin/growth/nudges?${params.toString()}`
    )

    if (!response.success || !response.data) {
      return getFallbackNudges(context)
    }

    return response.data
  } catch (error) {
    console.warn('[Growth Engine] Failed to get eligible nudges:', error)
    return getFallbackNudges(context)
  }
}

/**
 * Fallback nudges (local config when backend is disabled)
 */
function getFallbackNudges(context: GetEligibleNudgesContext): EligibleNudge[] {
  const nudges: EligibleNudge[] = []

  // Client nudges
  if (context.role === 'CUSTOMER' || context.role === 'client') {
    if (!context.subscriptionActive && context.page === 'homepage') {
      nudges.push({
        code: 'subscription_prompt',
        description: 'Descoperă abonamentele noastre',
        priority: 5,
        message: 'Abonează-te pentru produse proaspete săptămânal!',
        actionUrl: '/abonamente',
      })
    }

    if (context.cartItemsCount && context.cartItemsCount > 0 && context.page === 'checkout') {
      nudges.push({
        code: 'cart_reminder',
        description: 'Finalizează comanda',
        priority: 10,
        message: 'Ai produse în coș - finalizează comanda!',
        actionUrl: '/cos',
      })
    }
  }

  // Producer nudges
  if (context.role === 'PRODUCER' || context.role === 'producer') {
    if (!context.hasJournalArticles && context.page === 'portal') {
      nudges.push({
        code: 'journal_activation',
        description: 'Activează-ți Jurnalul',
        priority: 8,
        message: 'Spune povestea fermei tale în Jurnalul de farme.ro!',
        actionUrl: '/portal-producatori/jurnal',
      })
    }
  }

  return nudges
}

