# 📚 Final Documentation - farme.ro

**Data:** 2025-01-27  
**Status:** ✅ **Documentație completă pentru lansare**

---

## 📋 Cuprins

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [API Documentation](#api-documentation)
4. [Deployment](#deployment)
5. [Testing](#testing)
6. [Monitoring](#monitoring)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

**farme.ro** este un marketplace pentru produse agricole tradiționale din România, conectând producători locali cu clienți.

### Tehnologii

**Backend:**
- Node.js + TypeScript
- Express.js
- Prisma ORM + PostgreSQL
- JWT Authentication
- Stripe Payments

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Zustand (State Management)
- i18n (Internationalization)

---

## 🏗️ Architecture

### Backend Structure

```
backend/
├── src/
│   ├── index.ts              # Entry point
│   ├── modules/              # Feature modules
│   │   ├── auth/            # Authentication
│   │   ├── products/        # Products CRUD
│   │   ├── producers/       # Producers CRUD
│   │   ├── cart/            # Shopping cart
│   │   ├── orders/          # Orders & checkout
│   │   ├── reviews/         # Reviews & ratings
│   │   └── ...
│   ├── middleware/          # Express middleware
│   ├── utils/               # Utilities
│   └── config/              # Configuration
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Database migrations
└── scripts/                 # Utility scripts
```

### Frontend Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (site)/         # Public routes
│   │   ├── producer-portal/ # Producer portal
│   │   └── ...
│   ├── components/          # React components
│   ├── lib/                 # Utilities & helpers
│   └── ...
└── public/                  # Static assets
```

---

## 📡 API Documentation

### Base URL

- **Development:** `http://localhost:3001`
- **Production:** `https://api.farme.ro`

### Authentication

Toate endpoint-urile protejate necesită JWT token în header:
```
Authorization: Bearer <token>
```

### Endpoints Principale

**Public:**
- `GET /products` - Listă produse
- `GET /products/:slug` - Detalii produs
- `GET /producers` - Listă producători
- `GET /producers/:slug` - Detalii producător
- `GET /regions` - Listă regiuni

**Auth:**
- `POST /auth/register` - Register
- `POST /auth/login` - Login
- `GET /auth/me` - Get current user

**Cart:**
- `GET /cart` - Get cart
- `POST /cart/items` - Add to cart
- `PATCH /cart/items/:id` - Update cart item
- `DELETE /cart/items/:id` - Remove from cart

**Orders:**
- `POST /orders/checkout` - Create order
- `GET /orders` - List orders
- `GET /orders/:id` - Order details

**Products (Producer):**
- `GET /api/products/mine` - My products
- `POST /api/products` - Create product
- `PATCH /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/products/:id/image` - Upload image

**Reviews:**
- `GET /reviews/product/:productId` - Product reviews
- `POST /reviews/product/:productId` - Create review
- `GET /reviews/producer/:producerId` - Producer reviews
- `POST /reviews/producer/:producerId` - Create producer review

**Health:**
- `GET /health` - Simple health check
- `GET /health/detailed` - Detailed health check

### Documentație Completă

Vezi `backend/API_ENDPOINTS_REFERENCE.md` pentru documentație completă a tuturor endpoint-urilor.

---

## 🚀 Deployment

### Backend Deployment

**Vercel (Recomandat):**
```bash
cd backend
vercel --prod
```

**Manual:**
```bash
cd backend
./scripts/deploy.sh  # sau .\scripts\deploy.ps1 pe Windows
```

**Environment Variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret pentru JWT tokens
- `CORS_ORIGIN` - Frontend URL
- `STRIPE_SECRET_KEY` - Stripe secret key (opțional)
- `SENTRY_DSN` - Sentry DSN (opțional)

### Frontend Deployment

**Vercel (Recomandat):**
```bash
cd frontend
vercel --prod
```

**Environment Variables:**
- `NEXT_PUBLIC_API_URL` - Backend API URL

### Post-Deploy

1. Verifică health check: `curl https://api.farme.ro/health`
2. Verifică frontend: Accesează homepage
3. Testează login/register
4. Verifică logs în Vercel Dashboard

**Ghid complet:** Vezi `DEPLOY_GUIDE.md`

---

## 🧪 Testing

### Test Checklist

Vezi `PRODUCTION_TEST_CHECKLIST.md` pentru checklist complet.

### Test Scenarios

Vezi `TEST_SCENARIOS.md` pentru scenarii detaliate.

### Running Tests

**Backend:**
```bash
cd backend
npm test
```

**Frontend:**
```bash
cd frontend
npm run test:e2e
```

---

## 📊 Monitoring

### Health Checks

- **Simple:** `GET /health`
- **Detailed:** `GET /health/detailed`

### Logging

- **Backend:** Structured logging cu `logger` utility
- **Frontend:** Console logs (production-safe)

### Error Tracking

- **Sentry:** Configurat (opțional)
- **Error Boundaries:** Implementate în frontend

### Performance

- **Backend:** Performance middleware tracking response times
- **Frontend:** Lighthouse audits, Core Web Vitals

---

## 🔧 Troubleshooting

### Backend nu pornește

1. Verifică environment variables
2. Verifică database connection
3. Verifică logs: `npm run dev`

### Frontend build fails

1. Verifică TypeScript errors: `npm run build`
2. Verifică environment variables
3. Verifică dependencies: `npm install`

### Database connection errors

1. Verifică `DATABASE_URL`
2. Verifică firewall rules
3. Verifică SSL mode

### Payment issues

1. Verifică Stripe keys
2. Verifică webhook configuration
3. Verifică logs pentru errors

---

## 📚 Resurse Suplimentare

### Documentație Backend
- `backend/README.md` - Backend overview
- `backend/API_ENDPOINTS_REFERENCE.md` - API reference
- `backend/TESTING_GUIDE.md` - Testing guide

### Documentație Frontend
- `frontend/README.md` - Frontend overview
- `frontend/ARCHITECTURE.md` - Architecture details

### Deployment
- `DEPLOY_GUIDE.md` - Deployment guide
- `DOCKER_SETUP.md` - Docker setup

### User Guides
- `USER_GUIDES.md` - User guides pentru toate tipurile de utilizatori

---

## ✅ Pre-Launch Checklist

- [ ] Toate testele trec
- [ ] Health checks funcționează
- [ ] Monitoring configurat
- [ ] Error tracking configurat
- [ ] Documentation actualizată
- [ ] User guides disponibile
- [ ] Backup strategy implementată

---

**Status:** ✅ **Documentație completă pentru lansare**

**Ultima actualizare:** 2025-01-27

