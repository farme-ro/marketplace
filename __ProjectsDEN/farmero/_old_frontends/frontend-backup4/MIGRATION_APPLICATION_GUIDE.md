# 📋 Ghidă Aplicare Migrație Prisma

**Data:** 2025-01-27  
**Migrație:** `20250127120000_add_product_fields`  
**Status:** ⏳ **Așteaptă configurare DATABASE_URL**

---

## ⚠️ Precondiții

Pentru a aplica migrația, trebuie să ai:

1. ✅ **Fișier `.env`** în root-ul backend-ului
2. ✅ **DATABASE_URL** configurat cu conexiunea la PostgreSQL
3. ✅ **JWT_SECRET** configurat (minim 32 caractere)

---

## 📝 Pași pentru Aplicare Migrație

### Pasul 1: Creează fișierul `.env`

Creează un fișier `.env` în `backend/.env` cu următorul conținut:

```env
# Database
# IMPORTANT: Înlocuiește cu conexiunea ta reală la PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/farmero_db"

# Server
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# JWT Authentication
# IMPORTANT: Folosește o cheie secretă puternică (minim 32 caractere)
# Poți genera una cu: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=7d
```

**Exemple DATABASE_URL:**

**Local PostgreSQL:**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/farmero_db"
```

**Supabase:**
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@[PROJECT].supabase.co:5432/postgres?sslmode=require"
```

**Neon (Serverless PostgreSQL):**
```env
DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST]/[DATABASE]?sslmode=require"
```

**Railway / Render:**
```env
DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]"
```

---

### Pasul 2: Verifică Configurarea

Rulează scriptul de verificare:

```bash
cd backend
npm run check:config
```

**Rezultat așteptat:**
```
✅ DATABASE_URL                   postgresql://...
✅ JWT_SECRET                     ***
```

Dacă vezi erori, corectează `.env` și reîncearcă.

---

### Pasul 3: Aplică Migrația

**Opțiunea A: Development (recomandat pentru prima dată)**

```bash
cd backend
npx prisma migrate dev
```

**Ce face:**
- Aplică migrația pe baza de date
- Generează Prisma Client automat
- Creează o nouă migrație dacă ai modificări în schema

**Opțiunea B: Production (pentru deploy)**

```bash
cd backend
npx prisma migrate deploy
npx prisma generate
```

**Ce face:**
- Aplică doar migrările care nu au fost aplicate
- Nu modifică schema (doar aplică migrările existente)
- Trebuie să generezi Prisma Client manual cu `prisma generate`

---

### Pasul 4: Verifică Status Migrații

Verifică că migrația a fost aplicată:

```bash
cd backend
npx prisma migrate status
```

**Rezultat așteptat:**
```
Database schema is up to date!
```

Sau:

```
Following migration(s) have been applied:
  ✅ 20250127120000_add_product_fields
```

---

### Pasul 5: Verifică Schema în Baza de Date

Verifică că câmpurile noi există în tabelul `products`:

```bash
cd backend
npx prisma studio
```

Sau folosește un client PostgreSQL și verifică:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'products'
AND column_name IN ('unit', 'image_url', 'category', 'is_bio');
```

**Rezultat așteptat:**
```
unit        | text    | YES
image_url   | text    | YES
category    | text    | YES
is_bio      | boolean | NO (default: false)
```

---

## 🐛 Rezolvare Probleme

### Eroare: "Environment variable not found: DATABASE_URL"

**Cauză:** Fișierul `.env` nu există sau nu este în root-ul backend-ului.

**Soluție:**
1. Verifică că `.env` există în `backend/.env`
2. Verifică că conține `DATABASE_URL=...`
3. Rulează `npm run check:config` pentru verificare

---

### Eroare: "Can't reach database server"

**Cauză:** Conexiunea la baza de date eșuează.

**Soluție:**
1. Verifică că PostgreSQL rulează (dacă e local)
2. Verifică că `DATABASE_URL` este corect
3. Verifică firewall/network pentru conexiuni cloud
4. Testează conexiunea manual:
   ```bash
   psql "postgresql://user:password@host:port/database"
   ```

---

### Eroare: "Migration failed to apply"

**Cauză:** Migrația nu poate fi aplicată (de ex., câmpuri deja există).

**Soluție:**
1. Verifică statusul migrațiilor: `npx prisma migrate status`
2. Dacă migrația eșuează, verifică log-urile pentru detalii
3. Dacă câmpurile există deja, poți marca migrația ca aplicată:
   ```bash
   npx prisma migrate resolve --applied 20250127120000_add_product_fields
   ```

---

### Eroare: "P1012: Error validating datasource"

**Cauză:** Formatul `DATABASE_URL` este invalid.

**Soluție:**
- Format corect: `postgresql://user:password@host:port/database`
- Verifică că nu ai spații în jurul `=`
- Verifică că parola nu conține caractere speciale neescăpate

---

## ✅ Verificare Finală

După aplicarea migrației, verifică că:

1. ✅ Migrația apare ca aplicată: `npx prisma migrate status`
2. ✅ Câmpurile noi există în baza de date
3. ✅ Prisma Client este generat: `npx prisma generate`
4. ✅ Backend pornește fără erori: `npm run dev`

---

## 📚 Resurse

- **Documentație Prisma Migrations:** https://www.prisma.io/docs/concepts/components/prisma-migrate
- **Format DATABASE_URL:** https://www.prisma.io/docs/concepts/database-connectors/postgresql#connection-details
- **Ghidă Stripe:** `backend/STRIPE_SETUP_GUIDE.md`
- **Ghidă Testare:** `backend/TESTING_GUIDE.md`

---

## 🎯 Următorii Pași

După aplicarea migrației:

1. **Testează endpoint-urile:** `npm run test:endpoints`
2. **Testează integrarea:** Pornește backend și frontend, testează funcționalitățile
3. **Verifică că datele noi sunt returnate:** Testează API-ul public pentru produse

---

**Status:** 📋 **Ghidă pregătită - Așteaptă configurare DATABASE_URL**

