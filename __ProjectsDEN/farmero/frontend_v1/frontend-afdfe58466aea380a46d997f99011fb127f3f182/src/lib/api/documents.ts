/**
 * Documents API
 * 
 * API layer for document management (contracts, invoices, statements, etc.)
 * Integrates with BackendSyncStatus for fallback mode
 */

import { apiFetch } from './client'
import { isBackendSyncEnabled } from '@/lib/backend-sync/status'
import type { DomainDocument, DomainContractDraft, DomainContractTemplate } from '@/lib/types/domain'

/**
 * Get all documents for the current user
 * Based on user role/portal context
 */
export async function getDocumentsForCurrentUser(): Promise<DomainDocument[]> {
  if (!isBackendSyncEnabled('documents')) {
    // Fallback: return empty array
    return []
  }

  try {
    const response = await apiFetch<DomainDocument[]>('/documents', {
      method: 'GET',
    })
    return response || []
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('[Documents API] Failed to load documents:', error)
    }
    return []
  }
}

/**
 * Get a specific document by ID
 */
export async function getDocumentById(id: string): Promise<DomainDocument | null> {
  if (!isBackendSyncEnabled('documents')) {
    return null
  }

  try {
    const response = await apiFetch<DomainDocument>(`/documents/${id}`, {
      method: 'GET',
    })
    return response || null
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error(`[Documents API] Failed to load document ${id}:`, error)
    }
    return null
  }
}

/**
 * Create a contract draft
 * 
 * @param input Contract draft data
 * @returns Created contract draft with ID
 */
export async function createContractDraft(input: DomainContractDraft): Promise<DomainContractDraft & { id: string }> {
  if (!isBackendSyncEnabled('documents')) {
    // Fallback: return mock draft
    return {
      ...input,
      id: `draft-${Date.now()}`,
    }
  }

  try {
    const response = await apiFetch<DomainContractDraft & { id: string }>('/documents/contracts/draft', {
      method: 'POST',
      body: JSON.stringify(input),
    })
    return response || { ...input, id: `draft-${Date.now()}` }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('[Documents API] Failed to create contract draft:', error)
    }
    // Return mock draft even on error
    return {
      ...input,
      id: `draft-${Date.now()}`,
    }
  }
}

/**
 * Get available contract templates
 */
export async function getContractTemplates(): Promise<DomainContractTemplate[]> {
  if (!isBackendSyncEnabled('documents')) {
    // Fallback: return mock templates
    return [
      {
        id: 'template-producer-platform',
        type: 'producer_platform',
        name: 'Contract Producător – Farmero',
        description: 'Contract standard pentru producători care vând pe platformă',
        version: '1.0',
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'template-logistics-platform',
        type: 'logistics_platform',
        name: 'Contract Logistică – Farmero',
        description: 'Contract pentru parteneri de logistică',
        version: '1.0',
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'template-business-platform',
        type: 'business_platform',
        name: 'Contract Business – Farmero',
        description: 'Contract pentru clienți business',
        version: '1.0',
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    ]
  }

  try {
    const response = await apiFetch<DomainContractTemplate[]>('/documents/contracts/templates', {
      method: 'GET',
    })
    return response || []
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('[Documents API] Failed to load contract templates:', error)
    }
    return []
  }
}

