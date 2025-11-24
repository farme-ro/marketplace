/**
 * Content Management API Functions
 * 
 * Functions for managing static pages, FAQ, and i18n content
 */

import { apiFetch } from './client'
import type { PaginatedResponse } from './types'

// ==================== TYPES ====================

export type AdminPageType = 'info' | 'legal' | 'help' | 'donations'
export type AdminPageStatus = 'draft' | 'published' | 'archived'

export interface AdminLocalizedContent {
  locale: string // 'ro', 'en', 'fr', 'it', 'de', 'es', 'uk', 'hu'
  title: string
  body: string
}

export interface AdminPage {
  id: string
  slug: string
  type: AdminPageType
  status: AdminPageStatus
  contents: AdminLocalizedContent[]
  updatedAt: string
  createdAt?: string
}

export interface GetAdminPagesParams {
  type?: AdminPageType
  status?: AdminPageStatus
  search?: string
  page?: number
  limit?: number
}

export interface UpdateAdminPagePayload {
  type?: AdminPageType
  status?: AdminPageStatus
  contents?: AdminLocalizedContent[]
}

// ==================== FAQ TYPES ====================

export type FaqCategory = 'clients' | 'producers' | 'delivery_payments' | 'legal' | 'other'

export interface AdminFaqEntry {
  id: string
  key: string // e.g., 'faq.delivery.returns'
  category: FaqCategory
  status: 'published' | 'draft'
  order: number
  questions: Record<string, string> // { 'ro': 'Întrebare?', 'en': 'Question?' }
  answers: Record<string, string> // { 'ro': 'Răspuns.', 'en': 'Answer.' }
  createdAt?: string
  updatedAt?: string
}

export interface CreateFaqEntryPayload {
  key: string
  category: FaqCategory
  status?: 'published' | 'draft'
  order?: number
  questions: Record<string, string>
  answers: Record<string, string>
}

export interface UpdateFaqEntryPayload {
  key?: string
  category?: FaqCategory
  status?: 'published' | 'draft'
  order?: number
  questions?: Record<string, string>
  answers?: Record<string, string>
}

// ==================== PAGES API ====================

/**
 * Get all admin pages with filters
 */
export async function getAdminPages(
  params?: GetAdminPagesParams
): Promise<PaginatedResponse<AdminPage>> {
  const queryParams = new URLSearchParams()
  if (params?.type) queryParams.append('type', params.type)
  if (params?.status) queryParams.append('status', params.status)
  if (params?.search) queryParams.append('search', params.search)
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.limit) queryParams.append('limit', params.limit.toString())

  const query = queryParams.toString()
  try {
    return await apiFetch<PaginatedResponse<AdminPage>>(
      `/admin/content/pages${query ? `?${query}` : ''}`
    )
  } catch (err) {
    console.warn('Backend endpoint for admin pages not found, returning fallback data.', err)
    return {
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    }
  }
}

/**
 * Get a single admin page by ID
 */
export async function getAdminPageById(id: string): Promise<AdminPage | null> {
  try {
    return await apiFetch<AdminPage>(`/admin/content/pages/${id}`)
  } catch (err) {
    console.warn('Backend endpoint for admin page by ID not found.', err)
    return null
  }
}

/**
 * Update an admin page
 */
export async function updateAdminPage(
  id: string,
  payload: UpdateAdminPagePayload
): Promise<AdminPage> {
  try {
    return await apiFetch<AdminPage>(`/admin/content/pages/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
  } catch (err) {
    console.warn('Backend endpoint for updating admin page not found.', err)
    throw err
  }
}

// ==================== FAQ API ====================

/**
 * Get all FAQ entries
 */
export async function getAdminFaqEntries(params?: {
  category?: FaqCategory
  status?: 'published' | 'draft'
  search?: string
}): Promise<AdminFaqEntry[]> {
  const queryParams = new URLSearchParams()
  if (params?.category) queryParams.append('category', params.category)
  if (params?.status) queryParams.append('status', params.status)
  if (params?.search) queryParams.append('search', params.search)

  const query = queryParams.toString()
  try {
    return await apiFetch<AdminFaqEntry[]>(`/admin/content/faq${query ? `?${query}` : ''}`)
  } catch (err) {
    console.warn('Backend endpoint for FAQ entries not found, returning fallback data.', err)
    return []
  }
}

/**
 * Create a new FAQ entry
 */
export async function createAdminFaqEntry(
  payload: CreateFaqEntryPayload
): Promise<AdminFaqEntry> {
  try {
    return await apiFetch<AdminFaqEntry>('/admin/content/faq', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  } catch (err) {
    console.warn('Backend endpoint for creating FAQ entry not found.', err)
    throw err
  }
}

/**
 * Update an FAQ entry
 */
export async function updateAdminFaqEntry(
  id: string,
  payload: UpdateFaqEntryPayload
): Promise<AdminFaqEntry> {
  try {
    return await apiFetch<AdminFaqEntry>(`/admin/content/faq/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
  } catch (err) {
    console.warn('Backend endpoint for updating FAQ entry not found.', err)
    throw err
  }
}

/**
 * Delete (soft-delete) an FAQ entry
 */
export async function deleteAdminFaqEntry(id: string): Promise<{ success: boolean }> {
  try {
    return await apiFetch<{ success: boolean }>(`/admin/content/faq/${id}`, {
      method: 'DELETE',
    })
  } catch (err) {
    console.warn('Backend endpoint for deleting FAQ entry not found.', err)
    throw err
  }
}

