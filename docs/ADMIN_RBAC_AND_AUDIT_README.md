# Admin RBAC și Audit Log - Documentație

## Prezentare generală

Sistemul de administrare pentru farme.ro include un sistem complet de **Role-Based Access Control (RBAC)** și **Audit Logging** pentru a asigura securitatea și transparența acțiunilor administrative.

## 1. Roluri și Permisiuni

### Roluri disponibile

Sistemul definește următoarele roluri admin:

- **superadmin**: Acces complet la toate funcționalitățile
- **admin**: Acces standard (majoritatea operațiunilor, fără management sistem)
- **support**: Operațiuni de suport clienți (vizualizare și moderare utilizatori/producători)
- **finance**: Operațiuni financiare (comenzi, refunduri, abonamente)
- **content**: Management conținut (articole jurnal)

### Permisiuni

Fiecare rol are un set de permisiuni asociate:

#### Producători
- `view_producers`: Vizualizare listă producători
- `edit_producers`: Aprobare/respingere producători

#### Utilizatori
- `view_users`: Vizualizare listă utilizatori
- `manage_users`: Suspendare/reactivare utilizatori

#### Comenzi
- `view_orders`: Vizualizare comenzi
- `refund_orders`: Marcare comandă ca refundată
- `cancel_orders`: Anulare comandă

#### Jurnal
- `view_journal`: Vizualizare articole jurnal
- `manage_journal`: Aprobare/publicare/respingere articole

#### Sistem
- `view_system_status`: Vizualizare status sistem și feature flags
- `manage_system`: Management complet sistem (doar superadmin)

#### Financiar
- `view_financials`: Vizualizare date financiare
- `manage_financials`: Management date financiare

#### Abonamente & Promoții
- `view_subscriptions`: Vizualizare abonamente
- `manage_subscriptions`: Management abonamente

#### Audit
- `view_audit_log`: Vizualizare audit log

### Mapare Rol → Permisiuni

```typescript
superadmin: [
  // Toate permisiunile
  'view_producers', 'edit_producers',
  'view_users', 'manage_users',
  'view_orders', 'refund_orders', 'cancel_orders',
  'view_journal', 'manage_journal',
  'view_system_status', 'manage_system',
  'view_financials', 'manage_financials',
  'view_subscriptions', 'manage_subscriptions',
  'view_audit_log',
]

admin: [
  // Standard admin - majoritatea operațiunilor
  'view_producers', 'edit_producers',
  'view_users', 'manage_users',
  'view_orders', 'refund_orders', 'cancel_orders',
  'view_journal', 'manage_journal',
  'view_system_status',
  'view_financials',
  'view_subscriptions',
  'view_audit_log',
]

support: [
  // Suport clienți
  'view_producers', 'edit_producers',
  'view_users', 'manage_users',
  'view_orders',
  'view_journal',
  'view_audit_log',
]

finance: [
  // Operațiuni financiare
  'view_producers',
  'view_users',
  'view_orders', 'refund_orders', 'cancel_orders',
  'view_financials', 'manage_financials',
  'view_subscriptions', 'manage_subscriptions',
  'view_audit_log',
]

content: [
  // Management conținut
  'view_producers',
  'view_users',
  'view_orders',
  'view_journal', 'manage_journal',
  'view_audit_log',
]
```

## 2. Protecție pagini

Toate paginile admin sunt protejate cu verificări RBAC:

### `/producers`
- **Vizualizare**: `view_producers`
- **Acțiuni moderare**: `edit_producers`

### `/users`
- **Vizualizare**: `view_users`
- **Acțiuni suspendare/reactivare**: `manage_users`

### `/orders`
- **Vizualizare**: `view_orders`
- **Refund**: `refund_orders`
- **Cancel**: `cancel_orders`

### `/system/status`
- **Vizualizare**: `view_system_status`

### `/system/jurnal`
- **Vizualizare**: `view_journal`
- **Management**: `manage_journal`

### `/system/abonamente-promovare`
- **Vizualizare**: `view_subscriptions` sau `manage_subscriptions`

### `/system/audit-log`
- **Vizualizare**: `view_audit_log`

## 3. Audit Log

### Acțiuni auditate

Următoarele acțiuni sunt automat loggate în audit log:

#### Producători
- `PRODUCER_APPROVED`: Producător aprobat
- `PRODUCER_REJECTED`: Producător respins (necesită reason)

#### Utilizatori
- `USER_SUSPENDED`: Utilizator suspendat (necesită reason)
- `USER_REACTIVATED`: Utilizator reactivat

#### Comenzi
- `ORDER_REFUNDED`: Comandă marcată ca refundată (necesită reason)
- `ORDER_CANCELED`: Comandă anulată (necesită reason)

#### Jurnal
- `JOURNAL_ARTICLE_SENT_TO_REVIEW`: Articol trimis în review
- `JOURNAL_ARTICLE_APPROVED`: Articol aprobat
- `JOURNAL_ARTICLE_PUBLISHED`: Articol publicat
- `JOURNAL_ARTICLE_REJECTED`: Articol respins (necesită reason)

### Structură audit log entry

```typescript
interface AuditLogEntry {
  id: string
  action: string // Tip acțiune (ex: 'PRODUCER_APPROVED')
  targetType: 'producer' | 'user' | 'order' | 'journal_article' | ...
  targetId: string // ID entitate țintă
  reason?: string // Motiv (obligatoriu pentru acțiuni critice)
  metadata?: Record<string, unknown> // Date suplimentare
  performedBy: {
    id: string
    email: string
    fullName: string
  }
  performedAt: string // ISO timestamp
}
```

### Safety Net - Reason obligatoriu

Pentru acțiuni critice, sistemul necesită un **motiv (reason)** obligatoriu:

- **Respingere producător**: Reason obligatoriu
- **Suspendare utilizator**: Reason obligatoriu
- **Refund comandă**: Reason obligatoriu
- **Anulare comandă**: Reason obligatoriu
- **Respingere articol jurnal**: Reason obligatoriu

Reason-ul este:
1. Solicitat în UI prin `ConfirmDialog` cu `requireReason={true}`
2. Trimis către backend în request body
3. Inclus în audit log entry

## 4. Implementare tehnică

### Helper functions

#### `hasPermission(admin, permission)`
Verifică dacă un admin are o permisiune specifică.

```typescript
import { hasPermission } from '@/lib/permissions'

const canEdit = hasPermission(admin, 'edit_producers')
```

#### `hasAnyPermission(admin, permissions[])`
Verifică dacă un admin are cel puțin una din permisiunile specificate.

```typescript
import { hasAnyPermission } from '@/lib/permissions'

const canView = hasAnyPermission(admin, ['view_subscriptions', 'manage_subscriptions'])
```

#### `logAdminAction(event, admin)`
Loghează o acțiune admin în audit log.

```typescript
import { logAdminAction } from '@/lib/utils/admin-audit'

await logAdminAction({
  action: 'PRODUCER_APPROVED',
  targetType: 'producer',
  targetId: producerId,
  reason: 'Producător verificat și aprobat',
  metadata: {
    producerName: 'Ferma Popescu',
    previousStatus: 'PENDING_VERIFICATION',
    newStatus: 'APPROVED',
  },
}, admin)
```

### Componente UI

#### `AccessDenied`
Afișează un mesaj când utilizatorul nu are acces la o pagină.

```tsx
import { AccessDenied } from '@/components/auth/AccessDenied'

if (!canView) {
  return <AccessDenied requiredPermission="view_producers" />
}
```

#### `ConfirmDialog` (extins)
Dialog de confirmare cu suport pentru reason/textarea.

```tsx
<ConfirmDialog
  open={open}
  onClose={handleClose}
  onConfirm={(reason) => handleConfirm(reason)}
  title="Respinge producător"
  message="Ești sigur?"
  requireReason={true}
  reasonLabel="Motiv respingere"
  reasonPlaceholder="Introduceți motivul..."
/>
```

## 5. Integrare backend

### Endpoint-uri necesare

#### POST /admin/audit-log
Loghează o acțiune admin.

**Request:**
```json
{
  "action": "PRODUCER_APPROVED",
  "targetType": "producer",
  "targetId": "uuid",
  "reason": "Producător verificat",
  "metadata": {},
  "performedBy": {
    "id": "uuid",
    "email": "admin@farme.ro",
    "fullName": "Admin Name"
  }
}
```

#### GET /admin/audit-log
Returnează înregistrări de audit log cu filtre.

**Query params:**
- `performedBy`: ID admin
- `action`: Tip acțiune
- `targetType`: Tip țintă
- `startDate`, `endDate`: Interval dată
- `page`, `limit`: Paginare

**Response:**
```json
{
  "entries": [AuditLogEntry[]],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Status implementare backend

Vezi `docs/ADMIN_BACKEND_GAPS.md` pentru status detaliat al endpoint-urilor.

**Notă**: Frontend-ul funcționează cu fallback (console.warn) dacă endpoint-urile nu sunt disponibile încă.

## 6. Extindere RBAC

Pentru a adăuga noi permisiuni:

1. Adaugă permisiunea în `AdminPermission` type din `admin/src/lib/permissions.ts`
2. Adaugă permisiunea în maparea `ROLE_PERMISSIONS` pentru rolurile relevante
3. Folosește `hasPermission()` în componentele/paginile relevante

Exemplu:

```typescript
// 1. Adaugă permisiunea
export type AdminPermission =
  | 'view_producers'
  | 'edit_producers'
  | 'new_permission' // Nou

// 2. Adaugă în mapare
const ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  admin: [
    'view_producers',
    'edit_producers',
    'new_permission', // Nou
    // ...
  ],
  // ...
}

// 3. Folosește în componentă
const canDoNewThing = hasPermission(admin, 'new_permission')
```

## 7. Best Practices

1. **Verifică permisiunile la nivel de pagină**: Folosește `AccessDenied` pentru pagini întregi
2. **Verifică permisiunile pentru acțiuni**: Ascunde/disable butoane dacă user-ul nu are permisiune
3. **Loghează toate acțiunile critice**: Folosește `logAdminAction()` pentru acțiuni importante
4. **Solicită reason pentru acțiuni ireversibile**: Folosește `requireReason={true}` în `ConfirmDialog`
5. **Documentează endpoint-urile lipsă**: Actualizează `ADMIN_BACKEND_GAPS.md` când adaugi funcționalități noi

## 8. Testare

Pentru a testa sistemul RBAC:

1. **Testează fiecare rol**: Verifică că fiecare rol vede doar paginile/butoanele permise
2. **Testează audit log**: Verifică că acțiunile critice sunt loggate corect
3. **Testează reason requirement**: Verifică că acțiunile critice necesită reason
4. **Testează fallback**: Verifică comportamentul când backend endpoint-urile lipsesc

## 9. Securitate

- **Backend trebuie să valideze permisiunile**: Frontend-ul este doar pentru UX, validarea reală trebuie făcută în backend
- **Audit log nu trebuie șters**: Log-urile trebuie să fie immutable
- **Reason obligatoriu**: Acțiunile critice trebuie să aibă reason pentru accountability
- **Rate limiting**: Backend-ul trebuie să implementeze rate limiting pentru endpoint-urile de audit log

## 10. Rezumat

### Roluri implementate
- ✅ superadmin
- ✅ admin
- ✅ support
- ✅ finance
- ✅ content

### Permisiuni implementate
- ✅ 16 permisiuni definite și mapate la roluri
- ✅ Helper functions pentru verificare permisiuni
- ✅ Protecție pagini cu RBAC
- ✅ Protecție acțiuni cu RBAC

### Acțiuni auditate
- ✅ PRODUCER_APPROVED
- ✅ PRODUCER_REJECTED
- ✅ USER_SUSPENDED
- ✅ USER_REACTIVATED
- ✅ ORDER_REFUNDED
- ✅ ORDER_CANCELED
- ✅ JOURNAL_ARTICLE_SENT_TO_REVIEW
- ✅ JOURNAL_ARTICLE_APPROVED
- ✅ JOURNAL_ARTICLE_PUBLISHED
- ✅ JOURNAL_ARTICLE_REJECTED

### Endpoints backend necesare
- ❌ POST /admin/audit-log (documentat în ADMIN_BACKEND_GAPS.md)
- ❌ GET /admin/audit-log (documentat în ADMIN_BACKEND_GAPS.md)

### Pagini protejate
- ✅ `/producers` - view_producers, edit_producers
- ✅ `/users` - view_users, manage_users
- ✅ `/orders` - view_orders, refund_orders, cancel_orders
- ✅ `/system/status` - view_system_status
- ✅ `/system/jurnal` - view_journal, manage_journal
- ✅ `/system/abonamente-promovare` - view_subscriptions
- ✅ `/system/audit-log` - view_audit_log

