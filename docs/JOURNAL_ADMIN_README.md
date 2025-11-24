# Journal Admin - README

**Data:** 2025-01-27  
**Scop:** Documentație pentru modulul Jurnal Admin în admin.farme.ro

---

## 🚀 Pornire

### Setup

1. **Instalează dependențele:**
   ```bash
   cd admin
   npm install
   ```

2. **Configurează variabilele de mediu:**
   Creează `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=https://api.farme.ro
   # Pentru development local:
   # NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

3. **Rulează aplicația:**
   ```bash
   npm run dev
   ```

Aplicația va fi disponibilă la `http://localhost:3000`

---

## 🔐 Autentificare

### Login

1. Accesează `/login`
2. Introdu email și parolă pentru un utilizator cu rol `ADMIN`
3. După login, vei fi redirecționat către `/dashboard`

### Endpoint-uri folosite

- **POST /auth/login** - Autentificare
  - Body: `{ email: string, password: string }`
  - Response: `{ token: string, user: { id, email, fullName, role } }`
  - Setează cookie `session` pentru autentificare

- **GET /auth/me** - Obține utilizator curent
  - Necesită cookie `session`
  - Response: `{ id, email, fullName, role }`

- **POST /auth/logout** - Deconectare
  - Șterge cookie `session`

### User Demo

Pentru testare, creează un utilizator în backend cu:
- Email: `admin@farme.ro`
- Parolă: (setată în backend)
- Rol: `ADMIN`

---

## 📄 Rute Admin Jurnal

### 1. `/jurnal` - Listă Articole

**Descriere:** Pagină cu listă tuturor articolelor din Jurnal de farme.ro

**Funcționalități:**
- Tabel cu articole (titlu, producător, status, date)
- Filtru după status (draft, review, approved, published, archived, all)
- Căutare după producător
- Paginare (20 articole per pagină)
- Click pe rând → navigare către `/jurnal/[id]`

**Endpoint folosit:**
- `GET /admin/journal/articles`
  - Query params: `status`, `search`, `page`, `limit`
  - Response: `{ data: JournalArticle[], meta: { page, limit, total, totalPages } }`

**Coloane tabel:**
- Titlu (cu slug)
- Producător (cu link către farme.ro)
- Status (badge colorat)
- Data creării
- Ultima actualizare

---

### 2. `/jurnal/[id]` - Detalii & Workflow

**Descriere:** Pagină pentru vizualizare articol, workflow editorial și revizii

**Funcționalități:**

#### Informații Articol
- Titlu, slug, rezumat
- Producător (cu link către farme.ro)
- Status curent
- Imagine copertă (dacă există)
- Conținut complet (HTML)

#### Workflow Actions
Butoane pentru schimbare status:
- **"Trimite în review"** (draft → review)
- **"Aprobă articol"** (review → approved)
- **"Publică articol"** (approved → published)
- **"Respinge articol"** (review → archived)
- **"Arhivează"** (orice status → archived)

Toate acțiunile necesită confirmare prin dialog.

#### Revizii
- Listă revizii existente (versiune, editor, status, note, data)
- Formular pentru creare revizie nouă:
  - Titlu, rezumat, conținut
  - Status (draft, sent_to_review, approved, rejected)
  - Note (comentarii, modificări sugerate)

#### Timeline
- Istoric statusuri și date
- Vizualizare progres workflow

#### Date & Metrici
- Data creării, actualizării, publicării
- Metrici (vizualizări, click-uri)

**Endpoint-uri folosite:**
- `GET /admin/journal/articles/:id` - Detalii articol
- `PATCH /admin/journal/articles/:id` - Update status/conținut
- `GET /admin/journal/articles/:id/revisions` - Listă revizii
- `POST /admin/journal/articles/:id/revisions` - Creare revizie

---

## 🔄 Workflow Editorial

### Statusuri

1. **draft** - Articol în lucru
2. **review** - Trimis pentru review
3. **approved** - Aprobat, gata pentru publicare
4. **published** - Publicat și vizibil pe site
5. **archived** - Arhivat (respins sau retras)

### Tranziții Permise

- `draft` → `review` (Trimite în review)
- `review` → `approved` (Aprobă)
- `review` → `archived` (Respinge)
- `approved` → `published` (Publică)
- Orice status → `archived` (Arhivează)

### Acțiuni Automate

Când status devine `published`:
- `publishedAt` este setat automat
- O notificare `JournalNotification` este creată pentru producător

---

## 🎨 UX & Error Handling

### Loading States
- Skeleton loading pentru listă
- Spinner pentru acțiuni
- Disabled states pentru butoane în timpul salvare

### Error States
- **401 Unauthorized** → Redirect automat la `/login`
- **403 Forbidden** → Mesaj "Nu ai acces"
- **404 Not Found** → Mesaj "Articolul nu a fost găsit"
- **Generic errors** → Mesaj prietenos + posibilitate retry

### Confirmări
- Dialog de confirmare pentru toate acțiunile de workflow
- Mesaje clare și specifice pentru fiecare acțiune

### Accesibilitate
- Butoane cu label-uri clare
- Icon-uri cu `aria-label` când e necesar
- Keyboard navigation support

---

## 📊 Endpoint-uri Backend Consumate

### Listă Articole
- **GET /admin/journal/articles**
  - Query: `status`, `producerId`, `search`, `page`, `limit`
  - Response: `{ data: JournalArticle[], meta: {...} }`

### Detalii Articol
- **GET /admin/journal/articles/:id**
  - Response: `JournalArticle` (cu toate câmpurile)

### Update Articol
- **PATCH /admin/journal/articles/:id**
  - Body: `{ title?, excerpt?, content?, coverImageUrl?, status? }`
  - Response: `JournalArticle` (actualizat)

### Revizii
- **GET /admin/journal/articles/:id/revisions**
  - Response: `{ data: JournalRevision[] }`

- **POST /admin/journal/articles/:id/revisions**
  - Body: `{ title, excerpt, content, status, notes? }`
  - Response: `JournalRevision` (creat)

---

## 🐛 Troubleshooting

### Problema: "Neautorizat" la accesare pagini

**Cauză:** Nu ești autentificat sau cookie-ul a expirat.

**Soluție:**
1. Verifică că ești logat (`/login`)
2. Verifică că backend-ul rulează
3. Verifică că cookie-ul `session` este setat

### Problema: "Acces interzis"

**Cauză:** Utilizatorul nu are rol `ADMIN`.

**Soluție:**
1. Verifică rolul utilizatorului în backend
2. Asigură-te că utilizatorul are rol `ADMIN`

### Problema: "Articolul nu a fost găsit"

**Cauză:** ID-ul articolului nu există sau nu ai acces.

**Soluție:**
1. Verifică că ID-ul este corect
2. Verifică că articolul există în baza de date
3. Verifică că backend-ul răspunde corect

### Problema: Acțiunile de workflow nu funcționează

**Cauză:** Endpoint-ul backend nu răspunde sau returnează eroare.

**Soluție:**
1. Verifică logs-urile backend
2. Verifică că endpoint-ul `PATCH /admin/journal/articles/:id` este implementat
3. Verifică că request-ul trimite datele corecte

---

## 📝 Note

- Toate endpoint-urile necesită autentificare cu rol `ADMIN`
- Cookie-based auth (cookie `session`)
- Error handling robust cu mesaje clare
- Confirmări pentru acțiuni distructive
- Loading states pentru toate acțiunile

---

## 🎯 Ce Poți Face în Jurnal Admin

1. **Vizualizare articole:**
   - Vezi toate articolele (toate status-urile)
   - Filtrează după status sau producător
   - Caută după producător

2. **Workflow editorial:**
   - Trimite articole în review
   - Aprobă articole
   - Publică articole
   - Respinge/arhivează articole

3. **Revizii:**
   - Vezi istoricul reviziilor
   - Creează revizii noi cu modificări sugerate
   - Adaugă note și comentarii

4. **Monitorizare:**
   - Vezi metrici (vizualizări, click-uri)
   - Vezi timeline-ul workflow-ului
   - Vezi datele de creare/actualizare/publicare

---

## 🔗 Link-uri Utile

- **Backend API Spec:** `backend/docs/JOURNAL_API_SPEC.md`
- **Backend Testing:** `backend/docs/JOURNAL_MANUAL_TESTING_CHECKLIST.md`
- **Frontend Activation:** `frontend/docs/JOURNAL_ACTIVATION_GUIDE.md`

