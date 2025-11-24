# 🔄 Instrucțiuni Redeploy Vercel

## ⚠️ IMPORTANT

După ce adaugi variabilele de mediu în Vercel, **trebuie să faci redeploy** pentru ca modificările să aibă efect.

## Opțiunea 1: Redeploy din Vercel Dashboard (Recomandat)

### Pași:

1. Mergi la [Vercel Dashboard](https://vercel.com/dashboard)
2. Selectează proiectul **frontend**
3. Click pe **Deployments** (în meniul de sus)
4. Găsește ultimul deployment
5. Click pe **...** (three dots) pe ultimul deployment
6. Selectează **Redeploy**
7. Alege environment-ul: **Production** (sau Preview dacă vrei să testezi)
8. Click **Redeploy**
9. Așteaptă 1-2 minute ca deploy-ul să se finalizeze

### Verificare:

După ce deploy-ul este finalizat:
1. Accesează `https://farme.ro/status`
2. Verifică că **API URL** arată `https://api.farme.ro` (nu `http://localhost:3001`)
3. Verifică că **Backend API** este **OK** (verde)

## Opțiunea 2: Push Commit pentru Deploy Automat

Dacă preferi să declanșezi deploy automat prin Git:

```bash
# Creează un commit gol (trigger pentru redeploy)
git commit --allow-empty -m "chore: trigger redeploy for env variables"

# Push
git push
```

Vercel va detecta automat push-ul și va face deploy.

## ✅ Verificare Finală

După redeploy, verifică:

1. **Pagina /status:**
   - Accesează `https://farme.ro/status`
   - Verifică că API URL este corect
   - Verifică că Backend API este OK

2. **Browser Console:**
   - Deschide Developer Tools (F12)
   - Verifică că nu apar erori despre `NEXT_PUBLIC_API_URL`

3. **Network Requests:**
   - Deschide Developer Tools → Network tab
   - Verifică că request-urile merg către `https://api.farme.ro`

## 🎯 Rezultat Așteptat

După redeploy:
- ✅ API URL arată `https://api.farme.ro` (nu localhost)
- ✅ Backend API este OK în `/status`
- ✅ Request-urile funcționează corect
- ✅ Aplicația este conectată la backend

