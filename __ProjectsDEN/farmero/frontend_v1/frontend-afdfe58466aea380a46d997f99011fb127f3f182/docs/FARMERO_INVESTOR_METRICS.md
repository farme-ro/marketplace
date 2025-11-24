# Farmero Investor Metrics - Documentation

## Overview

Dashboard-ul de investitori oferă metrici agregate și anonimizate despre activitatea platformei Farmero, permițând investitorilor să înțeleagă fluxul de bani și creșterea platformei fără expunerea datelor personale.

## KPI-uri Afișate

### Snapshot Metrics (Core Metrics)

1. **Total Orders** - Numărul total de comenzi procesate
2. **GMV (Gross Merchandise Volume)** - Volumul total al comenzilor (valoarea totală)
3. **Comisioane Farmero** - Totalul comisioanelor colectate de platformă
4. **Producători Activi** - Numărul de producători activi pe platformă
5. **Clienți Activi** - Numărul de clienți activi
6. **Regiuni Active** - Numărul de regiuni cu activitate

### Growth & Retention Metrics

1. **Clienți Noi** - Numărul de clienți noi într-o perioadă
2. **Clienți Recurenți** - Numărul de clienți care au comandat din nou
3. **Rata de Revenire** - Procentul de clienți care revin (0-100%)
4. **Valoare Medie Comandă (AOV)** - Valoarea medie a unei comenzi
5. **Producători Noi** - Numărul de producători noi în perioada respectivă

### Time Series (Evoluție în Timp)

1. **Orders Over Time** - Grafic cu evoluția comenzilor în timp
2. **GMV Over Time** - Grafic cu evoluția volumului total al comenzilor
3. **Fees Over Time** - Grafic cu evoluția comisioanelor colectate

### Segments Breakdown

Tabel cu breakdown pe segmente de clienți:
- **Clienți noi** - Clienți care au făcut prima comandă
- **Clienți recurenți** - Clienți care au comandat de mai multe ori
- **Abonați** - Clienți cu abonamente active
- **Business clients** - Clienți business (B2B)

Pentru fiecare segment se afișează:
- Număr de comenzi
- GMV (Gross Merchandise Volume)
- Fees (Comisioane colectate)

### Regions Breakdown

Tabel cu breakdown pe regiuni (anonymizate):
- Nume regiune (anonymizat, ex: "Regiunea 1")
- Număr de comenzi
- GMV
- Număr de producători activi

## Principiul de Anonimizare

### ✅ Date Permise

- **Agregate la nivel de platformă:** Total orders, total GMV, total fees
- **Agregate la nivel de segment:** Breakdown pe tipuri de clienți (fără identificare individuală)
- **Agregate la nivel de regiune:** Breakdown pe regiuni cu nume anonymizate
- **Time series agregate:** Puncte zilnice/săptămânale/lunare (fără timestamps cu context de utilizator)
- **Metrici de creștere:** Procente și medii (fără date individuale)

### ❌ Date Interzise

- **Identificatori personali:** Nume, email, telefon, ID-uri de utilizator
- **Tranzacții individuale:** Detalii despre comenzi specifice, cumpărături individuale
- **Detalii producători:** Nume producători, adrese, informații de contact
- **Detalii clienți:** Nume clienți, adrese, istoric de cumpărături individual
- **Precizie geografică:** Locații exacte, adrese, coordonate
- **Timestamps cu context de utilizator:** "Utilizator X a comandat la ora Y"

## Sursa Datelor

Datele provin din:

1. **Comenzi** - Toate comenzile procesate pe platformă
2. **Comisioane** - Comisioanele colectate de Farmero
3. **Abonamente** - Abonamentele active (clienți și producători)
4. **Utilizatori** - Conturi active (clienți, producători, business)
5. **Regiuni** - Distribuția geografică (anonymizată)

## Roluri cu Acces

- **investor** - Acces complet la dashboard
- **admin** - Acces complet la dashboard

## Potențiale Extensii Viitoare

### Comparare Perioade

- Comparare între perioade (ex: "Ultimele 30 de zile" vs "Perioada anterioară")
- Calcularea creșterii/descreșterii procentuale

### Breakdown Extra

- **Pe tipuri de produse:** Breakdown pe categorii de produse (fără identificare de producători individuali)
- **Pe tipuri de clienți:** Breakdown mai detaliat (ex: "Clienți premium", "Clienți standard")
- **Pe canale:** Breakdown pe canale de marketing (dacă e relevant, fără identificare individuală)

### Filtre de Timp

- Selectare perioadă (ultimele 7 zile, 30 zile, 90 zile, 1 an)
- Comparare perioade (ex: "Ianuarie 2025" vs "Ianuarie 2024")

### Export Date

- Export CSV/Excel pentru analiză offline (doar date agregate, fără PII)

## Implementare Backend

Vezi `docs/BACKEND_API_CONTRACT_FARMERO_INVESTOR_METRICS.md` pentru contractul API complet.

## Frontend Implementation

- **Tipuri:** `src/lib/types/farmero-investor-metrics.ts`
- **API Client:** `src/lib/api/farmero-investor.ts`
- **UI:** `src/app/(site)/investor-portal/dashboard/page.tsx`
- **Feature Flag:** `BackendSyncStatus.investorMetrics`

---

**Ultima actualizare:** 2025-01-27  
**Versiune:** 1.0

