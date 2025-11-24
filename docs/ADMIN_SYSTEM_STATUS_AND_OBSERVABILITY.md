# Admin System Status & Observability - Documentație

## Prezentare generală

Pagina `/system/status` oferă un "mini observability hub" pentru monitorizarea sănătății sistemului, erorilor și testarea pipeline-ului de monitorizare.

## Structură pagină

### 1. Status General

Afișează statusul general al sistemului din endpoint-ul principal `/health`:

- **Status**: healthy / unhealthy / degraded
- **Versiune**: Versiunea aplicației (dacă disponibilă)
- **Uptime**: Timpul de funcționare al serverului
- **Bază de date**: Status conexiune (connected / disconnected)

**Endpoint:** `GET /health`

**Fallback:** Dacă endpoint-ul nu există, se afișează un mesaj clar cu link către documentație.

### 2. Service Health Grid

Grid cu carduri pentru fiecare serviciu verificat:

#### Servicii verificate

1. **Backend Core API**
   - Endpoint: `GET /health`
   - Status: up / degraded / down
   - Response time: milisecunde

2. **Payments** (opțional)
   - Endpoint: `GET /health/payments`
   - Status: up / down
   - Response time: milisecunde
   - **Notă:** Dacă endpoint-ul nu există, serviciul nu este afișat

3. **Journal Module** (opțional)
   - Endpoint: `GET /health/journal`
   - Status: up / down
   - Response time: milisecunde
   - **Notă:** Dacă endpoint-ul nu există, serviciul nu este afișat

4. **Email / Notifications** (opțional)
   - Endpoint: `GET /health/notifications`
   - Status: up / down
   - Response time: milisecunde
   - **Notă:** Dacă endpoint-ul nu există, serviciul nu este afișat

5. **Database** (dacă disponibil în main health)
   - Informații din `GET /health` response
   - Status: connected / disconnected

**Implementare:**
- `getSystemHealth()` verifică fiecare endpoint în paralel
- Măsoară response time pentru fiecare
- Serviciile cu endpoint-uri inexistente nu sunt afișate (nu generează erori)

**Fallback:** Dacă niciun serviciu nu este disponibil, se afișează un mesaj informativ.

### 3. Error Stats

Afișează statistici despre erorile din ultimele 24h (dacă backend oferă endpoint-ul):

#### Informații afișate

1. **Total erori 24h**
   - Număr total de erori în ultimele 24 de ore

2. **Top Endpoints cu erori**
   - Listă cu cele mai problematice endpoint-uri
   - Method + endpoint
   - Număr de erori
   - Timestamp ultima eroare

3. **Ultimele erori**
   - Ultimele 5 erori
   - Mesaj eroare
   - Endpoint și method
   - Status code
   - Timestamp

**Endpoint:** `GET /admin/system/errors-summary`

**Response așteptat:**
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

**Fallback:** Dacă endpoint-ul nu există, se afișează un mesaj:
> "Statistici de erori nu sunt încă expuse de backend. Consultă Sentry direct pentru detalii despre erori."

### 4. Test Monitoring

Secțiune pentru testarea pipeline-ului de monitorizare.

#### Funcționalitate

- **Buton "Trimite eveniment de test"**
- La click, trimite request la `POST /admin/system/test-error`
- Dacă endpoint-ul nu există:
  - În **development**: aruncă un error în console (capturat de Sentry/logger dacă configurat)
  - În **production**: afișează mesaj că endpoint-ul lipsește

**Endpoint:** `POST /admin/system/test-error`

**Response așteptat:**
```json
{
  "success": true,
  "eventId": "sentry-event-id",
  "message": "Test event sent successfully"
}
```

**Scop:** Verificare rapidă că pipeline-ul de monitorizare (Sentry, logger, etc.) funcționează corect.

### 5. Uptime Notes

Secțiune pentru link-uri către status page public și servicii de uptime monitoring.

**Status:** Placeholder pentru viitor
- Link text către status page public (când va fi disponibil)
- Informații despre servicii de uptime monitoring

## Endpoints Backend

### Health Checks

#### GET /health
**Status:** ❌ Neimplementat (documentat în ADMIN_BACKEND_GAPS.md)

**Response așteptat:**
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

#### GET /health/payments
**Status:** ❌ Neimplementat (opțional)

**Response așteptat:**
```json
{
  "status": "up" | "down",
  "service": "payments"
}
```

#### GET /health/journal
**Status:** ❌ Neimplementat (opțional)

**Response așteptat:**
```json
{
  "status": "up" | "down",
  "service": "journal"
}
```

#### GET /health/notifications
**Status:** ❌ Neimplementat (opțional)

**Response așteptat:**
```json
{
  "status": "up" | "down",
  "service": "notifications"
}
```

### Error Stats

#### GET /admin/system/errors-summary
**Status:** ❌ Neimplementat

**Auth:** Necesită permisiune `view_system_status`

**Response:** Vezi secțiunea "Error Stats" de mai sus.

### Test Event

#### POST /admin/system/test-error
**Status:** ❌ Neimplementat

**Auth:** Necesită permisiune `view_system_status`

**Request:** Niciun body necesar

**Response:**
```json
{
  "success": true,
  "eventId": "sentry-event-id (optional)",
  "message": "Test event sent successfully"
}
```

**Implementare sugerată:**
- Aruncă un error test capturat de Sentry/logger
- Returnează event ID dacă Sentry este configurat
- Loghează acțiunea în audit log

## Cum se folosește în Incident Management

### Verificare rapidă status

1. **Deschide `/system/status`**
2. **Verifică Service Health Grid:**
   - Toate serviciile ar trebui să fie "UP" (verde)
   - Dacă un serviciu este "DEGRADED" (galben) sau "DOWN" (roșu), investighează

3. **Verifică Error Stats:**
   - Dacă `totalErrors24h` este anormal de mare, investighează
   - Verifică "Top Endpoints cu erori" pentru a identifica probleme
   - Revizuiește "Ultimele erori" pentru detalii

### Testare monitoring

1. **Apasă "Trimite eveniment de test"**
2. **Verifică Sentry/monitoring:**
   - Evenimentul ar trebui să apară în Sentry în câteva secunde
   - Dacă nu apare, verifică configurația Sentry

### Debugging

1. **Verifică response time:**
   - Serviciile cu response time mare (>1000ms) pot indica probleme
   - Compară cu baseline-ul normal

2. **Verifică error patterns:**
   - Dacă un endpoint apare frecvent în "Top Endpoints cu erori", investighează
   - Verifică dacă erorile sunt legate de o funcționalitate specifică

## Auto-refresh

Pagina se actualizează automat la fiecare **30 de secunde** pentru a menține informațiile actualizate.

## RBAC

**Permisiune necesară:** `view_system_status`

**Roluri cu acces:**
- superadmin ✅
- admin ✅
- support ❌
- finance ❌
- content ❌

## Fallback Behavior

### Când endpoint-urile lipsesc

1. **GET /health:**
   - Se afișează mesaj clar că endpoint-ul nu este disponibil
   - Link către documentație

2. **GET /health/* (sub-services):**
   - Serviciile cu endpoint-uri inexistente nu sunt afișate
   - Nu generează erori, doar sunt omise

3. **GET /admin/system/errors-summary:**
   - Se afișează mesaj că statisticile nu sunt disponibile
   - Sugestie să se consulte Sentry direct

4. **POST /admin/system/test-error:**
   - În development: aruncă error în console
   - În production: afișează mesaj că endpoint-ul lipsește

## Best Practices

1. **Verifică periodic:** Folosește pagina pentru verificări zilnice de status
2. **Testează monitoring:** Trimite test event după configurarea Sentry
3. **Monitorizează trends:** Urmărește evoluția erorilor în timp
4. **Investighează degradări:** Serviciile "degraded" pot indica probleme iminente

## Rezumat

### Health info afișat

**Status General:**
- Status overall (healthy/unhealthy/degraded)
- Versiune
- Uptime
- Database status

**Service Health:**
- Backend Core API (obligatoriu)
- Payments (opțional)
- Journal Module (opțional)
- Email / Notifications (opțional)
- Database (dacă disponibil în main health)

**Error Stats:**
- Total erori 24h
- Top endpoints cu erori
- Ultimele 5 erori

### Fallback complet

✅ **Da** - Sistemul are fallback complet:

1. **Health checks:**
   - Dacă `/health` lipsește → mesaj clar
   - Dacă sub-health endpoints lipsesc → serviciile nu sunt afișate (nu generează erori)

2. **Error stats:**
   - Dacă endpoint lipsește → mesaj cu sugestie să se consulte Sentry direct

3. **Test event:**
   - Dacă endpoint lipsește → în dev aruncă error în console, în prod afișează mesaj

4. **Auto-refresh:**
   - Funcționează indiferent de disponibilitatea endpoint-urilor

### Endpoint-uri backend

**Necesare:**
- ❌ `GET /health` - Status general
- ❌ `GET /admin/system/errors-summary` - Error stats
- ❌ `POST /admin/system/test-error` - Test event

**Opționale (nice-to-have):**
- ❌ `GET /health/payments` - Payments health
- ❌ `GET /health/journal` - Journal health
- ❌ `GET /health/notifications` - Notifications health

**Status:** Toate endpoint-urile sunt documentate în `ADMIN_BACKEND_GAPS.md` și UI-ul funcționează complet cu fallback-uri graceful.

