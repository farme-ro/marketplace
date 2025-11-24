/**
 * Unified Subscriptions API
 * 
 * API layer for client and producer subscriptions using DomainSubscription types
 * Integrates with BackendSyncStatus for fallback mode
 */

import { apiFetch } from './client'
import { isBackendSyncEnabled } from '@/lib/backend-sync/status'
import type { DomainSubscription, SubscriptionFrequency, SubscriptionStatus } from '@/lib/types/domain'

/**
 * Get client subscriptions
 */
export async function getClientSubscriptions(): Promise<DomainSubscription[]> {
  if (!isBackendSyncEnabled('subscriptions')) {
    // Fallback: return empty array
    return []
  }

  try {
    const response = await apiFetch<DomainSubscription[]>('/clients/subscriptions', {
      method: 'GET',
    })
    return response || []
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('[Subscriptions API] Failed to load client subscriptions:', error)
    }
    return []
  }
}

/**
 * Get producer subscriptions (subscriptions from clients to this producer)
 */
export async function getProducerSubscriptions(): Promise<DomainSubscription[]> {
  if (!isBackendSyncEnabled('subscriptions')) {
    // Fallback: return empty array
    return []
  }

  try {
    const response = await apiFetch<DomainSubscription[]>('/producer/subscriptions', {
      method: 'GET',
    })
    return response || []
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('[Subscriptions API] Failed to load producer subscriptions:', error)
    }
    return []
  }
}

/**
 * Create subscription from cart
 */
export async function createSubscriptionFromCart(
  cartId: string,
  frequency: SubscriptionFrequency
): Promise<DomainSubscription> {
  if (!isBackendSyncEnabled('subscriptions')) {
    // Fallback: return mock subscription
    return {
      id: `sub-${Date.now()}`,
      clientId: 'current-user',
      producerId: 'producer-id',
      items: [],
      frequency,
      nextDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      createdAt: new Date().toISOString(),
    }
  }

  try {
    const response = await apiFetch<DomainSubscription>('/clients/subscriptions', {
      method: 'POST',
      body: JSON.stringify({ cartId, frequency }),
    })
    return response || {
      id: `sub-${Date.now()}`,
      clientId: 'current-user',
      producerId: 'producer-id',
      items: [],
      frequency,
      nextDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      createdAt: new Date().toISOString(),
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('[Subscriptions API] Failed to create subscription:', error)
    }
    throw error
  }
}

/**
 * Update subscription status
 */
export async function updateSubscriptionStatus(
  id: string,
  status: SubscriptionStatus
): Promise<DomainSubscription> {
  if (!isBackendSyncEnabled('subscriptions')) {
    throw new Error('Subscriptions feature is not enabled')
  }

  try {
    const response = await apiFetch<DomainSubscription>(`/clients/subscriptions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
    return response!
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error(`[Subscriptions API] Failed to update subscription ${id}:`, error)
    }
    throw error
  }
}

