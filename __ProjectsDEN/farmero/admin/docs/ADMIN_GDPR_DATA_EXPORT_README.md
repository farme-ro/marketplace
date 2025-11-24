# Admin GDPR & Data Export - Documentație

## Prezentare generală

Modulul GDPR oferă gestionarea cererilor GDPR (DSAR - Data Subject Access Requests), inclusiv export, ștergere, anonimizare și rectificare date.

## Structură modul

### 1. GDPR & Date (`/system/gdpr`)

**Descriere:** Gestionare cereri GDPR cu filtre și acțiuni.

**Funcționalități:**
- **Tabel cereri:**
  - ID cerere
  - Email utilizator
  - Tip: `EXPORT`, `DELETE`, `ANONYMIZE`, `RECTIFY`
  - Status: `OPEN`, `IN_PROGRESS`, `COMPLETED`, `REJECTED`
  - Data creare
  - Gestionat de (admin)

- **Filtre:**
  - Tip cerere
  - Status
  - Search (după email sau ID)
  - Interval date (dateFrom, dateTo)

- **Drawer detalii:**
  - Informații cerere (ID, email, tip, status, date)
  - Link de download (pentru EXPORT completat)
  - Acțiuni:
    - OPEN → IN_PROGRESS
    - IN_PROGRESS → COMPLETED
    - IN_PROGRESS → REJECTED (cu reason obligatoriu)
  - Link "Vezi utilizator" → `/support/users/[id]`

**Backend Endpoints:**
- `GET /admin/gdpr/requests` - Listă cereri cu filtre
- `GET /admin/gdpr/requests/:id` - Detalii cerere
- `POST /admin/gdpr/requests` - Creează cerere (inițiată de admin)
- `PATCH /admin/gdpr/requests/:id` - Actualizează status cerere

**Permisiuni:**
- `view_users` sau `view_audit_log` - Vizualizare
- `manage_users` sau `manage_system` - Acțiuni (schimbare status)

**Audit Logging:**
- `GDPR_REQUEST_CREATED` - La creare cerere
- `GDPR_REQUEST_STATUS_CHANGED` - La schimbare status

---

### 2. Integrare cu User 360 View

**Locație:** `/support/users/[id]` - Tab "Overview"

**Funcționalități:**
- **Secțiune "GDPR & Date":**
  - Buton "Creează cerere export" (type: EXPORT)
  - Buton "Creează cerere ștergere" (type: DELETE)
  - Buton "Creează cerere anonimizare" (type: ANONYMIZE)
  - Confirm dialog pentru acțiuni periculoase
  - Navigare automată la `/system/gdpr` după creare

**Permisiuni:**
- `manage_users` sau `manage_system` - Creare cereri

---

## Tipuri de cereri GDPR

### EXPORT
- **Descriere:** Export date utilizator (DSAR)
- **Proces:**
  1. Admin creează cerere
  2. Backend procesează și generează export
  3. Admin marchează ca COMPLETED
  4. Link de download disponibil

### DELETE
- **Descriere:** Ștergere completă date utilizator
- **Proces:**
  1. Admin creează cerere
  2. Backend procesează ștergerea
  3. Admin marchează ca COMPLETED
- **⚠️ Acțiune permanentă!**

### ANONYMIZE
- **Descriere:** Anonimizare date utilizator (păstrează datele dar fără identificare)
- **Proces:**
  1. Admin creează cerere
  2. Backend procesează anonimizarea
  3. Admin marchează ca COMPLETED
- **⚠️ Acțiune permanentă!**

### RECTIFY
- **Descriere:** Rectificare date utilizator
- **Proces:**
  1. Utilizator sau admin creează cerere
  2. Admin procesează rectificarea
  3. Admin marchează ca COMPLETED

---

## Safety & UX

### Reguli de siguranță

1. **Frontend NU șterge/anonimizează direct:**
   - Totul este orchestrat prin cereri către backend
   - Backend-ul are logica reală de ștergere/anonimizare

2. **ConfirmDialog pentru acțiuni critice:**
   - COMPLETED → Confirmare obligatorie
   - REJECTED → Reason obligatoriu
   - DELETE/ANONYMIZE → Confirmare cu warning

3. **Audit logging:**
   - Toate acțiunile sunt loggate
   - Include type, oldStatus/newStatus, userId, reason

---

## Flux tipic

### Cerere de export (DSAR)

1. **Utilizator solicită** (sau admin inițiază manual)
2. **Admin creează cerere** în `/system/gdpr` sau `/support/users/[id]`
3. **Backend procesează:**
   - Colectează toate datele utilizatorului
   - Generează export (JSON, CSV, etc.)
   - Stochează temporar (pre-signed URL)
4. **Admin marchează ca COMPLETED:**
   - Link de download devine disponibil
   - Utilizatorul primește notificare (dacă backend suportă)
5. **Utilizator descarcă** datele

### Cerere de ștergere/anonimizare

1. **Utilizator solicită** (sau admin inițiază manual)
2. **Admin creează cerere** cu confirmare
3. **Backend procesează:**
   - Șterge/anonimizează datele
   - Păstrează audit trail
4. **Admin marchează ca COMPLETED:**
   - Cererea este finalizată
   - Utilizatorul este notificat (dacă backend suportă)

---

## RBAC & Permisiuni

### Roluri cu acces

- **superadmin:** ✅ Acces complet (view + manage)
- **admin:** ✅ Acces complet (view + manage)
- **support:** ✅ Vizualizare (dacă are `view_users`)
- **finance:** ❌ Fără acces
- **content:** ❌ Fără acces

### Permisiuni

- `view_users` sau `view_audit_log` - Vizualizare cereri
- `manage_users` sau `manage_system` - Creare și gestionare cereri

---

## Endpoint-uri backend necesare

### GDPR Requests

- `GET /admin/gdpr/requests` - Listă cereri
  - **Status:** ❌ Neimplementat
  - **Query Params:** type, status, search, dateFrom, dateTo, page, limit
  - **Response:** PaginatedResponse<GdprRequest>

- `GET /admin/gdpr/requests/:id` - Detalii cerere
  - **Status:** ❌ Neimplementat
  - **Response:** GdprRequest

- `POST /admin/gdpr/requests` - Creează cerere
  - **Status:** ❌ Neimplementat
  - **Request Body:** `{ userId, type, reason? }`
  - **Response:** GdprRequest

- `PATCH /admin/gdpr/requests/:id` - Actualizează status
  - **Status:** ❌ Neimplementat
  - **Request Body:** `{ status, reason? }`
  - **Response:** GdprRequest

**Status:** Toate endpoint-urile sunt documentate în `ADMIN_BACKEND_GAPS.md` cu structuri de request/response sugerate.

---

## Rezumat

### Pagină nouă

- ✅ `/system/gdpr` - Gestionare cereri GDPR

### Integrare

- ✅ `/support/users/[id]` - Secțiune "GDPR & Date" cu butoane pentru creare cereri

### Endpoint-uri backend

**Consumate:**
- ❌ Niciun endpoint nu este implementat încă

**TODO (documentate în ADMIN_BACKEND_GAPS.md):**
- `GET /admin/gdpr/requests`
- `GET /admin/gdpr/requests/:id`
- `POST /admin/gdpr/requests`
- `PATCH /admin/gdpr/requests/:id`

### Protecție RBAC

- ✅ Secțiunea GDPR este protejată cu `view_users` / `view_audit_log`
- ✅ Acțiunile necesită `manage_users` sau `manage_system`
- ✅ Doar rolurile `superadmin`, `admin`, `support` (cu permisiuni) au acces

### Status implementare

- ✅ UI complet implementat
- ✅ Fallback-uri graceful pentru endpoint-uri lipsă
- ✅ Audit logging pentru toate acțiunile
- ✅ Integrare cu User 360 View
- ⏳ Așteaptă implementarea endpoint-urilor backend

