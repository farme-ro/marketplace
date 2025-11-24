# 🔧 Super-Prompt Cursor: Refactor Navigație, Rute & Dashboards

## 📋 Context & Obiectiv

**Repo:** farme.ro frontend (Next.js App Router + TypeScript + Tailwind + shadcn/ui)

**Documente de referință:**
- `SITE_ROUTES_LIST.md` - Lista completă a rutelor și link-urilor
- `404_PAGES_AUDIT.md` - Lista rutelor 404 + priorități

**Obiectiv:** Curățare și reorganizare completă a navigației, rutelor și layout-urilor pentru a elimina 404-urile, canoniza rutele și crea o experiență de navigare modernă și consistentă.

**IMPORTANT:** Nu modifica logica de business sau apelurile la API. Lucrăm DOAR pe UI, navigație, redirect-uri și layout-uri.

---

## 0️⃣ Înțelege Structura Actuală

### Pași preliminari:

1. **Citește documentele:**
   - `SITE_ROUTES_LIST.md` - înțelege toate rutele existente
   - `404_PAGES_AUDIT.md` - identifică paginile lipsă

2. **Identifică componentele existente:**
   - `src/components/layout/site-layout-client.tsx` - Layout public cu navbar/footer
   - `src/components/layout/site-footer.tsx` - Footer public
   - `src/components/producer-portal/producer-dashboard-layout.tsx` - Layout dashboard producător
   - `src/components/producer-portal/producer-sidebar.tsx` - Sidebar producător

3. **Verifică route groups:**
   - `(site)/` - Rute publice
   - `(producer-portal)/` - Rute portal producător
   - `(admin)/` - Rute admin (dacă există)

**Nu modifica nimic până nu ai o imagine clară a structurii actuale.**

---

## 1️⃣ Canonizează Rutele

### 1.1. "How it works" / "Cum funcționează"

**Decizie:** Pagină canonică = `/cum-functioneaza-si-impact`

**Acțiuni:**

1. **Creează redirect-uri permanente (Next.js App Router):**

   Creează fișierele:
   - `src/app/(site)/how-it-works/page.tsx` - Redirect către `/cum-functioneaza-si-impact`
   - `src/app/(site)/cum-functioneaza/page.tsx` - Redirect către `/cum-functioneaza-si-impact`

   ```typescript
   // Exemplu pentru /how-it-works/page.tsx
   import { redirect } from 'next/navigation'
   
   export default function HowItWorksRedirect() {
     redirect('/cum-functioneaza-si-impact', 'replace') // sau 'push' dacă vrei history
   }
   ```

2. **Actualizează TOATE link-urile din cod:**

   Caută și înlocuiește:
   - `/how-it-works` → `/cum-functioneaza-si-impact`
   - `/cum-functioneaza` → `/cum-functioneaza-si-impact`
   - `/how-it-works#social-impact` → `/cum-functioneaza-si-impact#social-impact`
   - `/how-it-works#pricing-policy` → `/cum-functioneaza-si-impact#pricing-policy`

   **Locații de verificat:**
   - `src/components/layout/site-layout-client.tsx`
   - `src/components/layout/site-footer.tsx`
   - `src/components/site/*` (toate componentele)
   - `src/app/(site)/**/*.tsx` (toate paginile)

### 1.2. "Pentru producători" / "For producers"

**Decizie:** Pagină canonică = `/pentru-producatori` (RO)

**Acțiuni:**

1. **Creează redirect:**
   - `src/app/(site)/for-producers/page.tsx` → redirect către `/pentru-producatori`

2. **Actualizează TOATE link-urile:**
   - `/for-producers` → `/pentru-producatori`

   **Locații de verificat:**
   - Navbar, footer, CTA-uri, componente

### 1.3. Pagini de comisioane

**Decizie:**
- `/fees` - Pagină publică (pentru clienți)
- `/producer-portal/commissions` - Pagină portal (pentru producători)

**Acțiuni:**

1. **Verifică că link-urile trimit corect:**
   - Din navbar/footer public → `/fees`
   - Din dashboard producător → `/producer-portal/commissions`

2. **Actualizează link-urile greșite** (dacă există)

### 1.4. Pagini 404 de Prioritate Înaltă - CREEAZĂ-LE

#### `/orders` - Comenzile clientului

**Creează:** `src/app/(site)/orders/page.tsx`

**Requisit:**
- Layout public (folosește `SiteLayoutClient`)
- Listă de comenzi pentru clientul logat
- Carduri moderne, responsive
- Mock data pentru moment (TODO: conectare API)

**Structură:**
```typescript
// src/app/(site)/orders/page.tsx
'use client'

import { SiteLayoutClient } from '@/components/layout/site-layout-client'
import { Card, CardContent } from 'farme-ui'
import { Package, Calendar, MapPin } from 'lucide-react'

// TODO: Conectare la API pentru date reale
const mockOrders = [
  {
    id: 'ORD-001',
    date: '2024-01-15',
    status: 'delivered',
    total: 245,
    items: 3,
  },
  // ...
]

export default function ClientOrdersPage() {
  return (
    <SiteLayoutClient>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">Comenzile mele</h1>
        {/* Listă comenzi */}
      </div>
    </SiteLayoutClient>
  )
}
```

#### `/forgot-password` - Resetare parolă

**Creează:** `src/app/(site)/forgot-password/page.tsx`

**Requisit:**
- Form simplu cu email
- CTA "Trimite link de resetare"
- Design consistent cu `/login-client`
- TODO: integrare cu backend auth

#### `/producer-portal/orders/[id]` - Detalii comandă producător

**Creează:** `src/app/(site)/producer-portal/orders/[id]/page.tsx`

**Requisit:**
- Layout dashboard producător (`ProducerDashboardLayout`)
- Breadcrumb: "Comenzi → Comanda #1234"
- Secțiuni:
  - Detalii client
  - Listă produse
  - Total & status
  - Timeline status (plasată, pregătire, livrată)
- Mock data pentru moment

### 1.5. Pagini 404 de Prioritate Medie - CREEAZĂ-LE

#### `/producer-portal/shipping-guide` - Ghid livrări

**Status:** Există deja ca placeholder, dar trebuie îmbunătățită

**Acțiuni:**
- Extinde conținutul cu secțiuni:
  - Pregătire produse
  - Ambalare
  - Curieri disponibili
  - Easybox / pachetomat
  - Retur & donații
- Păstrează layout dashboard producător

#### `/producer-portal/finances` - Finanțe producător

**Status:** Există deja ca placeholder

**Acțiuni:**
- Adaugă carduri:
  - "Sold curent"
  - "Comisioane luna aceasta"
  - "Plăți viitoare"
- Tabel simplu pentru plăți
- Marchează datele ca "demo data / TODO integrate with backend"

#### `/producer-portal/support` - Suport producător

**Status:** Există deja ca placeholder

**Acțiuni:**
- Adaugă form simplu de contact
- Link către email suport
- Secțiune FAQ scurtă
- Păstrează layout dashboard producător

#### `/anpc` - Soluționare litigii

**Creează:** `src/app/(site)/anpc/page.tsx`

**Requisit:**
- Pagină legală obligatorie
- Text static despre ANPC
- Link către site ANPC
- Info ODR (Online Dispute Resolution)
- Layout public

#### `/producer-subscription` - REDIRECT

**Decizie:** NU vreau pagină dublă

**Acțiuni:**
1. Creează redirect: `src/app/(site)/producer-subscription/page.tsx` → `/producer-portal/subscriptions`
2. Actualizează toate link-urile către `/producer-portal/subscriptions`
3. Verifică `producer-subscription-cta.tsx` și actualizează

#### `/producers/[slug]/products` - Variantă A (Recomandat)

**Decizie:** Folosește anchor în loc de rută separată

**Acțiuni:**
1. Schimbă link-urile către `/producers/[slug]#products`
2. Adaugă secțiune `id="products"` în pagina `/producers/[slug]/page.tsx`
3. Șterge ruta `/producers/[slug]/products` dacă există
4. Verifică că nu e folosită nicăieri

### 1.6. Pagini 404 de Prioritate Scăzută

#### `/b2b` și `/diaspora`

**Decizie:** Elimină din navigație, lasă pagini simple

**Acțiuni:**
1. **Elimină link-urile din footer/navbar**
2. **Creează pagini simple** (dacă nu există):
   - `src/app/(site)/b2b/page.tsx` - "Work in progress / Va fi lansat curând"
   - `src/app/(site)/diaspora/page.tsx` - "Work in progress / Va fi lansat curând"
3. **Nu le mai lega din navigație principală**

---

## 2️⃣ Refactor Navigație: Mega-Menu + Meniuri Mobile

### 2.1. Meniu Principal (Desktop)

**Fișier:** `src/components/layout/site-layout-client.tsx`

**Structură nouă:**

```
Logo farme.ro (spre /)
├── Produse → /products
├── Producători → /producers
├── Cum funcționează → /cum-functioneaza-si-impact
├── Pentru producători → [MEGA-MENU] (nu merge direct)
├── Despre → /about
└── Contact → /contact

[Dreapta]
├── Search bar / icon
├── Contul meu / icon user (login/profil)
└── Toggle light/dark
```

**Acțiuni:**

1. **Actualizează navbar-ul:**
   - Elimină `/fees` din meniu principal (rămâne doar în mega-menu)
   - Schimbă `/for-producers` cu mega-menu trigger
   - Actualizează link-urile conform canonizărilor

2. **Implementează mega-menu pentru "Pentru producători":**

   Creează componentă: `src/components/layout/producer-mega-menu.tsx`

   **Structură mega-menu (3 coloane):**

   **Coloana 1 - Începe:**
   - "De ce să vinzi pe farme.ro" → `/pentru-producatori`
   - "Comisioane și taxe" → `/fees`
   - "Ghid livrări & logistică" → `/producer-portal/shipping-guide`

   **Coloana 2 - Portal producători:**
   - "Dashboard producător" → `/producer-portal/dashboard`
   - "Gestionează produse" → `/producer-portal/products`
   - "Comenzi" → `/producer-portal/orders`

   **Coloana 3 - Și mai mult:**
   - "Abonamente & beneficii" → `/producer-portal/subscriptions`
   - "Comisioane în portal" → `/producer-portal/commissions`
   - "Statistici & insight-uri" → `/producer-portal/insights`
   - "Suport producători" → `/producer-portal/support`

   **Design:**
   - Carduri clickable
   - Iconuri lucide-react
   - Text scurt (titlu + descriere 1 linie)
   - Culori: verde, galben, crem (sistemul existent)
   - Full width sub navbar
   - Hover/click pentru deschidere

### 2.2. Meniu Mobil / Tabletă

**Fișier:** `src/components/layout/mobile-nav-sidebar.tsx`

**Structură nouă:**

```
[Drawer/Side Sheet]
├── Produse
├── Producători
├── Cum funcționează
├── [Accordion] Pentru producători
│   ├── De ce să vinzi pe farme.ro
│   ├── Comisioane și taxe
│   ├── Ghid livrări & logistică
│   ├── Dashboard producător
│   ├── Gestionează produse
│   ├── Comenzi
│   ├── Abonamente & beneficii
│   ├── Comisioane în portal
│   ├── Statistici & insight-uri
│   └── Suport producători
├── Despre
└── Contact
```

**Acțiuni:**

1. **Actualizează mobile menu:**
   - Adaugă accordion pentru "Pentru producători"
   - Actualizează toate link-urile conform canonizărilor
   - Folosește același sistem de culori

---

## 3️⃣ Header & Footer pentru Dashboards

### 3.1. Layout Separ pentru Portal Producători

**Fișier:** `src/app/(site)/producer-portal/layout.tsx`

**Verifică dacă există deja.** Dacă nu, creează-l.

**Requisit:**

1. **NU folosește `<SiteNavbar>` și `<SiteFooter>`**

2. **Topbar simplu:**
   - Logo mic farme.ro
   - Text "farme.ro producer portal"
   - Avatar / dropdown user
   - Link "Mergi la site" → `/`

3. **Sidebar existent:**
   - Folosește `ProducerSidebar` existent
   - Actualizează link-urile dacă e nevoie

4. **Footer minim:**
   - "Farme.ro © {year}"
   - Linkuri mici: "Termeni", "Politica de confidențialitate"
   - NU întregul SiteFooter

**Asigură-te că TOATE rutele `producer-portal/*` folosesc acest layout:**
- `/producer-portal/dashboard`
- `/producer-portal/orders`
- `/producer-portal/orders/[id]` (nou)
- `/producer-portal/products`
- `/producer-portal/subscriptions`
- `/producer-portal/commissions`
- `/producer-portal/shipping-guide`
- `/producer-portal/finances`
- `/producer-portal/support`
- `/producer-portal/settings`
- `/producer-portal/insights`

### 3.2. Layout Separ pentru Dashboard Clienți

**Dacă există pagini client tip dashboard:**

**Creează:** `src/app/(site)/client-dashboard/layout.tsx` (sau nume similar)

**Requisit:**

1. **Topbar:**
   - Logo + "Contul meu"
   - Buton logout

2. **Sidebar:**
   - "Comenzile mele" → `/orders`
   - "Date personale" (dacă există)
   - "Adrese de livrare" (dacă există)
   - "Setări cont"

3. **Footer minim** (similar cu producer portal)

**Aplică la:**
- `/orders` (nou)
- `/dashboard-protected` (dacă există)

### 3.3. Stil Unificat

**Folosește aceleași token-uri:**
- Fundal: `bg-surface` / `bg-muted` (NU galben toxic, NU maro)
- Text: `text-foreground`
- Carduri: `rounded-2xl`, `shadow-sm`
- Spațiere consistentă

**Verifică light + dark mode** pentru dashboards să fie lizibile.

---

## 4️⃣ Curățare Footer Public

**Fișier:** `src/components/layout/site-footer.tsx`

### 4.1. Elimină Link-uri Către Rute Inexistente

**Elimină/comentează:**
- `/b2b` (lasă pagina, dar elimină din footer)
- `/diaspora` (lasă pagina, dar elimină din footer)

### 4.2. Actualizează Secțiunea "Legal & info"

**Link-uri corecte:**
- Termeni și condiții → `/terms`
- Politica de confidențialitate → `/privacy`
- Politica de cookies → `/cookies`
- ANPC → `/anpc` (noua pagină creată)
- GDPR → `/gdpr`

### 4.3. Actualizează Secțiunea "Pentru producători"

**Link-uri corecte:**
- Devino producător partener → `/pentru-producatori`
- Abonamente & beneficii → `/producer-portal/subscriptions`
- Comisioane & taxe → `/fees`
- Ghid livrări → `/producer-portal/shipping-guide`
- Login / Register → `/producer-portal/login` și `/producer-portal/register`

### 4.4. Actualizează Secțiunea "Pentru clienți"

**Link-uri corecte:**
- Cum funcționează → `/cum-functioneaza-si-impact`
- Producători → `/producers`
- Produse → `/products`
- Impact social → `/cum-functioneaza-si-impact#social-impact` (anchor)
- FAQ → `/faq`

---

## 5️⃣ Validare & QA

### 5.1. Verificări Tehnice

1. **Rulează:**
   ```bash
   npm run lint
   npm run build
   ```

2. **Verifică că:**
   - Niciun link din header/footer/dashboard sidebar duce la 404
   - Rutele redirectate răspund corect (308/301)
   - Toate paginile se compilează fără erori

### 5.2. Teste Manuale

**Testează:**
- Desktop + mobile
- Light + dark mode
- Portal producător: toate paginile
- Pagina `/orders` (nou)
- Pagina `/forgot-password` (nou)
- Redirect-urile funcționează

### 5.3. Actualizează Documentația

1. **Actualizează `404_PAGES_AUDIT.md`:**
   - Marchează rutele ca rezolvate
   - Adaugă note despre redirect-uri

2. **Actualizează `SITE_ROUTES_LIST.md`:**
   - Actualizează lista cu noile rute canonice
   - Adaugă redirect-urile
   - Marchează rutele eliminate din navigație

---

## 📝 Checklist Final

### Rute Canonizate
- [ ] `/how-it-works` → redirect către `/cum-functioneaza-si-impact`
- [ ] `/cum-functioneaza` → redirect către `/cum-functioneaza-si-impact`
- [ ] `/for-producers` → redirect către `/pentru-producatori`
- [ ] `/producer-subscription` → redirect către `/producer-portal/subscriptions`
- [ ] `/producers/[slug]/products` → schimbat în anchor `#products`

### Pagini Noi Create
- [ ] `/orders` - Comenzile clientului
- [ ] `/forgot-password` - Resetare parolă
- [ ] `/producer-portal/orders/[id]` - Detalii comandă
- [ ] `/anpc` - Soluționare litigii
- [ ] `/b2b` - Work in progress (eliminat din nav)
- [ ] `/diaspora` - Work in progress (eliminat din nav)

### Pagini Îmbunătățite
- [ ] `/producer-portal/shipping-guide` - Conținut extins
- [ ] `/producer-portal/finances` - Carduri + tabel
- [ ] `/producer-portal/support` - Form + FAQ

### Navigație
- [ ] Navbar desktop actualizat
- [ ] Mega-menu "Pentru producători" implementat
- [ ] Mobile menu actualizat cu accordion
- [ ] Footer curățat și actualizat

### Layout-uri
- [ ] Layout producer portal separat (fără SiteNavbar/SiteFooter)
- [ ] Layout client dashboard separat (dacă e nevoie)
- [ ] Stil unificat pentru toate dashboards

### Link-uri Actualizate
- [ ] Toate link-urile din cod folosesc rutele canonice
- [ ] Niciun link duce la 404
- [ ] Redirect-urile funcționează

### Documentație
- [ ] `404_PAGES_AUDIT.md` actualizat
- [ ] `SITE_ROUTES_LIST.md` actualizat

---

## 🎨 Design Guidelines

### Culori
- **NU folosi maro**
- Verde muted elegant (token-uri existente)
- Galben/crem soft
- Fundal dashboard: `bg-surface` / `bg-muted`

### Componente
- Carduri: `rounded-2xl`, `shadow-sm`
- Spațiere generoasă: `p-5 lg:p-6`
- Iconuri: `lucide-react` (NU react-icons/fi)

### Responsive
- Mobile-first
- Mega-menu: full width pe desktop
- Mobile menu: drawer/side sheet

---

## ⚠️ Reguli Importante

1. **NU modifica logica de business** sau apelurile la API
2. **Folosește mock data** acolo unde backend-ul nu e pregătit (marchează cu TODO)
3. **Păstrează stilul vizual modern** deja introdus
4. **Fii consecvent cu naming-ul:** `SiteNavbar`, `ProducerPortalLayout`, `ClientDashboardLayout`
5. **Testează light + dark mode** pentru toate paginile

---

**END PROMPT**

**După finalizare, confirmă:**
- Ce rute au fost canonizate
- Ce pagini noi au fost create
- Ce link-uri au fost actualizate
- Dacă există probleme rămase

