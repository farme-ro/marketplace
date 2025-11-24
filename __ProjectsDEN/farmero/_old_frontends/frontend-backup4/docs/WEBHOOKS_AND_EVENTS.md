# Webhooks & Events System

**Data:** 2025-01-27  
**Status:** ✅ **IMPLEMENTAT**

---

## 📋 Rezumat

Sistemul de webhooks și events permite integrări externe și notificări pentru evenimente cheie din platformă.

---

## 🎯 Evenimente Suportate

### Tipuri de Evenimente

- `order.created` - Comandă nouă creată
- `order.status.changed` - Status comandă schimbat
- `subscription.created` - Abonament creat (când devine activ)
- `subscription.updated` - Abonament actualizat
- `producer.approved` - Producător aprobat (când devine activ)

---

## 📦 Structura Evenimentelor

### `order.created`

**Payload:**
```json
{
  "orderId": "uuid",
  "customerId": "uuid",
  "totalAmount": 1234.56,
  "status": "PENDING",
  "vendorCount": 2,
  "producerIds": ["uuid1", "uuid2"]
}
```

**Când se declanșează:**
- Când un client finalizează checkout-ul

---

### `order.status.changed`

**Payload:**
```json
{
  "orderId": "uuid",
  "oldStatus": "PENDING",
  "newStatus": "COMPLETED",
  "producerId": "uuid",
  "orderVendorId": "uuid",
  "orderVendorStatus": "DELIVERED"
}
```

**Când se declanșează:**
- Când statusul unei sub-comenzi (OrderVendor) se schimbă
- Când toate sub-comenzile sunt DELIVERED și Order devine COMPLETED

---

## 🔗 Webhooks API

### `GET /admin/webhooks`
Listă toate webhooks-urile.

**Response:**
```json
{
  "webhooks": [
    {
      "id": "uuid",
      "targetUrl": "https://example.com/webhook",
      "eventTypes": ["order.created", "order.status.changed"],
      "isActive": true,
      "createdAt": "2025-01-01T00:00:00Z",
      "_count": {
        "deliveries": 42
      }
    }
  ]
}
```

---

### `POST /admin/webhooks`
Creează webhook nou.

**Body:**
```json
{
  "targetUrl": "https://example.com/webhook",
  "eventTypes": ["order.created", "order.status.changed"],
  "secret": "optional-secret"  // Dacă nu este furnizat, se generează automat
}
```

**Response:**
```json
{
  "webhook": {
    "id": "uuid",
    "targetUrl": "https://example.com/webhook",
    "eventTypes": ["order.created"],
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00Z"
  },
  "message": "Webhook creat cu succes. Secret-ul a fost generat automat."
}
```

**NOTĂ:** Secret-ul nu este returnat în răspuns pentru securitate.

---

### `GET /admin/webhooks/:id`
Detalii webhook cu istoric livrări.

**Response:**
```json
{
  "webhook": {
    "id": "uuid",
    "targetUrl": "https://example.com/webhook",
    "eventTypes": ["order.created"],
    "isActive": true,
    "deliveries": [
      {
        "id": "uuid",
        "status": "success",
        "responseStatus": 200,
        "createdAt": "2025-01-01T00:00:00Z"
      }
    ]
  }
}
```

---

### `PATCH /admin/webhooks/:id`
Actualizează webhook.

**Body:**
```json
{
  "targetUrl": "https://new-url.com/webhook",  // optional
  "eventTypes": ["order.created"],  // optional
  "isActive": false,  // optional
  "secret": "new-secret"  // optional
}
```

---

### `DELETE /admin/webhooks/:id`
Șterge webhook (soft delete - dezactivează).

---

## 🔐 Verificare Semnătură HMAC

Webhooks-urile trimit un header `X-Farm ero-Signature` cu semnătura HMAC-SHA256.

**Exemplu verificare (Node.js):**
```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// În handler-ul webhook-ului
const signature = req.headers['x-farm ero-signature'];
const isValid = verifyWebhookSignature(req.body, signature, WEBHOOK_SECRET);

if (!isValid) {
  return res.status(401).json({ error: 'Invalid signature' });
}
```

---

## 📨 Format Payload Webhook

**Request Method:** `POST`  
**Content-Type:** `application/json`  
**Header:** `X-Farm ero-Signature: <hmac-sha256-signature>`

**Body:**
```json
{
  "eventId": "uuid",
  "type": "order.created",
  "payload": {
    "orderId": "uuid",
    "customerId": "uuid",
    "totalAmount": 1234.56,
    "status": "PENDING",
    "vendorCount": 2,
    "producerIds": ["uuid1", "uuid2"]
  },
  "createdAt": "2025-01-01T00:00:00Z"
}
```

---

## 🔄 Livrare Webhooks

### Retry Logic

**MVP:** Webhooks-urile sunt trimise sincron, fără retry automat.

**TODO pentru Faza 2:**
- Queue pentru webhooks (ex: Bull/BullMQ)
- Retry cu backoff exponențial
- Max attempts: 3
- Dead letter queue pentru failures

### Status Livrări

- `pending` - În așteptare
- `success` - Livrat cu succes (status 2xx)
- `failed` - Eșuat (status non-2xx sau eroare de rețea)

---

## 📊 Istoric Livrări

Fiecare livrare webhook este salvată în tabelul `webhook_deliveries` cu:
- Status
- Response status code
- Response body (scurt)
- Număr de încercări
- Timestamp

---

## 🚀 TODO-uri pentru Viitor

- [ ] Queue system pentru webhooks (Bull/BullMQ)
- [ ] Retry automat cu backoff
- [ ] Webhook testing endpoint (pentru a testa webhooks manual)
- [ ] Rate limiting pentru webhooks
- [ ] Webhook secrets rotation
- [ ] Webhook delivery notifications (email când webhook-ul eșuează)

---

**Ultima actualizare:** 2025-01-27

