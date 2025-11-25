/**
 * Health Check API
 * 
 * Functions for checking backend and database health
 */

import { get } from './apiClient'

export interface HealthStatus {
  api?: 'ok' | 'error'
  db?: 'ok' | 'error'
  status?: 'ok' | 'error' // Legacy support
  database?: 'connected' | 'disconnected' // Legacy support
  timestamp?: string
  error?: string
}

/**
 * Check backend health and database connection
 * 
 * @returns Health status from backend with timing information
 * @throws Error if request fails
 */
/**
 * Check backend health and database connection
 * 
 * Tries /status endpoint first (new format), falls back to /health/db (legacy)
 * 
 * @returns Health status from backend with timing information
 */
export async function checkBackendHealth(): Promise<HealthStatus & { responseTime?: number; httpStatus?: number }> {
  const startTime = Date.now()
  
  try {
    // Try multiple health check endpoints in order of preference
    let response = await get<HealthStatus>('/status')
    
    // If /status doesn't exist, try /health
    if (response.error && response.error.status === 404) {
      response = await get<HealthStatus>('/health')
    }
    
    // If /health doesn't exist, try legacy /health/db
    if (response.error && response.error.status === 404) {
      response = await get<HealthStatus>('/health/db')
    }
    
    // If /health/db doesn't exist, try /api/health
    if (response.error && response.error.status === 404) {
      response = await get<HealthStatus>('/api/health')
    }
    
    const responseTime = Date.now() - startTime
    
    if (response.error) {
      // Determine error message based on status code
      let errorMessage = response.error.message
      
      if (response.error.status === 0) {
        errorMessage = 'Nu s-a putut conecta la server. Verifică conexiunea la internet sau că serverul rulează.'
      } else if (response.error.status === 404) {
        errorMessage = 'Endpoint-ul de status nu a fost găsit pe server. Backend-ul poate să nu aibă implementat endpoint-ul /status, /health sau /health/db.'
      } else if (response.error.status >= 500) {
        errorMessage = 'Eroare internă a serverului. Te rugăm să încerci din nou mai târziu.'
      } else if (response.error.status === 503) {
        errorMessage = 'Serviciul este temporar indisponibil. Te rugăm să încerci din nou mai târziu.'
      }
      
      // Log error for monitoring
      if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('[Health Check] Backend error:', {
          status: response.error.status,
          message: errorMessage,
          timestamp: new Date().toISOString(),
          responseTime,
        })
      }
      
      return {
        api: 'error',
        db: 'error',
        status: 'error', // Legacy
        database: 'disconnected', // Legacy
        error: errorMessage,
        responseTime,
        httpStatus: response.error.status,
        timestamp: new Date().toISOString(),
      }
    }
    
    if (!response.data) {
      return {
        api: 'error',
        db: 'error',
        status: 'error',
        database: 'disconnected',
        error: 'Nu s-au primit date de la server.',
        responseTime,
        httpStatus: 0,
        timestamp: new Date().toISOString(),
      }
    }
    
    // Normalize response format (support both new and legacy formats)
    const data = response.data
    const apiStatus = data.api || (data.status === 'ok' ? 'ok' : 'error')
    const dbStatus = data.db || (data.database === 'connected' ? 'ok' : 'error')
    
    // Backend is healthy - no need to log success in production
    
    return {
      api: apiStatus,
      db: dbStatus,
      status: apiStatus, // Legacy
      database: dbStatus === 'ok' ? 'connected' : 'disconnected', // Legacy
      timestamp: data.timestamp || new Date().toISOString(),
      responseTime,
      httpStatus: 200,
    }
  } catch (error) {
    const responseTime = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : 'Eroare necunoscută'
    
    // Log error for monitoring
    if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('[Health Check] Network error:', {
        message: errorMessage,
        timestamp: new Date().toISOString(),
        responseTime,
      })
    }
    
    return {
      api: 'error',
      db: 'error',
      status: 'error',
      database: 'disconnected',
      error: `Eroare de rețea: ${errorMessage}`,
      responseTime,
      httpStatus: 0,
      timestamp: new Date().toISOString(),
    }
  }
}

