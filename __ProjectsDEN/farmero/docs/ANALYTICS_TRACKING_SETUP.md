# Analytics Tracking Setup

## 📋 Overview

Sistemul de tracking analytics este centralizat și pregătit pentru viitoarele integrări (Google Analytics, Plausible, etc.).

**Status:** ✅ Structură pregătită, momentan doar `console.debug` când e activat

## 🎯 Folosire

### Import

```typescript
import { trackEvent } from '@/lib/analytics/tracker'
// sau
import { trackEvent, trackPageView, trackError } from '@/lib/analytics'
```

### Exemple de utilizare

```typescript
// Subscription events
trackEvent('subscription_view', { planId: 'premium' })
trackEvent('subscription_plan_selected', { planId: 'basic', price: 49 })
trackEvent('subscription_created', { planId: 'premium', userId: '123' })

// Producer events
trackEvent('producer_profile_opened', { producerId: '123', producerName: 'Ferma X' })
trackEvent('producer_product_view', { productId: '456', producerId: '123' })

// Product events
trackEvent('product_view', { productId: '789', productName: 'Lapte de capră' })
trackEvent('product_add_to_cart', { productId: '789', quantity: 2, price: 25 })

// Cart & Checkout
trackEvent('cart_view')
trackEvent('checkout_started', { cartValue: 150, itemCount: 5 })
trackEvent('checkout_completed', { orderId: 'ORD-123', total: 150 })

// Donation events
trackEvent('donation_intent_click')
trackEvent('donation_amount_selected', { amount: 50, currency: 'RON' })
trackEvent('donation_completed', { amount: 50, donationId: 'DON-456' })

// Account events
trackEvent('account_switched', { fromAccountId: 'acc-1', toAccountId: 'acc-2' })
trackEvent('login_success', { method: 'email' })

// Search & Discovery
trackEvent('search_performed', { query: 'lapte', resultsCount: 12 })
trackEvent('filter_applied', { filterType: 'category', value: 'dairy' })
trackEvent('category_viewed', { categoryId: 'cat-1', categoryName: 'Lactate' })

// Navigation
trackPageView('/products', 'Produse - farme.ro')
trackEvent('link_clicked', { linkText: 'Despre noi', linkUrl: '/about' })
```

## ⚙️ Configurare

### Activare/Dezactivare

În `src/lib/analytics/config.ts`:

```typescript
export const ANALYTICS_ENABLED = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true' || false
```

Sau prin variabilă de mediu:

```env
# .env.local
NEXT_PUBLIC_ANALYTICS_ENABLED=true
```

### Debug Mode

În development, toate evenimentele sunt logate în consolă prin `console.debug`.

Pentru a dezactiva complet (chiar și console.debug), setează:

```typescript
export const ANALYTICS_DEBUG = false
```

## 🔌 Integrare Provider-uri

### Structură pregătită

Când vei integra un provider concret:

1. **Actualizează `config.ts`:**
   ```typescript
   export const ANALYTICS_PROVIDER: AnalyticsProvider = 'google-analytics' // sau 'plausible'
   ```

2. **Adaugă implementarea în `tracker.ts`:**
   ```typescript
   switch (ANALYTICS_PROVIDER) {
     case 'google-analytics':
       if (typeof window !== 'undefined' && window.gtag) {
         window.gtag('event', eventName, data)
       }
       break
     case 'plausible':
       if (typeof window !== 'undefined' && window.plausible) {
         window.plausible(eventName, { props: data })
       }
       break
   }
   ```

### Google Analytics

1. Instalează `@next/third-parties` sau adaugă script-ul manual
2. Actualizează `ANALYTICS_PROVIDER` la `'google-analytics'`
3. Adaugă implementarea în `trackEvent`

### Plausible

1. Adaugă script-ul Plausible în `app/layout.tsx`
2. Actualizează `ANALYTICS_PROVIDER` la `'plausible'`
3. Adaugă implementarea în `trackEvent`

### Custom Provider

1. Creează un provider custom în `src/lib/analytics/providers/custom.ts`
2. Actualizează `ANALYTICS_PROVIDER` la `'custom'`
3. Importă și folosește provider-ul în `trackEvent`

## 📊 Event Types

### Event Names Disponibile

Toate event names sunt definite în `src/lib/analytics/tracker.ts` sub tipul `EventName`:

- **Subscription:** `subscription_view`, `subscription_plan_selected`, `subscription_created`, etc.
- **Producer:** `producer_profile_opened`, `producer_product_view`, etc.
- **Product:** `product_view`, `product_add_to_cart`, `product_favorite_toggle`, etc.
- **Cart & Checkout:** `cart_view`, `checkout_started`, `checkout_completed`, etc.
- **Donation:** `donation_intent_click`, `donation_completed`, etc.
- **Account:** `account_switched`, `login_success`, `logout`, etc.
- **Search:** `search_performed`, `filter_applied`, `category_viewed`, etc.
- **Navigation:** `page_view`, `link_clicked`, `button_clicked`, etc.
- **Error:** `error_occurred`

### Event Data

Event data este un obiect flexibil:

```typescript
type EventData = Record<string, string | number | boolean | null | undefined>
```

Exemple:
```typescript
{ planId: 'premium', price: 99 }
{ producerId: '123', producerName: 'Ferma X' }
{ productId: '456', quantity: 2, price: 25 }
```

## 🎨 Best Practices

1. **Folosește event names consistente:** Folosește tipul `EventName` pentru autocomplete
2. **Include context relevant:** Adaugă date utile pentru analiză (IDs, valori, etc.)
3. **Nu track-ui informații sensibile:** Evită să trimiți date personale (email, parolă, etc.)
4. **Track-ui evenimente importante:** Focus pe conversii și acțiuni importante
5. **Testează în development:** Verifică în consolă că evenimentele sunt logate corect

## 🚀 Next Steps

1. ✅ Structura este pregătită
2. ⏳ Alege un provider (GA, Plausible, etc.)
3. ⏳ Integrează provider-ul în `trackEvent`
4. ⏳ Adaugă tracking în componentele importante
5. ⏳ Testează și verifică datele în dashboard-ul provider-ului

## 📝 Note

- **Momentan:** Doar `console.debug` când e activat
- **Viitor:** Integrare cu provider concret (GA, Plausible, etc.)
- **Privacy:** Nu track-ui date personale sau sensibile
- **Performance:** Tracking-ul este asincron și nu blochează UI-ul

