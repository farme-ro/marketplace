/**
 * Farmero Notifications API
 * 
 * API client for unified notification & communication system.
 * 
 * IMPORTANT: Backend-ul este într-un repo separat (api.farme.ro).
 * Acest fișier este doar API contract și fallback pentru frontend.
 * 
 * Note: Backend endpoints need to be implemented in the separate backend repository:
 * - GET /notifications - Get list of notifications
 * - GET /notifications/summary - Get notification summary (unread count)
 * - POST /notifications/:id/read - Mark notification as read
 * 
 * FALLBACK: If notifications is disabled in BackendSyncStatus, returns empty arrays/zero values
 * 
 * See: docs/BACKEND_API_CONTRACT_FARMERO_NOTIFICATIONS.md for API contract documentation
 */

import { apiFetch, ApiError } from './client'
import { isBackendSyncEnabled } from '@/lib/backend-sync/status'
import type {
  FarmeroNotification,
  FarmeroNotificationSummary,
} from '@/lib/types/farmero-notifications'

/**
 * Get notifications
 * 
 * @returns List of notifications
 * @throws ApiError if request fails
 * 
 * FALLBACK: Returns empty array if BackendSyncStatus.notifications is false
 */
export async function getNotifications(): Promise<FarmeroNotification[]> {
  if (!isBackendSyncEnabled('notifications')) {
    return []
  }

  try {
    const response = await apiFetch<FarmeroNotification[] | { data: FarmeroNotification[] }>(
      '/notifications',
      {
        method: 'GET',
        credentials: 'include',
      }
    )

    // Handle both direct response and wrapped response
    if (Array.isArray(response)) {
      return response
    }
    return response.data ?? []
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a vedea notificările.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a accesa notificările.')
      }
      throw error
    }
    throw error
  }
}

/**
 * Get notification summary (unread count)
 * 
 * @returns Notification summary with unread count
 * @throws ApiError if request fails
 * 
 * FALLBACK: Returns { unreadCount: 0 } if BackendSyncStatus.notifications is false
 */
export async function getNotificationSummary(): Promise<FarmeroNotificationSummary> {
  if (!isBackendSyncEnabled('notifications')) {
    return { unreadCount: 0 }
  }

  try {
    const response = await apiFetch<FarmeroNotificationSummary>(
      '/notifications/summary',
      {
        method: 'GET',
        credentials: 'include',
      }
    )

    return response
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a vedea rezumatul notificărilor.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a accesa rezumatul notificărilor.')
      }
      throw error
    }
    throw error
  }
}

/**
 * Mark notification as read
 * 
 * @param id - Notification ID
 * @throws ApiError if request fails
 * 
 * FALLBACK: No-op if BackendSyncStatus.notifications is false
 */
export async function markNotificationRead(id: string): Promise<void> {
  if (!isBackendSyncEnabled('notifications')) {
    return
  }

  try {
    await apiFetch<void>(`/notifications/${id}/read`, {
      method: 'POST',
      credentials: 'include',
    })
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a marca notificarea ca citită.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a marca notificarea ca citită.')
      }
      if (error.status === 404) {
        throw new Error('Notificarea nu a fost găsită.')
      }
      throw error
    }
    throw error
  }
}

