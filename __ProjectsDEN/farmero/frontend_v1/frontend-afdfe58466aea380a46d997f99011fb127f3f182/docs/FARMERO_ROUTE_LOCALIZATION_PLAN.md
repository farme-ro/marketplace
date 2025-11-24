# Plan de Localizare Rute - Farmero

**Data:** 2025-01-27  
**Scop:** Migrare rute publice din engleză în română, păstrând API-urile tehnice în engleză  
**Status:** 🚧 În progres

---

## 📋 Rezumat Executiv

Acest document descrie migrarea tuturor rutelor publice din engleză în română, menținând compatibilitatea SEO prin redirect-uri permanente (308) și păstrând toate API-urile tehnice în engleză.

**Principii:**
- ✅ Rutele publice (slugs) → română
- ✅ API REST paths → engleză (neschimbate)
- ✅ Redirect-uri 308 pentru SEO
- ✅ Type-safe routes în frontend

---

## 🗺️ Tabel Complet de Mapping

### Rute Publice - Marketplace

| VECHI | NOU | Tip | Status |
|-------|-----|-----|--------|
| `/products` | `/produse` | Listă produse | ✅ |
| `/products/[slug]` | `/produse/[slug]` | Detalii produs | ✅ |
| `/producers` | `/producatori` | Listă producători | ✅ |
| `/producers/[slug]` | `/producatori/[slug]` | Detalii producător | ✅ |
| `/about` | `/despre-noi` | Despre noi | ✅ |
| `/fees` | `/comisioane-taxe` | Comisioane & taxe | ✅ |
| `/faq` | `/intrebari-frecvente` | FAQ | ✅ |

### Rute Portaluri

| VECHI | NOU | Tip | Status |
|-------|-----|-----|--------|
| `/producer-portal` | `/portal-producatori` | Portal producători | ✅ |
| `/producer-portal/*` | `/portal-producatori/*` | Sub-rute portal | ✅ |
| `/business-portal` | `/portal-business` | Portal business | ✅ |
| `/business-portal/*` | `/portal-business/*` | Sub-rute portal | ✅ |
| `/logistics-portal` | `/portal-logistica` | Portal logistică | ✅ |
| `/logistics-portal/*` | `/portal-logistica/*` | Sub-rute portal | ✅ |
| `/investor-portal` | `/portal-investitori` | Portal investitori | ✅ |
| `/investor-portal/*` | `/portal-investitori/*` | Sub-rute portal | ✅ |
| `/importer-portal` | `/portal-importatori` | Portal importatori | ✅ |
| `/importer-portal/*` | `/portal-importatori/*` | Sub-rute portal | ✅ |

### Rute Care Rămân Neschimbate

| Rută | Motiv | Status |
|------|-------|--------|
| `/` | Homepage | ✅ |
| `/login` | Standard | ✅ |
| `/register` | Standard | ✅ |
| `/cart` | Standard | ✅ |
| `/checkout` | Standard | ✅ |
| `/orders` | Standard | ✅ |
| `/account` | Standard | ✅ |
| `/contact` | Standard | ✅ |
| `/cum-functioneaza-si-impact` | Deja în română | ✅ |
| `/pentru-producatori` | Deja în română | ✅ |
| `/pentru-logistica` | Deja în română | ✅ |
| `/pentru-investitori` | Deja în română | ✅ |
| `/pentru-importatori` | Deja în română | ✅ |
| `/b2b` | Acronim standard | ✅ |
| `/sustine-farmero` | Deja în română | ✅ |
| `/terms` | Standard legal | ✅ |
| `/privacy` | Standard legal | ✅ |
| `/cookies` | Standard legal | ✅ |
| `/gdpr` | Acronim standard | ✅ |
| `/anpc` | Acronim standard | ✅ |

---

## 🔧 Implementare

### Pasul 1: Fișier Centralizat Routes

**Fișier:** `src/lib/routes.ts`

Centralizează toate rutele într-un singur loc type-safe.

### Pasul 2: Mutarea Paginilor

Redenumește folderele din `src/app/(site)/`:
- `products/` → `produse/`
- `producers/` → `producatori/`
- `producer-portal/` → `portal-producatori/`
- `business-portal/` → `portal-business/`
- `logistics-portal/` → `portal-logistica/`
- `investor-portal/` → `portal-investitori/`
- `importer-portal/` → `portal-importatori/`
- `about/` → `despre-noi/`
- `fees/` → `comisioane-taxe/`
- `faq/` → `intrebari-frecvente/`

### Pasul 3: Redirect-uri Next.js

Adaugă în `next.config.js` redirect-uri 308 pentru toate rutele vechi.

### Pasul 4: Actualizare Link-uri

Înlocuiește toate referințele hardcodate cu `routes.*` din:
- Navbar
- Footer
- Mega menu
- Link-uri interne
- Redirect-uri

### Pasul 5: Sitemap & Robots

Actualizează `sitemap.ts` și `robots.ts` cu noile rute.

### Pasul 6: Backend Link-uri Publice

Actualizează link-urile publice din:
- Email templates
- Notificări
- Documentație

---

## ⚠️ Notă Importantă

**API REST paths NU se schimbă:**
- `GET /api/products` → rămâne `/api/products`
- `GET /api/producers` → rămâne `/api/producers`
- Toate endpoint-urile API rămân în engleză

**Doar rutele publice Next.js se schimbă:**
- `/products` → `/produse` (pagina publică)
- `/producers` → `/producatori` (pagina publică)

---

## 📝 Checklist Final

- [ ] Fișier `routes.ts` creat și complet
- [ ] Toate paginile mutate în folderele noi
- [ ] Redirect-uri adăugate în `next.config.js`
- [ ] Toate link-urile actualizate cu `routes.*`
- [ ] Sitemap actualizat
- [ ] Robots.txt actualizat
- [ ] Backend link-uri publice actualizate
- [ ] Build fără erori
- [ ] Testare manuală redirect-uri
- [ ] Documentație actualizată

---

**Ultima actualizare:** 2025-01-27  
**Versiune:** 1.0


