# Admin Feature Flags UI - Documentație

## Prezentare generală

Pagina `/system/config` oferă o interfață centralizată pentru vizualizarea și gestionarea feature flags-urilor din toate aplicațiile (frontend, backend, admin) și informații despre mediu.

## Acces

**RBAC Protection:**
- Doar rolurile `superadmin` și `admin` au acces la această pagină
- Alte roluri (support, finance, content) primesc mesaj: "Această secțiune este disponibilă doar pentru administratorii tehnici ai platformei."

## Structură pagină

### 1. Secțiunea "Mediu"

Afișează informații despre configurația mediului:

- **Environment**: dev / staging / prod / local (cu badge colorat)
- **Backend URL**: Link către API
- **Frontend URL**: Link către aplicația publică
- **Admin URL**: Link către admin panel
- **Versiune** (opțional): Versiunea aplicației
- **Build Time** (opțional): Timestamp build

**Sursă date:**
- Încearcă `GET /admin/system/info` (dacă există)
- Fallback: `process.env.NEXT_PUBLIC_APP_ENV`, `NEXT_PUBLIC_API_URL`, etc.

### 2. Secțiunea "Feature Flags"

Tabel complet cu toate feature flags-urile:

#### Coloane

1. **Nume**: Numele flag-ului (ex: `cart`, `journal`, `subscriptions`)
2. **Descriere**: Descriere scurtă a funcționalității
3. **Status**: 
   - `ON` (verde) - Active
   - `PARTIAL` (galben) - Parțial activ
   - `FALLBACK` (gri) - În fallback mode
   - `OFF` (roșu) - Dezactivat
4. **Scop**: 
   - `core commerce` (albastru) - Funcționalități esențiale
   - `experimental` (violet) - Funcționalități experimentale
   - `beta` (portocaliu) - Funcționalități beta
   - `internal` (gri) - Funcționalități interne
5. **Sursă**: `frontend` | `backend` | `admin`
6. **Locație**: Path către fișierul de configurare (ex: `frontend/src/lib/backend-sync/status.ts`)
7. **Acțiuni** (dacă backend suportă editare): Butoane ON/OFF pentru flag-uri editabile

#### Filtre

- **Search**: Căutare după nume sau descriere
- **Scop**: Filtrare după scop (core commerce, experimental, beta, internal)
- **Sursă**: Filtrare după sursă (frontend, backend, admin)

#### Read-only Mode

Dacă backend-ul nu oferă endpoint-uri pentru feature flags:
- Se afișează un badge "Read-only / Static"
- Toate flag-urile sunt marcate ca `editable: false`
- Butoanele de editare nu sunt afișate
- Se folosește un set static de flag-uri bazat pe `BackendSyncStatus` din frontend

## Feature Flags listate

### Core Commerce (Active)

- `cart` - Coș de cumpărături
- `checkout` - Proces de checkout
- `clientOrders` - Comenzi clienți
- `producerProducts` - Produse producători
- `producerOrders` - Comenzi producători
- `subscriptions` - Abonamente clienți și producători
- `promotions` - Campanii de promovare
- `documents` - Documente și contracte
- `logistics` - Portal logistic
- `b2b` - Portal B2B
- `favorites` - Produse favorite
- `notifications` - Sistem notificări

### Beta / Experimental

- `journal` - Jurnal de farme.ro (status: partial)

## Mapping cu Frontend

Majoritatea feature flags-urilor sunt controlate în:

**Fișier:** `frontend/src/lib/backend-sync/status.ts`

**Documentație:** `frontend/docs/FARMERO_BACKENDSYNC_ACTIVATION_PLAN.md`

### BackendSyncStatus

Frontend-ul folosește `BackendSyncStatus` pentru a controla ce funcționalități sunt conectate live la backend:

```typescript
export const BackendSyncStatus = {
  cart: true,
  checkout: true,
  clientOrders: true,
  producerProducts: true,
  producerOrders: true,
  journal: false, // ⚠️ Pending backend implementation
  // ... etc
}
```

### Status Mapping

- `BackendSyncStatus[flag] === true` → Status: `active` (ON)
- `BackendSyncStatus[flag] === false` → Status: `fallback` (FALLBACK)
- Dacă backend oferă status parțial → Status: `partial` (PARTIAL)

## Editare Feature Flags

### Când este posibilă editarea

Editarea este posibilă DOAR dacă:
1. Backend oferă endpoint `PATCH /admin/feature-flags/:name`
2. Flag-ul are `editable: true` în răspunsul backend
3. Pagina nu este în modul read-only

### Cum funcționează

1. Admin-ul apasă butonul ON sau OFF pentru un flag editabil
2. Se afișează un dialog de confirmare
3. La confirmare, se trimite `PATCH /admin/feature-flags/:name` cu `{ enabled: true/false }`
4. Backend actualizează flag-ul și returnează versiunea actualizată
5. Frontend reîncarcă lista de flag-uri

### Limitări

- Flag-urile din frontend (`source: 'frontend'`) sunt de obicei read-only
- Modificările trebuie făcute direct în cod (deploy necesar)
- Doar flag-urile din backend pot fi modificate runtime (dacă backend suportă)

## Integrare cu Backend

### Endpoint-uri necesare

#### GET /admin/feature-flags

**Request:** Niciun body

**Response:**
```json
[
  {
    "name": "journal",
    "status": "active",
    "description": "Jurnal de farme.ro",
    "source": "backend",
    "scope": "beta",
    "location": "backend/config/feature-flags.ts",
    "editable": true
  }
]
```

#### PATCH /admin/feature-flags/:name

**Request:**
```json
{
  "enabled": true
}
```

**Response:**
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

#### GET /admin/system/info

**Request:** Niciun body

**Response:**
```json
{
  "environment": "prod",
  "backendUrl": "https://api.farme.ro",
  "frontendUrl": "https://farme.ro",
  "adminUrl": "https://admin.farme.ro",
  "version": "1.0.0",
  "buildTime": "2025-01-27T10:00:00Z"
}
```

### Status implementare

Vezi `docs/ADMIN_BACKEND_GAPS.md` pentru status detaliat.

**Notă**: Frontend-ul funcționează complet cu fallback static dacă endpoint-urile nu sunt disponibile.

## Fallback Behavior

### Când backend endpoint-urile lipsesc

1. **Feature Flags:**
   - Se folosește un set static de flag-uri bazat pe `BackendSyncStatus`
   - Se marchează `readOnly: true`
   - Se afișează badge "Read-only / Static"
   - Butoanele de editare nu sunt afișate

2. **Environment Info:**
   - Se citesc din `process.env.NEXT_PUBLIC_*`
   - Se determină environment din `NEXT_PUBLIC_APP_ENV`
   - URLs se construiesc din variabile de mediu sau `window.location`

## Best Practices

1. **Verifică status-ul înainte de deploy**: Folosește pagina pentru a verifica ce flag-uri sunt active
2. **Documentează flag-urile noi**: Când adaugi un flag nou, actualizează:
   - `frontend/src/lib/backend-sync/status.ts`
   - `frontend/docs/FARMERO_BACKENDSYNC_ACTIVATION_PLAN.md`
   - Setul static din `admin/src/lib/api/system.ts` (dacă e cazul)
3. **Folosește scope-uri relevante**: Marchează flag-urile cu scope-ul corect pentru claritate
4. **Testează fallback-ul**: Verifică că pagina funcționează corect când backend endpoint-urile lipsesc

## Securitate

- **RBAC**: Doar superadmin și admin au acces
- **Backend validation**: Backend-ul trebuie să valideze permisiunile pentru editare
- **Audit log**: Modificările flag-urilor ar trebui să fie loggate în audit log (viitor)
- **Rate limiting**: Backend-ul trebuie să implementeze rate limiting pentru endpoint-urile de editare

## Rezumat

### Flag-uri listate în UI

**Total:** 13 feature flags

**Core Commerce (12):**
- cart, checkout, clientOrders, producerProducts, producerOrders
- subscriptions, promotions, documents, logistics, b2b
- favorites, notifications

**Beta (1):**
- journal (status: partial)

### Protecție RBAC

✅ **Implementată**: Doar `superadmin` și `admin` au acces

### Endpoint-uri backend

❌ **Neimplementate**: Toate endpoint-urile sunt documentate în `ADMIN_BACKEND_GAPS.md`

✅ **Fallback**: Frontend-ul funcționează complet cu date statice

### Status implementare

- ✅ UI complet funcțional
- ✅ RBAC protection
- ✅ Search și filtre
- ✅ Read-only mode cu fallback
- ✅ Link către documentație frontend
- ⏳ Editare flag-uri (așteaptă backend endpoint)

