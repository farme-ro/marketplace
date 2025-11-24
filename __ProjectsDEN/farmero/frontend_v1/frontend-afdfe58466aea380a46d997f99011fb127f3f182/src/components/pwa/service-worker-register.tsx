/**
 * Service Worker Registration Component
 * 
 * Registers the service worker for PWA offline support
 * Only runs in the browser
 */

'use client'

import { useEffect } from 'react'

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.log('[SW] Service Worker registered:', registration.scope)
          }
        })
        .catch((error) => {
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.error('[SW] Service Worker registration failed:', error)
          }
        })
    }
  }, [])

  return null
}

