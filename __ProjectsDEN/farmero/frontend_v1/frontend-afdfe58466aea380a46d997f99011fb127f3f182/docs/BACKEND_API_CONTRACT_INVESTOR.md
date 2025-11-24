# Backend API Contract - Investor Portal

**Data:** 2025-01-27  
**Scop:** Documentație pentru contractele API între frontend (Next.js) și backend (api.farme.ro) pentru Investor Portal  
**Status:** Frontend-ready, așteaptă implementare backend

---

## 📋 Preambul

Acest document descrie contractele API pentru funcționalitatea Investor Portal:
- **Dashboard Statistics** - Statistici generale pentru investitori
- **Transaction Volume** - Volume-ul tranzacțiilor pe perioade
- **Order Evolution** - Evoluția comenzilor în timp
- **Top Items** - Top produse, regiuni și producători (anonimizat)
- **Financial Flow** - Fluxul financiar (venit, comision, plăți)

**IMPORTANT:** 
- Frontend-ul este pregătit și folosește aceste contracte
- Backend-ul trebuie să implementeze aceste endpoint-uri conform specificațiilor
- Toate request-urile folosesc `credentials: 'include'` pentru cookie-based authentication
- Base URL: `https://api.farme.ro`
- **PRIVACY:** Toate datele despre producători, clienți și regiuni trebuie să fie anonimizate

---

## 🔐 Autentificare

Toate endpoint-urile necesită autentificare via cookies:
- Request-urile includ `credentials: 'include'`
- Backend-ul verifică cookie-ul de sesiune
- Răspunsuri de eroare:
  - `401 Unauthorized` - Nu este autentificat
  - `403 Forbidden` - Autentificat dar fără permisiuni (nu este investor user)

---

## 📊 Dashboard Statistics

### GET /investor/analytics/dashboard

Returnează statistici generale pentru investor dashboard.

**Response Body:**

```typescript
interface InvestorDashboardStats {
  totalRevenue: number
  revenueGrowth: number  // Percentage
  totalTransactions: number
  transactionsGrowth: number  // Percentage
  totalOrders: number
  ordersGrowth: number  // Percentage
  activeProducers: number
  producersGrowth: number  // Percentage
  activeUsers: number
  usersGrowth: number  // Percentage
  averageOrderValue: number
  orderValueGrowth: number  // Percentage
  totalProducts: number
  platformCommission: number
  platformCommissionGrowth: number  // Percentage
}
```

**Example Response:**

```json
{
  "totalRevenue": 2500000,
  "revenueGrowth": 25.5,
  "totalTransactions": 12500,
  "transactionsGrowth": 30.1,
  "totalOrders": 12500,
  "ordersGrowth": 30.1,
  "activeProducers": 520,
  "producersGrowth": 15.2,
  "activeUsers": 8500,
  "usersGrowth": 22.4,
  "averageOrderValue": 200,
  "orderValueGrowth": 5.3,
  "totalProducts": 3500,
  "platformCommission": 375000,
  "platformCommissionGrowth": 25.5
}
```

**Error Codes:**
- `401` - Nu este autentificat
- `403` - Nu este investor user

---

## 💰 Transaction Volume

### GET /investor/analytics/transactions/volume

Returnează volume-ul tranzacțiilor pentru o perioadă specificată.

**Query Parameters:**
- `period` (required): `'daily' | 'weekly' | 'monthly'` - Perioada de agregare

**Response Body:**

```typescript
interface TransactionVolumePeriod {
  period: 'daily' | 'weekly' | 'monthly'
  data: TransactionVolume[]
}

interface TransactionVolume {
  date: string  // ISO date string
  volume: number  // Total transaction volume in RON
  orders: number  // Number of orders
  revenue: number  // Revenue in RON
}
```

**Example Response:**

```json
{
  "period": "monthly",
  "data": [
    {
      "date": "2025-01-01T00:00:00Z",
      "volume": 50000,
      "orders": 50,
      "revenue": 40000
    },
    {
      "date": "2025-02-01T00:00:00Z",
      "volume": 55000,
      "orders": 55,
      "revenue": 44000
    }
  ]
}
```

**Error Codes:**
- `401` - Nu este autentificat
- `403` - Nu este investor user
- `400` - Parametru `period` invalid

---

## 📈 Order Evolution

### GET /investor/analytics/orders/evolution

Returnează evoluția comenzilor pentru o perioadă specificată.

**Query Parameters:**
- `period` (required): `'daily' | 'weekly' | 'monthly'` - Perioada de agregare

**Response Body:**

```typescript
interface OrderEvolutionPeriod {
  period: 'daily' | 'weekly' | 'monthly'
  data: OrderEvolution[]
}

interface OrderEvolution {
  date: string  // ISO date string
  orders: number  // Number of orders
  completedOrders: number
  canceledOrders: number
  averageValue: number  // Average order value
}
```

**Example Response:**

```json
{
  "period": "monthly",
  "data": [
    {
      "date": "2025-01-01T00:00:00Z",
      "orders": 100,
      "completedOrders": 90,
      "canceledOrders": 5,
      "averageValue": 150
    },
    {
      "date": "2025-02-01T00:00:00Z",
      "orders": 120,
      "completedOrders": 110,
      "canceledOrders": 6,
      "averageValue": 160
    }
  ]
}
```

**Error Codes:**
- `401` - Nu este autentificat
- `403` - Nu este investor user
- `400` - Parametru `period` invalid

---

## 🏆 Top Items (Anonymized)

### GET /investor/analytics/top-items

Returnează top produse, regiuni și producători (anonimizat).

**Query Parameters:**
- `limit` (optional): number - Număr de items de returnat (default: 5)

**Response Body:**

```typescript
interface TopItems {
  products: TopProduct[]
  regions: TopRegion[]
  producers: TopProducer[]
}

interface TopProduct {
  id: string  // Anonymized ID
  category: string
  salesCount: number
  revenue: number
  growth?: number  // Percentage growth
}

interface TopRegion {
  id: string  // Anonymized ID
  name: string  // Anonymized name (e.g., "Regiunea 1")
  orders: number
  revenue: number
  producers: number  // Number of producers in region
  growth?: number  // Percentage growth
}

interface TopProducer {
  id: string  // Anonymized ID
  region: string  // Anonymized region
  orders: number
  revenue: number
  products: number  // Number of products
  rating?: number  // Average rating (if available)
  growth?: number  // Percentage growth
}
```

**Example Response:**

```json
{
  "products": [
    {
      "id": "prod-anon-1",
      "category": "Lactate",
      "salesCount": 1250,
      "revenue": 187500,
      "growth": 15.2
    },
    {
      "id": "prod-anon-2",
      "category": "Fructe",
      "salesCount": 980,
      "revenue": 147000,
      "growth": 22.5
    }
  ],
  "regions": [
    {
      "id": "reg-anon-1",
      "name": "Regiunea 1",
      "orders": 3200,
      "revenue": 480000,
      "producers": 85,
      "growth": 20.5
    },
    {
      "id": "reg-anon-2",
      "name": "Regiunea 2",
      "orders": 2800,
      "revenue": 420000,
      "producers": 72,
      "growth": 15.3
    }
  ],
  "producers": [
    {
      "id": "prod-anon-1",
      "region": "Regiunea 1",
      "orders": 450,
      "revenue": 67500,
      "products": 25,
      "rating": 4.8,
      "growth": 25.3
    },
    {
      "id": "prod-anon-2",
      "region": "Regiunea 2",
      "orders": 380,
      "revenue": 57000,
      "products": 22,
      "rating": 4.7,
      "growth": 18.5
    }
  ]
}
```

**Error Codes:**
- `401` - Nu este autentificat
- `403` - Nu este investor user

**Privacy Notes:**
- Toate ID-urile trebuie să fie anonimizate (nu ID-uri reale)
- Numele regiunilor trebuie să fie generic (e.g., "Regiunea 1", "Regiunea 2")
- Nu se expun date personale despre producători sau clienți

---

## 💸 Financial Flow

### GET /investor/analytics/financial-flow

Returnează fluxul financiar (venit, comision, plăți) pentru o perioadă specificată.

**Query Parameters:**
- `period` (required): `'daily' | 'weekly' | 'monthly'` - Perioada de agregare

**Response Body:**

```typescript
interface FinancialFlowPeriod {
  period: 'daily' | 'weekly' | 'monthly'
  data: FinancialFlow[]
}

interface FinancialFlow {
  date: string  // ISO date string
  revenue: number
  commission: number
  payouts: number  // Payouts to producers
  netRevenue: number  // Revenue - payouts (should equal commission)
}
```

**Example Response:**

```json
{
  "period": "monthly",
  "data": [
    {
      "date": "2025-01-01T00:00:00Z",
      "revenue": 50000,
      "commission": 7500,
      "payouts": 42500,
      "netRevenue": 7500
    },
    {
      "date": "2025-02-01T00:00:00Z",
      "revenue": 55000,
      "commission": 8250,
      "payouts": 46750,
      "netRevenue": 8250
    }
  ]
}
```

**Error Codes:**
- `401` - Nu este autentificat
- `403` - Nu este investor user
- `400` - Parametru `period` invalid

**Business Notes:**
- `netRevenue` ar trebui să fie egal cu `commission` (venitul net al platformei)
- `payouts` reprezintă plățile către producători
- `revenue` = `commission` + `payouts`

---

## 📝 Note de Business

1. **Autentificare:** Toate endpoint-urile necesită autentificare ca investor user
2. **Anonimizare:** Toate datele despre producători, clienți și regiuni trebuie să fie anonimizate
3. **Valută:** Toate sumele sunt în RON (Lei)
4. **Date:** Toate datele sunt în format ISO 8601 (UTC)
5. **Perioade:** 
   - `daily` - Agregare zilnică (ultimele 30 de zile)
   - `weekly` - Agregare săptămânală (ultimele 12 săptămâni)
   - `monthly` - Agregare lunară (ultimele 6 luni)
6. **Growth:** Toate valorile de growth sunt procentaje (poate fi negativ)
7. **Privacy:** Nu se expun niciodată date personale sau identificatoare reale

---

**Ultima actualizare:** 2025-01-27  
**Versiune:** 1.0

