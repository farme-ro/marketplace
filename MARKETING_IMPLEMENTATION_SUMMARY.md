# Marketing & Growth Dashboard - Rezumat Implementare

## Pagini noi

1. **`/marketing`** - Growth Overview
   - 4 KPI cards (producători activi, clienți abonați, articole jurnal, CTR)
   - 2 zone principale: Jurnal & Storytelling, Promo & Abonamente
   - Fallback: Compune din endpoint-uri parțiale sau demo static

2. **`/marketing/funnels`** - Funnels & Activare
   - Funnel producători (4 steps cu conversion rates)
   - Funnel clienți (4 steps cu conversion rates)
   - Selector perioadă (30/90 zile)
   - Vizualizare cu bare orizontale (CSS)

3. **`/marketing/campaigns`** - Campanii & Canale
   - Tab 1: Promovări producători (tabel cu planuri, status, perioadă)
   - Tab 2: Jurnal & conținut (top articole cu views/clicks/CTR)
   - Tab 3: Canale externe (placeholder pentru viitor)

## API-uri noi

### Fișier: `admin/src/lib/api/marketing-growth.ts`

**Funcții:**
- `getMarketingOverview()` - Stats consolidate
- `getMarketingFunnels(params?)` - Funnel data
- `getPromotedProducers()` - Listă producători promovați
- `getJournalTopArticles(limit?)` - Top articole journal

**Types:**
- `MarketingOverviewStats`
- `MarketingOverviewResponse`
- `MarketingFunnelStep`
- `MarketingFunnels`
- `PromotedProducer`
- `JournalArticlePerformance`

## Endpoint-uri backend necesare

### Implementate (reuse)
- ⚠️ `/admin/journal/metrics` - Reuse pentru journal performance (dacă există)

### TODO (documentate în `admin/docs/ADMIN_BACKEND_GAPS.md`)

1. **`GET /admin/marketing/overview`**
   - Stats consolidate pentru overview
   - Fallback: Compune din journal-metrics + subscriptions

2. **`GET /admin/marketing/funnels?days=90`**
   - Funnel data pentru producători și clienți
   - Fallback: Banner informativ

3. **`GET /admin/marketing/promoted-producers`**
   - Listă producători promovați
   - Fallback: Empty state

4. **`GET /admin/marketing/journal-top-articles?limit=20`**
   - Top articole journal (opțional, dacă nu reuse journal-metrics)
   - Fallback: Reuse journal-metrics sau empty state

## RBAC

### Rol nou
- **`marketing`** - Rol nou adăugat în `permissions.ts`
  - Permisiuni: `view_marketing`, `manage_marketing`
  - Acces la toate paginile marketing

### Roluri cu acces
- `superadmin` ✅
- `admin` ✅
- `marketing` ✅ (nou)
- `content` ✅ (dacă are `view_journal`)

### Permisiuni
- `view_marketing` - Vizualizare dashboard
- `manage_marketing` - Gestionare campanii (viitor)

**Compatibilitate:** `view_journal` și `view_subscriptions` pot fi folosite ca alternativă pentru `view_marketing`.

## Fallback Behavior

### Overview
- Încearcă `GET /admin/marketing/overview`
- Dacă lipsește → compune din `/admin/journal/metrics` + `/admin/subscriptions`
- Dacă și acestea lipsesc → demo static cu `readOnly: true`

### Funnels
- Dacă endpoint lipsește → banner: "Funnel-urile nu sunt încă expuse de backend"

### Campaigns
- **Promovări:** Empty state dacă endpoint lipsește
- **Journal:** Reuse journal-metrics dacă există
- **Canale externe:** Placeholder permanent

## UX Features

- ✅ Loading states (skeleton cards, spinners)
- ✅ Error states (banner-uri clare)
- ✅ Responsive design (tabele scrollable pe mobil)
- ✅ Vizualizări simple (bare CSS, fără librării grele)
- ✅ Empty states informative

## Documentație

- ✅ `admin/docs/ADMIN_MARKETING_GROWTH_DASHBOARD.md` - Documentație completă
- ✅ `admin/docs/ADMIN_BACKEND_GAPS.md` - Actualizat cu endpoint-uri noi
- ✅ `admin/MARKETING_IMPLEMENTATION_SUMMARY.md` - Acest rezumat

## Status Final

- ✅ UI complet implementat
- ✅ Fallback-uri graceful pentru toate endpoint-urile
- ✅ Reuse endpoint-uri existente când posibil
- ✅ RBAC complet implementat
- ⏳ Așteaptă implementarea endpoint-urilor backend principale

