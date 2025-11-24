/**
 * Centralized API Client Export
 * 
 * This module exports the main API client functions and helpers.
 * All backend API calls should go through this client.
 * 
 * Usage:
 *   import { request, get, post } from '@/lib/api'
 *   import { getProducts } from '@/lib/api/public/products'
 */

export { request, requestAdvanced, get, post, put, patch, del } from './apiClient'
export type { ApiResponse, ApiError, RequestOptions } from './apiTypes'

// Re-export public API functions for convenience
export * from './public/regions'

// Re-export health API
export * from './health'

// Re-export auth API
export * from './auth'

// Re-export backend API (direct backend calls)
export * from './backend/products'

// Re-export server-side API helpers
export { serverGet, serverPost, serverPut, serverPatch, serverDelete } from './server'

