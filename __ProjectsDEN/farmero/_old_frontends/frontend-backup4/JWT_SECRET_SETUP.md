# Cum să generezi și să configurezi JWT_SECRET

## Generare JWT_SECRET

### Opțiunea 1: Folosind scriptul generat (Recomandat)

```bash
node generate-jwt-secret.js
```

Scriptul va genera 3 variante de secret-uri sigure:
- **Hex (128 caractere)** - cel mai sigur, recomandat pentru producție
- **Base64 (44 caractere)** - mai scurt, tot sigur
- **Base64 URL-safe (44 caractere)** - sigur și URL-friendly

### Opțiunea 2: Folosind Node.js direct

```bash
# Hex (128 caractere) - RECOMANDAT
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Base64 (44 caractere)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Base64 URL-safe (44 caractere)
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

### Opțiunea 3: Folosind OpenSSL (dacă ai instalat)

```bash
# Hex (128 caractere)
openssl rand -hex 64

# Base64 (44 caractere)
openssl rand -base64 32
```

## Configurare JWT_SECRET

### 1. Pentru Development Local

Creează sau actualizează fișierul `.env` în root-ul proiectului:

```env
JWT_SECRET=d9d77a75d0830e4947f8ac09e3f4675f9269cfa77b4f5f3194450988b4eb31c4f9efc30b4d9ae526161f945decefb62ad059e4a873a373ab79f554bbfcb7157e
JWT_EXPIRES_IN=7d
```

**⚠️ IMPORTANT:** Nu commit-a fișierul `.env` în git! Este deja în `.gitignore`.

### 2. Pentru Vercel (Production)

1. Mergi în **Vercel Dashboard** → Proiectul tău → **Settings** → **Environment Variables**

2. Adaugă următoarele variabile:
   - **Name:** `JWT_SECRET`
   - **Value:** `<secret-ul-generat>` (copiază unul dintre secret-urile generate)
   - **Environment:** Selectează `Production`, `Preview`, și `Development` (sau doar `Production`)

3. Click **Save**

4. **Redeploy** proiectul pentru ca variabilele să fie aplicate

### 3. Verificare

După ce ai setat `JWT_SECRET`, verifică că funcționează:

```bash
# Local
npm run dev
# Apoi testează un login - ar trebui să primești un JWT token valid
```

## Recomandări de Securitate

1. **Folosește secret-uri diferite pentru:**
   - Development (local)
   - Staging/Preview (Vercel preview deployments)
   - Production (Vercel production)

2. **Lungime minimă recomandată:**
   - Minimum 32 bytes (256 bits) pentru securitate bună
   - Recomandat: 64 bytes (512 bits) pentru securitate maximă

3. **Nu partaja secret-urile:**
   - Nu le commit-a în git
   - Nu le trimite prin email/mesaje
   - Folosește variabile de mediu pentru fiecare environment

4. **Rotește secret-urile periodic:**
   - În producție, planifică rotația secret-urilor (ex: la fiecare 6 luni)
   - Când rotești, utilizatorii vor trebui să se logheze din nou (token-urile vechi vor deveni invalide)

## Exemple de JWT_SECRET generate

**⚠️ NU folosi aceste exemple în producție!** Generează-ți propriile secret-uri.

```
# Hex (128 caractere) - RECOMANDAT
d9d77a75d0830e4947f8ac09e3f4675f9269cfa77b4f5f3194450988b4eb31c4f9efc30b4d9ae526161f945decefb62ad059e4a873a373ab79f554bbfcb7157e

# Base64 (44 caractere)
w53Sjwvs20Acw+X7CC5CMaW/ZZGMidNsyCNNTH63cg4=

# Base64 URL-safe (44 caractere)
WxzYjjCj08Z8CDWfju2Y4pdpoQA3woEi9OHsHDgeM98
```

## Troubleshooting

### Eroare: "JWT_SECRET is not set"

**Cauză:** Variabila de mediu `JWT_SECRET` nu este setată.

**Soluție:**
1. Verifică că ai adăugat `JWT_SECRET` în `.env` (pentru local) sau în Vercel Dashboard (pentru production)
2. Restart serverul după ce adaugi variabila
3. Pentru Vercel, fă un redeploy după ce adaugi variabila

### Token-urile JWT nu funcționează

**Cauză:** Secret-ul folosit pentru generare diferă de cel folosit pentru verificare.

**Soluție:**
1. Asigură-te că folosești același `JWT_SECRET` peste tot
2. Verifică că nu ai typo-uri în variabila de mediu
3. Verifică că ai făcut redeploy pe Vercel după ce ai adăugat variabila

