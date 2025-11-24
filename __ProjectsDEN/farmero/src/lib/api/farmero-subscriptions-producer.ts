/**
 * Farmero Producer Subscriptions API
 * 
 * API functions for managing producer subscription tiers (Basic, Boost, Pro)
 * Uses apiFetch to call https://api.farme.ro (external backend API)
 * 
 * IMPORTANT: Backend-ul este într-un repo separat (api.farme.ro).
 * Aceste funcții sunt doar API contracts și fallback-uri pentru frontend.
 * 
 * Note: Backend endpoints need to be implemented in the separate backend repository:
 * - GET /producers/subscriptions/status - Get producer subscription status
 * - GET /producers/subscriptions/tiers - Get available subscription tiers
 * - POST /producers/subscriptions/upgrade - Upgrade producer subscription
 * - DELETE /producers/subscriptions - Cancel producer subscription
 * 
 * FALLBACK: If subscriptionsProducer is disabled in BackendSyncStatus, returns empty array / throws error
 * 
 * See: docs/FARMERO_SUBSCRIPTIONS_AND_POINTS_SPEC.md for API contract documentation
 */

import { apiFetch, ApiError } from './client'
import { isBackendSyncEnabled } from '@/lib/backend-sync/status'
import type {
  FarmeroProducerSubscriptionStatus,
  FarmeroProducerTier,
} from '@/lib/types/subscriptions'

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get producer subscription status
 * 
 * @returns Producer subscription status
 * @throws ApiError if request fails
 * 
 * FALLBACK: Returns null if backend is not enabled
 */
export async function getProducerSubscriptionStatus(): Promise<FarmeroProducerSubscriptionStatus | null> {
  if (!isBackendSyncEnabled('subscriptionsProducer')) {
    return null
  }

  try {
    const response = await apiFetch<
      FarmeroProducerSubscriptionStatus | { data: FarmeroProducerSubscriptionStatus }
    >('/producers/subscriptions/status', {
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
        throw new Error('Trebuie să fii autentificat ca producător pentru a vedea statusul abonamentului.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a accesa statusul abonamentului.')
      }
      if (error.status === 404) {
        // Producer doesn't have a subscription yet
        return null
      }
      throw error
    }
    throw error
  }
}

/**
 * Get available producer subscription tiers
 * 
 * @returns List of available subscription tiers
 * @throws ApiError if request fails
 * 
 * FALLBACK: Returns empty array if backend is not enabled
 */
export async function getProducerSubscriptionTiers(): Promise<FarmeroProducerTier[]> {
  if (!isBackendSyncEnabled('subscriptionsProducer')) {
    return []
  }

  try {
    const response = await apiFetch<
      FarmeroProducerTier[] | { data: FarmeroProducerTier[] }
    >('/producers/subscriptions/tiers', {
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
        throw new Error('Trebuie să fii autentificat ca producător pentru a vedea tier-urile disponibile.')
      }
      throw error
    }
    throw error
  }
}

/**
 * Upgrade producer subscription
 * 
 * @param tierId - Tier ID to upgrade to
 * @returns Updated subscription status
 * @throws ApiError if request fails
 * 
 * FALLBACK: Throws error if backend is not enabled
 */
export async function upgradeProducerSubscription(
  tierId: string
): Promise<FarmeroProducerSubscriptionStatus> {
  if (!isBackendSyncEnabled('subscriptionsProducer')) {
    throw new Error('Funcționalitatea de abonamente pentru producători este în dezvoltare.')
  }

  try {
    const response = await apiFetch<
      FarmeroProducerSubscriptionStatus | { data: FarmeroProducerSubscriptionStatus }
    >('/producers/subscriptions/upgrade', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ tierId }),
    })

    if ('data' in response) {
      return response.data
    }
    return response
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 400) {
        throw new Error('Date invalide. Verifică că tier-ul este corect.')
      }
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat ca producător pentru a face upgrade.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a face upgrade la abonament.')
      }
      if (error.status === 422) {
        throw new Error('Nu se poate face upgrade. Verifică că tier-ul este disponibil.')
      }
      throw error
    }
    throw error
  }
}

/**
 * Cancel producer subscription
 * 
 * @returns Updated subscription status (with validUntil in the past)
 * @throws ApiError if request fails
 * 
 * FALLBACK: Throws error if backend is not enabled
 */
export async function cancelProducerSubscription(): Promise<FarmeroProducerSubscriptionStatus> {
  if (!isBackendSyncEnabled('subscriptionsProducer')) {
    throw new Error('Funcționalitatea de abonamente pentru producători este în dezvoltare.')
  }

  try {
    const response = await apiFetch<
      FarmeroProducerSubscriptionStatus | { data: FarmeroProducerSubscriptionStatus }
    >('/producers/subscriptions', {
      method: 'DELETE',
      credentials: 'include',
    })

    if ('data' in response) {
      return response.data
    }
    return response
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat ca producător pentru a anula abonamentul.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a anula abonamentul.')
      }
      if (error.status === 404) {
        throw new Error('Abonamentul nu a fost găsit.')
      }
      throw error
    }
    throw error
  }
}

