# Farmero Admin

Aplicație admin dedicată pentru platforma Farmero (admin.farme.ro).

## Descriere

Această aplicație Next.js 14 oferă un dashboard administrativ complet pentru gestionarea platformei Farmero, incluzând:

- Autentificare admin
- Gestionare producători
- Gestionare utilizatori
- Gestionare comenzi
- Dashboard cu KPIs
- Configurare sistem

## Tehnologii

- **Next.js 14** (App Router + TypeScript)
- **React 18**
- **TailwindCSS** pentru styling
- **TypeScript** pentru type safety
- **Axios** pentru API calls
- **Zod** pentru validare
- **Jotai** pentru state management (opțional)

## Setup

### 1. Instalează dependențele

```bash
npm install
```

### 2. Configurează variabilele de mediu

Creează un fișier `.env.local` în root-ul proiectului:

```env
NEXT_PUBLIC_API_URL=https://api.farme.ro
NEXT_PUBLIC_APP_ENV=development
```

Pentru development local (dacă rulezi backend-ul local):

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_ENV=development
```

### 3. Rulează aplicația

```bash
npm run dev
```

Aplicația va fi disponibilă la `http://localhost:3000`.

## Structură Proiect

```
admin/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (admin)/            # Route group pentru pagini protejate
│   │   │   ├── dashboard/      # Dashboard principal
│   │   │   ├── producers/      # Gestionare producători
│   │   │   ├── users/          # Gestionare utilizatori
│   │   │   ├── orders/         # Gestionare comenzi
│   │   │   ├── config/         # Configurare sistem
│   │   │   └── layout.tsx       # Layout admin (topbar + sidebar)
│   │   ├── (auth)/             # Route group pentru autentificare
│   │   │   └── login/          # Pagină login
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Stiluri globale
│   ├── components/
│   │   ├── auth/               # Componente autentificare
│   │   │   └── RequireAdmin.tsx
│   │   └── layout/             # Componente layout
│   │       ├── AdminTopbar.tsx
│   │       └── AdminSidebar.tsx
│   └── lib/
│       ├── api/                # API client layer
│       │   ├── client.ts       # Base API client
│       │   ├── types.ts        # Type definitions
│       │   └── admin-auth.ts   # Auth API functions
│       └── auth/               # Auth context
│           └── admin-auth-context.tsx
└── docs/
    └── ADMIN_BACKEND_GAPS.md   # Documentație endpoint-uri backend
```

## Autentificare

Aplicația folosește cookie-based authentication cu backend-ul `api.farme.ro`.

### Flow de autentificare:

1. Utilizatorul introduce email și parolă în pagina `/login`
2. Frontend-ul face `POST /auth/login` către backend
3. Backend-ul returnează JWT token și setează cookie `session`
4. Frontend-ul stochează user data în context (AdminAuthContext)
5. Pentru request-uri ulterioare, cookie-ul este trimis automat (credentials: 'include')

### Protecție rute:

Toate rutele din `(admin)/` sunt protejate cu componenta `RequireAdmin`, care:
- Verifică dacă utilizatorul este autentificat
- Redirecționează către `/login` dacă nu este autentificat
- Afișează loading state în timpul verificării

## Integrare Backend

Aplicația se conectează la backend-ul `api.farme.ro` (sau `localhost:3001` în development).

### Endpoint-uri utilizate:

- `POST /auth/login` - Autentificare
- `GET /auth/me` - Obține utilizator curent
- `POST /auth/logout` - Deconectare
- `GET /admin/producers` - Listă producători
- `GET /admin/users` - Listă utilizatori
- `GET /admin/orders` - Listă comenzi
- `GET /admin/financials/summary` - Rezumat financiar (pentru dashboard)

Pentru detalii complete, vezi `docs/ADMIN_BACKEND_GAPS.md`.

## Branding

Aplicația folosește paleta de culori Farmero:
- **Farmero Olive** (verde) - culoare principală
- **Farmero Terracotta** (teracotă) - culoare secundară

Culorile sunt definite în `tailwind.config.ts` și pot fi folosite cu clase Tailwind:
- `bg-farmero-olive-600`
- `text-farmero-terracotta-700`
- etc.

## Development

### Scripts disponibile:

- `npm run dev` - Rulează aplicația în development mode
- `npm run build` - Construiește aplicația pentru producție
- `npm run start` - Rulează aplicația în production mode
- `npm run lint` - Rulează ESLint

### TODO pentru integrare completă:

1. ✅ Bootstrap aplicație Next.js
2. ✅ Autentificare și protecție rute
3. ✅ Layout admin (topbar + sidebar)
4. ✅ Pagini skeleton (dashboard, producers, users, orders, config)
5. ⏳ Integrare endpoint-uri backend în pagini
6. ⏳ Implementare pagini detalii (producers/[id], users/[id], orders/[id])
7. ⏳ Adăugare filtre și căutare în tabele
8. ⏳ Implementare dark mode toggle (opțional)

## Note

- Aplicația este separată de frontend-ul principal (`frontend/`)
- Backend-ul este într-un repo separat (`backend/`)
- Toate request-urile către backend folosesc cookie-based auth
- Endpoint-urile admin necesită rol `ADMIN` în backend

## Support

Pentru întrebări sau probleme, consultă:
- `docs/ADMIN_BACKEND_GAPS.md` pentru documentație endpoint-uri
- Backend API documentation în `backend/docs/`

