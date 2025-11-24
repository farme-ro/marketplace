# Farmero Legal & Logistics Documentation

**Data:** 2025-01-27  
**Scop:** Documentație funcțională pentru sistemul de documente legale și logistică  
**Status:** Frontend-ready, așteaptă consultanță legală/contabilă și implementare backend

---

## 📋 Rezumat Executiv

Acest document descrie sistemul de documente legale și logistică pentru platforma Farmero:
- **e-Factura** - Facturare electronică conform legislației române
- **Contracte standard** - Generare contracte între părți
- **Avize de însoțire a mărfii** - Documente pentru transport
- **AWB & Logistică** - Gestionare livrări și tracking

**IMPORTANT:** 
- Acest document este un concept funcțional
- **TODO:** Necesită consultanță contabilă/juridică pentru implementare completă
- Frontend-ul este pregătit cu UI shell și tipuri de date
- Backend-ul trebuie să implementeze logica legală și integrarea cu ANAF/curier

---

## 📄 1. e-Factura

### 1.1. Concept

**Scop:** Emiterea de facturi electronice conform legislației române (Legea 227/2015, OUG 120/2021).

**TODO - Consultanță necesară:**
- [ ] Determinarea entității care emite factura (producător vs platformă)
- [ ] Verificarea obligațiilor legale pentru fiecare scenariu
- [ ] Integrare cu sistemul ANAF (SPV - Sistemul Privat Virtual)
- [ ] Verificarea necesității de certificat digital pentru semnare
- [ ] Procesul de validare și arhivare facturi

### 1.2. Cine emite factura?

**Opțiunea 1: Producătorul emite factura**
- Producătorul este entitatea legală care vinde produsele
- Platforma Farmero este doar intermediar (marketplace)
- Producătorul trebuie să aibă CUI și să fie înregistrat la ANAF
- **Avantaje:** Producătorul controlează facturarea
- **Dezavantaje:** Fiecare producător trebuie să aibă sistem de facturare

**Opțiunea 2: Platforma Farmero emite factura**
- Farmero este entitatea care emite factura către client
- Producătorul primește o factură internă de la Farmero
- **Avantaje:** Centralizare, control mai bun
- **Dezavantaje:** Complexitate legală mai mare, necesită consultanță

**TODO:** Consultanță contabilă/juridică pentru a determina modelul optim.

### 1.3. Date necesare de la client

**Pentru facturare B2C (clienți persoane fizice):**
- Nume complet
- CNP (Cod Numeric Personal) - opțional pentru facturi < 300 RON
- Adresă completă
- Email (pentru trimitere factură electronică)
- Telefon (opțional)

**Pentru facturare B2B (clienți business):**
- Denumire firmă
- CUI (Cod Unic de Înregistrare)
- Adresă sediu social
- Email
- Telefon
- IBAN (dacă este necesar pentru plată)

**TODO:** Verificare legală pentru obligațiile exacte de colectare date.

### 1.4. Structura facturii

**Câmpuri obligatorii (conform legislației):**
- Număr factură (unic, secvențial)
- Data emiterii
- Date emitent (nume, CUI, adresă, cont bancar)
- Date client (nume, CUI/CNP, adresă)
- Listă produse (denumire, cantitate, preț unitar, valoare)
- Valoare totală fără TVA
- TVA (dacă este cazul)
- Valoare totală cu TVA
- Modalitate de plată
- Termen de plată

**TODO:** Verificare cu contabil pentru toate câmpurile obligatorii.

### 1.5. Integrare ANAF

**TODO - Implementare necesară:**
- [ ] Integrare cu SPV (Sistemul Privat Virtual) ANAF
- [ ] Transmitere facturi în format XML conform standardului RO e-Factura
- [ ] Validare și confirmare primire de la ANAF
- [ ] Arhivare facturi (conform perioadei legale)
- [ ] Generare PDF pentru client

---

## 📝 2. Contracte Standard

### 2.1. Concept

**Scop:** Generare automată de contracte standard între părți, bazate pe template-uri predefinite.

**Tipuri de contracte:**

1. **Contract producător ↔ Farmero**
   - Acord de parteneriat
   - Termeni și condiții pentru utilizarea platformei
   - Comisioane și plăți
   - Obligații și responsabilități

2. **Contract B2B business ↔ producător / Farmero**
   - Contract de vânzare-cumpărare
   - Termeni de livrare
   - Termeni de plată
   - Garanții și returnări

### 2.2. Generator de contracte

**Funcționalitate:**
- Template-uri predefinite pentru fiecare tip de contract
- Formular pentru completare date (părți, sume, termeni)
- Generare automată a contractului completat
- Semnare electronică (TODO: verificare legalitate)
- Arhivare contracte

**TODO - Consultanță necesară:**
- [ ] Verificare legalitate semnătură electronică
- [ ] Template-uri legale validate de avocat
- [ ] Proces de actualizare template-uri (versiuni)
- [ ] Arhivare conform perioadei legale

### 2.3. Template-uri

**Structură template:**
- ID unic
- Nume template
- Tip contract
- Versiune
- Conținut (HTML/PDF template cu placeholder-uri)
- Câmpuri necesare pentru completare

**Exemplu câmpuri:**
- Date părți (nume, CUI, adresă)
- Obiect contract
- Valoare
- Termeni de plată
- Termeni de livrare
- Data semnării

---

## 🚚 3. Avize de Însoțire a Mărfii

### 3.1. Concept

**Scop:** Documente care însoțesc mărfurile în timpul transportului.

**Când sunt necesare:**
- Transport între producător și client
- Transport între depozite
- Transport pentru evenimente/piețe

**TODO - Consultanță necesară:**
- [ ] Verificare obligații legale pentru avize
- [ ] Cine emite avizul (producător / platformă / logistică parteneră)
- [ ] Format și conținut obligatoriu
- [ ] Arhivare documente

### 3.2. Conținut aviz

**Informații de bază:**
- Număr aviz (unic)
- Data emiterii
- Date expeditor (producător)
- Date destinatar (client)
- Listă produse (denumire, cantitate, unitate măsură)
- Observații (opțional)

**TODO:** Verificare cu expert logistic pentru toate câmpurile necesare.

### 3.3. Generator de avize

**Funcționalitate:**
- Generare automată din datele comenzii
- Export PDF
- Printare pentru însoțire mărfă
- Arhivare digitală

---

## 📦 4. AWB & Logistică

### 4.1. Concept

**Scop:** Gestionarea livrărilor și tracking-ului comenzilor.

### 4.2. Faza 1: AWB Manual

**Funcționalitate:**
- Producătorul poate introduce manual AWB-ul primit de la curier
- Asociere AWB cu comandă
- Tracking manual (producătorul actualizează statusul)

**Câmpuri necesare:**
- Nume curier (ex: "Fan Courier", "DPD", "GLS")
- Număr AWB (tracking number)
- Link către etichetă (opțional)
- Data livrării estimate

**UI:**
- Formular simplu pentru introducere AWB
- Listă AWB-uri per comandă
- Status tracking (în pregătire, în tranzit, livrat)

### 4.3. Faza 2: Generare AWB Direct

**Funcționalitate:**
- Integrare cu parteneri de logistică
- Generare automată AWB la confirmarea comenzii
- Tracking automat prin API-uri parteneri
- Notificări automate pentru status updates

**TODO - Implementare necesară:**
- [ ] Integrare cu API-uri curier (Fan Courier, DPD, GLS, etc.)
- [ ] Generare etichetă de expediere
- [ ] Tracking automat
- [ ] Notificări client pentru status livrare

**Parteneri potențiali:**
- Fan Courier
- DPD Romania
- GLS Romania
- Sameday
- Urgent Cargus

---

## 🔄 5. Integrare cu Alte Sisteme

### 5.1. Integrare cu Comenzi

- Facturile sunt generate automat la confirmarea comenzii
- Avizele sunt generate la pregătirea comenzii
- AWB-urile sunt asociate cu comenzile

### 5.2. Integrare cu Notificări

- Notificări când factura este emisă
- Notificări pentru status tracking AWB
- Notificări pentru documente expirate (dacă este cazul)

### 5.3. Integrare cu Finanțe

- Facturile sunt legate de plăți
- Raportare financiară bazată pe facturi
- Reconciliere automată

---

## ✅ 6. Checklist Implementare

### Frontend (✅ Complet)
- [x] Tipuri TypeScript pentru documente
- [x] UI shell pentru producer-portal
- [x] UI shell pentru business-portal
- [x] Documentație funcțională
- [x] Traduceri i18n

### Consultanță Necesară (⏳ Așteaptă)
- [ ] Consultanță contabilă pentru e-Factura
- [ ] Consultanță juridică pentru contracte
- [ ] Consultanță logistică pentru avize
- [ ] Verificare legalitate semnătură electronică

### Backend (⏳ Așteaptă implementare)
- [ ] Endpoint-uri pentru facturi
- [ ] Integrare ANAF SPV
- [ ] Generator contracte
- [ ] Generator avize
- [ ] Gestionare AWB manual
- [ ] Integrare API-uri curier (Faza 2)

---

## 📝 7. Note Importante

### 7.1. Conformitate Legală

**TODO:** Toate funcționalitățile trebuie verificate cu:
- Contabil autorizat
- Avocat specializat în drept comercial
- Expert în legislația fiscală română

### 7.2. Securitate

- Documentele trebuie stocate securizat
- Acces controlat la documente
- Arhivare conform perioadei legale
- Backup și disaster recovery

### 7.3. Privacy

- Respectare GDPR pentru datele clienților
- Minimizare date colectate
- Consent explicit pentru procesare date

---

**Ultima actualizare:** 2025-01-27  
**Versiune:** 1.0  
**Status:** Concept funcțional, așteaptă consultanță și implementare

