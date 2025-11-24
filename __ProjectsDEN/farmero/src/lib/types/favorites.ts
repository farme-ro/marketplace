/**
 * Favorites Types
 * 
 * Tipuri pentru sistemul de favorite (produse și producători)
 * Folosit pentru favorites, recomandări personalizate, și abonamente
 */

export type FavoriteTargetType = 'product' | 'producer'

/**
 * Favorite Item
 * 
 * Reprezintă un produs sau producător marcat ca favorit
 */
export interface FavoriteItem {
  id: string
  targetType: FavoriteTargetType
  targetId: string
  createdAt: string
  updatedAt?: string
  // Optional metadata (poate fi extins în viitor)
  metadata?: {
    // Poate include: ultima dată când a fost cumpărat, frecvență, etc.
    lastPurchasedAt?: string
    purchaseCount?: number
  }
}

/**
 * Favorite with resolved data
 * 
 * Favorite item cu datele complete ale produsului/producătorului
 * Folosit în UI pentru afișare
 */
export interface FavoriteWithData {
  favorite: FavoriteItem
  // Resolved data (produs sau producător)
  data: {
    id: string
    name: string
    slug?: string
    imageUrl?: string | null
    // Product specific
    price?: number
    isActive?: boolean
    stock?: number | null
    // Producer specific
    isVerified?: boolean
    productCount?: number
  }
}

