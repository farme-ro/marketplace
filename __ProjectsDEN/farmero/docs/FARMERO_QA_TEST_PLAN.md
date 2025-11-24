# Farmero QA Test Plan

## Scope

Acest plan de testare acoperă verificarea fluxurilor critice end-to-end în limitele frontend-ului. Backend-ul este într-un repo separat și trebuie să fie disponibil (live sau staging) pentru testarea completă.

## Fluxuri Acoperite

### 1. Client Flow

#### 1.1. Login & Redirect
- **Scenariu:** Utilizator client se autentifică și este redirecționat corect
- **Pași:**
  1. Navighează la `/login`
  2. Completează email și parolă
  3. Click pe butonul "Login"
  4. Verifică redirect la `/account` sau `/select-account` (dacă are multiple roluri)

#### 1.2. Browse Products
- **Scenariu:** Utilizator navighează și explorează produse
- **Pași:**
  1. Navighează la `/products` sau homepage
  2. Verifică că produsele se încarcă
  3. Click pe un produs pentru a vedea detalii
  4. Verifică că pagina de detalii se încarcă corect

#### 1.3. Add to Cart
- **Scenariu:** Utilizator adaugă produse în coș
- **Pași:**
  1. Pe pagina de produs, selectează cantitate
  2. Click pe "Adaugă în coș"
  3. Verifică că produsul apare în coș (badge sau notificare)
  4. Navighează la `/cart` și verifică că produsul este listat

#### 1.4. Checkout Flow
- **Scenariu:** Utilizator finalizează o comandă
- **Pași:**
  1. Din `/cart`, click pe "Finalizează comandă"
  2. Navighează la `/checkout`
  3. Completează câmpurile necesare (adresă, telefon, etc.)
  4. Selectează metoda de livrare (dacă aplicabil)
  5. Click pe "Plasează comanda"
  6. Verifică redirect la pagina de confirmare sau `/orders`

#### 1.5. View Orders & Details
- **Scenariu:** Utilizator vede comenzile sale
- **Pași:**
  1. Navighează la `/orders`
  2. Verifică că lista de comenzi se încarcă
  3. Click pe o comandă pentru a vedea detalii
  4. Verifică că pagina `/orders/[id]` afișează toate detaliile (produse, total, status, livrare)

### 2. Producer Flow

#### 2.1. Login & Redirect
- **Scenariu:** Producător se autentifică și este redirecționat
- **Pași:**
  1. Navighează la `/login`
  2. Completează credențialele de producător
  3. Verifică redirect la `/producer-portal/dashboard`

#### 2.2. View Orders
- **Scenariu:** Producător vede comenzile primite
- **Pași:**
  1. Navighează la `/producer-portal/orders`
  2. Verifică că lista de comenzi se încarcă
  3. Verifică că fiecare comandă afișează: client, total, dată, status

#### 2.3. Update Order Status
- **Scenariu:** Producător schimbă statusul unei comenzi
- **Pași:**
  1. Deschide detalii comenzii (`/producer-portal/orders/[id]`)
  2. Selectează un nou status (ex: "CONFIRMĂ", "PREPARE", "EXPEDIATĂ")
  3. Confirmă schimbarea
  4. Verifică că statusul s-a actualizat vizual (badge, mesaj)

#### 2.4. View Sales & Commissions
- **Scenariu:** Producător vede vânzările și comisioanele
- **Pași:**
  1. Navighează la `/producer-portal/sales-commissions`
  2. Verifică că se încarcă rezumatul perioadei curente (sau mesaj "Coming soon")
  3. Verifică lista de extrase (statements)
  4. Click pe un extras pentru a vedea detalii

### 3. Investor Flow

#### 3.1. Login & Redirect
- **Scenariu:** Investitor se autentifică și este redirecționat
- **Pași:**
  1. Navighează la `/login`
  2. Completează credențialele de investitor
  3. Verifică redirect la `/investor-portal/dashboard`

#### 3.2. View Investor Dashboard
- **Scenariu:** Investitor vede dashboard-ul cu metrici
- **Pași:**
  1. Navighează la `/investor-portal/dashboard`
  2. Verifică că titlul "Panou investitor" este prezent
  3. Verifică că snapshot-ul afișează KPI cards (sau mesaj "în curs de pregătire" dacă feature-ul e dezactivat)
  4. Verifică secțiunile: "Evoluție în timp", "Creștere & retenție", "Segmente & regiuni"

## Tipuri de Teste

### Teste Manuale

Testele manuale sunt documentate în:
- `docs/CORE_COMMERCE_QA_CHECKLIST.md` - pentru fluxurile de commerce
- Acest document - pentru fluxurile generale

**Proces:**
1. Rulează aplicația local sau pe staging
2. Urmează pașii documentați pentru fiecare scenariu
3. Verifică comportamentul așteptat
4. Documentează orice probleme găsite

### Teste E2E Automate

Testele E2E automate sunt implementate cu **Playwright** și se găsesc în:
- `tests/e2e/login-role-redirect.spec.ts` - Login și redirect pe rol
- `tests/e2e/client-order-flow.spec.ts` - Flux client complet
- `tests/e2e/producer-orders-flow.spec.ts` - Flux producător
- `tests/e2e/investor-dashboard.spec.ts` - Dashboard investitor

**Rulare:**
```bash
# Rulează toate testele E2E
npm run test:e2e

# Rulează testele în mod UI (headed)
npm run test:e2e:ui

# Rulează un test specific
npm run test:e2e -- tests/e2e/login-role-redirect.spec.ts
```

## Pre-requisite

### Backend

Backend-ul trebuie să fie disponibil și configurat:
- **URL:** Setat în `E2E_BASE_URL` (default: `http://localhost:3000`)
- **Staging:** Recomandat pentru testare E2E
- **API:** `https://api.farme.ro` (sau staging equivalent)

### Conturi de Test

**IMPORTANT:** Nu hardcode credențiale în cod. Folosește variabile de environment:

```env
# Client test account
E2E_CLIENT_EMAIL=test-client@farmero.test
E2E_CLIENT_PASSWORD=test-password-123

# Producer test account
E2E_PRODUCER_EMAIL=test-producer@farmero.test
E2E_PRODUCER_PASSWORD=test-password-123

# Investor test account
E2E_INVESTOR_EMAIL=test-investor@farmero.test
E2E_INVESTOR_PASSWORD=test-password-123

# Backend readiness flag
E2E_BACKEND_READY=false
```

**Notă:** Conturile de test trebuie create manual în backend-ul de staging. Nu se includ parole reale în acest document.

### Environment Variables

Pentru testare E2E, creează un fișier `.env.e2e`:

```env
E2E_BASE_URL=http://localhost:3000
E2E_BACKEND_READY=false
E2E_CLIENT_EMAIL=test-client@farmero.test
E2E_CLIENT_PASSWORD=test-password-123
E2E_PRODUCER_EMAIL=test-producer@farmero.test
E2E_PRODUCER_PASSWORD=test-password-123
E2E_INVESTOR_EMAIL=test-investor@farmero.test
E2E_INVESTOR_PASSWORD=test-password-123
```

## Verificări înainte de Deploy

### Checklist Pre-Deploy

- [ ] Toate testele E2E trec (dacă backend-ul e disponibil)
- [ ] Nu există erori de lint (`npm run lint`)
- [ ] Build-ul trece fără erori (`npm run build`)
- [ ] Toate paginile critice se încarcă corect
- [ ] Login funcționează pentru toate rolurile
- [ ] Redirect-urile după login sunt corecte
- [ ] Cart și checkout funcționează (dacă backend-ul e activ)
- [ ] Producer portal funcționează (dacă backend-ul e activ)
- [ ] Investor dashboard se încarcă (sau afișează mesaj "Coming soon" dacă feature-ul e dezactivat)

### Verificări Manuale Rapide

1. **Homepage:** Se încarcă, toate secțiunile sunt vizibile
2. **Login:** Formularul funcționează, redirect-urile sunt corecte
3. **Navigation:** Toate link-urile din navbar/menu funcționează
4. **Responsive:** UI-ul funcționează pe mobile și desktop
5. **Theme:** Toggle-ul de theme funcționează (light/dark)

## Integrare în Pipeline

### Manual (Acum)

Testele E2E se rulează manual înainte de release major:

```bash
# 1. Pornește aplicația local
npm run dev

# 2. În alt terminal, rulează testele
npm run test:e2e
```

### CI/CD (Viitor)

**TODO:** Integrare în CI/CD pipeline (GitHub Actions, GitLab CI, etc.)

Când backend-ul este stabil și staging-ul este disponibil, testele E2E pot fi integrate în pipeline:

```yaml
# Exemplu GitHub Actions (viitor)
- name: Run E2E tests
  run: npm run test:e2e
  env:
    E2E_BASE_URL: ${{ secrets.E2E_BASE_URL }}
    E2E_CLIENT_EMAIL: ${{ secrets.E2E_CLIENT_EMAIL }}
    E2E_CLIENT_PASSWORD: ${{ secrets.E2E_CLIENT_PASSWORD }}
    # ... etc
```

## Probleme Cunoscute & Limitări

### Backend Dependencies

- Testele E2E necesită backend-ul să fie disponibil
- Dacă `E2E_BACKEND_READY !== 'true'`, unele teste vor fi skipped
- Conturile de test trebuie create manual în backend

### Feature Flags

- Dacă `BackendSyncStatus.*` este `false`, unele funcționalități vor afișa "Coming soon"
- Testele trebuie să verifice și acest caz

### Rate Limiting

- Backend-ul poate avea rate limiting în development
- Erorile `429 (Too Many Requests)` sunt normale în dev, nu blochează funcționalitatea

## Documentație Suplimentară

- `docs/CORE_COMMERCE_QA_CHECKLIST.md` - Checklist detaliat pentru commerce
- `docs/FARMERO_NAVIGATION_AND_ROLES_MAP.md` - Harta navigării și rolurilor
- `docs/BACKEND_API_CONTRACT_*.md` - Contractele API pentru backend

## Contact & Support

Pentru probleme sau întrebări despre testare:
- Verifică documentația de mai sus
- Verifică log-urile de test (Playwright generează screenshots și videos pentru testele failed)
- Contactează echipa de dezvoltare

