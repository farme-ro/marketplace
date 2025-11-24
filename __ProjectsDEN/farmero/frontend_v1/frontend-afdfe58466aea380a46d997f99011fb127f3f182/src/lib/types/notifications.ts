/**
 * Notifications System Types
 * 
 * Types for the advanced notifications system including:
 * - Favorite price drops
 * - Re-stock alerts
 * - Subscription reminders
 * - System messages
 */

// ============================================================================
// Notification Types
// ============================================================================

/**
 * Notification Category
 * 
 * Categorii de notificări disponibile
 */
export type NotificationCategory =
  | 'favorite_price_drop'
  | 'favorite_back_in_stock'
  | 'subscription_reminder'
  | 'subscription_delivery'
  | 'order_status'
  | 'system_message'
  | 'promotion'
  | 'other'

/**
 * Notification Priority
 * 
 * Prioritatea notificării (pentru sortare și afișare)
 */
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent'

/**
 * Notification Status
 * 
 * Status-ul notificării (read/unread)
 */
export type NotificationStatus = 'unread' | 'read' | 'archived'

/**
 * Base Notification
 * 
 * Structura de bază pentru toate notificările
 */
export interface BaseNotification {
  id: string
  category: NotificationCategory
  priority: NotificationPriority
  status: NotificationStatus
  title: string
  message: string
  createdAt: string
  readAt?: string
  archivedAt?: string
  // Optional metadata
  metadata?: Record<string, unknown>
}

// ============================================================================
// Specific Notification Types
// ============================================================================

/**
 * Favorite Price Drop Notification
 * 
 * Notificare când un produs favorit scade la preț
 */
export interface FavoritePriceDropNotification extends BaseNotification {
  category: 'favorite_price_drop'
  metadata: {
    productId: string
    productName: string
    productSlug?: string
    productImageUrl?: string | null
    previousPrice: number
    currentPrice: number
    priceDropPercentage: number
    favoriteId: string
  }
}

/**
 * Favorite Back in Stock Notification
 * 
 * Notificare când un produs favorit revine în stoc
 */
export interface FavoriteBackInStockNotification extends BaseNotification {
  category: 'favorite_back_in_stock'
  metadata: {
    productId: string
    productName: string
    productSlug?: string
    productImageUrl?: string | null
    stock: number
    favoriteId: string
  }
}

/**
 * Subscription Reminder Notification
 * 
 * Notificare de reminder pentru abonamente
 */
export interface SubscriptionReminderNotification extends BaseNotification {
  category: 'subscription_reminder'
  metadata: {
    subscriptionId: string
    subscriptionName: string
    nextDeliveryDate: string
    itemsCount: number
  }
}

/**
 * Subscription Delivery Notification
 * 
 * Notificare când un abonament este livrat
 */
export interface SubscriptionDeliveryNotification extends BaseNotification {
  category: 'subscription_delivery'
  metadata: {
    subscriptionId: string
    subscriptionName: string
    orderId: string
    orderNumber: string
    deliveryDate: string
  }
}

/**
 * Order Status Notification
 * 
 * Notificare despre schimbarea statusului unei comenzi
 */
export interface OrderStatusNotification extends BaseNotification {
  category: 'order_status'
  metadata: {
    orderId: string
    orderNumber: string
    previousStatus?: string
    currentStatus: string
    estimatedDeliveryDate?: string
  }
}

/**
 * System Message Notification
 * 
 * Notificare de sistem (anunțuri, mentenanță, etc.)
 */
export interface SystemMessageNotification extends BaseNotification {
  category: 'system_message'
  metadata: {
    messageType: 'announcement' | 'maintenance' | 'update' | 'security' | 'other'
    actionUrl?: string
    actionLabel?: string
  }
}

/**
 * Promotion Notification
 * 
 * Notificare despre promoții și oferte
 */
export interface PromotionNotification extends BaseNotification {
  category: 'promotion'
  metadata: {
    promotionId: string
    promotionType: 'discount' | 'free_shipping' | 'gift' | 'other'
    discountPercentage?: number
    validUntil: string
    actionUrl?: string
  }
}

/**
 * Union type for all notifications
 */
export type Notification =
  | FavoritePriceDropNotification
  | FavoriteBackInStockNotification
  | SubscriptionReminderNotification
  | SubscriptionDeliveryNotification
  | OrderStatusNotification
  | SystemMessageNotification
  | PromotionNotification
  | BaseNotification

// ============================================================================
// Notification Preferences
// ============================================================================

/**
 * Notification Preferences
 * 
 * Preferințe pentru tipurile de notificări pe care utilizatorul dorește să le primească
 */
export interface NotificationPreferences {
  // Favorite notifications
  favoritePriceDrop: boolean
  favoriteBackInStock: boolean
  
  // Subscription notifications
  subscriptionReminder: boolean
  subscriptionDelivery: boolean
  
  // Order notifications
  orderStatus: boolean
  
  // System notifications
  systemMessages: boolean
  
  // Promotions
  promotions: boolean
  
  // Push notifications (future)
  pushEnabled?: boolean
  emailEnabled?: boolean
}

/**
 * Default notification preferences
 */
export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  favoritePriceDrop: true,
  favoriteBackInStock: true,
  subscriptionReminder: true,
  subscriptionDelivery: true,
  orderStatus: true,
  systemMessages: true,
  promotions: false, // Opt-in pentru promoții
  pushEnabled: false,
  emailEnabled: true,
}

// ============================================================================
// API Types
// ============================================================================

/**
 * Get Notifications Query
 * 
 * Parametri pentru filtrarea notificărilor
 */
export interface GetNotificationsQuery {
  category?: NotificationCategory
  status?: NotificationStatus
  priority?: NotificationPriority
  limit?: number
  offset?: number
  unreadOnly?: boolean
}

/**
 * Mark Notification as Read Input
 */
export interface MarkNotificationReadInput {
  notificationId: string
}

/**
 * Mark All Notifications as Read Input
 */
export interface MarkAllNotificationsReadInput {
  category?: NotificationCategory
}

/**
 * Archive Notification Input
 */
export interface ArchiveNotificationInput {
  notificationId: string
}

/**
 * Update Notification Preferences Input
 */
export interface UpdateNotificationPreferencesInput {
  preferences: Partial<NotificationPreferences>
}

