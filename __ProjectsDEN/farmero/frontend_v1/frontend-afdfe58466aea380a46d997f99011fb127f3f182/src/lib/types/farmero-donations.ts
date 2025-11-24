/**
 * Farmero Donations Types
 * 
 * Tipuri pentru sistemul de donații către platforma Farmero
 */

// ============================================================================
// Donation Summary
// ============================================================================

/**
 * Farmero Donation Summary
 * 
 * Rezumat al donațiilor pentru o perioadă
 */
export interface FarmeroDonationSummary {
  periodStart: string
  periodEnd: string
  totalAmount: number
  currency: string
  donorsCount: number
}

// ============================================================================
// Donation Preferences
// ============================================================================

/**
 * Farmero Donation Preference
 * 
 * Preferințele utilizatorului pentru donații
 */
export interface FarmeroDonationPreference {
  showNamePublicly: boolean // pentru viitor, implicit false
}

// ============================================================================
// Donation Intent
// ============================================================================

/**
 * Farmero Donation Intent
 * 
 * Intenția de donație (înainte de procesarea plății)
 */
export interface FarmeroDonationIntent {
  amount: number
  currency: string
}

// ============================================================================
// Donation Intent Response
// ============================================================================

/**
 * Farmero Donation Intent Response
 * 
 * Răspunsul la crearea unei intenții de donație
 * (poate conține URL pentru redirecționare către procesatorul de plăți)
 */
export interface FarmeroDonationIntentResponse {
  intentId: string
  paymentUrl?: string // URL pentru redirecționare către procesatorul de plăți
  expiresAt?: string // Data expirării intenției
}

