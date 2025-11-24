# 🚀 Ghidă Deploy Backend - Neon + Git

**Data:** 2025-01-27  
**Scop:** Configurare completă pentru deploy backend cu Neon PostgreSQL și Git  
**Status:** 📋 **Ghidă completă**

---

## 📋 Cuprins

1. [Configurare Neon PostgreSQL](#1-configurare-neon-postgresql)
2. [Configurare Locală](#2-configurare-locală)
3. [Aplicare Migrații Prisma](#3-aplicare-migrații-prisma)
4. [Deploy pe Git](#4-deploy-pe-git)
5. [Configurare Environment Variables](#5-configurare-environment-variables)
6. [Verificare și Testare](#6-verificare-și-testare)
7. [Rezolvare Probleme Comune](#7-rezolvare-probleme-comune)
8. [Checklist Final](#8-checklist-final)

---

## 1. Configurare Neon PostgreSQL

### Pasul 1.1: Creează cont Neon

1. Mergi pe https://neon.tech
2. Sign up cu GitHub/Google/Email
3. Confirmă email-ul

### Pasul 1.2: Creează proiect nou

1. Click **"Create Project"**
2. Nume proiect: `farmero-backend`
3. Selectează regiunea: **Europe (Frankfurt)** sau **US East (Ohio)** (cel mai apropiat de utilizatori)
4. PostgreSQL version: **16** (recomandat) sau **15**
5. Click **"Create Project"**

### Pasul 1.3: Obține Connection String

1. După crearea proiectului, vei vedea dashboard-ul
2. În secțiunea **"Connection Details"**, copiază **Connection String**
3. Format: `postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require`

**⚠️ IMPORTANT:** Salvează connection string-ul într-un loc sigur! Nu îl partaja public.

### Pasul 1.4: Configurare Database (Opțional)

1. În Neon Dashboard, mergi la **"SQL Editor"**
2. Poți rula query-uri direct pentru verificare
3. Nu este necesar să creezi tabele manual - Prisma migrațiile vor face asta

---

## 2. Configurare Locală

### Pasul 2.1: Creează fișier `.env`

În root-ul proiectului backend (`f:\__ProjectsDEN\farmero\backend`), creează fișierul `.env`:

```env
# Database
DATABASE_URL="postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require"

# JWT Authentication
JWT_SECRET="d9d77a75d0830e4947f8ac09e3f4675f9269cfa77b4f5f3194450988b4eb31c4f9efc30b4d9ae526161f945decefb62ad059e4a873a373ab79f554bbfcb7157e"
JWT_EXPIRES_IN="7d"

# Server
NODE_ENV="development"
PORT=3001
HOST="0.0.0.0"

# CORS (pentru development)
FRONTEND_URL="http://localhost:3000"

# Stripe (opțional - pentru plăți)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email (opțional - pentru notificări)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

**⚠️ IMPORTANT:** 
- Înlocuiește `DATABASE_URL` cu connection string-ul tău de la Neon
- Generează un `JWT_SECRET` nou folosind: `node generate-jwt-secret.js`
- Nu commit-a fișierul `.env` în git (este deja în `.gitignore`)

### Pasul 2.2: Verifică configurarea

```bash
# Verifică că .env este configurat corect
npm run check:config  # (dacă există script)
# SAU
node -e "require('dotenv').config(); console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Missing'); console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');"
```

---

## 3. Aplicare Migrații Prisma

### Pasul 3.1: Verifică migrațiile existente

```bash
# Listează migrațiile disponibile
ls prisma/migrations/
```

Ar trebui să vezi:
- `20251119083527_farmero/`
- `20251122052138_add_client_features_and_portals/`

### Pasul 3.2: Aplică migrațiile

```bash
# Aplică toate migrațiile la baza de date
npx prisma migrate deploy

# Generează Prisma Client
npx prisma generate
```

**Output așteptat:**
```
✅ Applied migration: 20251119083527_farmero
✅ Applied migration: 20251122052138_add_client_features_and_portals
✔ Generated Prisma Client
```

### Pasul 3.3: Verifică schema

```bash
# Deschide Prisma Studio pentru a vedea baza de date
npx prisma studio
```

Ar trebui să vezi toate tabelele create:
- `users`
- `producers`
- `products`
- `orders`
- `carts`
- `shipping_addresses`
- `favorites`
- `subscriptions`
- `alert_preferences`
- `notifications`
- `documents`
- `promotions`
- etc.

---

## 4. Deploy pe Git

### Pasul 4.1: Verifică Git status

```bash
# Verifică dacă repo-ul este inițializat
git status

# Dacă nu este inițializat:
git init
```

### Pasul 4.2: Verifică .gitignore

Asigură-te că `.env` este în `.gitignore`:

```bash
# Verifică
cat .gitignore | grep -E "^\.env$|^\.env\.|\.env"
```

Ar trebui să vezi:
```
.env
.env.local
.env.*.local
```

### Pasul 4.3: Adaugă remote (dacă nu există)

```bash
# Verifică remote-urile existente
git remote -v

# Dacă nu există remote pentru backend:
git remote add backend https://github.com/farme-ro/backend.git

# SAU pentru un repo nou:
git remote add origin https://github.com/your-username/farmero-backend.git
```

### Pasul 4.4: Commit și push

```bash
# Adaugă toate fișierele (exceptând .env)
git add .

# Verifică ce va fi commit-at
git status

# Commit
git commit -m "Initial commit: Backend setup with Neon PostgreSQL"

# Push la branch-ul principal
git push -u backend chore/style-sync-live
# SAU
git push -u origin main
```

---

## 5. Configurare Environment Variables

### 5.1 Vercel

1. Mergi în **Vercel Dashboard** → Proiectul tău → **Settings** → **Environment Variables**

2. Adaugă următoarele variabile:

| Name | Value | Environment |
|------|-------|-------------|
| `DATABASE_URL` | `postgresql://...` (de la Neon) | Production, Preview, Development |
| `JWT_SECRET` | `<secret-generat>` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production |
| `FRONTEND_URL` | `https://farme.ro` | Production |
| `STRIPE_SECRET_KEY` | `sk_live_...` | Production |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Production |

3. Click **Save**

4. **Redeploy** proiectul pentru ca variabilele să fie aplicate

### 5.2 Railway

1. Mergi în **Railway Dashboard** → Proiectul tău → **Variables**

2. Adaugă aceleași variabile ca mai sus

3. Railway va redeploy automat

### 5.3 Render

1. Mergi în **Render Dashboard** → Serviciul tău → **Environment**

2. Adaugă variabilele

3. Click **Save Changes** → Render va redeploy automat

---

## 6. Verificare și Testare

### Pasul 6.1: Testare locală

```bash
# Pornește serverul
npm run dev

# În alt terminal, testează endpoint-urile
curl http://localhost:3001/health
curl http://localhost:3001/products
curl http://localhost:3001/regions
```

### Pasul 6.2: Testare pe producție

După deploy pe Vercel/Railway/Render:

```bash
# Testează health check
curl https://api.farme.ro/health

# Testează produse publice
curl https://api.farme.ro/products

# Testează regiuni
curl https://api.farme.ro/regions
```

### Pasul 6.3: Verifică log-urile

- **Vercel:** Dashboard → Deployments → Click pe deployment → Logs
- **Railway:** Dashboard → Deployments → View Logs
- **Render:** Dashboard → Logs

---

## 7. Rezolvare Probleme Comune

### Problema 1: "Environment variable not found: DATABASE_URL"

**Cauză:** `DATABASE_URL` nu este setat în environment variables.

**Soluție:**
1. Verifică că ai adăugat `DATABASE_URL` în Vercel/Railway/Render
2. Fă redeploy după ce adaugi variabila
3. Verifică că connection string-ul este corect (începe cu `postgresql://`)

### Problema 2: "Prisma schema validation error"

**Cauză:** Schema Prisma are erori sau migrațiile nu sunt aplicate.

**Soluție:**
```bash
# Verifică schema
npx prisma validate

# Aplică migrațiile din nou
npx prisma migrate deploy

# Regenerare Prisma Client
npx prisma generate
```

### Problema 3: "Connection timeout" sau "Connection refused"

**Cauză:** Connection string-ul este incorect sau baza de date nu este accesibilă.

**Soluție:**
1. Verifică connection string-ul în Neon Dashboard
2. Asigură-te că ai `?sslmode=require` la sfârșit
3. Verifică că IP-ul nu este blocat (Neon permite conexiuni de oriunde by default)

### Problema 4: "JWT_SECRET is not set"

**Cauză:** `JWT_SECRET` nu este setat în environment variables.

**Soluție:**
1. Generează un secret: `node generate-jwt-secret.js`
2. Adaugă-l în environment variables pe platforma de deploy
3. Fă redeploy

### Problema 5: "Route not found" pentru `/products`

**Cauză:** Rutele nu sunt montate corect sau build-ul a eșuat.

**Soluție:**
1. Verifică log-urile de build pe Vercel/Railway/Render
2. Verifică că `src/index.ts` are `app.use('/products', publicRoutes);`
3. Verifică că build-ul TypeScript a reușit: `npm run build`

---

## 8. Checklist Final

### Pre-Deploy

- [ ] Cont Neon creat și proiect configurat
- [ ] Connection string obținut de la Neon
- [ ] `.env` creat local cu `DATABASE_URL` și `JWT_SECRET`
- [ ] Migrațiile Prisma aplicate: `npx prisma migrate deploy`
- [ ] Prisma Client generat: `npx prisma generate`
- [ ] Testare locală: `npm run dev` funcționează
- [ ] `.env` verificat că este în `.gitignore`

### Deploy Git

- [ ] Git repo inițializat sau remote configurat
- [ ] Toate fișierele adăugate: `git add .`
- [ ] Commit făcut: `git commit -m "..."`  
- [ ] Push la remote: `git push`

### Deploy Platform (Vercel/Railway/Render)

- [ ] Proiect creat pe platformă
- [ ] Git repo conectat
- [ ] Environment variables adăugate:
  - [ ] `DATABASE_URL`
  - [ ] `JWT_SECRET`
  - [ ] `NODE_ENV=production`
  - [ ] `FRONTEND_URL`
  - [ ] `STRIPE_SECRET_KEY` (opțional)
  - [ ] `STRIPE_WEBHOOK_SECRET` (opțional)
- [ ] Build settings configurate:
  - [ ] Build Command: `npm run build`
  - [ ] Start Command: `npm start` (sau automat pentru Vercel)
  - [ ] Output Directory: `dist` (dacă e necesar)
- [ ] Deploy inițial făcut
- [ ] Deploy reușit (verifică log-urile)

### Post-Deploy

- [ ] Health check funcționează: `curl https://api.farme.ro/health`
- [ ] Endpoint-uri publice funcționează: `/products`, `/regions`
- [ ] Log-urile nu arată erori
- [ ] Database conexiune funcționează (verifică în Neon Dashboard)

---

## 📚 Resurse Suplimentare

- [Neon Documentation](https://neon.tech/docs)
- [Prisma Migrate Guide](https://www.prisma.io/docs/guides/migrate)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Railway Environment Variables](https://docs.railway.app/develop/variables)
- [Render Environment Variables](https://render.com/docs/environment-variables)

---

## 🆘 Suport

Dacă întâmpini probleme:

1. Verifică log-urile de build și runtime pe platforma de deploy
2. Verifică că toate environment variables sunt setate corect
3. Verifică că migrațiile Prisma sunt aplicate
4. Consultă documentația platformei de deploy
5. Verifică că connection string-ul Neon este corect și accesibil

---

**Ultima actualizare:** 2025-01-27  
**Versiune:** 1.0.0
