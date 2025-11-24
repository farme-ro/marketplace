# Farmero Parties & Contracts Global Model

**Data:** 2025-01-27  
**Scop:** Model unificat pentru "cine cu cine lucrează" în Farmero  
**Status:** Frontend-ready, așteaptă implementare backend

---

## 📋 Rezumat Executiv

Acest document descrie modelul unificat pentru:
- **Parties (Actori)** - Cine sunt entitățile din sistem
- **Contracts** - Tipurile de contracte și relații între părți
- **Integrare** - Cum se leagă contractele de alte funcționalități (facturi, avize, AWB, abonamente)

**IMPORTANT:** 
- Frontend-ul este pregătit și folosește aceste contracte
- Backend-ul trebuie să implementeze aceste endpoint-uri conform specificațiilor
- Toate request-urile folosesc `credentials: 'include'` pentru cookie-based authentication
- Base URL: `https://api.farme.ro`

---

## 👥 1. Tipuri de Party (Actori)

### 1.1. FarmeroPartyType

Tipurile de actori din sistemul Farmero:

```typescript
type FarmeroPartyType =
  | 'farmero_platform'    // Platforma Farmero însăși
  | 'client'              // Clienți persoane fizice
  | 'producer'            // Producători (fermieri, producători locali)
  | 'logistics_partner'   // Parteneri de logistică
  | 'business_client'     // Clienți business (restaurante, magazine, etc.)
  | 'donor'               // Donatori (pentru programe sociale)
```

### 1.2. FarmeroPartyRef

Referință către o entitate (party) din sistem:

```typescript
interface FarmeroPartyRef {
  id: string              // ID intern unic
  type: FarmeroPartyType
  displayName: string     // ex: nume firmă, nume client, "Farmero"
  countryCode?: string    // ex: "RO"
  vatId?: string          // CUI pentru businessuri / producători
  email?: string          // Email de contact (opțional)
  address?: string        // Adresă (opțional)
}
```

**Exemple:**

```json
{
  "id": "party-farmero-001",
  "type": "farmero_platform",
  "displayName": "Farmero",
  "countryCode": "RO",
  "vatId": "RO12345678"
}
```

```json
{
  "id": "party-prod-123",
  "type": "producer",
  "displayName": "Ferma Popescu",
  "countryCode": "RO",
  "vatId": "RO87654321",
  "email": "contact@fermapopescu.ro"
}
```

---

## 📝 2. Tipuri de Contracte

### 2.1. FarmeroContractType

Tipurile de contracte disponibile:

```typescript
type FarmeroContractType =
  | 'producer_platform'     // Contract între producător și platforma Farmero
  | 'logistics_platform'    // Contract între partener logistic și platforma Farmero
  | 'business_platform'     // Contract între client business și platforma Farmero
  | 'producer_business'     // Contract direct între producător și client business
  | 'donor_platform'         // Contract între donator și platforma Farmero
```

### 2.2. FarmeroContractStatus

Status-ul unui contract:

```typescript
type FarmeroContractStatus =
  | 'draft'        // Draft, încă nesemnat
  | 'active'       // Activ, în vigoare
  | 'suspended'    // Suspendat temporar
  | 'terminated'   // Terminat
```

### 2.3. FarmeroContractInstance

Instanță concretă a unui contract:

```typescript
interface FarmeroContractInstance {
  id: string
  templateId: string
  type: FarmeroContractType
  parties: FarmeroPartyRef[]    // de ex: [Farmero, Producător X]
  status: FarmeroContractStatus
  signedAt?: string
  validFrom?: string
  validUntil?: string
  referenceNumber?: string       // ex: "CONTRACT-2025-001"
  contractData?: Record<string, unknown>
  downloadUrl?: string
  createdAt?: string
  updatedAt?: string
}
```

---

## 🔗 3. Exemple de Contracte

### 3.1. Producător ↔ Farmero

**Tip:** `producer_platform`

**Părți:**
- Farmero (platform)
- Producător (ex: Ferma Popescu)

**Conținut tipic:**
- Termeni și condiții pentru utilizarea platformei
- Comisioane și plăți
- Obligații și responsabilități
- Politica de returnări
- Termeni de livrare

**Legături:**
- Facturi emise către producător (pentru comisioane)
- Produse listate de producător
- Comenzi gestionate prin platformă

### 3.2. Logistică ↔ Farmero

**Tip:** `logistics_platform`

**Părți:**
- Farmero (platform)
- Partener logistic (ex: Fan Courier, DPD)

**Conținut tipic:**
- Termeni de colaborare
- Tarife de livrare
- Zona de acoperire
- SLA (Service Level Agreement)
- Proces de tracking

**Legături:**
- AWB-uri generate
- Facturi pentru servicii de livrare
- Tracking-ul comenzilor

### 3.3. Business ↔ Farmero

**Tip:** `business_platform`

**Părți:**
- Farmero (platform)
- Client business (ex: Restaurant XYZ)

**Conținut tipic:**
- Termeni comerciali B2B
- Prețuri speciale / volume discounts
- Termeni de plată (ex: 30 zile)
- Livrări programate
- Facturare automată

**Legături:**
- Facturi emise către business
- Comenzi B2B
- Abonamente / contracte recurente

### 3.4. Producător ↔ Business

**Tip:** `producer_business`

**Părți:**
- Producător (ex: Ferma Popescu)
- Client business (ex: Restaurant XYZ)

**Conținut tipic:**
- Contract direct de vânzare-cumpărare
- Prețuri negociate
- Termeni de livrare directă
- Termeni de plată

**Legături:**
- Facturi directe producător → business
- Comenzi directe (bypass platformă)
- Avize de însoțire

### 3.5. Donator ↔ Farmero

**Tip:** `donor_platform`

**Părți:**
- Farmero (platform)
- Donator (ex: ONG, fundație)

**Conținut tipic:**
- Termeni de donație
- Programe sociale
- Beneficii fiscale (dacă este cazul)
- Transparență și raportare

**Legături:**
- Produse donate
- Rapoarte de impact social
- Facturi / documente pentru deduceri fiscale

---

## 🔄 4. Legături cu Alte Funcționalități

### 4.1. Contracte ↔ Facturi

**Cum se leagă:**
- Facturile sunt generate pe baza contractelor active
- Contractul definește termenii de facturare (frecvență, sume, TVA)
- Fiecare factură poate referi contractul din care provine

**Exemplu:**
```typescript
interface FarmeroInvoice {
  // ...
  contractId?: string  // ID-ul contractului asociat
  // ...
}
```

### 4.2. Contracte ↔ Avize de Însoțire

**Cum se leagă:**
- Avizele sunt generate pentru comenzile care au contract asociat
- Contractul poate specifica formatul și conținutul avizelor
- Producătorul sau partenerul logistic emite avizul conform contractului

**Exemplu:**
```typescript
interface FarmeroDeliveryNote {
  // ...
  contractId?: string  // ID-ul contractului asociat
  // ...
}
```

### 4.3. Contracte ↔ AWB-uri

**Cum se leagă:**
- AWB-urile sunt generate pentru livrări în cadrul unui contract
- Contractul cu partenerul logistic definește procesul de generare AWB
- Tracking-ul este legat de contract

**Exemplu:**
```typescript
interface FarmeroAwb {
  // ...
  contractId?: string  // ID-ul contractului cu partenerul logistic
  // ...
}
```

### 4.4. Contracte ↔ Abonamente / Fees

**Cum se leagă:**
- Abonamentele producătorilor sunt legate de contractul `producer_platform`
- Contractul definește tier-urile disponibile și prețurile
- Fees-urile (comisioane) sunt calculate pe baza contractului

**Exemplu:**
```typescript
interface FarmeroProducerSubscriptionStatus {
  // ...
  contractId?: string  // ID-ul contractului producer_platform
  // ...
}
```

---

## 📊 5. API Contracts

### 5.1. Get My Contracts

**GET /contracts**

Returnează lista de contracte unde utilizatorul curent este parte.

**Response Body:** `FarmeroContractInstance[]`

**Error Codes:**
- `401` - Nu este autentificat
- `403` - Nu are permisiuni

---

### 5.2. Get Contract By ID

**GET /contracts/:id**

Returnează un contract specific.

**Response Body:** `FarmeroContractInstance`

**Error Codes:**
- `401` - Nu este autentificat
- `403` - Nu are permisiuni
- `404` - Contractul nu a fost găsit

---

### 5.3. Get Contract Templates

**GET /contracts/templates**

Returnează lista de template-uri disponibile.

**Query Parameters:**
- `type` (optional): `FarmeroContractType` - Filtrare după tip

**Response Body:** `FarmeroContractTemplate[]`

**Error Codes:**
- `401` - Nu este autentificat

---

### 5.4. Get My Party Profile

**GET /parties/me**

Returnează profilul de party al utilizatorului curent.

**Response Body:** `FarmeroPartyRef`

**Error Codes:**
- `401` - Nu este autentificat
- `403` - Nu are permisiuni
- `404` - Nu există profil de party

---

### 5.5. Get Counterparties

**GET /parties/counterparties**

Returnează lista de counterparties (părți cu relații la utilizatorul curent).

**Response Body:** `FarmeroPartyRef[]`

**Error Codes:**
- `401` - Nu este autentificat
- `403` - Nu are permisiuni

---

## 🔄 6. Relații (Relations)

### 6.1. Concept

Relațiile reprezintă conexiuni între părți, care pot fi legate sau nu de un contract.

**Tipuri de relații:**
- `commercial` - Relație comercială (vânzare-cumpărare)
- `logistics` - Relație de logistică (livrare)
- `donation` - Relație de donație
- `other` - Alte tipuri de relații

### 6.2. FarmeroRelation

```typescript
interface FarmeroRelation {
  id: string
  primaryParty: FarmeroPartyRef
  counterparty: FarmeroPartyRef
  contractId?: string  // ID-ul contractului asociat (dacă există)
  relationType: FarmeroRelationType
  createdAt: string
  updatedAt?: string
  metadata?: Record<string, unknown>
}
```

**Exemplu:**
```json
{
  "id": "rel-123",
  "primaryParty": {
    "id": "party-prod-123",
    "type": "producer",
    "displayName": "Ferma Popescu"
  },
  "counterparty": {
    "id": "party-farmero-001",
    "type": "farmero_platform",
    "displayName": "Farmero"
  },
  "contractId": "contract-456",
  "relationType": "commercial",
  "createdAt": "2025-01-01T00:00:00Z"
}
```

---

## ✅ 7. Checklist Implementare

### Frontend (✅ Complet)
- [x] Tipuri TypeScript pentru parties
- [x] Tipuri TypeScript pentru contracte
- [x] Tipuri TypeScript pentru relații
- [x] API client pentru contracte
- [x] API client pentru parties
- [x] UI shell pentru producer-portal
- [x] UI shell pentru logistics-portal
- [x] UI shell pentru business-portal
- [x] Pagini de detalii contracte
- [x] Traduceri i18n
- [x] Documentație

### Backend (⏳ Așteaptă implementare)
- [ ] Endpoint `/contracts` (GET)
- [ ] Endpoint `/contracts/:id` (GET)
- [ ] Endpoint `/contracts/templates` (GET)
- [ ] Endpoint `/parties/me` (GET)
- [ ] Endpoint `/parties/counterparties` (GET)
- [ ] Logică de generare contracte din template-uri
- [ ] Logică de asociere contracte cu facturi, avize, AWB-uri
- [ ] Sistem de versiuni pentru template-uri
- [ ] Arhivare contracte terminate

---

## 📝 8. Note de Business

### 8.1. Versiuni Contracte

- Template-urile au versiuni (ex: "v1.0", "v2.0")
- Contractele generate păstrează versiunea template-ului folosit
- Contractele vechi rămân valide cu versiunea lor, chiar dacă template-ul a fost actualizat

### 8.2. Semnături

**TODO:** Verificare legalitate semnătură electronică pentru contracte.

### 8.3. Arhivare

- Contractele terminate trebuie arhivate
- Perioada de arhivare: conform legislației (de obicei 5-10 ani)
- Accesul la contractele arhivate: doar pentru consultare

### 8.4. Notificări

- Notificări când un contract este aproape de expirare
- Notificări când un contract este suspendat sau terminat
- Notificări pentru contracte noi care necesită semnătură

---

**Ultima actualizare:** 2025-01-27  
**Versiune:** 1.0

