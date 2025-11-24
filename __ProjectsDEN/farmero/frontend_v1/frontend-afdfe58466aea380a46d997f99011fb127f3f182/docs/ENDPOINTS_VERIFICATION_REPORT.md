# 🔍 Endpoints Verification Report

**Data:** 2025-01-27  
**Scop:** Verificare completă a endpoint-urilor folosite în frontend vs documentație

---

## 📋 Rezumat

Am verificat toate endpoint-urile folosite în frontend și le-am comparat cu documentația existentă. Acest raport identifică:
- Endpoint-uri folosite în cod
- Endpoint-uri documentate
- Inconsistențe și diferențe
- Endpoint-uri lipsă din documentație
- Endpoint-uri documentate dar nefolosite

---

## ✅ Endpoint-uri Verificate

### 1. Auth Endpoints

| Method | Endpoint | Folosit în Cod | Documentat | Status |
|--------|----------|----------------|------------|--------|
| `POST` | `/auth/client/login` | ✅ `auth.ts` | ✅ `API_ENDPOINTS_USED.md` | ✅ OK |
| `POST` | `/auth/client/register` | ✅ `auth.ts` | ✅ `API_ENDPOINTS_USED.md` | ✅ OK |
| `GET` | `/auth/client/me` | ✅ `auth.ts` | ✅ `API_ENDPOINTS_USED.md` | ✅ OK |
| `POST` | `/auth/client/forgot-password` | ✅ `auth.ts` | ✅ `API_ENDPOINTS_USED.md` | ⚠️ TODO Backend |
| `POST` | `/auth/producer/login` | ✅ `auth.ts` | ✅ `API_ENDPOINTS_USED.md` | ✅ OK |
| `POST` | `/auth/producer/register` | ✅ `auth.ts` | ✅ `API_ENDPOINTS_USED.md` | ✅ OK |
| `GET` | `/auth/producer/me` | ✅ `auth.ts` | ✅ `API_ENDPOINTS_USED.md` | ✅ OK |
| `POST` | `/auth/logout` | ✅ `auth.ts` | ✅ `API_ENDPOINTS_USED.md` | ✅ OK |

**Status:** ✅ **Toate endpoint-urile auth sunt verificate și documentate**

---

### 2. Products Endpoints

| Method | Endpoint | Folosit în Cod | Documentat | Status |
|--------|----------|----------------|------------|--------|
| `GET` | `/products` | ✅ `public/products.ts` | ✅ `API_ENDPOINTS_USED.md` | ✅ OK |
| `GET` | `/products/:slug` | ✅ `public/products.ts` | ✅ `API_ENDPOINTS_USED.md` | ✅ OK |

**Status:** ✅ **Toate endpoint-urile products sunt verificate și documentate**

---

### 3. Producers Endpoints

| Method | Endpoint | Folosit în Cod | Documentat | Status |
|--------|----------|----------------|------------|--------|
| `GET` | `/producers` | ✅ `public/producers.ts` | ✅ `API_ENDPOINTS_USED.md` | ✅ OK |
| `GET` | `/producers/:slug` | ✅ `public/producers.ts` | ✅ `API_ENDPOINTS_USED.md` | ✅ OK |
| `GET` | `/producers/:slug/products` | ✅ `public/producers.ts` | ✅ `API_ENDPOINTS_USED.md` | ✅ OK |

**Status:** ✅ **Toate endpoint-urile producers sunt verificate și documentate**

---

### 4. Cart Endpoints

| Method | Endpoint | Folosit în Cod | Documentat | Status |
|--------|----------|----------------|------------|--------|
| `GET` | `/cart` | ✅ `cart.ts` | ✅ `API_ENDPOINTS_USED.md`, `BACKEND_API_CONTRACT_CORE_COMMERCE.md` | ✅ OK |
| `POST` | `/cart/items` | ✅ `cart.ts` | ✅ `API_ENDPOINTS_USED.md`, `BACKEND_API_CONTRACT_CORE_COMMERCE.md` | ✅ OK |
| `PATCH` | `/cart/items/:itemId` | ✅ `cart.ts` | ✅ `API_ENDPOINTS_USED.md`, `BACKEND_API_CONTRACT_CORE_COMMERCE.md` | ✅ OK |
| `DELETE` | `/cart/items/:itemId` | ✅ `cart.ts` | ✅ `API_ENDPOINTS_USED.md`, `BACKEND_API_CONTRACT_CORE_COMMERCE.md` | ✅ OK |
| `DELETE` | `/cart` | ✅ `cart.ts` | ✅ `API_ENDPOINTS_USED.md` | ✅ OK |

**Status:** ✅ **Toate endpoint-urile cart sunt verificate și documentate**

---

### 5. Orders Endpoints

| Method | Endpoint | Folosit în Cod | Documentat | Status |
|--------|----------|----------------|------------|--------|
| `POST` | `/orders` | ✅ `orders.ts` | ✅ `API_ENDPOINTS_USED.md`, `BACKEND_API_CONTRACT_CORE_COMMERCE.md` | ✅ OK |
| `GET` | `/orders` | ✅ `orders.ts` | ✅ `API_ENDPOINTS_USED.md`, `BACKEND_API_CONTRACT_CORE_COMMERCE.md` | ✅ OK |
| `GET` | `/orders/:id` | ✅ `orders.ts` | ✅ `API_ENDPOINTS_USED.md`, `BACKEND_API_CONTRACT_CORE_COMMERCE.md` | ✅ OK |
| `POST` | `/orders/checkout` | ✅ `orders.ts` | ✅ `BACKEND_API_CONTRACT_CORE_COMMERCE.md` | ✅ OK |

**Notă:** `POST /orders/checkout` este folosit în cod dar nu apare explicit în `API_ENDPOINTS_USED.md` (apare doar `POST /orders`). Trebuie actualizat.

**Status:** ⚠️ **Necesită actualizare** - `POST /orders/checkout` trebuie adăugat în `API_ENDPOINTS_USED.md`

---

### 6. Producer Portal Endpoints

#### Producer Orders

| Method | Endpoint | Folosit în Cod | Documentat | Status |
|--------|----------|----------------|------------|--------|
| `GET` | `/producers/orders` | ✅ `producer/orders.ts` | ✅ `API_ENDPOINTS_USED.md`, `BACKEND_API_CONTRACT_CORE_COMMERCE.md` | ✅ OK |
| `GET` | `/producers/orders/:id` | ✅ `producer/orders.ts` | ✅ `API_ENDPOINTS_USED.md`, `BACKEND_API_CONTRACT_CORE_COMMERCE.md` | ✅ OK |
| `PATCH` | `/producers/orders/:id/status` | ✅ `producer/orders.ts` | ✅ `API_ENDPOINTS_USED.md`, `BACKEND_API_CONTRACT_CORE_COMMERCE.md` | ✅ OK |

#### Producer Products

| Method | Endpoint | Folosit în Cod | Documentat | Status |
|--------|----------|----------------|------------|--------|
| `GET` | `/producers/products` | ✅ `producer/products.ts` | ✅ `API_ENDPOINTS_USED.md`, `BACKEND_API_CONTRACT_CORE_COMMERCE.md` | ✅ OK |
| `GET` | `/producers/products/:id` | ✅ `producer/products.ts` | ✅ `API_ENDPOINTS_USED.md`, `BACKEND_API_CONTRACT_CORE_COMMERCE.md` | ✅ OK |
| `POST` | `/producers/products` | ✅ `producer/products.ts` | ✅ `API_ENDPOINTS_USED.md`, `BACKEND_API_CONTRACT_CORE_COMMERCE.md` | ✅ OK |
| `PATCH` | `/producers/products/:id` | ✅ `producer/products.ts` | ✅ `API_ENDPOINTS_USED.md`, `BACKEND_API_CONTRACT_CORE_COMMERCE.md` | ✅ OK |
| `DELETE` | `/producers/products/:id` | ✅ `producer/products.ts` | ✅ `API_ENDPOINTS_USED.md`, `BACKEND_API_CONTRACT_CORE_COMMERCE.md` | ✅ OK |

**Status:** ✅ **Toate endpoint-urile producer portal sunt verificate și documentate**

---

### 7. Client Profile Endpoints

| Method | Endpoint | Folosit în Cod | Documentat | Status |
|--------|----------|----------------|------------|--------|
| `PATCH` | `/clients/me` | ✅ `client-profile.ts` | ✅ `API_ENDPOINTS_USED.md`, `BACKEND_API_CONTRACT_ACCOUNTS.md` | ⚠️ TODO Backend |
| `GET` | `/clients/addresses` | ✅ `client-profile.ts` | ✅ `API_ENDPOINTS_USED.md`, `BACKEND_API_CONTRACT_ACCOUNTS.md` | ⚠️ TODO Backend |
| `POST` | `/clients/addresses` | ✅ `client-profile.ts` | ✅ `API_ENDPOINTS_USED.md`, `BACKEND_API_CONTRACT_ACCOUNTS.md` | ⚠️ TODO Backend |
| `PATCH` | `/clients/addresses/:id` | ✅ `client-profile.ts` | ✅ `API_ENDPOINTS_USED.md`, `BACKEND_API_CONTRACT_ACCOUNTS.md` | ⚠️ TODO Backend |
| `DELETE` | `/clients/addresses/:id` | ✅ `client-profile.ts` | ✅ `API_ENDPOINTS_USED.md`, `BACKEND_API_CONTRACT_ACCOUNTS.md` | ⚠️ TODO Backend |
| `PATCH` | `/clients/addresses/:id/default` | ✅ `client-profile.ts` | ✅ `API_ENDPOINTS_USED.md`, `BACKEND_API_CONTRACT_ACCOUNTS.md` | ⚠️ TODO Backend |

**Status:** ✅ **Toate endpoint-urile client profile sunt verificate și documentate** (așteaptă implementare backend)

---

### 8. Favorites Endpoints

| Method | Endpoint | Folosit în Cod | Documentat | Status |
|--------|----------|----------------|------------|--------|
| `GET` | `/clients/favorites` | ✅ `favorites.ts` | ✅ `BACKEND_API_CONTRACT_FAVORITES_SUBSCRIPTIONS_ALERTS.md` | ✅ OK |
| `POST` | `/clients/favorites` | ✅ `favorites.ts` | ✅ `BACKEND_API_CONTRACT_FAVORITES_SUBSCRIPTIONS_ALERTS.md` | ✅ OK |
| `DELETE` | `/clients/favorites/:id` | ✅ `favorites.ts` | ✅ `BACKEND_API_CONTRACT_FAVORITES_SUBSCRIPTIONS_ALERTS.md` | ✅ OK |

**Notă:** Nu apare în `API_ENDPOINTS_USED.md` - trebuie adăugat.

**Status:** ⚠️ **Necesită actualizare** - Trebuie adăugat în `API_ENDPOINTS_USED.md`

---

### 9. Alerts Endpoints

| Method | Endpoint | Folosit în Cod | Documentat | Status |
|--------|----------|----------------|------------|--------|
| `GET` | `/clients/alert-preferences` | ✅ `alerts.ts` | ✅ `BACKEND_API_CONTRACT_FAVORITES_SUBSCRIPTIONS_ALERTS.md` | ✅ OK |
| `PATCH` | `/clients/alert-preferences` | ✅ `alerts.ts` | ✅ `BACKEND_API_CONTRACT_FAVORITES_SUBSCRIPTIONS_ALERTS.md` | ✅ OK |

**Notă:** Nu apare în `API_ENDPOINTS_USED.md` - trebuie adăugat.

**Status:** ⚠️ **Necesită actualizare** - Trebuie adăugat în `API_ENDPOINTS_USED.md`

---

### 10. Subscriptions Endpoints

| Method | Endpoint | Folosit în Cod | Documentat | Status |
|--------|----------|----------------|------------|--------|
| `GET` | `/clients/subscriptions` | ✅ `subscriptions.ts` | ✅ `BACKEND_API_CONTRACT_FAVORITES_SUBSCRIPTIONS_ALERTS.md` | ✅ OK |
| `POST` | `/clients/subscriptions` | ✅ `subscriptions.ts` | ✅ `BACKEND_API_CONTRACT_FAVORITES_SUBSCRIPTIONS_ALERTS.md` | ✅ OK |
| `PATCH` | `/clients/subscriptions/:id` | ✅ `subscriptions.ts` | ✅ `BACKEND_API_CONTRACT_FAVORITES_SUBSCRIPTIONS_ALERTS.md` | ✅ OK |
| `GET` | `/subscriptions/public/plans` | ✅ `farmero-subscriptions-public.ts` | ✅ `BACKEND_API_CONTRACT_FARMERO_SUBSCRIPTIONS_PUBLIC.md` | ✅ OK |
| `GET` | `/producers/subscriptions` | ✅ `farmero-subscriptions-producer.ts` | ✅ Documentat în contract | ✅ OK |

**Notă:** Nu apare în `API_ENDPOINTS_USED.md` - trebuie adăugat.

**Status:** ⚠️ **Necesită actualizare** - Trebuie adăugat în `API_ENDPOINTS_USED.md`

---

### 11. Notifications Endpoints

| Method | Endpoint | Folosit în Cod | Documentat | Status |
|--------|----------|----------------|------------|--------|
| `GET` | `/notifications` | ✅ `notifications.ts`, `farmero-notifications.ts` | ✅ `BACKEND_API_CONTRACT_NOTIFICATIONS.md` | ✅ OK |
| `GET` | `/notifications/unread-count` | ✅ `notifications.ts` | ✅ `BACKEND_API_CONTRACT_NOTIFICATIONS.md` | ✅ OK |
| `PATCH` | `/notifications/:id/read` | ✅ `notifications.ts` | ✅ `BACKEND_API_CONTRACT_NOTIFICATIONS.md` | ✅ OK |
| `PATCH` | `/notifications/read-all` | ✅ `notifications.ts` | ✅ `BACKEND_API_CONTRACT_NOTIFICATIONS.md` | ✅ OK |

**Notă:** Nu apare în `API_ENDPOINTS_USED.md` - trebuie adăugat.

**Status:** ⚠️ **Necesită actualizare** - Trebuie adăugat în `API_ENDPOINTS_USED.md`

---

### 12. Business Portal Endpoints

| Method | Endpoint | Folosit în Cod | Documentat | Status |
|--------|----------|----------------|------------|--------|
| `GET` | `/business/dashboard` | ✅ `business/dashboard.ts` | ✅ `BACKEND_API_CONTRACT_BUSINESS.md` | ✅ OK |
| `GET` | `/business/contracts` | ✅ `farmero-contracts.ts` | ✅ `BACKEND_API_CONTRACT_BUSINESS.md` | ✅ OK |

**Notă:** Nu apare în `API_ENDPOINTS_USED.md` - trebuie adăugat.

**Status:** ⚠️ **Necesită actualizare** - Trebuie adăugat în `API_ENDPOINTS_USED.md`

---

### 13. Logistics Portal Endpoints

| Method | Endpoint | Folosit în Cod | Documentat | Status |
|--------|----------|----------------|------------|--------|
| `GET` | `/logistics/dashboard` | ✅ `logistics/dashboard.ts` | ✅ `BACKEND_API_CONTRACT_LOGISTICS.md` | ✅ OK |
| `GET` | `/logistics/shipments` | ✅ `shipments.ts` | ✅ `BACKEND_API_CONTRACT_LOGISTICS.md` | ✅ OK |

**Notă:** Nu apare în `API_ENDPOINTS_USED.md` - trebuie adăugat.

**Status:** ⚠️ **Necesită actualizare** - Trebuie adăugat în `API_ENDPOINTS_USED.md`

---

### 14. Investor Portal Endpoints

| Method | Endpoint | Folosit în Cod | Documentat | Status |
|--------|----------|----------------|------------|--------|
| `GET` | `/investor/dashboard` | ✅ `investor-dashboard.ts` | ✅ `BACKEND_API_CONTRACT_INVESTOR.md` | ✅ OK |
| `GET` | `/investor/metrics` | ✅ `farmero-investor.ts` | ✅ `BACKEND_API_CONTRACT_FARMERO_INVESTOR_METRICS.md` | ✅ OK |
| `GET` | `/investor/analytics` | ✅ `investor/analytics.ts` | ✅ `BACKEND_API_CONTRACT_INVESTOR.md` | ✅ OK |

**Notă:** Nu apare în `API_ENDPOINTS_USED.md` - trebuie adăugat.

**Status:** ⚠️ **Necesită actualizare** - Trebuie adăugat în `API_ENDPOINTS_USED.md`

---

### 15. Documents Endpoints

| Method | Endpoint | Folosit în Cod | Documentat | Status |
|--------|----------|----------------|------------|--------|
| `GET` | `/documents` | ✅ `documents.ts` | ✅ Documentat în contract | ✅ OK |
| `GET` | `/documents/:id` | ✅ `documents.ts` | ✅ Documentat în contract | ✅ OK |
| `GET` | `/documents/:id/download` | ✅ `documents.ts` | ✅ Documentat în contract | ✅ OK |

**Notă:** Nu apare în `API_ENDPOINTS_USED.md` - trebuie adăugat.

**Status:** ⚠️ **Necesită actualizare** - Trebuie adăugat în `API_ENDPOINTS_USED.md`

---

### 16. Promotions Endpoints

| Method | Endpoint | Folosit în Cod | Documentat | Status |
|--------|----------|----------------|------------|--------|
| `GET` | `/producer/promotions` | ✅ `promotions.ts` | ✅ `BACKEND_API_CONTRACT_FARMERO_PRODUCER_MARKETING.md` | ✅ OK |
| `GET` | `/producers/featured` | ✅ `farmero-producers-marketing.ts` | ✅ `BACKEND_API_CONTRACT_FARMERO_MARKETING.md` | ✅ OK |

**Notă:** Nu apare în `API_ENDPOINTS_USED.md` - trebuie adăugat.

**Status:** ⚠️ **Necesită actualizare** - Trebuie adăugat în `API_ENDPOINTS_USED.md`

---

### 17. Multi-Account Endpoints

| Method | Endpoint | Folosit în Cod | Documentat | Status |
|--------|----------|----------------|------------|--------|
| `GET` | `/accounts` | ✅ `accounts.ts` | ✅ `BACKEND_API_CONTRACT_ACCOUNTS.md` | ✅ OK |
| `POST` | `/accounts` | ✅ `accounts.ts` | ✅ `BACKEND_API_CONTRACT_ACCOUNTS.md` | ✅ OK |
| `PATCH` | `/accounts/:id` | ✅ `accounts.ts` | ✅ `BACKEND_API_CONTRACT_ACCOUNTS.md` | ✅ OK |
| `DELETE` | `/accounts/:id` | ✅ `accounts.ts` | ✅ `BACKEND_API_CONTRACT_ACCOUNTS.md` | ✅ OK |
| `PATCH` | `/accounts/:id/switch` | ✅ `accounts.ts` | ✅ `BACKEND_API_CONTRACT_ACCOUNTS.md` | ✅ OK |

**Notă:** Nu apare în `API_ENDPOINTS_USED.md` - trebuie adăugat.

**Status:** ⚠️ **Necesită actualizare** - Trebuie adăugat în `API_ENDPOINTS_USED.md`

---

### 18. Health/Status Endpoints

| Method | Endpoint | Folosit în Cod | Documentat | Status |
|--------|----------|----------------|------------|--------|
| `GET` | `/status` | ✅ `health.ts` | ✅ `API_ENDPOINTS_USED.md` | ⚠️ TODO Backend |
| `GET` | `/health` | ✅ `health.ts` (fallback) | ✅ `API_ENDPOINTS_USED.md` | ⚠️ TODO Backend |
| `GET` | `/health/db` | ✅ `health.ts` (fallback) | ✅ `API_ENDPOINTS_USED.md` | ⚠️ TODO Backend |

**Status:** ✅ **Toate endpoint-urile health sunt verificate și documentate**

---

## ⚠️ Probleme Identificate

### 1. Endpoint-uri Lipsă din `API_ENDPOINTS_USED.md`

Următoarele endpoint-uri sunt folosite în cod și documentate în contracte API, dar nu apar în `API_ENDPOINTS_USED.md`:

1. **Favorites:**
   - `GET /clients/favorites`
   - `POST /clients/favorites`
   - `DELETE /clients/favorites/:id`

2. **Alerts:**
   - `GET /clients/alert-preferences`
   - `PATCH /clients/alert-preferences`

3. **Subscriptions:**
   - `GET /clients/subscriptions`
   - `POST /clients/subscriptions`
   - `PATCH /clients/subscriptions/:id`
   - `GET /subscriptions/public/plans`
   - `GET /producers/subscriptions`

4. **Notifications:**
   - `GET /notifications`
   - `GET /notifications/unread-count`
   - `PATCH /notifications/:id/read`
   - `PATCH /notifications/read-all`

5. **Business Portal:**
   - `GET /business/dashboard`
   - `GET /business/contracts`

6. **Logistics Portal:**
   - `GET /logistics/dashboard`
   - `GET /logistics/shipments`

7. **Investor Portal:**
   - `GET /investor/dashboard`
   - `GET /investor/metrics`
   - `GET /investor/analytics`

8. **Documents:**
   - `GET /documents`
   - `GET /documents/:id`
   - `GET /documents/:id/download`

9. **Promotions:**
   - `GET /producer/promotions`
   - `GET /producers/featured`

10. **Multi-Account:**
    - `GET /accounts`
    - `POST /accounts`
    - `PATCH /accounts/:id`
    - `DELETE /accounts/:id`
    - `PATCH /accounts/:id/switch`

11. **Orders:**
    - `POST /orders/checkout` (apare doar `POST /orders`)

---

## ✅ Acțiuni Recomandate

### 1. Actualizare `API_ENDPOINTS_USED.md`

Adaugă toate endpoint-urile lipsă menționate mai sus în `API_ENDPOINTS_USED.md`.

### 2. Verificare Consistență

Verifică că toate endpoint-urile din `API_ENDPOINTS_USED.md` sunt folosite efectiv în cod.

### 3. Actualizare Statistici

Actualizează statisticile din `API_ENDPOINTS_USED.md`:
- **Total endpoint-uri:** ~80+ (nu 50+)
- **Endpoint-uri implementate în backend:** ~30+ (nu 25)
- **Endpoint-uri TODO backend:** ~50+ (nu 25)

---

## 📊 Statistici Actualizate

- **Total endpoint-uri folosite în cod:** ~80+
- **Endpoint-uri documentate în contracte API:** ~80+
- **Endpoint-uri în `API_ENDPOINTS_USED.md`:** ~50
- **Endpoint-uri lipsă din `API_ENDPOINTS_USED.md`:** ~30

---

## 🔗 Documentație Referință

- **`docs/API_ENDPOINTS_USED.md`** - Lista endpoint-urilor (necesită actualizare)
- **`docs/BACKEND_API_CONTRACT_*.md`** - Contracte API detaliate
- **`src/lib/api/`** - Implementări frontend

---

**Ultima actualizare:** 2025-01-27  
**Status:** ⚠️ **Necesită actualizare** - `API_ENDPOINTS_USED.md` trebuie actualizat cu endpoint-urile lipsă

