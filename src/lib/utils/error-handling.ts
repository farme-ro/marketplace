/**
 * Error Handling Utilities
 * 
 * Funcții helper pentru standardizarea error handling-ului în aplicație
 * Asigură mesaje consistente și user-friendly pentru toate tipurile de erori
 */

import { ApiError } from '@/lib/api/client'
import { useRouter } from 'next/navigation'

/**
 * Error types that should trigger login redirect
 */
const AUTH_ERROR_INDICATORS = ['401', 'autentificat', 'unauthorized', 'login']

/**
 * Error types that indicate forbidden access
 */
const FORBIDDEN_ERROR_INDICATORS = ['403', 'forbidden', 'permisiune', 'drepturi']

/**
 * Error types that indicate resource not found
 */
const NOT_FOUND_ERROR_INDICATORS = ['404', 'nu a fost găsit', 'not found', 'nu există']

/**
 * Error types that indicate validation errors
 */
const VALIDATION_ERROR_INDICATORS = ['422', 'stoc', 'disponibil', 'invalid', 'validare']

/**
 * Extract user-friendly error message from error
 * 
 * @param error - Error object (can be Error, ApiError, or unknown)
 * @param defaultMessage - Default message if error message cannot be extracted
 * @returns User-friendly error message
 */
export function extractErrorMessage(error: unknown, defaultMessage: string = 'A apărut o eroare. Te rugăm să încerci din nou.'): string {
  if (error instanceof ApiError) {
    return error.message || defaultMessage
  }
  
  if (error instanceof Error) {
    return error.message || defaultMessage
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  return defaultMessage
}

/**
 * Check if error is an authentication error (401)
 * 
 * @param error - Error object
 * @returns True if error indicates authentication required
 */
export function isAuthError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status === 401
  }
  
  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    return AUTH_ERROR_INDICATORS.some(indicator => message.includes(indicator.toLowerCase()))
  }
  
  return false
}

/**
 * Check if error is a forbidden error (403)
 * 
 * @param error - Error object
 * @returns True if error indicates forbidden access
 */
export function isForbiddenError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status === 403
  }
  
  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    return FORBIDDEN_ERROR_INDICATORS.some(indicator => message.includes(indicator.toLowerCase()))
  }
  
  return false
}

/**
 * Check if error is a not found error (404)
 * 
 * @param error - Error object
 * @returns True if error indicates resource not found
 */
export function isNotFoundError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status === 404
  }
  
  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    return NOT_FOUND_ERROR_INDICATORS.some(indicator => message.includes(indicator.toLowerCase()))
  }
  
  return false
}

/**
 * Check if error is a validation error (422)
 * 
 * @param error - Error object
 * @returns True if error indicates validation failure
 */
export function isValidationError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status === 422
  }
  
  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    return VALIDATION_ERROR_INDICATORS.some(indicator => message.includes(indicator.toLowerCase()))
  }
  
  return false
}

/**
 * Get user-friendly error message based on error type
 * 
 * @param error - Error object
 * @param messages - Custom messages for different error types
 * @returns User-friendly error message
 */
export function getUserFriendlyErrorMessage(
  error: unknown,
  messages: {
    auth?: string
    forbidden?: string
    notFound?: string
    validation?: string
    default?: string
  } = {}
): string {
  if (isAuthError(error)) {
    return messages.auth || 'Trebuie să fii autentificat pentru a accesa această funcționalitate.'
  }
  
  if (isForbiddenError(error)) {
    return messages.forbidden || 'Nu ai permisiunea de a accesa această resursă.'
  }
  
  if (isNotFoundError(error)) {
    return messages.notFound || 'Resursa nu a fost găsită.'
  }
  
  if (isValidationError(error)) {
    return messages.validation || extractErrorMessage(error, messages.default)
  }
  
  return extractErrorMessage(error, messages.default || 'A apărut o eroare. Te rugăm să încerci din nou.')
}

/**
 * Handle error and return appropriate action
 * 
 * @param error - Error object
 * @param options - Options for error handling
 * @returns Object with error message and action to take
 */
export function handleError(
  error: unknown,
  options: {
    redirectToLogin?: (path: string) => void
    currentPath?: string
    customMessages?: {
      auth?: string
      forbidden?: string
      notFound?: string
      validation?: string
      default?: string
    }
  } = {}
): {
  message: string
  action: 'redirect_login' | 'redirect_back' | 'show_error' | 'none'
  redirectPath?: string
} {
  const { redirectToLogin, currentPath, customMessages } = options
  
  if (isAuthError(error) && redirectToLogin && currentPath) {
    return {
      message: getUserFriendlyErrorMessage(error, customMessages),
      action: 'redirect_login',
      redirectPath: `/login-client?redirect=${encodeURIComponent(currentPath)}`,
    }
  }
  
  if (isForbiddenError(error)) {
    return {
      message: getUserFriendlyErrorMessage(error, customMessages),
      action: 'show_error',
    }
  }
  
  if (isNotFoundError(error)) {
    return {
      message: getUserFriendlyErrorMessage(error, customMessages),
      action: 'show_error',
    }
  }
  
  return {
    message: getUserFriendlyErrorMessage(error, customMessages),
    action: 'show_error',
  }
}

