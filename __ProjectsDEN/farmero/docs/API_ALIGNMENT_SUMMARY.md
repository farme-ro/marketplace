# Rezumat - Aliniere Frontend la API + ENV

**Data:** 2025-01-21  
**Status:** ✅ Completat

---

## ✅ Ce s-a făcut

### 1. Documentație completă endpoint-uri

✅ **Creat:** `docs/API_ENDPOINTS_USED.md`

- Listă completă a tuturor endpoint-urilor backend folosite de frontend
- Organizate pe categorii: Auth, Products, Producers, Cart, Orders, Producer Portal, Client Profile, Misc
- Pentru fiecare endpoint:
  - Metoda HTTP (GET/POST/PATCH/DELETE)
  - URL relativ
  - Funcția care îl folosește
  - Fișierul sursă
  - Status backend (✅ Implementat / ⚠️ TODO Backend)

**Statistici:**
- Total endpoint-uri: 50+
- Implementate în backend: ~25
- TODO backend: ~25
- Cu fallback/mock data: 8

### 2. Verificare utilizare `apiFetch`

✅ **Verificat:** Toate endpoint-urile din `src/lib/api/` folosesc `apiFetch()` din `src/lib/api/client.ts`.

**Excepții (acceptabile):**
- `src/lib/api/client.ts` - Implementarea de bază a `apiFetch()` (folosește `fetch` nativ)
- `src/lib/api/apiClient.ts` - Client alternativ (folosește `fetch` nativ)
- `src/lib/api/server.ts` - Pentru server-side requests (folosește `fetch` nativ)
- `src/lib/api/public/regions.ts` - Folosește `get()` din `apiClient.ts` (în proces de migrare)
- `src/app/(site)/checkout/payment/PaymentPageClient.tsx` - Folosește `fetch` pentru Next.js API route (`/api/checkout/stripe`) - OK

### 3. Documentație ENV actualizată

✅ **Actualizat:** `ENV_SETUP.md`

- Prioritatea corectă documentată: `NEXT_PUBLIC_API_BASE_URL` → `NEXT_PUBLIC_API_URL` → `https://api.farme.ro`
- Explicații clare pentru fiecare variabilă
- Instrucțiuni pentru development și production
- Troubleshooting guide

**Prioritate ENV:**
1. `NEXT_PUBLIC_API_BASE_URL` (prioritate - folosit de `apiFetch`)
2. `NEXT_PUBLIC_API_URL` (fallback)
3. `https://api.farme.ro` (hardcoded fallback)

---

## 📊 Endpoint-uri pe categorii

### ✅ Implementate în backend (~25)

- Auth: login, register, me, logout (client + producer)
- Products: list, detail by slug
- Producers: list, detail by slug, products by producer
- Cart: get, add item, update item, remove item, clear
- Orders: create, list, detail (client + producer)
- Producer Orders: update status

### ⚠️ TODO Backend (~25)

**Prioritate Înaltă:**
- Producer Profile: GET/PATCH `/producers/me`, POST `/producers/me/logo`, POST `/producers/me/cover`
- Producer Finances: GET `/producers/payouts/summary`, GET `/producers/payouts`
- Producer Support: POST/GET `/support/producer`

**Prioritate Medie:**
- Client Profile: PATCH `/clients/me`, CRUD `/clients/addresses`
- Auth: POST `/auth/client/forgot-password`
- Health: GET `/status` sau `/health`

**Prioritate Scăzută:**
- Producer Insights: GET `/producers/insights` (cu fallback)
- Producer Commissions: GET `/producers/commissions/*` (cu fallback)
- Regions: GET `/regions`

---

## 🔍 Verificări efectuate

### ✅ Toate fetch-urile folosesc `apiFetch`

**Metodă:** Scanare completă a codului cu `grep` pentru pattern-uri `fetch(` și `apiFetch(`

**Rezultat:** 
- Toate endpoint-urile din `src/lib/api/` folosesc `apiFetch()`
- Singurele excepții sunt implementările de bază și Next.js API routes (acceptabile)

### ✅ Variabile ENV documentate

**Metodă:** Verificare cod în `src/lib/api/client.ts` și documentare în `ENV_SETUP.md`

**Rezultat:**
- Prioritatea corectă: `NEXT_PUBLIC_API_BASE_URL` → `NEXT_PUBLIC_API_URL` → hardcoded fallback
- Documentație completă cu exemple și troubleshooting

---

## 📁 Fișiere create/modificate

### Create
- `docs/API_ENDPOINTS_USED.md` - Documentație completă endpoint-uri
- `docs/API_ALIGNMENT_SUMMARY.md` - Acest rezumat

### Modificate
- `ENV_SETUP.md` - Actualizat cu prioritatea corectă ENV

---

## 🎯 Rezultat

Frontend-ul este acum complet aliniat la API și ENV:

1. ✅ Toate endpoint-urile sunt documentate central
2. ✅ Toate folosesc `apiFetch` (sau implementări acceptabile)
3. ✅ Variabilele ENV sunt documentate cu prioritatea corectă
4. ✅ TODO-urile backend sunt marcate clar

---

## 📝 Următorii pași (pentru backend)

Vezi `docs/API_ENDPOINTS_USED.md` secțiunea "⚠️ TODO Backend" pentru lista completă de endpoint-uri de implementat.

**Prioritate:**
1. Producer Profile Management (4 endpoint-uri)
2. Producer Finances (3 endpoint-uri)
3. Producer Support (2 endpoint-uri)
4. Client Profile (6 endpoint-uri)
5. Auth forgot-password (1 endpoint)
6. Health/Status (1 endpoint)

---

**Finalizat:** ✅ 2025-01-21

