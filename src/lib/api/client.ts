/**
 * API Client
 * 
 * Simplified API client that directly calls https://api.farme.ro (external backend API)
 * This is the base client used by all API modules
 * 
 * IMPORTANT: Backend-ul este într-un repo separat (api.farme.ro).
 * Acest client face request-uri HTTP către backend-ul extern.
 * Nu există cod backend în acest repo.
 */

// Get API base URL - standardize on NEXT_PUBLIC_API_URL
// In production: https://api.farme.ro
// In development: http://localhost:3001 (local backend) or https://api.farme.ro (remote)
// IMPORTANT: Backend-ul este într-un repo separat (api.farme.ro)
// Note: Default port is 3001 to match common local development setup
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

// Log in development for debugging
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line no-console
  console.debug('[API Client] Using API_BASE_URL:', API_BASE_URL)
}

export class ApiError extends Error {
  status?: number
  data?: unknown
  isExpected?: boolean // Flag to indicate if this is an expected error (e.g., 404 for role checks)

  constructor(message: string, status?: number, data?: unknown, isExpected?: boolean) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
    this.isExpected = isExpected
  }
}

/**
 * Check if an error is "expected" and shouldn't be logged to console
 * Expected errors include:
 * - 404 for role check endpoints (auth/client/me, auth/producer/me, etc.)
 * - 401 for unauthenticated requests
 * - Network errors when local backend isn't running
 */
function isExpectedError(path: string, status?: number, error?: unknown): boolean {
  // 404 on role check endpoints is expected when user doesn't have that role
  const roleCheckPatterns = [
    '/auth/client/me',
    '/auth/producer/me',
    '/auth/investor/me',
    '/auth/logistics/me',
    '/auth/importer/me',
    '/auth/business/me',
  ]
  
  if (status === 404 && roleCheckPatterns.some(pattern => path.includes(pattern))) {
    return true
  }
  
  // 401 means not authenticated - expected for unauthenticated users
  if (status === 401) {
    return true
  }
  
  // Network errors (status 0) when local backend isn't running
  if (status === 0) {
    return true
  }
  
  // Rate limiting (429) - expected in development
  if (status === 429) {
    return true
  }
  
  return false
}

/**
 * Fetch data from the external API
 * 
 * @param path - API path (e.g., '/products' or '/producers')
 * @param init - Optional fetch init options
 * @returns Promise with the response data
 * @throws ApiError if the request fails
 */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const url = `${API_BASE_URL}${normalizedPath}`

  // Build headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init?.headers || {}),
  }

  try {
    // Make request
    // Always include credentials for authenticated requests
    const response = await fetch(url, {
      ...init,
      headers,
      credentials: init?.credentials ?? 'include',
    })

    // Handle errors
    if (!response.ok) {
      let data: unknown
      try {
        data = await response.json()
      } catch {
        // If response is not JSON, try to get text
        try {
          data = await response.text()
        } catch {
          data = null
        }
      }

      const isExpected = isExpectedError(normalizedPath, response.status)
      const error = new ApiError(
        `API error: ${response.status} ${response.statusText}`,
        response.status,
        data,
        isExpected
      )

      // Only log unexpected errors in development
      if (!isExpected && process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.warn(`[apiFetch] Unexpected error for ${normalizedPath}:`, response.status, response.statusText)
        // Log detailed error data if available
        if (data && typeof data === 'object') {
          // eslint-disable-next-line no-console
          console.warn('[apiFetch] Error details:', data)
        }
      }

      throw error
    }

    // Handle empty responses (204 No Content)
    if (response.status === 204) {
      return null as T
    }

    // Parse JSON response
    try {
      return await response.json() as T
    } catch (error) {
      // If response is not JSON, return empty object
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('[apiFetch] Response is not JSON, returning empty object')
      }
      return {} as T
    }
  } catch (fetchError: unknown) {
    // Handle CSP violations and network errors
    if (fetchError instanceof TypeError && (fetchError.message.includes('Failed to fetch') || fetchError.message.includes('violates'))) {
      const isExpected = isExpectedError(normalizedPath, 0, fetchError)
      const error = new ApiError(
        'Network error: Request blocked by browser security policy',
        0,
        fetchError,
        isExpected
      )
      
      // Only log unexpected network errors
      if (!isExpected && process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.warn(`[apiFetch] Network error for ${normalizedPath}:`, fetchError)
      }
      
      throw error
    }
    
    // Re-throw ApiError as-is
    if (fetchError instanceof ApiError) {
      throw fetchError
    }
    
    // Wrap other errors
    const errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown error'
    const isExpected = isExpectedError(normalizedPath, 0, fetchError)
    const error = new ApiError(
      errorMessage,
      0,
      fetchError,
      isExpected
    )
    
    // Only log unexpected errors
    if (!isExpected && process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn(`[apiFetch] Unexpected error for ${normalizedPath}:`, errorMessage)
    }
    
    throw error
  }
}

