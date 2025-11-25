/**
 * Producer Finances API
 * 
 * API functions for producer finances and payments
 * Uses apiFetch to call https://api.farme.ro
 */

import { apiFetch, ApiError } from '../client'

// ============================================================================
// Types
// ============================================================================

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export type ProducerPayment = {
  id: string
  invoiceNumber: string
  date: string
  amount: number
  status: PaymentStatus
  description?: string
  invoiceUrl?: string
}

export type ProducerFinances = {
  currentBalance: number
  currency: string
  thisMonthCommission: number
  thisMonthRevenue: number
  upcomingPayments: number
  payments: ProducerPayment[]
  // Optional: additional metrics
  totalPaid?: number
  totalPending?: number
  lastPaymentDate?: string
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get producer finances
 * 
 * @returns Producer finances data
 * @throws ApiError if request fails
 */
export async function getProducerFinances(): Promise<ProducerFinances> {
  try {
    const finances = await apiFetch<ProducerFinances>('/producers/finances', {
      method: 'GET',
      credentials: 'include',
    })
    
    return finances
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a vedea datele financiare.')
      }
      // If endpoint doesn't exist yet (404), return empty finances
      if (error.status === 404) {
        return {
          currentBalance: 0,
          currency: 'RON',
          thisMonthCommission: 0,
          thisMonthRevenue: 0,
          upcomingPayments: 0,
          payments: [],
        }
      }
      throw new Error(error.message || 'Eroare la încărcarea datelor financiare.')
    }
    throw error
  }
}

/**
 * Get payout summary
 * 
 * @returns Payout summary data
 * @throws ApiError if request fails
 * 
 * Note: Backend endpoint GET /producers/payouts/summary needs to be implemented
 */
export async function getPayoutSummary(): Promise<{
  totalIncomes: number
  totalCommission: number
  processingAmount: number
  currency: string
}> {
  try {
    const summary = await apiFetch<{
      totalIncomes: number
      totalCommission: number
      processingAmount: number
      currency: string
    }>('/producers/payouts/summary', {
      method: 'GET',
      credentials: 'include',
    })
    
    return summary
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        // Endpoint doesn't exist yet - return mock data
        // Note: Remove mock data when backend endpoint is ready
        return {
          totalIncomes: 0,
          totalCommission: 0,
          processingAmount: 0,
          currency: 'RON',
        }
      }
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a vedea rezumatul plăților.')
      }
      throw new Error(error.message || 'Eroare la încărcarea rezumatului plăților.')
    }
    throw error
  }
}

/**
 * Get payouts list
 * 
 * @param params - Optional filters (startDate, endDate, status)
 * @returns List of payouts
 * @throws ApiError if request fails
 * 
 * Note: Backend endpoint GET /producers/payouts needs to be implemented
 */
export async function getPayouts(params?: {
  startDate?: string
  endDate?: string
  status?: PaymentStatus
}): Promise<ProducerPayment[]> {
  try {
    const queryParams = new URLSearchParams()
    if (params?.startDate) queryParams.append('startDate', params.startDate)
    if (params?.endDate) queryParams.append('endDate', params.endDate)
    if (params?.status) queryParams.append('status', params.status)
    
    const queryString = queryParams.toString()
    const path = `/producers/payouts${queryString ? `?${queryString}` : ''}`
    
    const payouts = await apiFetch<ProducerPayment[] | { data: ProducerPayment[] }>(path, {
      method: 'GET',
      credentials: 'include',
    })
    
    // Handle both array and paginated response
    if (Array.isArray(payouts)) {
      return payouts
    }
    if (payouts && 'data' in payouts) {
      return payouts.data
    }
    
    return []
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        // Endpoint doesn't exist yet - return mock data
        // Note: Remove mock data when backend endpoint is ready
        const mockPayouts: ProducerPayment[] = [
          {
            id: '1',
            invoiceNumber: 'PAY-2024-001',
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            amount: 1250.50,
            status: 'paid',
            description: 'Plată pentru vânzările din luna trecută',
          },
          {
            id: '2',
            invoiceNumber: 'PAY-2024-002',
            date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            amount: 890.25,
            status: 'paid',
            description: 'Plată pentru vânzările din luna trecută',
          },
        ]
        return mockPayouts
      }
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a vedea plățile.')
      }
      throw new Error(error.message || 'Eroare la încărcarea plăților.')
    }
    throw error
  }
}

/**
 * Download invoice
 * 
 * @param invoiceId - Invoice ID
 * @returns Invoice URL or blob
 */
export async function downloadInvoice(invoiceId: string): Promise<string> {
  try {
    const response = await apiFetch<{ url: string }>(`/producers/finances/invoices/${invoiceId}/download`, {
      method: 'GET',
      credentials: 'include',
    })
    
    return response.url
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        throw new Error('Factura nu a fost găsită.')
      }
      throw new Error(error.message || 'Eroare la descărcarea facturii.')
    }
    throw error
  }
}

