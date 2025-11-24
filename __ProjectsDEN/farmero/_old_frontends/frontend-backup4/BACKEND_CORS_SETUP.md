# Configurație CORS - Backend Farme.ro

Acest document descrie configurația CORS pentru backend-ul Farme.ro, care permite request-uri de la frontend-ul de pe Vercel.

## 📋 Overview

CORS (Cross-Origin Resource Sharing) este configurat pentru a permite:
- ✅ Frontend production: `https://farme.ro`
- ✅ Frontend staging/preview: `https://farme-ro-*.vercel.app` (toate deployment-urile Vercel)
- ✅ Frontend local development: `http://localhost:3000`

## 🔧 Configurație

### 1. Fișier de configurație

Configurația CORS este centralizată în `src/config/cors.ts`:

```typescript
import { corsConfig } from './config/cors';

app.use(cors(corsConfig));
app.options('*', cors(corsConfig));
```

### 2. Variabile de mediu

Adaugă în `.env`:

```env
CORS_ORIGIN=https://farme.ro,https://farme-ro-*.vercel.app
```

**Notă**: Pentru development local, `http://localhost:3000` este adăugat automat.

### 3. Pattern-uri suportate

Configurația suportă:
- **Exact match**: Origin-uri specificate exact în `CORS_ORIGIN`
- **Vercel preview**: Pattern `https://farme-ro-*.vercel.app` pentru toate deployment-urile Vercel
- **Localhost**: Automat permis pentru development

## 🚀 Utilizare

### Development

Pentru development local, configurația permite automat `http://localhost:3000`:

```env
CORS_ORIGIN=http://localhost:3000
```

### Production

Pentru producție, setează:

```env
CORS_ORIGIN=https://farme.ro,https://farme-ro-*.vercel.app
```

### Staging/Preview

Vercel preview deployments sunt permise automat prin pattern matching:
- `https://farme-ro-abc123.vercel.app` ✅
- `https://farme-ro-xyz789.vercel.app` ✅

## 🔒 Securitate

### Headers permise

- `Content-Type`: Pentru JSON/Form data
- `Authorization`: Pentru JWT tokens
- `X-Requested-With`: Pentru AJAX requests
- `Accept`: Pentru content negotiation
- `Origin`: Pentru CORS verification

### Methods permise

- `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`, `HEAD`

### Credentials

`credentials: true` permite:
- Cookies
- Headers de autentificare
- Session management

## 🧪 Testare

### Test local

```bash
# Frontend pe localhost:3000
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     http://localhost:4000/api/public/products
```

### Test production

```bash
# Frontend pe farme.ro
curl -H "Origin: https://farme.ro" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     https://your-backend.railway.app/api/public/products
```

### Test Vercel preview

```bash
# Frontend pe Vercel preview
curl -H "Origin: https://farme-ro-abc123.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     https://your-backend.railway.app/api/public/products
```

## 🐛 Troubleshooting

### Eroare: "Not allowed by CORS"

**Cauză**: Origin-ul frontend-ului nu este în lista de origin-uri permise.

**Soluție**:
1. Verifică `CORS_ORIGIN` în `.env`
2. Asigură-te că origin-ul frontend-ului este inclus
3. Pentru Vercel preview, pattern-ul `https://farme-ro-*.vercel.app` ar trebui să funcționeze automat

### Eroare: "Credentials not allowed"

**Cauză**: `credentials: true` este setat, dar frontend-ul nu trimite `credentials: 'include'`.

**Soluție**: În frontend, folosește:
```typescript
fetch('https://api.farme.ro/endpoint', {
  credentials: 'include',
  // ...
});
```

### Preflight requests eșuează

**Cauză**: `OPTIONS` requests nu sunt procesate corect.

**Soluție**: Asigură-te că `app.options('*', cors(corsConfig))` este adăugat înainte de rute.

## 📝 Exemple

### Frontend React/Next.js

```typescript
// Next.js API route sau React component
const response = await fetch('https://api.farme.ro/api/public/products', {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
});
```

### Axios

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.farme.ro',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adaugă token la requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 🔄 Actualizare

Pentru a actualiza configurația CORS:

1. Modifică `src/config/cors.ts`
2. Actualizează `CORS_ORIGIN` în `.env`
3. Repornește serverul

## 📚 Referințe

- [MDN CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Express CORS Middleware](https://expressjs.com/en/resources/middleware/cors.html)
- [Vercel Preview Deployments](https://vercel.com/docs/concepts/deployments/preview-deployments)

---

**Ultima actualizare**: 2024

