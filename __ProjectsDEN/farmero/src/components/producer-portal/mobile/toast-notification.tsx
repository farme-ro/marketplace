/**
 * Toast Notification Component for Mobile
 * 
 * Notificări toast pentru feedback rapid
 */

'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

interface ToastNotificationProps {
  message: string
  type?: 'success' | 'error' | 'info'
  isVisible: boolean
  onClose: () => void
  duration?: number
}

export function ToastNotification({
  message,
  type = 'info',
  isVisible,
  onClose,
  duration = 3000,
}: ToastNotificationProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  const typeConfig = {
    success: {
      icon: '✓',
      className: 'bg-primary text-primary-foreground',
    },
    error: {
      icon: '✕',
      className: 'bg-destructive text-destructive-foreground',
    },
    info: {
      icon: 'ℹ',
      className: 'bg-primary-soft text-primary',
    },
  }

  const config = typeConfig[type]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-24 left-4 right-4 z-50 md:hidden"
        >
          <div className={`${config.className} rounded-2xl shadow-premium-lg px-4 py-3 flex items-center gap-3`}>
            <span className="text-lg font-bold">{config.icon}</span>
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button
              onClick={onClose}
              className="text-current opacity-70 hover:opacity-100"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

