/**
 * Farmero Marketing API
 * 
 * API functions for managing producer marketing settings and social media integration
 * Uses apiFetch to call https://api.farme.ro (external backend API)
 * 
 * IMPORTANT: Backend-ul este într-un repo separat (api.farme.ro).
 * Aceste funcții sunt doar API contracts și fallback-uri pentru frontend.
 * 
 * Note: Backend endpoints need to be implemented in the separate backend repository:
 * - GET /producer/marketing/settings - Get producer marketing settings
 * - PATCH /producer/marketing/settings - Update marketing settings
 * - GET /producer/marketing/promotion-tiers - Get available promotion tiers
 * - POST /producer/marketing/social/connect - Connect social platform
 * - DELETE /producer/marketing/social/disconnect - Disconnect social platform
 * 
 * FALLBACK: If producerMarketing is disabled in BackendSyncStatus, returns default values / throws error
 * 
 * See: docs/BACKEND_API_CONTRACT_FARMERO_MARKETING.md for API contract documentation
 */

import { apiFetch, ApiError } from './client'
import { isBackendSyncEnabled } from '@/lib/backend-sync/status'
import type {
  FarmeroMarketingSettings,
  UpdateMarketingSettingsInput,
  ConnectSocialPlatformResponse,
  SocialPlatform,
} from '@/lib/types/farmero-marketing'
import type { FarmeroProducerTier } from '@/lib/types/subscriptions'

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get producer marketing settings
 * 
 * @returns Producer marketing settings
 * @throws ApiError if request fails
 * 
 * FALLBACK: Returns default settings if backend is not enabled
 */
export async function getProducerMarketingSettings(): Promise<FarmeroMarketingSettings> {
  if (!isBackendSyncEnabled('producerMarketing')) {
    // Return default settings
    return {
      producerId: '',
      autoPostEnabled: false,
      postFrequency: 'weekly',
      platforms: [
        { platform: 'facebook', connected: false },
        { platform: 'instagram', connected: false },
        { platform: 'tiktok', connected: false },
      ],
    }
  }

  try {
    const response = await apiFetch<
      FarmeroMarketingSettings | { data: FarmeroMarketingSettings }
    >('/producer/marketing/settings', {
      method: 'GET',
      credentials: 'include',
    })

    if ('data' in response) {
      return response.data
    }
    return response
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat ca producător pentru a accesa setările de marketing.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a accesa setările de marketing.')
      }
      if (error.status === 404) {
        // No settings yet, return default
        return {
          producerId: '',
          autoPostEnabled: false,
          postFrequency: 'weekly',
          platforms: [
            { platform: 'facebook', connected: false },
            { platform: 'instagram', connected: false },
            { platform: 'tiktok', connected: false },
          ],
        }
      }
      throw error
    }
    throw error
  }
}

/**
 * Update producer marketing settings
 * 
 * @param input - Settings to update
 * @returns Updated marketing settings
 * @throws ApiError if request fails
 * 
 * FALLBACK: Throws error if backend is not enabled
 */
export async function updateProducerMarketingSettings(
  input: UpdateMarketingSettingsInput
): Promise<FarmeroMarketingSettings> {
  if (!isBackendSyncEnabled('producerMarketing')) {
    throw new Error('Marketingul nu este încă disponibil.')
  }

  try {
    const response = await apiFetch<
      FarmeroMarketingSettings | { data: FarmeroMarketingSettings }
    >('/producer/marketing/settings', {
      method: 'PATCH',
      credentials: 'include',
      body: JSON.stringify(input),
    })

    if ('data' in response) {
      return response.data
    }
    return response
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 400) {
        throw new Error('Date invalide. Verifică setările introduse.')
      }
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat ca producător pentru a actualiza setările de marketing.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a actualiza setările de marketing.')
      }
      throw error
    }
    throw error
  }
}

/**
 * Get producer promotion tiers
 * 
 * @returns List of available promotion tiers
 * @throws ApiError if request fails
 * 
 * FALLBACK: Returns empty array if backend is not enabled
 * 
 * NOTE: This may reuse FarmeroProducerTier from subscriptions, or be a separate type
 */
export async function getProducerPromotionTiers(): Promise<FarmeroProducerTier[]> {
  if (!isBackendSyncEnabled('producerMarketing')) {
    return []
  }

  try {
    const response = await apiFetch<
      FarmeroProducerTier[] | { data: FarmeroProducerTier[] }
    >('/producer/marketing/promotion-tiers', {
      method: 'GET',
      credentials: 'include',
    })

    if (Array.isArray(response)) {
      return response
    }
    if (response && 'data' in response && Array.isArray(response.data)) {
      return response.data
    }
    return []
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat ca producător pentru a vedea tier-urile de promovare.')
      }
      throw error
    }
    throw error
  }
}

/**
 * Connect social platform
 * 
 * @param platform - Platform to connect
 * @returns Connection response with auth URL or status
 * @throws ApiError if request fails
 * 
 * FALLBACK: Throws error if backend is not enabled
 */
export async function connectSocialPlatform(
  platform: SocialPlatform
): Promise<ConnectSocialPlatformResponse> {
  if (!isBackendSyncEnabled('producerMarketing')) {
    throw new Error('Marketingul nu este încă disponibil.')
  }

  try {
    const response = await apiFetch<
      ConnectSocialPlatformResponse | { data: ConnectSocialPlatformResponse }
    >('/producer/marketing/social/connect', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ platform }),
    })

    if ('data' in response) {
      return response.data
    }
    return response
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 400) {
        throw new Error('Platformă invalidă sau deja conectată.')
      }
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat ca producător pentru a conecta platforme sociale.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a conecta platforme sociale.')
      }
      throw error
    }
    throw error
  }
}

/**
 * Disconnect social platform
 * 
 * @param platform - Platform to disconnect
 * @returns Updated marketing settings
 * @throws ApiError if request fails
 * 
 * FALLBACK: Throws error if backend is not enabled
 */
export async function disconnectSocialPlatform(
  platform: SocialPlatform
): Promise<FarmeroMarketingSettings> {
  if (!isBackendSyncEnabled('producerMarketing')) {
    throw new Error('Marketingul nu este încă disponibil.')
  }

  try {
    const response = await apiFetch<
      FarmeroMarketingSettings | { data: FarmeroMarketingSettings }
    >(`/producer/marketing/social/disconnect?platform=${platform}`, {
      method: 'DELETE',
      credentials: 'include',
    })

    if ('data' in response) {
      return response.data
    }
    return response
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat ca producător pentru a deconecta platforme sociale.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a deconecta platforme sociale.')
      }
      if (error.status === 404) {
        throw new Error('Platforma nu este conectată.')
      }
      throw error
    }
    throw error
  }
}

