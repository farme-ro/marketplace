/**
 * API Configuration
 * 
 * Centralized configuration for API base URL
 * Ensures all API calls use the correct URL based on environment
 */

/**
 * Get the API base URL
 * 
 * In production, this should be set via NEXT_PUBLIC_API_URL environment variable
 * Falls back to localhost only in development
 * 
 * @returns API base URL
 */
export function getApiBaseUrl(): string {
  // Check if we're in browser or server
  const isBrowser = typeof window !== 'undefined'
  
  // Get API URL from environment
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL
  
  // In production, we should always have NEXT_PUBLIC_API_URL set
  if (process.env.NODE_ENV === 'production') {
    if (!apiUrl) {
      // eslint-disable-next-line no-console
      console.error(
        '[API Config] NEXT_PUBLIC_API_URL is not set in production! ' +
        'This will cause API calls to fail. Please set it in your environment variables.'
      )
    }
    // In production, don't fallback to localhost
    return apiUrl || 'https://api.farme.ro'
  }
  
  // Development: prefer api.farme.ro if available, otherwise localhost
  // This allows testing against production backend even in development
  if (apiUrl) {
    return apiUrl
  }
  
  // Default fallback for development
  return 'https://api.farme.ro'
}

/**
 * Get the API base URL for display purposes (e.g., status page)
 * 
 * @returns API base URL string for display
 */
export function getApiBaseUrlForDisplay(): string {
  const url = getApiBaseUrl()
  // In production, always show the actual URL (don't show localhost)
  if (process.env.NODE_ENV === 'production') {
    return url
  }
  // In development, show what's configured or fallback
  return url
}

