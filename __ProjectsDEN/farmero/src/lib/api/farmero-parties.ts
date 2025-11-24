/**
 * Farmero Parties API
 * 
 * API functions for managing party profiles and relations
 * Uses apiFetch to call https://api.farme.ro (external backend API)
 * 
 * IMPORTANT: Backend-ul este într-un repo separat (api.farme.ro).
 * Aceste funcții sunt doar API contracts și fallback-uri pentru frontend.
 * 
 * Note: Backend endpoints need to be implemented in the separate backend repository:
 * - GET /parties/me - Get current user's party profile
 * - GET /parties/counterparties - Get list of counterparties (parties with relations)
 * 
 * FALLBACK: If partiesAndContracts is disabled in BackendSyncStatus, returns default values
 * 
 * See: docs/FARMERO_PARTIES_AND_CONTRACTS_MODEL.md for API contract documentation
 */

import { apiFetch, ApiError } from './client'
import { isBackendSyncEnabled } from '@/lib/backend-sync/status'
import type { FarmeroPartyRef } from '@/lib/types/farmero-parties'

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get current user's party profile
 * 
 * @returns Current user's party reference
 * @throws ApiError if request fails
 * 
 * FALLBACK: Returns null if backend is not enabled
 */
export async function getMyPartyProfile(): Promise<FarmeroPartyRef | null> {
  if (!isBackendSyncEnabled('partiesAndContracts')) {
    return null
  }

  try {
    const response = await apiFetch<FarmeroPartyRef | { data: FarmeroPartyRef }>(
      '/parties/me',
      {
        method: 'GET',
        credentials: 'include',
      }
    )

    if ('data' in response) {
      return response.data
    }
    return response
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a vedea profilul de party.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a accesa profilul de party.')
      }
      if (error.status === 404) {
        // No party profile yet
        return null
      }
      throw error
    }
    throw error
  }
}

/**
 * Get counterparties (parties with relations to current user)
 * 
 * @returns List of counterparties
 * @throws ApiError if request fails
 * 
 * FALLBACK: Returns empty array if backend is not enabled
 */
export async function getCounterparties(): Promise<FarmeroPartyRef[]> {
  if (!isBackendSyncEnabled('partiesAndContracts')) {
    return []
  }

  try {
    const response = await apiFetch<FarmeroPartyRef[] | { data: FarmeroPartyRef[] }>(
      '/parties/counterparties',
      {
        method: 'GET',
        credentials: 'include',
      }
    )

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
        throw new Error('Trebuie să fii autentificat pentru a vedea counterparties.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a accesa counterparties.')
      }
      throw error
    }
    throw error
  }
}

