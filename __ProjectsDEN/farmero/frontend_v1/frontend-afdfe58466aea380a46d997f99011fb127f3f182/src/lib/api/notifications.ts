/**
 * Notifications API
 * 
 * API functions for managing notifications system
 * Uses apiFetch to call https://api.farme.ro (external backend API)
 * 
 * IMPORTANT: Backend-ul este într-un repo separat (api.farme.ro).
 * Aceste funcții sunt doar API contracts și fallback-uri pentru frontend.
 * 
 * Note: Backend endpoints need to be implemented in the separate backend repository:
 * - GET /notifications - Get notifications
 * - GET /notifications/:id - Get notification by ID
 * - POST /notifications/:id/read - Mark notification as read
 * - POST /notifications/read-all - Mark all notifications as read
 * - POST /notifications/:id/archive - Archive notification
 * - GET /notifications/preferences - Get notification preferences
 * - PATCH /notifications/preferences - Update notification preferences
 * 
 * FALLBACK: If notifications is disabled in BackendSyncStatus, uses localStorage fallback
 * 
 * See: docs/BACKEND_API_CONTRACT_NOTIFICATIONS.md for API contract documentation
 */

import { apiFetch, ApiError } from './client'
import { isBackendSyncEnabled } from '@/lib/backend-sync/status'
import type {
  Notification,
  GetNotificationsQuery,
  MarkNotificationReadInput,
  MarkAllNotificationsReadInput,
  ArchiveNotificationInput,
  NotificationPreferences,
  UpdateNotificationPreferencesInput,
} from '@/lib/types/notifications'
import { DEFAULT_NOTIFICATION_PREFERENCES } from '@/lib/types/notifications'

// ============================================================================
// Local Storage Fallback
// ============================================================================

const NOTIFICATIONS_STORAGE_KEY = 'farme_notifications'
const NOTIFICATIONS_PREFERENCES_KEY = 'farme_notification_preferences'

/**
 * Get notifications from localStorage
 */
function getLocalNotifications(): Notification[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY)
    if (!stored) return []
    return JSON.parse(stored) as Notification[]
  } catch {
    return []
  }
}

/**
 * Save notifications to localStorage
 */
function saveLocalNotifications(notifications: Notification[]): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications))
  } catch {
    // Ignore storage errors
  }
}

/**
 * Get notification preferences from localStorage
 */
function getLocalNotificationPreferences(): NotificationPreferences {
  if (typeof window === 'undefined') return DEFAULT_NOTIFICATION_PREFERENCES
  
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_PREFERENCES_KEY)
    if (!stored) return DEFAULT_NOTIFICATION_PREFERENCES
    return { ...DEFAULT_NOTIFICATION_PREFERENCES, ...JSON.parse(stored) }
  } catch {
    return DEFAULT_NOTIFICATION_PREFERENCES
  }
}

/**
 * Save notification preferences to localStorage
 */
function saveLocalNotificationPreferences(preferences: NotificationPreferences): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(NOTIFICATIONS_PREFERENCES_KEY, JSON.stringify(preferences))
  } catch {
    // Ignore storage errors
  }
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get notifications
 * 
 * @param query - Query parameters for filtering
 * @returns List of notifications
 * @throws ApiError if request fails
 * 
 * FALLBACK: Returns localStorage notifications if backend is not enabled
 */
export async function getNotifications(
  query?: GetNotificationsQuery
): Promise<Notification[]> {
  if (!isBackendSyncEnabled('notifications')) {
    let notifications = getLocalNotifications()
    
    // Apply filters
    if (query?.category) {
      notifications = notifications.filter((n) => n.category === query.category)
    }
    if (query?.status) {
      notifications = notifications.filter((n) => n.status === query.status)
    }
    if (query?.priority) {
      notifications = notifications.filter((n) => n.priority === query.priority)
    }
    if (query?.unreadOnly) {
      notifications = notifications.filter((n) => n.status === 'unread')
    }
    
    // Apply pagination
    if (query?.offset) {
      notifications = notifications.slice(query.offset)
    }
    if (query?.limit) {
      notifications = notifications.slice(0, query.limit)
    }
    
    return notifications
  }

  try {
    const params = new URLSearchParams()
    if (query?.category) params.append('category', query.category)
    if (query?.status) params.append('status', query.status)
    if (query?.priority) params.append('priority', query.priority)
    if (query?.unreadOnly) params.append('unreadOnly', 'true')
    if (query?.limit) params.append('limit', query.limit.toString())
    if (query?.offset) params.append('offset', query.offset.toString())

    const url = `/notifications${params.toString() ? `?${params.toString()}` : ''}`
    const response = await apiFetch<Notification[] | { data: Notification[] }>(url, {
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
 * Get notification by ID
 * 
 * @param notificationId - Notification ID
 * @returns Notification details
 * @throws ApiError if request fails
 * 
 * FALLBACK: Returns localStorage notification if backend is not enabled
 */
export async function getNotificationById(notificationId: string): Promise<Notification | null> {
  if (!isBackendSyncEnabled('notifications')) {
    const notifications = getLocalNotifications()
    return notifications.find((n) => n.id === notificationId) || null
  }

  try {
    const response = await apiFetch<Notification | { data: Notification }>(
      `/notifications/${notificationId}`,
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
        throw new Error('Trebuie să fii autentificat pentru a vedea notificarea.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a accesa această notificare.')
      }
      if (error.status === 404) {
        return null
      }
      throw error
    }
    throw error
  }
}

/**
 * Mark notification as read
 * 
 * @param input - Mark as read input
 * @returns Updated notification
 * @throws ApiError if request fails
 * 
 * FALLBACK: Updates localStorage notification if backend is not enabled
 */
export async function markNotificationRead(
  input: MarkNotificationReadInput
): Promise<Notification> {
  if (!isBackendSyncEnabled('notifications')) {
    const notifications = getLocalNotifications()
    const notification = notifications.find((n) => n.id === input.notificationId)
    
    if (!notification) {
      throw new Error('Notificarea nu a fost găsită.')
    }
    
    const updated: Notification = {
      ...notification,
      status: 'read',
      readAt: new Date().toISOString(),
    }
    
    const updatedNotifications = notifications.map((n) =>
      n.id === input.notificationId ? updated : n
    )
    saveLocalNotifications(updatedNotifications)
    
    return updated
  }

  try {
    const response = await apiFetch<Notification | { data: Notification }>(
      `/notifications/${input.notificationId}/read`,
      {
        method: 'POST',
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
        throw new Error('Trebuie să fii autentificat pentru a marca notificarea ca citită.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a marca această notificare.')
      }
      if (error.status === 404) {
        throw new Error('Notificarea nu a fost găsită.')
      }
      throw error
    }
    throw error
  }
}

/**
 * Mark all notifications as read
 * 
 * @param input - Mark all as read input (optional category filter)
 * @returns Number of notifications marked as read
 * @throws ApiError if request fails
 * 
 * FALLBACK: Updates localStorage notifications if backend is not enabled
 */
export async function markAllNotificationsRead(
  input?: MarkAllNotificationsReadInput
): Promise<number> {
  if (!isBackendSyncEnabled('notifications')) {
    const notifications = getLocalNotifications()
    const now = new Date().toISOString()
    
    let updated = notifications.map((n) => {
      if (n.status === 'unread') {
        if (!input?.category || n.category === input.category) {
          return { ...n, status: 'read' as const, readAt: now }
        }
      }
      return n
    })
    
    saveLocalNotifications(updated)
    
    return updated.filter((n) => n.readAt === now).length
  }

  try {
    const body = input?.category ? { category: input.category } : {}
    const response = await apiFetch<{ count: number }>(
      '/notifications/read-all',
      {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(body),
      }
    )

    return response.count || 0
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a marca notificările ca citite.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a marca notificările.')
      }
      throw error
    }
    throw error
  }
}

/**
 * Archive notification
 * 
 * @param input - Archive notification input
 * @returns Updated notification
 * @throws ApiError if request fails
 * 
 * FALLBACK: Updates localStorage notification if backend is not enabled
 */
export async function archiveNotification(
  input: ArchiveNotificationInput
): Promise<Notification> {
  if (!isBackendSyncEnabled('notifications')) {
    const notifications = getLocalNotifications()
    const notification = notifications.find((n) => n.id === input.notificationId)
    
    if (!notification) {
      throw new Error('Notificarea nu a fost găsită.')
    }
    
    const updated: Notification = {
      ...notification,
      status: 'archived',
      archivedAt: new Date().toISOString(),
    }
    
    const updatedNotifications = notifications.map((n) =>
      n.id === input.notificationId ? updated : n
    )
    saveLocalNotifications(updatedNotifications)
    
    return updated
  }

  try {
    const response = await apiFetch<Notification | { data: Notification }>(
      `/notifications/${input.notificationId}/archive`,
      {
        method: 'POST',
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
        throw new Error('Trebuie să fii autentificat pentru a arhiva notificarea.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a arhiva această notificare.')
      }
      if (error.status === 404) {
        throw new Error('Notificarea nu a fost găsită.')
      }
      throw error
    }
    throw error
  }
}

/**
 * Get notification preferences
 * 
 * @returns Notification preferences
 * @throws ApiError if request fails
 * 
 * FALLBACK: Returns localStorage preferences if backend is not enabled
 */
export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  if (!isBackendSyncEnabled('notifications')) {
    return getLocalNotificationPreferences()
  }

  try {
    const response = await apiFetch<NotificationPreferences | { data: NotificationPreferences }>(
      '/notifications/preferences',
      {
        method: 'GET',
        credentials: 'include',
      }
    )

    const preferences = 'data' in response ? response.data : response
    // Merge with defaults to ensure all fields are present
    return { ...DEFAULT_NOTIFICATION_PREFERENCES, ...preferences }
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a vedea preferințele de notificare.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a accesa preferințele de notificare.')
      }
      // If endpoint doesn't exist, return defaults
      if (error.status === 404) {
        return DEFAULT_NOTIFICATION_PREFERENCES
      }
      throw error
    }
    throw error
  }
}

/**
 * Update notification preferences
 * 
 * @param input - Update preferences input
 * @returns Updated preferences
 * @throws ApiError if request fails
 * 
 * FALLBACK: Updates localStorage preferences if backend is not enabled
 */
export async function updateNotificationPreferences(
  input: UpdateNotificationPreferencesInput
): Promise<NotificationPreferences> {
  const current = await getNotificationPreferences()
  const updated = { ...current, ...input.preferences }
  
  if (!isBackendSyncEnabled('notifications')) {
    saveLocalNotificationPreferences(updated)
    return updated
  }

  try {
    const response = await apiFetch<NotificationPreferences | { data: NotificationPreferences }>(
      '/notifications/preferences',
      {
        method: 'PATCH',
        credentials: 'include',
        body: JSON.stringify(input),
      }
    )

    const preferences = 'data' in response ? response.data : response
    // Merge with defaults to ensure all fields are present
    const finalPreferences = { ...DEFAULT_NOTIFICATION_PREFERENCES, ...preferences }
    saveLocalNotificationPreferences(finalPreferences)
    return finalPreferences
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a actualiza preferințele de notificare.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a actualiza preferințele de notificare.')
      }
      throw error
    }
    throw error
  }
}

/**
 * Get unread notifications count
 * 
 * @returns Number of unread notifications
 * @throws ApiError if request fails
 * 
 * FALLBACK: Counts localStorage unread notifications if backend is not enabled
 */
export async function getUnreadNotificationsCount(): Promise<number> {
  if (!isBackendSyncEnabled('notifications')) {
    const notifications = getLocalNotifications()
    return notifications.filter((n) => n.status === 'unread').length
  }

  try {
    const response = await apiFetch<{ count: number }>('/notifications/unread-count', {
      method: 'GET',
      credentials: 'include',
    })

    return response.count || 0
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        return 0 // Not authenticated, no notifications
      }
      if (error.status === 403) {
        return 0 // No permission, no notifications
      }
      // If endpoint doesn't exist, count from getNotifications
      if (error.status === 404) {
        const notifications = await getNotifications({ unreadOnly: true })
        return notifications.length
      }
      throw error
    }
    throw error
  }
}

