/**
 * Script Loader for Cookie Consent
 * 
 * Controls loading of non-essential scripts (analytics, marketing)
 * based on user consent
 */

import { getCurrentConsent, isCategoryConsented } from './cookie-consent'

/**
 * Initialize analytics scripts if user has consented
 */
export function initAnalyticsIfConsented(): void {
  if (typeof window === 'undefined') {
    return
  }

  if (!isCategoryConsented('analytics')) {
    if (process.env.NODE_ENV === 'development') {
      console.info('[Analytics] User has not consented to analytics cookies')
    }
    return
  }

  // Note: Initialize Google Analytics or other analytics tools when provider is configured
  // Example:
  // if (window.gtag) {
  //   window.gtag('consent', 'update', {
  //     analytics_storage: 'granted'
  //   })
  // }
  
  if (process.env.NODE_ENV === 'development') {
    console.info('[Analytics] Analytics scripts initialized (consent granted)')
  }
}

/**
 * Initialize marketing scripts if user has consented
 */
export function initMarketingIfConsented(): void {
  if (typeof window === 'undefined') {
    return
  }

  if (!isCategoryConsented('marketing')) {
    if (process.env.NODE_ENV === 'development') {
      console.info('[Marketing] User has not consented to marketing cookies')
    }
    return
  }

  // Note: Initialize Meta Pixel, Google Ads, or other marketing tools when provider is configured
  // Example:
  // if (window.fbq) {
  //   window.fbq('consent', 'grant')
  // }
  
  if (process.env.NODE_ENV === 'development') {
    console.info('[Marketing] Marketing scripts initialized (consent granted)')
  }
}

/**
 * Initialize functional scripts if user has consented
 */
export function initFunctionalIfConsented(): void {
  if (typeof window === 'undefined') {
    return
  }

  if (!isCategoryConsented('functional')) {
    if (process.env.NODE_ENV === 'development') {
      console.info('[Functional] User has not consented to functional cookies')
    }
    return
  }

  // Note: Initialize functional scripts (e.g., chat widgets, personalization) when needed
  
  if (process.env.NODE_ENV === 'development') {
    console.info('[Functional] Functional scripts initialized (consent granted)')
  }
}

/**
 * Reinitialize all scripts based on current consent
 * Call this when user updates their preferences
 */
export function reinitializeScripts(): void {
  initAnalyticsIfConsented()
  initMarketingIfConsented()
  initFunctionalIfConsented()
}

/**
 * Stop analytics tracking (when user revokes consent)
 */
export function stopAnalytics(): void {
  // Note: Stop analytics tracking when user revokes consent
  // Example:
  // if (window.gtag) {
  //   window.gtag('consent', 'update', {
  //     analytics_storage: 'denied'
  //   })
  // }
  
  if (process.env.NODE_ENV === 'development') {
    console.info('[Analytics] Analytics tracking stopped')
  }
}

/**
 * Stop marketing tracking (when user revokes consent)
 */
export function stopMarketing(): void {
  // Note: Stop marketing tracking when user revokes consent
  // Example:
  // if (window.fbq) {
  //   window.fbq('consent', 'revoke')
  // }
  
  if (process.env.NODE_ENV === 'development') {
    console.info('[Marketing] Marketing tracking stopped')
  }
}

