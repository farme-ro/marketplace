# Backend Scripts

Scripturi utile pentru backend-ul farme.ro

## 📋 Scripturi Disponibile

### test-endpoints.ts

Script pentru testare automată a endpoint-urilor backend.

**Usage:**
```bash
npm run test:endpoints
```

**Environment Variables:**
```env
BACKEND_URL=http://localhost:3001  # URL backend (default: http://localhost:3001)
TEST_EMAIL=test@example.com         # Email pentru testare
TEST_PASSWORD=test123               # Parolă pentru testare
```

**Ce testează:**
- Health check
- Public endpoints (regions, products, producers)
- Authentication
- Cart endpoints
- Orders endpoints
- Client endpoints
- Producer endpoints

**Output:**
- Listă toate testele cu status (pass/fail/skip)
- Durată pentru fiecare test
- Rezumat final

---

## 🔧 Adăugare Scripturi Noi

Pentru a adăuga un script nou:

1. Creează fișierul în `backend/scripts/`
2. Adaugă script în `package.json`:
   ```json
   "scripts": {
     "script-name": "tsx scripts/script-name.ts"
   }
   ```
3. Documentează în acest README

---

**Notă:** Scripturile folosesc `tsx` pentru a rula TypeScript direct, fără compilare.

