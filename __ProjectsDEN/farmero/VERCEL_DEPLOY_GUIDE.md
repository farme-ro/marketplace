# 🚀 Vercel Deploy Guide - farme.ro

## Pre-Deploy Setup

### 1. Verificare Local Build

#### Frontend
```bash
cd frontend
npm install
npm run lint
npm run build
```

#### Admin
```bash
cd admin
npm install
npm run lint
npm run build
```

### 2. Environment Variables

#### Frontend (.env.local sau Vercel)
```env
NEXT_PUBLIC_API_URL=https://api.farme.ro
NEXT_PUBLIC_APP_ENV=production
```

#### Admin (.env.local sau Vercel)
```env
NEXT_PUBLIC_API_URL=https://api.farme.ro
NEXT_PUBLIC_APP_ENV=production
```

### 3. Backend CORS Configuration

Verifică `backend/src/config/cors.ts`:
- ✅ `https://farme.ro` în whitelist
- ✅ `https://admin.farme.ro` în whitelist
- ✅ `*.vercel.app` pattern permis

---

## Deploy pe Vercel

### Opțiunea 1: Vercel CLI

#### Frontend
```bash
cd frontend
vercel --prod
```

#### Admin
```bash
cd admin
vercel --prod
```

### Opțiunea 2: Vercel Dashboard

1. **Conectează repo-ul:**
   - Mergi la https://vercel.com/dashboard
   - Click "Add New Project"
   - Selectează repo-ul GitHub/GitLab

2. **Configurează Frontend:**
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Environment Variables:** (vezi secțiunea 2)

3. **Configurează Admin:**
   - **Framework Preset:** Next.js
   - **Root Directory:** `admin`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Environment Variables:** (vezi secțiunea 2)

4. **Deploy:**
   - Click "Deploy"
   - Așteaptă build completion

---

## Post-Deploy

### 1. Verificare Health

```bash
# Frontend
curl https://farme.ro

# Admin
curl https://admin.farme.ro

# Backend
curl https://api.farme.ro/health
```

### 2. Smoke Tests

Vezi `DEPLOY_VERCEL_CHECKLIST.md` secțiunea 8.

### 3. Monitorizare

- **Vercel Logs:** Dashboard → Project → Deployments → Logs
- **Backend Logs:** Provider dashboard (Railway/Render/etc.)
- **Error Tracking:** Sentry (dacă este configurat)

---

## Troubleshooting

### Build Fails

**Cauze comune:**
- Dependencies lipsă
- TypeScript errors
- Environment variables lipsă

**Fix:**
1. Verifică logs Vercel
2. Rulează build local: `npm run build`
3. Verifică `package.json` dependencies

### 404 Errors

**Cauze comune:**
- Routing Next.js incorect
- `next.config.mjs` misconfigured

**Fix:**
1. Verifică `next.config.mjs`
2. Verifică routing în `app/` directory
3. Verifică Vercel routing rules

### CORS Errors

**Cauze comune:**
- Origin nepermis în backend CORS

**Fix:**
1. Verifică `backend/src/config/cors.ts`
2. Adaugă origin-ul în whitelist
3. Redeploy backend

---

## Next Steps

După deploy reușit:
1. ✅ Documentează în `DEPLOY_SUCCESS_REPORT.md`
2. ✅ Rulează smoke tests
3. ✅ Monitorizează primele 24h
4. ✅ Pregătește SUPERPROMPT POST-LIVE 1

