# Endpoint Testing Checklist - Backend API

**Data:** 2025-01-27  
**Scop:** Checklist pentru testare manuală a endpoint-urilor backend  
**Status:** 📋 **Ghidă pentru testare**

## 📋 Pre-requisite

- [ ] Backend pornit și accesibil (`http://localhost:3001` sau producție)
- [ ] Baza de date configurată și migrațiile aplicate
- [ ] Conturi de test create (client, producător, admin)
- [ ] Postman sau curl instalat pentru testare

## 🔐 Autentificare

### POST /auth/register
- [ ] Înregistrare client nou
- [ ] Înregistrare producător nou
- [ ] Validare email duplicat (trebuie să eșueze)
- [ ] Validare parolă (minim 6 caractere)

### POST /auth/login
- [ ] Login cu credențiale corecte
- [ ] Login cu credențiale greșite (trebuie să eșueze)
- [ ] Verificare token JWT în răspuns
- [ ] Verificare cookie setat

### GET /auth/me
- [ ] Obținere profil cu token valid
- [ ] Eșec cu token invalid (401)
- [ ] Eșec fără token (401)

## 🛒 Cart & Checkout

### GET /cart
- [ ] Obținere coș gol (utilizator nou)
- [ ] Obținere coș cu itemi
- [ ] Eșec fără autentificare (401)

### POST /cart/items
- [ ] Adăugare produs în coș
- [ ] Actualizare cantitate pentru produs existent
- [ ] Validare productId invalid (404)
- [ ] Validare cantitate <= 0 (șterge item)

### PUT /cart/items/:id
- [ ] Actualizare cantitate item
- [ ] Validare cantitate 0 (șterge item)
- [ ] Eșec cu itemId invalid (404)

### DELETE /cart/items/:id
- [ ] Ștergere item din coș
- [ ] Eșec cu itemId invalid (404)

### POST /orders/checkout
- [ ] Checkout B2C (fără date firmă)
- [ ] Checkout B2B (cu date firmă)
- [ ] Validare coș gol (trebuie să eșueze)
- [ ] Verificare creare Order, OrderVendor, OrderItem, Commission
- [ ] Verificare cart marcat ca CONVERTED

## 📦 Orders

### GET /orders (Client)
- [ ] Listare comenzi client
- [ ] Filtrare după status
- [ ] Eșec fără autentificare (401)

### GET /orders/:id (Client)
- [ ] Obținere detalii comandă
- [ ] Eșec cu orderId invalid (404)
- [ ] Eșec cu comandă care nu îți aparține (403)

### GET /api/orders/mine (Producer)
- [ ] Listare comenzi producător
- [ ] Filtrare după status
- [ ] Eșec dacă nu e producător (404)

### PATCH /api/orders/vendor/orders/:id/status (Producer)
- [ ] Actualizare status comandă (PENDING → ACCEPTED)
- [ ] Validare tranziții invalide (trebuie să eșueze)
- [ ] Eșec cu comandă care nu îți aparține (403)

## 👤 Client Features

### GET /clients/me
- [ ] Obținere profil client
- [ ] Eșec dacă nu e client (403)

### PATCH /clients/me
- [ ] Actualizare profil client
- [ ] Validare date invalide (400)

### GET /clients/addresses
- [ ] Listare adrese client
- [ ] Listare goală pentru client nou

### POST /clients/addresses
- [ ] Creare adresă nouă
- [ ] Validare date obligatorii (400)

### PATCH /clients/addresses/:id
- [ ] Actualizare adresă
- [ ] Eșec cu addressId invalid (404)

### DELETE /clients/addresses/:id
- [ ] Ștergere adresă
- [ ] Eșec cu addressId invalid (404)

### PATCH /clients/addresses/:id/default
- [ ] Setare adresă ca principală
- [ ] Verificare că alte adrese nu mai sunt principale

### GET /clients/favorites
- [ ] Listare favorite
- [ ] Listare goală pentru client nou

### POST /clients/favorites
- [ ] Adăugare la favorite
- [ ] Validare productId invalid (404)

### DELETE /clients/favorites/:id
- [ ] Ștergere din favorite
- [ ] Eșec cu favoriteId invalid (404)

## 🏭 Producer Features

### GET /api/products/mine
- [ ] Listare produse producător
- [ ] Filtrare după status
- [ ] Eșec dacă nu e producător (404)

### POST /api/products
- [ ] Creare produs nou
- [ ] Validare date obligatorii (400)
- [ ] Verificare status inițial: PENDING_REVIEW

### PATCH /api/products/:id
- [ ] Actualizare produs
- [ ] Verificare că produs revine în PENDING_REVIEW dacă era APPROVED
- [ ] Eșec cu productId invalid (404)
- [ ] Eșec cu produs care nu îți aparține (403)

### DELETE /api/products/:id
- [ ] Ștergere produs
- [ ] Eșec cu productId invalid (404)

## 🌐 Public API

### GET /regions
- [ ] Listare regiuni
- [ ] Filtrare după type (COUNTY/REGION)
- [ ] Funcționează fără autentificare

### GET /api/public/products
- [ ] Listare produse aprobate
- [ ] Filtrare: q, regionId, priceMin, priceMax
- [ ] Paginare
- [ ] Funcționează fără autentificare

### GET /api/public/products/:slug
- [ ] Obținere produs după slug
- [ ] Eșec cu slug invalid (404)
- [ ] Funcționează fără autentificare

### GET /api/public/producers
- [ ] Listare producători aprobați
- [ ] Filtrare după regiune
- [ ] Funcționează fără autentificare

### GET /api/public/producers/:slug
- [ ] Obținere producător după slug
- [ ] Include produse active
- [ ] Funcționează fără autentificare

## 💳 Payments (Stripe)

### POST /api/payments/create-checkout
- [ ] Creare Stripe Checkout Session
- [ ] Validare orderId invalid (404)
- [ ] Eșec fără autentificare (401)

### POST /api/payments/webhook
- [ ] Primește evenimente Stripe
- [ ] Verificare semnătură webhook
- [ ] Actualizare status comandă după plată

## 🔒 Security & Authorization

### Teste Autorizare
- [ ] Client nu poate accesa endpoint-uri producător
- [ ] Producător nu poate accesa endpoint-uri admin
- [ ] Utilizator nu poate modifica resurse care nu îi aparțin

### Teste Rate Limiting
- [ ] Rate limiting activ pentru /auth/*
- [ ] Rate limiting activ pentru /api/payments/create-checkout
- [ ] Rate limiting general pentru toate rutele

### Teste CORS
- [ ] Request-uri de la origin-uri permise funcționează
- [ ] Request-uri de la origin-uri nepermise sunt blocate

## 📊 Rezumat Testare

După testare, completează:

- **Total teste:** ___
- **Pase:** ___
- **Eșecuri:** ___
- **Skipped:** ___

### Probleme Găsite

1. [ ] Problemă 1: ___
2. [ ] Problemă 2: ___
3. [ ] Problemă 3: ___

### Recomandări

- [ ] Endpoint-uri care necesită îmbunătățiri
- [ ] Validări care lipsesc
- [ ] Error messages care pot fi îmbunătățite

---

**Status:** 📋 **Checklist gata pentru testare manuală**

**Următorul pas:** Rulează testele și documentează rezultatele

