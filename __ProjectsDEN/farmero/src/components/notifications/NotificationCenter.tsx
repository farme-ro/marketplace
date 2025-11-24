/**
 * Notification Center Component
 * 
 * Componenta principală pentru afișarea și gestionarea notificărilor
 * Include dropdown cu notificări, badge pentru unread count, și acțiuni
 */

'use client'

import { useEffect, useState, useRef } from 'react'
import { useNotificationsStore, useUnreadNotificationsCount } from '@/lib/store/notifications'
import { useI18n } from '@/lib/i18n/context'
import { useAuth } from '@/lib/auth/context'
import { Bell, X, Check, Archive, ChevronRight, Loader2 } from 'lucide-react'
import { Button } from 'farme-ui'
import { Card, CardContent } from 'farme-ui'
import { cn } from '@/lib/utils/cn'
import { formatDate } from '@/lib/utils/format'
import type { Notification, NotificationCategory } from '@/lib/types/notifications'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

// ============================================================================
// Notification Icon Helper
// ============================================================================

function getNotificationIcon(category: NotificationCategory) {
  switch (category) {
    case 'favorite_price_drop':
      return '💰'
    case 'favorite_back_in_stock':
      return '📦'
    case 'subscription_reminder':
      return '⏰'
    case 'subscription_delivery':
      return '🚚'
    case 'order_status':
      return '📋'
    case 'system_message':
      return 'ℹ️'
    case 'promotion':
      return '🎉'
    default:
      return '🔔'
  }
}

// ============================================================================
// Notification Item Component
// ============================================================================

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead: (id: string) => void
  onArchive: (id: string) => void
}

function NotificationItem({ notification, onMarkAsRead, onArchive }: NotificationItemProps) {
  const { t, locale } = useI18n()
  const isUnread = notification.status === 'unread'

  const handleClick = () => {
    if (isUnread) {
      onMarkAsRead(notification.id)
    }
  }

  const getActionUrl = (): string | null => {
    if ('metadata' in notification) {
      const meta = notification.metadata as Record<string, unknown>
      
      // Favorite price drop / back in stock
      if (
        notification.category === 'favorite_price_drop' ||
        notification.category === 'favorite_back_in_stock'
      ) {
        const slug = meta.productSlug as string | undefined
        return slug ? `/products/${slug}` : null
      }
      
      // Subscription
      if (
        notification.category === 'subscription_reminder' ||
        notification.category === 'subscription_delivery'
      ) {
        return '/account/subscriptions'
      }
      
      // Order status
      if (notification.category === 'order_status') {
        const orderId = meta.orderId as string | undefined
        return orderId ? `/orders/${orderId}` : '/orders'
      }
      
      // System message
      if (notification.category === 'system_message') {
        return (meta.actionUrl as string | undefined) || null
      }
      
      // Promotion
      if (notification.category === 'promotion') {
        return (meta.actionUrl as string | undefined) || null
      }
    }
    return null
  }

  const actionUrl = getActionUrl()
  const icon = getNotificationIcon(notification.category)

  const content = (
    <div
      className={cn(
        'flex items-start gap-3 p-3 rounded-lg transition-colors',
        isUnread ? 'bg-primary/5 border border-primary/20' : 'bg-muted/50',
        actionUrl && 'cursor-pointer hover:bg-muted'
      )}
      onClick={actionUrl ? handleClick : undefined}
    >
      <div className="text-2xl flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className={cn('text-sm font-medium', isUnread ? 'text-foreground' : 'text-muted-foreground')}>
              {notification.title}
            </p>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {notification.message}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDate(notification.createdAt, locale, {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          {isUnread && (
            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1 flex-shrink-0">
        {isUnread && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation()
              onMarkAsRead(notification.id)
            }}
            title={t('notifications.markAsRead', 'Marchează ca citită')}
          >
            <Check className="w-3 h-3" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={(e) => {
            e.stopPropagation()
            onArchive(notification.id)
          }}
          title={t('notifications.archive', 'Arhivează')}
        >
          <Archive className="w-3 h-3" />
        </Button>
      </div>
    </div>
  )

  if (actionUrl) {
    return (
      <Link href={actionUrl} className="block">
        {content}
      </Link>
    )
  }

  return content
}

// ============================================================================
// Notification Center Component
// ============================================================================

export function NotificationCenter() {
  const { user } = useAuth()
  const { t } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const {
    notifications,
    isLoading,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    archive,
    refreshUnreadCount,
  } = useNotificationsStore()
  
  const unreadCount = useUnreadNotificationsCount()

  // Load notifications on mount and when opened
  useEffect(() => {
    if (user && isOpen) {
      loadNotifications({ limit: 20, unreadOnly: false })
    }
  }, [user, isOpen, loadNotifications])

  // Refresh unread count periodically
  useEffect(() => {
    if (!user) return

    refreshUnreadCount()
    const interval = setInterval(() => {
      refreshUnreadCount()
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [user, refreshUnreadCount])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Don't render if user is not authenticated
  if (!user) {
    return null
  }

  const unreadNotifications = notifications.filter((n) => n.status === 'unread')
  const hasUnread = unreadCount > 0

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('notifications.title', 'Notificări')}
      >
        <Bell className="w-5 h-5" />
        {hasUnread && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-background border border-border rounded-lg shadow-lg z-50 max-h-[80vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">
                  {t('notifications.title', 'Notificări')}
                </h3>
                {hasUnread && (
                  <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {hasUnread && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markAllAsRead()}
                    title={t('notifications.markAllAsRead', 'Marchează toate ca citite')}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  aria-label={t('common.close', 'Închide')}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">
                    {t('notifications.empty', 'Nu ai notificări')}
                  </p>
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                      onArchive={archive}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-4 border-t border-border">
                <Link
                  href="/account/notifications"
                  className="flex items-center justify-between text-sm text-primary hover:underline"
                >
                  <span>{t('notifications.viewAll', 'Vezi toate notificările')}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

