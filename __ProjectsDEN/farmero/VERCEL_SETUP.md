# Vercel Setup pentru farme.ro

## Variabile de Mediu Necesare

Pentru ca frontend-ul să funcționeze corect în producție, trebuie să setezi următoarele variabile de mediu în Vercel:

### 1. NEXT_PUBLIC_API_URL (OBLIGATORIU)

**Nume:** `NEXT_PUBLIC_API_URL`  
**Valoare:** `https://api.farme.ro`  
**Environment:** Production (și Preview dacă vrei să testezi)

**Cum să o adaugi:**

1. Intră în proiectul frontend pe Vercel
2. Mergi la **Settings** → **Environment Variables**
3. Click pe **Add New**
4. Completează:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://api.farme.ro` (sau URL-ul real al backend-ului)
   - **Environment:** Bifează cel puțin **Production**
5. Click **Save**
6. **IMPORTANT:** Fă un redeploy pentru ca modificările să aibă efect:
   - Mergi la **Deployments**
   - Click pe **...** (three dots) pe ultimul deployment
   - Selectează **Redeploy**

### 2. NEXT_PUBLIC_SOCKET_URL (Opțional)

**Nume:** `NEXT_PUBLIC_SOCKET_URL`  
**Valoare:** `wss://api.farme.ro` (pentru WebSocket)  
**Environment:** Production

**Notă:** Dacă nu este setat, va folosi `NEXT_PUBLIC_API_URL` pentru WebSocket.

### 3. Alte Variabile (dacă sunt necesare)

Verifică dacă există alte variabile de mediu necesare în cod:
- `NEXT_PUBLIC_APP_URL` - URL-ul frontend-ului (ex: `https://farme.ro`)
- `NEXT_PUBLIC_SITE_URL` - Alias pentru `NEXT_PUBLIC_APP_URL`

## Verificare

După ce ai setat variabilele și ai făcut redeploy:

1. Accesează `https://farme.ro/status`
2. Verifică că:
   - **API URL** arată `https://api.farme.ro` (nu `http://localhost:3001`)
   - **Backend API** este **OK**
   - **Database** este **OK** (dacă backend-ul raportează statusul DB)

## Troubleshooting

### Problema: API URL arată "Not set (using default)" sau "http://localhost:3001"

**Soluție:**
1. Verifică că variabila `NEXT_PUBLIC_API_URL` este setată în Vercel
2. Verifică că ai făcut redeploy după ce ai adăugat variabila
3. Verifică că variabila este setată pentru environment-ul corect (Production)

### Problema: Backend API arată ERROR

**Soluție:**
1. Verifică că backend-ul rulează la `https://api.farme.ro`
2. Verifică că endpoint-ul `/health` (sau `/status`) funcționează pe backend
3. Verifică CORS-ul pe backend să permită request-uri de la `https://farme.ro`

### Problema: Database arată ERROR

**Soluție:**
1. Verifică că backend-ul are `DATABASE_URL` setat corect
2. Verifică că backend-ul poate conecta la baza de date
3. Verifică că endpoint-ul de health de pe backend raportează statusul DB corect

## Structură Variabile de Mediu

### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL=https://api.farme.ro
NEXT_PUBLIC_APP_URL=https://farme.ro
NEXT_PUBLIC_SOCKET_URL=wss://api.farme.ro (opțional)
```

### Backend (hosting backend)
```
DATABASE_URL=postgresql://user:pass@host/dbname?sslmode=require
NODE_ENV=production
PORT=3001 (sau portul folosit)
```

## Link-uri Utile

- [Vercel Environment Variables Documentation](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

