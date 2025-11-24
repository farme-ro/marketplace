# 🐳 Docker Setup pentru Development Local

**Scop:** Rulează PostgreSQL local cu Docker pentru testare seed data înainte de production.

---

## 🚀 Pași Rapizi

### 1. Pornește Docker Desktop

Asigură-te că Docker Desktop rulează pe Windows.

### 2. Pornește PostgreSQL Container

```bash
# Din root-ul proiectului
docker-compose up -d
```

**Verifică că container-ul rulează:**
```bash
docker ps
```

Ar trebui să vezi `farmero-postgres` în listă.

### 3. Configurează .env pentru Local

Creează `backend/.env`:

```env
DATABASE_URL="postgresql://farmero:farmero_dev_password@localhost:5432/farmero_db"
JWT_SECRET="d9d77a75d0830e4947f8ac09e3f4675f9269cfa77b4f5f3194450988b4eb31c4f9efc30b4d9ae526161f945decefb62ad059e4a873a373ab79f554bbfcb7157e"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

### 4. Aplică Migrațiile

```bash
cd backend
npx prisma migrate deploy
npx prisma generate
```

### 5. Rulează Seed Data

```bash
cd backend
npm run prisma:seed
```

### 6. Verifică

```bash
# Testează endpoint-ul local
curl http://localhost:3001/products
```

---

## 🛠 Comenzi Utile Docker

```bash
# Pornește container-ul
docker-compose up -d

# Oprește container-ul
docker-compose down

# Oprește și șterge volume-ul (șterge datele!)
docker-compose down -v

# Vezi logs
docker-compose logs -f postgres

# Verifică status
docker-compose ps
```

---

## 🔍 Verificare

După seed data, testează:

```bash
# Local
curl http://localhost:3001/products

# Sau deschide în browser
http://localhost:3001/products
```

Ar trebui să vezi ~45 produse!

---

## ⚠️ Notă

- **Datele sunt persistente** în Docker volume `postgres_data`
- Pentru a șterge tot și începe de la zero: `docker-compose down -v`
- **Nu commit-a** `.env` - este deja în `.gitignore`

---

**Status:** 🟢 **Gata pentru testare locală!**

