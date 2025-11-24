# Journal Metrics Dashboard - Documentation

**Data:** 2025-01-27  
**Scop:** Documentație pentru dashboard-ul de metrici Jurnal

---

## 📊 Ce Metrici Calculăm

### KPI Cards

1. **Articole publicate**
   - Număr total de articole cu status `published`
   - Nu include filtre de timp

2. **Views (30d)**
   - Suma views-urilor pentru toate articolele publicate
   - Filtru: ultimele N zile (7, 30, 90)

3. **Clicks (30d)**
   - Suma click-urilor (producător + produse)
   - Filtru: ultimele N zile

4. **CTR (Click-Through Rate)**
   - Calculat ca: `(totalClicks / totalViews) * 100`
   - Indicator de engagement

### Top Articole

- Sortate după views (descrescător)
- Afișează:
  - Titlu
  - Producător
  - Views, Clicks, CTR
  - Dată publicare

### Top Producători

- Agregare după producător
- Sortate după total views (descrescător)
- Afișează:
  - Nume producător
  - Număr articole
  - Views totale, Clicks totale, CTR

### Time Series (Views pe zi)

- Grafic linii cu views pe zi
- Interval: ultimele 7/30/90 zile
- Vizualizare evoluție în timp

---

## ⚠️ Limitări

### 1. Time Series Simplificat

**Problema:**
- Time series-ul folosește `updatedAt` al articolului ca proxy pentru activitate
- Nu avem tracking granular cu timestamp-uri individuale pentru fiecare view

**Impact:**
- Graficul arată distribuția views-urilor pe baza `updatedAt`, nu pe baza momentului real al view-ului
- Pentru tracking precis, ar trebui un tabel `JournalEvent` cu timestamp-uri

**Soluție viitoare:**
- Implementare event tracking granular
- Tabel `JournalEvent` cu `articleId`, `type`, `timestamp`
- Agregare reală pe zi

### 2. Agregări în Timp Real

**Problema:**
- Agregările se fac direct din `JournalArticleMetrics` la fiecare request
- Nu există cache

**Impact:**
- Pentru volume mari de date, request-urile pot fi lente
- Fiecare refresh al dashboard-ului recalculează totul

**Soluție viitoare:**
- Cache Redis sau similar
- Refresh periodic (ex: la fiecare 5 minute)
- Background job pentru pre-agregare

### 3. Filtre Limitare

**Problema:**
- Filtre disponibile: doar interval de timp (7d, 30d, 90d)
- Nu există filtre pentru:
  - Producător specific
  - Tip eveniment (view vs click_producer vs click_product)
  - Interval custom

**Soluție viitoare:**
- Filtru după producător
- Filtru după tip eveniment
- Date picker pentru interval custom

---

## 🎯 Cum Folosim Dashboard-ul pentru Business Decisions

### 1. Identificare Articole Performante

**Ce căutăm:**
- Articole cu views mari
- Articole cu CTR ridicat (>5%)

**Acțiune:**
- Analizăm ce tip de conținut funcționează
- Replicăm formatul pentru articole viitoare
- Promovăm articolele performante

### 2. Identificare Producători Performanți

**Ce căutăm:**
- Producători cu views mari
- Producători cu CTR ridicat

**Acțiune:**
- Colaborăm cu producătorii performanți pentru mai multe articole
- Analizăm ce le face special (format, conținut, promovare)
- Folosim ca case study pentru alți producători

### 3. Optimizare Conținut

**Ce căutăm:**
- Articole cu views mari dar CTR scăzut
- Articole cu CTR ridicat dar views scăzute

**Acțiune:**
- Pentru views mari + CTR scăzut: optimizăm CTA-urile
- Pentru CTR ridicat + views scăzute: promovăm mai mult articolul

### 4. Tracking Evoluție

**Ce căutăm:**
- Trend-uri în time series
- Creșteri/scăderi în views

**Acțiune:**
- Identificăm perioade de vârf
- Planificăm publicări în perioadele cu trafic mare
- Analizăm impactul campaniilor de promovare

---

## 📈 Metrici Recomandate pentru Viitor

### 1. Engagement Metrics

- **Timp mediu de citire** (avgReadTimeSec)
- **Bounce rate** (dacă utilizatorul pleacă imediat)
- **Scroll depth** (cât din articol este citit)

### 2. Conversion Metrics

- **Click-to-producer rate** (cât % din views duc la click pe producător)
- **Click-to-product rate** (cât % din views duc la click pe produse)
- **Producer page views** (după click din jurnal)

### 3. Content Performance

- **Views per articol** (media)
- **CTR per tip de conținut** (poveste vs tutorial vs interviu)
- **Seasonal trends** (ce funcționează în fiecare sezon)

---

## 🔧 Configurare

### Backend

Endpoint-urile sunt montate în `backend/src/index.ts`:
```typescript
app.use('/admin/journal/metrics', journalMetricsRoutes);
```

### Frontend

Pagina dashboard-ului este disponibilă la:
- `/jurnal/metrics` (în admin app)

### Acces

- Necesită autentificare
- Necesită rol `ADMIN`

---

## 📚 Referințe

- **Backend API:** `backend/docs/JOURNAL_METRICS_API.md`
- **Backend Service:** `backend/src/modules/journal/journal-metrics.service.ts`
- **Backend Routes:** `backend/src/modules/journal/journal-metrics.routes.ts`
- **Frontend API:** `admin/src/lib/api/journal-metrics.ts`
- **Frontend Page:** `admin/src/app/(admin)/jurnal/metrics/page.tsx`

---

## 🐛 Troubleshooting

### Problema: Dashboard-ul nu se încarcă

**Cauză:** Endpoint-urile nu răspund sau returnează eroare

**Soluție:**
1. Verifică că backend-ul rulează
2. Verifică că ești autentificat cu rol ADMIN
3. Verifică logs-urile backend pentru erori

### Problema: Time series-ul este gol

**Cauză:** Nu există articole publicate sau nu există views

**Soluție:**
1. Verifică că există articole cu status `published`
2. Verifică că există views în `JournalArticleMetrics`
3. Verifică că filtrele de timp sunt corecte

### Problema: Metricile nu se actualizează

**Cauză:** Agregările se fac în timp real, dar pot fi lente

**Soluție:**
1. Așteaptă câteva secunde pentru recalculare
2. Refresh pagina
3. Pentru volume mari, consideră implementarea cache-ului

---

## ✅ Empty States

Dashboard-ul gestionează elegant cazurile fără date:

1. **Nu există articole publicate:**
   - KPI cards arată 0
   - Top articole/producători: mesaj "Nu există articole pentru această perioadă"
   - Time series: mesaj "Nu există date pentru această perioadă"

2. **Nu există views:**
   - Views/Clicks/CTR arată 0
   - Time series: linie plată la 0
   - Top articole/producători: lista goală cu mesaj

3. **Nu există date pentru perioada selectată:**
   - Toate metricile se recalculează pentru noua perioadă
   - Empty states apar dacă nu există date

