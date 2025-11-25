/**
 * Producer Products API
 * 
 * API functions for producer product management
 * Uses apiFetch to call https://api.farme.ro
 */

import { apiFetch, ApiError } from '../client'
import { isBackendSyncEnabled } from '@/lib/backend-sync/status'

// ============================================================================
// Types
// ============================================================================

export type ProducerProduct = {
  id: string
  name: string
  slug?: string
  description?: string
  price: number
  unit: string
  stock?: number
  isActive: boolean
  imageUrl?: string
  categoryId?: string
  categoryName?: string
  regionId?: string
  isBio?: boolean
  isTraditional?: boolean
  createdAt?: string
  updatedAt?: string
}

export type ProducerProductInput = {
  name: string
  description?: string
  price: number
  unit: string
  stock?: number
  categoryId?: string
  regionId?: string
  imageUrl?: string
  isBio?: boolean
  isTraditional?: boolean
}

export type UpdateProductPayload = Partial<ProducerProductInput> & {
  isActive?: boolean
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get producer products
 * 
 * @returns List of producer products
 * @throws ApiError if request fails
 */
export async function getProducerProducts(): Promise<ProducerProduct[]> {
  if (!isBackendSyncEnabled('producerProducts')) {
    return [] // Return empty array if feature is not enabled
  }

  try {
    const response = await apiFetch<ProducerProduct[] | { data: ProducerProduct[] }>('/producers/products', {
      method: 'GET',
      credentials: 'include',
    })
    
    // Handle both array and paginated response
    if (Array.isArray(response)) {
      return response
    }
    if (response && 'data' in response) {
      return response.data
    }
    
    return []
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a vedea produsele.')
      }
      throw new Error(error.message || 'Eroare la încărcarea produselor.')
    }
    throw error
  }
}

/**
 * Get a single product by ID
 * 
 * @param productId - Product ID
 * @returns Product data
 * @throws ApiError if request fails
 */
export async function getProductById(productId: string): Promise<ProducerProduct> {
  if (!isBackendSyncEnabled('producerProducts')) {
    throw new Error('Funcționalitatea de produse nu este disponibilă încă.')
  }

  try {
    const product = await apiFetch<ProducerProduct>(`/producers/products/${productId}`, {
      method: 'GET',
      credentials: 'include',
    })
    
    return product
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        throw new Error('Produsul nu a fost găsit.')
      }
      if (error.status === 401 || error.status === 403) {
        throw new Error('Nu ai permisiunea de a vedea acest produs.')
      }
      throw new Error(error.message || 'Eroare la încărcarea produsului.')
    }
    throw error
  }
}

/**
 * Create a new product
 * 
 * @param input - Product data
 * @returns Created product
 * @throws ApiError if request fails
 */
export async function createProduct(input: ProducerProductInput): Promise<ProducerProduct> {
  if (!isBackendSyncEnabled('producerProducts')) {
    throw new Error('Funcționalitatea de produse nu este disponibilă încă.')
  }

  try {
    const product = await apiFetch<ProducerProduct>('/producers/products', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(input),
    })
    
    return product
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 400) {
        throw new Error('Date invalide. Verifică că toate câmpurile obligatorii sunt completate.')
      }
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a crea produse.')
      }
      throw new Error(error.message || 'Eroare la crearea produsului.')
    }
    throw error
  }
}

/**
 * Update a product
 * 
 * @param productId - Product ID
 * @param payload - Update payload
 * @returns Updated product
 * @throws ApiError if request fails
 */
export async function updateProduct(
  productId: string,
  payload: UpdateProductPayload
): Promise<ProducerProduct> {
  if (!isBackendSyncEnabled('producerProducts')) {
    throw new Error('Funcționalitatea de produse nu este disponibilă încă.')
  }

  try {
    const product = await apiFetch<ProducerProduct>(`/producers/products/${productId}`, {
      method: 'PATCH',
      credentials: 'include',
      body: JSON.stringify(payload),
    })
    
    return product
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 400) {
        throw new Error('Date invalide. Verifică că toate câmpurile sunt corecte.')
      }
      if (error.status === 404) {
        throw new Error('Produsul nu a fost găsit.')
      }
      if (error.status === 401 || error.status === 403) {
        throw new Error('Nu ai permisiunea de a actualiza acest produs.')
      }
      throw new Error(error.message || 'Eroare la actualizarea produsului.')
    }
    throw error
  }
}

/**
 * Toggle product active status
 * 
 * @param productId - Product ID
 * @param isActive - New active status
 * @returns Updated product
 */
export async function toggleProductActive(
  productId: string,
  isActive: boolean
): Promise<ProducerProduct> {
  return updateProduct(productId, { isActive })
}

/**
 * Delete a product
 * 
 * @param productId - Product ID
 * @throws ApiError if request fails
 */
export async function deleteProduct(productId: string): Promise<void> {
  if (!isBackendSyncEnabled('producerProducts')) {
    throw new Error('Funcționalitatea de produse nu este disponibilă încă.')
  }

  try {
    await apiFetch<void>(`/producers/products/${productId}`, {
      method: 'DELETE',
      credentials: 'include',
    })
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        throw new Error('Produsul nu a fost găsit.')
      }
      if (error.status === 401 || error.status === 403) {
        throw new Error('Nu ai permisiunea de a șterge acest produs.')
      }
      throw new Error(error.message || 'Eroare la ștergerea produsului.')
    }
    throw error
  }
}
