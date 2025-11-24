/**
 * Commerce API Functions
 * 
 * Functions for managing orders, commissions, disputes, and financial operations
 */

import { apiFetch } from './client'

// ==================== COMMISSIONS ====================

export interface Commission {
  id: string
  orderId: string
  producerId: string
  producer: {
    id: string
    name: string
    status: string
  }
  baseAmount: string
  commissionRate: string
  commissionAmount: string
  status: 'PENDING' | 'ISSUED' | 'PAID'
  createdAt: string
  updatedAt: string
  order?: {
    id: string
    totalAmount: string
    status: string
    createdAt: string
  }
  producerInvoice?: {
    id: string
    externalId?: string
    pdfUrl?: string
    issuedAt?: string
  }
}

export interface CommissionSummary {
  producerId: string
  producerName: string
  totalSales: string
  totalCommissions: string
  netPayout: string
  payoutStatus: 'pending' | 'paid'
  commissionCount: number
}

export interface CommissionsSummaryResponse {
  summary: {
    totalGMV: string
    totalCommissions: string
    totalPayoutDue: string
    period: {
      from: string
      to: string
    }
  }
  byProducer: CommissionSummary[]
}

export interface GetCommissionsParams {
  status?: 'PENDING' | 'ISSUED' | 'PAID'
  producerId?: string
  orderId?: string
  page?: number
  limit?: number
}

export interface GetCommissionsResponse {
  commissions: Commission[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export async function getCommissions(
  params?: GetCommissionsParams
): Promise<GetCommissionsResponse> {
  const queryParams = new URLSearchParams()
  if (params?.status) queryParams.append('status', params.status)
  if (params?.producerId) queryParams.append('producerId', params.producerId)
  if (params?.orderId) queryParams.append('orderId', params.orderId)
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.limit) queryParams.append('limit', params.limit.toString())

  const query = queryParams.toString()
  try {
    const response = await apiFetch<{ commissions: Commission[] }>(
      `/admin/commissions${query ? `?${query}` : ''}`
    )
    return {
      commissions: response.commissions,
    }
  } catch (err) {
    // Endpoint might not exist
    return { commissions: [] }
  }
}

export interface GetCommissionsSummaryParams {
  from?: string // ISO date
  to?: string // ISO date
  producerId?: string
}

export async function getCommissionsSummary(
  params?: GetCommissionsSummaryParams
): Promise<CommissionsSummaryResponse> {
  const queryParams = new URLSearchParams()
  if (params?.from) queryParams.append('from', params.from)
  if (params?.to) queryParams.append('to', params.to)
  if (params?.producerId) queryParams.append('producerId', params.producerId)

  const query = queryParams.toString()
  try {
    return await apiFetch<CommissionsSummaryResponse>(
      `/admin/commerce/commissions-summary${query ? `?${query}` : ''}`
    )
  } catch (err) {
    // Endpoint might not exist - return empty structure
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    return {
      summary: {
        totalGMV: '0.00',
        totalCommissions: '0.00',
        totalPayoutDue: '0.00',
        period: {
          from: firstDayOfMonth.toISOString(),
          to: now.toISOString(),
        },
      },
      byProducer: [],
    }
  }
}

export async function markCommissionAsIssued(commissionId: string): Promise<Commission> {
  return apiFetch<Commission>(`/admin/commissions/${commissionId}/mark-issued`, {
    method: 'PATCH',
  })
}

export async function markCommissionAsPaid(commissionId: string): Promise<Commission> {
  return apiFetch<Commission>(`/admin/commissions/${commissionId}/mark-paid`, {
    method: 'PATCH',
  })
}

// ==================== DISPUTES ====================

export interface Dispute {
  id: string
  orderId: string
  order?: {
    id: string
    totalAmount: string
    status: string
    customer?: {
      id: string
      email: string
      fullName: string
    }
  }
  type: 'quality' | 'delivery' | 'billing' | 'other'
  status: 'open' | 'in_review' | 'resolved' | 'refunded'
  description: string
  clientId: string
  producerId?: string
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  resolution?: string
}

export interface GetDisputesParams {
  status?: 'open' | 'in_review' | 'resolved' | 'refunded'
  type?: 'quality' | 'delivery' | 'billing' | 'other'
  orderId?: string
  page?: number
  limit?: number
}

export interface GetDisputesResponse {
  disputes: Dispute[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export async function getDisputes(
  params?: GetDisputesParams
): Promise<GetDisputesResponse> {
  const queryParams = new URLSearchParams()
  if (params?.status) queryParams.append('status', params.status)
  if (params?.type) queryParams.append('type', params.type)
  if (params?.orderId) queryParams.append('orderId', params.orderId)
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.limit) queryParams.append('limit', params.limit.toString())

  const query = queryParams.toString()
  try {
    return await apiFetch<GetDisputesResponse>(
      `/admin/orders/disputes${query ? `?${query}` : ''}`
    )
  } catch (err) {
    // Endpoint might not exist
    return { disputes: [] }
  }
}

export interface UpdateDisputeParams {
  status?: 'open' | 'in_review' | 'resolved' | 'refunded'
  resolution?: string
}

export async function updateDispute(
  disputeId: string,
  params: UpdateDisputeParams
): Promise<Dispute> {
  return apiFetch<Dispute>(`/admin/orders/disputes/${disputeId}`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  })
}

export interface CreateRefundParams {
  reason: string
  amount?: string // Optional partial refund
}

export async function createRefund(
  orderId: string,
  params: CreateRefundParams
): Promise<{ success: boolean; refundId?: string }> {
  return apiFetch(`/admin/orders/${orderId}/refund`, {
    method: 'POST',
    body: JSON.stringify(params),
  })
}

