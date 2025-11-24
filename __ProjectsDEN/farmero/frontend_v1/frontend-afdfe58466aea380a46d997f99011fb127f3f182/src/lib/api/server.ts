/**
 * Server-side API Client Helper
 * 
 * Helper functions for making API requests from server components and route handlers
 * Automatically forwards cookies from the request to the backend API
 */

import { cookies } from 'next/headers'
import type { ApiResponse, ApiError } from './apiTypes'

import { getApiBaseUrl } from './config'

const API_BASE_URL = getApiBaseUrl()
const DEFAULT_TIMEOUT = 30000

/**
 * Get auth token from cookies (server-side)
 */
async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()
  
  // Check common token cookie names
  const tokenNames = ['auth_token', 'producer_token', 'access_token', 'token']
  
  for (const name of tokenNames) {
    const cookie = cookieStore.get(name)
    if (cookie?.value) {
      return cookie.value
    }
  }
  
  return null
}

/**
 * Make a server-side API request
 * Automatically forwards cookies to the backend
 */
export async function serverRequest<T = unknown>(
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  url: string,
  body?: unknown,
  headers?: Record<string, string>
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
    fullUrl = `${API_BASE_URL}${url}`
  }

  // Get cookies to forward
  const cookieStore = await cookies()
  
  // Build cookie header string
  const cookiePairs: string[] = []
  cookieStore.getAll().forEach((cookie) => {
    cookiePairs.push(`${cookie.name}=${cookie.value}`)
  })
  const cookieHeader = cookiePairs.join('; ')

  // Build headers
  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  }

  // Add auth token if available
  const token = await getAuthToken()
  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`
  }

  // Forward all cookies to backend
  if (cookieHeader) {
    requestHeaders['Cookie'] = cookieHeader
  }

  // Make request with timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT)

  try {
    const response = await fetch(fullUrl, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      cache: 'no-store', // Server requests should not be cached
    })

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
      }

      const apiError: ApiError = {
        status: response.status,
        message: errorMessage,
        details: errorData,
      }

      return {
        data: null,
        error: apiError,
      }
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      return {
        data: null as T,
        error: null,
      }
    }

    const data = await response.json()

    return {
      data,
      error: null,
    }
  } catch (fetchError: unknown) {
    clearTimeout(timeoutId)

    const errorMessage = fetchError instanceof Error ? fetchError.message : 'Unexpected error'
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
 * Server-side GET request
 */
export async function serverGet<T = any>(url: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
  return serverRequest<T>('GET', url, undefined, headers)
}

/**
 * Server-side POST request
 */
export async function serverPost<T = unknown>(url: string, body?: unknown, headers?: Record<string, string>): Promise<ApiResponse<T>> {
  return serverRequest<T>('POST', url, body, headers)
}

/**
 * Server-side PUT request
 */
export async function serverPut<T = unknown>(url: string, body?: unknown, headers?: Record<string, string>): Promise<ApiResponse<T>> {
  return serverRequest<T>('PUT', url, body, headers)
}

/**
 * Server-side PATCH request
 */
export async function serverPatch<T = unknown>(url: string, body?: unknown, headers?: Record<string, string>): Promise<ApiResponse<T>> {
  return serverRequest<T>('PATCH', url, body, headers)
}

/**
 * Server-side DELETE request
 */
export async function serverDelete<T = unknown>(url: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
  return serverRequest<T>('DELETE', url, undefined, headers)
}

