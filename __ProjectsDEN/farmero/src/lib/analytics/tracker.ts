/**
 * Analytics Event Tracker
 * 
 * Sistem centralizat pentru tracking evenimente analytics.
 * 
 * Folosire:
 * ```ts
 * import { trackEvent } from '@/lib/analytics/tracker'
 * 
 * trackEvent('subscription_view', { planId: 'premium' })
 * trackEvent('producer_profile_opened', { producerId: '123' })
 * trackEvent('donation_intent_click')
 * ```
 * 
 * TODO: Când vei integra un provider concret (GA, Plausible, etc.):
 * 1. Actualizează `ANALYTICS_PROVIDER` în `config.ts`
 * 2. Adaugă implementarea provider-ului în `providers/`
 * 3. Actualizează `trackEvent` să folosească provider-ul
 */

import { ANALYTICS_ENABLED, ANALYTICS_PROVIDER, ANALYTICS_DEBUG } from './config'

/**
 * Event data type - flexible object for event properties
 */
export type EventData = Record<string, string | number | boolean | null | undefined>

/**
 * Common event names
 * 
 * TODO: Extinde acest tip când adaugi evenimente noi
 */
export type EventName =
  // Subscription events
  | 'subscription_view'
  | 'subscription_plan_selected'
  | 'subscription_created'
  | 'subscription_cancelled'
  | 'subscription_paused'
  | 'subscription_resumed'
  
  // Producer events
  | 'producer_profile_opened'
  | 'producer_profile_contact_click'
  | 'producer_product_view'
  | 'producer_subscription_upgrade_click'
  
  // Product events
  | 'product_view'
  | 'product_add_to_cart'
  | 'product_favorite_toggle'
  | 'product_share'
  
  // Cart & Checkout events
  | 'cart_view'
  | 'cart_item_added'
  | 'cart_item_removed'
  | 'checkout_started'
  | 'checkout_completed'
  | 'checkout_abandoned'
  
  // Donation events
  | 'donation_intent_click'
  | 'donation_amount_selected'
  | 'donation_completed'
  
  // Account events
  | 'account_switched'
  | 'account_created'
  | 'login_success'
  | 'logout'
  
  // Search & Discovery
  | 'search_performed'
  | 'filter_applied'
  | 'category_viewed'
  | 'region_selected'
  
  // Navigation events
  | 'page_view'
  | 'link_clicked'
  | 'button_clicked'
  
  // Error events
  | 'error_occurred'
  
  // Custom events (fallback)
  | string

/**
 * Track an analytics event
 * 
 * @param eventName - Name of the event
 * @param data - Optional event data/properties
 * 
 * @example
 * ```ts
 * trackEvent('subscription_view', { planId: 'premium', price: 99 })
 * trackEvent('producer_profile_opened', { producerId: '123', producerName: 'Ferma X' })
 * trackEvent('donation_intent_click')
 * ```
 */
export function trackEvent(eventName: EventName, data?: EventData): void {
  // If analytics is disabled and not in debug mode, do nothing
  if (!ANALYTICS_ENABLED && !ANALYTICS_DEBUG) {
    return
  }

  // Prepare event payload
  const eventPayload = {
    event: eventName,
    data: data || {},
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : undefined,
    path: typeof window !== 'undefined' ? window.location.pathname : undefined,
  }

  // Debug logging (always in development, or when enabled)
  if ((ANALYTICS_DEBUG || (!ANALYTICS_ENABLED && ANALYTICS_DEBUG)) && process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.debug('[Analytics]', eventPayload)
  }

  // TODO: Integrate actual analytics provider here
  // Example structure:
  // switch (ANALYTICS_PROVIDER) {
  //   case 'google-analytics':
  //     gtag('event', eventName, data)
  //     break
  //   case 'plausible':
  //     plausible(eventName, { props: data })
  //     break
  //   case 'custom':
  //     customAnalytics.track(eventName, data)
  //     break
  //   case 'none':
  //   default:
  //     // Already handled by console.debug above
  //     break
  // }

  // For now, just log to console if enabled
  if (ANALYTICS_ENABLED && ANALYTICS_PROVIDER === 'none') {
    // Silent - no action needed, but structure is ready
    // When you integrate a provider, remove this comment and add the integration
  }
}

/**
 * Track page view
 * 
 * Convenience function for tracking page views
 * 
 * @param path - Page path (defaults to current pathname)
 * @param title - Page title (optional)
 */
export function trackPageView(path?: string, title?: string): void {
  const currentPath = path || (typeof window !== 'undefined' ? window.location.pathname : '/')
  const pageTitle = title || (typeof document !== 'undefined' ? document.title : undefined)
  
  trackEvent('page_view', {
    path: currentPath,
    title: pageTitle,
  })
}

/**
 * Track error event
 * 
 * Convenience function for tracking errors
 * 
 * @param error - Error object or message
 * @param context - Additional context data
 */
export function trackError(
  error: Error | string,
  context?: EventData
): void {
  const errorMessage = error instanceof Error ? error.message : error
  const errorStack = error instanceof Error ? error.stack : undefined
  
  trackEvent('error_occurred', {
    error: errorMessage,
    stack: errorStack,
    ...context,
  })
}

