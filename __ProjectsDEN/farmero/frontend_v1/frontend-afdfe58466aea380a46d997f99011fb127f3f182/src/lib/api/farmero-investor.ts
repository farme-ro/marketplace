/**
 * Farmero Investor Metrics API
 * 
 * API client for investor metrics endpoint.
 * 
 * IMPORTANT: Backend-ul este într-un repo separat (api.farme.ro).
 * Acest fișier este doar API contract și fallback pentru frontend.
 * 
 * Note: Backend endpoint needs to be implemented in the separate backend repository:
 * - GET /investor/metrics - Get aggregated, anonymized investor metrics
 * 
 * FALLBACK: If investorMetrics is disabled in BackendSyncStatus, returns null
 * 
 * See: docs/BACKEND_API_CONTRACT_FARMERO_INVESTOR_METRICS.md for API contract documentation
 */

import { apiFetch, ApiError } from './client'
import { isBackendSyncEnabled } from '@/lib/backend-sync/status'
import type { FarmeroInvestorMetrics } from '@/lib/types/farmero-investor-metrics'

/**
 * Get investor metrics (aggregated, anonymized)
 * 
 * @returns Investor metrics or null if feature is disabled
 * @throws ApiError if request fails (401, 403, 500, etc.)
 * 
 * FALLBACK: Returns null if BackendSyncStatus.investorMetrics is false
 */
export async function getInvestorMetrics(): Promise<FarmeroInvestorMetrics | null> {
  if (!isBackendSyncEnabled('investorMetrics')) {
    return null
  }

  try {
    const response = await apiFetch<FarmeroInvestorMetrics | { data: FarmeroInvestorMetrics }>(
      '/investor/metrics',
      {
        method: 'GET',
        credentials: 'include',
      }
    )

    // Handle both direct response and wrapped response
    if ('data' in response) {
      return response.data
    }
    return response
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a accesa acest dashboard.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai acces la acest dashboard. Verifică permisiunile contului tău.')
      }
      throw error
    }
    throw error
  }
}

