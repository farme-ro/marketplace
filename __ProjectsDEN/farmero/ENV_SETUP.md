# Environment Variables Setup

## Creare .env.local

Creează un fișier `.env.local` în root-ul proiectului cu următoarele variabile:

```bash
# API Configuration
# URL-ul backend-ului API (https://api.farme.ro)
# PRIORITATE: NEXT_PUBLIC_API_BASE_URL (folosit de apiFetch din client.ts)
NEXT_PUBLIC_API_BASE_URL=https://api.farme.ro

# Fallback pentru NEXT_PUBLIC_API_BASE_URL (opțional, pentru compatibilitate)
# Se folosește doar dacă NEXT_PUBLIC_API_BASE_URL nu este setată
# NEXT_PUBLIC_API_URL=https://api.farme.ro
```

## Variabile Disponibile

### NEXT_PUBLIC_API_BASE_URL (Prioritate - Recomandată)

**Descriere:** URL-ul backend-ului API public (https://api.farme.ro). Folosit de `apiFetch()` din `src/lib/api/client.ts` pentru toate request-urile API.

**Prioritate:** 1 (folosit primul)

**Valori:**
- Production: `https://api.farme.ro`
- Development: `https://api.farme.ro` (sau `http://localhost:3001` dacă rulezi backend local)

**Fallback:** Dacă nu este setată, se folosește `NEXT_PUBLIC_API_URL`. Dacă nici aceea nu este setată, se folosește `https://api.farme.ro`.

**Notă:** Această variabilă este expusă în browser (din cauza prefixului `NEXT_PUBLIC_`). Nu include valori sensibile.

**Implementare:** Vezi `src/lib/api/client.ts`:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'https://api.farme.ro'
```

### NEXT_PUBLIC_API_URL (Fallback - Opțională)

**Descriere:** Fallback pentru `NEXT_PUBLIC_API_BASE_URL`. Folosită doar dacă `NEXT_PUBLIC_API_BASE_URL` nu este setată.

**Prioritate:** 2 (folosit doar dacă NEXT_PUBLIC_API_BASE_URL lipsește)

**Valori:**
- Production: `https://api.farme.ro`
- Development: `https://api.farme.ro` (sau `http://localhost:3001` dacă rulezi backend local)

**Notă:** Pentru compatibilitate cu codul vechi. Recomandăm folosirea `NEXT_PUBLIC_API_BASE_URL` pentru cod nou.

### NODE_ENV (Automată)

**Descriere:** Environment-ul Node.js.

**Valori:** `development`, `production`, `test`

**Notă:** Setată automat de Next.js. Nu trebuie setată manual în `.env.local`.

## Setup Rapid

1. Copiază template-ul de mai sus într-un fișier `.env.local`
2. Editează `NEXT_PUBLIC_API_BASE_URL` cu URL-ul corect pentru environment-ul tău
3. Restart development server (`npm run dev`)

**Notă:** Prioritatea este: `NEXT_PUBLIC_API_BASE_URL` → `NEXT_PUBLIC_API_URL` → `https://api.farme.ro` (hardcoded fallback)

## Verificare

După setup, verifică că variabilele sunt încărcate corect:

1. Deschide `/status` în browser
2. Verifică că "API URL" afișează URL-ul corect
3. Verifică că status-ul backend-ului este OK

## Production Deployment

Pentru deployment pe Vercel sau alte platforme:

1. Setează `NEXT_PUBLIC_API_BASE_URL` în environment variables ale platformei (prioritate)
2. Opțional: Setează `NEXT_PUBLIC_API_URL` ca fallback (pentru compatibilitate)
3. Asigură-te că valoarea este `https://api.farme.ro` (nu localhost)
4. Redeploy aplicația

## Troubleshooting

### Backend nu răspunde

- Verifică că `NEXT_PUBLIC_API_BASE_URL` (sau `NEXT_PUBLIC_API_URL` ca fallback) este corect setată
- Verifică că backend-ul rulează și este accesibil
- Verifică CORS settings pe backend
- Verifică în console browser că `API_BASE_URL` este corect (în development se loghează automat)

### Variabilele nu se încarcă

- Asigură-te că fișierul se numește `.env.local` (nu `.env`)
- Restart development server după modificări
- Verifică că variabilele încep cu `NEXT_PUBLIC_` pentru client-side usage

