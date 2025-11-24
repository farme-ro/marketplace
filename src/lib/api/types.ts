/**
 * Type definitions for Farmero Admin API
 */

// Backend role types (as returned from API)
export type BackendAdminRole = 'ADMIN' | 'SUPPORT' | 'OPS' | 'MARKETING' | 'READONLY' | 'PRODUCER' | 'CUSTOMER'

export interface AdminUser {
  id: string
  email: string
  fullName: string
  role: BackendAdminRole // Backend role format
  createdAt?: string
  updatedAt?: string
  // Optional: permissions array if backend provides it
  permissions?: string[]
}

export interface AdminMe extends AdminUser {
  // Additional fields for current admin user
}

export interface ProducerSummary {
  id: string
  name: string
  region?: string
  status: 'PENDING_VERIFICATION' | 'APPROVED' | 'REJECTED'
  plan?: string
  createdAt: string
  user?: {
    id: string
    email: string
    fullName: string
  }
  mainRegion?: {
    id: string
    name: string
  }
}

export interface UserSummary {
  id: string
  email: string
  fullName: string
  role: 'ADMIN' | 'PRODUCER' | 'CUSTOMER'
  createdAt: string
  producer?: {
    id: string
    name: string
    status: string
  }
}

export interface OrderSummary {
  id: string
  customerId: string
  customer?: {
    id: string
    email: string
    fullName: string
  }
  status: string
  paymentStatus: string
  paymentMethod?: string
  totalAmount: string
  commissionAmount?: string // Total commission for this order
  createdAt: string
  vendors?: Array<{
    producer: {
      id: string
      name: string
    }
  }>
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationMeta
}

