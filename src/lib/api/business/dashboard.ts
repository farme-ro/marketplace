/**
 * Business Dashboard API
 * 
 * API functions for Business portal dashboard
 * Uses apiFetch to call https://api.farme.ro (external backend API)
 * 
 * IMPORTANT: Backend-ul este într-un repo separat (api.farme.ro).
 * Aceste funcții sunt doar API contracts și fallback-uri pentru frontend.
 * 
 * Note: Backend endpoints need to be implemented in the separate backend repository:
 * - GET /business/dashboard - Get dashboard statistics
 * - GET /business/orders - Get business orders
 * - GET /business/orders/:id - Get order details
 * - GET /business/subscriptions - Get active subscriptions
 * 
 * FALLBACK: If businessDashboard is disabled in BackendSyncStatus, returns mock data
 * 
 * See: docs/BACKEND_API_CONTRACT_BUSINESS.md for API contract documentation
 */

import { apiFetch, ApiError } from '../client'
import { isBackendSyncEnabled } from '@/lib/backend-sync/status'
import type {
  BusinessDashboardStats,
  BusinessOrder,
  BusinessOrderFlow,
  BusinessSubscription,
} from '@/lib/types/business'

// ============================================================================
// Fallback Data
// ============================================================================

const mockDashboardStats: BusinessDashboardStats = {
  totalOrders: 0,
  totalRevenue: 0,
  pendingOrders: 0,
  activeSubscriptions: 0,
  averageOrderValue: 0,
  ordersThisMonth: 0,
  revenueThisMonth: 0,
}

const mockOrderFlow: BusinessOrderFlow = {
  new: 0,
  confirmed: 0,
  preparing: 0,
  shipped: 0,
  delivered: 0,
  canceled: 0,
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get business dashboard statistics
 * 
 * @returns Dashboard statistics
 * @throws ApiError if request fails
 * 
 * FALLBACK: Returns mock data if backend is not enabled
 */
export async function getBusinessDashboardStats(): Promise<BusinessDashboardStats> {
  if (!isBackendSyncEnabled('businessDashboard')) {
    return mockDashboardStats
  }

  try {
    const response = await apiFetch<BusinessDashboardStats | { data: BusinessDashboardStats }>(
      '/business/dashboard',
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
 * Get business orders
 * 
 * @param filters - Optional filters (status, date range, etc.)
 * @returns List of business orders
 * @throws ApiError if request fails
 * 
 * FALLBACK: Returns empty array if backend is not enabled
 */
export async function getBusinessOrders(filters?: {
  status?: BusinessOrder['status']
  limit?: number
  offset?: number
}): Promise<BusinessOrder[]> {
  if (!isBackendSyncEnabled('businessDashboard')) {
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

    const url = `/business/orders${params.toString() ? `?${params.toString()}` : ''}`
    const response = await apiFetch<BusinessOrder[] | { data: BusinessOrder[] }>(url, {
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
        throw new Error('Trebuie să fii autentificat pentru a vedea comenzile.')
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
 * Get business order by ID
 * 
 * @param orderId - Order ID
 * @returns Order details
 * @throws ApiError if request fails
 * 
 * FALLBACK: Throws error if backend is not enabled
 */
export async function getBusinessOrderById(orderId: string): Promise<BusinessOrder> {
  if (!isBackendSyncEnabled('businessDashboard')) {
    throw new Error('Funcționalitatea nu este disponibilă încă.')
  }

  try {
    const response = await apiFetch<BusinessOrder | { data: BusinessOrder }>(
      `/business/orders/${orderId}`,
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
        throw new Error('Trebuie să fii autentificat pentru a vedea comanda.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a accesa această comandă.')
      }
      if (error.status === 404) {
        throw new Error('Comanda nu a fost găsită.')
      }
      throw error
    }
    throw error
  }
}

/**
 * Get business order flow (orders grouped by status)
 * 
 * @returns Order flow statistics
 * @throws ApiError if request fails
 * 
 * FALLBACK: Returns empty flow if backend is not enabled
 */
export async function getBusinessOrderFlow(): Promise<BusinessOrderFlow> {
  if (!isBackendSyncEnabled('businessDashboard')) {
    return mockOrderFlow
  }

  try {
    const response = await apiFetch<BusinessOrderFlow | { data: BusinessOrderFlow }>(
      '/business/orders/flow',
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
        throw new Error('Trebuie să fii autentificat pentru a vedea flow-ul comenzilor.')
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
 * Get active business subscriptions
 * 
 * @returns List of active subscriptions
 * @throws ApiError if request fails
 * 
 * FALLBACK: Returns empty array if backend is not enabled
 */
export async function getBusinessSubscriptions(): Promise<BusinessSubscription[]> {
  if (!isBackendSyncEnabled('businessDashboard')) {
    return []
  }

  try {
    const response = await apiFetch<BusinessSubscription[] | { data: BusinessSubscription[] }>(
      '/business/subscriptions',
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
        throw new Error('Trebuie să fii autentificat pentru a vedea abonamentele.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a accesa aceste date.')
      }
      throw error
    }
    throw error
  }
}

