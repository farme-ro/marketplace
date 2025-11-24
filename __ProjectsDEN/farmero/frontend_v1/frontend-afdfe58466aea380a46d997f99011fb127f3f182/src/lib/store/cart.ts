/**
 * Cart Store
 * 
 * Zustand store pentru gestionarea coșului de cumpărături
 * Integrat cu API backend pentru user autentificat
 * Folosește localStorage pentru guest users
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import * as cartApi from '@/lib/api/cart'
import type { Cart, CartItemInput } from '@/lib/api/cart'

// ============================================================================
// Types
// ============================================================================

export interface CartItem {
  productId: string
  name: string
  producerId: string
  producerName: string
  price: number
  quantity: number
  image?: string | null
  unit: string
  slug: string
  // For API sync
  cartItemId?: string // ID from backend cart item
}

interface CartStore {
  // State
  items: CartItem[]
  status: 'idle' | 'loading' | 'submitting' | 'error'
  error: string | null
  isSynced: boolean // Whether cart is synced with backend
  
  // Actions
  loadCart: () => Promise<void>
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  clear: () => Promise<void>
  
  // Internal: sync with backend
  syncWithBackend: () => Promise<void>
}

// ============================================================================
// Helpers
// ============================================================================

const calculateTotal = (items: CartItem[]) => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

const calculateItemCount = (items: CartItem[]) => {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}

// Convert API CartItem to store CartItem
function apiItemToStoreItem(apiItem: cartApi.CartItem): CartItem {
  return {
    productId: apiItem.productId,
    name: apiItem.product.name,
    producerId: apiItem.product.producerId || '',
    producerName: apiItem.product.producerName || '',
    price: apiItem.price,
    quantity: apiItem.quantity,
    image: apiItem.product.imageUrl || null,
    unit: apiItem.product.unit || 'buc',
    slug: apiItem.product.slug,
    cartItemId: apiItem.id,
  }
}

// Convert store CartItem to API CartItemInput
function storeItemToApiInput(item: CartItem): CartItemInput {
  return {
    productId: item.productId,
    quantity: item.quantity,
  }
}

// ============================================================================
// Store
// ============================================================================

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      status: 'idle',
      error: null,
      isSynced: false,

      /**
       * Load cart from backend (if authenticated) or localStorage
       */
      loadCart: async () => {
        set({ status: 'loading', error: null })
        
        try {
          // Try to load from backend first
          const cart = await cartApi.getCart()
          
          if (cart && cart.items.length > 0) {
            // Convert API items to store items
            const storeItems = cart.items.map(apiItemToStoreItem)
            set({
              items: storeItems,
              status: 'idle',
              isSynced: true,
              error: null,
            })
          } else {
            // Backend cart is empty - keep local items if any
            set({ status: 'idle', isSynced: true })
          }
        } catch (error) {
          // If backend fails (e.g., not authenticated), use local storage
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.error('[Cart] Failed to load from backend, using local storage:', error)
          }
          set({ status: 'idle', isSynced: false })
        }
      },

      /**
       * Add item to cart
       * Tries backend first, falls back to local storage
       */
      addItem: async (item) => {
        const currentItems = get().items
        const existingItem = currentItems.find(i => i.productId === item.productId)
        
        set({ status: 'submitting', error: null })

        try {
          // Try backend first
          if (get().isSynced || get().status === 'idle') {
            const quantity = existingItem
              ? existingItem.quantity + (item.quantity || 1)
              : (item.quantity || 1)
            
            const cart = await cartApi.addToCart({
              productId: item.productId,
              quantity: existingItem ? quantity : (item.quantity || 1),
            })
            
            // Update with backend response
            const storeItems = cart.items.map(apiItemToStoreItem)
            set({
              items: storeItems,
              status: 'idle',
              isSynced: true,
              error: null,
            })
            return
          }
        } catch (error) {
          // Backend failed - use local storage
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.error('[Cart] Backend add failed, using local storage:', error)
          }
        }

        // Fallback to local storage
        if (existingItem) {
          const updatedItems = currentItems.map(i =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + (item.quantity || 1) }
              : i
          )
          set({
            items: updatedItems,
            status: 'idle',
            isSynced: false,
            error: null,
          })
        } else {
          set({
            items: [...currentItems, { ...item, quantity: item.quantity || 1 }],
            status: 'idle',
            isSynced: false,
            error: null,
          })
        }
      },

      /**
       * Update item quantity
       */
      updateQuantity: async (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        set({ status: 'submitting', error: null })

        try {
          // Try backend first
          const item = get().items.find(i => i.productId === productId)
          if (item?.cartItemId && get().isSynced) {
            const cart = await cartApi.updateCartItem(item.cartItemId, quantity)
            const storeItems = cart.items.map(apiItemToStoreItem)
            set({
              items: storeItems,
              status: 'idle',
              isSynced: true,
              error: null,
            })
            return
          }
        } catch (error) {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.error('[Cart] Backend update failed, using local storage:', error)
          }
        }

        // Fallback to local storage
        set({
          items: get().items.map(i =>
            i.productId === productId ? { ...i, quantity } : i
          ),
          status: 'idle',
          isSynced: false,
          error: null,
        })
      },

      /**
       * Remove item from cart
       */
      removeItem: async (productId: string) => {
        set({ status: 'submitting', error: null })

        try {
          // Try backend first
          const item = get().items.find(i => i.productId === productId)
          if (item?.cartItemId && get().isSynced) {
            const cart = await cartApi.removeCartItem(item.cartItemId)
            const storeItems = cart.items.map(apiItemToStoreItem)
            set({
              items: storeItems,
              status: 'idle',
              isSynced: true,
              error: null,
            })
            return
          }
        } catch (error) {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.error('[Cart] Backend remove failed, using local storage:', error)
          }
        }

        // Fallback to local storage
        set({
          items: get().items.filter(i => i.productId !== productId),
          status: 'idle',
          isSynced: false,
          error: null,
        })
      },

      /**
       * Clear cart
       */
      clear: async () => {
        set({ status: 'submitting', error: null })

        try {
          // Try backend first
          if (get().isSynced) {
            await cartApi.clearCart()
          }
        } catch (error) {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.error('[Cart] Backend clear failed, using local storage:', error)
          }
        }

        // Always clear local
        set({
          items: [],
          status: 'idle',
          isSynced: false,
          error: null,
        })
      },

      /**
       * Sync local cart with backend
       * Called after login to merge guest cart with user cart
       * 
       * Strategy: If backend sync is enabled, merge local items with backend cart.
       * For items with same productId, use maximum quantity (local + backend).
       * If backend sync is disabled, keep local items as-is.
       */
      syncWithBackend: async () => {
        const localItems = get().items
        
        // Check if backend sync is enabled
        const { isBackendSyncEnabled } = await import('@/lib/backend-sync/status')
        if (!isBackendSyncEnabled('cart')) {
          // Backend sync disabled - keep local items, mark as not synced
          set({ isSynced: false, status: 'idle' })
          return
        }
        
        if (localItems.length === 0) {
          // No local items - just load from backend
          await get().loadCart()
          return
        }

        set({ status: 'loading', error: null })

        try {
          // Load backend cart
          const backendCart = await cartApi.getCart()
          
          // Merge strategy: For each local item, add to backend (merge quantities)
          for (const localItem of localItems) {
            const existingBackendItem = backendCart.items.find(
              bi => bi.productId === localItem.productId
            )
            
            if (existingBackendItem) {
              // Merge: use maximum quantity (local + backend)
              const mergedQuantity = existingBackendItem.quantity + localItem.quantity
              await cartApi.updateCartItem(
                existingBackendItem.id,
                mergedQuantity
              )
            } else {
              // Add new item to backend
              await cartApi.addToCart(storeItemToApiInput(localItem))
            }
          }

          // Reload merged cart from backend
          const mergedCart = await cartApi.getCart()
          const storeItems = mergedCart.items.map(apiItemToStoreItem)
          
          set({
            items: storeItems,
            status: 'idle',
            isSynced: true,
            error: null,
          })
        } catch (error) {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.error('[Cart] Sync failed:', error)
          }
          // On sync failure, keep local items but mark as not synced
          set({
            status: 'idle',
            isSynced: false,
            error: 'Nu s-a putut sincroniza coșul cu serverul. Coșul local este păstrat.',
          })
        }
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)

// ============================================================================
// Hooks
// ============================================================================

/**
 * Convenience hook that returns the store directly
 */
export const useCart = () => {
  return useCartStore()
}

/**
 * Selector for cart total
 */
export const useCartTotal = () => {
  return useCartStore(state => calculateTotal(state.items))
}

/**
 * Selector for cart item count
 */
export const useCartItemCount = () => {
  return useCartStore(state => calculateItemCount(state.items))
}
