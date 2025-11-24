# Metrics & Investor API

**Data:** 2025-01-27  
**Status:** ✅ **IMPLEMENTAT**

---

## 📋 Rezumat

API-ul de metrics oferă date agregate pentru KPI-uri, rapoarte și dashboard-uri pentru investitori și echipa internă.

**IMPORTANT:** Toate datele sunt agregate și anonimizate - nu expun informații personale.

---

## 🔐 Autentificare

Toate endpoint-urile `/admin/metrics/*` necesită:
- Autentificare validă
- Rol `ADMIN`

**NOTĂ:** Pentru viitor, poți crea `/investor/metrics/*` cu acces pentru rol `INVESTOR`.

---

## 📊 Endpoint-uri

### Overview Metrics

#### `GET /admin/metrics/overview`
Rezumat general de metrici.

**Query Parameters:**
- `from` (optional) - Data de început (ISO string)
- `to` (optional) - Data de sfârșit (ISO string)
- **Default:** Ultimele 30 de zile

**Response:**
```json
{
  "totalOrders": 1234,
  "totalGMV": 456789.12,
  "totalCommission": 12345.67,
  "activeClients": 321,
  "activeProducers": 54,
  "period": {
    "from": "2025-01-01T00:00:00Z",
    "to": "2025-12-31T23:59:59Z"
  }
}
```

**Metrici:**
- `totalOrders` - Număr total comenzi în perioada respectivă
- `totalGMV` - Gross Merchandise Value (valoarea totală tranzacționată)
- `totalCommission` - Total comisioane încasate
- `activeClients` - Clienți cu cel puțin o comandă în perioada respectivă
- `activeProducers` - Producători cu cel puțin o comandă în perioada respectivă

---

### Orders Time Series

#### `GET /admin/metrics/orders-timeseries`
Serii de timp pentru comenzi (pentru grafice).

**Query Parameters:**
- `from` (optional) - Data de început
- `to` (optional) - Data de sfârșit
- `granularity` (optional, default: `day`) - `day`, `week`, `month`
- **Default:** Ultimele 30 de zile, granularitate `day`

**Response:**
```json
{
  "granularity": "day",
  "points": [
    {
      "date": "2025-01-01",
      "orders": 10,
      "gmv": 1234.50,
      "commission": 120.30
    },
    {
      "date": "2025-01-02",
      "orders": 15,
      "gmv": 2345.67,
      "commission": 234.56
    }
  ]
}
```

**Utilizare:**
- Grafice de evoluție comenzi în timp
- Grafice de evoluție GMV
- Grafice de evoluție comisioane

---

### Top Producers

#### `GET /admin/metrics/producers/top`
Top producători după performanță.

**Query Parameters:**
- `from` (optional) - Data de început
- `to` (optional) - Data de sfârșit
- `limit` (optional, default: 10) - Număr de producători

**Response:**
```json
{
  "producers": [
    {
      "producerId": "uuid",
      "name": "Ferma X",
      "ordersCount": 120,
      "gmv": 12345.67,
      "commission": 1234.56
    },
    {
      "producerId": "uuid2",
      "name": "Ferma Y",
      "ordersCount": 100,
      "gmv": 10000.00,
      "commission": 1000.00
    }
  ]
}
```

**Sortare:** După GMV (descrescător)

---

### Subscriptions Metrics

#### `GET /admin/metrics/subscriptions`
Metrici pentru abonamente.

**Response:**
```json
{
  "activeSubscriptions": 50,
  "totalSubscriptions": 100,
  "cancelledSubscriptions": 50,
  "churnRate": 50.00,
  "message": "Metrici complete pentru subscriptions vor fi disponibile când feature-ul devine activ"
}
```

**NOTĂ:** Acest endpoint este pregătit pentru viitor când subscriptions devin active.

---

## 📈 Calcul Metrici

### GMV (Gross Merchandise Value)
Suma valorilor tuturor comenzilor cu status `COMPLETED` în perioada respectivă.

### Commission
Suma comisioanelor pentru comenzile cu status `COMPLETED`.

### Active Clients
Număr de utilizatori cu rol `CUSTOMER` care au cel puțin o comandă în perioada respectivă.

### Active Producers
Număr de producători cu status `APPROVED` care au cel puțin o comandă în perioada respectivă.

---

## 🔒 Securitate & Privacy

**IMPORTANT:**
- Toate datele sunt agregate - nu expun informații personale
- Nu se returnează email-uri, nume complete sau alte date identificabile
- Doar count-uri, sume și agregate

---

## 🚀 TODO-uri pentru Faza 2

- [ ] Cohort analysis (retenție clienți)
- [ ] Customer Lifetime Value (CLV)
- [ ] Average Order Value (AOV)
- [ ] Conversion rate (vizitatori → comenzi)
- [ ] Producer performance trends
- [ ] Product performance metrics
- [ ] Geographic distribution metrics
- [ ] Export CSV pentru rapoarte
- [ ] Caching pentru metrici (Redis)
- [ ] Scheduled reports (email săptămânal/lunar)

---

## 📊 Exemplu Utilizare

### Dashboard Admin

```javascript
// Obține overview
const overview = await fetch('/admin/metrics/overview?from=2025-01-01&to=2025-12-31');

// Obține time series pentru grafic
const timeseries = await fetch('/admin/metrics/orders-timeseries?granularity=day');

// Obține top producători
const topProducers = await fetch('/admin/metrics/producers/top?limit=10');
```

### Dashboard Investor

```javascript
// Pentru viitor: /investor/metrics/overview
// Cu acces limitat (doar metrici agregate, fără detalii)
```

---

**Ultima actualizare:** 2025-01-27

