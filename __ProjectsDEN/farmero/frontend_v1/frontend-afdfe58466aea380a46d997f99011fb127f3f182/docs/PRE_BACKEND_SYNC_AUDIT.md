# Pre-Backend Sync Validation & UX Logic Layer Audit

**Data:** 2025-01-27  
**Scop:** Validare și coerență frontend înainte de integrarea cu backend-ul real

---

## 📋 Executive Summary

Acest raport documentează starea frontend-ului înainte de integrarea completă cu backend-ul, identificând:
- ✅ Ce funcționează corect
- ⚠️ Ce trebuie ajustat
- 🟥 Ce depinde de backend
- 🛠 Recomandări concrete pentru implementare

**Status general:** Frontend-ul este bine structurat, cu arhitectură clară și pattern-uri consistente. Există câteva zone care necesită standardizare și clarificări pentru integrarea backend.

---

## 1. ✅ Audit UX + Logic pentru Flow-uri Principale

### 🛒 Flow Client

#### Homepage → Product → Add to cart → Cart → Checkout → Thank you → Orders

**Status:** ✅ **Funcțional și coerent**

**Observații:**

1. **Navigație coerentă:**
   - ✅ Homepage → Products: Link-uri clare către `/products`
   - ✅ Product → Cart: Buton "Adaugă în coș" funcțional
   - ✅ Cart → Checkout: Buton "Continuă la checkout" cu redirect la login dacă nu e autentificat
   - ✅ Checkout → Thank you: Redirect automat după crearea comenzii
   - ✅ Thank you → Orders: Link către `/orders`

2. **Confirmări și feedback:**
   - ✅ Toast notifications pentru "Produs adăugat în coș"
   - ✅ Validare formular checkout cu mesaje clare
   - ✅ Loading states pe toate paginile
   - ⚠️ **Lipsă:** Confirmare explicită înainte de ștergere produs din coș (folosește `confirm()` nativ)

3. **Mesaje de eroare:**
   - ✅ Mesaje clare pentru erori API
   - ✅ Empty states pentru coș gol, comenzi goale
   - ✅ Error boundaries pentru erori neașteptate

4. **Microcopy:**
   - ✅ Texte prietenoase și clare
   - ⚠️ **Inconsistență:** Unele texte hardcodate (ex: "Livrare în 2-3 zile lucrătoare" în `product-card.tsx:146`)
   - ⚠️ **Lipsă i18n:** Textul "Comenzile neridicate pot fi donate către centre sociale" în `product-header-section.tsx:251` nu este tradus

**Recomandări:**
- [ ] Migrează toate textele hardcodate la i18n
- [ ] Adaugă confirmare elegantă pentru ștergere produs din coș (în loc de `confirm()` nativ)

### 🧑‍🌾 Flow Producător

#### Producer Dashboard → Orders → Order Detail → Products Management → Profile/Settings

**Status:** ✅ **Funcțional, cu câteva îmbunătățiri necesare**

**Observații:**

1. **Dashboard:**
   - ✅ KPIs și statistici clare
   - ✅ Quick actions accesibile
   - ✅ Recent orders cu link către detalii
   - ✅ Products attention section pentru produse care necesită atenție

2. **Orders Management:**
   - ✅ Listă de comenzi cu filtrare după status
   - ✅ Order detail page completă cu timeline
   - ✅ Butoane pentru update status (Confirmă, Marchează ca trimisă, etc.)
   - ⚠️ **Inconsistență:** Mesajele de succes sunt hardcodate în română (ex: `producer-order-detail-page.tsx:100-108`)

3. **Products Management:**
   - ✅ Listă de produse cu toggle active/inactive
   - ✅ Form pentru adăugare/editare produs
   - ✅ Validare formular

4. **Profile/Settings:**
   - ✅ Pagină de setări funcțională
   - ⚠️ **Lipsă:** Validare și feedback pentru update-uri

**Recomandări:**
- [ ] Migrează mesajele de succes/eroare la i18n
- [ ] Adaugă confirmare pentru acțiuni destructive (ștergere produs, anulare comandă)
- [ ] Îmbunătățește feedback-ul pentru update-uri de profil

---

## 2. ⚠️ Standardizare Comportament Butoane & CTA

### Pattern-uri Identificate

**Status:** ⚠️ **Necesită standardizare**

#### Primary Actions (Adăugare, Confirmare, Salvare)

**Pattern actual:**
- `variant="default"` sau `variant="primary"` (înconsistență)
- Text: "Adaugă în coș", "Confirmă comandă", "Salvează", "Plasează comanda"

**Probleme:**
1. **Inconsistență variant:** Unele folosesc `variant="default"`, altele `variant="primary"`
2. **Text hardcodat:** Multe butoane au text direct în componentă, nu prin i18n
3. **Lipsă namespace i18n:** Nu există `actions.*` namespace pentru acțiuni comune

**Exemple:**
```tsx
// product-header-section.tsx:228 - Text hardcodat
"Adaugă în coș"

// product-card.tsx:164 - Text hardcodat
"Adaugă în coș"

// producer-order-detail-page.tsx:399 - Text hardcodat
"Confirmă comandă"
```

#### Secondary Actions (Anulare, Înapoi, Continuă cumpărăturile)

**Pattern actual:**
- `variant="outline"`
- Text: "Anulează", "Înapoi", "Continuă cumpărăturile"

**Probleme:**
- ✅ Relativ consistent
- ⚠️ Unele texte nu sunt în i18n

#### Destructive Actions (Ștergere, Anulare comandă)

**Pattern actual:**
- `variant="destructive"` sau `variant="outline"` cu `text-destructive`
- Text: "Șterge", "Anulează comandă"

**Probleme:**
- ⚠️ Lipsă confirmare consistentă pentru acțiuni destructive
- ⚠️ Unele folosesc `confirm()` nativ, altele nu au confirmare

### Recomandări Standardizare

**1. Creează namespace i18n pentru acțiuni:**

```json
{
  "actions": {
    "addToCart": "Adaugă în coș",
    "viewDetails": "Vezi detalii",
    "confirm": "Confirmă",
    "cancel": "Anulează",
    "save": "Salvează",
    "delete": "Șterge",
    "edit": "Editează",
    "back": "Înapoi",
    "continue": "Continuă",
    "proceedToCheckout": "Continuă la checkout",
    "placeOrder": "Plasează comanda",
    "confirmOrder": "Confirmă comandă",
    "markAsShipped": "Marchează ca trimisă",
    "markAsDelivered": "Marchează ca livrată",
    "markAsPreparing": "Marchează ca în pregătire",
    "removeItem": "Elimină produs",
    "clearCart": "Golește coșul"
  }
}
```

**2. Standardizează variant-urile:**

- **Primary:** `variant="default"` (sau `variant="primary"` dacă e disponibil în farme-ui)
- **Secondary:** `variant="outline"`
- **Destructive:** `variant="destructive"` (sau `variant="outline"` cu `className="text-destructive"`)

**3. Adaugă confirmare pentru acțiuni destructive:**

Creează un hook `useConfirmAction` sau componentă `ConfirmDialog` pentru confirmări elegante.

**Fișiere de actualizat:**
- `src/app/(site)/products/[slug]/_components/product-header-section.tsx` - Liniile 228, 242
- `src/components/ui/product-card.tsx` - Linia 164
- `src/app/(site)/producer-portal/orders/[id]/page.tsx` - Liniile 399, 409, 420, 430
- `src/app/(site)/cart/page.tsx` - Linia 55 (confirmare pentru clear cart)

---

## 3. 🟥 Simulare Comportament Backend

### Mock-uri și TODO-uri Identificate

**Status:** 🟥 **Dependent de backend**

#### Mock Data în Checkout

**Fișier:** `src/app/(site)/checkout/page.tsx:77-84`

```typescript
// Mock data for payment rules
const isFirstOrder = false
const hasGoodHistory = true
const hasNegativeHistory = false
const hasUncollectedOrders = false
const availablePaymentMethods: ('card' | 'cash_on_delivery')[] = hasGoodHistory
  ? ['card', 'cash_on_delivery']
  : ['card']
```

**TODO:**
```typescript
// TODO: Replace with backend real data when endpoint available
// Endpoint needed: GET /clients/{id}/payment-rules
// Should return: { isFirstOrder, hasGoodHistory, hasNegativeHistory, hasUncollectedOrders, availablePaymentMethods }
```

#### Mock Data în Producer Finances

**Fișier:** `src/lib/api/producer/finances.ts:109, 167`

```typescript
// TODO: Remove mock data when backend endpoint is ready
```

**Endpoints necesare:**
- `GET /producers/payouts/summary` - Rezumat plăți
- `GET /producers/payouts` - Listă plăți

#### Newsletter Subscription

**Fișier:** `src/app/(site)/_components/home/newsletter-section.tsx:18`

```typescript
// TODO: Integrate with newsletter API
```

**Endpoint necesar:**
- `POST /newsletter/subscribe` - Abonare newsletter

#### Favorite Products

**Fișier:** `src/app/(site)/products/[slug]/_components/product-header-section.tsx:236`

```typescript
// TODO: Implement favorite functionality
```

**Endpoints necesare:**
- `POST /clients/favorites` - Adaugă la favorite
- `DELETE /clients/favorites/{productId}` - Șterge de la favorite
- `GET /clients/favorites` - Listă favorite

#### Producer Products Filter

**Fișier:** `src/components/producer-profile/producer-products-section.tsx:40`

```typescript
// TODO: Filter by producerId when API supports it
```

**Endpoint necesar:**
- `GET /products?producerId={id}` - Filtrare produse după producător

#### Product Subscription Notification

**Fișier:** `src/app/(site)/products/[slug]/_components/product-sections.tsx:147`

```typescript
// TODO: Implement subscription notification
```

**Endpoint necesar:**
- `POST /products/{id}/notify-when-available` - Notificare când produsul devine disponibil

#### Quick Stock Panel - Deactivate Product

**Fișier:** `src/components/producer-portal/quick-stock-panel.tsx:71`

```typescript
// TODO: API call to deactivate product
```

**Endpoint necesar:**
- `PATCH /producers/products/{id}` - Update status produs (active/inactive)

#### Support File Upload

**Fișier:** `src/app/(site)/producer-portal/support/page.tsx:177`

```typescript
// TODO: Implement file upload when backend supports it
```

**Endpoint necesar:**
- `POST /producers/support/tickets` - Creare ticket suport cu file upload

#### Stripe Payment Integration

**Fișier:** `src/app/(site)/checkout/payment/PaymentPageClient.tsx:11, 19, 74`

```typescript
// TODO: Install Stripe packages when payment is ready
// TODO: Re-enable when Stripe packages are installed
```

**Status:** Stripe este dezactivat temporar. Trebuie reactivat când backend-ul suportă plăți Stripe.

### Listă Completă TODO-uri Backend

| Fișier | Linie | TODO | Endpoint Necesar | Prioritate |
|--------|-------|------|------------------|------------|
| `checkout/page.tsx` | 77-84 | Payment rules mock | `GET /clients/{id}/payment-rules` | 🔴 High |
| `producer/finances.ts` | 109 | Payouts summary mock | `GET /producers/payouts/summary` | 🟡 Medium |
| `producer/finances.ts` | 167 | Payouts list mock | `GET /producers/payouts` | 🟡 Medium |
| `newsletter-section.tsx` | 18 | Newsletter subscription | `POST /newsletter/subscribe` | 🟢 Low |
| `product-header-section.tsx` | 236 | Favorite products | `POST/DELETE/GET /clients/favorites` | 🟢 Low |
| `producer-products-section.tsx` | 40 | Filter by producerId | `GET /products?producerId={id}` | 🟡 Medium |
| `product-sections.tsx` | 147 | Subscription notification | `POST /products/{id}/notify-when-available` | 🟢 Low |
| `quick-stock-panel.tsx` | 71 | Deactivate product | `PATCH /producers/products/{id}` | 🟡 Medium |
| `support/page.tsx` | 177 | File upload support | `POST /producers/support/tickets` | 🟢 Low |
| `checkout/payment/PaymentPageClient.tsx` | 11, 19, 74 | Stripe integration | Stripe checkout flow | 🔴 High |

---

## 4. ✅ Validare Structură Domain Logic

### Tipuri Domain

**Status:** ✅ **Bine structurat**

**Fișier:** `src/lib/types/domain.ts`

**Observații:**
- ✅ Tipuri clare și bine documentate
- ✅ Contract central pentru frontend
- ✅ Tipuri extensibile pentru viitor

**Tipuri principale:**
- `Product` - Produs domain
- `Producer` - Producător domain
- `Order` - Comandă domain
- `UserProfile` - Profil utilizator domain
- `Category` - Categorie domain
- `Region` - Regiune domain

### Mapper-e API → Domain

**Status:** ✅ **Bine implementate**

**Mapper-e identificate:**
- `mapApiProductToProduct()` - `src/lib/api/public/products.ts:18`
- `mapApiOrderToOrder()` - `src/lib/api/orders.ts:21`
- `mapApiProducerToProducer()` - `src/lib/api/public/producers.ts:11`

**Observații:**
- ✅ Mapper-e normalizează variantele API (snake_case vs camelCase)
- ✅ Gestionare robustă pentru câmpuri opționale
- ✅ Fallback-uri pentru date lipsă

### Excepții - Referințe Directe la API Types

**Status:** ⚠️ **Câteva excepții identificate**

**1. Producer Order Types**

**Fișier:** `src/app/(site)/producer-portal/orders/page.tsx:26`

```typescript
import type { ProducerOrder } from '@/lib/api/producer/orders'
```

**Observație:** `ProducerOrder` este un tip API, nu domain. Ar trebui să existe un tip domain `Order` care să fie folosit în UI.

**Recomandare:**
- [ ] Creează tip domain `ProducerOrder` în `domain.ts` sau folosește tipul `Order` existent
- [ ] Creează mapper `mapApiProducerOrderToOrder()` pentru normalizare

**2. Product Summary Type**

**Fișier:** `src/types/public.ts:10`

```typescript
export interface ProductSummary {
  // ...
}
```

**Observație:** `ProductSummary` este un tip public, nu domain. Este folosit în multe locuri în UI.

**Recomandare:**
- [ ] Verifică dacă `ProductSummary` poate fi înlocuit cu `Product` din domain
- [ ] Dacă nu, asigură-te că există mapper de la `ProductSummary` la `Product`

**3. PublicProduct Type**

**Fișier:** `src/app/(site)/products/[slug]/page.tsx:15-37`

```typescript
type ProductDetail = {
  // Custom type pentru product detail page
}
```

**Observație:** Există un tip custom `ProductDetail` care mapează manual datele API.

**Recomandare:**
- [ ] Folosește tipul `Product` din domain
- [ ] Folosește mapper-ul existent `mapApiProductToProduct()`

### Recomandări Domain Logic

1. **Standardizează tipurile:**
   - [ ] Toate componentele UI să folosească tipuri din `domain.ts`
   - [ ] Elimină tipuri custom duplicate

2. **Mapper-e consistente:**
   - [ ] Toate datele API să treacă prin mapper-e înainte de a ajunge în UI
   - [ ] Nu folosi direct tipuri API în componente

3. **Documentare:**
   - [ ] Documentează fiecare mapper cu exemple de input/output
   - [ ] Adaugă comentarii pentru cazuri edge

---

## 5. ✅ UX Fallback pentru Date Lipsă

### Placeholder-uri pentru Imagini

**Status:** ✅ **Bine implementate**

**Exemple:**

1. **Product Card:**
   ```tsx
   // src/components/ui/product-card.tsx:66-80
   {imageUrl ? (
     <Image src={imageUrl} ... />
   ) : (
     <div className="w-full h-full flex items-center justify-center">
       <svg className="w-16 h-16 opacity-50">...</svg>
     </div>
   )}
   ```

2. **Product Header:**
   ```tsx
   // src/app/(site)/products/[slug]/_components/product-header-section.tsx:79-94
   {product.imageUrl ? (
     <Image src={product.imageUrl} ... />
   ) : (
     <div className="w-full h-full flex items-center justify-center">
       <svg className="w-24 h-24 opacity-50">...</svg>
     </div>
   )}
   ```

**Observații:**
- ✅ Placeholder-uri elegante cu SVG icons
- ✅ Stilizare consistentă (opacity, centrare)
- ⚠️ **Lipsă:** Text alternativ pentru screen readers

**Recomandare:**
- [ ] Adaugă `aria-label` pentru placeholder-uri
- [ ] Consideră un placeholder generic reutilizabil

### Empty States

**Status:** ✅ **Bine implementate**

**Exemple:**

1. **Empty Cart:**
   ```tsx
   // src/app/(site)/cart/page.tsx
   {items.length === 0 && (
     <Card>
       <CardContent className="p-12 text-center">
         <Package className="w-16 h-16 mx-auto mb-4" />
         <h3>{t('cart.empty', 'Coșul tău este gol')}</h3>
         <Link href="/products">
           <Button>{t('cart.startShopping', 'Începe să cumperi')}</Button>
         </Link>
       </CardContent>
     </Card>
   )}
   ```

2. **No Orders:**
   ```tsx
   // src/app/(site)/orders/page.tsx:186-204
   {orders.length === 0 && (
     <Card>
       <CardContent className="p-12 text-center">
         <Package className="w-8 h-8" />
         <h3>{t('orders.noOrders', 'Nu ai comenzi')}</h3>
         <p>{t('orders.noOrdersDescription', 'Începe să cumperi...')}</p>
         <Link href="/products">
           <Button>{t('common.products', 'Vezi produsele')}</Button>
         </Link>
       </CardContent>
     </Card>
   )}
   ```

3. **No Products:**
   ```tsx
   // src/app/(site)/products/ProductsPageClient.tsx:258-277
   {products.length === 0 && (
     <Card>
       <CardContent className="p-8 md:p-12">
         <p>{t('emptyStates.products.title', 'Nu există produse disponibile.')}</p>
         {hasActiveFilters && (
           <Button onClick={handleClearFilters}>
             {t('emptyStates.products.clearFilters', 'Șterge filtre')}
           </Button>
         )}
       </CardContent>
     </Card>
   )}
   ```

**Observații:**
- ✅ Empty states clare și informative
- ✅ Acțiuni clare pentru utilizator (link către produse, ștergere filtre)
- ✅ Folosesc i18n pentru texte

### Fallback-uri pentru Descrieri

**Status:** ⚠️ **Necesită îmbunătățiri**

**Exemple:**

1. **Producer Description:**
   ```tsx
   // src/app/(site)/producers/[slug]/_components/producer-detail-content.tsx
   {storyFull && (
     <Card>
       <CardContent>
         <p>{storyFull}</p>
       </CardContent>
     </Card>
   )}
   ```

**Probleme:**
- ⚠️ Dacă `storyFull` este gol, secțiunea nu se afișează deloc
- ⚠️ Nu există text default pentru producători fără descriere

**Recomandare:**
- [ ] Adaugă text default via i18n: `t('producers.detail.noStory', 'Acest producător nu a adăugat încă o descriere.')`
- [ ] Afișează secțiunea chiar dacă descrierea lipsește, cu text default

2. **Product Description:**
   ```tsx
   // src/app/(site)/products/[slug]/_components/product-header-section.tsx
   <p>{product.description || 'Fără descriere'}</p>
   ```

**Probleme:**
- ⚠️ Text hardcodat "Fără descriere"
- ⚠️ Nu folosește i18n

**Recomandare:**
- [ ] Folosește i18n: `t('product.noDescription', 'Acest produs nu are descriere.')`

### Recomandări UX Fallback

1. **Standardizează empty states:**
   - [ ] Creează componentă reutilizabilă `<EmptyState />`
   - [ ] Standardizează iconuri și texte

2. **Îmbunătățește placeholder-uri:**
   - [ ] Adaugă `aria-label` pentru accesibilitate
   - [ ] Consideră placeholder generic reutilizabil

3. **Text default pentru date lipsă:**
   - [ ] Toate textele default să fie în i18n
   - [ ] Afișează secțiuni chiar dacă datele lipsesc, cu text default

---

## 6. 🛠 Recomandări Concrete pentru Backend Implementation Order

### Prioritate 🔴 High (Critic pentru MVP)

1. **Payment Rules Endpoint**
   - **Endpoint:** `GET /clients/{id}/payment-rules`
   - **Răspuns:** `{ isFirstOrder, hasGoodHistory, hasNegativeHistory, hasUncollectedOrders, availablePaymentMethods }`
   - **Folosit în:** Checkout page pentru determinarea metodelor de plată disponibile
   - **Impact:** Blochează funcționalitatea completă de checkout

2. **Stripe Payment Integration**
   - **Endpoint:** `POST /orders` cu redirect la Stripe checkout
   - **Folosit în:** Checkout flow pentru plăți online
   - **Impact:** Blochează plățile online

### Prioritate 🟡 Medium (Important pentru UX complet)

3. **Producer Payouts**
   - **Endpoints:** `GET /producers/payouts/summary`, `GET /producers/payouts`
   - **Folosit în:** Producer finances page
   - **Impact:** Producătorii nu pot vedea plățile

4. **Product Filter by Producer**
   - **Endpoint:** `GET /products?producerId={id}`
   - **Folosit în:** Producer products section
   - **Impact:** Filtrarea produselor după producător nu funcționează optim

5. **Product Status Update**
   - **Endpoint:** `PATCH /producers/products/{id}` cu `{ isActive: boolean }`
   - **Folosit în:** Quick stock panel
   - **Impact:** Producătorii nu pot dezactiva rapid produsele

### Prioritate 🟢 Low (Nice to have)

6. **Newsletter Subscription**
   - **Endpoint:** `POST /newsletter/subscribe`
   - **Folosit în:** Homepage newsletter section
   - **Impact:** Funcționalitate secundară

7. **Favorite Products**
   - **Endpoints:** `POST /clients/favorites`, `DELETE /clients/favorites/{productId}`, `GET /clients/favorites`
   - **Folosit în:** Product detail page
   - **Impact:** Funcționalitate secundară

8. **Product Availability Notification**
   - **Endpoint:** `POST /products/{id}/notify-when-available`
   - **Folosit în:** Product detail page
   - **Impact:** Funcționalitate secundară

9. **Support File Upload**
   - **Endpoint:** `POST /producers/support/tickets` cu file upload
   - **Folosit în:** Producer support page
   - **Impact:** Funcționalitate secundară

---

## 7. 📊 Summary & Next Steps

### ✅ Ce e OK

1. **Arhitectură clară:** Domain types, mapper-e API, structură organizată
2. **Flow-uri principale funcționale:** Client și Producer flows sunt complete
3. **Empty states bune:** Gestionare elegantă pentru date lipsă
4. **i18n implementat:** Majoritatea textelor sunt traduse
5. **Error handling:** Gestionare robustă a erorilor

### ⚠️ Ce Trebuie Ajustat

1. **Standardizare butoane:**
   - Creează namespace `actions.*` în i18n
   - Standardizează variant-urile butoanelor
   - Adaugă confirmare pentru acțiuni destructive

2. **Migrare texte hardcodate:**
   - Migrează toate textele hardcodate la i18n
   - Adaugă texte default pentru date lipsă

3. **Tipuri domain:**
   - Elimină referințe directe la tipuri API în UI
   - Creează mapper-e pentru toate tipurile API

### 🟥 Ce Depinde de Backend

1. **Payment rules:** Endpoint pentru determinarea metodelor de plată
2. **Stripe integration:** Flow complet de plăți online
3. **Producer payouts:** Endpoints pentru finanțe producător
4. **Product management:** Update status produs
5. **Funcționalități secundare:** Newsletter, favorite, notificări

### 🛠 Acțiuni Imediate (Frontend)

1. **Creează namespace i18n pentru acțiuni:**
   ```bash
   # Adaugă în ro.json și en.json
   "actions": { ... }
   ```

2. **Standardizează butoanele:**
   - Actualizează toate butoanele să folosească `actions.*` din i18n
   - Standardizează variant-urile

3. **Migrează texte hardcodate:**
   - Identifică toate textele hardcodate
   - Migrează la i18n

4. **Creează componentă EmptyState:**
   - Componentă reutilizabilă pentru empty states
   - Standardizează iconuri și texte

### 🛠 Acțiuni pentru Backend Team

1. **Prioritate High:**
   - Implementează `GET /clients/{id}/payment-rules`
   - Activează Stripe payment flow

2. **Prioritate Medium:**
   - Implementează producer payouts endpoints
   - Adaugă filter `producerId` la `GET /products`
   - Implementează `PATCH /producers/products/{id}` pentru status

3. **Prioritate Low:**
   - Newsletter subscription
   - Favorite products
   - Product availability notifications
   - Support file upload

---

## 8. 📝 Checklist Pre-Backend Sync

### Frontend Ready ✅

- [x] Domain types definite
- [x] Mapper-e API → Domain implementate
- [x] Flow-uri principale funcționale
- [x] Empty states implementate
- [x] Error handling robust
- [x] i18n implementat (majoritatea textelor)

### Frontend Needs Work ⚠️

- [ ] Standardizare butoane și CTA-uri
- [ ] Migrare texte hardcodate la i18n
- [ ] Eliminare referințe directe la tipuri API
- [ ] Componentă EmptyState reutilizabilă
- [ ] Confirmare elegantă pentru acțiuni destructive

### Backend Dependencies 🟥

- [ ] Payment rules endpoint
- [ ] Stripe integration
- [ ] Producer payouts endpoints
- [ ] Product status update endpoint
- [ ] Product filter by producerId

---

**Raport generat:** 2025-01-27  
**Status general:** ✅ Frontend gata pentru integrare backend, cu câteva ajustări minore necesare

