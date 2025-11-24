# 🌱 Rulează Seed Data pe Production

**Status:** ⚠️ **DATABASE_URL lipsește local**

---

## 🎯 Opțiuni pentru Rulare Seed Data

### Opțiunea 1: Folosește DATABASE_URL de Production (Recomandat)

**Pasul 1:** Obține DATABASE_URL din Vercel Dashboard sau Neon Dashboard

**Pasul 2:** Creează fișier `.env` temporar în `backend/.env`:

```env
DATABASE_URL="postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="your-jwt-secret-here"
```

**Pasul 3:** Rulează seed data:
```bash
cd backend
npm run prisma:seed
```

**Pasul 4:** Șterge `.env` după rulare (pentru securitate)

---

### Opțiunea 2: Vercel CLI (Recomandat pentru Production)

```bash
# 1. Instalează Vercel CLI (dacă nu este instalat)
npm i -g vercel

# 2. Login în Vercel
vercel login

# 3. Pull environment variables
cd backend
vercel env pull .env.production

# 4. Rulează seed data
npm run prisma:seed

# 5. Șterge .env.production după rulare
rm .env.production
```

---

### Opțiunea 3: Direct în Neon Dashboard (SQL Editor)

**Nu recomandat** - mai bine folosești script-ul, dar dacă vrei:

1. Mergi în Neon Dashboard → SQL Editor
2. Rulează query-uri SQL manual pentru a crea date
3. (Nu este eficient - mai bine folosești script-ul)

---

### Opțiunea 4: Script cu DATABASE_URL din Environment

Poți rula seed data direct cu DATABASE_URL ca variabilă de mediu:

```bash
cd backend
DATABASE_URL="postgresql://..." npm run prisma:seed
```

---

## ⚠️ IMPORTANT

**Pentru Production:**
- Asigură-te că folosești **DATABASE_URL de production** (din Neon)
- Seed data va **șterge toate datele existente** și va crea date demo
- Dacă ai date importante în producție, fă backup înainte!

---

## ✅ Verificare După Rulare

După rularea seed data, testează:

```bash
curl https://api.farme.ro/products
```

Ar trebui să vezi ~45 produse în loc de array gol.

---

**Status:** ⏳ **Așteaptă configurare DATABASE_URL**

