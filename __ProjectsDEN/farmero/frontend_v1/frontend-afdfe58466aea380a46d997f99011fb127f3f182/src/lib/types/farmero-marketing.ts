/**
 * Farmero Marketing & Monetization Types
 * 
 * Types for producer visibility tiers and marketing features
 */

// ============================================================================
// Producer Promotion Tiers
// ============================================================================

/**
 * Producer Promotion Tier
 * 
 * Niveluri de vizibilitate pentru producători
 */
export type ProducerPromotionTier = 'none' | 'featured' | 'boosted' | 'sponsored'

/**
 * Producer Visibility Info
 * 
 * Informații despre vizibilitatea unui producător
 */
export interface ProducerVisibilityInfo {
  producerId: string
  tier: ProducerPromotionTier
  badgeLabel?: string // ex: 'Recomandat', 'Susținut de comunitate', 'Partener Farmero'
  highlightUntil?: string // ISO date pentru promo temporară
}

/**
 * Producer with Visibility
 * 
 * Producător cu informații de vizibilitate
 */
export interface ProducerWithVisibility {
  id: string
  slug: string
  name: string
  description?: string
  avatarUrl?: string | null
  regionName?: string
  productCount: number
  tags?: string[]
  isVerified?: boolean
  visibility?: ProducerVisibilityInfo
}

// ============================================================================
// Marketing Settings
// ============================================================================

/**
 * Social Platform
 * 
 * Platforme sociale suportate
 */
export type SocialPlatform = 'facebook' | 'instagram' | 'tiktok'

/**
 * Social Platform Account
 * 
 * Cont de platformă socială
 */
export interface SocialPlatformAccount {
  platform: SocialPlatform
  connected: boolean
  connectedAt?: string // ISO date
  accountName?: string
}

/**
 * Farmero Marketing Settings
 * 
 * Setări de marketing pentru producător
 */
export interface FarmeroMarketingSettings {
  producerId: string
  autoPostEnabled: boolean
  postFrequency: 'weekly' | 'biweekly' | 'monthly'
  platforms: SocialPlatformAccount[]
}

/**
 * Update Marketing Settings Input
 * 
 * Input pentru actualizarea setărilor de marketing
 */
export interface UpdateMarketingSettingsInput {
  autoPostEnabled?: boolean
  postFrequency?: 'weekly' | 'biweekly' | 'monthly'
}

/**
 * Connect Social Platform Response
 * 
 * Răspuns la conectarea unei platforme sociale
 */
export interface ConnectSocialPlatformResponse {
  authUrl?: string
  status: 'connected' | 'pending' | 'error'
  message?: string
}

