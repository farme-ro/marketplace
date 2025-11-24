# GDPR API - Documentație Completă

## Prezentare generală

API-ul GDPR oferă endpoint-uri pentru gestionarea cererilor GDPR (DSAR), istoricul acțiunilor și politicile de retenție a datelor.

**Base Path:** `/admin/gdpr`

**Autentificare:** Toate endpoint-urile necesită autentificare și rol `ADMIN`.

---

## Endpoint-uri

### 1. Requests (Cereri GDPR)

#### GET /admin/gdpr/requests

Listează cererile GDPR cu filtre și paginare.

**Query Parameters:**
- `type` (optional): `EXPORT` | `DELETE` | `ANONYMIZE` | `RECTIFY`
- `status` (optional): `OPEN` | `IN_PROGRESS` | `COMPLETED` | `REJECTED` | `EXPORT_GENERATED` | `ARCHIVED`
- `requesterType` (optional): `CLIENT` | `PRODUCER` | `BUSINESS` | `LOGISTICS` | `INVESTOR` | `IMPORTER` | `ADMIN`
- `search` (optional): Căutare după email sau ID
- `dateFrom` (optional): ISO date string
- `dateTo` (optional): ISO date string
- `page` (optional, default: 1): Număr pagină
- `limit` (optional, default: 20): Rezultate per pagină

**Response:**
```json
{
  "data": {
    "data": [
      {
        "id": "uuid",
        "userId": "uuid",
        "userEmail": "user@example.com",
        "type": "EXPORT",
        "status": "OPEN",
        "channel": "WEB_FORM",
        "requesterType": "CLIENT",
        "requestedAt": "2024-01-01T00:00:00Z",
        "deadlineAt": "2024-01-31T00:00:00Z",
        "resolvedAt": null,
        "handledBy": null,
        "reason": null,
        "adminNote": null,
        "exportFormat": null,
        "exportUrl": null,
        "exportGeneratedAt": null,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  },
  "error": null
}
```

---

#### GET /admin/gdpr/requests/:id

Obține detaliile unei cereri GDPR.

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "userEmail": "user@example.com",
    "type": "EXPORT",
    "status": "OPEN",
    "channel": "WEB_FORM",
    "requesterType": "CLIENT",
    "requestedAt": "2024-01-01T00:00:00Z",
    "deadlineAt": "2024-01-31T00:00:00Z",
    "resolvedAt": null,
    "handledBy": {
      "id": "uuid",
      "email": "admin@farme.ro",
      "fullName": "Admin User"
    },
    "reason": null,
    "adminNote": null,
    "exportFormat": null,
    "exportUrl": null,
    "exportGeneratedAt": null,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "error": null
}
```

**Status Codes:**
- `200 OK` - Succes
- `404 NOT_FOUND` - Cerere negăsită

---

#### POST /admin/gdpr/requests

Creează o nouă cerere GDPR (inițiată de admin).

**Request Body:**
```json
{
  "userId": "uuid",
  "userEmail": "user@example.com",
  "type": "EXPORT",
  "channel": "WEB_FORM",
  "requesterType": "CLIENT",
  "reason": "User requested data export"
}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "userEmail": "user@example.com",
    "type": "EXPORT",
    "status": "OPEN",
    "channel": "WEB_FORM",
    "requesterType": "CLIENT",
    "requestedAt": "2024-01-01T00:00:00Z",
    "deadlineAt": "2024-01-31T00:00:00Z",
    "resolvedAt": null,
    "handledBy": null,
    "reason": "User requested data export",
    "adminNote": null,
    "exportFormat": null,
    "exportUrl": null,
    "exportGeneratedAt": null,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "error": null
}
```

**Status Codes:**
- `201 CREATED` - Cerere creată cu succes
- `400 BAD_REQUEST` - Date invalide
- `401 UNAUTHORIZED` - Neautentificat

---

#### PATCH /admin/gdpr/requests/:id/status

Actualizează statusul unei cereri GDPR.

**Request Body:**
```json
{
  "status": "IN_PROGRESS",
  "reason": "Processing request",
  "adminNote": "Internal note"
}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "status": "IN_PROGRESS",
    "handledBy": {
      "id": "uuid",
      "email": "admin@farme.ro",
      "fullName": "Admin User"
    },
    "reason": "Processing request",
    "adminNote": "Internal note",
    "updatedAt": "2024-01-01T12:00:00Z"
  },
  "error": null
}
```

**Status Codes:**
- `200 OK` - Succes
- `400 BAD_REQUEST` - Date invalide sau reason lipsă pentru REJECTED
- `404 NOT_FOUND` - Cerere negăsită
- `401 UNAUTHORIZED` - Neautentificat

**Note:** Pentru status `REJECTED`, câmpul `reason` este obligatoriu.

---

#### POST /admin/gdpr/requests/:id/export

Generează un export GDPR (doar pentru cereri de tip `EXPORT`).

**Request Body:**
```json
{
  "format": "JSON"
}
```

**Format Options:** `JSON` | `CSV` | `PDF`

**Response:**
```json
{
  "data": {
    "downloadUrl": "/api/admin/gdpr/exports/uuid.json",
    "generatedAt": "2024-01-01T12:00:00Z"
  },
  "error": null
}
```

**Status Codes:**
- `200 OK` - Export generat cu succes
- `400 BAD_REQUEST` - Format invalid sau cerere nu este de tip EXPORT
- `404 NOT_FOUND` - Cerere negăsită
- `401 UNAUTHORIZED` - Neautentificat

**Note:** Export-ul este generat ca "stub" (placeholder URL). În producție, ar trebui să genereze fișierul efectiv și să-l salveze în storage.

---

### 2. History (Istoric)

#### GET /admin/gdpr/history

Listează intrările din istoricul GDPR.

**Query Parameters:**
- `requestId` (optional): UUID al cererii
- `action` (optional): Tip acțiune (ex: `STATUS_CHANGED`, `EXPORT_GENERATED`)
- `adminId` (optional): UUID al admin-ului
- `dateFrom` (optional): ISO date string
- `dateTo` (optional): ISO date string
- `page` (optional, default: 1): Număr pagină
- `limit` (optional, default: 20): Rezultate per pagină

**Response:**
```json
{
  "data": {
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
        "createdAt": "2024-01-01T12:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3
    }
  },
  "error": null
}
```

---

### 3. Policies (Politici de retenție)

#### GET /admin/gdpr/policies

Listează toate politicile de retenție.

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "dataType": "USERS",
      "retentionPeriodDays": 730,
      "retentionMonths": 24,
      "status": "COMPLIANT",
      "lastUpdated": "2024-01-01T00:00:00Z",
      "updatedBy": {
        "id": "uuid",
        "email": "admin@farme.ro"
      },
      "notes": "Users data retention: 24 months",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "error": null
}
```

---

#### GET /admin/gdpr/policies/:id

Obține o politică de retenție după ID sau dataType.

**Response:** Similar cu GET /admin/gdpr/policies, dar returnează un singur obiect.

**Status Codes:**
- `200 OK` - Succes
- `404 NOT_FOUND` - Politică negăsită

---

#### PATCH /admin/gdpr/policies/:id

Actualizează o politică de retenție.

**Request Body:**
```json
{
  "retentionPeriodDays": 730,
  "status": "COMPLIANT",
  "notes": "Updated retention policy"
}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "dataType": "USERS",
    "retentionPeriodDays": 730,
    "retentionMonths": 24,
    "status": "COMPLIANT",
    "lastUpdated": "2024-01-01T12:00:00Z",
    "updatedBy": {
      "id": "uuid",
      "email": "admin@farme.ro"
    },
    "notes": "Updated retention policy",
    "updatedAt": "2024-01-01T12:00:00Z"
  },
  "error": null
}
```

**Status Codes:**
- `200 OK` - Succes
- `400 BAD_REQUEST` - Date invalide
- `401 UNAUTHORIZED` - Neautentificat

---

## Tipuri de date

### GdprRequestType
- `EXPORT` - Cerere de export date
- `DELETE` - Cerere de ștergere date
- `ANONYMIZE` - Cerere de anonimizare date
- `RECTIFY` - Cerere de rectificare date

### GdprRequestStatus
- `OPEN` - Cerere deschisă
- `IN_PROGRESS` - Cerere în procesare
- `COMPLETED` - Cerere completată
- `REJECTED` - Cerere respinsă
- `EXPORT_GENERATED` - Export generat
- `ARCHIVED` - Cerere arhivată

### GdprRequestChannel
- `WEB_FORM` - Formular web
- `EMAIL` - Email
- `PHONE` - Telefon
- `OTHER` - Altă metodă

### GdprRequesterType
- `CLIENT` - Client
- `PRODUCER` - Producător
- `BUSINESS` - Business
- `LOGISTICS` - Logistică
- `INVESTOR` - Investitor
- `IMPORTER` - Importator
- `ADMIN` - Admin

### GdprDataType
- `USERS` - Date utilizatori
- `ORDERS` - Comenzi
- `JOURNAL` - Jurnal
- `MARKETING` - Marketing
- `PAYMENTS` - Plăți
- `REVIEWS` - Recenzii
- `NOTIFICATIONS` - Notificări

### GdprPolicyStatus
- `COMPLIANT` - Conformă
- `NEEDS_REVIEW` - Necesită revizuire

---

## Audit Log

Toate acțiunile critice GDPR sunt loggate în:
1. **GdprRequestHistory** - Istoric detaliat per cerere
2. **DomainEvent** - Evenimente de domeniu pentru webhooks și audit

**Evenimente GDPR:**
- `gdpr.request.created` - Cerere creată
- `gdpr.request.status.changed` - Status schimbat
- `gdpr.export.generated` - Export generat
- `gdpr.policy.updated` - Politică actualizată

---

## SLA & Deadline

- **Deadline legal:** 30 zile de la `requestedAt`
- **Calculat automat:** Câmpul `deadlineAt` este setat automat la creare
- **SLA Status:**
  - **On time:** Deadline >5 zile rămase
  - **At risk:** Deadline <5 zile rămase
  - **Overdue:** Deadline depășit

---

## Exemple de utilizare

### Creare cerere EXPORT
```bash
curl -X POST https://api.farme.ro/admin/gdpr/requests \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "uuid",
    "userEmail": "user@example.com",
    "type": "EXPORT",
    "channel": "WEB_FORM",
    "requesterType": "CLIENT"
  }'
```

### Actualizare status
```bash
curl -X PATCH https://api.farme.ro/admin/gdpr/requests/:id/status \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "IN_PROGRESS",
    "adminNote": "Processing request"
  }'
```

### Generare export
```bash
curl -X POST https://api.farme.ro/admin/gdpr/requests/:id/export \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "format": "JSON"
  }'
```

---

## Note importante

1. **Export Generation:** Export-urile sunt generate ca "stub" (placeholder URL). În producție, ar trebui să genereze fișierul efectiv și să-l salveze în storage (S3, etc.).

2. **Reason obligatoriu:** Pentru status `REJECTED`, câmpul `reason` este obligatoriu.

3. **Deadline:** Deadline-ul este calculat automat la creare (30 zile de la `requestedAt`).

4. **Audit Log:** Toate acțiunile critice sunt loggate în `GdprRequestHistory` și `DomainEvent`.

5. **RBAC:** Toate endpoint-urile necesită rol `ADMIN`.

