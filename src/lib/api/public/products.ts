/**
 * Public Products API
 * 
 * Funcții pentru apeluri către endpoint-urile publice de produse
 * Folosește apiFetch() care apelează direct https://api.farme.ro
 */

import { apiFetch, ApiError } from '../client'
import type { ProductSummary, PaginatedResponse } from '@/types/public'
import type { Product } from '@/lib/types/domain'

/**
 * Mapper function: Transformă răspunsul API în tipul domain Product
 * 
 * Acest mapper face aplicația rezistentă la schimbări viitoare ale backend-ului
 * prin normalizarea tuturor variantelor posibile de câmpuri API.
 */
export function mapApiProductToProduct(api: Record<string, unknown>): Product {
  return {
    id: String(api.id || ''),
    slug: String(api.slug || ''),
    name: String(api.name ?? api.title ?? ''),
    price: Number(api.price) || 0,
    currency: String(api.currency ?? 'RON'),
    description: api.description ? String(api.description) : undefined,
    imageUrl: api.image_url ? String(api.image_url) : api.imageUrl ? String(api.imageUrl) : null,
    category: (api.category && typeof api.category === 'object' && 'name' in api.category) ? String((api.category as { name: unknown }).name) : api.category ? String(api.category) : undefined,
    categoryId: api.category_id ? String(api.category_id) : api.categoryId ? String(api.categoryId) : undefined,
    stock: api.stock !== undefined ? (api.stock === null ? null : Number(api.stock)) : undefined,
    isActive: api.active !== undefined ? Boolean(api.active) : api.isActive !== undefined ? Boolean(api.isActive) : true,
    producerId: api.producer_id ? String(api.producer_id) : api.producerId ? String(api.producerId) : undefined,
    producerName: (api.producer && typeof api.producer === 'object' && 'name' in api.producer) ? String((api.producer as { name: unknown }).name) : api.producer_name ? String(api.producer_name) : api.producerName ? String(api.producerName) : undefined,
    producerSlug: (api.producer && typeof api.producer === 'object' && 'slug' in api.producer) ? String((api.producer as { slug: unknown }).slug) : api.producer_slug ? String(api.producer_slug) : api.producerSlug ? String(api.producerSlug) : undefined,
    unit: api.unit ? String(api.unit) : undefined,
    isBio: api.is_bio !== undefined ? Boolean(api.is_bio) : api.isBio !== undefined ? Boolean(api.isBio) : undefined,
    isTraditional: api.is_traditional !== undefined ? Boolean(api.is_traditional) : api.isTraditional !== undefined ? Boolean(api.isTraditional) : undefined,
    regionId: api.region_id ? String(api.region_id) : api.regionId ? String(api.regionId) : undefined,
    regionName: api.region_name ? String(api.region_name) : api.regionName ? String(api.regionName) : undefined,
    status: api.status ? String(api.status) as Product['status'] : undefined,
    images: Array.isArray(api.images) ? api.images.map(img => String(img)) : undefined,
    createdAt: api.created_at ? String(api.created_at) : api.createdAt ? String(api.createdAt) : undefined,
    updatedAt: api.updated_at ? String(api.updated_at) : api.updatedAt ? String(api.updatedAt) : undefined,
  }
}

// Type for product detail (extends ProductSummary with additional fields)
export interface PublicProduct extends ProductSummary {
  description?: string
  producer?: {
    id: string
    name: string
    slug: string
    region?: string
  }
}

export interface GetProductsParams {
  page?: number
  pageSize?: number
  q?: string
  regionId?: string
  categoryId?: string
  minPrice?: number
  maxPrice?: number
}

/**
 * Obține lista de produse cu filtre și paginare
 * 
 * @param params - Parametrii pentru filtrare și paginare
 * @returns Lista paginată de produse
 * @throws ApiError dacă apare o eroare
 */
export async function fetchPublicProducts(params?: {
  category?: string
  categoryId?: string
  regionId?: string
  search?: string
  q?: string
  page?: number
  pageSize?: number
  minPrice?: number
  maxPrice?: number
}): Promise<Product[]> {
  try {
    const query = new URLSearchParams()
    
    if (params?.category) query.set('category', params.category)
    if (params?.categoryId) query.set('categoryId', params.categoryId)
    if (params?.regionId) query.set('regionId', params.regionId)
    if (params?.search) query.set('search', params.search)
    if (params?.q) query.set('q', params.q)
    if (params?.page) query.set('page', params.page.toString())
    if (params?.pageSize) query.set('pageSize', params.pageSize.toString())
    if (params?.minPrice) query.set('minPrice', params.minPrice.toString())
    if (params?.maxPrice) query.set('maxPrice', params.maxPrice.toString())
    
    const qs = query.toString()
    const path = qs ? `/products?${qs}` : '/products'
    
    const response = await apiFetch<PaginatedResponse<Record<string, unknown>> | Record<string, unknown>[]>(path)
    
    // Handle paginated response
    if (response && 'data' in response && Array.isArray(response.data)) {
      return response.data.map(mapApiProductToProduct)
    }
    
    // Handle direct array response
    if (Array.isArray(response)) {
      return response.map(mapApiProductToProduct)
    }
    
    return []
  } catch (error) {
    // Handle 404 gracefully (endpoint might not exist yet)
    if (error instanceof ApiError && error.status === 404) {
      return []
    }
    
    // Handle CSP/network errors gracefully - return empty array instead of throwing
    if (error instanceof ApiError && (error.status === 0 || error.message?.includes('CSP') || error.message?.includes('violates'))) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('[fetchPublicProducts] Network/CSP error, returning empty array:', error)
      }
      return []
    }
    
    // Re-throw other errors
    throw error
  }
}

/**
 * Obține lista de produse cu filtre și paginare (compatibilitate cu codul existent)
 * 
 * @deprecated Use fetchPublicProducts instead
 * @deprecated – unused, kept temporarily for compatibility
 */
export async function getProducts(params: GetProductsParams = {}): Promise<PaginatedResponse<Product>> {
  try {
    const products = await fetchPublicProducts({
      categoryId: params.categoryId,
      regionId: params.regionId,
      search: params.q,
      page: params.page,
      pageSize: params.pageSize,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
    })
    
    return {
      data: products,
      pagination: {
        page: params.page || 1,
        limit: params.pageSize || 12,
        total: products.length,
        totalPages: Math.ceil(products.length / (params.pageSize || 12)),
      },
    }
  } catch (error) {
    // Pentru erori de rețea sau backend indisponibil, returnează rezultat gol
    if (error instanceof ApiError && (error.status === 0 || error.status === 404)) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('[getProducts] Backend unavailable, returning empty result:', error)
      }
      return {
        data: [],
        pagination: {
          page: params.page || 1,
          limit: params.pageSize || 12,
          total: 0,
          totalPages: 0,
        },
      }
    }
    throw error
  }
}

/**
 * Obține detaliile unui produs după slug
 * 
 * @param slug - Slug-ul produsului
 * @returns Detaliile produsului sau null dacă nu există
 */
export async function fetchPublicProductBySlug(slug: string): Promise<Product | null> {
  try {
    const apiResponse = await apiFetch<Record<string, unknown>>(`/products/${encodeURIComponent(slug)}`)
    return mapApiProductToProduct(apiResponse)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null
    }
    throw error
  }
}

