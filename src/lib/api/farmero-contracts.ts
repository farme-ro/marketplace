/**
 * Farmero Contracts API
 * 
 * API functions for managing contracts between parties
 * Uses apiFetch to call https://api.farme.ro (external backend API)
 * 
 * IMPORTANT: Backend-ul este într-un repo separat (api.farme.ro).
 * Aceste funcții sunt doar API contracts și fallback-uri pentru frontend.
 * 
 * Note: Backend endpoints need to be implemented in the separate backend repository:
 * - GET /contracts - Get current user's contracts
 * - GET /contracts/:id - Get contract by ID
 * - GET /contracts/templates - Get available contract templates
 * 
 * FALLBACK: If partiesAndContracts is disabled in BackendSyncStatus, returns empty array / throws error
 * 
 * See: docs/FARMERO_PARTIES_AND_CONTRACTS_MODEL.md for API contract documentation
 */

import { apiFetch, ApiError } from './client'
import { isBackendSyncEnabled } from '@/lib/backend-sync/status'
import type {
  FarmeroContractInstance,
  FarmeroContractTemplate,
  FarmeroContractType,
} from '@/lib/types/farmero-contracts'

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get current user's contracts
 * 
 * @returns List of contracts where the current user is a party
 * @throws ApiError if request fails
 * 
 * FALLBACK: Returns empty array if backend is not enabled
 */
export async function getMyContracts(): Promise<FarmeroContractInstance[]> {
  if (!isBackendSyncEnabled('partiesAndContracts')) {
    return []
  }

  try {
    const response = await apiFetch<
      FarmeroContractInstance[] | { data: FarmeroContractInstance[] }
    >('/contracts', {
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
        throw new Error('Trebuie să fii autentificat pentru a vedea contractele.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a accesa contractele.')
      }
      throw error
    }
    throw error
  }
}

/**
 * Get contract by ID
 * 
 * @param id - Contract ID
 * @returns Contract instance
 * @throws ApiError if request fails
 * 
 * FALLBACK: Throws error if backend is not enabled
 */
export async function getContractById(id: string): Promise<FarmeroContractInstance> {
  if (!isBackendSyncEnabled('partiesAndContracts')) {
    throw new Error('Contractele nu sunt încă disponibile în contul tău.')
  }

  try {
    const response = await apiFetch<
      FarmeroContractInstance | { data: FarmeroContractInstance }
    >(`/contracts/${id}`, {
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
        throw new Error('Trebuie să fii autentificat pentru a vedea contractul.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a accesa acest contract.')
      }
      if (error.status === 404) {
        throw new Error('Contractul nu a fost găsit.')
      }
      throw error
    }
    throw error
  }
}

/**
 * Get contract templates
 * 
 * @param type - Optional filter by contract type
 * @returns List of available contract templates
 * @throws ApiError if request fails
 * 
 * FALLBACK: Returns empty array if backend is not enabled
 */
export async function getContractTemplates(
  type?: FarmeroContractType
): Promise<FarmeroContractTemplate[]> {
  if (!isBackendSyncEnabled('partiesAndContracts')) {
    return []
  }

  try {
    const params = new URLSearchParams()
    if (type) {
      params.append('type', type)
    }

    const url = `/contracts/templates${params.toString() ? `?${params.toString()}` : ''}`
    const response = await apiFetch<
      FarmeroContractTemplate[] | { data: FarmeroContractTemplate[] }
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
        throw new Error('Trebuie să fii autentificat pentru a vedea template-urile de contracte.')
      }
      throw error
    }
    throw error
  }
}

