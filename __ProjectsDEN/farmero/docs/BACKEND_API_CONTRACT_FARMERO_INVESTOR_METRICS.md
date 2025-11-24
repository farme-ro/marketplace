# Backend API Contract - Farmero Investor Metrics

## Overview

Acest document descrie contractul API pentru endpoint-ul de metrici investitori. Toate datele returnate sunt **agregate și anonimizate** - nu conțin informații personale identificabile (PII).

## Endpoint

### GET /investor/metrics

Returnează metrici agregate și anonimizate pentru dashboard-ul investitorilor.

**URL:** `https://api.farme.ro/investor/metrics`

**Method:** `GET`

**Authentication:** Required (cookie-based, `credentials: 'include'`)

**Roles Required:** `investor` sau `admin`

---

## Request

### Headers

```
Cookie: session=...
```

### Query Parameters

Niciun parametru query necesar pentru moment. (Viitor: `?period=last_30_days` pentru filtrare perioadă)

---

## Response

### Success Response (200 OK)

**Content-Type:** `application/json`

**Body:**

```typescript
{
  snapshot: {
    timestamp: "2025-01-27T10:00:00Z",
    totalOrders: 12500,
    totalGrossMerchandiseVolume: 2500000.00,
    totalFarmeroFeesCollected: 375000.00,
    totalProducersActive: 520,
    totalClientsActive: 8500,
    totalBusinessClientsActive: 120,
    totalRegionsActive: 42
  },
  growth: {
    periodLabel: "Ultimele 30 de zile",
    newClients: 450,
    returningClients: 8050,
    newProducers: 35,
    averageOrderValue: 200.00,
    repeatOrderRate: 0.65
  },
  kpiSeries: {
    ordersOverTime: {
      id: "orders",
      label: "Comenzi în timp",
      points: [
        { date: "2025-01-01", value: 120 },
        { date: "2025-01-02", value: 135 },
        { date: "2025-01-03", value: 142 },
        // ... more points
      ]
    },
    gmvOverTime: {
      id: "gmv",
      label: "GMV în timp",
      points: [
        { date: "2025-01-01", value: 24000.00 },
        { date: "2025-01-02", value: 27000.00 },
        // ... more points
      ]
    },
    feesOverTime: {
      id: "fees",
      label: "Comisioane în timp",
      points: [
        { date: "2025-01-01", value: 3600.00 },
        { date: "2025-01-02", value: 4050.00 },
        // ... more points
      ]
    }
  },
  segments: [
    {
      segmentLabel: "Clienți noi",
      ordersCount: 1800,
      gmv: 360000.00,
      fees: 54000.00
    },
    {
      segmentLabel: "Clienți recurenți",
      ordersCount: 10700,
      gmv: 2140000.00,
      fees: 321000.00
    },
    {
      segmentLabel: "Abonați",
      ordersCount: 3200,
      gmv: 640000.00,
      fees: 96000.00
    },
    {
      segmentLabel: "Business clients",
      ordersCount: 1800,
      gmv: 450000.00,
      fees: 67500.00
    }
  ],
  regions: [
    {
      regionName: "Regiunea 1",
      ordersCount: 3200,
      gmv: 640000.00,
      producersCount: 85
    },
    {
      regionName: "Regiunea 2",
      ordersCount: 2800,
      gmv: 560000.00,
      producersCount: 72
    }
    // ... more regions
  ]
}
```

### Error Responses

#### 401 Unauthorized

```json
{
  "error": "Unauthorized",
  "message": "Trebuie să fii autentificat pentru a accesa acest dashboard."
}
```

#### 403 Forbidden

```json
{
  "error": "Forbidden",
  "message": "Nu ai acces la acest dashboard. Verifică permisiunile contului tău."
}
```

#### 500 Internal Server Error

```json
{
  "error": "Internal Server Error",
  "message": "A apărut o problemă la încărcarea datelor. Încearcă din nou mai târziu."
}
```

---

## Data Anonymization Rules

### ✅ Allowed Data

- **Aggregated counts:** Total orders, total users, total producers
- **Aggregated financials:** Total GMV, total fees (no individual transactions)
- **Time series:** Daily/weekly/monthly aggregates (no timestamps with user-level data)
- **Segments:** Client segments (new, returning, subscribers) - counts and totals only
- **Regions:** Regional breakdowns with anonymized region names (e.g., "Regiunea 1", not "București")
- **Growth metrics:** Percentage changes and averages (no individual user data)

### ❌ Forbidden Data

- **Personal identifiers:** Names, emails, phone numbers, user IDs
- **Individual transactions:** Single order details, individual user purchases
- **Producer details:** Producer names, addresses, contact info
- **Client details:** Client names, addresses, purchase history
- **Geographic precision:** Exact locations, addresses, coordinates
- **Timestamps with user context:** "User X ordered at time Y"

---

## Granularity

Backend-ul decide granularitatea datelor returnate:

- **Daily:** Puncte zilnice pentru ultimele 30-90 de zile
- **Weekly:** Puncte săptămânale pentru ultimele 12-24 săptămâni
- **Monthly:** Puncte lunare pentru ultimele 12-24 luni

Recomandare: Începe cu granularitate zilnică pentru ultimele 30 de zile, apoi extinde pe măsură ce platforma crește.

---

## Business Notes

1. **Anonymization:** Toate datele trebuie să fie agregate la nivel de platformă, segment sau regiune. Niciodată date la nivel de utilizator individual.

2. **Region Names:** Folosește nume generice pentru regiuni (ex: "Regiunea 1", "Regiunea 2") sau hash-uri, nu nume reale de județe/orase.

3. **Segment Labels:** Folosește etichete generice pentru segmente (ex: "Clienți noi", "Clienți recurenți", "Abonați", "Business clients").

4. **Time Series:** Punctele de timp trebuie să fie consistente (toate zilnic, toate săptămânal, sau toate lunar) pentru a permite compararea corectă.

5. **Performance:** Endpoint-ul ar trebui să fie optimizat pentru query-uri rapide (cache, materialized views, etc.) deoarece datele sunt agregate.

---

## Example Implementation (Backend)

```typescript
// Pseudo-code pentru backend
async function getInvestorMetrics(user: User): Promise<FarmeroInvestorMetrics> {
  // Verify role
  if (!user.roles.includes('investor') && !user.roles.includes('admin')) {
    throw new ForbiddenError()
  }

  // Get aggregated snapshot
  const snapshot = await db.query(`
    SELECT 
      COUNT(DISTINCT orders.id) as total_orders,
      SUM(orders.total) as total_gmv,
      SUM(orders.farmero_fee) as total_fees,
      COUNT(DISTINCT producers.id) as total_producers,
      COUNT(DISTINCT clients.id) as total_clients,
      COUNT(DISTINCT business_clients.id) as total_business_clients,
      COUNT(DISTINCT regions.id) as total_regions
    FROM orders
    LEFT JOIN producers ON orders.producer_id = producers.id
    LEFT JOIN clients ON orders.client_id = clients.id
    LEFT JOIN business_clients ON orders.business_client_id = business_clients.id
    LEFT JOIN regions ON producers.region_id = regions.id
    WHERE orders.created_at >= NOW() - INTERVAL '30 days'
  `)

  // Get growth metrics
  const growth = await calculateGrowthMetrics('last_30_days')

  // Get time series
  const ordersSeries = await getTimeSeries('orders', 'daily', 30)
  const gmvSeries = await getTimeSeries('gmv', 'daily', 30)
  const feesSeries = await getTimeSeries('fees', 'daily', 30)

  // Get segment breakdown
  const segments = await getSegmentBreakdown()

  // Get region breakdown (anonymized)
  const regions = await getRegionBreakdown()

  return {
    snapshot: {
      timestamp: new Date().toISOString(),
      totalOrders: snapshot.total_orders,
      totalGrossMerchandiseVolume: snapshot.total_gmv,
      totalFarmeroFeesCollected: snapshot.total_fees,
      totalProducersActive: snapshot.total_producers,
      totalClientsActive: snapshot.total_clients,
      totalBusinessClientsActive: snapshot.total_business_clients,
      totalRegionsActive: snapshot.total_regions,
    },
    growth,
    kpiSeries: {
      ordersOverTime: ordersSeries,
      gmvOverTime: gmvSeries,
      feesOverTime: feesSeries,
    },
    segments,
    regions,
  }
}
```

---

**Ultima actualizare:** 2025-01-27  
**Versiune:** 1.0

