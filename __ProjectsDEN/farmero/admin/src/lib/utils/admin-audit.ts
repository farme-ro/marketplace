/**
 * Admin Audit Log Utility
 * 
 * Logs admin actions for audit purposes
 * Falls back to console.warn if backend endpoint is not available
 */

import { apiFetch } from '../api/client'
import type { AdminMe } from '../api/types'

/**
 * Admin Audit Event Types
 */
export type AdminAuditTargetType =
  | 'producer'
  | 'user'
  | 'order'
  | 'journal_article'
  | 'subscription'
  | 'promotion'
  | 'system'
  | 'faq_entry'
  | 'content_page'
  | 'gdpr_request'
  | 'other'

/**
 * Admin Audit Event
 */
export interface AdminAuditEvent {
  action: string // e.g., 'PRODUCER_APPROVED', 'USER_SUSPENDED', 'ORDER_REFUNDED'
  targetType: AdminAuditTargetType
  targetId: string
  reason?: string
  metadata?: Record<string, unknown>
  performedBy?: {
    id: string
    email: string
    fullName: string
  }
}

/**
 * Audit Log Entry (as returned from backend)
 */
export interface AuditLogEntry {
  id: string
  action: string
  targetType: AdminAuditTargetType
  targetId: string
  reason?: string
  metadata?: Record<string, unknown>
  performedBy: {
    id: string
    email: string
    fullName: string
  }
  performedAt: string
}

/**
 * Log an admin action to the audit log
 * 
 * @param event - Audit event details
 * @param admin - Current admin user (optional, will try to get from context)
 * @returns Promise that resolves when logged (or fails silently)
 */
export async function logAdminAction(
  event: AdminAuditEvent,
  admin?: AdminMe | null
): Promise<void> {
  try {
    // Add performedBy if not provided
    const auditEvent: AdminAuditEvent = {
      ...event,
      performedBy: event.performedBy || (admin ? {
        id: admin.id,
        email: admin.email,
        fullName: admin.fullName,
      } : undefined),
    }

    // Try to send to backend
    try {
      await apiFetch('/admin/audit-log', {
        method: 'POST',
        body: JSON.stringify(auditEvent),
      })
      
      // Success - logged to backend
      return
    } catch (backendError) {
      // Backend endpoint might not exist yet
      // Log to console as fallback
      console.warn('[AUDIT LOG] Backend endpoint not available, logging to console:', {
        ...auditEvent,
        timestamp: new Date().toISOString(),
      })
      
      // TODO: Backend needs to implement POST /admin/audit-log
      // Documented in ADMIN_BACKEND_GAPS.md
    }
  } catch (error) {
    // Silently fail - don't break the user flow
    console.error('[AUDIT LOG] Failed to log action:', error)
  }
}

/**
 * Get audit log entries
 * 
 * @param filters - Optional filters
 * @returns Promise with audit log entries
 */
export interface AuditLogFilters {
  performedBy?: string // Admin ID
  action?: string
  targetType?: AdminAuditTargetType
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

export interface AuditLogResponse {
  entries: AuditLogEntry[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export async function getAuditLogs(
  filters?: AuditLogFilters
): Promise<AuditLogResponse> {
  try {
    const queryParams = new URLSearchParams()
    if (filters?.performedBy) queryParams.append('performedBy', filters.performedBy)
    if (filters?.action) queryParams.append('action', filters.action)
    if (filters?.targetType) queryParams.append('targetType', filters.targetType)
    if (filters?.startDate) queryParams.append('startDate', filters.startDate)
    if (filters?.endDate) queryParams.append('endDate', filters.endDate)
    if (filters?.page) queryParams.append('page', filters.page.toString())
    if (filters?.limit) queryParams.append('limit', filters.limit.toString())

    const query = queryParams.toString()
    const url = `/admin/audit-log${query ? `?${query}` : ''}`

    return await apiFetch<AuditLogResponse>(url)
  } catch (error) {
    // If endpoint doesn't exist, return empty response
    if (error instanceof Error && error.message.includes('404')) {
      return {
        entries: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
      }
    }
    throw error
  }
}

