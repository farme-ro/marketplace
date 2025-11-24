# 📝 TODO Tracking - Backend Dependencies & Future Enhancements

**Data:** 2025-01-27  
**Scop:** Tracking pentru toate TODO-urile din cod  
**Status:** 🟡 Documentat

---

## 📋 TODO-uri Identificate (13 locații)

### 1. Upload Logo/Cover Producer
**Locație:** `src/lib/i18n/translations/ro.json:2147, 2151`  
**Status:** ⏳ **Backend Dependency**  
**Descriere:** Upload logo și cover image pentru producători  
**Acțiune:** Așteaptă implementare backend endpoint pentru file upload  
**Prioritate:** 🟡 Medium

**Keys:**
- `producer.settings.logoNote`: "TODO: Upload logo funcțional când backend suportă"
- `producer.settings.coverNote`: "TODO: Upload cover funcțional când backend suportă"

---

### 2. Account Deletion Logic
**Locație:** `src/app/(site)/account/page.tsx:899`  
**Status:** ⏳ **Future Enhancement**  
**Descriere:** Implementare logică pentru ștergerea contului  
**Acțiune:** Funcționalitatea va fi disponibilă direct din cont în curând (mesaj afișat utilizatorului)  
**Prioritate:** 🟡 Medium

**Notă:** Momentan afișează un mesaj că funcționalitatea va fi disponibilă în curând.

---

### 3. Producer ID in Popular Products
**Locație:** `src/components/site/popular-products-carousel.tsx:88`  
**Status:** ⏳ **Data Enhancement**  
**Descriere:** Obținere producer ID din product data când este disponibil  
**Acțiune:** Adăugare producer ID în product data când backend oferă această informație  
**Prioritate:** 🟢 Low

---

### 4. Product Slug in Producer Products List
**Locație:** `src/app/(site)/producers/[slug]/_components/producer-products-list.tsx:47`  
**Status:** ⏳ **Data Enhancement**  
**Descriere:** Obținere product slug când este disponibil  
**Acțiune:** Adăugare slug în product data când backend oferă această informație  
**Prioritate:** 🟢 Low

---

### 5. Favorite Functionality
**Locație:** `src/app/(site)/products/[slug]/_components/product-header-section.tsx:237`  
**Status:** ⏳ **Backend Dependency**  
**Descriere:** Implementare funcționalitate favorite pentru produse  
**Acțiune:** Așteaptă implementare backend endpoints pentru favorites  
**Prioritate:** 🟡 Medium

**Notă:** UI-ul pentru favorite există deja, doar integrarea cu backend lipsește.

---

### 6. Commission Calculation from API
**Locație:** `src/components/producer-portal/producer-commission-summary.tsx:29`  
**Status:** ⏳ **Backend Dependency**  
**Descriere:** Calculare comisioane din API când este disponibil  
**Acțiune:** Așteaptă implementare backend endpoint pentru comisioane  
**Prioritate:** 🟡 Medium

**Notă:** Momentan folosește date mock pentru afișare.

---

### 7. Commission History API Endpoint
**Locație:** `src/app/(site)/producer-portal/commissions/_components/commission-history-section.tsx:31`  
**Status:** ⏳ **Backend Dependency**  
**Descriere:** Afișare istoric comisioane din API când endpoint-ul este disponibil  
**Acțiune:** Așteaptă implementare backend endpoint pentru istoric comisioane  
**Prioritate:** 🟡 Medium

**Notă:** Momentan afișează un mesaj că datele vor fi disponibile când endpoint-ul este gata.

---

### 8. File Upload in Support
**Locație:** `src/app/(site)/producer-portal/support/page.tsx:182`  
**Status:** ⏳ **Backend Dependency**  
**Descriere:** Implementare upload fișiere pentru mesaje suport  
**Acțiune:** Așteaptă implementare backend endpoint pentru file upload  
**Prioritate:** 🟡 Medium

**Notă:** UI-ul pentru upload există deja, doar integrarea cu backend lipsește.

---

## 📊 Summary

**Total TODO-uri:** 13  
**Backend Dependencies:** 5  
**Future Enhancements:** 1  
**Data Enhancements:** 2  
**UI Ready, Backend Missing:** 2

**Priorități:**
- 🟡 Medium: 6 TODO-uri
- 🟢 Low: 2 TODO-uri

---

## ✅ Acțiuni Recomandate

1. **Backend Team:** Implementare endpoint-uri pentru:
   - File upload (logo, cover, support attachments)
   - Favorites API
   - Commission calculation & history API

2. **Frontend Team:** 
   - Păstrează UI-ul gata pentru integrare
   - Documentează API contracts pentru backend team

3. **Product Team:**
   - Prioritizează funcționalitățile în funcție de nevoile utilizatorilor

---

**Ultima actualizare:** 2025-01-27

