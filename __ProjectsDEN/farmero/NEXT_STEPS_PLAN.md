# 📋 Plan Următorii Pași - farme.ro

**Data:** 2025-01-27  
**Status Actual:** 🟡 **80% Gata**  
**Următorul Obiectiv:** 85% (Finalizare MVP)

---

## ✅ Ce Am Făcut (Faza 1 - Parțial Completată)

### Completat:
- ✅ **Pasul 1:** Adăugare câmpuri Prisma (imageUrl, category, unit, isBio) + migrație
- ✅ **Pasul 3:** Activare 13 features frontend (Cart, Checkout, Orders, Products, etc.)
- ✅ **Suport creat:** Scripturi de testare, documentație, checklist-uri

### Progres: **40% din Faza 1** (2 din 5 pași completați)

---

## 🎯 Ce Urmează - Prioritate

### 🔴 CRITIC - Pentru MVP (1-2 săptămâni)

#### 1. Aplicare Migrație Prisma (30 minute)
**Status:** ⏳ **Așteaptă acțiune**

**Ce trebuie făcut:**
```bash
cd backend
npx prisma migrate deploy  # pentru production
# sau
npx prisma migrate dev      # pentru development
npx prisma generate         # generează clientul Prisma
```

**Verificare:**
- [ ] Migrația aplicată cu succes
- [ ] Client Prisma regenerat
- [ ] Backend pornește fără erori

**Documentație:** `backend/MIGRATION_TEST_REPORT.md`

---

#### 2. Testare Endpoint-uri Backend (3-5 zile)
**Status:** ⏳ **Așteaptă testare**

**Opțiuni:**

**A. Testare Automată (Rapidă):**
```bash
cd backend
npm run test:endpoints
```
- Testează endpoint-urile principale automat
- Durată: ~5 minute
- Rezultat: Raport cu pass/fail

**B. Testare Manuală (Completă):**
- Folosește `backend/ENDPOINT_TESTING_CHECKLIST.md`
- Testează toate scenariile
- Durată: 2-3 zile
- Rezultat: Verificare completă + documentare probleme

**C. Testare Combinată (Recomandat):**
1. Rulează scriptul automat pentru verificare rapidă
2. Testează manual scenariile critice
3. Documentează probleme găsite

**Checklist:**
- [ ] Health check funcționează
- [ ] Public API funcționează
- [ ] Authentication funcționează
- [ ] Cart endpoints funcționează
- [ ] Orders endpoints funcționează
- [ ] Client features funcționează
- [ ] Producer features funcționează
- [ ] Error handling corect
- [ ] Autorizare corectă (utilizatorii nu pot accesa resurse care nu le aparțin)

**Documentație:**
- `backend/TESTING_GUIDE.md` - Ghidă completă
- `backend/ENDPOINT_TESTING_CHECKLIST.md` - Checklist detaliat
- `backend/API_ENDPOINTS_REFERENCE.md` - Referință rapidă

---

#### 3. Fix Bug-uri Găsite (1-3 zile)
**Status:** ⏳ **După testare**

**Proces:**
1. Documentează toate problemele găsite în testare
2. Prioritizează (Critical → High → Medium → Low)
3. Fix bug-uri critice și high priority
4. Retestare după fix-uri

**Template pentru bug tracking:**
```
## Bug #1: [Titlu]
- **Endpoint:** POST /cart/items
- **Severitate:** Critical/High/Medium/Low
- **Descriere:** [Ce se întâmplă]
- **Expected:** [Ce ar trebui să se întâmple]
- **Actual:** [Ce se întâmplă de fapt]
- **Steps to reproduce:** [Pași]
- **Fix:** [Soluție aplicată]
```

---

#### 4. Testare Integrare Frontend-Backend (2-3 zile)
**Status:** ⏳ **După fix-uri**

**Ce testează:**
- [ ] Login/Register funcționează
- [ ] Coș de cumpărături funcționează (adaugare, actualizare, ștergere)
- [ ] Checkout funcționează (creare comandă)
- [ ] Client vede comenzile
- [ ] Producător vede comenzile sale
- [ ] Producător poate actualiza status comandă
- [ ] Favorite funcționează
- [ ] Client profile & addresses funcționează
- [ ] Producer products CRUD funcționează

**Proces:**
1. Pornește backend (`npm run dev` în backend)
2. Pornește frontend (`npm run dev` în frontend)
3. Testează fiecare feature activată
4. Verifică că datele se sincronizează corect
5. Verifică error handling (ce se întâmplă la erori)

**Documentație:** `frontend/FEATURES_ACTIVATION_REPORT.md`

---

#### 5. Configurare Stripe (2-3 zile)
**Status:** ⏳ **Așteaptă chei Stripe**

**Ce trebuie făcut:**
1. Creează cont Stripe (dacă nu există)
2. Obține chei API (test și live)
3. Configurează webhook
4. Setează variabile de mediu
5. Testează cu carduri de test

**Ghidă completă:** `backend/STRIPE_SETUP_GUIDE.md`

**Checklist:**
- [ ] Cont Stripe creat
- [ ] Chei API obținute (test)
- [ ] Webhook configurat
- [ ] Variabile de mediu setate
- [ ] Testat în development
- [ ] Chei live obținute (pentru producție)
- [ ] Testat în production

---

### 🟡 MEDIU - După MVP (1-2 săptămâni)

#### 6. Activare Features Rămase
**Status:** ⏳ **După verificare endpoint-uri**

Features care rămân dezactivate (necesită verificare):
- Investor Metrics
- Producer Marketing
- Subscriptions Client (Public)
- Subscriptions Producer
- Farmero Points
- Parties & Contracts
- Fees & Statements
- Donations
- Shipments

**Proces:**
1. Verifică dacă endpoint-urile există în backend
2. Testează endpoint-urile
3. Activează features-urile în `BackendSyncStatus`
4. Testează integrarea

---

#### 7. Optimizări și Polish
**Status:** ⏳ **După MVP**

- Performance optimizations
- SEO improvements
- Accessibility improvements
- Error handling improvements
- User experience improvements

---

## 📊 Timeline Estimativ

### Săptămâna 1 (Zilele 1-3)
- [ ] Aplicare migrație Prisma
- [ ] Testare endpoint-uri (automată + manuală)
- [ ] Fix bug-uri critice

### Săptămâna 1 (Zilele 4-5)
- [ ] Testare integrare frontend-backend
- [ ] Fix bug-uri de integrare

### Săptămâna 2 (Zilele 1-3)
- [ ] Configurare Stripe
- [ ] Testare Stripe (development)
- [ ] Testare completă MVP

**Rezultat:** **85% gata - MVP funcțional**

---

## 🚀 Quick Start - Următorii Pași Imediati

### Opțiunea 1: Testare Rapidă (30 minute)
```bash
# 1. Aplică migrația
cd backend
npx prisma migrate deploy
npx prisma generate

# 2. Pornește backend
npm run dev

# 3. În alt terminal, testează endpoint-urile
npm run test:endpoints
```

### Opțiunea 2: Testare Completă (2-3 zile)
1. Aplică migrația (vezi mai sus)
2. Pornește backend
3. Folosește `ENDPOINT_TESTING_CHECKLIST.md` pentru testare manuală
4. Documentează probleme găsite
5. Fix bug-uri
6. Retestare

---

## 📝 Documente de Referință

### Pentru Testare:
- `backend/TESTING_GUIDE.md` - Ghidă completă
- `backend/ENDPOINT_TESTING_CHECKLIST.md` - Checklist detaliat
- `backend/API_ENDPOINTS_REFERENCE.md` - Referință rapidă
- `backend/scripts/test-endpoints.ts` - Script automat

### Pentru Configurare:
- `backend/STRIPE_SETUP_GUIDE.md` - Configurare Stripe
- `backend/scripts/check-config.ts` - Verificare configurare

### Pentru Integrare:
- `frontend/FEATURES_ACTIVATION_REPORT.md` - Features activate
- `frontend/src/lib/backend-sync/status.ts` - Status features

---

## ✅ Recomandare

**Următorul pas imediat:**
1. **Aplică migrația Prisma** (5 minute)
2. **Rulează scriptul de testare** (5 minute)
3. **Verifică rezultatele** și decide dacă e nevoie de testare manuală

**Apoi:**
- Dacă testele automată trec → continuă cu testare integrare
- Dacă testele automată eșuează → fix bug-uri și retestare

---

**Status:** 📋 **Plan clar pentru următorii pași**

**Progres Faza 1:** 40% → **Următorul obiectiv:** 85% (MVP funcțional)

