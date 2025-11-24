/**
 * Backend Products API
 * 
 * Direct calls to the backend API (not Next.js routes)
 * These endpoints hit the backend service which connects to Neon DB
 */

import { get } from '../apiClient'

export interface BackendProduct {
  id: string
  name: string
  description?: string
  price: number
  unit: string
  stock: number
  producerId: string
  producerName?: string
  regionId?: string
  regionName?: string
  isTraditional?: boolean
  isBio?: boolean
  status?: string
  createdAt?: string
  updatedAt?: string
}

export interface BackendProductsResponse {
  data: BackendProduct[]
  total?: number
  page?: number
  limit?: number
}

/**
 * Get products directly from backend API
 * This endpoint should hit the backend service which queries Neon DB
 * 
 * @param params - Query parameters (page, limit)
 * @returns Products from backend
 * @throws Error if request fails
 */
export async function getBackendProducts(params?: {
  page?: number
  limit?: number
}): Promise<BackendProductsResponse> {
  // Build query string
  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.append('page', String(params.page))
  if (params?.limit) queryParams.append('limit', String(params.limit))
  
  const url = `/api/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  
  const response = await get<BackendProductsResponse>(url)
  
  if (response.error) {
    throw new Error(response.error.message || 'Failed to fetch products from backend')
  }
  
  if (!response.data) {
    throw new Error('No data returned from backend')
  }
  
  return response.data
}

