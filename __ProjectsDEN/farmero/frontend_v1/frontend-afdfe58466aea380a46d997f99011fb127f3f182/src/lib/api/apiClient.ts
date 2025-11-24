/**
 * API Client
 * 
 * Client-side API client for making HTTP requests to the backend
 * Handles authentication, error handling, and request/response transformation
 */

import type { ApiResponse, ApiError, RequestOptions } from './apiTypes'

import { getApiBaseUrl } from './config'

const API_BASE_URL = getApiBaseUrl()
const DEFAULT_TIMEOUT = 30000

/**
 * Make an API request
 */
export async function request<T = unknown>(
  url: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  return requestAdvanced<T>(url, options)
}

/**
 * Advanced request function with full control
 */
export async function requestAdvanced<T = unknown>(
  url: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  // Build full URL
  let fullUrl: string
  if (url.startsWith('http')) {
    fullUrl = url
  } else if (url.startsWith('/api/')) {
    // Next.js routes - use relative URL
    fullUrl = url
  } else {
    // Backend routes - prefix with API_BASE_URL
    // Ensure URL doesn't have double slashes
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL
    const path = url.startsWith('/') ? url : `/${url}`
    fullUrl = `${baseUrl}${path}`
  }
  
  // Log API URL in development for debugging
  if (process.env.NODE_ENV === 'development') {
    console.debug('[API Client] Making request to:', fullUrl)
  }

  // Build headers
  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  // Build request options
  const fetchOptions: RequestInit = {
    method: options.method || 'GET',
    headers: requestHeaders,
    credentials: options.credentials || 'include', // Include cookies for auth
  }

  // Add body if provided
  if (options.body && options.method !== 'GET') {
    fetchOptions.body = typeof options.body === 'string' 
      ? options.body 
      : JSON.stringify(options.body)
  }

  // Make request with timeout
  const controller = new AbortController()
  const timeout = options.timeout || DEFAULT_TIMEOUT
  const timeoutId = setTimeout(() => controller.abort(), timeout)
  fetchOptions.signal = controller.signal

  try {
    const response = await fetch(fullUrl, fetchOptions)

    clearTimeout(timeoutId)

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`
      let errorData: Record<string, unknown> | null = null

      try {
        errorData = (await response.json()) as Record<string, unknown>
        const errorObj = errorData as { message?: string; error?: string }
        errorMessage = errorObj.message || errorObj.error || errorMessage
      } catch {
        // If can't parse JSON, use default message
        const text = await response.text()
        if (text) {
          errorMessage = text
        }
      }

      // Extract Retry-After header for rate limiting (429)
      let retryAfter: number | undefined
      if (response.status === 429) {
        const retryAfterHeader = response.headers.get('Retry-After')
        if (retryAfterHeader) {
          retryAfter = parseInt(retryAfterHeader, 10)
          // Convert seconds to minutes if > 60
          if (retryAfter > 60) {
            retryAfter = Math.ceil(retryAfter / 60)
          }
        }
      }

      const apiError: ApiError = {
        status: response.status,
        message: errorMessage,
        details: errorData ? {
          ...errorData,
          retryAfter,
        } : { retryAfter },
      }

      return {
        data: null,
        error: apiError,
      }
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      // For non-JSON responses, return the response text or null
      if (response.status === 204 || response.status === 200) {
        return {
          data: null as T,
          error: null,
        }
      }
      
      const text = await response.text()
      return {
        data: (text || null) as T,
        error: null,
      }
    }

    const data = (await response.json()) as T

    return {
      data,
      error: null,
    }
  } catch (fetchError: unknown) {
    clearTimeout(timeoutId)

    // Handle abort (timeout)
    if (fetchError instanceof Error && fetchError.name === 'AbortError') {
      const apiError: ApiError = {
        status: 0,
        message: 'Request timeout - serverul nu răspunde. Verifică că backend-ul este accesibil.',
        details: {
          name: fetchError.name,
          message: fetchError.message,
          stack: fetchError.stack,
        },
      }
      return {
        data: null,
        error: apiError,
      }
    }

    // Handle network errors (Failed to fetch, CORS, etc.)
    let errorMessage = 'Eroare de rețea - nu s-a putut conecta la server.'
    
    if (fetchError instanceof Error && fetchError.message) {
      if (fetchError.message.includes('fetch') || fetchError.message.includes('Failed to fetch')) {
        errorMessage = `Nu s-a putut conecta la backend API (${API_BASE_URL}). Verifică că:
- Backend-ul este accesibil la api.farme.ro
- NEXT_PUBLIC_API_URL este configurat corect
- Nu există probleme de CORS sau firewall`
      } else {
        errorMessage = fetchError instanceof Error ? fetchError.message : String(fetchError)
      }
    }

    const apiError: ApiError = {
      status: 0,
      message: errorMessage,
      details: fetchError instanceof Error 
        ? { name: fetchError.name, message: fetchError.message, stack: fetchError.stack }
        : { error: String(fetchError) },
    }

    return {
      data: null,
      error: apiError,
    }
  }
}

/**
 * GET request
 */
export async function get<T = unknown>(
  url: string,
  options?: Omit<RequestOptions, 'method' | 'body'>
): Promise<ApiResponse<T>> {
  return request<T>(url, { ...options, method: 'GET' })
}

/**
 * POST request
 */
export async function post<T = unknown>(
  url: string,
  body?: unknown,
  options?: Omit<RequestOptions, 'method'>
): Promise<ApiResponse<T>> {
  return request<T>(url, { ...options, method: 'POST', body })
}

/**
 * PUT request
 */
export async function put<T = unknown>(
  url: string,
  body?: unknown,
  options?: Omit<RequestOptions, 'method'>
): Promise<ApiResponse<T>> {
  return request<T>(url, { ...options, method: 'PUT', body })
}

/**
 * PATCH request
 */
export async function patch<T = unknown>(
  url: string,
  body?: unknown,
  options?: Omit<RequestOptions, 'method'>
): Promise<ApiResponse<T>> {
  return request<T>(url, { ...options, method: 'PATCH', body })
}

/**
 * DELETE request
 */
export async function del<T = unknown>(
  url: string,
  options?: Omit<RequestOptions, 'method' | 'body'>
): Promise<ApiResponse<T>> {
  return request<T>(url, { ...options, method: 'DELETE' })
}

