# Frontend URL Localization - Backend Notes

**Data:** 2025-01-27  
**Scop:** Documentație pentru actualizarea link-urilor publice în backend

---

## 📋 Rezumat

Frontend-ul a migrat toate rutele publice din engleză în română. **API-urile REST rămân neschimbate** - doar URL-urile publice Next.js s-au schimbat.

---

## 🗺️ Mapping Vechi → Nou

### Rute Publice

| VECHI | NOU | Tip |
|-------|-----|-----|
| `/products` | `/produse` | Listă produse |
| `/products/[slug]` | `/produse/[slug]` | Detalii produs |
| `/producers` | `/producatori` | Listă producători |
| `/producers/[slug]` | `/producatori/[slug]` | Detalii producător |
| `/about` | `/despre-noi` | Despre noi |
| `/fees` | `/comisioane-taxe` | Comisioane & taxe |
| `/faq` | `/intrebari-frecvente` | FAQ |

### Portaluri

| VECHI | NOU | Tip |
|-------|-----|-----|
| `/producer-portal/*` | `/portal-producatori/*` | Portal producători |
| `/business-portal/*` | `/portal-business/*` | Portal business |
| `/logistics-portal/*` | `/portal-logistica/*` | Portal logistică |
| `/investor-portal/*` | `/portal-investitori/*` | Portal investitori |
| `/importer-portal/*` | `/portal-importatori/*` | Portal importatori |

---

## ⚠️ IMPORTANT: API Paths NU se schimbă

**Toate endpoint-urile API rămân în engleză:**

- ✅ `GET /api/products` → rămâne `/api/products`
- ✅ `GET /api/producers` → rămâne `/api/producers`
- ✅ `POST /api/orders` → rămâne `/api/orders`
- ✅ Toate endpoint-urile API rămân neschimbate

**Doar URL-urile publice Next.js s-au schimbat:**
- ❌ `/products` (pagina publică) → `/produse`
- ❌ `/producers` (pagina publică) → `/producatori`

---

## 🔧 Ce trebuie actualizat în Backend

### 1. Email Templates

Caută și actualizează link-urile către pagini publice în:
- Email-uri de confirmare comandă
- Email-uri de notificare
- Email-uri de resetare parolă
- Email-uri de invitare

**Exemplu:**

**Înainte:**
```html
<a href="https://farme.ro/products/ciuperci">Vezi produs</a>
<a href="https://farme.ro/producer-portal/dashboard">Intră în portal</a>
<a href="https://farme.ro/producer-portal/orders">Comenzi</a>
<a href="https://farme.ro/producer-portal/products">Produse</a>
```

**După:**
```html
<a href="https://farme.ro/produse/ciuperci">Vezi produs</a>
<a href="https://farme.ro/portal-producatori/dashboard">Intră în portal</a>
<a href="https://farme.ro/portal-producatori/comenzi">Comenzi</a>
<a href="https://farme.ro/portal-producatori/produse">Produse</a>
```

### 2. Notificări & Link-uri Generice

Caută în cod link-uri către:
- `/products/...` → `/produse/...`
- `/producers/...` → `/producatori/...`
- `/producer-portal/...` → `/portal-producatori/...`
- `/producer-portal/orders` → `/portal-producatori/comenzi`
- `/producer-portal/products` → `/portal-producatori/produse`
- `/producer-portal/shipping-guide` → `/portal-producatori/ghid-livrare`
- `/producer-portal/guide` → `/portal-producatori/ghid-producatori`
- `/producer-portal/finances` → `/portal-producatori/finante`
- `/producer-portal/commissions` → `/portal-producatori/comisioane`
- `/producer-portal/subscriptions` → `/portal-producatori/abonamente`
- `/producer-portal/marketing` → `/portal-producatori/marketing-promovare`
- `/producer-portal/documents` → `/portal-producatori/documente`
- `/producer-portal/contracts` → `/portal-producatori/contracte`
- `/producer-portal/support` → `/portal-producatori/suport`
- `/business-portal/...` → `/portal-business/...`
- `/logistics-portal/...` → `/portal-logistica/...`
- `/investor-portal/...` → `/portal-investitori/...`
- `/importer-portal/...` → `/portal-importatori/...`
- `/about` → `/despre-noi`
- `/fees` → `/comisioane-taxe`
- `/faq` → `/intrebari-frecvente`

### 3. Documentație & Config

Dacă există documentație sau config-uri care conțin link-uri către frontend, actualizează-le.

---

## 🔍 Căutare Link-uri de Actualizat

### Node.js / TypeScript:

```bash
# Caută link-uri către rute vechi în email templates
grep -r "farme.ro/products" --include="*.ts" --include="*.js" --include="*.html" --include="*.hbs"

# Caută link-uri către portaluri vechi
grep -r "farme.ro/producer-portal" --include="*.ts" --include="*.js" --include="*.html" --include="*.hbs"

# Caută link-uri către about/fees/faq
grep -r "farme.ro/(about|fees|faq)" --include="*.ts" --include="*.js" --include="*.html" --include="*.hbs"
```

---

## ✅ Redirect-uri Frontend

Frontend-ul are redirect-uri permanente (308) de la vechile URL-uri la noile URL-uri, deci link-urile vechi vor funcționa temporar, dar ar trebui actualizate pentru SEO și performanță.

---

## 📝 Checklist Backend

- [ ] Email templates actualizate
- [ ] Notificări actualizate
- [ ] Link-uri în cod actualizate
- [ ] Documentație actualizată (dacă există)
- [ ] Config-uri actualizate (dacă există)
- [ ] Teste actualizate (dacă există)

---

## 🔗 Link-uri Utile

- Plan complet: `frontend/docs/FARMERO_ROUTE_LOCALIZATION_PLAN.md`
- Ghid migrare: `frontend/docs/ROUTE_MIGRATION_GUIDE.md`
- Checklist actualizare: `frontend/docs/ROUTE_UPDATE_CHECKLIST.md`

---

**Ultima actualizare:** 2025-01-27  
**Versiune:** 1.0


