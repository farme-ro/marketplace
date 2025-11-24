/**
 * AI Assistant API Client (Admin)
 * 
 * API functions for viewing AI interactions in admin
 */

import { apiFetch } from './admin'

// ============================================================================
// Types
// ============================================================================

export type AiRole = 'client' | 'producer' | 'support' | 'admin'

export interface AiInteraction {
  id: string
  userId?: string
  role: AiRole
  context: Record<string, any>
  question: string
  answer: string
  suggestedLinks?: Array<{ url: string; label: string }>
  createdAt: string
}

export interface GetAiInteractionsParams {
  role?: AiRole
  userId?: string
  search?: string
  page?: number
  limit?: number
}

export interface GetAiInteractionsResponse {
  data: AiInteraction[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get AI interactions (admin only)
 */
export async function getAiInteractions(
  params?: GetAiInteractionsParams
): Promise<GetAiInteractionsResponse> {
  try {
    const queryParams = new URLSearchParams()
    if (params?.role) queryParams.append('role', params.role)
    if (params?.userId) queryParams.append('userId', params.userId)
    if (params?.search) queryParams.append('search', params.search)
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    const query = queryParams.toString()
    const response = await apiFetch<{ success: boolean; data: GetAiInteractionsResponse }>(
      `/admin/ai/interactions${query ? `?${query}` : ''}`
    )

    if (!response.success || !response.data) {
      throw new Error('Failed to get AI interactions')
    }

    return response.data
  } catch (error) {
    console.warn('[AI Assistant API] Failed to get interactions:', error)
    // Return empty response on error
    return {
      data: [],
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || 50,
        total: 0,
        totalPages: 0,
      },
    }
  }
}

