# 🚀 Ghid: Configurare Frontend în Vercel

## ✅ Verificare Pre-configurare

Frontend-ul este deja configurat corect:
- ✅ `credentials: 'include'` este setat în `apiClient.ts` (linia 162, 334)
- ✅ Pagina `/status` este disponibilă pentru verificare
- ✅ API client-ul este pregătit să se conecteze la backend

## 📋 Pași pentru Configurare în Vercel

### Pasul 1: Accesează Vercel Dashboard

1. Mergi la [Vercel Dashboard](https://vercel.com/dashboard)
2. Selectează proiectul **frontend** (sau numele proiectului tău)

### Pasul 2: Setează Variabilele de Mediu

1. În meniul lateral, click pe **Settings**
2. Click pe **Environment Variables** (în secțiunea "General")

### Pasul 3: Adaugă Variabilele Obligatorii

#### Variabilă 1: NEXT_PUBLIC_API_URL (OBLIGATORIU) ⚠️

**Acțiune:**
1. Click pe **Add New**
2. Completează:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://api.farme.ro` (sau URL-ul real al backend-ului)
   - **Environment:** Bifează cel puțin:
     - ✅ **Production**
     - ✅ **Preview** (opțional, pentru testare)
     - ✅ **Development** (opțional, pentru development)
3. Click **Save**

**Verificare:**
- Variabila trebuie să fie vizibilă în listă
- Value trebuie să fie exact `https://api.farme.ro` (fără slash la final)

#### Variabilă 2: NEXT_PUBLIC_APP_URL (Recomandat)

**Acțiune:**
1. Click pe **Add New**
2. Completează:
   - **Name:** `NEXT_PUBLIC_APP_URL`
   - **Value:** `https://farme.ro` (sau domeniul tău Vercel)
   - **Environment:** ✅ **Production**, ✅ **Preview**
3. Click **Save**

#### Variabilă 3: NEXT_PUBLIC_SITE_URL (Recomandat)

**Acțiune:**
1. Click pe **Add New**
2. Completează:
   - **Name:** `NEXT_PUBLIC_SITE_URL`
   - **Value:** `https://farme.ro` (sau domeniul tău Vercel)
   - **Environment:** ✅ **Production**, ✅ **Preview**
3. Click **Save**

#### Variabilă 4: NEXT_PUBLIC_SOCKET_URL (Opțional)

**Doar dacă backend-ul suportă WebSocket:**

1. Click pe **Add New**
2. Completează:
   - **Name:** `NEXT_PUBLIC_SOCKET_URL`
   - **Value:** `wss://api.farme.ro` (pentru WebSocket)
   - **Environment:** ✅ **Production**
3. Click **Save**

**Notă:** Dacă nu setezi această variabilă, WebSocket va folosi `NEXT_PUBLIC_API_URL` convertit automat.

### Pasul 4: Redeploy Aplicația

**IMPORTANT:** După ce adaugi variabilele, trebuie să faci redeploy pentru ca modificările să aibă efect.

**Opțiunea 1: Redeploy din Dashboard**
1. Mergi la **Deployments**
2. Click pe **...** (three dots) pe ultimul deployment
3. Selectează **Redeploy**
4. Așteaptă ca deploy-ul să se finalizeze (1-2 minute)

**Opțiunea 2: Push nou commit**
1. Fă un commit mic (ex: `git commit --allow-empty -m "trigger redeploy"`)
2. Push: `git push`
3. Vercel va detecta automat și va face deploy

### Pasul 5: Verifică Configurarea

1. Accesează `https://farme.ro/status` (sau domeniul tău Vercel)
2. Verifică că:
   - ✅ **API URL** arată `https://api.farme.ro` (nu `http://localhost:3001`)
   - ✅ **Backend API** este **OK** (verde)
   - ✅ **Database** este **OK** (dacă backend-ul raportează statusul DB)

## 🔍 Verificare Avansată

### Verifică în Browser Console

1. Deschide Developer Tools (F12)
2. Mergi la tab-ul **Console**
3. Caută mesaje de tip:
   - ✅ `API URL: https://api.farme.ro` (corect)
   - ⚠️ `NEXT_PUBLIC_API_URL is not set. Using default: http://localhost:3001` (necesită configurare)
   - ❌ `NEXT_PUBLIC_API_URL is not configured` (eroare critică)

### Verifică Network Requests

1. Deschide Developer Tools (F12)
2. Mergi la tab-ul **Network**
3. Filtrează după "api.farme.ro"
4. Verifică că:
   - Request-urile merg către `https://api.farme.ro`
   - Headers includ `credentials: include`
   - Cookies sunt trimise (dacă utilizatorul este autentificat)

### Verifică că Credentials sunt Setate

**Verificare automată:**
- Frontend-ul folosește `credentials: 'include'` în toate request-urile
- Verificat în: `src/lib/api/apiClient.ts` (linia 162, 334)

**Verificare manuală:**
1. Deschide Developer Tools (F12)
2. Network tab → Selectează un request către `api.farme.ro`
3. Verifică în tab-ul **Headers**:
   - Request Headers → `credentials: include` (implicit în fetch)
   - Request Headers → `Cookie: ...` (dacă există cookies)

## 🛠️ Troubleshooting

### Problema 1: API URL arată "http://localhost:3001" în production

**Cauză:** Variabila `NEXT_PUBLIC_API_URL` nu este setată sau nu ai făcut redeploy.

**Soluție:**
1. Verifică că variabila este setată în Vercel (Settings → Environment Variables)
2. Verifică că variabila este setată pentru environment-ul corect (Production)
3. Fă redeploy după ce ai adăugat variabila

### Problema 2: Backend API arată ERROR în `/status`

**Cauză:** Backend-ul nu răspunde sau nu este accesibil.

**Soluție:**
1. Verifică că backend-ul rulează la `https://api.farme.ro`
2. Testează manual: `curl https://api.farme.ro/health`
3. Verifică CORS-ul pe backend să permită request-uri de la `https://farme.ro`

### Problema 3: Cookies nu sunt trimise

**Cauză:** CORS sau SameSite cookie settings.

**Soluție:**
- Frontend-ul folosește deja `credentials: 'include'`
- Backend-ul trebuie să permită credentials în CORS:
  ```javascript
  credentials: true
  ```
- Cookies trebuie să aibă `SameSite=None; Secure` pentru cross-origin

### Problema 4: 401 Unauthorized pentru request-uri autentificate

**Cauză:** Token-ul de autentificare nu este trimis sau este invalid.

**Soluție:**
1. Verifică că utilizatorul este logat
2. Verifică că cookies-urile sunt setate corect
3. Verifică că backend-ul validează token-ul corect

## 📝 Checklist Final

### Configurare Vercel
- [ ] `NEXT_PUBLIC_API_URL` setată în Vercel
- [ ] `NEXT_PUBLIC_APP_URL` setată în Vercel (opțional)
- [ ] `NEXT_PUBLIC_SITE_URL` setată în Vercel (opțional)
- [ ] Variabilele sunt setate pentru environment-ul corect (Production)
- [ ] Redeploy făcut după adăugarea variabilelor

### Verificare
- [ ] `/status` arată API URL corect (nu localhost)
- [ ] Backend API este OK în `/status`
- [ ] Request-urile merg către `https://api.farme.ro`
- [ ] Cookies sunt trimise în request-uri (dacă utilizatorul este autentificat)

## 🔗 Link-uri Utile

- [Vercel Environment Variables Documentation](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [CORS Configuration](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Backend Connection Guide](./BACKEND_CONNECTION_GUIDE.md)

## 📞 Suport

Dacă întâmpini probleme:
1. Verifică `/status` pentru diagnosticare
2. Verifică console-ul browser-ului pentru erori
3. Verifică Network tab pentru request-uri eșuate
4. Verifică logs-urile Vercel (Deployments → Select deployment → Functions)

