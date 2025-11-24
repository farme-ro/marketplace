# 🚀 Ghidă Deploy Complet - farme.ro

**Data:** 2025-01-27  
**Status:** ✅ **Backend și Frontend pregătite pentru deploy**  
**Scop:** Deploy complet al sistemului farme.ro cu backend și frontend integrate

---

## 📋 Rezumat

Sistemul farme.ro este pregătit pentru deploy complet cu:
- ✅ **Backend** - API complet funcțional cu toate endpoint-urile implementate
- ✅ **Frontend** - Toate features-urile activate și integrate cu backend-ul
- ✅ **Compatibilitate** - Ajustări pentru compatibilitate între frontend și backend
- ✅ **Database** - Schema Prisma completă cu migrații

---

## ✅ Features Activate

### Client Features
- ✅ **Client Profile** - GET/PATCH `/clients/me`
- ✅ **Client Addresses** - GET/POST/PATCH/DELETE `/clients/addresses`
- ✅ **Cart** - GET/POST/PATCH/DELETE `/cart`
- ✅ **Checkout** - POST `/orders/checkout`
- ✅ **Client Orders** - GET `/orders`, GET `/orders/:id`
- ✅ **Favorites** - GET/POST/DELETE `/clients/favorites`
- ✅ **Subscriptions** - GET/POST/PATCH `/clients/subscriptions`
- ✅ **Alerts** - GET/PATCH `/clients/alert-preferences`

### Producer Features
- ✅ **Producer Products** - GET/POST/PATCH/DELETE `/producers/products`
- ✅ **Producer Orders** - GET `/producers/orders`, GET `/producers/orders/:id`, PATCH `/producers/orders/:id/status`

### Portal Features
- ✅ **Business Portal** - GET `/business/*`
- ✅ **Logistics Portal** - GET `/logistics/*`
- ✅ **Investor Portal** - GET `/investor/*`

### System Features
- ✅ **Notifications** - GET `/notifications/*`
- ✅ **Documents** - GET `/documents/*`
- ✅ **Promotions** - GET `/producer/promotions/*`

---

## 🔧 Ajustări de Compatibilitate

### Cart API
- **Backend returnează:** `{ cart: Cart }`
- **Frontend extrage:** `cart` din răspuns
- **Status:** ✅ Ajustat

### Favorites API
- **Backend acceptă:**
  - POST cu `{ productId }` sau `{ targetType, targetId }`
  - DELETE cu `/:id` sau `?targetType=product&targetId=...`
- **Frontend folosește:** `{ targetType, targetId }`
- **Status:** ✅ Ajustat

### Orders API
- **Backend:** `/orders/checkout`, `/orders`, `/orders/:id`
- **Frontend:** Compatibil
- **Status:** ✅ Compatibil

---

## 📦 Structura Deploy

### Backend (api.farme.ro)
- **Repo:** Separated repository
- **Platform:** Vercel (serverless functions)
- **Database:** Neon PostgreSQL
- **Environment Variables:**
  - `DATABASE_URL` - Connection string Neon
  - `JWT_SECRET` - Secret key pentru JWT
  - `NODE_ENV=production`
  - `CORS_ORIGIN=https://farme.ro`
  - `STRIPE_SECRET_KEY` (opțional)
  - `STRIPE_WEBHOOK_SECRET` (opțional)

### Frontend (farme.ro)
- **Repo:** Separated repository
- **Platform:** Vercel
- **Environment Variables:**
  - `NEXT_PUBLIC_API_BASE_URL=https://api.farme.ro`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (opțional)

---

## 🚀 Pași pentru Deploy

### 1. Backend Deploy

#### 1.1. Verifică Configurarea
```bash
cd backend
npm run check:config
```

#### 1.2. Aplică Migrații
```bash
npx prisma migrate deploy
npx prisma generate
```

#### 1.3. Build și Deploy
```bash
npm run build
# Deploy pe Vercel (automat sau manual)
```

#### 1.4. Verifică Environment Variables pe Vercel
- `DATABASE_URL`
- `JWT_SECRET`
- `NODE_ENV=production`
- `CORS_ORIGIN=https://farme.ro`

### 2. Frontend Deploy

#### 2.1. Verifică Configurarea
```bash
cd frontend
# Verifică că NEXT_PUBLIC_API_BASE_URL este setat
```

#### 2.2. Build și Deploy
```bash
npm run build
# Deploy pe Vercel (automat sau manual)
```

#### 2.3. Verifică Environment Variables pe Vercel
- `NEXT_PUBLIC_API_BASE_URL=https://api.farme.ro`

---

## ✅ Checklist Pre-Deploy

### Backend
- [ ] Migrații Prisma aplicate
- [ ] Prisma Client generat
- [ ] Environment variables setate pe Vercel
- [ ] Build reușit (`npm run build`)
- [ ] Health check funcționează: `curl https://api.farme.ro/health`
- [ ] CORS configurat corect

### Frontend
- [ ] Environment variables setate pe Vercel
- [ ] Build reușit (`npm run build`)
- [ ] Features activate în `BackendSyncStatus`
- [ ] API client configurat corect

### Integrare
- [ ] Backend răspunde la health check
- [ ] Frontend se conectează la backend
- [ ] CORS permite request-uri de la frontend
- [ ] Autentificare funcționează
- [ ] Cart funcționează
- [ ] Checkout funcționează

---

## 🧪 Testare Post-Deploy

### 1. Testare Public API
```bash
curl https://api.farme.ro/health
curl https://api.farme.ro/api/public/products
curl https://api.farme.ro/regions
```

### 2. Testare Autentificare
```bash
# Register
curl -X POST https://api.farme.ro/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","fullName":"Test User"}'

# Login
curl -X POST https://api.farme.ro/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}' \
  -c cookies.txt
```

### 3. Testare Cart
```bash
# Get cart (cu cookie de la login)
curl https://api.farme.ro/cart \
  -b cookies.txt

# Add to cart
curl -X POST https://api.farme.ro/cart/items \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"productId":"...","quantity":1}'
```

### 4. Testare Frontend
1. Deschide https://farme.ro
2. Testează login/register
3. Testează adăugare în coș
4. Testează checkout
5. Testează favorite
6. Testează producer portal

---

## 🐛 Rezolvare Probleme

### Eroare: CORS
**Sintom:** Request-urile de la frontend sunt blocate de CORS

**Soluție:**
1. Verifică `CORS_ORIGIN` în backend environment variables
2. Verifică că frontend URL este în whitelist
3. Verifică `backend/src/config/cors.ts`

### Eroare: 401 Unauthorized
**Sintom:** Request-urile autentificate returnează 401

**Soluție:**
1. Verifică că cookies sunt trimise (`credentials: 'include'`)
2. Verifică că JWT_SECRET este setat corect
3. Verifică că token-ul nu a expirat

### Eroare: 404 Not Found
**Sintom:** Endpoint-urile returnează 404

**Soluție:**
1. Verifică că rutele sunt montate corect în `backend/src/index.ts`
2. Verifică că build-ul backend include toate fișierele
3. Verifică log-urile Vercel pentru erori

### Eroare: Database Connection
**Sintom:** Erori de conexiune la baza de date

**Soluție:**
1. Verifică `DATABASE_URL` în environment variables
2. Verifică că Neon permite conexiuni de oriunde
3. Verifică că migrațiile sunt aplicate

---

## 📚 Documentație Suplimentară

- **Backend Setup:** `backend/DEPLOY_SETUP_GUIDE.md`
- **Frontend Setup:** `frontend/VERCEL_FRONTEND_SETUP.md`
- **API Reference:** `backend/API_ENDPOINTS_REFERENCE.md`
- **Testing Guide:** `backend/TESTING_GUIDE.md`
- **Stripe Setup:** `backend/STRIPE_SETUP_GUIDE.md`

---

## 🎯 Status Final

- ✅ **Backend:** Complet funcțional, toate endpoint-urile implementate
- ✅ **Frontend:** Toate features-urile activate și integrate
- ✅ **Database:** Schema completă, migrații pregătite
- ✅ **Compatibilitate:** Ajustări pentru compatibilitate între frontend și backend
- ✅ **Documentație:** Ghidă completă pentru deploy

**Sistemul este pregătit pentru deploy complet!** 🚀

---

**Ultima actualizare:** 2025-01-27  
**Versiune:** 1.0.0

