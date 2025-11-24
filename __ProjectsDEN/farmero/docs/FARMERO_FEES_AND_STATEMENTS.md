# Farmero Fees & Statements Documentation

**Data:** 2025-01-27  
**Scop:** Documentație pentru sistemul de comisioane și extrase de plată  
**Status:** Frontend-ready, așteaptă implementare backend

---

## 📋 Rezumat Executiv

Acest document descrie sistemul de:
- **Farmero Fees** - Comisioanele reținute de Farmero
- **Statements** - Extrase / situații de plată pentru producători, logistică și business-uri

**IMPORTANT:** 
- Frontend-ul este pregătit și folosește aceste contracte
- Backend-ul trebuie să implementeze aceste endpoint-uri conform specificațiilor
- Toate request-urile folosesc `credentials: 'include'` pentru cookie-based authentication
- Base URL: `https://api.farme.ro`

---

## 💰 1. Tipuri de Fees (Comisioane)

### 1.1. FarmeroFeeScope

Domeniile în care se aplică comisionul:

```typescript
type FarmeroFeeScope =
  | 'order'         // Comision pe comandă
  | 'subscription'   // Comision pe abonament
  | 'delivery'      // Comision pe livrare
  | 'marketing'     // Comision pentru servicii de marketing
  | 'other'         // Alte tipuri de comisioane
```

### 1.2. FarmeroFeePayerType

Tipul de entitate care plătește comisionul:

```typescript
type FarmeroFeePayerType =
  | 'producer'          // Producătorul plătește comision
  | 'logistics_partner' // Partenerul de logistică plătește comision
  | 'business_client'   // Clientul business plătește comision
```

### 1.3. FarmeroFeeRule

Regulă de calculare a comisionului:

```typescript
interface FarmeroFeeRule {
  id: string
  scope: FarmeroFeeScope
  payerType: FarmeroFeePayerType
  percentage?: number      // ex: 5 (%) din valoare
  fixedAmount?: number     // ex: 1 leu / comandă
  currency: string
  description?: string
  active: boolean
}
```

**Exemple de reguli:**

1. **Comision pe comandă (producător):**
   - Scope: `order`
   - Payer: `producer`
   - Percentage: 5% (din valoarea comenzii)
   - Description: "Comision standard pe comandă"

2. **Comision fix pe livrare (logistică):**
   - Scope: `delivery`
   - Payer: `logistics_partner`
   - FixedAmount: 2 RON
   - Description: "Comision fix per livrare"

3. **Comision pe abonament (producător):**
   - Scope: `subscription`
   - Payer: `producer`
   - Percentage: 3% (din valoarea abonamentului)
   - Description: "Comision pe abonamente recurente"

---

## 📊 2. Cine plătește ce?

### 2.1. Producător

**Comisioane plătite:**
- Comision pe comandă (percentage din valoarea comenzii)
- Comision pe abonamente (percentage din valoarea abonamentului)
- Comision pentru servicii de marketing (dacă folosește tier-uri plătite)

**Exemplu:**
- Comandă de 1000 RON → Comision 5% = 50 RON → Producătorul primește 950 RON

### 2.2. Partener Logistic

**Comisioane plătite:**
- Comision fix pe livrare (fixed amount per AWB)
- Comision pe volum (percentage din valoarea serviciilor de livrare)

**Exemplu:**
- 10 livrări × 2 RON fix = 20 RON comision total

### 2.3. Client Business

**Comisioane plătite (dacă este modelul B2B special):**
- Comision pe comandă (percentage sau fixed)
- Comision pentru servicii premium (dacă folosește)

**Notă:** În majoritatea cazurilor, clientul business plătește doar prețul produselor, iar comisionul este suportat de producător.

---

## 📄 3. Statements (Extrase)

### 3.1. Concept

Un **Statement** (extras) este un rezumat al tuturor tranzacțiilor pentru o perioadă (ex: lună), care arată:
- Total brut (înainte de comisioane)
- Total comisioane
- Total net (după comisioane)

### 3.2. FarmeroStatementSummary

```typescript
interface FarmeroStatementSummary {
  id: string
  partyId: string              // producător / logistic partner / business
  partyType: FarmeroFeePayerType
  periodStart: string
  periodEnd: string
  totalGross: number
  totalFees: number
  totalNet: number
  currency: string
  lines: FarmeroStatementLine[]
  status?: 'draft' | 'final' | 'paid'
  paidAt?: string
}
```

### 3.3. FarmeroStatementLine

Fiecare linie reprezintă o tranzacție:

```typescript
interface FarmeroStatementLine {
  id: string
  date: string
  referenceType: 'order' | 'subscription' | 'delivery' | 'marketing' | 'other'
  referenceId: string
  referenceNumber?: string      // ex: "ORD-123", "SUB-456"
  grossAmount: number
  feeAmount: number
  netAmount: number
  currency: string
  description?: string
  feeRuleId?: string
}
```

---

## 🧮 4. Cum se calculează un Statement

### 4.1. Proces de calculare

1. **Colectare tranzacții:**
   - Toate comenzile din perioadă
   - Toate abonamentele din perioadă
   - Toate livrările din perioadă
   - Alte tranzacții relevante

2. **Aplicare reguli de comision:**
   - Pentru fiecare tranzacție, se identifică regula de comision aplicabilă
   - Se calculează comisionul (percentage sau fixed)
   - Se calculează suma netă (gross - fee)

3. **Agregare:**
   - Sumă total brut = sumă(grossAmount) pentru toate liniile
   - Sumă total comisioane = sumă(feeAmount) pentru toate liniile
   - Sumă total net = sumă(netAmount) pentru toate liniile

### 4.2. Exemplu de calcul

**Perioadă:** 1-31 ianuarie 2025  
**Producător:** Ferma Popescu

**Tranzacții:**
- Comandă #123: 1000 RON → Comision 5% = 50 RON → Net: 950 RON
- Comandă #124: 500 RON → Comision 5% = 25 RON → Net: 475 RON
- Abonament #45: 200 RON → Comision 3% = 6 RON → Net: 194 RON

**Rezumat:**
- Total brut: 1700 RON
- Total comisioane: 81 RON
- Total net: 1619 RON

---

## 📊 5. Ce date vor fi afișate în UI

### 5.1. Producer Portal

**Rezumat perioadă curentă:**
- Total vânzări brute
- Total comisioane Farmero
- Total de încasat (net)

**Listă extrase:**
- Perioadă (ex: 01-31 ianuarie 2025)
- Total brut
- Total comision
- Total net
- Buton "Vezi detalii"

**Detalii extras:**
- Header cu perioadă
- Totaluri (brut, comision, net)
- Tabel cu linii:
  - Data
  - Referință (tip + număr)
  - Descriere
  - Brut
  - Comision
  - Net

### 5.2. Logistics Portal

**Același pattern ca producer:**
- Rezumat perioadă curentă
- Listă extrase
- Detalii extras

**Diferențe:**
- Terminologie: "Curse" în loc de "Vânzări"
- Referințe: AWB-uri în loc de comenzi

### 5.3. Business Portal

**Plăți & Facturare:**
- Extrase cu facturi plătite
- Comisioane (dacă este modelul B2B special)
- Rezumat plăți

---

## 🔄 6. Integrare cu Alte Funcționalități

### 6.1. Contracte

- Contractele definesc regulile de comision aplicabile
- Un contract `producer_platform` poate specifica comisionul standard (ex: 5%)
- Contractele pot avea comisioane diferite pentru diferite tipuri de tranzacții

### 6.2. Facturi

- Facturile sunt generate pe baza statement-urilor
- Fiecare factură poate referi un statement
- Statement-ul poate fi folosit pentru generare factură către producător/logistică

### 6.3. Plăți

- Statement-urile cu status `final` pot fi folosite pentru procesare plăți
- După plată, statement-ul primește status `paid` și `paidAt`

---

## 📊 7. API Contracts

### 7.1. Get Active Fee Rules

**GET /fees/rules**

Returnează lista de reguli de comision active.

**Response Body:** `FarmeroFeeRule[]`

**Error Codes:**
- `401` - Nu este autentificat
- `403` - Nu are permisiuni

---

### 7.2. Get My Statements

**GET /statements**

Returnează lista de extrase pentru utilizatorul curent.

**Response Body:** `FarmeroStatementSummary[]`

**Error Codes:**
- `401` - Nu este autentificat
- `403` - Nu are permisiuni

---

### 7.3. Get Statement By ID

**GET /statements/:id**

Returnează un extras specific cu toate liniile.

**Response Body:** `FarmeroStatementSummary` (cu `lines` complet)

**Error Codes:**
- `401` - Nu este autentificat
- `403` - Nu are permisiuni
- `404` - Extrasul nu a fost găsit

---

### 7.4. Get Current Period Summary

**GET /statements/current**

Returnează rezumatul perioadei curente (dacă există).

**Response Body:** `FarmeroStatementSummary | null`

**Error Codes:**
- `401` - Nu este autentificat
- `403` - Nu are permisiuni
- `404` - Nu există rezumat pentru perioada curentă (returnează null în frontend)

---

## ✅ 8. Checklist Implementare

### Frontend (✅ Complet)
- [x] Tipuri TypeScript pentru fees
- [x] Tipuri TypeScript pentru statements
- [x] API client pentru fees
- [x] API client pentru statements
- [x] UI pentru producer-portal (sales-commissions)
- [x] UI pentru logistics-portal (commissions)
- [x] UI pentru business-portal (payments)
- [x] Pagini de detalii statements
- [x] Traduceri i18n
- [x] Documentație

### Backend (⏳ Așteaptă implementare)
- [ ] Endpoint `/fees/rules` (GET)
- [ ] Endpoint `/statements` (GET)
- [ ] Endpoint `/statements/:id` (GET)
- [ ] Endpoint `/statements/current` (GET)
- [ ] Logică de calculare comisioane
- [ ] Logică de generare statements
- [ ] Agregare tranzacții pe perioade
- [ ] Asociere statements cu facturi
- [ ] Procesare plăți

---

## 📝 9. Note de Business

### 9.1. Perioade

- Statements-urile sunt generate pe perioade (ex: lunar)
- Perioada curentă este perioada în curs (ex: luna curentă)
- Statements-urile finalizate sunt pentru perioade închise

### 9.2. Status Statements

- `draft` - În curs de calculare
- `final` - Finalizat, gata pentru plată
- `paid` - Plătit

### 9.3. Transparență

- Toate comisioanele trebuie să fie transparente
- Producătorii/logistica trebuie să vadă clar ce comisioane plătesc
- Fiecare linie din statement trebuie să aibă o referință clară (comandă, abonament, etc.)

---

**Ultima actualizare:** 2025-01-27  
**Versiune:** 1.0

