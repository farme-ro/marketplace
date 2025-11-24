/**
 * Logistics Dashboard API
 * 
 * API functions for Logistics portal dashboard
 * Uses apiFetch to call https://api.farme.ro (external backend API)
 * 
 * IMPORTANT: Backend-ul este într-un repo separat (api.farme.ro).
 * Aceste funcții sunt doar API contracts și fallback-uri pentru frontend.
 * 
 * Note: Backend endpoints need to be implemented in the separate backend repository:
 * - GET /logistics/dashboard - Get dashboard statistics
 * - GET /logistics/deliveries - Get deliveries
 * - GET /logistics/deliveries/:id - Get delivery details
 * - GET /logistics/routes - Get delivery routes
 * 
 * FALLBACK: If logisticsDashboard is disabled in BackendSyncStatus, returns mock data
 * 
 * See: docs/BACKEND_API_CONTRACT_LOGISTICS.md for API contract documentation
 */

import { apiFetch, ApiError } from '../client'
import { isBackendSyncEnabled } from '@/lib/backend-sync/status'
import type {
  LogisticsDashboardStats,
  LogisticsDelivery,
  LogisticsDeliveryStatus,
  LogisticsRoute,
} from '@/lib/types/logistics'

// ============================================================================
// Fallback Data
// ============================================================================

const mockDashboardStats: LogisticsDashboardStats = {
  totalDeliveries: 0,
  completedDeliveries: 0,
  inTransitDeliveries: 0,
  pendingDeliveries: 0,
  totalRevenue: 0,
  deliveriesThisMonth: 0,
  revenueThisMonth: 0,
}

const mockDeliveryStatus: LogisticsDeliveryStatus = {
  pending: 0,
  assigned: 0,
  inTransit: 0,
  delivered: 0,
  failed: 0,
  canceled: 0,
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get logistics dashboard statistics
 * 
 * @returns Dashboard statistics
 * @throws ApiError if request fails
 * 
 * FALLBACK: Returns mock data if backend is not enabled
 */
export async function getLogisticsDashboardStats(): Promise<LogisticsDashboardStats> {
  if (!isBackendSyncEnabled('logisticsDashboard')) {
    return mockDashboardStats
  }

  try {
    const response = await apiFetch<LogisticsDashboardStats | { data: LogisticsDashboardStats }>(
      '/logistics/dashboard',
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
        throw new Error('Trebuie să fii autentificat pentru a vedea statisticile.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a accesa aceste date.')
      }
      throw error
    }
    throw error
  }
}

/**
 * Get logistics deliveries
 * 
 * @param filters - Optional filters (status, date range, etc.)
 * @returns List of deliveries
 * @throws ApiError if request fails
 * 
 * FALLBACK: Returns empty array if backend is not enabled
 */
export async function getLogisticsDeliveries(filters?: {
  status?: LogisticsDelivery['status']
  limit?: number
  offset?: number
}): Promise<LogisticsDelivery[]> {
  if (!isBackendSyncEnabled('logisticsDashboard')) {
    return []
  }

  try {
    const params = new URLSearchParams()
    if (filters?.status) {
      params.append('status', filters.status)
    }
    if (filters?.limit) {
      params.append('limit', filters.limit.toString())
    }
    if (filters?.offset) {
      params.append('offset', filters.offset.toString())
    }

    const url = `/logistics/deliveries${params.toString() ? `?${params.toString()}` : ''}`
    const response = await apiFetch<LogisticsDelivery[] | { data: LogisticsDelivery[] }>(url, {
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
        throw new Error('Trebuie să fii autentificat pentru a vedea livrările.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a accesa aceste date.')
      }
      throw error
    }
    throw error
  }
}

/**
 * Get logistics delivery by ID
 * 
 * @param deliveryId - Delivery ID
 * @returns Delivery details
 * @throws ApiError if request fails
 * 
 * FALLBACK: Throws error if backend is not enabled
 */
export async function getLogisticsDeliveryById(deliveryId: string): Promise<LogisticsDelivery> {
  if (!isBackendSyncEnabled('logisticsDashboard')) {
    throw new Error('Funcționalitatea nu este disponibilă încă.')
  }

  try {
    const response = await apiFetch<LogisticsDelivery | { data: LogisticsDelivery }>(
      `/logistics/deliveries/${deliveryId}`,
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
        throw new Error('Trebuie să fii autentificat pentru a vedea livrarea.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a accesa această livrare.')
      }
      if (error.status === 404) {
        throw new Error('Livrarea nu a fost găsită.')
      }
      throw error
    }
    throw error
  }
}

/**
 * Get logistics delivery status overview
 * 
 * @returns Delivery status statistics
 * @throws ApiError if request fails
 * 
 * FALLBACK: Returns empty status if backend is not enabled
 */
export async function getLogisticsDeliveryStatus(): Promise<LogisticsDeliveryStatus> {
  if (!isBackendSyncEnabled('logisticsDashboard')) {
    return mockDeliveryStatus
  }

  try {
    const response = await apiFetch<LogisticsDeliveryStatus | { data: LogisticsDeliveryStatus }>(
      '/logistics/deliveries/status',
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
        throw new Error('Trebuie să fii autentificat pentru a vedea statusul livrărilor.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a accesa aceste date.')
      }
      throw error
    }
    throw error
  }
}

/**
 * Get logistics routes
 * 
 * @param filters - Optional filters (status, region, etc.)
 * @returns List of routes
 * @throws ApiError if request fails
 * 
 * FALLBACK: Returns empty array if backend is not enabled
 */
export async function getLogisticsRoutes(filters?: {
  status?: LogisticsRoute['status']
  region?: string
}): Promise<LogisticsRoute[]> {
  if (!isBackendSyncEnabled('logisticsDashboard')) {
    return []
  }

  try {
    const params = new URLSearchParams()
    if (filters?.status) {
      params.append('status', filters.status)
    }
    if (filters?.region) {
      params.append('region', filters.region)
    }

    const url = `/logistics/routes${params.toString() ? `?${params.toString()}` : ''}`
    const response = await apiFetch<LogisticsRoute[] | { data: LogisticsRoute[] }>(url, {
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
        throw new Error('Trebuie să fii autentificat pentru a vedea rutele.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a accesa aceste date.')
      }
      throw error
    }
    throw error
  }
}

