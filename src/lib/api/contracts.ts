/**
 * Contracts & Billing API Client (Admin)
 * 
 * API functions for managing contracts, invoices, and delivery notes
 */

import { apiFetch } from './admin'

// ============================================================================
// Types (re-exported from backend types for consistency)
// ============================================================================

export type ContractTemplateCategory = 'producer' | 'client' | 'b2b' | 'logistics' | 'general'
export type ContractInstanceStatus = 'draft' | 'pending_signature' | 'signed' | 'expired' | 'cancelled'
export type InvoiceType = 'customer' | 'producer' | 'b2b'
export type InvoiceStatus = 'draft' | 'issued' | 'paid' | 'cancelled'
export type DeliveryNoteStatus = 'draft' | 'issued' | 'delivered' | 'cancelled'

export interface ContractTemplate {
  id: string
  code: string
  name: string
  description?: string
  content: string
  variables?: Record<string, any>
  category: ContractTemplateCategory
  isActive: boolean
  version: number
  createdAt: string
  updatedAt: string
  createdBy?: {
    id: string
    email: string
    fullName: string
  }
  updatedBy?: {
    id: string
    email: string
    fullName: string
  }
}

export interface ContractInstance {
  id: string
  templateId: string
  template?: {
    id: string
    code: string
    name: string
    category: ContractTemplateCategory
  }
  contractNumber: string
  producerId?: string
  producer?: {
    id: string
    name: string
  }
  clientId?: string
  client?: {
    id: string
    email: string
    fullName: string
  }
  orderId?: string
  status: ContractInstanceStatus
  signedAt?: string
  expiresAt?: string
  variables: Record<string, any>
  pdfUrl?: string
  signedByUserId?: string
  signedBy?: {
    id: string
    email: string
    fullName: string
  }
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  taxRate?: number
  totalAmount: number
  orderItemId?: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  type: InvoiceType
  orderId?: string
  commissionId?: string
  producerId?: string
  producer?: {
    id: string
    name: string
  }
  clientId?: string
  client?: {
    id: string
    email: string
    fullName: string
  }
  status: InvoiceStatus
  totalAmount: number
  taxAmount?: number
  netAmount: number
  currency: string
  issuedAt?: string
  dueAt?: string
  paidAt?: string
  externalId?: string
  pdfUrl?: string
  eFacturaXmlUrl?: string
  notes?: string
  items: InvoiceItem[]
  createdAt: string
  updatedAt: string
}

export interface DeliveryNoteItem {
  id: string
  productId?: string
  productName: string
  quantity: number
  unit?: string
  orderItemId?: string
}

export interface DeliveryNote {
  id: string
  noteNumber: string
  orderId: string
  order?: {
    id: string
    totalAmount: string
    status: string
  }
  producerId: string
  producer?: {
    id: string
    name: string
  }
  status: DeliveryNoteStatus
  issuedAt?: string
  deliveredAt?: string
  pdfUrl?: string
  carrierName?: string
  trackingNumber?: string
  notes?: string
  items: DeliveryNoteItem[]
  createdAt: string
  updatedAt: string
}

export interface GetContractTemplatesParams {
  category?: ContractTemplateCategory
  isActive?: boolean
  search?: string
  page?: number
  limit?: number
}

export interface GetContractInstancesParams {
  templateId?: string
  producerId?: string
  clientId?: string
  orderId?: string
  status?: ContractInstanceStatus
  search?: string
  page?: number
  limit?: number
}

export interface GetInvoicesParams {
  type?: InvoiceType
  orderId?: string
  commissionId?: string
  producerId?: string
  clientId?: string
  status?: InvoiceStatus
  search?: string
  page?: number
  limit?: number
}

export interface GetDeliveryNotesParams {
  orderId?: string
  producerId?: string
  status?: DeliveryNoteStatus
  search?: string
  page?: number
  limit?: number
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get contract templates
 */
export async function getContractTemplates(
  params?: GetContractTemplatesParams
): Promise<{ data: ContractTemplate[]; pagination: any }> {
  try {
    const queryParams = new URLSearchParams()
    if (params?.category) queryParams.append('category', params.category)
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString())
    if (params?.search) queryParams.append('search', params.search)
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    const query = queryParams.toString()
    const response = await apiFetch<{ success: boolean; data: { data: ContractTemplate[]; pagination: any } }>(
      `/admin/contracts/templates${query ? `?${query}` : ''}`
    )

    if (!response.success || !response.data) {
      throw new Error('Failed to get contract templates')
    }

    return response.data
  } catch (error) {
    console.warn('[Contracts API] Failed to get contract templates:', error)
    return {
      data: [],
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || 20,
        total: 0,
        totalPages: 0,
      },
    }
  }
}

/**
 * Get contract template by ID
 */
export async function getContractTemplateById(id: string): Promise<ContractTemplate | null> {
  try {
    const response = await apiFetch<{ success: boolean; data: ContractTemplate }>(
      `/admin/contracts/templates/${id}`
    )

    if (!response.success || !response.data) {
      return null
    }

    return response.data
  } catch (error) {
    console.warn(`[Contracts API] Failed to get contract template ${id}:`, error)
    return null
  }
}

/**
 * Create contract template
 */
export async function createContractTemplate(
  input: Omit<ContractTemplate, 'id' | 'version' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'isActive'>
): Promise<ContractTemplate> {
  try {
    const response = await apiFetch<{ success: boolean; data: ContractTemplate }>(
      '/admin/contracts/templates',
      {
        method: 'POST',
        body: JSON.stringify(input),
      }
    )

    if (!response.success || !response.data) {
      throw new Error('Failed to create contract template')
    }

    return response.data
  } catch (error) {
    console.error('[Contracts API] Failed to create contract template:', error)
    throw error
  }
}

/**
 * Update contract template
 */
export async function updateContractTemplate(
  id: string,
  input: Partial<Pick<ContractTemplate, 'name' | 'description' | 'content' | 'variables' | 'category' | 'isActive'>>
): Promise<ContractTemplate> {
  try {
    const response = await apiFetch<{ success: boolean; data: ContractTemplate }>(
      `/admin/contracts/templates/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(input),
      }
    )

    if (!response.success || !response.data) {
      throw new Error('Failed to update contract template')
    }

    return response.data
  } catch (error) {
    console.error(`[Contracts API] Failed to update contract template ${id}:`, error)
    throw error
  }
}

/**
 * Get contract instances
 */
export async function getContractInstances(
  params?: GetContractInstancesParams
): Promise<{ data: ContractInstance[]; pagination: any }> {
  try {
    const queryParams = new URLSearchParams()
    if (params?.templateId) queryParams.append('templateId', params.templateId)
    if (params?.producerId) queryParams.append('producerId', params.producerId)
    if (params?.clientId) queryParams.append('clientId', params.clientId)
    if (params?.orderId) queryParams.append('orderId', params.orderId)
    if (params?.status) queryParams.append('status', params.status)
    if (params?.search) queryParams.append('search', params.search)
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    const query = queryParams.toString()
    const response = await apiFetch<{ success: boolean; data: { data: ContractInstance[]; pagination: any } }>(
      `/admin/contracts/instances${query ? `?${query}` : ''}`
    )

    if (!response.success || !response.data) {
      throw new Error('Failed to get contract instances')
    }

    return response.data
  } catch (error) {
    console.warn('[Contracts API] Failed to get contract instances:', error)
    return {
      data: [],
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || 20,
        total: 0,
        totalPages: 0,
      },
    }
  }
}

/**
 * Create contract instance
 */
export async function createContractInstance(
  input: Omit<ContractInstance, 'id' | 'contractNumber' | 'status' | 'createdAt' | 'updatedAt' | 'template' | 'producer' | 'client' | 'signedBy'> & {
    templateId: string
    variables: Record<string, any>
  }
): Promise<ContractInstance> {
  try {
    const response = await apiFetch<{ success: boolean; data: ContractInstance }>(
      '/admin/contracts/instances',
      {
        method: 'POST',
        body: JSON.stringify(input),
      }
    )

    if (!response.success || !response.data) {
      throw new Error('Failed to create contract instance')
    }

    return response.data
  } catch (error) {
    console.error('[Contracts API] Failed to create contract instance:', error)
    throw error
  }
}

/**
 * Get invoices
 */
export async function getInvoices(params?: GetInvoicesParams): Promise<{ data: Invoice[]; pagination: any }> {
  try {
    const queryParams = new URLSearchParams()
    if (params?.type) queryParams.append('type', params.type)
    if (params?.orderId) queryParams.append('orderId', params.orderId)
    if (params?.commissionId) queryParams.append('commissionId', params.commissionId)
    if (params?.producerId) queryParams.append('producerId', params.producerId)
    if (params?.clientId) queryParams.append('clientId', params.clientId)
    if (params?.status) queryParams.append('status', params.status)
    if (params?.search) queryParams.append('search', params.search)
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    const query = queryParams.toString()
    const response = await apiFetch<{ success: boolean; data: { data: Invoice[]; pagination: any } }>(
      `/admin/contracts/invoices${query ? `?${query}` : ''}`
    )

    if (!response.success || !response.data) {
      throw new Error('Failed to get invoices')
    }

    return response.data
  } catch (error) {
    console.warn('[Contracts API] Failed to get invoices:', error)
    return {
      data: [],
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || 20,
        total: 0,
        totalPages: 0,
      },
    }
  }
}

/**
 * Create invoice
 */
export async function createInvoice(
  input: Omit<Invoice, 'id' | 'invoiceNumber' | 'status' | 'totalAmount' | 'taxAmount' | 'netAmount' | 'currency' | 'createdAt' | 'updatedAt' | 'producer' | 'client'> & {
    type: InvoiceType
    items: Array<{
      description: string
      quantity: number
      unitPrice: number
      taxRate?: number
      orderItemId?: string
    }>
  }
): Promise<Invoice> {
  try {
    const response = await apiFetch<{ success: boolean; data: Invoice }>(
      '/admin/contracts/invoices',
      {
        method: 'POST',
        body: JSON.stringify(input),
      }
    )

    if (!response.success || !response.data) {
      throw new Error('Failed to create invoice')
    }

    return response.data
  } catch (error) {
    console.error('[Contracts API] Failed to create invoice:', error)
    throw error
  }
}

/**
 * Get delivery notes
 */
export async function getDeliveryNotes(
  params?: GetDeliveryNotesParams
): Promise<{ data: DeliveryNote[]; pagination: any }> {
  try {
    const queryParams = new URLSearchParams()
    if (params?.orderId) queryParams.append('orderId', params.orderId)
    if (params?.producerId) queryParams.append('producerId', params.producerId)
    if (params?.status) queryParams.append('status', params.status)
    if (params?.search) queryParams.append('search', params.search)
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    const query = queryParams.toString()
    const response = await apiFetch<{ success: boolean; data: { data: DeliveryNote[]; pagination: any } }>(
      `/admin/contracts/delivery-notes${query ? `?${query}` : ''}`
    )

    if (!response.success || !response.data) {
      throw new Error('Failed to get delivery notes')
    }

    return response.data
  } catch (error) {
    console.warn('[Contracts API] Failed to get delivery notes:', error)
    return {
      data: [],
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || 20,
        total: 0,
        totalPages: 0,
      },
    }
  }
}

/**
 * Create delivery note
 */
export async function createDeliveryNote(
  input: Omit<DeliveryNote, 'id' | 'noteNumber' | 'status' | 'createdAt' | 'updatedAt' | 'order' | 'producer'> & {
    orderId: string
    producerId: string
    items: Array<{
      productId?: string
      productName: string
      quantity: number
      unit?: string
      orderItemId?: string
    }>
  }
): Promise<DeliveryNote> {
  try {
    const response = await apiFetch<{ success: boolean; data: DeliveryNote }>(
      '/admin/contracts/delivery-notes',
      {
        method: 'POST',
        body: JSON.stringify(input),
      }
    )

    if (!response.success || !response.data) {
      throw new Error('Failed to create delivery note')
    }

    return response.data
  } catch (error) {
    console.error('[Contracts API] Failed to create delivery note:', error)
    throw error
  }
}

