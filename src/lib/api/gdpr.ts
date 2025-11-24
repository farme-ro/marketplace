/**
 * GDPR & Data Export API Functions
 * 
 * Functions for managing GDPR requests (DSAR, export, delete, anonymize)
 */

import { apiFetch } from './client'
import type { PaginatedResponse } from './types'

// ==================== TYPES ====================

export type GdprRequestType = 'EXPORT' | 'DELETE' | 'ANONYMIZE' | 'RECTIFY'
export type GdprRequestStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'REJECTED'
  | 'EXPORT_GENERATED'
  | 'ARCHIVED'

export interface GdprRequest {
  id: string
  userId: string
  userEmail: string
  type: GdprRequestType
  status: GdprRequestStatus
  createdAt: string
  updatedAt: string
  handledBy?: {
    id: string
    email: string
    fullName: string
  }
  downloadUrl?: string // For EXPORT requests
  reason?: string // For REJECTED requests
  // Advanced fields
  legalDeadline?: string // ISO date - 30 days from createdAt
  userType?: 'CLIENT' | 'PRODUCER' | 'ADMIN' // Tip utilizator
  requestMethod?: 'EMAIL' | 'DASHBOARD' | 'MANUAL' // Metodă solicitare
  exportFormat?: 'JSON' | 'CSV' | 'PDF' // Format export (pentru EXPORT)
  exportGeneratedAt?: string // ISO date - când a fost generat export-ul
}

export interface GetGdprRequestsParams {
  type?: GdprRequestType
  status?: GdprRequestStatus
  search?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
}

export interface CreateGdprRequestPayload {
  userId: string
  type: GdprRequestType
  reason?: string
}

export interface UpdateGdprRequestStatusPayload {
  status: GdprRequestStatus
  reason?: string
}

// ==================== GDPR HISTORY ====================

export interface GdprHistoryEntry {
  id: string
  requestId: string
  action: string // ex: "STATUS_CHANGED", "EXPORT_GENERATED", "REJECTED"
  performedBy: {
    id: string
    email: string
    fullName: string
  }
  details?: string
  createdAt: string
}

export interface GetGdprHistoryParams {
  requestId?: string
  page?: number
  limit?: number
}

// ==================== RETENTION POLICIES ====================

export type DataType = 'USERS' | 'ORDERS' | 'JOURNAL' | 'MARKETING' | 'PAYMENTS'

export interface RetentionPolicy {
  id: string
  dataType: DataType
  retentionMonths: number
  lastUpdated: string
  updatedBy?: {
    id: string
    email: string
  }
  status: 'COMPLIANT' | 'NEEDS_REVIEW'
  notes?: string
}

// ==================== GDPR REQUESTS ====================

/**
 * Get all GDPR requests with filters
 */
export async function getGdprRequests(
  params?: GetGdprRequestsParams
): Promise<PaginatedResponse<GdprRequest>> {
  const queryParams = new URLSearchParams()
  if (params?.type) queryParams.append('type', params.type)
  if (params?.status) queryParams.append('status', params.status)
  if (params?.search) queryParams.append('search', params.search)
  if (params?.dateFrom) queryParams.append('dateFrom', params.dateFrom)
  if (params?.dateTo) queryParams.append('dateTo', params.dateTo)
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.limit) queryParams.append('limit', params.limit.toString())

  const query = queryParams.toString()
  try {
    return await apiFetch<PaginatedResponse<GdprRequest>>(
      `/admin/gdpr/requests${query ? `?${query}` : ''}`
    )
  } catch (err) {
    console.warn('Backend endpoint for GDPR requests not found, returning fallback data.', err)
    return {
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    }
  }
}

/**
 * Get a single GDPR request by ID
 */
export async function getGdprRequestById(id: string): Promise<GdprRequest | null> {
  try {
    return await apiFetch<GdprRequest>(`/admin/gdpr/requests/${id}`)
  } catch (err) {
    console.warn('Backend endpoint for GDPR request by ID not found.', err)
    return null
  }
}

/**
 * Create a new GDPR request
 */
export async function createGdprRequest(
  payload: CreateGdprRequestPayload
): Promise<GdprRequest> {
  try {
    return await apiFetch<GdprRequest>('/admin/gdpr/requests', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  } catch (err) {
    console.warn('Backend endpoint for creating GDPR request not found.', err)
    throw err
  }
}

/**
 * Update GDPR request status
 */
export async function updateGdprRequestStatus(
  id: string,
  payload: UpdateGdprRequestStatusPayload
): Promise<GdprRequest> {
  try {
    return await apiFetch<GdprRequest>(`/admin/gdpr/requests/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
  } catch (err) {
    console.warn('Backend endpoint for updating GDPR request status not found.', err)
    throw err
  }
}

// ==================== GDPR HISTORY ====================

/**
 * Get GDPR request history/timeline
 */
export async function getGdprHistory(
  params?: GetGdprHistoryParams
): Promise<PaginatedResponse<GdprHistoryEntry>> {
  const queryParams = new URLSearchParams()
  if (params?.requestId) queryParams.append('requestId', params.requestId)
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.limit) queryParams.append('limit', params.limit.toString())

  const query = queryParams.toString()
  try {
    return await apiFetch<PaginatedResponse<GdprHistoryEntry>>(
      `/admin/gdpr/history${query ? `?${query}` : ''}`
    )
  } catch (err) {
    console.warn('Backend endpoint for GDPR history not found, returning fallback data.', err)
    return {
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    }
  }
}

// ==================== RETENTION POLICIES ====================

/**
 * Get retention policies
 */
export async function getRetentionPolicies(): Promise<RetentionPolicy[]> {
  try {
    return await apiFetch<RetentionPolicy[]>('/admin/gdpr/retention-policies')
  } catch (err) {
    console.warn('Backend endpoint for retention policies not found, returning fallback data.', err)
    // Return fallback static data
    return [
      {
        id: 'users',
        dataType: 'USERS',
        retentionMonths: 24,
        lastUpdated: new Date().toISOString(),
        status: 'COMPLIANT',
        notes: 'Conform GDPR, datele utilizatorilor sunt păstrate 24 luni după ultima activitate.',
      },
      {
        id: 'orders',
        dataType: 'ORDERS',
        retentionMonths: 60,
        lastUpdated: new Date().toISOString(),
        status: 'COMPLIANT',
        notes: 'Comenzile sunt păstrate 60 luni pentru raportare financiară și contabilitate.',
      },
      {
        id: 'journal',
        dataType: 'JOURNAL',
        retentionMonths: 120,
        lastUpdated: new Date().toISOString(),
        status: 'COMPLIANT',
        notes: 'Articolele jurnal sunt păstrate pe termen lung pentru arhivă.',
      },
      {
        id: 'marketing',
        dataType: 'MARKETING',
        retentionMonths: 12,
        lastUpdated: new Date().toISOString(),
        status: 'NEEDS_REVIEW',
        notes: 'Politica de retenție pentru date marketing necesită revizuire.',
      },
    ]
  }
}

// ==================== EXPORT FORMATS ====================

/**
 * Generate export for GDPR request
 */
export async function generateGdprExport(
  requestId: string,
  format: 'JSON' | 'CSV' | 'PDF'
): Promise<{ downloadUrl: string; generatedAt: string }> {
  try {
    return await apiFetch<{ downloadUrl: string; generatedAt: string }>(
      `/admin/gdpr/requests/${requestId}/export`,
      {
        method: 'POST',
        body: JSON.stringify({ format }),
      }
    )
  } catch (err) {
    console.warn('Backend endpoint for generating GDPR export not found.', err)
    throw err
  }
}

