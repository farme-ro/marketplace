/**
 * API Types
 * 
 * Type definitions for API responses and errors
 */

export interface ApiError {
  status: number
  message: string
  details?: Record<string, unknown>
}

export interface ApiResponse<T = unknown> {
  data: T | null
  error: ApiError | null
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  headers?: Record<string, string>
  body?: unknown
  timeout?: number
  credentials?: RequestCredentials
}

