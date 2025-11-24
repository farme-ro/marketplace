# UX State Standards - Loading / Empty / Error

## 📋 Overview

Acest document definește standardele unificate pentru toate state-urile UX din aplicație:
- **Loading States** (Skeletons)
- **Empty States** (No data)
- **Error States** (Errors)

## 🎯 Principii

1. **Consistență:** Toate state-urile urmează același pattern vizual
2. **Claritate:** Mesajele sunt clare și acțiunile evidente
3. **Accesibilitate:** Toate state-urile sunt accesibile (ARIA labels, contrast)
4. **i18n:** Toate textele folosesc sistemul de traduceri

---

## 🔄 Loading States (Skeletons)

### Standard

- **Animatie:** `animate-pulse`
- **Culoare:** `bg-muted`
- **Border radius:** `rounded-md` (base) sau `rounded-2xl` (cards)
- **Durată:** Skeleton-urile apar imediat, fără delay

### Componente Disponibile

```typescript
import { 
  Skeleton,
  CardSkeleton,
  ProductCardSkeleton,
  ProducerCardSkeleton,
  ListSkeleton,
  GridSkeleton,
  TableSkeleton,
  PageSkeleton
} from '@/components/ui/unified-skeletons'
```

### Exemple

#### Grid de produse
```tsx
{isLoading ? (
  <GridSkeleton count={6} columns={3} />
) : (
  <ProductsGrid products={products} />
)}
```

#### Listă de comenzi
```tsx
{isLoading ? (
  <ListSkeleton count={5} />
) : (
  <OrdersList orders={orders} />
)}
```

#### Tabel
```tsx
{isLoading ? (
  <TableSkeleton rows={10} columns={4} />
) : (
  <OrdersTable orders={orders} />
)}
```

### Reguli

1. ✅ **Folosește componentele unificate** din `unified-skeletons.tsx`
2. ✅ **Numărul de skeleton-uri** să reflecte layout-ul real (ex: 6 pentru grid)
3. ✅ **Skeleton-urile trebuie să aibă aceeași dimensiune** ca conținutul real
4. ❌ **Nu crea skeleton-uri custom** - folosește componentele existente

---

## 📭 Empty States

### Standard

- **Structură:** Icon + Titlu + Subtitlu + Opțional CTA
- **Icon:** Lucide icon, 20x20 (sm), 24x24 (md), 32x32 (lg)
- **Icon container:** Circular, `bg-muted`, centrat
- **Titlu:** Font semibold, text-foreground
- **Subtitlu:** Text-muted-foreground, max-w-md
- **CTA:** Button cu variant default sau outline

### Component

```typescript
import { EmptyState } from '@/components/ui/empty-state'
import { Package, ShoppingBag, Heart } from 'lucide-react'
```

### Exemple

#### Empty Cart
```tsx
{items.length === 0 && (
  <EmptyState
    icon={ShoppingBag}
    title={t('cart.empty', 'Coșul tău este gol')}
    description={t('cart.emptyDescription', 'Adaugă produse în coș pentru a continua.')}
    action={{
      label: t('cart.startShopping', 'Începe să cumperi'),
      href: '/products'
    }}
  />
)}
```

#### Empty Orders
```tsx
{orders.length === 0 && !isLoading && (
  <EmptyState
    icon={Package}
    title={t('orders.noOrders', 'Nu ai comenzi')}
    description={t('orders.noOrdersDescription', 'Începe să cumperi pentru a vedea comenzile tale aici.')}
    action={{
      label: t('orders.startShopping', 'Vezi produsele'),
      href: '/products'
    }}
  />
)}
```

#### Empty Favorites
```tsx
{favorites.length === 0 && (
  <EmptyState
    icon={Heart}
    title={t('favorites.empty', 'Nu ai produse favorite')}
    description={t('favorites.emptyDescription', 'Adaugă produse la favorite pentru a le găsi mai ușor.')}
    action={{
      label: t('favorites.browseProducts', 'Explorează produsele'),
      href: '/products'
    }}
  />
)}
```

#### Empty cu acțiune custom
```tsx
<EmptyState
  icon={Search}
  title="Nu am găsit rezultate"
  description="Încearcă să modifici filtrele sau să cauți altceva."
  action={{
    label: "Resetează filtrele",
    onClick: handleResetFilters,
    variant: 'outline'
  }}
/>
```

### Reguli

1. ✅ **Folosește componenta `EmptyState`** pentru toate empty states
2. ✅ **Icon relevant** - folosește icon-uri care reflectă contextul
3. ✅ **Titlu clar** - ce lipsește și de ce
4. ✅ **Subtitlu util** - ce poate face utilizatorul
5. ✅ **CTA evident** - acțiune clară și accesibilă
6. ✅ **i18n** - toate textele prin `t()`
7. ❌ **Nu hardcode-ui texte** - folosește i18n
8. ❌ **Nu skip-ui empty state** - chiar dacă e temporar

---

## ⚠️ Error States

### Standard

- **Structură:** Icon + Titlu + Mesaj + Opțional acțiune
- **Icon:** AlertCircle, culoare destructive
- **Icon container:** Circular, `bg-destructive/10`
- **Titlu:** Font semibold, text-foreground
- **Mesaj:** Text-muted-foreground, clar și acționabil
- **Acțiune:** Button "Încearcă din nou" sau acțiune custom

### Componente

#### Error State (în componente)
```typescript
import { ErrorState } from '@/components/ui/error-state'
```

#### Error Pages (pagini întregi)
```typescript
import { 
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ServerError,
  GenericError
} from '@/components/ui/error-pages'
```

### Exemple

#### Error în componentă
```tsx
{error && (
  <ErrorState
    title={t('errors.loadFailed', 'Eroare la încărcare')}
    message={t('errors.loadFailedMessage', 'Nu am putut încărca datele. Te rugăm să încerci din nou.')}
    onRetry={() => refetch()}
  />
)}
```

#### Error cu acțiune custom
```tsx
{error && (
  <ErrorState
    message={getUserFriendlyErrorMessage(error)}
    action={{
      label: t('errors.contactSupport', 'Contactează suportul'),
      onClick: () => router.push('/contact'),
      variant: 'outline'
    }}
  />
)}
```

#### Error Page (404)
```tsx
if (error?.status === 404) {
  return <NotFoundError />
}
```

#### Error Page (401)
```tsx
if (error?.status === 401) {
  return <UnauthorizedError />
}
```

### Mesaje de Eroare Standardizate

Folosește `getUserFriendlyErrorMessage()` din `src/lib/utils/error-handling.ts`:

```tsx
import { getUserFriendlyErrorMessage } from '@/lib/utils/error-handling'

const errorMessage = getUserFriendlyErrorMessage(error, {
  auth: t('errors.auth', 'Trebuie să fii autentificat.'),
  forbidden: t('errors.forbidden', 'Nu ai permisiunea de a accesa această resursă.'),
  notFound: t('errors.notFound', 'Resursa nu a fost găsită.'),
  validation: t('errors.validation', 'Date invalide. Te rugăm să verifici și să încerci din nou.'),
  default: t('errors.generic', 'A apărut o eroare. Te rugăm să încerci din nou.')
})
```

### Reguli

1. ✅ **Folosește `ErrorState`** pentru erori în componente
2. ✅ **Folosește error pages** pentru erori la nivel de pagină (401, 403, 404, 500)
3. ✅ **Mesaje clare** - ce s-a întâmplat și ce poate face utilizatorul
4. ✅ **Acțiuni evidente** - "Încearcă din nou" sau acțiune relevantă
5. ✅ **Nu expune detalii tehnice** - doar mesaje user-friendly
6. ✅ **i18n** - toate mesajele prin `t()`
7. ❌ **Nu arăta stack traces** în production
8. ❌ **Nu lăsa utilizatorul fără opțiuni** - oferă întotdeauna o acțiune

---

## 📐 Layout Patterns

### Pattern Standard

```tsx
export function MyComponent() {
  const { data, isLoading, error } = useQuery()
  
  // Loading
  if (isLoading) {
    return <GridSkeleton count={6} columns={3} />
  }
  
  // Error
  if (error) {
    return (
      <ErrorState
        message={getUserFriendlyErrorMessage(error)}
        onRetry={() => refetch()}
      />
    )
  }
  
  // Empty
  if (data.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="Nu există date"
        description="Descriere utilă pentru utilizator."
        action={{
          label: "Acțiune",
          href: "/path"
        }}
      />
    )
  }
  
  // Success - render data
  return <DataComponent data={data} />
}
```

### Ordinea State-urilor

1. **Loading** - verifică primul
2. **Error** - verifică al doilea
3. **Empty** - verifică al treilea
4. **Success** - render datele

---

## 🎨 Styling Standards

### Colors

- **Skeleton:** `bg-muted` (light/dark adaptive)
- **Empty icon:** `text-muted-foreground`
- **Empty icon bg:** `bg-muted`
- **Error icon:** `text-destructive`
- **Error icon bg:** `bg-destructive/10`

### Spacing

- **Empty/Error padding:** `py-12 md:py-16` (md), `py-8` (sm), `py-16 md:py-20` (lg)
- **Icon margin bottom:** `mb-6` (md), `mb-4` (sm), `mb-8` (lg)
- **Title margin bottom:** `mb-2`
- **Description margin bottom:** `mb-6`
- **Action margin top:** `mt-6`

### Typography

- **Empty/Error title:** `font-semibold text-foreground`
- **Empty/Error description:** `text-muted-foreground`
- **Max width description:** `max-w-md mx-auto`

---

## 📝 Traduceri (i18n)

### Keys Standardizate

```json
{
  "common": {
    "loading": "Se încarcă...",
    "error": "Eroare",
    "retry": "Încearcă din nou"
  },
  "emptyStates": {
    "products": {
      "title": "Nu există produse disponibile",
      "description": "Încearcă să modifici filtrele sau să revii mai târziu."
    },
    "orders": {
      "title": "Nu ai comenzi",
      "description": "Începe să cumperi pentru a vedea comenzile tale aici."
    }
  },
  "errors": {
    "loadFailed": "Eroare la încărcare",
    "loadFailedMessage": "Nu am putut încărca datele. Te rugăm să încerci din nou."
  }
}
```

---

## ✅ Checklist pentru Implementare

### Loading State
- [ ] Folosește componente din `unified-skeletons.tsx`
- [ ] Numărul de skeleton-uri reflectă layout-ul real
- [ ] Skeleton-urile au aceeași dimensiune ca conținutul

### Empty State
- [ ] Folosește componenta `EmptyState`
- [ ] Icon relevant pentru context
- [ ] Titlu clar și descriptiv
- [ ] Subtitlu util cu acțiune sugerată
- [ ] CTA evident (dacă e cazul)
- [ ] Toate textele prin i18n

### Error State
- [ ] Folosește `ErrorState` pentru componente
- [ ] Folosește error pages pentru pagini întregi
- [ ] Mesaj clar și acționabil
- [ ] Acțiune de retry sau altă acțiune relevantă
- [ ] Nu expune detalii tehnice
- [ ] Toate mesajele prin i18n

---

## 🚀 Next Steps

1. ✅ Componente unificate create
2. ⏳ Actualizează componentele existente să folosească noile standarde
3. ⏳ Adaugă traduceri pentru toate empty/error states
4. ⏳ Testează accesibilitatea (screen readers, keyboard navigation)
5. ⏳ Verifică contrastul pentru toate state-urile

---

**Ultima actualizare:** 2025-01-27  
**Versiune:** 1.0

