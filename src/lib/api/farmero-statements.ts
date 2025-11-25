/**
 * Farmero Statements API
 * 
 * API functions for managing statements (extrase de plată)
 * Uses apiFetch to call https://api.farme.ro (external backend API)
 * 
 * IMPORTANT: Backend-ul este într-un repo separat (api.farme.ro).
 * Aceste funcții sunt doar API contracts și fallback-uri pentru frontend.
 * 
 * Note: Backend endpoints need to be implemented in the separate backend repository:
 * - GET /statements - Get current user's statements
 * - GET /statements/:id - Get statement by ID
 * - GET /statements/current - Get current period summary (optional)
 * 
 * FALLBACK: If feesAndStatements is disabled in BackendSyncStatus, returns empty array / throws error
 * 
 * See: docs/FARMERO_FEES_AND_STATEMENTS.md for API contract documentation
 */

import { apiFetch, ApiError } from './client'
import { isBackendSyncEnabled } from '@/lib/backend-sync/status'
import type { FarmeroStatementSummary } from '@/lib/types/farmero-fees'

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get current user's statements
 * 
 * @returns List of statements for the current user
 * @throws ApiError if request fails
 * 
 * FALLBACK: Returns empty array if backend is not enabled
 */
export async function getMyStatements(): Promise<FarmeroStatementSummary[]> {
  if (!isBackendSyncEnabled('feesAndStatements')) {
    return []
  }

  try {
    const response = await apiFetch<
      FarmeroStatementSummary[] | { data: FarmeroStatementSummary[] }
    >('/statements', {
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
        throw new Error('Trebuie să fii autentificat pentru a vedea extrasele.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a accesa extrasele.')
      }
      throw error
    }
    throw error
  }
}

/**
 * Get statement by ID
 * 
 * @param id - Statement ID
 * @returns Statement summary with lines
 * @throws ApiError if request fails
 * 
 * FALLBACK: Throws error if backend is not enabled
 */
export async function getStatementById(id: string): Promise<FarmeroStatementSummary> {
  if (!isBackendSyncEnabled('feesAndStatements')) {
    throw new Error('Extrasele nu sunt încă disponibile în contul tău.')
  }

  try {
    const response = await apiFetch<
      FarmeroStatementSummary | { data: FarmeroStatementSummary }
    >(`/statements/${id}`, {
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
        throw new Error('Trebuie să fii autentificat pentru a vedea extrasul.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a accesa acest extras.')
      }
      if (error.status === 404) {
        throw new Error('Extrasul nu a fost găsit.')
      }
      throw error
    }
    throw error
  }
}

/**
 * Get current period summary
 * 
 * @returns Current period statement summary (if available)
 * @throws ApiError if request fails
 * 
 * FALLBACK: Returns null if backend is not enabled
 */
export async function getCurrentPeriodSummary(): Promise<FarmeroStatementSummary | null> {
  if (!isBackendSyncEnabled('feesAndStatements')) {
    return null
  }

  try {
    const response = await apiFetch<
      FarmeroStatementSummary | { data: FarmeroStatementSummary } | null
    >('/statements/current', {
      method: 'GET',
      credentials: 'include',
    })

    if (!response) {
      return null
    }

    if ('data' in response) {
      return response.data
    }
    return response
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a vedea rezumatul perioadei curente.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a accesa rezumatul.')
      }
      if (error.status === 404) {
        // No current period summary yet
        return null
      }
      throw error
    }
    throw error
  }
}

