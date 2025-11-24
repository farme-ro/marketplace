# 🏗️ Arhitectură Farme.ro

## ⚠️ REGULĂ FUNDAMENTALĂ

**Frontend (farme.ro) NU accesează direct baza de date.**

**Toate operațiunile de citire/scriere trec prin api.farme.ro.**

## Arhitectură Oficială (Opțiunea A)

```
┌─────────────────┐
│   Frontend      │
│  (Next.js)      │
│  farme.ro       │
│                 │
│  ❌ NO DB       │
│  ✅ API calls   │
└────────┬────────┘
         │
         │ HTTP/HTTPS
         │ NEXT_PUBLIC_API_URL
         │ → api.farme.ro
         ▼
┌─────────────────┐
│   Backend API   │
│  api.farme.ro   │
│  (Express/Node) │
│                 │
│  ✅ Prisma      │
│  ✅ Business    │
│  ✅ Auth        │
└────────┬────────┘
         │
         │ Prisma Client
         │ DATABASE_URL
         ▼
┌─────────────────┐
│   Neon DB       │
│  (PostgreSQL)   │
└─────────────────┘
```

## Principii Arhitecturale

1. **Frontend (`farme.ro`)**:
   - ✅ Gestionează UI/UX
   - ✅ Client-side state management
   - ✅ Apeluri HTTP către `api.farme.ro`
   - ❌ **NU accesează direct DB**
   - ❌ **NU folosește Prisma în frontend**

2. **Backend API (`api.farme.ro`)**:
   - ✅ Gestionează toate operațiunile DB (Prisma)
   - ✅ Autentificare și autorizare
   - ✅ Business logic
   - ✅ WebSocket connections
   - ✅ Validare și securitate

## Configurare Variabile de Mediu

### Frontend (Next.js - Vercel)
```env
# Backend API URL
NEXT_PUBLIC_API_URL=https://api.farme.ro

# WebSocket URL (dacă e necesar)
NEXT_PUBLIC_SOCKET_URL=wss://api.farme.ro

# NU setați DATABASE_URL în frontend!
# Frontend-ul NU ar trebui să acceseze direct DB
```

### Backend (api.farme.ro)
```env
# Database connection
DATABASE_URL=postgresql://user:password@neon-host/database?sslmode=require

# CORS origins
CORS_ORIGIN=https://farme.ro,https://farme-ro-*.vercel.app
```

## Decizie Arhitecturală Oficială

**✅ Opțiunea A – Arhitectură completă Backend API (IMPLEMENTAT)**

- ✅ Frontend apelează direct `api.farme.ro`
- ✅ Backend gestionează toate operațiunile DB
- ✅ Frontend NU are acces la DB
- ✅ Separare clară de responsabilități
- ✅ Securitate îmbunătățită
- ✅ Scalabilitate mai bună

## Endpoints Backend API

Backend-ul (`api.farme.ro`) trebuie să expună următoarele endpoint-uri:

### Public Endpoints (fără autentificare)
- `GET /public/producers` - Listă producători publici
- `GET /public/producers/:slug` - Detalii producător
- `GET /public/products` - Listă produse publice
- `GET /public/products/:slug` - Detalii produs
- `GET /regions` - Listă regiuni

### Auth Endpoints
- `POST /auth/login` - Login utilizator
- `POST /auth/register` - Înregistrare utilizator
- `POST /auth/logout` - Logout
- `GET /auth/me` - Utilizator curent

### Protected Endpoints (cu autentificare)
- `GET /cart` - Coș utilizator
- `POST /cart/items` - Adaugă item în coș
- `GET /orders` - Listă comenzi
- `POST /orders` - Creează comandă
- etc.

## Implementare Frontend

### Apeluri către Backend API

Toate apelurile din frontend merg direct către `api.farme.ro`:

```typescript
// ✅ CORECT - apelează backend direct
const response = await request('GET', '/public/producers')
// → https://api.farme.ro/public/producers

// ❌ GREȘIT - apelează Next.js API route care accesează DB
const response = await request('GET', '/api/public/producers')
// → http://localhost:3000/api/public/producers (accesează DB direct)
```

### Rute Next.js API

Rutele Next.js API (`/api/*`) rămân DOAR pentru:
- ✅ Webhooks (Stripe, etc.)
- ✅ Proxy-uri dacă e nevoie
- ✅ Server-side helpers (fără acces DB)

**❌ NU folosim rute Next.js API pentru:**
- Acces direct la DB
- Business logic
- Operațiuni CRUD

## Routing Structure

### Root Route "/"

**Fișier responsabil:** `src/app/page.tsx`

- Acesta este singurul fișier care definește ruta "/" (homepage)
- Nu există `src/app/(site)/page.tsx` pentru a evita conflictele de rute
- Homepage-ul folosește componentele din `(site)/_components/home/*` ca componente partajate
- Homepage-ul este configurat pentru static generation:
  - `export const dynamic = 'force-static'`
  - `export const revalidate = 300` (ISR: revalidate la fiecare 5 minute)
- Deployment: farme.ro este deployat pe Vercel, iar ruta "/" este static prerendered

### Route Groups

- `(site)/` - Rute publice (products, producers, cart, checkout, etc.)
- `(admin)/` - Rute admin (dashboard, producers, products, orders, commissions)
- `(dashboard)/` - Rute vendor/producer dashboard
- `(producer-portal)/` - Rute producer portal
- `(brand)/` - Rute pentru brand guidelines și design system

**IMPORTANT:** Route groups nu afectează URL-urile - ele sunt doar pentru organizare.

## Status Migrare

### ✅ Completat
- [x] Documentație arhitectură
- [x] Refactor rute publice (producers, products, regions)
- [x] Eliminare rute Next.js API pentru public routes
- [x] Toate apelurile publice merg direct către `api.farme.ro`
- [x] Structură clară de routing - un singur fișier pentru ruta "/"
- [x] Rate limiting pentru auth refresh
- [x] Gestionare elegantă a erorilor pentru endpoint-uri publice (401/404)
- [x] WebSocket configuration (opțional, funcționează fără el)

### 🔄 În Progres
- [ ] Backend API endpoints - vezi `BACKEND_API_REQUIREMENTS.md`
  - [ ] `GET /regions` - **CRITIC** pentru homepage
  - [ ] `GET /public/producers` - **CRITIC** pentru homepage
  - [ ] `GET /public/products` - **CRITIC** pentru homepage
  - [ ] `GET /public/producers/:slug` - pentru pagina de detalii
  - [ ] `GET /public/products/:slug` - pentru pagina de detalii
  - [ ] `GET /health/db` - pentru status page
- [ ] Refactor rute protejate (cart, orders)
- [ ] Eliminare rute Next.js API care accesează DB pentru rute protejate
- [ ] Testare completă integrare cu backend

### 📋 De Făcut
- [ ] Refactor autentificare (dacă folosește Next.js API routes)
- [ ] Refactor admin routes
- [ ] Refactor producer portal routes
- [ ] Implementare WebSocket pe backend (opțional, pentru notificări real-time)

