# Plan de Localizare Rute - Farmero (Română)

**Data:** 2025-01-27  
**Scop:** Localizare completă a rutelor în română (frontend + backend), inclusiv sub-rutele portalului producătorilor  
**Status:** 🚧 În progres

---

## 📋 Rezumat Executiv

Acest document descrie migrarea completă a tuturor rutelor publice și a sub-rutelor portalurilor din engleză în română, menținând compatibilitatea SEO prin redirect-uri permanente (308) și păstrând toate API-urile tehnice în engleză.

**Principii:**
- ✅ Rutele publice (slugs) → română
- ✅ Sub-rutele portalurilor → română (orders → comenzi, products → produse, etc.)
- ✅ API REST paths → engleză (neschimbate)
- ✅ Redirect-uri 308 pentru SEO
- ✅ Type-safe routes în frontend

---

## 🗺️ Tabel Complet de Mapping

### Rute Publice - Marketplace

| Context | Current route | New RO route | Notes | Status |
|---------|---------------|--------------|-------|--------|
| Public | `/` | `/` | Homepage - rămâne | ✅ |
| Public | `/products` | `/produse` | Listă produse | ✅ |
| Public | `/products/[slug]` | `/produse/[slug]` | Detalii produs | ✅ |
| Public | `/products?category=...` | `/produse?category=...` | Query params rămân | ✅ |
| Public | `/producers` | `/producatori` | Listă producători | ✅ |
| Public | `/producers/[slug]` | `/producatori/[slug]` | Detalii producător | ✅ |
| Public | `/about` | `/despre-noi` | Despre noi | ✅ |
| Public | `/fees` | `/comisioane-taxe` | Comisioane & taxe | ✅ |
| Public | `/faq` | `/intrebari-frecvente` | FAQ | ✅ |
| Public | `/support` | `/suport` | Suport (dacă există public) | ⚠️ |
| Public | `/sustine-farmero` | `/sustine-farmero` | Deja în română | ✅ |
| Public | `/login` | `/login` | Standard - rămâne | ✅ |
| Public | `/register` | `/register` | Standard - rămâne | ✅ |

### Portal Producători - Sub-rute

| Context | Current route | New RO route | Notes | Status |
|---------|---------------|--------------|-------|--------|
| Producer Portal | `/portal-producatori` | `/portal-producatori` | Top-level - deja RO | ✅ |
| Producer Portal | `/portal-producatori/dashboard` | `/portal-producatori/dashboard` | Dashboard - slug intern | ✅ |
| Producer Portal | `/portal-producatori/orders` | `/portal-producatori/comenzi` | Comenzi | 🔄 |
| Producer Portal | `/portal-producatori/orders/[id]` | `/portal-producatori/comenzi/[id]` | Detalii comandă | 🔄 |
| Producer Portal | `/portal-producatori/products` | `/portal-producatori/produse` | Listă produse | 🔄 |
| Producer Portal | `/portal-producatori/products/new` | `/portal-producatori/produse/adauga` | Adaugă produs | 🔄 |
| Producer Portal | `/portal-producatori/products/[id]/edit` | `/portal-producatori/produse/[id]/editeaza` | Editează produs | 🔄 |
| Producer Portal | `/portal-producatori/shipping-guide` | `/portal-producatori/ghid-livrare` | Ghid livrare | 🔄 |
| Producer Portal | `/portal-producatori/guide` | `/portal-producatori/ghid-producatori` | Ghid producători | 🔄 |
| Producer Portal | `/portal-producatori/finances` | `/portal-producatori/finante` | Finanțe | 🔄 |
| Producer Portal | `/portal-producatori/commissions` | `/portal-producatori/comisioane` | Comisioane | 🔄 |
| Producer Portal | `/portal-producatori/subscriptions` | `/portal-producatori/abonamente` | Abonamente | 🔄 |
| Producer Portal | `/portal-producatori/marketing` | `/portal-producatori/marketing-promovare` | Marketing & promovare | 🔄 |
| Producer Portal | `/portal-producatori/documents` | `/portal-producatori/documente` | Documente | 🔄 |
| Producer Portal | `/portal-producatori/contracts` | `/portal-producatori/contracte` | Contracte | 🔄 |
| Producer Portal | `/portal-producatori/contracts/[id]` | `/portal-producatori/contracte/[id]` | Detalii contract | 🔄 |
| Producer Portal | `/portal-producatori/support` | `/portal-producatori/suport` | Suport | 🔄 |
| Producer Portal | `/portal-producatori/settings` | `/portal-producatori/settings` | Setări - slug intern | ✅ |
| Producer Portal | `/portal-producatori/login` | `/portal-producatori/login` | Login - standard | ✅ |
| Producer Portal | `/portal-producatori/register` | `/portal-producatori/register` | Register - standard | ✅ |

### Alte Portaluri

| Context | Current route | New RO route | Notes | Status |
|---------|---------------|--------------|-------|--------|
| Business Portal | `/portal-business` | `/portal-business` | Deja RO | ✅ |
| Logistics Portal | `/portal-logistica` | `/portal-logistica` | Deja RO | ✅ |
| Investor Portal | `/portal-investitori` | `/portal-investitori` | Deja RO | ✅ |
| Importer Portal | `/portal-importatori` | `/portal-importatori` | Deja RO | ✅ |

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
| `/terms` | Standard legal | ✅ |
| `/privacy` | Standard legal | ✅ |
| `/cookies` | Standard legal | ✅ |
| `/gdpr` | Acronim standard | ✅ |
| `/anpc` | Acronim standard | ✅ |

---

## 🔧 Implementare

### Pasul 1: Actualizare routes.ts

Actualizare sub-rute portal producători în `src/lib/routes.ts`:
- `orders` → `comenzi`
- `products` → `produse`
- `productNew` → `produse/adauga`
- `productEdit` → `produse/[id]/editeaza`
- `shippingGuide` → `ghid-livrare`
- `guide` → `ghid-producatori`
- `finances` → `finante`
- `commissions` → `comisioane`
- `subscriptions` → `abonamente`
- `marketing` → `marketing-promovare`
- `documents` → `documente`
- `contracts` → `contracte`
- `support` → `suport`

### Pasul 2: Redenumire Foldere Portal Producători

Redenumește folderele din `src/app/(site)/portal-producatori/`:
- `orders/` → `comenzi/`
- `products/` → `produse/`
- `shipping-guide/` → `ghid-livrare/`
- `guide/` → `ghid-producatori/`
- `finances/` → `finante/`
- `commissions/` → `comisioane/`
- `subscriptions/` → `abonamente/`
- `marketing/` → `marketing-promovare/`
- `documents/` → `documente/`
- `contracts/` → `contracte/`
- `support/` → `suport/`

### Pasul 3: Redirect-uri Next.js

Adaugă în `next.config.js` redirect-uri 308 pentru:
- `/portal-producatori/orders` → `/portal-producatori/comenzi`
- `/portal-producatori/orders/:id*` → `/portal-producatori/comenzi/:id*`
- `/portal-producatori/products` → `/portal-producatori/produse`
- `/portal-producatori/products/:path*` → `/portal-producatori/produse/:path*`
- `/portal-producatori/shipping-guide` → `/portal-producatori/ghid-livrare`
- `/portal-producatori/guide` → `/portal-producatori/ghid-producatori`
- `/portal-producatori/finances` → `/portal-producatori/finante`
- `/portal-producatori/commissions` → `/portal-producatori/comisioane`
- `/portal-producatori/subscriptions` → `/portal-producatori/abonamente`
- `/portal-producatori/marketing` → `/portal-producatori/marketing-promovare`
- `/portal-producatori/documents` → `/portal-producatori/documente`
- `/portal-producatori/contracts` → `/portal-producatori/contracte`
- `/portal-producatori/contracts/:id*` → `/portal-producatori/contracte/:id*`
- `/portal-producatori/support` → `/portal-producatori/suport`

### Pasul 4: Actualizare Link-uri Hardcodate

Înlocuiește toate referințele hardcodate cu `routes.*` din:
- Navbar
- Footer
- Mega menu
- Mobile sidebar
- Producer portal navigation
- Card components
- Link-uri interne

### Pasul 5: Sitemap & Robots

Actualizează `sitemap.ts` și `robots.ts` - deja actualizate cu rutele principale RO.

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
- `/portal-producatori/orders` → `/portal-producatori/comenzi` (sub-rută portal)

---

## 📝 Checklist Final

- [x] Fișier `routes.ts` există și are rutele principale
- [ ] Actualizare `routes.ts` cu sub-rute RO portal producători
- [ ] Redenumire foldere portal producători
- [ ] Redirect-uri adăugate în `next.config.js` pentru sub-rute
- [ ] Toate link-urile actualizate cu `routes.*`
- [x] Sitemap actualizat (rutele principale)
- [x] Robots.txt actualizat
- [ ] Backend link-uri publice actualizate
- [ ] Build fără erori
- [ ] Testare manuală redirect-uri
- [ ] Documentație actualizată

---

**Ultima actualizare:** 2025-01-27  
**Versiune:** 2.0

