# Journal Metrics API

**Data:** 2025-01-27  
**Scop:** Documentație pentru endpoint-urile de metrici Jurnal (admin only)

---

## 🔐 Autentificare

Toate endpoint-urile necesită:
- Autentificare (cookie `session`)
- Rol `ADMIN`

---

## 📊 Endpoint-uri

### 1. GET /admin/journal/metrics/summary

**Descriere:** Obține metrici sumar pentru toate articolele publicate

**Query Parameters:**
- `days` (optional, default: 30) - Număr de zile înapoi pentru agregare

**Response:**
```json
{
  "totalPublished": 15,
  "totalViews": 1250,
  "totalClicks": 89,
  "ctr": 7.12
}
```

**Exemplu:**
```bash
curl -X GET "http://localhost:3001/admin/journal/metrics/summary?days=30" \
  -H "Cookie: session=<token>"
```

---

### 2. GET /admin/journal/metrics/top-articles

**Descriere:** Obține top N articole după views

**Query Parameters:**
- `limit` (optional, default: 10) - Număr de articole
- `days` (optional) - Filtru după zile (dacă nu e setat, toate articolele)

**Response:**
```json
{
  "data": [
    {
      "articleId": "uuid",
      "title": "Povestea mierii din Maramureș",
      "slug": "povestea-mierii-din-maramures",
      "producerId": "uuid",
      "producerName": "Ferma Popescu",
      "views": 250,
      "uniqueViews": 180,
      "clicksToProducer": 15,
      "clicksToProducts": 8,
      "totalClicks": 23,
      "ctr": 9.2,
      "publishedAt": "2025-01-15T10:00:00Z",
      "createdAt": "2025-01-10T10:00:00Z"
    }
  ]
}
```

**Exemplu:**
```bash
curl -X GET "http://localhost:3001/admin/journal/metrics/top-articles?limit=10&days=30" \
  -H "Cookie: session=<token>"
```

---

### 3. GET /admin/journal/metrics/top-producers

**Descriere:** Obține top N producători după metrici agregate (views + clicks)

**Query Parameters:**
- `limit` (optional, default: 10) - Număr de producători
- `days` (optional) - Filtru după zile

**Response:**
```json
{
  "data": [
    {
      "producerId": "uuid",
      "producerName": "Ferma Popescu",
      "articleCount": 3,
      "totalViews": 450,
      "totalClicks": 35,
      "ctr": 7.78
    }
  ]
}
```

**Exemplu:**
```bash
curl -X GET "http://localhost:3001/admin/journal/metrics/top-producers?limit=10&days=30" \
  -H "Cookie: session=<token>"
```

---

### 4. GET /admin/journal/metrics/timeseries

**Descriere:** Obține serie temporală views pe zi

**Query Parameters:**
- `days` (optional, default: 30) - Număr de zile (7, 30, 90)

**Response:**
```json
{
  "data": [
    {
      "date": "2025-01-27",
      "views": 45
    },
    {
      "date": "2025-01-26",
      "views": 38
    }
  ]
}
```

**Exemplu:**
```bash
curl -X GET "http://localhost:3001/admin/journal/metrics/timeseries?days=30" \
  -H "Cookie: session=<token>"
```

---

## 📝 Note

### Limitări

1. **Time Series:**
   - Time series-ul folosește `updatedAt` ca proxy pentru activitate
   - În producție, ar trebui să existe un tabel de evenimente cu timestamp-uri individuale
   - Pentru moment, distribuim views-urile pe baza `updatedAt` al articolului

2. **Agregări:**
   - Agregările se fac în timp real din `JournalArticleMetrics`
   - Nu există cache, deci pot fi lente pentru volume mari de date

3. **CTR (Click-Through Rate):**
   - Calculat ca: `(totalClicks / totalViews) * 100`
   - Include atât click-uri către producător, cât și către produse

### Îmbunătățiri Viitoare

1. **Event Tracking Granular:**
   - Tabel `JournalEvent` cu timestamp-uri individuale
   - Tracking mai precis pentru time series

2. **Cache:**
   - Cache pentru agregări (Redis sau similar)
   - Refresh periodic (ex: la fiecare 5 minute)

3. **Filtre Avansate:**
   - Filtru după producător
   - Filtru după interval de timp custom
   - Filtru după tip eveniment (view, click_producer, click_product)

---

## 🐛 Error Handling

- **401 Unauthorized** - Nu ești autentificat
- **403 Forbidden** - Nu ai rol ADMIN
- **400 Bad Request** - Parametri invalizi
- **500 Internal Server Error** - Eroare server

---

## 📚 Referințe

- **Backend Service:** `backend/src/modules/journal/journal-metrics.service.ts`
- **Backend Routes:** `backend/src/modules/journal/journal-metrics.routes.ts`
- **Model Prisma:** `JournalArticleMetrics`

