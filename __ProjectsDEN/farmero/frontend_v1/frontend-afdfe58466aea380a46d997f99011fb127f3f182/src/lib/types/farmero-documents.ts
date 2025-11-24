/**
 * Farmero Documents Types
 * 
 * Tipuri pentru sistemul de documente legale și logistică
 * Include: e-Factura, contracte, avize de însoțire, AWB
 */

// ============================================================================
// Invoice Types
// ============================================================================

/**
 * Invoice Issuer
 * 
 * Entitatea care emite factura
 */
export type InvoiceIssuer = 'producer' | 'platform'

/**
 * Farmero Invoice Draft
 * 
 * Draft de factură electronică
 */
export interface FarmeroInvoiceDraft {
  id: string
  orderId: string
  issuedBy: InvoiceIssuer
  issuedToName: string
  issuedToVatId?: string // CUI pentru B2B sau CNP pentru B2C
  issuedToAddress: string
  total: number
  currency: string
  issuedAt?: string
  status?: 'draft' | 'issued' | 'cancelled'
  anafStatus?: 'pending' | 'validated' | 'rejected' // Status în sistemul ANAF
  downloadUrl?: string
}

/**
 * Farmero Invoice
 * 
 * Factură emisă (completă)
 */
export interface FarmeroInvoice extends FarmeroInvoiceDraft {
  invoiceNumber: string // Număr unic de factură
  items: InvoiceItem[]
  subtotal: number
  vatAmount: number
  total: number
  paymentMethod?: string
  paymentDueDate?: string
  anafSubmissionId?: string // ID-ul transmisiei către ANAF
}

/**
 * Invoice Item
 * 
 * Item dintr-o factură
 */
export interface InvoiceItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  total: number
  vatRate?: number // Procent TVA
  vatAmount?: number
}

// ============================================================================
// Contract Types
// ============================================================================

/**
 * Contract Type
 * 
 * Tipuri de contracte disponibile
 */
export type ContractType = 'producer-agreement' | 'business-client-agreement'

/**
 * Farmero Contract Template
 * 
 * Template pentru generare contracte
 */
export interface FarmeroContractTemplate {
  id: string
  name: string
  type: ContractType
  version: string
  description?: string
  requiredFields: string[] // Listă de câmpuri necesare pentru completare
  createdAt?: string
  updatedAt?: string
}

/**
 * Farmero Generated Contract
 * 
 * Contract generat și completat
 */
export interface FarmeroGeneratedContract {
  id: string
  templateId: string
  templateName?: string
  type: ContractType
  filledAt: string
  parties: {
    party1: {
      name: string
      vatId?: string
      address: string
    }
    party2: {
      name: string
      vatId?: string
      address: string
    }
  }
  contractData: Record<string, unknown> // Date specifice contractului
  signedByParty1?: boolean
  signedByParty2?: boolean
  signedAt?: string
  downloadUrl?: string
  status: 'draft' | 'pending-signature' | 'signed' | 'cancelled'
}

// ============================================================================
// Delivery Note Types
// ============================================================================

/**
 * Farmero Delivery Note
 * 
 * Aviz de însoțire a mărfii
 */
export interface FarmeroDeliveryNote {
  id: string
  orderId: string
  producerId: string
  producerName?: string
  clientName: string
  clientAddress: string
  itemsCount: number
  items: DeliveryNoteItem[]
  issuedAt: string
  issuedBy: 'producer' | 'platform' | 'logistics-partner'
  downloadUrl?: string
}

/**
 * Delivery Note Item
 * 
 * Item dintr-un aviz de însoțire
 */
export interface DeliveryNoteItem {
  productId: string
  productName: string
  quantity: number
  unit: string // ex: "kg", "buc", "l"
  notes?: string
}

// ============================================================================
// AWB & Logistics Types
// ============================================================================

/**
 * Courier Name
 * 
 * Numele curierului
 */
export type CourierName =
  | 'fan-courier'
  | 'dpd'
  | 'gls'
  | 'sameday'
  | 'urgent-cargus'
  | 'other'

/**
 * AWB Status
 * 
 * Status-ul AWB-ului
 */
export type AwbStatus =
  | 'created'
  | 'picked-up'
  | 'in-transit'
  | 'out-for-delivery'
  | 'delivered'
  | 'returned'
  | 'cancelled'

/**
 * Farmero Awb
 * 
 * AWB (Air Waybill) pentru livrare
 */
export interface FarmeroAwb {
  id: string
  orderId: string
  courierName: CourierName
  courierDisplayName?: string // Nume afișat (ex: "Fan Courier")
  trackingNumber: string
  labelUrl?: string // URL către etichetă de expediere
  status: AwbStatus
  createdAt: string
  pickedUpAt?: string
  deliveredAt?: string
  estimatedDeliveryDate?: string
  trackingUrl?: string // URL către pagina de tracking a curierului
  notes?: string
}

/**
 * Create Awb Input
 * 
 * Input pentru crearea unui AWB manual
 */
export interface CreateAwbInput {
  orderId: string
  courierName: CourierName
  trackingNumber: string
  labelUrl?: string
  estimatedDeliveryDate?: string
  notes?: string
}

/**
 * Update Awb Status Input
 * 
 * Input pentru actualizarea statusului AWB
 */
export interface UpdateAwbStatusInput {
  status: AwbStatus
  notes?: string
}

