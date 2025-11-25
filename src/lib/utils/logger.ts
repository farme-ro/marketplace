/**
 * Logger Utility
 * 
 * Centralized logging that:
 * - Only logs in development (console.log/error/warn/debug)
 * - Sends errors to Sentry in production
 * - Provides consistent logging interface
 */

import { captureException, captureMessage } from '@/lib/sentry'

type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'info'

interface LogContext {
  [key: string]: any
}

/**
 * Log error - sends to Sentry in production, logs to console in development
 */
export function logError(error: Error | unknown, context?: LogContext) {
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  if (isDevelopment) {
    console.error('[Error]', error, context)
  }
  
  // Send to Sentry in production
  if (error instanceof Error) {
    captureException(error, context)
  } else {
    captureMessage(String(error), 'error')
  }
}

/**
 * Log warning - only in development
 */
export function logWarning(message: string, context?: LogContext) {
  if (process.env.NODE_ENV === 'development') {
    console.warn('[Warning]', message, context)
  }
  
  // Optionally send to Sentry as warning
  if (process.env.NODE_ENV === 'production') {
    captureMessage(message, 'warning')
  }
}

/**
 * Log info - only in development
 */
export function logInfo(message: string, context?: LogContext) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Info]', message, context)
  }
}

/**
 * Log debug - only in development
 */
export function logDebug(message: string, context?: LogContext) {
  if (process.env.NODE_ENV === 'development') {
    console.debug('[Debug]', message, context)
  }
}

/**
 * Generic logger function
 */
export function logger(level: LogLevel, message: string, context?: LogContext) {
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  switch (level) {
    case 'error':
      if (isDevelopment) {
        console.error('[Error]', message, context)
      }
      captureMessage(message, 'error')
      break
    case 'warn':
      if (isDevelopment) {
        console.warn('[Warning]', message, context)
      }
      if (process.env.NODE_ENV === 'production') {
        captureMessage(message, 'warning')
      }
      break
    case 'info':
      if (isDevelopment) {
        console.log('[Info]', message, context)
      }
      break
    case 'debug':
      if (isDevelopment) {
        console.debug('[Debug]', message, context)
      }
      break
    case 'log':
      if (isDevelopment) {
        console.log('[Log]', message, context)
      }
      break
  }
}

