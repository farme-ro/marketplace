/**
 * Subscription Baskets Types
 * 
 * Tipuri pentru abonamente (recurring baskets)
 * Permite clienților să comande automat produse favorite la intervale regulate
 */

export type SubscriptionFrequency = 'weekly' | 'biweekly' | 'monthly'

/**
 * Subscription Basket Item
 * 
 * Produs inclus într-un abonament cu cantitatea specificată
 */
export interface SubscriptionBasketItem {
  productId: string
  quantity: number
  // Optional: metadata pentru viitoare funcționalități
  metadata?: {
    // Poate include: preferințe de livrare, note, etc.
    notes?: string
  }
}

/**
 * Subscription Basket
 * 
 * Abonament pentru cumpărături recurente
 */
export interface SubscriptionBasket {
  id: string
  name: string
  items: SubscriptionBasketItem[]
  frequency: SubscriptionFrequency
  isActive: boolean
  nextDeliveryDate?: string // Data următoarei livrări programate
  createdAt: string
  updatedAt?: string
  // Optional: metadata
  metadata?: {
    // Poate include: preferințe de livrare, adresă, etc.
    deliveryAddress?: string
    notes?: string
  }
}

/**
 * Create Subscription Basket Input
 * 
 * Date pentru crearea unui abonament nou
 */
export interface CreateSubscriptionBasketInput {
  name: string
  items: SubscriptionBasketItem[]
  frequency: SubscriptionFrequency
  // Optional: metadata
  metadata?: {
    deliveryAddress?: string
    notes?: string
  }
}

/**
 * Update Subscription Basket Input
 * 
 * Date pentru actualizarea unui abonament existent
 */
export interface UpdateSubscriptionBasketInput {
  name?: string
  items?: SubscriptionBasketItem[]
  frequency?: SubscriptionFrequency
  isActive?: boolean
  metadata?: {
    deliveryAddress?: string
    notes?: string
  }
}

/**
 * Subscription Suggestion
 * 
 * Sugestie de abonament bazată pe favorite și istoricul de cumpărături
 */
export interface SubscriptionSuggestion {
  suggestedItems: Array<{
    productId: string
    productName: string
    suggestedQuantity: number
    reason: string // Ex: "Cumpărat frecvent", "Produs favorit", etc.
  }>
  suggestedFrequency: SubscriptionFrequency
  estimatedMonthlyValue?: number
}

/**
 * Farmero Subscription Plan (Public)
 * 
 * Plan de abonament public pentru homepage și marketing
 */
export interface FarmeroSubscriptionPlan {
  id: string
  name: string
  description?: string
  frequency: SubscriptionFrequency
  basePrice: number
  currency: string
  isRecommended?: boolean
  producerName?: string
  producerId?: string
  producerSlug?: string
  regionName?: string
  regionId?: string
  itemsCount?: number
  imageUrl?: string | null
  createdAt?: string
}

/**
 * Farmero Client Subscription
 * 
 * Abonament activ al unui client la un plan de la un producător
 */
export interface FarmeroClientSubscription {
  id: string
  clientId: string
  producerId: string
  producerName?: string
  producerSlug?: string
  planId: string
  planName?: string
  frequency: SubscriptionFrequency
  startDate: string
  nextDeliveryDate: string
  isActive: boolean
  skipCount?: number // Număr de livrări sărite
  createdAt?: string
  updatedAt?: string
}

/**
 * Farmero Producer Tier
 * 
 * Nivel de abonament pentru producători (Basic, Boost, Pro)
 */
export interface FarmeroProducerTier {
  id: string
  name: string // "Basic", "Boost", "Pro"
  monthlyPrice: number
  currency: string
  features: string[] // Listă de feature-uri incluse
  description?: string
}

/**
 * Farmero Producer Subscription Status
 * 
 * Status-ul abonamentului unui producător
 */
export interface FarmeroProducerSubscriptionStatus {
  producerId: string
  tierId: string
  tierName?: string
  validUntil: string
  isAutoRenew: boolean
  startDate?: string
}

