# Content & SEO Governance - Rezumat Implementare

## Pagini noi

1. **`/content-seo`** - Overview
   - 4 KPI cards (pagini OK, pagini cu probleme, articole OK, articole cu probleme)
   - Rezumat cu breakdown-uri
   - Fallback: Date statice demo cu `readOnly: true`

2. **`/content-seo/pages`** - Pagini & Meta
   - Tabel cu pagini și status SEO
   - Filtre (search, status)
   - Drawer cu detalii complete (meta, issues, explicații)
   - Fallback: Listă statică cu pagini importante

3. **`/content-seo/jurnal`** - Jurnal & Articole
   - Tabel cu articole și status SEO
   - Metrici (views, clicks, CTR - 30 zile)
   - Filtre (search, status)
   - Drawer cu detalii complete
   - Fallback: Compune din journal APIs existente

## Types noi

### Fișier: `admin/src/lib/api/content-seo.ts`

**Types:**
- `SeoStatus` - 'ok' | 'warning' | 'missing' | 'stale'
- `SeoPageMeta` - Meta informații pentru pagini
- `SeoArticleMeta` - Meta informații pentru articole
- `ContentSeoOverview` - Stats consolidate
- `ContentSeoOverviewResponse` - Response cu flag `readOnly`

**Constante:**
- `SEO_ISSUE_EXPLANATIONS` - Map cu explicații pentru fiecare issue code

## API-uri noi

### Fișier: `admin/src/lib/api/content-seo.ts`

**Funcții:**
- `getContentSeoOverview()` - Stats consolidate
- `getSeoPages(params?)` - Listă pagini cu status SEO
- `getSeoArticles(params?)` - Listă articole cu status SEO

**Fallback Logic:**
- Overview: Date statice demo
- Pages: Listă statică cu pagini importante
- Articles: Compune din `/admin/journal/articles` + `/admin/journal/metrics` (dacă există)

## Endpoint-uri backend necesare

### Implementate (reuse)
- ⚠️ `/admin/journal/articles` - Reuse pentru articole (dacă există)
- ⚠️ `/admin/journal/metrics` - Reuse pentru metrics (dacă există)

### TODO (documentate în `admin/docs/ADMIN_BACKEND_GAPS.md`)

1. **`GET /admin/content-seo/overview`**
   - Stats consolidate pentru overview
   - Fallback: Date statice demo

2. **`GET /admin/content-seo/pages`**
   - Listă pagini cu status SEO
   - Fallback: Listă statică cu pagini importante

3. **`GET /admin/content-seo/journal`**
   - Listă articole cu status SEO
   - Fallback: Compune din journal APIs sau empty state

## RBAC

### Permission nou
- **`view_seo`** - Permission nou adăugat în `permissions.ts`
  - Mapat la rolurile: `superadmin`, `admin`, `content`, `marketing`

### Roluri cu acces
- `superadmin` ✅
- `admin` ✅
- `content` ✅
- `marketing` ✅
- `support` ❌
- `finance` ❌

### Permisiuni alternative
Pentru compatibilitate, următoarele permisiuni pot fi folosite ca alternativă:
- `view_journal`
- `manage_journal`
- `view_system_status`
- `view_financials`

## Fallback Behavior

### Overview
- Dacă endpoint lipsește → date statice demo
- Badge "Read-only / backend incomplet"

### Pages
- Dacă endpoint lipsește → listă statică cu pagini importante (homepage, despre, cum-funcționează)
- Mesaj: "Backend-ul nu expune încă un inventar complet de pagini"

### Journal
- Dacă endpoint lipsește → compune din `/admin/journal/articles` + `/admin/journal/metrics`
- Dacă și acestea lipsesc → empty state cu mesaj informativ

## Issue Explications

Explicațiile pentru issues sunt hardcodate în UI (`SEO_ISSUE_EXPLANATIONS` în `content-seo.ts`):

- `missing_title` → "Pagina nu are titlu SEO configurat."
- `missing_description` → "Pagina nu are meta description."
- `missing_og_image` → "Lipsă imagine pentru sharing social."
- `title_too_short` → "Titlul SEO este prea scurt (recomandat: 50-60 caractere)."
- `title_too_long` → "Titlul SEO este prea lung (recomandat: 50-60 caractere)."
- `description_too_short` → "Meta description este prea scurtă (recomandat: 120-160 caractere)."
- `description_too_long` → "Meta description este prea lungă (recomandat: 120-160 caractere)."
- `stale_content` → "Conținutul nu a fost actualizat de peste 6 luni."
- `missing_canonical` → "Lipsă URL canonic (poate cauza duplicate content)."
- `no_traffic` → "Pagina nu primește trafic (posibil să necesite optimizare SEO)."

## UX Features

- ✅ Loading states (skeleton cards)
- ✅ Error states (banner-uri clare)
- ✅ Responsive design
- ✅ Drawer-uri cu detalii complete
- ✅ Link-uri către frontend și alte secțiuni admin
- ✅ Issue explanations prietenoase

## Documentație

- ✅ `admin/docs/ADMIN_CONTENT_SEO_GOVERNANCE.md` - Documentație completă
- ✅ `admin/docs/ADMIN_BACKEND_GAPS.md` - Actualizat cu endpoint-uri noi
- ✅ `admin/CONTENT_SEO_IMPLEMENTATION_SUMMARY.md` - Acest rezumat

## Status Final

- ✅ UI complet implementat
- ✅ Fallback-uri graceful pentru toate endpoint-urile
- ✅ Reuse endpoint-uri existente (journal APIs) când posibil
- ✅ Issue explanations hardcodate în UI
- ✅ RBAC complet implementat
- ⏳ Așteaptă implementarea endpoint-urilor backend principale

## Limitări

1. **Doar vizualizare:**
   - Nu permite editare SEO direct din admin
   - Doar identificare issues și link-uri către pagini

2. **Fără crawler:**
   - Nu face crawling automat
   - Depinde de backend pentru date

3. **Fallback static:**
   - Overview și Pages folosesc date statice dacă backend lipsește
   - Journal încearcă să compună din API-uri existente

