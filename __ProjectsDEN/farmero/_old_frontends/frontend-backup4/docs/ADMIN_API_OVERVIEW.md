# Admin API Overview

**Data:** 2025-01-27  
**Status:** ✅ **IMPLEMENTAT**

---

## 📋 Rezumat

Admin API oferă endpoint-uri pentru gestionarea platformei Farmero, accesibile doar utilizatorilor cu rol `ADMIN`.

Toate rutele sunt protejate cu:
- Autentificare obligatorie (cookie sau JWT token)
- Verificare rol `ADMIN`

---

## 🔐 Autentificare

Toate endpoint-urile `/admin/*` necesită:
1. Autentificare validă (cookie `session` sau header `Authorization: Bearer <token>`)
2. Rol `ADMIN` în token/cookie

**Răspunsuri:**
- `401 Unauthorized` - Nu este autentificat sau token invalid
- `403 Forbidden` - Este autentificat dar nu are rol ADMIN

---

## 📚 Endpoint-uri

### Users Management

#### `GET /admin/users`
Listă utilizatori cu filtre și paginare.

**Query Parameters:**
- `role` (optional) - Filtrare după rol (`ADMIN`, `PRODUCER`, `CUSTOMER`)
- `status` (optional) - Filtrare după status (pentru viitor)
- `search` (optional) - Căutare după email sau nume
- `page` (optional, default: 1) - Număr pagină
- `limit` (optional, default: 20) - Număr rezultate per pagină

**Response:**
```json
{
  "users": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "CUSTOMER",
      "createdAt": "2025-01-01T00:00:00Z",
      "producer": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

#### `GET /admin/users/:id`
Detalii utilizator.

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "fullName": "John Doe",
  "role": "CUSTOMER",
  "producer": { ... },
  "orders": [ ... ],
  "carts": [ ... ]
}
```

#### `PATCH /admin/users/:id`
Actualizează utilizator.

**Body:**
```json
{
  "role": "PRODUCER",  // optional
  "fullName": "New Name"  // optional
}
```

#### `POST /admin/users/:id/reset-password`
Generează parolă temporară pentru utilizator (TODO: implementare completă cu email).

---

### Producers Management

#### `GET /admin/producers`
Listă producători cu filtre.

**Query Parameters:**
- `status` (optional) - `PENDING_VERIFICATION`, `APPROVED`, `REJECTED`
- `region` (optional) - Filtrare după regiune
- `page`, `limit` - Paginare

**Response:**
```json
{
  "producers": [
    {
      "id": "uuid",
      "name": "Ferma X",
      "status": "APPROVED",
      "user": { ... },
      "mainRegion": { ... }
    }
  ],
  "pagination": { ... }
}
```

#### `GET /admin/producers/:id`
Detalii producător.

#### `PATCH /admin/producers/:id`
Actualizează producător (status, description, etc.).

**Body:**
```json
{
  "status": "APPROVED",  // optional
  "description": "New description"  // optional
}
```

#### `GET /admin/producers/:id/products`
Listă produsele unui producător.

---

### Orders Management

#### `GET /admin/orders`
Listă comenzi cu filtre.

**Query Parameters:**
- `status` (optional) - Status comandă
- `paymentStatus` (optional) - Status plată
- `producerId` (optional) - Filtrare după producător
- `clientId` (optional) - Filtrare după client
- `startDate`, `endDate` (optional) - Interval de timp
- `page`, `limit` - Paginare

#### `GET /admin/orders/:id`
Detalii comandă completă.

#### `PATCH /admin/orders/:id`
Actualizează comandă (doar câmpuri administrative: notes, etc.).

---

### Financials

#### `GET /admin/financials/summary`
Rezumat financiar general.

**Query Parameters:**
- `from`, `to` (optional) - Interval de timp

**Response:**
```json
{
  "totalOrders": 1234,
  "totalGMV": 456789.12,
  "totalCommission": 12345.67,
  "activeClients": 321,
  "activeProducers": 54,
  "period": {
    "from": "2025-01-01",
    "to": "2025-12-31"
  }
}
```

#### `GET /admin/financials/producers`
Comisioane per producător (agregat).

**Query Parameters:**
- `from`, `to` (optional) - Interval de timp

**Response:**
```json
{
  "producers": [
    {
      "producerId": "uuid",
      "producerName": "Ferma X",
      "ordersCount": 120,
      "gmv": 12345.67,
      "commission": 1234.56
    }
  ]
}
```

#### `GET /admin/financials/producers/:id`
Detalii financiare per producător.

---

### Events / Audit Log

#### `GET /admin/events`
Listă evenimente/audit log.

**NOTĂ:** Sistemul de events este pregătit pentru viitor. Momentan returnează placeholder.

#### `GET /admin/events/:id`
Detalii eveniment.

---

## 🔗 Webhooks

Vezi [WEBHOOKS_AND_EVENTS.md](./WEBHOOKS_AND_EVENTS.md) pentru documentația completă.

**Endpoints:**
- `GET /admin/webhooks` - Listă webhooks
- `POST /admin/webhooks` - Creează webhook nou
- `GET /admin/webhooks/:id` - Detalii webhook
- `PATCH /admin/webhooks/:id` - Actualizează webhook
- `DELETE /admin/webhooks/:id` - Șterge webhook (soft delete)

---

## 📊 Metrics

Vezi [METRICS_AND_INVESTOR_API.md](./METRICS_AND_INVESTOR_API.md) pentru documentația completă.

**Endpoints:**
- `GET /admin/metrics/overview` - Rezumat general
- `GET /admin/metrics/orders-timeseries` - Serii de timp pentru comenzi
- `GET /admin/metrics/producers/top` - Top producători
- `GET /admin/metrics/subscriptions` - Metrici abonamente

---

## 🚀 TODO-uri pentru Viitor

- [ ] Impersonare utilizator (pentru suport)
- [ ] Export CSV pentru rapoarte
- [ ] Sistem complet de audit log cu events
- [ ] Resetare parolă cu email
- [ ] Bulk operations (ex: aprobare multiple producători)

---

**Ultima actualizare:** 2025-01-27

