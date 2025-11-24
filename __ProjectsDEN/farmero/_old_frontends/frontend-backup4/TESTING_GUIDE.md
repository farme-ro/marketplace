# Testing Guide - Backend API

**Data:** 2025-01-27  
**Scop:** Ghidă completă pentru testarea backend-ului

## 📋 Opțiuni de Testare

### 1. Script Automat de Testare

Script TypeScript pentru testare automată a endpoint-urilor principale.

**Usage:**
```bash
npm run test:endpoints
```

**Configurare:**
Creează un fișier `.env` sau setează variabilele:
```env
BACKEND_URL=http://localhost:3001
TEST_EMAIL=test@example.com
TEST_PASSWORD=test123
```

**Ce testează:**
- Health check
- Public endpoints
- Authentication
- Cart endpoints
- Orders endpoints
- Client endpoints
- Producer endpoints

**Output:**
- ✅/❌ pentru fiecare test
- Durată pentru fiecare test
- Rezumat final

---

### 2. Testare Manuală cu Postman

**Setup:**
1. Importă colecția Postman (dacă există)
2. Sau creează request-uri manual

**Workflow:**
1. **Login** - `POST /auth/login` → salvează token
2. **Set Token** - Adaugă token în header: `Authorization: Bearer <token>`
3. **Testează endpoint-uri** - Folosește token-ul pentru request-uri protejate

**Checklist:** Vezi `ENDPOINT_TESTING_CHECKLIST.md`

---

### 3. Testare cu curl

**Exemple:**

```bash
# Health check
curl http://localhost:3001/health

# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Get cart (cu token)
curl http://localhost:3001/cart \
  -H "Authorization: Bearer <token>"
```

---

### 4. Verificare Configurare

Verifică dacă toate variabilele de mediu sunt setate corect:

```bash
npm run check:config
```

**Ce verifică:**
- ✅ Variabile obligatorii (DATABASE_URL, JWT_SECRET)
- ✅ Variabile opționale (Stripe, Email)
- ✅ Validare format (JWT_SECRET >= 32 caractere, etc.)

---

## 🧪 Scenarii de Testare

### Scenariu 1: Flux Complet Client

1. Register client nou
2. Login
3. Browse produse (public API)
4. Adaugă în coș
5. Checkout
6. Verifică comandă

### Scenariu 2: Flux Complet Producător

1. Register producător
2. Login
3. Creează produs
4. Verifică produs în pending
5. (Admin) Aprobă produs
6. Verifică produs în public API

### Scenariu 3: Flux Comandă

1. Client adaugă produse în coș
2. Client face checkout
3. Producător vede comandă
4. Producător actualizează status
5. Client vede status actualizat

---

## 📊 Documentație

- **API Endpoints:** `API_ENDPOINTS_REFERENCE.md` - Listă completă endpoint-uri
- **Testing Checklist:** `ENDPOINT_TESTING_CHECKLIST.md` - Checklist detaliat
- **Stripe Setup:** `STRIPE_SETUP_GUIDE.md` - Configurare Stripe
- **QA Report:** `QA_REPORT.md` - Rezultate testare manuală existentă

---

## ✅ Best Practices

1. **Testează incremental** - Începe cu endpoint-uri publice, apoi protejate
2. **Folosește conturi de test** - Nu folosi conturi de producție
3. **Verifică error handling** - Testează și scenarii de eroare
4. **Documentează probleme** - Notează orice bug găsit
5. **Testează autorizarea** - Verifică că utilizatorii nu pot accesa resurse care nu le aparțin

---

**Status:** 📋 **Ghidă completă pentru testare**

**Următorul pas:** Rulează testele și documentează rezultatele

