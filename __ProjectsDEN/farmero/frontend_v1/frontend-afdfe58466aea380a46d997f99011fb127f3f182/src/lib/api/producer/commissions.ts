/**
 * Producer Commissions API
 * 
 * API functions for fetching producer commission data
 * Uses apiFetch to call https://api.farme.ro
 */

import { apiFetch, ApiError } from '../client'

// ============================================================================
// Types
// ============================================================================

/**
 * Producer Commission Summary
 * 
 * Date despre comisionul actual al producătorului
 */
export interface ProducerCommissionSummary {
  currentCommissionPercent: number
  planName?: string
  baseCommissionPercent?: number
  monthlySales?: number
  nextTier?: {
    threshold: number
    rate: number
  }
}

/**
 * Producer Commission History Item
 * 
 * Un element din istoricul comisioanelor
 */
export interface ProducerCommissionHistoryItem {
  period: string // ex: "2024-01"
  label: string // ex: "Ianuarie 2024"
  salesTotal: number // lei
  rate: number // procent
  commissionTotal: number // lei
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get producer commission summary
 * 
 * @returns Commission summary or null if not available
 */
export async function getProducerCommissionSummary(): Promise<ProducerCommissionSummary | null> {
  try {
    const summary = await apiFetch<ProducerCommissionSummary>('/producers/commissions/summary', {
      method: 'GET',
      credentials: 'include',
    })
    
    return summary
  } catch (error) {
    if (error instanceof ApiError) {
      // If endpoint doesn't exist yet (404), return null
      if (error.status === 404) {
        return null
      }
      if (error.status === 401) {
        return null
      }
      // For other errors, log but don't throw
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('[Producer Commissions] Error fetching summary:', error)
      }
      return null
    }
    return null
  }
}

/**
 * Get producer commission history
 * 
 * @returns Commission history (empty array if not available)
 */
export async function getProducerCommissionHistory(): Promise<ProducerCommissionHistoryItem[]> {
  try {
    const response = await apiFetch<ProducerCommissionHistoryItem[] | { data: ProducerCommissionHistoryItem[] }>(
      '/producers/commissions/history',
      {
        method: 'GET',
        credentials: 'include',
      }
    )
    
    // Handle both array and paginated response
    if (Array.isArray(response)) {
      return response
    }
    if (response && 'data' in response) {
      return response.data
    }
    
    return []
  } catch (error) {
    if (error instanceof ApiError) {
      // If endpoint doesn't exist yet (404), return empty array
      if (error.status === 404) {
        return []
      }
      if (error.status === 401) {
        return []
      }
      // For other errors, log but don't throw
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('[Producer Commissions] Error fetching history:', error)
      }
      return []
    }
    return []
  }
}

// Server-side versions (for Next.js server components)
// These use the same endpoints but can be called from server components

/**
 * Get producer commission summary (server-side)
 * 
 * @returns Commission summary or null if not available
 */
export async function getProducerCommissionSummaryServer(): Promise<ProducerCommissionSummary | null> {
  // For server components, we can use the same function
  // The apiFetch will work from server-side too
  return getProducerCommissionSummary()
}

/**
 * Get producer commission history (server-side)
 * 
 * @returns Commission history (empty array if not available)
 */
export async function getProducerCommissionHistoryServer(): Promise<ProducerCommissionHistoryItem[]> {
  // For server components, we can use the same function
  return getProducerCommissionHistory()
}
