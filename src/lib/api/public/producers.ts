import { apiFetch, ApiError } from '../client'
import type { PaginatedResponse, ProducerSummary as ProducerSummaryType } from '@/types/public'
import type { Producer } from '@/lib/types/domain'

/**
 * Mapper function: Transformă răspunsul API în tipul domain Producer
 * 
 * Acest mapper face aplicația rezistentă la schimbări viitoare ale backend-ului
 * prin normalizarea tuturor variantelor posibile de câmpuri API.
 */
export function mapApiProducerToProducer(api: Record<string, unknown>): Producer {
  return {
    id: String(api.id || ''),
    slug: String(api.slug || ''),
    name: String(api.name ?? ''),
    description: api.description ? String(api.description) : undefined,
    logoUrl: api.logo_url ? String(api.logo_url) : api.logoUrl ? String(api.logoUrl) : api.avatarUrl ? String(api.avatarUrl) : api.avatar_url ? String(api.avatar_url) : null,
    coverImageUrl: api.cover_image_url ? String(api.cover_image_url) : api.coverImageUrl ? String(api.coverImageUrl) : api.imageUrl ? String(api.imageUrl) : api.image_url ? String(api.image_url) : null,
    location: api.location ? String(api.location) : undefined,
    regionId: api.region_id ? String(api.region_id) : api.regionId ? String(api.regionId) : undefined,
    regionName: api.region_name ? String(api.region_name) : api.regionName ? String(api.regionName) : undefined,
    rating: api.rating !== undefined ? Number(api.rating) : undefined,
    totalOrders: api.total_orders !== undefined ? Number(api.total_orders) : api.totalOrders !== undefined ? Number(api.totalOrders) : undefined,
    productCount: api.product_count !== undefined ? Number(api.product_count) : api.productCount !== undefined ? Number(api.productCount) : undefined,
    isVerified: api.is_verified !== undefined ? Boolean(api.is_verified) : api.isVerified !== undefined ? Boolean(api.isVerified) : undefined,
    tags: Array.isArray(api.tags) ? api.tags.map(tag => String(tag)) : undefined,
    partnerSince: api.partner_since ? String(api.partner_since) : api.partnerSince ? String(api.partnerSince) : undefined,
    registrationNumber: api.registration_number ? String(api.registration_number) : api.registrationNumber ? String(api.registrationNumber) : undefined,
    type: api.type ? String(api.type) as 'COMPANY' | 'PFA' : undefined,
    status: api.status ? String(api.status) as Producer['status'] : undefined,
    createdAt: api.created_at ? String(api.created_at) : api.createdAt ? String(api.createdAt) : undefined,
    updatedAt: api.updated_at ? String(api.updated_at) : api.updatedAt ? String(api.updatedAt) : undefined,
  }
}

export interface ProducerSummary extends Omit<ProducerSummaryType, 'status'> {
  description?: string | null
  avatarUrl?: string | null
  imageUrl?: string | null
  regionName?: string | null
  region?: {
    id: string
    name: string
  } | null
  productCount?: number
  isVerified?: boolean
  tags?: string[]
  partnerSince?: string
  status?: 'PENDING_VERIFICATION' | 'APPROVED' | 'REJECTED'
}

export interface GetProducersParams {
  page?: number
  pageSize?: number
  limit?: number
  q?: string
  search?: string
  regionId?: string
}

/**
 * Obține lista de producători cu filtre și paginare
 * 
 * @param params - Parametrii pentru filtrare și paginare
 * @returns Lista de producători
 * @throws ApiError dacă apare o eroare
 */
export async function fetchPublicProducers(params?: {
  regionId?: string
  search?: string
  q?: string
  page?: number
  pageSize?: number
  limit?: number
}): Promise<Producer[]> {
  try {
    const query = new URLSearchParams()
    
    if (params?.regionId) query.set('regionId', params.regionId)
    if (params?.search) query.set('search', params.search)
    if (params?.q) query.set('q', params.q)
    if (params?.page) query.set('page', params.page.toString())
    
    // Support both pageSize and limit
    const limit = params?.pageSize || params?.limit || 12
    query.set('limit', limit.toString())
    
    const qs = query.toString()
    const path = qs ? `/producers?${qs}` : '/producers'
    
    const response = await apiFetch<PaginatedResponse<Record<string, unknown>> | Record<string, unknown>[]>(path)
    
    // Handle paginated response
    if (response && 'data' in response && Array.isArray(response.data)) {
      return response.data.map(mapApiProducerToProducer)
    }
    
    // Handle direct array response
    if (Array.isArray(response)) {
      return response.map(mapApiProducerToProducer)
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
        console.error('[fetchPublicProducers] Network/CSP error, returning empty array:', error)
      }
      return []
    }
    
    // Re-throw other errors
    throw error
  }
}

/**
 * Obține lista de producători cu filtre și paginare (compatibilitate cu codul existent)
 * 
 * @deprecated Use fetchPublicProducers instead
 * @deprecated – unused, kept temporarily for compatibility
 */
export async function getProducers(params: GetProducersParams = {}): Promise<PaginatedResponse<Producer>> {
  try {
    const producers = await fetchPublicProducers({
      regionId: params.regionId,
      search: params.search || params.q,
      page: params.page,
      pageSize: params.pageSize || params.limit,
    })
    
    const limit = params.pageSize || params.limit || 12
    const page = params.page || 1
    
    return {
      data: producers,
      pagination: {
        page: page,
        limit: limit,
        total: producers.length,
        totalPages: Math.ceil(producers.length / limit),
      },
    }
  } catch (error) {
    // Pentru erori de rețea sau backend indisponibil, returnează rezultat gol
    if (error instanceof ApiError && (error.status === 0 || error.status === 404)) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('[getProducers] Backend unavailable, returning empty result:', error)
      }
      const limit = params.pageSize || params.limit || 12
      const page = params.page || 1
      return {
        data: [],
        pagination: {
          page: page,
          limit: limit,
          total: 0,
          totalPages: 0,
        },
      }
    }
    throw error
  }
}

/**
 * Obține detaliile unui producător după slug
 * 
 * @param slug - Slug-ul producătorului
 * @returns Detaliile producătorului sau null dacă nu există
 */
export async function fetchPublicProducerBySlug(slug: string): Promise<Producer | null> {
  try {
    const apiResponse = await apiFetch<Record<string, unknown>>(`/producers/${encodeURIComponent(slug)}`)
    return mapApiProducerToProducer(apiResponse)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null
    }
    throw error
  }
}

/**
 * Get producer details by slug (compatibilitate cu codul existent)
 * 
 * @deprecated Use fetchPublicProducerBySlug instead
 * @deprecated – unused, kept temporarily for compatibility
 */
export async function getProducerBySlug(slug: string): Promise<ProducerSummary | null> {
  return fetchPublicProducerBySlug(slug)
}

/**
 * Obține lista de produse pentru un producător specific
 * 
 * @param slug - Slug-ul producătorului
 * @returns Lista de produse ale producătorului
 */
export async function fetchPublicProductsForProducer(slug: string): Promise<import('@/lib/types/domain').Product[]> {
  try {
    const response = await apiFetch<Record<string, unknown>[] | PaginatedResponse<Record<string, unknown>>>(`/producers/${encodeURIComponent(slug)}/products`)
    
    // Import mapper function
    const { mapApiProductToProduct } = await import('./products')
    
    // Handle array response
    if (Array.isArray(response)) {
      return response.map(mapApiProductToProduct)
    }
    
    // Handle paginated response
    if (response && 'data' in response && Array.isArray(response.data)) {
      return response.data.map(mapApiProductToProduct)
    }
    
    return []
  } catch (error) {
    // Handle 404 gracefully (producer might not have products yet)
    if (error instanceof ApiError && error.status === 404) {
      return []
    }
    throw error
  }
}

