# API Endpoints Reference - farme.ro Backend

**Data:** 2025-01-27  
**Versiune API:** 1.0.0  
**Base URL:** `http://localhost:3001` (development) / `https://api.farme.ro` (production)

## 📋 Legendă

- 🔓 **Public** - Nu necesită autentificare
- 🔐 **Auth** - Necesită autentificare (JWT token)
- 👤 **Customer** - Necesită rol CUSTOMER
- 🏭 **Producer** - Necesită rol PRODUCER
- 👑 **Admin** - Necesită rol ADMIN

---

## 🔐 Autentificare

### POST /auth/register
- **Auth:** 🔓 Public
- **Body:** `{ email, password, fullName, role? }`
- **Response:** `{ token, user }`

### POST /auth/login
- **Auth:** 🔓 Public
- **Body:** `{ email, password }`
- **Response:** `{ token, user }`

### GET /auth/me
- **Auth:** 🔐 Auth
- **Response:** `{ user }`

---

## 🌐 Public API

### GET /regions
- **Auth:** 🔓 Public
- **Query:** `?type=COUNTY|REGION`
- **Response:** `{ regions: Region[] }`

### GET /api/public/products
- **Auth:** 🔓 Public
- **Query:** `?q=search&regionId=uuid&priceMin=0&priceMax=100&page=1&limit=20`
- **Response:** `{ products: Product[], pagination }`

### GET /api/public/products/:slug
- **Auth:** 🔓 Public
- **Response:** `{ product: Product }`

### GET /api/public/producers
- **Auth:** 🔓 Public
- **Query:** `?regionId=uuid&page=1&limit=20`
- **Response:** `{ producers: Producer[], pagination }`

### GET /api/public/producers/:slug
- **Auth:** 🔓 Public
- **Response:** `{ producer: Producer, products: Product[] }`

---

## 🛒 Cart

### GET /cart
- **Auth:** 🔐 Auth
- **Response:** `{ cart: Cart & { items: CartItem[], total: number } }`

### POST /cart/items
- **Auth:** 🔐 Auth
- **Body:** `{ productId: uuid, quantity: number }`
- **Response:** `{ item: CartItem }`

### PUT /cart/items/:id
- **Auth:** 🔐 Auth
- **Body:** `{ quantity: number }`
- **Response:** `{ item: CartItem }`

### DELETE /cart/items/:id
- **Auth:** 🔐 Auth
- **Response:** `{ message: "Item șters" }`

---

## 📦 Orders

### POST /orders/checkout
- **Auth:** 🔐 Auth
- **Body:** `{ shippingFullName, shippingPhone, shippingAddressLine1, shippingCity, shippingPostalCode?, shippingRegionId?, companyName?, companyCui?, companyRegNo?, companyAddress?, notes?, paymentMethod }`
- **Response:** `{ order: Order }`

### GET /orders
- **Auth:** 🔐 Auth (👤 Customer)
- **Query:** `?status=PENDING|PAID|COMPLETED|CANCELLED`
- **Response:** `Order[]`

### GET /orders/:id
- **Auth:** 🔐 Auth (👤 Customer)
- **Response:** `{ order: Order }`

### GET /api/orders/mine
- **Auth:** 🔐 Auth (🏭 Producer)
- **Query:** `?status=PENDING|ACCEPTED|PREPARING|SHIPPED|DELIVERED|CANCELLED`
- **Response:** `{ orders: OrderVendor[] }`

### PATCH /api/orders/vendor/orders/:id/status
- **Auth:** 🔐 Auth (🏭 Producer)
- **Body:** `{ status: OrderVendorStatus }`
- **Response:** `{ orderVendor: OrderVendor }`

---

## 👤 Client Features

### GET /clients/me
- **Auth:** 🔐 Auth (👤 Customer)
- **Response:** `{ client: ClientProfile }`

### PATCH /clients/me
- **Auth:** 🔐 Auth (👤 Customer)
- **Body:** `{ fullName?, phone?, email? }`
- **Response:** `{ client: ClientProfile }`

### GET /clients/addresses
- **Auth:** 🔐 Auth (👤 Customer)
- **Response:** `ShippingAddress[]`

### POST /clients/addresses
- **Auth:** 🔐 Auth (👤 Customer)
- **Body:** `{ name, phone, email?, city, address, postalCode?, notes? }`
- **Response:** `{ address: ShippingAddress }`

### PATCH /clients/addresses/:id
- **Auth:** 🔐 Auth (👤 Customer)
- **Body:** `{ name?, phone?, email?, city?, address?, postalCode?, notes? }`
- **Response:** `{ address: ShippingAddress }`

### DELETE /clients/addresses/:id
- **Auth:** 🔐 Auth (👤 Customer)
- **Response:** `{ message: "Adresă ștearsă" }`

### PATCH /clients/addresses/:id/default
- **Auth:** 🔐 Auth (👤 Customer)
- **Response:** `{ address: ShippingAddress }`

### GET /clients/favorites
- **Auth:** 🔐 Auth (👤 Customer)
- **Response:** `Favorite[]`

### POST /clients/favorites
- **Auth:** 🔐 Auth (👤 Customer)
- **Body:** `{ productId: uuid }`
- **Response:** `{ favorite: Favorite }`

### DELETE /clients/favorites/:id
- **Auth:** 🔐 Auth (👤 Customer)
- **Response:** `{ message: "Favorite șters" }`

### GET /clients/subscriptions
- **Auth:** 🔐 Auth (👤 Customer)
- **Response:** `Subscription[]`

### POST /clients/subscriptions
- **Auth:** 🔐 Auth (👤 Customer)
- **Body:** `{ productId: uuid, quantity: number, frequency: string, startDate: ISO }`
- **Response:** `{ subscription: Subscription }`

### PATCH /clients/subscriptions/:id
- **Auth:** 🔐 Auth (👤 Customer)
- **Body:** `{ quantity?, frequency?, endDate?, isActive? }`
- **Response:** `{ subscription: Subscription }`

### GET /clients/alert-preferences
- **Auth:** 🔐 Auth (👤 Customer)
- **Response:** `{ preferences: AlertPreferences }`

### PATCH /clients/alert-preferences
- **Auth:** 🔐 Auth (👤 Customer)
- **Body:** `{ emailNewProducts?, emailPriceDrops?, emailStockAlerts?, emailOrderUpdates? }`
- **Response:** `{ preferences: AlertPreferences }`

---

## 🏭 Producer Features

### GET /api/products/mine
- **Auth:** 🔐 Auth (🏭 Producer)
- **Query:** `?status=DRAFT|PENDING_REVIEW|APPROVED|REJECTED`
- **Response:** `{ products: Product[] }`

### POST /api/products
- **Auth:** 🔐 Auth (🏭 Producer)
- **Body:** `{ name, description?, price, stock, unit?, imageUrl?, category?, isTraditional?, isBio?, regionId? }`
- **Response:** `{ product: Product }`

### PATCH /api/products/:id
- **Auth:** 🔐 Auth (🏭 Producer sau 👑 Admin)
- **Body:** `{ name?, description?, price?, stock?, unit?, imageUrl?, category?, isTraditional?, isBio?, regionId? }`
- **Response:** `{ product: Product }`

### DELETE /api/products/:id
- **Auth:** 🔐 Auth (🏭 Producer sau 👑 Admin)
- **Response:** `{ message: "Produs șters" }`

### GET /api/producers/me
- **Auth:** 🔐 Auth (🏭 Producer)
- **Response:** `{ producer: Producer }`

### PATCH /api/producers/me
- **Auth:** 🔐 Auth (🏭 Producer)
- **Body:** `{ name?, description?, mainRegionId? }`
- **Response:** `{ producer: Producer }`

---

## 💳 Payments

### POST /api/payments/create-checkout
- **Auth:** 🔐 Auth
- **Body:** `{ orderId: uuid }`
- **Response:** `{ sessionId: string, url: string }`

### POST /api/payments/webhook
- **Auth:** 🔓 Public (verificare semnătură Stripe)
- **Body:** Stripe webhook event
- **Response:** `{ received: true }`

---

## 📊 Business/Logistics/Investor

### GET /business/dashboard
- **Auth:** 🔐 Auth (👤 Customer cu cont business)
- **Response:** `{ stats: BusinessStats }`

### GET /logistics/dashboard
- **Auth:** 🔐 Auth (👑 Admin sau rol logistics)
- **Response:** `{ stats: LogisticsStats }`

### GET /investor/analytics
- **Auth:** 🔐 Auth (👑 Admin sau rol investor)
- **Response:** `{ analytics: InvestorAnalytics }`

---

## 🔔 Notifications

### GET /notifications
- **Auth:** 🔐 Auth
- **Response:** `Notification[]`

### POST /notifications/:id/read
- **Auth:** 🔐 Auth
- **Response:** `{ notification: Notification }`

---

## 📄 Documents

### GET /documents
- **Auth:** 🔐 Auth
- **Response:** `Document[]`

### GET /documents/:id
- **Auth:** 🔐 Auth
- **Response:** `{ document: Document }`

---

## 🎯 Promotions

### GET /producer/promotions
- **Auth:** 🔐 Auth (🏭 Producer)
- **Response:** `Promotion[]`

### POST /producer/promotions
- **Auth:** 🔐 Auth (🏭 Producer)
- **Body:** `{ title, description?, discountType, discountValue, startDate, endDate, productId? }`
- **Response:** `{ promotion: Promotion }`

---

## ⚠️ Error Responses

Toate endpoint-urile pot returna:

- **400 Bad Request** - Date invalide
- **401 Unauthorized** - Necesită autentificare
- **403 Forbidden** - Nu ai permisiune
- **404 Not Found** - Resursă negăsită
- **422 Unprocessable Entity** - Validare eșuată
- **500 Internal Server Error** - Eroare server

**Format eroare:**
```json
{
  "error": "Mesaj eroare",
  "details": [...] // Opțional, pentru validări
}
```

---

**Status:** ✅ **Documentație completă pentru toate endpoint-urile**

**Următorul pas:** Folosește acest document pentru testare și referință rapidă

