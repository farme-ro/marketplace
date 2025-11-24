/**
 * System & Config API Functions
 * 
 * Functions for system status, health checks, and feature flags
 */

import { apiFetch } from './client'

// ==================== HEALTH & STATUS ====================

export interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded'
  version?: string
  uptime?: number
  database?: {
    status: 'connected' | 'disconnected'
  }
  timestamp?: string
}

export interface ServiceHealth {
  name: string
  status: 'up' | 'degraded' | 'down'
  responseTime?: number // milliseconds
  message?: string
  lastChecked?: string
}

export interface SystemHealthResponse {
  overall: HealthStatus | null
  services: ServiceHealth[]
}

export async function getHealthStatus(): Promise<HealthStatus | null> {
  try {
    return await apiFetch<HealthStatus>('/health')
  } catch (err) {
    // Health endpoint might not exist
    return null
  }
}

/**
 * Get health status for multiple services
 */
export async function getSystemHealth(): Promise<SystemHealthResponse> {
  const services: ServiceHealth[] = []
  
  // Main backend API
  try {
    const startTime = Date.now()
    const health = await apiFetch<HealthStatus>('/health')
    const responseTime = Date.now() - startTime
    
    services.push({
      name: 'Backend Core API',
      status: health?.status === 'healthy' ? 'up' : health?.status === 'degraded' ? 'degraded' : 'down',
      responseTime,
      lastChecked: new Date().toISOString(),
    })
  } catch (err) {
    services.push({
      name: 'Backend Core API',
      status: 'down',
      message: 'Endpoint /health nu este disponibil',
      lastChecked: new Date().toISOString(),
    })
  }

  // Database health (if available in main health)
  // This would come from the main /health endpoint if it includes DB status
  
  // Payments health (optional)
  try {
    const startTime = Date.now()
    await apiFetch('/health/payments')
    const responseTime = Date.now() - startTime
    services.push({
      name: 'Payments',
      status: 'up',
      responseTime,
      lastChecked: new Date().toISOString(),
    })
  } catch (err) {
    // Endpoint doesn't exist - don't add to services or mark as unavailable
  }

  // Journal health (optional)
  try {
    const startTime = Date.now()
    await apiFetch('/health/journal')
    const responseTime = Date.now() - startTime
    services.push({
      name: 'Journal Module',
      status: 'up',
      responseTime,
      lastChecked: new Date().toISOString(),
    })
  } catch (err) {
    // Endpoint doesn't exist
  }

  // Email/Notifications health (optional)
  try {
    const startTime = Date.now()
    await apiFetch('/health/notifications')
    const responseTime = Date.now() - startTime
    services.push({
      name: 'Email / Notifications',
      status: 'up',
      responseTime,
      lastChecked: new Date().toISOString(),
    })
  } catch (err) {
    // Endpoint doesn't exist
  }

  // Get overall health
  const overall = await getHealthStatus()

  return {
    overall,
    services,
  }
}

// ==================== ERROR STATS ====================

export interface ErrorSummary {
  totalErrors24h: number
  errorsByEndpoint: Array<{
    endpoint: string
    method: string
    errorCount: number
    lastError?: string
  }>
  recentErrors: Array<{
    id: string
    message: string
    endpoint?: string
    method?: string
    statusCode?: number
    timestamp: string
  }>
}

export async function getErrorSummary(): Promise<ErrorSummary | null> {
  try {
    return await apiFetch<ErrorSummary>('/admin/system/errors-summary')
  } catch (err) {
    // Endpoint might not exist
    return null
  }
}

// ==================== TEST EVENT ====================

export interface TestEventResponse {
  success: boolean
  eventId?: string
  message?: string
}

export async function sendTestEvent(): Promise<TestEventResponse> {
  try {
    return await apiFetch<TestEventResponse>('/admin/system/test-error', {
      method: 'POST',
    })
  } catch (err) {
    // Endpoint might not exist - in dev, we can throw a test error
    if (process.env.NODE_ENV === 'development') {
      // This will be caught by Sentry/logger if configured
      console.error('[TEST ERROR] Manual test error triggered from admin panel', {
        timestamp: new Date().toISOString(),
        source: 'admin-panel',
      })
      return {
        success: true,
        message: 'Test error logged to console (dev mode)',
      }
    }
    return {
      success: false,
      message: 'Endpoint /admin/system/test-error nu este disponibil',
    }
  }
}

// ==================== FEATURE FLAGS ====================

export interface FeatureFlag {
  name: string
  status: 'active' | 'fallback' | 'partial' | 'off'
  description?: string
  source: 'frontend' | 'backend' | 'admin'
  scope?: 'core commerce' | 'experimental' | 'beta' | 'internal'
  location?: string // e.g., 'frontend/src/lib/backend-sync/status.ts'
  editable?: boolean // Whether this flag can be modified via UI
}

export interface FeatureFlagsResponse {
  flags: FeatureFlag[]
  readOnly: boolean // true if backend endpoint doesn't exist
}

export async function getFeatureFlags(): Promise<FeatureFlagsResponse> {
  try {
    const flags = await apiFetch<FeatureFlag[]>('/admin/feature-flags')
    return {
      flags,
      readOnly: false,
    }
  } catch (err) {
    // Feature flags endpoint might not exist
    // Return expected features based on frontend BackendSyncStatus
    // Mark as read-only / static
    return {
      flags: [
        {
          name: 'cart',
          status: 'active',
          description: 'Coș de cumpărături',
          source: 'frontend',
          scope: 'core commerce',
          location: 'frontend/src/lib/backend-sync/status.ts',
          editable: false,
        },
        {
          name: 'checkout',
          status: 'active',
          description: 'Proces de checkout',
          source: 'frontend',
          scope: 'core commerce',
          location: 'frontend/src/lib/backend-sync/status.ts',
          editable: false,
        },
        {
          name: 'clientOrders',
          status: 'active',
          description: 'Comenzi clienți',
          source: 'frontend',
          scope: 'core commerce',
          location: 'frontend/src/lib/backend-sync/status.ts',
          editable: false,
        },
        {
          name: 'producerProducts',
          status: 'active',
          description: 'Produse producători',
          source: 'frontend',
          scope: 'core commerce',
          location: 'frontend/src/lib/backend-sync/status.ts',
          editable: false,
        },
        {
          name: 'producerOrders',
          status: 'active',
          description: 'Comenzi producători',
          source: 'frontend',
          scope: 'core commerce',
          location: 'frontend/src/lib/backend-sync/status.ts',
          editable: false,
        },
        {
          name: 'journal',
          status: 'partial',
          description: 'Jurnal de farme.ro',
          source: 'frontend',
          scope: 'beta',
          location: 'frontend/src/lib/backend-sync/status.ts',
          editable: false,
        },
        {
          name: 'subscriptions',
          status: 'active',
          description: 'Abonamente clienți și producători',
          source: 'frontend',
          scope: 'core commerce',
          location: 'frontend/src/lib/backend-sync/status.ts',
          editable: false,
        },
        {
          name: 'promotions',
          status: 'active',
          description: 'Campanii de promovare',
          source: 'frontend',
          scope: 'core commerce',
          location: 'frontend/src/lib/backend-sync/status.ts',
          editable: false,
        },
        {
          name: 'documents',
          status: 'active',
          description: 'Documente și contracte',
          source: 'frontend',
          scope: 'core commerce',
          location: 'frontend/src/lib/backend-sync/status.ts',
          editable: false,
        },
        {
          name: 'logistics',
          status: 'active',
          description: 'Portal logistic',
          source: 'frontend',
          scope: 'core commerce',
          location: 'frontend/src/lib/backend-sync/status.ts',
          editable: false,
        },
        {
          name: 'b2b',
          status: 'active',
          description: 'Portal B2B',
          source: 'frontend',
          scope: 'core commerce',
          location: 'frontend/src/lib/backend-sync/status.ts',
          editable: false,
        },
        {
          name: 'favorites',
          status: 'active',
          description: 'Produse favorite',
          source: 'frontend',
          scope: 'core commerce',
          location: 'frontend/src/lib/backend-sync/status.ts',
          editable: false,
        },
        {
          name: 'notifications',
          status: 'active',
          description: 'Sistem notificări',
          source: 'frontend',
          scope: 'core commerce',
          location: 'frontend/src/lib/backend-sync/status.ts',
          editable: false,
        },
        {
          name: 'growthEngine',
          status: 'off',
          description: 'Growth Engine - tracking, campanii, nudges',
          source: 'frontend',
          scope: 'beta',
          location: 'frontend/src/lib/backend-sync/status.ts',
          editable: false,
        },
        {
          name: 'aiAssistant',
          status: 'off',
          description: 'AI Assistant - FAQ, checkout helper, producer tips',
          source: 'frontend',
          scope: 'beta',
          location: 'frontend/src/lib/backend-sync/status.ts',
          editable: false,
        },
      ],
      readOnly: true,
    }
  }
}

/**
 * Update a feature flag (if backend supports it)
 */
export async function updateFeatureFlag(
  name: string,
  enabled: boolean
): Promise<FeatureFlag> {
  return apiFetch<FeatureFlag>(`/admin/feature-flags/${name}`, {
    method: 'PATCH',
    body: JSON.stringify({ enabled }),
  })
}

// ==================== ENVIRONMENT INFO ====================

export interface EnvInfo {
  environment: 'dev' | 'staging' | 'prod' | 'local'
  backendUrl: string
  frontendUrl: string
  adminUrl: string
  version?: string
  buildTime?: string
}

export async function getEnvInfo(): Promise<EnvInfo> {
  try {
    return await apiFetch<EnvInfo>('/admin/system/info')
  } catch (err) {
    // Fallback to environment variables
    const env = (process.env.NEXT_PUBLIC_APP_ENV || 'local') as EnvInfo['environment']
    const backendUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'
    const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://farme.ro'
    const adminUrl =
      typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_ADMIN_URL || 'https://admin.farme.ro'

    return {
      environment: env,
      backendUrl,
      frontendUrl,
      adminUrl,
    }
  }
}

// ==================== JOURNAL ADMIN ====================

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

export async function publishJournalArticle(id: string): Promise<JournalArticle> {
  return apiFetch<JournalArticle>(`/admin/journal/articles/${id}/publish`, {
    method: 'POST',
  })
}

// ==================== SUBSCRIPTIONS & PROMOTIONS ====================

export interface ProducerSubscription {
  id: string
  producerId: string
  producerName: string
  planName: string
  startDate: string
  renewsAt?: string
  status: 'active' | 'expired' | 'cancelled'
}

export interface ClientSubscription {
  id: string
  clientId: string
  clientName: string
  producerId: string
  producerName: string
  frequency: 'weekly' | 'biweekly' | 'monthly'
  status: 'active' | 'paused' | 'cancelled'
  nextDelivery?: string
}

export interface PromotionCampaign {
  id: string
  producerId: string
  producerName: string
  channel: 'marketplace' | 'social' | 'newsletter'
  status: 'active' | 'paused' | 'completed'
  budget?: number
  periodStart?: string
  periodEnd?: string
}

export async function getProducerSubscriptions(): Promise<ProducerSubscription[]> {
  try {
    const response = await apiFetch<{ subscriptions: ProducerSubscription[] }>(
      '/admin/subscriptions/producers'
    )
    return response.subscriptions
  } catch (err) {
    // Endpoint might not exist
    return []
  }
}

export async function getClientSubscriptions(): Promise<ClientSubscription[]> {
  try {
    const response = await apiFetch<{ subscriptions: ClientSubscription[] }>(
      '/admin/subscriptions/clients'
    )
    return response.subscriptions
  } catch (err) {
    // Endpoint might not exist
    return []
  }
}

export async function getPromotionCampaigns(): Promise<PromotionCampaign[]> {
  try {
    const response = await apiFetch<{ campaigns: PromotionCampaign[] }>(
      '/admin/promotions/campaigns'
    )
    return response.campaigns
  } catch (err) {
    // Endpoint might not exist
    return []
  }
}

