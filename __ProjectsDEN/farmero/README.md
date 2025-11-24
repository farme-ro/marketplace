# farme.ro Frontend

Marketplace pentru produse agricole tradiționale din România.

## Tehnologii

- **Next.js 14** - React framework cu App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management pentru cart
- **farme-ui** - Local UI component library

## Setup Local

### 1. Instalare dependențe

```bash
npm install
```

### 2. Configurare environment variables

Creează un fișier `.env.local` în root-ul proiectului:

```bash
cp .env.example .env.local
```

Editează `.env.local` și setează valorile necesare (vezi `.env.example` pentru detalii).

### 3. Pornire development server

```bash
npm run dev
```

Aplicația va fi disponibilă la `http://localhost:3000`.

## Environment Variables

### Necesare

- `NEXT_PUBLIC_API_URL` - URL-ul backend-ului API (ex: `https://api.farme.ro` sau `http://localhost:3001` pentru development)

### Opționale

- `NEXT_PUBLIC_API_BASE_URL` - Fallback pentru `NEXT_PUBLIC_API_URL`
- `NODE_ENV` - Setat automat de Next.js (`development`, `production`, `test`)

## Scripts

### Development
- `npm run dev` - Pornește development server
- `npm run build` - Build pentru producție
- `npm run start` - Pornește production server
- `npm run lint` - Rulează ESLint

### Bundle Analysis
- `npm run analyze` - Analizează bundle size (deschide automat în browser)

### Testing
- `npm run test:e2e` - Rulează testele E2E cu Playwright
- `npm run test:e2e:ui` - Rulează testele E2E în mod UI (headed)
- `npm run test:e2e:headed` - Rulează testele E2E cu browser vizibil
- `npm run test:e2e:debug` - Rulează testele E2E în mod debug

## Structura Proiectului

```
src/
├── app/                    # Next.js App Router
│   ├── (site)/            # Rute publice (route group)
│   │   ├── page.tsx       # Homepage (/)
│   │   ├── products/      # Pagini produse
│   │   ├── producers/      # Pagini producători
│   │   └── ...
│   ├── dashboard/         # Dashboard redirect
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── layout/           # Layout components
│   └── ui/               # UI components
├── lib/                   # Utilities și helpers
│   ├── api/              # API clients
│   ├── auth/             # Authentication
│   ├── i18n/             # Internationalization
│   └── store/            # Zustand stores
└── packages/             # Local packages
    └── farme-ui/         # UI component library
```

## Features

### ✅ Implementat

- [x] Static generation și ISR pentru pagini publice
- [x] SEO metadata completă (Open Graph, Twitter Cards, canonical URLs)
- [x] i18n support (RO, EN, FR, IT, ES, DE)
- [x] Shopping cart cu Zustand
- [x] Responsive design
- [x] Error handling pentru API calls
- [x] Status page pentru monitoring backend
- [x] Accessibilitate (ARIA labels, semantic HTML, focus states)
- [x] Performance optimizations (lazy loading, memoization, code splitting)
- [x] Bundle analysis setup
- [x] Error tracking (Sentry) - pregătit pentru activare
- [x] Type safety improvements

### 🚧 În dezvoltare

- [ ] Checkout complet cu Stripe
- [ ] User dashboard
- [ ] Producer portal
- [ ] Admin panel

## Deployment

Aplicația este deployată pe **Vercel**.

### Environment Variables în Vercel

Asigură-te că ai setat următoarele variabile în Vercel:

- `NEXT_PUBLIC_API_URL` - URL-ul backend-ului în producție

### Build

Vercel va rula automat `npm run build` la fiecare push pe branch-ul principal.

## Backend Connection

Frontend-ul comunică cu backend-ul prin API calls către `NEXT_PUBLIC_API_URL`.

Pentru detalii despre endpoint-uri și structura API-ului, vezi:
- `BACKEND_API_REQUIREMENTS.md`
- `BACKEND_CONNECTION_GUIDE.md`

## Status Page

Pagina `/status` verifică conectivitatea la backend și baza de date.

Endpoint-ul backend trebuie să implementeze `/status` sau `/health/db` (legacy support).

Vezi `BACKEND_STATUS_ENDPOINT.md` pentru specificații.

## Performance & Optimization

### Bundle Analysis

Analizează bundle size pentru a identifica optimizări:

```bash
npm run analyze
```

Aceasta va deschide automat în browser rapoarte vizuale pentru:
- Client bundles (JavaScript pentru client)
- Server bundles (JavaScript pentru server)

**Target Metrics:**
- First Load JS: < 200KB (gzipped)
- Individual Route: < 150KB (gzipped)
- Shared chunks: < 100KB (gzipped)

Pentru detalii, vezi: `docs/BUNDLE_ANALYSIS_GUIDE.md`

### Code Splitting

Next.js face automat code splitting pentru rute. Pentru optimizări avansate, vezi: `docs/CODE_SPLITTING_OPTIMIZATION.md`

### Performance Optimizations

- ✅ Lazy loading pentru secțiuni grele
- ✅ Memoization pentru componente (ProductCard, ProducerCard)
- ✅ Image optimization cu next/image
- ✅ ISR (Incremental Static Regeneration) pentru pagini statice

Pentru detalii, vezi: `PERFORMANCE_OPTIMIZATIONS.md`

## Testare E2E

Proiectul include teste E2E implementate cu **Playwright** pentru fluxurile critice.

### Setup

1. **Instalează dependențele:**
   ```bash
   npm install
   ```

2. **Configurează variabilele de environment pentru testare:**
   ```bash
   cp .env.e2e.example .env.e2e
   ```
   
   Editează `.env.e2e` și setează:
   - `E2E_BASE_URL` - URL-ul aplicației (default: `http://localhost:3000`)
   - `E2E_BACKEND_READY` - Setează la `"true"` când backend-ul este gata pentru testare
   - Credențialele conturilor de test (client, producer, investor)

### Rulare Teste

```bash
# Rulează toate testele E2E
npm run test:e2e

# Rulează testele în mod UI (interactiv)
npm run test:e2e:ui

# Rulează testele cu browser vizibil
npm run test:e2e:headed

# Rulează testele în mod debug
npm run test:e2e:debug
```

### Teste Disponibile

- **Login & Role Redirect** (`tests/e2e/login-role-redirect.spec.ts`) - Verifică login și redirect-urile pe rol
- **Client Order Flow** (`tests/e2e/client-order-flow.spec.ts`) - Verifică fluxul complet: product → cart → checkout
- **Producer Orders Flow** (`tests/e2e/producer-orders-flow.spec.ts`) - Verifică că producătorul poate vedea și actualiza comenzile
- **Investor Dashboard** (`tests/e2e/investor-dashboard.spec.ts`) - Verifică încărcarea dashboard-ului investitorului

### Documentație

Pentru detalii complete despre planul de testare, vezi:
- `docs/FARMERO_QA_TEST_PLAN.md` - Plan complet de QA și testare
- `docs/CORE_COMMERCE_QA_CHECKLIST.md` - Checklist detaliat pentru fluxurile de commerce

**Notă:** Testele E2E necesită backend-ul să fie disponibil. Dacă `E2E_BACKEND_READY !== 'true'`, unele teste vor fi skipped automat.

## Documentație

Documentația completă este disponibilă în directorul `docs/`. Pentru un index complet, vezi: `docs/DOCUMENTATION_INDEX.md`

### Documentație Principală
- **`AUDIT_PROGRES_PROIECT_2025.md`** - Audit principal al progresului (actualizat zilnic)
- **`README.md`** - Acest fișier
- **`docs/DOCUMENTATION_INDEX.md`** - Index complet al documentației

### Ghiduri Rapide
- **Faza 1 (MVP):** `docs/FAZA1_FRONTEND_ACTIVATION_GUIDE.md`
- **Faza 2 (Complet):** `docs/FAZA2_FRONTEND_ACTIVATION_GUIDE.md`
- **Faza 3 (Polish):** `docs/FAZA3_FRONTEND_ACTIVATION_GUIDE.md`
- **Bundle Analysis:** `docs/BUNDLE_ANALYSIS_GUIDE.md`
- **Code Splitting:** `docs/CODE_SPLITTING_OPTIMIZATION.md`
- **Testing:** `docs/TESTING_PREPARATION_GUIDE.md`

### Backend Integration
- **API Contracts:** `docs/BACKEND_API_CONTRACT_*.md`
- **Handoff Checklist:** `docs/FARMERO_BACKEND_HANDOFF_CHECKLIST.md`
- **Activation Plan:** `docs/FARMERO_BACKENDSYNC_ACTIVATION_PLAN.md`

## Contribuții

1. Fork repository-ul
2. Creează un branch pentru feature (`git checkout -b feature/amazing-feature`)
3. Commit schimbările (`git commit -m 'Add amazing feature'`)
4. Push la branch (`git push origin feature/amazing-feature`)
5. Deschide un Pull Request

## Licență

Proprietate privată - farme.ro

