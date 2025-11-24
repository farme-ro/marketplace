/**
 * Producer Orders API
 * 
 * API functions for producer order management
 * Uses apiFetch to call https://api.farme.ro
 */

import { apiFetch, ApiError } from '../client'
import { isBackendSyncEnabled } from '@/lib/backend-sync/status'

// ============================================================================
// Types
// ============================================================================

export type ProducerOrderStatus = 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'canceled' | 'uncollected'

export type ProducerOrder = {
  id: string
  number: string
  status: ProducerOrderStatus
  total: number
  currency?: string
  createdAt: string
  updatedAt?: string
  customerName: string
  customerEmail?: string
  customerPhone: string
  shippingAddress: {
    name: string
    city: string
    address: string
    postalCode?: string
    notes?: string
  }
  paymentMethod: 'card' | 'cod' | 'bank_transfer' | 'other'
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded'
  items: Array<{
    id: string
    productId: string
    productName: string
    productSlug?: string
    quantity: number
    price: number
    total: number
    unit?: string
  }>
  notes?: string
  estimatedDeliveryDate?: string
}

export type UpdateOrderStatusPayload = {
  status: ProducerOrderStatus
  notes?: string
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get producer orders
 * 
 * @param filters - Optional filters (status, date range, etc.)
 * @returns List of producer orders
 * @throws ApiError if request fails
 */
export async function getProducerOrders(filters?: {
  status?: ProducerOrderStatus
  startDate?: string
  endDate?: string
}): Promise<ProducerOrder[]> {
  if (!isBackendSyncEnabled('producerOrders')) {
    return [] // Return empty array if feature is not enabled
  }

  try {
    const queryParams = new URLSearchParams()
    if (filters?.status) queryParams.append('status', filters.status)
    if (filters?.startDate) queryParams.append('startDate', filters.startDate)
    if (filters?.endDate) queryParams.append('endDate', filters.endDate)
    
    const queryString = queryParams.toString()
    const path = `/producers/orders${queryString ? `?${queryString}` : ''}`
    
    const response = await apiFetch<ProducerOrder[] | { data: ProducerOrder[] }>(path, {
      method: 'GET',
      credentials: 'include',
    })
    
    // Handle both array and paginated response
    if (Array.isArray(response)) {
      return response
    }
    if (response && 'data' in response) {
      return response.data
    }
    
    return []
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a vedea comenzile.')
      }
      throw new Error(error.message || 'Eroare la încărcarea comenzilor.')
    }
    throw error
  }
}

/**
 * Get a single order by ID
 * 
 * @param orderId - Order ID
 * @returns Order data
 * @throws ApiError if request fails
 */
export async function getOrderById(orderId: string): Promise<ProducerOrder> {
  if (!isBackendSyncEnabled('producerOrders')) {
    throw new Error('Funcționalitatea de comenzi nu este disponibilă încă.')
  }

  try {
    const order = await apiFetch<ProducerOrder>(`/producers/orders/${orderId}`, {
      method: 'GET',
      credentials: 'include',
    })
    
    return order
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        throw new Error('Comanda nu a fost găsită.')
      }
      if (error.status === 401 || error.status === 403) {
        throw new Error('Nu ai permisiunea de a vedea această comandă.')
      }
      throw new Error(error.message || 'Eroare la încărcarea comenzii.')
    }
    throw error
  }
}

/**
 * Update order status
 * 
 * @param orderId - Order ID
 * @param payload - Update payload
 * @returns Updated order
 * @throws ApiError if request fails
 */
export async function updateOrderStatus(
  orderId: string,
  payload: UpdateOrderStatusPayload
): Promise<ProducerOrder> {
  if (!isBackendSyncEnabled('producerOrders')) {
    throw new Error('Funcționalitatea de comenzi nu este disponibilă încă.')
  }

  try {
    const order = await apiFetch<ProducerOrder>(`/producers/orders/${orderId}/status`, {
      method: 'PATCH',
      credentials: 'include',
      body: JSON.stringify(payload),
    })
    
    return order
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 400) {
        throw new Error('Status invalid sau date invalide.')
      }
      if (error.status === 404) {
        throw new Error('Comanda nu a fost găsită.')
      }
      throw new Error(error.message || 'Eroare la actualizarea comenzii.')
    }
    throw error
  }
}

/**
 * Confirm an order
 * 
 * @param orderId - Order ID
 * @returns Updated order
 */
export async function confirmOrder(orderId: string): Promise<ProducerOrder> {
  return updateOrderStatus(orderId, { status: 'confirmed' })
}

/**
 * Mark order as preparing
 * 
 * @param orderId - Order ID
 * @returns Updated order
 */
export async function prepareOrder(orderId: string): Promise<ProducerOrder> {
  return updateOrderStatus(orderId, { status: 'preparing' })
}

/**
 * Mark order as shipped
 * 
 * @param orderId - Order ID
 * @returns Updated order
 */
export async function shipOrder(orderId: string): Promise<ProducerOrder> {
  return updateOrderStatus(orderId, { status: 'shipped' })
}

/**
 * Mark order as delivered
 * 
 * @param orderId - Order ID
 * @returns Updated order
 */
export async function markOrderDelivered(orderId: string): Promise<ProducerOrder> {
  return updateOrderStatus(orderId, { status: 'delivered' })
}

/**
 * Cancel an order
 * 
 * @param orderId - Order ID
 * @param notes - Optional cancellation notes
 * @returns Updated order
 */
export async function cancelOrder(orderId: string, notes?: string): Promise<ProducerOrder> {
  return updateOrderStatus(orderId, { status: 'canceled', notes })
}
