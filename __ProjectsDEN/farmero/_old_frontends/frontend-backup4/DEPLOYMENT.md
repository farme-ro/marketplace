# Deployment Guide - Backend Farme.ro

Acest ghid descrie procesul de deployment al backend-ului Farme.ro pe platforme cloud (Railway, Render, Fly.io).

## 📋 Provider Recomandat

**Railway** este recomandat pentru:
- ✅ Setup rapid și simplu
- ✅ PostgreSQL integrat
- ✅ Environment variables management ușor
- ✅ Auto-deploy din Git
- ✅ Free tier generos pentru început
- ✅ Suport pentru Node.js și PostgreSQL

**Alternative**:
- **Render** - Similar cu Railway, free tier disponibil
- **Fly.io** - Bun pentru global distribution
- **Heroku** - Clasic, dar cu costuri mai mari

---

## 🚀 Pași de Deployment

### 1. Pregătire Repository

Asigură-te că repository-ul este pregătit:
- ✅ Toate fișierele sunt commit-ate
- ✅ `.env` este în `.gitignore`
- ✅ `package.json` are scripturile corecte
- ✅ **Git user este setat corect**: `farme-ro <farme-ro@users.noreply.github.com>`

**Verificare Git user:**
```bash
git config user.name    # Trebuie să fie: farme-ro
git config user.email   # Trebuie să fie: farme-ro@users.noreply.github.com
```

**Dacă nu este setat corect:**
```bash
git config user.name "farme-ro"
git config user.email "farme-ro@users.noreply.github.com"
```

### 2. Creare Proiect pe Railway

1. **Creează cont Railway**: https://railway.app
2. **New Project** → **Deploy from GitHub repo**
3. Selectează repository-ul backend

### 3. Configurare Baza de Date PostgreSQL

1. În proiectul Railway, click **+ New** → **Database** → **PostgreSQL**
2. Railway va crea automat o bază de date PostgreSQL
3. **Copiază `DATABASE_URL`** din variabilele de mediu ale bazei de date

### 4. Setare Environment Variables

În proiectul Railway, mergi la **Variables** și adaugă:

#### Variabile Obligatorii

```env
# Database (copiat automat de Railway când adaugi PostgreSQL)
DATABASE_URL=postgresql://user:password@host:port/database

# Server
PORT=3001
NODE_ENV=production
HOST=0.0.0.0

# CORS - URL-ul frontend-ului
# Production: https://farme.ro
# Vercel preview: https://farme-ro-*.vercel.app (pattern matching automat)
CORS_ORIGIN=https://farme.ro,https://farme-ro-*.vercel.app
# Pentru staging:
# CORS_ORIGIN=https://staging.farme.ro,http://localhost:3000

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_EXPIRES_IN=7d

# Stripe (obține din Stripe Dashboard)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@farme.ro

# Frontend URL (pentru redirect-uri Stripe și emailuri)
FRONTEND_URL=https://farme.ro
```

#### Generare JWT_SECRET

Pentru producție, generează un secret sigur:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Configurare Build și Start

Railway detectează automat:
- **Build Command**: `npm run build`
- **Start Command**: `npm start`

Acestea sunt deja configurate în `package.json`:
- `build`: `prisma generate && tsc` - Generează Prisma Client și compilează TypeScript
- `start`: `node dist/index.js` - Rulează aplicația compilată

### 6. Rulare Migrații

Railway va rula automat `npm install` și `npm run build` la deploy.

**Pentru migrații**, adaugă un **Deploy Hook** sau rulează manual:

#### Opțiunea 1: Deploy Hook (Recomandat)

Creează un script `railway-postbuild.sh`:
```bash
#!/bin/bash
npx prisma migrate deploy
```

Sau adaugă în `package.json`:
```json
"scripts": {
  "postbuild": "prisma migrate deploy"
}
```

#### Opțiunea 2: Manual (Primul Deploy)

După primul deploy, conectează-te la Railway CLI:
```bash
npm install -g @railway/cli
railway login
railway link
railway run npx prisma migrate deploy
```

### 7. Verificare Deployment

1. **Verifică logs**: Railway → Deployments → View Logs
2. **Testează health check**: `https://your-app.railway.app/health`
3. **Verifică API**: `https://your-app.railway.app/`

---

## 🔧 Configurare pentru Render

### 1. Creare Serviciu

1. **New** → **Web Service**
2. Conectează repository-ul
3. Configurează:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Environment**: `Node`

### 2. Creare PostgreSQL Database

1. **New** → **PostgreSQL**
2. Copiază `DATABASE_URL` internă (pentru același serviciu)

### 3. Environment Variables

Adaugă aceleași variabile ca la Railway.

### 4. Migrații

Render rulează automat `npm install` și `npm run build`.

Pentru migrații, adaugă în **Build Command**:
```bash
npm run build && npx prisma migrate deploy
```

---

## 🪂 Configurare pentru Fly.io

### 1. Instalare Fly CLI

```bash
curl -L https://fly.io/install.sh | sh
fly auth login
```

### 2. Inițializare Proiect

```bash
fly launch
```

### 3. Creare PostgreSQL

```bash
fly postgres create --name farmero-db
fly postgres attach farmero-db
```

### 4. Configurare fly.toml

```toml
[build]
  builder = "paketobuildpacks/builder:base"

[env]
  PORT = "3001"
  NODE_ENV = "production"

[[services]]
  http_checks = []
  internal_port = 3001
  processes = ["app"]
  protocol = "tcp"
  script_checks = []

  [services.concurrency]
    hard_limit = 25
    soft_limit = 20
    type = "connections"

  [[services.ports]]
    force_https = true
    handlers = ["http"]
    port = 80

    [[services.ports]]
      handlers = ["tls", "http"]
      port = 443

  [[services.tcp_checks]]
    grace_period = "1s"
    interval = "15s"
    restart_limit = 0
    timeout = "2s"
```

### 5. Deploy

```bash
fly deploy
```

---

## 📦 Build și Start

### Comenzi de Build

```bash
# Development
npm run dev

# Production build
npm run build
# Aceasta rulează: prisma generate && tsc
```

### Comenzi de Start

```bash
# Development
npm run dev

# Production
npm start
# Aceasta rulează: node dist/index.js
```

### Build Chain

Ordinea de execuție la deploy:
1. `npm install` - Instalează dependențe
2. `postinstall` (dacă există) - Rulează `prisma generate`
3. `npm run build` - Rulează `prisma generate && tsc`
4. `npm start` - Rulează `node dist/index.js`

**Notă**: `prisma generate` rulează de 2 ori (în postinstall și build) pentru a se asigura că Prisma Client este generat corect.

### Migrații la Deploy

**Opțiunea 1: Deploy Hook (Recomandat)**

Adaugă în `package.json`:
```json
"scripts": {
  "postbuild": "prisma migrate deploy"
}
```

Aceasta va rula automat migrațiile după build.

**Opțiunea 2: Manual**

După deploy, rulează:
```bash
npx prisma migrate deploy
```

**Opțiunea 3: Railway Deploy Hook**

În Railway, adaugă un **Deploy Hook**:
- **Command**: `npx prisma migrate deploy`
- **Run After**: `Deploy`

---

## 🌱 Seed Data (Optional - Doar pentru Demo/Staging)

**⚠️ ATENȚIE**: Nu rulează seed-ul în producție cu date reale!

Pentru un environment de demo/staging:

```bash
# Conectează-te la environment
railway run npx prisma db seed
# sau
fly ssh console
npx prisma db seed
```

**Credențiale demo** (vezi `prisma/seed.ts`):
- Admin: `admin@farme.ro` / `Admin123!`
- Producători: `ferma.verde@farme.ro` / `Producer123!`
- Clienți: `client@farme.ro` / `Client123!`

---

## 🔒 Securitate

### Checklist Pre-Deploy

- ✅ `JWT_SECRET` este un string aleator de minim 32 caractere
- ✅ `DATABASE_URL` nu este commit-at în Git
- ✅ `STRIPE_SECRET_KEY` este cheia live (nu test)
- ✅ `STRIPE_WEBHOOK_SECRET` este configurat corect
- ✅ `CORS_ORIGIN` include doar domeniile frontend-ului
- ✅ `NODE_ENV=production`
- ✅ Rate limiting este activat
- ✅ Error handling nu expune detalii sensibile

### Webhook Stripe

După deploy, configurează webhook-ul Stripe:
1. Mergi în Stripe Dashboard → Webhooks
2. Adaugă endpoint: `https://your-app.railway.app/api/payments/webhook`
3. Selectează evenimente: `checkout.session.completed`
4. Copiază **Signing secret** și adaugă-l în `STRIPE_WEBHOOK_SECRET`

---

## 📊 Monitoring

### Health Check

Endpoint-ul `/health` poate fi folosit pentru monitoring:
```bash
curl https://your-app.railway.app/health
# Răspuns: {"status":"ok"}
```

### Logs

- **Railway**: View Logs în dashboard
- **Render**: Logs în dashboard
- **Fly.io**: `fly logs`

---

## 🐛 Troubleshooting

### Eroare: "Prisma Client not generated"

**Soluție**: Asigură-te că `prisma generate` rulează în build:
```json
"build": "prisma generate && tsc"
```

### Eroare: "Database connection failed"

**Soluție**: 
1. Verifică `DATABASE_URL` în environment variables
2. Verifică că baza de date este accesibilă
3. Verifică firewall-ul (Railway/Render/Fly gestionează automat)

### Eroare: "Port already in use"

**Soluție**: Asigură-te că `PORT` este setat corect:
```env
PORT=3001
```

Platformele cloud setează automat `PORT`, dar poți seta manual.

### Eroare: "CORS error"

**Soluție**: Verifică `CORS_ORIGIN`:
```env
CORS_ORIGIN=https://farme.ro,https://www.farme.ro
```

Nu include trailing slash!

### Eroare: "Migration failed"

**Soluție**: 
1. Verifică că migrațiile sunt commit-ate în Git
2. Rulează manual: `npx prisma migrate deploy`
3. Verifică logs pentru detalii

---

## 📝 Checklist Final

Înainte de deploy:

- [ ] Repository este commit-at și push-at
- [ ] `.env` este în `.gitignore`
- [ ] `DATABASE_URL` este setat
- [ ] `JWT_SECRET` este generat și setat
- [ ] `STRIPE_SECRET_KEY` și `STRIPE_WEBHOOK_SECRET` sunt setate
- [ ] `CORS_ORIGIN` include domeniul frontend-ului
- [ ] `NODE_ENV=production`
- [ ] Migrațiile sunt commit-ate
- [ ] Build-ul funcționează local: `npm run build`
- [ ] Health check funcționează: `curl http://localhost:3001/health`

După deploy:

- [ ] Health check funcționează: `curl https://your-app.railway.app/health`
- [ ] API funcționează: `curl https://your-app.railway.app/`
- [ ] Migrațiile sunt aplicate
- [ ] Webhook Stripe este configurat
- [ ] Logs nu arată erori
- [ ] CORS funcționează (testează din frontend)

---

## 🚀 Quick Start (Railway)

1. **Creează cont**: https://railway.app
2. **New Project** → **Deploy from GitHub**
3. **Add PostgreSQL** → Copiază `DATABASE_URL`
4. **Add Variables**:
   - `DATABASE_URL` (copiat)
   - `JWT_SECRET` (generat)
   - `CORS_ORIGIN` (domeniul frontend)
   - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
   - `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS`
5. **Deploy** → Railway va rula automat build și start
6. **Run Migrations**: Adaugă `postbuild` script sau rulează manual
7. **Configure Stripe Webhook**: Adaugă URL-ul în Stripe Dashboard

---

**Ultima actualizare**: 2024

