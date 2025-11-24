/**
 * Orders API
 * 
 * API functions for order management (client orders)
 * Uses apiFetch to call https://api.farme.ro
 */

import { apiFetch, ApiError } from './client'
import { isBackendSyncEnabled } from '@/lib/backend-sync/status'
import type { Order as DomainOrder, OrderItem as DomainOrderItem, ShippingAddress as DomainShippingAddress, OrderStatus as DomainOrderStatus } from '@/lib/types/domain'

// ============================================================================
// Types
// ============================================================================

/**
 * Mapper function: Transformă răspunsul API în tipul domain Order
 * 
 * Acest mapper face aplicația rezistentă la schimbări viitoare ale backend-ului
 * prin normalizarea tuturor variantelor posibile de câmpuri API.
 */
export function mapApiOrderToOrder(api: Record<string, unknown>): DomainOrder {
  // Map order items
  const items: DomainOrderItem[] = []
  if (Array.isArray(api.items)) {
    items.push(...api.items.map((item: Record<string, unknown>) => ({
      id: item.id ? String(item.id) : undefined,
      productId: String(item.product_id ?? item.productId ?? ''),
      productName: item.product_name ? String(item.product_name) : item.productName ? String(item.productName) : undefined,
      productSlug: item.product_slug ? String(item.product_slug) : item.productSlug ? String(item.productSlug) : undefined,
      name: String(item.name ?? item.product_name ?? item.productName ?? ''),
      quantity: Number(item.quantity) || 0,
      price: Number(item.price) || 0,
      total: item.total !== undefined ? Number(item.total) : undefined,
      producerName: item.producer_name ? String(item.producer_name) : item.producerName ? String(item.producerName) : undefined,
      producerId: item.producer_id ? String(item.producer_id) : item.producerId ? String(item.producerId) : undefined,
      unit: item.unit ? String(item.unit) : undefined,
      imageUrl: item.image_url ? String(item.image_url) : item.imageUrl ? String(item.imageUrl) : undefined,
    })))
  }

  // Map shipping address
  let shippingAddress: DomainShippingAddress | undefined
  if (api.shipping_address || api.shippingAddress) {
    const addr = (api.shipping_address || api.shippingAddress) as Record<string, unknown>
    shippingAddress = {
      name: String(addr.name ?? ''),
      phone: String(addr.phone ?? ''),
      email: addr.email ? String(addr.email) : undefined,
      city: String(addr.city ?? ''),
      address: String(addr.address ?? addr.address_line1 ?? addr.addressLine1 ?? ''),
      postalCode: addr.postal_code ? String(addr.postal_code) : addr.postalCode ? String(addr.postalCode) : undefined,
      notes: addr.notes ? String(addr.notes) : undefined,
    }
  }

  // Map status - normalize various status formats
  let status: DomainOrderStatus = 'pending'
  if (api.status) {
    const statusStr = String(api.status).toLowerCase()
    if (statusStr === 'paid') status = 'paid'
    else if (statusStr === 'processing') status = 'processing'
    else if (statusStr === 'confirmed') status = 'confirmed'
    else if (statusStr === 'prepared') status = 'prepared'
    else if (statusStr === 'shipped') status = 'shipped'
    else if (statusStr === 'delivered') status = 'delivered'
    else if (statusStr === 'cancelled' || statusStr === 'canceled') status = 'cancelled'
    else if (statusStr === 'uncollected') status = 'uncollected'
    else status = 'pending'
  }

  return {
    id: String(api.id ?? ''),
    number: api.number ? String(api.number) : api.order_number ? String(api.order_number) : undefined,
    status,
    total: Number(api.total ?? api.total_amount ?? 0),
    subtotal: api.subtotal !== undefined ? Number(api.subtotal) : undefined,
    shippingCost: api.shipping_cost !== undefined ? Number(api.shipping_cost) : api.shippingCost !== undefined ? Number(api.shippingCost) : undefined,
    items,
    clientId: api.client_id ? String(api.client_id) : api.clientId ? String(api.clientId) : undefined,
    producerId: api.producer_id ? String(api.producer_id) : api.producerId ? String(api.producerId) : undefined,
    shippingAddress,
    paymentMethod: api.payment_method ? String(api.payment_method) as DomainOrder['paymentMethod'] : api.paymentMethod ? String(api.paymentMethod) as DomainOrder['paymentMethod'] : undefined,
    paymentStatus: api.payment_status ? String(api.payment_status) as DomainOrder['paymentStatus'] : api.paymentStatus ? String(api.paymentStatus) as DomainOrder['paymentStatus'] : undefined,
    notes: api.notes ? String(api.notes) : undefined,
    createdAt: api.created_at ? String(api.created_at) : api.createdAt ? String(api.createdAt) : undefined,
    updatedAt: api.updated_at ? String(api.updated_at) : api.updatedAt ? String(api.updatedAt) : undefined,
  }
}

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'canceled' | 'uncollected'

export type PaymentMethod = 'card' | 'cod' | 'bank_transfer' | 'other'

export type OrderItem = {
  id: string
  productId: string
  productName: string
  productSlug: string
  quantity: number
  price: number
  total: number
  producerName?: string
  producerId?: string
  unit?: string
  imageUrl?: string
}

export type ShippingAddress = {
  name: string
  phone: string
  email?: string
  city: string
  address: string
  postalCode?: string
  notes?: string
}

export type Order = {
  id: string
  number: string
  status: OrderStatus
  total: number
  subtotal: number
  shippingCost: number
  createdAt: string
  updatedAt?: string
  paymentMethod: PaymentMethod
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded'
  items: OrderItem[]
  shippingAddress: ShippingAddress
  // Optional: metadata
  notes?: string
  estimatedDeliveryDate?: string
}

export type CreateOrderInput = {
  // Shipping address
  name: string
  email: string
  phone: string
  city: string
  address: string
  postalCode?: string
  notes?: string
  
  // Payment method
  paymentMethod: PaymentMethod
  
  // Optional: account ID (for multi-account support)
  // Note: Backend needs to support accountId in order creation
  // When backend supports it, this will be used to associate order with specific account
  accountId?: string
  
  // Optional: explicit items (if backend doesn't use cart)
  items?: Array<{
    productId: string
    quantity: number
  }>
}

export type CreateOrderResponse = {
  order: DomainOrder
  paymentUrl?: string // If payment needs redirect (e.g., Stripe)
  paymentIntentId?: string // For Stripe
}

// Legacy type for compatibility (if thank-you page uses it)
export type OrderSummary = {
  id: string
  number: string
  status: string
  totalAmount: number
  customerType?: string
  shippingFullName?: string
  shippingAddressLine1?: string
  shippingCity?: string
  shippingPhone?: string
  items?: Array<{
    productNameSnapshot: string
    quantity: number
    totalPrice: number
  }>
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Create order from cart
 * 
 * @param input - Order creation data
 * @returns Order and optional payment URL
 * @throws ApiError if request fails
 */
export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResponse> {
  if (!isBackendSyncEnabled('checkout')) {
    throw new Error('Funcționalitatea de checkout nu este disponibilă încă.')
  }

  try {
    const response = await apiFetch<{ order: Record<string, unknown>; paymentUrl?: string; paymentIntentId?: string }>('/orders', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(input),
    })
    
    return {
      order: mapApiOrderToOrder(response.order),
      paymentUrl: response.paymentUrl,
      paymentIntentId: response.paymentIntentId,
    }
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 400) {
        throw new Error('Date invalide. Verifică că toate câmpurile sunt completate corect.')
      }
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a plasa o comandă.')
      }
      if (error.status === 404) {
        throw new Error('Coșul este gol. Adaugă produse înainte de a plasa comanda.')
      }
      if (error.status === 422) {
        throw new Error('Unele produse nu mai sunt disponibile sau stocul este insuficient.')
      }
      throw new Error(error.message || 'Eroare la plasarea comenzii. Te rugăm să încerci din nou.')
    }
    throw error
  }
}

/**
 * Get all orders for current user
 * 
 * @returns List of orders
 * @throws ApiError if request fails
 */
export async function getOrders(): Promise<DomainOrder[]> {
  if (!isBackendSyncEnabled('clientOrders')) {
    return [] // Return empty array if feature is not enabled
  }

  try {
    const orders = await apiFetch<Record<string, unknown>[] | { data: Record<string, unknown>[] }>('/orders', {
      method: 'GET',
      credentials: 'include',
    })
    
    // Handle both array and paginated response
    if (Array.isArray(orders)) {
      return orders.map(mapApiOrderToOrder)
    }
    if (orders && 'data' in orders && Array.isArray(orders.data)) {
      return orders.data.map(mapApiOrderToOrder)
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
 * Get order by ID
 * 
 * @param id - Order ID
 * @returns Order data
 * @throws ApiError if request fails
 */
export async function getOrderById(id: string): Promise<DomainOrder> {
  if (!isBackendSyncEnabled('clientOrders')) {
    throw new Error('Funcționalitatea de comenzi nu este disponibilă încă.')
  }

  try {
    const order = await apiFetch<Record<string, unknown>>(`/orders/${id}`, {
      method: 'GET',
      credentials: 'include',
    })
    
    return mapApiOrderToOrder(order)
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
 * Get order by ID (legacy compatibility - returns OrderSummary)
 * 
 * @deprecated Use getOrderById instead
 */
export async function getOrderSummaryById(id: string): Promise<OrderSummary | null> {
  try {
    const order = await getOrderById(id)
    
    // Convert Order to OrderSummary
    return {
      id: order.id,
      number: order.number,
      status: order.status,
      totalAmount: order.total,
      shippingFullName: order.shippingAddress.name,
      shippingAddressLine1: order.shippingAddress.address,
      shippingCity: order.shippingAddress.city,
      shippingPhone: order.shippingAddress.phone,
      items: order.items.map(item => ({
        productNameSnapshot: item.productName,
        quantity: item.quantity,
        totalPrice: item.total,
      })),
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('nu a fost găsită')) {
      return null
    }
    throw error
  }
}

