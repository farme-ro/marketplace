# Farmero Donations Policy

**Data:** 2025-01-27  
**Scop:** Politica de donații și transparență pentru platforma Farmero  
**Status:** Frontend-ready, așteaptă implementare backend

---

## 📋 Rezumat Executiv

Acest document descrie:
- Tipul de donații acceptate
- Politica de anonimitate
- Beneficii (sau lipsa lor)
- Ce informații sunt afișate public
- Conformitate GDPR

**IMPORTANT:** 
- Donațiile sunt către platforma Farmero, nu cumpărare de servicii
- Donațiile nu oferă beneficii comerciale
- Anonimitatea este implicită, cu opțiune de dezvăluire doar cu consimțământ explicit

---

## 💰 1. Tip de Donație

### 1.1. Donații către Platformă

**Donațiile sunt:**
- Contribuții voluntare către platforma Farmero
- **NU** sunt cumpărare de servicii
- **NU** oferă beneficii comerciale (discounturi, priorități, etc.)
- **NU** sunt investiții sau acțiuni

**Scopul donațiilor:**
- Susținerea infrastructurii platformei
- Dezvoltarea de noi funcționalități
- Suport pentru producători mici
- Proiecte sociale și sustenabile (în viitor)

---

## 🔒 2. Anonimitate

### 2.1. Intern (Farmero)

**Farmero poate ști:**
- Cine a donat (pentru contabilitate și conformitate legală)
- Suma donată
- Data donației
- Metoda de plată (pentru procesare)

**Motiv:**
- Necesar pentru contabilitate și raportare fiscală
- Necesar pentru conformitate cu reglementările locale
- Necesar pentru procesarea plăților

### 2.2. Public (UI pentru alți utilizatori)

**Implicit:**
- Donațiile sunt **anonime**
- Numele donatorilor **NU** sunt afișate altor utilizatori
- Doar sume agregate și număr de donatori sunt afișate public

**Opțional (viitor):**
- Utilizatorul poate alege să-și afișeze numele public
- **DOAR** cu consimțământ explicit (checkbox, default: off)
- Consimțământul poate fi retras oricând

---

## 🎁 3. Beneficii

### 3.1. Fără Beneficii Comerciale

**Donațiile NU oferă:**
- Discounturi la produse
- Priorități la livrare
- Acces la funcționalități premium
- Beneficii comerciale de orice fel

**Donațiile oferă:**
- Susținerea platformei
- Contribuție la dezvoltarea comunității
- Posibilitatea de a fi recunoscut public (dacă se alege opțiunea)

---

## 📊 4. Ce Afișăm Public

### 4.1. Informații Agregate

**Afișăm:**
- Sume agregate pe perioade (ex: "Luna aceasta, comunitatea Farmero a donat X lei")
- Număr de donatori (fără nume, implicit)
- Perioade agregate (lunar, anual, etc.)

**Exemplu:**
```
"Luna aceasta, comunitatea Farmero a donat 5.234 lei."
"127 persoane au ales să contribuie."
```

### 4.2. Informații NEafișate Public

**NU afișăm:**
- Numele donatorilor (implicit)
- Sumele individuale (implicit)
- Datele personale ale donatorilor
- Metodele de plată

**Excepție:**
- Dacă utilizatorul a dat consimțământ explicit pentru afișarea numelui

---

## 🔐 5. GDPR & Conformitate

### 5.1. Datele Colectate

**Date minimale necesare:**
- Suma donată
- Data donației
- Metoda de plată (pentru procesare)
- Datele necesare pentru procesarea plății (conform procesatorului de plăți)

**Date opționale:**
- Preferința de anonimitate/publicitate (dacă utilizatorul alege să-și afișeze numele)

### 5.2. Utilizarea Datelor

**Folosim datele pentru:**
- Procesarea donațiilor
- Contabilitate și raportare fiscală
- Conformitate legală
- Statistici agregate (fără identificare personală)

**NU folosim datele pentru:**
- Marketing direct (fără consimțământ)
- Vânzare către terți
- Alte scopuri comerciale

### 5.3. Consimțământul Utilizatorului

**Implicit:**
- Donațiile sunt anonime
- Numele nu este afișat public

**Explicit (opțional):**
- Utilizatorul poate alege să-și afișeze numele public
- Consimțământul este dat explicit (checkbox, default: off)
- Consimțământul poate fi retras oricând

### 5.4. Drepturile Utilizatorului

**Utilizatorul poate:**
- Solicita accesul la datele sale
- Solicita ștergerea datelor (conform GDPR)
- Retrage consimțământul pentru afișarea numelui
- Solicita corectarea datelor

**Notă:** Ștergerea completă a datelor poate fi limitată de obligațiile legale (contabilitate, raportare fiscală).

---

## 📝 6. Proces de Donație

### 6.1. Fluxul Actual (Frontend)

**Pas 1:** Utilizatorul accesează pagina `/sustine-farmero`

**Pas 2:** Utilizatorul alege suma (ex: 10, 25, 50, custom)

**Pas 3:** Utilizatorul apasă "Donează"

**Pas 4:** (În dezvoltare) Redirecționare către procesatorul de plăți

**Pas 5:** (În dezvoltare) Confirmare și mulțumire

### 6.2. Fluxul Viitor (Backend)

**TODO:** Backend-ul trebuie să implementeze:
- Procesarea plăților (integrare cu procesator de plăți)
- Generarea de receipt-uri
- Actualizarea statisticilor agregate
- Respectarea preferințelor de anonimitate

---

## 📊 7. Transparență

### 7.1. Raportare Publică

**Afișăm public:**
- Sume agregate pe perioade
- Număr de donatori
- Perioade agregate (lunar, anual)

**NU afișăm:**
- Detalii individuale (fără consimțământ)
- Sume individuale (fără consimțământ)

### 7.2. Raportare Internă

**Pentru contabilitate:**
- Toate donațiile sunt înregistrate
- Receipt-uri sunt generate
- Raportare fiscală conform legii

---

## ✅ 8. Checklist Implementare

### Frontend (✅ Complet)
- [x] Documentație politică donații
- [x] Tipuri TypeScript pentru donații
- [x] API client pentru donații
- [x] UI pentru pagina "Susține Farmero"
- [x] Integrare în navigație (footer)
- [x] Traduceri i18n
- [x] Accesibilitate

### Backend (⏳ Așteaptă implementare)
- [ ] Endpoint `/donations/summary` (GET)
- [ ] Endpoint `/donations/intent` (POST)
- [ ] Endpoint `/donations/preferences` (GET/PATCH)
- [ ] Integrare procesator de plăți
- [ ] Generare receipt-uri
- [ ] Actualizare statistici agregate
- [ ] Respectare preferințe anonimitate

---

## 📝 9. Note de Business

### 9.1. Transparență

- Toate donațiile trebuie să fie transparente
- Utilizatorii trebuie să știe exact ce primesc (sau nu primesc) pentru donații
- Statisticile agregate trebuie să fie actualizate regulat

### 9.2. Conformitate Legală

- Donațiile trebuie să respecte legislația locală
- Receipt-uri trebuie generate conform cerințelor legale
- Raportare fiscală conform cerințelor

### 9.3. Comunicare

- Mesajele trebuie să fie clare și transparente
- Utilizatorii trebuie să înțeleagă că donațiile nu oferă beneficii comerciale
- Utilizatorii trebuie să știe că donațiile sunt anonime implicit

---

**Ultima actualizare:** 2025-01-27  
**Versiune:** 1.0

