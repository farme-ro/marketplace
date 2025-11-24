/**
 * Sentry Configuration
 * 
 * Configurare Sentry pentru error tracking
 * Folosește NEXT_PUBLIC_SENTRY_DSN pentru DSN (Data Source Name)
 */

// Only initialize Sentry in production or when DSN is provided
const shouldInitializeSentry = 
  process.env.NODE_ENV === 'production' && 
  process.env.NEXT_PUBLIC_SENTRY_DSN

let Sentry: any = null

if (shouldInitializeSentry) {
  try {
    // Dynamic import pentru a evita erori în development
    Sentry = require('@sentry/nextjs')
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('[Sentry] Failed to load Sentry:', error)
    }
  }
}

/**
 * Initialize Sentry (called from app)
 */
export function initSentry() {
  if (!shouldInitializeSentry || !Sentry) {
    return
  }

  try {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 0.1, // 10% of transactions
      beforeSend(event, hint) {
        // Filter out known non-critical errors
        if (event.exception) {
          const error = hint.originalException
          // Don't send WebSocket errors (they're expected)
          if (error && typeof error === 'object' && 'message' in error) {
            const message = String(error.message)
            if (message.includes('WebSocket') || message.includes('socket.io')) {
              return null
            }
          }
        }
        return event
      },
    })
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('[Sentry] Failed to initialize:', error)
    }
  }
}

/**
 * Capture exception
 */
export function captureException(error: Error, context?: Record<string, any>) {
  if (!Sentry) {
    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('[Error]', error, context)
    }
    return
  }

  try {
    Sentry.captureException(error, {
      contexts: context ? { additional: context } : undefined,
    })
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('[Sentry] Failed to capture exception:', err)
    }
  }
}

/**
 * Capture message
 */
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  if (!Sentry) {
    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      console[level === 'error' ? 'error' : level === 'warning' ? 'warn' : 'log']('[Message]', message)
    }
    return
  }

  try {
    Sentry.captureMessage(message, level)
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('[Sentry] Failed to capture message:', err)
    }
  }
}

export default Sentry

