# 📚 User Guides - farme.ro

**Data:** 2025-01-27  
**Status:** 📚 **Ghiduri utilizator pentru toate tipurile de utilizatori**

---

## 👤 Ghid Client

### Cum să îți creezi cont

1. Accesează [farme.ro/register](https://farme.ro/register)
2. Completează formularul:
   - Email
   - Parolă (minim 8 caractere)
   - Nume complet
3. Click "Creează cont"
4. Verifică email-ul pentru confirmare (dacă e necesar)

### Cum să cumperi produse

1. **Browse produse**
   - Accesează [farme.ro/products](https://farme.ro/products)
   - Folosește filtrele pentru a găsi ce cauți
   - Caută după nume, categorie sau regiune

2. **Vezi detalii produs**
   - Click pe un produs pentru detalii
   - Verifică preț, stoc, descriere
   - Vezi review-uri de la alți clienți

3. **Adaugă în coș**
   - Selectează cantitatea
   - Click "Adaugă în coș"
   - Produsul este adăugat în coșul tău

4. **Finalizează comandă**
   - Accesează coșul din meniu
   - Verifică produsele și totalul
   - Click "Finalizează comandă"
   - Completează adresa de livrare
   - Selectează metoda de plată
   - Confirmă comanda

### Cum să urmărești comanda

1. Accesează [farme.ro/orders](https://farme.ro/orders)
2. Vezi toate comenzile tale
3. Click pe o comandă pentru detalii
4. Verifică status-ul comenzii:
   - **PENDING** - Comandă în așteptare
   - **PAID** - Comandă plătită
   - **PREPARING** - Producătorul pregătește comanda
   - **SHIPPED** - Comandă trimisă (vezi tracking number)
   - **DELIVERED** - Comandă livrată
   - **COMPLETED** - Comandă finalizată

### Cum să gestionezi contul

1. **Profile**
   - Accesează [farme.ro/account](https://farme.ro/account)
   - Editează datele personale
   - Schimbă parola

2. **Adrese**
   - Gestionează adresele de livrare
   - Adaugă, editează sau șterge adrese
   - Setează adresa implicită

3. **Favorite**
   - Adaugă produse la favorite
   - Vezi lista de favorite
   - Șterge din favorite

4. **Abonamente**
   - Creează abonamente pentru produse
   - Gestionează abonamentele existente
   - Anulează abonamente

---

## 🏭 Ghid Producător

### Cum să îți creezi cont de producător

1. Accesează [farme.ro/register](https://farme.ro/register)
2. Selectează "Sunt producător"
3. Completează formularul:
   - Date personale
   - Date companie (CUI, nume, adresă)
   - Upload documente (dacă e necesar)
4. Submit
5. Așteaptă aprobarea admin-ului

### Cum să adaugi produse

1. **Accesează portalul producătorului**
   - Login ca producător
   - Accesează [farme.ro/producer-portal/products](https://farme.ro/producer-portal/products)

2. **Adaugă produs nou**
   - Click "Adaugă produs"
   - Completează formularul:
     - Nume produs
     - Descriere
     - Preț
     - Stoc
     - Categorie
     - Unitate de măsură
     - Upload imagine
   - Submit
   - Produsul va fi trimis pentru aprobare

3. **Gestionează produsele**
   - Vezi toate produsele tale
   - Editează produse existente
   - Șterge produse
   - Upload/șterge imagini

### Cum să gestionezi comenzi

1. **Vezi comenzile**
   - Accesează [farme.ro/producer-portal/orders](https://farme.ro/producer-portal/orders)
   - Vezi toate comenzile cu produsele tale

2. **Acceptă comandă**
   - Click "Acceptă comandă"
   - Comanda devine ACCEPTED

3. **Pregătește comandă**
   - Click "Pregătește comandă"
   - Comanda devine PREPARING

4. **Trimite comandă**
   - Adaugă tracking number
   - Click "Trimite comandă"
   - Comanda devine SHIPPED
   - Clientul primește notificare

5. **Marchează ca livrată**
   - Click "Comandă livrată"
   - Comanda devine DELIVERED

### Cum să vezi comisioanele

1. Accesează [farme.ro/producer-portal/commissions](https://farme.ro/producer-portal/commissions)
2. Vezi istoricul comisioanelor
3. Verifică totalul comisioanelor
4. Vezi detalii pentru fiecare comandă

### Cum să gestionezi profilul

1. **Settings**
   - Accesează [farme.ro/producer-portal/settings](https://farme.ro/producer-portal/settings)
   - Editează informațiile companiei
   - Upload logo
   - Upload cover image

2. **Documents**
   - Gestionează documentele
   - Upload contracte
   - Vezi facturi

---

## 👑 Ghid Admin

### Cum să gestionezi producătorii

1. Accesează `/admin/producers`
2. Vezi toți producătorii (pending, approved, rejected)
3. **Aprobă producător:**
   - Click pe producător
   - Review documente
   - Click "Aprobă"
4. **Respinge producător:**
   - Click "Respinge"
   - Adaugă motiv (dacă e necesar)

### Cum să gestionezi produsele

1. Accesează `/admin/products`
2. Vezi toate produsele (pending, approved, rejected)
3. **Aprobă produs:**
   - Click pe produs
   - Review detalii
   - Click "Aprobă"
4. **Respinge produs:**
   - Click "Respinge"
   - Adaugă motiv

### Cum să gestionezi comisioanele

1. Accesează `/admin/commissions`
2. Vezi toate comisioanele
3. Verifică calcularea comisioanelor
4. Gestionează payout-urile (dacă e implementat)

### Cum să gestionezi review-urile

1. Accesează reviews pending (dacă e implementat)
2. Review comentarii
3. Aprobă sau respinge review-uri

---

## 🔍 FAQ - Întrebări Frecvente

### Pentru Clienți

**Cum pot schimba adresa de livrare?**
- Accesează `/account` → "Adrese"
- Editează sau adaugă adresă nouă

**Cum pot anula o comandă?**
- Contactează producătorul sau support-ul
- Comenzile pot fi anulate doar înainte de acceptare

**Cum pot lăsa un review?**
- După ce comanda este COMPLETED
- Accesează pagina comenzii
- Click "Lasă review"

### Pentru Producători

**Cât timp durează aprobarea?**
- Aprobarea se face de către admin
- De obicei în 24-48 de ore

**Cum pot modifica un produs deja aprobat?**
- Editează produsul
- Modificările vor fi trimise din nou pentru aprobare

**Cum sunt calculate comisioanele?**
- Comisioanele sunt 8% din valoarea comenzii
- Sunt calculate automat la checkout

---

**Status:** 📚 **Ghiduri complete pentru utilizatori**

**Notă:** Aceste ghiduri pot fi folosite pentru documentație publică sau pentru training utilizatori.

