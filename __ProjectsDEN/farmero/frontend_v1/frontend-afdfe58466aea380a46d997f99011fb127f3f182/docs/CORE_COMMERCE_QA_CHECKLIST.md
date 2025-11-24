# Core Commerce QA Checklist

**Data:** 2024  
**Scop:** Checklist pentru testarea manuală a funcționalităților Core Commerce  
**Status:** Frontend-ready, așteaptă implementare backend

---

## 📋 Preambul

Acest checklist trebuie folosit pentru testarea manuală a funcționalităților Core Commerce după ce backend-ul implementează contractele API documentate în `BACKEND_API_CONTRACT_CORE_COMMERCE.md`.

**IMPORTANT:** 
- Toate testele trebuie făcute cu un utilizator autentificat (client sau producător)
- Testează atât scenarii de succes cât și scenarii de eroare
- Verifică error handling-ul pentru toate codurile de eroare (401, 403, 404, 422)

---

## 🛒 Cart Management (Client)

### Setup
- [ ] Utilizator client autentificat
- [ ] `BackendSyncStatus.cart = true` în `src/lib/backend-sync/status.ts`
- [ ] Produse disponibile în catalog

### Teste Funcționale

#### GET /cart
- [ ] Coș gol → returnează coș cu `items: []`
- [ ] Coș cu produse → returnează toate item-urile corect
- [ ] Calcul subtotal, shipping, total → corect
- [ ] 401 Unauthorized → redirect la login cu return URL

#### POST /cart/items
- [ ] Adaugă produs valid → produs apare în coș
- [ ] Adaugă produs cu cantitate > 1 → cantitatea corectă
- [ ] Adaugă același produs din nou → cantitatea se adună sau se creează item nou?
- [ ] 400 Bad Request (productId lipsă) → mesaj de eroare clar
- [ ] 404 Not Found (produs inexistent) → mesaj "Produsul nu a fost găsit"
- [ ] 422 Unprocessable Entity (stoc insuficient) → mesaj despre stoc
- [ ] 401 Unauthorized → redirect la login

#### PATCH /cart/items/:itemId
- [ ] Actualizează cantitatea → cantitatea se actualizează corect
- [ ] Actualizează la cantitate 0 → item-ul se elimină (sau eroare?)
- [ ] 404 Not Found (item inexistent) → mesaj clar
- [ ] 422 Unprocessable Entity (stoc insuficient) → mesaj despre stoc
- [ ] 401 Unauthorized → redirect la login

#### DELETE /cart/items/:itemId
- [ ] Elimină item existent → item-ul dispare din coș
- [ ] 404 Not Found (item inexistent) → tratat ca success (idempotent)
- [ ] 401 Unauthorized → redirect la login

#### DELETE /cart
- [ ] Golește coșul → toate item-urile dispar
- [ ] Coș gol după clear → coș rămâne gol
- [ ] 401 Unauthorized → redirect la login

### Teste UI
- [ ] Loading state se afișează corect
- [ ] Error messages sunt user-friendly
- [ ] Toast notifications pentru acțiuni (opțional)
- [ ] Cart count se actualizează în navbar
- [ ] Persistență coș între refresh-uri (dacă backend suportă)

---

## 📦 Checkout & Orders (Client)

### Setup
- [ ] Utilizator client autentificat
- [ ] Coș cu produse
- [ ] `BackendSyncStatus.checkout = true`
- [ ] `BackendSyncStatus.clientOrders = true`

### Teste Funcționale

#### POST /orders (Create Order)
- [ ] Comandă validă → comandă creată cu succes
- [ ] Redirect la thank-you page sau payment URL
- [ ] Coșul se golește după comandă reușită
- [ ] 400 Bad Request (câmpuri lipsă) → mesaj despre câmpuri invalide
- [ ] 401 Unauthorized → redirect la login cu return URL
- [ ] 404 Not Found (coș gol) → mesaj "Coșul este gol"
- [ ] 422 Unprocessable Entity (stoc insuficient) → mesaj despre produse indisponibile
- [ ] Payment URL returnat corect (dacă e cazul)

#### GET /orders (List Orders)
- [ ] Listă comenzilor → toate comenzile clientului apar
- [ ] Comenzi sortate corect (cel mai recent primul)
- [ ] Empty state când nu există comenzi
- [ ] 401 Unauthorized → redirect la login
- [ ] Pagination funcționează (dacă e implementată)

#### GET /orders/:id (Order Details)
- [ ] Comandă existentă → detalii complete afișate
- [ ] Toate item-urile apar corect
- [ ] Adresa de livrare corectă
- [ ] Status-ul comenzii corect
- [ ] 401 Unauthorized → redirect la login
- [ ] 403 Forbidden (comandă altui client) → mesaj "Nu ai permisiunea"
- [ ] 404 Not Found → mesaj "Comanda nu a fost găsită"

### Teste UI
- [ ] Formular checkout validare corectă
- [ ] Error messages clare pentru fiecare câmp
- [ ] Loading state în timpul creării comenzii
- [ ] Success state cu redirect corect
- [ ] Reorder functionality funcționează
- [ ] Order status badges afișate corect

---

## 🏭 Producer Products

### Setup
- [ ] Utilizator producător autentificat
- [ ] `BackendSyncStatus.producerProducts = true`

### Teste Funcționale

#### GET /producers/products
- [ ] Listă produse → toate produsele producătorului apar
- [ ] Empty state când nu există produse
- [ ] 401 Unauthorized → redirect la login
- [ ] 403 Forbidden (nu e producător) → mesaj clar

#### GET /producers/products/:id
- [ ] Produs existent → detalii complete
- [ ] 401 Unauthorized → redirect la login
- [ ] 403 Forbidden (produs altui producător) → mesaj "Nu ai permisiunea"
- [ ] 404 Not Found → mesaj "Produsul nu a fost găsit"

#### POST /producers/products
- [ ] Creare produs valid → produs creat cu succes
- [ ] Toate câmpurile obligatorii validate
- [ ] 400 Bad Request (câmpuri lipsă) → mesaj despre câmpuri
- [ ] 401 Unauthorized → redirect la login
- [ ] 403 Forbidden (nu e producător) → mesaj clar

#### PATCH /producers/products/:id
- [ ] Actualizare produs → produs actualizat corect
- [ ] Toggle isActive → status se schimbă corect
- [ ] 400 Bad Request (date invalide) → mesaj clar
- [ ] 401 Unauthorized → redirect la login
- [ ] 403 Forbidden (produs altui producător) → mesaj clar
- [ ] 404 Not Found → mesaj "Produsul nu a fost găsit"

#### DELETE /producers/products/:id
- [ ] Ștergere produs → produs dispare din listă
- [ ] 401 Unauthorized → redirect la login
- [ ] 403 Forbidden (produs altui producător) → mesaj clar
- [ ] 404 Not Found → mesaj "Produsul nu a fost găsit"

### Teste UI
- [ ] Formular creare/editare validare corectă
- [ ] Loading states pentru toate acțiunile
- [ ] Optimistic updates funcționează
- [ ] Error messages clare
- [ ] Success feedback (toast sau mesaj)

---

## 📋 Producer Orders

### Setup
- [ ] Utilizator producător autentificat
- [ ] Comenzi existente pentru producător
- [ ] `BackendSyncStatus.producerOrders = true`

### Teste Funcționale

#### GET /producers/orders
- [ ] Listă comenzi → toate comenzile producătorului apar
- [ ] Filtrare după status funcționează
- [ ] Filtrare după date funcționează (dacă e implementată)
- [ ] Empty state când nu există comenzi
- [ ] 401 Unauthorized → redirect la login
- [ ] 403 Forbidden (nu e producător) → mesaj clar

#### GET /producers/orders/:id
- [ ] Comandă existentă → detalii complete
- [ ] Informații client corecte
- [ ] Item-uri corecte
- [ ] Adresa de livrare corectă
- [ ] 401 Unauthorized → redirect la login
- [ ] 403 Forbidden (comandă altui producător) → mesaj clar
- [ ] 404 Not Found → mesaj "Comanda nu a fost găsită"

#### PATCH /producers/orders/:id/status
- [ ] Actualizare status valid → status se schimbă corect
- [ ] Tranziții de status validate (ex: nu se poate trece direct de la pending la delivered)
- [ ] 400 Bad Request (status invalid) → mesaj clar
- [ ] 401 Unauthorized → redirect la login
- [ ] 403 Forbidden (comandă altui producător) → mesaj clar
- [ ] 404 Not Found → mesaj "Comanda nu a fost găsită"

#### Status Transitions
- [ ] pending → confirmed → preparing → shipped → delivered
- [ ] pending → canceled (anulare)
- [ ] Tranziții invalide blocate (ex: delivered → pending)

### Teste UI
- [ ] Tabel comenzi afișat corect
- [ ] Filtrare după status funcționează
- [ ] Butoane de status change funcționează
- [ ] Confirmări pentru acțiuni importante (cancel, etc.)
- [ ] Loading states pentru toate acțiunile
- [ ] Optimistic updates funcționează
- [ ] Error messages clare

---

## 🔄 Error Handling Standardizat

### Verificări Generale

Pentru toate endpoint-urile, verifică:

#### 401 Unauthorized
- [ ] Redirect automat la login
- [ ] Return URL setat corect (utilizatorul revine la pagina inițială după login)
- [ ] Mesaj clar "Trebuie să fii autentificat"

#### 403 Forbidden
- [ ] Mesaj clar "Nu ai permisiunea de a accesa această resursă"
- [ ] Nu se face redirect (utilizatorul rămâne pe pagină)
- [ ] UI indică clar problema

#### 404 Not Found
- [ ] Mesaj clar "Resursa nu a fost găsită"
- [ ] Pentru liste → empty state elegant
- [ ] Pentru detalii → mesaj de eroare cu opțiune de navigare înapoi

#### 422 Unprocessable Entity
- [ ] Mesaj specific despre problema (stoc insuficient, date invalide, etc.)
- [ ] Pentru cart/checkout → indică produsele problematice
- [ ] UI indică clar ce trebuie corectat

#### 400 Bad Request
- [ ] Mesaj despre câmpurile invalide
- [ ] Validare client-side + server-side
- [ ] UI indică câmpurile problematice

---

## 🧪 Teste de Integrare

### Flux Complet Client

1. **Login Client**
   - [ ] Autentificare reușită
   - [ ] Redirect la pagina inițială sau dashboard

2. **Browse Products**
   - [ ] Listă produse se încarcă
   - [ ] Adăugare în coș funcționează

3. **Cart Management**
   - [ ] Coșul se încarcă corect
   - [ ] Actualizare cantități funcționează
   - [ ] Eliminare item-uri funcționează

4. **Checkout**
   - [ ] Formular completat corect
   - [ ] Comandă creată cu succes
   - [ ] Redirect la thank-you page

5. **View Orders**
   - [ ] Listă comenzi se încarcă
   - [ ] Detalii comandă se încarcă
   - [ ] Reorder funcționează

### Flux Complet Producer

1. **Login Producer**
   - [ ] Autentificare reușită
   - [ ] Redirect la producer portal

2. **Manage Products**
   - [ ] Listă produse se încarcă
   - [ ] Creare produs nou funcționează
   - [ ] Editare produs funcționează
   - [ ] Ștergere produs funcționează
   - [ ] Toggle active/inactive funcționează

3. **View Orders**
   - [ ] Listă comenzi se încarcă
   - [ ] Filtrare după status funcționează
   - [ ] Detalii comandă se încarcă

4. **Update Order Status**
   - [ ] Confirmare comandă funcționează
   - [ ] Pregătire comandă funcționează
   - [ ] Livrare comandă funcționează
   - [ ] Finalizare comandă funcționează
   - [ ] Anulare comandă funcționează

---

## 🔍 Verificări Tehnice

### BackendSyncStatus
- [ ] Toate flag-urile verificate corect înainte de request
- [ ] Fallback-urile funcționează când flag-ul e `false`:
  - Liste → `[]`
  - Detalii → error clar
  - Create/Update/Delete → error clar

### Mapper Functions
- [ ] `mapApiOrderToOrder` funcționează corect
- [ ] Suportă atât `snake_case` cât și `camelCase`
- [ ] Nu folosește `any` (type-safe)

### Error Messages
- [ ] Toate mesajele sunt user-friendly
- [ ] Mesajele sunt în română (sau folosesc i18n)
- [ ] Nu există mesaje tehnice expuse utilizatorului

### Console Logs
- [ ] Nu există `console.log` neesențiale
- [ ] `console.error` doar pentru debugging real
- [ ] Logs nu expun informații sensibile

---

## 📱 Teste Mobile/PWA

- [ ] Toate funcționalitățile funcționează pe mobile
- [ ] Butoanele au dimensiuni suficiente pentru touch
- [ ] Formularele sunt ușor de completat pe mobile
- [ ] Error messages sunt vizibile pe mobile
- [ ] Loading states sunt clare pe mobile

---

## 🌐 Teste Cross-Browser

- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

---

## ✅ Checklist Final

După ce toate testele de mai sus sunt trecute:

- [ ] Toate funcționalitățile Core Commerce funcționează
- [ ] Error handling este consistent și user-friendly
- [ ] UI/UX este fluid și intuitiv
- [ ] Performance este acceptabilă
- [ ] Nu există erori în console (exceptând erori reale de backend)
- [ ] Documentația API este actualizată dacă s-au făcut schimbări

---

## 🐛 Bug Reporting Template

Dacă găsești probleme, documentează-le cu:

1. **Endpoint afectat:** (ex: POST /orders)
2. **Request:** (JSON request body)
3. **Expected Response:** (ce ar trebui să se întâmple)
4. **Actual Response:** (ce se întâmplă de fapt)
5. **Error Code:** (dacă există)
6. **Steps to Reproduce:** (pașii pentru a reproduce problema)
7. **Browser/Device:** (Chrome desktop, Safari mobile, etc.)

---

**Ultima actualizare:** 2024  
**Versiune:** 1.0

