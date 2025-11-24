# 🔍 Backend Integration Audit - Farmero

**Data:** 2025-01-27  
**Scop:** Audit complet al cerințelor frontend vs implementarea backend pentru integrare  
**Status:** 🟡 **Așteaptă verificare backend**

---

## 📋 Rezumat Executiv

Frontend-ul Farmero este **complet implementat** și pregătit pentru integrare cu backend-ul. Acest raport identifică **toate endpoint-urile necesare** și **diferențele** între ce așteaptă frontend-ul și ce trebuie implementat în backend.

**Puncte Cheie:**
- ✅ Frontend-ul folosește sistemul `BackendSyncStatus` pentru activare incrementală
- ✅ Toate endpoint-urile sunt documentate în `docs/FARMERO_BACKEND_HANDOFF_CHECKLIST.md`
- ⚠️ **16 endpoint-uri critice** lipsesc pentru MVP (Cart, Checkout, Orders, Producer Products/Orders)
- ⚠️ **7 endpoint-uri importante** pentru Profile & Addresses
- ⚠️ **25+ endpoint-uri** pentru funcționalități post-MVP

**Base URL Backend:** `https://api.farme.ro`  
**Base URL Frontend:** `https://farme.ro` (production), `https://farme-ro-*.vercel.app` (preview)

---

## 1. Identificare Cerințe Frontend pentru Backend

### 1.1. Endpoint-uri Identificate din Cod Frontend

#### Cart Management (`src/lib/api/cart.ts`)

| Metodă | Path | Request Body | Response | Auth | Status Așteptat |
|--------|------|--------------|---------|------|-----------------|
| `GET` | `/cart` | - | `Cart` (sau 404 → empty cart) | ✅ Cookie | ❌ **LIPSEȘTE** |
| `POST` | `/cart/items` | `{ productId, quantity, variantId?, notes? }` | `Cart` (complet actualizat) | ✅ Cookie | ❌ **LIPSEȘTE** |
| `PATCH` | `/cart/items/:itemId` | `{ quantity }` | `Cart` (complet actualizat) | ✅ Cookie | ❌ **LIPSEȘTE** |
| `DELETE` | `/cart/items/:itemId` | - | `Cart` (complet actualizat) sau 204 | ✅ Cookie | ❌ **LIPSEȘTE** |
| `DELETE` | `/cart` | - | `Cart` (gol) | ✅ Cookie | ❌ **LIPSEȘTE** |

**Tipuri Frontend:**
```typescript
type CartItemInput = {
  productId: string
  quantity: number
  variantId?: string
  notes?: string
}

type Cart = {
  id: string
  items: CartItem[]
  subtotal: number
  shippingCost: number
  total: number
  currency: string
  createdAt?: string
  updatedAt?: string
}
```

**Error Handling Așteptat:**
- `400 Bad Request` - Date invalide (productId lipsă, quantity <= 0)
- `401 Unauthorized` - Nu este autentificat
- `404 Not Found` - Produsul nu există
- `422 Unprocessable Entity` - Stoc insuficient

---

#### Checkout & Orders (`src/lib/api/orders.ts`)

| Metodă | Path | Request Body | Response | Auth | Status Așteptat |
|--------|------|--------------|---------|------|-----------------|
| `POST` | `/orders` | `CreateOrderInput` | `{ order: Order, paymentUrl?, paymentIntentId? }` | ✅ Cookie | ❌ **LIPSEȘTE** |
| `GET` | `/orders` | Query: `status?`, `page?`, `limit?` | `Order[]` sau `{ data: Order[], pagination }` | ✅ Cookie | ❌ **LIPSEȘTE** |
| `GET` | `/orders/:id` | - | `Order` (complet) | ✅ Cookie | ❌ **LIPSEȘTE** |

**Tipuri Frontend:**
```typescript
type CreateOrderInput = {
  name: string
  email: string
  phone: string
  city: string
  address: string
  postalCode?: string
  notes?: string
  paymentMethod: 'card' | 'cod' | 'bank_transfer' | 'other'
  accountId?: string
  items?: Array<{ productId: string; quantity: number }>
}

type Order = {
  id: string
  number?: string
  status: 'pending' | 'confirmed' | 'prepared' | 'shipped' | 'delivered' | 'cancelled' | 'paid' | 'processing' | 'canceled' | 'uncollected'
  total: number
  subtotal?: number
  shippingCost?: number
  items: OrderItem[]
  shippingAddress?: ShippingAddress
  paymentMethod?: 'card' | 'cod' | 'bank_transfer' | 'other'
  paymentStatus?: 'pending' | 'paid' | 'failed'
  notes?: string
  createdAt?: string
  updatedAt?: string
}
```

**Error Handling Așteptat:**
- `400 Bad Request` - Date invalide
- `401 Unauthorized` - Nu este autentificat
- `404 Not Found` - Comanda nu există
- `422 Unprocessable Entity` - Stoc insuficient (cu detalii: `{ products: [{ productId, availableStock, requestedQuantity }] }`)

---

#### Client Profile & Addresses (`src/lib/api/client-profile.ts`)

| Metodă | Path | Request Body | Response | Auth | Status Așteptat |
|--------|------|--------------|---------|------|-----------------|
| `GET` | `/clients/me` | - | `ClientUser` | ✅ Cookie | ❌ **LIPSEȘTE** |
| `PATCH` | `/clients/me` | `{ fullName?, phoneNumber? }` | `ClientUser` | ✅ Cookie | ❌ **LIPSEȘTE** |
| `GET` | `/clients/addresses` | - | `ShippingAddress[]` sau `{ data: ShippingAddress[] }` | ✅ Cookie | ❌ **LIPSEȘTE** |
| `POST` | `/clients/addresses` | `CreateShippingAddressPayload` | `ShippingAddress` | ✅ Cookie | ❌ **LIPSEȘTE** |
| `PATCH` | `/clients/addresses/:id` | `UpdateShippingAddressPayload` | `ShippingAddress` | ✅ Cookie | ❌ **LIPSEȘTE** |
| `DELETE` | `/clients/addresses/:id` | - | `204 No Content` | ✅ Cookie | ❌ **LIPSEȘTE** |
| `PATCH` | `/clients/addresses/:id/default` | - | `ShippingAddress` | ✅ Cookie | ❌ **LIPSEȘTE** |

**Tipuri Frontend:**
```typescript
type ShippingAddress = {
  id?: string
  name: string
  phone: string
  email?: string
  city: string
  address: string
  postalCode?: string
  notes?: string
  isDefault?: boolean
}
```

---

#### Producer Products (`src/lib/api/producer/products.ts`)

| Metodă | Path | Request Body | Response | Auth | Status Așteptat |
|--------|------|--------------|---------|------|-----------------|
| `GET` | `/producers/products` | Query: `status?`, `page?`, `limit?` | `ProducerProduct[]` sau `{ data: ProducerProduct[] }` | ✅ Cookie (rol: producer) | ❌ **LIPSEȘTE** |
| `GET` | `/producers/products/:id` | - | `ProducerProduct` | ✅ Cookie (rol: producer) | ❌ **LIPSEȘTE** |
| `POST` | `/producers/products` | `ProducerProductInput` | `ProducerProduct` | ✅ Cookie (rol: producer) | ❌ **LIPSEȘTE** |
| `PATCH` | `/producers/products/:id` | `UpdateProductPayload` | `ProducerProduct` | ✅ Cookie (rol: producer) | ❌ **LIPSEȘTE** |
| `DELETE` | `/producers/products/:id` | - | `204 No Content` | ✅ Cookie (rol: producer) | ❌ **LIPSEȘTE** |

**Notă:** Frontend folosește `/producers/products` (plural), nu `/producer/products` (singular).

**Tipuri Frontend:**
```typescript
type ProducerProductInput = {
  name: string
  description?: string
  price: number
  unit: string
  stock?: number
  categoryId?: string
  regionId?: string
  imageUrl?: string
  isBio?: boolean
  isTraditional?: boolean
}
```

**Error Handling Așteptat:**
- `400 Bad Request` - Date invalide
- `401 Unauthorized` - Nu este autentificat
- `403 Forbidden` - Nu este producător sau produsul nu îi aparține
- `404 Not Found` - Produsul nu există
- `422 Unprocessable Entity` - Validare eșuată (slug duplicat, etc.)

---

#### Producer Orders (`src/lib/api/producer/orders.ts`)

| Metodă | Path | Request Body | Response | Auth | Status Așteptat |
|--------|------|--------------|---------|------|-----------------|
| `GET` | `/producers/orders` | Query: `status?`, `startDate?`, `endDate?` | `ProducerOrder[]` sau `{ data: ProducerOrder[] }` | ✅ Cookie (rol: producer) | ❌ **LIPSEȘTE** |
| `GET` | `/producers/orders/:id` | - | `ProducerOrder` | ✅ Cookie (rol: producer) | ❌ **LIPSEȘTE** |
| `PATCH` | `/producers/orders/:id/status` | `{ status: ProducerOrderStatus, notes? }` | `ProducerOrder` | ✅ Cookie (rol: producer) | ❌ **LIPSEȘTE** |

**Notă:** Frontend folosește `/producers/orders` (plural), nu `/producer/orders` (singular).

**Statusuri Valide:**
- `pending` → `confirmed` → `preparing` → `shipped` → `delivered`
- `pending` → `canceled` (doar dacă nu e deja confirmată)

**Error Handling Așteptat:**
- `400 Bad Request` - Status invalid sau tranziție invalidă
- `401 Unauthorized` - Nu este autentificat
- `403 Forbidden` - Nu este producător sau comanda nu îi aparține
- `404 Not Found` - Comanda nu există
- `422 Unprocessable Entity` - Tranziție de status invalidă

---

#### Authentication (`src/lib/api/auth.ts`)

| Metodă | Path | Request Body | Response | Auth | Status Așteptat |
|--------|------|--------------|---------|------|-----------------|
| `POST` | `/auth/client/login` | `{ email, password }` | `{ user: ClientUser, token? }` | ❌ | ✅ **EXISTĂ** (verifică) |
| `POST` | `/auth/producer/login` | `{ email, password }` | `{ user: ProducerUser, token? }` | ❌ | ✅ **EXISTĂ** (verifică) |
| `POST` | `/auth/business/login` | `{ email, password }` | `{ user: BusinessUser, token? }` | ❌ | ✅ **EXISTĂ** (verifică) |
| `POST` | `/auth/logistics/login` | `{ email, password }` | `{ user: LogisticsUser, token? }` | ❌ | ✅ **EXISTĂ** (verifică) |
| `POST` | `/auth/investor/login` | `{ email, password }` | `{ user: InvestorUser, token? }` | ❌ | ✅ **EXISTĂ** (verifică) |
| `POST` | `/auth/importer/login` | `{ email, password }` | `{ user: ImporterUser, token? }` | ❌ | ✅ **EXISTĂ** (verifică) |
| `POST` | `/auth/logout` | `{}` | `204 No Content` | ✅ Cookie | ✅ **EXISTĂ** (verifică) |
| `GET` | `/auth/client/me` | - | `ClientUser` | ✅ Cookie | ✅ **EXISTĂ** (verifică) |
| `GET` | `/auth/producer/me` | - | `ProducerUser` | ✅ Cookie | ✅ **EXISTĂ** (verifică) |
| `GET` | `/auth/business/me` | - | `BusinessUser` | ✅ Cookie | ✅ **EXISTĂ** (verifică) |
| `GET` | `/auth/logistics/me` | - | `LogisticsUser` | ✅ Cookie | ✅ **EXISTĂ** (verifică) |
| `GET` | `/auth/investor/me` | - | `InvestorUser` | ✅ Cookie | ✅ **EXISTĂ** (verifică) |
| `GET` | `/auth/importer/me` | - | `ImporterUser` | ✅ Cookie | ✅ **EXISTĂ** (verifică) |

**Notă:** Frontend folosește endpoint-uri separate pentru fiecare rol (`/auth/client/*`, `/auth/producer/*`, etc.), nu un endpoint unificat `/auth/login`.

---

### 1.2. Endpoint-uri Identificate din Documentație

Din `docs/FARMERO_BACKEND_HANDOFF_CHECKLIST.md` și `docs/FARMERO_BACKENDSYNC_ACTIVATION_PLAN.md`:

#### Favorites (`src/lib/api/favorites.ts`)

| Metodă | Path | Request Body | Response | Auth | Status Așteptat |
|--------|------|--------------|---------|------|-----------------|
| `GET` | `/clients/favorites` | - | `Favorite[]` | ✅ Cookie | ❌ **LIPSEȘTE** |
| `POST` | `/clients/favorites` | `{ productId }` | `Favorite` | ✅ Cookie | ❌ **LIPSEȘTE** |
| `DELETE` | `/clients/favorites/:id` | - | `204 No Content` | ✅ Cookie | ❌ **LIPSEȘTE** |

---

#### Subscriptions (`src/lib/api/subscriptions.ts`)

| Metodă | Path | Request Body | Response | Auth | Status Așteptat |
|--------|------|--------------|---------|------|-----------------|
| `GET` | `/clients/subscriptions` | - | `DomainSubscription[]` | ✅ Cookie | ❌ **LIPSEȘTE** |
| `POST` | `/clients/subscriptions` | `CreateSubscriptionInput` | `DomainSubscription` | ✅ Cookie | ❌ **LIPSEȘTE** |
| `PATCH` | `/clients/subscriptions/:id` | `UpdateSubscriptionInput` | `DomainSubscription` | ✅ Cookie | ❌ **LIPSEȘTE** |

---

#### Alerts (`src/lib/api/alerts.ts`)

| Metodă | Path | Request Body | Response | Auth | Status Așteptat |
|--------|------|--------------|---------|------|-----------------|
| `GET` | `/clients/alert-preferences` | - | `AlertPreferences` | ✅ Cookie | ❌ **LIPSEȘTE** |
| `PATCH` | `/clients/alert-preferences` | `AlertPreferences` | `AlertPreferences` | ✅ Cookie | ❌ **LIPSEȘTE** |

---

#### Business Portal (`src/lib/api/business/dashboard.ts`)

| Metodă | Path | Request Body | Response | Auth | Status Așteptat |
|--------|------|--------------|---------|------|-----------------|
| `GET` | `/business/dashboard` | - | `BusinessDashboard` | ✅ Cookie (rol: business) | ❌ **LIPSEȘTE** |
| `GET` | `/business/orders` | - | `Order[]` | ✅ Cookie (rol: business) | ❌ **LIPSEȘTE** |
| `GET` | `/business/stats` | - | `BusinessStats` | ✅ Cookie (rol: business) | ❌ **LIPSEȘTE** |

---

#### Logistics Portal (`src/lib/api/logistics/dashboard.ts`)

| Metodă | Path | Request Body | Response | Auth | Status Așteptat |
|--------|------|--------------|---------|------|-----------------|
| `GET` | `/logistics/dashboard` | - | `LogisticsDashboard` | ✅ Cookie (rol: logistics) | ❌ **LIPSEȘTE** |
| `GET` | `/logistics/deliveries` | - | `Delivery[]` | ✅ Cookie (rol: logistics) | ❌ **LIPSEȘTE** |
| `GET` | `/logistics/stats` | - | `LogisticsStats` | ✅ Cookie (rol: logistics) | ❌ **LIPSEȘTE** |
| `GET` | `/logistics/commissions` | - | `CommissionSummary` | ✅ Cookie (rol: logistics) | ❌ **LIPSEȘTE** |

---

#### Investor Portal (`src/lib/api/investor/analytics.ts`)

| Metodă | Path | Request Body | Response | Auth | Status Așteptat |
|--------|------|--------------|---------|------|-----------------|
| `GET` | `/investor/analytics` | - | `InvestorDashboardData` | ✅ Cookie (rol: investor) | ❌ **LIPSEȘTE** |
| `GET` | `/investor/metrics` | - | `InvestorMetrics` (anonimizate) | ✅ Cookie (rol: investor) | ❌ **LIPSEȘTE** |

---

#### Notifications (`src/lib/api/notifications.ts`)

| Metodă | Path | Request Body | Response | Auth | Status Așteptat |
|--------|------|--------------|---------|------|-----------------|
| `GET` | `/notifications` | Query: `page?`, `limit?` | `Notification[]` sau `{ data: Notification[], pagination }` | ✅ Cookie | ❌ **LIPSEȘTE** |
| `POST` | `/notifications/read` | `{ notificationIds: string[] }` | `204 No Content` | ✅ Cookie | ❌ **LIPSEȘTE** |
| `GET` | `/notifications/preferences` | - | `NotificationPreferences` | ✅ Cookie | ❌ **LIPSEȘTE** |

---

## 2. Comparare cu Implementarea Actuală din Backend

**⚠️ NOTĂ:** Backend-ul este într-un repo separat (`api.farme.ro`). Acest audit identifică cerințele frontend-ului. **Trebuie verificat manual în repo-ul backend** dacă endpoint-urile există și sunt compatibile.

### 2.1. Diferențe Identificate între Frontend Expectations vs Backend Actual

#### Path Prefixes

**Frontend Așteaptă:**
- `/cart/*` (nu `/api/cart/*`)
- `/orders/*` (nu `/api/orders/*`)
- `/clients/*` (nu `/api/clients/*`)
- `/producers/*` (nu `/producer/*` - **IMPORTANT:** plural, nu singular)
- `/business/*` (nu `/api/business/*`)
- `/logistics/*` (nu `/api/logistics/*`)
- `/investor/*` (nu `/api/investor/*`)

**Verificare Necesară în Backend:**
- [ ] Backend folosește prefix `/api/v1/` sau `/api/` sau `/`?
- [ ] Dacă da, frontend trebuie actualizat sau backend trebuie să suporte ambele?

#### Naming Conventions

**Diferențe Identificate:**
1. **Producer Products:** Frontend folosește `/producers/products` (plural), documentația menționează `/producer/products` (singular)
2. **Producer Orders:** Frontend folosește `/producers/orders` (plural), documentația menționează `/producer/orders` (singular)

**Recomandare:** Verifică în backend care variantă este folosită și aliniază frontend-ul sau backend-ul.

#### Response Formats

**Frontend Suportă:**
- Array direct: `Order[]`
- Paginated: `{ data: Order[], pagination: { page, limit, total, totalPages } }`

**Verificare Necesară în Backend:**
- [ ] Backend returnează array direct sau paginated?
- [ ] Dacă paginated, structura `pagination` este corectă?

#### Error Response Format

**Frontend Așteaptă:**
```json
{
  "error": "ErrorType",
  "message": "Mesaj user-friendly în română",
  "status": 400,
  "details": {
    // Detalii opționale pentru debugging
  }
}
```

**Verificare Necesară în Backend:**
- [ ] Backend returnează acest format de eroare?
- [ ] Mesajele sunt în română?

---

## 3. Listează EXACT ce Trebuie Implementat în Backend

### 3.1. Backend TODO – Critic pentru MVP

#### Cart & Checkout

**Prioritate:** 🔴 **CRITIC**

| Endpoint | Metodă | Path | Payload Minim | Response Minim | Auth | Roluri |
|----------|--------|------|---------------|----------------|------|--------|
| Get Cart | `GET` | `/cart` | - | `{ id, items[], subtotal, shippingCost, total, currency }` | ✅ Cookie | `client` |
| Add to Cart | `POST` | `/cart/items` | `{ productId, quantity }` | `Cart` (complet actualizat) | ✅ Cookie | `client` |
| Update Cart Item | `PATCH` | `/cart/items/:itemId` | `{ quantity }` | `Cart` (complet actualizat) | ✅ Cookie | `client` |
| Remove Cart Item | `DELETE` | `/cart/items/:itemId` | - | `Cart` (complet actualizat) sau 204 | ✅ Cookie | `client` |
| Clear Cart | `DELETE` | `/cart` | - | `Cart` (gol) | ✅ Cookie | `client` |
| Create Order | `POST` | `/orders` | `CreateOrderInput` | `{ order: Order, paymentUrl?, paymentIntentId? }` | ✅ Cookie | `client` |

**Exemplu Request Body (Create Order):**
```json
{
  "name": "Ion Popescu",
  "email": "ion@example.com",
  "phone": "+40712345678",
  "city": "București",
  "address": "Str. Exemplu, Nr. 1",
  "postalCode": "010001",
  "notes": "La parter",
  "paymentMethod": "cod"
}
```

**Exemplu Response (Create Order):**
```json
{
  "order": {
    "id": "order_456",
    "number": "ORD-2024-001",
    "status": "pending",
    "items": [
      {
        "id": "item_789",
        "productId": "prod_789",
        "productName": "Mere Bio",
        "quantity": 2,
        "price": 25.50,
        "total": 51.00
      }
    ],
    "subtotal": 51.00,
    "shippingCost": 15.00,
    "total": 66.00,
    "shippingAddress": { /* ... */ },
    "paymentMethod": "cod",
    "paymentStatus": "pending",
    "createdAt": "2024-01-15T12:00:00Z"
  }
}
```

---

#### Client Orders

**Prioritate:** 🔴 **CRITIC**

| Endpoint | Metodă | Path | Payload Minim | Response Minim | Auth | Roluri |
|----------|--------|------|---------------|----------------|------|--------|
| List Orders | `GET` | `/orders` | Query: `status?`, `page?`, `limit?` | `Order[]` sau `{ data: Order[], pagination }` | ✅ Cookie | `client` |
| Get Order | `GET` | `/orders/:id` | - | `Order` (complet) | ✅ Cookie | `client` |

**Exemplu Response (List Orders):**
```json
[
  {
    "id": "order_456",
    "number": "ORD-2024-001",
    "status": "pending",
    "total": 66.00,
    "createdAt": "2024-01-15T12:00:00Z"
  }
]
```

---

#### Producer Products & Orders

**Prioritate:** 🔴 **CRITIC**

| Endpoint | Metodă | Path | Payload Minim | Response Minim | Auth | Roluri |
|----------|--------|------|---------------|----------------|------|--------|
| List Products | `GET` | `/producers/products` | Query: `status?`, `page?`, `limit?` | `ProducerProduct[]` sau `{ data: ProducerProduct[] }` | ✅ Cookie | `producer` |
| Get Product | `GET` | `/producers/products/:id` | - | `ProducerProduct` | ✅ Cookie | `producer` |
| Create Product | `POST` | `/producers/products` | `ProducerProductInput` | `ProducerProduct` | ✅ Cookie | `producer` |
| Update Product | `PATCH` | `/producers/products/:id` | `UpdateProductPayload` | `ProducerProduct` | ✅ Cookie | `producer` |
| Delete Product | `DELETE` | `/producers/products/:id` | - | `204 No Content` | ✅ Cookie | `producer` |
| List Orders | `GET` | `/producers/orders` | Query: `status?`, `startDate?`, `endDate?` | `ProducerOrder[]` sau `{ data: ProducerOrder[] }` | ✅ Cookie | `producer` |
| Get Order | `GET` | `/producers/orders/:id` | - | `ProducerOrder` | ✅ Cookie | `producer` |
| Update Order Status | `PATCH` | `/producers/orders/:id/status` | `{ status, notes? }` | `ProducerOrder` | ✅ Cookie | `producer` |

**Notă IMPORTANTĂ:** Frontend folosește `/producers/*` (plural), nu `/producer/*` (singular).

**Exemplu Request Body (Create Product):**
```json
{
  "name": "Mere Bio",
  "description": "Mere bio de la ferma noastră",
  "price": 25.50,
  "unit": "kg",
  "stock": 100,
  "categoryId": "cat_123",
  "regionId": "reg_456"
}
```

**Exemplu Request Body (Update Order Status):**
```json
{
  "status": "confirmed",
  "notes": "Comandă confirmată"
}
```

---

### 3.2. Backend TODO – Important Post-MVP

#### Client Profile + Addresses

**Prioritate:** 🟡 **IMPORTANT**

| Endpoint | Metodă | Path | Payload Minim | Response Minim | Auth | Roluri |
|----------|--------|------|---------------|----------------|------|--------|
| Get Profile | `GET` | `/clients/me` | - | `ClientUser` | ✅ Cookie | `client` |
| Update Profile | `PATCH` | `/clients/me` | `{ fullName?, phoneNumber? }` | `ClientUser` | ✅ Cookie | `client` |
| List Addresses | `GET` | `/clients/addresses` | - | `ShippingAddress[]` sau `{ data: ShippingAddress[] }` | ✅ Cookie | `client` |
| Create Address | `POST` | `/clients/addresses` | `CreateShippingAddressPayload` | `ShippingAddress` | ✅ Cookie | `client` |
| Update Address | `PATCH` | `/clients/addresses/:id` | `UpdateShippingAddressPayload` | `ShippingAddress` | ✅ Cookie | `client` |
| Delete Address | `DELETE` | `/clients/addresses/:id` | - | `204 No Content` | ✅ Cookie | `client` |
| Set Default Address | `PATCH` | `/clients/addresses/:id/default` | - | `ShippingAddress` | ✅ Cookie | `client` |

---

#### Documents & Contract Generator

**Prioritate:** 🟡 **IMPORTANT**

| Endpoint | Metodă | Path | Payload Minim | Response Minim | Auth | Roluri |
|----------|--------|------|---------------|----------------|------|--------|
| List Documents | `GET` | `/documents` | Query: `type?`, `page?`, `limit?` | `DomainDocument[]` sau `{ data: DomainDocument[] }` | ✅ Cookie | `producer`, `business`, `logistics` |
| Get Document | `GET` | `/documents/:id` | - | `DomainDocument` | ✅ Cookie | `producer`, `business`, `logistics` |
| Create Contract Draft | `POST` | `/documents/contracts/draft` | `DomainContractDraft` | `DomainDocument` | ✅ Cookie | `producer`, `business`, `logistics` |

---

#### Subscriptions (Recurring Orders)

**Prioritate:** 🟡 **IMPORTANT**

| Endpoint | Metodă | Path | Payload Minim | Response Minim | Auth | Roluri |
|----------|--------|------|---------------|----------------|------|--------|
| List Subscriptions | `GET` | `/clients/subscriptions` | - | `DomainSubscription[]` | ✅ Cookie | `client` |
| Create Subscription | `POST` | `/clients/subscriptions` | `CreateSubscriptionInput` | `DomainSubscription` | ✅ Cookie | `client` |
| Update Subscription | `PATCH` | `/clients/subscriptions/:id` | `UpdateSubscriptionInput` | `DomainSubscription` | ✅ Cookie | `client` |

---

#### Promotions / Boosted Visibility

**Prioritate:** 🟡 **IMPORTANT**

| Endpoint | Metodă | Path | Payload Minim | Response Minim | Auth | Roluri |
|----------|--------|------|---------------|----------------|------|--------|
| Get Promotion Subscription | `GET` | `/producer/promotions/subscription` | - | `DomainPromotionSubscription` | ✅ Cookie | `producer` |
| List Campaigns | `GET` | `/producer/promotions/campaigns` | - | `DomainPromotionCampaign[]` | ✅ Cookie | `producer` |
| Create Campaign | `POST` | `/producer/promotions/campaigns` | `CreateCampaignInput` | `DomainPromotionCampaign` | ✅ Cookie | `producer` |

---

#### Investor/Business/Logistics Endpoints Critice

**Prioritate:** 🟡 **IMPORTANT**

| Endpoint | Metodă | Path | Payload Minim | Response Minim | Auth | Roluri |
|----------|--------|------|---------------|----------------|------|--------|
| Business Dashboard | `GET` | `/business/dashboard` | - | `BusinessDashboard` | ✅ Cookie | `business` |
| Business Orders | `GET` | `/business/orders` | - | `Order[]` | ✅ Cookie | `business` |
| Business Stats | `GET` | `/business/stats` | - | `BusinessStats` | ✅ Cookie | `business` |
| Logistics Dashboard | `GET` | `/logistics/dashboard` | - | `LogisticsDashboard` | ✅ Cookie | `logistics` |
| Logistics Deliveries | `GET` | `/logistics/deliveries` | - | `Delivery[]` | ✅ Cookie | `logistics` |
| Logistics Commissions | `GET` | `/logistics/commissions` | - | `CommissionSummary` | ✅ Cookie | `logistics` |
| Investor Analytics | `GET` | `/investor/analytics` | - | `InvestorDashboardData` (anonimizat) | ✅ Cookie | `investor` |
| Investor Metrics | `GET` | `/investor/metrics` | - | `InvestorMetrics` (anonimizat) | ✅ Cookie | `investor` |

---

## 4. Configurare Generală Backend pentru Integrare Corectă

### 4.1. CORS Configuration

**Frontend Origins:**
- Production: `https://farme.ro`
- Preview: `https://farme-ro-*.vercel.app` (regex pattern)
- Development: `http://localhost:3000`

**Configurare CORS Necesară:**
```javascript
// Exemplu pentru Express.js
app.use(cors({
  origin: [
    'https://farme.ro',
    /^https:\/\/farme-ro-.*\.vercel\.app$/, // Preview deployments (regex)
    'http://localhost:3000' // Development
  ],
  credentials: true, // OBLIGATORIU - pentru cookie-based auth
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Cookie',
    'X-Requested-With'
  ],
  exposedHeaders: [
    'Set-Cookie',
    'Retry-After' // Pentru rate limiting (429)
  ],
  maxAge: 86400 // 24 ore pentru preflight cache
}))
```

**Verificare:**
- [ ] CORS permite origin-ul `https://farme.ro`
- [ ] CORS permite preview deployments (`https://farme-ro-*.vercel.app`)
- [ ] CORS permite `http://localhost:3000` pentru development
- [ ] `credentials: true` este activat
- [ ] Preflight requests (OPTIONS) sunt răspunse corect

---

### 4.2. Cookie-based Auth

**Cookie Settings Necesare:**
```javascript
// Exemplu pentru Express.js
res.cookie('session', token, {
  httpOnly: true,        // OBLIGATORIU - previne acces JavaScript
  secure: true,          // OBLIGATORIU în production (HTTPS only)
  sameSite: 'Lax',       // sau 'Strict' pentru securitate mai mare
  maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 zile (ajustabil)
  path: '/',             // Disponibil pe toate rutele
  domain: '.farme.ro'    // Dacă e necesar pentru subdomain-uri
})
```

**Verificare:**
- [ ] Cookie-ul este `httpOnly: true`
- [ ] Cookie-ul este `secure: true` în production
- [ ] Cookie-ul are `sameSite: 'Lax'` sau `'Strict'`
- [ ] Cookie-ul este verificat la fiecare request protejat
- [ ] `401 Unauthorized` este returnat dacă cookie invalid/lipsă

---

### 4.3. Environment Variables

**Backend Environment Variables Necesare:**
```env
# Frontend origins (pentru CORS)
FRONTEND_ORIGIN=https://farme.ro
FRONTEND_PREVIEW_ORIGIN_PATTERN=https://farme-ro-*.vercel.app
FRONTEND_DEV_ORIGIN=http://localhost:3000

# Cookie settings
COOKIE_SECURE=true  # HTTPS only în production
COOKIE_SAME_SITE=Lax  # sau Strict
COOKIE_HTTP_ONLY=true  # Obligatoriu pentru securitate
COOKIE_DOMAIN=.farme.ro  # Dacă e necesar pentru subdomain-uri
```

**Verificare:**
- [ ] Environment variables sunt setate corect
- [ ] CORS folosește aceste variabile
- [ ] Cookie settings folosesc aceste variabile

---

### 4.4. Health Check Endpoint

**Frontend Așteaptă:**
- `GET /health` sau `GET /api/health` sau similar

**Verificare:**
- [ ] Backend răspunde la un endpoint de health-check
- [ ] Endpoint-ul returnează status-ul backend-ului și database-ului

---

## 5. Output Final Structurat

### 5.1. Rezumat Executiv

**Starea Backend vs Frontend:**

Frontend-ul Farmero este **complet implementat** și pregătit pentru integrare. Toate funcționalitățile critice au UI complet și așteaptă doar activarea endpoint-urilor backend.

**Status Actual:**
- ✅ **Frontend:** 100% implementat (UI, error handling, fallback mode)
- ⚠️ **Backend:** Necesită verificare și implementare endpoint-uri
- ⚠️ **Integrare:** Așteaptă verificare CORS, cookies, și endpoint-uri

**Blocaje Principale:**
1. **16 endpoint-uri critice** lipsesc pentru MVP (Cart, Checkout, Orders, Producer Products/Orders)
2. **CORS** trebuie configurat corect pentru `https://farme.ro` și preview deployments
3. **Cookie-based auth** trebuie configurat corect (httpOnly, secure, sameSite)
4. **Path prefixes** trebuie verificate (frontend folosește `/producers/*` plural, nu `/producer/*` singular)

---

### 5.2. Endpoint-uri Critice Necesare pentru MVP

| Endpoint | Metodă | Path | Status | Observații |
|----------|--------|------|--------|------------|
| Get Cart | `GET` | `/cart` | ❌ **LIPSEȘTE** | Returnează `Cart` sau 404 (frontend tratează ca empty) |
| Add to Cart | `POST` | `/cart/items` | ❌ **LIPSEȘTE** | Returnează `Cart` complet actualizat |
| Update Cart Item | `PATCH` | `/cart/items/:itemId` | ❌ **LIPSEȘTE** | Returnează `Cart` complet actualizat |
| Remove Cart Item | `DELETE` | `/cart/items/:itemId` | ❌ **LIPSEȘTE** | Returnează `Cart` complet actualizat sau 204 |
| Clear Cart | `DELETE` | `/cart` | ❌ **LIPSEȘTE** | Returnează `Cart` gol |
| Create Order | `POST` | `/orders` | ❌ **LIPSEȘTE** | Returnează `{ order, paymentUrl?, paymentIntentId? }` |
| List Client Orders | `GET` | `/orders` | ❌ **LIPSEȘTE** | Returnează `Order[]` sau `{ data: Order[], pagination }` |
| Get Client Order | `GET` | `/orders/:id` | ❌ **LIPSEȘTE** | Returnează `Order` complet |
| List Producer Products | `GET` | `/producers/products` | ❌ **LIPSEȘTE** | **IMPORTANT:** Plural `/producers/*`, nu `/producer/*` |
| Get Producer Product | `GET` | `/producers/products/:id` | ❌ **LIPSEȘTE** | **IMPORTANT:** Plural `/producers/*` |
| Create Producer Product | `POST` | `/producers/products` | ❌ **LIPSEȘTE** | **IMPORTANT:** Plural `/producers/*` |
| Update Producer Product | `PATCH` | `/producers/products/:id` | ❌ **LIPSEȘTE** | **IMPORTANT:** Plural `/producers/*` |
| Delete Producer Product | `DELETE` | `/producers/products/:id` | ❌ **LIPSEȘTE** | **IMPORTANT:** Plural `/producers/*` |
| List Producer Orders | `GET` | `/producers/orders` | ❌ **LIPSEȘTE** | **IMPORTANT:** Plural `/producers/*` |
| Get Producer Order | `GET` | `/producers/orders/:id` | ❌ **LIPSEȘTE** | **IMPORTANT:** Plural `/producers/*` |
| Update Producer Order Status | `PATCH` | `/producers/orders/:id/status` | ❌ **LIPSEȘTE** | **IMPORTANT:** Plural `/producers/*` |

**Total Endpoint-uri Critice:** 16

---

### 5.3. Endpoint-uri Non-Critice / Post-MVP

| Feature | Endpoint-uri | Prioritate | Status |
|---------|-------------|------------|--------|
| Client Profile | `GET /clients/me`, `PATCH /clients/me` | 🟡 IMPORTANT | ❌ **LIPSEȘTE** |
| Client Addresses | `GET /clients/addresses`, `POST /clients/addresses`, `PATCH /clients/addresses/:id`, `DELETE /clients/addresses/:id`, `PATCH /clients/addresses/:id/default` | 🟡 IMPORTANT | ❌ **LIPSEȘTE** |
| Favorites | `GET /clients/favorites`, `POST /clients/favorites`, `DELETE /clients/favorites/:id` | 🟡 IMPORTANT | ❌ **LIPSEȘTE** |
| Subscriptions | `GET /clients/subscriptions`, `POST /clients/subscriptions`, `PATCH /clients/subscriptions/:id` | 🟡 IMPORTANT | ❌ **LIPSEȘTE** |
| Alerts | `GET /clients/alert-preferences`, `PATCH /clients/alert-preferences` | 🟡 IMPORTANT | ❌ **LIPSEȘTE** |
| Business Dashboard | `GET /business/dashboard`, `GET /business/orders`, `GET /business/stats` | 🟡 IMPORTANT | ❌ **LIPSEȘTE** |
| Logistics Dashboard | `GET /logistics/dashboard`, `GET /logistics/deliveries`, `GET /logistics/stats`, `GET /logistics/commissions` | 🟡 IMPORTANT | ❌ **LIPSEȘTE** |
| Investor Analytics | `GET /investor/analytics`, `GET /investor/metrics` | 🟡 IMPORTANT | ❌ **LIPSEȘTE** |
| Notifications | `GET /notifications`, `POST /notifications/read`, `GET /notifications/preferences` | 🟡 IMPORTANT | ❌ **LIPSEȘTE** |
| Documents | `GET /documents`, `GET /documents/:id`, `POST /documents/contracts/draft` | 🟡 IMPORTANT | ❌ **LIPSEȘTE** |
| Promotions | `GET /producer/promotions/subscription`, `GET /producer/promotions/campaigns`, `POST /producer/promotions/campaigns` | 🟢 BONUS | ❌ **LIPSEȘTE** |

**Total Endpoint-uri Non-Critice:** 25+

---

### 5.4. Diferențe între Frontend Expectations vs Backend Actual

#### Path Prefixes

**Frontend Așteaptă:**
- `/cart/*` (fără prefix `/api/`)
- `/orders/*` (fără prefix `/api/`)
- `/clients/*` (fără prefix `/api/`)
- `/producers/*` (plural, fără prefix `/api/`)
- `/business/*` (fără prefix `/api/`)
- `/logistics/*` (fără prefix `/api/`)
- `/investor/*` (fără prefix `/api/`)

**Verificare Necesară:**
- [ ] Backend folosește prefix `/api/v1/` sau `/api/` sau `/`?
- [ ] Dacă da, frontend trebuie actualizat sau backend trebuie să suporte ambele?

#### Naming Conventions

**Diferențe Identificate:**
1. **Producer Products:** Frontend folosește `/producers/products` (plural), documentația menționează `/producer/products` (singular)
2. **Producer Orders:** Frontend folosește `/producers/orders` (plural), documentația menționează `/producer/orders` (singular)

**Recomandare:** Verifică în backend care variantă este folosită și aliniază frontend-ul sau backend-ul.

#### Response Formats

**Frontend Suportă:**
- Array direct: `Order[]`
- Paginated: `{ data: Order[], pagination: { page, limit, total, totalPages } }`

**Verificare Necesară:**
- [ ] Backend returnează array direct sau paginated?
- [ ] Dacă paginated, structura `pagination` este corectă?

#### Error Response Format

**Frontend Așteaptă:**
```json
{
  "error": "ErrorType",
  "message": "Mesaj user-friendly în română",
  "status": 400,
  "details": {
    // Detalii opționale pentru debugging
  }
}
```

**Verificare Necesară:**
- [ ] Backend returnează acest format de eroare?
- [ ] Mesajele sunt în română?

---

### 5.5. Cerințe de Configurare (CORS, Cookies, Env)

#### CORS Configuration

**Status:** ⚠️ **VERIFICARE NECESARĂ**

**Cerințe:**
- [ ] Permite origin-ul `https://farme.ro`
- [ ] Permite preview deployments (`https://farme-ro-*.vercel.app`)
- [ ] Permite `http://localhost:3000` pentru development
- [ ] `credentials: true` este activat
- [ ] Preflight requests (OPTIONS) sunt răspunse corect

**Configurare Recomandată:**
```javascript
app.use(cors({
  origin: [
    'https://farme.ro',
    /^https:\/\/farme-ro-.*\.vercel\.app$/,
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie', 'Retry-After'],
  maxAge: 86400
}))
```

---

#### Cookie-based Auth

**Status:** ⚠️ **VERIFICARE NECESARĂ**

**Cerințe:**
- [ ] Cookie-ul este `httpOnly: true`
- [ ] Cookie-ul este `secure: true` în production
- [ ] Cookie-ul are `sameSite: 'Lax'` sau `'Strict'`
- [ ] Cookie-ul este verificat la fiecare request protejat
- [ ] `401 Unauthorized` este returnat dacă cookie invalid/lipsă

**Configurare Recomandată:**
```javascript
res.cookie('session', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/'
})
```

---

#### Environment Variables

**Status:** ⚠️ **VERIFICARE NECESARĂ**

**Cerințe:**
- [ ] `FRONTEND_ORIGIN` este setat
- [ ] `FRONTEND_PREVIEW_ORIGIN_PATTERN` este setat
- [ ] `FRONTEND_DEV_ORIGIN` este setat
- [ ] `COOKIE_SECURE` este setat
- [ ] `COOKIE_SAME_SITE` este setat
- [ ] `COOKIE_HTTP_ONLY` este setat

---

### 5.6. Plan de Implementare Recomandat (Faza 1, 2, 3)

#### Faza 1: Core Commerce (🔴 CRITIC pentru MVP)

**Timp Estimat:** 2-3 săptămâni

**Endpoint-uri:**
1. Cart Management (5 endpoint-uri)
   - `GET /cart`
   - `POST /cart/items`
   - `PATCH /cart/items/:itemId`
   - `DELETE /cart/items/:itemId`
   - `DELETE /cart`

2. Checkout (1 endpoint)
   - `POST /orders`

3. Client Orders (2 endpoint-uri)
   - `GET /orders`
   - `GET /orders/:id`

4. Producer Products (5 endpoint-uri)
   - `GET /producers/products`
   - `GET /producers/products/:id`
   - `POST /producers/products`
   - `PATCH /producers/products/:id`
   - `DELETE /producers/products/:id`

5. Producer Orders (3 endpoint-uri)
   - `GET /producers/orders`
   - `GET /producers/orders/:id`
   - `PATCH /producers/orders/:id/status`

**Total:** 16 endpoint-uri

**Dependențe:**
- CORS configurat corect
- Cookie-based auth funcțional
- Database schema pentru Cart, Orders, Products

**Testare:**
- Testare manuală completă a flow-urilor
- Verificare error handling (401, 404, 422)
- Verificare sincronizare cart la login

**Activare Frontend:**
- Setează `BackendSyncStatus.cart = true`
- Setează `BackendSyncStatus.checkout = true`
- Setează `BackendSyncStatus.clientOrders = true`
- Setează `BackendSyncStatus.producerProducts = true`
- Setează `BackendSyncStatus.producerOrders = true`

---

#### Faza 2: Profile & Addresses (🟡 IMPORTANT)

**Timp Estimat:** 1 săptămână

**Endpoint-uri:**
1. Client Profile (2 endpoint-uri)
   - `GET /clients/me`
   - `PATCH /clients/me`

2. Client Addresses (5 endpoint-uri)
   - `GET /clients/addresses`
   - `POST /clients/addresses`
   - `PATCH /clients/addresses/:id`
   - `DELETE /clients/addresses/:id`
   - `PATCH /clients/addresses/:id/default`

**Total:** 7 endpoint-uri

**Dependențe:**
- Faza 1 completă
- Database schema pentru Addresses

**Testare:**
- Testare manuală CRUD pentru addresses
- Verificare setare adresă principală
- Verificare integrare cu checkout

**Activare Frontend:**
- Setează `BackendSyncStatus.clientProfile = true`
- Setează `BackendSyncStatus.clientAddresses = true`

---

#### Faza 3: Favorites & Alerts (🟡 IMPORTANT)

**Timp Estimat:** 3-5 zile

**Endpoint-uri:**
1. Favorites (3 endpoint-uri)
   - `GET /clients/favorites`
   - `POST /clients/favorites`
   - `DELETE /clients/favorites/:id`

2. Alerts (2 endpoint-uri)
   - `GET /clients/alert-preferences`
   - `PATCH /clients/alert-preferences`

**Total:** 5 endpoint-uri

**Dependențe:**
- Faza 1 completă
- Database schema pentru Favorites, AlertPreferences

**Testare:**
- Testare manuală CRUD pentru favorites
- Verificare localStorage fallback (frontend are deja implementat)

**Activare Frontend:**
- Setează `BackendSyncStatus.favorites = true`
- Setează `BackendSyncStatus.alerts = true`

---

#### Faza 4: Business & Logistics Portals (🟡 IMPORTANT)

**Timp Estimat:** 1 săptămână

**Endpoint-uri:**
1. Business Portal (3 endpoint-uri)
   - `GET /business/dashboard`
   - `GET /business/orders`
   - `GET /business/stats`

2. Logistics Portal (4 endpoint-uri)
   - `GET /logistics/dashboard`
   - `GET /logistics/deliveries`
   - `GET /logistics/stats`
   - `GET /logistics/commissions`

**Total:** 7 endpoint-uri

**Dependențe:**
- Faza 1 completă (pentru Orders)
- Database schema pentru Business, Logistics

**Testare:**
- Testare manuală dashboard-uri
- Verificare filtrare și paginare

**Activare Frontend:**
- Setează `BackendSyncStatus.businessDashboard = true`
- Setează `BackendSyncStatus.logisticsDashboard = true`

---

#### Faza 5: Investor Portal (🟡 IMPORTANT)

**Timp Estimat:** 1 săptămână

**Endpoint-uri:**
1. Investor Analytics (2 endpoint-uri)
   - `GET /investor/analytics`
   - `GET /investor/metrics`

**Total:** 2 endpoint-uri

**Dependențe:**
- Faza 1 completă (pentru Orders)
- Database schema pentru Investor metrics (anonimizate)

**Testare:**
- Testare manuală dashboard
- Verificare anonimizare date

**Activare Frontend:**
- Setează `BackendSyncStatus.investorDashboard = true`
- Setează `BackendSyncStatus.investorMetrics = true`

---

#### Faza 6: Notifications (🟡 IMPORTANT)

**Timp Estimat:** 1 săptămână

**Endpoint-uri:**
1. Notifications (3 endpoint-uri)
   - `GET /notifications`
   - `POST /notifications/read`
   - `GET /notifications/preferences`

**Total:** 3 endpoint-uri

**Dependențe:**
- Faza 1 completă
- Database schema pentru Notifications

**Testare:**
- Testare manuală notification center
- Verificare real-time updates (dacă e implementat)

**Activare Frontend:**
- Setează `BackendSyncStatus.notifications = true`

---

#### Faza 7: Subscriptions & Promotions (🟢 BONUS)

**Timp Estimat:** 2-3 săptămâni

**Endpoint-uri:**
1. Subscriptions (3 endpoint-uri)
   - `GET /clients/subscriptions`
   - `POST /clients/subscriptions`
   - `PATCH /clients/subscriptions/:id`

2. Promotions (3 endpoint-uri)
   - `GET /producer/promotions/subscription`
   - `GET /producer/promotions/campaigns`
   - `POST /producer/promotions/campaigns`

**Total:** 6 endpoint-uri

**Dependențe:**
- Faza 1 completă
- Database schema pentru Subscriptions, Promotions

**Testare:**
- Testare manuală flow-uri subscriptions
- Verificare recurring orders

**Activare Frontend:**
- Setează `BackendSyncStatus.subscriptions = true`
- Setează `BackendSyncStatus.promotions = true`

---

#### Faza 8: Documents & Contracts (🟢 BONUS)

**Timp Estimat:** 2 săptămâni

**Endpoint-uri:**
1. Documents (3 endpoint-uri)
   - `GET /documents`
   - `GET /documents/:id`
   - `POST /documents/contracts/draft`

**Total:** 3 endpoint-uri

**Dependențe:**
- Faza 1 completă
- Database schema pentru Documents, Contracts

**Testare:**
- Testare manuală generare contracte
- Verificare download documents

**Activare Frontend:**
- Setează `BackendSyncStatus.documents = true`
- Setează `BackendSyncStatus.partiesAndContracts = true`

---

## 6. Checklist Final pentru Backend Developer

### 6.1. Configurare

- [ ] CORS configurat corect (origins, credentials, methods, headers)
- [ ] Cookie httpOnly setat corect
- [ ] Cookie secure în production
- [ ] Cookie sameSite configurat
- [ ] Environment variables setate
- [ ] Health check endpoint implementat (`GET /health` sau similar)

---

### 6.2. Endpoint-uri MVP (Faza 1)

**Core Commerce (🔴 CRITIC):**
- [ ] `POST /cart/items` - Adaugă produs în coș
- [ ] `GET /cart` - Obține coșul
- [ ] `PATCH /cart/items/:itemId` - Actualizează cantitate
- [ ] `DELETE /cart/items/:itemId` - Șterge item
- [ ] `DELETE /cart` - Golește coșul
- [ ] `POST /orders` - Creează comandă
- [ ] `GET /orders` - Listă comenzi client
- [ ] `GET /orders/:id` - Detalii comandă client
- [ ] `GET /producers/products` - Listă produse producător (**IMPORTANT:** plural `/producers/*`)
- [ ] `GET /producers/products/:id` - Obține produs (**IMPORTANT:** plural `/producers/*`)
- [ ] `POST /producers/products` - Creează produs (**IMPORTANT:** plural `/producers/*`)
- [ ] `PATCH /producers/products/:id` - Actualizează produs (**IMPORTANT:** plural `/producers/*`)
- [ ] `DELETE /producers/products/:id` - Șterge produs (**IMPORTANT:** plural `/producers/*`)
- [ ] `GET /producers/orders` - Listă comenzi producător (**IMPORTANT:** plural `/producers/*`)
- [ ] `GET /producers/orders/:id` - Detalii comandă producător (**IMPORTANT:** plural `/producers/*`)
- [ ] `PATCH /producers/orders/:id/status` - Actualizează status comandă (**IMPORTANT:** plural `/producers/*`)

---

### 6.3. Testare

- [ ] Testează toate endpoint-urile cu Postman/curl
- [ ] Verifică CORS cu request-uri de la `https://farme.ro`
- [ ] Verifică cookie auth (login → request protejat)
- [ ] Verifică error handling (401, 404, 422)
- [ ] Verifică validare date (400 Bad Request)
- [ ] Verifică path prefixes (frontend folosește `/producers/*` plural)

---

## 7. Documentație Suplimentară

**Contracte API Complete:**
- `docs/FARMERO_BACKEND_HANDOFF_CHECKLIST.md` - Checklist complet pentru backend
- `docs/FARMERO_BACKENDSYNC_ACTIVATION_PLAN.md` - Plan de activare incrementală
- `docs/FARMERO_FINAL_LAUNCH_READINESS_REPORT.md` - Raport complet de pregătire lansare
- `docs/CORE_COMMERCE_IMPLEMENTATION_REPORT.md` - Raport implementare core commerce

**Fișiere API Frontend:**
- `src/lib/api/cart.ts` - Cart API
- `src/lib/api/orders.ts` - Orders API
- `src/lib/api/client-profile.ts` - Client Profile & Addresses API
- `src/lib/api/producer/products.ts` - Producer Products API
- `src/lib/api/producer/orders.ts` - Producer Orders API
- `src/lib/api/auth.ts` - Authentication API

**Tipuri Domain:**
- `src/lib/types/domain.ts` - Tipuri domain pentru frontend

---

**Document generat:** 2025-01-27  
**Status:** 🟡 **Așteaptă verificare și implementare backend**  
**Următorul pas:** Verifică în repo-ul backend dacă endpoint-urile există și sunt compatibile cu cerințele frontend-ului

