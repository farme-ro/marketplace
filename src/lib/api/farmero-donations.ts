/**
 * Farmero Donations API
 * 
 * API functions for managing donations to the Farmero platform
 * Uses apiFetch to call https://api.farme.ro (external backend API)
 * 
 * IMPORTANT: Backend-ul este într-un repo separat (api.farme.ro).
 * Aceste funcții sunt doar API contracts și fallback-uri pentru frontend.
 * 
 * Note: Backend endpoints need to be implemented in the separate backend repository:
 * - GET /donations/summary - Get donation summary (aggregated amounts, donor count)
 * - POST /donations/intent - Create donation intent (for payment processing)
 * - GET /donations/preferences - Get user's donation preferences
 * - PATCH /donations/preferences - Update user's donation preferences
 * 
 * FALLBACK: If donations is disabled in BackendSyncStatus, returns default values / throws errors
 * 
 * See: docs/FARMERO_DONATIONS_POLICY.md for donation policy documentation
 */

import { apiFetch, ApiError } from './client'
import { isBackendSyncEnabled } from '@/lib/backend-sync/status'
import type {
  FarmeroDonationSummary,
  FarmeroDonationPreference,
  FarmeroDonationIntent,
  FarmeroDonationIntentResponse,
} from '@/lib/types/farmero-donations'

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get donation summary
 * 
 * @returns Donation summary with aggregated amounts and donor count
 * @throws ApiError if request fails
 * 
 * FALLBACK: Returns default summary with zero values if backend is not enabled
 */
export async function getDonationSummary(): Promise<FarmeroDonationSummary> {
  if (!isBackendSyncEnabled('donations')) {
    // Return default summary for current month
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    return {
      periodStart: firstDay.toISOString(),
      periodEnd: lastDay.toISOString(),
      totalAmount: 0,
      currency: 'RON',
      donorsCount: 0,
    }
  }

  try {
    const response = await apiFetch<
      FarmeroDonationSummary | { data: FarmeroDonationSummary }
    >('/donations/summary', {
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
        throw new Error('Trebuie să fii autentificat pentru a vedea rezumatul donațiilor.')
      }
      throw error
    }
    throw error
  }
}

/**
 * Create donation intent
 * 
 * @param input - Donation intent (amount, currency)
 * @returns Donation intent response (with payment URL if available)
 * @throws ApiError if request fails
 * 
 * FALLBACK: Throws error if backend is not enabled
 */
export async function createDonationIntent(
  input: FarmeroDonationIntent
): Promise<FarmeroDonationIntentResponse> {
  if (!isBackendSyncEnabled('donations')) {
    throw new Error('Sistemul de donații este în dezvoltare. Îți mulțumim că vrei să susții Farmero.')
  }

  try {
    const response = await apiFetch<
      FarmeroDonationIntentResponse | { data: FarmeroDonationIntentResponse }
    >('/donations/intent', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    })

    if ('data' in response) {
      return response.data
    }
    return response
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a dona.')
      }
      if (error.status === 400) {
        throw new Error('Date invalide pentru donație.')
      }
      throw error
    }
    throw error
  }
}

/**
 * Get user's donation preferences
 * 
 * @returns User's donation preferences
 * @throws ApiError if request fails
 * 
 * FALLBACK: Returns default preferences if backend is not enabled
 */
export async function getDonationPreference(): Promise<FarmeroDonationPreference> {
  if (!isBackendSyncEnabled('donations')) {
    return {
      showNamePublicly: false,
    }
  }

  try {
    const response = await apiFetch<
      FarmeroDonationPreference | { data: FarmeroDonationPreference }
    >('/donations/preferences', {
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
        // Not authenticated, return default preferences
        return {
          showNamePublicly: false,
        }
      }
      throw error
    }
    throw error
  }
}

/**
 * Update user's donation preferences
 * 
 * @param preferences - Updated donation preferences
 * @returns Updated donation preferences
 * @throws ApiError if request fails
 * 
 * FALLBACK: Throws error if backend is not enabled
 */
export async function updateDonationPreference(
  preferences: FarmeroDonationPreference
): Promise<FarmeroDonationPreference> {
  if (!isBackendSyncEnabled('donations')) {
    throw new Error('Sistemul de donații este în dezvoltare.')
  }

  try {
    const response = await apiFetch<
      FarmeroDonationPreference | { data: FarmeroDonationPreference }
    >('/donations/preferences', {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    })

    if ('data' in response) {
      return response.data
    }
    return response
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a actualiza preferințele.')
      }
      if (error.status === 400) {
        throw new Error('Date invalide pentru preferințe.')
      }
      throw error
    }
    throw error
  }
}

