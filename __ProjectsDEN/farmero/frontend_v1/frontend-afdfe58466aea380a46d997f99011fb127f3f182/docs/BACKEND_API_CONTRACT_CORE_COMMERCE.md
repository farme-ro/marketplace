# Backend API Contract - Core Commerce

**Data:** 2024  
**Scop:** Documentație pentru contractele API între frontend (Next.js) și backend (api.farme.ro)  
**Status:** Frontend-ready, așteaptă implementare backend

---

## 📋 Preambul

Acest document descrie contractele API pentru funcționalitățile Core Commerce:
- **Cart Management** - Gestionarea coșului de cumpărături
- **Checkout & Orders** - Crearea și gestionarea comenzilor client
- **Producer Products** - Gestionarea produselor producătorilor
- **Producer Orders** - Gestionarea comenzilor producătorilor

**IMPORTANT:** 
- Frontend-ul este pregătit și folosește aceste contracte
- Backend-ul trebuie să implementeze aceste endpoint-uri conform specificațiilor
- Toate request-urile folosesc `credentials: 'include'` pentru cookie-based authentication
- Base URL: `https://api.farme.ro`

---

## 🔐 Autentificare

Toate endpoint-urile (exceptând cele publice) necesită autentificare via cookies:
- Request-urile includ `credentials: 'include'`
- Backend-ul verifică cookie-ul de sesiune
- Răspunsuri de eroare:
  - `401 Unauthorized` - Nu este autentificat
  - `403 Forbidden` - Autentificat dar fără permisiuni

---

## 🛒 Cart Management

### GET /cart

**Descriere:** Obține coșul de cumpărături al utilizatorului autentificat

**Method:** `GET`

**Headers:**
```
Cookie: session=...
```

**Response Success (200):**
```typescript
{
  id: string
  items: Array<{
    id: string
    productId: string
    quantity: number
    price: number
    total: number
    product: {
      id: string
      name: string
      slug: string
      imageUrl?: string
      producerName?: string
      producerId?: string
      unit?: string
    }
  }>
  subtotal: number
  shippingCost: number
  total: number
  currency: string
  createdAt?: string
  updatedAt?: string
}
```

**Exemplu JSON:**
```json
{
  "id": "cart_123",
  "items": [
    {
      "id": "item_456",
      "productId": "prod_789",
      "quantity": 2,
      "price": 25.50,
      "total": 51.00,
      "product": {
        "id": "prod_789",
        "name": "Mere Bio",
        "slug": "mere-bio",
        "imageUrl": "https://api.farme.ro/images/mere-bio.jpg",
        "producerName": "Ferma Verde",
        "producerId": "prod_001",
        "unit": "kg"
      }
    }
  ],
  "subtotal": 51.00,
  "shippingCost": 15.00,
  "total": 66.00,
  "currency": "RON",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T11:00:00Z"
}
```

**Response Errors:**
- `401 Unauthorized` - Nu este autentificat
- `404 Not Found` - Coșul nu există (frontend tratează ca coș gol)

**Notă:** Dacă utilizatorul nu are coș, backend-ul poate returna `404` sau un coș gol. Frontend-ul tratează `404` ca un coș gol.

---

### POST /cart/items

**Descriere:** Adaugă un produs în coș

**Method:** `POST`

**Request Body:**
```typescript
{
  productId: string
  quantity: number
  variantId?: string  // Optional: pentru variante de produs
  notes?: string      // Optional: note pentru acest item
}
```

**Exemplu JSON:**
```json
{
  "productId": "prod_789",
  "quantity": 2,
  "notes": "Produse proaspete, te rog"
}
```

**Response Success (200/201):**
```typescript
// Returnează cart-ul actualizat (același format ca GET /cart)
{
  id: string
  items: Array<CartItem>
  subtotal: number
  shippingCost: number
  total: number
  currency: string
}
```

**Response Errors:**
- `400 Bad Request` - Date invalide (productId lipsă, quantity <= 0, etc.)
- `401 Unauthorized` - Nu este autentificat
- `404 Not Found` - Produsul nu există
- `422 Unprocessable Entity` - Stoc insuficient sau produs indisponibil

---

### PATCH /cart/items/:itemId

**Descriere:** Actualizează cantitatea unui item din coș

**Method:** `PATCH`

**URL Parameters:**
- `itemId` - ID-ul item-ului din coș

**Request Body:**
```typescript
{
  quantity: number  // Noua cantitate (trebuie să fie > 0)
}
```

**Exemplu JSON:**
```json
{
  "quantity": 3
}
```

**Response Success (200):**
```typescript
// Returnează cart-ul actualizat
{
  id: string
  items: Array<CartItem>
  subtotal: number
  shippingCost: number
  total: number
  currency: string
}
```

**Response Errors:**
- `400 Bad Request` - Cantitate invalidă (<= 0)
- `401 Unauthorized` - Nu este autentificat
- `404 Not Found` - Item-ul nu există în coș
- `422 Unprocessable Entity` - Stoc insuficient pentru noua cantitate

**Notă:** Frontend-ul trimite `quantity <= 0` ca un DELETE în loc de PATCH.

---

### DELETE /cart/items/:itemId

**Descriere:** Elimină un item din coș

**Method:** `DELETE`

**URL Parameters:**
- `itemId` - ID-ul item-ului din coș

**Response Success (200/204):**
```typescript
// Returnează cart-ul actualizat (sau 204 No Content)
{
  id: string
  items: Array<CartItem>
  subtotal: number
  shippingCost: number
  total: number
  currency: string
}
```

**Response Errors:**
- `401 Unauthorized` - Nu este autentificat
- `404 Not Found` - Item-ul nu există (frontend tratează ca success)

---

### DELETE /cart

**Descriere:** Golește complet coșul

**Method:** `DELETE`

**Response Success (200/204):**
```typescript
// Returnează coș gol
{
  id: string
  items: []
  subtotal: 0
  shippingCost: 0
  total: 0
  currency: "RON"
}
```

**Response Errors:**
- `401 Unauthorized` - Nu este autentificat

---

## 📦 Orders (Client)

### POST /orders

**Descriere:** Creează o comandă nouă din coșul curent

**Method:** `POST`

**Request Body:**
```typescript
{
  // Shipping address
  name: string
  email: string
  phone: string
  city: string
  address: string
  postalCode?: string
  notes?: string
  
  // Payment method
  paymentMethod: 'card' | 'cod' | 'bank_transfer' | 'other'
  
  // Optional: account ID (pentru multi-account support)
  accountId?: string
  
  // Optional: explicit items (dacă backend nu folosește cart-ul)
  items?: Array<{
    productId: string
    quantity: number
  }>
}
```

**Exemplu JSON:**
```json
{
  "name": "Ion Popescu",
  "email": "ion@example.com",
  "phone": "+40712345678",
  "city": "București",
  "address": "Str. Exemplu, Nr. 123",
  "postalCode": "010101",
  "notes": "Livrare la parter",
  "paymentMethod": "cod",
  "accountId": "acc_personal_123"
}
```

**Response Success (201):**
```typescript
{
  order: {
    id: string
    number?: string
    status: 'pending' | 'confirmed' | 'prepared' | 'shipped' | 'delivered' | 'cancelled' | 'paid' | 'processing' | 'canceled' | 'uncollected'
    total: number
    subtotal?: number
    shippingCost?: number
    items: Array<{
      id?: string
      productId: string
      productName?: string
      productSlug?: string
      name: string
      quantity: number
      price: number
      total?: number
      producerName?: string
      producerId?: string
      unit?: string
      imageUrl?: string
    }>
    clientId?: string
    producerId?: string
    shippingAddress?: {
      name: string
      phone: string
      email?: string
      city: string
      address: string
      postalCode?: string
      notes?: string
    }
    paymentMethod?: 'card' | 'cod' | 'bank_transfer' | 'other'
    paymentStatus?: 'pending' | 'paid' | 'failed'
    notes?: string
    createdAt?: string
    updatedAt?: string
  }
  paymentUrl?: string  // Dacă e necesar redirect la payment (ex: Stripe)
  paymentIntentId?: string  // Pentru Stripe sau alte payment gateways
}
```

**Exemplu JSON:**
```json
{
  "order": {
    "id": "order_123",
    "number": "ORD-2024-001",
    "status": "pending",
    "total": 66.00,
    "subtotal": 51.00,
    "shippingCost": 15.00,
    "items": [
      {
        "id": "item_1",
        "productId": "prod_789",
        "productName": "Mere Bio",
        "productSlug": "mere-bio",
        "name": "Mere Bio",
        "quantity": 2,
        "price": 25.50,
        "total": 51.00,
        "producerName": "Ferma Verde",
        "producerId": "prod_001",
        "unit": "kg",
        "imageUrl": "https://api.farme.ro/images/mere-bio.jpg"
      }
    ],
    "clientId": "client_456",
    "shippingAddress": {
      "name": "Ion Popescu",
      "phone": "+40712345678",
      "email": "ion@example.com",
      "city": "București",
      "address": "Str. Exemplu, Nr. 123",
      "postalCode": "010101",
      "notes": "Livrare la parter"
    },
    "paymentMethod": "cod",
    "paymentStatus": "pending",
    "createdAt": "2024-01-15T12:00:00Z"
  }
}
```

**Response Errors:**
- `400 Bad Request` - Date invalide (câmpuri lipsă sau invalide)
- `401 Unauthorized` - Nu este autentificat
- `404 Not Found` - Coșul este gol sau nu există
- `422 Unprocessable Entity` - Stoc insuficient, produse indisponibile, sau alte probleme de validare

**Notă:** Backend-ul trebuie să valideze:
- Coșul nu este gol
- Toate produsele sunt disponibile
- Stocul este suficient pentru toate cantitățile
- Adresa de livrare este completă

---

### GET /orders

**Descriere:** Obține lista de comenzi ale clientului autentificat

**Method:** `GET`

**Query Parameters (opțional):**
- `status` - Filtrare după status
- `page` - Număr pagină (pentru paginare)
- `limit` - Număr de rezultate pe pagină

**Response Success (200):**
```typescript
// Poate fi array sau paginated response
Array<Order> | {
  data: Array<Order>
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

**Format Order:**
```typescript
{
  id: string
  number?: string
  status: 'pending' | 'confirmed' | 'prepared' | 'shipped' | 'delivered' | 'cancelled' | 'paid' | 'processing' | 'canceled' | 'uncollected'
  total: number
  subtotal?: number
  shippingCost?: number
  items: Array<OrderItem>
  clientId?: string
  producerId?: string
  shippingAddress?: ShippingAddress
  paymentMethod?: 'card' | 'cod' | 'bank_transfer' | 'other'
  paymentStatus?: 'pending' | 'paid' | 'failed'
  notes?: string
  createdAt?: string
  updatedAt?: string
}
```

**Response Errors:**
- `401 Unauthorized` - Nu este autentificat

---

### GET /orders/:id

**Descriere:** Obține detaliile unei comenzi specifice

**Method:** `GET`

**URL Parameters:**
- `id` - ID-ul comenzii

**Response Success (200):**
```typescript
// Același format ca Order din GET /orders
{
  id: string
  number?: string
  status: string
  total: number
  // ... rest of order fields
}
```

**Response Errors:**
- `401 Unauthorized` - Nu este autentificat
- `403 Forbidden` - Comanda nu aparține clientului autentificat
- `404 Not Found` - Comanda nu există

---

## 🏭 Producer Products

### GET /producers/products

**Descriere:** Obține lista de produse ale producătorului autentificat

**Method:** `GET`

**Response Success (200):**
```typescript
// Poate fi array sau paginated response
Array<ProducerProduct> | {
  data: Array<ProducerProduct>
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

**Format ProducerProduct:**
```typescript
{
  id: string
  name: string
  slug?: string
  description?: string
  price: number
  unit: string
  stock?: number
  isActive: boolean
  imageUrl?: string
  categoryId?: string
  categoryName?: string
  regionId?: string
  isBio?: boolean
  isTraditional?: boolean
  createdAt?: string
  updatedAt?: string
}
```

**Response Errors:**
- `401 Unauthorized` - Nu este autentificat sau nu este producător

---

### GET /producers/products/:id

**Descriere:** Obține detaliile unui produs specific

**Method:** `GET`

**URL Parameters:**
- `id` - ID-ul produsului

**Response Success (200):**
```typescript
// Același format ca ProducerProduct
{
  id: string
  name: string
  // ... rest of fields
}
```

**Response Errors:**
- `401 Unauthorized` - Nu este autentificat
- `403 Forbidden` - Produsul nu aparține producătorului autentificat
- `404 Not Found` - Produsul nu există

---

### POST /producers/products

**Descriere:** Creează un produs nou

**Method:** `POST`

**Request Body:**
```typescript
{
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

**Exemplu JSON:**
```json
{
  "name": "Mere Bio",
  "description": "Mere bio de la ferma noastră",
  "price": 25.50,
  "unit": "kg",
  "stock": 100,
  "categoryId": "cat_fruits",
  "regionId": "reg_bucuresti",
  "isBio": true,
  "isTraditional": false
}
```

**Response Success (201):**
```typescript
// Returnează produsul creat (format ProducerProduct)
{
  id: string
  name: string
  // ... rest of fields
}
```

**Response Errors:**
- `400 Bad Request` - Date invalide (câmpuri obligatorii lipsă, preț invalid, etc.)
- `401 Unauthorized` - Nu este autentificat sau nu este producător

---

### PATCH /producers/products/:id

**Descriere:** Actualizează un produs existent

**Method:** `PATCH`

**URL Parameters:**
- `id` - ID-ul produsului

**Request Body:**
```typescript
{
  name?: string
  description?: string
  price?: number
  unit?: string
  stock?: number
  categoryId?: string
  regionId?: string
  imageUrl?: string
  isBio?: boolean
  isTraditional?: boolean
  isActive?: boolean  // Pentru activare/dezactivare
}
```

**Response Success (200):**
```typescript
// Returnează produsul actualizat
{
  id: string
  name: string
  // ... rest of fields
}
```

**Response Errors:**
- `400 Bad Request` - Date invalide
- `401 Unauthorized` - Nu este autentificat
- `403 Forbidden` - Produsul nu aparține producătorului
- `404 Not Found` - Produsul nu există

---

### DELETE /producers/products/:id

**Descriere:** Șterge un produs

**Method:** `DELETE`

**URL Parameters:**
- `id` - ID-ul produsului

**Response Success (200/204):**
- `200 OK` cu body gol sau
- `204 No Content`

**Response Errors:**
- `401 Unauthorized` - Nu este autentificat
- `403 Forbidden` - Produsul nu aparține producătorului
- `404 Not Found` - Produsul nu există

---

## 📋 Producer Orders

### GET /producers/orders

**Descriere:** Obține lista de comenzi ale producătorului autentificat

**Method:** `GET`

**Query Parameters (opțional):**
- `status` - Filtrare după status (`pending`, `confirmed`, `preparing`, `shipped`, `delivered`, `canceled`, `uncollected`)
- `startDate` - Data de început (ISO 8601)
- `endDate` - Data de sfârșit (ISO 8601)

**Response Success (200):**
```typescript
// Poate fi array sau paginated response
Array<ProducerOrder> | {
  data: Array<ProducerOrder>
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

**Format ProducerOrder:**
```typescript
{
  id: string
  number: string
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'canceled' | 'uncollected'
  total: number
  currency?: string
  createdAt: string
  updatedAt?: string
  customerName: string
  customerEmail?: string
  customerPhone: string
  shippingAddress: {
    name: string
    city: string
    address: string
    postalCode?: string
    notes?: string
  }
  paymentMethod: 'card' | 'cod' | 'bank_transfer' | 'other'
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded'
  items: Array<{
    id: string
    productId: string
    productName: string
    productSlug?: string
    quantity: number
    price: number
    total: number
    unit?: string
  }>
  notes?: string
  estimatedDeliveryDate?: string
}
```

**Response Errors:**
- `401 Unauthorized` - Nu este autentificat sau nu este producător

---

### GET /producers/orders/:id

**Descriere:** Obține detaliile unei comenzi specifice

**Method:** `GET`

**URL Parameters:**
- `id` - ID-ul comenzii

**Response Success (200):**
```typescript
// Același format ca ProducerOrder din GET /producers/orders
{
  id: string
  number: string
  // ... rest of fields
}
```

**Response Errors:**
- `401 Unauthorized` - Nu este autentificat
- `403 Forbidden` - Comanda nu aparține producătorului autentificat
- `404 Not Found` - Comanda nu există

---

### PATCH /producers/orders/:id/status

**Descriere:** Actualizează statusul unei comenzi

**Method:** `PATCH`

**URL Parameters:**
- `id` - ID-ul comenzii

**Request Body:**
```typescript
{
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'canceled' | 'uncollected'
  notes?: string  // Optional: note pentru schimbarea de status
}
```

**Exemplu JSON:**
```json
{
  "status": "confirmed",
  "notes": "Comandă confirmată, începem pregătirea"
}
```

**Response Success (200):**
```typescript
// Returnează comanda actualizată
{
  id: string
  number: string
  status: string
  // ... rest of fields
}
```

**Response Errors:**
- `400 Bad Request` - Status invalid sau tranziție de status nepermisă
- `401 Unauthorized` - Nu este autentificat
- `403 Forbidden` - Comanda nu aparține producătorului
- `404 Not Found` - Comanda nu există

**Notă:** Backend-ul trebuie să valideze tranzițiile de status (ex: nu se poate trece direct de la `pending` la `delivered`).

---

## 🔄 Normalizare de Date

Frontend-ul folosește mapper-e pentru a normaliza răspunsurile API:

### mapApiOrderToOrder

Mapper-ul acceptă atât formatul `snake_case` cât și `camelCase`:

```typescript
// Backend poate trimite:
{
  "id": "123",
  "order_number": "ORD-001",  // sau "orderNumber"
  "total_amount": 100.50,      // sau "totalAmount"
  "shipping_address": {         // sau "shippingAddress"
    "postal_code": "010101"     // sau "postalCode"
  }
}

// Frontend normalizează la:
{
  id: "123",
  number: "ORD-001",
  total: 100.50,
  shippingAddress: {
    postalCode: "010101"
  }
}
```

**Recomandare:** Backend-ul ar trebui să folosească un format consistent (preferabil `camelCase` pentru consistență cu frontend-ul).

---

## 📝 Note Importante

1. **Cookie-based Authentication:** Toate request-urile includ `credentials: 'include'` pentru a trimite cookie-urile de sesiune.

2. **Error Handling:** Frontend-ul tratează erorile astfel:
   - `401` → Redirect la login cu return URL
   - `403` → Mesaj "Nu ai permisiunea"
   - `404` → Mesaj "Resursa nu există"
   - `422` → Mesaje specifice (stoc insuficient, date invalide)

3. **Fallback Behavior:** Când `BackendSyncStatus` este `false`, frontend-ul:
   - Liste → returnează `[]`
   - Detalii → aruncă eroare clară
   - Create/Update/Delete → aruncă eroare clară

4. **Paginare:** Frontend-ul acceptă atât array direct cât și format paginated:
   ```typescript
   // Format 1: Array direct
   [{...}, {...}]
   
   // Format 2: Paginated
   {
     data: [{...}, {...}],
     pagination: { page: 1, limit: 10, total: 20, totalPages: 2 }
   }
   ```

5. **Status Normalization:** Frontend-ul normalizează status-urile la lowercase și mapează variantele:
   - `cancelled` / `canceled` → `cancelled`
   - `paid` / `processing` / `confirmed` → păstrate ca atare

---

## ✅ Checklist pentru Backend

Când backend-ul implementează aceste endpoint-uri, trebuie să verifice:

- [ ] Toate endpoint-urile returnează formatul JSON specificat
- [ ] Error codes sunt corecte (401, 403, 404, 422)
- [ ] Cookie-based authentication funcționează
- [ ] Validările de date sunt implementate (400, 422)
- [ ] Status transitions sunt validate pentru orders
- [ ] Stock validation funcționează pentru cart și orders
- [ ] Pagination este implementată (dacă e necesar)
- [ ] Response format este consistent (array sau paginated)

---

**Ultima actualizare:** 2024  
**Versiune:** 1.0

