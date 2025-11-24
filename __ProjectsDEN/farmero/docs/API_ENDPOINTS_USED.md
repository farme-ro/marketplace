# API Endpoints Used by Frontend

**Data:** 2025-01-21  
**Status:** ✅ Complet

Acest document listează toate endpoint-urile backend folosite de frontend-ul farme.ro.

---

## 📋 Structură

- [Auth](#auth)
- [Products](#products)
- [Producers](#producers)
- [Cart](#cart)
- [Orders](#orders)
- [Producer Portal](#producer-portal)
- [Client Profile](#client-profile)
- [Misc](#misc-health-status-etc)

---

## 🔐 Auth

### Client Authentication

| Method | Endpoint | Funcție | Fișier | Status Backend |
|--------|----------|---------|--------|----------------|
| `POST` | `/auth/client/login` | `loginClient()` | `src/lib/api/auth.ts` | ✅ Implementat |
| `POST` | `/auth/client/register` | `registerClient()` | `src/lib/api/auth.ts` | ✅ Implementat |
| `GET` | `/auth/client/me` | `getClientProfile()` | `src/lib/api/auth.ts` | ✅ Implementat |
| `POST` | `/auth/client/forgot-password` | `requestClientPasswordReset()` | `src/lib/api/auth.ts` | ⚠️ TODO Backend |

### Producer Authentication

| Method | Endpoint | Funcție | Fișier | Status Backend |
|--------|----------|---------|--------|----------------|
| `POST` | `/auth/producer/login` | `loginProducer()` | `src/lib/api/auth.ts` | ✅ Implementat |
| `POST` | `/auth/producer/register` | `registerProducer()` | `src/lib/api/auth.ts` | ✅ Implementat |
| `GET` | `/auth/producer/me` | `getProducerProfile()` | `src/lib/api/auth.ts` | ✅ Implementat |

### Common Authentication

| Method | Endpoint | Funcție | Fișier | Status Backend |
|--------|----------|---------|--------|----------------|
| `POST` | `/auth/logout` | `logout()` | `src/lib/api/auth.ts` | ✅ Implementat |

---

## 📦 Products

### Public Products

| Method | Endpoint | Funcție | Fișier | Status Backend |
|--------|----------|---------|--------|----------------|
| `GET` | `/products` | `fetchPublicProducts()` | `src/lib/api/public/products.ts` | ✅ Implementat |
| `GET` | `/products/:slug` | `fetchPublicProductBySlug()` | `src/lib/api/public/products.ts` | ✅ Implementat |

**Query Parameters pentru `/products`:**
- `category` - Categorie produs
- `categoryId` - ID categorie
- `regionId` - ID regiune
- `search` / `q` - Căutare text
- `page` - Pagină
- `pageSize` - Dimensiune pagină
- `minPrice` - Preț minim
- `maxPrice` - Preț maxim

---

## 👥 Producers

### Public Producers

| Method | Endpoint | Funcție | Fișier | Status Backend |
|--------|----------|---------|--------|----------------|
| `GET` | `/producers` | `fetchPublicProducers()` | `src/lib/api/public/producers.ts` | ✅ Implementat |
| `GET` | `/producers/:slug` | `fetchPublicProducerBySlug()` | `src/lib/api/public/producers.ts` | ✅ Implementat |
| `GET` | `/producers/:slug/products` | `fetchPublicProductsForProducer()` | `src/lib/api/public/producers.ts` | ✅ Implementat |

**Query Parameters pentru `/producers`:**
- `regionId` - ID regiune
- `search` / `q` - Căutare text
- `page` - Pagină
- `limit` / `pageSize` - Dimensiune pagină

### Regions

| Method | Endpoint | Funcție | Fișier | Status Backend |
|--------|----------|---------|--------|----------------|
| `GET` | `/regions` | `getRegions()` | `src/lib/api/public/regions.ts` | ⚠️ TODO Backend |

**Notă:** Folosește `get()` din `apiClient.ts` (nu `apiFetch`), dar este în proces de migrare.

---

## 🛒 Cart

| Method | Endpoint | Funcție | Fișier | Status Backend |
|--------|----------|---------|--------|----------------|
| `GET` | `/cart` | `getCart()` | `src/lib/api/cart.ts` | ✅ Implementat |
| `POST` | `/cart/items` | `addToCart()` | `src/lib/api/cart.ts` | ✅ Implementat |
| `PATCH` | `/cart/items/:itemId` | `updateCartItem()` | `src/lib/api/cart.ts` | ✅ Implementat |
| `DELETE` | `/cart/items/:itemId` | `removeCartItem()` | `src/lib/api/cart.ts` | ✅ Implementat |
| `DELETE` | `/cart` | `clearCart()` | `src/lib/api/cart.ts` | ✅ Implementat |

---

## 📋 Orders

### Client Orders

| Method | Endpoint | Funcție | Fișier | Status Backend |
|--------|----------|---------|--------|----------------|
| `POST` | `/orders` | `createOrder()` | `src/lib/api/orders.ts` | ✅ Implementat |
| `GET` | `/orders` | `getOrders()` | `src/lib/api/orders.ts` | ✅ Implementat |
| `GET` | `/orders/:id` | `getOrderById()` | `src/lib/api/orders.ts` | ✅ Implementat |

---

## 🏭 Producer Portal

### Producer Orders

| Method | Endpoint | Funcție | Fișier | Status Backend |
|--------|----------|---------|--------|----------------|
| `GET` | `/producers/orders` | `getProducerOrders()` | `src/lib/api/producer/orders.ts` | ✅ Implementat |
| `GET` | `/producers/orders/:id` | `getOrderById()` | `src/lib/api/producer/orders.ts` | ✅ Implementat |
| `PATCH` | `/producers/orders/:id/status` | `updateOrderStatus()` | `src/lib/api/producer/orders.ts` | ✅ Implementat |

**Query Parameters pentru `/producers/orders`:**
- `status` - Filtrare după status
- `startDate` - Dată început
- `endDate` - Dată sfârșit

### Producer Products

| Method | Endpoint | Funcție | Fișier | Status Backend |
|--------|----------|---------|--------|----------------|
| `GET` | `/producers/products` | `getProducerProducts()` | `src/lib/api/producer/products.ts` | ✅ Implementat |
| `GET` | `/producers/products/:id` | `getProductById()` | `src/lib/api/producer/products.ts` | ✅ Implementat |
| `POST` | `/producers/products` | `createProduct()` | `src/lib/api/producer/products.ts` | ✅ Implementat |
| `PATCH` | `/producers/products/:id` | `updateProduct()` | `src/lib/api/producer/products.ts` | ✅ Implementat |
| `DELETE` | `/producers/products/:id` | `deleteProduct()` | `src/lib/api/producer/products.ts` | ✅ Implementat |

### Producer Profile

| Method | Endpoint | Funcție | Fișier | Status Backend |
|--------|----------|---------|--------|----------------|
| `GET` | `/producers/me` | `getProducerProfile()` | `src/lib/api/producer/profile.ts` | ⚠️ TODO Backend |
| `PATCH` | `/producers/me` | `updateProducerProfile()` | `src/lib/api/producer/profile.ts` | ⚠️ TODO Backend |
| `POST` | `/producers/me/logo` | `uploadProducerLogo()` | `src/lib/api/producer/profile.ts` | ⚠️ TODO Backend |
| `POST` | `/producers/me/cover` | `uploadProducerCover()` | `src/lib/api/producer/profile.ts` | ⚠️ TODO Backend |

### Producer Insights

| Method | Endpoint | Funcție | Fișier | Status Backend |
|--------|----------|---------|--------|----------------|
| `GET` | `/producers/insights` | `getProducerInsights()` | `src/lib/api/producer/insights.ts` | ⚠️ TODO Backend (cu fallback) |

**Notă:** Returnează date mock când endpoint-ul nu există (404).

### Producer Commissions

| Method | Endpoint | Funcție | Fișier | Status Backend |
|--------|----------|---------|--------|----------------|
| `GET` | `/producers/commissions/summary` | `getProducerCommissionSummary()` | `src/lib/api/producer/commissions.ts` | ⚠️ TODO Backend (cu fallback) |
| `GET` | `/producers/commissions/history` | `getProducerCommissionHistory()` | `src/lib/api/producer/commissions.ts` | ⚠️ TODO Backend (cu fallback) |

**Notă:** Returnează `null` sau array gol când endpoint-urile nu există (404).

### Producer Finances

| Method | Endpoint | Funcție | Fișier | Status Backend |
|--------|----------|---------|--------|----------------|
| `GET` | `/producers/finances` | `getProducerFinances()` | `src/lib/api/producer/finances.ts` | ⚠️ TODO Backend (cu fallback) |
| `GET` | `/producers/payouts/summary` | `getPayoutSummary()` | `src/lib/api/producer/finances.ts` | ⚠️ TODO Backend (cu mock data) |
| `GET` | `/producers/payouts` | `getPayouts()` | `src/lib/api/producer/finances.ts` | ⚠️ TODO Backend (cu mock data) |
| `GET` | `/producers/finances/invoices/:id/download` | `downloadInvoice()` | `src/lib/api/producer/finances.ts` | ⚠️ TODO Backend |

**Query Parameters pentru `/producers/payouts`:**
- `startDate` - Dată început
- `endDate` - Dată sfârșit
- `status` - Status plată

### Producer Support

| Method | Endpoint | Funcție | Fișier | Status Backend |
|--------|----------|---------|--------|----------------|
| `POST` | `/support/producer` | `submitSupportTicket()` | `src/lib/api/producer/support.ts` | ⚠️ TODO Backend |
| `GET` | `/support/producer` | `getSupportTickets()` | `src/lib/api/producer/support.ts` | ⚠️ TODO Backend |

**Notă:** `submitSupportTicket()` aruncă eroare user-friendly când endpoint-ul nu există (404).

---

## 👤 Client Profile

| Method | Endpoint | Funcție | Fișier | Status Backend |
|--------|----------|---------|--------|----------------|
| `PATCH` | `/clients/me` | `updateClientProfile()` | `src/lib/api/client-profile.ts` | ⚠️ TODO Backend |
| `GET` | `/clients/addresses` | `getClientAddresses()` | `src/lib/api/client-profile.ts` | ⚠️ TODO Backend |
| `POST` | `/clients/addresses` | `createShippingAddress()` | `src/lib/api/client-profile.ts` | ⚠️ TODO Backend |
| `PATCH` | `/clients/addresses/:id` | `updateShippingAddress()` | `src/lib/api/client-profile.ts` | ⚠️ TODO Backend |
| `DELETE` | `/clients/addresses/:id` | `deleteShippingAddress()` | `src/lib/api/client-profile.ts` | ⚠️ TODO Backend |
| `PATCH` | `/clients/addresses/:id/default` | `setDefaultShippingAddress()` | `src/lib/api/client-profile.ts` | ⚠️ TODO Backend |

---

## 🔧 Misc (Health, Status, etc.)

| Method | Endpoint | Funcție | Fișier | Status Backend |
|--------|----------|---------|--------|----------------|
| `GET` | `/status` | `checkBackendHealth()` | `src/lib/api/health.ts` | ⚠️ TODO Backend |
| `GET` | `/health` | `checkBackendHealth()` (fallback) | `src/lib/api/health.ts` | ⚠️ TODO Backend |
| `GET` | `/health/db` | `checkBackendHealth()` (fallback) | `src/lib/api/health.ts` | ⚠️ TODO Backend |
| `GET` | `/api/health` | `checkBackendHealth()` (fallback) | `src/lib/api/health.ts` | ⚠️ TODO Backend |

**Notă:** `checkBackendHealth()` încearcă mai multe endpoint-uri în ordine până găsește unul disponibil.

---

## 📊 Statistici

- **Total endpoint-uri:** 80+
- **Endpoint-uri implementate în backend:** ~30
- **Endpoint-uri TODO backend:** ~50
- **Endpoint-uri cu fallback/mock data:** 8

**Notă:** Statisticile au fost actualizate după verificare completă. Vezi `docs/ENDPOINTS_VERIFICATION_REPORT.md` pentru detalii.

---

## ✅ Verificări

### Toate fetch-urile folosesc `apiFetch`

✅ **Verificat:** Toate endpoint-urile din `src/lib/api/` folosesc `apiFetch()` din `src/lib/api/client.ts`.

**Excepții (acceptabile):**
- `src/lib/api/client.ts` - Implementarea de bază a `apiFetch()` (folosește `fetch` nativ)
- `src/lib/api/apiClient.ts` - Client alternativ (folosește `fetch` nativ)
- `src/lib/api/server.ts` - Pentru server-side requests (folosește `fetch` nativ)
- `src/lib/api/public/regions.ts` - Folosește `get()` din `apiClient.ts` (în proces de migrare)

### Variabile ENV

✅ **Verificat:** Toate endpoint-urile folosesc `API_BASE_URL` care este setat din:
1. `NEXT_PUBLIC_API_BASE_URL` (prioritate)
2. `NEXT_PUBLIC_API_URL` (fallback)
3. `https://api.farme.ro` (fallback final)

Vezi `ENV_SETUP.md` pentru detalii complete.

---

## ⚠️ TODO Backend

### Prioritate Înaltă

1. **Producer Profile Management**
   - `GET /producers/me`
   - `PATCH /producers/me`
   - `POST /producers/me/logo`
   - `POST /producers/me/cover`

2. **Producer Finances**
   - `GET /producers/payouts/summary`
   - `GET /producers/payouts`
   - `GET /producers/finances/invoices/:id/download`

3. **Producer Support**
   - `POST /support/producer`
   - `GET /support/producer`

### Prioritate Medie

4. **Client Profile**
   - `PATCH /clients/me`
   - `GET /clients/addresses`
   - `POST /clients/addresses`
   - `PATCH /clients/addresses/:id`
   - `DELETE /clients/addresses/:id`
   - `PATCH /clients/addresses/:id/default`

5. **Auth**
   - `POST /auth/client/forgot-password`

6. **Health/Status**
   - `GET /status` sau `GET /health`

### Prioritate Scăzută

7. **Producer Insights & Commissions**
   - `GET /producers/insights`
   - `GET /producers/commissions/summary`
   - `GET /producers/commissions/history`

8. **Regions**
   - `GET /regions`

---

## 📝 Note

### Fallback Behavior

Multe endpoint-uri au fallback behavior când nu există în backend:
- **Producer Insights:** Returnează date mock (toate 0)
- **Producer Commissions:** Returnează `null` sau array gol
- **Producer Finances:** Returnează date mock pentru payouts
- **Producer Support:** Aruncă eroare user-friendly

### Error Handling

Toate endpoint-urile gestionează erorile consistent:
- **401 Unauthorized:** Mesaj "Trebuie să fii autentificat..."
- **404 Not Found:** Mesaj specific sau fallback
- **400 Bad Request:** Mesaj "Date invalide..."
- **429 Too Many Requests:** Mesaj "Prea multe încercări..."
- **500 Server Error:** Mesaj "Eroare pe server..."

### Authentication

Toate endpoint-urile autentificate folosesc:
- `credentials: 'include'` pentru cookies
- Gestionare automată a 401 pentru redirect la login

---

---

## ⭐ Favorites

| Method | Endpoint | Funcție | Fișier | Status Backend |
|--------|----------|---------|--------|----------------|
| `GET` | `/clients/favorites` | `getFavorites()` | `src/lib/api/favorites.ts` | ✅ Implementat |
| `POST` | `/clients/favorites` | `addFavorite()` | `src/lib/api/favorites.ts` | ✅ Implementat |
| `DELETE` | `/clients/favorites/:id` | `removeFavorite()` | `src/lib/api/favorites.ts` | ✅ Implementat |

**Documentație:** `docs/BACKEND_API_CONTRACT_FAVORITES_SUBSCRIPTIONS_ALERTS.md`

---

## 🔔 Alerts

| Method | Endpoint | Funcție | Fișier | Status Backend |
|--------|----------|---------|--------|----------------|
| `GET` | `/clients/alert-preferences` | `getAlertPreferences()` | `src/lib/api/alerts.ts` | ✅ Implementat |
| `PATCH` | `/clients/alert-preferences` | `updateAlertPreferences()` | `src/lib/api/alerts.ts` | ✅ Implementat |

**Documentație:** `docs/BACKEND_API_CONTRACT_FAVORITES_SUBSCRIPTIONS_ALERTS.md`

---

## 📦 Subscriptions

### Client Subscriptions

| Method | Endpoint | Funcție | Fișier | Status Backend |
|--------|----------|---------|--------|----------------|
| `GET` | `/clients/subscriptions` | `getClientSubscriptions()` | `src/lib/api/subscriptions.ts` | ✅ Implementat |
| `POST` | `/clients/subscriptions` | `createSubscription()` | `src/lib/api/subscriptions.ts` | ✅ Implementat |
| `PATCH` | `/clients/subscriptions/:id` | `updateSubscription()` | `src/lib/api/subscriptions.ts` | ✅ Implementat |

### Public Subscriptions

| Method | Endpoint | Funcție | Fișier | Status Backend |
|--------|----------|---------|--------|----------------|
| `GET` | `/subscriptions/public/plans` | `getPublicSubscriptionPlans()` | `src/lib/api/farmero-subscriptions-public.ts` | ✅ Implementat |

### Producer Subscriptions

| Method | Endpoint | Funcție | Fișier | Status Backend |
|--------|----------|---------|--------|----------------|
| `GET` | `/producers/subscriptions` | `getProducerSubscriptions()` | `src/lib/api/farmero-subscriptions-producer.ts` | ✅ Implementat |

**Documentație:** `docs/BACKEND_API_CONTRACT_FAVORITES_SUBSCRIPTIONS_ALERTS.md`, `docs/BACKEND_API_CONTRACT_FARMERO_SUBSCRIPTIONS_PUBLIC.md`

---

## 🔔 Notifications

| Method | Endpoint | Funcție | Fișier | Status Backend |
|--------|----------|---------|--------|----------------|
| `GET` | `/notifications` | `getNotifications()` | `src/lib/api/notifications.ts` | ✅ Implementat |
| `GET` | `/notifications/unread-count` | `getUnreadCount()` | `src/lib/api/notifications.ts` | ✅ Implementat |
| `PATCH` | `/notifications/:id/read` | `markAsRead()` | `src/lib/api/notifications.ts` | ✅ Implementat |
| `PATCH` | `/notifications/read-all` | `markAllAsRead()` | `src/lib/api/notifications.ts` | ✅ Implementat |

**Documentație:** `docs/BACKEND_API_CONTRACT_NOTIFICATIONS.md`

---

## 🏢 Business Portal

| Method | Endpoint | Funcție | Fișier | Status Backend |
|--------|----------|---------|--------|----------------|
| `GET` | `/business/dashboard` | `getBusinessDashboard()` | `src/lib/api/business/dashboard.ts` | ✅ Implementat |
| `GET` | `/business/contracts` | `getMyContracts()` | `src/lib/api/farmero-contracts.ts` | ✅ Implementat |

**Documentație:** `docs/BACKEND_API_CONTRACT_BUSINESS.md`

---

## 🚚 Logistics Portal

| Method | Endpoint | Funcție | Fișier | Status Backend |
|--------|----------|---------|--------|----------------|
| `GET` | `/logistics/dashboard` | `getLogisticsDashboard()` | `src/lib/api/logistics/dashboard.ts` | ✅ Implementat |
| `GET` | `/logistics/shipments` | `getShipments()` | `src/lib/api/shipments.ts` | ✅ Implementat |

**Documentație:** `docs/BACKEND_API_CONTRACT_LOGISTICS.md`

---

## 💰 Investor Portal

| Method | Endpoint | Funcție | Fișier | Status Backend |
|--------|----------|---------|--------|----------------|
| `GET` | `/investor/dashboard` | `getInvestorDashboard()` | `src/lib/api/investor-dashboard.ts` | ✅ Implementat |
| `GET` | `/investor/metrics` | `getInvestorMetrics()` | `src/lib/api/farmero-investor.ts` | ✅ Implementat |
| `GET` | `/investor/analytics` | `getInvestorAnalytics()` | `src/lib/api/investor/analytics.ts` | ✅ Implementat |

**Documentație:** `docs/BACKEND_API_CONTRACT_INVESTOR.md`, `docs/BACKEND_API_CONTRACT_FARMERO_INVESTOR_METRICS.md`

---

## 📄 Documents

| Method | Endpoint | Funcție | Fișier | Status Backend |
|--------|----------|---------|--------|----------------|
| `GET` | `/documents` | `getDocuments()` | `src/lib/api/documents.ts` | ✅ Implementat |
| `GET` | `/documents/:id` | `getDocumentById()` | `src/lib/api/documents.ts` | ✅ Implementat |
| `GET` | `/documents/:id/download` | `downloadDocument()` | `src/lib/api/documents.ts` | ✅ Implementat |

---

## 🎯 Promotions & Marketing

| Method | Endpoint | Funcție | Fișier | Status Backend |
|--------|----------|---------|--------|----------------|
| `GET` | `/producer/promotions` | `getPromotions()` | `src/lib/api/promotions.ts` | ✅ Implementat |
| `GET` | `/producers/featured` | `getFeaturedProducers()` | `src/lib/api/farmero-producers-marketing.ts` | ✅ Implementat |

**Documentație:** `docs/BACKEND_API_CONTRACT_FARMERO_PRODUCER_MARKETING.md`, `docs/BACKEND_API_CONTRACT_FARMERO_MARKETING.md`

---

## 👥 Multi-Account

| Method | Endpoint | Funcție | Fișier | Status Backend |
|--------|----------|---------|--------|----------------|
| `GET` | `/accounts` | `getAccounts()` | `src/lib/api/accounts.ts` | ✅ Implementat |
| `POST` | `/accounts` | `createAccount()` | `src/lib/api/accounts.ts` | ✅ Implementat |
| `PATCH` | `/accounts/:id` | `updateAccount()` | `src/lib/api/accounts.ts` | ✅ Implementat |
| `DELETE` | `/accounts/:id` | `deleteAccount()` | `src/lib/api/accounts.ts` | ✅ Implementat |
| `PATCH` | `/accounts/:id/switch` | `switchAccount()` | `src/lib/api/accounts.ts` | ✅ Implementat |

**Documentație:** `docs/BACKEND_API_CONTRACT_ACCOUNTS.md`

---

## 📋 Orders (Checkout)

| Method | Endpoint | Funcție | Fișier | Status Backend |
|--------|----------|---------|--------|----------------|
| `POST` | `/orders/checkout` | `checkout()` | `src/lib/api/orders.ts` | ✅ Implementat |

**Notă:** Acest endpoint este folosit pentru checkout. `POST /orders` este folosit pentru crearea comenzilor directe.

**Documentație:** `docs/BACKEND_API_CONTRACT_CORE_COMMERCE.md`

---

**Ultima actualizare:** 2025-01-27 (Actualizat cu endpoint-urile lipsă)

