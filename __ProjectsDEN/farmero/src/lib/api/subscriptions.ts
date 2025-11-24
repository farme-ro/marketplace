/**
 * Subscription Baskets API
 * 
 * API functions for managing subscription baskets (recurring orders)
 * Uses apiFetch to call https://api.farme.ro (external backend API)
 * 
 * IMPORTANT: Backend-ul este într-un repo separat (api.farme.ro).
 * Aceste funcții sunt doar API contracts și fallback-uri pentru frontend.
 * 
 * Note: Backend endpoints need to be implemented in the separate backend repository:
 * - GET /clients/subscriptions - List all subscription baskets
 * - POST /clients/subscriptions - Create subscription basket
 * - GET /clients/subscriptions/:id - Get subscription basket details
 * - PATCH /clients/subscriptions/:id - Update subscription basket
 * - DELETE /clients/subscriptions/:id - Delete subscription basket
 * - POST /clients/subscriptions/:id/pause - Pause subscription
 * - POST /clients/subscriptions/:id/resume - Resume subscription
 * 
 * FALLBACK: If subscriptions is disabled in BackendSyncStatus, returns empty array
 * 
 * See: docs/BACKEND_API_CONTRACT_FAVORITES_SUBSCRIPTIONS_ALERTS.md for API contract documentation
 */

import { apiFetch, ApiError } from './client'
import { isBackendSyncEnabled } from '@/lib/backend-sync/status'
import type {
  SubscriptionBasket,
  CreateSubscriptionBasketInput,
  UpdateSubscriptionBasketInput,
} from '@/lib/types/subscriptions'

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get all subscription baskets for current user
 * 
 * @returns List of subscription baskets
 * @throws ApiError if request fails
 * 
 * FALLBACK: If backend doesn't support subscriptions, returns empty array
 */
export async function getSubscriptionBaskets(): Promise<SubscriptionBasket[]> {
  if (!isBackendSyncEnabled('subscriptions')) {
    return []
  }

  try {
    const response = await apiFetch<SubscriptionBasket[] | { data: SubscriptionBasket[] }>(
      '/clients/subscriptions',
      {
        method: 'GET',
        credentials: 'include',
      }
    )
    
    // Handle both array and paginated response
    if (Array.isArray(response)) {
      return response
    }
    if (response && 'data' in response && Array.isArray(response.data)) {
      return response.data
    }
    
    return []
  } catch (error) {
    // If endpoint doesn't exist (404), return empty array
    if (error instanceof ApiError && error.status === 404) {
      return []
    }
    
    // For other errors, throw to be handled by caller
    if (error instanceof ApiError) {
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a vedea abonamentele.')
      }
      throw new Error(error.message || 'Eroare la încărcarea abonamentelor.')
    }
    throw error
  }
}

/**
 * Get subscription basket by ID
 * 
 * @param id - Subscription basket ID
 * @returns Subscription basket
 * @throws ApiError if request fails
 */
export async function getSubscriptionBasketById(id: string): Promise<SubscriptionBasket> {
  if (!isBackendSyncEnabled('subscriptions')) {
    throw new Error('Funcționalitatea de abonamente nu este disponibilă încă.')
  }

  try {
    const basket = await apiFetch<SubscriptionBasket>(`/clients/subscriptions/${id}`, {
      method: 'GET',
      credentials: 'include',
    })
    
    return basket
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        throw new Error('Abonamentul nu a fost găsit.')
      }
      if (error.status === 401 || error.status === 403) {
        throw new Error('Nu ai permisiunea de a vedea acest abonament.')
      }
      throw new Error(error.message || 'Eroare la încărcarea abonamentului.')
    }
    throw error
  }
}

/**
 * Create a new subscription basket
 * 
 * @param input - Subscription basket data
 * @returns Created subscription basket
 * @throws ApiError if request fails
 */
export async function createSubscriptionBasket(
  input: CreateSubscriptionBasketInput
): Promise<SubscriptionBasket> {
  if (!isBackendSyncEnabled('subscriptions')) {
    throw new Error('Funcționalitatea de abonamente nu este disponibilă încă.')
  }

  try {
    const basket = await apiFetch<SubscriptionBasket>('/clients/subscriptions', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(input),
    })
    
    return basket
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 400) {
        throw new Error('Date invalide. Verifică că toate câmpurile obligatorii sunt completate.')
      }
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a crea un abonament.')
      }
      throw new Error(error.message || 'Eroare la crearea abonamentului.')
    }
    throw error
  }
}

/**
 * Update a subscription basket
 * 
 * @param id - Subscription basket ID
 * @param input - Update data
 * @returns Updated subscription basket
 * @throws ApiError if request fails
 */
export async function updateSubscriptionBasket(
  id: string,
  input: UpdateSubscriptionBasketInput
): Promise<SubscriptionBasket> {
  if (!isBackendSyncEnabled('subscriptions')) {
    throw new Error('Funcționalitatea de abonamente nu este disponibilă încă.')
  }

  try {
    const basket = await apiFetch<SubscriptionBasket>(`/clients/subscriptions/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      body: JSON.stringify(input),
    })
    
    return basket
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 400) {
        throw new Error('Date invalide. Verifică că toate câmpurile sunt corecte.')
      }
      if (error.status === 404) {
        throw new Error('Abonamentul nu a fost găsit.')
      }
      if (error.status === 401 || error.status === 403) {
        throw new Error('Nu ai permisiunea de a actualiza acest abonament.')
      }
      throw new Error(error.message || 'Eroare la actualizarea abonamentului.')
    }
    throw error
  }
}

/**
 * Delete a subscription basket
 * 
 * @param id - Subscription basket ID
 * @throws ApiError if request fails
 */
export async function deleteSubscriptionBasket(id: string): Promise<void> {
  if (!isBackendSyncEnabled('subscriptions')) {
    throw new Error('Funcționalitatea de abonamente nu este disponibilă încă.')
  }

  try {
    await apiFetch<void>(`/clients/subscriptions/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        throw new Error('Abonamentul nu a fost găsit.')
      }
      if (error.status === 401 || error.status === 403) {
        throw new Error('Nu ai permisiunea de a șterge acest abonament.')
      }
      throw new Error(error.message || 'Eroare la ștergerea abonamentului.')
    }
    throw error
  }
}

/**
 * Pause a subscription basket
 * 
 * @param id - Subscription basket ID
 * @returns Updated subscription basket
 * @throws ApiError if request fails
 */
export async function pauseSubscription(id: string): Promise<SubscriptionBasket> {
  if (!isBackendSyncEnabled('subscriptions')) {
    throw new Error('Funcționalitatea de abonamente nu este disponibilă încă.')
  }

  try {
    const basket = await apiFetch<SubscriptionBasket>(`/clients/subscriptions/${id}/pause`, {
      method: 'POST',
      credentials: 'include',
    })
    
    return basket
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        throw new Error('Abonamentul nu a fost găsit.')
      }
      if (error.status === 401 || error.status === 403) {
        throw new Error('Nu ai permisiunea de a pune în pauză acest abonament.')
      }
      throw new Error(error.message || 'Eroare la punerea în pauză a abonamentului.')
    }
    throw error
  }
}

/**
 * Resume a paused subscription basket
 * 
 * @param id - Subscription basket ID
 * @returns Updated subscription basket
 * @throws ApiError if request fails
 */
export async function resumeSubscription(id: string): Promise<SubscriptionBasket> {
  if (!isBackendSyncEnabled('subscriptions')) {
    throw new Error('Funcționalitatea de abonamente nu este disponibilă încă.')
  }

  try {
    const basket = await apiFetch<SubscriptionBasket>(`/clients/subscriptions/${id}/resume`, {
      method: 'POST',
      credentials: 'include',
    })
    
    return basket
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        throw new Error('Abonamentul nu a fost găsit.')
      }
      if (error.status === 401 || error.status === 403) {
        throw new Error('Nu ai permisiunea de a relua acest abonament.')
      }
      throw new Error(error.message || 'Eroare la reluarea abonamentului.')
    }
    throw error
  }
}

/**
 * Create subscription basket from favorites
 * 
 * Helper function to create a subscription basket based on favorite products
 * 
 * @param favorites - List of favorite items
 * @param options - Options for creating subscription
 * @returns Created subscription basket
 * 
 * Note: Logic to suggest products and quantities from favorites will be implemented when needed
 */
export async function createSubscriptionBasketFromFavorites(
  favorites: Array<{ targetId: string; targetType: 'product' | 'producer' }>,
  options: {
    name: string
    frequency: 'weekly' | 'biweekly' | 'monthly'
    defaultQuantity?: number
  }
): Promise<SubscriptionBasket> {
  // Filter only products (producers can't be in subscription baskets)
  const productFavorites = favorites.filter(f => f.targetType === 'product')
  
  // Create items with default quantity
  const items = productFavorites.map(f => ({
    productId: f.targetId,
    quantity: options.defaultQuantity || 1,
  }))
  
  return createSubscriptionBasket({
    name: options.name,
    items,
    frequency: options.frequency,
  })
}

