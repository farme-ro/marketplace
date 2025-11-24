/**
 * Support & User Timeline API Functions
 * 
 * Functions for support operations and user 360° view
 */

import { apiFetch } from './client'
import type { PaginatedResponse } from './types'

// ==================== TYPES ====================

export interface UserNote {
  id: string
  userId: string
  text: string
  author: {
    id: string
    email: string
    fullName: string
  }
  createdAt: string
  updatedAt?: string
}

export interface CreateUserNotePayload {
  text: string
}

export interface UserTimelineEvent {
  id: string
  type: 'order' | 'subscription' | 'journal' | 'audit' | 'note'
  title: string
  description?: string
  timestamp: string
  metadata?: Record<string, any>
}

// ==================== USER SEARCH ====================

export interface SearchUsersParams {
  query: string
  page?: number
  limit?: number
}

/**
 * Search users (wrapper over existing /admin/users endpoint)
 */
export async function searchUsers(
  params: SearchUsersParams
): Promise<PaginatedResponse<any>> {
  const queryParams = new URLSearchParams()
  queryParams.append('search', params.query)
  if (params.page) queryParams.append('page', params.page.toString())
  if (params.limit) queryParams.append('limit', params.limit.toString())

  try {
    return await apiFetch<PaginatedResponse<any>>(`/admin/users?${queryParams.toString()}`)
  } catch (err) {
    console.warn('Backend endpoint for user search not found.', err)
    return {
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    }
  }
}

// ==================== USER DETAILS ====================

/**
 * Get user by ID (reuse from admin.ts if available)
 */
export async function getUserById(id: string): Promise<any | null> {
  try {
    return await apiFetch<any>(`/admin/users/${id}`)
  } catch (err) {
    console.warn('Backend endpoint for user by ID not found.', err)
    return null
  }
}

/**
 * Get user orders
 */
export async function getUserOrders(userId: string): Promise<any[]> {
  try {
    return await apiFetch<any[]>(`/admin/users/${userId}/orders`)
  } catch (err) {
    console.warn('Backend endpoint for user orders not found.', err)
    return []
  }
}

/**
 * Get user subscriptions
 */
export async function getUserSubscriptions(userId: string): Promise<any[]> {
  try {
    return await apiFetch<any[]>(`/admin/users/${userId}/subscriptions`)
  } catch (err) {
    console.warn('Backend endpoint for user subscriptions not found.', err)
    return []
  }
}

/**
 * Get user journal articles (if user is producer)
 */
export async function getUserJournalArticles(userId: string): Promise<any[]> {
  try {
    return await apiFetch<any[]>(`/admin/users/${userId}/journal-articles`)
  } catch (err) {
    console.warn('Backend endpoint for user journal articles not found.', err)
    return []
  }
}

/**
 * Get user timeline (audit log events related to user)
 */
export async function getUserTimeline(userId: string): Promise<UserTimelineEvent[]> {
  try {
    return await apiFetch<UserTimelineEvent[]>(`/admin/users/${userId}/timeline`)
  } catch (err) {
    console.warn('Backend endpoint for user timeline not found.', err)
    return []
  }
}

// ==================== USER NOTES ====================

/**
 * Get user notes
 */
export async function getUserNotes(userId: string): Promise<UserNote[]> {
  try {
    return await apiFetch<UserNote[]>(`/admin/users/${userId}/notes`)
  } catch (err) {
    console.warn('Backend endpoint for user notes not found.', err)
    // Fallback: return empty array (notes will be in-memory only in dev)
    return []
  }
}

/**
 * Create user note
 */
export async function createUserNote(
  userId: string,
  payload: CreateUserNotePayload
): Promise<UserNote> {
  try {
    return await apiFetch<UserNote>(`/admin/users/${userId}/notes`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  } catch (err) {
    console.warn('Backend endpoint for creating user note not found.', err)
    // In dev, we can store notes in-memory as fallback
    if (process.env.NODE_ENV === 'development') {
      return {
        id: `temp-${Date.now()}`,
        userId,
        text: payload.text,
        author: {
          id: 'temp',
          email: 'dev@farme.ro',
          fullName: 'Dev Admin',
        },
        createdAt: new Date().toISOString(),
      }
    }
    throw err
  }
}

