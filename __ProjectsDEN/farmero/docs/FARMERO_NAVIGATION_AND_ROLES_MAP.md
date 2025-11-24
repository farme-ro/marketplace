# Farmero Navigation & Roles Map

**Data:** 2025-01-27  
**Scop:** Documentație completă pentru navigație, roluri și acces la pagini  
**Status:** ✅ Complet

---

## 📋 Rezumat Executiv

Acest document mapează:
- **Toate paginile** din aplicație
- **Cine le vede** (roluri)
- **De unde se ajunge la ele** (login flow, meniuri, link-uri)
- **Link-uri orfane** (dacă există)
- **Pagini "secrete"** (dacă există)

**Scop:** Prevenirea link-urilor orfane și a paginilor inaccesibile din UI.

---

## 👥 1. Roluri Canonice

### 1.1. UserRole Type

Definit în `src/lib/types/domain.ts`:

```typescript
export type UserRole =
  | 'client'      // Clienți (persoane fizice)
  | 'producer'    // Producători
  | 'business'    // Clienți business (B2B)
  | 'logistics'   // Parteneri de logistică
  | 'investor'    // Investitori
  | 'importer'    // Importatori
  | 'admin'       // Administratori
```

### 1.2. Normalizare Roluri

**Fișier:** `src/lib/auth/context.tsx`

Backend → Canonical:
- `CUSTOMER` → `client`
- `PRODUCER` → `producer`
- `BUSINESS` → `business`
- `LOGISTICS` → `logistics`
- `INVESTOR` → `investor`
- `IMPORTER` → `importer`
- `ADMIN` → `admin`

---

## 🏠 2. Pagini Publice (Fără Autentificare)

### 2.1. Homepage & Marketplace

| Rută | Acces | Acces din UI | Status |
|------|-------|--------------|--------|
| `/` | Public | Logo, "Acasă" (navbar, mobile menu) | ✅ |
| `/produse` | Public | "Produse" (navbar, mobile menu, footer) | ✅ |
| `/produse/[slug]` | Public | Carduri produse, search results | ✅ |
| `/producatori` | Public | "Producători locali" (footer, navbar) | ✅ |
| `/producatori/[slug]` | Public | Carduri producători, search results | ✅ |
| `/despre-noi` | Public | "Despre" (navbar, footer) | ✅ |
| **Notă:** Vechile rute `/products`, `/producers`, `/about` au redirect-uri 308 către noile rute | | | |
| `/cum-functioneaza-si-impact` | Public | "Cum funcționează farmero" (footer) | ✅ |
| `/intrebari-frecvente` | Public | "FAQ" (footer) | ✅ |
| **Notă:** Vechile rute `/fees`, `/faq` au redirect-uri 308 către noile rute | | | |
| `/sustine-farmero` | Public | "Susține Farmero" (footer, newsletter section) | ✅ |

### 2.2. Autentificare & Înregistrare

| Rută | Acces | Acces din UI | Status |
|------|-------|--------------|--------|
| `/login` | Public | "Conectare" (navbar, mobile menu), redirect automat pentru neautentificați | ✅ |
| `/register` | Public | "Înregistrare" (navbar, mobile menu) | ✅ |
| `/select-account` | Public (după login multi-rol) | Redirect automat după login dacă user are multiple roluri | ✅ |

**Flow Login:**
1. User accesează `/login`
2. După login:
   - **Un singur rol** → Redirect automat la portal-ul corespunzător
   - **Multiple roluri** → Redirect la `/select-account`
3. `/select-account` → User alege rolul → Redirect la portal-ul corespunzător

---

## 👤 3. Client Portal (Rol: `client`)

### 3.1. Navbar & Mobile Menu

**Link-uri vizibile pentru `client`:**
- Logo → `/`
- "Produse" → `/products`
- "Despre" → `/about`
- User Menu (dropdown):
  - Account Switcher (dacă are multiple accounts)
  - Notification Center (toți utilizatorii autentificați - dacă `notifications` activ în BackendSyncStatus)
  - "Contul meu" → `/account`
  - "Comenzi" → `/orders`
  - "Deconectare"

### 3.2. Pagini Client

| Rută | Acces | Acces din UI | Status |
|------|-------|--------------|--------|
| `/account` | `client` | User menu → "Contul meu" | ✅ |
| `/account/favorites` | `client` | `/account` → Secțiune "Favorite Products" | ✅ |
| `/cart` | Public (guest) / `client` | Icon coș (navbar), "Vezi coșul" | ✅ |
| `/checkout` | Public (guest) / `client` | `/cart` → "Continuă la checkout" | ✅ |
| `/orders` | `client` | User menu → "Comenzi", mobile menu → "Comenzi" | ✅ |
| `/orders/[id]` | `client` | `/orders` → "Vezi detalii" | ✅ |

**Protecție:** `RequireAuth role="client"` (pentru `/account`, `/orders`)

---

## 🌾 4. Producer Portal (Rol: `producer`)

### 4.1. Navbar & Mega Menu

**Link-uri vizibile pentru `producer`:**
- Logo → `/`
- "Produse" → `/products`
- "Despre" → `/about`
- "Pentru producători" (mega menu) → `/producer-portal/dashboard`
- User Menu:
  - "Portal producător" → `/producer-portal/dashboard`
  - "Deconectare"
- Notification Center (icon clopoțel cu badge):
  - Vizibil pentru toți utilizatorii autentificați (dacă `notifications` activ în BackendSyncStatus)
  - Badge cu număr de notificări necitite
  - Click deschide popover cu lista notificărilor
  - Disponibil în header (desktop) și în mobile nav sidebar

**Mega Menu "Pentru producători" (desktop):**
- **Coloana 1 - Începe:**
  - "De ce să vinzi pe farme.ro" → `/pentru-producatori`
  - "Comisioane și taxe" → `/fees`
  - "Ghid livrări & logistică" → `/producer-portal/shipping-guide`
  - "Ghid producător" → `/producer-portal/guide`
- **Coloana 2 - Portal producători:**
  - "Dashboard producător" → `/producer-portal/dashboard`
  - "Gestionează produse" → `/producer-portal/products`
  - "Comenzi" → `/producer-portal/orders`
  - "Vânzări & comisioane" → `/producer-portal/sales-commissions`
  - "Documente & Facturare" → `/producer-portal/documents`
  - "Contracte" → `/producer-portal/contracts`
  - "Marketing & Promovare" → `/producer-portal/marketing`
  - "Abonamente & Vizibilitate" → `/producer-portal/subscriptions`
  - "Setări" → `/producer-portal/settings`
  - "Suport" → `/producer-portal/support`
  - "Insights" → `/producer-portal/insights`

### 4.2. Producer Sidebar (Desktop)

**Link-uri în sidebar:**
- Dashboard → `/producer-portal/dashboard`
- Comenzi → `/producer-portal/orders`
- Produse → `/producer-portal/products`
- Vânzări & Comisioane → `/producer-portal/sales-commissions`
- Documente → `/producer-portal/documents`
- Contracte → `/producer-portal/contracts`
- Marketing → `/producer-portal/marketing`
- Abonamente → `/producer-portal/subscriptions`
- Setări → `/producer-portal/settings`
- Suport → `/producer-portal/support`
- Insights → `/producer-portal/insights`

### 4.3. Producer Bottom Navigation (Mobile)

**Icon-uri în bottom nav:**
- Dashboard → `/producer-portal/dashboard`
- Comenzi → `/producer-portal/orders`
- Produse → `/producer-portal/products`
- Setări → `/producer-portal/settings`

### 4.4. Pagini Producer Portal

| Rută | Acces | Acces din UI | Status |
|------|-------|--------------|--------|
| `/portal-producatori/dashboard` | `producer` | Sidebar, bottom nav, mega menu, redirect după login | ✅ |
| **Notă:** Vechile rute `/producer-portal/*` au redirect-uri 308 către `/portal-producatori/*` | | | |
| `/producer-portal/orders` | `producer` | Sidebar, bottom nav, mega menu | ✅ |
| `/producer-portal/orders/[id]` | `producer` | `/producer-portal/orders` → "Vezi detalii" | ✅ |
| `/producer-portal/products` | `producer` | Sidebar, bottom nav, mega menu | ✅ |
| `/producer-portal/products/new` | `producer` | `/producer-portal/products` → "Adaugă produs" | ✅ |
| `/producer-portal/products/[id]/edit` | `producer` | `/producer-portal/products` → "Editează" | ✅ |
| `/producer-portal/sales-commissions` | `producer` | Mega menu (ca "Vânzări & comisioane") | ✅ |
| `/producer-portal/statements/[id]` | `producer` | `/producer-portal/sales-commissions` → "Vezi detalii" | ✅ |
| `/producer-portal/documents` | `producer` | Mega menu | ✅ |
| `/producer-portal/contracts` | `producer` | Mega menu | ✅ |
| `/producer-portal/contracts/[id]` | `producer` | `/producer-portal/contracts` → "Vezi detalii" | ✅ |
| `/producer-portal/marketing` | `producer` | Mega menu | ✅ |
| `/producer-portal/subscriptions` | `producer` | Sidebar ("Abonament & beneficii"), mega menu | ✅ |
| `/producer-portal/settings` | `producer` | Sidebar, bottom nav, mega menu | ✅ |
| `/producer-portal/support` | `producer` | Mega menu | ✅ |
| `/producer-portal/insights` | `producer` | Sidebar, bottom nav (ca "Statistici"), mega menu | ✅ |
| `/producer-portal/shipping-guide` | `producer` | Mega menu | ✅ |
| `/producer-portal/guide` | `producer` | Mega menu | ✅ |
| `/producer-portal/finances` | `producer` | Sidebar ("Finanțe") | ✅ |
| `/producer-portal/commissions` | `producer` | Footer, mega menu ("Comisioane în portal"), `/producer-portal/finances` → "Vezi comisioane" | ✅ |
| `/producer-portal/inventory` | `producer` | Sidebar ("Stoc & Logistică") | ✅ **Pagină shell "Coming soon" creată** |
| `/producer-portal/promotion` | `producer` | Redirect → `/marketing` | ✅ **Redirect către `/producer-portal/marketing`, link actualizat în sidebar** |
| `/producer-portal/messages` | `producer` | Sidebar ("Mesaje clienți") | ✅ **Pagină shell "Coming soon" creată** |
| `/producer-portal/impact` | `producer` | Sidebar ("Impact social") | ✅ **Pagină shell "Coming soon" creată** |
| `/producer-portal/login` | Public | Redirect la `/login` | ✅ |
| `/producer-portal/register` | Public | Link din mega menu / footer | ✅ |

**Protecție:** Layout-ul `/producer-portal` folosește `RequireAuth role="producer"`

**Notă:** Există două pagini diferite pentru comisioane:
- `/producer-portal/commissions` - Pagină informativă despre comisioane și abonamente (publică pentru producători)
- `/producer-portal/sales-commissions` - Pagină pentru vizualizarea vânzărilor și extrase (doar pentru producători autentificați)

---

## 🏢 5. Business Portal (Rol: `business`, `admin`)

### 5.1. Navbar & Mega Menu

**Link-uri vizibile pentru `business`:**
- Logo → `/`
- "Produse" → `/products`
- "Despre" → `/about`
- "Pentru afacerea ta" (mega menu) → `/business-portal/dashboard`
- User Menu:
  - "Portal business" → `/business-portal/dashboard`
  - "Deconectare"

### 5.2. Pagini Business Portal

| Rută | Acces | Acces din UI | Status |
|------|-------|--------------|--------|
| `/business-portal/dashboard` | `business`, `admin` | Mega menu, redirect după login | ✅ |
| `/business-portal/documents` | `business`, `admin` | Mega menu "Pentru afacerea ta" → "Documente & facturare" | ✅ |
| `/business-portal/contracts/[id]` | `business`, `admin` | `/business-portal/documents` → "Vezi detalii" | ✅ |

**Protecție:** Layout-ul `/business-portal` folosește `RequireAuth role={['business', 'admin']}`

**Notă:** Business Portal nu are sidebar dedicat (folosește layout simplu).

**Mega Menu "Pentru afacerea ta" (desktop):**
- "De ce farme.ro pentru afacerea ta" → `/b2b` (highlight)
- "Facturare și contracte" → `/b2b#invoicing` (anchor)
- "Cont dedicat B2B" → `/b2b/register`
- "Documente & facturare" → `/business-portal/documents` ✅

---

## 🚚 6. Logistics Portal (Rol: `logistics`)

### 6.1. Navbar & Mega Menu

**Link-uri vizibile pentru `logistics`:**
- Logo → `/`
- "Produse" → `/products`
- "Despre" → `/about`
- "Logistică și transport" (mega menu) → `/logistics-portal/dashboard`
- User Menu:
  - "Portal logistică" → `/logistics-portal/dashboard`
  - "Deconectare"

### 6.2. Pagini Logistics Portal

| Rută | Acces | Acces din UI | Status |
|------|-------|--------------|--------|
| `/logistics-portal/dashboard` | `logistics` | Mega menu, redirect după login | ✅ |
| `/logistics-portal/commissions` | `logistics` | Mega menu "Logistică și transport" → "Comisioane" | ✅ |
| `/logistics-portal/statements/[id]` | `logistics` | `/logistics-portal/commissions` → "Vezi detalii" | ✅ |
| `/logistics-portal/contracts` | `logistics` | Mega menu "Logistică și transport" → "Contracte" | ✅ |

**Protecție:** Layout-ul `/logistics-portal` folosește `RequireAuth role="logistics"`

**Notă:** Logistics Portal nu are sidebar dedicat (folosește layout simplu).

**Mega Menu "Logistică și transport" (desktop):**
- "Portal parteneri logistică" → `/pentru-logistica/dashboard` (highlight)
- "Contracte și documentație" → `/pentru-logistica/dashboard#contracts` (anchor)
- "Comisioane" → `/logistics-portal/commissions` ✅
- "Contracte" → `/logistics-portal/contracts` ✅

---

## 💼 7. Investor Portal (Rol: `investor`, `admin`)

### 7.1. Navbar & Mega Menu

**Link-uri vizibile pentru `investor`:**
- Logo → `/`
- "Produse" → `/products`
- "Despre" → `/about`
- "Pentru investitori" (mega menu) → `/investor-portal/dashboard`
- User Menu:
  - "Portal investitori" → `/investor-portal/dashboard`
  - "Deconectare"

### 7.2. Pagini Investor Portal

| Rută | Acces | Acces din UI | Status |
|------|-------|--------------|--------|
| `/investor-portal/dashboard` | `investor`, `admin` | Mega menu, redirect după login | ✅ |

**Protecție:** Layout-ul `/investor-portal` folosește `RequireAuth role={['investor', 'admin']}`

**Notă:** Investor Portal nu are sidebar dedicat (folosește layout simplu).

---

## 🌍 8. Importer Portal (Rol: `importer`)

### 8.1. Navbar & Mega Menu

**Link-uri vizibile pentru `importer`:**
- Logo → `/`
- "Produse" → `/products`
- "Despre" → `/about`
- "Pentru importatori" (mega menu) → `/importer-portal/dashboard`
- User Menu:
  - "Portal importatori" → `/importer-portal/dashboard`
  - "Deconectare"

### 8.2. Pagini Importer Portal

| Rută | Acces | Acces din UI | Status |
|------|-------|--------------|--------|
| `/importer-portal/dashboard` | `importer` | Mega menu, redirect după login | ✅ |

**Protecție:** Layout-ul `/importer-portal` folosește `RequireAuth role="importer"`

**Notă:** Importer Portal nu are sidebar dedicat (folosește layout simplu).

---

## 🔄 9. Login Flow & Redirects

### 9.1. Unified Login System

**Rută:** `/login`

**Flow:**
1. User accesează `/login`
2. User introduce email + parolă
3. Backend verifică toate rolurile (`client`, `producer`, `business`, `logistics`, `investor`, `importer`)
4. După login:
   - **Un singur rol** → Redirect automat:
     - `client` → `/account`
     - `producer` → `/producer-portal/dashboard`
     - `business` → `/business-portal/dashboard`
     - `logistics` → `/logistics-portal/dashboard`
     - `investor` → `/investor-portal/dashboard`
     - `importer` → `/importer-portal/dashboard`
   - **Multiple roluri** → Redirect la `/select-account`
5. `/select-account` → User alege rolul → Redirect la portal-ul corespunzător

### 9.2. Protected Routes Redirect

**Comportament:**
- User neautentificat accesează rută protejată → Redirect la `/login?returnUrl=<ruta>`
- User autentificat cu rol greșit → Afișează `ForbiddenError` (nu redirect loop)

---

## 📱 10. Mobile Navigation

### 10.1. Mobile Nav Sidebar

**Link-uri pentru toți utilizatorii:**
- "Acasă" → `/`
- "Produse" → `/products`
- "Despre" → `/about`
- "Cum funcționează" → `/cum-functioneaza-si-impact`
- "Comisioane & taxe" → `/fees`
- "Pentru producători" (accordion):
  - "De ce să vinzi pe farme.ro" → `/pentru-producatori`
  - "Dashboard producător" → `/producer-portal/dashboard`
  - "Gestionează produse" → `/producer-portal/products`
  - "Comenzi" → `/producer-portal/orders`
  - "Comisioane & abonamente" → `/producer-portal/commissions`
  - "Suport producători" → `/producer-portal/support`

**Link-uri pentru utilizatori autentificați:**
- "Dashboard" → `/dashboard` (redirectează bazat pe rol)
- "Comenzi" → `/orders`
- "Deconectare"

**Link-uri pentru utilizatori neautentificați:**
- "Conectare" → `/login`
- "Înregistrare" → `/register`

### 10.2. Producer Bottom Navigation (Mobile)

**Icon-uri:**
- Dashboard → `/producer-portal/dashboard`
- Comenzi → `/producer-portal/orders`
- Produse → `/producer-portal/products`
- Setări → `/producer-portal/settings`

---

## 🔗 11. Footer Links

### 11.1. Coloana "Pentru clienți"

- "Cum funcționează farmero" → `/cum-functioneaza-si-impact`
- "Producători locali" → `/producers`
- "Produse" → `/products`
- "Impact social & donații" → `/cum-functioneaza-si-impact#impact-section`
- "FAQ" → `/faq`

### 11.2. Coloana "Pentru producători"

- "Devino producător partener" → `/pentru-producatori`
- "Autentificare producători" → `/producer-portal/login` (redirect la `/login`)
- "Comisioane & taxe" → `/fees`
- "Abonamente & promovare" → `/producer-portal/subscriptions`
- "Ghid livrări & logistică" → `/producer-portal/shipping-guide`
- "De ce să vinzi pe farme.ro" → `/pentru-producatori`

### 11.3. Coloana "Despre farmero"

- "Despre noi" → `/about`
- "Misiune & valori" → `/about#mission`
- "Contact" → `/contact` ✅

### 11.4. Coloana "Legal & info"

- "Termeni și condiții" → `/terms` ✅
- "Politica de confidențialitate" → `/privacy` ✅
- "Politica de cookies" → `/cookies` ✅
- "ANPC / Soluționare litigii" → `/anpc` ✅
- "Protecția datelor" → `/gdpr` ✅
- "Susține Farmero" → `/sustine-farmero` ✅

---

## ⚠️ 12. Link-uri Orfane & Pagini "Secrete"

### 12.1. Pagini Fără Link-uri în UI

| Rută | Status | Recomandare |
|------|--------|-------------|
| `/producer-portal/finances` | ✅ | Linkat în sidebar ("Finanțe") |
| `/producer-portal/commissions` | ✅ | Linkat în footer, mega menu, și `/producer-portal/finances` |
| `/producer-portal/inventory` | ✅ | Linkat în sidebar ("Stoc & Logistică") - **Pagină shell creată** |
| `/producer-portal/promotion` | ✅ | Redirect către `/marketing` - **Link actualizat în sidebar** |
| `/producer-portal/messages` | ✅ | Linkat în sidebar ("Mesaje clienți") - **Pagină shell creată** |
| `/producer-portal/impact` | ✅ | Linkat în sidebar ("Impact social") - **Pagină shell creată** |
| `/business-portal/documents` | ✅ | Linkat în mega menu "Pentru afacerea ta" → "Servicii" - **REZOLVAT** |
| `/logistics-portal/commissions` | ✅ | Linkat în mega menu "Logistică și transport" → "Resurse" - **REZOLVAT** |
| `/logistics-portal/contracts` | ✅ | Linkat în mega menu "Logistică și transport" → "Resurse" - **REZOLVAT** |
| `/logistics-portal/contracts` | ⚠️ | Nu e linkat în UI - adaugă link în navbar/sidebar sau șterge pagina |
| `/dashboard` | ⚠️ | Există și redirectează bazat pe rol - verifică dacă e linkat corect în mobile menu |

### 12.2. Pagini "Secrete" (Accesibile doar prin URL direct)

**Niciuna identificată** - toate paginile au link-uri în UI sau sunt protejate de `RequireAuth`.

---

## 📊 13. Matrice Acces Pagini

### 13.1. Tabel Complet

| Rută | Public | Client | Producer | Business | Logistics | Investor | Importer | Admin |
|------|--------|--------|----------|----------|-----------|----------|----------|-------|
| `/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/products` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/products/[slug]` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/producers` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/producers/[slug]` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/login` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/register` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/select-account` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/account` | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/account/favorites` | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/cart` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/checkout` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/orders` | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/orders/[id]` | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/producer-portal/dashboard` | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/producer-portal/orders` | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/producer-portal/products` | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/producer-portal/sales-commissions` | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/producer-portal/documents` | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/producer-portal/contracts` | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/producer-portal/marketing` | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/producer-portal/subscriptions` | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/business-portal/dashboard` | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| `/business-portal/documents` | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| `/logistics-portal/dashboard` | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| `/logistics-portal/commissions` | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| `/logistics-portal/contracts` | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| `/investor-portal/dashboard` | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| `/importer-portal/dashboard` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| `/sustine-farmero` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 🎯 14. Recomandări & Acțiuni

### 14.1. Link-uri de Adăugat / Probleme Identificate

1. **Producer Portal:**
   - ✅ `/producer-portal/finances` - Linkat în sidebar
   - ✅ `/producer-portal/commissions` - Linkat în footer, mega menu, și `/producer-portal/finances`
   - ✅ **REZOLVAT:** Paginile `/producer-portal/inventory`, `/producer-portal/messages`, `/producer-portal/impact` au fost create ca pagini shell "Coming soon"
   - ✅ **REZOLVAT:** `/producer-portal/promotion` redirectează către `/producer-portal/marketing` și link-ul din sidebar a fost actualizat

2. **Business Portal:**
   - ⚠️ **Lipsește link direct** către `/business-portal/documents` în mega menu
   - **Acțiune:** Adaugă link în mega menu "Pentru afacerea ta" sau creează sidebar pentru business portal

3. **Logistics Portal:**
   - ⚠️ **Lipsesc link-uri directe** către `/logistics-portal/commissions` și `/logistics-portal/contracts` în mega menu
   - **Acțiune:** Adaugă link-uri în mega menu "Logistică și transport" sau creează sidebar pentru logistics portal
   - **Notă:** Există link către `/pentru-logistica/dashboard#contracts` (anchor) dar nu direct către `/logistics-portal/contracts`

### 14.2. Pagini de Verificat

1. ✅ `/dashboard` - Există și redirectează bazat pe rol (linkat în mobile menu)
2. ✅ `/contact` - Există (linkat în footer, mega menu)
3. ✅ `/terms`, `/privacy`, `/cookies`, `/anpc`, `/gdpr` - Toate există (linkate în footer)
4. ✅ `/producer-portal/inventory` - **REZOLVAT:** Pagină shell creată
5. ✅ `/producer-portal/promotion` - **REZOLVAT:** Redirect către `/marketing`, link actualizat
6. ✅ `/producer-portal/messages` - **REZOLVAT:** Pagină shell creată
7. ✅ `/producer-portal/impact` - **REZOLVAT:** Pagină shell creată

### 14.3. Consistență Navigație

- **Desktop:** Folosește navbar + mega menu + sidebar (pentru producer)
- **Mobile:** Folosește mobile sidebar + bottom nav (pentru producer)
- **Footer:** Link-uri comune pentru toți utilizatorii

---

## ✅ 15. Checklist Final

### 15.1. Verificări

- [x] Toate paginile publice au link-uri în navbar/footer
- [x] Toate paginile client au link-uri în user menu
- [x] Toate paginile producer au link-uri în sidebar/bottom nav/mega menu
- [x] Toate paginile business/logistics/investor/importer au link-uri în mega menu
- [x] Login flow este clar documentat
- [x] Redirect-urile după login sunt corecte
- [x] Protecția rutelor este corectă (`RequireAuth`)

### 15.2. De Făcut (Prioritizat)

**CRITIC (Link-uri orfane în Producer Sidebar):**
- [x] ✅ **REZOLVAT:** Toate link-urile orfane au fost rezolvate:
  - ✅ `/producer-portal/inventory` - **REZOLVAT:** Pagină shell creată
  - ✅ `/producer-portal/promotion` - **REZOLVAT:** Redirect către `/marketing`
  - ✅ `/producer-portal/messages` - **REZOLVAT:** Pagină shell creată
  - ✅ `/producer-portal/impact` - **REZOLVAT:** Pagină shell creată

**IMPORTANT (Link-uri lipsă în Mega Menu):**
- [x] ✅ **REZOLVAT:** Adaugă link direct către `/business-portal/documents` în mega menu "Pentru afacerea ta" → secțiunea "Servicii"
- [x] ✅ **REZOLVAT:** Adaugă link-uri directe către `/logistics-portal/commissions` și `/logistics-portal/contracts` în mega menu "Logistică și transport" → secțiunea "Resurse"

**OPȚIONAL (Îmbunătățiri):**
- [x] ✅ **REZOLVAT:** Sidebar-urile pentru business/logistics există și sunt integrate (vezi `BusinessSidebar` și `LogisticsSidebar`)
- [x] ✅ **REZOLVAT:** `/dashboard` este linkat corect în mobile menu și redirectează bazat pe rol (vezi `src/app/(site)/dashboard/page.tsx`)

---

---

## 📝 16. Rezumat Executiv - Probleme Identificate

### 16.1. Link-uri Orfane (CRITIC)

**Producer Sidebar:**
- ✅ `/producer-portal/inventory` - **REZOLVAT:** Pagină shell "Coming soon" creată
- ✅ `/producer-portal/promotion` - **REZOLVAT:** Redirect către `/producer-portal/marketing`, link actualizat în sidebar
- ✅ `/producer-portal/messages` - **REZOLVAT:** Pagină shell "Coming soon" creată
- ✅ `/producer-portal/impact` - **REZOLVAT:** Pagină shell "Coming soon" creată

**Acțiune realizată:**
- Paginile shell au fost create cu EmptyState component și mesaje "Coming soon"
- Link-ul `/producer-portal/promotion` redirectează către `/producer-portal/marketing`
- Sidebar-ul a fost actualizat să folosească `/producer-portal/marketing` direct

### 16.2. Link-uri Lipsă în Mega Menu

**Business Portal:**
- ✅ `/business-portal/documents` - **REZOLVAT:** Link adăugat în mega menu "Pentru afacerea ta" → secțiunea "Servicii"

**Logistics Portal:**
- ✅ `/logistics-portal/commissions` - **REZOLVAT:** Link adăugat în mega menu "Logistică și transport" → secțiunea "Resurse"
- ✅ `/logistics-portal/contracts` - **REZOLVAT:** Link adăugat în mega menu "Logistică și transport" → secțiunea "Resurse"

### 16.3. Pagini Verificate și Confirmate

✅ Toate paginile publice au link-uri în navbar/footer  
✅ Toate paginile client au link-uri în user menu  
✅ Toate paginile producer principale au link-uri în sidebar/mega menu  
✅ `/dashboard` există și redirectează bazat pe rol  
✅ `/contact`, `/terms`, `/privacy`, `/cookies`, `/anpc`, `/gdpr` există și sunt linkate în footer

### 16.4. Acțiuni Prioritare

**Prioritate ÎNALTĂ:**
1. ✅ **REZOLVAT:** Link-urile orfane din Producer Sidebar au fost rezolvate
   - `/producer-portal/inventory` - Pagină shell creată
   - `/producer-portal/promotion` - Redirect către `/marketing`, link actualizat
   - `/producer-portal/messages` - Pagină shell creată
   - `/producer-portal/impact` - Pagină shell creată

2. ✅ **REZOLVAT:** Link-uri adăugate în Mega Menu pentru Business Portal
   - `/business-portal/documents` adăugat în secțiunea "Servicii" → "Pentru afacerea ta"

3. ✅ **REZOLVAT:** Link-uri adăugate în Mega Menu pentru Logistics Portal
   - `/logistics-portal/commissions` adăugat în secțiunea "Resurse"
   - `/logistics-portal/contracts` adăugat în secțiunea "Resurse"

**Prioritate MEDIE:**
4. **Creează sidebar pentru Business Portal** (similar cu Producer Portal) pentru o navigare mai clară
5. **Creează sidebar pentru Logistics Portal** (similar cu Producer Portal) pentru o navigare mai clară
6. **Verifică accesibilitatea paginilor** - asigură-te că toate paginile au titluri corecte și meta tags

**Prioritate SCĂZUTĂ:**
7. **Documentează flow-urile de redirect** - adaugă diagrame simple pentru login/logout flows
8. **Creează un sitemap XML** pentru SEO (dacă nu există deja)

---

**Ultima actualizare:** 2025-01-27  
**Versiune:** 1.0

