# 🌱 Instrucțiuni Seed Data

**Status:** Endpoint-ul `/products` returnează array gol - trebuie să rulezi seed data!

---

## 🔍 Problema

Endpoint-ul `GET /products` funcționează corect, dar returnează:
```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 0,
    "totalPages": 0
  }
}
```

**Cauză:** Nu există produse în baza de date. Trebuie să rulezi seed data.

---

## ✅ Soluție: Rulează Seed Data

### Pasul 1: Verifică Environment Variables

Asigură-te că `DATABASE_URL` este setat corect în `.env`:

```env
DATABASE_URL="postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require"
```

### Pasul 2: Aplică Migrațiile (dacă nu sunt aplicate)

```bash
cd backend
npx prisma migrate deploy
npx prisma generate
```

### Pasul 3: Rulează Seed Data

```bash
cd backend
npm run prisma:seed
```

**SAU direct:**

```bash
cd backend
npx tsx prisma/seed.ts
```

---

## 📊 Ce Creează Seed Data

După rulare, vei avea:

- ✅ **1 admin:** `admin@farme.ro` / `Admin123!`
- ✅ **3 producători APPROVED:**
  - `ferma.verde@farme.ro` / `Producer123!`
  - `gospodaria.bunicii@farme.ro` / `Producer123!`
  - `fructe.deal@farme.ro` / `Producer123!`
- ✅ **~45 produse** cu date complete (imagini, categorii, unități)
- ✅ **3 clienți:**
  - `client@farme.ro` / `Client123!`
  - `firma@farme.ro` / `Client123!`
  - `maria.ionescu@farme.ro` / `Client123!`
- ✅ **5 comenzi demo** (B2C și B2B) cu status-uri variate

---

## 🔍 Verificare

După rularea seed data, testează din nou:

```bash
curl https://api.farme.ro/products
```

**Răspuns așteptat:**
```json
{
  "data": [
    {
      "id": "...",
      "name": "Roșii de grădină",
      "price": 8.5,
      ...
    },
    ...
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 45,
    "totalPages": 4
  }
}
```

---

## ⚠️ Notă Importantă

**Pentru Production (Vercel):**

Seed data trebuie rulat direct pe baza de date de producție:

1. **Opțiunea 1: Local cu DATABASE_URL de producție**
   ```bash
   # Setează DATABASE_URL în .env cu connection string-ul de producție
   npm run prisma:seed
   ```

2. **Opțiunea 2: Vercel CLI**
   ```bash
   vercel env pull .env.production
   npm run prisma:seed
   ```

3. **Opțiunea 3: Neon SQL Editor**
   - Rulează seed data direct în Neon Dashboard → SQL Editor
   - (Nu recomandat - mai bine folosești script-ul)

---

## 🎯 Următorii Pași

1. ✅ Rulează seed data
2. ✅ Verifică că produsele apar în `/products`
3. ✅ Testează alte endpoint-uri
4. ✅ Verifică integrarea cu frontend-ul

---

**Status:** ⚠️ **Endpoint funcționează, dar lipsește seed data!**

