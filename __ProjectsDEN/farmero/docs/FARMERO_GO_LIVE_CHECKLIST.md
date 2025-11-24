# 🚀 Farmero Go-Live Checklist

**Data:** 2025-01-27  
**Scop:** Checklist compact și pragmatic pentru lansare live  
**Status:** 📋 Ready to Use

---

## 📋 Înainte de Hook cu Backend Live

### Environment & Config

- [ ] Setează `NEXT_PUBLIC_API_URL=https://api.farme.ro` în Vercel (Production, Preview, Development)
- [ ] Setează `NEXT_PUBLIC_APP_URL=https://farme.ro` (opțional, recomandat)
- [ ] Verifică că toate env vars sunt setate corect în Vercel Dashboard
- [ ] Redeploy aplicația după setarea env vars
- [ ] Verifică că build-ul trece fără erori (`npm run build`)

### Frontend UI/UX

- [ ] Testează homepage-ul: toate secțiunile se încarcă corect
- [ ] Verifică navigația: header, footer, mega menu funcționează
- [ ] Testează light/dark mode: switch-ul funcționează, contrast OK
- [ ] Verifică responsive: desktop, tablet, mobile (testează pe device real)
- [ ] Testează toate link-urile: nu există link-uri către pagini inexistente
- [ ] Verifică paginile "Coming soon": afișează EmptyState corect

### i18n & Text

- [ ] Verifică că toate textele sunt traduse (RO + EN minim)
- [ ] Testează switch-ul de limbă: funcționează corect
- [ ] Verifică că nu există texte hardcodate (toate prin i18n)
- [ ] Testează formatele de dată/număr: se afișează corect în ambele limbi

### Pagini Critice

- [ ] `/products` - Lista produse se încarcă, filtrele funcționează
- [ ] `/producers` - Lista producători se încarcă, filtrele funcționează
- [ ] `/products/[slug]` - Detalii produs: toate secțiunile se afișează
- [ ] `/producers/[slug]` - Detalii producător: toate secțiunile se afișează
- [ ] `/cart` - Coșul se încarcă (chiar dacă e gol)
- [ ] `/checkout` - Formularul se încarcă (chiar dacă nu poți finaliza)
- [ ] `/login` - Formularul de login funcționează
- [ ] `/register` - Formularul de înregistrare funcționează

### Portale (UI Only)

- [ ] `/producer-portal/dashboard` - Se încarcă, EmptyState dacă e cazul
- [ ] `/business-portal/dashboard` - Se încarcă, EmptyState dacă e cazul
- [ ] `/logistics-portal/dashboard` - Se încarcă, EmptyState dacă e cazul
- [ ] `/investor-portal/dashboard` - Se încarcă, EmptyState dacă e cazul

### Accesibilitate Minimă

- [ ] Butoanele icon-only au `aria-label` (ThemeToggle, Cart, Notifications)
- [ ] Link-urile icon-only au `aria-label` sau `title`
- [ ] Heading-urile sunt semantice (h1, h2, h3)
- [ ] Formularele au label-uri asociate
- [ ] Contrastul textului vs background este OK (verificare vizuală)

### SEO & Meta

- [ ] Verifică `<title>` și `<meta description>` pe homepage
- [ ] Verifică Open Graph tags pe homepage
- [ ] Verifică că `sitemap.xml` este generat corect
- [ ] Verifică că `robots.txt` este corect
- [ ] Testează share pe Facebook/Twitter: preview-ul arată corect

### PWA & Performance

- [ ] Verifică că `manifest.json` este corect
- [ ] Testează instalarea PWA pe mobile (dacă e activat)
- [ ] Verifică că imaginile folosesc `next/image`
- [ ] Testează loading states: skeleton-urile apar corect
- [ ] Verifică că nu există console.error-uri în production build

---

## 🔗 După Conectarea Backend-ului

### CORS & Auth

- [ ] Verifică că backend permite origin-ul frontend-ului în CORS
- [ ] Verifică că `credentials: 'include'` funcționează (cookie-uri se trimit)
- [ ] Testează login: cookie-ul se setează corect
- [ ] Testează logout: cookie-ul se șterge corect
- [ ] Verifică că request-urile autentificate funcționează

### Feature Flags Activation

- [ ] Activează `cart` în `BackendSyncStatus` (după ce backend e gata)
- [ ] Activează `checkout` în `BackendSyncStatus` (după ce backend e gata)
- [ ] Activează `clientOrders` în `BackendSyncStatus` (după ce backend e gata)
- [ ] Activează `producerProducts` în `BackendSyncStatus` (după ce backend e gata)
- [ ] Activează `producerOrders` în `BackendSyncStatus` (după ce backend e gata)
- [ ] Verifică în `/internal/status` că feature-urile sunt marcate ca "Active"

### Flow-uri Critice Testate

- [ ] **Login/Logout:** User se loghează, cookie setat, logout funcționează
- [ ] **Add to Cart:** Produs adăugat în coș, apare în `/cart`
- [ ] **Checkout:** Formular completat, comandă creată, redirect la "Thank you"
- [ ] **Orders List:** Comenzile clientului apar în `/orders`
- [ ] **Order Detail:** Detaliile comenzii se încarcă corect
- [ ] **Producer Products:** Producătorul vede produsele sale
- [ ] **Producer Orders:** Producătorul vede comenzile sale

### Error Handling

- [ ] Testează 401 Unauthorized: redirect la login corect
- [ ] Testează 404 Not Found: pagina de eroare se afișează
- [ ] Testează 422 Validation Error: mesajele de eroare apar în formular
- [ ] Testează 500 Server Error: mesaj generic user-friendly se afișează
- [ ] Testează network error: mesaj de eroare se afișează

### Monitoring & Logging

- [ ] Verifică că Sentry este configurat (dacă e activat)
- [ ] Testează că erorile sunt logate corect
- [ ] Verifică că analytics events sunt trimise (dacă e activat)
- [ ] Verifică că `/internal/status` arată backend-ul ca "Online"

---

## 🎯 În Ziua Lansării

### Pre-Launch (Dimineața)

- [ ] Verifică că toate env vars sunt setate în Vercel Production
- [ ] Verifică că build-ul production trece fără erori
- [ ] Verifică că backend-ul este live și răspunde la `/health`
- [ ] Verifică că CORS este configurat corect în backend
- [ ] Testează login/logout pe production URL
- [ ] Verifică că toate link-urile funcționează pe production

### Launch (Ora X)

- [ ] Deploy production (sau verifică că ultimul deploy e live)
- [ ] Verifică că homepage-ul se încarcă corect
- [ ] Testează un flow complet: login → add to cart → checkout
- [ ] Verifică că email-urile de confirmare se trimit (dacă e cazul)
- [ ] Verifică că notificările funcționează (dacă e cazul)

### Post-Launch (Prima Oră)

- [ ] Monitorizează Sentry pentru erori (dacă e activat)
- [ ] Verifică că nu există erori în console (production)
- [ ] Testează pe device-uri reale (mobile, tablet)
- [ ] Verifică că toate portalele funcționează (producer, business, logistics)
- [ ] Verifică că link-urile sociale funcționează (share buttons)

---

## 📊 Primele 72 de Ore După Lansare

### Zilele 1-2

- [ ] Monitorizează erorile în Sentry (dacă e activat)
- [ ] Verifică că nu există crash-uri majore
- [ ] Testează flow-uri critice cu useri reali (dacă e posibil)
- [ ] Verifică că email-urile se trimit corect
- [ ] Verifică că notificările funcționează

### Zilele 2-3

- [ ] Verifică că performanța este OK (loading times)
- [ ] Verifică că nu există memory leaks (dacă e posibil)
- [ ] Verifică că toate feature-urile activate funcționează
- [ ] Colectează feedback de la useri (dacă e posibil)
- [ ] Documentează problemele găsite pentru fix-uri

### Optimizări Post-Launch

- [ ] Analizează analytics (dacă e activat): ce pagini sunt cele mai vizitate
- [ ] Identifică flow-urile cu cele mai multe erori
- [ ] Prioritizează fix-urile pentru următoarea iterație
- [ ] Planifică activarea feature-urilor rămase (vezi `FARMERO_BACKENDSYNC_ACTIVATION_PLAN.md`)

---

## 🔍 Verificări Suplimentare

### Browser Compatibility

- [ ] Chrome (latest): toate funcționalitățile funcționează
- [ ] Firefox (latest): toate funcționalitățile funcționează
- [ ] Safari (latest): toate funcționalitățile funcționează
- [ ] Edge (latest): toate funcționalitățile funcționează
- [ ] Mobile Safari (iOS): toate funcționalitățile funcționează
- [ ] Chrome Mobile (Android): toate funcționalitățile funcționează

### Performance

- [ ] Lighthouse Score: > 80 pentru Performance
- [ ] Lighthouse Score: > 90 pentru Accessibility
- [ ] Lighthouse Score: > 90 pentru Best Practices
- [ ] Lighthouse Score: > 80 pentru SEO
- [ ] First Contentful Paint: < 2s
- [ ] Time to Interactive: < 3.5s

### Security

- [ ] Verifică că nu există console.log-uri cu date sensibile
- [ ] Verifică că API keys nu sunt expuse în frontend
- [ ] Verifică că HTTPS este forțat în production
- [ ] Verifică că cookies sunt httpOnly și secure în production

---

## 📚 Documentație Referință

- **Backend Handoff:** `docs/FARMERO_BACKEND_HANDOFF_CHECKLIST.md`
- **BackendSync Activation:** `docs/FARMERO_BACKENDSYNC_ACTIVATION_PLAN.md`
- **Launch Readiness:** `docs/FARMERO_FINAL_LAUNCH_READINESS_REPORT.md`
- **Frontend TODO:** `docs/FARMERO_LAUNCH_TODO_FRONTEND.md`
- **Bug Sweep:** `docs/FARMERO_FRONTEND_BUG_SWEEP_REPORT.md`
- **Internal Status:** `docs/FARMERO_INTERNAL_STATUS_DASHBOARD.md`

---

## ✅ Final Checklist

Înainte de a marca lansarea ca "Complete":

- [ ] Toate verificările de mai sus sunt bifate
- [ ] Backend-ul este live și răspunde corect
- [ ] Toate feature-urile critice sunt activate
- [ ] Nu există erori majore în Sentry
- [ ] Performance este acceptabil
- [ ] Userii pot folosi platforma fără probleme majore

---

**Ultima actualizare:** 2025-01-27  
**Următorul review:** După lansare

