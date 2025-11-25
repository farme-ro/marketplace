/**
 * Farmero Fees API
 * 
 * API functions for managing fee rules
 * Uses apiFetch to call https://api.farme.ro (external backend API)
 * 
 * IMPORTANT: Backend-ul este într-un repo separat (api.farme.ro).
 * Aceste funcții sunt doar API contracts și fallback-uri pentru frontend.
 * 
 * Note: Backend endpoints need to be implemented in the separate backend repository:
 * - GET /fees/rules - Get active fee rules
 * 
 * FALLBACK: If feesAndStatements is disabled in BackendSyncStatus, returns empty array
 * 
 * See: docs/FARMERO_FEES_AND_STATEMENTS.md for API contract documentation
 */

import { apiFetch, ApiError } from './client'
import { isBackendSyncEnabled } from '@/lib/backend-sync/status'
import type { FarmeroFeeRule } from '@/lib/types/farmero-fees'

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get active fee rules
 * 
 * @returns List of active fee rules
 * @throws ApiError if request fails
 * 
 * FALLBACK: Returns empty array if backend is not enabled
 */
export async function getActiveFeeRules(): Promise<FarmeroFeeRule[]> {
  if (!isBackendSyncEnabled('feesAndStatements')) {
    return []
  }

  try {
    const response = await apiFetch<FarmeroFeeRule[] | { data: FarmeroFeeRule[] }>(
      '/fees/rules',
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
        throw new Error('Trebuie să fii autentificat pentru a vedea regulile de comision.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a accesa regulile de comision.')
      }
      throw error
    }
    throw error
  }
}

