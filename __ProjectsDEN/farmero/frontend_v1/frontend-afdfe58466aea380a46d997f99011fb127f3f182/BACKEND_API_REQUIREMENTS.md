# Backend API Requirements pentru farme.ro

## 📋 Overview

Acest document descrie toate endpoint-urile API pe care frontend-ul le așteaptă de la backend (`api.farme.ro`).

**IMPORTANT:** Toate endpoint-urile publice trebuie să fie accesibile **FĂRĂ autentificare** (fără token, fără cookie).

---

## 🌐 Endpoint-uri Publice (Fără Autentificare)

### 1. GET `/regions`

**Descriere:** Obține lista de regiuni (județe) disponibile.

**Request:**
```
GET https://api.farme.ro/regions
Headers: (fără Authorization)
```

**Response Success (200 OK):**
```json
{
  "regions": [
    {
      "id": "string",
      "name": "string",
      "code": "string | null",
      "type": "COUNTY" | "REGION"
    }
  ]
}
```

**Response Error:**
- `401 Unauthorized` - NU ar trebui să apară (endpoint public)
- `404 Not Found` - Endpoint-ul nu există
- `500 Internal Server Error` - Eroare server

**Folosit în:**
- Homepage (HeroSection, RegionsSection)
- Products page (filtrare)
- Producers page (filtrare)
- Producer portal (selectare regiune pentru produse)

---

### 2. GET `/public/producers`

**Descriere:** Obține lista de producători publici (cu paginare).

**Request:**
```
GET https://api.farme.ro/public/producers?page=1&limit=10&search=query&regionId=region-id
Headers: (fără Authorization)
Query Parameters:
  - page: number (default: 1)
  - limit: number (default: 10)
  - search: string (optional) - căutare după nume
  - regionId: string (optional) - filtrare după regiune
```

**Response Success (200 OK):**
```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "slug": "string",
      "description": "string | null",
      "imageUrl": "string | null",
      "region": {
        "id": "string",
        "name": "string"
      } | null,
      "isVerified": boolean,
      "productCount": number
    }
  ],
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "totalPages": number
  }
}
```

**Response Error:**
- `404 Not Found` - Endpoint-ul nu există (trebuie implementat)
- `500 Internal Server Error` - Eroare server

**Folosit în:**
- Homepage (ProducersSection)
- Producers page (listă completă)

---

### 3. GET `/public/producers/:slug`

**Descriere:** Obține detalii despre un producător specific (public).

**Request:**
```
GET https://api.farme.ro/public/producers/producator-slug
Headers: (fără Authorization)
```

**Response Success (200 OK):**
```json
{
  "id": "string",
  "name": "string",
  "slug": "string",
  "description": "string | null",
  "imageUrl": "string | null",
  "region": {
    "id": "string",
    "name": "string"
  } | null,
  "isVerified": boolean,
  "products": [
    {
      "id": "string",
      "name": "string",
      "slug": "string",
      "price": number,
      "unit": "string",
      "imageUrl": "string | null"
    }
  ]
}
```

**Response Error:**
- `404 Not Found` - Producătorul nu există
- `500 Internal Server Error` - Eroare server

**Folosit în:**
- Producer detail page (`/producers/:slug`)

---

### 4. GET `/public/products`

**Descriere:** Obține lista de produse publice (cu paginare).

**Request:**
```
GET https://api.farme.ro/public/products?page=1&limit=12&search=query&category=category&categoryId=id&regionId=region-id
Headers: (fără Authorization)
Query Parameters:
  - page: number (default: 1)
  - limit: number (default: 12)
  - search: string (optional) - căutare după nume
  - category: string (optional) - filtrare după categorie (slug)
  - categoryId: string (optional) - filtrare după categorie (ID)
  - regionId: string (optional) - filtrare după regiune
```

**Response Success (200 OK):**
```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "slug": "string",
      "description": "string | null",
      "price": number,
      "unit": "string",
      "imageUrl": "string | null",
      "producer": {
        "id": "string",
        "name": "string",
        "slug": "string"
      },
      "category": {
        "id": "string",
        "name": "string",
        "slug": "string"
      } | null,
      "isTraditional": boolean,
      "isBio": boolean,
      "stock": number
    }
  ],
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "totalPages": number
  }
}
```

**Response Error:**
- `404 Not Found` - Endpoint-ul nu există (trebuie implementat)
- `500 Internal Server Error` - Eroare server

**Folosit în:**
- Homepage (ProductsSection)
- Products page (listă completă)

---

### 5. GET `/public/products/:slug`

**Descriere:** Obține detalii despre un produs specific (public).

**Request:**
```
GET https://api.farme.ro/public/products/produs-slug
Headers: (fără Authorization)
```

**Response Success (200 OK):**
```json
{
  "id": "string",
  "name": "string",
  "slug": "string",
  "description": "string | null",
  "price": number,
  "unit": "string",
  "imageUrl": "string | null",
  "producer": {
    "id": "string",
    "name": "string",
    "slug": "string",
    "region": {
      "id": "string",
      "name": "string"
    } | null
  },
  "category": {
    "id": "string",
    "name": "string",
    "slug": "string"
  } | null,
  "isTraditional": boolean,
  "isBio": boolean,
  "stock": number,
  "images": string[]
}
```

**Response Error:**
- `404 Not Found` - Produsul nu există
- `500 Internal Server Error` - Eroare server

**Folosit în:**
- Product detail page (`/products/:slug`)

---

### 6. GET `/health/db`

**Descriere:** Health check pentru backend și baza de date.

**Request:**
```
GET https://api.farme.ro/health/db
Headers: (fără Authorization)
```

**Response Success (200 OK):**
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Response Error:**
```json
{
  "status": "error",
  "database": "disconnected",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "error": "Error message"
}
```

**Folosit în:**
- Status page (`/status`)

---

## 🔐 Endpoint-uri Protejate (Cu Autentificare)

### 7. GET `/auth/me`

**Descriere:** Obține informații despre utilizatorul autentificat.

**Request:**
```
GET https://api.farme.ro/auth/me
Headers:
  Authorization: Bearer <token>
  Cookie: auth_token=<token> (dacă folosești cookie-based auth)
```

**Response Success (200 OK):**
```json
{
  "id": "string",
  "email": "string",
  "fullName": "string",
  "role": "CUSTOMER" | "PRODUCER" | "ADMIN",
  "isVerified": boolean
}
```

**Response Error:**
- `401 Unauthorized` - Utilizatorul nu este autentificat
- `429 Too Many Requests` - Prea multe request-uri (rate limiting)
- `500 Internal Server Error` - Eroare server

**Folosit în:**
- AuthProvider (verificare autentificare)
- Navbar (afișare user info)

---

## 📊 Status Implementare

### ✅ Trebuie să existe (critice pentru homepage):
- [ ] `GET /regions` - **CRITIC** (homepage nu funcționează fără el)
- [ ] `GET /public/producers` - **CRITIC** (homepage nu funcționează fără el)
- [ ] `GET /public/products` - **CRITIC** (homepage nu funcționează fără el)

### ⚠️ Opționale (pentru funcționalități avansate):
- [ ] `GET /public/producers/:slug` - Pentru pagina de detalii producător
- [ ] `GET /public/products/:slug` - Pentru pagina de detalii produs
- [ ] `GET /health/db` - Pentru status page

### ✅ Deja implementate (presupunem):
- [ ] `GET /auth/me` - Pentru autentificare

---

## 🔧 Recomandări pentru Backend

### 1. CORS Configuration

Backend-ul trebuie să permită request-uri de la:
- `https://farme.ro`
- `https://www.farme.ro`
- `http://localhost:3000` (pentru development)

**Exemplu (Express):**
```javascript
const cors = require('cors')

app.use(cors({
  origin: [
    'https://farme.ro',
    'https://www.farme.ro',
    'http://localhost:3000'
  ],
  credentials: true
}))
```

### 2. Rate Limiting

Implementează rate limiting pentru:
- `/auth/me` - max 10 requests/minute per IP
- `/public/*` - max 100 requests/minute per IP

### 3. Error Handling

Toate endpoint-urile trebuie să returneze:
- Status code corect (200, 401, 404, 429, 500)
- JSON cu mesaj de eroare clar:
  ```json
  {
    "error": {
      "message": "Error message",
      "status": 404
    }
  }
  ```

### 4. WebSocket (Opțional)

Dacă vrei să implementezi WebSocket pentru notificări real-time:
- Endpoint: `wss://api.farme.ro/socket.io/`
- Frontend-ul va încerca să se conecteze automat
- Dacă nu există, aplicația funcționează normal (fără real-time)

---

## 🚀 Următorii Pași

1. **Verifică ce endpoint-uri există deja pe backend:**
   ```bash
   curl https://api.farme.ro/regions
   curl https://api.farme.ro/public/producers
   curl https://api.farme.ro/public/products
   ```

2. **Implementează endpoint-urile lipsă:**
   - Prioritate 1: `/regions`, `/public/producers`, `/public/products`
   - Prioritate 2: `/public/producers/:slug`, `/public/products/:slug`
   - Prioritate 3: `/health/db`

3. **Testează integrarea:**
   - Accesează `https://farme.ro/status` pentru verificare
   - Accesează `https://farme.ro/` pentru homepage
   - Verifică console-ul pentru erori

---

## 📝 Note

- Toate endpoint-urile publice trebuie să fie **REALLY public** - fără autentificare
- Frontend-ul gestionează elegant lipsa endpoint-urilor (returnează date goale)
- Homepage-ul se va încărca chiar dacă endpoint-urile lipsesc, dar va fi gol
- Pentru o experiență completă, toate endpoint-urile critice trebuie implementate

