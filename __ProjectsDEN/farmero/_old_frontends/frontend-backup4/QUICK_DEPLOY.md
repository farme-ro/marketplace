# ⚡ Quick Deploy - api.farme.ro

## 🚀 Deploy în 3 Pași

### 1. Setează Environment Variables în Vercel

Mergi la: **Vercel Dashboard → Project → Settings → Environment Variables**

Adaugă:
```
DATABASE_URL=postgresql://neondb_owner:npg_wGiQ7SLEl6Re@ep-rapid-firefly-ag2wcvwd-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=d9d77a75d0830e4947f8ac09e3f4675f9269cfa77b4f5f3194450988b4eb31c4f9efc30b4d9ae526161f945decefb62ad059e4a873a373ab79f554bbfcb7157e
NODE_ENV=production
```

### 2. Deploy

**Opțiunea A: Vercel CLI**
```bash
cd backend
npx vercel --prod
```

**Opțiunea B: PowerShell Script**
```powershell
cd backend
.\deploy.ps1
```

**Opțiunea C: Vercel Dashboard**
- Mergi la Vercel Dashboard
- Click "Deploy" sau "Redeploy"
- Alege branch-ul `chore/style-sync-live` sau `main`

### 3. Verifică

```bash
curl https://api.farme.ro/health
```

**Expected:**
```json
{"status":"ok","timestamp":"...","database":"connected"}
```

---

## 🔧 După Deploy: Database Migrations

```bash
# Set DATABASE_URL local (sau folosește .env)
export DATABASE_URL="postgresql://neondb_owner:npg_wGiQ7SLEl6Re@ep-rapid-firefly-ag2wcvwd-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Run migrations
cd backend
npx prisma migrate deploy
```

---

## ✅ Done!

API-ul ar trebui să fie live la: **https://api.farme.ro**

Testează:
- `GET /health` - Health check
- `GET /products` - Products list
- `GET /health/detailed` - Detailed health check

