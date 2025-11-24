/**
 * TypeScript types pentru API public
 * 
 * Tipuri pentru endpoint-urile publice ale backend-ului
 */

/**
 * Product Summary - pentru liste de produse
 */
export interface ProductSummary {
  id: string
  slug: string
  name: string
  price: number
  unit: string
  producerName: string
  producerSlug: string
  regionName?: string
  regionId?: string
  isTraditional: boolean
  isBio: boolean
  imageUrl?: string
  stock: number
  status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED'
}

/**
 * Product Detail - pentru pagina de detalii produs
 */
export interface ProductDetail extends ProductSummary {
  description?: string
  producerId: string
  producerDescription?: string
  categoryId?: string
  categoryName?: string
  images?: string[]
  createdAt: string
  updatedAt: string
}

/**
 * Producer Summary - pentru liste de producători
 */
export interface ProducerSummary {
  id: string
  slug: string
  name: string
  description?: string
  regionName?: string
  regionId?: string
  avatarUrl?: string
  tags?: string[]
  productCount?: number
  status: 'PENDING_VERIFICATION' | 'APPROVED' | 'REJECTED'
}

/**
 * Producer Detail - pentru pagina de detalii producător
 */
export interface ProducerDetail extends ProducerSummary {
  registrationNumber: string
  type: 'COMPANY' | 'PFA'
  mainRegionId?: string
  products?: ProductSummary[]
  createdAt: string
  updatedAt: string
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  data: T
  message?: string
}

/**
 * Paginated API Response
 */
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

