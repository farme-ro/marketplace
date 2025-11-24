/**
 * Silent Alerts API
 * 
 * API functions for managing alert preferences (price drops, back in stock)
 * Uses apiFetch to call https://api.farme.ro (external backend API)
 * 
 * IMPORTANT: Backend-ul este într-un repo separat (api.farme.ro).
 * Aceste funcții sunt doar API contracts și fallback-uri pentru frontend.
 * 
 * Note: Backend endpoints need to be implemented in the separate backend repository:
 * - GET /clients/alert-preferences - Get alert preferences
 * - PATCH /clients/alert-preferences - Update alert preferences
 * 
 * FALLBACK: If alerts is disabled in BackendSyncStatus, returns empty array / no-op
 * 
 * See: docs/BACKEND_API_CONTRACT_FAVORITES_SUBSCRIPTIONS_ALERTS.md for API contract documentation
 */

import { apiFetch, ApiError } from './client'
import { isBackendSyncEnabled } from '@/lib/backend-sync/status'
import type {
  FavoriteAlertPreference,
  UpdateAlertPreferencesInput,
} from '@/lib/types/alerts'

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get alert preferences for current user
 * 
 * @returns List of alert preferences
 * @throws ApiError if request fails
 * 
 * FALLBACK: If backend doesn't support alerts, returns empty array
 */
export async function getAlertPreferences(): Promise<FavoriteAlertPreference[]> {
  if (!isBackendSyncEnabled('alerts')) {
    return []
  }

  try {
    const response = await apiFetch<
      FavoriteAlertPreference[] | { data: FavoriteAlertPreference[] }
    >('/clients/alert-preferences', {
      method: 'GET',
      credentials: 'include',
    })
    
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
        throw new Error('Trebuie să fii autentificat pentru a vedea preferințele de notificare.')
      }
      throw new Error(error.message || 'Eroare la încărcarea preferințelor de notificare.')
    }
    throw error
  }
}

/**
 * Update alert preferences
 * 
 * @param input - Alert preferences to update
 * @returns Updated alert preferences
 * @throws ApiError if request fails
 * 
 * FALLBACK: If backend doesn't support alerts, no-op (returns input)
 */
export async function updateAlertPreferences(
  input: UpdateAlertPreferencesInput
): Promise<FavoriteAlertPreference[]> {
  if (!isBackendSyncEnabled('alerts')) {
    // No-op: return input as-is
    return input.preferences
  }

  try {
    const response = await apiFetch<
      FavoriteAlertPreference[] | { data: FavoriteAlertPreference[] }
    >('/clients/alert-preferences', {
      method: 'PATCH',
      credentials: 'include',
      body: JSON.stringify(input),
    })
    
    // Handle both array and paginated response
    if (Array.isArray(response)) {
      return response
    }
    if (response && 'data' in response && Array.isArray(response.data)) {
      return response.data
    }
    
    return input.preferences
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 400) {
        throw new Error('Date invalide. Verifică că toate câmpurile sunt corecte.')
      }
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a actualiza preferințele de notificare.')
      }
      throw new Error(error.message || 'Eroare la actualizarea preferințelor de notificare.')
    }
    throw error
  }
}

/**
 * Get alert preference for a specific item
 * 
 * @param targetType - Type of favorite ('product' or 'producer')
 * @param targetId - ID of the product or producer
 * @returns Alert preference or null if not found
 */
export async function getAlertPreference(
  targetType: 'product' | 'producer',
  targetId: string
): Promise<FavoriteAlertPreference | null> {
  const preferences = await getAlertPreferences()
  return (
    preferences.find(
      p => p.targetType === targetType && p.targetId === targetId
    ) || null
  )
}

