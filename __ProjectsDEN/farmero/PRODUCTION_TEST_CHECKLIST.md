# ✅ Production Test Checklist - farme.ro

**Data:** 2025-01-27  
**Status:** 📋 **Checklist pentru testare producție**

---

## 🎯 Scop

Acest checklist acoperă toate scenariile critice pentru testare în producție înainte de lansare oficială.

---

## 🔐 Autentificare & Autorizare

### Register & Login

- [ ] **Register Client**
  - [ ] Formular validare corectă
  - [ ] Email duplicat detectat
  - [ ] Parolă minimă 8 caractere
  - [ ] Redirect după register
  - [ ] Email de confirmare (dacă e implementat)

- [ ] **Register Producer**
  - [ ] Formular complet cu date companie
  - [ ] Upload documente (dacă e implementat)
  - [ ] Status PENDING_VERIFICATION
  - [ ] Notificare admin

- [ ] **Login**
  - [ ] Login cu email/parolă corectă
  - [ ] Login cu credențiale greșite
  - [ ] Remember me funcționează
  - [ ] Redirect bazat pe rol (client/producer/admin)
  - [ ] Token refresh funcționează

- [ ] **Logout**
  - [ ] Logout șterge token
  - [ ] Redirect la homepage
  - [ ] Session cleanup

- [ ] **Password Reset**
  - [ ] Forgot password trimite email
  - [ ] Reset link funcționează
  - [ ] Parolă nouă salvată corect

---

## 🛒 Marketplace & Produse

### Browse Produse

- [ ] **Listare Produse**
  - [ ] Paginare funcționează
  - [ ] Filtrare după categorie
  - [ ] Filtrare după preț
  - [ ] Filtrare după regiune
  - [ ] Search funcționează
  - [ ] Sortare (preț, popularitate, etc.)
  - [ ] Empty state când nu sunt produse

- [ ] **Detalii Produs**
  - [ ] Toate informațiile afișate corect
  - [ ] Imagini se încarcă
  - [ ] Add to cart funcționează
  - [ ] Favorite button funcționează
  - [ ] Review-uri afișate (dacă există)
  - [ ] Producer link funcționează

- [ ] **Producători**
  - [ ] Listare producători
  - [ ] Detalii producător
  - [ ] Produse producător
  - [ ] Review-uri producător
  - [ ] Contact producător (dacă e implementat)

---

## 🛍️ Cart & Checkout

### Cart

- [ ] **Add to Cart**
  - [ ] Adăugare produs în cart
  - [ ] Actualizare cantitate
  - [ ] Ștergere produs
  - [ ] Cart persistă după refresh
  - [ ] Cart sincronizat cu backend

- [ ] **Cart Page**
  - [ ] Toate produsele afișate
  - [ ] Total calculat corect
  - [ ] Shipping cost calculat
  - [ ] Empty cart state
  - [ ] Continue shopping link

### Checkout

- [ ] **Checkout Flow**
  - [ ] Formular validare
  - [ ] Shipping address salvat
  - [ ] B2C checkout funcționează
  - [ ] B2B checkout funcționează
  - [ ] Payment method selectat
  - [ ] Order confirmation

- [ ] **Stripe Payment** (dacă e configurat)
  - [ ] Checkout session creat
  - [ ] Redirect la Stripe
  - [ ] Payment success
  - [ ] Payment failure
  - [ ] Webhook procesat corect
  - [ ] Order status actualizat

---

## 📦 Comenzi

### Client Orders

- [ ] **Listare Comenzi**
  - [ ] Toate comenzile afișate
  - [ ] Filtrare după status
  - [ ] Paginare funcționează
  - [ ] Empty state

- [ ] **Detalii Comandă**
  - [ ] Toate informațiile afișate
  - [ ] Status actualizat corect
  - [ ] Tracking info (dacă e disponibil)
  - [ ] Reorder funcționează

### Producer Orders

- [ ] **Listare Comenzi Producer**
  - [ ] Doar comenzile producătorului
  - [ ] Filtrare după status
  - [ ] Search funcționează

- [ ] **Gestionare Comandă**
  - [ ] Accept comandă
  - [ ] Update status (PREPARING, SHIPPED, DELIVERED)
  - [ ] Tracking number adăugat
  - [ ] Notificare client

---

## 👤 Profile & Settings

### Client Profile

- [ ] **Profile Page**
  - [ ] Date personale afișate
  - [ ] Edit profile funcționează
  - [ ] Change password funcționează
  - [ ] Delete account (dacă e implementat)

- [ ] **Addresses**
  - [ ] Listare adrese
  - [ ] Add address funcționează
  - [ ] Edit address funcționează
  - [ ] Delete address funcționează
  - [ ] Set default address

- [ ] **Favorites**
  - [ ] Listare favorite
  - [ ] Add favorite funcționează
  - [ ] Remove favorite funcționează
  - [ ] Empty state

- [ ] **Subscriptions**
  - [ ] Listare subscriptions
  - [ ] Create subscription funcționează
  - [ ] Edit subscription funcționează
  - [ ] Cancel subscription funcționează

### Producer Profile

- [ ] **Producer Settings**
  - [ ] Profile info afișat
  - [ ] Edit profile funcționează
  - [ ] Upload logo funcționează
  - [ ] Upload cover funcționează
  - [ ] Documents management

- [ ] **Products Management**
  - [ ] Listare produse
  - [ ] Create product funcționează
  - [ ] Edit product funcționează
  - [ ] Delete product funcționează
  - [ ] Upload product image funcționează
  - [ ] Status workflow (DRAFT → PENDING → APPROVED)

- [ ] **Commissions**
  - [ ] Commission history afișat
  - [ ] Commission details
  - [ ] Payout info (dacă e implementat)

---

## 🔔 Notificări & Alerts

- [ ] **Notifications**
  - [ ] Notificări afișate
  - [ ] Mark as read funcționează
  - [ ] Mark all as read funcționează
  - [ ] Notificări noi detectate

- [ ] **Alert Preferences**
  - [ ] Preferences afișate
  - [ ] Update preferences funcționează
  - [ ] Email alerts (dacă e implementat)

---

## 📱 Responsive & Mobile

- [ ] **Mobile Navigation**
  - [ ] Hamburger menu funcționează
  - [ ] Mobile menu se închide corect
  - [ ] Touch interactions funcționează

- [ ] **Mobile Forms**
  - [ ] Formulare funcționează pe mobile
  - [ ] Keyboard nu acoperă input-uri
  - [ ] Submit funcționează

- [ ] **Mobile Cart & Checkout**
  - [ ] Cart funcționează pe mobile
  - [ ] Checkout flow complet pe mobile
  - [ ] Payment pe mobile (dacă e implementat)

---

## ♿ Accessibility

- [ ] **Keyboard Navigation**
  - [ ] Tab navigation funcționează
  - [ ] Skip to main content funcționează
  - [ ] Focus visible pe toate elementele
  - [ ] Modal focus trap funcționează

- [ ] **Screen Readers**
  - [ ] ARIA labels prezente
  - [ ] Alt text pentru imagini
  - [ ] Form labels asociate corect

- [ ] **Color Contrast**
  - [ ] Contrast ratio >= 4.5:1 pentru text
  - [ ] Contrast ratio >= 3:1 pentru UI elements

---

## ⚡ Performance

- [ ] **Page Load**
  - [ ] Homepage < 2s
  - [ ] Product page < 2s
  - [ ] Cart page < 1.5s

- [ ] **Core Web Vitals**
  - [ ] LCP < 2.5s
  - [ ] FID < 100ms
  - [ ] CLS < 0.1

- [ ] **API Response Times**
  - [ ] GET requests < 500ms
  - [ ] POST requests < 1s
  - [ ] Slow requests logged

---

## 🔒 Security

- [ ] **Authentication**
  - [ ] JWT tokens valide
  - [ ] Token expiration funcționează
  - [ ] Unauthorized requests blocate

- [ ] **Authorization**
  - [ ] Role-based access funcționează
  - [ ] Producer vede doar propriile produse
  - [ ] Admin vede tot

- [ ] **Input Validation**
  - [ ] SQL injection prevenit
  - [ ] XSS prevenit
  - [ ] CSRF protecție (dacă e implementat)

---

## 🌐 SEO & Metadata

- [ ] **Meta Tags**
  - [ ] Title tags corecte
  - [ ] Description tags corecte
  - [ ] OpenGraph tags corecte
  - [ ] Twitter Cards corecte

- [ ] **Structured Data**
  - [ ] JSON-LD valid
  - [ ] Product schema (dacă e implementat)
  - [ ] Organization schema

---

## 🐛 Error Handling

- [ ] **Error States**
  - [ ] 404 page funcționează
  - [ ] 500 error handling
  - [ ] Network error handling
  - [ ] Form validation errors afișate

- [ ] **Error Boundaries**
  - [ ] React errors prinse
  - [ ] Error fallback afișat
  - [ ] Error logging funcționează

---

## 📊 Monitoring & Logs

- [ ] **Health Checks**
  - [ ] `/health` endpoint funcționează
  - [ ] `/health/detailed` endpoint funcționează
  - [ ] Database connection verificat

- [ ] **Logging**
  - [ ] Errors logged corect
  - [ ] Performance metrics logged
  - [ ] Request logging funcționează

- [ ] **Sentry** (dacă e configurat)
  - [ ] Errors captured
  - [ ] Performance tracked
  - [ ] Alerts configurate

---

## ✅ Final Verification

- [ ] **Smoke Test**
  - [ ] Homepage se încarcă
  - [ ] Login funcționează
  - [ ] Add to cart funcționează
  - [ ] Checkout funcționează

- [ ] **Cross-Browser**
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge

- [ ] **Cross-Device**
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile

---

**Status:** 📋 **Checklist complet pentru testare producție**

**Notă:** Bifează fiecare item după testare. Documentează orice bug găsit în `BUG_REPORT.md`.

