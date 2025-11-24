/**
 * Farmero Notification Center Component
 * 
 * Unified notification center for Farmero notifications.
 * Displays bell icon with badge and popover with notification list.
 */

'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useFarmeroNotificationsStore, useNotificationSummary } from '@/lib/store/farmero-notifications'
import { useI18n } from '@/lib/i18n/context'
import { useAuth } from '@/lib/auth/context'
import { Bell, Check, X, Loader2 } from 'lucide-react'
import { Button } from 'farme-ui'
import { cn } from '@/lib/utils/cn'
import { formatRelativeTime } from '@/lib/utils/format'
import type { FarmeroNotification } from '@/lib/types/farmero-notifications'
import { motion, AnimatePresence } from 'framer-motion'
import { ListSkeleton } from '@/components/ui/unified-skeletons'
import { EmptyState } from '@/components/ui/empty-state'

// ============================================================================
// Notification Item Component
// ============================================================================

interface NotificationItemProps {
  notification: FarmeroNotification
  onMarkAsRead: (id: string) => void
  onNavigate?: (url: string) => void
}

function NotificationItem({ notification, onMarkAsRead, onNavigate }: NotificationItemProps) {
  const { t, locale } = useI18n()
  const isUnread = !notification.readAt

  const handleClick = () => {
    if (isUnread) {
      onMarkAsRead(notification.id)
    }
    if (notification.targetUrl && onNavigate) {
      onNavigate(notification.targetUrl)
    }
  }

  const severityColors = {
    info: 'border-l-blue-500',
    success: 'border-l-green-500',
    warning: 'border-l-yellow-500',
    error: 'border-l-red-500',
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'w-full text-left p-4 border-l-4 transition-colors',
        'hover:bg-muted/50 focus:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        severityColors[notification.severity],
        isUnread ? 'bg-muted/30 font-medium' : 'bg-background'
      )}
      role="listitem"
      aria-label={`${notification.title}: ${notification.body}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={cn('text-sm font-semibold text-foreground', isUnread && 'font-bold')}>
              {notification.title}
            </h4>
            {isUnread && (
              <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" aria-label="Unread" />
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
            {notification.body}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatRelativeTime(notification.createdAt, locale)}
          </p>
        </div>
      </div>
    </button>
  )
}

// ============================================================================
// Notification Center Component
// ============================================================================

export function FarmeroNotificationCenter() {
  const { user } = useAuth()
  const { t } = useI18n()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  
  const {
    notifications,
    status,
    loadNotifications,
    loadSummary,
    markAsRead,
    markAllAsRead,
  } = useFarmeroNotificationsStore()
  
  const summary = useNotificationSummary()
  const unreadCount = summary?.unreadCount ?? 0

  // Load notifications and summary on mount
  useEffect(() => {
    if (user) {
      loadSummary()
      if (isOpen) {
        loadNotifications()
      }
    }
  }, [user, isOpen, loadNotifications, loadSummary])

  // Refresh summary periodically
  useEffect(() => {
    if (!user) return

    const interval = setInterval(() => {
      loadSummary()
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [user, loadSummary])

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Close popover on Escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  const handleMarkAllAsRead = async () => {
    await markAllAsRead()
    // Refresh summary
    await loadSummary()
  }

  const handleNavigate = (url: string) => {
    setIsOpen(false)
    router.push(url)
  }

  // Don't render if user is not authenticated
  if (!user) {
    return null
  }

  return (
    <div className="relative" ref={popoverRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-foreground hover:text-primary transition-colors rounded-lg hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label={t('notifications.title', 'Notificări')}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Bell className="w-5 h-5" aria-hidden="true" />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold"
            aria-label={t('notifications.unreadCount', '{count} notificări necitite').replace('{count}', unreadCount.toString())}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-background border border-border rounded-lg shadow-lg z-50 max-h-[80vh] flex flex-col"
            role="dialog"
            aria-label={t('notifications.title', 'Notificări')}
            aria-live="polite"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">
                {t('notifications.title', 'Notificări')}
              </h3>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="text-xs"
                >
                  <Check className="w-4 h-4 mr-1" />
                  {t('notifications.markAllRead', 'Marchează toate ca citite')}
                </Button>
              )}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto" role="list">
              {status === 'loading' ? (
                <div className="p-4">
                  <ListSkeleton count={3} />
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8">
                  <EmptyState
                    icon={Bell}
                    title={t('notifications.empty', 'Nu ai notificări noi')}
                    description={t('notifications.emptyDescription', 'Notificările tale vor apărea aici.')}
                    card={false}
                    size="sm"
                  />
                </div>
              ) : (
                notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onNavigate={handleNavigate}
                  />
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

