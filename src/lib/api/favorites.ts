/**
 * Favorites API
 * 
 * API functions for managing favorites (products and producers)
 * Uses apiFetch to call https://api.farme.ro (external backend API)
 * 
 * IMPORTANT: Backend-ul este într-un repo separat (api.farme.ro).
 * Aceste funcții sunt doar API contracts și fallback-uri pentru frontend.
 * 
 * Note: Backend endpoints need to be implemented in the separate backend repository:
 * - GET /clients/favorites - List all favorites
 * - POST /clients/favorites - Add favorite
 * - DELETE /clients/favorites?targetType=...&targetId=... - Remove favorite
 * 
 * FALLBACK: If favorites is disabled in BackendSyncStatus, uses localStorage
 * 
 * See: docs/BACKEND_API_CONTRACT_FAVORITES_SUBSCRIPTIONS_ALERTS.md for API contract documentation
 */

import { apiFetch, ApiError } from './client'
import { isBackendSyncEnabled } from '@/lib/backend-sync/status'
import type { FavoriteItem, FavoriteTargetType } from '@/lib/types/favorites'

// ============================================================================
// Local Storage Fallback
// ============================================================================

const FAVORITES_STORAGE_KEY = 'farme-favorites'

/**
 * Get favorites from localStorage (fallback)
 */
function getLocalFavorites(): FavoriteItem[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY)
    if (!stored) return []
    return JSON.parse(stored) as FavoriteItem[]
  } catch {
    return []
  }
}

/**
 * Save favorites to localStorage (fallback)
 */
function saveLocalFavorites(favorites: FavoriteItem[]): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('[Favorites API] Failed to save to localStorage:', error)
    }
  }
}

/**
 * Add favorite to localStorage (fallback)
 */
function addLocalFavorite(targetType: FavoriteTargetType, targetId: string): FavoriteItem {
  const favorites = getLocalFavorites()
  
  // Check if already exists
  const existing = favorites.find(
    f => f.targetType === targetType && f.targetId === targetId
  )
  
  if (existing) {
    return existing
  }
  
  const newFavorite: FavoriteItem = {
    id: `local-${targetType}-${targetId}-${Date.now()}`,
    targetType,
    targetId,
    createdAt: new Date().toISOString(),
  }
  
  favorites.push(newFavorite)
  saveLocalFavorites(favorites)
  return newFavorite
}

/**
 * Remove favorite from localStorage (fallback)
 */
function removeLocalFavorite(targetType: FavoriteTargetType, targetId: string): void {
  const favorites = getLocalFavorites()
  const filtered = favorites.filter(
    f => !(f.targetType === targetType && f.targetId === targetId)
  )
  saveLocalFavorites(filtered)
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get all favorites for current user
 * 
 * @returns List of favorite items
 * @throws ApiError if request fails
 * 
 * FALLBACK: If backend doesn't support favorites, returns localStorage favorites
 */
export async function getFavorites(): Promise<FavoriteItem[]> {
  if (!isBackendSyncEnabled('favorites')) {
    return getLocalFavorites()
  }

  try {
    const response = await apiFetch<FavoriteItem[] | { data: FavoriteItem[] }>('/clients/favorites', {
      method: 'GET',
      credentials: 'include',
    })
    
    // Handle both array and paginated response
    if (Array.isArray(response)) {
      return response
    }
    if (response && 'data' in response && Array.isArray(response.data)) {
      return response.data
    }
    
    return []
  } catch (error) {
    // If endpoint doesn't exist (404), fallback to localStorage
    if (error instanceof ApiError && error.status === 404) {
      return getLocalFavorites()
    }
    
    // For other errors, log and fallback
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('[Favorites API] Failed to fetch favorites:', error)
    }
    return getLocalFavorites()
  }
}

/**
 * Add a favorite
 * 
 * @param targetType - Type of favorite ('product' or 'producer')
 * @param targetId - ID of the product or producer
 * @returns Created favorite item
 * @throws ApiError if request fails
 * 
 * FALLBACK: If backend doesn't support favorites, saves to localStorage
 */
export async function addFavorite(
  targetType: FavoriteTargetType,
  targetId: string
): Promise<FavoriteItem> {
  if (!isBackendSyncEnabled('favorites')) {
    return addLocalFavorite(targetType, targetId)
  }

  try {
    const favorite = await apiFetch<FavoriteItem>('/clients/favorites', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ targetType, targetId }),
    })
    
    return favorite
  } catch (error) {
    // If endpoint doesn't exist (404), fallback to localStorage
    if (error instanceof ApiError && error.status === 404) {
      return addLocalFavorite(targetType, targetId)
    }
    
    // For other errors, throw to be handled by caller
    if (error instanceof ApiError) {
      if (error.status === 400) {
        throw new Error('Date invalide. Verifică că tipul și ID-ul sunt corecte.')
      }
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a adăuga favorite.')
      }
      throw new Error(error.message || 'Eroare la adăugarea la favorite.')
    }
    throw error
  }
}

/**
 * Remove a favorite
 * 
 * @param targetType - Type of favorite ('product' or 'producer')
 * @param targetId - ID of the product or producer
 * @throws ApiError if request fails
 * 
 * FALLBACK: If backend doesn't support favorites, removes from localStorage
 */
export async function removeFavorite(
  targetType: FavoriteTargetType,
  targetId: string
): Promise<void> {
  if (!isBackendSyncEnabled('favorites')) {
    removeLocalFavorite(targetType, targetId)
    return
  }

  try {
    await apiFetch<void>(`/clients/favorites?targetType=${targetType}&targetId=${targetId}`, {
      method: 'DELETE',
      credentials: 'include',
    })
  } catch (error) {
    // If endpoint doesn't exist (404), fallback to localStorage
    if (error instanceof ApiError && error.status === 404) {
      removeLocalFavorite(targetType, targetId)
      return
    }
    
    // For other errors, throw to be handled by caller
    if (error instanceof ApiError) {
      if (error.status === 404) {
        // Already removed or doesn't exist - treat as success
        return
      }
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a elimina din favorite.')
      }
      throw new Error(error.message || 'Eroare la eliminarea din favorite.')
    }
    throw error
  }
}

/**
 * Check if an item is favorited
 * 
 * @param targetType - Type of favorite ('product' or 'producer')
 * @param targetId - ID of the product or producer
 * @returns True if favorited, false otherwise
 */
export async function isFavorited(
  targetType: FavoriteTargetType,
  targetId: string
): Promise<boolean> {
  const favorites = await getFavorites()
  return favorites.some(
    f => f.targetType === targetType && f.targetId === targetId
  )
}

