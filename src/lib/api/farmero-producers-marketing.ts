/**
 * Farmero Producers Marketing API
 * 
 * API functions for producer visibility and marketing features
 * Uses apiFetch to call https://api.farme.ro (external backend API)
 * 
 * IMPORTANT: Backend-ul este într-un repo separat (api.farme.ro).
 * Aceste funcții sunt doar API contracts și fallback-uri pentru frontend.
 * 
 * Note: Backend endpoints need to be implemented in the separate backend repository:
 * - GET /producers/featured - Get featured producers (with optional region filter)
 * - GET /producers/:id/visibility - Get producer visibility info
 * 
 * FALLBACK: If producerMarketing is disabled in BackendSyncStatus, returns empty array / none tier
 * 
 * See: docs/BACKEND_API_CONTRACT_FARMERO_PRODUCER_MARKETING.md for API contract documentation
 */

import { apiFetch, ApiError } from './client'
import { isBackendSyncEnabled } from '@/lib/backend-sync/status'
import type {
  ProducerVisibilityInfo,
  ProducerWithVisibility,
} from '@/lib/types/farmero-marketing'
import type { ProducerSummary } from './public/producers'

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get featured producers
 * 
 * @param regionId - Optional region ID to filter by
 * @returns List of featured producers with visibility info
 * @throws ApiError if request fails
 * 
 * FALLBACK: Returns empty array if backend is not enabled
 */
export async function getFeaturedProducers(
  regionId?: string
): Promise<ProducerWithVisibility[]> {
  if (!isBackendSyncEnabled('producerMarketing')) {
    return []
  }

  try {
    const params = new URLSearchParams()
    if (regionId) {
      params.append('regionId', regionId)
    }

    const url = `/producers/featured${params.toString() ? `?${params.toString()}` : ''}`
    const response = await apiFetch<
      ProducerWithVisibility[] | { data: ProducerWithVisibility[] }
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

/**
 * Get producer visibility info
 * 
 * @param producerId - Producer ID
 * @returns Producer visibility info
 * @throws ApiError if request fails
 * 
 * FALLBACK: Returns tier 'none' if backend is not enabled
 */
export async function getProducerVisibilityInfo(
  producerId: string
): Promise<ProducerVisibilityInfo> {
  if (!isBackendSyncEnabled('producerMarketing')) {
    return {
      producerId,
      tier: 'none',
    }
  }

  try {
    const response = await apiFetch<
      ProducerVisibilityInfo | { data: ProducerVisibilityInfo }
    >(`/producers/${producerId}/visibility`, {
      method: 'GET',
      credentials: 'include',
    })

    if ('data' in response) {
      return response.data
    }
    return response
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        // Endpoint should be public, but if 401, return none
        return {
          producerId,
          tier: 'none',
        }
      }
      if (error.status === 404) {
        // Producer not found or endpoint doesn't exist
        return {
          producerId,
          tier: 'none',
        }
      }
      throw error
    }
    throw error
  }
}

/**
 * Enhance producer summary with visibility info
 * 
 * @param producer - Producer summary
 * @returns Producer with visibility info
 */
export async function enhanceProducerWithVisibility(
  producer: ProducerSummary
): Promise<ProducerWithVisibility> {
  const visibility = await getProducerVisibilityInfo(producer.id)

  return {
    ...producer,
    productCount: producer.productCount ?? 0, // Ensure productCount is always present
    visibility,
  }
}

