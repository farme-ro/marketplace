/**
 * Cart API
 * 
 * API functions for shopping cart management
 * Uses apiFetch to call https://api.farme.ro
 */

import { apiFetch, ApiError } from './client'
import { isBackendSyncEnabled } from '@/lib/backend-sync/status'

// ============================================================================
// Types
// ============================================================================

export type CartItemInput = {
  productId: string
  quantity: number
  // Optional: variant, notes, etc. if backend supports
  variantId?: string
  notes?: string
}

export type CartItem = {
  id: string
  productId: string
  quantity: number
  price: number
  total: number
  product: {
    id: string
    name: string
    slug: string
    imageUrl?: string
    producerName?: string
    producerId?: string
    unit?: string
  }
}

export type Cart = {
  id: string
  items: CartItem[]
  subtotal: number
  shippingCost: number
  total: number
  currency: string
  // Optional: metadata
  createdAt?: string
  updatedAt?: string
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get current cart
 * 
 * @returns Cart data
 * @throws ApiError if request fails
 */
export async function getCart(): Promise<Cart> {
  if (!isBackendSyncEnabled('cart')) {
    // Return empty cart if feature is not enabled
    return {
      id: '',
      items: [],
      subtotal: 0,
      shippingCost: 0,
      total: 0,
      currency: 'RON',
    }
  }

  try {
    const response = await apiFetch<Cart | { cart: Cart }>('/cart', {
      method: 'GET',
      credentials: 'include',
    })
    
    // Backend returns { cart: Cart }, extract it
    if (response && typeof response === 'object' && 'cart' in response) {
      return (response as { cart: Cart }).cart
    }
    
    return response as Cart
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      // Cart doesn't exist yet - return empty cart
      return {
        id: '',
        items: [],
        subtotal: 0,
        shippingCost: 0,
        total: 0,
        currency: 'RON',
      }
    }
    throw error
  }
}

/**
 * Add item to cart
 * 
 * @param item - Item to add
 * @returns Updated cart
 * @throws ApiError if request fails
 */
export async function addToCart(item: CartItemInput): Promise<Cart> {
  if (!isBackendSyncEnabled('cart')) {
    throw new Error('Funcționalitatea de coș nu este disponibilă încă.')
  }

  try {
    const response = await apiFetch<Cart | { item: unknown; cart?: Cart }>('/cart/items', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(item),
    })
    
    // Backend returns { item: ... }, need to fetch cart again
    // Or if it returns { cart: Cart }, extract it
    if (response && typeof response === 'object' && 'cart' in response) {
      return (response as { cart: Cart }).cart
    }
    
    // If backend returns just item, fetch cart
    return getCart()
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 400) {
        throw new Error('Date invalide. Verifică că produsul există și cantitatea este corectă.')
      }
      if (error.status === 404) {
        throw new Error('Produsul nu a fost găsit.')
      }
      throw new Error(error.message || 'Eroare la adăugarea produsului în coș.')
    }
    throw error
  }
}

/**
 * Update cart item quantity
 * 
 * @param itemId - Cart item ID
 * @param quantity - New quantity
 * @returns Updated cart
 * @throws ApiError if request fails
 */
export async function updateCartItem(itemId: string, quantity: number): Promise<Cart> {
  if (!isBackendSyncEnabled('cart')) {
    throw new Error('Funcționalitatea de coș nu este disponibilă încă.')
  }

  try {
    if (quantity <= 0) {
      // If quantity is 0 or less, remove item instead
      return removeCartItem(itemId)
    }
    
    const response = await apiFetch<Cart | { item: unknown; cart?: Cart }>(`/cart/items/${itemId}`, {
      method: 'PATCH',
      credentials: 'include',
      body: JSON.stringify({ quantity }),
    })
    
    // Backend returns { item: ... }, need to fetch cart again
    // Or if it returns { cart: Cart }, extract it
    if (response && typeof response === 'object' && 'cart' in response) {
      return (response as { cart: Cart }).cart
    }
    
    // If backend returns just item, fetch cart
    return getCart()
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        throw new Error('Produsul nu a fost găsit în coș.')
      }
      throw new Error(error.message || 'Eroare la actualizarea produsului.')
    }
    throw error
  }
}

/**
 * Remove item from cart
 * 
 * @param itemId - Cart item ID
 * @returns Updated cart
 * @throws ApiError if request fails
 */
export async function removeCartItem(itemId: string): Promise<Cart> {
  if (!isBackendSyncEnabled('cart')) {
    throw new Error('Funcționalitatea de coș nu este disponibilă încă.')
  }

  try {
    const response = await apiFetch<Cart | { cart?: Cart }>(`/cart/items/${itemId}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    
    // Backend returns 204 No Content, need to fetch cart again
    // Or if it returns { cart: Cart }, extract it
    if (response && typeof response === 'object' && 'cart' in response) {
      return (response as { cart: Cart }).cart
    }
    
    // Fetch updated cart
    return getCart()
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        // Item already removed - return current cart
        return getCart()
      }
      throw new Error(error.message || 'Eroare la ștergerea produsului.')
    }
    throw error
  }
}

/**
 * Clear cart
 * 
 * @returns Empty cart
 * @throws ApiError if request fails
 */
export async function clearCart(): Promise<Cart> {
  if (!isBackendSyncEnabled('cart')) {
    // Return empty cart if feature is not enabled
    return {
      id: '',
      items: [],
      subtotal: 0,
      shippingCost: 0,
      total: 0,
      currency: 'RON',
    }
  }

  try {
    const response = await apiFetch<Cart | { cart?: Cart }>('/cart', {
      method: 'DELETE',
      credentials: 'include',
    })
    
    // Backend returns 204 No Content, return empty cart
    // Or if it returns { cart: Cart }, extract it
    if (response && typeof response === 'object' && 'cart' in response) {
      return (response as { cart: Cart }).cart
    }
    
    // Return empty cart
    return {
      id: '',
      items: [],
      subtotal: 0,
      shippingCost: 0,
      total: 0,
      currency: 'RON',
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message || 'Eroare la golirea coșului.')
    }
    throw error
  }
}

