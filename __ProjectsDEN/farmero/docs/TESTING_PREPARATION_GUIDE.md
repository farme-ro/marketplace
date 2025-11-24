# 🧪 Testing Preparation Guide

**Data:** 2025-01-27  
**Scop:** Ghid pentru pregătirea testării aplicației

---

## 📋 Test Scenarios

### 1. Core Commerce Flow

**Scenariu:** Client cumpără produs

1. **Browse Products**
   - [ ] Accesează `/products`
   - [ ] Filtrează produse (categorie, regiune, preț)
   - [ ] Caută produs
   - [ ] Accesează pagina de detalii produs

2. **Add to Cart**
   - [ ] Adaugă produs în coș
   - [ ] Verifică că produsul apare în coș
   - [ ] Actualizează cantitatea
   - [ ] Șterge produs din coș

3. **Checkout**
   - [ ] Accesează `/checkout`
   - [ ] Completează formularul (adresă, livrare, plată)
   - [ ] Trimite comandă
   - [ ] Verifică confirmarea comenzii

4. **Order Management**
   - [ ] Accesează `/orders`
   - [ ] Vezi lista de comenzi
   - [ ] Accesează detalii comandă
   - [ ] Verifică status comandă

---

### 2. Producer Portal Flow

**Scenariu:** Producător gestionează produse și comenzi

1. **Login & Dashboard**
   - [ ] Login ca producător
   - [ ] Accesează dashboard
   - [ ] Verifică statistici (comenzi, produse, venituri)

2. **Product Management**
   - [ ] Accesează `/producer-portal/products`
   - [ ] Adaugă produs nou
   - [ ] Editează produs existent
   - [ ] Șterge produs
   - [ ] Activează/dezactivează produs

3. **Order Management**
   - [ ] Accesează `/producer-portal/orders`
   - [ ] Vezi lista de comenzi
   - [ ] Accesează detalii comandă
   - [ ] Actualizează status comandă

---

### 3. Authentication Flow

**Scenariu:** Utilizator se autentifică

1. **Login**
   - [ ] Accesează `/login`
   - [ ] Completează formularul
   - [ ] Verifică redirect după login (client/producer/admin)

2. **Register**
   - [ ] Accesează `/register`
   - [ ] Completează formularul
   - [ ] Verifică confirmare cont

3. **Logout**
   - [ ] Accesează logout
   - [ ] Verifică că sesiunea este închisă
   - [ ] Verifică redirect la homepage

---

### 4. Error Handling

**Scenariu:** Verificare error handling

1. **API Errors**
   - [ ] 401 Unauthorized - verifică redirect la login
   - [ ] 404 Not Found - verifică pagina de eroare
   - [ ] 422 Validation Error - verifică mesaje de eroare
   - [ ] 500 Server Error - verifică mesaj generic

2. **Network Errors**
   - [ ] Simulează network error
   - [ ] Verifică mesaj de eroare
   - [ ] Verifică retry mechanism (dacă există)

3. **React Errors**
   - [ ] Verifică ErrorBoundary
   - [ ] Verifică mesaj de eroare user-friendly

---

### 5. Performance Testing

**Scenariu:** Verificare performanță

1. **Lighthouse Audit**
   - [ ] Performance score > 90
   - [ ] Accessibility score > 90
   - [ ] Best Practices score > 90
   - [ ] SEO score > 90

2. **Core Web Vitals**
   - [ ] LCP (Largest Contentful Paint) < 2.5s
   - [ ] FID (First Input Delay) < 100ms
   - [ ] CLS (Cumulative Layout Shift) < 0.1

3. **Bundle Size**
   - [ ] First Load JS < 200KB
   - [ ] Individual Route < 150KB

---

## 📝 Test Checklist

### Pre-Launch Checklist

#### Functionality
- [ ] Toate flow-urile critice funcționează
- [ ] Formularele au validare completă
- [ ] Error handling funcționează corect
- [ ] Responsive design funcționează pe toate device-urile

#### Performance
- [ ] Lighthouse scores > 90
- [ ] Core Web Vitals în target
- [ ] Bundle size în target
- [ ] Images optimizate

#### Accessibility
- [ ] ARIA labels pe toate elementele interactive
- [ ] Keyboard navigation funcționează
- [ ] Focus states vizibile
- [ ] Screen reader friendly

#### SEO
- [ ] Meta tags pe toate paginile
- [ ] OpenGraph configurat
- [ ] Sitemap generat corect
- [ ] Robots.txt configurat corect

---

## 🧪 Test Tools

### 1. Playwright (E2E Testing)

**Setup:**
```bash
npm install
npm run test:e2e
```

**Teste disponibile:**
- `tests/e2e/login-role-redirect.spec.ts` - Login și redirect-uri
- `tests/e2e/client-order-flow.spec.ts` - Flow comandă client
- `tests/e2e/producer-orders-flow.spec.ts` - Flow comenzi producător
- `tests/e2e/investor-dashboard.spec.ts` - Dashboard investitor

### 2. Lighthouse (Performance)

**Setup:**
```bash
# Chrome DevTools → Lighthouse tab
# Sau folosește CLI:
npm install -g lighthouse
lighthouse https://farme.ro
```

### 3. Bundle Analyzer

**Setup:**
```bash
npm run analyze
```

---

## 📊 Test Results Template

### Test Run: [Date]

**Environment:**
- Frontend: [Version]
- Backend: [Version]
- Browser: [Browser + Version]

**Results:**
- ✅ Passed: [Number]
- ❌ Failed: [Number]
- ⚠️ Skipped: [Number]

**Issues Found:**
1. [Issue description]
   - Severity: [High/Medium/Low]
   - Status: [Open/Fixed]

---

## 🔗 Documentație Utilă

- `docs/CORE_COMMERCE_QA_CHECKLIST.md` - Checklist detaliat pentru commerce
- `docs/FARMERO_QA_TEST_PLAN.md` - Plan complet de QA
- `docs/BUNDLE_ANALYSIS_GUIDE.md` - Ghid bundle analysis
- `PERFORMANCE_OPTIMIZATIONS.md` - Optimizări performanță

---

**Ultima actualizare:** 2025-01-27

