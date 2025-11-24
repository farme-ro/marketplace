# Farmero Homepage Marketplace & Monetization

**Data:** 2025-01-27  
**Scop:** Documentație pentru transformarea homepage-ului într-un adevărat marketplace cu infrastructură de monetizare  
**Status:** Implementat (frontend-only)

---

## 📋 Rezumat Executiv

Homepage-ul a fost transformat dintr-o pagină de prezentare într-un adevărat marketplace care:
- Ajută utilizatorii să descopere produse și producători
- Pregătește infrastructura pentru monetizare (producători cu vizibilitate plătită, abonamente)
- Oferă o experiență vizuală rafinată cu paletă caldă și naturală

---

## 🎨 1. Paletă & Theming

### Light Theme - "Zi de piață, aer cald, sănătos"

**Culori actualizate:**
- `--background`: `#F3F7F2` - Verde pastel deschis
- `--foreground`: `#1D2420` - Închis cald, nu negru pur
- `--card`: `#FBFCFA` - Alb cald
- `--muted-foreground`: `#4E5C54` - Gri-verzui
- `--secondary`: `#C76E4A` - Terracotta organic (pentru badge-uri și accent-uri)

### Dark Theme - "Seară la fermă", nu negru tehnic

**Culori actualizate:**
- `--background`: `#041A12` - Verde pădure foarte închis
- `--foreground`: `#F5FAF7` - Text deschis
- `--card`: `#0B2519` - Verde pin
- `--muted-foreground`: `#A3B7AA` - Text muted
- `--secondary`: `#D8906C` - Terracotta soft

**Fișier:** `src/app/globals.css`

---

## 🏪 2. Secțiuni Marketplace

### 2.1. Caută după categorie

**Componentă:** `CategoriesSection`  
**Locație:** `src/app/(site)/_components/home/categories-section.tsx`

**Ordinea categoriilor (potențial de coș):**
1. Legume & fructe
2. Lactate
3. Carne & mezeluri
4. Dulciuri
5. Băuturi locale
6. Altele

**Caracteristici:**
- Carduri cu icon-uri SVG custom
- Animații hover subtile
- Responsive (scroll orizontal pe mobile, grid pe desktop)

### 2.2. Alege zona ta

**Componentă:** `RegionsSection`  
**Locație:** `src/app/(site)/_components/home/regions-section.tsx`

**Caracteristici:**
- Grid de regiuni cu carduri
- Empty state elegant dacă nu există regiuni
- Link către produse filtrate după regiune

### 2.3. Producători recomandați

**Componentă:** `ProducersSection`  
**Locație:** `src/app/(site)/_components/home/producers-section.tsx`

**Caracteristici:**
- Suportă producători featured/boosted/sponsored
- Integrare cu `getFeaturedProducers()` API
- Fallback la producători normali dacă marketing nu este activ
- Carduri cu badge-uri pentru vizibilitate

### 2.4. Produse tradiționale din zona ta

**Componentă:** `ProductsSection`  
**Locație:** `src/app/(site)/_components/home/products-section.tsx`

**Caracteristici:**
- Grid de produse tradiționale
- Empty state friendly dacă nu există produse
- Integrare cu cart pentru adăugare rapidă

### 2.5. Abonamente de la producători (teaser)

**Componentă:** `SubscriptionsTeaserSection`  
**Locație:** `src/app/(site)/_components/home/subscriptions-teaser-section.tsx`

**Caracteristici:**
- Afișează 3-4 planuri publice de abonamente
- Skeleton state dacă feature-ul nu este activ
- Mesaj "Coming soon" elegant dacă nu există planuri
- Carduri cu preț, frecvență, producător

---

## 💰 3. Infrastructură UI pentru Monetizare

### 3.1. Producători cu Vizibilitate Plătită

**Tipuri:** `src/lib/types/farmero-marketing.ts`
- `ProducerPromotionTier`: `'none' | 'featured' | 'boosted' | 'sponsored'`
- `ProducerVisibilityInfo`: Informații despre vizibilitatea unui producător
- `ProducerWithVisibility`: Producător cu informații de vizibilitate

**API:** `src/lib/api/farmero-producers-marketing.ts`
- `getFeaturedProducers(regionId?)` - Returnează producători featured/boosted/sponsored
- `getProducerVisibilityInfo(producerId)` - Returnează info despre vizibilitate
- `enhanceProducerWithVisibility(producer)` - Adaugă info de vizibilitate la un producător

**UI:** `src/components/ui/producer-card.tsx`
- Badge-uri pentru fiecare tier:
  - `featured` → Badge "Recomandat" (terracotta)
  - `boosted` → Badge "Vizibilitate crescută" (verde)
  - `sponsored` → Badge "Partener Farmero" (terracotta mai puternic)
- Border-uri diferite în funcție de tier
- Highlight subtil pentru producători sponsored

**BackendSyncStatus:** `producerMarketing: false`

**Documentație:** `docs/BACKEND_API_CONTRACT_FARMERO_PRODUCER_MARKETING.md`

### 3.2. Abonamente Clienți

**Tipuri:** `src/lib/types/subscriptions.ts`
- `FarmeroSubscriptionPlan`: Plan public de abonament pentru homepage
- `SubscriptionFrequency`: `'weekly' | 'biweekly' | 'monthly'`

**API:** `src/lib/api/farmero-subscriptions-public.ts`
- `getPublicSubscriptionPlans(regionId?)` - Returnează planuri publice pentru homepage

**UI:** `SubscriptionsTeaserSection`
- Carduri cu planuri de abonamente
- Preț, frecvență, producător
- CTA "Află mai multe"
- Skeleton state și "Coming soon" message

**BackendSyncStatus:** `subscriptionsClient: false`

**Documentație:** `docs/BACKEND_API_CONTRACT_FARMERO_SUBSCRIPTIONS_PUBLIC.md`

---

## 🎯 4. Rolul Secțiunilor în Descoperire

### Descoperire Produse

**Secțiuni relevante:**
- **Caută după categorie** - Ajută utilizatorii să găsească rapid produsele dorite
- **Produse tradiționale din zona ta** - Produse relevante geografic
- **Abonamente** - Sugestie pentru cumpărături recurente

### Descoperire Producători

**Secțiuni relevante:**
- **Alege zona ta** - Producători din regiunea utilizatorului
- **Producători recomandați** - Producători featured/boosted/sponsored
- **Abonamente** - Producători care oferă abonamente

### Teaser pentru Abonamente

**Secțiune:** `SubscriptionsTeaserSection`
- Afișează planuri publice de abonamente
- Atrage clienți către funcționalitatea de abonamente
- Pregătește utilizatorii pentru cumpărături recurente

---

## 🔗 5. Relația cu Viitoarele Funcționalități

### Farmero Subscriptions

**Conexiune:**
- Secțiunea de abonamente pe homepage este un teaser pentru funcționalitatea completă
- Planurile publice vor fi folosite pentru a crea abonamente active
- Frecvența și prețurile vor fi sincronizate cu sistemul de billing

### Farmero Points / Farm Rewards

**Conexiune:**
- Producătorii featured/boosted pot oferi puncte bonus
- Abonamentele pot include puncte bonus pentru fidelitate
- Sistemul de badge-uri poate fi extins pentru a include niveluri de recompense

### Marketing & Social Auto-Posting

**Conexiune:**
- Producătorii sponsored pot avea postări automate pe social media
- Abonamentele pot genera conținut pentru marketing
- Featured producers pot fi promovați în campanii de marketing

---

## 📐 6. Spacing & Accesibilitate

### Spacing

**Scală de spacing:** 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64px

**Padding vertical secțiuni:**
- Desktop: 64-96px
- Mobile: 32-48px

**Padding carduri:**
- Desktop: 20-24px
- Mobile: 16px

**Distanță titlu-conținut:** 16-24px

### Accesibilitate

**Font size:**
- Body min: 16px (14px doar pentru info secundare/labels)

**Hit area:**
- Carduri & butoane ≥ 40x40px pe mobil

**Focus ring:**
- Vizibil și consistent pentru linkuri, butoane, carduri clicabile

**ARIA labels:**
- Corecte pentru butoane icon-only (search, theme toggle, etc.)

---

## 🎨 7. Iconografie & Animații

### Icon-uri

**SVG-uri custom** pentru categorii în `CategoriesSection`
- Simple și clare
- Aliniate cu paleta caldă
- Animații hover subtile

### Animații

**Hover pe card:**
- `translateY(-2px)` - Lift subtil
- Shadow soft

**Secțiuni în viewport:**
- Fade + slide discret (opțional)
- Respectă `prefers-reduced-motion`

**Micro-animații:**
- Icon-uri care se rotesc la hover
- Badge-uri care apar cu delay

---

## 📝 8. Ordinea Secțiunilor pe Homepage

1. **Hero Section** - Split layout modern
2. **Diferența Farme.ro** - 3 carduri animate
3. **Cum funcționează** - Timeline cu 4 pași
4. **Caută după categorie** - Carduri categorie
5. **Alege zona ta** - Selector de regiune
6. **Producători recomandați** - Grid cu producători (featured/boosted/sponsored)
7. **Produse tradiționale din zona ta** - Grid sau carusel
8. **Abonamente de la producători** - Teaser cu planuri
9. **Impact Social** - "Comanda ta face bine"
10. **Newsletter CTA** - Premium

---

## 🚀 9. Activare Backend

### Producători cu Vizibilitate

**BackendSyncStatus:** `producerMarketing: false`

**Când backend-ul este gata:**
1. Setează `producerMarketing: true` în `src/lib/backend-sync/status.ts`
2. Backend-ul trebuie să implementeze:
   - `GET /producers/featured`
   - `GET /producers/:id/visibility`

### Abonamente Publice

**BackendSyncStatus:** `subscriptionsClient: false`

**Când backend-ul este gata:**
1. Setează `subscriptionsClient: true` în `src/lib/backend-sync/status.ts`
2. Backend-ul trebuie să implementeze:
   - `GET /subscriptions/public/plans`

---

## 📚 10. Documentație API

- `docs/BACKEND_API_CONTRACT_FARMERO_PRODUCER_MARKETING.md` - Contracte API pentru producători cu vizibilitate
- `docs/BACKEND_API_CONTRACT_FARMERO_SUBSCRIPTIONS_PUBLIC.md` - Contracte API pentru abonamente publice

---

## ✅ 11. Checklist Finalizare

- [x] Paletă de culori actualizată (light/dark)
- [x] Secțiunea "Caută după categorie" cu ordinea corectă
- [x] Secțiunea "Alege zona ta"
- [x] Secțiunea "Producători recomandați" cu suport pentru featured/boosted/sponsored
- [x] Secțiunea "Produse tradiționale din zona ta"
- [x] Secțiunea "Abonamente de la producători" (teaser)
- [x] Tipuri TypeScript pentru marketing și subscriptions
- [x] API clients cu fallback
- [x] ProducerCard actualizat cu badge-uri de vizibilitate
- [x] Traduceri i18n
- [x] Documentație API contracts
- [x] Homepage reorganizat (testimoniale înlocuite)

---

**Ultima actualizare:** 2025-01-27  
**Versiune:** 1.0

