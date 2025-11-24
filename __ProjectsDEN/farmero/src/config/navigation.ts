/**
 * Navigation Configuration
 * 
 * Centralized navigation links configuration used across:
 * - Desktop navbar
 * - Mobile sidebar
 * - Mega menus
 * 
 * This ensures consistency and makes it easy to update links in one place.
 * 
 * Uses routes from @/lib/routes for type-safe routing.
 */

import { routes } from '@/lib/routes'

export interface NavLink {
  href: string
  labelKey: string // i18n translation key
  fallbackLabel: string // Fallback if translation is missing
}

export interface NavSection {
  titleKey?: string
  fallbackTitle?: string
  links: NavLink[]
}

/**
 * Main navigation links (visible in both desktop and mobile)
 */
export const mainNavLinks: NavLink[] = [
  { href: routes.home, labelKey: 'navbar.home', fallbackLabel: 'Acasă' },
  { href: routes.products.list, labelKey: 'common.products', fallbackLabel: 'Produse' },
  { href: routes.producers.list, labelKey: 'footer.localProducers', fallbackLabel: 'Producători locali' },
  { href: routes.about, labelKey: 'footer.about', fallbackLabel: 'Despre' },
  { href: routes.howItWorks, labelKey: 'footer.howItWorks', fallbackLabel: 'Cum funcționează' },
]

/**
 * Producer portal links (for mobile sidebar accordion)
 */
export const producerNavLinks: NavLink[] = [
  { href: routes.forProducers, labelKey: 'footer.whySell', fallbackLabel: 'De ce să vinzi pe farme.ro' },
  { href: routes.producerPortal.dashboard, labelKey: 'nav.producerDashboard', fallbackLabel: 'Dashboard producător' },
  { href: routes.producerPortal.products, labelKey: 'nav.manageProducts', fallbackLabel: 'Gestionează produse' },
  { href: routes.producerPortal.orders, labelKey: 'navbar.orders', fallbackLabel: 'Comenzi' },
  { href: routes.producerPortal.commissions, labelKey: 'footer.commissions', fallbackLabel: 'Comisioane & abonamente' },
  { href: routes.producerPortal.support, labelKey: 'nav.producerSupport', fallbackLabel: 'Suport producători' },
]

/**
 * Additional links for mobile sidebar
 */
export const additionalNavLinks: NavLink[] = [
  { href: routes.fees, labelKey: 'nav.fees', fallbackLabel: 'Comisioane & taxe' },
]

/**
 * Get all navigation links for mobile sidebar
 * Combines main links + producer links (in accordion) + additional links
 */
export function getMobileNavLinks() {
  return {
    main: mainNavLinks,
    producers: producerNavLinks,
    additional: additionalNavLinks,
  }
}

