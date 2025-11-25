/**
 * Farmero Contracts Types
 * 
 * Tipuri pentru contracte și relații între părți în sistemul Farmero
 */

import type { FarmeroPartyRef } from './farmero-parties'

// ============================================================================
// Contract Types
// ============================================================================

/**
 * Farmero Contract Type
 * 
 * Tipurile de contracte disponibile în sistem
 */
export type FarmeroContractType =
  | 'producer_platform' // Contract între producător și platforma Farmero
  | 'logistics_platform' // Contract între partener logistic și platforma Farmero
  | 'business_platform' // Contract între client business și platforma Farmero
  | 'producer_business' // Contract direct între producător și client business
  | 'donor_platform' // Contract între donator și platforma Farmero

/**
 * Farmero Contract Status
 * 
 * Status-ul unui contract
 */
export type FarmeroContractStatus = 'draft' | 'active' | 'suspended' | 'terminated'

/**
 * Farmero Contract Template
 * 
 * Template pentru generare contracte
 */
export interface FarmeroContractTemplate {
  id: string
  type: FarmeroContractType
  name: string
  version: string
  description?: string
  createdAt: string
  updatedAt?: string
  requiredFields?: string[] // Listă de câmpuri necesare pentru completare
}

/**
 * Farmero Contract Instance
 * 
 * Instanță concretă a unui contract (generat din template)
 */
export interface FarmeroContractInstance {
  id: string
  templateId: string
  type: FarmeroContractType
  parties: FarmeroPartyRef[] // de ex: [Farmero, Producător X]
  status: FarmeroContractStatus
  signedAt?: string
  validFrom?: string
  validUntil?: string
  referenceNumber?: string // Număr de referință (ex: "CONTRACT-2025-001")
  contractData?: Record<string, unknown> // Date specifice contractului (termeni, sume, etc.)
  downloadUrl?: string // URL pentru descărcare PDF
  createdAt?: string
  updatedAt?: string
}

// ============================================================================
// Relations
// ============================================================================

/**
 * Relation Type
 * 
 * Tipurile de relații între părți
 */
export type FarmeroRelationType = 'commercial' | 'logistics' | 'donation' | 'other'

/**
 * Farmero Relation
 * 
 * Relație între două părți (poate fi legată de un contract)
 */
export interface FarmeroRelation {
  id: string
  primaryParty: FarmeroPartyRef
  counterparty: FarmeroPartyRef
  contractId?: string // ID-ul contractului asociat (dacă există)
  relationType: FarmeroRelationType
  createdAt: string
  updatedAt?: string
  metadata?: Record<string, unknown> // Date suplimentare despre relație
}

