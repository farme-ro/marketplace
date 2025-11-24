# 🔄 Farmero BackendSync Activation Plan

**Data:** 2025-01-27  
**Scop:** Plan complet de activare incrementală a feature-urilor backend prin `BackendSyncStatus`  
**Status:** 🟡 Așteaptă implementare backend

---

## 📋 Preambul

Acest document conține planul de activare pentru toate feature-urile din `BackendSyncStatus`. Fiecare feature poate fi activat independent după ce backend-ul implementează endpoint-urile necesare și sunt testate manual.

**Fișier de configurare:** `src/lib/backend-sync/status.ts`

**Cum se activează:**
1. Backend implementează endpoint-urile necesare
2. Frontend testează manual flow-ul complet
3. Setează feature-ul pe `true` în `BackendSyncStatus`
4. Commit și deploy

---

## 📊 Tabel Complet: Feature Flags

| Feature Key | Zona | Endpoint-uri Necesare | Status Frontend | Pagini/Componente Afectate | Testare Manuală |
|-------------|------|----------------------|-----------------|----------------------------|-----------------|
| `clientProfile` | Client | `GET /clients/me`, `PATCH /clients/me` | ✅ Gata | `/account`, `src/lib/api/client-profile.ts` | [Vezi checklist](#clientprofile) |
| `clientAddresses` | Client | `GET /clients/addresses`, `POST /clients/addresses`, `PATCH /clients/addresses/:id`, `DELETE /clients/addresses/:id`, `PATCH /clients/addresses/:id/default` | ✅ Gata | `/account`, `/checkout`, `src/lib/api/client-profile.ts` | [Vezi checklist](#clientaddresses) |
| `cart` | Client | `POST /cart/items`, `GET /cart`, `PATCH /cart/items/:itemId`, `DELETE /cart/items/:itemId` | ✅ Gata | `/cart`, `/checkout`, `src/lib/api/cart.ts`, `src/lib/store/cart.ts` | [Vezi checklist](#cart) |
| `checkout` | Client | `POST /orders` | ✅ Gata | `/checkout`, `src/lib/api/orders.ts` | [Vezi checklist](#checkout) |
| `clientOrders` | Client | `GET /orders`, `GET /orders/:id` | ✅ Gata | `/orders`, `/orders/[id]`, `src/lib/api/orders.ts` | [Vezi checklist](#clientorders) |
| `producerProducts` | Producer | `GET /producer/products`, `POST /producer/products`, `PATCH /producer/products/:id`, `DELETE /producer/products/:id`, `PATCH /producer/products/:id/toggle` | ✅ Gata | `/producer-portal/products`, `/producer-portal/products/new`, `/producer-portal/products/[id]/edit`, `src/lib/api/producer/products.ts` | [Vezi checklist](#producerproducts) |
| `producerOrders` | Producer | `GET /producer/orders`, `GET /producer/orders/:id`, `PATCH /producer/orders/:id/status` | ✅ Gata | `/producer-portal/orders`, `/producer-portal/orders/[id]`, `src/lib/api/producer/orders.ts` | [Vezi checklist](#producerorders) |
| `favorites` | Client | `GET /clients/favorites`, `POST /clients/favorites`, `DELETE /clients/favorites/:id` | ✅ Gata | `/account/favorites`, `src/lib/api/favorites.ts`, `src/lib/store/favorites.ts` | [Vezi checklist](#favorites) |
| `subscriptions` | Client | `GET /clients/subscriptions`, `POST /clients/subscriptions`, `PATCH /clients/subscriptions/:id` | ✅ Gata | `/account/subscriptions`, `src/lib/api/subscriptions.ts` | [Vezi checklist](#subscriptions) |
| `alerts` | Client | `GET /clients/alert-preferences`, `PATCH /clients/alert-preferences` | ✅ Gata | `/account/alerts`, `src/lib/api/alerts.ts` | [Vezi checklist](#alerts) |
| `businessDashboard` | Business | `GET /business/dashboard`, `GET /business/orders`, `GET /business/stats` | ✅ Gata | `/business-portal/dashboard`, `src/lib/api/business/dashboard.ts` | [Vezi checklist](#businessdashboard) |
| `logisticsDashboard` | Logistics | `GET /logistics/dashboard`, `GET /logistics/deliveries`, `GET /logistics/stats` | ✅ Gata | `/logistics-portal/dashboard`, `src/lib/api/logistics/dashboard.ts` | [Vezi checklist](#logisticsdashboard) |
| `investorDashboard` | Investor | `GET /investor/analytics`, `GET /investor/transactions`, `GET /investor/top-items` | ✅ Gata | `/investor-portal/dashboard`, `src/lib/api/investor/analytics.ts` | [Vezi checklist](#investordashboard) |
| `investorMetrics` | Investor | `GET /investor/metrics` | ✅ Gata | `/investor-portal/dashboard`, `src/lib/api/farme-investor.ts` | [Vezi checklist](#investormetrics) |
| `notifications` | Global | `GET /notifications`, `POST /notifications/read`, `GET /notifications/preferences` | ✅ Gata | Header (notification center), `src/lib/api/notifications.ts`, `src/lib/store/farme-notifications.ts` | [Vezi checklist](#notifications) |
| `producerMarketing` | Producer | `GET /producers/featured`, `GET /producers/:id/visibility`, `GET /producer/marketing/settings`, `PATCH /producer/marketing/settings`, `POST /producer/marketing/social/connect`, `DELETE /producer/marketing/social/disconnect` | ✅ Gata | `/producer-portal/marketing`, `src/lib/api/farme-marketing.ts`, `src/lib/api/farme-producers-marketing.ts` | [Vezi checklist](#producermarketing) |
| `subscriptionsClient` | Client | `GET /subscriptions/public/plans` | ✅ Gata | Homepage (subscriptions teaser), `src/lib/api/farme-subscriptions-public.ts` | [Vezi checklist](#subscriptionsclient) |
| `subscriptionsClientActive` | Client | `GET /clients/subscriptions`, `POST /clients/subscriptions`, `PATCH /clients/subscriptions/:id` | ✅ Gata | `/account/subscriptions`, `src/lib/api/farme-subscriptions-client.ts` | [Vezi checklist](#subscriptionsclientactive) |
| `subscriptionsProducer` | Producer | `GET /producers/subscriptions`, `POST /producers/subscriptions/upgrade` | ✅ Gata | `/producer-portal/subscriptions`, `src/lib/api/farme-subscriptions-producer.ts` | [Vezi checklist](#subscriptionsproducer) |
| `farmeroPoints` | Client | `GET /farmero-points/me`, `GET /farmero-points/transactions` | ✅ Gata | `/account/points`, `src/lib/api/farme-points.ts` | [Vezi checklist](#farmeropoints) |
| `partiesAndContracts` | Producer/Business/Logistics | `GET /contracts`, `GET /contracts/:id`, `GET /contracts/templates` | ✅ Gata | `/producer-portal/contracts`, `/business-portal/contracts`, `/logistics-portal/contracts`, `src/lib/api/farme-contracts.ts`, `src/lib/api/farme-parties.ts` | [Vezi checklist](#partiesandcontracts) |
| `feesAndStatements` | Producer/Business/Logistics | `GET /fees/rules`, `GET /statements`, `GET /statements/:id` | ✅ Gata | `/producer-portal/sales-commissions`, `/producer-portal/statements/[id]`, `src/lib/api/farme-fees.ts`, `src/lib/api/farme-statements.ts` | [Vezi checklist](#feesandstatements) |
| `donations` | Client | `GET /donations/summary`, `POST /donations/intent`, `GET /donations/preferences`, `PATCH /donations/preferences` | ✅ Gata | `/account/donations`, `src/lib/api/farme-donations.ts` | [Vezi checklist](#donations) |

---

## 🎯 Ordinea Recomandată de Activare

### Faza 1: Core Commerce (🔴 CRITIC pentru MVP)

**Prioritate:** 🔴 **CRITIC**

**Feature-uri:**
1. `cart` - Coș de cumpărături
2. `checkout` - Checkout și creare comandă
3. `clientOrders` - Comenzi client
4. `producerProducts` - Produse producător
5. `producerOrders` - Comenzi producător

**Timp estimat:** 2-3 săptămâni (backend)

**Dependențe:** Niciuna (sunt independente)

**Documentație:** `docs/BACKEND_API_CONTRACT_CORE_COMMERCE.md`

---

### Faza 2: Profile & Addresses (🟡 IMPORTANT)

**Prioritate:** 🟡 **IMPORTANT**

**Feature-uri:**
1. `clientProfile` - Profil client
2. `clientAddresses` - Adrese client

**Timp estimat:** 1 săptămână (backend)

**Dependențe:** Niciuna (sunt independente)

**Documentație:** `docs/BACKEND_API_CONTRACT_ACCOUNTS.md`

---

### Faza 3: Favorites & Alerts (🟡 IMPORTANT)

**Prioritate:** 🟡 **IMPORTANT**

**Feature-uri:**
1. `favorites` - Favorite produse/producători
2. `alerts` - Preferințe notificări

**Timp estimat:** 3-5 zile (backend)

**Dependențe:** Niciuna (sunt independente, localStorage fallback activ)

**Documentație:** `docs/BACKEND_API_CONTRACT_FAVORITES_SUBSCRIPTIONS_ALERTS.md`

---

### Faza 4: Notifications (🟡 IMPORTANT)

**Prioritate:** 🟡 **IMPORTANT**

**Feature-uri:**
1. `notifications` - Sistem notificări

**Timp estimat:** 1 săptămână (backend)

**Dependențe:** Niciuna (sunt independente)

**Documentație:** `docs/BACKEND_API_CONTRACT_NOTIFICATIONS.md`

---

### Faza 5: Business & Logistics (🟢 BONUS)

**Prioritate:** 🟢 **BONUS** (nu este critic pentru MVP)

**Feature-uri:**
1. `businessDashboard` - Dashboard business
2. `logisticsDashboard` - Dashboard logistics

**Timp estimat:** 1 săptămână (backend)

**Dependențe:** Niciuna (sunt independente)

**Documentație:** `docs/BACKEND_API_CONTRACT_BUSINESS.md`, `docs/BACKEND_API_CONTRACT_LOGISTICS.md`

---

### Faza 6: Investor (🟢 BONUS)

**Prioritate:** 🟢 **BONUS** (nu este critic pentru MVP)

**Feature-uri:**
1. `investorDashboard` - Dashboard investor
2. `investorMetrics` - Metrics anonimizate

**Timp estimat:** 1 săptămână (backend)

**Dependențe:** Niciuna (sunt independente)

**Documentație:** `docs/BACKEND_API_CONTRACT_INVESTOR.md`

---

### Faza 7: Marketing & Monetization (🟢 BONUS)

**Prioritate:** 🟢 **BONUS** (nu este critic pentru MVP)

**Feature-uri:**
1. `producerMarketing` - Marketing producător
2. `subscriptionsClient` - Abonamente publice
3. `subscriptionsClientActive` - Abonamente client active
4. `subscriptionsProducer` - Abonamente producător
5. `farmeroPoints` - Points și rewards

**Timp estimat:** 2-3 săptămâni (backend)

**Dependențe:** Niciuna (sunt independente)

**Documentație:** `docs/BACKEND_API_CONTRACT_FARMERO_MARKETING.md`, `docs/BACKEND_API_CONTRACT_FARMERO_SUBSCRIPTIONS_PUBLIC.md`, `docs/FARMERO_SUBSCRIPTIONS_AND_POINTS_SPEC.md`

---

### Faza 8: Contracts & Statements (🟢 BONUS)

**Prioritate:** 🟢 **BONUS** (nu este critic pentru MVP)

**Feature-uri:**
1. `partiesAndContracts` - Contracte
2. `feesAndStatements` - Comisioane și extrase
3. `donations` - Donations

**Timp estimat:** 2 săptămâni (backend)

**Dependențe:** Niciuna (sunt independente)

**Documentație:** `docs/BACKEND_API_CONTRACT_*` (various)

---

## ✅ Checklist-uri de Testare Manuală

### <a name="clientprofile"></a>clientProfile

**Endpoint-uri necesare:**
- `GET /clients/me`
- `PATCH /clients/me`

**Checklist:**
- [ ] Obține profil client → Afișează datele corect
- [ ] Actualizează profil → Profil actualizat
- [ ] 401 → Redirect la login
- [ ] 422 → Mesaj de validare

**Pagini afectate:**
- `/account` - Secțiunea "Profil"

**Fișiere:**
- `src/lib/api/client-profile.ts`
- `src/app/(site)/account/page.tsx`

---

### <a name="clientaddresses"></a>clientAddresses

**Endpoint-uri necesare:**
- `GET /clients/addresses`
- `POST /clients/addresses`
- `PATCH /clients/addresses/:id`
- `DELETE /clients/addresses/:id`
- `PATCH /clients/addresses/:id/default`

**Checklist:**
- [ ] Listă adrese → Afișează toate adresele
- [ ] Creare adresă → Adresă creată
- [ ] Editare adresă → Adresă actualizată
- [ ] Ștergere adresă → Adresă eliminată
- [ ] Setare adresă principală → Adresă setată ca default
- [ ] 401 → Redirect la login
- [ ] 404 → Mesaj "Adresa nu a fost găsită"

**Pagini afectate:**
- `/account` - Secțiunea "Adrese"
- `/checkout` - Selectare adresă livrare

**Fișiere:**
- `src/lib/api/client-profile.ts`
- `src/app/(site)/account/page.tsx`
- `src/app/(site)/checkout/page.tsx`

---

### <a name="cart"></a>cart

**Endpoint-uri necesare:**
- `POST /cart/items`
- `GET /cart`
- `PATCH /cart/items/:itemId`
- `DELETE /cart/items/:itemId`

**Checklist:**
- [ ] Adăugare produs în coș (guest) → localStorage
- [ ] Adăugare produs în coș (autentificat) → Backend
- [ ] Sincronizare cart la login → Merge local + backend
- [ ] Update cantitate → Cantitate actualizată
- [ ] Ștergere item → Item eliminat
- [ ] 401 → Redirect la login
- [ ] 422 → Mesaj stoc insuficient

**Pagini afectate:**
- `/cart` - Pagina coșului
- `/checkout` - Checkout (folosește cart)
- Header (icon coș cu badge)

**Fișiere:**
- `src/lib/api/cart.ts`
- `src/lib/store/cart.ts`
- `src/app/(site)/cart/page.tsx`
- `src/app/(site)/checkout/page.tsx`

---

### <a name="checkout"></a>checkout

**Endpoint-uri necesare:**
- `POST /orders`

**Checklist:**
- [ ] Checkout cu date valide → Comandă creată
- [ ] Checkout cu eroare 401 → Redirect la login
- [ ] Checkout cu eroare 422 → Mesaj stoc insuficient
- [ ] Checkout cu coș gol → Mesaj "Coșul este gol"
- [ ] Clear cart după comandă reușită → Coș gol

**Pagini afectate:**
- `/checkout` - Pagina checkout

**Fișiere:**
- `src/lib/api/orders.ts`
- `src/app/(site)/checkout/page.tsx`

---

### <a name="clientorders"></a>clientOrders

**Endpoint-uri necesare:**
- `GET /orders`
- `GET /orders/:id`

**Checklist:**
- [ ] Listă comenzi (empty state) → Afișează mesaj "Nu ai comenzi"
- [ ] Listă comenzi (cu comenzi) → Afișează toate comenzile
- [ ] Detalii comandă → Afișează toate detaliile
- [ ] Reorder functionality → Adaugă produse în coș
- [ ] 401 → Redirect la login
- [ ] 404 → Mesaj "Comanda nu a fost găsită"

**Pagini afectate:**
- `/orders` - Lista comenzilor
- `/orders/[id]` - Detalii comandă

**Fișiere:**
- `src/lib/api/orders.ts`
- `src/app/(site)/orders/page.tsx`
- `src/app/(site)/orders/[id]/page.tsx`

---

### <a name="producerproducts"></a>producerProducts

**Endpoint-uri necesare:**
- `GET /producer/products`
- `POST /producer/products`
- `PATCH /producer/products/:id`
- `DELETE /producer/products/:id`
- `PATCH /producer/products/:id/toggle`

**Checklist:**
- [ ] Listă produse → Afișează toate produsele
- [ ] Toggle active/inactive → Status actualizat
- [ ] Creare produs nou → Produs creat
- [ ] Editare produs → Produs actualizat
- [ ] Ștergere produs → Produs eliminat
- [ ] 401 → Redirect la login
- [ ] 403 → Mesaj "Nu ai permisiuni"
- [ ] 404 → Mesaj "Produsul nu a fost găsit"

**Pagini afectate:**
- `/producer-portal/products` - Lista produselor
- `/producer-portal/products/new` - Creare produs
- `/producer-portal/products/[id]/edit` - Editare produs

**Fișiere:**
- `src/lib/api/producer/products.ts`
- `src/app/(site)/producer-portal/products/page.tsx`
- `src/app/(site)/producer-portal/products/new/page.tsx`
- `src/app/(site)/producer-portal/products/[id]/edit/page.tsx`

---

### <a name="producerorders"></a>producerOrders

**Endpoint-uri necesare:**
- `GET /producer/orders`
- `GET /producer/orders/:id`
- `PATCH /producer/orders/:id/status`

**Checklist:**
- [ ] Listă comenzi → Afișează toate comenzile
- [ ] Filtrare după status → Filtrare funcționează
- [ ] Detalii comandă → Afișează toate detaliile
- [ ] Update status → Status actualizat
- [ ] 401 → Redirect la login
- [ ] 403 → Mesaj "Nu ai permisiuni"
- [ ] 404 → Mesaj "Comanda nu a fost găsită"
- [ ] 422 → Mesaj tranziție invalidă

**Pagini afectate:**
- `/producer-portal/orders` - Lista comenzilor
- `/producer-portal/orders/[id]` - Detalii comandă

**Fișiere:**
- `src/lib/api/producer/orders.ts`
- `src/app/(site)/producer-portal/orders/page.tsx`
- `src/app/(site)/producer-portal/orders/[id]/page.tsx`

---

### <a name="favorites"></a>favorites

**Endpoint-uri necesare:**
- `GET /clients/favorites`
- `POST /clients/favorites`
- `DELETE /clients/favorites/:id`

**Checklist:**
- [ ] Listă favorite → Afișează produsele favorite
- [ ] Adaugă la favorite → Produs adăugat
- [ ] Șterge din favorite → Produs eliminat
- [ ] 401 → Redirect la login
- [ ] 404 → Mesaj "Produsul nu a fost găsit"

**Pagini afectate:**
- `/account/favorites` - Pagina favorite
- Product cards (icon heart)

**Fișiere:**
- `src/lib/api/favorites.ts`
- `src/lib/store/favorites.ts`
- `src/app/(site)/account/favorites/page.tsx`

---

### <a name="subscriptions"></a>subscriptions

**Endpoint-uri necesare:**
- `GET /clients/subscriptions`
- `POST /clients/subscriptions`
- `PATCH /clients/subscriptions/:id`

**Checklist:**
- [ ] Listă abonamente → Afișează abonamentele
- [ ] Creare abonament → Abonament creat
- [ ] Actualizare abonament → Abonament actualizat
- [ ] 401 → Redirect la login
- [ ] 422 → Mesaj de validare

**Pagini afectate:**
- `/account/subscriptions` - Pagina abonamente

**Fișiere:**
- `src/lib/api/subscriptions.ts`
- `src/app/(site)/account/subscriptions/page.tsx`

---

### <a name="alerts"></a>alerts

**Endpoint-uri necesare:**
- `GET /clients/alert-preferences`
- `PATCH /clients/alert-preferences`

**Checklist:**
- [ ] Obține preferințe → Afișează preferințele
- [ ] Actualizează preferințe → Preferințe actualizate
- [ ] 401 → Redirect la login
- [ ] 422 → Mesaj de validare

**Pagini afectate:**
- `/account/alerts` - Pagina preferințe notificări

**Fișiere:**
- `src/lib/api/alerts.ts`
- `src/app/(site)/account/alerts/page.tsx`

---

### <a name="businessdashboard"></a>businessDashboard

**Endpoint-uri necesare:**
- `GET /business/dashboard`
- `GET /business/orders`
- `GET /business/stats`

**Checklist:**
- [ ] Dashboard → Afișează stats și comenzi recente
- [ ] 401 → Redirect la login
- [ ] 403 → Mesaj "Nu ai permisiuni"

**Pagini afectate:**
- `/business-portal/dashboard` - Dashboard business

**Fișiere:**
- `src/lib/api/business/dashboard.ts`
- `src/app/(site)/business-portal/dashboard/page.tsx`

---

### <a name="logisticsdashboard"></a>logisticsDashboard

**Endpoint-uri necesare:**
- `GET /logistics/dashboard`
- `GET /logistics/deliveries`
- `GET /logistics/stats`

**Checklist:**
- [ ] Dashboard → Afișează stats și livrări recente
- [ ] 401 → Redirect la login
- [ ] 403 → Mesaj "Nu ai permisiuni"

**Pagini afectate:**
- `/logistics-portal/dashboard` - Dashboard logistics

**Fișiere:**
- `src/lib/api/logistics/dashboard.ts`
- `src/app/(site)/logistics-portal/dashboard/page.tsx`

---

### <a name="investordashboard"></a>investorDashboard

**Endpoint-uri necesare:**
- `GET /investor/analytics`
- `GET /investor/transactions`
- `GET /investor/top-items`

**Checklist:**
- [ ] Dashboard → Afișează analytics
- [ ] 401 → Redirect la login
- [ ] 403 → Mesaj "Nu ai permisiuni"

**Pagini afectate:**
- `/investor-portal/dashboard` - Dashboard investor

**Fișiere:**
- `src/lib/api/investor/analytics.ts`
- `src/app/(site)/investor-portal/dashboard/page.tsx`

---

### <a name="investormetrics"></a>investorMetrics

**Endpoint-uri necesare:**
- `GET /investor/metrics`

**Checklist:**
- [ ] Metrics → Afișează metrics anonimizate
- [ ] 401 → Redirect la login
- [ ] 403 → Mesaj "Nu ai permisiuni"

**Pagini afectate:**
- `/investor-portal/dashboard` - Dashboard investor (metrics section)

**Fișiere:**
- `src/lib/api/farme-investor.ts`
- `src/app/(site)/investor-portal/dashboard/page.tsx`

---

### <a name="notifications"></a>notifications

**Endpoint-uri necesare:**
- `GET /notifications`
- `POST /notifications/read`
- `GET /notifications/preferences`

**Checklist:**
- [ ] Listă notificări → Afișează notificările
- [ ] Marchează ca citit → Notificare marcată
- [ ] Badge cu număr necitite → Badge actualizat
- [ ] 401 → Redirect la login

**Pagini afectate:**
- Header (notification center icon)
- Mobile nav (notification center)

**Fișiere:**
- `src/lib/api/notifications.ts`
- `src/lib/store/farme-notifications.ts`
- `src/components/layout/header.tsx`

---

### <a name="producermarketing"></a>producerMarketing

**Endpoint-uri necesare:**
- `GET /producers/featured`
- `GET /producers/:id/visibility`
- `GET /producer/marketing/settings`
- `PATCH /producer/marketing/settings`
- `POST /producer/marketing/social/connect`
- `DELETE /producer/marketing/social/disconnect`

**Checklist:**
- [ ] Settings → Afișează setări marketing
- [ ] Actualizează setări → Setări actualizate
- [ ] Conectare social → Conectat
- [ ] Deconectare social → Deconectat
- [ ] 401 → Redirect la login
- [ ] 403 → Mesaj "Nu ai permisiuni"

**Pagini afectate:**
- `/producer-portal/marketing` - Pagina marketing
- Homepage (featured producers)

**Fișiere:**
- `src/lib/api/farme-marketing.ts`
- `src/lib/api/farme-producers-marketing.ts`
- `src/app/(site)/producer-portal/marketing/page.tsx`

---

### <a name="subscriptionsclient"></a>subscriptionsClient

**Endpoint-uri necesare:**
- `GET /subscriptions/public/plans`

**Checklist:**
- [ ] Listă planuri publice → Afișează planurile
- [ ] 200 → Planuri afișate corect

**Pagini afectate:**
- Homepage (subscriptions teaser section)

**Fișiere:**
- `src/lib/api/farme-subscriptions-public.ts`
- `src/app/(site)/_components/home/subscriptions-teaser-section.tsx`

---

### <a name="subscriptionsclientactive"></a>subscriptionsClientActive

**Endpoint-uri necesare:**
- `GET /clients/subscriptions`
- `POST /clients/subscriptions`
- `PATCH /clients/subscriptions/:id`

**Checklist:**
- [ ] Listă abonamente active → Afișează abonamentele
- [ ] Creare abonament → Abonament creat
- [ ] Actualizare abonament → Abonament actualizat
- [ ] 401 → Redirect la login

**Pagini afectate:**
- `/account/subscriptions` - Pagina abonamente client

**Fișiere:**
- `src/lib/api/farme-subscriptions-client.ts`
- `src/app/(site)/account/subscriptions/page.tsx`

---

### <a name="subscriptionsproducer"></a>subscriptionsProducer

**Endpoint-uri necesare:**
- `GET /producers/subscriptions`
- `POST /producers/subscriptions/upgrade`

**Checklist:**
- [ ] Listă abonamente producător → Afișează abonamentele
- [ ] Upgrade abonament → Abonament actualizat
- [ ] 401 → Redirect la login
- [ ] 403 → Mesaj "Nu ai permisiuni"

**Pagini afectate:**
- `/producer-portal/subscriptions` - Pagina abonamente producător

**Fișiere:**
- `src/lib/api/farme-subscriptions-producer.ts`
- `src/app/(site)/producer-portal/subscriptions/page.tsx`

---

### <a name="farmeropoints"></a>farmeroPoints

**Endpoint-uri necesare:**
- `GET /farmero-points/me`
- `GET /farmero-points/transactions`

**Checklist:**
- [ ] Obține points → Afișează points
- [ ] Listă tranzacții → Afișează tranzacțiile
- [ ] 401 → Redirect la login

**Pagini afectate:**
- `/account/points` - Pagina points

**Fișiere:**
- `src/lib/api/farme-points.ts`
- `src/app/(site)/account/points/page.tsx`

---

### <a name="partiesandcontracts"></a>partiesAndContracts

**Endpoint-uri necesare:**
- `GET /contracts`
- `GET /contracts/:id`
- `GET /contracts/templates`

**Checklist:**
- [ ] Listă contracte → Afișează contractele
- [ ] Detalii contract → Afișează detaliile
- [ ] Listă template-uri → Afișează template-urile
- [ ] 401 → Redirect la login
- [ ] 403 → Mesaj "Nu ai permisiuni"
- [ ] 404 → Mesaj "Contractul nu a fost găsit"

**Pagini afectate:**
- `/producer-portal/contracts` - Pagina contracte producător
- `/business-portal/contracts` - Pagina contracte business
- `/logistics-portal/contracts` - Pagina contracte logistics

**Fișiere:**
- `src/lib/api/farme-contracts.ts`
- `src/lib/api/farme-parties.ts`
- `src/app/(site)/producer-portal/contracts/page.tsx`
- `src/app/(site)/business-portal/contracts/page.tsx`
- `src/app/(site)/logistics-portal/contracts/page.tsx`

---

### <a name="feesandstatements"></a>feesAndStatements

**Endpoint-uri necesare:**
- `GET /fees/rules`
- `GET /statements`
- `GET /statements/:id`

**Checklist:**
- [ ] Listă extrase → Afișează extrasele
- [ ] Detalii extras → Afișează detaliile
- [ ] Listă reguli comisioane → Afișează regulile
- [ ] 401 → Redirect la login
- [ ] 403 → Mesaj "Nu ai permisiuni"
- [ ] 404 → Mesaj "Extrasul nu a fost găsit"

**Pagini afectate:**
- `/producer-portal/sales-commissions` - Pagina vânzări și comisioane
- `/producer-portal/statements/[id]` - Detalii extras

**Fișiere:**
- `src/lib/api/farme-fees.ts`
- `src/lib/api/farme-statements.ts`
- `src/app/(site)/producer-portal/sales-commissions/page.tsx`
- `src/app/(site)/producer-portal/statements/[id]/page.tsx`

---

### <a name="donations"></a>donations

**Endpoint-uri necesare:**
- `GET /donations/summary`
- `POST /donations/intent`
- `GET /donations/preferences`
- `PATCH /donations/preferences`

**Checklist:**
- [ ] Summary → Afișează summary
- [ ] Creare intent → Intent creat
- [ ] Obține preferințe → Afișează preferințele
- [ ] Actualizează preferințe → Preferințe actualizate
- [ ] 401 → Redirect la login
- [ ] 422 → Mesaj de validare

**Pagini afectate:**
- `/account/donations` - Pagina donations

**Fișiere:**
- `src/lib/api/farme-donations.ts`
- `src/app/(site)/account/donations/page.tsx`

---

## 🔧 Cum se Activează un Feature

### Pas 1: Backend Implementează Endpoint-urile

Backend-ul implementează endpoint-urile necesare conform contractelor API și le testează.

**Documentație:** `docs/BACKEND_API_CONTRACT_*.md`

---

### Pas 2: Frontend Testează Manual

1. Deschide `src/lib/backend-sync/status.ts`
2. Setează feature-ul pe `true` temporar (local, nu commit)
3. Testează manual flow-ul complet folosind checklist-ul de mai sus
4. Verifică că nu există erori în console
5. Verifică că error handling funcționează (401, 404, 422)

---

### Pas 3: Activează Feature-ul

Dacă testarea este reușită:

1. Setează feature-ul pe `true` în `BackendSyncStatus`
2. Commit modificarea cu mesaj clar: `feat: activate BackendSyncStatus.{featureName}`
3. Documentează în acest raport (opțional)
4. Deploy

---

### Exemplu Activare

```typescript
// src/lib/backend-sync/status.ts
export const BackendSyncStatus = {
  clientProfile: false,        // ❌ Nu e gata
  clientAddresses: false,      // ❌ Nu e gata
  cart: true,                 // ✅ Testat și funcțional
  checkout: true,             // ✅ Testat și funcțional
  clientOrders: true,         // ✅ Testat și funcțional
  producerProducts: true,     // ✅ Testat și funcțional
  producerOrders: true,       // ✅ Testat și funcțional
  // ... rest
} as const
```

---

## 📊 Status Actual

**Toate feature-urile sunt setate pe `false` (fallback mode).**

**Gata pentru activare (după ce backend implementează endpoint-urile):**
- ✅ Toate feature-urile au UI complet implementat
- ✅ Toate feature-urile au fallback mode funcțional
- ✅ Toate feature-urile au error handling standardizat

---

**Document generat:** 2025-01-27  
**Status:** 🟡 **Așteaptă implementare backend**  
**Contact:** Vezi `docs/FARMERO_BACKEND_HANDOFF_CHECKLIST.md` pentru detalii endpoint-uri

