/**
 * Farmero Subscriptions Public API
 * 
 * API functions for public subscription plans (homepage marketing)
 * Uses apiFetch to call https://api.farme.ro (external backend API)
 * 
 * IMPORTANT: Backend-ul este într-un repo separat (api.farme.ro).
 * Aceste funcții sunt doar API contracts și fallback-uri pentru frontend.
 * 
 * Note: Backend endpoints need to be implemented in the separate backend repository:
 * - GET /subscriptions/public/plans - Get public subscription plans (for homepage)
 * 
 * FALLBACK: If subscriptionsClient is disabled in BackendSyncStatus, returns empty array
 * 
 * See: docs/BACKEND_API_CONTRACT_FARMERO_SUBSCRIPTIONS_PUBLIC.md for API contract documentation
 */

import { apiFetch, ApiError } from './client'
import { isBackendSyncEnabled } from '@/lib/backend-sync/status'
import type { FarmeroSubscriptionPlan } from '@/lib/types/subscriptions'

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get public subscription plans
 * 
 * @param regionId - Optional region ID to filter by
 * @returns List of public subscription plans
 * @throws ApiError if request fails
 * 
 * FALLBACK: Returns empty array if backend is not enabled
 */
export async function getPublicSubscriptionPlans(
  regionId?: string
): Promise<FarmeroSubscriptionPlan[]> {
  if (!isBackendSyncEnabled('subscriptionsClient')) {
    return []
  }

  try {
    const params = new URLSearchParams()
    if (regionId) {
      params.append('regionId', regionId)
    }

    const url = `/subscriptions/public/plans${params.toString() ? `?${params.toString()}` : ''}`
    const response = await apiFetch<
      FarmeroSubscriptionPlan[] | { data: FarmeroSubscriptionPlan[] }
    >(url, {
      method: 'GET',
      credentials: 'include',
    })

    if (Array.isArray(response)) {
      return response
    }
    if (response && 'data' in response && Array.isArray(response.data)) {
      return response.data
    }
    return []
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        // Endpoint should be public, but if 401, return empty
        return []
      }
      if (error.status === 404) {
        // Endpoint doesn't exist yet
        return []
      }
      throw error
    }
    throw error
  }
}

