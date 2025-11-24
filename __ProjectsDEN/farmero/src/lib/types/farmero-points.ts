/**
 * Farmero Points Types
 * 
 * Tipuri pentru sistemul de puncte și recompense Farmero
 * Scor de încredere și fidelizare pentru clienți
 */

// ============================================================================
// Points & Levels
// ============================================================================

/**
 * Farmero Points Level
 * 
 * Niveluri de puncte (Bronze, Silver, Gold)
 */
export type FarmeroPointsLevel = 'bronze' | 'silver' | 'gold'

/**
 * Farmero Points
 * 
 * Informații despre punctele și nivelul unui client
 */
export interface FarmeroPoints {
  clientId: string
  points: number // ex: 0–1000
  level: FarmeroPointsLevel
  lastUpdated: string
  // Optional: metadata
  nextLevelPoints?: number // Puncte necesare pentru următorul nivel
  levelProgress?: number // Progres către următorul nivel (0-100)
}

/**
 * Points Transaction
 * 
 * Tranzacție de puncte (câștigat/folosit)
 */
export interface PointsTransaction {
  id: string
  clientId: string
  points: number // Pozitiv pentru câștigat, negativ pentru folosit
  type: 'earned' | 'spent' | 'expired'
  description: string
  createdAt: string
  orderId?: string // Dacă este legat de o comandă
}

