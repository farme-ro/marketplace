# Admin Backend Integration Gaps

Acest document enumeră endpoint-urile backend necesare pentru aplicația admin și statusul lor de implementare.

## 1. Autentificare

### ✅ Implementat

- **POST /auth/login**
  - **Status:** ✅ Implementat
  - **Descriere:** Autentificare utilizator (inclusiv admin)
  - **Request Body:**
    ```json
    {
      "email": "admin@farme.ro",
      "password": "password"
    }
    ```
  - **Response:**
    ```json
    {
      "token": "jwt-token",
      "user": {
        "id": "uuid",
        "email": "admin@farme.ro",
        "fullName": "Admin User",
        "role": "ADMIN"
      }
    }
    ```
  - **Folosit în:** `src/lib/api/admin-auth.ts` → `loginAdmin()`

- **GET /auth/me**
  - **Status:** ✅ Implementat
  - **Descriere:** Returnează utilizatorul curent autentificat
  - **Auth:** Necesită token JWT (cookie sau header)
  - **Response:**
    ```json
    {
      "id": "uuid",
      "email": "admin@farme.ro",
      "fullName": "Admin User",
      "role": "ADMIN"
    }
    ```
  - **Folosit în:** `src/lib/api/admin-auth.ts` → `getCurrentAdmin()`

- **POST /auth/logout**
  - **Status:** ✅ Implementat
  - **Descriere:** Deconectare utilizator (șterge cookie-ul de sesiune)
  - **Folosit în:** `src/lib/api/admin-auth.ts` → `logoutAdmin()`

### ⚠️ Observații

- Backend-ul folosește cookie-based auth (`session` cookie)
- Token-ul JWT este setat în cookie și poate fi folosit și în header `Authorization: Bearer <token>`
- Endpoint-ul `/auth/me` necesită autentificare și returnează user-ul curent

## 2. Producători

### ✅ Implementat

- **GET /admin/producers**
  - **Status:** ✅ Implementat
  - **Descriere:** Listă producători cu filtre și paginare
  - **Auth:** Necesită rol ADMIN
  - **Query Params:**
    - `status` (optional): `PENDING_VERIFICATION` | `APPROVED` | `REJECTED`
    - `region` (optional): ID regiune
    - `page` (optional, default: 1): Număr pagină
    - `limit` (optional, default: 20): Rezultate per pagină
  - **Response:**
    ```json
    {
      "producers": [
        {
          "id": "uuid",
          "name": "Nume Producător",
          "status": "APPROVED",
          "user": {
            "id": "uuid",
            "email": "producer@farme.ro",
            "fullName": "Producer Name"
          },
          "mainRegion": {
            "id": "uuid",
            "name": "Regiune"
          },
          "createdAt": "2024-01-01T00:00:00Z"
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 20,
        "total": 100,
        "totalPages": 5
      }
    }
    ```
  - **Folosit în:** ✅ Pagina `/producers` - **INTEGRAT**

- **GET /admin/producers/:id**
  - **Status:** ✅ Implementat
  - **Descriere:** Detalii producător
  - **Auth:** Necesită rol ADMIN
  - **Response:** Include producer cu user, mainRegion, products (10), orderVendors (10)
  - **Folosit în:** ✅ Drawer detalii producător - **INTEGRAT**

- **PATCH /admin/producers/:id**
  - **Status:** ✅ Implementat
  - **Descriere:** Actualizează producător (status, descriere, etc.)
  - **Auth:** Necesită rol ADMIN
  - **Request Body:**
    ```json
    {
      "status": "APPROVED" | "REJECTED" | "PENDING_VERIFICATION",
      "description": "string (optional)"
    }
    ```
  - **Folosit în:** ✅ Acțiuni de moderare (Aprobă/Respinge) - **INTEGRAT**

### ⚠️ Observații

- Endpoint-urile sunt implementate și funcționale
- Trebuie doar să fie integrate în UI-ul admin

## 3. Utilizatori

### ✅ Implementat

- **GET /admin/users**
  - **Status:** ✅ Implementat
  - **Descriere:** Listă utilizatori cu filtre și paginare
  - **Auth:** Necesită rol ADMIN
  - **Query Params:**
    - `role` (optional): `ADMIN` | `PRODUCER` | `CUSTOMER`
    - `status` (optional): Status utilizator (dacă există)
    - `search` (optional): Căutare după email sau nume
    - `page` (optional, default: 1): Număr pagină
    - `limit` (optional, default: 20): Rezultate per pagină
  - **Response:**
    ```json
    {
      "users": [
        {
          "id": "uuid",
          "email": "user@farme.ro",
          "fullName": "User Name",
          "role": "CUSTOMER",
          "createdAt": "2024-01-01T00:00:00Z",
          "producer": {
            "id": "uuid",
            "name": "Producer Name",
            "status": "APPROVED"
          }
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 20,
        "total": 100,
        "totalPages": 5
      }
    }
    ```
  - **Folosit în:** ✅ Pagina `/users` - **INTEGRAT**

- **GET /admin/users/:id**
  - **Status:** ✅ Implementat
  - **Descriere:** Detalii utilizator
  - **Auth:** Necesită rol ADMIN
  - **Response:** Include user cu producer, orders (10), carts (1 active)
  - **Folosit în:** ✅ Drawer detalii utilizator - **INTEGRAT**

- **PATCH /admin/users/:id**
  - **Status:** ✅ Implementat
  - **Descriere:** Actualizează utilizator (rol, nume, etc.)
  - **Auth:** Necesită rol ADMIN
  - **Request Body:**
    ```json
    {
      "role": "ADMIN" | "PRODUCER" | "CUSTOMER" (optional),
      "fullName": "string" (optional)
    }
    ```
  - **Folosit în:** ✅ Editare utilizator - **INTEGRAT**

### ❌ Neimplementat

- **PATCH /admin/users/:id/status**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Actualizează status utilizator (suspendare/reactivare)
  - **Auth:** Necesită rol ADMIN
  - **Sugestie Request Body:**
    ```json
    {
      "status": "ACTIVE" | "SUSPENDED"
    }
    ```
  - **Folosit în:** ⚠️ Acțiuni de suspendare/reactivare utilizator (UI implementat, așteaptă endpoint)
  - **Notă:** Frontend-ul afișează butoanele dar funcționalitatea necesită acest endpoint

### ⚠️ Observații

- Endpoint-urile sunt implementate și funcționale
- Trebuie doar să fie integrate în UI-ul admin

## 4. Comenzi

### ✅ Implementat

- **GET /admin/orders**
  - **Status:** ✅ Implementat (parțial)
  - **Descriere:** Listă comenzi cu filtre și paginare
  - **Auth:** Necesită rol ADMIN
  - **Query Params:**
    - `status` (optional): Status comandă
    - `paymentStatus` (optional): Status plată
    - `producerId` (optional): ID producător
    - `clientId` (optional): ID client
    - `clientEmail` (optional): Email client (nou)
    - `search` (optional): Căutare generală (nou)
    - `dateFrom` (optional): Data început (ISO string) - alias pentru startDate
    - `dateTo` (optional): Data sfârșit (ISO string) - alias pentru endDate
    - `startDate` (optional): Data început (ISO string) - legacy
    - `endDate` (optional): Data sfârșit (ISO string) - legacy
    - `page` (optional, default: 1): Număr pagină
    - `limit` (optional, default: 20): Rezultate per pagină
  - **⚠️ Observație:** Filtrele `clientEmail` și `search` pot să nu fie suportate încă de backend
  - **Response:**
    ```json
    {
      "orders": [
        {
          "id": "uuid",
          "customerId": "uuid",
          "customer": {
            "id": "uuid",
            "email": "customer@farme.ro",
            "fullName": "Customer Name"
          },
          "status": "COMPLETED",
          "paymentStatus": "PAID",
          "totalAmount": "100.00",
          "createdAt": "2024-01-01T00:00:00Z",
          "vendors": [
            {
              "producer": {
                "id": "uuid",
                "name": "Producer Name"
              }
            }
          ]
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 20,
        "total": 100,
        "totalPages": 5
      }
    }
    ```
  - **Folosit în:** ✅ Pagina `/orders` - **INTEGRAT**

- **GET /admin/orders/:id**
  - **Status:** ✅ Implementat (parțial)
  - **Descriere:** Detalii comandă
  - **Auth:** Necesită rol ADMIN
  - **Response:** Include order cu customer, shippingRegion, vendors (cu producer, items), commissions
  - **Response extins (așteptat):**
    ```json
    {
      "id": "uuid",
      "totalAmount": "100.00",
      "totalCommission": "8.00", // Total comision Farmero
      "totalPayout": "92.00", // Total către producători
      "paymentMethod": "card" | "cash" | "transfer",
      "commissions": [
        {
          "id": "uuid",
          "producer": { "id": "uuid", "name": "Ferma Popescu" },
          "baseAmount": "100.00",
          "commissionRate": "0.0800",
          "commissionAmount": "8.00",
          "status": "PENDING" | "ISSUED" | "PAID"
        }
      ],
      "timeline": [
        {
          "status": "PLACED",
          "timestamp": "2025-01-27T10:00:00Z",
          "note": "Comandă plasată"
        }
      ],
      // ... rest of fields
    }
    ```
  - **Folosit în:** ✅ Modal detalii comandă - **INTEGRAT** (așteaptă câmpuri noi)

- **PATCH /admin/orders/:id**
  - **Status:** ✅ Implementat (parțial)
  - **Descriere:** Actualizează comandă (doar câmpuri administrative)
  - **Auth:** Necesită rol ADMIN
  - **Request Body (actual):**
    ```json
    {
      "notes": "string" (optional),
      "status": "REFUNDED" | "CANCELED" (optional)
    }
    ```
  - **Folosit în:** ✅ Editare note comandă, refund/cancel - **INTEGRAT**
  - **⚠️ Observație:** Backend-ul ar trebui să accepte `status` pentru REFUNDED/CANCELED

### ⚠️ Observații

- Endpoint-urile sunt implementate și funcționale
- Trebuie doar să fie integrate în UI-ul admin

## 5. Dashboard KPIs

### ✅ Implementat (parțial)

- **GET /admin/financials/summary**
  - **Status:** ✅ Implementat
  - **Descriere:** Rezumat financiar (total volume, comisioane, etc.)
  - **Auth:** Necesită rol ADMIN
  - **Query Params:**
    - `from` (optional): Data început (ISO string)
    - `to` (optional): Data sfârșit (ISO string)
  - **Response:**
    ```json
    {
      "totalOrders": 100,
      "totalGMV": 50000.00,
      "totalCommission": 5000.00,
      "totalPaidCommission": 4500.00,
      "activeClients": 50,
      "activeProducers": 20,
      "period": {
        "from": "2024-01-01T00:00:00Z",
        "to": "2024-01-31T23:59:59Z"
      }
    }
    ```
  - **Folosit în:** Pagina `/dashboard` (TODO: integrare)

### ⚠️ Observații

- Endpoint-ul este implementat și funcțional
- Pentru KPIs individuale (total producători, total clienți), se pot folosi:
  - `GET /admin/producers` cu `limit=1` și `total` din pagination
  - `GET /admin/users` cu `limit=1` și `total` din pagination
  - `GET /admin/orders` cu filtre pentru "azi" și `total` din pagination

## 6. System & Health (Actualizat)

### ❌ Neimplementat

- **GET /health**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Health check pentru API și sistem
  - **Auth:** Public (sau opțional cu auth pentru detalii)
  - **Sugestie Response:**
    ```json
    {
      "status": "healthy" | "unhealthy" | "degraded",
      "version": "1.0.0",
      "uptime": 3600,
      "database": {
        "status": "connected" | "disconnected"
      },
      "timestamp": "2025-01-27T10:00:00Z"
    }
    ```
  - **Folosit în:** ✅ Pagina `/system/status` - **INTEGRAT** (afișează mesaj dacă endpoint lipsește)

- **GET /health/payments**
  - **Status:** ❌ Neimplementat (opțional)
  - **Descriere:** Health check pentru serviciul de plăți
  - **Auth:** Public
  - **Sugestie Response:**
    ```json
    {
      "status": "up" | "down",
      "service": "payments"
    }
    ```
  - **Folosit în:** ✅ Pagina `/system/status` - **INTEGRAT** (serviciul nu este afișat dacă endpoint lipsește)

- **GET /health/journal**
  - **Status:** ❌ Neimplementat (opțional)
  - **Descriere:** Health check pentru modulul Journal
  - **Auth:** Public
  - **Sugestie Response:**
    ```json
    {
      "status": "up" | "down",
      "service": "journal"
    }
    ```
  - **Folosit în:** ✅ Pagina `/system/status` - **INTEGRAT** (serviciul nu este afișat dacă endpoint lipsește)

- **GET /health/notifications**
  - **Status:** ❌ Neimplementat (opțional)
  - **Descriere:** Health check pentru serviciul de notificări/email
  - **Auth:** Public
  - **Sugestie Response:**
    ```json
    {
      "status": "up" | "down",
      "service": "notifications"
    }
    ```
  - **Folosit în:** ✅ Pagina `/system/status` - **INTEGRAT** (serviciul nu este afișat dacă endpoint lipsește)

- **GET /admin/system/errors-summary**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Statistici despre erorile din ultimele 24h
  - **Auth:** Necesită permisiune `view_system_status`
  - **Response:**
    ```json
    {
      "totalErrors24h": 42,
      "errorsByEndpoint": [
        {
          "endpoint": "/api/orders",
          "method": "POST",
          "errorCount": 15,
          "lastError": "2025-01-27T10:00:00Z"
        }
      ],
      "recentErrors": [
        {
          "id": "uuid",
          "message": "Validation error: missing field",
          "endpoint": "/api/orders",
          "method": "POST",
          "statusCode": 422,
          "timestamp": "2025-01-27T10:00:00Z"
        }
      ]
    }
    ```
  - **Folosit în:** ✅ Pagina `/system/status` - **INTEGRAT** (afișează mesaj dacă endpoint lipsește)

- **POST /admin/system/test-error**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Trimite un eveniment de test către sistemul de monitorizare (Sentry/Logger)
  - **Auth:** Necesită permisiune `view_system_status`
  - **Request:** Niciun body necesar
  - **Response:**
    ```json
    {
      "success": true,
      "eventId": "sentry-event-id (optional)",
      "message": "Test event sent successfully"
    }
    ```
  - **Folosit în:** ✅ Pagina `/system/status` - **INTEGRAT** (fallback în dev: console.error)
  - **Notă:** În development, dacă endpoint-ul nu există, frontend-ul aruncă un error în console care poate fi captat de Sentry/logger

- **GET /admin/feature-flags**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Listă feature flags active cu detalii complete
  - **Auth:** Necesită rol ADMIN sau SUPERADMIN
  - **Sugestie Response:**
    ```json
    [
      {
        "name": "journal",
        "status": "active" | "fallback" | "partial" | "off",
        "description": "Jurnal de farme.ro",
        "source": "frontend" | "backend" | "admin",
        "scope": "core commerce" | "experimental" | "beta" | "internal",
        "location": "frontend/src/lib/backend-sync/status.ts",
        "editable": true
      }
    ]
    ```
  - **Folosit în:** ✅ Pagina `/system/config` - **INTEGRAT** (folosește fallback static dacă endpoint lipsește)

- **PATCH /admin/feature-flags/:name**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Actualizează un feature flag (dacă este editabil)
  - **Auth:** Necesită rol ADMIN sau SUPERADMIN
  - **Request Body:**
    ```json
    {
      "enabled": true | false
    }
    ```
  - **Response:**
    ```json
    {
      "name": "journal",
      "status": "active",
      "description": "Jurnal de farme.ro",
      "source": "backend",
      "scope": "beta",
      "location": "backend/config/feature-flags.ts",
      "editable": true
    }
    ```
  - **Folosit în:** ✅ Pagina `/system/config` - **INTEGRAT** (butoanele de editare sunt ascunse dacă endpoint lipsește)

- **GET /admin/system/info**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Returnează informații despre mediu și configurație
  - **Auth:** Necesită rol ADMIN sau SUPERADMIN
  - **Sugestie Response:**
    ```json
    {
      "environment": "dev" | "staging" | "prod" | "local",
      "backendUrl": "https://api.farme.ro",
      "frontendUrl": "https://farme.ro",
      "adminUrl": "https://admin.farme.ro",
      "version": "1.0.0",
      "buildTime": "2025-01-27T10:00:00Z"
    }
    ```
  - **Folosit în:** ✅ Pagina `/system/config` - **INTEGRAT** (folosește fallback din environment variables dacă endpoint lipsește)

### ⚠️ Observații

- Endpoint-ul `/health` nu este critic pentru funcționalitatea de bază
- Frontend-ul afișează mesaj clar când endpoint-ul lipsește
- Feature flags pot fi gestionate și din frontend (BackendSyncStatus) dacă backend endpoint nu există

## 7. Producers Moderation (Actualizat)

### ✅ Endpoint-uri folosite efectiv:

- **GET /admin/producers** - ✅ Folosit pentru listă cu filtre (status, region, paginare)
- **GET /admin/producers/:id** - ✅ Folosit pentru detalii în drawer
- **PATCH /admin/producers/:id** - ✅ Folosit pentru aprobare/respingere producător

### ⚠️ Observații:

- Backend-ul acceptă doar statusurile: `PENDING_VERIFICATION`, `APPROVED`, `REJECTED`
- Nu există status `SUSPENDED` pentru producători
- Pentru suspendare, se poate folosi `REJECTED` sau se poate adăuga un câmp separat în backend

## 8. Users Moderation (Actualizat)

### ✅ Endpoint-uri folosite efectiv:

- **GET /admin/users** - ✅ Folosit pentru listă cu filtre (role, search, paginare)
- **GET /admin/users/:id** - ✅ Folosit pentru detalii în drawer
- **PATCH /admin/users/:id** - ✅ Folosit pentru editare rol/nume

### ❌ Endpoint lipsă:

- **PATCH /admin/users/:id/status** - Necesar pentru suspendare/reactivare utilizatori
  - Frontend-ul are UI implementat dar așteaptă acest endpoint
  - Sugestie: Adaugă câmp `status` în modelul User (ACTIVE, SUSPENDED) sau folosește un flag boolean

## 9. Orders Management (Actualizat)

### ✅ Endpoint-uri folosite efectiv:

- **GET /admin/orders** - ✅ Folosit pentru listă cu filtre (status, date range, paginare)
- **GET /admin/orders/:id** - ✅ Folosit pentru detalii în modal
- **PATCH /admin/orders/:id** - ⚠️ Folosit pentru editare notes (status update nu este suportat complet)

### ⚠️ Observații:

- Backend-ul acceptă doar `notes` în PATCH /admin/orders/:id
- Frontend-ul trimite `status: 'REFUNDED'` sau `status: 'CANCELED'` dar backend-ul nu le procesează
- Pentru funcționalitate completă, backend-ul trebuie să accepte `status` în request body

## Rezumat

### ✅ Endpoint-uri implementate și integrate:

1. ✅ Autentificare (login, logout, me) - **INTEGRAT**
2. ✅ Producători (list, detail, update status) - **INTEGRAT**
3. ✅ Utilizatori (list, detail, update role) - **INTEGRAT**
4. ✅ Comenzi (list, detail, update notes) - **INTEGRAT**
5. ✅ Financials summary (pentru dashboard KPIs) - **TODO: integrare în dashboard**

### ❌ Endpoint-uri lipsă (necesare pentru funcționalitate completă):

1. ❌ **PATCH /admin/users/:id/status** - Pentru suspendare/reactivare utilizatori
2. ❌ **PATCH /admin/orders/:id** - Extindere pentru a accepta `status` (REFUNDED, CANCELED)
3. ❌ **GET /admin/status** - Status / Health check endpoint (opțional)

## 10. Journal Admin (Actualizat)

### ✅ Endpoint-uri implementate și integrate:

- **GET /admin/journal/articles**
  - **Status:** ✅ Implementat
  - **Descriere:** Listă toate articolele cu filtre
  - **Auth:** Necesită rol ADMIN
  - **Query Params:**
    - `status` (optional): `draft` | `review` | `approved` | `published` | `archived`
    - `producerId` (optional): ID producător
    - `search` (optional): Căutare după titlu/producător
    - `page` (optional, default: 1): Număr pagină
    - `limit` (optional, default: 20): Rezultate per pagină
  - **Response:**
    ```json
    {
      "data": [JournalArticle[]],
      "meta": { "page": 1, "limit": 20, "total": 45, "totalPages": 3 }
    }
    ```
  - **Folosit în:** ✅ Pagina `/system/jurnal` - **INTEGRAT**

- **GET /admin/journal/articles/:id**
  - **Status:** ✅ Implementat
  - **Descriere:** Detalii complete articol
  - **Auth:** Necesită rol ADMIN
  - **Response:** Include articol cu metrici, revizii, editori
  - **Folosit în:** ✅ Drawer detalii articol - **INTEGRAT**

- **PATCH /admin/journal/articles/:id**
  - **Status:** ✅ Implementat
  - **Descriere:** Actualizează articol (titlu, excerpt, content, status, etc.)
  - **Auth:** Necesită rol ADMIN
  - **Request Body:**
    ```json
    {
      "title": "string" (optional),
      "excerpt": "string" (optional),
      "content": "string" (optional),
      "coverImageUrl": "string" (optional),
      "status": "draft" | "review" | "approved" | "published" | "archived" (optional)
    }
    ```
  - **Folosit în:** ✅ Acțiuni de moderare (Trimite în review, Aprobă, Arhivează) - **INTEGRAT**

- **POST /admin/journal/articles/:id/publish**
  - **Status:** ⚠️ Neimplementat (opțional)
  - **Descriere:** Endpoint dedicat pentru publicare articol
  - **Auth:** Necesită rol ADMIN
  - **Notă:** Frontend-ul încearcă acest endpoint, dar folosește fallback la PATCH dacă nu există
  - **Folosit în:** ✅ Acțiune "Publică" - **INTEGRAT** (cu fallback)

### ⚠️ Observații:

- Toate endpoint-urile principale sunt implementate și funcționale
- Endpoint-ul `/publish` este opțional (frontend folosește PATCH ca fallback)
- Workflow editorial: draft → review → approved → published → archived

## 11. Subscriptions & Promotions (Actualizat)

### ❌ Endpoint-uri lipsă:

- **GET /admin/subscriptions/producers**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Listă planuri de promovare pentru producători
  - **Auth:** Necesită rol ADMIN
  - **Sugestie Response:**
    ```json
    {
      "subscriptions": [
        {
          "id": "uuid",
          "producerId": "uuid",
          "producerName": "Ferma Popescu",
          "planName": "Premium",
          "startDate": "2025-01-01T00:00:00Z",
          "renewsAt": "2025-02-01T00:00:00Z",
          "status": "active" | "expired" | "cancelled"
        }
      ]
    }
    ```
  - **Folosit în:** ✅ Pagina `/system/abonamente-promovare` - **INTEGRAT** (afișează empty state dacă endpoint lipsește)

- **GET /admin/subscriptions/clients**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Listă abonamente pentru comenzi recurente clienți
  - **Auth:** Necesită rol ADMIN
  - **Sugestie Response:**
    ```json
    {
      "subscriptions": [
        {
          "id": "uuid",
          "clientId": "uuid",
          "clientName": "Ion Popescu",
          "producerId": "uuid",
          "producerName": "Ferma Popescu",
          "frequency": "weekly" | "biweekly" | "monthly",
          "status": "active" | "paused" | "cancelled",
          "nextDelivery": "2025-02-01T00:00:00Z"
        }
      ]
    }
    ```
  - **Folosit în:** ✅ Pagina `/system/abonamente-promovare` - **INTEGRAT** (afișează empty state dacă endpoint lipsește)

- **GET /admin/promotions/campaigns**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Listă campanii de promovare
  - **Auth:** Necesită rol ADMIN
  - **Sugestie Response:**
    ```json
    {
      "campaigns": [
        {
          "id": "uuid",
          "producerId": "uuid",
          "producerName": "Ferma Popescu",
          "channel": "marketplace" | "social" | "newsletter",
          "status": "active" | "paused" | "completed",
          "budget": 1000.00,
          "periodStart": "2025-01-01T00:00:00Z",
          "periodEnd": "2025-01-31T23:59:59Z"
        }
      ]
    }
    ```
  - **Folosit în:** ✅ Pagina `/system/abonamente-promovare` - **INTEGRAT** (afișează empty state dacă endpoint lipsește)

### ⚠️ Observații:

- Toate endpoint-urile sunt read-only pentru moment (overview)
- Frontend-ul afișează mesaje clare când endpoint-urile lipsesc
- Pagina este funcțională și pregătită pentru integrare când backend-ul va implementa endpoint-urile

## 12. Audit Log (Nou)

### ❌ Neimplementat

- **POST /admin/audit-log**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Loghează o acțiune admin în audit log
  - **Auth:** Necesită rol ADMIN
  - **Request Body:**
    ```json
    {
      "action": "PRODUCER_APPROVED" | "USER_SUSPENDED" | "ORDER_REFUNDED" | ...,
      "targetType": "producer" | "user" | "order" | "journal_article" | ...,
      "targetId": "uuid",
      "reason": "string (optional)",
      "metadata": {
        "key": "value"
      },
      "performedBy": {
        "id": "uuid",
        "email": "admin@farme.ro",
        "fullName": "Admin Name"
      }
    }
    ```
  - **Response:**
    ```json
    {
      "id": "uuid",
      "action": "PRODUCER_APPROVED",
      "targetType": "producer",
      "targetId": "uuid",
      "reason": "string (optional)",
      "metadata": {},
      "performedBy": {
        "id": "uuid",
        "email": "admin@farme.ro",
        "fullName": "Admin Name"
      },
      "performedAt": "2025-01-27T10:00:00Z"
    }
    ```
  - **Folosit în:** ✅ Acțiuni critice (producători, utilizatori, comenzi, jurnal) - **INTEGRAT** (cu fallback console.warn)

- **GET /admin/audit-log**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Returnează înregistrări de audit log cu filtre și paginare
  - **Auth:** Necesită permisiune `view_audit_log`
  - **Query Params:**
    - `performedBy` (optional): ID admin
    - `action` (optional): Tip acțiune (ex: 'PRODUCER_APPROVED')
    - `targetType` (optional): Tip țintă ('producer', 'user', 'order', etc.)
    - `startDate` (optional): Data început (ISO string)
    - `endDate` (optional): Data sfârșit (ISO string)
    - `page` (optional, default: 1): Număr pagină
    - `limit` (optional, default: 20): Rezultate per pagină
  - **Response:**
    ```json
    {
      "entries": [
        {
          "id": "uuid",
          "action": "PRODUCER_APPROVED",
          "targetType": "producer",
          "targetId": "uuid",
          "reason": "string (optional)",
          "metadata": {},
          "performedBy": {
            "id": "uuid",
            "email": "admin@farme.ro",
            "fullName": "Admin Name"
          },
          "performedAt": "2025-01-27T10:00:00Z"
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 20,
        "total": 100,
        "totalPages": 5
      }
    }
    ```
  - **Folosit în:** ✅ Pagina `/system/audit-log` - **INTEGRAT** (afișează empty state dacă endpoint lipsește)

### ⚠️ Observații:

- Frontend-ul loghează acțiuni critice folosind `logAdminAction()` din `admin/src/lib/utils/admin-audit.ts`
- Dacă backend endpoint nu există, se folosește fallback la `console.warn` pentru debugging
- Toate acțiunile critice (approve/reject producer, suspend user, refund/cancel order, reject journal article) necesită `reason` când este cazul
- Reason-ul este inclus în metadata audit log-ului

## 13. Disputes & Refunds (Nou)

### ❌ Neimplementat

- **GET /admin/orders/disputes**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Listă dispute cu filtre și paginare
  - **Auth:** Necesită permisiune `view_orders`
  - **Query Params:**
    - `status` (optional): `open` | `in_review` | `resolved` | `refunded`
    - `type` (optional): `quality` | `delivery` | `billing` | `other`
    - `orderId` (optional): ID comandă
    - `page` (optional, default: 1): Număr pagină
    - `limit` (optional, default: 20): Rezultate per pagină
  - **Response:**
    ```json
    {
      "disputes": [
        {
          "id": "uuid",
          "orderId": "uuid",
          "order": {
            "id": "uuid",
            "totalAmount": "100.00",
            "status": "DELIVERED",
            "customer": {
              "id": "uuid",
              "email": "client@farme.ro",
              "fullName": "Client Name"
            }
          },
          "type": "quality" | "delivery" | "billing" | "other",
          "status": "open" | "in_review" | "resolved" | "refunded",
          "description": "string",
          "clientId": "uuid",
          "producerId": "uuid",
          "createdAt": "2025-01-27T10:00:00Z",
          "updatedAt": "2025-01-27T10:00:00Z",
          "resolvedAt": "2025-01-27T11:00:00Z",
          "resolution": "string (optional)"
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 20,
        "total": 100,
        "totalPages": 5
      }
    }
    ```
  - **Folosit în:** ✅ Pagina `/orders/disputes` - **INTEGRAT** (afișează empty state dacă endpoint lipsește)

- **PATCH /admin/orders/disputes/:id**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Actualizează status dispute
  - **Auth:** Necesită permisiune `refund_orders` sau `manage_financials`
  - **Request Body:**
    ```json
    {
      "status": "in_review" | "resolved" | "refunded",
      "resolution": "string (optional)"
    }
    ```
  - **Response:** Dispute object actualizat
  - **Folosit în:** ✅ Acțiuni dispute - **INTEGRAT** (așteaptă endpoint)

- **POST /admin/orders/:id/refund**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Creează refund pentru o comandă
  - **Auth:** Necesită permisiune `refund_orders` sau `manage_financials`
  - **Request Body:**
    ```json
    {
      "reason": "string (required)",
      "amount": "string (optional)" // Partial refund, dacă lipsește = full refund
    }
    ```
  - **Response:**
    ```json
    {
      "success": true,
      "refundId": "uuid"
    }
    ```
  - **Folosit în:** ✅ Acțiune "Creează refund" - **INTEGRAT** (așteaptă endpoint)

## 14. Commissions & Payout Summary (Nou)

### ❌ Neimplementat

- **GET /admin/commerce/commissions-summary**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Rezumat comisioane și payout-uri pe perioadă
  - **Auth:** Necesită permisiune `view_financials`
  - **Query Params:**
    - `from` (optional): Data început (ISO string)
    - `to` (optional): Data sfârșit (ISO string)
    - `producerId` (optional): ID producător (filtrare)
  - **Response:**
    ```json
    {
      "summary": {
        "totalGMV": "10000.00",
        "totalCommissions": "800.00",
        "totalPayoutDue": "9200.00",
        "period": {
          "from": "2025-01-01T00:00:00Z",
          "to": "2025-01-31T23:59:59Z"
        }
      },
      "byProducer": [
        {
          "producerId": "uuid",
          "producerName": "Ferma Popescu",
          "totalSales": "5000.00",
          "totalCommissions": "400.00",
          "netPayout": "4600.00",
          "payoutStatus": "pending" | "paid",
          "commissionCount": 25
        }
      ]
    }
    ```
  - **Folosit în:** ✅ Pagina `/commerce/commissions` - **INTEGRAT** (afișează empty state dacă endpoint lipsește)

- **GET /admin/commissions**
  - **Status:** ⚠️ Parțial implementat (vezi backend commission.routes.ts)
  - **Descriere:** Listă comisioane (există deja în backend)
  - **Auth:** Necesită rol ADMIN
  - **Query Params:**
    - `status` (optional): `PENDING` | `ISSUED` | `PAID`
    - `producerId` (optional): ID producător
    - `orderId` (optional): ID comandă
  - **Response:**
    ```json
    {
      "commissions": [
        {
          "id": "uuid",
          "orderId": "uuid",
          "producerId": "uuid",
          "producer": {
            "id": "uuid",
            "name": "Ferma Popescu",
            "status": "APPROVED"
          },
          "baseAmount": "100.00",
          "commissionRate": "0.0800",
          "commissionAmount": "8.00",
          "status": "PENDING" | "ISSUED" | "PAID",
          "createdAt": "2025-01-27T10:00:00Z",
          "updatedAt": "2025-01-27T10:00:00Z"
        }
      ]
    }
    ```
  - **Folosit în:** ✅ API client - **INTEGRAT** (folosește endpoint existent)

### 📝 Status Integrare:

- ✅ `/producers` - **COMPLET INTEGRAT** (tabel, filtre, drawer, acțiuni moderare, audit log)
- ✅ `/users` - **COMPLET INTEGRAT** (tabel, filtre, drawer, acțiuni - așteaptă endpoint status, audit log)
- ✅ `/orders` - **ÎMBUNĂTĂȚIT** (tabel extins, filtre noi, secțiune financiară, timeline - așteaptă câmpuri noi în backend)
- ✅ `/orders/disputes` - **INTEGRAT** (tabel, filtre, acțiuni - așteaptă endpoint-uri backend)
- ✅ `/commerce/commissions` - **INTEGRAT** (KPI cards, tabel producători - așteaptă endpoint backend)
- ✅ `/system/status` - **COMPLET INTEGRAT** (health check, feature flags - cu fallback, RBAC)
- ✅ `/system/jurnal` - **COMPLET INTEGRAT** (tabel, filtre, drawer, workflow editorial, audit log, RBAC)
- ✅ `/system/abonamente-promovare` - **COMPLET INTEGRAT** (tabele, empty states - așteaptă endpoint-uri, RBAC)
- ✅ `/system/audit-log` - **COMPLET INTEGRAT** (tabel, filtre, paginare - așteaptă endpoint backend, RBAC)
- ⏳ `/dashboard` - **TODO**: Integrare KPIs cu endpoint-uri existente
- ✅ `/content/pages` - **INTEGRAT** (tabel, filtre, drawer, editor multi-limbă - așteaptă endpoint-uri backend)
- ✅ `/content/faq` - **INTEGRAT** (tabel, filtre, drawer, editor multi-limbă - așteaptă endpoint-uri backend)
- ✅ `/content/i18n` - **INTEGRAT** (monitorizare snapshot static - fără backend necesar)
- ✅ `/support/users` - **INTEGRAT** (căutare utilizatori - reuse endpoint existent)
- ✅ `/support/users/[id]` - **INTEGRAT** (vedere 360° cu tabs - așteaptă endpoint-uri backend)
- ✅ `/system/gdpr` - **INTEGRAT** (tabel cereri GDPR, filtre, acțiuni - așteaptă endpoint-uri backend)
- ✅ `/marketing` - **INTEGRAT** (KPI cards, overview - așteaptă endpoint backend, cu fallback)
- ✅ `/marketing/funnels` - **INTEGRAT** (funnel-uri producători/clienți - așteaptă endpoint backend)
- ✅ `/marketing/campaigns` - **INTEGRAT** (tabs promovări, journal, canale - așteaptă endpoint-uri backend)
- ✅ `/content-seo` - **INTEGRAT** (KPI cards overview - așteaptă endpoint backend, cu fallback static)
- ✅ `/content-seo/pages` - **INTEGRAT** (tabel pagini cu status SEO - așteaptă endpoint backend, cu fallback static)
- ✅ `/content-seo/jurnal` - **INTEGRAT** (tabel articole cu status SEO - așteaptă endpoint backend, cu fallback compus)
- ✅ `/security` - **INTEGRAT** (KPI cards security overview - așteaptă endpoint backend, cu fallback static)
- ✅ `/security/access-logs` - **INTEGRAT** (tabel loguri acces - așteaptă endpoint backend, cu fallback)
- ✅ `/security/sensitive-actions` - **INTEGRAT** (tabel acțiuni sensibile - așteaptă endpoint backend, cu fallback)
- ✅ `/system/gdpr` - **EXTINS** (tabs Requests/History/Policies, coloane noi, export avansat - așteaptă endpoint-uri backend extinse)

## 20. Security & Access Logs (Nou)

### ❌ Neimplementat

- **GET /admin/security/overview**
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

- **GET /admin/security/access-logs**
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
      "pagination": {
        "page": 1,
        "limit": 20,
        "total": 100,
        "totalPages": 5
      }
    }
    ```
  - **Folosit în:** ✅ Pagina `/security/access-logs` - **INTEGRAT** (cu fallback)

- **GET /admin/security/sensitive-actions**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Listă acțiuni sensibile (admin actions critice)
  - **Auth:** Necesită permisiune `view_security` sau `view_access_logs`
  - **Query Params:**
    - `page` (optional, default: 1): Număr pagină
    - `limit` (optional, default: 20): Rezultate per pagină
    - `search` (optional): Căutare după email admin, țintă, ID
    - `actionType` (optional): Tip acțiune (ex: `USER_SUSPENDED`, `ROLE_CHANGED`, `PRODUCER_APPROVED`)
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
  - **Notă:** Acest endpoint poate fi un view specializat peste audit log existent sau un endpoint separat. Frontend-ul tratează datele ca read-only.

## 21. GDPR Advanced & Compliance Center (Extindere)

### ❌ Neimplementat / Necesită extindere

- **GET /admin/gdpr/history**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Timeline cronologic pentru cereri GDPR
  - **Auth:** Necesită permisiune `view_gdpr`
  - **Query Params:**
    - `requestId` (optional): Filtrare după ID cerere
    - `page` (optional, default: 1): Număr pagină
    - `limit` (optional, default: 20): Rezultate per pagină
  - **Response:**
    ```json
    {
      "data": [
        {
          "id": "uuid",
          "requestId": "uuid",
          "action": "STATUS_CHANGED",
          "performedBy": {
            "id": "uuid",
            "email": "admin@farme.ro",
            "fullName": "Admin User"
          },
          "details": "Status changed from OPEN to IN_PROGRESS",
          "createdAt": "2025-01-27T10:00:00Z"
        }
      ],
      "pagination": { /* ... */ }
    }
    ```
  - **Folosit în:** ✅ Tab "History" din `/system/gdpr` - **INTEGRAT** (cu fallback)

- **GET /admin/gdpr/retention-policies**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Listă politici de retenție pentru diferite tipuri de date
  - **Auth:** Necesită permisiune `view_gdpr`
  - **Response:**
    ```json
    [
      {
        "id": "users",
        "dataType": "USERS",
        "retentionMonths": 24,
        "lastUpdated": "2025-01-27T10:00:00Z",
        "updatedBy": {
          "id": "uuid",
          "email": "admin@farme.ro"
        },
        "status": "COMPLIANT",
        "notes": "Conform GDPR, datele utilizatorilor sunt păstrate 24 luni după ultima activitate."
      }
    ]
    ```
  - **Folosit în:** ✅ Tab "Policies & Retention" din `/system/gdpr` - **INTEGRAT** (cu fallback static)

- **POST /admin/gdpr/requests/:id/export**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Generare export pentru cerere GDPR (JSON, CSV, PDF)
  - **Auth:** Necesită permisiune `manage_gdpr`
  - **Body:**
    ```json
    {
      "format": "JSON" | "CSV" | "PDF"
    }
    ```
  - **Response:**
    ```json
    {
      "downloadUrl": "https://...",
      "generatedAt": "2025-01-27T10:00:00Z"
    }
    ```
  - **Folosit în:** ✅ Tab "Requests" din `/system/gdpr` - **INTEGRAT** (cu fallback)

### ⚠️ Necesită extindere

- **GET /admin/gdpr/requests**
  - **Status:** ⚠️ Trebuie extins
  - **Descriere:** Trebuie să returneze câmpuri noi:
    - `legalDeadline` (ISO date - 30 zile de la createdAt)
    - `userType` ('CLIENT' | 'PRODUCER' | 'ADMIN')
    - `requestMethod` ('EMAIL' | 'DASHBOARD' | 'MANUAL')
    - `exportFormat` ('JSON' | 'CSV' | 'PDF') - pentru EXPORT
    - `exportGeneratedAt` (ISO date) - pentru EXPORT

- **GET /admin/gdpr/requests/:id**
  - **Status:** ⚠️ Trebuie extins
  - **Descriere:** Trebuie să returneze aceleași câmpuri noi ca mai sus

## 19. Content & SEO Governance (Nou)

### ❌ Neimplementat

- **GET /admin/content-seo/overview**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Stats consolidate pentru SEO overview
  - **Auth:** Necesită permisiune `view_seo` sau `view_journal`
  - **Response:**
    ```json
    {
      "totalPages": 20,
      "pagesOk": 12,
      "pagesWithIssues": 8,
      "stalePages": 3,
      "totalArticles": 100,
      "articlesOk": 70,
      "articlesWithIssues": 30,
      "avgJournalCtr30d": 3.5
    }
    ```
  - **Folosit în:** ✅ Pagina `/content-seo` - **INTEGRAT** (cu fallback static)

- **GET /admin/content-seo/pages**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Listă pagini cu status SEO și meta informații
  - **Auth:** Necesită permisiune `view_seo` sau `view_journal`
  - **Query Params:**
    - `search` (optional): Căutare după path sau title
    - `status` (optional): `ok` | `warning` | `missing` | `stale`
  - **Response:**
    ```json
    [
      {
        "path": "/despre-noi",
        "title": "Despre Noi",
        "description": "Află mai multe despre Farmero",
        "ogImage": "https://farme.ro/og-image.jpg",
        "canonicalUrl": "https://farme.ro/despre-noi",
        "lastUpdatedAt": "2025-01-27T10:00:00Z",
        "seoStatus": "warning",
        "issues": ["missing_og_image", "title_too_short"],
        "trafficScore": 65
      }
    ]
    ```
  - **Folosit în:** ✅ Pagina `/content-seo/pages` - **INTEGRAT** (cu fallback static cu pagini importante)

- **GET /admin/content-seo/journal**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Listă articole journal cu status SEO și metrics
  - **Auth:** Necesită permisiune `view_seo` sau `view_journal`
  - **Query Params:**
    - `search` (optional): Căutare după titlu sau producător
    - `status` (optional): `ok` | `warning` | `missing` | `stale`
  - **Response:**
    ```json
    [
      {
        "id": "uuid",
        "slug": "articol-exemplu",
        "title": "Titlu Articol",
        "producerName": "Ferma Popescu",
        "publishedAt": "2025-01-27T10:00:00Z",
        "lastUpdatedAt": "2025-01-27T10:00:00Z",
        "seoStatus": "ok",
        "issues": [],
        "views30d": 1500,
        "clicks30d": 75,
        "ctr30d": 5.0
      }
    ]
    ```
  - **Folosit în:** ✅ Pagina `/content-seo/jurnal` - **INTEGRAT** (cu fallback compus din `/admin/journal/articles` + `/admin/journal/metrics`)

## 18. Growth Engine (Nou)

### ✅ Implementat (parțial)

- **POST /growth/events**
  - **Status:** ✅ Implementat
  - **Descriere:** Record growth event (public, no auth required)
  - **Auth:** Public (pentru anonymous tracking)
  - **Request Body:**
    ```json
    {
      "userId": "uuid (optional)",
      "producerId": "uuid (optional)",
      "type": "page_view | cart_abandoned | subscription_started | ...",
      "source": "homepage | checkout | portal | journal | ...",
      "metadata": {}
    }
    ```
  - **Response:**
    ```json
    {
      "success": true,
      "data": {
        "id": "uuid",
        "type": "page_view",
        "source": "homepage",
        "createdAt": "2025-01-27T10:00:00Z"
      }
    }
    ```
  - **Folosit în:** ✅ Frontend tracking - **INTEGRAT**

- **GET /admin/growth/timeline?userId={userId}&limit={limit}&offset={offset}**
  - **Status:** ✅ Implementat
  - **Descriere:** Get user timeline (last N events)
  - **Auth:** Necesită rol ADMIN
  - **Query Params:**
    - `userId` (required): User UUID
    - `limit` (optional, default: 20, max: 100): Number of events
    - `offset` (optional, default: 0): Pagination offset
  - **Response:**
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "uuid",
          "type": "page_view",
          "source": "homepage",
          "metadata": {},
          "createdAt": "2025-01-27T10:00:00Z"
        }
      ]
    }
    ```
  - **Folosit în:** ✅ Pagina `/marketing/growth` - **INTEGRAT**

- **GET /admin/growth/campaigns/overview**
  - **Status:** ✅ Implementat
  - **Descriere:** Get campaign overview (active, upcoming, finished)
  - **Auth:** Necesită rol ADMIN
  - **Response:**
    ```json
    {
      "success": true,
      "data": {
        "active": 5,
        "upcoming": 2,
        "finished": 10,
        "total": 17
      }
    }
    ```
  - **Folosit în:** ✅ Pagina `/marketing/growth` - **INTEGRAT**

- **GET /admin/growth/nudges?userId={userId}&role={role}&page={page}&...**
  - **Status:** ✅ Implementat
  - **Descriere:** Get eligible nudges for user context
  - **Auth:** Necesită rol ADMIN
  - **Query Params:**
    - `userId` (optional): User UUID
    - `producerId` (optional): Producer UUID
    - `role` (optional): User role
    - `page` (optional): Current page
    - `subscriptionActive` (optional): Boolean
    - `hasJournalArticles` (optional): Boolean
    - `cartItemsCount` (optional): Number
    - `metadata` (optional): JSON object
  - **Response:**
    ```json
    {
      "success": true,
      "data": [
        {
          "code": "cart_abandoned",
          "description": "Ai lăsat produse în coș",
          "priority": 10
        }
      ]
    }
    ```
  - **Folosit în:** ✅ Pagina `/marketing/growth` - **INTEGRAT**

### ❌ Neimplementat (opțional)

- **GET /admin/growth/events?from={date}&to={date}&type={type}**
  - **Status:** ❌ Neimplementat (opțional)
  - **Descriere:** Listă evenimente cu filtre și paginare (pentru analytics)
  - **Auth:** Necesită rol ADMIN
  - **Query Params:**
    - `from` (optional): Data început (ISO string)
    - `to` (optional): Data sfârșit (ISO string)
    - `type` (optional): Tip eveniment
    - `source` (optional): Sursă eveniment
    - `page` (optional, default: 1): Număr pagină
    - `limit` (optional, default: 20): Rezultate per pagină
  - **Response:** Listă evenimente cu paginare
  - **Folosit în:** ⚠️ Analytics dashboard (opțional)

### ⚠️ Observații:

- Endpoint-urile principale sunt implementate și funcționale
- Frontend-ul are fallback-uri pentru când backend-ul este dezactivat
- Feature flag: `growthEngine: false` în `frontend/src/lib/backend-sync/status.ts`
- Pentru calculul "events last 7 days" și "subscription activation rate", ar fi util un endpoint dedicat sau se pot calcula din date existente

## 19. Marketing & Growth (Nou)

### ❌ Neimplementat

- **GET /admin/marketing/overview**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Stats consolidate pentru marketing overview
  - **Auth:** Necesită permisiune `view_marketing`
  - **Response:**
    ```json
    {
      "activePromotedProducers": 42,
      "activeRecurringClients": 150,
      "newJournalArticles30d": 12,
      "journalProducerCtr30d": 3.5,
      "promoPlanMix": {
        "free": 200,
        "promo": 42,
        "premium": 8
      },
      "monthlyPromoRevenueEstimate": 4200.00
    }
    ```
  - **Folosit în:** ✅ Pagina `/marketing` - **INTEGRAT** (cu fallback compus din journal-metrics + subscriptions)

- **GET /admin/marketing/funnels**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Funnel data pentru producători și clienți
  - **Auth:** Necesită permisiune `view_marketing`
  - **Query Params:**
    - `days` (optional, default: 90): Perioadă în zile
  - **Response:**
    ```json
    {
      "producers": [
        {
          "label": "Producători creați",
          "value": 1000,
          "conversionFromPrevious": null
        },
        {
          "label": "Producători cu minim 1 produs",
          "value": 800,
          "conversionFromPrevious": 80.0
        },
        {
          "label": "Producători cu minim 1 comandă",
          "value": 500,
          "conversionFromPrevious": 62.5
        },
        {
          "label": "Producători cu plan promo activ",
          "value": 42,
          "conversionFromPrevious": 8.4
        }
      ],
      "clients": [
        {
          "label": "Clienți cu cont",
          "value": 5000,
          "conversionFromPrevious": null
        },
        {
          "label": "Clienți cu cel puțin 1 comandă",
          "value": 3000,
          "conversionFromPrevious": 60.0
        },
        {
          "label": "Clienți cu abonament activ",
          "value": 150,
          "conversionFromPrevious": 5.0
        },
        {
          "label": "Clienți cu 2+ comenzi din abonament",
          "value": 80,
          "conversionFromPrevious": 53.3
        }
      ]
    }
    ```
  - **Folosit în:** ✅ Pagina `/marketing/funnels` - **INTEGRAT** (cu fallback)

- **GET /admin/marketing/promoted-producers**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Listă producători promovați cu planuri active
  - **Auth:** Necesită permisiune `view_marketing`
  - **Response:**
    ```json
    [
      {
        "id": "uuid",
        "producerId": "uuid",
        "producerName": "Ferma Popescu",
        "planName": "Premium",
        "tier": "premium",
        "status": "active" | "expired" | "upcoming",
        "activeFrom": "2025-01-01T00:00:00Z",
        "activeTo": "2025-02-01T00:00:00Z",
        "slug": "ferma-popescu"
      }
    ]
    ```
  - **Folosit în:** ✅ Tab "Promovări producători" din `/marketing/campaigns` - **INTEGRAT** (cu fallback)

- **GET /admin/marketing/journal-top-articles**
  - **Status:** ⚠️ Opțional (poate reuse `/admin/journal/metrics`)
  - **Descriere:** Top articole journal după performanță
  - **Auth:** Necesită permisiune `view_marketing` sau `view_journal`
  - **Query Params:**
    - `limit` (optional, default: 10): Număr articole
  - **Response:**
    ```json
    [
      {
        "id": "uuid",
        "title": "Titlu articol",
        "producerName": "Ferma Popescu",
        "producerId": "uuid",
        "views": 1500,
        "clicks": 75,
        "ctr": 5.0
      }
    ]
    ```
  - **Folosit în:** ✅ Tab "Jurnal & conținut" din `/marketing/campaigns` - **INTEGRAT** (reuse journal-metrics dacă există)

## 17. GDPR & Data Export (Nou)

### ❌ Neimplementat

- **GET /admin/gdpr/requests**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Listă cereri GDPR cu filtre
  - **Auth:** Necesită permisiune `view_users` sau `view_audit_log`
  - **Query Params:**
    - `type` (optional): `EXPORT` | `DELETE` | `ANONYMIZE` | `RECTIFY`
    - `status` (optional): `OPEN` | `IN_PROGRESS` | `COMPLETED` | `REJECTED`
    - `search` (optional): Căutare după email sau ID
    - `dateFrom` (optional): Data început (ISO string)
    - `dateTo` (optional): Data sfârșit (ISO string)
    - `page` (optional, default: 1): Număr pagină
    - `limit` (optional, default: 20): Rezultate per pagină
  - **Response:**
    ```json
    {
      "data": [
        {
          "id": "uuid",
          "userId": "uuid",
          "userEmail": "user@farme.ro",
          "type": "EXPORT",
          "status": "OPEN",
          "createdAt": "2025-01-27T10:00:00Z",
          "updatedAt": "2025-01-27T10:00:00Z",
          "handledBy": {
            "id": "uuid",
            "email": "admin@farme.ro",
            "fullName": "Admin Name"
          },
          "downloadUrl": "https://...", // For EXPORT COMPLETED
          "reason": "string (optional)" // For REJECTED
        }
      ],
      "pagination": { /* ... */ }
    }
    ```
  - **Folosit în:** ✅ Pagina `/system/gdpr` - **INTEGRAT** (cu fallback)

- **GET /admin/gdpr/requests/:id**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Detalii cerere GDPR
  - **Auth:** Necesită permisiune `view_users`
  - **Response:** GdprRequest object (vezi GET /admin/gdpr/requests)
  - **Folosit în:** ✅ Drawer detalii cerere - **INTEGRAT** (cu fallback)

- **POST /admin/gdpr/requests**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Creează cerere GDPR (inițiată de admin sau user)
  - **Auth:** Necesită permisiune `manage_users` sau `manage_system`
  - **Request Body:**
    ```json
    {
      "userId": "uuid",
      "type": "EXPORT" | "DELETE" | "ANONYMIZE" | "RECTIFY",
      "reason": "string (optional)"
    }
    ```
  - **Response:** GdprRequest object
  - **Folosit în:** ✅ Creare cerere din `/support/users/[id]` sau `/system/gdpr` - **INTEGRAT** (cu fallback)

- **PATCH /admin/gdpr/requests/:id**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Actualizează status cerere GDPR
  - **Auth:** Necesită permisiune `manage_users` sau `manage_system`
  - **Request Body:**
    ```json
    {
      "status": "IN_PROGRESS" | "COMPLETED" | "REJECTED",
      "reason": "string (optional, obligatoriu pentru REJECTED)"
    }
    ```
  - **Response:** GdprRequest object actualizat
  - **Folosit în:** ✅ Acțiuni schimbare status - **INTEGRAT** (cu fallback)

## 15. Content Management (Nou)

### ❌ Neimplementat

- **GET /admin/content/pages**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Listă pagini statice cu filtre
  - **Auth:** Necesită permisiune `view_content`
  - **Query Params:**
    - `type` (optional): `info` | `legal` | `help` | `donations`
    - `status` (optional): `draft` | `published` | `archived`
    - `search` (optional): Căutare după slug sau titlu
    - `page` (optional, default: 1): Număr pagină
    - `limit` (optional, default: 20): Rezultate per pagină
  - **Response:**
    ```json
    {
      "data": [
        {
          "id": "uuid",
          "slug": "/despre-noi",
          "type": "info",
          "status": "published",
          "contents": [
            {
              "locale": "ro",
              "title": "Despre Noi",
              "body": "Conținut HTML sau Markdown..."
            }
          ],
          "updatedAt": "2025-01-27T10:00:00Z",
          "createdAt": "2025-01-27T10:00:00Z"
        }
      ],
      "pagination": { /* ... */ }
    }
    ```
  - **Folosit în:** ✅ Pagina `/content/pages` - **INTEGRAT** (cu fallback)

- **GET /admin/content/pages/:id**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Detalii pagină statică
  - **Auth:** Necesită permisiune `view_content`
  - **Response:** AdminPage object (vezi mai sus)
  - **Folosit în:** ✅ Drawer detalii pagină - **INTEGRAT** (cu fallback)

- **PATCH /admin/content/pages/:id**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Actualizează pagină statică
  - **Auth:** Necesită permisiune `manage_content`
  - **Request Body:**
    ```json
    {
      "type": "info" | "legal" | "help" | "donations" (optional),
      "status": "draft" | "published" | "archived" (optional),
      "contents": [
        {
          "locale": "ro",
          "title": "Titlu",
          "body": "Conținut..."
        }
      ] (optional)
    }
    ```
  - **Response:** AdminPage object actualizat
  - **Folosit în:** ✅ Acțiuni salvare/publicare - **INTEGRAT** (cu fallback)

- **GET /admin/content/faq**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Listă întrebări frecvente
  - **Auth:** Necesită permisiune `view_content`
  - **Query Params:**
    - `category` (optional): `clients` | `producers` | `delivery_payments` | `legal` | `other`
    - `status` (optional): `published` | `draft`
    - `search` (optional): Căutare după key sau întrebare
  - **Response:**
    ```json
    [
      {
        "id": "uuid",
        "key": "faq.delivery.returns",
        "category": "delivery_payments",
        "status": "published",
        "order": 1,
        "questions": {
          "ro": "Cum pot returna un produs?",
          "en": "How can I return a product?"
        },
        "answers": {
          "ro": "Poți returna produsul în termen de 14 zile...",
          "en": "You can return the product within 14 days..."
        },
        "createdAt": "2025-01-27T10:00:00Z",
        "updatedAt": "2025-01-27T10:00:00Z"
      }
    ]
    ```
  - **Folosit în:** ✅ Pagina `/content/faq` - **INTEGRAT** (cu fallback)

- **POST /admin/content/faq**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Creează întrebare FAQ nouă
  - **Auth:** Necesită permisiune `manage_content`
  - **Request Body:**
    ```json
    {
      "key": "faq.delivery.returns",
      "category": "delivery_payments",
      "status": "draft",
      "order": 1,
      "questions": {
        "ro": "Întrebare?",
        "en": "Question?"
      },
      "answers": {
        "ro": "Răspuns.",
        "en": "Answer."
      }
    }
    ```
  - **Response:** AdminFaqEntry object
  - **Folosit în:** ✅ Acțiune "Adaugă întrebare" - **INTEGRAT** (cu fallback)

- **PATCH /admin/content/faq/:id**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Actualizează întrebare FAQ
  - **Auth:** Necesită permisiune `manage_content`
  - **Request Body:** Partial AdminFaqEntry (vezi POST)
  - **Response:** AdminFaqEntry object actualizat
  - **Folosit în:** ✅ Acțiuni salvare/publicare - **INTEGRAT** (cu fallback)

- **DELETE /admin/content/faq/:id**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Șterge întrebare FAQ (soft-delete)
  - **Auth:** Necesită permisiune `manage_content`
  - **Response:**
    ```json
    {
      "success": true
    }
    ```
  - **Folosit în:** ✅ Acțiune "Șterge" - **INTEGRAT** (cu fallback)

## 16. Support & User Timeline (Nou)

### ❌ Neimplementat

- **GET /admin/users/:id/orders**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Listă comenzi ale unui utilizator
  - **Auth:** Necesită permisiune `view_users` sau `view_orders`
  - **Response:**
    ```json
    [
      {
        "id": "uuid",
        "totalAmount": "100.00",
        "status": "DELIVERED",
        "createdAt": "2025-01-27T10:00:00Z",
        "producers": ["uuid1", "uuid2"]
      }
    ]
    ```
  - **Folosit în:** ✅ Tab "Comenzi" din `/support/users/[id]` - **INTEGRAT** (cu fallback)

- **GET /admin/users/:id/subscriptions**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Listă abonamente ale unui utilizator
  - **Auth:** Necesită permisiune `view_users`
  - **Response:**
    ```json
    [
      {
        "id": "uuid",
        "type": "client" | "producer",
        "planName": "Premium",
        "status": "active" | "paused" | "canceled",
        "frequency": "monthly" | "yearly"
      }
    ]
    ```
  - **Folosit în:** ✅ Tab "Abonamente" din `/support/users/[id]` - **INTEGRAT** (cu fallback)

- **GET /admin/users/:id/journal-articles**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Listă articole journal ale unui utilizator (dacă este producător)
  - **Auth:** Necesită permisiune `view_users`
  - **Response:**
    ```json
    [
      {
        "id": "uuid",
        "title": "Titlu articol",
        "status": "published" | "draft",
        "publishedAt": "2025-01-27T10:00:00Z"
      }
    ]
    ```
  - **Folosit în:** ✅ Tab "Journal" din `/support/users/[id]` - **INTEGRAT** (cu fallback)

- **GET /admin/users/:id/timeline**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Timeline evenimente legate de utilizator (audit log, comenzi, etc.)
  - **Auth:** Necesită permisiune `view_users`
  - **Response:**
    ```json
    [
      {
        "id": "uuid",
        "type": "order" | "subscription" | "journal" | "audit" | "note",
        "title": "Comandă plasată",
        "description": "Detalii suplimentare",
        "timestamp": "2025-01-27T10:00:00Z",
        "metadata": {}
      }
    ]
    ```
  - **Folosit în:** ✅ Tab "Overview" din `/support/users/[id]` - **INTEGRAT** (cu fallback)

- **GET /admin/users/:id/notes**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Listă note interne despre utilizator
  - **Auth:** Necesită permisiune `view_users`
  - **Response:**
    ```json
    [
      {
        "id": "uuid",
        "userId": "uuid",
        "text": "Notă internă",
        "author": {
          "id": "uuid",
          "email": "admin@farme.ro",
          "fullName": "Admin Name"
        },
        "createdAt": "2025-01-27T10:00:00Z",
        "updatedAt": "2025-01-27T10:00:00Z"
      }
    ]
    ```
  - **Folosit în:** ✅ Tab "Notes" din `/support/users/[id]` - **INTEGRAT** (cu fallback in-memory în dev)

- **POST /admin/users/:id/notes**
  - **Status:** ❌ Neimplementat
  - **Descriere:** Creează notă internă despre utilizator
  - **Auth:** Necesită permisiune `view_users`
  - **Request Body:**
    ```json
    {
      "text": "Notă internă"
    }
    ```
  - **Response:** UserNote object (vezi GET)
  - **Folosit în:** ✅ Formular "Adaugă notă" - **INTEGRAT** (cu fallback in-memory în dev)

## 22. AI Assistant (Nou)

### ✅ Implementat

- **POST /ai/assistant**
  - **Status:** ✅ Implementat
  - **Descriere:** Handle AI assistant request (public, no auth required)
  - **Auth:** Public (pentru anonymous users)
  - **Request Body:**
    ```json
    {
      "context": {
        "role": "client | producer | support | admin",
        "locale": "ro | en | ...",
        "page": "/produse (optional)",
        "userId": "uuid (optional)",
        "metadata": {}
      },
      "message": "Cum funcționează plata?"
    }
    ```
  - **Response:**
    ```json
    {
      "success": true,
      "data": {
        "answer": "Poți plăti online cu cardul sau ramburs...",
        "suggestedLinks": [
          {
            "url": "/cum-functioneaza#plata",
            "label": "Despre plată"
          }
        ]
      }
    }
    ```
  - **Folosit în:** ✅ Frontend AI Widget - **INTEGRAT**

- **GET /admin/ai/interactions?role={role}&userId={userId}&search={search}&page={page}&limit={limit}**
  - **Status:** ✅ Implementat
  - **Descriere:** Get AI interactions (for monitoring)
  - **Auth:** Necesită rol ADMIN
  - **Query Params:**
    - `role` (optional): Filter by role
    - `userId` (optional): Filter by user ID
    - `search` (optional): Search in questions/answers
    - `page` (optional, default: 1): Page number
    - `limit` (optional, default: 50, max: 100): Results per page
  - **Response:**
    ```json
    {
      "success": true,
      "data": {
        "data": [
          {
            "id": "uuid",
            "userId": "uuid",
            "role": "client",
            "context": { "page": "/produse", "locale": "ro" },
            "question": "Cum funcționează plata?",
            "answer": "Poți plăti online...",
            "suggestedLinks": [],
            "createdAt": "2025-01-27T10:00:00Z"
          }
        ],
        "pagination": {
          "page": 1,
          "limit": 50,
          "total": 100,
          "totalPages": 2
        }
      }
    }
    ```
  - **Folosit în:** ✅ Pagina `/support/ai-interactions` - **INTEGRAT**

### ⚠️ Observații:

- Endpoint-urile sunt implementate și funcționale
- Frontend-ul are fallback-uri pentru când backend-ul este dezactivat
- Feature flag: `aiAssistant: false` în `frontend/src/lib/backend-sync/status.ts`
- Pentru MVP, răspunsurile sunt generate folosind keyword matching (rule-based)
- În producție, ar trebui integrat cu un serviciu LLM (OpenAI, Anthropic, etc.)

## 23. Contracts & Billing (Nou)

### ✅ Implementat

- **GET /admin/contracts/templates**
  - **Status:** ✅ Implementat
  - **Descriere:** Get list of contract templates
  - **Auth:** Necesită rol ADMIN
  - **Query Params:** `category`, `isActive`, `search`, `page`, `limit`
  - **Response:** List of ContractTemplate objects with pagination
  - **Folosit în:** ✅ Pagina `/system/contracts` (tab Templates) - **INTEGRAT**

- **GET /admin/contracts/templates/:id**
  - **Status:** ✅ Implementat
  - **Descriere:** Get contract template by ID
  - **Auth:** Necesită rol ADMIN
  - **Response:** ContractTemplate object
  - **Folosit în:** ✅ Detalii template (viitor) - **INTEGRAT**

- **POST /admin/contracts/templates**
  - **Status:** ✅ Implementat
  - **Descriere:** Create contract template
  - **Auth:** Necesită rol ADMIN
  - **Request Body:** `{ code, name, description, content, variables, category }`
  - **Response:** ContractTemplate object
  - **Folosit în:** ✅ Acțiune "Creează Template" - **INTEGRAT**

- **PATCH /admin/contracts/templates/:id**
  - **Status:** ✅ Implementat
  - **Descriere:** Update contract template
  - **Auth:** Necesită rol ADMIN
  - **Request Body:** Partial ContractTemplate fields
  - **Response:** Updated ContractTemplate object
  - **Folosit în:** ✅ Editare template (viitor) - **INTEGRAT**

- **GET /admin/contracts/instances**
  - **Status:** ✅ Implementat
  - **Descriere:** Get list of contract instances
  - **Auth:** Necesită rol ADMIN
  - **Query Params:** `templateId`, `producerId`, `clientId`, `orderId`, `status`, `search`, `page`, `limit`
  - **Response:** List of ContractInstance objects with pagination
  - **Folosit în:** ✅ Listare instanțe (viitor) - **INTEGRAT**

- **POST /admin/contracts/instances**
  - **Status:** ✅ Implementat
  - **Descriere:** Create contract instance
  - **Auth:** Necesită rol ADMIN
  - **Request Body:** `{ templateId, producerId?, clientId?, orderId?, variables, expiresAt?, notes? }`
  - **Response:** ContractInstance object
  - **Folosit în:** ✅ Creare instanță (viitor) - **INTEGRAT**

- **GET /admin/contracts/invoices**
  - **Status:** ✅ Implementat
  - **Descriere:** Get list of invoices
  - **Auth:** Necesită rol ADMIN
  - **Query Params:** `type`, `orderId`, `commissionId`, `producerId`, `clientId`, `status`, `search`, `page`, `limit`
  - **Response:** List of Invoice objects with pagination
  - **Folosit în:** ✅ Pagina `/system/contracts` (tab Invoices) - **INTEGRAT**

- **POST /admin/contracts/invoices**
  - **Status:** ✅ Implementat
  - **Descriere:** Create invoice
  - **Auth:** Necesită rol ADMIN
  - **Request Body:** `{ type, orderId?, commissionId?, producerId?, clientId?, items[], dueAt?, notes? }`
  - **Response:** Invoice object with calculated totals
  - **Folosit în:** ✅ Acțiune "Creează Factură" - **INTEGRAT**

- **GET /admin/contracts/delivery-notes**
  - **Status:** ✅ Implementat
  - **Descriere:** Get list of delivery notes
  - **Auth:** Necesită rol ADMIN
  - **Query Params:** `orderId`, `producerId`, `status`, `search`, `page`, `limit`
  - **Response:** List of DeliveryNote objects with pagination
  - **Folosit în:** ✅ Listare avize (viitor) - **INTEGRAT**

- **POST /admin/contracts/delivery-notes**
  - **Status:** ✅ Implementat
  - **Descriere:** Create delivery note
  - **Auth:** Necesită rol ADMIN
  - **Request Body:** `{ orderId, producerId, items[], carrierName?, trackingNumber?, notes? }`
  - **Response:** DeliveryNote object
  - **Folosit în:** ✅ Creare aviz (viitor) - **INTEGRAT**

### ⚠️ Observații:

- Endpoint-urile sunt implementate și funcționale
- Toate endpoint-urile necesită rol ADMIN
- Contract templates suportă versioning (versiunea se incrementează când se modifică conținutul)
- Invoice totals sunt calculate automat din items (netAmount, taxAmount, totalAmount)
- Contract instances sunt generate din templates cu substituție de variabile
- Delivery notes sunt legate de orders și producers
- Toate numerele (invoiceNumber, contractNumber, noteNumber) sunt auto-generate
- PDF generation și e-factura integration sunt hook-uri pentru viitor (câmpuri în DB, dar logica nu este implementată)

- Endpoint-urile sunt implementate și funcționale
- Frontend-ul are fallback-uri pentru când backend-ul este dezactivat
- Feature flag: `aiAssistant: false` în `frontend/src/lib/backend-sync/status.ts`
- Pentru MVP, răspunsurile sunt generate folosind keyword matching (rule-based)
- În producție, ar trebui integrat cu un serviciu LLM (OpenAI, Anthropic, etc.)

