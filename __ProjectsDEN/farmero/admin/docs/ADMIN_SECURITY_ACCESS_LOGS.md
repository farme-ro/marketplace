# Admin Security & Access Logs - Documentație

## Prezentare generală

Modulul Security & Access Logs oferă un dashboard de securitate și acces pentru monitorizarea autentificărilor, sesiunilor și acțiunilor sensibile în sistemul de administrare.

## Structură modul

### 1. Security Overview (`/security`)

**Descriere:** Dashboard cu KPI-uri principale pentru securitate.

**Funcționalități:**

#### KPI Cards (4 cards principale)
- **Login-uri admin reușite (24h):** Număr autentificări reușite
- **Login-uri eșuate (24h):** Număr tentative eșuate (color roșiatic)
- **Conturi blocate:** Număr conturi blocate
- **IP-uri suspecte (24h):** Număr IP-uri suspecte (dacă backend trimite)

#### Secțiuni Recent
- **Recent admin logins:** Tabel cu ultimele 5-10 evenimente de login
  - Email, rol, IP, tip eveniment, dată
- **Ultimele acțiuni sensibile:** Tabel cu ultimele 5-10 acțiuni sensibile
  - Admin email, tip acțiune, țintă, dată

**Backend Endpoints:**
- `GET /admin/security/overview` - Stats consolidate
- `GET /admin/security/access-logs?limit=10&days=1` - Recent logins
- `GET /admin/security/sensitive-actions?limit=10&days=1` - Recent actions

**Permisiuni:**
- `view_security` sau `view_access_logs` (obligatoriu)

**Fallback:**
- Dacă endpoint-urile lipsesc → valori 0 / N/A + mesaje informative

---

### 2. Access Logs (`/security/access-logs`)

**Descriere:** Istoric complet de login / logout / fail / session expire.

**Funcționalități:**

#### Filtre
- **Search:** După email sau IP
- **Event type:** All / LOGIN_SUCCESS / LOGIN_FAILED / LOGOUT / SESSION_EXPIRED
- **Interval:** 24h / 7 zile / 30 zile

#### Tabel
- **Coloane:**
  - Data & ora
  - Email utilizator (sau "guest")
  - Rol
  - IP
  - Tip eveniment (badge colorat)
  - User Agent (trunchiat, cu tooltip)

#### Drawer detalii
- Tip eveniment cu explicație
- Informații utilizator (User ID, Email, Rol)
- Informații conexiune (IP, User Agent, Locație, Data & ora)

**Event Type Labels:**
- `LOGIN_SUCCESS` → "Autentificare reușită"
- `LOGIN_FAILED` → "Tentativă eșuată de autentificare"
- `LOGOUT` → "Delogare"
- `SESSION_EXPIRED` → "Sesiune expirată (ex: timeout)"

**Backend Endpoints:**
- `GET /admin/security/access-logs` - Listă loguri cu filtre și paginare

**Permisiuni:**
- `view_security` sau `view_access_logs` (obligatoriu)

**Fallback:**
- Dacă endpoint lipsește → empty state cu mesaj informativ

---

### 3. Sensitive Changes (`/security/sensitive-actions`)

**Descriere:** Acțiuni sensibile: suspendare user, aprobare producător, refund, schimbare roluri, etc.

**Funcționalități:**

#### Filtre
- **Search:** După email admin, țintă, ID
- **Tip acțiune:** Dropdown populat din actionType existente
- **Target type:** USER / PRODUCER / ORDER / SYSTEM / JOURNAL / OTHER
- **Interval:** 24h / 7 zile / 30 zile

#### Tabel
- **Coloane:**
  - Data & ora
  - Admin email
  - Tip acțiune (badge)
  - Țintă (summary + tip)
  - Reason (trunchiat sau indicator)
  - IP

#### Drawer detalii
- Tip acțiune
- Informații admin (Admin ID, Email, IP)
- Informații țintă (Tip, ID, Summary)
- Reason (dacă există)
- Data & ora
- Link contextual către țintă:
  - USER → `/users?search=...`
  - PRODUCER → `/producers?search=...`
  - ORDER → `/orders?search=...`
  - JOURNAL → `/jurnal?search=...`

**Backend Endpoints:**
- `GET /admin/security/sensitive-actions` - Listă acțiuni cu filtre și paginare

**Permisiuni:**
- `view_security` sau `view_access_logs` (obligatoriu)

**Fallback:**
- Dacă endpoint lipsește → empty state cu mesaj informativ

---

## Types & Structuri

### SecurityOverview
```typescript
interface SecurityOverview {
  failedLogins24h: number
  successfulAdminLogins24h: number
  lockedAccounts: number
  suspiciousIpCount24h: number | null
}
```

### AccessLogEntry
```typescript
interface AccessLogEntry {
  id: string
  userId: string | null
  userEmail?: string | null
  role?: string | null
  ip?: string | null
  userAgent?: string | null
  location?: string | null
  eventType: 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'LOGOUT' | 'SESSION_EXPIRED'
  createdAt: string
}
```

### SensitiveActionEntry
```typescript
interface SensitiveActionEntry {
  id: string
  adminId: string
  adminEmail?: string | null
  actionType: string
  targetType: 'USER' | 'PRODUCER' | 'ORDER' | 'SYSTEM' | 'JOURNAL' | 'OTHER'
  targetId?: string | null
  targetSummary?: string | null
  ip?: string | null
  reason?: string | null
  createdAt: string
}
```

---

## RBAC & Permisiuni

### Roluri cu acces

- **superadmin:** ✅ Acces complet (obligatoriu)
- **admin:** ✅ Acces complet (dacă are `view_security` sau `view_access_logs`)
- **content:** ❌ Fără acces
- **marketing:** ❌ Fără acces
- **support:** ❌ Fără acces
- **finance:** ❌ Fără acces

### Permisiuni

- `view_security` - Vizualizare dashboard securitate (nou)
- `view_access_logs` - Vizualizare loguri de acces (nou)

**Notă:** Accesul este strict - doar superadmin sau admin cu permisiuni specifice. AccessDenied afișează mesaj serios, nu glumeț.

---

## Endpoint-uri backend necesare

### Overview

- `GET /admin/security/overview`
  - **Status:** ❌ Neimplementat
  - **Descriere:** Stats consolidate pentru security overview
  - **Auth:** Necesită permisiune `view_security` sau `view_access_logs`
  - **Response:**
    ```json
    {
      "failedLogins24h": 5,
      "successfulAdminLogins24h": 42,
      "lockedAccounts": 2,
      "suspiciousIpCount24h": 1
    }
    ```
  - **Folosit în:** ✅ Pagina `/security` - **INTEGRAT** (cu fallback static)

### Access Logs

- `GET /admin/security/access-logs`
  - **Status:** ❌ Neimplementat
  - **Descriere:** Listă loguri de acces (login, logout, session events)
  - **Auth:** Necesită permisiune `view_security` sau `view_access_logs`
  - **Query Params:**
    - `page` (optional, default: 1): Număr pagină
    - `limit` (optional, default: 20): Rezultate per pagină
    - `search` (optional): Căutare după email sau IP
    - `eventType` (optional): `LOGIN_SUCCESS` | `LOGIN_FAILED` | `LOGOUT` | `SESSION_EXPIRED`
    - `days` (optional): Perioadă în zile (1, 7, 30)
  - **Response:**
    ```json
    {
      "data": [
        {
          "id": "uuid",
          "userId": "uuid",
          "userEmail": "admin@farme.ro",
          "role": "admin",
          "ip": "192.168.1.1",
          "userAgent": "Mozilla/5.0...",
          "location": "Bucharest, RO",
          "eventType": "LOGIN_SUCCESS",
          "createdAt": "2025-01-27T10:00:00Z"
        }
      ],
      "pagination": { /* ... */ }
    }
    ```
  - **Folosit în:** ✅ Pagina `/security/access-logs` - **INTEGRAT** (cu fallback)

### Sensitive Actions

- `GET /admin/security/sensitive-actions`
  - **Status:** ❌ Neimplementat
  - **Descriere:** Listă acțiuni sensibile (admin actions critice)
  - **Auth:** Necesită permisiune `view_security` sau `view_access_logs`
  - **Query Params:**
    - `page` (optional, default: 1): Număr pagină
    - `limit` (optional, default: 20): Rezultate per pagină
    - `search` (optional): Căutare după email admin, țintă, ID
    - `actionType` (optional): Tip acțiune (ex: `USER_SUSPENDED`, `ROLE_CHANGED`)
    - `targetType` (optional): `USER` | `PRODUCER` | `ORDER` | `SYSTEM` | `JOURNAL` | `OTHER`
    - `days` (optional): Perioadă în zile (1, 7, 30)
  - **Response:**
    ```json
    {
      "data": [
        {
          "id": "uuid",
          "adminId": "uuid",
          "adminEmail": "admin@farme.ro",
          "actionType": "USER_SUSPENDED",
          "targetType": "USER",
          "targetId": "uuid",
          "targetSummary": "user@example.com",
          "ip": "192.168.1.1",
          "reason": "Violation of terms",
          "createdAt": "2025-01-27T10:00:00Z"
        }
      ],
      "pagination": { /* ... */ }
    }
    ```
  - **Folosit în:** ✅ Pagina `/security/sensitive-actions` - **INTEGRAT** (cu fallback)

**Status:** Toate endpoint-urile sunt documentate în `ADMIN_BACKEND_GAPS.md` cu structuri de request/response sugerate.

---

## Integrare cu Audit Log existent

### Relație cu `/system/audit-log`

**Opțiuni de implementare backend:**

1. **Endpoint separat:**
   - `GET /admin/security/sensitive-actions` este un endpoint dedicat
   - Poate folosi aceeași sursă de date ca audit log, dar cu filtre specializate

2. **View specializat:**
   - `GET /admin/security/sensitive-actions` este un view peste audit log
   - Backend filtrează automat acțiunile sensibile din audit log

**Frontend:**
- Tratează `SensitiveActionEntry` ca read-only
- Nu modifică sau șterge loguri
- Doar vizualizare și link-uri către ținte

---

## Fallback Behavior

### Când endpoint-urile lipsesc

1. **Overview:**
   - Dacă `GET /admin/security/overview` lipsește → valori 0 / N/A
   - Badge "Read-only / backend incomplet"

2. **Access Logs:**
   - Dacă endpoint lipsește → empty state cu mesaj:
     > "Backend-ul nu expune încă loguri de acces detaliate. Poți verifica sistemul de loguri server-side / Sentry direct."

3. **Sensitive Actions:**
   - Dacă endpoint lipsește → empty state cu mesaj similar

---

## Safety & UX

### Reguli de siguranță

1. **Read-only:**
   - Tot modulul este read-only
   - Nu există butoane de "Șterge log" / "Curăță log"
   - Nu se modifică sau șterge nimic

2. **AccessDenied serios:**
   - Mesaj clar și profesional
   - Nu glumeț sau informal
   - Explică de ce accesul este restricționat

3. **Nu afișa date sensibile:**
   - Parole, token-uri, cookie-uri nu sunt afișate
   - IP-urile sunt afișate (necesare pentru securitate)
   - User Agent este afișat (necesar pentru debugging)

---

## Recomandări de retenție loguri

**Notă:** Acestea sunt recomandări, nu logică implementată în cod.

1. **Access Logs:**
   - Retenție minimă: 30 zile
   - Retenție recomandată: 90 zile
   - Log-uri critice (failed logins, suspicious IPs): 1 an

2. **Sensitive Actions:**
   - Retenție minimă: 1 an
   - Retenție recomandată: 2-3 ani (pentru compliance)
   - Log-uri critice (role changes, user suspensions): permanent

3. **Storage:**
   - Consideră arhivare pentru log-uri vechi (> 1 an)
   - Backup periodic pentru log-uri critice
   - Indexare pentru căutare rapidă

---

## Rezumat

### Pagini noi

- ✅ `/security` - Security Overview
- ✅ `/security/access-logs` - Access Logs
- ✅ `/security/sensitive-actions` - Sensitive Changes

### Types noi

- `SecurityOverview` - Stats consolidate
- `AccessLogEntry` - Entry pentru loguri de acces
- `SensitiveActionEntry` - Entry pentru acțiuni sensibile
- `AccessLogEventType` - Tipuri evenimente
- `SensitiveActionTargetType` - Tipuri țintă

### API-uri noi

- `getSecurityOverview()` - Stats overview
- `getAccessLogs(params?)` - Listă loguri de acces
- `getSensitiveActions(params?)` - Listă acțiuni sensibile

### Endpoint-uri backend

**TODO (documentate în ADMIN_BACKEND_GAPS.md):**
- `GET /admin/security/overview`
- `GET /admin/security/access-logs`
- `GET /admin/security/sensitive-actions`

### Protecție RBAC

- ✅ Secțiunea Security este protejată strict cu `view_security` sau `view_access_logs`
- ✅ Doar `superadmin` și `admin` (cu permisiuni) au acces
- ✅ AccessDenied cu mesaj serios pentru utilizatori fără acces

### Status implementare

- ✅ UI complet implementat
- ✅ Fallback-uri graceful pentru endpoint-uri lipsă
- ✅ Read-only (nu permite ștergere/modificare)
- ✅ Link-uri contextuale către ținte
- ⏳ Așteaptă implementarea endpoint-urilor backend principale

