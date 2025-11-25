/**
 * API Client for Farmero Admin
 * 
 * Wrapper over fetch for making requests to api.farme.ro
 * Handles authentication, error handling, and response parsing
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

  constructor(message: string, status?: number, data?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

/**
 * Fetch data from the API
 * 
 * @param path - API path (e.g., '/auth/login' or '/admin/users')
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
    ...init?.headers,
  }

  // Build request options
  const options: RequestInit = {
    ...init,
    headers,
    credentials: 'include', // Important for cookie-based auth
  }

  try {
    const response = await fetch(url, options)

    // Handle 401 - Unauthorized (redirect to login)
    if (response.status === 401) {
      // Clear any stored auth state
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      throw new ApiError('Neautorizat', 401)
    }

    // Handle 403 - Forbidden
    if (response.status === 403) {
      throw new ApiError('Acces interzis', 403)
    }

    // Handle 404 - Not Found
    if (response.status === 404) {
      throw new ApiError('Resursă negăsită', 404)
    }

    // Handle 500+ - Server Error
    if (response.status >= 500) {
      // Try to extract detailed error message from backend response
      let errorMessage = 'Eroare server'
      try {
        const errorData = await response.clone().json()
        if (errorData && typeof errorData === 'object') {
          if (errorData.message) {
            errorMessage = errorData.message
          } else if (errorData.error && typeof errorData.error === 'string') {
            errorMessage = errorData.error
          }
        }
      } catch {
        // If response is not JSON, use default message
      }
      
      // Log detailed error in development
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.warn(`[apiFetch] Server error for ${normalizedPath}:`, response.status, errorMessage)
      }
      
      throw new ApiError(errorMessage, response.status)
    }

    // Parse response
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json()

      // Check for error in response body
      if (!response.ok) {
        const errorMessage = data.error || data.message || 'Eroare necunoscută'
        
        // Log detailed error in development
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.warn(`[apiFetch] Error for ${normalizedPath}:`, response.status, errorMessage)
          if (data && typeof data === 'object') {
            // eslint-disable-next-line no-console
            console.warn('[apiFetch] Error details:', data)
          }
        }
        
        throw new ApiError(
          errorMessage,
          response.status,
          data
        )
      }

      return data as T
    }

    // Handle non-JSON responses
    if (!response.ok) {
      throw new ApiError('Eroare la cerere', response.status)
    }

    const text = await response.text()
    return (text ? JSON.parse(text) : {}) as T
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    // Network or other errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Eroare de rețea',
      0
    )
  }
}

