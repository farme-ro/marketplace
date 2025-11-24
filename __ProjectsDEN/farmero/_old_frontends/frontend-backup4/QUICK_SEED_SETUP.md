# ⚡ Quick Setup pentru Seed Data

**Problema:** Seed data necesită `DATABASE_URL` pentru a se conecta la baza de date.

---

## 🚀 Soluție Rapidă

### Pasul 1: Obține DATABASE_URL

**Opțiunea A: Din Neon Dashboard (Recomandat)**
1. Mergi la: https://console.neon.tech
2. Selectează proiectul
3. Click pe **"Connection Details"**
4. Copiază **Connection String**
5. Format: `postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require`

**Opțiunea B: Din Vercel Dashboard**
1. Mergi la: https://vercel.com/dashboard
2. Selectează proiectul `backend`
3. Settings → Environment Variables
4. Copiază valoarea pentru `DATABASE_URL`

---

### Pasul 2: Creează fișier `.env`

În `backend/.env`, adaugă:

```env
DATABASE_URL="postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="temporary-secret-for-seed-only"
```

**⚠️ IMPORTANT:** 
- Înlocuiește `DATABASE_URL` cu connection string-ul tău real
- `JWT_SECRET` poate fi orice string pentru seed (nu este folosit în seed)

---

### Pasul 3: Rulează Seed Data

```bash
cd backend
npm run prisma:seed
```

---

### Pasul 4: Verifică

```bash
curl https://api.farme.ro/products
```

Ar trebui să vezi produse în loc de array gol.

---

## 🔒 Securitate

**După rularea seed data:**
- Șterge sau comentează `DATABASE_URL` din `.env` dacă nu vrei să rămână acolo
- Sau folosește `.env.local` care este deja în `.gitignore`

---

**Status:** ⏳ **Așteaptă configurare DATABASE_URL**

