# Admin Content & SEO Governance - Documentație

## Prezentare generală

Modulul Content & SEO Governance oferă un dashboard operativ pentru monitorizarea statusului SEO și a calității conținutului pentru pagini statice și articole din Jurnal.

## Structură modul

### 1. Overview (`/content-seo`)

**Descriere:** Dashboard cu KPI-uri principale pentru status SEO.

**Funcționalități:**

#### KPI Cards (4 cards principale)
- **Pagini cu SEO OK:** X / totalPages (cu procentaj)
- **Pagini cu probleme:** Număr pagini cu issues
- **Articole jurnal OK:** X / totalArticles (cu procentaj)
- **Articole cu probleme:** Număr articole cu issues (cu CTR mediu dacă disponibil)

#### Rezumat
- Secțiune cu detalii pentru pagini și articole
- Procentaje și breakdown-uri

**Backend Endpoints:**
- `GET /admin/content-seo/overview` - Stats consolidate
- Fallback: Date statice demo cu `readOnly: true`

**Permisiuni:**
- `view_seo` sau `view_journal` / `manage_journal` / `view_system_status` / `view_financials`

---

### 2. Pagini & Meta (`/content-seo/pages`)

**Descriere:** Listă pagini cu status SEO și meta informații.

**Funcționalități:**

#### Filtre
- **Search:** După path sau title
- **Status:** Toate / OK / Warning / Missing / Stale

#### Tabel
- **Coloane:**
  - Path (ex: `/despre-noi`)
  - Title (trunchiat dacă > 50 caractere)
  - SEO Status (badge colorat)
  - Issues (primele 2 + count)
  - Last updated (data formatată)

#### Drawer detalii
- Path complet
- SEO Status cu badge
- Meta informații:
  - Title
  - Description
  - OG Image (link dacă există)
  - Canonical URL
  - Last Updated
- Listă issues cu explicații
- CTA: "Deschide pagina în site" (link extern)

**SEO Status badges:**
- `ok` → Verde, "OK"
- `warning` → Galben, "Poate fi îmbunătățit"
- `missing` → Roșu, "Lipsesc elemente critice"
- `stale` → Gri, "Nefăcut update de mult timp"

**Issue Explications (hardcodate în UI):**
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

**Backend Endpoints:**
- `GET /admin/content-seo/pages` - Listă pagini cu status SEO
- Fallback: Listă statică cu pagini importante (homepage, despre, cum-funcționează)

**Permisiuni:**
- `view_seo` sau `view_journal` / `manage_journal` / `view_system_status` / `view_financials`

---

### 3. Jurnal & Articole (`/content-seo/jurnal`)

**Descriere:** Status SEO pentru articole din Jurnal + performance metrics.

**Funcționalități:**

#### Filtre
- **Search:** După titlu sau producător
- **Status SEO:** Toate / OK / Warning / Missing / Stale

#### Tabel
- **Coloane:**
  - Titlu articol
  - Producător
  - SEO Status (badge)
  - Views (30 zile)
  - CTR (30 zile)
  - Publicat la

#### Drawer detalii
- Titlu + slug
- SEO Status
- Metrici (30 zile):
  - Views
  - Clicks
  - CTR
- Date:
  - Publicat la
  - Ultima actualizare
- Listă issues cu explicații
- Link-uri:
  - "Vezi articol în site" → `/jurnal-de-farmero/[slug]`
  - "Vezi producător în admin" → `/producers?search=...`
  - "Vezi articol în modul Jurnal" → `/jurnal?search=...`

**Backend Endpoints:**
- `GET /admin/content-seo/journal` - Listă articole cu status SEO
- Fallback: Compune din `/admin/journal/articles` + `/admin/journal/metrics`

**Permisiuni:**
- `view_seo` sau `view_journal` / `manage_journal` / `view_system_status` / `view_financials`

---

## Types & Structuri

### SeoStatus
```typescript
type SeoStatus = 'ok' | 'warning' | 'missing' | 'stale'
```

### SeoPageMeta
```typescript
interface SeoPageMeta {
  path: string
  title?: string | null
  description?: string | null
  ogImage?: string | null
  canonicalUrl?: string | null
  lastUpdatedAt?: string | null
  seoStatus: SeoStatus
  issues: string[]
  trafficScore?: number | null
}
```

### SeoArticleMeta
```typescript
interface SeoArticleMeta {
  id: string
  slug: string
  title: string
  producerName?: string | null
  publishedAt?: string | null
  lastUpdatedAt?: string | null
  seoStatus: SeoStatus
  issues: string[]
  views30d?: number | null
  clicks30d?: number | null
  ctr30d?: number | null
}
```

### ContentSeoOverview
```typescript
interface ContentSeoOverview {
  totalPages: number
  pagesOk: number
  pagesWithIssues: number
  stalePages: number
  totalArticles: number
  articlesOk: number
  articlesWithIssues: number
  avgJournalCtr30d?: number | null
}
```

---

## RBAC & Permisiuni

### Roluri cu acces

- **superadmin:** ✅ Acces complet
- **admin:** ✅ Acces complet
- **content:** ✅ Acces complet
- **marketing:** ✅ Acces complet
- **support:** ❌ Fără acces
- **finance:** ❌ Fără acces

### Permisiuni

- `view_seo` - Vizualizare dashboard SEO (nou)
- Alternativă pentru compatibilitate:
  - `view_journal`
  - `manage_journal`
  - `view_system_status`
  - `view_financials`

**Notă:** `view_seo` este un permission nou adăugat doar la nivel frontend (mapping în `permissions.ts`). Backend-ul poate să nu recunoască încă acest permission, dar UI-ul funcționează cu fallback-uri.

---

## Endpoint-uri backend necesare

### Overview

- `GET /admin/content-seo/overview`
  - **Status:** ❌ Neimplementat
  - **Descriere:** Stats consolidate pentru SEO overview
  - **Auth:** Necesită permisiune `view_seo` sau `view_journal`
  - **Response:**
    ```json
    {
      "totalPages": 20,
      "pagesOk": 12,
      "pagesWithIssues": 8,
      "stalePages": 3,
      "totalArticles": 100,
      "articlesOk": 70,
      "articlesWithIssues": 30,
      "avgJournalCtr30d": 3.5
    }
    ```
  - **Folosit în:** ✅ Pagina `/content-seo` - **INTEGRAT** (cu fallback static)

### Pages

- `GET /admin/content-seo/pages`
  - **Status:** ❌ Neimplementat
  - **Descriere:** Listă pagini cu status SEO
  - **Auth:** Necesită permisiune `view_seo` sau `view_journal`
  - **Query Params:**
    - `search` (optional): Căutare după path sau title
    - `status` (optional): `ok` | `warning` | `missing` | `stale`
  - **Response:**
    ```json
    [
      {
        "path": "/despre-noi",
        "title": "Despre Noi",
        "description": "Află mai multe despre Farmero",
        "ogImage": "https://...",
        "canonicalUrl": "https://farme.ro/despre-noi",
        "lastUpdatedAt": "2025-01-27T10:00:00Z",
        "seoStatus": "warning",
        "issues": ["missing_og_image"],
        "trafficScore": 65
      }
    ]
    ```
  - **Folosit în:** ✅ Pagina `/content-seo/pages` - **INTEGRAT** (cu fallback static)

### Journal Articles

- `GET /admin/content-seo/journal`
  - **Status:** ❌ Neimplementat
  - **Descriere:** Listă articole journal cu status SEO
  - **Auth:** Necesită permisiune `view_seo` sau `view_journal`
  - **Query Params:**
    - `search` (optional): Căutare după titlu sau producător
    - `status` (optional): `ok` | `warning` | `missing` | `stale`
  - **Response:**
    ```json
    [
      {
        "id": "uuid",
        "slug": "articol-exemplu",
        "title": "Titlu Articol",
        "producerName": "Ferma Popescu",
        "publishedAt": "2025-01-27T10:00:00Z",
        "lastUpdatedAt": "2025-01-27T10:00:00Z",
        "seoStatus": "ok",
        "issues": [],
        "views30d": 1500,
        "clicks30d": 75,
        "ctr30d": 5.0
      }
    ]
    ```
  - **Folosit în:** ✅ Pagina `/content-seo/jurnal` - **INTEGRAT** (cu fallback compus din journal APIs)

**Status:** Toate endpoint-urile sunt documentate în `ADMIN_BACKEND_GAPS.md` cu structuri de request/response sugerate.

---

## Fallback Behavior

### Când endpoint-urile lipsesc

1. **Overview:**
   - Dacă `GET /admin/content-seo/overview` lipsește → returnează date statice demo
   - Afișează badge "Read-only / backend incomplet"

2. **Pages:**
   - Dacă `GET /admin/content-seo/pages` lipsește → returnează listă statică cu pagini importante
   - Afișează mesaj: "Backend-ul nu expune încă un inventar complet de pagini"

3. **Journal:**
   - Dacă `GET /admin/content-seo/journal` lipsește:
     - Încearcă să compună din `/admin/journal/articles` + `/admin/journal/metrics`
     - Dacă și acestea lipsesc → empty state cu mesaj informativ

---

## Issue Explications

Explicațiile pentru issues sunt hardcodate în UI (în `content-seo.ts` ca `SEO_ISSUE_EXPLANATIONS`). Nu sunt returnate de backend, ci sunt mapate în frontend pentru a oferi mesaje prietenoase utilizatorului.

**Listă completă issues:**
- `missing_title`
- `missing_description`
- `missing_og_image`
- `title_too_short`
- `title_too_long`
- `description_too_short`
- `description_too_long`
- `stale_content`
- `missing_canonical`
- `no_traffic`

---

## Limitări actuale

1. **Doar vizualizare:**
   - Nu permite editare SEO direct din admin
   - Doar identificare issues și link-uri către pagini

2. **Fallback static:**
   - Overview și Pages folosesc date statice dacă backend lipsește
   - Journal încearcă să compună din API-uri existente

3. **Fără crawler:**
   - Nu face crawling automat
   - Depinde de backend pentru date

---

## Rezumat

### Pagini noi

- ✅ `/content-seo` - Overview cu KPI cards
- ✅ `/content-seo/pages` - Listă pagini cu status SEO
- ✅ `/content-seo/jurnal` - Listă articole cu status SEO + metrics

### Types noi

- `SeoStatus` - Status SEO (ok, warning, missing, stale)
- `SeoPageMeta` - Meta informații pentru pagini
- `SeoArticleMeta` - Meta informații pentru articole
- `ContentSeoOverview` - Stats consolidate

### API-uri noi

- `getContentSeoOverview()` - Stats overview
- `getSeoPages(params?)` - Listă pagini
- `getSeoArticles(params?)` - Listă articole

### Endpoint-uri backend

**Consumate (reuse):**
- ⚠️ `/admin/journal/articles` - Reuse pentru articole (dacă există)
- ⚠️ `/admin/journal/metrics` - Reuse pentru metrics (dacă există)

**TODO (documentate în ADMIN_BACKEND_GAPS.md):**
- `GET /admin/content-seo/overview`
- `GET /admin/content-seo/pages`
- `GET /admin/content-seo/journal`

### Protecție RBAC

- ✅ Secțiunea Content & SEO este protejată cu `view_seo`
- ✅ Alternativă: `view_journal` / `manage_journal` / `view_system_status` / `view_financials`
- ✅ Doar rolurile `superadmin`, `admin`, `content`, `marketing` au acces

### Status implementare

- ✅ UI complet implementat
- ✅ Fallback-uri graceful pentru endpoint-uri lipsă
- ✅ Reuse endpoint-uri existente (journal APIs) când posibil
- ✅ Issue explanations hardcodate în UI
- ⏳ Așteaptă implementarea endpoint-urilor backend principale

