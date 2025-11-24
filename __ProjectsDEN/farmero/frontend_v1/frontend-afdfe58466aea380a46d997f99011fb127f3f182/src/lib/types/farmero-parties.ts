/**
 * Farmero Parties Types
 * 
 * Tipuri pentru actorii din sistemul Farmero
 * Definește "cine sunt" și "cum se identifică" diferitele entități
 */

// ============================================================================
// Party Types
// ============================================================================

/**
 * Farmero Party Type
 * 
 * Tipurile de actori din sistemul Farmero
 */
export type FarmeroPartyType =
  | 'farmero_platform' // Platforma Farmero însăși
  | 'client' // Clienți persoane fizice
  | 'producer' // Producători (fermieri, producători locali)
  | 'logistics_partner' // Parteneri de logistică
  | 'business_client' // Clienți business (restaurante, magazine, etc.)
  | 'donor' // Donatori (pentru programe sociale)

/**
 * Farmero Party Reference
 * 
 * Referință către o entitate (party) din sistem
 */
export interface FarmeroPartyRef {
  id: string // ID intern unic
  type: FarmeroPartyType
  displayName: string // ex: nume firmă, nume client, "Farmero"
  countryCode?: string // ex: "RO"
  vatId?: string // CUI pentru businessuri / producători
  email?: string // Email de contact (opțional)
  address?: string // Adresă (opțional)
}

/**
 * Farmero Party Profile
 * 
 * Profil complet al unei entități (extins față de PartyRef)
 */
export interface FarmeroPartyProfile extends FarmeroPartyRef {
  createdAt?: string
  updatedAt?: string
  metadata?: Record<string, unknown> // Date suplimentare specifice tipului de party
}

