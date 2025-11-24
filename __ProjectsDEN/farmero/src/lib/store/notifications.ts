/**
 * Notifications Store
 * 
 * Zustand store for managing notifications state
 * Handles loading, marking as read, archiving, and preferences
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  getNotifications,
  getNotificationById,
  markNotificationRead,
  markAllNotificationsRead,
  archiveNotification,
  getNotificationPreferences,
  updateNotificationPreferences,
  getUnreadNotificationsCount,
} from '@/lib/api/notifications'
import type {
  Notification,
  GetNotificationsQuery,
  NotificationPreferences,
  UpdateNotificationPreferencesInput,
} from '@/lib/types/notifications'

// ============================================================================
// Store State
// ============================================================================

interface NotificationsState {
  // Notifications
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  error: string | null
  
  // Preferences
  preferences: NotificationPreferences | null
  isLoadingPreferences: boolean
  
  // Actions
  loadNotifications: (query?: GetNotificationsQuery) => Promise<void>
  loadNotificationById: (id: string) => Promise<Notification | null>
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: (category?: string) => Promise<void>
  archive: (id: string) => Promise<void>
  refreshUnreadCount: () => Promise<void>
  
  // Preferences actions
  loadPreferences: () => Promise<void>
  updatePreferences: (input: UpdateNotificationPreferencesInput) => Promise<void>
  
  // Reset
  reset: () => void
}

// ============================================================================
// Store
// ============================================================================

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      // Initial state
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      error: null,
      preferences: null,
      isLoadingPreferences: false,

      // Load notifications
      loadNotifications: async (query) => {
        set({ isLoading: true, error: null })
        try {
          const notifications = await getNotifications(query)
          set({ notifications, isLoading: false })
          
          // Refresh unread count
          await get().refreshUnreadCount()
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Eroare la încărcarea notificărilor',
            isLoading: false,
          })
        }
      },

      // Load notification by ID
      loadNotificationById: async (id) => {
        try {
          const notification = await getNotificationById(id)
          if (notification) {
            // Update in list if exists
            const notifications = get().notifications
            const index = notifications.findIndex((n) => n.id === id)
            if (index >= 0) {
              notifications[index] = notification
              set({ notifications: [...notifications] })
            } else {
              set({ notifications: [notification, ...notifications] })
            }
          }
          return notification
        } catch (error) {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.error('Error loading notification:', error)
          }
          return null
        }
      },

      // Mark as read
      markAsRead: async (id) => {
        try {
          const updated = await markNotificationRead({ notificationId: id })
          const notifications = get().notifications.map((n) =>
            n.id === id ? updated : n
          )
          set({ notifications })
          
          // Refresh unread count
          await get().refreshUnreadCount()
        } catch (error) {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.error('Error marking notification as read:', error)
          }
        }
      },

      // Mark all as read
      markAllAsRead: async (category) => {
        try {
          await markAllNotificationsRead(category ? { category: category as any } : undefined)
          
          // Update local state
          const notifications = get().notifications.map((n) => {
            if (n.status === 'unread') {
              if (!category || n.category === category) {
                return { ...n, status: 'read' as const, readAt: new Date().toISOString() }
              }
            }
            return n
          })
          set({ notifications })
          
          // Refresh unread count
          await get().refreshUnreadCount()
        } catch (error) {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.error('Error marking all notifications as read:', error)
          }
        }
      },

      // Archive notification
      archive: async (id) => {
        try {
          const updated = await archiveNotification({ notificationId: id })
          const notifications = get().notifications.map((n) =>
            n.id === id ? updated : n
          )
          set({ notifications })
          
          // Refresh unread count
          await get().refreshUnreadCount()
        } catch (error) {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.error('Error archiving notification:', error)
          }
        }
      },

      // Refresh unread count
      refreshUnreadCount: async () => {
        try {
          const count = await getUnreadNotificationsCount()
          set({ unreadCount: count })
        } catch (error) {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.error('Error refreshing unread count:', error)
          }
          // Fallback: count from local notifications
          const notifications = get().notifications
          const count = notifications.filter((n) => n.status === 'unread').length
          set({ unreadCount: count })
        }
      },

      // Load preferences
      loadPreferences: async () => {
        set({ isLoadingPreferences: true })
        try {
          const preferences = await getNotificationPreferences()
          set({ preferences, isLoadingPreferences: false })
        } catch (error) {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.error('Error loading preferences:', error)
          }
          set({ isLoadingPreferences: false })
        }
      },

      // Update preferences
      updatePreferences: async (input) => {
        try {
          const preferences = await updateNotificationPreferences(input)
          set({ preferences })
        } catch (error) {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.error('Error updating preferences:', error)
          }
          throw error
        }
      },

      // Reset
      reset: () => {
        set({
          notifications: [],
          unreadCount: 0,
          isLoading: false,
          error: null,
          preferences: null,
          isLoadingPreferences: false,
        })
      },
    }),
    {
      name: 'notifications-storage',
      partialize: (state) => ({
        // Only persist preferences, not notifications (they should be fetched fresh)
        preferences: state.preferences,
      }),
    }
  )
)

// ============================================================================
// Selectors
// ============================================================================

export const useUnreadNotificationsCount = () => useNotificationsStore((state) => state.unreadCount)
export const useNotifications = () => useNotificationsStore((state) => state.notifications)
export const useNotificationPreferences = () =>
  useNotificationsStore((state) => state.preferences)

