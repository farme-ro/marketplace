# 🔗 Farmero Backend Handoff Checklist

**Data:** 2025-01-27  
**Scop:** Checklist complet pentru echipa backend - ce trebuie implementat pentru integrare cu frontend  
**Status:** 🟡 Așteaptă implementare backend

---

## 📋 Preambul

Acest document conține toate specificațiile tehnice necesare pentru integrarea backend-ului cu frontend-ul Farmero. Frontend-ul este complet implementat și așteaptă endpoint-urile backend pentru activare.

**Base URL Backend:** `https://api.farme.ro`  
**Base URL Frontend:** `https://farme.ro` (production), `https://farme-ro-*.vercel.app` (preview)

---

## 1. Environment Variables

### 1.1. Frontend (Vercel)

**Obligatorii:**
```env
NEXT_PUBLIC_API_URL=https://api.farme.ro
```

**Opționale (Recomandate):**
```env
NEXT_PUBLIC_APP_URL=https://farme.ro
NEXT_PUBLIC_SITE_URL=https://farme.ro
```

**Setare:**
- Vercel Dashboard → Settings → Environment Variables
- Environment: ✅ Production, ✅ Preview, ✅ Development
- **IMPORTANT:** Redeploy după adăugarea variabilelor

---

### 1.2. Backend

**Necesare pentru integrare:**
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

---

## 2. CORS Configuration

### 2.1. Configurare Exactă

Backend-ul trebuie să permită request-uri de la frontend cu următoarea configurare:

```javascript
// Exemplu pentru Express.js
const cors = require('cors')

app.use(cors({
  origin: [
    'https://farme.ro',                    // Production
    /^https:\/\/farme-ro-.*\.vercel\.app$/, // Preview deployments (regex)
    'http://localhost:3000'                // Development
  ],
  credentials: true,  // OBLIGATORIU - pentru cookie-based auth
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Cookie',
    'X-Requested-With'
  ],
  exposedHeaders: [
    'Set-Cookie',
    'Retry-After'  // Pentru rate limiting (429)
  ],
  maxAge: 86400  // 24 ore pentru preflight cache
}))
```

**Verificare:**
- ✅ Frontend trimite `credentials: 'include'` în toate request-urile
- ⚠️ **Backend:** Verifică că CORS permite origin-ul frontend-ului și `credentials: true`

---

### 2.2. Preflight Requests (OPTIONS)

Backend-ul trebuie să răspundă corect la preflight requests:

```javascript
// Exemplu handler pentru OPTIONS
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin)
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie')
  res.sendStatus(200)
})
```

---

## 3. Autentificare (Cookie-based)

### 3.1. Ce Așteaptă Frontend-ul

**Autentificare:** Cookie-based (httpOnly cookies)

**Flow:**
1. User se loghează prin `POST /auth/login`
2. Backend setează cookie httpOnly cu session token
3. Frontend face request-uri cu `credentials: 'include'`
4. Backend verifică cookie-ul și returnează date

**Rute Concrete:**
- `POST /auth/login` - Login (returnează cookie)
- `POST /auth/logout` - Logout (șterge cookie)
- `GET /auth/me` - Obține user curent (verifică cookie)

---

### 3.2. Cookie Settings (Backend)

**Obligatoriu:**
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

**Verificare Cookie:**
- Backend verifică cookie-ul la fiecare request protejat
- Dacă cookie invalid/lipsă → returnează `401 Unauthorized`
- Dacă cookie expirat → returnează `401 Unauthorized`

---

### 3.3. Răspunsuri de Eroare Auth

**401 Unauthorized:**
```json
{
  "error": "Unauthorized",
  "message": "Nu ești autentificat. Te rugăm să te conectezi.",
  "status": 401
}
```

**403 Forbidden:**
```json
{
  "error": "Forbidden",
  "message": "Nu ai permisiuni pentru această acțiune.",
  "status": 403
}
```

**Frontend Action:**
- `401` → Redirect automat la `/login?returnUrl=<ruta>`
- `403` → Afișează mesaj "Nu ai permisiuni"

---

## 4. Endpoint-uri Minime pentru MVP

### 4.1. Module: Client (Auth, Cart, Checkout, Orders)

#### Auth (✅ EXISTĂ - Funcțional)

**Status:** ✅ Backend implementat și funcțional

**Endpoint-uri:**
- ✅ `POST /auth/login` - Login
- ✅ `POST /auth/logout` - Logout
- ✅ `GET /auth/me` - Obține user curent

**Notă:** Aceste endpoint-uri sunt deja funcționale. Verifică doar că respectă contractele de mai jos.

---

#### Cart Management

**Prioritate:** 🔴 **CRITIC**

##### `POST /cart/items`

**Method:** `POST`  
**Path:** `/cart/items`  
**Auth:** ✅ Cookie-based (httpOnly)

**Request Body (Minim):**
```json
{
  "productId": "prod_789",
  "quantity": 2
}
```

**Request Body (Complet - dacă backend suportă):**
```json
{
  "productId": "prod_789",
  "quantity": 2,
  "variantId": "variant_123",  // Optional
  "notes": "Produse proaspete, te rog"  // Optional
}
```

**Response Success (200/201):**
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
  "currency": "RON"
}
```

**Response Errors:**
- `400 Bad Request` - Date invalide (productId lipsă, quantity <= 0)
- `401 Unauthorized` - Nu este autentificat
- `404 Not Found` - Produsul nu există
- `422 Unprocessable Entity` - Stoc insuficient

**Frontend Expects:**
- Returnează cart-ul complet actualizat (nu doar item-ul adăugat)
- Dacă produsul există deja în coș, actualizează cantitatea (sau creează item nou - specifică în documentație)

---

##### `GET /cart`

**Method:** `GET`  
**Path:** `/cart`  
**Auth:** ✅ Cookie-based

**Response Success (200):**
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

**Frontend Expects:**
- Dacă utilizatorul nu are coș, poți returna `404` sau coș gol `{ id: '', items: [], subtotal: 0, shippingCost: 0, total: 0, currency: 'RON' }`
- Frontend tratează `404` ca un coș gol

---

##### `PATCH /cart/items/:itemId`

**Method:** `PATCH`  
**Path:** `/cart/items/:itemId`  
**Auth:** ✅ Cookie-based

**URL Parameters:**
- `itemId` - ID-ul item-ului din coș

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response Success (200):**
```json
{
  "id": "cart_123",
  "items": [
    {
      "id": "item_456",
      "productId": "prod_789",
      "quantity": 3,
      "price": 25.50,
      "total": 76.50,
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
  "subtotal": 76.50,
  "shippingCost": 15.00,
  "total": 91.50,
  "currency": "RON"
}
```

**Response Errors:**
- `400 Bad Request` - Cantitate invalidă (<= 0)
- `401 Unauthorized` - Nu este autentificat
- `404 Not Found` - Item-ul nu există
- `422 Unprocessable Entity` - Stoc insuficient

**Frontend Expects:**
- Returnează cart-ul complet actualizat
- Dacă `quantity = 0`, backend poate elimina item-ul automat sau returna eroare (specifică în documentație)

---

##### `DELETE /cart/items/:itemId`

**Method:** `DELETE`  
**Path:** `/cart/items/:itemId`  
**Auth:** ✅ Cookie-based

**URL Parameters:**
- `itemId` - ID-ul item-ului din coș

**Response Success (200/204):**
```json
{
  "id": "cart_123",
  "items": [],
  "subtotal": 0,
  "shippingCost": 0,
  "total": 0,
  "currency": "RON"
}
```

**Response Errors:**
- `401 Unauthorized` - Nu este autentificat
- `404 Not Found` - Item-ul nu există

**Frontend Expects:**
- Returnează cart-ul complet actualizat (fără item-ul șters)
- Sau returnează `204 No Content` (frontend va face `GET /cart` după)

---

#### Checkout

**Prioritate:** 🔴 **CRITIC**

##### `POST /orders`

**Method:** `POST`  
**Path:** `/orders`  
**Auth:** ✅ Cookie-based

**Request Body (Minim):**
```json
{
  "items": [
    {
      "productId": "prod_789",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "name": "Ion Popescu",
    "phone": "+40712345678",
    "email": "ion@example.com",
    "city": "București",
    "address": "Str. Exemplu, Nr. 1",
    "postalCode": "010001",
    "notes": "La parter"
  },
  "paymentMethod": "cod"
}
```

**Request Body (Complet - dacă backend suportă):**
```json
{
  "items": [
    {
      "productId": "prod_789",
      "quantity": 2,
      "variantId": "variant_123"
    }
  ],
  "shippingAddress": {
    "name": "Ion Popescu",
    "phone": "+40712345678",
    "email": "ion@example.com",
    "city": "București",
    "address": "Str. Exemplu, Nr. 1",
    "postalCode": "010001",
    "notes": "La parter"
  },
  "paymentMethod": "cod",
  "notes": "Livrare dimineața",
  "shippingAddressId": "addr_123"  // Optional: ID adresă salvată
}
```

**Response Success (201):**
```json
{
  "id": "order_456",
  "number": "ORD-2024-001",
  "status": "pending",
  "items": [
    {
      "id": "item_789",
      "productId": "prod_789",
      "productName": "Mere Bio",
      "productSlug": "mere-bio",
      "quantity": 2,
      "price": 25.50,
      "total": 51.00,
      "producerName": "Ferma Verde",
      "producerId": "prod_001",
      "unit": "kg",
      "imageUrl": "https://api.farme.ro/images/mere-bio.jpg"
    }
  ],
  "subtotal": 51.00,
  "shippingCost": 15.00,
  "total": 66.00,
  "shippingAddress": {
    "name": "Ion Popescu",
    "phone": "+40712345678",
    "email": "ion@example.com",
    "city": "București",
    "address": "Str. Exemplu, Nr. 1",
    "postalCode": "010001",
    "notes": "La parter"
  },
  "paymentMethod": "cod",
  "paymentStatus": "pending",
  "createdAt": "2024-01-15T12:00:00Z"
}
```

**Response Errors:**
- `400 Bad Request` - Date invalide (items gol, adresă invalidă)
- `401 Unauthorized` - Nu este autentificat
- `422 Unprocessable Entity` - Stoc insuficient pentru unul sau mai multe produse

**Frontend Expects:**
- Returnează comanda completă creată
- Dacă stoc insuficient, returnează `422` cu detalii despre produsele cu stoc insuficient:
```json
{
  "error": "Unprocessable Entity",
  "message": "Stoc insuficient pentru unele produse",
  "details": {
    "products": [
      {
        "productId": "prod_789",
        "availableStock": 1,
        "requestedQuantity": 2
      }
    ]
  }
}
```

---

#### Client Orders

**Prioritate:** 🔴 **CRITIC**

##### `GET /orders`

**Method:** `GET`  
**Path:** `/orders`  
**Auth:** ✅ Cookie-based

**Query Parameters (Opțional):**
- `status` - Filtrare după status (`pending`, `paid`, `processing`, `shipped`, `delivered`, `cancelled`)
- `page` - Paginare (default: 1)
- `limit` - Items per page (default: 20)

**Response Success (200):**
```json
[
  {
    "id": "order_456",
    "number": "ORD-2024-001",
    "status": "pending",
    "items": [
      {
        "id": "item_789",
        "productId": "prod_789",
        "productName": "Mere Bio",
        "productSlug": "mere-bio",
        "quantity": 2,
        "price": 25.50,
        "total": 51.00,
        "producerName": "Ferma Verde",
        "producerId": "prod_001",
        "unit": "kg",
        "imageUrl": "https://api.farme.ro/images/mere-bio.jpg"
      }
    ],
    "subtotal": 51.00,
    "shippingCost": 15.00,
    "total": 66.00,
    "paymentMethod": "cod",
    "paymentStatus": "pending",
    "createdAt": "2024-01-15T12:00:00Z",
    "updatedAt": "2024-01-15T12:00:00Z"
  }
]
```

**Sau Paginated:**
```json
{
  "data": [
    {
      "id": "order_456",
      "number": "ORD-2024-001",
      "status": "pending",
      "total": 66.00,
      "createdAt": "2024-01-15T12:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

**Response Errors:**
- `401 Unauthorized` - Nu este autentificat

**Frontend Expects:**
- Returnează array de comenzi sau obiect paginat
- Dacă utilizatorul nu are comenzi, returnează array gol `[]`
- Frontend suportă ambele formate (array direct sau paginated)

---

##### `GET /orders/:id`

**Method:** `GET`  
**Path:** `/orders/:id`  
**Auth:** ✅ Cookie-based

**URL Parameters:**
- `id` - ID-ul comenzii

**Response Success (200):**
```json
{
  "id": "order_456",
  "number": "ORD-2024-001",
  "status": "pending",
  "items": [
    {
      "id": "item_789",
      "productId": "prod_789",
      "productName": "Mere Bio",
      "productSlug": "mere-bio",
      "quantity": 2,
      "price": 25.50,
      "total": 51.00,
      "producerName": "Ferma Verde",
      "producerId": "prod_001",
      "unit": "kg",
      "imageUrl": "https://api.farme.ro/images/mere-bio.jpg"
    }
  ],
  "subtotal": 51.00,
  "shippingCost": 15.00,
  "total": 66.00,
  "shippingAddress": {
    "name": "Ion Popescu",
    "phone": "+40712345678",
    "email": "ion@example.com",
    "city": "București",
    "address": "Str. Exemplu, Nr. 1",
    "postalCode": "010001",
    "notes": "La parter"
  },
  "paymentMethod": "cod",
  "paymentStatus": "pending",
  "notes": "Livrare dimineața",
  "createdAt": "2024-01-15T12:00:00Z",
  "updatedAt": "2024-01-15T12:00:00Z"
}
```

**Response Errors:**
- `401 Unauthorized` - Nu este autentificat
- `403 Forbidden` - Comanda nu aparține utilizatorului
- `404 Not Found` - Comanda nu există

**Frontend Expects:**
- Returnează comanda completă cu toate detaliile
- Verifică că comanda aparține utilizatorului autentificat (sau returnează `403`)

---

### 4.2. Module: Producer (Auth, Products, Orders)

#### Auth (✅ EXISTĂ - Funcțional)

**Status:** ✅ Backend implementat și funcțional

**Endpoint-uri:**
- ✅ `POST /auth/login` - Login (suportă și producer)
- ✅ `GET /auth/me` - Obține user curent (returnează rol `PRODUCER`)

---

#### Producer Products

**Prioritate:** 🔴 **CRITIC**

##### `GET /producer/products`

**Method:** `GET`  
**Path:** `/producer/products`  
**Auth:** ✅ Cookie-based (rol: `producer`)

**Query Parameters (Opțional):**
- `status` - Filtrare după status (`active`, `inactive`, `all`)
- `page` - Paginare
- `limit` - Items per page

**Response Success (200):**
```json
[
  {
    "id": "prod_789",
    "name": "Mere Bio",
    "slug": "mere-bio",
    "description": "Mere bio de la ferma noastră",
    "price": 25.50,
    "stock": 100,
    "active": true,
    "producerId": "prod_001",
    "categoryId": "cat_123",
    "regionId": "reg_456",
    "imageUrl": "https://api.farme.ro/images/mere-bio.jpg",
    "unit": "kg",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
]
```

**Response Errors:**
- `401 Unauthorized` - Nu este autentificat
- `403 Forbidden` - Nu este producător

**Frontend Expects:**
- Returnează doar produsele producătorului autentificat
- Dacă nu are produse, returnează array gol `[]`

---

##### `POST /producer/products`

**Method:** `POST`  
**Path:** `/producer/products`  
**Auth:** ✅ Cookie-based (rol: `producer`)

**Request Body (Minim):**
```json
{
  "name": "Mere Bio",
  "slug": "mere-bio",
  "description": "Mere bio de la ferma noastră",
  "price": 25.50,
  "stock": 100,
  "categoryId": "cat_123",
  "regionId": "reg_456",
  "unit": "kg"
}
```

**Request Body (Complet):**
```json
{
  "name": "Mere Bio",
  "slug": "mere-bio",
  "description": "Mere bio de la ferma noastră",
  "price": 25.50,
  "stock": 100,
  "active": true,
  "categoryId": "cat_123",
  "regionId": "reg_456",
  "unit": "kg",
  "imageUrl": "https://api.farme.ro/images/mere-bio.jpg",
  "images": ["https://api.farme.ro/images/mere-bio-1.jpg"],
  "tags": ["bio", "local"],
  "minOrderQuantity": 1,
  "maxOrderQuantity": 50
}
```

**Response Success (201):**
```json
{
  "id": "prod_789",
  "name": "Mere Bio",
  "slug": "mere-bio",
  "description": "Mere bio de la ferma noastră",
  "price": 25.50,
  "stock": 100,
  "active": true,
  "producerId": "prod_001",
  "categoryId": "cat_123",
  "regionId": "reg_456",
  "unit": "kg",
  "imageUrl": "https://api.farme.ro/images/mere-bio.jpg",
  "createdAt": "2024-01-15T12:00:00Z",
  "updatedAt": "2024-01-15T12:00:00Z"
}
```

**Response Errors:**
- `400 Bad Request` - Date invalide (name lipsă, price <= 0, etc.)
- `401 Unauthorized` - Nu este autentificat
- `403 Forbidden` - Nu este producător
- `422 Unprocessable Entity` - Validare eșuată (slug duplicat, etc.)

**Frontend Expects:**
- Returnează produsul creat complet
- Slug-ul trebuie să fie unic (backend generează automat dacă nu e specificat)

---

##### `PATCH /producer/products/:id`

**Method:** `PATCH`  
**Path:** `/producer/products/:id`  
**Auth:** ✅ Cookie-based (rol: `producer`)

**URL Parameters:**
- `id` - ID-ul produsului

**Request Body (Partial Update):**
```json
{
  "name": "Mere Bio Premium",
  "price": 30.00,
  "stock": 150
}
```

**Response Success (200):**
```json
{
  "id": "prod_789",
  "name": "Mere Bio Premium",
  "slug": "mere-bio",
  "description": "Mere bio de la ferma noastră",
  "price": 30.00,
  "stock": 150,
  "active": true,
  "producerId": "prod_001",
  "categoryId": "cat_123",
  "regionId": "reg_456",
  "unit": "kg",
  "updatedAt": "2024-01-15T13:00:00Z"
}
```

**Response Errors:**
- `400 Bad Request` - Date invalide
- `401 Unauthorized` - Nu este autentificat
- `403 Forbidden` - Nu este producător sau produsul nu îi aparține
- `404 Not Found` - Produsul nu există
- `422 Unprocessable Entity` - Validare eșuată

**Frontend Expects:**
- Returnează produsul actualizat complet
- Verifică că produsul aparține producătorului autentificat

---

##### `DELETE /producer/products/:id`

**Method:** `DELETE`  
**Path:** `/producer/products/:id`  
**Auth:** ✅ Cookie-based (rol: `producer`)

**URL Parameters:**
- `id` - ID-ul produsului

**Response Success (200/204):**
```json
{
  "message": "Produs șters cu succes"
}
```

**Sau:**
```
204 No Content
```

**Response Errors:**
- `401 Unauthorized` - Nu este autentificat
- `403 Forbidden` - Nu este producător sau produsul nu îi aparține
- `404 Not Found` - Produsul nu există
- `409 Conflict` - Produsul are comenzi active (nu poate fi șters)

**Frontend Expects:**
- Șterge produsul sau returnează eroare dacă are comenzi active
- Frontend va face `GET /producer/products` după ștergere pentru refresh

---

##### `PATCH /producer/products/:id/toggle`

**Method:** `PATCH`  
**Path:** `/producer/products/:id/toggle`  
**Auth:** ✅ Cookie-based (rol: `producer`)

**URL Parameters:**
- `id` - ID-ul produsului

**Request Body (Opțional):**
```json
{
  "active": true
}
```

**Sau fără body (toggle automat):**

**Response Success (200):**
```json
{
  "id": "prod_789",
  "name": "Mere Bio",
  "active": false,
  "updatedAt": "2024-01-15T14:00:00Z"
}
```

**Response Errors:**
- `401 Unauthorized` - Nu este autentificat
- `403 Forbidden` - Nu este producător sau produsul nu îi aparține
- `404 Not Found` - Produsul nu există

**Frontend Expects:**
- Toggle `active` status (active/inactive)
- Returnează produsul actualizat

---

#### Producer Orders

**Prioritate:** 🔴 **CRITIC**

##### `GET /producer/orders`

**Method:** `GET`  
**Path:** `/producer/orders`  
**Auth:** ✅ Cookie-based (rol: `producer`)

**Query Parameters (Opțional):**
- `status` - Filtrare după status (`pending`, `confirmed`, `prepared`, `shipped`, `delivered`, `cancelled`)
- `page` - Paginare
- `limit` - Items per page

**Response Success (200):**
```json
[
  {
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
        "total": 51.00,
        "unit": "kg"
      }
    ],
    "total": 66.00,
    "clientName": "Ion Popescu",
    "clientEmail": "ion@example.com",
    "shippingAddress": {
      "name": "Ion Popescu",
      "phone": "+40712345678",
      "city": "București",
      "address": "Str. Exemplu, Nr. 1"
    },
    "createdAt": "2024-01-15T12:00:00Z",
    "updatedAt": "2024-01-15T12:00:00Z"
  }
]
```

**Response Errors:**
- `401 Unauthorized` - Nu este autentificat
- `403 Forbidden` - Nu este producător

**Frontend Expects:**
- Returnează doar comenzile producătorului autentificat
- Dacă nu are comenzi, returnează array gol `[]`

---

##### `GET /producer/orders/:id`

**Method:** `GET`  
**Path:** `/producer/orders/:id`  
**Auth:** ✅ Cookie-based (rol: `producer`)

**URL Parameters:**
- `id` - ID-ul comenzii

**Response Success (200):**
```json
{
  "id": "order_456",
  "number": "ORD-2024-001",
  "status": "pending",
  "items": [
    {
      "id": "item_789",
      "productId": "prod_789",
      "productName": "Mere Bio",
      "productSlug": "mere-bio",
      "quantity": 2,
      "price": 25.50,
      "total": 51.00,
      "producerName": "Ferma Verde",
      "producerId": "prod_001",
      "unit": "kg",
      "imageUrl": "https://api.farme.ro/images/mere-bio.jpg"
    }
  ],
  "subtotal": 51.00,
  "shippingCost": 15.00,
  "total": 66.00,
  "clientName": "Ion Popescu",
  "clientEmail": "ion@example.com",
  "clientPhone": "+40712345678",
  "shippingAddress": {
    "name": "Ion Popescu",
    "phone": "+40712345678",
    "email": "ion@example.com",
    "city": "București",
    "address": "Str. Exemplu, Nr. 1",
    "postalCode": "010001",
    "notes": "La parter"
  },
  "paymentMethod": "cod",
  "paymentStatus": "pending",
  "notes": "Livrare dimineața",
  "createdAt": "2024-01-15T12:00:00Z",
  "updatedAt": "2024-01-15T12:00:00Z"
}
```

**Response Errors:**
- `401 Unauthorized` - Nu este autentificat
- `403 Forbidden` - Nu este producător sau comanda nu îi aparține
- `404 Not Found` - Comanda nu există

**Frontend Expects:**
- Returnează comanda completă cu toate detaliile
- Verifică că comanda aparține producătorului autentificat

---

##### `PATCH /producer/orders/:id/status`

**Method:** `PATCH`  
**Path:** `/producer/orders/:id/status`  
**Auth:** ✅ Cookie-based (rol: `producer`)

**URL Parameters:**
- `id` - ID-ul comenzii

**Request Body:**
```json
{
  "status": "confirmed"
}
```

**Statusuri Valide:**
- `pending` → `confirmed` → `prepared` → `shipped` → `delivered`
- `pending` → `cancelled` (doar dacă nu e deja confirmată)

**Response Success (200):**
```json
{
  "id": "order_456",
  "number": "ORD-2024-001",
  "status": "confirmed",
  "updatedAt": "2024-01-15T14:00:00Z"
}
```

**Response Errors:**
- `400 Bad Request` - Status invalid sau tranziție invalidă
- `401 Unauthorized` - Nu este autentificat
- `403 Forbidden` - Nu este producător sau comanda nu îi aparține
- `404 Not Found` - Comanda nu există
- `422 Unprocessable Entity` - Tranziție de status invalidă (ex: `delivered` → `pending`)

**Frontend Expects:**
- Returnează comanda actualizată
- Verifică că tranziția de status este validă

---

### 4.3. Module: Business (Minimal pentru MVP)

**Prioritate:** 🟡 **MEDIUM** (nu este critic pentru MVP)

#### `GET /business/dashboard`

**Method:** `GET`  
**Path:** `/business/dashboard`  
**Auth:** ✅ Cookie-based (rol: `business`)

**Response Success (200):**
```json
{
  "stats": {
    "totalOrders": 10,
    "totalSpent": 5000.00,
    "activeContracts": 2
  },
  "recentOrders": [
    {
      "id": "order_456",
      "number": "ORD-2024-001",
      "status": "pending",
      "total": 66.00,
      "createdAt": "2024-01-15T12:00:00Z"
    }
  ]
}
```

**Response Errors:**
- `401 Unauthorized` - Nu este autentificat
- `403 Forbidden` - Nu este business

---

#### `GET /business/contracts`

**Method:** `GET`  
**Path:** `/business/contracts`  
**Auth:** ✅ Cookie-based (rol: `business`)

**Response Success (200):**
```json
[
  {
    "id": "contract_123",
    "type": "SUBSCRIPTION",
    "status": "active",
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-12-31T23:59:59Z",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

**Response Errors:**
- `401 Unauthorized` - Nu este autentificat
- `403 Forbidden` - Nu este business

---

### 4.4. Module: Logistics (Minimal pentru MVP)

**Prioritate:** 🟡 **MEDIUM** (nu este critic pentru MVP)

#### `GET /logistics/dashboard`

**Method:** `GET`  
**Path:** `/logistics/dashboard`  
**Auth:** ✅ Cookie-based (rol: `logistics`)

**Response Success (200):**
```json
{
  "stats": {
    "totalDeliveries": 50,
    "totalRevenue": 10000.00,
    "activeDeliveries": 5
  },
  "recentDeliveries": [
    {
      "id": "delivery_123",
      "orderId": "order_456",
      "status": "in_transit",
      "destination": "București",
      "value": 66.00,
      "createdAt": "2024-01-15T12:00:00Z"
    }
  ]
}
```

**Response Errors:**
- `401 Unauthorized` - Nu este autentificat
- `403 Forbidden` - Nu este logistics

---

#### `GET /logistics/contracts`

**Method:** `GET`  
**Path:** `/logistics/contracts`  
**Auth:** ✅ Cookie-based (rol: `logistics`)

**Response Success (200):**
```json
[
  {
    "id": "contract_123",
    "type": "DELIVERY",
    "status": "active",
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-12-31T23:59:59Z",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

**Response Errors:**
- `401 Unauthorized` - Nu este autentificat
- `403 Forbidden` - Nu este logistics

---

#### `GET /logistics/commissions`

**Method:** `GET`  
**Path:** `/logistics/commissions`  
**Auth:** ✅ Cookie-based (rol: `logistics`)

**Response Success (200):**
```json
{
  "summary": {
    "totalCommissions": 5000.00,
    "pendingCommissions": 1000.00,
    "paidCommissions": 4000.00
  },
  "statements": [
    {
      "id": "stmt_123",
      "period": "2024-01",
      "total": 1000.00,
      "status": "pending",
      "createdAt": "2024-02-01T00:00:00Z"
    }
  ]
}
```

**Response Errors:**
- `401 Unauthorized` - Nu este autentificat
- `403 Forbidden` - Nu este logistics

---

### 4.5. Module: Investor (Minimal pentru MVP)

**Prioritate:** 🟡 **MEDIUM** (nu este critic pentru MVP)

#### `GET /investor/analytics`

**Method:** `GET`  
**Path:** `/investor/analytics`  
**Auth:** ✅ Cookie-based (rol: `investor`)

**Response Success (200):**
```json
{
  "totalUsers": 1000,
  "totalOrders": 5000,
  "totalRevenue": 100000.00,
  "topProducts": [
    {
      "productId": "prod_789",
      "name": "Mere Bio",
      "salesCount": 100
    }
  ]
}
```

**Response Errors:**
- `401 Unauthorized` - Nu este autentificat
- `403 Forbidden` - Nu este investor

**Notă:** Datele trebuie să fie anonimizate (fără date personale).

---

#### `GET /investor/metrics`

**Method:** `GET`  
**Path:** `/investor/metrics`  
**Auth:** ✅ Cookie-based (rol: `investor`)

**Response Success (200):**
```json
{
  "aggregatedMetrics": {
    "userGrowth": {
      "current": 1000,
      "previous": 800,
      "growth": 25
    },
    "orderGrowth": {
      "current": 5000,
      "previous": 4000,
      "growth": 25
    },
    "revenueGrowth": {
      "current": 100000.00,
      "previous": 80000.00,
      "growth": 25
    }
  },
  "period": "2024-01",
  "updatedAt": "2024-02-01T00:00:00Z"
}
```

**Response Errors:**
- `401 Unauthorized` - Nu este autentificat
- `403 Forbidden` - Nu este investor

**Notă:** Metrics agregate și anonimizate (fără date personale).

---

## 5. Particularități Auth

### 5.1. Cookie httpOnly

**Obligatoriu:**
- Cookie-ul trebuie să fie `httpOnly: true` (nu poate fi accesat din JavaScript)
- Cookie-ul trebuie să fie `secure: true` în production (HTTPS only)
- Cookie-ul trebuie să aibă `sameSite: 'Lax'` sau `'Strict'`

**Exemplu (Express.js):**
```javascript
res.cookie('session', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 zile
  path: '/'
})
```

---

### 5.2. Verificare Cookie

**La fiecare request protejat:**
1. Backend verifică cookie-ul `session`
2. Dacă cookie invalid/lipsă → `401 Unauthorized`
3. Dacă cookie expirat → `401 Unauthorized`
4. Dacă cookie valid → procesează request-ul

**Exemplu Middleware (Express.js):**
```javascript
function requireAuth(req, res, next) {
  const sessionToken = req.cookies?.session
  
  if (!sessionToken) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Nu ești autentificat. Te rugăm să te conectezi.',
      status: 401
    })
  }
  
  // Verifică token-ul
  try {
    const user = verifyToken(sessionToken)
    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Sesiunea a expirat. Te rugăm să te conectezi din nou.',
      status: 401
    })
  }
}
```

---

### 5.3. Verificare Rol

**Pentru endpoint-uri specifice rolurilor:**
- `/producer/*` → Verifică că `user.role === 'PRODUCER'`
- `/business/*` → Verifică că `user.role === 'BUSINESS'`
- `/logistics/*` → Verifică că `user.role === 'LOGISTICS'`
- `/investor/*` → Verifică că `user.role === 'INVESTOR'`

**Exemplu Middleware (Express.js):**
```javascript
function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Nu ești autentificat.',
        status: 401
      })
    }
    
    const userRole = req.user.role
    const allowedRoles = Array.isArray(roles) ? roles : [roles]
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Nu ai permisiuni pentru această acțiune.',
        status: 403
      })
    }
    
    next()
  }
}

// Usage
app.get('/producer/products', requireAuth, requireRole('PRODUCER'), getProducts)
```

---

### 5.4. Expirare Sesiune

**Recomandare:**
- Sesiunea expiră după 7 zile de inactivitate
- Sau după 30 zile de la login (ajustabil)

**Frontend Action:**
- La `401 Unauthorized`, frontend redirect automat la `/login`
- Frontend nu gestionează expirarea sesiunii (backend o face)

---

## 6. Error Handling Standard

### 6.1. Format Eroare Standard

**Toate erorile trebuie să returneze:**
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

---

### 6.2. Coduri de Eroare

| Status | Când | Frontend Action |
|--------|------|-----------------|
| `400 Bad Request` | Date invalide | Afișează mesaj de eroare |
| `401 Unauthorized` | Nu este autentificat | Redirect la `/login?returnUrl=<ruta>` |
| `403 Forbidden` | Nu are permisiuni | Afișează mesaj "Nu ai permisiuni" |
| `404 Not Found` | Resursă nu există | Afișează mesaj "Nu a fost găsit" |
| `422 Unprocessable Entity` | Validare eșuată | Afișează mesaj cu detalii (ex: stoc insuficient) |
| `429 Too Many Requests` | Rate limiting | Afișează mesaj cu `Retry-After` |
| `500 Internal Server Error` | Eroare server | Afișează mesaj generic |

---

### 6.3. Exemple Erori

**401 Unauthorized:**
```json
{
  "error": "Unauthorized",
  "message": "Nu ești autentificat. Te rugăm să te conectezi.",
  "status": 401
}
```

**404 Not Found:**
```json
{
  "error": "Not Found",
  "message": "Produsul nu a fost găsit.",
  "status": 404
}
```

**422 Unprocessable Entity (Stoc Insuficient):**
```json
{
  "error": "Unprocessable Entity",
  "message": "Stoc insuficient pentru unele produse",
  "status": 422,
  "details": {
    "products": [
      {
        "productId": "prod_789",
        "availableStock": 1,
        "requestedQuantity": 2
      }
    ]
  }
}
```

---

## 7. Checklist Final pentru Backend

### 7.1. Configurare

- [ ] CORS configurat corect (origins, credentials, methods, headers)
- [ ] Cookie httpOnly setat corect
- [ ] Cookie secure în production
- [ ] Cookie sameSite configurat
- [ ] Environment variables setate

---

### 7.2. Endpoint-uri MVP

**Core Commerce (🔴 CRITIC):**
- [ ] `POST /cart/items` - Adaugă produs în coș
- [ ] `GET /cart` - Obține coșul
- [ ] `PATCH /cart/items/:itemId` - Actualizează cantitate
- [ ] `DELETE /cart/items/:itemId` - Șterge item
- [ ] `POST /orders` - Creează comandă
- [ ] `GET /orders` - Listă comenzi client
- [ ] `GET /orders/:id` - Detalii comandă client
- [ ] `GET /producer/products` - Listă produse producător
- [ ] `POST /producer/products` - Creează produs
- [ ] `PATCH /producer/products/:id` - Actualizează produs
- [ ] `DELETE /producer/products/:id` - Șterge produs
- [ ] `PATCH /producer/products/:id/toggle` - Toggle active/inactive
- [ ] `GET /producer/orders` - Listă comenzi producător
- [ ] `GET /producer/orders/:id` - Detalii comandă producător
- [ ] `PATCH /producer/orders/:id/status` - Actualizează status comandă

**Profile & Addresses (🟡 IMPORTANT):**
- [ ] `GET /clients/me` - Obține profil client
- [ ] `PATCH /clients/me` - Actualizează profil client
- [ ] `GET /clients/addresses` - Listă adrese
- [ ] `POST /clients/addresses` - Creează adresă
- [ ] `PATCH /clients/addresses/:id` - Actualizează adresă
- [ ] `DELETE /clients/addresses/:id` - Șterge adresă
- [ ] `PATCH /clients/addresses/:id/default` - Setează adresă principală

---

### 7.3. Testare

- [ ] Testează toate endpoint-urile cu Postman/curl
- [ ] Verifică CORS cu request-uri de la `https://farme.ro`
- [ ] Verifică cookie auth (login → request protejat)
- [ ] Verifică error handling (401, 404, 422)
- [ ] Verifică validare date (400 Bad Request)

---

## 8. Documentație Suplimentară

**Contracte API Complete:**
- `docs/BACKEND_API_CONTRACT_CORE_COMMERCE.md` - Cart, Checkout, Orders, Producer Products/Orders
- `docs/BACKEND_API_CONTRACT_ACCOUNTS.md` - Client Profile, Addresses, Multi-Account
- `docs/BACKEND_API_CONTRACT_FAVORITES_SUBSCRIPTIONS_ALERTS.md` - Favorites, Subscriptions, Alerts
- `docs/BACKEND_API_CONTRACT_BUSINESS.md` - Business Portal
- `docs/BACKEND_API_CONTRACT_LOGISTICS.md` - Logistics Portal
- `docs/BACKEND_API_CONTRACT_INVESTOR.md` - Investor Portal

**QA Checklist:**
- `docs/CORE_COMMERCE_QA_CHECKLIST.md` - Checklist pentru testare manuală

---

**Document generat:** 2025-01-27  
**Status:** 🟡 **Așteaptă implementare backend**  
**Contact:** Vezi `docs/FARMERO_LAUNCH_TODO_FRONTEND.md` pentru status task-uri

