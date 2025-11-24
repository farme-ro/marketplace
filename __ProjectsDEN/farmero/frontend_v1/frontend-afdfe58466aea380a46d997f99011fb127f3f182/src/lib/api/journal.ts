/**
 * Journal API
 * 
 * API functions for managing journal articles (Jurnal de farme.ro)
 * Uses apiFetch to call https://api.farme.ro (external backend API)
 * 
 * IMPORTANT: Backend-ul este într-un repo separat (api.farme.ro).
 * Aceste funcții sunt doar API contracts și fallback-uri pentru frontend.
 * 
 * Note: Backend endpoints need to be implemented in the separate backend repository:
 * - GET /journal - Get list of published journal articles
 * - GET /journal/:slug - Get journal article by slug
 * 
 * FALLBACK: If journal is disabled in BackendSyncStatus, returns empty array / throws error
 */

import { apiFetch, ApiError } from './client'
import { isBackendSyncEnabled } from '@/lib/backend-sync/status'
import type { DomainJournalArticle } from '@/lib/types/domain'

// ============================================================================
// Demo Data (Development Only)
// ============================================================================

/**
 * Demo articles for development mode when backend is not ready
 * Only used when NODE_ENV === 'development' and journal feature is disabled
 */
function getDemoArticles(): DomainJournalArticle[] {
  const now = new Date()
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

  return [
    {
      id: 'demo-1',
      slug: 'povestea-mierii-din-inima-maramuresului',
      title: 'Povestea mierii din inima Maramureșului',
      excerpt: 'În inima Maramureșului, familia Popescu păstrează tradițiile strămoșești de apicultură. Descoperă cum transformă florile sălbatice în miere autentică, fără compromisuri.',
      content: `
        <h2>O tradiție de generații</h2>
        <p>În inima Maramureșului, familia Popescu păstrează tradițiile strămoșești de apicultură. De peste trei generații, ei transformă florile sălbatice din pădurile locale în miere autentică, fără compromisuri.</p>
        
        <h2>Procesul natural</h2>
        <p>Fiecare sticlă de miere spune o poveste. De la albinele care colectează nectarul din salcâm, tei și castan, până la procesarea manuală care păstrează toate proprietățile benefice, totul se face cu respect pentru natură.</p>
        
        <blockquote>
          "Nu folosim niciodată zahăr sau aditivi. Mierea noastră este 100% naturală, exact cum o făceau bunicii noștri."
        </blockquote>
        
        <h2>Comunitatea din spatele produselor</h2>
        <p>Ferma Popescu nu este doar o afacere - este o modalitate de viață. Fiecare membru al familiei contribuie la proces, de la îngrijirea albinelor până la ambalarea finală.</p>
      `,
      coverImageUrl: null,
      producerId: 'demo-producer-1',
      producerName: 'Ferma Popescu',
      producerSlug: 'ferma-popescu',
      status: 'published',
      publishedAt: oneMonthAgo.toISOString(),
      createdAt: twoMonthsAgo.toISOString(),
      updatedAt: oneMonthAgo.toISOString(),
    },
    {
      id: 'demo-2',
      slug: 'cum-creste-familia-ionescu-legume-fara-compromisuri',
      title: 'Cum crește familia Ionescu legume fără compromisuri',
      excerpt: 'De la sămânță la masă, familia Ionescu cultivă legume organice folosind doar metode tradiționale. Fără pesticide, fără OMG, doar respect pentru pământ și pentru oameni.',
      content: `
        <h2>De la sămânță la masă</h2>
        <p>De la sămânță la masă, familia Ionescu cultivă legume organice folosind doar metode tradiționale. Fără pesticide, fără OMG, doar respect pentru pământ și pentru oameni.</p>
        
        <h2>Metode tradiționale</h2>
        <p>Fiecare legumă este crescută cu grijă, respectând ciclurile naturale ale anotimpurilor. Folosim doar îngrășăminte naturale și rotirea culturilor pentru a menține pământul sănătos.</p>
        
        <h2>Comunitatea locală</h2>
        <p>Produsele noastre ajung direct de la câmp la masă, fără intermediari. Astfel, clienții primesc legume proaspete, iar noi putem să ne concentrăm pe calitate, nu pe cantitate.</p>
      `,
      coverImageUrl: null,
      producerId: 'demo-producer-2',
      producerName: 'Ferma Ionescu',
      producerSlug: 'ferma-ionescu',
      status: 'published',
      publishedAt: twoMonthsAgo.toISOString(),
      createdAt: new Date(twoMonthsAgo.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: twoMonthsAgo.toISOString(),
    },
    {
      id: 'demo-3',
      slug: 'traditii-vechi-produse-noi-cum-pastram-autenticitatea',
      title: 'Tradiții vechi, produse noi: cum păstrăm autenticitatea',
      excerpt: 'În era tehnologiei, ferma Georgescu combină metode tradiționale cu inovații moderne pentru a produce brânzeturi de excepție, păstrând autenticitatea rețetelor de familie.',
      content: `
        <h2>Combinând tradiția cu inovația</h2>
        <p>În era tehnologiei, ferma Georgescu combină metode tradiționale cu inovații moderne pentru a produce brânzeturi de excepție, păstrând autenticitatea rețetelor de familie.</p>
        
        <h2>Rețete de familie</h2>
        <p>Fiecare brânză este făcută după rețete transmise de la bunici la părinți și acum la noi. Procesul de maturare durează luni, dar rezultatul merită așteptarea.</p>
        
        <h2>Respect pentru animale</h2>
        <p>Caprele noastre sunt crescute în libertate, cu acces la pășuni verzi și îngrijire veterinară de cea mai bună calitate. Credem că animalele fericite produc brânzeturi mai bune.</p>
      `,
      coverImageUrl: null,
      producerId: 'demo-producer-3',
      producerName: 'Ferma Georgescu',
      producerSlug: 'ferma-georgescu',
      status: 'published',
      publishedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]
}

// ============================================================================
// API Functions
// ============================================================================

export interface GetJournalArticlesParams {
  page?: number
  limit?: number
  producerId?: string
  status?: 'draft' | 'review' | 'approved' | 'published'
}

export interface JournalArticlesResponse {
  data: DomainJournalArticle[]
  meta?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

/**
 * Get list of journal articles
 * 
 * @param params - Query parameters (page, limit, producerId, status)
 * @returns Array of journal articles
 * @throws ApiError if request fails
 * 
 * FALLBACK: Returns empty array if backend is not enabled
 */
export async function getJournalArticles(
  params?: GetJournalArticlesParams
): Promise<DomainJournalArticle[]> {
  // In development mode, return demo articles if backend is not enabled
  if (!isBackendSyncEnabled('journal')) {
    if (process.env.NODE_ENV === 'development') {
      const demoArticles = getDemoArticles()
      // Apply filters if needed
      let filtered = demoArticles
      if (params?.producerId) {
        filtered = filtered.filter((a) => a.producerId === params.producerId)
      }
      // Simulate pagination
      const page = params?.page || 1
      const limit = params?.limit || 20
      const start = (page - 1) * limit
      const end = start + limit
      return filtered.slice(start, end)
    }
    return []
  }

  try {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.producerId) queryParams.append('producerId', params.producerId)
    if (params?.status) queryParams.append('status', params.status)
    else queryParams.append('status', 'published') // Default to published

    const queryString = queryParams.toString()
    const path = `/journal${queryString ? `?${queryString}` : ''}`

    const response = await apiFetch<DomainJournalArticle[] | JournalArticlesResponse>(path, {
      method: 'GET',
      credentials: 'include',
    })

    // Handle both array and paginated response formats
    if (Array.isArray(response)) {
      return response
    }
    return response.data || []
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      // Endpoint not found - backend not ready yet
      return []
    }
    throw error
  }
}

/**
 * Get journal article by slug
 * 
 * @param slug - Article slug
 * @returns Journal article
 * @throws ApiError if request fails or article not found
 * 
 * FALLBACK: Throws error with "Coming soon" message if backend is not enabled
 */
export async function getJournalArticleBySlug(slug: string): Promise<DomainJournalArticle> {
  // In development mode, return demo article if backend is not enabled
  if (!isBackendSyncEnabled('journal')) {
    if (process.env.NODE_ENV === 'development') {
      const demoArticles = getDemoArticles()
      const article = demoArticles.find((a) => a.slug === slug)
      if (article) {
        return article
      }
      throw new ApiError('Articolul nu a fost găsit.', 404, { slug })
    }
    throw new ApiError(
      'Jurnal de farme.ro este în pregătire. Vom reveni curând cu povești noi.',
      503,
      { feature: 'journal', status: 'coming_soon' }
    )
  }

  try {
    const response = await apiFetch<DomainJournalArticle | { data: DomainJournalArticle }>(
      `/journal/${slug}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    )

    // Handle both direct object and wrapped response formats
    if ('data' in response && response.data) {
      return response.data
    }
    return response as DomainJournalArticle
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      throw new ApiError('Articolul nu a fost găsit.', 404, { slug })
    }
    throw error
  }
}

/**
 * Get producer's journal articles
 * 
 * @returns Array of journal articles for the authenticated producer
 * @throws ApiError if request fails or producer doesn't have access
 */
export async function getProducerJournalArticles(): Promise<DomainJournalArticle[]> {
  if (!isBackendSyncEnabled('journal')) {
    return []
  }

  try {
    const response = await apiFetch<DomainJournalArticle[] | { data: DomainJournalArticle[] }>(
      '/producers/me/journal',
      {
        method: 'GET',
        credentials: 'include',
      }
    )

    if (Array.isArray(response)) {
      return response
    }
    return response.data || []
  } catch (error) {
    if (error instanceof ApiError && error.status === 403) {
      throw new ApiError(
        'Jurnal de farme.ro este disponibil pentru planurile de promovare Farmero.',
        403,
        { feature: 'journal', access: 'denied' }
      )
    }
    throw error
  }
}

/**
 * Request a new journal article
 * 
 * @param request - Article request data
 * @returns Request confirmation
 */
export async function requestJournalArticle(request: {
  subject: string
  idea: string
  season?: string
}): Promise<{ id: string; status: string; message: string }> {
  if (!isBackendSyncEnabled('journal')) {
    throw new ApiError(
      'Funcționalitatea nu este disponibilă momentan.',
      503,
      { feature: 'journal', status: 'coming_soon' }
    )
  }

  try {
    return await apiFetch('/producers/me/journal/request-article', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(request),
    })
  } catch (error) {
    if (error instanceof ApiError && error.status === 403) {
      throw new ApiError(
        'Jurnal de farme.ro este disponibil pentru planurile de promovare Farmero.',
        403,
        { feature: 'journal', access: 'denied' }
      )
    }
    throw error
  }
}

/**
 * Get or create a session ID for unique views tracking
 */
function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return ''
  
  const key = 'farmero_journal_session_id'
  let sessionId = localStorage.getItem(key)
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem(key, sessionId)
  }
  
  return sessionId
}

/**
 * Track metrics event for a journal article
 * 
 * @param articleId - Article ID
 * @param type - Event type
 * @param sessionId - Session ID for unique views (optional, will be generated if not provided)
 */
export async function trackJournalMetrics(
  articleId: string,
  type: 'view' | 'click_producer' | 'click_product',
  sessionId?: string
): Promise<void> {
  if (!isBackendSyncEnabled('journal')) {
    return // Fail silently if backend is not enabled
  }

  try {
    await apiFetch(`/journal/${articleId}/metrics/event`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        type,
        sessionId: sessionId || getOrCreateSessionId(),
      }),
    })
  } catch (error) {
    // Fail silently - metrics tracking should not break the UI
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn('[Journal Metrics] Failed to track event:', error)
    }
  }
}

