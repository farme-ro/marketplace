# 🚀 Prompt pentru Deploy Backend - Neon + Git

**Scop:** Configurare rapidă backend cu Neon PostgreSQL și deploy pe Git

---

## Prompt pentru repo-ul backend

Configurează backend-ul farme.ro pentru deploy cu Neon PostgreSQL și Git:

### 1. **Configurare Neon:**
   - Creează cont pe https://neon.tech
   - Creează proiect nou: "farmero-backend"
   - Obține connection string-ul (postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require)

### 2. **Configurare Locală:**
   - Creează `.env` cu DATABASE_URL (de la Neon) și JWT_SECRET (generat)
   - Verifică: `node -e "require('dotenv').config(); console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅' : '❌');"`

### 3. **Aplicare Migrații:**
   - `npx prisma migrate deploy`
   - `npx prisma generate`

### 4. **Deploy Git:**
   - `git init` (dacă nu există)
   - Verifică că `.env` este în `.gitignore`
   - `git remote add origin [URL]`
   - `git add . && git commit -m "Initial commit" && git push -u origin main`

### 5. **Verificare:**
   - `npm run dev`
   - `curl http://localhost:3001/health`
   - `curl http://localhost:3001/products`

---

## Quick start (copy-paste)

```bash
# 1. Configurează .env (după ce ai connection string de la Neon)
cd backend
# Editează .env manual cu connection string-ul tău de la Neon

# 2. Verifică configurarea
node -e "require('dotenv').config(); console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Missing'); console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');"

# 3. Aplică migrațiile
npx prisma migrate deploy
npx prisma generate

# 4. Deploy Git
git init
git add .
git commit -m "Initial commit: Backend setup with Neon PostgreSQL"
git remote add origin [YOUR_GIT_URL]
git branch -M main
git push -u origin main
```

---

## Checklist rapid

### Pre-Deploy
- [ ] Neon proiect creat
- [ ] Connection string obținut
- [ ] `.env` configurat (DATABASE_URL, JWT_SECRET)
- [ ] Migrații aplicate (`npx prisma migrate deploy`)
- [ ] Prisma Client generat (`npx prisma generate`)

### Deploy Git
- [ ] Git repo inițializat
- [ ] `.env` în `.gitignore`
- [ ] Commit și push făcut

### Deploy Platform (Vercel/Railway/Render)
- [ ] Environment variables setate:
  - [ ] `DATABASE_URL`
  - [ ] `JWT_SECRET`
  - [ ] `NODE_ENV=production`
- [ ] Deploy reușit
- [ ] Health check funcționează

---

## Documentație disponibilă

- `DEPLOY_SETUP_GUIDE.md` — Ghidă completă (pași detaliați)
- `DEPLOY_PROMPT.md` — Prompt rapid (acest fișier)
- `MIGRATION_APPLICATION_GUIDE.md` — Ghidă pentru aplicarea migrațiilor
- `STRIPE_SETUP_GUIDE.md` — Configurare Stripe
- `JWT_SECRET_SETUP.md` — Configurare JWT_SECRET

---

**Ultima actualizare:** 2025-01-27  
**Versiune:** 1.0.0
