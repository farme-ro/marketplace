# Audit Loose Ends - farme.ro Frontend

**Data:** 2025-01-21 (Actualizat)  
**Scop:** Identificarea tuturor problemelor, funcționalităților incomplete și inconsistențelor înainte de traduceri

---

## 📋 Rezumat Executiv

### Status General: 🟢 **Bun, gata pentru traduceri**

**Total probleme identificate:** 35+  
**Prioritate înaltă:** 3 (backend dependencies)  
**Prioritate medie:** 18  
**Prioritate scăzută:** 14+

**✅ Actualizare:** Paginile critice și calculul transportului sunt implementate!

---

## 🔴 PRIORITATE ÎNALTĂ - Trebuie rezolvate înainte de lansare

### 1. Endpoint-uri backend lipsă (documentate în cod)

#### Client Profile & Addresses
- **Status:** ⚠️ TODO în cod
- **Locație:** `src/lib/api/client-profile.ts:46, 84`
- **Endpoint-uri:**
  - `PATCH /clients/me` - Actualizare profil client
  - `GET /clients/addresses` - Listă adrese
  - `POST /clients/addresses` - Creare adresă
  - `PATCH /clients/addresses/:id` - Actualizare adresă
  - `DELETE /clients/addresses/:id` - Ștergere adresă
  - `PATCH /clients/addresses/:id/default` - Setare adresă principală
- **Acțiune:** Backend trebuie să implementeze aceste endpoint-uri

#### Resetare parolă
- **Status:** ⚠️ TODO în cod
- **Locație:** `src/lib/api/auth.ts:836`
- **Endpoint:** `POST /auth/client/forgot-password`
- **Notă:** Pagina `/forgot-password` există și funcționează, dar backend endpoint-ul lipsește
- **Acțiune:** Backend trebuie să implementeze endpoint-ul

#### Upload logo/cover producător
- **Status:** ⚠️ TODO în cod
- **Locație:** `src/app/(site)/producer-portal/settings/page.tsx:497, 530`
- **Cod:** `TODO: Upload logo funcțional când backend suportă`
- **Acțiune:** Implementează upload-ul când backend-ul este gata

#### Upload fișiere suport
- **Status:** ⚠️ TODO în cod
- **Locație:** `src/app/(site)/producer-portal/support/page.tsx:177`
- **Acțiune:** Implementează upload-ul când backend-ul suportă

---

## 🟡 PRIORITATE MEDIE - Îmbunătățiri importante

### 1. Pagini 404 - Funcționalități secundare

#### `/producer-portal/shipping-guide`
- **Status:** ❌ Lipsă
- **Prioritate:** Medie
- **Locație:** `src/components/layout/site-footer.tsx:147`

#### `/producer-portal/finances`
- **Status:** ❌ Lipsă
- **Prioritate:** Medie
- **Locație:** `src/app/(site)/producer-portal/settings/page.tsx:75`

#### `/anpc`
- **Status:** ❌ Lipsă
- **Prioritate:** Medie (legal requirement)
- **Locație:** `src/components/layout/site-footer.tsx:236`

#### `/producer-subscription`
- **Status:** ❌ Lipsă
- **Prioritate:** Medie
- **Locație:** `src/components/producer-profile/producer-subscription-cta.tsx:52`

#### `/producers/[slug]/products`
- **Status:** ❌ Lipsă
- **Prioritate:** Medie
- **Locație:** `src/components/producer-profile/producer-hero.tsx:142`
- **Notă:** Există `/producers/[slug]` dar nu `/producers/[slug]/products`

### 2. Funcționalități incomplete

#### Conectare la API pentru produse producător
- **Status:** ⚠️ TODO în cod
- **Locație:** `src/app/(site)/producer-portal/products/page.tsx:5`
- **Cod:** `TODO: Conectare la API pentru lista de produse și toggle status`

#### Filtrare produse după producător
- **Status:** ⚠️ TODO în cod
- **Locație:** `src/components/producer-profile/producer-products-section.tsx:40`
- **Cod:** `TODO: Filter by producerId when API supports it`

#### Deactivare produs
- **Status:** ⚠️ TODO în cod
- **Locație:** `src/components/producer-portal/quick-stock-panel.tsx:71`
- **Cod:** `TODO: API call to deactivate product`

#### Add to cart din pagina producător
- **Status:** ⚠️ TODO în cod
- **Locație:** `src/app/(site)/producers/[slug]/products/page.tsx:132`
- **Cod:** `TODO: Implement add to cart functionality`

#### Producer ID în popular products
- **Status:** ⚠️ TODO în cod
- **Locație:** `src/components/site/popular-products-carousel.tsx:82`
- **Cod:** `producerId: '', // TODO: Get from product when available`

### 3. Cleanup Cod

#### Console logs în production
- **Status:** ⚠️ Identificat
- **Problema:** 56+ apeluri `console.log/warn/error` în cod
- **Locații:** Multiple fișiere în `src/app/(site)`
- **Acțiune:** Elimină console.log-urile din production, păstrează doar console.error pentru debugging
- **Recomandare:** Folosește error tracking service (Sentry) pentru production

#### Folosirea de `any` în TypeScript
- **Status:** ⚠️ Identificat
- **Locații:**
  - `src/lib/api/client.ts:90` - `catch (fetchError: any)`
  - Alte locații potențiale
- **Acțiune:** Înlocuiește `any` cu tipuri specifice sau `unknown`

#### Funcții deprecated
- **Status:** ⚠️ Identificat
- **Funcții:**
  - `getPublicProducts()` - @deprecated, folosește `getProducts()`
  - `getPublicProductBySlug()` - @deprecated, folosește `getProductBySlug()`
  - `getPublicProducers()` - @deprecated, folosește `getProducers()`
  - `getPublicProducerBySlug()` - @deprecated, folosește `getProducerBySlug()`
- **Acțiune:** Verifică utilizări și înlocuiește cu funcțiile noi

### 4. Integrare servicii externe

#### Error Tracking (Sentry)
- **Status:** ⚠️ TODO în cod
- **Locații:**
  - `src/app/error.tsx:28`
  - `src/components/error-boundary.tsx:41`
- **Acțiune:** Integrează Sentry sau alt serviciu de error tracking

### 5. Rute duplicate/confuze

#### `/how-it-works` vs `/cum-functioneaza` vs `/cum-functioneaza-si-impact`
- **Status:** ⚠️ Există 3 pagini similare
- **Problema:** Linkuri către toate trei în diferite locații
- **Recomandare:** Standardizare pe o singură rută sau redirect-uri

### 6. Internationalization (i18n)

#### Mesaje hardcodate
- **Status:** ⚠️ Identificat
- **Problema:** 10+ fișiere cu mesaje hardcodate în română/engleză
- **Acțiune:** Migrează mesajele la sistemul de i18n existent (`useI18n`)
- **Notă:** Sistemul de i18n există (`src/lib/i18n/`) dar nu este folosit peste tot

---

## 🟢 PRIORITATE SCĂZUTĂ - Nice to have

### 1. Pagini 404 - Funcționalități opționale

#### `/b2b`
- **Status:** ❌ Lipsă
- **Prioritate:** Scăzută
- **Locație:** `src/components/layout/site-footer.tsx:179`
- **Notă:** TODO comentat în cod

#### `/diaspora`
- **Status:** ❌ Lipsă
- **Prioritate:** Scăzută (viitor feature)
- **Locație:** `src/components/layout/site-footer.tsx:196`
- **Notă:** TODO comentat în cod (viitor feature)

### 2. ESLint Configuration

#### Configurare ESLint incompletă
- **Status:** ⚠️ Necesită configurare
- **Problema:** ESLint cere configurare la prima rulare
- **Acțiune:** Configurează ESLint cu Next.js plugin

### 3. Teste

#### Lipsă teste unitare
- **Status:** ❌ Nu există teste
- **Impact:** Scăzut (nu este prioritate pentru MVP)
- **Recomandare:** Adaugă teste după lansare

### 4. Performance Optimizations

#### Lazy loading componente grele
- **Status:** ⚠️ Parțial implementat
- **Acțiune:** Verifică și optimizează lazy loading pentru toate componentele grele

#### Code splitting pentru rute
- **Status:** ⚠️ Next.js face automat, dar poate fi optimizat
- **Acțiune:** Review manual pentru rute mari

---

## ✅ Status Actualizat - Ce s-a rezolvat

### Pagini critice - ✅ IMPLEMENTATE

#### `/producer-portal/orders/[id]` - ✅ EXISTĂ
- **Status:** ✅ Implementată complet
- **Locație:** `src/app/(site)/producer-portal/orders/[id]/page.tsx`
- **Funcționalități:** Detalii comandă, update status, confirmare, pregătire, livrare

#### `/forgot-password` - ✅ EXISTĂ
- **Status:** ✅ Implementată complet
- **Locație:** `src/app/(site)/forgot-password/page.tsx`
- **Funcționalități:** Formular resetare parolă, integrare cu API
- **Notă:** Backend endpoint lipsește (`POST /auth/client/forgot-password`)

#### `/orders` - ✅ EXISTĂ
- **Status:** ✅ Implementată complet
- **Locație:** `src/app/(site)/orders/page.tsx`
- **Funcționalități:** Listă comenzi client, reorder, detalii comandă

### Funcționalități - ✅ IMPLEMENTATE

#### Calcul cost transport (`/cart`) - ✅ IMPLEMENTAT
- **Status:** ✅ Implementat complet
- **Locație:** `src/lib/utils/shipping.ts`
- **Funcționalități:** 
  - `calculateShippingCost()` - Calculează transport bazat pe total
  - `getShippingMessage()` - Mesaje despre transport
  - Transport gratuit pentru comenzi peste 200 lei
- **Notă:** TODO rămâne pentru integrare cu backend pentru calcul dinamic bazat pe adresă

---

## 📊 Categorii de Probleme

### Backend Dependencies (10+)
- Endpoint-uri pentru client profile & addresses
- Endpoint pentru resetare parolă
- Upload logo/cover producător
- Upload fișiere suport

### Pagini Lipsă (8)
- 0 cu prioritate înaltă (toate implementate ✅)
- 5 cu prioritate medie
- 2 cu prioritate scăzută

### Funcționalități Incomplete (5+)
- Upload fișiere
- Filtrare produse
- Add to cart din anumite locații
- Conectare API produse producător

### Cleanup Cod (3)
- Console logs în production
- Folosirea de `any` în TypeScript
- Funcții deprecated

### Integrări Externe (1)
- Error tracking (Sentry)

### Standardizare (2)
- Rute duplicate pentru "how it works"
- Mesaje hardcodate (i18n)

---

## ✅ Recomandări Prioritizate

### Înainte de traduceri (Must Have)

1. **Cleanup console logs:**
   - Elimină console.log-urile din production
   - Păstrează doar console.error pentru debugging
   - Integrează error tracking service (Sentry)

2. **Migrare mesaje la i18n:**
   - Review manual al mesajelor hardcodate
   - Migrare la sistemul de i18n existent (`useI18n`)
   - Testare traduceri

3. **Înlocuire funcții deprecated:**
   - Caută utilizări ale funcțiilor deprecated
   - Înlocuiește cu funcțiile noi
   - Elimină funcțiile deprecated

### După traduceri (Should Have)

4. **Creează paginile cu prioritate medie:**
   - `/producer-portal/shipping-guide`
   - `/producer-portal/finances`
   - `/anpc`
   - `/producer-subscription`
   - `/producers/[slug]/products`

5. **Finalizează funcționalitățile incomplete:**
   - Conectare API produse producător
   - Filtrare produse după producător
   - Add to cart din toate locațiile

6. **Standardizează rutele:**
   - Alege o singură rută pentru "how it works"

7. **Îmbunătățește TypeScript:**
   - Înlocuiește `any` cu tipuri specifice
   - Verifică toate locațiile cu `any`

### Nice to Have (Future)

8. **Integrează servicii externe:**
   - Sentry pentru error tracking

9. **Adaugă teste:**
   - Teste unitare pentru componente critice

10. **Creează paginile opționale:**
    - `/b2b`
    - `/diaspora`

11. **Performance optimizations:**
    - Lazy loading pentru componente grele
    - Code splitting optimizat

---

## 📝 Note Importante

### Backend Dependencies
- Multe funcționalități așteaptă endpoint-uri backend
- UI-ul este pregătit și afișează mesaje clare când endpoint-urile nu sunt disponibile
- Prioritatea este pe backend pentru a activa funcționalitățile existente

### Error Handling
- ✅ Error handling este bine implementat
- ✅ Pagini de eroare globale există
- ⚠️ Error tracking (Sentry) necesită integrare
- ⚠️ Console logs trebuie eliminate din production

### Code Quality
- ✅ TypeScript este bine folosit
- ✅ Componente sunt reutilizabile
- ⚠️ ESLint necesită configurare
- ⚠️ Folosirea de `any` trebuie redusă
- ❌ Lipsă teste

### UX/UI
- ✅ Design consistent
- ✅ Loading states unificate
- ✅ Toast system standard
- ✅ Responsive design

### Internationalization
- ✅ Sistemul de i18n există (`src/lib/i18n/`)
- ✅ Fișiere de traducere pentru: ro, en, fr, it, es, de
- ⚠️ Mesaje hardcodate trebuie migrate la i18n
- ⚠️ Nu toate componentele folosesc i18n

---

## 🎯 Acțiuni Imediate

1. **Cleanup console logs** (1-2 ore)
   - Caută toate console.log/warn/error
   - Elimină din production, păstrează doar pentru debugging
   - Integrează error tracking

2. **Migrare mesaje la i18n** (2-3 ore)
   - Review manual al mesajelor hardcodate
   - Migrare la `useI18n`
   - Testare traduceri

3. **Înlocuire funcții deprecated** (30 min)
   - Caută utilizări
   - Înlocuiește cu funcțiile noi

4. **Îmbunătățește TypeScript** (1 ora)
   - Înlocuiește `any` cu tipuri specifice
   - Verifică toate locațiile

**Timp estimat total:** ~5-7 ore pentru acțiunile imediate

---

## 📚 Documentație Există

- ✅ `404_PAGES_AUDIT.md` - Audit complet pagini 404
- ✅ `TODO_REMAINING.md` - TODO-uri rămase
- ✅ `docs/FRONTEND_QA_REPORT.md` - Raport QA complet
- ✅ `docs/API_ENDPOINTS_USED.md` - Endpoint-uri API folosite
- ✅ `CLIENT_FEATURES_V1_REPORT.md` - Funcționalități client
- ✅ `PRODUCER_PORTAL_V1_REPORT.md` - Funcționalități producător
- ✅ `SITE_ROUTES_LIST.md` - Lista completă a rutelor

---

## 🎉 Status Final

**Status:** 🟢 **Gata pentru traduceri!**

Toate paginile critice sunt implementate. Problemele rămase sunt:
- Backend dependencies (endpoint-uri care trebuie implementate pe backend)
- Cleanup cod (console logs, funcții deprecated, `any` types)
- Migrare mesaje la i18n
- Pagini secundare opționale

**Recomandare:** Poți începe traducerile. Cleanup-ul codului și migrarea mesajelor la i18n pot fi făcute în paralel cu traducerile.
