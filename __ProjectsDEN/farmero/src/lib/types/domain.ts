/**
 * Domain Types - Contract Central pentru Frontend
 * 
 * Aceste tipuri reprezintă contractul domain al aplicației și sunt singura sursă de adevăr pentru UI.
 * Toate datele din API trebuie să fie mapate la aceste tipuri prin adapter functions.
 * 
 * NOTE: Tipurile sunt proiectate pentru extensii viitoare:
 * - preferințe utilizator
 * - postări producător
 * - timestamps avansate
 * - metadata SEO per produs
 * - rating și review-uri
 * - notificări
 * - abonamente producător
 */

// ============================================================================
// Product Domain
// ============================================================================

export interface Product {
  id: string
  slug: string
  name: string
  price: number
  currency?: string
  description?: string
  imageUrl?: string | null
  category?: string
  categoryId?: string
  stock?: number | null
  isActive?: boolean
  producerId?: string
  producerName?: string
  producerSlug?: string
  unit?: string
  isBio?: boolean
  isTraditional?: boolean
  regionId?: string
  regionName?: string
  status?: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED'
  images?: string[]
  createdAt?: string
  updatedAt?: string
}

// ============================================================================
// Producer Domain
// ============================================================================

export interface Producer {
  id: string
  slug: string
  name: string
  description?: string
  logoUrl?: string | null
  coverImageUrl?: string | null
  location?: string
  regionId?: string
  regionName?: string
  rating?: number
  totalOrders?: number
  productCount?: number
  isVerified?: boolean
  tags?: string[]
  partnerSince?: string
  registrationNumber?: string
  type?: 'COMPANY' | 'PFA'
  status?: 'PENDING_VERIFICATION' | 'APPROVED' | 'REJECTED'
  createdAt?: string
  updatedAt?: string
}

// ============================================================================
// Order Domain
// ============================================================================

export type OrderStatus = 'pending' | 'confirmed' | 'prepared' | 'shipped' | 'delivered' | 'cancelled' | 'paid' | 'processing' | 'canceled' | 'uncollected'

export interface Order {
  id: string
  number?: string
  status: OrderStatus
  total: number
  subtotal?: number
  shippingCost?: number
  items: OrderItem[]
  clientId?: string
  producerId?: string
  shippingAddress?: ShippingAddress
  paymentMethod?: 'card' | 'cod' | 'bank_transfer' | 'other'
  paymentStatus?: 'pending' | 'paid' | 'failed'
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export interface OrderItem {
  id?: string
  productId: string
  productName?: string
  productSlug?: string
  name: string
  quantity: number
  price: number
  total?: number
  producerName?: string
  producerId?: string
  unit?: string
  imageUrl?: string
}

export interface ShippingAddress {
  name: string
  phone: string
  email?: string
  city: string
  address: string
  postalCode?: string
  notes?: string
}

// ============================================================================
// Account Domain
// ============================================================================

/**
 * Account Types
 * 
 * Un utilizator poate avea multiple conturi:
 * - PersonalAccount: cont personal/family (implicit pentru orice user)
 * - BusinessAccount: cont de firmă/companie/ONG
 */
export type AccountType = 'personal' | 'business'

/**
 * Base Account interface
 * 
 * Toate conturile au aceste proprietăți comune
 */
export interface BaseAccount {
  id: string
  type: AccountType
  name: string
  slug?: string
  isDefault?: boolean
  createdAt?: string
  updatedAt?: string
}

/**
 * Personal Account
 * 
 * Cont personal/family - implicit pentru orice user
 */
export interface PersonalAccount extends BaseAccount {
  type: 'personal'
  // Personal accounts don't have additional fields beyond BaseAccount
}

/**
 * Business Account
 * 
 * Cont de firmă/companie/ONG
 * Folosit pentru comenzi pe firmă, facturare, Business Portal
 */
export interface BusinessAccount extends BaseAccount {
  type: 'business'
  companyNumber?: string // CUI / Registration number
  vatId?: string // CIF / VAT number
  billingAddress?: {
    name: string
    city: string
    address: string
    postalCode?: string
    country?: string
  }
  // Optional: additional business fields
  companyType?: 'COMPANY' | 'PFA' | 'ONG' | 'OTHER'
  taxId?: string
}

/**
 * Union type for all account types
 */
export type UserAccount = PersonalAccount | BusinessAccount

// ============================================================================
// User Profile Domain
// ============================================================================

export type UserRole = 'client' | 'producer' | 'admin' | 'investor' | 'logistics' | 'importer' | 'business'

export interface UserProfile {
  id: string
  email: string
  name?: string
  fullName?: string
  phone?: string
  phoneNumber?: string
  role: UserRole
  // Client specific
  // Producer specific
  producerName?: string
  registrationNumber?: string
  producerType?: 'COMPANY' | 'PFA'
  mainRegionId?: string
  // Investor specific
  company?: string
  investmentAmount?: number
  investmentDate?: string
  investorStatus?: 'PENDING' | 'APPROVED' | 'ACTIVE'
  // Logistics specific
  companyName?: string
  serviceType?: 'DELIVERY' | 'WAREHOUSE' | 'PACKAGING' | 'MULTI'
  contractNumber?: string
  logisticsStatus?: 'PENDING' | 'APPROVED' | 'ACTIVE'
  // Importer specific
  importerCountry?: string
  importVolume?: number
  importerStatus?: 'PENDING' | 'APPROVED' | 'ACTIVE'
  // Business specific
  businessCompanyType?: 'RESTAURANT' | 'HOTEL' | 'CAFE' | 'CATERING' | 'RETAIL' | 'OTHER'
  businessRegistrationNumber?: string
  address?: string
  city?: string
  employeesCount?: number
  // Common
  createdAt?: string
  updatedAt?: string
}

// ============================================================================
// Category Domain
// ============================================================================

export interface Category {
  id: string
  name: string
  slug?: string
  description?: string
  imageUrl?: string | null
  parentId?: string
  productCount?: number
  createdAt?: string
}

// ============================================================================
// Region Domain
// ============================================================================

export interface Region {
  id: string
  name: string
  code?: string | null
  type?: 'COUNTY' | 'REGION'
  createdAt?: string
}

// ============================================================================
// Helper Types
// ============================================================================

export interface PaginationParams {
  page?: number
  pageSize?: number
  limit?: number
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

// ============================================================================
// Document Domain
// ============================================================================

export type DocumentType = 'contract' | 'invoice' | 'statement' | 'delivery_note' | 'awb' | 'other'

export type DocumentParty = 'farmero' | 'producer' | 'logistics' | 'business' | 'client'

export type DocumentStatus = 'draft' | 'pending' | 'active' | 'expired' | 'cancelled' | 'signed'

export interface DomainDocument {
  id: string
  type: DocumentType
  title: string
  createdAt: string
  updatedAt?: string
  status: DocumentStatus
  parties: DocumentParty[]
  downloadUrl?: string | null
  metadata?: Record<string, unknown>
  // Optional fields for specific document types
  contractType?: string
  invoiceNumber?: string
  amount?: number
  currency?: string
  expiresAt?: string
  signedAt?: string
}

// ============================================================================
// Contract Template Domain
// ============================================================================

export type ContractTemplateType = 'producer_platform' | 'logistics_platform' | 'business_platform' | 'producer_business' | 'donor_platform' | 'other'

export interface DomainContractTemplate {
  id: string
  type: ContractTemplateType
  name: string
  description?: string
  version: string
  isActive: boolean
  createdAt: string
  updatedAt?: string
}

export interface DomainContractDraft {
  id?: string
  templateId?: string
  type: ContractTemplateType
  parties: {
    farmero: boolean
    producer?: boolean
    logistics?: boolean
    business?: boolean
    client?: boolean
  }
  startDate: string
  duration?: number // in months
  commissionRate?: number
  paymentTerms?: string
  notes?: string
  metadata?: Record<string, unknown>
}

// ============================================================================
// Subscription Domain
// ============================================================================

export type SubscriptionFrequency = 'weekly' | 'biweekly' | 'monthly'

export type SubscriptionStatus = 'active' | 'paused' | 'canceled' | 'ended'

export interface DomainSubscriptionItem {
  productId: string
  productName: string
  quantity: number
  price: number
  unit?: string
}

export interface DomainSubscription {
  id: string
  clientId: string
  producerId: string
  producerName?: string
  items: DomainSubscriptionItem[]
  frequency: SubscriptionFrequency
  nextDeliveryDate: string
  status: SubscriptionStatus
  createdAt: string
  updatedAt?: string
  notes?: string
}

// ============================================================================
// Promotion Domain
// ============================================================================

export type PromotionTier = 'starter' | 'growth' | 'pro'

export type PromotionChannel = 'marketplace' | 'newsletter' | 'social_media'

export type PromotionCampaignStatus = 'draft' | 'active' | 'paused' | 'completed' | 'cancelled'

export interface DomainPromotionSubscription {
  id: string
  producerId: string
  tier: PromotionTier
  price: number
  currency: string
  startedAt: string
  renewsAt: string
  status: 'active' | 'expired' | 'cancelled'
}

export interface DomainPromotionCampaign {
  id: string
  producerId: string
  channel: PromotionChannel
  status: PromotionCampaignStatus
  budget?: number
  startDate: string
  endDate?: string
  productIds?: string[]
  metrics?: {
    impressions?: number
    clicks?: number
    conversions?: number
  }
  createdAt: string
  updatedAt?: string
}

// ============================================================================
// Investor Metrics Domain
// ============================================================================

export interface InvestorKpiSnapshot {
  totalOrders: number
  totalVolumeRon: number
  activeProducers: number
  activeClients: number
  recurringOrderRate: number // ex: 0.23 = 23%
  avgOrderValueRon: number
}

export interface InvestorTimeSeriesPoint {
  date: string // ISO
  ordersCount: number
  volumeRon: number
  newClients: number
}

export interface InvestorDashboardData {
  snapshot: InvestorKpiSnapshot
  timeseries: InvestorTimeSeriesPoint[]
  notes?: string[]
}

// ============================================================================
// Shipment Domain
// ============================================================================

export type ShipmentStatus =
  | 'pending_pickup'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'failed'
  | 'returned'

export interface DomainShipment {
  id: string
  orderId: string
  producerId: string
  logisticsPartnerId?: string
  awbNumber?: string
  status: ShipmentStatus
  createdAt: string
  updatedAt: string
  estimatedDeliveryDate?: string
  deliveredAt?: string
}

// ============================================================================
// Journal Article Domain
// ============================================================================

export type JournalArticleStatus = 'draft' | 'review' | 'approved' | 'published'

export interface DomainJournalArticle {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  coverImageUrl?: string | null
  producerId: string
  producerName: string
  producerSlug: string
  status: JournalArticleStatus
  publishedAt?: string | null
  createdAt: string
  updatedAt: string
}

