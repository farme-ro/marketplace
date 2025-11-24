# 🔗 Ghid: Conectarea Frontend-ului la Backend

## 📋 Prezentare Generală

Frontend-ul (`farme.ro`) este deja configurat să se conecteze la backend (`api.farme.ro`) prin variabila de mediu `NEXT_PUBLIC_API_URL`.

**Arhitectură:**
```
Frontend (Next.js) → NEXT_PUBLIC_API_URL → Backend API → Database
```

## ✅ Ce este deja implementat

Frontend-ul folosește `src/lib/api/apiClient.ts` care:
- ✅ Citește `NEXT_PUBLIC_API_URL` din variabilele de mediu
- ✅ Face request-uri HTTP către backend
- ✅ Gestionează autentificarea prin cookies
- ✅ Are error handling complet
- ✅ Suportă timeout și retry logic

## 🚀 Pași pentru Conectare

### 1. Development (Local)

#### Pasul 1: Creează fișierul `.env.local`

În root-ul proiectului frontend, creează fișierul `.env.local`:

```env
# Backend API URL (pentru development)
# Dacă backend-ul rulează local pe port 3001:
NEXT_PUBLIC_API_URL=http://localhost:3001

# SAU dacă backend-ul este deja deploy-uit:
# NEXT_PUBLIC_API_URL=https://api.farme.ro

# Frontend URL (pentru email-uri, redirect-uri, etc.)
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### Pasul 2: Verifică că backend-ul rulează

```bash
# În terminal-ul backend-ului
curl http://localhost:3001/health
# SAU
curl https://api.farme.ro/health
```

Ar trebui să primești un răspuns JSON cu status-ul backend-ului.

#### Pasul 3: Restart Next.js

După ce ai adăugat `.env.local`, restart Next.js:

```bash
# Oprește server-ul (Ctrl+C)
# Apoi pornește din nou:
npm run dev
```

#### Pasul 4: Verifică conectarea

1. Accesează `http://localhost:3000/status`
2. Verifică că:
   - **API URL** arată `http://localhost:3001` (sau URL-ul tău)
   - **Backend API** este **OK** (verde)
   - **Database** este **OK** (dacă backend-ul raportează)

### 2. Production (Vercel)

#### Pasul 1: Setează variabilele de mediu în Vercel

1. Intră în [Vercel Dashboard](https://vercel.com/dashboard)
2. Selectează proiectul `frontend` (sau numele proiectului tău)
3. Mergi la **Settings** → **Environment Variables**
4. Click pe **Add New**

#### Pasul 2: Adaugă variabilele obligatorii

**Variabilă 1: NEXT_PUBLIC_API_URL** (OBLIGATORIU)

```
Name: NEXT_PUBLIC_API_URL
Value: https://api.farme.ro
Environment: ✅ Production, ✅ Preview, ✅ Development (opțional)
```

**Variabilă 2: NEXT_PUBLIC_APP_URL** (Recomandat)

```
Name: NEXT_PUBLIC_APP_URL
Value: https://farme.ro
Environment: ✅ Production, ✅ Preview
```

**Variabilă 3: NEXT_PUBLIC_SITE_URL** (Recomandat)

```
Name: NEXT_PUBLIC_SITE_URL
Value: https://farme.ro
Environment: ✅ Production, ✅ Preview
```

**Variabilă 4: NEXT_PUBLIC_SOCKET_URL** (Opțional - dacă folosești WebSocket)

```
Name: NEXT_PUBLIC_SOCKET_URL
Value: wss://api.farme.ro
Environment: ✅ Production
```

#### Pasul 3: Redeploy aplicația

**IMPORTANT:** După ce adaugi variabilele, trebuie să faci redeploy:

1. Mergi la **Deployments**
2. Click pe **...** (three dots) pe ultimul deployment
3. Selectează **Redeploy**
4. Așteaptă ca deploy-ul să se finalizeze

#### Pasul 4: Verifică conectarea

1. Accesează `https://farme.ro/status`
2. Verifică că:
   - **API URL** arată `https://api.farme.ro` (nu `http://localhost:3001`)
   - **Backend API** este **OK** (verde)
   - **Database** este **OK** (dacă backend-ul raportează)

## 🔍 Verificare Configurare

### Verifică în cod

Frontend-ul folosește `src/lib/api/apiClient.ts`:

```typescript
// Citește variabila de mediu
const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL

// Dacă nu este setată, în development folosește localhost:3001
// În production, aruncă eroare
```

### Verifică în browser

1. Deschide Developer Tools (F12)
2. Mergi la tab-ul **Console**
3. Caută mesaje de tip:
   - ✅ `API URL: https://api.farme.ro` (corect)
   - ⚠️ `NEXT_PUBLIC_API_URL is not set. Using default: http://localhost:3001` (necesită configurare)
   - ❌ `NEXT_PUBLIC_API_URL is not configured` (eroare critică în production)

### Verifică Network Requests

1. Deschide Developer Tools (F12)
2. Mergi la tab-ul **Network**
3. Filtrează după "api.farme.ro" sau "localhost:3001"
4. Verifică că request-urile merg către URL-ul corect

## 🛠️ Troubleshooting

### Problema 1: API URL arată "http://localhost:3001" în production

**Cauză:** Variabila `NEXT_PUBLIC_API_URL` nu este setată în Vercel.

**Soluție:**
1. Verifică că variabila este setată în Vercel (Settings → Environment Variables)
2. Verifică că ai făcut redeploy după ce ai adăugat variabila
3. Verifică că variabila este setată pentru environment-ul corect (Production)

### Problema 2: Backend API arată ERROR în `/status`

**Cauză:** Backend-ul nu răspunde sau nu este accesibil.

**Soluție:**
1. Verifică că backend-ul rulează la `https://api.farme.ro`
2. Testează manual: `curl https://api.farme.ro/health`
3. Verifică CORS-ul pe backend să permită request-uri de la `https://farme.ro`
4. Verifică firewall-ul și security groups

### Problema 3: CORS Errors în browser

**Eroare:** `Access to fetch at 'https://api.farme.ro/...' from origin 'https://farme.ro' has been blocked by CORS policy`

**Cauză:** Backend-ul nu permite request-uri de la frontend.

**Soluție (pe backend):**
```javascript
// Backend trebuie să permită origin-ul frontend-ului
app.use(cors({
  origin: [
    'https://farme.ro',
    'https://farme-ro-*.vercel.app', // Preview deployments
    'http://localhost:3000' // Development
  ],
  credentials: true // Pentru cookies
}))
```

### Problema 4: Request-urile nu trimit cookies

**Cauză:** Cookies nu sunt trimise automat în request-uri cross-origin.

**Soluție:**
- Frontend-ul este deja configurat să trimită cookies (`credentials: 'include'`)
- Backend-ul trebuie să permită credentials în CORS:
  ```javascript
  credentials: true
  ```

### Problema 5: 401 Unauthorized pentru request-uri autentificate

**Cauză:** Token-ul de autentificare nu este trimis sau este invalid.

**Soluție:**
1. Verifică că utilizatorul este logat
2. Verifică că cookies-urile sunt setate corect
3. Verifică că backend-ul validează token-ul corect

## 📝 Checklist Final

### Development
- [ ] Fișier `.env.local` creat cu `NEXT_PUBLIC_API_URL`
- [ ] Backend-ul rulează și răspunde la `/health`
- [ ] Next.js restart după adăugarea variabilelor
- [ ] `/status` arată API URL corect
- [ ] Request-urile funcționează în Network tab

### Production
- [ ] `NEXT_PUBLIC_API_URL` setată în Vercel
- [ ] `NEXT_PUBLIC_APP_URL` setată în Vercel
- [ ] Redeploy făcut după adăugarea variabilelor
- [ ] `/status` arată API URL corect (nu localhost)
- [ ] Backend API este OK în `/status`
- [ ] Request-urile funcționează în producție

## 🔗 Link-uri Utile

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [CORS Configuration](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Backend API Requirements](./BACKEND_API_REQUIREMENTS.md)
- [Architecture Overview](./ARCHITECTURE.md)

## 📞 Suport

Dacă întâmpini probleme:
1. Verifică `/status` pentru diagnosticare
2. Verifică console-ul browser-ului pentru erori
3. Verifică Network tab pentru request-uri eșuate
4. Verifică logs-urile backend-ului

