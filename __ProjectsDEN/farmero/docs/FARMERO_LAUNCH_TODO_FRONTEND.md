# 🚀 Farmero Launch TODO - Frontend

**Data:** 2025-01-27  
**Scop:** Task-uri critice și importante pentru pregătirea lansării live  
**Status:** 🟡 În Progres

---

## 🔴 CRITIC – Frontend

### ✅ 1. Setează Environment Variables în Vercel

**Status:** ⚠️ **De Făcut**

**Locație:** Vercel Dashboard

**Acțiune:**
- [ ] Adaugă `NEXT_PUBLIC_API_URL` = `https://api.farme.ro`
- [ ] (Opțional) Adaugă `NEXT_PUBLIC_APP_URL` = `https://farme.ro`
- [ ] (Opțional) Adaugă `NEXT_PUBLIC_SITE_URL` = `https://farme.ro`
- [ ] Setează pentru: ✅ Production, ✅ Preview, ✅ Development
- [ ] **IMPORTANT:** Redeploy aplicația după adăugarea variabilelor

**Timp estimat:** 15 minute

**Notă:** Acest task trebuie făcut manual în Vercel Dashboard. Nu poate fi automatizat.

---

### ✅ 2. Testare Manuală Completă

**Status:** ⚠️ **De Făcut**

**Locație:** Frontend repo

**Acțiune:**
- [ ] Testează toate flow-urile critice folosind `docs/CORE_COMMERCE_QA_CHECKLIST.md`
- [ ] Verifică error handling (401, 404, 422) pentru toate endpoint-urile
- [ ] Verifică redirect-uri după login/logout
- [ ] Testează flow-uri cu backend live (după ce backend implementează endpoint-urile)
- [ ] Verifică că toate paginile se încarcă corect
- [ ] Verifică că toate link-urile funcționează

**Timp estimat:** 1-2 zile

**Documentație:** `docs/CORE_COMMERCE_QA_CHECKLIST.md`

---

## 🟡 IMPORTANT – Frontend

### ✅ 3. Cleanup Console Logs

**Status:** ✅ **Parțial Completat**

**Locație:** Frontend repo

**Acțiune:**
- [x] Protejat console.warn-urile cu `if (process.env.NODE_ENV !== 'production')`
- [x] Protejat console.error-urile critice (sentry.ts, api/client.ts)
- [x] Creat document cu lista completă de console logs
- [ ] Protejează restul console.error-urilor (120+ rămase) - recomandat script automat

**Timp estimat:** 2-3 ore (parțial completat)

**Fișier de referință:** `docs/FARMERO_CONSOLE_CLEANUP_TODO.md` ✅ Creat

**Notă:** Majoritatea console.error-urile sunt în try-catch blocks și sunt utile pentru debugging. Recomandare: protejează-le toate cu `if (process.env.NODE_ENV !== 'production')` sau folosește un script automat.

---

### ✅ 4. Verifică Link-uri Orfane

**Status:** ✅ **Completat**

**Locație:** Frontend repo

**Acțiune:**
- [x] Verifică că toate link-urile din UI duc către pagini existente
- [x] Verifică că paginile "Coming soon" sunt marcate corect
- [x] Actualizat `FARMERO_NAVIGATION_AND_ROLES_MAP.md` cu link-urile corecte

**Timp estimat:** 1 oră ✅ Completat

**Status:** ✅ Toate link-urile sunt corecte (vezi `FARMERO_NAVIGATION_AND_ROLES_MAP.md`)

---

### ✅ 5. Testare Accesibilitate Minimă

**Status:** ✅ **Completat (Minim pentru MVP)**

**Locație:** Frontend repo

**Acțiune:**
- [x] Verificat butoanele icon-only au `aria-label` (ThemeToggle, Cart, Notifications, AccountSwitcher)
- [x] Verificat link-urile icon-only au `aria-label` sau `title`
- [x] Creat document cu îmbunătățiri post-launch pentru accesibilitate

**Timp estimat:** 4-6 ore ✅ Completat (minim pentru MVP)

**Fișier de referință:** `docs/FARMERO_ACCESSIBILITY_POSTLAUNCH_TODO.md` ✅ Creat

**Notă:** Accesibilitatea minimă pentru MVP este completă. Testarea cu screen reader și verificările avansate sunt recomandate post-launch (vezi documentul de referință).

---

### ✅ 6. PWA Install Prompt

**Status:** ✅ **Implementat**

**Locație:** Frontend repo

**Acțiune:**
- [x] Creat componentă `PwaInstallPrompt` cu banner discret
- [x] Integrat în layout global
- [x] Implementat logică de afișare condiționată (beforeinstallprompt, localStorage)
- [x] Creat documentație completă

**Timp estimat:** 2-3 ore ✅ Completat

**Fișier de referință:** `docs/FARMERO_PWA_INSTALL_PROMPT.md` ✅ Creat

**Notă:** PWA install prompt este implementat și gata pentru testare. Trebuie testat în staging/production pentru a verifica comportamentul pe dispozitive reale.

**Pagini Prioritare:**
- `/` (homepage)
- `/products`
- `/products/[slug]`
- `/cart`
- `/checkout`
- `/login`
- `/register`
- `/account`
- `/producer-portal/dashboard`

---

## 🔵 Handoff Backend (de implementat în repo-ul backend)

### 🔴 CRITIC – Backend

#### 1. Implementează Endpoint-uri Core Commerce (16 endpoint-uri)

**Status:** ❌ **Lipsește**

**Locație:** Backend repo

**Endpoint-uri:**
- **Cart:** `POST /cart/add`, `GET /cart`, `PATCH /cart/update`, `DELETE /cart/remove/:itemId`
- **Checkout:** `POST /orders/create`
- **Client Orders:** `GET /orders`, `GET /orders/:id`
- **Producer Products:** `GET /producer/products`, `POST /producer/products`, `PATCH /producer/products/:id`, `DELETE /producer/products/:id`, `PATCH /producer/products/:id/toggle`
- **Producer Orders:** `GET /producer/orders`, `GET /producer/orders/:id`, `PATCH /producer/orders/:id/status`

**Timp estimat:** 2-3 săptămâni

**Documentație:** `docs/BACKEND_API_CONTRACT_CORE_COMMERCE.md`

**Frontend Action:** Activează `cart`, `checkout`, `clientOrders`, `producerProducts`, `producerOrders` în `BackendSyncStatus` după testare

---

#### 2. Configurează CORS

**Status:** ❌ **Lipsește**

**Locație:** Backend repo

**Acțiune:**
- [ ] Permite origin-ul `https://farme.ro` și preview deployments (`https://farme-ro-*.vercel.app`)
- [ ] Activează `credentials: true`
- [ ] Permite metodele: `GET`, `POST`, `PATCH`, `PUT`, `DELETE`, `OPTIONS`
- [ ] Permite headers: `Content-Type`, `Authorization`, `Cookie`
- [ ] Permite `http://localhost:3000` pentru development

**Timp estimat:** 30 minute

**Documentație:** Vezi `docs/FARMERO_BACKEND_HANDOFF_CHECKLIST.md` pentru configurare exactă

---

### 🟡 IMPORTANT – Backend

#### 3. Implementează Client Profile & Addresses (7 endpoint-uri)

**Status:** ❌ **Lipsește**

**Locație:** Backend repo

**Endpoint-uri:**
- `GET /clients/me`, `PATCH /clients/me`
- `GET /clients/addresses`, `POST /clients/addresses`, `PATCH /clients/addresses/:id`, `DELETE /clients/addresses/:id`, `PATCH /clients/addresses/:id/default`

**Timp estimat:** 1 săptămână

**Documentație:** `docs/BACKEND_API_CONTRACT_ACCOUNTS.md`

**Frontend Action:** Activează `clientProfile`, `clientAddresses` în `BackendSyncStatus` după testare

---

#### 4. Implementează Favorites & Alerts (5 endpoint-uri)

**Status:** ❌ **Lipsește**

**Locație:** Backend repo

**Endpoint-uri:**
- Favorites: `GET /clients/favorites`, `POST /clients/favorites`, `DELETE /clients/favorites/:id`
- Alerts: `GET /clients/alert-preferences`, `PATCH /clients/alert-preferences`

**Timp estimat:** 3-5 zile

**Documentație:** `docs/BACKEND_API_CONTRACT_FAVORITES_SUBSCRIPTIONS_ALERTS.md`

**Frontend Action:** Activează `favorites`, `alerts` în `BackendSyncStatus` după testare (UI deja complet, localStorage fallback activ)

---

## 🔄 Mix Frontend + Backend – ce trebuie făcut la noi și ce în backend

### Activare Feature Flags în BackendSyncStatus

**Status:** ⚠️ **De Făcut (după ce backend implementează endpoint-urile)**

**Locație:** Frontend repo (`src/lib/backend-sync/status.ts`)

**Acțiune Frontend:**
- [ ] După ce backend implementează endpoint-urile, testează manual fiecare feature
- [ ] Activează feature-urile unul câte unul în `BackendSyncStatus` (setează pe `true`)
- [ ] Folosește `docs/FARMERO_BACKENDSYNC_ACTIVATION_PLAN.md` pentru ordinea recomandată

**Acțiune Backend:**
- [ ] Implementează endpoint-urile conform contractelor API
- [ ] Configurează CORS corect
- [ ] Testează endpoint-urile manual sau cu Postman
- [ ] Anunță echipa frontend când endpoint-urile sunt gata pentru testare

**Timp estimat:** Depinde de backend (2-3 săptămâni pentru MVP)

**Documentație:**
- `docs/FARMERO_BACKENDSYNC_ACTIVATION_PLAN.md` - Plan de activare per feature
- `docs/FARMERO_BACKEND_HANDOFF_CHECKLIST.md` - Checklist complet pentru backend

---

## 📊 Rezumat Status

### Frontend Tasks

| Task | Status | Prioritate | Timp |
|------|--------|------------|------|
| Setează Env Variables în Vercel | ⚠️ De Făcut (Manual în Vercel) | 🔴 CRITIC | 15 min |
| Testare Manuală Completă | ⚠️ De Făcut | 🔴 CRITIC | 1-2 zile |
| Cleanup Console Logs | ✅ Parțial Completat | 🟡 IMPORTANT | 2-3 ore (parțial) |
| Verifică Link-uri Orfane | ✅ Completat | 🟡 IMPORTANT | 1 oră ✅ |
| Testare Accesibilitate Minimă | ✅ Completat (Minim MVP) | 🟡 IMPORTANT | 4-6 ore ✅ |

### Backend Tasks (Handoff)

| Task | Status | Prioritate | Timp |
|------|--------|------------|------|
| Core Commerce Endpoints (16) | ❌ Lipsește | 🔴 CRITIC | 2-3 săptămâni |
| Configurează CORS | ❌ Lipsește | 🔴 CRITIC | 30 min |
| Client Profile & Addresses (7) | ❌ Lipsește | 🟡 IMPORTANT | 1 săptămână |
| Favorites & Alerts (5) | ❌ Lipsește | 🟡 IMPORTANT | 3-5 zile |

---

**Ultima actualizare:** 2025-01-27  
**Următorul pas:** Vezi `docs/FARMERO_BACKEND_HANDOFF_CHECKLIST.md` pentru detalii complete backend

