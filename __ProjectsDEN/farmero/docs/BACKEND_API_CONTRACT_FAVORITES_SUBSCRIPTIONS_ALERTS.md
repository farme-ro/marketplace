# Backend API Contract - Favorites, Subscriptions & Alerts

**Data:** 2024  
**Scop:** Documentație pentru contractele API între frontend (Next.js) și backend (api.farme.ro) pentru Favorites, Subscription Baskets și Silent Alerts  
**Status:** Frontend-ready, așteaptă implementare backend

---

## 📋 Preambul

Acest document descrie contractele API pentru:
- **Favorites** - Marcarea produselor și producătorilor ca favoriți
- **Subscription Baskets** - Abonamente pentru cumpărături recurente
- **Silent Alerts** - Notificări discrete pentru reduceri de preț și revenire în stoc

**IMPORTANT:** 
- Frontend-ul este pregătit și folosește aceste contracte
- Backend-ul trebuie să implementeze aceste endpoint-uri conform specificațiilor
- Toate request-urile folosesc `credentials: 'include'` pentru cookie-based authentication
- Base URL: `https://api.farme.ro`

---

## 🔐 Autentificare

Toate endpoint-urile necesită autentificare via cookies:
- Request-urile includ `credentials: 'include'`
- Backend-ul verifică cookie-ul de sesiune
- Răspunsuri de eroare:
  - `401 Unauthorized` - Nu este autentificat
  - `403 Forbidden` - Autentificat dar fără permisiuni

---

## ❤️ Favorites

### GET /clients/favorites

**Descriere:** Obține lista de favorite ale utilizatorului autentificat

**Method:** `GET`

**Headers:**
```
Cookie: session=...
```

**Response Success (200):**
```typescript
// Poate fi array sau paginated response
Array<FavoriteItem> | {
  data: Array<FavoriteItem>
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

**Format FavoriteItem:**
```typescript
{
  id: string
  targetType: 'product' | 'producer'
  targetId: string
  createdAt: string
  updatedAt?: string
  metadata?: {
    lastPurchasedAt?: string
    purchaseCount?: number
  }
}
```

**Exemplu JSON:**
```json
[
  {
    "id": "fav_123",
    "targetType": "product",
    "targetId": "prod_456",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-20T15:30:00Z",
    "metadata": {
      "lastPurchasedAt": "2024-01-18T12:00:00Z",
      "purchaseCount": 3
    }
  },
  {
    "id": "fav_124",
    "targetType": "producer",
    "targetId": "prod_789",
    "createdAt": "2024-01-16T10:00:00Z"
  }
]
```

**Response Errors:**
- `401 Unauthorized` - Nu este autentificat

**Notă:** Dacă utilizatorul nu are favorite, returnează array gol `[]`.

---

### POST /clients/favorites

**Descriere:** Adaugă un produs sau producător la favorite

**Method:** `POST`

**Request Body:**
```typescript
{
  targetType: 'product' | 'producer'
  targetId: string
}
```

**Exemplu JSON:**
```json
{
  "targetType": "product",
  "targetId": "prod_456"
}
```

**Response Success (201):**
```typescript
{
  id: string
  targetType: 'product' | 'producer'
  targetId: string
  createdAt: string
  updatedAt?: string
}
```

**Exemplu JSON:**
```json
{
  "id": "fav_125",
  "targetType": "product",
  "targetId": "prod_456",
  "createdAt": "2024-01-20T10:00:00Z"
}
```

**Response Errors:**
- `400 Bad Request` - Date invalide (targetType sau targetId lipsă/invalid)
- `401 Unauthorized` - Nu este autentificat
- `404 Not Found` - Produsul/producătorul nu există
- `409 Conflict` - Produsul/producătorul este deja în favorite (opțional - frontend gestionează idempotența)

**Business Rules:**
- Un utilizator poate avea același produs/producător în favorite doar o dată
- Dacă se încearcă adăugarea unui item deja favorit, backend-ul poate returna `409 Conflict` sau poate returna item-ul existent (idempotență)

---

### DELETE /clients/favorites?targetType=...&targetId=...

**Descriere:** Elimină un produs sau producător din favorite

**Method:** `DELETE`

**Query Parameters:**
- `targetType` - Tipul item-ului (`'product'` sau `'producer'`)
- `targetId` - ID-ul produsului sau producătorului

**Exemplu:**
```
DELETE /clients/favorites?targetType=product&targetId=prod_456
```

**Response Success (200/204):**
- `200 OK` cu body gol sau
- `204 No Content`

**Response Errors:**
- `400 Bad Request` - Parametri invalizi (targetType sau targetId lipsă)
- `401 Unauthorized` - Nu este autentificat
- `404 Not Found` - Favorite-ul nu există (opțional - frontend tratează ca success pentru idempotență)

**Business Rules:**
- Dacă favorite-ul nu există, backend-ul poate returna `404` sau poate trata ca success (idempotență)
- Frontend-ul tratează `404` ca success pentru a permite idempotență

---

## 📦 Subscription Baskets

### GET /clients/subscriptions

**Descriere:** Obține lista de abonamente ale utilizatorului autentificat

**Method:** `GET`

**Response Success (200):**
```typescript
// Poate fi array sau paginated response
Array<SubscriptionBasket> | {
  data: Array<SubscriptionBasket>
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

**Format SubscriptionBasket:**
```typescript
{
  id: string
  name: string
  items: Array<{
    productId: string
    quantity: number
    metadata?: {
      notes?: string
    }
  }>
  frequency: 'weekly' | 'biweekly' | 'monthly'
  isActive: boolean
  nextDeliveryDate?: string  // ISO 8601 date
  createdAt: string
  updatedAt?: string
  metadata?: {
    deliveryAddress?: string
    notes?: string
  }
}
```

**Exemplu JSON:**
```json
[
  {
    "id": "sub_123",
    "name": "Cofetă săptămânală",
    "items": [
      {
        "productId": "prod_456",
        "quantity": 2,
        "metadata": {
          "notes": "Preferabil bio"
        }
      },
      {
        "productId": "prod_789",
        "quantity": 1
      }
    ],
    "frequency": "weekly",
    "isActive": true,
    "nextDeliveryDate": "2024-01-27",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-20T15:30:00Z",
    "metadata": {
      "deliveryAddress": "Str. Exemplu, Nr. 123, București",
      "notes": "Livrare vineri dimineața"
    }
  }
]
```

**Response Errors:**
- `401 Unauthorized` - Nu este autentificat

---

### GET /clients/subscriptions/:id

**Descriere:** Obține detaliile unui abonament specific

**Method:** `GET`

**URL Parameters:**
- `id` - ID-ul abonamentului

**Response Success (200):**
```typescript
// SubscriptionBasket (vezi formatul de mai sus)
```

**Response Errors:**
- `401 Unauthorized` - Nu este autentificat
- `403 Forbidden` - Abonamentul nu aparține utilizatorului
- `404 Not Found` - Abonamentul nu există

---

### POST /clients/subscriptions

**Descriere:** Creează un abonament nou

**Method:** `POST`

**Request Body:**
```typescript
{
  name: string
  items: Array<{
    productId: string
    quantity: number
    metadata?: {
      notes?: string
    }
  }>
  frequency: 'weekly' | 'biweekly' | 'monthly'
  metadata?: {
    deliveryAddress?: string
    notes?: string
  }
}
```

**Exemplu JSON:**
```json
{
  "name": "Cofetă săptămânală",
  "items": [
    {
      "productId": "prod_456",
      "quantity": 2,
      "metadata": {
        "notes": "Preferabil bio"
      }
    }
  ],
  "frequency": "weekly",
  "metadata": {
    "deliveryAddress": "Str. Exemplu, Nr. 123, București",
    "notes": "Livrare vineri dimineața"
  }
}
```

**Response Success (201):**
```typescript
// SubscriptionBasket creat (vezi formatul de mai sus)
```

**Response Errors:**
- `400 Bad Request` - Date invalide (name lipsă, items gol, etc.)
- `401 Unauthorized` - Nu este autentificat
- `404 Not Found` - Unul dintre produse nu există
- `422 Unprocessable Entity` - Validare business logic (ex: produs indisponibil, stoc insuficient)

**Business Rules:**
- `name` este obligatoriu și trebuie să aibă minim 3 caractere
- `items` trebuie să conțină cel puțin un item
- `quantity` trebuie să fie > 0 pentru fiecare item
- Produsele trebuie să existe și să fie active
- Backend-ul calculează automat `nextDeliveryDate` pe baza `frequency`

---

### PATCH /clients/subscriptions/:id

**Descriere:** Actualizează un abonament existent

**Method:** `PATCH`

**URL Parameters:**
- `id` - ID-ul abonamentului

**Request Body:**
```typescript
{
  name?: string
  items?: Array<{
    productId: string
    quantity: number
    metadata?: {
      notes?: string
    }
  }>
  frequency?: 'weekly' | 'biweekly' | 'monthly'
  isActive?: boolean
  metadata?: {
    deliveryAddress?: string
    notes?: string
  }
}
```

**Exemplu JSON:**
```json
{
  "name": "Cofetă săptămânală - Actualizat",
  "frequency": "biweekly",
  "isActive": true
}
```

**Response Success (200):**
```typescript
// SubscriptionBasket actualizat (vezi formatul de mai sus)
```

**Response Errors:**
- `400 Bad Request` - Date invalide
- `401 Unauthorized` - Nu este autentificat
- `403 Forbidden` - Abonamentul nu aparține utilizatorului
- `404 Not Found` - Abonamentul nu există
- `422 Unprocessable Entity` - Validare business logic

**Business Rules:**
- Dacă `isActive` este setat la `false`, abonamentul este pus în pauză
- Dacă `items` este actualizat, backend-ul trebuie să valideze că produsele există și sunt disponibile
- Dacă `frequency` este actualizat, backend-ul recalculează `nextDeliveryDate`

---

### DELETE /clients/subscriptions/:id

**Descriere:** Șterge un abonament (soft delete)

**Method:** `DELETE`

**URL Parameters:**
- `id` - ID-ul abonamentului

**Response Success (200/204):**
- `200 OK` cu body gol sau
- `204 No Content`

**Response Errors:**
- `401 Unauthorized` - Nu este autentificat
- `403 Forbidden` - Abonamentul nu aparține utilizatorului
- `404 Not Found` - Abonamentul nu există

**Business Rules:**
- Ștergerea este soft delete (abonamentul nu este șters definitiv, ci marcat ca șters)
- Istoricul comenzilor generate de abonament rămâne intact

---

### POST /clients/subscriptions/:id/pause

**Descriere:** Pune un abonament în pauză

**Method:** `POST`

**URL Parameters:**
- `id` - ID-ul abonamentului

**Response Success (200):**
```typescript
// SubscriptionBasket cu isActive: false
```

**Response Errors:**
- `401 Unauthorized` - Nu este autentificat
- `403 Forbidden` - Abonamentul nu aparține utilizatorului
- `404 Not Found` - Abonamentul nu există

**Business Rules:**
- Setează `isActive: false`
- Nu anulează comenzile deja programate, dar oprește generarea de comenzi noi

---

### POST /clients/subscriptions/:id/resume

**Descriere:** Reluare un abonament în pauză

**Method:** `POST`

**URL Parameters:**
- `id` - ID-ul abonamentului

**Response Success (200):**
```typescript
// SubscriptionBasket cu isActive: true
```

**Response Errors:**
- `401 Unauthorized` - Nu este autentificat
- `403 Forbidden` - Abonamentul nu aparține utilizatorului
- `404 Not Found` - Abonamentul nu există

**Business Rules:**
- Setează `isActive: true`
- Recalculează `nextDeliveryDate` pe baza `frequency`

---

## 🔔 Silent Alerts

### GET /clients/alert-preferences

**Descriere:** Obține preferințele de notificare ale utilizatorului

**Method:** `GET`

**Response Success (200):**
```typescript
// Poate fi array sau paginated response
Array<FavoriteAlertPreference> | {
  data: Array<FavoriteAlertPreference>
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

**Format FavoriteAlertPreference:**
```typescript
{
  targetType: 'product' | 'producer'
  targetId: string
  alertTypes: Array<'price_drop' | 'back_in_stock'>
  priceDropThreshold?: number  // Percentage (0-100), optional
  createdAt?: string
  updatedAt?: string
}
```

**Exemplu JSON:**
```json
[
  {
    "targetType": "product",
    "targetId": "prod_456",
    "alertTypes": ["price_drop", "back_in_stock"],
    "priceDropThreshold": 10,
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-20T15:30:00Z"
  },
  {
    "targetType": "product",
    "targetId": "prod_789",
    "alertTypes": ["back_in_stock"],
    "createdAt": "2024-01-16T10:00:00Z"
  }
]
```

**Response Errors:**
- `401 Unauthorized` - Nu este autentificat

**Notă:** Dacă utilizatorul nu are preferințe de notificare, returnează array gol `[]`.

---

### PATCH /clients/alert-preferences

**Descriere:** Actualizează preferințele de notificare

**Method:** `PATCH`

**Request Body:**
```typescript
{
  preferences: Array<{
    targetType: 'product' | 'producer'
    targetId: string
    alertTypes: Array<'price_drop' | 'back_in_stock'>
    priceDropThreshold?: number  // Percentage (0-100), optional
  }>
}
```

**Exemplu JSON:**
```json
{
  "preferences": [
    {
      "targetType": "product",
      "targetId": "prod_456",
      "alertTypes": ["price_drop", "back_in_stock"],
      "priceDropThreshold": 10
    },
    {
      "targetType": "product",
      "targetId": "prod_789",
      "alertTypes": ["back_in_stock"]
    }
  ]
}
```

**Response Success (200):**
```typescript
// Array<FavoriteAlertPreference> actualizat (vezi formatul de mai sus)
```

**Response Errors:**
- `400 Bad Request` - Date invalide (targetType sau targetId lipsă, alertTypes gol, etc.)
- `401 Unauthorized` - Nu este autentificat
- `404 Not Found` - Unul dintre produse/producători nu există

**Business Rules:**
- `alertTypes` nu poate fi array gol
- `priceDropThreshold` este opțional, dar dacă este furnizat, trebuie să fie între 0 și 100
- Dacă `alertTypes` conține `'price_drop'`, `priceDropThreshold` este recomandat (default: 10%)
- Backend-ul poate merge/actualiza preferințele existente sau crea altele noi
- Dacă `alertTypes` este array gol, preferința poate fi ștearsă (opțional)

---

## 🔄 Normalizare de Date

Frontend-ul acceptă atât formatul `snake_case` cât și `camelCase`:

```typescript
// Backend poate trimite:
{
  "target_type": "product",  // sau "targetType"
  "target_id": "123",        // sau "targetId"
  "alert_types": [...],      // sau "alertTypes"
  "price_drop_threshold": 10 // sau "priceDropThreshold"
}

// Frontend normalizează la:
{
  targetType: "product",
  targetId: "123",
  alertTypes: [...],
  priceDropThreshold: 10
}
```

**Recomandare:** Backend-ul ar trebui să folosească un format consistent (preferabil `camelCase` pentru consistență cu frontend-ul).

---

## 🔄 Fallback Behavior

### Favorites
Când `BackendSyncStatus.favorites` este `false`:
- Frontend-ul folosește `localStorage` pentru stocare locală
- Favorite-urile funcționează normal, dar nu sunt sincronizate cu backend-ul
- La activarea backend-ului, favorite-urile locale pot fi sincronizate (opțional)

### Subscriptions
Când `BackendSyncStatus.subscriptions` este `false`:
- Frontend-ul returnează array gol `[]` pentru `getSubscriptionBaskets()`
- Funcțiile de create/update/delete aruncă eroare: "Funcționalitatea de abonamente nu este disponibilă încă."
- UI-ul afișează "Coming soon"

### Alerts
Când `BackendSyncStatus.alerts` este `false`:
- Frontend-ul returnează array gol `[]` pentru `getAlertPreferences()`
- `updateAlertPreferences()` este no-op (returnează input-ul ca output)
- UI-ul permite setarea preferințelor, dar acestea nu sunt salvate (pregătite pentru viitor)

---

## 📝 Note Importante

### Rate Limiting
- **Favorites:** Recomandat limit de 100 request-uri/minut per utilizator
- **Subscriptions:** Recomandat limit de 20 request-uri/minut per utilizator
- **Alerts:** Recomandat limit de 30 request-uri/minut per utilizator

### Privacy
- Toate datele sunt asociate cu utilizatorul autentificat
- Backend-ul trebuie să verifice că utilizatorul are acces la produsele/producătorii din favorite
- Alert preferences sunt private și nu sunt partajate

### Limits
- **Favorites:** Recomandat limit de 500 favorite per utilizator
- **Subscriptions:** Recomandat limit de 20 abonamente active per utilizator
- **Alerts:** Recomandat limit de 200 preferințe de alertă per utilizator

### Business Logic
- **Favorites:** Un utilizator poate avea același produs/producător în favorite doar o dată
- **Subscriptions:** Abonamentele pot fi create doar pentru produse active și disponibile
- **Alerts:** Alert-urile sunt trimise doar pentru produse favorite (opțional: și pentru producători favoriți)

---

## 🔗 Integrare Favorites → Subscriptions

Frontend-ul folosește favorite-urile pentru a sugera abonamente:

1. **Sugestie automată:** Când utilizatorul accesează pagina de abonamente, frontend-ul sugerează produse din favorite
2. **Helper function:** `createSubscriptionBasketFromFavorites()` creează un abonament bazat pe favorite
3. **Logică de sugestie:**
   - Filtrează doar produsele (nu producătorii)
   - Sugerează cantități bazate pe istoricul de cumpărături (dacă disponibil)
   - Sugerează frecvență bazată pe frecvența de cumpărături

**Documentație detaliată:** Vezi `docs/SUBSCRIPTIONS_FROM_FAVORITES.md` (de creat)

---

## ✅ Checklist pentru Backend

Când backend-ul implementează aceste endpoint-uri, trebuie să verifice:

### Favorites
- [ ] Toate endpoint-urile returnează formatul JSON specificat
- [ ] Error codes sunt corecte (401, 404, 409)
- [ ] Cookie-based authentication funcționează
- [ ] Validările de date sunt implementate (400)
- [ ] Idempotență pentru add/remove (409 sau return existing)
- [ ] Metadata este opțional și poate fi extins

### Subscriptions
- [ ] Toate endpoint-urile returnează formatul JSON specificat
- [ ] Error codes sunt corecte (400, 401, 403, 404, 422)
- [ ] Validările de date sunt implementate
- [ ] `nextDeliveryDate` este calculat automat
- [ ] Pause/resume funcționează corect
- [ ] Soft delete este implementat

### Alerts
- [ ] Toate endpoint-urile returnează formatul JSON specificat
- [ ] Error codes sunt corecte (400, 401, 404)
- [ ] Validările de date sunt implementate
- [ ] `priceDropThreshold` este opțional și validat (0-100)
- [ ] Merge/update logic pentru preferințe existente

---

**Ultima actualizare:** 2024  
**Versiune:** 1.0

