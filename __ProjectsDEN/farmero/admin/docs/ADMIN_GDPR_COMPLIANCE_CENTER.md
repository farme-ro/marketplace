# Admin GDPR Compliance Center - Documentație

## Prezentare generală

Modulul GDPR & Compliance Center oferă un dashboard complet pentru gestionarea cererilor GDPR, urmărirea istoricului și configurarea politicilor de retenție.

## Structură modul

### 1. Requests Tab (Default)

**Descriere:** Gestionare cereri GDPR cu coloane extinse și export avansat.

**Funcționalități:**

#### Coloane noi în tabel
- **Deadline legal:** Data deadline (30 zile de la creare) + badge SLA
- **Tip utilizator:** CLIENT / PRODUCER / ADMIN
- **Metodă solicitare:** EMAIL / DASHBOARD / MANUAL
- **SLA Badge:**
  - "On time" (verde) - deadline în viitor, >5 zile rămase
  - "At risk" (galben) - <5 zile rămase
  - "Overdue" (roșu) - deadline depășit

#### Export avansat
Pentru cererile EXPORT:
- Selector format: JSON, CSV, PDF
- Status "Export Generated" + buton download
- Generare on-demand dacă nu există export

#### Workflow status
- OPEN → IN_PROGRESS → COMPLETED / REJECTED
- Reason obligatoriu pentru REJECTED

**Backend Endpoints:**
- `GET /admin/gdpr/requests` - Listă cereri cu filtre
- `GET /admin/gdpr/requests/:id` - Detalii cerere
- `PATCH /admin/gdpr/requests/:id` - Actualizare status
- `POST /admin/gdpr/requests/:id/export` - Generare export

**Permisiuni:**
- `view_gdpr` - Vizualizare
- `manage_gdpr` - Gestionare (schimbare status, generare export)

---

### 2. History Tab

**Descriere:** Timeline cronologic pentru toate cererile GDPR.

**Funcționalități:**

#### Tabel istoric
- **Coloane:**
  - Data & ora
  - Acțiune (STATUS_CHANGED, EXPORT_GENERATED, REJECTED, etc.)
  - Efectuat de (admin email + nume)
  - ID Cerere
  - Detalii

#### Filtre
- Filtrare după ID cerere

**Backend Endpoints:**
- `GET /admin/gdpr/history` - Listă istoric cu filtre și paginare

**Permisiuni:**
- `view_gdpr` - Vizualizare

---

### 3. Policies & Retention Tab

**Descriere:** Tabel configurabil pentru politici de retenție.

**Funcționalități:**

#### Tabel politici
- **Coloane:**
  - Tip date (USERS, ORDERS, JOURNAL, MARKETING)
  - Retenție curentă (luni)
  - Ultim update
  - Status (COMPLIANT / NEEDS_REVIEW)
  - Note

#### Status badges
- **COMPLIANT** (verde) - Politică conformă
- **NEEDS_REVIEW** (galben) - Necesită revizuire

**Backend Endpoints:**
- `GET /admin/gdpr/retention-policies` - Listă politici

**Permisiuni:**
- `view_gdpr` - Vizualizare

**Fallback:**
- Date statice demo dacă endpoint lipsește

---

## Types & Structuri

### GdprRequest (Extended)
```typescript
interface GdprRequest {
  id: string
  userId: string
  userEmail: string
  type: 'EXPORT' | 'DELETE' | 'ANONYMIZE' | 'RECTIFY'
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED'
  createdAt: string
  updatedAt: string
  handledBy?: { id: string; email: string; fullName: string }
  downloadUrl?: string
  reason?: string
  // Advanced fields
  legalDeadline?: string // ISO date - 30 days from createdAt
  userType?: 'CLIENT' | 'PRODUCER' | 'ADMIN'
  requestMethod?: 'EMAIL' | 'DASHBOARD' | 'MANUAL'
  exportFormat?: 'JSON' | 'CSV' | 'PDF'
  exportGeneratedAt?: string
}
```

### GdprHistoryEntry
```typescript
interface GdprHistoryEntry {
  id: string
  requestId: string
  action: string // ex: "STATUS_CHANGED", "EXPORT_GENERATED"
  performedBy: { id: string; email: string; fullName: string }
  details?: string
  createdAt: string
}
```

### RetentionPolicy
```typescript
interface RetentionPolicy {
  id: string
  dataType: 'USERS' | 'ORDERS' | 'JOURNAL' | 'MARKETING'
  retentionMonths: number
  lastUpdated: string
  updatedBy?: { id: string; email: string }
  status: 'COMPLIANT' | 'NEEDS_REVIEW'
  notes?: string
}
```

---

## RBAC & Permisiuni

### Roluri cu acces

- **superadmin:** ✅ Acces complet
- **admin:** ✅ Acces complet
- **support:** ✅ Acces vizualizare (dacă are `view_gdpr`)
- **content:** ❌ Fără acces
- **marketing:** ❌ Fără acces
- **finance:** ❌ Fără acces

### Permisiuni

- `view_gdpr` - Vizualizare cereri, istoric, politici
- `manage_gdpr` - Gestionare cereri (schimbare status, generare export)

---

## Endpoint-uri backend necesare

### Requests

- `GET /admin/gdpr/requests`
  - **Status:** ❌ Neimplementat (documentat în ADMIN_BACKEND_GAPS.md)
  - **Query Params:** type, status, search, dateFrom, dateTo, page, limit
  - **Response:** `PaginatedResponse<GdprRequest>`

- `GET /admin/gdpr/requests/:id`
  - **Status:** ❌ Neimplementat
  - **Response:** `GdprRequest`

- `PATCH /admin/gdpr/requests/:id`
  - **Status:** ❌ Neimplementat
  - **Body:** `{ status, reason? }`
  - **Response:** `GdprRequest`

- `POST /admin/gdpr/requests/:id/export`
  - **Status:** ❌ Neimplementat
  - **Body:** `{ format: 'JSON' | 'CSV' | 'PDF' }`
  - **Response:** `{ downloadUrl: string, generatedAt: string }`

### History

- `GET /admin/gdpr/history`
  - **Status:** ❌ Neimplementat
  - **Query Params:** requestId, page, limit
  - **Response:** `PaginatedResponse<GdprHistoryEntry>`

### Retention Policies

- `GET /admin/gdpr/retention-policies`
  - **Status:** ❌ Neimplementat
  - **Response:** `RetentionPolicy[]`
  - **Fallback:** Date statice demo

---

## SLA & Deadline Logic

### Calcul deadline
- Deadline legal = createdAt + 30 zile (conform GDPR)
- Calculat automat în frontend dacă backend nu trimite

### SLA Status
- **On time:** Status COMPLETED/REJECTED sau deadline >5 zile rămase
- **At risk:** Deadline <5 zile rămase și status OPEN/IN_PROGRESS
- **Overdue:** Deadline depășit și status OPEN/IN_PROGRESS

---

## Export Formats

### JSON
- Export structurat JSON cu toate datele utilizatorului
- Util pentru procesare programatică

### CSV
- Export tabelar CSV
- Util pentru analiză în Excel/Sheets

### PDF
- Export PDF formatat
- Util pentru documentare și arhivare
- **Notă:** Poate fi placeholder dacă backend nu oferă PDF generation

---

## Fallback Behavior

### Requests
- Dacă endpoint lipsește → empty state cu mesaj informativ

### History
- Dacă endpoint lipsește → empty state cu mesaj informativ

### Policies
- Dacă endpoint lipsește → date statice demo (4 politici: USERS, ORDERS, JOURNAL, MARKETING)

---

## Safety & Compliance

### Reguli de siguranță

1. **Reason obligatoriu:**
   - Pentru REJECTED status, reason este obligatoriu
   - ConfirmDialog cu requireReason=true

2. **Audit logging:**
   - Toate schimbările de status sunt loggate
   - Action: `GDPR_REQUEST_STATUS_CHANGED`
   - Include metadata (newStatus, reason)

3. **Read-only pentru istoric:**
   - History tab este read-only
   - Nu permite modificare sau ștergere

4. **Politici read-only:**
   - Policies tab este read-only (configurare doar backend)
   - Frontend doar afișează

---

## Rezumat

### Pagini noi / Extinderi

- ✅ `/system/gdpr` - Extins cu tabs (Requests, History, Policies)
- ✅ Requests tab - Coloane noi (deadline, user type, method, SLA badge)
- ✅ Requests tab - Export avansat (JSON, CSV, PDF)
- ✅ History tab - Timeline cronologic
- ✅ Policies tab - Tabel politici de retenție

### Types noi

- `GdprRequest` - Extins cu câmpuri noi (legalDeadline, userType, requestMethod, exportFormat, exportGeneratedAt)
- `GdprHistoryEntry` - Entry pentru istoric
- `RetentionPolicy` - Politică de retenție

### API-uri noi

- `getGdprHistory(params?)` - Listă istoric
- `getRetentionPolicies()` - Listă politici
- `generateGdprExport(requestId, format)` - Generare export

### Endpoint-uri backend

**TODO (documentate în ADMIN_BACKEND_GAPS.md):**
- `GET /admin/gdpr/history`
- `GET /admin/gdpr/retention-policies`
- `POST /admin/gdpr/requests/:id/export`

**Existente (extinse):**
- `GET /admin/gdpr/requests` - Trebuie să returneze câmpuri noi
- `GET /admin/gdpr/requests/:id` - Trebuie să returneze câmpuri noi

### Protecție RBAC

- ✅ Secțiunea GDPR este protejată cu `view_gdpr` și `manage_gdpr`
- ✅ Doar `superadmin`, `admin`, `support` (cu permisiuni) au acces

### Status implementare

- ✅ UI complet implementat cu tabs
- ✅ Coloane noi în tabel requests
- ✅ SLA badge logic
- ✅ Export avansat (JSON, CSV, PDF)
- ✅ History tab cu timeline
- ✅ Policies tab cu politici de retenție
- ✅ Fallback-uri graceful pentru endpoint-uri lipsă
- ⏳ Așteaptă implementarea endpoint-urilor backend principale

