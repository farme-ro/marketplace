# Troubleshooting Backend Connection

## Problema: Backend API și Database arată ERROR pe `/status`

Dacă pagina `/status` arată:
- ✅ **API URL:** `https://api.farme.ro` (corect setat)
- ❌ **Backend API:** ERROR
- ❌ **Database (Neon):** ERROR

Aceasta înseamnă că frontend-ul este configurat corect, dar nu poate comunica cu backend-ul.

## Diagnosticare Pas cu Pas

### 1. Verifică că Backend-ul Rulează

**Test rapid:**
```bash
curl https://api.farme.ro/health
# SAU
curl https://api.farme.ro/health/db
```

**Rezultate așteptate:**
- ✅ **200 OK** cu JSON: `{ "status": "ok", "database": "connected" }`
- ❌ **404 Not Found** → Endpoint-ul nu există
- ❌ **500 Internal Server Error** → Backend-ul are o problemă
- ❌ **Connection refused / Timeout** → Backend-ul nu rulează sau nu este accesibil

### 2. Verifică Endpoint-ul de Health

Frontend-ul apelează: `GET https://api.farme.ro/health/db`

**Backend-ul trebuie să aibă un endpoint care:**
- Acceptă `GET` requests
- Returnează JSON cu formatul:
  ```json
  {
    "status": "ok" | "error",
    "database": "connected" | "disconnected",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "error": "optional error message"
  }
  ```

**Exemplu de implementare (Express/Node.js):**
```javascript
// Backend: routes/health.js sau similar
app.get('/health/db', async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`
    
    res.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      timestamp: new Date().toISOString(),
      error: error.message
    })
  }
})
```

### 3. Verifică CORS

Backend-ul trebuie să permită request-uri de la `https://farme.ro`.

**Verificare:**
```bash
curl -H "Origin: https://farme.ro" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     https://api.farme.ro/health/db
```

**Răspuns așteptat:**
```
Access-Control-Allow-Origin: https://farme.ro
Access-Control-Allow-Methods: GET, POST, OPTIONS
```

**Dacă CORS eșuează:**
- Backend-ul trebuie să permită `https://farme.ro` în CORS config
- Verifică că header-ul `Access-Control-Allow-Origin` include frontend-ul

**Exemplu de configurare CORS (Express):**
```javascript
const cors = require('cors')

app.use(cors({
  origin: [
    'https://farme.ro',
    'https://www.farme.ro',
    'http://localhost:3000' // pentru development
  ],
  credentials: true
}))
```

### 4. Verifică Conectarea la Baza de Date

**Backend-ul trebuie să aibă:**
- `DATABASE_URL` setat corect în variabilele de mediu
- Format: `postgresql://user:password@host/database?sslmode=require`
- Parola trebuie să fie URL-encoded dacă are caractere speciale

**Test rapid pe backend:**
```javascript
// Test direct în backend
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testDB() {
  try {
    await prisma.$connect()
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Database connected')
  } catch (error) {
    console.error('❌ Database error:', error)
  } finally {
    await prisma.$disconnect()
  }
}
```

### 5. Verifică Log-urile Backend-ului

**Urmărește log-urile backend-ului când frontend-ul face request:**
- Dacă vezi request-ul în logs → Backend-ul primește request-ul
- Dacă nu vezi nimic → Problema de rețea/firewall/CORS
- Dacă vezi erori → Verifică eroarea specifică

### 6. Verifică Network Tab în Browser

**În DevTools → Network:**
1. Reîncarcă pagina `/status`
2. Caută request-ul către `https://api.farme.ro/health/db`
3. Verifică:
   - **Status Code:** 200 (OK) sau 404/500 (eroare)
   - **Response:** JSON-ul returnat
   - **Headers:** Dacă există erori CORS

**Erori comune:**
- **CORS error:** `Access-Control-Allow-Origin` lipsește
- **404:** Endpoint-ul nu există pe backend
- **500:** Eroare în backend (verifică log-urile)
- **Timeout:** Backend-ul nu răspunde în timp util

## Soluții Rapide

### Soluția 1: Endpoint-ul nu există

**Dacă backend-ul nu are `/health/db`:**

1. Adaugă endpoint-ul în backend:
   ```javascript
   app.get('/health/db', async (req, res) => {
     // Implementare de mai sus
   })
   ```

2. SAU modifică frontend-ul să folosească un alt endpoint:
   ```typescript
   // src/lib/api/health.ts
   export async function checkBackendHealth(): Promise<HealthStatus> {
     const response = await get<HealthStatus>('/health') // în loc de '/health/db'
     // ...
   }
   ```

### Soluția 2: CORS nu este configurat

**Adaugă CORS în backend:**
```javascript
const cors = require('cors')
app.use(cors({
  origin: 'https://farme.ro',
  credentials: true
}))
```

### Soluția 3: Database Connection String este greșit

**Verifică `DATABASE_URL` în backend:**
- Format corect: `postgresql://user:pass@host/db?sslmode=require`
- Parola URL-encoded dacă are caractere speciale
- Host-ul este accesibil de pe serverul backend

## Verificare Finală

După ce ai rezolvat problemele:

1. **Testează endpoint-ul direct:**
   ```bash
   curl https://api.farme.ro/health/db
   ```

2. **Verifică în browser:**
   - Accesează `https://farme.ro/status`
   - Ar trebui să vezi:
     - ✅ Backend API: OK
     - ✅ Database (Neon): OK

3. **Verifică Network Tab:**
   - Request-ul către `/health/db` ar trebui să returneze 200 OK
   - Response-ul ar trebui să conțină JSON cu `status: "ok"`

## Contact pentru Suport

Dacă problema persistă:
1. Verifică log-urile backend-ului
2. Verifică Network Tab în browser pentru erori specifice
3. Testează endpoint-ul direct cu `curl`
4. Verifică că toate variabilele de mediu sunt setate corect pe backend

