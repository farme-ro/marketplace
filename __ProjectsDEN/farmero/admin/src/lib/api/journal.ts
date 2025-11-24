/**
 * Journal Admin API
 * 
 * API functions for managing journal articles in admin panel
 */

import { apiFetch } from './client'

// ==================== TYPES ====================

export interface JournalArticle {
  id: string
  slug: string
  title: string
  excerpt: string
  content?: string
  coverImageUrl?: string
  producerId: string
  producerName: string
  producerSlug?: string
  status: 'draft' | 'review' | 'approved' | 'published' | 'archived'
  publishedAt?: string | null
  createdAt: string
  updatedAt: string
  metrics?: {
    views: number
    uniqueViews: number
    clicksToProducer: number
    clicksToProducts: number
  }
}

export interface JournalRevision {
  id: string
  articleId?: string
  version: number
  title: string
  excerpt: string
  content: string
  editorId?: string
  editorName?: string
  editor?: {
    id: string
    fullName: string
  } | null
  status: 'draft' | 'sent_to_review' | 'approved' | 'rejected'
  notes?: string | null
  createdAt: string
}

export interface GetJournalArticlesParams {
  status?: 'draft' | 'review' | 'approved' | 'published' | 'archived'
  producerId?: string
  search?: string
  page?: number
  limit?: number
}

export interface GetJournalArticlesResponse {
  data: JournalArticle[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface CreateRevisionParams {
  version: number
  title: string
  excerpt: string
  content: string
  status: 'draft' | 'sent_to_review' | 'approved' | 'rejected'
  notes?: string
}

// ==================== API FUNCTIONS ====================

export async function getJournalArticles(
  params?: GetJournalArticlesParams
): Promise<GetJournalArticlesResponse> {
  const queryParams = new URLSearchParams()
  if (params?.status) queryParams.append('status', params.status)
  if (params?.producerId) queryParams.append('producerId', params.producerId)
  if (params?.search) queryParams.append('search', params.search)
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.limit) queryParams.append('limit', params.limit.toString())

  const query = queryParams.toString()
  return apiFetch<GetJournalArticlesResponse>(
    `/admin/journal/articles${query ? `?${query}` : ''}`
  )
}

export async function getJournalArticle(id: string): Promise<JournalArticle> {
  return apiFetch<JournalArticle>(`/admin/journal/articles/${id}`)
}

export async function getJournalRevisions(
  articleId: string
): Promise<JournalRevision[]> {
  // Backend returns array directly, not wrapped in { data: [...] }
  return apiFetch<JournalRevision[]>(
    `/admin/journal/articles/${articleId}/revisions`
  )
}

export interface UpdateJournalArticleParams {
  title?: string
  excerpt?: string
  content?: string
  coverImageUrl?: string
  status?: 'draft' | 'review' | 'approved' | 'published' | 'archived'
}

export async function updateJournalArticle(
  id: string,
  params: UpdateJournalArticleParams
): Promise<JournalArticle> {
  return apiFetch<JournalArticle>(`/admin/journal/articles/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  })
}

export async function createJournalRevision(
  articleId: string,
  params: CreateRevisionParams
): Promise<JournalRevision> {
  return apiFetch<JournalRevision>(`/admin/journal/articles/${articleId}/revisions`, {
    method: 'POST',
    body: JSON.stringify(params),
  })
}

