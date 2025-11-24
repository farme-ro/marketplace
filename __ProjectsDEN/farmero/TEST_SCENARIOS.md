# 📋 Test Scenarios - farme.ro

**Data:** 2025-01-27  
**Status:** 📋 **Scenarii de testare pentru toate flow-urile**

---

## 🎯 Scop

Acest document descrie scenariile de testare pentru toate flow-urile principale ale aplicației.

---

## 🔐 Flow 1: Register & First Order (Client)

### Scenariu: Client nou face prima comandă

**Pași:**
1. **Register**
   - Accesează `/register`
   - Completează formularul (email, parolă, nume)
   - Submit
   - Verifică: Redirect la `/account` sau `/`
   - Verifică: Email de confirmare (dacă e implementat)

2. **Browse Produse**
   - Accesează `/products`
   - Filtrează după categorie
   - Caută un produs
   - Verifică: Rezultatele se filtrează corect

3. **View Product**
   - Click pe un produs
   - Verifică: Detaliile produsului se încarcă
   - Verifică: Imaginea se încarcă
   - Verifică: Prețul și stocul sunt afișate

4. **Add to Cart**
   - Selectează cantitate
   - Click "Adaugă în coș"
   - Verifică: Toast notification apare
   - Verifică: Cart counter se actualizează

5. **View Cart**
   - Accesează `/cart`
   - Verifică: Produsul este în cart
   - Verifică: Totalul este calculat corect

6. **Checkout**
   - Click "Finalizează comandă"
   - Completează adresa de livrare
   - Selectează metoda de plată
   - Submit
   - Verifică: Order confirmation page
   - Verifică: Email de confirmare (dacă e implementat)

7. **View Order**
   - Accesează `/orders`
   - Verifică: Comanda apare în listă
   - Click pe comandă
   - Verifică: Detaliile comenzii sunt corecte

**Rezultat așteptat:** Clientul poate face o comandă completă fără erori.

---

## 🏭 Flow 2: Producer Onboarding & Product Management

### Scenariu: Producător nou se înregistrează și adaugă produse

**Pași:**
1. **Register Producer**
   - Accesează `/register` (selectează Producer)
   - Completează date personale
   - Completează date companie (CUI, nume, adresă)
   - Upload documente (dacă e implementat)
   - Submit
   - Verifică: Status PENDING_VERIFICATION

2. **Admin Approval** (testat de admin)
   - Admin accesează `/admin/producers`
   - Verifică: Producer apare în listă
   - Review documente
   - Aprobă producătorul
   - Verifică: Status devine APPROVED

3. **Producer Login**
   - Producer se loghează
   - Verifică: Redirect la `/producer-portal/dashboard`
   - Verifică: Dashboard se încarcă

4. **Add Product**
   - Accesează `/producer-portal/products`
   - Click "Adaugă produs"
   - Completează formularul (nume, descriere, preț, stoc, categorie)
   - Upload imagine produs
   - Submit
   - Verifică: Produs apare cu status PENDING_REVIEW

5. **Admin Approve Product** (testat de admin)
   - Admin accesează `/admin/products`
   - Verifică: Produs apare în listă
   - Review produs
   - Aprobă produsul
   - Verifică: Status devine APPROVED

6. **View Product Public**
   - Accesează `/products` (public)
   - Verifică: Produsul apare în listă
   - Click pe produs
   - Verifică: Detaliile sunt corecte

**Rezultat așteptat:** Producătorul poate adăuga produse care devin vizibile public după aprobare.

---

## 🛒 Flow 3: Cart & Checkout (Multiple Products)

### Scenariu: Client adaugă multiple produse și face checkout

**Pași:**
1. **Add Multiple Products**
   - Adaugă produs 1 (producător A)
   - Adaugă produs 2 (producător A)
   - Adaugă produs 3 (producător B)
   - Verifică: Toate produsele în cart

2. **Update Quantities**
   - Modifică cantitatea produsului 1
   - Șterge produsul 2
   - Verifică: Cart se actualizează corect

3. **Checkout**
   - Accesează `/checkout`
   - Completează adresa
   - Verifică: Shipping cost calculat
   - Verifică: Total calculat corect (inclusiv shipping)
   - Submit

4. **Order Split**
   - Verifică: Order creat cu status PENDING
   - Verifică: OrderVendor creat pentru producător A
   - Verifică: OrderVendor creat pentru producător B
   - Verifică: Commission calculat pentru fiecare

5. **Producer Views Order**
   - Producer A se loghează
   - Accesează `/producer-portal/orders`
   - Verifică: Vede doar comenzile cu produsele sale
   - Verifică: Status este PENDING

**Rezultat așteptat:** Comenzile sunt split-uite corect pe producători și comisioanele sunt calculate.

---

## 💳 Flow 4: Payment with Stripe

### Scenariu: Client plătește cu card (dacă Stripe e configurat)

**Pași:**
1. **Add to Cart & Checkout**
   - Adaugă produse în cart
   - Accesează `/checkout`
   - Completează adresa

2. **Select Payment Method**
   - Selectează "Card"
   - Verifică: Stripe Elements se încarcă

3. **Enter Card Details**
   - Completează card details (test card)
   - Submit
   - Verifică: Redirect la Stripe Checkout

4. **Complete Payment**
   - Completează payment pe Stripe
   - Verifică: Redirect înapoi la `/thank-you`

5. **Verify Order**
   - Verifică: Order status este PAID
   - Verifică: Payment status este PAID
   - Verifică: Email de confirmare (dacă e implementat)

6. **Webhook Verification** (backend)
   - Verifică: Webhook primit de Stripe
   - Verifică: Order actualizat corect

**Rezultat așteptat:** Payment flow complet funcționează cu Stripe.

---

## ⭐ Flow 5: Reviews & Ratings

### Scenariu: Client lasă review după comandă

**Pași:**
1. **Complete Order**
   - Client face o comandă
   - Producer acceptă și livrează
   - Order status devine COMPLETED

2. **Add Review**
   - Client accesează `/orders/:id`
   - Click "Lasă review"
   - Selectează rating (1-5 stele)
   - Scrie comentariu
   - Submit
   - Verifică: Review creat cu status PENDING (necesită aprobare admin)

3. **Admin Approve Review** (testat de admin)
   - Admin accesează reviews pending
   - Aprobă review-ul
   - Verifică: Status devine APPROVED

4. **View Review Public**
   - Accesează pagina produsului
   - Verifică: Review-ul apare
   - Verifică: Rating mediu calculat corect
   - Verifică: "Verified Purchase" badge (dacă e cumpărare verificată)

**Rezultat așteptat:** Review-urile funcționează corect cu workflow de aprobare.

---

## 🔔 Flow 6: Notifications & Alerts

### Scenariu: Client primește notificări

**Pași:**
1. **Order Status Change**
   - Client face o comandă
   - Producer acceptă comandă
   - Verifică: Client primește notificare

2. **View Notifications**
   - Client accesează `/account` (sau notifications center)
   - Verifică: Notificările apar
   - Verifică: Unread count corect

3. **Mark as Read**
   - Click pe notificare
   - Verifică: Notificarea devine read
   - Verifică: Unread count se actualizează

4. **Alert Preferences**
   - Accesează alert preferences
   - Modifică preferințele
   - Verifică: Preferences salvate

**Rezultat așteptat:** Sistemul de notificări funcționează corect.

---

## 🚚 Flow 7: Order Fulfillment (Producer)

### Scenariu: Producător gestionează comandă de la acceptare la livrare

**Pași:**
1. **Receive Order**
   - Producer se loghează
   - Verifică: Comandă nouă în `/producer-portal/orders`
   - Status: PENDING

2. **Accept Order**
   - Click "Acceptă comandă"
   - Verifică: Status devine ACCEPTED
   - Verifică: Client primește notificare

3. **Prepare Order**
   - Click "Pregătește comandă"
   - Verifică: Status devine PREPARING
   - Verifică: Client primește notificare

4. **Ship Order**
   - Adaugă tracking number
   - Click "Trimite comandă"
   - Verifică: Status devine SHIPPED
   - Verifică: Client primește notificare cu tracking

5. **Deliver Order**
   - Click "Comandă livrată"
   - Verifică: Status devine DELIVERED
   - Verifică: Client primește notificare
   - Verifică: Order status global devine COMPLETED

**Rezultat așteptat:** Workflow-ul de fulfillment funcționează corect.

---

## 📊 Flow 8: Admin Dashboard

### Scenariu: Admin gestionează platforma

**Pași:**
1. **Login as Admin**
   - Admin se loghează
   - Verifică: Redirect la `/admin/dashboard`

2. **Approve Producers**
   - Accesează `/admin/producers`
   - Verifică: Producători pending
   - Aprobă/respinge producători
   - Verifică: Status actualizat

3. **Approve Products**
   - Accesează `/admin/products`
   - Verifică: Produse pending
   - Aprobă/respinge produse
   - Verifică: Status actualizat

4. **View Commissions**
   - Accesează `/admin/commissions`
   - Verifică: Comisioane calculate
   - Verifică: Total comisioane

5. **View Orders**
   - Accesează `/admin/orders`
   - Verifică: Toate comenzile
   - Verifică: Filtrare funcționează

**Rezultat așteptat:** Admin poate gestiona toate aspectele platformei.

---

## 🔍 Edge Cases & Error Scenarios

### Scenariu 1: Network Error
- Simulează network error
- Verifică: Error message afișat
- Verifică: Retry funcționează

### Scenariu 2: Invalid Input
- Completează formular cu date invalide
- Verifică: Validation errors afișate
- Verifică: Form nu se submită

### Scenariu 3: Expired Session
- Așteaptă expirarea token-ului
- Încearcă request
- Verifică: Redirect la login

### Scenariu 4: Out of Stock
- Adaugă produs out of stock în cart
- Verifică: Error message
- Verifică: Produs nu se adaugă

### Scenariu 5: Concurrent Orders
- Două clienți comandă ultimul produs simultan
- Verifică: Doar unul primește produsul
- Verifică: Celălalt primește error message

---

**Status:** 📋 **Scenarii complete pentru testare**

**Notă:** Testează fiecare scenariu și documentează rezultatele în `TEST_RESULTS.md`.

