# Lista Completă a Link-urilor Site-ului farme.ro

## 📍 Rute Publice (Paginile Principale)

### Homepage & Navigare
- `/` - Homepage
- `/products` - Lista produselor
- `/products/[slug]` - Pagină produs individual (dinamic)
- `/producers` - Lista producătorilor
- `/producers/[slug]` - Pagină producător individual (dinamic)
- `/producers/[slug]/products` - Produsele unui producător (dinamic - **404**)

### Despre & Informații
- `/about` - Despre noi
- `/about#mission` - Secțiunea Misiune (anchor)
- `/cum-functioneaza` - Cum funcționează farme.ro
- `/cum-functioneaza#impact-section` - Secțiunea Impact social (anchor)
- `/cum-functioneaza-si-impact` - Cum funcționează + Impact social (pagină dedicată)
- `/how-it-works` - Cum funcționează (alternativ)
- `/how-it-works#pricing-policy` - Secțiunea Politică prețuri (anchor)
- `/how-it-works#social-impact` - Secțiunea Impact social (anchor)
- `/fees` - Comisioane & taxe
- `/faq` - Întrebări frecvente
- `/contact` - Contact

### Pentru Producători (Landing)
- `/for-producers` - Pentru producători (landing)
- `/pentru-producatori` - Pentru producători (alternativ)

### Legal & GDPR
- `/terms` - Termeni și condiții
- `/privacy` - Politica de confidențialitate
- `/cookies` - Politica de cookies
- `/gdpr` - Protecția datelor (GDPR)
- `/anpc` - ANPC / Soluționare litigii (**404**)

### E-commerce & Checkout
- `/checkout` - Pagină checkout
- `/checkout/payment` - Pagină plată
- `/thank-you` - Pagină mulțumire după comandă
- `/orders` - Comenzile clientului (**404**)

### Autentificare Clienți
- `/login-client` - Login client
- `/register-client` - Înregistrare client
- `/forgot-password` - Resetare parolă (**404**)

### Utilitare
- `/status` - Status backend & API
- `/backend-test` - Test backend

---

## 🔐 Producer Portal (Portal Producători)

### Autentificare & Înregistrare
- `/producer-portal/login` - Login producător
- `/producer-portal/register` - Înregistrare producător
- `/producer-portal/guide` - Ghid producător

### Dashboard & Management
- `/producer-portal/dashboard` - Dashboard principal
- `/producer-portal/orders` - Comenzi producător
- `/producer-portal/orders/[id]` - Detalii comandă (dinamic - **404**)
- `/producer-portal/products` - Lista produselor
- `/producer-portal/products/new` - Adaugă produs nou
- `/producer-portal/products/[id]/edit` - Editează produs (dinamic)

### Finanțe & Comisioane
- `/producer-portal/commissions` - Comisioane & abonamente
- `/producer-portal/commissions#commission-calculation` - Secțiunea Calcul comision (anchor)
- `/producer-portal/subscriptions` - Abonamente & beneficii
- `/producer-portal/finances` - Facturi & Finanțe (placeholder)
- `/producer-portal/insights` - Statistici & Analize

### Setări & Suport
- `/producer-portal/settings` - Setări cont
- `/producer-portal/support` - Suport (placeholder)
- `/producer-portal/shipping-guide` - Ghid Livrări & Logistică (placeholder)

---

## 🛒 Rute E-commerce (Dinamice)

### Produse
- `/products/[slug]` - Pagină produs individual
- `/products?category=[slug]` - Filtrare după categorie
- `/products?regionId=[id]` - Filtrare după regiune

### Producători
- `/producers/[slug]` - Pagină producător individual
- `/producers/[slug]/products` - Produsele unui producător (**404**)

---

## 🔗 Link-uri Externe & Anchor-uri

### Anchor-uri (Hash Links)
- `/#` - Homepage cu anchor
- `/about#mission` - Misiune & Valori
- `/cum-functioneaza#impact-section` - Impact social
- `/how-it-works#pricing-policy` - Politică prețuri
- `/how-it-works#social-impact` - Impact social
- `/producer-portal/commissions#commission-calculation` - Calcul comision

### Link-uri Externe (menționate în cod)
- `mailto:contact@farme.ro` - Email contact
- `mailto:privacy@farme.ro` - Email privacy

---

## ⚠️ Rute care returnează 404 (identificate în audit)

### Prioritate Înaltă
1. `/producer-portal/orders/[id]` - Detalii comandă producător
2. `/forgot-password` - Resetare parolă
3. `/orders` - Comenzi client

### Prioritate Medie
4. `/producer-portal/shipping-guide` - Ghid livrări (existentă ca placeholder)
5. `/producer-portal/finances` - Finanțe producător (existentă ca placeholder)
6. `/producer-portal/support` - Suport producător (existentă ca placeholder)
7. `/anpc` - Soluționare litigii
8. `/producer-subscription` - Abonamente producători
9. `/producers/[slug]/products` - Produse producător

### Prioritate Scăzută
10. `/b2b` - HoReCa & business
11. `/diaspora` - Pentru diaspora

---

## 📊 Statistici Rute

### Total Rute Identificate: **~60+ rute**

#### Rute Publice: **~25**
- Homepage: 1
- Produse: 3 (listă + dinamic + filtre)
- Producători: 3 (listă + dinamic + produse)
- Despre & Info: 8
- Legal: 5
- E-commerce: 4
- Autentificare: 3

#### Producer Portal: **~15**
- Autentificare: 3
- Dashboard: 3
- Produse: 3
- Finanțe: 4
- Setări: 2

#### Rute Dinamice: **~5**
- Produse individuale
- Producători individuali
- Comenzi individuale

#### Anchor-uri: **~6**

---

## 🗺️ Structura de Navigare

### Meniu Principal (Desktop)
- `/` - Homepage
- `/products` - Produse
- `/about` - Despre
- `/cum-functioneaza` - Cum funcționează
- `/fees` - Comisioane & taxe
- `/for-producers` - Pentru producători (XL+)
- `/contact` - Contact

### Footer Links

#### Clienți
- `/cum-functioneaza` - Cum funcționează
- `/producers` - Producători
- `/products` - Produse
- `/cum-functioneaza#impact-section` - Impact social
- `/faq` - FAQ

#### Producători
- `/producer-portal/register` - Înregistrare
- `/producer-portal/login` - Login
- `/producer-portal/commissions` - Comisioane
- `/producer-portal/subscriptions` - Abonamente
- `/producer-portal/shipping-guide` - Ghid livrări

#### Despre
- `/about` - Despre noi
- `/about#mission` - Misiune & valori
- `/b2b` - HoReCa & business (**404**)
- `/contact` - Contact
- `/diaspora` - Pentru diaspora (**404**)

#### Legal
- `/terms` - Termeni și condiții
- `/privacy` - Politica de confidențialitate
- `/cookies` - Politica de cookies
- `/anpc` - ANPC (**404**)
- `/gdpr` - Protecția datelor

### Producer Portal Sidebar
- `/producer-portal/dashboard` - Dashboard
- `/producer-portal/orders` - Comenzi
- `/producer-portal/products` - Produse
- `/producer-portal/subscriptions` - Abonament & beneficii
- `/producer-portal/finances` - Finanțe
- `/producer-portal/commissions` - Comisioane
- `/producer-portal/insights` - Statistici
- `/producer-portal/settings` - Setări

---

## 📝 Note

- Rutele marcate cu **404** necesită crearea paginilor corespunzătoare
- Rutele dinamice `[slug]` și `[id]` sunt generate la runtime
- Anchor-urile (hash links) nu sunt rute separate, ci secțiuni din pagini
- Unele rute au variante alternative (ex: `/for-producers` și `/pentru-producatori`)
- Link-urile externe (mailto:) nu sunt rute Next.js

---

**Ultima actualizare:** Generat automat din scanarea codului
**Total fișiere page.tsx:** 40
**Total link-uri identificate:** 130+

