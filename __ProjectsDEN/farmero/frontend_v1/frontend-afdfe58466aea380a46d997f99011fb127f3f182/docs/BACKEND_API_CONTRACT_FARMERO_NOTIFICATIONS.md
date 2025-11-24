# Backend API Contract - Farmero Notifications

## Overview

Acest document descrie contractul API pentru sistemul unificat de notificări și comunicare Farmero. Notificările sunt pregătite de backend (mesajele sunt deja formate pentru afișare) - frontend-ul doar le prezintă.

## Endpoints

### GET /notifications

Returnează lista de notificări pentru utilizatorul autentificat.

**URL:** `https://api.farme.ro/notifications`

**Method:** `GET`

**Authentication:** Required (cookie-based, `credentials: 'include'`)

**Roles Required:** Toți utilizatorii autentificați (client, producer, business, logistics, investor, importer)

---

## Request

### Headers

```
Cookie: session=...
```

### Query Parameters

Niciun parametru query necesar pentru moment. (Viitor: `?limit=20&offset=0` pentru paginare)

---

## Response

### Success Response (200 OK)

**Content-Type:** `application/json`

**Body:**

```typescript
[
  {
    "id": "notif-123",
    "type": "order_status",
    "severity": "info",
    "title": "Comanda ta #123 a fost expediată",
    "body": "Comanda ta a fost expediată și va ajunge în curând. Poți urmări statusul în contul tău.",
    "createdAt": "2025-01-27T10:30:00Z",
    "readAt": null,
    "targetUrl": "/orders/123"
  },
  {
    "id": "notif-124",
    "type": "favorite_promo",
    "severity": "success",
    "title": "Unul din produsele tale favorite este acum redus",
    "body": "Miere de salcâm de la Ferma Popescu este acum redus cu 15%. Comandă acum!",
    "createdAt": "2025-01-27T09:15:00Z",
    "readAt": "2025-01-27T09:20:00Z",
    "targetUrl": "/products/miere-salcam"
  },
  {
    "id": "notif-125",
    "type": "subscription",
    "severity": "info",
    "title": "Mâine pregătim coșul tău recurent",
    "body": "Coșul tău recurent va fi pregătit mâine. Dacă vrei să modifici ceva, accesează abonamentele tale.",
    "createdAt": "2025-01-26T18:00:00Z",
    "readAt": null,
    "targetUrl": "/account/subscriptions"
  }
]
```

### Error Responses

#### 401 Unauthorized

```json
{
  "error": "Unauthorized",
  "message": "Trebuie să fii autentificat pentru a vedea notificările."
}
```

#### 403 Forbidden

```json
{
  "error": "Forbidden",
  "message": "Nu ai permisiunea de a accesa notificările."
}
```

#### 500 Internal Server Error

```json
{
  "error": "Internal Server Error",
  "message": "A apărut o problemă la încărcarea notificărilor. Încearcă din nou mai târziu."
}
```

---

### GET /notifications/summary

Returnează rezumatul notificărilor (număr de notificări necitite).

**URL:** `https://api.farme.ro/notifications/summary`

**Method:** `GET`

**Authentication:** Required (cookie-based, `credentials: 'include'`)

**Roles Required:** Toți utilizatorii autentificați

---

## Request

### Headers

```
Cookie: session=...
```

---

## Response

### Success Response (200 OK)

**Content-Type:** `application/json`

**Body:**

```typescript
{
  "unreadCount": 5,
  "lastNotificationAt": "2025-01-27T10:30:00Z"
}
```

### Error Responses

Aceleași ca pentru `GET /notifications`.

---

### POST /notifications/:id/read

Marchează o notificare ca citită.

**URL:** `https://api.farme.ro/notifications/:id/read`

**Method:** `POST`

**Authentication:** Required (cookie-based, `credentials: 'include'`)

**Roles Required:** Toți utilizatorii autentificați

---

## Request

### Headers

```
Cookie: session=...
```

### Path Parameters

- `id` (string, required) - ID-ul notificării

---

## Response

### Success Response (200 OK)

**Content-Type:** `application/json`

**Body:**

```typescript
{
  "id": "notif-123",
  "readAt": "2025-01-27T10:35:00Z"
}
```

### Error Responses

#### 401 Unauthorized

```json
{
  "error": "Unauthorized",
  "message": "Trebuie să fii autentificat pentru a marca notificarea ca citită."
}
```

#### 403 Forbidden

```json
{
  "error": "Forbidden",
  "message": "Nu ai permisiunea de a marca notificarea ca citită."
}
```

#### 404 Not Found

```json
{
  "error": "Not Found",
  "message": "Notificarea nu a fost găsită."
}
```

---

## Notification Types

### order_status

Notificări despre schimbarea statusului comenzilor.

**Exemple:**
- "Comanda ta #123 a fost expediată."
- "Comanda ta #124 a fost livrată."
- "Comanda ta #125 este în pregătire."

**Severity:** `info` sau `success`

**targetUrl:** `/orders/:orderId` sau `/orders`

---

### subscription

Notificări despre abonamente (livrare apropiată, pauză, etc.).

**Exemple:**
- "Mâine pregătim coșul tău recurent."
- "Abonamentul tău a fost pus pe pauză."
- "Coșul tău recurent a fost livrat."

**Severity:** `info` sau `warning`

**targetUrl:** `/account/subscriptions`

---

### favorite_promo

Notificări promo bazate pe favorite (reduceri, disponibilitate).

**Exemple:**
- "Unul din produsele tale favorite este acum redus."
- "Un produs favorit a revenit în stoc."
- "Oferte speciale pentru produsele tale favorite."

**Severity:** `success` sau `info`

**targetUrl:** `/products/:slug` sau `/account/favorites`

**Notă:** Aceste notificări trebuie să fie decente și non-invazive. Nu spam-ui utilizatorul.

---

### system

Notificări de sistem (anunțuri, mentenanță, etc.).

**Exemple:**
- "Platforma va fi în mentenanță mâine între 02:00-04:00."
- "Bun venit pe Farmero! Explorează produsele noastre."
- "Actualizare: Noi funcționalități disponibile."

**Severity:** `info` sau `warning`

**targetUrl:** Opțional (depinde de context)

---

### marketing

Notificări de marketing (opționale, opt-in).

**Exemple:**
- "Oferte speciale săptămâna aceasta!"
- "Nou: Produse de sezon disponibile."
- "Reducere 20% pentru clienții fideli."

**Severity:** `info` sau `success`

**targetUrl:** Opțional (depinde de context)

**Notă:** Aceste notificări trebuie să fie opt-in (utilizatorul trebuie să-și dea consimțământul).

---

## Business Notes

1. **Message Formatting:** Backend-ul este responsabil pentru formatarea mesajelor. Frontend-ul doar le afișează.

2. **Target URLs:** Toate notificările ar trebui să aibă un `targetUrl` relevant (dacă e cazul) pentru a permite utilizatorului să navigheze direct la contextul notificării.

3. **Severity:** Folosește severity pentru a indica importanța notificării:
   - `info` - Informații generale
   - `success` - Acțiuni reușite, oferte
   - `warning` - Avertismente, pauză abonamente
   - `error` - Erori, probleme (rar)

4. **Read Status:** Notificările sunt marcate ca citite când utilizatorul dă click pe ele sau când marchează explicit ca citită.

5. **Rate Limiting:** Backend-ul ar trebui să implementeze rate limiting pentru notificările de tip `favorite_promo` și `marketing` pentru a evita spam-ul.

6. **Privacy:** Nu include informații sensibile în notificări (ex: sume exacte, detalii personale).

---

## Example Payloads

### order_status

```json
{
  "id": "notif-order-123",
  "type": "order_status",
  "severity": "info",
  "title": "Comanda ta #123 a fost expediată",
  "body": "Comanda ta a fost expediată și va ajunge în curând. Poți urmări statusul în contul tău.",
  "createdAt": "2025-01-27T10:30:00Z",
  "readAt": null,
  "targetUrl": "/orders/123"
}
```

### favorite_promo

```json
{
  "id": "notif-fav-456",
  "type": "favorite_promo",
  "severity": "success",
  "title": "Unul din produsele tale favorite este acum redus",
  "body": "Miere de salcâm de la Ferma Popescu este acum redus cu 15%. Comandă acum!",
  "createdAt": "2025-01-27T09:15:00Z",
  "readAt": null,
  "targetUrl": "/products/miere-salcam"
}
```

### subscription

```json
{
  "id": "notif-sub-789",
  "type": "subscription",
  "severity": "info",
  "title": "Mâine pregătim coșul tău recurent",
  "body": "Coșul tău recurent va fi pregătit mâine. Dacă vrei să modifici ceva, accesează abonamentele tale.",
  "createdAt": "2025-01-26T18:00:00Z",
  "readAt": null,
  "targetUrl": "/account/subscriptions"
}
```

---

## Future Endpoints (TODO)

### POST /notifications/read-all

Marchează toate notificările ca citite.

**Request:** `POST /notifications/read-all`

**Response:**

```json
{
  "markedCount": 5
}
```

---

**Ultima actualizare:** 2025-01-27  
**Versiune:** 1.0

