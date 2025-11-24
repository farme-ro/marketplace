# Admin Marketing & Growth Dashboard - Documentație

## Prezentare generală

Modulul Marketing & Growth oferă un dashboard operativ pentru echipa Farmero, concentrându-se pe metrici de creștere, funnel-uri de conversie și performanța campaniilor.

## Structură modul

### 1. Overview (`/marketing`)

**Descriere:** Dashboard compact cu KPI-uri principale și zone de analiză.

**Funcționalități:**

#### KPI Cards (4 cards principale)
- **Producători activi:** Număr producători cu plan promo plătit activ
- **Clienți cu abonamente:** Număr clienți cu abonamente recurente active
- **Articole Jurnal:** Număr articole publicate în ultimele 30 zile
- **CTR Jurnal → Profil:** Click-through rate mediu (ultimele 30 zile)

#### Zone principale (2 coloane)

**A) Jurnal & Storytelling:**
- # articole noi (30 zile)
- CTR mediu Jurnal → profil producător
- Placeholder pentru producători cu articole (când backend va expune)

**B) Promo & Abonamente:**
- Distribuție planuri producători (Gratis, Promo, Premium)
- % producători pe plan promo
- Venit lunar estimat din planuri promo (dacă disponibil)

**Backend Endpoints:**
- `GET /admin/marketing/overview` - Stats consolidate
- Fallback: Compune din `/admin/journal/metrics` și `/admin/subscriptions` (dacă există)

**Permisiuni:**
- `view_marketing` sau `view_journal` / `view_subscriptions`

---

### 2. Funnels & Activare (`/marketing/funnels`)

**Descriere:** Funnel-uri de conversie pentru producători și clienți.

**Funcționalități:**

#### Funnel Producători
Steps:
1. Producători creați
2. Producători cu minim 1 produs
3. Producători cu minim 1 comandă
4. Producători cu plan promo activ

Pentru fiecare step:
- Count (număr)
- Conversion rate față de step anterior (%)
- Vizualizare cu bare orizontale (CSS, fără librării)

#### Funnel Clienți
Steps:
1. Clienți cu cont
2. Clienți care au plasat cel puțin 1 comandă
3. Clienți cu abonament activ
4. Clienți cu 2+ comenzi din abonament

**Filtre:**
- Selector perioadă: 30 zile / 90 zile

**Backend Endpoints:**
- `GET /admin/marketing/funnels?days=90` - Funnel data

**Permisiuni:**
- `view_marketing` sau `view_journal` / `view_subscriptions`

---

### 3. Campanii & Canale (`/marketing/campaigns`)

**Descriere:** Overview campanii: promovări producători, Jurnal, canale externe.

**Funcționalități:**

#### Tab 1: Promovări producători
- **Tabel:**
  - Producer name
  - Plan promo / tier
  - Perioadă activă (from–to)
  - Status: active, expired, upcoming
  - CTA: "Vezi producător" → link spre admin sau front

**Backend Endpoints:**
- `GET /admin/marketing/promoted-producers` - Listă producători promovați

#### Tab 2: Jurnal & conținut
- **Tabel:**
  - Article title
  - Producer
  - Views
  - Clicks
  - CTR

**Backend Endpoints:**
- Reuse `/admin/journal/metrics` sau
- `GET /admin/marketing/journal-top-articles?limit=20`

#### Tab 3: Canale externe (placeholder)
- Card cu text informativ
- Pregătit pentru viitor (newsletter, social media, etc.)

**Permisiuni:**
- `view_marketing` sau `view_journal` / `view_subscriptions`

---

## RBAC & Permisiuni

### Roluri cu acces

- **superadmin:** ✅ Acces complet
- **admin:** ✅ Acces complet
- **marketing:** ✅ Acces complet (nou rol)
- **content:** ✅ Vizualizare (dacă are `view_journal`)
- **support:** ❌ Fără acces
- **finance:** ❌ Fără acces

### Permisiuni

- `view_marketing` - Vizualizare dashboard marketing
- `manage_marketing` - Gestionare campanii (viitor)

**Notă:** Pentru compatibilitate, `view_journal` și `view_subscriptions` pot fi folosite ca alternativă pentru `view_marketing`.

---

## Endpoint-uri backend necesare

### Overview

- `GET /admin/marketing/overview`
  - **Status:** ❌ Neimplementat
  - **Descriere:** Stats consolidate pentru overview
  - **Auth:** Necesită permisiune `view_marketing`
  - **Response:**
    ```json
    {
      "activePromotedProducers": 42,
      "activeRecurringClients": 150,
      "newJournalArticles30d": 12,
      "journalProducerCtr30d": 3.5,
      "promoPlanMix": {
        "free": 200,
        "promo": 42,
        "premium": 8
      },
      "monthlyPromoRevenueEstimate": 4200.00
    }
    ```
  - **Folosit în:** ✅ Pagina `/marketing` - **INTEGRAT** (cu fallback)

### Funnels

- `GET /admin/marketing/funnels?days=90`
  - **Status:** ❌ Neimplementat
  - **Descriere:** Funnel data pentru producători și clienți
  - **Auth:** Necesită permisiune `view_marketing`
  - **Response:**
    ```json
    {
      "producers": [
        {
          "label": "Producători creați",
          "value": 1000,
          "conversionFromPrevious": null
        },
        {
          "label": "Producători cu minim 1 produs",
          "value": 800,
          "conversionFromPrevious": 80.0
        },
        {
          "label": "Producători cu minim 1 comandă",
          "value": 500,
          "conversionFromPrevious": 62.5
        },
        {
          "label": "Producători cu plan promo activ",
          "value": 42,
          "conversionFromPrevious": 8.4
        }
      ],
      "clients": [
        {
          "label": "Clienți cu cont",
          "value": 5000,
          "conversionFromPrevious": null
        },
        {
          "label": "Clienți cu cel puțin 1 comandă",
          "value": 3000,
          "conversionFromPrevious": 60.0
        },
        {
          "label": "Clienți cu abonament activ",
          "value": 150,
          "conversionFromPrevious": 5.0
        },
        {
          "label": "Clienți cu 2+ comenzi din abonament",
          "value": 80,
          "conversionFromPrevious": 53.3
        }
      ]
    }
    ```
  - **Folosit în:** ✅ Pagina `/marketing/funnels` - **INTEGRAT** (cu fallback)

### Promoted Producers

- `GET /admin/marketing/promoted-producers`
  - **Status:** ❌ Neimplementat
  - **Descriere:** Listă producători promovați
  - **Auth:** Necesită permisiune `view_marketing`
  - **Response:**
    ```json
    [
      {
        "id": "uuid",
        "producerId": "uuid",
        "producerName": "Ferma Popescu",
        "planName": "Premium",
        "tier": "premium",
        "status": "active",
        "activeFrom": "2025-01-01T00:00:00Z",
        "activeTo": "2025-02-01T00:00:00Z",
        "slug": "ferma-popescu"
      }
    ]
    ```
  - **Folosit în:** ✅ Tab "Promovări producători" - **INTEGRAT** (cu fallback)

### Journal Top Articles

- `GET /admin/marketing/journal-top-articles?limit=20`
  - **Status:** ⚠️ Poate reuse `/admin/journal/metrics`
  - **Descriere:** Top articole journal după performanță
  - **Auth:** Necesită permisiune `view_marketing` sau `view_journal`
  - **Response:**
    ```json
    [
      {
        "id": "uuid",
        "title": "Titlu articol",
        "producerName": "Ferma Popescu",
        "producerId": "uuid",
        "views": 1500,
        "clicks": 75,
        "ctr": 5.0
      }
    ]
    ```
  - **Folosit în:** ✅ Tab "Jurnal & conținut" - **INTEGRAT** (cu fallback)

**Status:** Toate endpoint-urile sunt documentate în `ADMIN_BACKEND_GAPS.md` cu structuri de request/response sugerate.

---

## Fallback Behavior

### Când endpoint-urile lipsesc

1. **Overview:**
   - Încearcă să compună din `/admin/journal/metrics` și `/admin/subscriptions`
   - Dacă și acestea lipsesc → returnează demo static cu `readOnly: true`
   - Afișează banner informativ

2. **Funnels:**
   - Dacă endpoint lipsește → afișează banner: "Funnel-urile nu sunt încă expuse de backend"

3. **Campaigns:**
   - **Promovări:** Dacă endpoint lipsește → empty state cu mesaj
   - **Journal:** Reuse `/admin/journal/metrics` dacă există, altfel empty state
   - **Canale externe:** Placeholder permanent

---

## UX Details

### Loading States
- Skeleton cards pentru KPI-uri
- Spinner + text "Încărcăm datele de marketing..." pentru tabele

### Error States
- Banner roșu cu mesaj clar
- Sugestie să verifice `/system/status`

### Responsive
- Tabele scrollable pe mobil
- Grid-uri responsive (1 coloană pe mobil, 2-4 pe desktop)

### Visualizations
- Fără librării de charts grele
- Bare orizontale simple cu CSS (width procentual)
- Numere în cards pentru KPI-uri

---

## Rezumat

### Pagini noi

- ✅ `/marketing` - Growth Overview
- ✅ `/marketing/funnels` - Funnels & Activare
- ✅ `/marketing/campaigns` - Campanii & Canale

### Endpoint-uri backend

**Consumate:**
- ⚠️ `/admin/journal/metrics` - Reuse dacă există (pentru journal performance)

**TODO (documentate în ADMIN_BACKEND_GAPS.md):**
- `GET /admin/marketing/overview`
- `GET /admin/marketing/funnels`
- `GET /admin/marketing/promoted-producers`
- `GET /admin/marketing/journal-top-articles` (opțional, dacă nu reuse journal-metrics)

### Protecție RBAC

- ✅ Secțiunea Marketing este protejată cu `view_marketing`
- ✅ Alternativ: `view_journal` / `view_subscriptions` pentru compatibilitate
- ✅ Doar rolurile `superadmin`, `admin`, `marketing` au acces complet

### Status implementare

- ✅ UI complet implementat
- ✅ Fallback-uri graceful pentru endpoint-uri lipsă
- ✅ Reuse endpoint-uri existente (journal-metrics) când posibil
- ⏳ Așteaptă implementarea endpoint-urilor backend principale

