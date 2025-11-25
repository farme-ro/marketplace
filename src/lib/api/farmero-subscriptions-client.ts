/**
 * Farmero Client Subscriptions API
 * 
 * API functions for managing client subscriptions (active subscriptions)
 * Uses apiFetch to call https://api.farme.ro (external backend API)
 * 
 * IMPORTANT: Backend-ul este într-un repo separat (api.farme.ro).
 * Aceste funcții sunt doar API contracts și fallback-uri pentru frontend.
 * 
 * Note: Backend endpoints need to be implemented in the separate backend repository:
 * - GET /clients/subscriptions - Get client's active subscriptions
 * - GET /clients/subscriptions/plans - Get available subscription plans
 * - POST /clients/subscriptions - Create new subscription
 * - PATCH /clients/subscriptions/:id/pause - Pause subscription
 * - PATCH /clients/subscriptions/:id/resume - Resume subscription
 * - DELETE /clients/subscriptions/:id - Cancel subscription
 * 
 * FALLBACK: If subscriptionsClientActive is disabled in BackendSyncStatus, returns empty array / throws error
 * 
 * See: docs/FARMERO_SUBSCRIPTIONS_AND_POINTS_SPEC.md for API contract documentation
 */

import { apiFetch, ApiError } from './client'
import { isBackendSyncEnabled } from '@/lib/backend-sync/status'
import type {
  FarmeroClientSubscription,
  FarmeroSubscriptionPlan,
} from '@/lib/types/subscriptions'

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get client's active subscriptions
 * 
 * @returns List of active client subscriptions
 * @throws ApiError if request fails
 * 
 * FALLBACK: Returns empty array if backend is not enabled
 */
export async function getClientSubscriptions(): Promise<FarmeroClientSubscription[]> {
  if (!isBackendSyncEnabled('subscriptionsClientActive')) {
    return []
  }

  try {
    const response = await apiFetch<
      FarmeroClientSubscription[] | { data: FarmeroClientSubscription[] }
    >('/clients/subscriptions', {
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
        throw new Error('Trebuie să fii autentificat pentru a vedea abonamentele.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a accesa abonamentele.')
      }
      throw error
    }
    throw error
  }
}

/**
 * Get available subscription plans
 * 
 * @param regionId - Optional region ID to filter by
 * @returns List of available subscription plans
 * @throws ApiError if request fails
 * 
 * FALLBACK: Returns empty array if backend is not enabled
 */
export async function getAvailableSubscriptionPlans(
  regionId?: string
): Promise<FarmeroSubscriptionPlan[]> {
  if (!isBackendSyncEnabled('subscriptionsClientActive')) {
    return []
  }

  try {
    const params = new URLSearchParams()
    if (regionId) {
      params.append('regionId', regionId)
    }

    const url = `/clients/subscriptions/plans${params.toString() ? `?${params.toString()}` : ''}`
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
        throw new Error('Trebuie să fii autentificat pentru a vedea planurile de abonament.')
      }
      throw error
    }
    throw error
  }
}

/**
 * Create new client subscription
 * 
 * @param planId - Subscription plan ID
 * @param producerId - Producer ID
 * @returns Created subscription
 * @throws ApiError if request fails
 * 
 * FALLBACK: Throws error if backend is not enabled
 */
export async function createClientSubscription(
  planId: string,
  producerId: string
): Promise<FarmeroClientSubscription> {
  if (!isBackendSyncEnabled('subscriptionsClientActive')) {
    throw new Error('Abonamentele nu sunt încă disponibile.')
  }

  try {
    const response = await apiFetch<
      FarmeroClientSubscription | { data: FarmeroClientSubscription }
    >('/clients/subscriptions', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ planId, producerId }),
    })

    if ('data' in response) {
      return response.data
    }
    return response
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 400) {
        throw new Error('Date invalide. Verifică că planul și producătorul sunt corecte.')
      }
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a crea un abonament.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a crea acest abonament.')
      }
      if (error.status === 422) {
        throw new Error('Nu se poate crea abonamentul. Verifică că planul este disponibil.')
      }
      throw error
    }
    throw error
  }
}

/**
 * Pause client subscription
 * 
 * @param id - Subscription ID
 * @returns Updated subscription
 * @throws ApiError if request fails
 * 
 * FALLBACK: Throws error if backend is not enabled
 */
export async function pauseClientSubscription(
  id: string
): Promise<FarmeroClientSubscription> {
  if (!isBackendSyncEnabled('subscriptionsClientActive')) {
    throw new Error('Abonamentele nu sunt încă disponibile.')
  }

  try {
    const response = await apiFetch<
      FarmeroClientSubscription | { data: FarmeroClientSubscription }
    >(`/clients/subscriptions/${id}/pause`, {
      method: 'PATCH',
      credentials: 'include',
    })

    if ('data' in response) {
      return response.data
    }
    return response
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a pune abonamentul în pauză.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a modifica acest abonament.')
      }
      if (error.status === 404) {
        throw new Error('Abonamentul nu a fost găsit.')
      }
      throw error
    }
    throw error
  }
}

/**
 * Resume client subscription
 * 
 * @param id - Subscription ID
 * @returns Updated subscription
 * @throws ApiError if request fails
 * 
 * FALLBACK: Throws error if backend is not enabled
 */
export async function resumeClientSubscription(
  id: string
): Promise<FarmeroClientSubscription> {
  if (!isBackendSyncEnabled('subscriptionsClientActive')) {
    throw new Error('Abonamentele nu sunt încă disponibile.')
  }

  try {
    const response = await apiFetch<
      FarmeroClientSubscription | { data: FarmeroClientSubscription }
    >(`/clients/subscriptions/${id}/resume`, {
      method: 'PATCH',
      credentials: 'include',
    })

    if ('data' in response) {
      return response.data
    }
    return response
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a relua abonamentul.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a modifica acest abonament.')
      }
      if (error.status === 404) {
        throw new Error('Abonamentul nu a fost găsit.')
      }
      throw error
    }
    throw error
  }
}

/**
 * Cancel client subscription
 * 
 * @param id - Subscription ID
 * @returns Updated subscription (with isActive: false)
 * @throws ApiError if request fails
 * 
 * FALLBACK: Throws error if backend is not enabled
 */
export async function cancelClientSubscription(
  id: string
): Promise<FarmeroClientSubscription> {
  if (!isBackendSyncEnabled('subscriptionsClientActive')) {
    throw new Error('Abonamentele nu sunt încă disponibile.')
  }

  try {
    const response = await apiFetch<
      FarmeroClientSubscription | { data: FarmeroClientSubscription }
    >(`/clients/subscriptions/${id}`, {
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
        throw new Error('Trebuie să fii autentificat pentru a anula abonamentul.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a anula acest abonament.')
      }
      if (error.status === 404) {
        throw new Error('Abonamentul nu a fost găsit.')
      }
      throw error
    }
    throw error
  }
}

