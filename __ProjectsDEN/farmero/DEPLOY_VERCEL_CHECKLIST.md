# 🚀 SUPERPROMPT DEPLOY - Checklist Complet

**Data:** 2025-01-27  
**Status:** ⏳ Ready pentru deploy

---

## 📋 Pre-Deploy Checklist

### 1. ENV VARS - FRONTEND (farme.ro)

**Proiect Vercel:** `farme-ro-frontend` (sau nume similar)

**Variabile necesare:**
```env
NEXT_PUBLIC_API_URL=https://api.farme.ro
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_... (dacă este cazul)
```

**Verificare:**
- ✅ Nu există secrets sensibile expuse ca `NEXT_PUBLIC_*`
- ✅ Toate variabilele sunt setate în Vercel Dashboard
- ✅ Environment: Production

---

### 2. ENV VARS - ADMIN (admin.farme.ro)

**Proiect Vercel:** `farme-ro-admin` (sau nume similar)

**Variabile necesare:**
```env
NEXT_PUBLIC_API_URL=https://api.farme.ro
NEXT_PUBLIC_APP_ENV=production
```

**Verificare:**
- ✅ Nu există secrets sensibile expuse ca `NEXT_PUBLIC_*`
- ✅ Toate variabilele sunt setate în Vercel Dashboard
- ✅ Environment: Production

---

### 3. BACKEND HEALTH & CORS

**Verificare CORS:**
- ✅ `backend/src/config/cors.ts` permite:
  - `https://farme.ro`
  - `https://admin.farme.ro`
  - `*.vercel.app` (pentru preview)

**Verificare Health:**
- ✅ `GET /health` → `{ status: 'ok', timestamp: '...' }`
- ✅ `GET /health/detailed` → Health check complet (DB, memory)

**Test local:**
```bash
curl http://localhost:3001/health
curl http://localhost:3001/health/detailed
```

---

### 4. BUILD CHECK LOCAL

#### Frontend
```bash
cd frontend
npm install
npm run lint
npm run build
```

**Verificare:**
- ✅ Build reușit fără erori
- ✅ Nu există warnings critice
- ✅ `.next` folder generat

#### Admin
```bash
cd admin
npm install
npm run lint
npm run build
```

**Verificare:**
- ✅ Build reușit fără erori
- ✅ Nu există warnings critice
- ✅ `.next` folder generat

#### Backend
```bash
cd backend
npm install
npx prisma migrate status
npm run build
```

**Verificare:**
- ✅ Build reușit
- ✅ Migrații aplicate (sau pregătite pentru producție)
- ✅ `dist` folder generat

---

### 5. MIGRAȚII DB

**Verificare migrații:**
```bash
cd backend
npx prisma migrate status
```

**Dacă există migrații neaplicate:**
```bash
# Pentru producție (nu dev!)
npx prisma migrate deploy
```

**Migrații noi (GDPR, Journal Translations):**
- ✅ `add_gdpr_models` - Modele GDPR
- ✅ `add_journal_translations` - Modele Journal Translations (dacă nu există deja)

---

### 6. CONFIGURARE VERCEL

#### Frontend Project

**Settings:**
- **Framework Preset:** Next.js
- **Root Directory:** `frontend` (sau `.` dacă repo-ul este doar frontend)
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

**Environment Variables:**
- `NEXT_PUBLIC_API_URL` = `https://api.farme.ro`
- `NEXT_PUBLIC_APP_ENV` = `production`

**Domains:**
- Production: `farme.ro`
- Custom domain: `www.farme.ro` (redirect la `farme.ro`)

#### Admin Project

**Settings:**
- **Framework Preset:** Next.js
- **Root Directory:** `admin`
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

**Environment Variables:**
- `NEXT_PUBLIC_API_URL` = `https://api.farme.ro`
- `NEXT_PUBLIC_APP_ENV` = `production`

**Domains:**
- Production: `admin.farme.ro`

---

### 7. DEPLOY PE VERCEL

#### Frontend
1. Conectează repo-ul la Vercel (dacă nu este deja)
2. Selectează branch `main` (sau branch-ul principal)
3. Configurează settings (vezi secțiunea 6)
4. Deploy

**Verificare:**
- ✅ Build reușit
- ✅ Deploy live
- ✅ Domain configurat

#### Admin
1. Conectează repo-ul la Vercel (dacă nu este deja)
2. Selectează branch `main` (sau branch-ul principal)
3. Configurează settings (vezi secțiunea 6)
4. Deploy

**Verificare:**
- ✅ Build reușit
- ✅ Deploy live
- ✅ Domain configurat

---

### 8. POST-DEPLOY SMOKE TESTS

#### Pe https://farme.ro

**Verificări:**
- ✅ Homepage se încarcă
- ✅ `/produse` - Listă produse
- ✅ `/producatori` - Listă producători
- ✅ `/despre-noi` - Pagină despre
- ✅ `/jurnal-de-farmero` - Listă articole
- ✅ `/jurnal-de-farmero/[slug]` - Articol individual
- ✅ `/sustine-farmero` - Pagină suport
- ✅ Login flow (client + producător) - măcar până la form
- ✅ Cookie banner funcționează
- ✅ PWA prompt apare (unde e suportat)
- ✅ Language switcher funcționează (nu modifică URL-ul)

#### Pe https://admin.farme.ro

**Verificări:**
- ✅ Login admin funcționează
- ✅ Dashboard se încarcă
- ✅ `/producers` - Listă producători
- ✅ `/orders` - Listă comenzi
- ✅ `/system/status` - Status sistem
- ✅ `/system/gdpr` - GDPR Compliance Center
- ✅ `/jurnal` - Journal Admin
- ✅ Paginile cu endpoint-uri neimplementate afișează mesaje "fallback" clare, nu erori

---

### 9. VERIFICARE ERORI

**Console Browser:**
- ✅ Nu există erori 500 în Network tab
- ✅ Nu există erori JavaScript critice în Console

**Vercel Logs:**
- ✅ Nu există erori de build
- ✅ Nu există erori runtime critice

**Backend Logs:**
- ✅ Health check OK
- ✅ Nu există erori CORS
- ✅ Nu există erori de autentificare

---

### 10. DOCUMENTARE DEPLOY

**Actualizează:**
- ✅ `PRE_DEPLOY_FINAL_SUMMARY.md` cu:
  - Data deploy
  - Commit hash
  - Link Vercel
  - Status endpoint-uri

**Creează:**
- ✅ `DEPLOY_SUCCESS_REPORT.md` cu:
  - Data și ora deploy
  - Versiune deployată
  - URL-uri live
  - Probleme întâlnite (dacă există)
  - Next steps

---

## 🚨 Troubleshooting

### Build Fails

**Frontend/Admin:**
- Verifică `package.json` dependencies
- Verifică TypeScript errors: `npm run type-check`
- Verifică lint errors: `npm run lint`

**Backend:**
- Verifică Prisma schema: `npx prisma validate`
- Verifică TypeScript: `npm run type-check`

### CORS Errors

**Symptom:** `CORS policy: No 'Access-Control-Allow-Origin' header`

**Fix:**
1. Verifică `backend/src/config/cors.ts`
2. Adaugă origin-ul în `STATIC_WHITELIST` sau `CORS_EXTRA_ORIGINS`
3. Redeploy backend

### Health Check Fails

**Symptom:** `GET /health` returnează 503

**Fix:**
1. Verifică conexiunea DB
2. Verifică `DATABASE_URL` în backend env vars
3. Verifică logs backend pentru erori

### 404 Errors

**Symptom:** Pagini returnează 404

**Fix:**
1. Verifică routing Next.js
2. Verifică `next.config.mjs` pentru redirects
3. Verifică Vercel routing rules

---

## ✅ Status Final

- ⏳ Ready pentru deploy
- ⏳ Așteaptă confirmare pentru deploy
- ⏳ Așteaptă verificare env vars
- ⏳ Așteaptă smoke tests

**Next Step:** Deploy pe Vercel! 🚀

