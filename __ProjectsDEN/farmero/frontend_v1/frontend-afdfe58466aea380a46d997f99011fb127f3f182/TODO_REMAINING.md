# Todo-uri Rămase - Analiză Chat

## 📋 Rezumat

Acest document conține toate task-urile neterminate identificate din analiza chat-ului `cursor_analyze_unfinished_todos_in_mark.md`.

---

## 🔴 CRITIC - Backend API Endpoints (Necesare pentru funcționare)

Următoarele endpoint-uri trebuie implementate pe backend (`api.farme.ro`):

### 1. Endpoint-uri Publice (Fără Autentificare)

- ✅ `GET /regions` - **CRITIC pentru homepage**
  - Status: Ruta Next.js este deprecated, dar backend-ul trebuie să fie disponibil
  - Folosit în: HeroSection, RegionsSection, Products page, Producers page

- ✅ `GET /public/producers` - **CRITIC pentru homepage**
  - Status: Ruta Next.js este deprecated, dar backend-ul trebuie să fie disponibil
  - Folosit în: ProducersSection (homepage), Producers page

- ✅ `GET /public/products` - **CRITIC pentru homepage**
  - Status: Ruta Next.js este deprecated, dar backend-ul trebuie să fie disponibil
  - Folosit în: ProductsSection (homepage), Products page

- ✅ `GET /public/producers/:slug` - pentru pagina de detalii producător
  - Status: Ruta Next.js este deprecated, dar backend-ul trebuie să fie disponibil

- ✅ `GET /public/products/:slug` - pentru pagina de detalii produs
  - Status: Ruta Next.js este deprecated, dar backend-ul trebuie să fie disponibil

- ✅ `GET /health/db` - pentru status page
  - Status: Necesar pentru verificarea statusului bazei de date

### 2. Endpoint-uri Protejate (Cu Autentificare)

- ⚠️ `GET /cart` - Obține coșul utilizatorului
  - Status: Ruta Next.js `/api/cart` este deprecated și accesează DB direct
  - **NOTĂ:** Coșul folosește acum Zustand store cu localStorage (client-side)
  - TODO: Verifică dacă este necesară sincronizare cu backend-ul
  - TODO: Elimină ruta Next.js după ce backend-ul implementează endpoint-ul

- ⚠️ `POST /cart` sau `POST /cart/items` - Adaugă produs în coș
  - Status: Trebuie implementat pe backend (dacă este necesară sincronizare)
  - **NOTĂ:** Coșul folosește acum Zustand store cu localStorage (client-side)

- ⚠️ `PUT /cart/items/:itemId` - Actualizează cantitatea
  - Status: Ruta Next.js `/api/cart/items/[id]` există și accesează DB direct
  - TODO: Verifică dacă este folosită sau dacă coșul este doar client-side
  - TODO: Elimină ruta Next.js după ce backend-ul implementează endpoint-ul

- ⚠️ `DELETE /cart/items/:itemId` - Șterge item din coș
  - Status: Ruta Next.js `/api/cart/items/[id]` există și accesează DB direct
  - TODO: Verifică dacă este folosită sau dacă coșul este doar client-side
  - TODO: Elimină ruta Next.js după ce backend-ul implementează endpoint-ul

- ✅ `GET /orders` - Obține lista de comenzi
  - Status: **COMPLETAT** - `src/lib/api/orders.ts` apelează direct backend-ul

- ✅ `POST /orders` - Creează comandă nouă
  - Status: **COMPLETAT** - `src/lib/api/orders.ts` apelează direct backend-ul

- ✅ `GET /orders/:id` - Obține detalii comandă
  - Status: **COMPLETAT** - `src/lib/api/orders.ts` apelează direct backend-ul

---

## 🟡 În Progres / De Făcut

### 1. Eliminare Rute Next.js API Deprecated

Următoarele rute Next.js API sunt marcate ca deprecated și trebuie eliminate **după** ce backend-ul implementează endpoint-urile:

#### Rute care returnează 410 Gone (pot fi eliminate imediat):
- ✅ `src/app/api/regions/route.ts` - Returnează 410, poate fi eliminat
- ✅ `src/app/api/public/products/route.ts` - Returnează 410, poate fi eliminat
- ✅ `src/app/api/public/producers/route.ts` - Returnează 410, poate fi eliminat
- ✅ `src/app/api/public/producers/[slug]/route.ts` - Returnează 410, poate fi eliminat
- ✅ `src/app/api/public/products/[slug]/route.ts` - Returnează 410, poate fi eliminat

#### Rute care încă accesează DB (trebuie verificate dacă mai sunt folosite):
- ⚠️ `src/app/api/cart/route.ts` - **DEPRECATED** - Accesează DB direct
  - **NOTĂ:** Coșul folosește acum Zustand store cu localStorage (client-side)
  - TODO: Verifică dacă mai este folosit în cod (probabil nu, dacă coșul este client-side)
  - TODO: Elimină după confirmarea că nu mai este folosit

- ⚠️ `src/app/api/cart/items/route.ts` - **DEPRECATED** - Accesează DB direct
  - **NOTĂ:** Coșul folosește acum Zustand store cu localStorage (client-side)
  - TODO: Verifică dacă mai este folosit în cod
  - TODO: Elimină după confirmarea că nu mai este folosit

- ⚠️ `src/app/api/cart/items/[id]/route.ts` - **DEPRECATED** - Accesează DB direct
  - **NOTĂ:** Coșul folosește acum Zustand store cu localStorage (client-side)
  - TODO: Verifică dacă mai este folosit în cod
  - TODO: Elimină după confirmarea că nu mai este folosit

- ⚠️ `src/app/api/orders/route.ts` - **DEPRECATED** - Accesează DB direct
  - **STATUS:** **VERIFICAT** - Nu mai este folosit în cod
  - Frontend-ul folosește acum `src/lib/api/orders.ts` care apelează direct backend-ul
  - TODO: **POATE FI ELIMINAT** după confirmarea finală că nu mai este folosit

- ⚠️ `src/app/api/orders/[id]/route.ts` - **DEPRECATED** - Accesează DB direct
  - TODO: Verifică dacă mai este folosit în cod
  - TODO: Elimină după confirmarea că nu mai este folosit

- ⚠️ `src/app/api/orders/[id]/mark-paid/route.ts` - **DEPRECATED** - Accesează DB direct
  - TODO: Verifică dacă mai este folosit în cod (probabil doar în admin)
  - TODO: Elimină după confirmarea că nu mai este folosit sau refactorizează să apeleze backend-ul

### 2. Funcții Deprecated în API Client

Următoarele funcții sunt marcate ca deprecated și ar trebui eliminate sau actualizate:

- ⚠️ `getPublicProducts()` în `src/lib/api/public/products.ts`
  - @deprecated Folosește `getProducts()` în loc
  - TODO: Caută utilizări și înlocuiește cu `getProducts()`

- ⚠️ `getPublicProductBySlug()` în `src/lib/api/public/products.ts`
  - @deprecated Folosește `getProductBySlug()` în loc
  - TODO: Caută utilizări și înlocuiește cu `getProductBySlug()`

- ⚠️ `getPublicProducers()` în `src/lib/api/public/producers.ts`
  - @deprecated Folosește `getProducers()` în loc
  - TODO: Caută utilizări și înlocuiește cu `getProducers()`

- ⚠️ `getPublicProducerBySlug()` în `src/lib/api/public/producers.ts`
  - @deprecated Folosește `getProducerBySlug()` în loc
  - TODO: Caută utilizări și înlocuiește cu `getProducerBySlug()`

### 3. Refactor Autentificare

- ⚠️ Verificare dacă autentificarea folosește Next.js API routes
  - TODO: Verifică `src/lib/auth.ts` și rutele de autentificare
  - TODO: Dacă folosesc Next.js API routes, refactorizează să apeleze direct backend-ul

### 4. Refactor Admin Routes

- ⚠️ Verificare rute admin
  - TODO: Verifică dacă rutele admin (`src/app/(admin)/admin/*`) folosesc Next.js API routes
  - TODO: Dacă da, refactorizează să apeleze direct backend-ul

### 5. Refactor Producer Portal Routes

- ⚠️ Verificare rute producer portal
  - TODO: Verifică dacă rutele producer portal (`src/app/(producer-portal)/producer-portal/*`) folosesc Next.js API routes
  - TODO: Dacă da, refactorizează să apeleze direct backend-ul

### 6. Rezolvare Erori ESLint

- ⚠️ Erori de `@typescript-eslint/no-explicit-any` (folosirea de `any`)
  - TODO: Înlocuiește `any` cu tipuri specifice

- ⚠️ Variabile nefolosite
  - TODO: Elimină variabilele nefolosite

### 7. Implementare WebSocket (Opțional)

- ⚠️ Implementare WebSocket pe backend pentru notificări real-time
  - TODO: Opțional - pentru notificări real-time
  - Status: Frontend-ul are deja componente pentru WebSocket (`src/components/socket/*`)

---

## ✅ Completat

### 1. Refactor Rute Protejate
- ✅ `src/lib/api/orders.ts` - Refactorizat să apeleze direct backend-ul
  - `createOrder()` folosește `post()` din `apiClient.ts`
  - `getOrders()` folosește `get()` din `apiClient.ts`
  - `getOrderById()` folosește `get()` din `apiClient.ts`
  - Autentificarea este gestionată automat prin `requireAuth: true`

### 2. Rezolvare CSP
- ✅ Eliminat fallback-ul la `localhost:3001` în production
- ✅ În production, dacă `NEXT_PUBLIC_API_URL` nu este setat, se aruncă o eroare clară

### 3. Marcare Rute Next.js API ca Deprecated
- ✅ `src/app/api/cart/route.ts` - marcat ca deprecated
- ✅ `src/app/api/orders/route.ts` - marcat ca deprecated
- ✅ `src/app/api/regions/route.ts` - marcat ca deprecated și returnează 410
- ✅ `src/app/api/public/products/route.ts` - marcat ca deprecated și returnează 410
- ✅ `src/app/api/public/producers/route.ts` - marcat ca deprecated și returnează 410
- ✅ `src/app/api/public/producers/[slug]/route.ts` - marcat ca deprecated și returnează 410
- ✅ `src/app/api/public/products/[slug]/route.ts` - marcat ca deprecated și returnează 410

### 4. Actualizare Logică API Client
- ✅ Detectare automată a endpoint-urilor `/orders` și `/cart` ca protejate
- ✅ Cache strategy actualizată pentru endpoint-urile critice

---

## 📝 Checklist Post-Deployment (Toate Neterminate)

### Verificări de Bază
- [ ] Build status - verifică că build-ul reușește
- [ ] Homepage - verifică că homepage-ul se încarcă corect
- [ ] Console errors - verifică că nu există erori în consolă
- [ ] Network tab - verifică că request-urile se fac către backend-ul corect

### Rute Critice de Testat
- [ ] Marketplace (homepage, products, producers)
- [ ] Autentificare (login, register)
- [ ] Dashboard producător
- [ ] Admin panel
- [ ] SEO (meta tags, sitemap, robots.txt)

### Teste Funcționale
- [ ] API integration - verifică că toate endpoint-urile funcționează
- [ ] Imagini - verifică că imaginile se încarcă corect
- [ ] WebSocket - verifică că notificările funcționează (dacă este implementat)
- [ ] Dark/Light mode - verifică că tema se schimbă corect
- [ ] Formulare - verifică că formularele funcționează
- [ ] Responsive - verifică că site-ul este responsive

### Verificări de Performanță
- [ ] Lighthouse score
- [ ] First Contentful Paint (FCP)
- [ ] Time to Interactive (TTI)
- [ ] Bundle size

---

## 🎯 Priorități

### Prioritate 1 - CRITIC (Blochează funcționarea)
1. **Backend API Endpoints** - Endpoint-urile publice trebuie să fie disponibile pentru ca homepage-ul să funcționeze
   - `GET /regions`
   - `GET /public/producers`
   - `GET /public/products`
   - `GET /public/producers/:slug`
   - `GET /public/products/:slug`

### Prioritate 2 - IMPORTANT (Necesare pentru funcționalități)
1. **Backend Cart Endpoints** - Necesare pentru funcționalitatea coșului
   - `GET /cart`
   - `POST /cart`
   - `PUT /cart/:itemId`
   - `DELETE /cart/:itemId`

2. **Eliminare Rute Deprecated** - Curățenie cod
   - Elimină rutele Next.js API care returnează 410
   - Verifică și elimină rutele care încă accesează DB dacă nu mai sunt folosite

### Prioritate 3 - ÎMBUNĂTĂȚIRI (Opțional)
1. Refactor autentificare (dacă folosește Next.js API routes)
2. Refactor admin routes
3. Refactor producer portal routes
4. Rezolvare erori ESLint
5. Implementare WebSocket (opțional)

---

## 📌 Note

- Toate rutele Next.js API care accesează DB direct trebuie eliminate în favoarea apelurilor directe către backend
- Frontend-ul folosește acum `apiClient.ts` pentru toate request-urile către backend
- Autentificarea este gestionată automat prin `requireAuth: true` în `apiClient.ts`
- Rutele publice nu necesită autentificare
- Rutele protejate necesită token JWT în header-ul `Authorization`

---

**Ultima actualizare:** 2025-01-19 (continuare)
**Bazat pe analiza:** `cursor_analyze_unfinished_todos_in_mark.md`

---

## 📊 Statistici Finale

- **11 rute Next.js API eliminate** (toate nefolosite)
- **4 funcții deprecated eliminate** (toate nefolosite)
- **3 TODO-uri rezolvate** (regionId, error boundary, tipuri)
- **5+ locații cu `any` înlocuite cu tipuri specifice**
- **0 erori ESLint**
- **Cod mai curat, mai tipizat și mai ușor de întreținut**

---

## ✅ Progres Recent (2025-01-19)

### Completat
1. ✅ **Eliminat rute Next.js API deprecated care returnează 410**
   - `src/app/api/regions/route.ts` - ELIMINAT
   - `src/app/api/public/products/route.ts` - ELIMINAT
   - `src/app/api/public/producers/route.ts` - ELIMINAT
   - `src/app/api/public/producers/[slug]/route.ts` - ELIMINAT
   - `src/app/api/public/products/[slug]/route.ts` - ELIMINAT

2. ✅ **Eliminat rute Next.js API care accesează DB și nu mai sunt folosite**
   - `src/app/api/cart/route.ts` - ELIMINAT (coșul folosește Zustand store client-side)
   - `src/app/api/cart/items/route.ts` - ELIMINAT
   - `src/app/api/cart/items/[id]/route.ts` - ELIMINAT
   - `src/app/api/orders/route.ts` - ELIMINAT (folosește `src/lib/api/orders.ts`)
   - `src/app/api/orders/[id]/route.ts` - ELIMINAT
   - `src/app/api/orders/[id]/mark-paid/route.ts` - ELIMINAT

3. ✅ **Eliminat funcții deprecated din API client**
   - `getPublicProducts()` - ELIMINAT (alias nefolosit)
   - `getPublicProductBySlug()` - ELIMINAT (alias nefolosit)
   - `getPublicProducers()` - ELIMINAT (alias nefolosit)
   - `getPublicProducerBySlug()` - ELIMINAT (alias nefolosit)

4. ✅ **Verificat erori ESLint**
   - Nu există erori ESLint în cod

5. ✅ **Verificat autentificare/admin/producer portal**
   - Autentificarea, admin și producer portal folosesc încă Next.js API routes
   - Acestea necesită refactor mai mare când backend-ul implementează endpoint-urile corespunzătoare
   - Rutele Next.js API pentru acestea rămân active pentru moment (sunt necesare pentru funcționare)

### Rezultat
- **11 rute Next.js API eliminate** (toate nefolosite)
- **4 funcții deprecated eliminate** (toate nefolosite)
- **0 erori ESLint**
- Codul este mai curat și mai ușor de întreținut

### Progres Adițional (2025-01-19 - Continuare)

6. ✅ **Rezolvat TODO-uri din cod**
   - Adăugat `regionId` la interfața `ProductData` în `src/lib/api/producer/index.ts`
   - Actualizat pagina de editare produs să folosească `regionId` din product (`src/app/(producer-portal)/producer-portal/products/[id]/edit/page.tsx`)
   - Îmbunătățit comentariul pentru error boundary (TODO rămâne pentru integrarea Sentry când va fi disponibil)

7. ✅ **Înlocuit `any` cu tipuri specifice**
   - `src/app/(producer-portal)/producer-portal/dashboard/page.tsx` - folosește acum `ProducerData`, `ProductData`, `OrderData`, `CommissionData`
   - `src/app/(site)/products/ProductsPageClient.tsx` - params are acum tipizate corect
   - `src/lib/utils/performance.ts` - `pendingRequests` folosește acum `Promise<unknown>`
   - `src/app/(producer-portal)/producer-portal/products/[id]/edit/page.tsx` - error handling tipizat
   - `src/app/(site)/orders/page.tsx` - error handling tipizat

8. ⚠️ **TODO-uri care rămân (necesită backend sau servicii externe)**
   - Contact page - necesită endpoint backend pentru trimiterea email-urilor
   - Error boundary - necesită integrare cu serviciu de error tracking (Sentry, etc.)

