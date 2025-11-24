# 🔧 CORS Troubleshooting - "Request blocked by browser security policy"

## Problema

Eroarea **"Network error: Request blocked by browser security policy"** apare când frontend-ul nu poate face request-uri către backend din cauza restricțiilor CORS sau mixed content.

## Cauze posibile

### 1. Frontend local → Backend producție (HTTPS)
**Sintom:** Frontend rulează pe `http://localhost:3000` și încearcă să acceseze `https://api.farme.ro`

**Soluție:** Folosește backend-ul local sau configurează CORS pentru localhost.

### 2. Backend local nu rulează
**Sintom:** Frontend încearcă să acceseze `http://localhost:4000` dar backend-ul nu este pornit.

**Soluție:** Pornește backend-ul local:
```bash
cd backend
npm run dev
```

### 3. NEXT_PUBLIC_API_URL nu este setat corect
**Sintom:** Frontend folosește URL greșit pentru API.

**Soluție:** Verifică `.env.local` în frontend:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Soluții

### Soluția 1: Folosește backend-ul local (Recomandat pentru development)

1. **Pornește backend-ul local:**
```bash
cd backend
npm run dev
```

2. **Configurează frontend-ul:**
Creează/actualizează `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. **Restart frontend-ul:**
```bash
cd frontend
npm run dev
```

### Soluția 2: Folosește backend-ul de producție

Dacă vrei să folosești `https://api.farme.ro`:

1. **Verifică că backend-ul de producție rulează:**
```bash
curl https://api.farme.ro/health
```

2. **Configurează frontend-ul:**
Creează/actualizează `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=https://api.farme.ro
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. **Verifică CORS în backend:**
Backend-ul permite deja `http://localhost:3000` în whitelist (vezi `backend/src/config/cors.ts`).

### Soluția 3: Adaugă origin suplimentar în CORS

Dacă folosești un alt port sau domain:

1. **Adaugă în backend `.env`:**
```env
CORS_EXTRA_ORIGINS=http://localhost:3002,https://my-custom-domain.com
```

2. **Restart backend-ul**

## Verificare rapidă

### 1. Verifică ce URL folosește frontend-ul:
Deschide browser console și caută:
```
[API Client] Using API_BASE_URL: ...
```

### 2. Verifică că backend-ul răspunde:
```bash
# Pentru backend local
curl http://localhost:4000/health

# Pentru backend producție
curl https://api.farme.ro/health
```

### 3. Verifică CORS în browser:
Deschide Network tab în DevTools și verifică:
- Request-ul are header `Origin: http://localhost:3000`
- Response-ul are header `Access-Control-Allow-Origin: http://localhost:3000`

## Debugging

### Verifică în browser console:
```javascript
// Verifică ce URL folosește frontend-ul
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL)

// Testează conexiunea
fetch('http://localhost:4000/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

### Verifică backend logs:
Backend-ul ar trebui să logheze request-urile CORS. Caută în logs:
```
CORS: Allowing origin http://localhost:3000
```

## Status CORS Whitelist

Backend-ul permite următoarele origin-uri:
- ✅ `http://localhost:3000` (Frontend local)
- ✅ `http://localhost:3001` (Admin local)
- ✅ `http://localhost:4000` (Backend local)
- ✅ `https://farme.ro` (Production)
- ✅ `https://www.farme.ro` (Production)
- ✅ `https://admin.farme.ro` (Production)
- ✅ `https://*.vercel.app` (Vercel preview deployments)

## Notă importantă

**Mixed Content:** Browser-ul blochează request-uri HTTP → HTTPS. Dacă frontend-ul rulează pe `http://localhost:3000` și încearcă să acceseze `https://api.farme.ro`, browser-ul va bloca request-ul.

**Soluție:** Folosește backend-ul local (`http://localhost:4000`) pentru development.

