/**
 * Admin API Functions
 * 
 * Functions for fetching and managing admin resources
 */

import { apiFetch } from './client'

// Re-export apiFetch for convenience
export { apiFetch }
import type {
  ProducerSummary,
  UserSummary,
  OrderSummary,
  PaginationMeta,
} from './types'

// Re-export types for convenience
export type { OrderSummary, ProducerSummary, UserSummary }

// ==================== PRODUCERS ====================

export interface GetProducersParams {
  status?: 'PENDING_VERIFICATION' | 'APPROVED' | 'REJECTED'
  region?: string
  page?: number
  limit?: number
}

export interface GetProducersResponse {
  producers: ProducerSummary[]
  pagination: PaginationMeta
}

export async function getProducers(
  params?: GetProducersParams
): Promise<GetProducersResponse> {
  const queryParams = new URLSearchParams()
  if (params?.status) queryParams.append('status', params.status)
  if (params?.region) queryParams.append('region', params.region)
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.limit) queryParams.append('limit', params.limit.toString())

  const query = queryParams.toString()
  return apiFetch<GetProducersResponse>(
    `/admin/producers${query ? `?${query}` : ''}`
  )
}

export interface ProducerDetail extends ProducerSummary {
  description?: string
  products?: Array<{
    id: string
    name: string
    price: string
    status: string
  }>
  orderVendors?: Array<{
    order: {
      id: string
      status: string
      totalAmount: string
    }
  }>
}

export async function getProducer(id: string): Promise<ProducerDetail> {
  return apiFetch<ProducerDetail>(`/admin/producers/${id}`)
}

export interface UpdateProducerParams {
  status?: 'PENDING_VERIFICATION' | 'APPROVED' | 'REJECTED'
  description?: string
}

export async function updateProducer(
  id: string,
  params: UpdateProducerParams
): Promise<ProducerDetail> {
  return apiFetch<ProducerDetail>(`/admin/producers/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  })
}

// ==================== USERS ====================

export interface GetUsersParams {
  role?: 'ADMIN' | 'PRODUCER' | 'CUSTOMER'
  status?: string
  search?: string
  page?: number
  limit?: number
}

export interface GetUsersResponse {
  users: UserSummary[]
  pagination: PaginationMeta
}

export async function getUsers(
  params?: GetUsersParams
): Promise<GetUsersResponse> {
  const queryParams = new URLSearchParams()
  if (params?.role) queryParams.append('role', params.role)
  if (params?.status) queryParams.append('status', params.status)
  if (params?.search) queryParams.append('search', params.search)
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.limit) queryParams.append('limit', params.limit.toString())

  const query = queryParams.toString()
  return apiFetch<GetUsersResponse>(`/admin/users${query ? `?${query}` : ''}`)
}

export interface UserDetail extends UserSummary {
  orders?: Array<{
    id: string
    status: string
    totalAmount: string
  }>
  carts?: Array<{
    id: string
    status: string
  }>
}

export async function getUser(id: string): Promise<UserDetail> {
  return apiFetch<UserDetail>(`/admin/users/${id}`)
}

export interface UpdateUserParams {
  role?: 'ADMIN' | 'PRODUCER' | 'CUSTOMER'
  fullName?: string
}

export async function updateUser(
  id: string,
  params: UpdateUserParams
): Promise<UserDetail> {
  return apiFetch<UserDetail>(`/admin/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  })
}

// ==================== ORDERS ====================

export interface GetOrdersParams {
  status?: string
  paymentStatus?: string
  producerId?: string
  clientId?: string
  clientEmail?: string
  search?: string
  startDate?: string
  endDate?: string
  dateFrom?: string // Alias for startDate
  dateTo?: string // Alias for endDate
  page?: number
  limit?: number
}

export interface GetOrdersResponse {
  orders: OrderSummary[]
  pagination: PaginationMeta
}

export async function getOrders(
  params?: GetOrdersParams
): Promise<GetOrdersResponse> {
  const queryParams = new URLSearchParams()
  if (params?.status) queryParams.append('status', params.status)
  if (params?.paymentStatus)
    queryParams.append('paymentStatus', params.paymentStatus)
  if (params?.producerId) queryParams.append('producerId', params.producerId)
  if (params?.clientId) queryParams.append('clientId', params.clientId)
  if (params?.clientEmail) queryParams.append('clientEmail', params.clientEmail)
  if (params?.search) queryParams.append('search', params.search)
  // Support both startDate/endDate and dateFrom/dateTo
  const dateFrom = params?.dateFrom || params?.startDate
  const dateTo = params?.dateTo || params?.endDate
  if (dateFrom) queryParams.append('dateFrom', dateFrom)
  if (dateTo) queryParams.append('dateTo', dateTo)
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.limit) queryParams.append('limit', params.limit.toString())

  const query = queryParams.toString()
  return apiFetch<GetOrdersResponse>(`/admin/orders${query ? `?${query}` : ''}`)
}

export interface OrderTimelineEntry {
  status: string
  timestamp: string
  note?: string
}

export interface OrderDetail extends OrderSummary {
  shippingRegion?: {
    id: string
    name: string
  }
  paymentMethod?: string
  vendors?: Array<{
    id: string
    producer: {
      id: string
      name: string
      user?: {
        email: string
        fullName: string
      }
    }
    items: Array<{
      id: string
      product: {
        id: string
        name: string
        imageUrl?: string
      }
      quantity: number
      price: string
    }>
    subtotal?: string
    commissionAmount?: string
    payoutAmount?: string
  }>
  commissions?: Array<{
    id: string
    producer: {
      id: string
      name: string
    }
    baseAmount: string
    commissionRate: string
    commissionAmount: string
    status: 'PENDING' | 'ISSUED' | 'PAID'
  }>
  timeline?: OrderTimelineEntry[]
  notes?: string
  // Financial summary
  totalCommission?: string
  totalPayout?: string
}

export async function getOrder(id: string): Promise<OrderDetail> {
  return apiFetch<OrderDetail>(`/admin/orders/${id}`)
}

export interface UpdateOrderParams {
  notes?: string
  status?: string
}

export async function updateOrder(
  id: string,
  params: UpdateOrderParams
): Promise<OrderDetail> {
  return apiFetch<OrderDetail>(`/admin/orders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  })
}

