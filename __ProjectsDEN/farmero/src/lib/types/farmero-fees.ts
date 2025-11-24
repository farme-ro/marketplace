/**
 * Farmero Fees Types
 * 
 * Tipuri pentru sistemul de comisioane și taxe Farmero
 */

// ============================================================================
// Fee Scope
// ============================================================================

/**
 * Farmero Fee Scope
 * 
 * Domeniul în care se aplică comisionul
 */
export type FarmeroFeeScope =
  | 'order' // Comision pe comandă
  | 'subscription' // Comision pe abonament
  | 'delivery' // Comision pe livrare
  | 'marketing' // Comision pentru servicii de marketing
  | 'other' // Alte tipuri de comisioane

/**
 * Farmero Fee Payer Type
 * 
 * Tipul de entitate care plătește comisionul
 */
export type FarmeroFeePayerType =
  | 'producer' // Producătorul plătește comision
  | 'logistics_partner' // Partenerul de logistică plătește comision
  | 'business_client' // Clientul business plătește comision

// ============================================================================
// Fee Rules
// ============================================================================

/**
 * Farmero Fee Rule
 * 
 * Regulă de calculare a comisionului
 */
export interface FarmeroFeeRule {
  id: string
  scope: FarmeroFeeScope
  payerType: FarmeroFeePayerType
  percentage?: number // ex: 5 (%) din valoare
  fixedAmount?: number // ex: 1 leu / comandă
  currency: string
  description?: string
  active: boolean
  createdAt?: string
  updatedAt?: string
}

// ============================================================================
// Statements
// ============================================================================

/**
 * Statement Reference Type
 * 
 * Tipul de referință pentru o linie din extras
 */
export type StatementReferenceType = 'order' | 'subscription' | 'delivery' | 'marketing' | 'other'

/**
 * Farmero Statement Line
 * 
 * Linie dintr-un extras (statement)
 */
export interface FarmeroStatementLine {
  id: string
  date: string
  referenceType: StatementReferenceType
  referenceId: string
  referenceNumber?: string // ex: "ORD-123", "SUB-456"
  grossAmount: number
  feeAmount: number
  netAmount: number
  currency: string
  description?: string
  feeRuleId?: string // ID-ul regulii de comision aplicată
}

/**
 * Farmero Statement Summary
 * 
 * Rezumat al unui extras (statement) pentru o perioadă
 */
export interface FarmeroStatementSummary {
  id: string
  partyId: string // producător / logistic partner / business
  partyType: FarmeroFeePayerType
  periodStart: string
  periodEnd: string
  totalGross: number
  totalFees: number
  totalNet: number
  currency: string
  lines: FarmeroStatementLine[]
  status?: 'draft' | 'final' | 'paid' // Status-ul extrasului
  paidAt?: string // Data plății (dacă este cazul)
  createdAt?: string
  updatedAt?: string
}

