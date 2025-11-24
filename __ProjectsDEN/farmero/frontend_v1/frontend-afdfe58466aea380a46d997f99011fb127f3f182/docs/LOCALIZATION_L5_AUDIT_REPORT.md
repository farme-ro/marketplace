# L5 - Audit Formate Locale (Date, Sume, Unități)

## Obiectiv
Auditarea formatelor hardcodate pentru date, sume și unități și propunerea unui sistem centralizat cu funcții reutilizabile pentru formatare localizată.

## Status
✅ Completat - Audit finalizat, sistem centralizat propus

## Probleme identificate

### 1. Formate hardcodate pentru date
- ✅ **35+ locații** cu `toLocaleDateString('ro-RO')` hardcodat
- ✅ **Exemple:**
  - `src/app/(site)/orders/page.tsx` - linia 231
  - `src/app/(site)/producer-portal/dashboard/page.tsx` - linia 143
  - `src/app/(site)/producer-portal/finances/page.tsx` - linia 279
  - `src/app/(site)/orders/[id]/page.tsx` - linia 237
  - `src/app/(site)/producer-portal/orders/[id]/page.tsx` - linia 203, 278, 394
  - `src/app/(site)/terms/page.tsx`, `cookies/page.tsx`, `privacy/page.tsx` - linia 37-38

### 2. Formate hardcodate pentru sume/currency
- ✅ **33+ locații** cu `.toFixed(2) + "RON"/"lei"` hardcodat
- ✅ **Exemple:**
  - `src/components/ui/product-card.tsx` - linia 146: `{price.toFixed(2)} RON`
  - `src/app/(site)/orders/page.tsx` - linia 263: `{order.total.toFixed(2)} {t('ui.currency.symbol', 'lei')}`
  - `src/app/(site)/orders/[id]/page.tsx` - linia 285, 289, 305, 310, 315: `.toFixed(2) RON`
  - `src/app/(site)/cart/page.tsx` - linia 219, 222, 257, 262, 274: `.toFixed(2) lei`
  - `src/app/(site)/producer-portal/dashboard/page.tsx` - linia 106, 134, 149: `.toFixed(2) lei`
  - `src/app/(site)/producer-portal/finances/page.tsx` - linia 190, 217, 242, 285: `.toFixed(2) RON`
  - `src/app/(site)/producer-portal/orders/[id]/page.tsx` - linia 308, 312, 332, 336: `.toFixed(2) lei`

### 3. Formate hardcodate pentru unități
- ✅ **44+ locații** cu unități hardcodate ("kg", "buc", "l", "ml")
- ✅ **Exemple:**
  - `src/app/(site)/producer-portal/products/_components/product-form.tsx` - linia 202-206: `<option value="kg">kg</option>`
  - `src/app/(site)/producer-portal/orders/[id]/page.tsx` - linia 308: `{item.unit || 'buc'}`
  - `src/app/(site)/orders/[id]/page.tsx` - linia 285: `{item.quantity} x {item.price.toFixed(2)} RON`
  - `src/app/(site)/cart/page.tsx` - linia 222: `{item.price.toFixed(2)} lei / {item.unit}`
  - Multe locații cu fallback `|| 'buc'` sau `|| 'kg'`

## Plan de acțiune

### Faza 1: Audit și identificare
1. Scanare cod pentru formate hardcodate
2. Identificare locații care necesită refactoring
3. Listare formate existente

### Faza 2: Propunere sistem centralizat
1. Creare funcții utilitare pentru formatare
2. Integrare cu i18n pentru locale
3. Documentare utilizare

### Faza 3: Refactoring (opțional)
1. Înlocuire formate hardcodate cu funcții centralizate
2. Testare formatare pentru toate locale-urile

## Funcții propuse

### Formatare dată
```typescript
// src/lib/utils/format-date.ts
export function formatDate(date: Date | string, locale: string, format?: 'short' | 'long' | 'full'): string
export function formatDateTime(date: Date | string, locale: string): string
export function formatRelativeTime(date: Date | string, locale: string): string
```

### Formatare currency
```typescript
// src/lib/utils/format-currency.ts
export function formatCurrency(amount: number, locale: string, currency?: string): string
export function formatPrice(price: number, locale: string, currency?: string): string
```

### Formatare unități
```typescript
// src/lib/utils/format-units.ts
export function formatUnit(value: number, unit: string, locale: string): string
export function formatWeight(weight: number, locale: string): string
export function formatVolume(volume: number, locale: string): string
```

## Locații identificate

### Date (35+ locații)
1. `src/app/(site)/orders/page.tsx` - linia 231
2. `src/app/(site)/producer-portal/dashboard/page.tsx` - linia 143
3. `src/app/(site)/producer-portal/finances/page.tsx` - linia 279
4. `src/app/(site)/orders/[id]/page.tsx` - linia 237
5. `src/app/(site)/producer-portal/orders/[id]/page.tsx` - linia 203, 278, 394
6. `src/app/(site)/logistics-portal/dashboard/page.tsx` - linia 323
7. `src/app/(site)/business-portal/dashboard/page.tsx` - linia 318
8. `src/app/(site)/terms/page.tsx` - linia 37
9. `src/app/(site)/cookies/page.tsx` - linia 37
10. `src/app/(site)/privacy/page.tsx` - linia 38
11. `src/app/(site)/status/page.tsx` - linia 246, 266
12. `src/app/(site)/pentru-logistica/dashboard/page.tsx` - linia 276, 322
13. `src/app/(site)/pentru-investitori/dashboard/page.tsx` - linia 305
14. `src/app/(site)/producer-portal/commissions/_components/commission-summary-card.tsx` - linia 27, 42, 85, 93
15. `src/app/(site)/producer-portal/commissions/_components/commission-history-section.tsx` - linia 68, 70
16. `src/components/documents/document-center.tsx` - linia 332
17. `src/app/(site)/business-portal/contracts/[id]/page.tsx` - linia 190, 205, 220
18. `src/app/(site)/producer-portal/contracts/[id]/page.tsx` - linia 179, 194, 209

### Currency (33+ locații)
1. `src/components/ui/product-card.tsx` - linia 146
2. `src/app/(site)/orders/page.tsx` - linia 263
3. `src/app/(site)/orders/[id]/page.tsx` - linia 285, 289, 305, 310, 315
4. `src/app/(site)/cart/page.tsx` - linia 219, 222, 257, 262, 274
5. `src/app/(site)/producer-portal/dashboard/page.tsx` - linia 106, 134, 149
6. `src/app/(site)/producer-portal/finances/page.tsx` - linia 190, 217, 242, 285
7. `src/app/(site)/producer-portal/orders/[id]/page.tsx` - linia 308, 312, 332, 336
8. `src/app/(site)/thank-you/ThankYouPageClient.tsx` - linia 125, 167
9. `src/app/(site)/products/[slug]/_components/product-header-section.tsx` - linia 138
10. `src/app/(site)/products/[slug]/_components/similar-products-section.tsx` - linia 160
11. `src/components/layout/minicart-sidebar.tsx` - linia 225, 253
12. `src/app/(site)/producer-portal/insights/page.tsx` - linia 167, 236, 270, 316
13. `src/lib/utils/shipping.ts` - linia 43
14. `src/app/(site)/pentru-investitori/dashboard/page.tsx` - linia 119
15. `src/app/(site)/backend-test/page.tsx` - linia 170
16. `src/app/(admin)/admin/products/AdminProductsPageClient.tsx` - linia 199

### Units (44+ locații)
1. `src/app/(site)/producer-portal/products/_components/product-form.tsx` - linia 202-206
2. `src/app/(site)/producer-portal/orders/[id]/page.tsx` - linia 308
3. `src/app/(site)/orders/[id]/page.tsx` - linia 285
4. `src/app/(site)/cart/page.tsx` - linia 222
5. `src/app/(site)/account/subscriptions/page.tsx` - linia 201
6. `src/app/(site)/orders/page.tsx` - linia 117
7. `src/app/(site)/account/favorites/page.tsx` - linia 127, 292
8. `src/lib/store/cart.ts` - linia 72
9. `src/app/(site)/producers/[slug]/page.tsx` - linia 55
10. `src/app/(site)/products/[slug]/_components/similar-products-section.tsx` - linia 88
11. `src/components/producer-portal/products/producer-products-table.tsx` - linia 52
12. `src/app/(site)/producers/[slug]/products/_components/producer-products-client.tsx` - linia 35
13. `src/app/(site)/products/[slug]/page.tsx` - linia 53, 90
14. `src/app/(site)/producers/[slug]/_components/producer-products-list.tsx` - linia 39
15. `src/lib/types/farmero-documents.ts` - linia 160 (tip)

## Recomandări tehnice

### 1. Folosire Intl API
- `Intl.DateTimeFormat` pentru date
- `Intl.NumberFormat` pentru currency și numere
- `Intl.RelativeTimeFormat` pentru timp relativ

### 2. Integrare cu i18n
- Folosire locale din context i18n
- Fallback la locale default dacă nu este disponibil

### 3. Type safety
- TypeScript types pentru toate funcțiile
- Validare input-uri

## Status final
✅ **COMPLETAT**

## Rezumat final

### Funcții create
1. ✅ `src/lib/utils/format.ts` - Actualizat cu suport pentru locale
   - `formatCurrency(amount, locale, currency?)` - Formatare currency cu locale
   - `formatNumber(number, locale)` - Formatare numere cu locale
   - `formatDate(date, locale, options?)` - Formatare date cu locale
   - `formatDateTime(date, locale, options?)` - Formatare date + timp cu locale
   - `formatRelativeTime(date, locale)` - Formatare timp relativ cu locale

2. ✅ `src/lib/utils/format-units.ts` - Nou creat
   - `formatUnit(value, unit, locale, t)` - Formatare unități cu locale și i18n
   - `formatWeight(weight, locale, t)` - Formatare greutate (kg/g)
   - `formatVolume(volume, locale, t)` - Formatare volum (l/ml)

### Locații identificate
- **Date**: 35+ locații cu `toLocaleDateString('ro-RO')` hardcodat
- **Currency**: 33+ locații cu `.toFixed(2) + "RON"/"lei"` hardcodat
- **Units**: 44+ locații cu unități hardcodate

### Recomandări tehnice

#### 1. Folosire funcții centralizate
```typescript
// În loc de:
{order.total.toFixed(2)} {t('ui.currency.symbol', 'lei')}
{new Date(order.createdAt).toLocaleDateString('ro-RO')}

// Folosește:
const { locale, t } = useI18n()
{formatCurrency(order.total, locale)}
{formatDate(order.createdAt, locale)}
```

#### 2. Integrare cu i18n
- Toate funcțiile acceptă `locale` ca parametru
- `formatUnit()` folosește `t()` pentru traducerea unităților
- Fallback la 'ro' dacă locale nu este specificat

#### 3. Type safety
- Toate funcțiile sunt type-safe cu TypeScript
- Import `Locale` type din `@/lib/i18n/context`

### Următorii pași (opțional - refactoring)
1. **Refactoring gradual**: Înlocuire formate hardcodate cu funcții centralizate
2. **Testare**: Verificare formatare pentru toate locale-urile (ro, en, fr, it, es, de)
3. **Documentare**: Adăugare exemple de utilizare în componente

### Fișiere modificate
- ✅ `src/lib/utils/format.ts` - Actualizat cu suport locale
- ✅ `src/lib/utils/format-units.ts` - Creat nou
- ✅ `docs/LOCALIZATION_L5_AUDIT_REPORT.md` - Raport complet

### Status final
✅ **L5 - COMPLETAT** - Audit finalizat, sistem centralizat creat și documentat. Funcțiile sunt gata de utilizare pentru refactoring gradual.

