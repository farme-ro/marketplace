# Backend API Contract - Multi-Account

**Data:** 2024  
**Scop:** Documentație pentru contractele API între frontend (Next.js) și backend (api.farme.ro) pentru sistemul multi-account  
**Status:** Frontend-ready, așteaptă implementare backend

---

## 📋 Preambul

Acest document descrie contractele API pentru funcționalitatea Multi-Account:
- **Account Management** - Gestionarea conturilor multiple (personal/business)
- **Account Switcher** - Comutarea între conturi

**IMPORTANT:** 
- Frontend-ul este pregătit și folosește aceste contracte
- Backend-ul trebuie să implementeze aceste endpoint-uri conform specificațiilor
- Toate request-urile folosesc `credentials: 'include'` pentru cookie-based authentication
- Base URL: `https://api.farme.ro`

---

## 🔐 Autentificare

Toate endpoint-urile necesită autentificare via cookies:
- Request-urile includ `credentials: 'include'`
- Backend-ul verifică cookie-ul de sesiune
- Răspunsuri de eroare:
  - `401 Unauthorized` - Nu este autentificat
  - `403 Forbidden` - Autentificat dar fără permisiuni

---

## 📦 Account Types

### PersonalAccount
Cont personal/family - implicit pentru orice user. Nu poate fi șters.

```typescript
{
  id: string
  type: 'personal'
  name: string
  slug?: string
  isDefault: boolean  // Always true for personal account
  createdAt?: string
  updatedAt?: string
}
```

### BusinessAccount
Cont business/companie/ONG - poate fi creat, actualizat și șters.

```typescript
{
  id: string
  type: 'business'
  name: string
  slug?: string
  isDefault?: boolean
  companyNumber?: string  // CUI / Registration number
  vatId?: string  // CIF / VAT number
  billingAddress?: {
    name: string
    city: string
    address: string
    postalCode?: string
    country?: string
  }
  companyType?: 'COMPANY' | 'PFA' | 'ONG' | 'OTHER'
  taxId?: string
  createdAt?: string
  updatedAt?: string
}
```

---

## 🔄 Account Management

### GET /accounts

**Descriere:** Obține lista de conturi ale utilizatorului autentificat

**Method:** `GET`

**Headers:**
```
Cookie: session=...
```

**Response Success (200):**
```typescript
// Poate fi array sau paginated response
Array<UserAccount> | {
  data: Array<UserAccount>
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

**Format UserAccount:**
```typescript
// PersonalAccount sau BusinessAccount (vezi mai sus)
{
  id: string
  type: 'personal' | 'business'
  name: string
  slug?: string
  isDefault?: boolean
  // ... rest of fields based on type
}
```

**Exemplu JSON:**
```json
[
  {
    "id": "acc_personal_123",
    "type": "personal",
    "name": "Ion Popescu",
    "isDefault": true,
    "createdAt": "2024-01-01T10:00:00Z"
  },
  {
    "id": "acc_business_456",
    "type": "business",
    "name": "Ferma Verde SRL",
    "slug": "ferma-verde-srl",
    "isDefault": false,
    "companyNumber": "RO12345678",
    "vatId": "RO12345678",
    "companyType": "COMPANY",
    "billingAddress": {
      "name": "Ferma Verde SRL",
      "city": "București",
      "address": "Str. Exemplu, Nr. 123",
      "postalCode": "010101",
      "country": "România"
    },
    "createdAt": "2024-01-15T10:00:00Z"
  }
]
```

**Response Errors:**
- `401 Unauthorized` - Nu este autentificat

**Notă:** Dacă utilizatorul nu are conturi sau backend-ul nu suportă încă multi-account, poate returna array gol `[]`. Frontend-ul generează automat un PersonalAccount local ca fallback.

---

### GET /accounts/:id

**Descriere:** Obține detaliile unui cont specific

**Method:** `GET`

**URL Parameters:**
- `id` - ID-ul contului

**Response Success (200):**
```typescript
// PersonalAccount sau BusinessAccount
{
  id: string
  type: 'personal' | 'business'
  name: string
  // ... rest of fields based on type
}
```

**Exemplu JSON (BusinessAccount):**
```json
{
  "id": "acc_business_456",
  "type": "business",
  "name": "Ferma Verde SRL",
  "slug": "ferma-verde-srl",
  "isDefault": false,
  "companyNumber": "RO12345678",
  "vatId": "RO12345678",
  "companyType": "COMPANY",
  "billingAddress": {
    "name": "Ferma Verde SRL",
    "city": "București",
    "address": "Str. Exemplu, Nr. 123",
    "postalCode": "010101",
    "country": "România"
  },
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-20T15:30:00Z"
}
```

**Response Errors:**
- `401 Unauthorized` - Nu este autentificat
- `403 Forbidden` - Contul nu aparține utilizatorului autentificat
- `404 Not Found` - Contul nu există

---

### POST /accounts/business

**Descriere:** Creează un cont business nou

**Method:** `POST`

**Request Body:**
```typescript
{
  name: string  // Required: Numele companiei
  companyNumber?: string  // Optional: CUI / Registration number
  vatId?: string  // Optional: CIF / VAT number
  billingAddress?: {
    name: string
    city: string
    address: string
    postalCode?: string
    country?: string
  }
  companyType?: 'COMPANY' | 'PFA' | 'ONG' | 'OTHER'
  taxId?: string
}
```

**Exemplu JSON:**
```json
{
  "name": "Ferma Verde SRL",
  "companyNumber": "RO12345678",
  "vatId": "RO12345678",
  "companyType": "COMPANY",
  "billingAddress": {
    "name": "Ferma Verde SRL",
    "city": "București",
    "address": "Str. Exemplu, Nr. 123",
    "postalCode": "010101",
    "country": "România"
  }
}
```

**Response Success (201):**
```typescript
// BusinessAccount creat
{
  id: string
  type: 'business'
  name: string
  slug?: string
  isDefault?: boolean
  companyNumber?: string
  vatId?: string
  billingAddress?: {
    name: string
    city: string
    address: string
    postalCode?: string
    country?: string
  }
  companyType?: 'COMPANY' | 'PFA' | 'ONG' | 'OTHER'
  taxId?: string
  createdAt: string
  updatedAt?: string
}
```

**Exemplu JSON:**
```json
{
  "id": "acc_business_789",
  "type": "business",
  "name": "Ferma Verde SRL",
  "slug": "ferma-verde-srl",
  "isDefault": false,
  "companyNumber": "RO12345678",
  "vatId": "RO12345678",
  "companyType": "COMPANY",
  "billingAddress": {
    "name": "Ferma Verde SRL",
    "city": "București",
    "address": "Str. Exemplu, Nr. 123",
    "postalCode": "010101",
    "country": "România"
  },
  "createdAt": "2024-01-20T10:00:00Z"
}
```

**Response Errors:**
- `400 Bad Request` - Date invalide (name lipsă, format invalid, etc.)
- `401 Unauthorized` - Nu este autentificat
- `422 Unprocessable Entity` - Validare business logic (ex: CUI deja folosit, etc.)

**Business Rules:**
- Fiecare utilizator poate crea multiple conturi business
- Numele trebuie să fie unic per utilizator (sau slug-ul)
- CUI-ul poate fi opțional, dar dacă este furnizat, trebuie validat

---

### PATCH /accounts/:id

**Descriere:** Actualizează un cont existent

**Method:** `PATCH`

**URL Parameters:**
- `id` - ID-ul contului

**Request Body:**
```typescript
{
  name?: string
  companyNumber?: string
  vatId?: string
  billingAddress?: {
    name: string
    city: string
    address: string
    postalCode?: string
    country?: string
  }
  companyType?: 'COMPANY' | 'PFA' | 'ONG' | 'OTHER'
  taxId?: string
  isDefault?: boolean  // Optional: Setează contul ca default
}
```

**Exemplu JSON:**
```json
{
  "name": "Ferma Verde SRL - Updated",
  "billingAddress": {
    "name": "Ferma Verde SRL",
    "city": "Cluj-Napoca",
    "address": "Str. Nouă, Nr. 456",
    "postalCode": "400000",
    "country": "România"
  }
}
```

**Response Success (200):**
```typescript
// Contul actualizat
{
  id: string
  type: 'personal' | 'business'
  name: string
  // ... rest of fields
  updatedAt: string
}
```

**Response Errors:**
- `400 Bad Request` - Date invalide
- `401 Unauthorized` - Nu este autentificat
- `403 Forbidden` - Contul nu aparține utilizatorului
- `404 Not Found` - Contul nu există
- `422 Unprocessable Entity` - Validare business logic

**Business Rules:**
- PersonalAccount: Doar `name` poate fi actualizat (sau alte câmpuri non-critice)
- BusinessAccount: Toate câmpurile pot fi actualizate
- `isDefault`: Dacă este setat la `true`, alte conturi vor avea `isDefault: false`

---

### DELETE /accounts/:id

**Descriere:** Șterge un cont (soft delete)

**Method:** `DELETE`

**URL Parameters:**
- `id` - ID-ul contului

**Response Success (200/204):**
- `200 OK` cu body gol sau
- `204 No Content`

**Response Errors:**
- `400 Bad Request` - Nu se poate șterge (ex: contul personal)
- `401 Unauthorized` - Nu este autentificat
- `403 Forbidden` - Contul nu aparține utilizatorului
- `404 Not Found` - Contul nu există

**Business Rules:**
- **PersonalAccount NU poate fi șters** - Backend-ul trebuie să returneze `400 Bad Request` dacă se încearcă ștergerea unui cont personal
- BusinessAccount poate fi șters
- Dacă contul șters era `isDefault: true`, backend-ul trebuie să seteze automat alt cont ca default (preferabil PersonalAccount)

---

## 🔄 Normalizare de Date

Frontend-ul acceptă atât formatul `snake_case` cât și `camelCase`:

```typescript
// Backend poate trimite:
{
  "id": "123",
  "company_number": "RO123",  // sau "companyNumber"
  "vat_id": "RO123",          // sau "vatId"
  "billing_address": {         // sau "billingAddress"
    "postal_code": "010101"    // sau "postalCode"
  }
}

// Frontend normalizează la:
{
  id: "123",
  companyNumber: "RO123",
  vatId: "RO123",
  billingAddress: {
    postalCode: "010101"
  }
}
```

**Recomandare:** Backend-ul ar trebui să folosească un format consistent (preferabil `camelCase` pentru consistență cu frontend-ul).

---

## 🔄 Fallback Behavior

Când backend-ul nu suportă încă multi-account:

1. **GET /accounts returnează 404 sau array gol:**
   - Frontend-ul generează automat un PersonalAccount local
   - PersonalAccount este setat ca `isDefault: true`
   - Utilizatorul poate folosi aplicația normal

2. **POST /accounts/business returnează 404:**
   - Frontend-ul aruncă eroare: "Funcționalitatea de conturi business nu este disponibilă încă."

3. **PATCH/DELETE returnează 404:**
   - Frontend-ul aruncă eroare clară

**Notă:** Fallback-ul este transparent pentru utilizator - aplicația funcționează normal chiar dacă backend-ul nu suportă încă multi-account.

---

## 📝 Note Importante

1. **Cookie-based Authentication:** Toate request-urile includ `credentials: 'include'` pentru a trimite cookie-urile de sesiune.

2. **Error Handling:** Frontend-ul tratează erorile astfel:
   - `401` → Redirect la login cu return URL
   - `403` → Mesaj "Nu ai permisiunea"
   - `404` → Mesaj "Contul nu există" sau fallback la PersonalAccount local
   - `422` → Mesaje specifice (validare business logic)

3. **PersonalAccount Protection:**
   - PersonalAccount este generat automat pentru fiecare user
   - Nu poate fi șters (backend trebuie să returneze 400)
   - Este întotdeauna `isDefault: true` (sau cel puțin unul dintre conturi trebuie să fie default)

4. **Default Account:**
   - Cel puțin un cont trebuie să fie `isDefault: true`
   - Dacă se șterge contul default, backend-ul trebuie să seteze automat alt cont ca default
   - Frontend-ul selectează automat contul default la login

5. **Paginare:** Frontend-ul acceptă atât array direct cât și format paginated:
   ```typescript
   // Format 1: Array direct
   [{...}, {...}]
   
   // Format 2: Paginated
   {
     data: [{...}, {...}],
     pagination: { page: 1, limit: 10, total: 2, totalPages: 1 }
   }
   ```

---

## ✅ Checklist pentru Backend

Când backend-ul implementează aceste endpoint-uri, trebuie să verifice:

- [ ] Toate endpoint-urile returnează formatul JSON specificat
- [ ] Error codes sunt corecte (401, 403, 404, 422)
- [ ] Cookie-based authentication funcționează
- [ ] Validările de date sunt implementate (400, 422)
- [ ] PersonalAccount nu poate fi șters (400 Bad Request)
- [ ] Cel puțin un cont este întotdeauna default
- [ ] Când se șterge contul default, alt cont devine default automat
- [ ] Response format este consistent (array sau paginated)
- [ ] Slug-urile sunt generate automat pentru business accounts (dacă e cazul)

---

**Ultima actualizare:** 2024  
**Versiune:** 1.0

