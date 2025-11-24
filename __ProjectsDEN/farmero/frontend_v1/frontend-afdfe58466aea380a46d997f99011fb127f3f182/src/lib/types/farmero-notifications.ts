/**
 * Farmero Notifications Types
 * 
 * Type definitions for unified notification & communication system.
 * 
 * Used for:
 * - Transactional notifications (orders, statuses)
 * - Subscription notifications (delivery, pause, etc.)
 * - Promo notifications based on favorites/subscriptions (decent, non-invasive)
 */

// ============================================================================
// Notification Types
// ============================================================================

/**
 * Notification Type
 * 
 * Tipuri de notificări disponibile în sistem
 */
export type FarmeroNotificationType =
  | 'order_status'
  | 'subscription'
  | 'favorite_promo'
  | 'system'
  | 'marketing'

/**
 * Notification Severity
 * 
 * Severitatea notificării (pentru styling și prioritizare)
 */
export type FarmeroNotificationSeverity = 'info' | 'success' | 'warning' | 'error'

// ============================================================================
// Notification Interface
// ============================================================================

/**
 * Farmero Notification
 * 
 * Structura de bază pentru toate notificările
 */
export interface FarmeroNotification {
  id: string
  type: FarmeroNotificationType
  severity: FarmeroNotificationSeverity
  title: string
  body: string
  createdAt: string
  readAt?: string
  // Unde ajunge când dai click
  targetUrl?: string
}

// ============================================================================
// Notification Summary
// ============================================================================

/**
 * Notification Summary
 * 
 * Rezumat pentru badge și header
 */
export interface FarmeroNotificationSummary {
  unreadCount: number
  lastNotificationAt?: string
}

