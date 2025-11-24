# Farmero Environment Configuration Handbook

**Data:** 2025-01-27  
**Scop:** Standardizare configurație API URL, CORS, cookies pentru frontend, admin și backend

## 📋 Rezumat

Acest document descrie configurația necesară pentru a lega corect cele 3 aplicații:
- **Frontend** (https://farme.ro) - aplicația publică Next.js
- **Admin** (https://admin.farme.ro) - aplicația de administrare Next.js
- **Backend** (https://api.farme.ro) - API-ul Node/Express + Prisma

## 🌐 URL-uri de Producție

- **Frontend:** https://farme.ro
- **Admin:** https://admin.farme.ro
- **Backend API:** https://api.farme.ro

## 💻 URL-uri de Development Local

- **Frontend:** http://localhost:3000
- **Admin:** http://localhost:3002
- **Backend:** http://localhost:3001

---

## 🔧 BACKEND Configuration

### Variabile de Mediu Necesare

Creează `backend/.env` cu următoarele variabile:

```env
# Environment
NODE_ENV=development

# Server
PORT=3001
HOST=0.0.0.0

# Database (OBLIGATORIU)
DATABASE_URL=postgres://user:password@host:5432/farmero

# JWT / Authentication (OBLIGATORIU)
# Generează un secret sigur pentru producție (min 32 caractere)
# Comandă: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=change_me_in_prod_min_32_chars

# CORS / Origins (opțional)
# Origin-uri suplimentare pentru CORS (separate prin virgulă)
CORS_EXTRA_ORIGINS=

# Push Notifications (opțional)
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=

# Error Tracking (opțional)
SENTRY_DSN=
```

### CORS Configuration

CORS este configurat în `backend/src/config/cors.ts` și permite următoarele origin-uri:

**Producție:**
- `https://farme.ro`
- `https://www.farme.ro`
- `https://brand.farme.ro`
- `https://admin.farme.ro`
- `https://producers.farme.ro`

**Development:**
- `http://localhost:3000` (frontend)
- `http://localhost:3001` (backend)
- `http://localhost:3002` (admin)

**Pattern suportat:**
- `*.vercel.app` (pentru preview deployments)

### Cookie Configuration

Cookie-urile de autentificare sunt configurate în `backend/src/modules/auth/auth.routes.ts`:

**Producție:**
- `domain: '.farme.ro'` - permite partajarea cookie-urilor între `farme.ro` și `admin.farme.ro`
- `secure: true` - doar HTTPS
- `httpOnly: true` - protecție XSS
- `sameSite: 'lax'` - protecție CSRF

**Development:**
- `domain: undefined` - localhost
- `secure: false` - permite HTTP
- `httpOnly: true`
- `sameSite: 'lax'`

### Health Check Endpoint

Backend-ul expune următoarele endpoint-uri de health check:
- `GET /health` - health check simplu
- `HEAD /health` - pentru Railway/Render
- `GET /health/detailed` - health check detaliat (DB, memory, status)

---

## 🎨 FRONTEND Configuration

### Variabile de Mediu Necesare

Creează `frontend/.env.local` cu următoarele variabile:

```env
# API Configuration (OBLIGATORIU)
# Local: http://localhost:3001
# Production: https://api.farme.ro
NEXT_PUBLIC_API_URL=http://localhost:3001

# App Environment
NEXT_PUBLIC_APP_ENV=local

# Public URLs (pentru SEO, link-uri, etc.)
NEXT_PUBLIC_SITE_URL=https://farme.ro
NEXT_PUBLIC_ADMIN_URL=https://admin.farme.ro
```

### API Client

Frontend-ul folosește `NEXT_PUBLIC_API_URL` pentru toate request-urile către backend.

**Fișier:** `frontend/src/lib/api/client.ts`

**Fallback:**
- Development: `http://localhost:3001`
- Production: `https://api.farme.ro`

### Health Check

Frontend-ul are implementată funcția `checkBackendHealth()` în `frontend/src/lib/api/health.ts` care verifică conectivitatea la backend.

**Pagini de status:**
- `/status` - pagină publică de status
- `/internal/status` - pagină internă de diagnostic

---

## 👨‍💼 ADMIN Configuration

### Variabile de Mediu Necesare

Creează `admin/.env.local` cu următoarele variabile:

```env
# API Configuration (OBLIGATORIU)
# Local: http://localhost:3001
# Production: https://api.farme.ro
NEXT_PUBLIC_API_URL=http://localhost:3001

# App Environment
NEXT_PUBLIC_APP_ENV=local

# Frontend URL (pentru link-uri către pagini publice)
NEXT_PUBLIC_FRONTEND_URL=https://farme.ro

# Admin URL (pentru referință)
NEXT_PUBLIC_ADMIN_URL=https://admin.farme.ro
```

### API Client

Admin-ul folosește `NEXT_PUBLIC_API_URL` pentru toate request-urile către backend.

**Fișier:** `admin/src/lib/api/client.ts`

**Fallback:**
- Development: `http://localhost:3001`
- Production: `https://api.farme.ro`

### Link-uri către Frontend

Admin-ul folosește `NEXT_PUBLIC_FRONTEND_URL` pentru link-uri către pagini publice.

**Rute românești folosite:**
- `/producatori/{slug}` - pagină producător
- `/produse/{slug}` - pagină produs
- `/jurnal-de-farmero/{slug}` - articol jurnal

**Fișiere actualizate:**
- `admin/src/app/(admin)/marketing/campaigns/page.tsx`
- `admin/src/app/(admin)/jurnal/page.tsx`
- `admin/src/app/(admin)/jurnal/[id]/page.tsx`
- `admin/src/lib/api/system.ts`

---

## 🚀 Vercel Production Configuration

### Frontend (farme.ro)

În Vercel Dashboard → Settings → Environment Variables, setează:

```
NEXT_PUBLIC_API_URL=https://api.farme.ro
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_SITE_URL=https://farme.ro
NEXT_PUBLIC_ADMIN_URL=https://admin.farme.ro
```

### Admin (admin.farme.ro)

În Vercel Dashboard → Settings → Environment Variables, setează:

```
NEXT_PUBLIC_API_URL=https://api.farme.ro
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_FRONTEND_URL=https://farme.ro
NEXT_PUBLIC_ADMIN_URL=https://admin.farme.ro
```

---

## 🖥️ Backend Server Configuration

### Variabile de Mediu Necesare

Pe serverul backend (Railway, Render, VPS, etc.), setează:

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgres://user:password@host:5432/farmero
JWT_SECRET=<secret_generat_sigur_min_32_caractere>
```

**Opțional:**
```env
CORS_EXTRA_ORIGINS=https://staging.farme.ro
SENTRY_DSN=<sentry_dsn>
VAPID_PUBLIC_KEY=<vapid_public_key>
VAPID_PRIVATE_KEY=<vapid_private_key>
```

### Generare JWT_SECRET

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Verificare CORS

După deploy, verifică că CORS permite origin-urile corecte:

```bash
curl -H "Origin: https://farme.ro" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://api.farme.ro/health
```

Ar trebui să primești `Access-Control-Allow-Origin: https://farme.ro` în response.

---

## ✅ Checklist Pre-Deploy

### Backend
- [ ] `DATABASE_URL` setat și funcțional
- [ ] `JWT_SECRET` generat și setat (min 32 caractere)
- [ ] `NODE_ENV=production` setat
- [ ] CORS permite `https://farme.ro` și `https://admin.farme.ro`
- [ ] Cookie domain setat la `.farme.ro` în producție
- [ ] Health check endpoint `/health` funcțional
- [ ] Migrații Prisma aplicate: `npx prisma migrate deploy`

### Frontend
- [ ] `NEXT_PUBLIC_API_URL=https://api.farme.ro` setat în Vercel
- [ ] `NEXT_PUBLIC_SITE_URL=https://farme.ro` setat
- [ ] Build reușit: `npm run build`
- [ ] Lint reușit: `npm run lint`

### Admin
- [ ] `NEXT_PUBLIC_API_URL=https://api.farme.ro` setat în Vercel
- [ ] `NEXT_PUBLIC_FRONTEND_URL=https://farme.ro` setat
- [ ] Build reușit: `npm run build`
- [ ] Lint reușit: `npm run lint`

---

## 🔍 Troubleshooting

### Eroare CORS

**Symptom:** `Access to fetch at 'https://api.farme.ro/...' from origin 'https://farme.ro' has been blocked by CORS policy`

**Soluție:**
1. Verifică că origin-ul este în lista de CORS din `backend/src/config/cors.ts`
2. Verifică că `credentials: true` este setat în request-uri
3. Verifică că backend-ul permite origin-ul în response headers

### Cookie nu se setează

**Symptom:** Cookie-ul de autentificare nu apare în browser

**Soluție:**
1. Verifică că `domain: '.farme.ro'` este setat în producție
2. Verifică că `secure: true` este setat în producție (HTTPS obligatoriu)
3. Verifică că `httpOnly: true` este setat
4. Verifică că `sameSite: 'lax'` este setat

### API URL greșit

**Symptom:** Request-urile merg către URL greșit

**Soluție:**
1. Verifică `NEXT_PUBLIC_API_URL` în Vercel Environment Variables
2. Verifică că variabila este setată pentru toate environment-urile (Production, Preview, Development)
3. Rebuild aplicația după schimbarea env vars

### Health check eșuează

**Symptom:** `/status` sau `/internal/status` arată backend offline

**Soluție:**
1. Verifică că backend-ul rulează și este accesibil
2. Verifică că endpoint-ul `/health` există și răspunde
3. Verifică CORS pentru origin-ul frontend-ului
4. Verifică în browser console (F12) pentru detalii despre eroarea de rețea

---

## 📝 Modificări Făcute

### Backend
- ✅ Actualizat CORS pentru a include `localhost:3001`
- ✅ Configurat cookie domain `.farme.ro` pentru producție
- ✅ Documentat variabile de mediu necesare

### Frontend
- ✅ Standardizat `NEXT_PUBLIC_API_URL` (eliminat `NEXT_PUBLIC_API_BASE_URL`)
- ✅ Actualizat fallback pentru development: `http://localhost:3001`
- ✅ Health check deja implementat în `frontend/src/lib/api/health.ts`

### Admin
- ✅ Standardizat `NEXT_PUBLIC_API_URL`
- ✅ Actualizat fallback pentru development: `http://localhost:3001`
- ✅ Adăugat `NEXT_PUBLIC_FRONTEND_URL` pentru link-uri
- ✅ Corectat link-uri hardcodate către frontend (folosesc `NEXT_PUBLIC_FRONTEND_URL`)
- ✅ Actualizat rute românești (`/producatori/`, `/jurnal-de-farmero/`)

---

## 📚 Referințe

- **Backend CORS:** `backend/src/config/cors.ts`
- **Backend Auth Cookies:** `backend/src/modules/auth/auth.routes.ts`
- **Frontend API Client:** `frontend/src/lib/api/client.ts`
- **Frontend Health Check:** `frontend/src/lib/api/health.ts`
- **Admin API Client:** `admin/src/lib/api/client.ts`

---

**Notă:** Acest document trebuie actualizat când se adaugă noi variabile de mediu sau se modifică configurația de deploy.

