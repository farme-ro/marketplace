/**
 * Error Toast Component
 * 
 * Reusable component for displaying error messages to users
 */

'use client'

import { useEffect, useState } from 'react'
import { Alert } from 'farme-ui'
import { cn } from '@/lib/utils/cn'

export interface ErrorToastProps {
  error: string | null
  onDismiss?: () => void
  autoDismiss?: boolean
  autoDismissDelay?: number
  className?: string
}

export function ErrorToast({
  error,
  onDismiss,
  autoDismiss = true,
  autoDismissDelay = 5000,
  className,
}: ErrorToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (error) {
      setIsVisible(true)
      
      if (autoDismiss && onDismiss) {
        const timer = setTimeout(() => {
          setIsVisible(false)
          setTimeout(() => onDismiss(), 300) // Wait for fade out
        }, autoDismissDelay)
        
        return () => clearTimeout(timer)
      }
    } else {
      setIsVisible(false)
    }
  }, [error, autoDismiss, autoDismissDelay, onDismiss])

  if (!error || !isVisible) {
    return null
  }

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 max-w-md transition-opacity duration-300',
        isVisible ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      <Alert variant="destructive" title="Eroare">
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm flex-1">{error}</p>
          {onDismiss && (
            <button
              onClick={() => {
                setIsVisible(false)
                setTimeout(() => onDismiss(), 300)
              }}
              className="text-destructive-foreground hover:opacity-70 transition-opacity"
              aria-label="Dismiss error"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </Alert>
    </div>
  )
}

