/**
 * Cookie Consent Management
 * 
 * Handles user consent for different cookie categories
 * GDPR-compliant cookie consent system
 */

export type CookieConsentCategory = 'necessary' | 'analytics' | 'functional' | 'marketing'

export interface CookieConsentState {
  necessary: true // Always true, cannot be disabled
  analytics: boolean
  functional: boolean
  marketing: boolean
}

export interface CookieConsentStored {
  consent: CookieConsentState
  updatedAt: string // ISO date
  version: string // ex. '1.0'
}

const STORAGE_KEY = 'farmero_cookie_consent_v1'

/**
 * Get stored cookie consent
 */
export function getCookieConsent(): CookieConsentStored | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return null
    }

    const parsed = JSON.parse(stored) as CookieConsentStored
    return parsed
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('[Cookie Consent] Failed to parse stored consent:', error)
    }
    return null
  }
}

/**
 * Save cookie consent to localStorage
 */
export function saveCookieConsent(consent: CookieConsentState): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    const stored: CookieConsentStored = {
      consent: {
        necessary: true, // Always true
        analytics: consent.analytics ?? false,
        functional: consent.functional ?? false,
        marketing: consent.marketing ?? false,
      },
      updatedAt: new Date().toISOString(),
      version: '1.0',
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('[Cookie Consent] Failed to save consent:', error)
    }
  }
}

/**
 * Check if user has made a cookie choice
 */
export function hasUserMadeCookieChoice(): boolean {
  return getCookieConsent() !== null
}

/**
 * Get current consent state (defaults to all false except necessary)
 */
export function getCurrentConsent(): CookieConsentState {
  const stored = getCookieConsent()
  if (!stored) {
    return {
      necessary: true,
      analytics: false,
      functional: false,
      marketing: false,
    }
  }

  return stored.consent
}

/**
 * Check if a specific category is consented
 */
export function isCategoryConsented(category: CookieConsentCategory): boolean {
  const consent = getCurrentConsent()
  
  if (category === 'necessary') {
    return true // Always true
  }

  return consent[category] === true
}

/**
 * Accept all cookies
 */
export function acceptAllCookies(): void {
  saveCookieConsent({
    necessary: true,
    analytics: true,
    functional: true,
    marketing: true,
  })
}

/**
 * Reject all optional cookies (only necessary)
 */
export function rejectOptionalCookies(): void {
  saveCookieConsent({
    necessary: true,
    analytics: false,
    functional: false,
    marketing: false,
  })
}

