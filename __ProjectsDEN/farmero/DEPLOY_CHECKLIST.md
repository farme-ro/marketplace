# ✅ Checklist Deploy Backend - farme.ro

**Data:** 2025-01-27  
**Branch:** `chore/style-sync-live`  
**Status:** 🟢 **Gata pentru Deploy**

---

## 📋 Pre-Deploy Checklist

### ✅ Cod & Git
- [x] Toate modificările commit-ate
- [x] Push la GitHub făcut
- [x] Build TypeScript trece fără erori
- [x] Nu există fișiere necommit-ate

### ✅ Configurare Backend
- [x] `vercel.json` configurat corect
- [x] `package.json` cu script-uri corecte
- [x] Prisma schema actualizată
- [x] Migrații Prisma create

### ⚠️ Environment Variables (Verifică în Vercel Dashboard)

Asigură-te că următoarele variabile sunt setate în Vercel:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | Connection string Neon PostgreSQL |
| `JWT_SECRET` | ✅ | Secret pentru JWT tokens (min 32 chars) |
| `NODE_ENV` | ✅ | `production` pentru production |
| `FRONTEND_URL` | ✅ | `https://farme.ro` (sau URL-ul frontend-ului) |
| `PORT` | ⚠️ | Opțional (Vercel setează automat) |
| `STRIPE_SECRET_KEY` | ⚠️ | Dacă folosești Stripe |
| `STRIPE_WEBHOOK_SECRET` | ⚠️ | Dacă folosești Stripe webhooks |

---

## 🚀 Pași pentru Deploy

### Opțiunea 1: Deploy Automat (Recomandat)

Vercel detectează automat push-urile pe branch-ul `chore/style-sync-live` și face deploy.

**Verifică:**
1. Mergi în **Vercel Dashboard** → Proiectul `backend`
2. Verifică **Deployments** → Ar trebui să vezi un deploy nou în progres
3. Așteaptă finalizarea (2-3 minute)

### Opțiunea 2: Deploy Manual

Dacă deploy-ul automat nu s-a declanșat:

1. **Vercel CLI:**
   ```bash
   cd backend
   vercel --prod
   ```

2. **Sau din Dashboard:**
   - Mergi în Vercel Dashboard
   - Click pe proiect
   - Click **"Redeploy"** sau **"Deploy"**

---

## 🔍 Verificare Post-Deploy

### 1. Health Check
```bash
curl https://api.farme.ro/health
```

**Răspuns așteptat:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-27T..."
}
```

### 2. Test Endpoint Products
```bash
curl https://api.farme.ro/products
```

**Răspuns așteptat:**
```json
{
  "data": [...],
  "pagination": {...}
}
```

### 3. Test Endpoint Public
```bash
curl https://api.farme.ro/api/public/products
```

### 4. Verifică Logs
- Mergi în Vercel Dashboard → Proiect → **Logs**
- Verifică dacă există erori

---

## 🐛 Troubleshooting

### Eroare: "Environment variable not found: DATABASE_URL"
**Soluție:** Adaugă `DATABASE_URL` în Vercel Dashboard → Settings → Environment Variables

### Eroare: "Prisma Client not generated"
**Soluție:** Verifică că `postinstall` script rulează:
```json
"postinstall": "prisma generate"
```

### Eroare: "Migration not applied"
**Soluție:** Adaugă script în `package.json`:
```json
"vercel-build": "prisma generate && prisma migrate deploy && npm run build"
```

### Build-ul eșuează
**Soluție:** 
1. Verifică logs în Vercel Dashboard
2. Rulează `npm run build` local pentru a identifica erorile
3. Verifică că toate dependențele sunt în `package.json`

---

## 📊 Status Deploy

**Ultimul Commit:** `37acd50` - "feat: Add producer subscriptions endpoint and optimize queries"  
**Branch:** `chore/style-sync-live`  
**Repository:** `https://github.com/farme-ro/backend.git`

---

## ✅ Post-Deploy Actions

1. [ ] Verifică health endpoint
2. [ ] Testează endpoint-uri principale
3. [ ] Verifică logs pentru erori
4. [ ] Testează integrarea cu frontend-ul
5. [ ] Monitorizează performanța

---

**Status Final:** 🟢 **Gata pentru Deploy!**

