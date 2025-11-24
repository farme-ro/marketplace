# 🚀 Deploy Now - api.farme.ro

## ✅ Status: Ready to Deploy

Toate fix-urile pentru "Server initialization failed" au fost implementate și testate local.

---

## 📋 Environment Variables pentru Vercel

**IMPORTANT**: Setează aceste variabile în **Vercel Dashboard → Settings → Environment Variables**:

### Critical (MUST SET)

```env
NODE_ENV=production
DATABASE_URL=postgresql://neondb_owner:npg_wGiQ7SLEl6Re@ep-rapid-firefly-ag2wcvwd-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=d9d77a75d0830e4947f8ac09e3f4675f9269cfa77b4f5f3194450988b4eb31c4f9efc30b4d9ae526161f945decefb62ad059e4a873a373ab79f554bbfcb7157e
```

### Optional (Recommended)

```env
CORS_ORIGIN=https://farme.ro
PORT=4000
HOST=0.0.0.0
```

---

## 🚀 Deploy Steps

### Opțiunea 1: Deploy Automat (Vercel Git Integration)

Dacă Vercel este conectat la GitHub:
1. Push la branch-ul `chore/style-sync-live` (sau `main`)
2. Vercel va detecta automat și va face deploy
3. Verifică în Vercel Dashboard → Deployments

### Opțiunea 2: Deploy Manual cu Vercel CLI

```bash
cd backend

# Login (dacă nu ești deja logat)
npx vercel login

# Link la proiect (dacă nu e deja link-at)
npx vercel link

# Deploy pe producție
npx vercel --prod
```

### Opțiunea 3: Deploy din Vercel Dashboard

1. Mergi la: https://vercel.com/dashboard
2. Selectează proiectul `api.farme.ro` (sau `backend`)
3. Click **"Deploy"** sau **"Redeploy"**
4. Alege branch-ul `chore/style-sync-live` (sau `main`)

---

## 🔧 Post-Deploy: Database Setup

După deploy, rulează migrațiile Prisma:

### Opțiunea 1: Vercel CLI (Recomandat)

```bash
cd backend
npx vercel env pull .env.production
npx prisma migrate deploy
```

### Opțiunea 2: Vercel Dashboard

1. Mergi la **Vercel Dashboard → Project → Settings → Environment Variables**
2. Copiază `DATABASE_URL`
3. Rulează local:
   ```bash
   export DATABASE_URL="<copied-value>"
   npx prisma migrate deploy
   ```

### Opțiunea 3: Vercel Build Command

Vercel rulează automat `npm run build` care include `prisma generate`.
Pentru migrații, adaugă în `vercel.json`:

```json
{
  "buildCommand": "npm run build && npx prisma migrate deploy"
}
```

**⚠️ NOTĂ**: `prisma migrate deploy` rulează doar migrațiile pending. Dacă baza de date e goală, poate fi nevoie să rulezi manual.

---

## ✅ Verification After Deploy

### 1. Health Check
```bash
curl https://api.farme.ro/health
```

**Expected:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-24T...",
  "database": "connected"
}
```

### 2. Products Endpoint
```bash
curl https://api.farme.ro/products
```

**Expected:**
```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 0,
    "totalPages": 0
  }
}
```

### 3. Detailed Health Check
```bash
curl https://api.farme.ro/health/detailed
```

**Expected:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-24T...",
  "checks": {
    "database": {
      "status": "ok",
      "responseTime": <number>
    },
    "memory": {
      "status": "ok",
      "usage": {...}
    }
  }
}
```

---

## 🐛 Troubleshooting

### Dacă vezi "Server initialization failed":

1. **Verifică logurile Vercel:**
   - Mergi la Vercel Dashboard → Project → Deployments
   - Click pe ultimul deploy → **"View Function Logs"**
   - Caută mesaje care încep cu `❌`

2. **Verifică Environment Variables:**
   - Mergi la Settings → Environment Variables
   - Asigură-te că `DATABASE_URL` și `JWT_SECRET` sunt setate
   - Verifică că nu au spații înainte/după valorile

3. **Verifică Database Connection:**
   - Testează `DATABASE_URL` local:
     ```bash
     psql "postgresql://neondb_owner:npg_wGiQ7SLEl6Re@ep-rapid-firefly-ag2wcvwd-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require"
     ```

4. **Verifică Build Logs:**
   - În Vercel Dashboard → Deployments → Build Logs
   - Caută erori de compilare TypeScript sau Prisma

---

## 📝 Checklist Final

- [ ] Environment variables setate în Vercel (DATABASE_URL, JWT_SECRET, NODE_ENV)
- [ ] Build local funcționează: `npm run build`
- [ ] Deploy făcut (automat sau manual)
- [ ] Migrații Prisma rulate: `npx prisma migrate deploy`
- [ ] Health check funcționează: `curl https://api.farme.ro/health`
- [ ] Products endpoint funcționează: `curl https://api.farme.ro/products`
- [ ] Logurile Vercel nu arată erori

---

## 🎯 Quick Deploy Command

```bash
cd backend
npx vercel --prod
```

Apoi verifică:
```bash
curl https://api.farme.ro/health
```

---

**Status**: ✅ **READY TO DEPLOY**

Toate fix-urile sunt implementate, testate local, și gata pentru producție!

