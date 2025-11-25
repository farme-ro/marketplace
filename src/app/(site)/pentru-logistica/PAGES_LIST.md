# Lista paginilor create pentru "Pentru Logistică și Transport"

## Pagini principale

### 1. Pagina principală - Landing Page
**Path:** `/pentru-logistica`  
**File:** `src/app/(site)/pentru-logistica/page.tsx`

**Secțiuni incluse:**
- Hero Section (`logistics-hero.tsx`)
- Services Section (`#servicii`) - `services-section.tsx`
- Partnership Section - `partnership-section.tsx`
- CTA Section - `logistics-cta-section.tsx`

**Link-uri din mega menu:**
- `/pentru-logistica` - Logistică și transport (din "Devino partener")

### 2. Pagina de Login
**Path:** `/pentru-logistica/login`  
**File:** `src/app/(site)/pentru-logistica/login/page.tsx`

**Funcționalități:**
- Formular de autentificare (email + parolă)
- Link către pagina de înregistrare
- Link către recuperare parolă
- Redirect către dashboard după login
- Design responsive cu coloană informativă

### 3. Pagina de Register
**Path:** `/pentru-logistica/register`  
**File:** `src/app/(site)/pentru-logistica/register/page.tsx`

**Funcționalități:**
- Formular de înregistrare cu câmpuri:
  - Nume complet (obligatoriu)
  - Email (obligatoriu)
  - Număr de telefon (obligatoriu)
  - Nume companie (obligatoriu)
  - Tip serviciu (obligatoriu): Livrări, Depozitare, Pachetomate, Multiple servicii
  - Parolă și confirmare parolă (obligatorii)
  - Mesaj (opțional)
- Validare și feedback
- Pagină de confirmare când status = PENDING
- Design responsive

### 4. Dashboard Logistică
**Path:** `/pentru-logistica/dashboard`  
**File:** `src/app/(site)/pentru-logistica/dashboard/page.tsx`

**Conținut:**
- **KPIs (Key Performance Indicators):**
  - Livrări totale cu trend
  - Venituri totale cu creștere
  - Livrări în curs
  - Contracte active

- **Livrări recente:**
  - Lista cu ultimele livrări
  - Status (completed, in_transit)
  - Destinație și valoare
  - Link către toate livrările

- **Contracte:**
  - Lista contractelor active
  - Tip serviciu, perioadă, comision
  - Link către toate contractele

- **Metrici de performanță:**
  - Timp mediu livrare
  - Rata la timp (on-time rate)
  - Livrări finalizate

## Componente create

### Componente pentru Landing Page:
1. `logistics-hero.tsx` - Hero section cu CTA
2. `services-section.tsx` - Servicii căutate (livrări, depozitare, pachetomate) și beneficii
3. `partnership-section.tsx` - Detalii despre parteneriat
4. `logistics-cta-section.tsx` - Secțiune finală cu call-to-action

## Tipuri de servicii

- **DELIVERY** - Livrări cu mașini frigorifice
- **WAREHOUSE** - Depozitare
- **PACKAGING** - Pachetomate
- **MULTI** - Multiple servicii

## Structura directoarelor

```
src/app/(site)/pentru-logistica/
├── _components/
│   ├── logistics-hero.tsx
│   ├── services-section.tsx
│   ├── partnership-section.tsx
│   └── logistics-cta-section.tsx
├── login/
│   └── page.tsx
├── register/
│   └── page.tsx
├── dashboard/
│   └── page.tsx
├── page.tsx
└── PAGES_LIST.md (acest fișier)
```

## Integrare în sistem

### Autentificare
- Tip utilizator: `LogisticsUser` cu `role: 'LOGISTICS'`
- Status: `PENDING` | `APPROVED` | `ACTIVE`
- Funcții API: `loginLogistics()`, `registerLogistics()`, `getLogisticsProfile()`

### Protecție rută
- Dashboard protejat cu `<RequireAuth role="logistics">`
- Verificare status PENDING - afișează mesaj de așteptare
- Redirect automat către login dacă nu este autentificat

### Mega Menu
- Adăugat în "Devino partener" → "Alte oportunități" → "Logistică și transport"
- Link în CTA section: `/pentru-logistica/register`

## Endpoint-uri backend necesare

```
POST /auth/logistics/register
POST /auth/logistics/login
GET  /auth/logistics/me
POST /auth/logistics/logout
GET  /api/logistics/deliveries
GET  /api/logistics/contracts
GET  /api/logistics/commissions
GET  /api/logistics/statistics
```

## Status implementare

✅ Tipul LogisticsUser adăugat în auth.ts  
✅ Funcții de login/register pentru logistiști  
✅ AuthContext actualizat pentru logistiști  
✅ RequireAuth actualizat pentru rolul logistics  
✅ Pagina principală cu toate secțiunile  
✅ Pagina de login  
✅ Pagina de register  
✅ Dashboard logistică cu statistici, livrări, contracte  
✅ Categoria adăugată în mega menu "Devino partener"  
⏳ Integrare API (backend)  
⏳ Protecție rută dashboard (implementată, necesită backend)  
⏳ Sistem rapoarte și documente pentru contracte  

## Note importante

1. **Autentificare:** Paginile de login și register folosesc funcțiile din AuthContext. Trebuie implementate endpoint-urile reale în backend.

2. **Dashboard:** Dashboard-ul folosește date mock. Trebuie conectat la API-ul real pentru:
   - Livrări reale
   - Contracte active
   - Comisioane calculate
   - Statistici de performanță

3. **Protecție rută:** Dashboard-ul este protejat cu `RequireAuth` și verifică status-ul utilizatorului.

4. **Acces din dashboard farme.ro:** Dashboard-ul farme.ro va putea accesa toate datele logistiștilor prin API-uri dedicate pentru admini.

