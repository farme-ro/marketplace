/**
 * Farmero Notifications Store
 * 
 * Zustand store for managing Farmero notifications state.
 * Handles loading, marking as read, and summary.
 * 
 * FALLBACK: If BackendSyncStatus.notifications is false, store works with empty lists, no errors.
 */

import { create } from 'zustand'
import {
  getNotifications,
  getNotificationSummary,
  markNotificationRead,
} from '@/lib/api/farmero-notifications'
import { isBackendSyncEnabled } from '@/lib/backend-sync/status'
import { apiFetch } from '@/lib/api/client'
import type {
  FarmeroNotification,
  FarmeroNotificationSummary,
} from '@/lib/types/farmero-notifications'

// ============================================================================
// Store State
// ============================================================================

interface FarmeroNotificationsState {
  // Notifications
  notifications: FarmeroNotification[]
  summary: FarmeroNotificationSummary | null
  
  // Status
  status: 'idle' | 'loading' | 'error'
  error: string | null
  
  // Actions
  loadNotifications: () => Promise<void>
  loadSummary: () => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void> // Local only + TODO backend
  
  // Reset
  reset: () => void
}

// ============================================================================
// Store
// ============================================================================

export const useFarmeroNotificationsStore = create<FarmeroNotificationsState>((set, get) => ({
  // Initial state
  notifications: [],
  summary: null,
  status: 'idle',
  error: null,

  // Load notifications
  loadNotifications: async () => {
    set({ status: 'loading', error: null })
    try {
      const notifications = await getNotifications()
      set({ notifications, status: 'idle' })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Eroare la încărcarea notificărilor',
        status: 'error',
      })
    }
  },

  // Load summary
  loadSummary: async () => {
    try {
      const summary = await getNotificationSummary()
      set({ summary })
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Error loading notification summary:', error)
      }
      // Fallback: count from local notifications
      const notifications = get().notifications
      const unreadCount = notifications.filter((n) => !n.readAt).length
      set({ summary: { unreadCount } })
    }
  },

  // Mark as read
  markAsRead: async (id: string) => {
    try {
      // Optimistic update
      const notifications = get().notifications.map((n) =>
        n.id === id ? { ...n, readAt: n.readAt || new Date().toISOString() } : n
      )
      set({ notifications })

      // Call API
      await markNotificationRead(id)

      // Refresh summary
      await get().loadSummary()
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Error marking notification as read:', error)
      }
      // Rollback on error
      const notifications = get().notifications.map((n) =>
        n.id === id ? { ...n, readAt: undefined } : n
      )
      set({ notifications })
    }
  },

  // Mark all as read
  markAllAsRead: async () => {
    const now = new Date().toISOString()
    const notifications = get().notifications.map((n) =>
      !n.readAt ? { ...n, readAt: now } : n
    )
    set({ notifications, summary: { unreadCount: 0 } })
    
    // Backend endpoint POST /notifications/read-all
    if (isBackendSyncEnabled('notifications')) {
      try {
        await apiFetch('/notifications/read-all', { 
          method: 'POST',
          credentials: 'include',
        })
      } catch (error) {
        console.error('Error marking all notifications as read:', error)
      }
    }
  },

  // Reset
  reset: () => {
    set({
      notifications: [],
      summary: null,
      status: 'idle',
      error: null,
    })
  },
}))

// ============================================================================
// Selectors / Hooks
// ============================================================================

/**
 * Hook to get notifications
 */
export function useNotifications() {
  return useFarmeroNotificationsStore((state) => state.notifications)
}

/**
 * Hook to get notification summary
 */
export function useNotificationSummary() {
  return useFarmeroNotificationsStore((state) => state.summary)
}

