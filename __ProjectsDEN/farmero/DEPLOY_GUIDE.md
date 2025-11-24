# 🚀 Deploy Guide - farme.ro

**Data:** 2025-01-27  
**Status:** ✅ **Production Ready**

---

## 📋 Pre-Deploy Checklist

### Backend

- [ ] Environment variables configurate
- [ ] Database migrations aplicate
- [ ] Prisma Client generat
- [ ] Build successful
- [ ] Tests passing
- [ ] Health check passing

### Frontend

- [ ] Environment variables configurate
- [ ] Build successful
- [ ] Tests passing
- [ ] SEO metadata verificat
- [ ] Accessibility verificat

---

## 🔧 Backend Deploy

### Opțiunea 1: Vercel (Recomandat)

1. **Configurare Vercel:**
   ```bash
   cd backend
   vercel login
   vercel link
   ```

2. **Environment Variables:**
   - Adaugă în Vercel Dashboard → Settings → Environment Variables:
     - `DATABASE_URL`
     - `JWT_SECRET`
     - `CORS_ORIGIN`
     - `STRIPE_SECRET_KEY` (dacă e configurat)
     - `SENTRY_DSN` (opțional)

3. **Deploy:**
   ```bash
   vercel --prod
   ```

### Opțiunea 2: Manual Deploy Script

**Linux/Mac:**
```bash
cd backend
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

**Windows:**
```powershell
cd backend
.\scripts\deploy.ps1
```

### Opțiunea 3: CI/CD (GitHub Actions)

Deploy automat la push pe `main` branch (configurat în `.github/workflows/ci.yml`).

---

## 🎨 Frontend Deploy

### Opțiunea 1: Vercel (Recomandat)

1. **Configurare Vercel:**
   ```bash
   cd frontend
   vercel login
   vercel link
   ```

2. **Environment Variables:**
   - `NEXT_PUBLIC_API_URL` - URL-ul backend-ului (ex: `https://api.farme.ro`)

3. **Deploy:**
   ```bash
   vercel --prod
   ```

### Opțiunea 2: Build Manual

```bash
cd frontend
npm run build
npm start
```

---

## ✅ Post-Deploy Verification

### Backend

1. **Health Check:**
   ```bash
   curl https://api.farme.ro/health
   ```

2. **Detailed Health Check:**
   ```bash
   curl https://api.farme.ro/health/detailed
   ```

3. **Test Endpoint:**
   ```bash
   curl https://api.farme.ro/products
   ```

### Frontend

1. **Homepage:**
   - Verifică că se încarcă corect
   - Verifică console pentru erori

2. **SEO:**
   - Verifică meta tags în view source
   - Testează cu Google Rich Results Test

3. **Performance:**
   - Lighthouse audit
   - Core Web Vitals

---

## 🔍 Monitoring

### Sentry

1. **Configurare:**
   - Adaugă `SENTRY_DSN` în environment variables
   - Sentry va captura automat erorile

### Logs

- **Vercel:** Dashboard → Logs
- **Backend:** `logger` utility pentru logging structurat

### Health Checks

- **Endpoint:** `/health/detailed`
- **Monitoring:** Configurează uptime monitoring (UptimeRobot, Pingdom, etc.)

---

## 🚨 Troubleshooting

### Backend nu pornește

1. Verifică environment variables
2. Verifică database connection
3. Verifică logs în Vercel Dashboard

### Frontend build fails

1. Verifică TypeScript errors
2. Verifică environment variables
3. Verifică dependencies

### Database connection errors

1. Verifică `DATABASE_URL`
2. Verifică firewall rules
3. Verifică SSL mode

---

## 📚 Resurse

- [Vercel Deployment Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)

---

**Status:** ✅ **Gata pentru producție**

