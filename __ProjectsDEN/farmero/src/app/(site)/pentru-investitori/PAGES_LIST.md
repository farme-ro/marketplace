# Lista paginilor create pentru "Pentru Investitori"

## Pagini principale

### 1. Pagina principală - Landing Page
**Path:** `/pentru-investitori`  
**File:** `src/app/(site)/pentru-investitori/page.tsx`

**Secțiuni incluse:**
- Hero Section (`investors-hero.tsx`)
- Business Model Section (`#business-model`) - `business-model-section.tsx`
- Financials Section (`#financials`) - `financials-section.tsx`
- Pitch Deck Section (`#pitch-deck`) - `pitch-deck-section.tsx`
- Strategy Section (`#strategy`) - `strategy-section.tsx`
- Market Analysis Section (`#market-analysis`) - `market-analysis-section.tsx`
- FAQ Section (`#faq`) - `investors-faq-section.tsx`
- CTA Section - `investors-cta-section.tsx`

**Link-uri din mega menu:**
- `/pentru-investitori` - Oportunități de investiție
- `/pentru-investitori#business-model` - Model de business
- `/pentru-investitori#financials` - Proiecții financiare
- `/pentru-investitori#pitch-deck` - Pitch deck
- `/pentru-investitori#strategy` - Strategie și viitor
- `/pentru-investitori#market-analysis` - Piața și concurența
- `/pentru-investitori#faq` - FAQ investitori

### 2. Pagina de Login
**Path:** `/pentru-investitori/login`  
**File:** `src/app/(site)/pentru-investitori/login/page.tsx`

**Funcționalități:**
- Formular de autentificare (email + parolă)
- Link către pagina de înregistrare
- Link către recuperare parolă
- Redirect către dashboard după login
- Design responsive cu coloană informativă

### 3. Pagina de Register
**Path:** `/pentru-investitori/register`  
**File:** `src/app/(site)/pentru-investitori/register/page.tsx`

**Funcționalități:**
- Formular de înregistrare cu câmpuri:
  - Nume complet (obligatoriu)
  - Email (obligatoriu)
  - Număr de telefon (obligatoriu)
  - Companie/Organizație (opțional)
  - Interes de investiție (opțional)
  - Mesaj (opțional)
- Validare și feedback
- Redirect către dashboard după înregistrare
- Design responsive

### 4. Dashboard Investitori
**Path:** `/pentru-investitori/dashboard`  
**File:** `src/app/(site)/pentru-investitori/dashboard/page.tsx`

**Conținut:**
- **KPIs (Key Performance Indicators):**
  - Venituri totale cu trend
  - Producători activi cu creștere
  - Comenzi totale cu trend
  - Valoare medie comandă

- **Metrici de creștere:**
  - Creștere venituri (lună peste lună)
  - Creștere utilizatori
  - Creștere comenzi

- **Actualizări recente:**
  - Lista cu milestone-uri și feature-uri noi
  - Link către toate actualizările

- **Rapoarte și documente:**
  - Secțiune pentru acces la rapoarte financiare
  - Link către contact pentru solicitare acces

## Componente create

### Componente pentru Landing Page:
1. `investors-hero.tsx` - Hero section cu CTA
2. `business-model-section.tsx` - Model de business, surse de venit, metrici cheie
3. `financials-section.tsx` - Proiecții financiare, detalii investiție
4. `pitch-deck-section.tsx` - Prezentare pitch deck, secțiuni preview
5. `strategy-section.tsx` - Faze de dezvoltare, inițiative cheie
6. `market-analysis-section.tsx` - Date despre piață, avantaje competitive, tendințe
7. `investors-faq-section.tsx` - FAQ interactiv cu accordion
8. `investors-cta-section.tsx` - Secțiune finală cu call-to-action

## Link-uri externe din mega menu

- `/contact?type=investor` - Contact pentru investitori
- `/contact?type=partnership` - Parteneriate strategice
- `/cum-functioneaza-si-impact#impact-section` - Impact social
- `/about` - Despre noi
- `/about#team` - Echipa și lideri

## Note importante

1. **Autentificare:** Paginile de login și register folosesc mock API calls. Trebuie implementate endpoint-urile reale în backend.

2. **Dashboard:** Dashboard-ul folosește date mock. Trebuie conectat la API-ul real pentru:
   - Metrici financiare
   - Date despre producători
   - Statistici comenzi
   - Actualizări și rapoarte

3. **Protecție rută:** Dashboard-ul ar trebui protejat cu autentificare. Poate fi implementat folosind middleware sau componente de protecție.

4. **Acces rapoarte:** Secțiunea de rapoarte necesită un sistem de gestionare a documentelor și acces controlat.

## Structura directoarelor

```
src/app/(site)/pentru-investitori/
├── _components/
│   ├── investors-hero.tsx
│   ├── business-model-section.tsx
│   ├── financials-section.tsx
│   ├── pitch-deck-section.tsx
│   ├── strategy-section.tsx
│   ├── market-analysis-section.tsx
│   ├── investors-faq-section.tsx
│   └── investors-cta-section.tsx
├── login/
│   └── page.tsx
├── register/
│   └── page.tsx
├── dashboard/
│   └── page.tsx
├── page.tsx
└── PAGES_LIST.md (acest fișier)
```

## Status implementare

✅ Pagina principală cu toate secțiunile  
✅ Pagina de login  
✅ Pagina de register  
✅ Dashboard investitori  
⏳ Integrare API (backend)  
⏳ Protecție rută dashboard  
⏳ Sistem rapoarte și documente  

