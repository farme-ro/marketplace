/**
 * Centralized Routes Configuration
 * 
 * Type-safe routes for the entire application.
 * All public routes are localized in Romanian.
 * API routes remain in English.
 * 
 * @example
 * ```tsx
 * import { routes } from '@/lib/routes'
 * 
 * <Link href={routes.products.list}>Produse</Link>
 * <Link href={routes.products.detail('produs-slug')}>Vezi produs</Link>
 * ```
 */

export const routes = {
  // Homepage
  home: '/',

  // Products
  products: {
    list: '/produse',
    detail: (slug: string) => `/produse/${slug}`,
  },

  // Producers
  producers: {
    list: '/producatori',
    detail: (slug: string) => `/producatori/${slug}`,
    products: (slug: string) => `/producatori/${slug}#products`,
  },

  // Public Pages
  about: '/despre-noi',
  fees: '/comisioane-taxe',
  faq: '/intrebari-frecvente',
  contact: '/contact',
  howItWorks: '/cum-functioneaza-si-impact',
  forProducers: '/pentru-producatori',
  b2b: '/b2b',
  logistics: '/pentru-logistica',
  investors: '/pentru-investitori',
  importers: '/pentru-importatori',
  support: '/sustine-farmero',
  
  // Journal de farme.ro
  journal: {
    list: '/jurnal-de-farmero',
    detail: (slug: string) => `/jurnal-de-farmero/${slug}`,
  },

  // Authentication
  login: '/login',
  register: '/register',
  selectAccount: '/select-account',
  forgotPassword: '/resetare-parola',

  // Client Portal
  account: {
    home: '/contul-meu',
    favorites: '/contul-meu/favorite',
    subscriptions: '/contul-meu/subscriptions',
  },
  cart: '/cos',
  checkout: '/finalizare-comanda',
  orders: {
    list: '/comenzi',
    detail: (id: string) => `/comenzi/${id}`,
  },

  // Producer Portal
  producerPortal: {
    dashboard: '/portal-producatori/dashboard',
    orders: '/portal-producatori/comenzi',
    orderDetail: (id: string) => `/portal-producatori/comenzi/${id}`,
    products: '/portal-producatori/produse',
    productNew: '/portal-producatori/produse/adauga',
    productEdit: (id: string) => `/portal-producatori/produse/${id}/editeaza`,
    salesCommissions: '/portal-producatori/sales-commissions',
    commissions: '/portal-producatori/comisioane',
    statements: (id: string) => `/portal-producatori/statements/${id}`,
    documents: '/portal-producatori/documente',
    contracts: '/portal-producatori/contracte',
    contractDetail: (id: string) => `/portal-producatori/contracte/${id}`,
    marketing: '/portal-producatori/marketing-promovare',
    subscriptions: '/portal-producatori/abonamente',
    journal: '/portal-producatori/jurnal',
    settings: '/portal-producatori/settings',
    support: '/portal-producatori/suport',
    insights: '/portal-producatori/insights',
    shippingGuide: '/portal-producatori/ghid-livrare',
    guide: '/portal-producatori/ghid-producatori',
    finances: '/portal-producatori/finante',
    inventory: '/portal-producatori/inventory',
    messages: '/portal-producatori/messages',
    impact: '/portal-producatori/impact',
    login: '/portal-producatori/login',
    register: '/portal-producatori/register',
  },

  // Business Portal
  businessPortal: {
    dashboard: '/portal-business/dashboard',
    documents: '/portal-business/documents',
    contractDetail: (id: string) => `/portal-business/contracts/${id}`,
    login: '/portal-business/login',
    register: '/portal-business/register',
  },

  // Logistics Portal
  logisticsPortal: {
    dashboard: '/portal-logistica/dashboard',
    commissions: '/portal-logistica/commissions',
    statements: (id: string) => `/portal-logistica/statements/${id}`,
    contracts: '/portal-logistica/contracts',
    shipments: '/portal-logistica/shipments',
    login: '/portal-logistica/login',
    register: '/portal-logistica/register',
  },

  // Investor Portal
  investorPortal: {
    dashboard: '/portal-investitori/dashboard',
    login: '/portal-investitori/login',
    register: '/portal-investitori/register',
  },

  // Importer Portal
  importerPortal: {
    dashboard: '/portal-importatori/dashboard',
    login: '/portal-importatori/login',
    register: '/portal-importatori/register',
  },

  // Legal Pages
  terms: '/terms',
  privacy: '/privacy',
  cookies: '/cookies',
  gdpr: '/gdpr',
  anpc: '/anpc',

  // Utility Pages
  status: '/status',
  thankYou: '/multumim',
} as const

/**
 * Helper function to check if a route is a portal route
 */
export function isPortalRoute(path: string): boolean {
  return (
    path.startsWith('/portal-producatori') ||
    path.startsWith('/portal-business') ||
    path.startsWith('/portal-logistica') ||
    path.startsWith('/portal-investitori') ||
    path.startsWith('/portal-importatori')
  )
}

/**
 * Helper function to get the portal type from a route
 */
export function getPortalType(path: string): 'producer' | 'business' | 'logistics' | 'investor' | 'importer' | null {
  if (path.startsWith('/portal-producatori')) return 'producer'
  if (path.startsWith('/portal-business')) return 'business'
  if (path.startsWith('/portal-logistica')) return 'logistics'
  if (path.startsWith('/portal-investitori')) return 'investor'
  if (path.startsWith('/portal-importatori')) return 'importer'
  return null
}


