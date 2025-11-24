# Journal de farme.ro - Activation Guide

**Data:** 2025-01-27  
**Scop:** Ghid pentru activarea completă a feature-ului Journal de farme.ro

---

## 📋 Precondiții pentru Activare

Înainte de a seta `journal: true` în `src/lib/backend-sync/status.ts`, asigură-te că:

### Backend

- [ ] **Migrația Prisma este aplicată:**
  ```bash
  cd backend
  npx prisma migrate dev --name add_journal_models
  npx prisma generate
  ```

- [ ] **Toate endpoint-urile răspund corect:**
  - `GET /journal` - returnează listă (chiar dacă goală)
  - `GET /journal/:slug` - returnează 404 pentru slug inexistent
  - `POST /journal/:id/metrics/event` - acceptă payload și nu crapă
  - `GET /producers/me/journal` - necesită auth PRODUCER
  - `POST /producers/me/journal/request-article` - creează cerere
  - `GET /admin/journal/articles` - necesită auth ADMIN
  - `POST /admin/journal/articles` - creează articol

- [ ] **Rutele sunt montate corect în `backend/src/index.ts`:**
  ```typescript
  app.use('/journal', journalRoutes);
  app.use('/producers/me/journal', journalProducerRoutes);
  app.use('/admin/journal', journalAdminRoutes);
  ```

- [ ] **Error handling este robust:**
  - Nu crapă când ID-uri sunt inexistente
  - Returnează erori clare (404, 401, 403, 400)

### Frontend

- [ ] **Paginile sunt implementate:**
  - `/jurnal-de-farmero` - listă articole
  - `/jurnal-de-farmero/[slug]` - articol individual
  - `/portal-producatori/jurnal` - portal producători

- [ ] **Link-urile sunt în navigație:**
  - Footer (secțiunea "Despre farmero")
  - Mega menu (secțiunea "Explorează") - opțional

- [ ] **API client-ul este implementat:**
  - `src/lib/api/journal.ts` - funcții pentru toate endpoint-urile
  - Fallback-uri pentru development mode

---

## 🚀 Pași de Activare

### 1. Verificare Backend

Rulează checklist-ul de testare manuală:

```bash
# Vezi backend/docs/JOURNAL_MANUAL_TESTING_CHECKLIST.md
```

Asigură-te că toate testele trec.

### 2. Verificare Migrație

```bash
cd backend
npx prisma migrate status
```

Dacă migrația pentru Journal nu este aplicată:

```bash
npx prisma migrate dev --name add_journal_models
npx prisma generate
```

### 3. Testare Frontend (cu `journal: false`)

Înainte de activare, testează frontend-ul cu feature flag-ul `false`:

- [ ] `/jurnal-de-farmero` afișează mesaj "Coming soon" sau empty state
- [ ] `/jurnal-de-farmero/[slug]` afișează 404 sau mesaj de eroare
- [ ] `/portal-producatori/jurnal` afișează mesaj pentru plan gratuit

### 4. Activare Feature Flag

După ce toate verificările trec, activează feature-ul:

**Fișier:** `frontend/src/lib/backend-sync/status.ts`

```typescript
export const BackendSyncStatus = {
  // ... alte feature-uri
  journal: true, // ✅ Activare Journal de farme.ro
} as const
```

### 5. Testare Post-Activare

După activare, testează:

#### Teste Publice

- [ ] **Listă articole:**
  - Accesează `/jurnal-de-farmero`
  - Verifică că se încarcă lista de articole (sau empty state dacă nu există)
  - Verifică că nu apare eroare în consolă

- [ ] **Articol individual:**
  - Accesează `/jurnal-de-farmero/<slug>` pentru un articol existent
  - Verifică că conținutul se afișează corect
  - Verifică că link-urile către producător funcționează
  - Verifică că metrics tracking se trimite (fără să blocheze UI)

- [ ] **Articol inexistent:**
  - Accesează `/jurnal-de-farmero/slug-inexistent`
  - Verifică că apare 404 sau mesaj de eroare clar

#### Teste Producer Portal

- [ ] **Producător cu plan plătit:**
  - Loghează-te ca producător cu plan plătit
  - Accesează `/portal-producatori/jurnal`
  - Verifică că apare lista de articole (sau mesaj "Vrei un articol nou?")
  - Verifică că butonul "Cere articol" funcționează

- [ ] **Producător cu plan gratuit:**
  - Loghează-te ca producător cu plan gratuit
  - Accesează `/portal-producatori/jurnal`
  - Verifică că apare mesajul corect: "Planul tău actual nu include Jurnal de farme.ro"
  - Verifică că există CTA către planuri de promovare

#### Teste Navigație

- [ ] **Footer:**
  - Scroll la footer
  - Verifică că link-ul "Jurnal de farme.ro" există în secțiunea "Despre farmero"
  - Click pe link → verifică că navighează către `/jurnal-de-farmero`

- [ ] **Mega menu (dacă implementat):**
  - Hover pe "Explorează" în navbar
  - Verifică că "Jurnal de farme.ro" apare în listă
  - Click pe link → verifică că navighează corect

---

## 🐛 Troubleshooting

### Problema: "Endpoint backend încă nu este disponibil"

**Cauză:** Feature flag-ul este `true` dar backend-ul nu răspunde.

**Soluție:**
1. Verifică că backend-ul rulează
2. Verifică că rutele sunt montate corect
3. Verifică logs-urile backend pentru erori
4. Testează endpoint-urile manual cu curl/Postman

### Problema: "Nu am găsit niciun articol"

**Cauză:** Nu există articole publicate în baza de date.

**Soluție:**
1. Creează un articol prin admin panel (`/admin/journal/articles`)
2. Setează status-ul la `published`
3. Verifică că `publishedAt` este setat

### Problema: "Planul tău actual nu include Jurnal de farme.ro"

**Cauză:** Producătorul nu are plan plătit sau funcția `checkProducerHasJournalAccess` returnează `false`.

**Soluție:**
1. Verifică că producătorul are status `APPROVED`
2. Verifică că producătorul are promovări active
3. Verifică logica din `backend/src/modules/journal/journal.service.ts` → `checkProducerHasJournalAccess`

### Problema: Metrics tracking nu funcționează

**Cauză:** Endpoint-ul `/journal/:id/metrics/event` nu răspunde sau returnează eroare.

**Soluție:**
1. Verifică logs-urile backend
2. Verifică că endpoint-ul este montat corect
3. Verifică că nu blochează UI (ar trebui să fie fire-and-forget)

---

## ✅ Checklist Final Activare

- [ ] Backend migrație aplicată
- [ ] Toate endpoint-urile testate manual
- [ ] Frontend testat cu `journal: false`
- [ ] Feature flag setat la `true`
- [ ] Frontend testat cu `journal: true`
- [ ] Navigație verificată (footer, mega menu)
- [ ] Producer portal verificat (plan plătit + gratuit)
- [ ] Metrics tracking verificat
- [ ] Error handling verificat
- [ ] Empty states verificat

---

## 📝 Note

- **Nu activa** feature flag-ul dacă backend-ul nu este complet funcțional
- **Testează** întotdeauna înainte de a activa în producție
- **Documentează** orice probleme găsite în timpul testării
- **Monitorizează** logs-urile după activare pentru erori

---

## 🔄 Rollback

Dacă apar probleme după activare, poți dezactiva rapid:

**Fișier:** `frontend/src/lib/backend-sync/status.ts`

```typescript
journal: false, // ⚠️ Dezactivare temporară
```

Frontend-ul va reveni la fallback mode (empty state sau "Coming soon").

