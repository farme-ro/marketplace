# 🚀 Faza 1 - Frontend Activation Guide

**Data:** 2025-01-27  
**Scop:** Ghid complet pentru activarea task-urilor Frontend din Faza 1 (Deploy MVP)  
**Status:** 🟢 **Gata pentru activare**

---

## 📋 Task-uri Frontend Faza 1

### ✅ Task 1: Activează feature-urile în `BackendSyncStatus` după testare

**Status Actual:** ✅ **DEJA ACTIVATE** (verificare necesară dacă backend-ul este gata)

**Fișier:** `src/lib/backend-sync/status.ts`

**Feature-uri critice pentru MVP (DEJA ACTIVATE):**
- ✅ `cart: true` - Coș de cumpărături
- ✅ `checkout: true` - Checkout și creare comandă
- ✅ `clientOrders: true` - Comenzi client
- ✅ `producerProducts: true` - Produse producător
- ✅ `producerOrders: true` - Comenzi producător

**⚠️ IMPORTANT:** Feature-urile sunt deja setate pe `true`, dar trebuie verificate că backend-ul este gata și funcțional înainte de deploy!

**Pași de activare:**

1. **Verifică status-ul actual:**
   ```bash
   # Deschide fișierul
   src/lib/backend-sync/status.ts
   ```

2. **Verifică că backend-ul este live:**
   - Testează endpoint-urile manual sau cu Postman
   - Verifică că CORS este configurat corect
   - Verifică că autentificarea funcționează

3. **Testează manual fiecare feature:**
   - Folosește checklist-ul din `docs/CORE_COMMERCE_QA_CHECKLIST.md`
   - Testează flow-ul complet pentru fiecare feature
   - Verifică error handling (401, 404, 422)

4. **Activează feature-urile:**
   ```typescript
   // src/lib/backend-sync/status.ts
   export const BackendSyncStatus = {
     // Core Commerce (MVP)
     cart: true,                 // ✅ Testat și funcțional
     checkout: true,             // ✅ Testat și funcțional
     clientOrders: true,         // ✅ Testat și funcțional
     producerProducts: true,     // ✅ Testat și funcțional
     producerOrders: true,       // ✅ Testat și funcțional
     // ... rest
   }
   ```

5. **Commit și deploy:**
   ```bash
   git add src/lib/backend-sync/status.ts
   git commit -m "feat: activate MVP backend features (cart, checkout, orders)"
   git push
   ```

**Documentație:** `docs/FARMERO_BACKENDSYNC_ACTIVATION_PLAN.md`

---

### ✅ Task 2: Setează variabilele de mediu în Vercel

**Status:** 🟡 **Necesită acces Vercel**

**Variabile necesare:**

1. **`NEXT_PUBLIC_API_URL`**
   - **Valoare:** `https://api.farme.ro`
   - **Mediu:** Production, Preview, Development
   - **Descriere:** URL-ul backend-ului API

**Pași de setare:**

1. **Accesează Vercel Dashboard:**
   - Mergi la: https://vercel.com/dashboard
   - Selectează proiectul `farmero-frontend`

2. **Setează variabilele:**
   - Mergi la: **Settings** → **Environment Variables**
   - Click pe **Add New**
   - Adaugă:
     - **Name:** `NEXT_PUBLIC_API_URL`
     - **Value:** `https://api.farme.ro`
     - **Environment:** Selectează toate (Production, Preview, Development)
   - Click **Save**

3. **Redeploy aplicația:**
   - Mergi la **Deployments**
   - Click pe **Redeploy** pentru ultimul deployment
   - Sau face un nou commit pentru trigger automat

**Verificare:**
- După deploy, verifică în browser console că `process.env.NEXT_PUBLIC_API_URL` este setat corect
- Testează că API calls merg către backend-ul corect

**Documentație:** `ENV_VARIABLES.md`, `VERCEL_FRONTEND_SETUP.md`

---

### ✅ Task 3: Testare manuală completă

**Status:** 🟡 **Necesită backend live**

**Checklist disponibil:** `docs/CORE_COMMERCE_QA_CHECKLIST.md`

**Testare recomandată:**

1. **Cart & Checkout:**
   - [ ] Adaugă produse în coș
   - [ ] Modifică cantități
   - [ ] Șterge produse din coș
   - [ ] Completează checkout
   - [ ] Plasează comandă

2. **Client Orders:**
   - [ ] Vezi lista de comenzi
   - [ ] Vezi detalii comandă
   - [ ] Reorder funcționează

3. **Producer Products:**
   - [ ] Vezi lista de produse
   - [ ] Creează produs nou
   - [ ] Editează produs
   - [ ] Șterge produs
   - [ ] Toggle active/inactive

4. **Producer Orders:**
   - [ ] Vezi lista de comenzi
   - [ ] Vezi detalii comandă
   - [ ] Schimbă status comandă

**Timp estimat:** 2-4 ore pentru testare completă

**Documentație:** `docs/CORE_COMMERCE_QA_CHECKLIST.md`

---

### ✅ Task 4: Deploy pe Vercel

**Status:** 🟡 **Necesită acces Vercel**

**Pași de deploy:**

1. **Verifică că totul este gata:**
   - [ ] Feature-urile sunt activate în `BackendSyncStatus`
   - [ ] Variabilele de mediu sunt setate
   - [ ] Testarea manuală este completă
   - [ ] Nu există erori în build

2. **Build local (opțional):**
   ```bash
   npm run build
   # Verifică că build-ul reușește fără erori
   ```

3. **Deploy:**
   - **Opțiunea 1: Deploy automat (recomandat)**
     - Face un commit și push
     - Vercel va face deploy automat
   
   - **Opțiunea 2: Deploy manual**
     - Mergi la Vercel Dashboard
     - Click pe **Deployments** → **Create Deployment**
     - Selectează branch-ul (de obicei `main` sau `master`)
     - Click **Deploy**

4. **Verificare post-deploy:**
   - [ ] Site-ul se încarcă corect
   - [ ] API calls merg către backend-ul corect
   - [ ] Autentificarea funcționează
   - [ ] Cart & Checkout funcționează
   - [ ] Orders se încarcă corect

**Documentație:** `VERCEL_FRONTEND_SETUP.md`

---

## 📊 Checklist Final Faza 1

### Pre-Deploy
- [ ] Backend endpoint-uri implementate și testate
- [ ] Feature-urile activate în `BackendSyncStatus`
- [ ] Variabilele de mediu setate în Vercel
- [ ] Testare manuală completă (QA Checklist)
- [ ] Build local reușește fără erori

### Deploy
- [ ] Deploy pe Vercel reușit
- [ ] Site-ul este accesibil
- [ ] Variabilele de mediu sunt active

### Post-Deploy
- [ ] Verificare funcționalități critice
- [ ] Verificare error handling
- [ ] Verificare performance
- [ ] Documentare status final

---

## 🎯 Ordinea Recomandată

1. **Backend implementează endpoint-urile** (2-3 săptămâni)
2. **Frontend activează feature-urile** (1 zi)
3. **Frontend setează variabilele de mediu** (30 min)
4. **Frontend testează manual** (2-4 ore)
5. **Frontend face deploy** (30 min)

**Total timp Frontend:** **1 zi** (după ce backend-ul este gata)

---

## 📝 Note Importante

- **Nu activa feature-urile** până când backend-ul nu este complet funcțional și testat
- **Testează întotdeauna manual** înainte de activare
- **Verifică error handling** pentru toate scenariile (401, 404, 422, network errors)
- **Documentează** orice probleme găsite în timpul testării

---

## 🔗 Documentație Utilă

- `docs/FARMERO_BACKENDSYNC_ACTIVATION_PLAN.md` - Plan complet de activare
- `docs/CORE_COMMERCE_QA_CHECKLIST.md` - Checklist pentru testare
- `docs/BACKEND_API_CONTRACT_CORE_COMMERCE.md` - Contract API pentru backend
- `VERCEL_FRONTEND_SETUP.md` - Ghid setup Vercel
- `ENV_VARIABLES.md` - Variabile de mediu necesare

---

**Ultima actualizare:** 2025-01-27  
**Status:** 🟢 **Gata pentru activare** - Așteaptă backend endpoints

