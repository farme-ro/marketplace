/**
 * Backend Sync Status Configuration
 * 
 * Acest fișier controlează ce funcționalități sunt conectate live la backend
 * și ce funcționalități sunt încă în fallback mode.
 * 
 * Folosește acest status pentru:
 * - Afișarea fallback-urilor când endpoint-ul nu e încă live
 * - Prevenirea crash-urilor
 * - Testarea incrementală a funcționalităților
 * 
 * IMPORTANT: Setează `true` doar când endpoint-ul este complet funcțional și testat.
 */

export const BackendSyncStatus = {
  // Client Profile & Addresses
  clientProfile: true, // ✅ GET /clients/me, PATCH /clients/me - Implementat în backend
  clientAddresses: true, // ✅ GET /clients/addresses, POST/PATCH/DELETE /clients/addresses/:id - Implementat în backend

  // Cart & Checkout
  cart: true, // ✅ POST /cart/items, GET /cart, PATCH/PUT /cart/items/:id, DELETE /cart/items/:id - Implementat în backend
  checkout: true, // ✅ POST /orders/checkout - Implementat în backend

  // Client Orders
  clientOrders: true, // ✅ GET /orders, GET /orders/:id - Implementat în backend

  // Producer Portal
  producerProducts: true, // ✅ GET /producers/products, POST/PATCH/DELETE /producers/products/:id - Implementat în backend
  producerOrders: true, // ✅ GET /producers/orders, GET /producers/orders/:id, PATCH /producers/orders/:id/status - Implementat în backend

  // Favorites
  favorites: true, // ✅ GET /clients/favorites, POST /clients/favorites, DELETE /clients/favorites/:id - Implementat în backend

  // Subscription Baskets
  subscriptions: true, // ✅ GET /clients/subscriptions, POST /clients/subscriptions, PATCH /clients/subscriptions/:id - Implementat în backend

  // Silent Alerts
  alerts: true, // ✅ GET /clients/alert-preferences, PATCH /clients/alert-preferences - Implementat în backend

  // Business Portal
  businessDashboard: true, // ✅ GET /business/* - Implementat în backend

  // Logistics Portal
  logisticsDashboard: true, // ✅ GET /logistics/* - Implementat în backend

  // Investor Portal
  investorDashboard: true, // ✅ GET /investor/* - Implementat în backend
  investorMetrics: true, // ✅ GET /investor/metrics - Implementat în backend

  // Notifications System
  notifications: true, // ✅ GET /notifications/* - Implementat în backend

  // Producer Marketing & Monetization
  producerMarketing: true, // ✅ GET /producers/featured - Implementat în backend

  // Client Subscriptions (Public)
  subscriptionsClient: true, // ✅ GET /subscriptions/public/plans - Implementat în backend

  // Client Subscriptions (Active)
  subscriptionsClientActive: true, // ✅ GET /clients/subscriptions - Implementat în backend (deja activat ca 'subscriptions')

  // Producer Subscriptions (Tiers)
  subscriptionsProducer: true, // ✅ GET /producers/subscriptions - Implementat în backend

  // Farmero Points & Rewards
  farmeroPoints: true, // ✅ GET /farmero-points/* - Implementat în backend

  // Parties & Contracts
  partiesAndContracts: true, // ✅ GET /contracts, GET /parties/* - Implementat în backend

  // Fees & Statements
  feesAndStatements: true, // ✅ GET /fees/*, GET /statements - Implementat în backend

  // Donations
  donations: true, // ✅ GET /donations/* - Implementat în backend

  // Documents & Contracts
  documents: true, // ✅ GET /documents/* - Implementat în backend

  // Subscriptions (Client & Producer) - deja activat ca 'subscriptions' mai sus
  // subscriptions: true, // ✅ Duplicat - deja activat mai sus

  // Promotions & Marketing
  promotions: true, // ✅ GET /producer/promotions/* - Implementat în backend

  // Investor Metrics (Anonymized) - duplicat cu investorMetrics
  // investorMetrics: false, // ⚠️ Duplicat - deja definit mai sus

  // Shipments & AWB
  shipments: true, // ✅ GET /logistics/shipments - Implementat în backend

  // Journal de farme.ro
  journal: true, // ✅ GET /journal, GET /journal/:slug - Implementat în backend (cu suport traduceri)

  // Growth Engine
  growthEngine: false, // ⚠️ POST /growth/events, GET /admin/growth/* - Implementat în backend, dar dezactivat pentru testare incrementală

  // AI Assistant
  aiAssistant: false, // ⚠️ POST /ai/assistant, GET /admin/ai/interactions - Implementat în backend, dar dezactivat pentru testare incrementală
} as const

export type BackendSyncFeature = keyof typeof BackendSyncStatus

/**
 * Check if a feature is enabled
 */
export function isBackendSyncEnabled(feature: BackendSyncFeature): boolean {
  return BackendSyncStatus[feature] === true
}

/**
 * Get all enabled features
 */
export function getEnabledFeatures(): BackendSyncFeature[] {
  return Object.entries(BackendSyncStatus)
    .filter(([_, enabled]) => enabled === true)
    .map(([feature]) => feature as BackendSyncFeature)
}

/**
 * Get all disabled features
 */
export function getDisabledFeatures(): BackendSyncFeature[] {
  return Object.entries(BackendSyncStatus)
    .filter(([_, enabled]) => enabled === false)
    .map(([feature]) => feature as BackendSyncFeature)
}

