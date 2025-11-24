export type UserRole = 'ADMIN' | 'PRODUCER' | 'CUSTOMER'

export interface ProducerProfile {
  id: string
  name: string
  status: 'PENDING_VERIFICATION' | 'APPROVED' | 'REJECTED'
}

export interface User {
  id: string
  email: string
  fullName: string
  role: UserRole
  producer?: ProducerProfile | null
}

export interface Region {
  id: string
  name: string
  code: string
  type: 'COUNTY' | 'REGION'
}

export interface Product {
  id: string
  producerId: string
  name: string
  description?: string | null
  price: string
  stock: number
  isTraditional: boolean
  regionId?: string | null
  status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED'
  createdAt: string
  updatedAt: string
}

export interface Producer {
  id: string
  userId: string
  name: string
  registrationNumber: string
  status: 'PENDING_VERIFICATION' | 'APPROVED' | 'REJECTED'
  type: 'COMPANY' | 'PFA'
  description?: string | null
  mainRegionId?: string | null
  user?: User
}


