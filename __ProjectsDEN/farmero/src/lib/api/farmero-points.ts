/**
 * Farmero Points API
 * 
 * API functions for managing Farmero Points (loyalty & trust score)
 * Uses apiFetch to call https://api.farme.ro (external backend API)
 * 
 * IMPORTANT: Backend-ul este într-un repo separat (api.farme.ro).
 * Aceste funcții sunt doar API contracts și fallback-uri pentru frontend.
 * 
 * Note: Backend endpoints need to be implemented in the separate backend repository:
 * - GET /farmero-points/me - Get current client's points
 * - GET /farmero-points/transactions - Get points transaction history
 * 
 * FALLBACK: If farmeroPoints is disabled in BackendSyncStatus, returns default values (0 points, bronze level)
 * 
 * See: docs/FARMERO_SUBSCRIPTIONS_AND_POINTS_SPEC.md for API contract documentation
 */

import { apiFetch, ApiError } from './client'
import { isBackendSyncEnabled } from '@/lib/backend-sync/status'
import type { FarmeroPoints, PointsTransaction } from '@/lib/types/farmero-points'

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Calculate level based on points
 */
function calculateLevel(points: number): 'bronze' | 'silver' | 'gold' {
  if (points >= 500) return 'gold'
  if (points >= 200) return 'silver'
  return 'bronze'
}

/**
 * Calculate next level points threshold
 */
function getNextLevelPoints(level: 'bronze' | 'silver' | 'gold'): number {
  switch (level) {
    case 'bronze':
      return 200
    case 'silver':
      return 500
    case 'gold':
      return Infinity
  }
}

/**
 * Calculate level progress percentage
 */
function calculateLevelProgress(points: number, level: 'bronze' | 'silver' | 'gold'): number {
  const nextLevelPoints = getNextLevelPoints(level)
  if (nextLevelPoints === Infinity) return 100

  const currentLevelPoints = level === 'bronze' ? 0 : level === 'silver' ? 200 : 500
  const range = nextLevelPoints - currentLevelPoints
  const progress = points - currentLevelPoints

  return Math.min(100, Math.max(0, (progress / range) * 100))
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get current client's Farmero Points
 * 
 * @returns Client's points information
 * @throws ApiError if request fails
 * 
 * FALLBACK: Returns default values (0 points, bronze level) if backend is not enabled
 */
export async function getFarmeroPoints(): Promise<FarmeroPoints> {
  if (!isBackendSyncEnabled('farmeroPoints')) {
    return {
      clientId: '',
      points: 0,
      level: 'bronze',
      lastUpdated: new Date().toISOString(),
      nextLevelPoints: 200,
      levelProgress: 0,
    }
  }

  try {
    const response = await apiFetch<FarmeroPoints | { data: FarmeroPoints }>(
      '/farmero-points/me',
      {
        method: 'GET',
        credentials: 'include',
      }
    )

    const pointsData = 'data' in response ? response.data : response

    // Ensure level is calculated correctly
    const level = calculateLevel(pointsData.points)
    const nextLevelPoints = getNextLevelPoints(level)
    const levelProgress = calculateLevelProgress(pointsData.points, level)

    return {
      ...pointsData,
      level,
      nextLevelPoints,
      levelProgress,
    }
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a vedea punctele Farmero.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a accesa punctele Farmero.')
      }
      if (error.status === 404) {
        // Client doesn't have points yet, return default
        return {
          clientId: '',
          points: 0,
          level: 'bronze',
          lastUpdated: new Date().toISOString(),
          nextLevelPoints: 200,
          levelProgress: 0,
        }
      }
      throw error
    }
    throw error
  }
}

/**
 * Get points transaction history
 * 
 * @param limit - Optional limit for number of transactions
 * @returns List of points transactions
 * @throws ApiError if request fails
 * 
 * FALLBACK: Returns empty array if backend is not enabled
 */
export async function getFarmeroPointsTransactions(
  limit?: number
): Promise<PointsTransaction[]> {
  if (!isBackendSyncEnabled('farmeroPoints')) {
    return []
  }

  try {
    const params = new URLSearchParams()
    if (limit) {
      params.append('limit', limit.toString())
    }

    const url = `/farmero-points/transactions${params.toString() ? `?${params.toString()}` : ''}`
    const response = await apiFetch<
      PointsTransaction[] | { data: PointsTransaction[] }
    >(url, {
      method: 'GET',
      credentials: 'include',
    })

    if (Array.isArray(response)) {
      return response
    }
    if (response && 'data' in response && Array.isArray(response.data)) {
      return response.data
    }
    return []
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a vedea istoricul de puncte.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a accesa istoricul de puncte.')
      }
      throw error
    }
    throw error
  }
}

