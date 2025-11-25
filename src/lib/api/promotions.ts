/**
 * Promotions API
 * 
 * API layer for producer promotions and marketing
 * Integrates with BackendSyncStatus for fallback mode
 */

import { apiFetch } from './client'
import { isBackendSyncEnabled } from '@/lib/backend-sync/status'
import type {
  DomainPromotionSubscription,
  DomainPromotionCampaign,
  PromotionTier,
  PromotionChannel,
  PromotionCampaignStatus,
} from '@/lib/types/domain'

/**
 * Get promotion subscription for current producer
 */
export async function getPromotionSubscriptionForProducer(): Promise<DomainPromotionSubscription | null> {
  if (!isBackendSyncEnabled('promotions')) {
    return null
  }

  try {
    const response = await apiFetch<DomainPromotionSubscription>('/producer/promotions/subscription', {
      method: 'GET',
    })
    return response || null
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('[Promotions API] Failed to load subscription:', error)
    }
    return null
  }
}

/**
 * Get promotion campaigns for current producer
 */
export async function getPromotionCampaigns(): Promise<DomainPromotionCampaign[]> {
  if (!isBackendSyncEnabled('promotions')) {
    return []
  }

  try {
    const response = await apiFetch<DomainPromotionCampaign[]>('/producer/promotions/campaigns', {
      method: 'GET',
    })
    return response || []
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('[Promotions API] Failed to load campaigns:', error)
    }
    return []
  }
}

/**
 * Create a new promotion campaign
 */
export async function createPromotionCampaign(
  input: Omit<DomainPromotionCampaign, 'id' | 'producerId' | 'createdAt' | 'updatedAt'>
): Promise<DomainPromotionCampaign> {
  if (!isBackendSyncEnabled('promotions')) {
    // Fallback: return mock campaign
    return {
      id: `campaign-${Date.now()}`,
      producerId: 'current-producer',
      ...input,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }

  try {
    const response = await apiFetch<DomainPromotionCampaign>('/producer/promotions/campaigns', {
      method: 'POST',
      body: JSON.stringify(input),
    })
    return response || {
      id: `campaign-${Date.now()}`,
      producerId: 'current-producer',
      ...input,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('[Promotions API] Failed to create campaign:', error)
    }
    throw error
  }
}

