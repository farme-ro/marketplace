# Farmero Subscriptions & Points Specification

**Data:** 2025-01-27  
**Scop:** Documentație completă pentru sistemul de abonamente (client & producător) și Farmero Points  
**Status:** Frontend-ready, așteaptă implementare backend

---

## 📋 Rezumat Executiv

Acest document descrie:
- **Abonamente clienți** - Coșuri recurente pentru clienți
- **Abonamente producători** - Tier-uri de vizibilitate și unelte pentru producători
- **Farmero Points** - Sistem de puncte și recompense pentru fidelizare

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

## 📦 1. Abonamente Clienți

### 1.1. Get Client Subscriptions

**GET /clients/subscriptions**

Returnează lista de abonamente active ale clientului autentificat.

**Response Body:**

```typescript
interface FarmeroClientSubscription {
  id: string
  clientId: string
  producerId: string
  producerName?: string
  producerSlug?: string
  planId: string
  planName?: string
  frequency: 'weekly' | 'biweekly' | 'monthly'
  startDate: string
  nextDeliveryDate: string
  isActive: boolean
  skipCount?: number
  createdAt?: string
  updatedAt?: string
}
```

**Example Response:**

```json
{
  "data": [
    {
      "id": "sub-123",
      "clientId": "client-456",
      "producerId": "prod-789",
      "producerName": "Ferma Popescu",
      "producerSlug": "ferma-popescu",
      "planId": "plan-abc",
      "planName": "Coș săptămânal de lactate",
      "frequency": "weekly",
      "startDate": "2025-01-01T00:00:00Z",
      "nextDeliveryDate": "2025-01-15T10:00:00Z",
      "isActive": true,
      "skipCount": 0,
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

**Error Codes:**
- `401` - Nu este autentificat
- `403` - Nu are permisiuni

---

### 1.2. Get Available Subscription Plans

**GET /clients/subscriptions/plans**

Returnează lista de planuri de abonament disponibile pentru client.

**Query Parameters:**
- `regionId` (optional): string - ID-ul regiunii pentru filtrare

**Response Body:** `FarmeroSubscriptionPlan[]` (vezi tipurile)

**Error Codes:**
- `401` - Nu este autentificat

---

### 1.3. Create Client Subscription

**POST /clients/subscriptions**

Creează un abonament nou pentru client.

**Request Body:**

```json
{
  "planId": "plan-abc",
  "producerId": "prod-789"
}
```

**Response Body:** `FarmeroClientSubscription`

**Error Codes:**
- `400` - Date invalide
- `401` - Nu este autentificat
- `403` - Nu are permisiuni
- `422` - Planul nu este disponibil sau producătorul nu oferă acest plan

---

### 1.4. Pause Client Subscription

**PATCH /clients/subscriptions/:id/pause**

Pune un abonament în pauză (temporar).

**Response Body:** `FarmeroClientSubscription` (cu `isActive: false`)

**Error Codes:**
- `401` - Nu este autentificat
- `403` - Nu are permisiuni
- `404` - Abonamentul nu a fost găsit

---

### 1.5. Resume Client Subscription

**PATCH /clients/subscriptions/:id/resume**

Reluare un abonament care era în pauză.

**Response Body:** `FarmeroClientSubscription` (cu `isActive: true`)

**Error Codes:**
- `401` - Nu este autentificat
- `403` - Nu are permisiuni
- `404` - Abonamentul nu a fost găsit

---

### 1.6. Cancel Client Subscription

**DELETE /clients/subscriptions/:id**

Anulează permanent un abonament.

**Response Body:** `FarmeroClientSubscription` (cu `isActive: false`)

**Error Codes:**
- `401` - Nu este autentificat
- `403` - Nu are permisiuni
- `404` - Abonamentul nu a fost găsit

---

## 🏭 2. Abonamente Producători

### 2.1. Get Producer Subscription Status

**GET /producers/subscriptions/status**

Returnează status-ul abonamentului producătorului autentificat.

**Response Body:**

```typescript
interface FarmeroProducerSubscriptionStatus {
  producerId: string
  tierId: string
  tierName?: string
  validUntil: string
  isAutoRenew: boolean
  startDate?: string
}
```

**Example Response:**

```json
{
  "producerId": "prod-789",
  "tierId": "tier-basic",
  "tierName": "Basic",
  "validUntil": "2025-12-31T23:59:59Z",
  "isAutoRenew": true,
  "startDate": "2025-01-01T00:00:00Z"
}
```

**Error Codes:**
- `401` - Nu este autentificat ca producător
- `403` - Nu are permisiuni
- `404` - Producătorul nu are abonament (returnează null în frontend)

---

### 2.2. Get Producer Subscription Tiers

**GET /producers/subscriptions/tiers**

Returnează lista de tier-uri disponibile pentru producători.

**Response Body:**

```typescript
interface FarmeroProducerTier {
  id: string
  name: string // "Basic", "Boost", "Pro"
  monthlyPrice: number
  currency: string
  features: string[]
  description?: string
}
```

**Example Response:**

```json
{
  "data": [
    {
      "id": "tier-basic",
      "name": "Basic",
      "monthlyPrice": 0,
      "currency": "RON",
      "features": [
        "Listare produse",
        "Gestionare comenzi",
        "Suport email"
      ],
      "description": "Plan de bază pentru început"
    },
    {
      "id": "tier-boost",
      "name": "Boost",
      "monthlyPrice": 199,
      "currency": "RON",
      "features": [
        "Toate feature-urile Basic",
        "Vizibilitate crescută",
        "Badge 'Recomandat'",
        "Statistici avansate"
      ],
      "description": "Pentru producători care vor mai multă vizibilitate"
    },
    {
      "id": "tier-pro",
      "name": "Pro",
      "monthlyPrice": 499,
      "currency": "RON",
      "features": [
        "Toate feature-urile Boost",
        "Badge 'Partener Farmero'",
        "Promovare social media automată",
        "Prioritate suport",
        "API acces"
      ],
      "description": "Plan complet pentru producători profesioniști"
    }
  ]
}
```

**Error Codes:**
- `401` - Nu este autentificat ca producător

---

### 2.3. Upgrade Producer Subscription

**POST /producers/subscriptions/upgrade**

Face upgrade la un tier superior.

**Request Body:**

```json
{
  "tierId": "tier-boost"
}
```

**Response Body:** `FarmeroProducerSubscriptionStatus` (updated)

**Error Codes:**
- `400` - Date invalide
- `401` - Nu este autentificat ca producător
- `403` - Nu are permisiuni
- `422` - Tier-ul nu este disponibil sau upgrade-ul nu este posibil

---

### 2.4. Cancel Producer Subscription

**DELETE /producers/subscriptions**

Anulează abonamentul producătorului.

**Response Body:** `FarmeroProducerSubscriptionStatus` (cu `validUntil` în trecut)

**Error Codes:**
- `401` - Nu este autentificat ca producător
- `403` - Nu are permisiuni
- `404` - Abonamentul nu a fost găsit

---

## 🎯 3. Farmero Points

### 3.1. Get Farmero Points

**GET /farmero-points/me**

Returnează punctele și nivelul clientului autentificat.

**Response Body:**

```typescript
interface FarmeroPoints {
  clientId: string
  points: number // 0–1000+
  level: 'bronze' | 'silver' | 'gold'
  lastUpdated: string
  nextLevelPoints?: number
  levelProgress?: number // 0-100
}
```

**Example Response:**

```json
{
  "clientId": "client-456",
  "points": 350,
  "level": "silver",
  "lastUpdated": "2025-01-27T10:00:00Z",
  "nextLevelPoints": 500,
  "levelProgress": 75
}
```

**Level Thresholds:**
- `bronze`: 0-199 puncte
- `silver`: 200-499 puncte
- `gold`: 500+ puncte

**Error Codes:**
- `401` - Nu este autentificat
- `403` - Nu are permisiuni
- `404` - Clientul nu are puncte încă (returnează default în frontend)

---

### 3.2. Get Points Transaction History

**GET /farmero-points/transactions**

Returnează istoricul de tranzacții de puncte.

**Query Parameters:**
- `limit` (optional): number - Număr maxim de tranzacții

**Response Body:**

```typescript
interface PointsTransaction {
  id: string
  clientId: string
  points: number // Pozitiv pentru câștigat, negativ pentru folosit
  type: 'earned' | 'spent' | 'expired'
  description: string
  createdAt: string
  orderId?: string
}
```

**Example Response:**

```json
{
  "data": [
    {
      "id": "txn-123",
      "clientId": "client-456",
      "points": 50,
      "type": "earned",
      "description": "Puncte pentru comandă completată",
      "createdAt": "2025-01-27T10:00:00Z",
      "orderId": "order-789"
    }
  ]
}
```

**Error Codes:**
- `401` - Nu este autentificat
- `403` - Nu are permisiuni

---

## 📝 4. Explicație de Business

### 4.1. Abonamente Clienți → Coșuri Recurente

**Scop:** Permite clienților să primească automat produse favorite la intervale regulate.

**Beneficii:**
- Conveniență - nu trebuie să comande manual de fiecare dată
- Predictibilitate - producătorii pot planifica producția
- Reducere risipă - comenzi planificate
- Posibile reduceri pentru abonamente

**Funcționare:**
1. Clientul alege un plan de abonament de la un producător
2. La fiecare interval (săptămânal/biweekly/lunar), se creează automat o comandă
3. Clientul poate pune abonamentul în pauză sau anula oricând

---

### 4.2. Abonamente Producători → Vizibilitate & Unelte

**Scop:** Oferă producătorilor opțiuni de monetizare pentru mai multă vizibilitate și unelte.

**Tier-uri:**
- **Basic** (gratuit) - Listare produse, gestionare comenzi, suport de bază
- **Boost** (plătit) - Vizibilitate crescută, badge "Recomandat", statistici avansate
- **Pro** (plătit) - Badge "Partener Farmero", promovare social media, prioritate suport, API acces

**Beneficii pentru producători:**
- Mai multă vizibilitate în marketplace
- Unelte pentru promovare
- Predictibilitate (venit recurent)
- Suport prioritar

**Beneficii pentru platformă:**
- Monetizare suplimentară
- Producători mai activi și implicați
- Calitate mai bună a producătorilor (cei care plătesc sunt mai serioși)

---

### 4.3. Farmero Points → Scor de Încredere / Fidelizare

**Scop:** Sistem de recompense pentru fidelizarea clienților.

**Cum se câștigă puncte:**
- Comenzi completate și ridicate la timp
- Comenzi recurente (abonamente)
- Recenzii și feedback
- Recomandări de prieteni

**Niveluri:**
- **Bronze** (0-199) - Nivel de bază
- **Silver** (200-499) - Client fidel
- **Gold** (500+) - Client premium

**Beneficii viitoare:**
- Reduceri exclusive
- Livrare gratuită
- Acces la produse noi înainte de lansare
- Evenimente speciale

**Scor de încredere:**
- Punctele reflectă comportamentul clientului
- Clienți cu scor bun pot primi beneficii suplimentare
- Producătorii pot vedea scorul pentru a decide despre comenzi

---

## 🔄 5. Integrare cu Alte Sisteme

### 5.1. Integrare cu Comenzi

- Abonamentele clienți generează comenzi automate
- Comenzile completate generează puncte Farmero
- Producătorii cu tier-uri plătite pot avea comenzi prioritizate

### 5.2. Integrare cu Marketing

- Producătorii Pro pot avea promovare automată pe social media
- Featured/Boosted producers apar mai sus în rezultatele de căutare
- Abonamentele pot genera conținut pentru newsletter

### 5.3. Integrare cu Notificări

- Notificări pentru următoarea livrare de abonament
- Notificări când se apropie reînnoirea abonamentului producător
- Notificări pentru câștigarea de puncte

---

## 📊 6. BackendSyncStatus Flags

- `subscriptionsClientActive: false` - Abonamente clienți active
- `subscriptionsProducer: false` - Abonamente producători (tier-uri)
- `farmeroPoints: false` - Sistemul de puncte

**Când backend-ul este gata:**
1. Setează flag-urile respective la `true` în `src/lib/backend-sync/status.ts`
2. Backend-ul trebuie să implementeze toate endpoint-urile documentate

---

## ✅ 7. Checklist Implementare

### Frontend (✅ Complet)
- [x] Tipuri TypeScript pentru abonamente clienți
- [x] Tipuri TypeScript pentru abonamente producători
- [x] Tipuri TypeScript pentru Farmero Points
- [x] API clients cu fallback
- [x] UI pentru abonamente clienți în `/account`
- [x] UI pentru Farmero Points în `/account`
- [x] UI pentru abonamente producători în `/producer-portal/subscriptions`
- [x] Traduceri i18n
- [x] Documentație API contracts

### Backend (⏳ Așteaptă implementare)
- [ ] Endpoint-uri pentru abonamente clienți
- [ ] Endpoint-uri pentru abonamente producători
- [ ] Endpoint-uri pentru Farmero Points
- [ ] Logică de generare automată a comenzilor din abonamente
- [ ] Logică de calculare puncte
- [ ] Logică de upgrade/downgrade tier-uri producători

---

**Ultima actualizare:** 2025-01-27  
**Versiune:** 1.0

