# Admin Commerce Dashboard - Documentație

## Prezentare generală

Admin Commerce Dashboard oferă o vedere 360° asupra operațiunilor de core commerce: comenzi, comisioane, dispute și refunduri.

## Pagini

### 1. `/orders` - Orders 2.0

**Descriere:** Pagină îmbunătățită pentru gestionarea comenzilor cu filtre avansate și detalii financiare.

**Funcționalități:**

#### Filtre
- **Status**: PLACED, CONFIRMED, PREPARING, SHIPPED, DELIVERED, CANCELED, REFUNDED
- **Date Range**: Date picker pentru interval de timp
- **Producer Search**: Căutare după nume producător
- **Client Email Search**: Căutare după email client
- **General Search**: Căutare după ID comandă

#### Coloane tabel
- ID Comandă
- Client (nume + email)
- Producător
- Status (cu badge-uri colorate)
- Metodă plată
- Total (cu comision afișat)
- Data

#### Modal detalii comandă

**Secțiuni:**

1. **Informații comandă**
   - Client
   - Status
   - Produse comandate (grupate pe producător)

2. **Secțiune financiară** (nou)
   - Total comandă
   - Comision Farmero
   - Sumă către producător
   - Stare plată (paid, pending, refunded)
   - Metodă plată

3. **Comisioane breakdown** (nou)
   - Listă comisioane per producător
   - Bază, rată, sumă comision
   - Status comision (PENDING, ISSUED, PAID)

4. **Timeline** (nou)
   - Istoric statusuri cu timestamps
   - Note pentru fiecare schimbare

5. **Acțiuni admin**
   - Marchează ca refundat (necesită reason)
   - Anulează comandă (necesită reason)

**RBAC:**
- Vizualizare: `view_orders`
- Refund: `refund_orders`
- Cancel: `cancel_orders`

**Audit Log:**
- `ORDER_REFUNDED` - cu reason
- `ORDER_CANCELED` - cu reason

### 2. `/orders/disputes` - Dispute & Refunds

**Descriere:** Gestionare dispute și refunduri pentru comenzi.

**Funcționalități:**

#### Tabel dispute
- ID Dispută
- Comandă (ID + total)
- Tip (quality, delivery, billing, other)
- Status (open, in_review, resolved, refunded)
- Client (nume + email)
- Descriere
- Creată / Actualizată

#### Filtre
- Status: open, in_review, resolved, refunded
- Tip: quality, delivery, billing, other
- Search: ID, comandă, descriere, email client

#### Acțiuni
- **Marchează în review**: Pentru dispute deschise
- **Marchează rezolvat**: Pentru dispute în review (necesită reason)
- **Creează refund**: Pentru dispute în review (necesită reason)

**RBAC:**
- Vizualizare: `view_orders`
- Acțiuni: `refund_orders` sau `manage_financials`

**Audit Log:**
- `DISPUTE_IN_REVIEW` - fără reason
- `DISPUTE_RESOLVED` - cu reason
- `DISPUTE_REFUNDED` - cu reason

**Backend Status:**
- ⚠️ Endpoint-urile nu sunt implementate încă
- UI afișează mesaj clar când backend lipsește

### 3. `/commerce/commissions` - Commissions & Payout Summary

**Descriere:** Rezumat comisioane și payout-uri pe producători.

**Funcționalități:**

#### KPI Cards
- **Total GMV**: Total vânzări (Gross Merchandise Value)
- **Total Comisioane**: Suma totală comisioane Farmero
- **Total Payout Due**: Suma totală de plătit producătorilor

#### Filtrare
- **Perioadă**: Date picker pentru interval (default: luna curentă)

#### Tabel producători
- Producător
- Total Vânzări
- Total Comisioane
- Net Payout
- Status Payout (pending, paid)
- Nr. Comisioane

**RBAC:**
- Vizualizare: `view_financials` sau `view_finance`

**Backend Status:**
- ⚠️ Endpoint-ul nu este implementat încă
- UI afișează empty state când backend lipsește

## Endpoints Backend

### Orders

#### GET /admin/orders
**Status:** ✅ Implementat (parțial)

**Query params suportați:**
- `status`, `paymentStatus`, `producerId`, `clientId`
- `startDate`, `endDate` (legacy)
- `dateFrom`, `dateTo` (nou)
- `clientEmail` (nou - poate să nu fie suportat)
- `search` (nou - poate să nu fie suportat)

**Response extins așteptat:**
```json
{
  "orders": [
    {
      "id": "uuid",
      "paymentMethod": "card",
      "commissionAmount": "8.00",
      // ... rest
    }
  ]
}
```

#### GET /admin/orders/:id
**Status:** ✅ Implementat (parțial)

**Response extins așteptat:**
```json
{
  "id": "uuid",
  "totalCommission": "8.00",
  "totalPayout": "92.00",
  "paymentMethod": "card",
  "commissions": [...],
  "timeline": [...]
}
```

### Disputes

#### GET /admin/orders/disputes
**Status:** ❌ Neimplementat

**Query params:**
- `status`, `type`, `orderId`, `page`, `limit`

**Response:** Array de dispute cu detalii complete

#### PATCH /admin/orders/disputes/:id
**Status:** ❌ Neimplementat

**Request:**
```json
{
  "status": "in_review" | "resolved" | "refunded",
  "resolution": "string"
}
```

#### POST /admin/orders/:id/refund
**Status:** ❌ Neimplementat

**Request:**
```json
{
  "reason": "string (required)",
  "amount": "string (optional)"
}
```

### Commissions

#### GET /admin/commerce/commissions-summary
**Status:** ❌ Neimplementat

**Query params:**
- `from`, `to`, `producerId`

**Response:**
```json
{
  "summary": {
    "totalGMV": "10000.00",
    "totalCommissions": "800.00",
    "totalPayoutDue": "9200.00",
    "period": { "from": "...", "to": "..." }
  },
  "byProducer": [...]
}
```

#### GET /admin/commissions
**Status:** ✅ Implementat (există în backend)

**Query params:**
- `status`, `producerId`, `orderId`

**Response:** Array de comisioane

## Permisiuni necesare

### Orders
- `view_orders` - Vizualizare comenzi
- `refund_orders` - Refund comenzi
- `cancel_orders` - Anulare comenzi

### Disputes
- `view_orders` - Vizualizare dispute
- `refund_orders` - Acțiuni dispute (refund)
- `manage_financials` - Acțiuni dispute (rezolvare)

### Commissions
- `view_financials` sau `view_finance` - Vizualizare comisioane

## Audit Logging

Toate acțiunile critice sunt loggate:

### Orders
- `ORDER_REFUNDED` - cu reason obligatoriu
- `ORDER_CANCELED` - cu reason obligatoriu

### Disputes
- `DISPUTE_IN_REVIEW` - fără reason
- `DISPUTE_RESOLVED` - cu reason obligatoriu
- `DISPUTE_REFUNDED` - cu reason obligatoriu

## Status implementare

### ✅ Complet conectat la backend

1. **GET /admin/orders** - ✅ Funcțional (filtre parțiale)
2. **GET /admin/orders/:id** - ✅ Funcțional (așteaptă câmpuri noi)
3. **PATCH /admin/orders/:id** - ✅ Funcțional (așteaptă suport status)
4. **GET /admin/commissions** - ✅ Funcțional (există în backend)

### ⚠️ Mock / Placeholder (așteaptă backend)

1. **GET /admin/orders/disputes** - ❌ Empty state cu mesaj
2. **PATCH /admin/orders/disputes/:id** - ❌ Butoanele funcționează dar endpoint lipsește
3. **POST /admin/orders/:id/refund** - ❌ Butonul funcționează dar endpoint lipsește
4. **GET /admin/commerce/commissions-summary** - ❌ Empty state cu mesaj

### 📊 Câmpuri noi așteptate în backend

#### OrderSummary
- `paymentMethod?: string`
- `commissionAmount?: string`

#### OrderDetail
- `totalCommission?: string`
- `totalPayout?: string`
- `paymentMethod?: string`
- `commissions?: Array<{...}>` (extins cu baseAmount, commissionRate, status)
- `timeline?: Array<{status, timestamp, note}>`

## Best Practices

1. **Verifică permisiunile**: Toate paginile verifică RBAC înainte de a afișa conținut
2. **Reason obligatoriu**: Acțiunile critice (refund, cancel, resolve dispute) necesită reason
3. **Audit logging**: Toate acțiunile sunt loggate cu reason și metadata
4. **Fallback graceful**: UI-ul funcționează chiar dacă endpoint-urile lipsesc
5. **Mesaje clare**: Utilizatorii sunt informați când funcționalități așteaptă backend

## Rezumat

### Pagini implementate
- ✅ `/orders` - Îmbunătățit cu filtre noi, coloane noi, secțiune financiară, timeline
- ✅ `/orders/disputes` - Complet implementat (UI gata, așteaptă backend)
- ✅ `/commerce/commissions` - Complet implementat (UI gata, așteaptă backend)

### Endpoint-uri backend
- ✅ 4 endpoint-uri existente (orders, commissions)
- ❌ 4 endpoint-uri noi necesare (disputes, refund, commissions-summary)

### RBAC & Audit
- ✅ Toate paginile protejate cu RBAC
- ✅ Toate acțiunile critice loggate în audit log
- ✅ Reason obligatoriu pentru acțiuni ireversibile

