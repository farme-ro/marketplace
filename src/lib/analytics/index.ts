/**
 * Analytics Module - Public API
 * 
 * Export all analytics functions from a single entry point
 */

export { trackEvent, trackPageView, trackError } from './tracker'
export type { EventName, EventData } from './tracker'
export { ANALYTICS_ENABLED, ANALYTICS_PROVIDER, ANALYTICS_DEBUG } from './config'
export type { AnalyticsProvider } from './config'

