/**
 * Silent Alerts Types
 * 
 * Tipuri pentru notificări discrete (price drops, back in stock)
 * Folosit pentru alertări non-intruzive despre produse favorite
 */

import type { FavoriteTargetType } from './favorites'

/**
 * Alert Type
 * 
 * Tipuri de notificări disponibile
 */
export type AlertType = 'price_drop' | 'back_in_stock'

/**
 * Favorite Alert Preference
 * 
 * Preferințe de notificare pentru un produs/producător favorit
 */
export interface FavoriteAlertPreference {
  targetType: FavoriteTargetType
  targetId: string
  alertTypes: AlertType[]
  // Optional: threshold pentru price drop (ex: notifică doar dacă scade cu >10%)
  priceDropThreshold?: number // Percentage (0-100)
  createdAt?: string
  updatedAt?: string
}

/**
 * Alert Preference with Data
 * 
 * Preferință de alertă cu datele complete ale produsului/producătorului
 */
export interface AlertPreferenceWithData {
  preference: FavoriteAlertPreference
  data: {
    id: string
    name: string
    slug?: string
    imageUrl?: string | null
    // Product specific
    currentPrice?: number
    previousPrice?: number
    isInStock?: boolean
    // Producer specific
    isVerified?: boolean
  }
}

/**
 * Update Alert Preferences Input
 * 
 * Input pentru actualizarea preferințelor de notificare
 */
export interface UpdateAlertPreferencesInput {
  preferences: FavoriteAlertPreference[]
}

