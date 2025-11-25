/**
 * Favorites Store
 * 
 * Zustand store pentru gestionarea favorite-urilor (produse și producători)
 * Integrat cu API backend pentru favorites
 * Folosește localStorage fallback când backend nu suportă
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import * as favoritesApi from '@/lib/api/favorites'
import type { FavoriteItem, FavoriteTargetType } from '@/lib/types/favorites'

// ============================================================================
// Types
// ============================================================================

interface FavoritesStore {
  // State
  favorites: FavoriteItem[]
  status: 'idle' | 'loading' | 'error'
  error: string | null
  pendingActions: Set<string> // Track pending add/remove actions (for debouncing)
  
  // Actions
  loadFavorites: () => Promise<void>
  addFavorite: (targetType: FavoriteTargetType, targetId: string) => Promise<void>
  removeFavorite: (targetType: FavoriteTargetType, targetId: string) => Promise<void>
  toggleFavorite: (targetType: FavoriteTargetType, targetId: string) => Promise<void>
  isFavorited: (targetType: FavoriteTargetType, targetId: string) => boolean
  reset: () => void
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Generate key for pending actions
 */
function getPendingActionKey(targetType: FavoriteTargetType, targetId: string): string {
  return `${targetType}:${targetId}`
}

// ============================================================================
// Store
// ============================================================================

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      status: 'idle',
      error: null,
      pendingActions: new Set(),

      /**
       * Load favorites from backend
       */
      loadFavorites: async () => {
        set({ status: 'loading', error: null })
        
        try {
          const favorites = await favoritesApi.getFavorites()
          set({
            favorites,
            status: 'idle',
            error: null,
          })
        } catch (error) {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.error('[Favorites Store] Failed to load favorites:', error)
          }
          set({
            status: 'error',
            error: error instanceof Error ? error.message : 'Eroare la încărcarea favorite-urilor',
          })
        }
      },

      /**
       * Add a favorite
       * 
       * Debounced: If action is already pending, returns early
       */
      addFavorite: async (targetType, targetId) => {
        const { pendingActions, favorites } = get()
        const actionKey = getPendingActionKey(targetType, targetId)
        
        // Check if already favorited
        if (favorites.some(f => f.targetType === targetType && f.targetId === targetId)) {
          return
        }
        
        // Check if action is pending
        if (pendingActions.has(actionKey)) {
          return
        }
        
        // Mark as pending
        set({
          pendingActions: new Set(pendingActions).add(actionKey),
        })
        
        // Optimistic update
        const optimisticFavorite: FavoriteItem = {
          id: `temp-${targetType}-${targetId}-${Date.now()}`,
          targetType,
          targetId,
          createdAt: new Date().toISOString(),
        }
        
        set({
          favorites: [...favorites, optimisticFavorite],
        })
        
        try {
          await favoritesApi.addFavorite(targetType, targetId)
          
          // Reload to get server-generated ID
          await get().loadFavorites()
        } catch (error) {
          // Rollback optimistic update
          set({
            favorites: favorites.filter(
              f => !(f.targetType === targetType && f.targetId === targetId)
            ),
          })
          
          throw error
        } finally {
          // Remove from pending
          const currentPending = get().pendingActions
          currentPending.delete(actionKey)
          set({ pendingActions: new Set(currentPending) })
        }
      },

      /**
       * Remove a favorite
       * 
       * Debounced: If action is already pending, returns early
       */
      removeFavorite: async (targetType, targetId) => {
        const { pendingActions, favorites } = get()
        const actionKey = getPendingActionKey(targetType, targetId)
        
        // Check if not favorited
        if (!favorites.some(f => f.targetType === targetType && f.targetId === targetId)) {
          return
        }
        
        // Check if action is pending
        if (pendingActions.has(actionKey)) {
          return
        }
        
        // Mark as pending
        set({
          pendingActions: new Set(pendingActions).add(actionKey),
        })
        
        // Optimistic update
        const previousFavorites = favorites
        set({
          favorites: favorites.filter(
            f => !(f.targetType === targetType && f.targetId === targetId)
          ),
        })
        
        try {
          await favoritesApi.removeFavorite(targetType, targetId)
        } catch (error) {
          // Rollback optimistic update
          set({ favorites: previousFavorites })
          throw error
        } finally {
          // Remove from pending
          const currentPending = get().pendingActions
          currentPending.delete(actionKey)
          set({ pendingActions: new Set(currentPending) })
        }
      },

      /**
       * Toggle favorite (add if not favorited, remove if favorited)
       */
      toggleFavorite: async (targetType, targetId) => {
        const { isFavorited } = get()
        if (isFavorited(targetType, targetId)) {
          await get().removeFavorite(targetType, targetId)
        } else {
          await get().addFavorite(targetType, targetId)
        }
      },

      /**
       * Check if an item is favorited
       */
      isFavorited: (targetType, targetId) => {
        const { favorites } = get()
        return favorites.some(
          f => f.targetType === targetType && f.targetId === targetId
        )
      },

      /**
       * Reset store (e.g., on logout)
       */
      reset: () => {
        set({
          favorites: [],
          status: 'idle',
          error: null,
          pendingActions: new Set(),
        })
      },
    }),
    {
      name: 'favorites-storage',
      // Only persist favorites, not status/error/pendingActions
      partialize: (state) => ({
        favorites: state.favorites,
      }),
    }
  )
)

// ============================================================================
// Selectors & Hooks
// ============================================================================

/**
 * Get all favorites
 */
export const useFavorites = (): FavoriteItem[] => {
  return useFavoritesStore((state) => state.favorites)
}

/**
 * Get product favorites only
 */
export const useProductFavorites = (): FavoriteItem[] => {
  return useFavoritesStore((state) => 
    state.favorites.filter(f => f.targetType === 'product')
  )
}

/**
 * Get producer favorites only
 */
export const useProducerFavorites = (): FavoriteItem[] => {
  return useFavoritesStore((state) => 
    state.favorites.filter(f => f.targetType === 'producer')
  )
}

/**
 * Check if item is favorited (hook)
 */
export const useIsFavorited = (
  targetType: FavoriteTargetType,
  targetId: string
): boolean => {
  return useFavoritesStore((state) => 
    state.isFavorited(targetType, targetId)
  )
}

