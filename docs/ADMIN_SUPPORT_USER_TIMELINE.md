# Admin Support & User Timeline - Documentație

## Prezentare generală

Modulul Support oferă o vedere 360° asupra utilizatorilor, cu timeline, comenzi, abonamente, articole journal și note interne.

## Structură modul

### 1. Utilizatori & Timeline (`/support/users`)

**Descriere:** Hub de căutare pentru utilizatori.

**Funcționalități:**
- **Search bar:** Căutare după email, nume sau ID
- **Tabel rezultate:**
  - ID (truncat)
  - Email
  - Nume
  - Rol
  - Status (active/suspended)
  - Data creare
- **Click pe rând:** Navighează la `/support/users/[id]`

**Backend Endpoints:**
- `GET /admin/users?search=...` - Căutare utilizatori (reuse endpoint existent)

**Permisiuni:**
- `view_users` sau `view_orders` - Vizualizare

---

### 2. User 360° View (`/support/users/[id]`)

**Descriere:** Vedere completă a unui utilizator cu toate informațiile relevante.

**Tabs:**

#### Overview
- **Profil:** Email, nume, rol, producător (dacă există)
- **Ultimele acțiuni:** Ultimele 5 evenimente din timeline (audit log)

#### Comenzi
- Listă comenzi ale utilizatorului
- ID, dată, status, total
- Fallback: Mesaj dacă endpoint lipsește

#### Abonamente
- Listă abonamente (clienți/producători)
- Tip, status, frecvență
- Fallback: Mesaj dacă endpoint lipsește

#### Journal
- Articole journal (dacă utilizatorul este producător)
- Titlu, status, dată publicare
- Fallback: Mesaj dacă utilizatorul nu este producător sau nu are articole

#### Notes
- **Adaugă notă:** Formular pentru note interne
- **Listă note:** Note existente cu autor și dată
- Fallback: Note in-memory în dev (nu persistate dacă backend lipsește)

**Backend Endpoints:**
- `GET /admin/users/:id` - Detalii utilizator
- `GET /admin/users/:id/orders` - Comenzi utilizator
- `GET /admin/users/:id/subscriptions` - Abonamente utilizator
- `GET /admin/users/:id/journal-articles` - Articole journal
- `GET /admin/users/:id/timeline` - Timeline evenimente
- `GET /admin/users/:id/notes` - Note utilizator
- `POST /admin/users/:id/notes` - Creează notă

**Permisiuni:**
- `view_users` sau `view_orders` - Vizualizare
- Note: Nu necesită permisiuni speciale (doar view_users)

**Audit Logging:**
- `SUPPORT_NOTE_ADDED` - La adăugare notă

---

## RBAC & Permisiuni

### Roluri cu acces

- **superadmin:** ✅ Acces complet
- **admin:** ✅ Acces complet
- **support:** ✅ Acces complet (dacă are `view_users`)
- **finance:** ❌ Fără acces (doar dacă are `view_users`)
- **content:** ❌ Fără acces

### Permisiuni

- `view_users` - Vizualizare utilizatori și detalii
- `view_orders` - Alternativă pentru vizualizare (dacă nu are `view_users`)

---

## Safety & UX

### Reguli de siguranță

1. **NICIODATĂ nu afișa:**
   - Parole
   - Token-uri
   - Cookie-uri
   - Date sensibile de autentificare

2. **NICIODATĂ nu implementa:**
   - "Login as user" (impersonare) fără prompt separat
   - Acțiuni periculoase fără confirmare

3. **Pagina este strict:**
   - Read-only (cu excepția notelor)
   - Fără acțiuni de modificare directă
   - Doar vizualizare și note interne

---

## Endpoint-uri backend necesare

### User Details

- `GET /admin/users/:id` - Detalii utilizator
  - **Status:** ⚠️ Poate exista deja (reuse din `/users`)
  - **Response:** User object cu toate detaliile

### User Data

- `GET /admin/users/:id/orders` - Comenzi utilizator
  - **Status:** ❌ Neimplementat
  - **Response:** Array de Order objects

- `GET /admin/users/:id/subscriptions` - Abonamente utilizator
  - **Status:** ❌ Neimplementat
  - **Response:** Array de Subscription objects

- `GET /admin/users/:id/journal-articles` - Articole journal
  - **Status:** ❌ Neimplementat
  - **Response:** Array de Journal Article objects

- `GET /admin/users/:id/timeline` - Timeline evenimente
  - **Status:** ❌ Neimplementat
  - **Response:** Array de TimelineEvent objects

### User Notes

- `GET /admin/users/:id/notes` - Note utilizator
  - **Status:** ❌ Neimplementat
  - **Response:** Array de UserNote objects

- `POST /admin/users/:id/notes` - Creează notă
  - **Status:** ❌ Neimplementat
  - **Request Body:** `{ text: string }`
  - **Response:** UserNote object

**Status:** Toate endpoint-urile sunt documentate în `ADMIN_BACKEND_GAPS.md` cu structuri de request/response sugerate.

---

## Fallback Behavior

### Când endpoint-urile lipsesc

1. **User Details:**
   - Dacă `GET /admin/users/:id` lipsește → Afișează eroare

2. **Orders/Subscriptions/Journal:**
   - Dacă endpoint-urile lipsesc → Afișează mesaj: "Datele nu sunt încă disponibile în admin"

3. **Timeline:**
   - Dacă endpoint lipsește → Nu afișează secțiunea

4. **Notes:**
   - Dacă endpoint-urile lipsesc:
     - **Development:** Note in-memory (nu persistate)
     - **Production:** Afișează mesaj că funcția nu este disponibilă
   - Mesaj clar: "Funcție demo – notele nu sunt persistate, backend lipsește"

---

## Rezumat

### Pagini noi

- ✅ `/support/users` - Hub de căutare utilizatori
- ✅ `/support/users/[id]` - Vedere 360° utilizator

### Tab-uri funcționale

**Cu backend:**
- Overview (dacă `GET /admin/users/:id` există)
- Comenzi (dacă `GET /admin/users/:id/orders` există)
- Abonamente (dacă `GET /admin/users/:id/subscriptions` există)
- Journal (dacă `GET /admin/users/:id/journal-articles` există)
- Timeline (dacă `GET /admin/users/:id/timeline` există)
- Notes (dacă `GET/POST /admin/users/:id/notes` există)

**Cu fallback:**
- ✅ Overview - Funcțional cu fallback
- ✅ Comenzi - Fallback mesaj
- ✅ Abonamente - Fallback mesaj
- ✅ Journal - Fallback mesaj
- ✅ Timeline - Fallback (nu afișează dacă lipsește)
- ✅ Notes - Fallback in-memory în dev

### Protecție RBAC

- ✅ Secțiunea Support este protejată cu `view_users` sau `view_orders`
- ✅ Doar rolurile `support`, `admin`, `superadmin` au acces (dacă au permisiunile necesare)

### Status implementare

- ✅ UI complet implementat
- ✅ Fallback-uri graceful pentru endpoint-uri lipsă
- ✅ Audit logging pentru note
- ⏳ Așteaptă implementarea endpoint-urilor backend

