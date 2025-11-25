/**
 * Growth Client
 * 
 * Client-side utilities for tracking growth events
 * Safe, non-blocking - won't break UX if backend is unavailable
 */

import { recordGrowthEvent, type CreateGrowthEventInput } from '@/lib/api/growth'

/**
 * Track a growth event
 * Safe wrapper that won't throw errors
 */
export async function trackEvent(
  eventType: string,
  payload: Omit<CreateGrowthEventInput, 'type'>
): Promise<void> {
  try {
    await recordGrowthEvent({
      type: eventType,
      ...payload,
    })
  } catch (error) {
    // Silently fail - don't break UX
    if (process.env.NODE_ENV === 'development') {
      console.debug('[Growth Client] Failed to track event:', error)
    }
  }
}

/**
 * Track page view
 */
export function trackPageView(page: string, metadata?: Record<string, any>): void {
  trackEvent('page_view', {
    source: page,
    metadata: {
      page,
      ...metadata,
    },
  })
}

/**
 * Track cart abandoned
 */
export function trackCartAbandoned(cartItemsCount: number, metadata?: Record<string, any>): void {
  trackEvent('cart_abandoned', {
    source: 'checkout',
    metadata: {
      cartItemsCount,
      ...metadata,
    },
  })
}

/**
 * Track subscription started
 */
export function trackSubscriptionStarted(subscriptionId: string, metadata?: Record<string, any>): void {
  trackEvent('subscription_started', {
    source: 'portal',
    metadata: {
      subscriptionId,
      ...metadata,
    },
  })
}

/**
 * Track journal viewed
 */
export function trackJournalViewed(metadata?: Record<string, any>): void {
  trackEvent('journal_viewed', {
    source: 'journal',
    metadata,
  })
}

/**
 * Track journal article viewed
 */
export function trackJournalArticleViewed(articleId: string, articleSlug: string, metadata?: Record<string, any>): void {
  trackEvent('journal_article_viewed', {
    source: 'journal',
    metadata: {
      articleId,
      articleSlug,
      ...metadata,
    },
  })
}

/**
 * Track checkout started
 */
export function trackCheckoutStarted(cartItemsCount: number, metadata?: Record<string, any>): void {
  trackEvent('checkout_started', {
    source: 'checkout',
    metadata: {
      cartItemsCount,
      ...metadata,
    },
  })
}

/**
 * Track checkout completed
 */
export function trackCheckoutCompleted(orderId: string, totalAmount: number, metadata?: Record<string, any>): void {
  trackEvent('checkout_completed', {
    source: 'checkout',
    metadata: {
      orderId,
      totalAmount,
      ...metadata,
    },
  })
}

