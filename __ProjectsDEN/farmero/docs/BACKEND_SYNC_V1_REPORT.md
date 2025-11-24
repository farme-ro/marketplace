# Backend Sync V1 Report

**Data:** 2025-01-27  
**Scop:** Prima sincronizare reală cu backend-ul (https://api.farme.ro) pentru rolurile Client și Producer

---

## 📋 Executive Summary

Acest raport documentează implementarea layer-ului de sincronizare backend V1, care permite activarea incrementală a funcționalităților backend prin sistemul de configurare `BackendSyncStatus`.

**Status general:** Layer-ul de configurare este implementat și toate API layer-urile sunt actualizate să folosească `BackendSyncStatus`. Toate funcționalitățile sunt setate pe `false` (fallback mode) până când backend-ul este complet funcțional și testat.

---

## 🛠 Layer de Configurare Backend Sync

### Fișier: `src/lib/backend-sync/status.ts`

**Status:** ✅ **Implementat**

**Funcționalități:**
- Configurare centralizată pentru toate funcționalitățile backend
- Funcții helper pentru verificarea status-ului
- Type-safe cu TypeScript

**Configurare actuală:**
```typescript
export const BackendSyncStatus = {
  clientProfile: false,        // GET /clients/me, PATCH /clients/me
  clientAddresses: false,      // GET /clients/addresses, POST/PATCH/DELETE /clients/addresses/:id
  cart: false,                 // POST /cart/add, GET /cart, PATCH /cart/update, DELETE /cart/remove/:itemId
  checkout: false,             // POST /orders/create
  clientOrders: false,         // GET /orders, GET /orders/:id
  producerProducts: false,     // GET /producer/products, POST/PATCH/DELETE /producer/products/:id
  producerOrders: false,       // GET /producer/orders, GET /producer/orders/:id, PATCH /producer/orders/:id/status
}
```

**Cum se folosește:**
- Toate funcțiile API verifică `isBackendSyncEnabled(feature)` înainte de a face request
- Dacă feature-ul este `false`, returnează fallback (empty array, empty object, sau throw error cu mesaj clar)
- Previne crash-uri și permite testare incrementală

---

## ✅ Ce e Conectat Live

**Status:** 🟥 **Nimic încă - toate sunt în fallback mode**

Toate funcționalitățile sunt setate pe `false` și vor rămâne așa până când:
1. Backend-ul implementează endpoint-urile
2. Endpoint-urile sunt testate manual
3. Status-ul este setat pe `true` în `BackendSyncStatus`

---

## ⚠️ Ce e în Fallback

### A. Client – Profil & Adresă

**Fișier:** `src/lib/api/client-profile.ts`

**Funcții:**
- `updateClientProfile()` - Returnează error dacă `clientProfile: false`
- `getClientAddresses()` - Returnează `[]` dacă `clientAddresses: false`
- `createShippingAddress()` - Returnează error dacă `clientAddresses: false`
- `updateShippingAddress()` - Returnează error dacă `clientAddresses: false`
- `deleteShippingAddress()` - Returnează error dacă `clientAddresses: false`
- `setDefaultShippingAddress()` - Returnează error dacă `clientAddresses: false`

**Endpoints necesare:**
- `GET /clients/me` - Obține profil client
- `PATCH /clients/me` - Actualizează profil client
- `GET /clients/addresses` - Listă adrese livrare
- `POST /clients/addresses` - Creează adresă livrare
- `PATCH /clients/addresses/:id` - Actualizează adresă livrare
- `DELETE /clients/addresses/:id` - Șterge adresă livrare
- `PATCH /clients/addresses/:id/default` - Setează adresă principală

**Pagini afectate:**
- `/account` - Pagina de cont client
- `/checkout` - Selectarea adreselor în checkout

**Fallback behavior:**
- Profil: Mesaj de eroare clar când se încearcă actualizarea
- Adrese: Returnează array gol, permite completare manuală în checkout

### B. Cart & Checkout Live

**Fișier:** `src/lib/api/cart.ts`

**Funcții:**
- `getCart()` - Returnează cart gol dacă `cart: false`
- `addToCart()` - Returnează error dacă `cart: false`
- `updateCartItem()` - Returnează error dacă `cart: false`
- `removeCartItem()` - Returnează error dacă `cart: false`
- `clearCart()` - Returnează cart gol dacă `cart: false`

**Fișier:** `src/lib/api/orders.ts`

**Funcții:**
- `createOrder()` - Returnează error dacă `checkout: false`

**Endpoints necesare:**
- `POST /cart/items` - Adaugă produs în coș
- `GET /cart` - Obține coșul curent
- `PATCH /cart/items/:itemId` - Actualizează cantitate produs
- `DELETE /cart/items/:itemId` - Șterge produs din coș
- `DELETE /cart` - Golește coșul
- `POST /orders` - Creează comandă din coș

**Pagini afectate:**
- `/cart` - Pagina coșului
- `/checkout` - Pagina de checkout
- Toate paginile cu buton "Adaugă în coș"

**Fallback behavior:**
- Cart store folosește localStorage pentru guest users
- La login, cart-ul local se sincronizează cu backend (dacă `cart: true`)
- Checkout aruncă error dacă `checkout: false`

**Notă:** Cart store (`src/lib/store/cart.ts`) are deja logică de fallback la localStorage. Funcționează și fără backend, dar nu se sincronizează între dispozitive.

### C. Orders – Client

**Fișier:** `src/lib/api/orders.ts`

**Funcții:**
- `getOrders()` - Returnează `[]` dacă `clientOrders: false`
- `getOrderById()` - Returnează error dacă `clientOrders: false`

**Endpoints necesare:**
- `GET /orders` - Listă toate comenzile clientului
- `GET /orders/:id` - Obține detalii comandă

**Pagini afectate:**
- `/orders` - Lista de comenzi
- `/orders/[id]` - Detalii comandă

**Fallback behavior:**
- Lista de comenzi: Afișează empty state "Nu ai comenzi"
- Detalii comandă: Mesaj de eroare clar

### D. Producer Portal Core

**Fișier:** `src/lib/api/producer/products.ts`

**Funcții:**
- `getProducerProducts()` - Returnează `[]` dacă `producerProducts: false`
- `getProductById()` - Returnează error dacă `producerProducts: false`
- `createProduct()` - Returnează error dacă `producerProducts: false`
- `updateProduct()` - Returnează error dacă `producerProducts: false`
- `deleteProduct()` - Returnează error dacă `producerProducts: false`

**Fișier:** `src/lib/api/producer/orders.ts`

**Funcții:**
- `getProducerOrders()` - Returnează `[]` dacă `producerOrders: false`
- `getOrderById()` - Returnează error dacă `producerOrders: false`
- `updateOrderStatus()` - Returnează error dacă `producerOrders: false`

**Endpoints necesare:**
- `GET /producers/products` - Listă produse producător
- `GET /producers/products/:id` - Obține produs
- `POST /producers/products` - Creează produs
- `PATCH /producers/products/:id` - Actualizează produs
- `DELETE /producers/products/:id` - Șterge produs
- `GET /producers/orders` - Listă comenzi producător
- `GET /producers/orders/:id` - Obține comandă producător
- `PATCH /producers/orders/:id/status` - Actualizează status comandă

**Pagini afectate:**
- `/producer-portal/products` - Lista de produse
- `/producer-portal/products/new` - Adăugare produs
- `/producer-portal/products/[id]/edit` - Editare produs
- `/producer-portal/orders` - Lista de comenzi
- `/producer-portal/orders/[id]` - Detalii comandă

**Fallback behavior:**
- Produse: Listă goală, butoanele de adăugare/editare aruncă error
- Comenzi: Listă goală, butoanele de update status aruncă error

---

## ❌ Ce Lipsește Backend

### Prioritate 🔴 High (Critic pentru MVP)

1. **Cart & Checkout**
   - `POST /cart/items` - Adaugă produs în coș
   - `GET /cart` - Obține coșul curent
   - `PATCH /cart/items/:itemId` - Actualizează cantitate
   - `DELETE /cart/items/:itemId` - Șterge produs
   - `DELETE /cart` - Golește coșul
   - `POST /orders` - Creează comandă

2. **Client Orders**
   - `GET /orders` - Listă comenzi client
   - `GET /orders/:id` - Detalii comandă

### Prioritate 🟡 Medium (Important pentru UX complet)

3. **Client Profile & Addresses**
   - `GET /clients/me` - Obține profil client
   - `PATCH /clients/me` - Actualizează profil client
   - `GET /clients/addresses` - Listă adrese
   - `POST /clients/addresses` - Creează adresă
   - `PATCH /clients/addresses/:id` - Actualizează adresă
   - `DELETE /clients/addresses/:id` - Șterge adresă
   - `PATCH /clients/addresses/:id/default` - Setează adresă principală

4. **Producer Products**
   - `GET /producers/products` - Listă produse
   - `GET /producers/products/:id` - Obține produs
   - `POST /producers/products` - Creează produs
   - `PATCH /producers/products/:id` - Actualizează produs
   - `DELETE /producers/products/:id` - Șterge produs

5. **Producer Orders**
   - `GET /producers/orders` - Listă comenzi
   - `GET /producers/orders/:id` - Obține comandă
   - `PATCH /producers/orders/:id/status` - Actualizează status

---

## 📌 Recomandări Următoare Endpoint-uri

### Ordinea Recomandată de Implementare

**Faza 1: Cart & Checkout (MVP Critical)**
1. `POST /cart/items` - Adaugă produs în coș
2. `GET /cart` - Obține coșul curent
3. `PATCH /cart/items/:itemId` - Actualizează cantitate
4. `DELETE /cart/items/:itemId` - Șterge produs
5. `POST /orders` - Creează comandă

**Faza 2: Client Orders**
6. `GET /orders` - Listă comenzi client
7. `GET /orders/:id` - Detalii comandă

**Faza 3: Client Profile & Addresses**
8. `GET /clients/me` - Obține profil client
9. `PATCH /clients/me` - Actualizează profil client
10. `GET /clients/addresses` - Listă adrese
11. `POST /clients/addresses` - Creează adresă
12. `PATCH /clients/addresses/:id` - Actualizează adresă
13. `DELETE /clients/addresses/:id` - Șterge adresă
14. `PATCH /clients/addresses/:id/default` - Setează adresă principală

**Faza 4: Producer Portal**
15. `GET /producers/products` - Listă produse
16. `POST /producers/products` - Creează produs
17. `PATCH /producers/products/:id` - Actualizează produs
18. `DELETE /producers/products/:id` - Șterge produs
19. `GET /producers/orders` - Listă comenzi
20. `GET /producers/orders/:id` - Obține comandă
21. `PATCH /producers/orders/:id/status` - Actualizează status

### Specificații Tehnice

**Autentificare:**
- Toate endpoint-urile necesită autentificare (cookie-based sau token)
- Folosesc `credentials: 'include'` în fetch

**Format Request/Response:**
- Request: JSON (`Content-Type: application/json`)
- Response: JSON
- Suportă atât array direct cât și format paginat `{ data: [...] }`

**Error Handling:**
- 400: Date invalide
- 401: Neautentificat
- 403: Fără permisiune
- 404: Resursă negăsită
- 422: Validare business logic (ex: stoc insuficient)

---

## 🧪 Testare Manuală Obligatorie

### După Fiecare Etapă

#### Client Flow

1. **Login Client**
   - [ ] Login funcționează
   - [ ] Profil se încarcă corect

2. **Add to Cart**
   - [ ] Adăugare produs în coș funcționează
   - [ ] Coșul se actualizează în timp real
   - [ ] Sincronizare între dispozitive (dacă `cart: true`)

3. **Checkout**
   - [ ] Formular checkout se încarcă
   - [ ] Selectare adresă (dacă `clientAddresses: true`)
   - [ ] Creare comandă funcționează
   - [ ] Redirect la thank-you page

4. **Vezi Comenzi**
   - [ ] Lista de comenzi se încarcă
   - [ ] Statusurile sunt corecte

5. **Vezi Detaliu Comandă**
   - [ ] Detaliile comenzii se încarcă
   - [ ] Toate informațiile sunt corecte

#### Producer Flow

1. **Login Producer**
   - [ ] Login funcționează
   - [ ] Dashboard se încarcă

2. **Vezi Produse**
   - [ ] Lista de produse se încarcă
   - [ ] Produsele sunt corecte

3. **Modifică Stoc**
   - [ ] Update produs funcționează
   - [ ] Toggle active/inactive funcționează

4. **Vezi Comenzi**
   - [ ] Lista de comenzi se încarcă
   - [ ] Filtrarea după status funcționează

5. **Schimbă Status Comandă**
   - [ ] Update status funcționează
   - [ ] Statusurile se actualizează corect

---

## 🔄 Cum se Activează un Feature

### Pas 1: Backend Implementează Endpoint-ul

Backend-ul implementează endpoint-ul și îl testează.

### Pas 2: Frontend Testează Manual

1. Deschide `src/lib/backend-sync/status.ts`
2. Setează feature-ul pe `true` temporar
3. Testează manual flow-ul complet
4. Verifică că nu există erori

### Pas 3: Activează Feature-ul

Dacă testarea este reușită:
1. Setează feature-ul pe `true` în `BackendSyncStatus`
2. Commit modificarea
3. Documentează în acest raport

### Exemplu:

```typescript
// src/lib/backend-sync/status.ts
export const BackendSyncStatus = {
  clientProfile: false,        // ❌ Nu e gata
  clientAddresses: false,      // ❌ Nu e gata
  cart: true,                 // ✅ Testat și funcțional
  checkout: true,             // ✅ Testat și funcțional
  clientOrders: false,        // ❌ Nu e gata
  producerProducts: false,     // ❌ Nu e gata
  producerOrders: false,       // ❌ Nu e gata
}
```

---

## 📊 Status Actual

| Feature | Status | Endpoint | Testat | Notă |
|---------|--------|----------|--------|------|
| `clientProfile` | ❌ Fallback | `GET /clients/me`, `PATCH /clients/me` | ❌ | - |
| `clientAddresses` | ❌ Fallback | `GET/POST/PATCH/DELETE /clients/addresses` | ❌ | - |
| `cart` | ❌ Fallback | `POST/GET/PATCH/DELETE /cart` | ❌ | Folosește localStorage ca fallback |
| `checkout` | ❌ Fallback | `POST /orders` | ❌ | - |
| `clientOrders` | ❌ Fallback | `GET /orders`, `GET /orders/:id` | ❌ | - |
| `producerProducts` | ❌ Fallback | `GET/POST/PATCH/DELETE /producers/products` | ❌ | - |
| `producerOrders` | ❌ Fallback | `GET /producers/orders`, `PATCH /producers/orders/:id/status` | ❌ | - |

---

## 🛠 Fișiere Modificate

### Layer de Configurare
- ✅ `src/lib/backend-sync/status.ts` - **NOU** - Configurare centralizată

### API Layer-uri Actualizate
- ✅ `src/lib/api/client-profile.ts` - Adăugat verificări `BackendSyncStatus`
- ✅ `src/lib/api/cart.ts` - Adăugat verificări `BackendSyncStatus`
- ✅ `src/lib/api/orders.ts` - Adăugat verificări `BackendSyncStatus`
- ✅ `src/lib/api/producer/products.ts` - Adăugat verificări `BackendSyncStatus`
- ✅ `src/lib/api/producer/orders.ts` - Adăugat verificări `BackendSyncStatus`

### Store-uri
- ⚠️ `src/lib/store/cart.ts` - **NU a fost modificat** - Are deja logică de fallback la localStorage

---

## ✅ Rezultat Final După Acest Pas

### Ce Am Obținut

1. **Layer de configurare centralizat**
   - Control granular asupra funcționalităților backend
   - Activare incrementală fără refactor major
   - Prevenire crash-uri

2. **API Layer-uri protejate**
   - Toate funcțiile verifică status-ul înainte de request
   - Fallback-uri clare și previzibile
   - Mesaje de eroare informative

3. **Gata pentru integrare**
   - Backend-ul poate implementa endpoint-urile în orice ordine
   - Frontend-ul poate activa feature-urile incremental
   - Testare manuală simplă pentru fiecare feature

### Ce Mai Trebuie

1. **Backend implementează endpoint-urile**
   - În ordinea recomandată (Cart → Orders → Profile → Producer)

2. **Frontend activează feature-urile**
   - După testare manuală reușită
   - Setează `true` în `BackendSyncStatus`

3. **Testare end-to-end**
   - Client flow complet
   - Producer flow complet

---

## 📝 Notițe Tehnice

### Pattern Folosit

Toate funcțiile API urmează același pattern:

```typescript
export async function someApiFunction(...args): Promise<ReturnType> {
  // 1. Verifică dacă feature-ul este activat
  if (!isBackendSyncEnabled('featureName')) {
    // 2. Returnează fallback sau aruncă error
    return fallbackValue // sau throw new Error('...')
  }

  // 3. Face request-ul normal
  try {
    const response = await apiFetch<ResponseType>(...)
    return response
  } catch (error) {
    // 4. Gestionare erori normală
    // ...
  }
}
```

### Fallback Strategies

- **Liste (getOrders, getCart, etc.):** Returnează `[]`
- **Single item (getOrderById, etc.):** Aruncă error cu mesaj clar
- **Create/Update/Delete:** Aruncă error cu mesaj clar
- **Cart store:** Folosește localStorage ca fallback automat

---

## 🎯 Următorii Pași

1. **Backend implementează Faza 1 (Cart & Checkout)**
2. **Frontend testează manual și activează `cart: true`, `checkout: true`**
3. **Backend implementează Faza 2 (Client Orders)**
4. **Frontend testează manual și activează `clientOrders: true`**
5. **Continuă cu Faza 3 și 4**

---

**Raport generat:** 2025-01-27  
**Status:** ✅ Layer de configurare implementat, gata pentru integrare backend incrementală

