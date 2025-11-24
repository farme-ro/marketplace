/**
 * Security & Access Logs API Functions
 * 
 * Functions for security monitoring, access logs, and sensitive actions
 */

import { apiFetch } from './client'
import type { PaginatedResponse } from './types'

// ==================== TYPES ====================

export interface SecurityOverview {
  failedLogins24h: number
  successfulAdminLogins24h: number
  lockedAccounts: number
  suspiciousIpCount24h: number | null
}

export interface SecurityOverviewResponse {
  overview: SecurityOverview
  readOnly: boolean // true if data is from fallback/demo
}

export type AccessLogEventType =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'LOGOUT'
  | 'SESSION_EXPIRED'

export interface AccessLogEntry {
  id: string
  userId: string | null
  userEmail?: string | null
  role?: string | null
  ip?: string | null
  userAgent?: string | null
  location?: string | null // dacă backend trimite
  eventType: AccessLogEventType
  createdAt: string // ISO
}

export interface GetAccessLogsParams {
  page?: number
  limit?: number
  search?: string
  eventType?: AccessLogEventType | 'all'
  days?: number
}

export type SensitiveActionTargetType =
  | 'USER'
  | 'PRODUCER'
  | 'ORDER'
  | 'SYSTEM'
  | 'JOURNAL'
  | 'OTHER'

export interface SensitiveActionEntry {
  id: string
  adminId: string
  adminEmail?: string | null
  actionType: string // ex: USER_SUSPENDED, ROLE_CHANGED
  targetType: SensitiveActionTargetType
  targetId?: string | null
  targetSummary?: string | null // ex: email user, nume producător
  ip?: string | null
  reason?: string | null
  createdAt: string
}

export interface GetSensitiveActionsParams {
  page?: number
  limit?: number
  search?: string
  actionType?: string
  targetType?: SensitiveActionTargetType | 'all'
  days?: number
}

// ==================== OVERVIEW ====================

/**
 * Get security overview stats
 */
export async function getSecurityOverview(): Promise<SecurityOverviewResponse> {
  try {
    const overview = await apiFetch<SecurityOverview>('/admin/security/overview')
    return {
      overview,
      readOnly: false,
    }
  } catch (err) {
    console.warn('Backend endpoint for security overview not found, using fallback data.', err)
    
    // Return fallback static data
    return {
      overview: {
        failedLogins24h: 0,
        successfulAdminLogins24h: 0,
        lockedAccounts: 0,
        suspiciousIpCount24h: null,
      },
      readOnly: true,
    }
  }
}

// ==================== ACCESS LOGS ====================

/**
 * Get access logs (login, logout, session events)
 */
export async function getAccessLogs(
  params?: GetAccessLogsParams
): Promise<PaginatedResponse<AccessLogEntry>> {
  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.limit) queryParams.append('limit', params.limit.toString())
  if (params?.search) queryParams.append('search', params.search)
  if (params?.eventType && params.eventType !== 'all') {
    queryParams.append('eventType', params.eventType)
  }
  if (params?.days) queryParams.append('days', params.days.toString())

  const query = queryParams.toString()
  try {
    return await apiFetch<PaginatedResponse<AccessLogEntry>>(
      `/admin/security/access-logs${query ? `?${query}` : ''}`
    )
  } catch (err) {
    console.warn('Backend endpoint for access logs not found, returning fallback data.', err)
    return {
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    }
  }
}

// ==================== SENSITIVE ACTIONS ====================

/**
 * Get sensitive actions (admin actions on users, producers, orders, etc.)
 */
export async function getSensitiveActions(
  params?: GetSensitiveActionsParams
): Promise<PaginatedResponse<SensitiveActionEntry>> {
  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.limit) queryParams.append('limit', params.limit.toString())
  if (params?.search) queryParams.append('search', params.search)
  if (params?.actionType) queryParams.append('actionType', params.actionType)
  if (params?.targetType && params.targetType !== 'all') {
    queryParams.append('targetType', params.targetType)
  }
  if (params?.days) queryParams.append('days', params.days.toString())

  const query = queryParams.toString()
  try {
    return await apiFetch<PaginatedResponse<SensitiveActionEntry>>(
      `/admin/security/sensitive-actions${query ? `?${query}` : ''}`
    )
  } catch (err) {
    console.warn('Backend endpoint for sensitive actions not found, returning fallback data.', err)
    return {
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    }
  }
}

// ==================== EVENT TYPE LABELS ====================

export const ACCESS_LOG_EVENT_LABELS: Record<AccessLogEventType, string> = {
  LOGIN_SUCCESS: 'Autentificare reușită',
  LOGIN_FAILED: 'Tentativă eșuată de autentificare',
  LOGOUT: 'Delogare',
  SESSION_EXPIRED: 'Sesiune expirată (ex: timeout)',
}

