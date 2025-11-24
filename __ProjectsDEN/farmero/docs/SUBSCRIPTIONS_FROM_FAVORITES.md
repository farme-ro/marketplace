# Subscriptions from Favorites - Integration Guide

**Data:** 2024  
**Scop:** Documentație despre cum sistemul de favorite este folosit pentru a propune și crea abonamente  
**Status:** Frontend-ready, așteaptă implementare backend

---

## 📋 Preambul

Sistemul de **Subscription Baskets** (abonamente) este integrat strâns cu sistemul de **Favorites**. Acest document descrie cum favorite-urile utilizatorului sunt folosite pentru a sugera și crea abonamente automate.

---

## 🔄 Flow: Favorites → Subscription Suggestions

### 1. User Journey

```
┌─────────────────────────────────────────────────────────────┐
│ User marks products as favorites                            │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ Favorites are stored (backend or localStorage)              │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ User navigates to /account/subscriptions                    │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ Frontend calls suggestSubscriptionFromFavorites()           │
│   - Filters only products (not producers)                   │
│   - Analyzes purchase history (if available)               │
│   - Suggests quantities and frequency                      │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ UI displays suggested subscription basket                   │
│   - Shows favorite products                                 │
│   - Shows suggested quantities                              │
│   - Shows suggested frequency                               │
│   - "Create Subscription" button                            │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ User clicks "Create Subscription"                         │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ Frontend calls createSubscriptionBasketFromFavorites()      │
│   - Creates subscription with favorite products             │
│   - Uses suggested quantities and frequency                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧠 Logică de Sugestie

### Helper Function: `suggestSubscriptionFromFavorites()`

**Locație:** `src/lib/api/subscriptions.ts` (de implementat)

**Input:**
```typescript
{
  favorites: Array<{
    targetId: string
    targetType: 'product' | 'producer'
    metadata?: {
      lastPurchasedAt?: string
      purchaseCount?: number
    }
  }>
  userPurchaseHistory?: Array<{
    productId: string
    quantity: number
    purchasedAt: string
    frequency?: 'weekly' | 'biweekly' | 'monthly'
  }>
}
```

**Output:**
```typescript
{
  suggestedItems: Array<{
    productId: string
    productName: string
    suggestedQuantity: number
    reason: string
  }>
  suggestedFrequency: 'weekly' | 'biweekly' | 'monthly'
  estimatedMonthlyValue?: number
}
```

### Algoritm de Sugestie

1. **Filtrare Produse:**
   ```typescript
   const productFavorites = favorites.filter(f => f.targetType === 'product')
   ```

2. **Analiză Istoric Cumpărături (dacă disponibil):**
   - Pentru fiecare produs favorit, caută în istoricul de cumpărături
   - Calculează frecvența medie de cumpărare
   - Calculează cantitatea medie cumpărată

3. **Sugestie Cantitate:**
   - Dacă există istoric: `suggestedQuantity = averageQuantity`
   - Dacă nu există istoric: `suggestedQuantity = 1` (default)

4. **Sugestie Frecvență:**
   - Dacă există istoric: `suggestedFrequency = mostCommonFrequency`
   - Dacă nu există istoric: `suggestedFrequency = 'monthly'` (default)

5. **Prioritizare Produse:**
   - Produse cu `purchaseCount` mai mare → prioritate mai mare
   - Produse cumpărate recent → prioritate mai mare
   - Limitează la top 10 produse (sau configurabil)

---

## 💻 Implementare Frontend

### 1. Helper Function (de implementat)

**Fișier:** `src/lib/api/subscriptions.ts`

```typescript
/**
 * Suggest subscription basket from favorites
 * 
 * @param favorites - List of favorite items
 * @param userPurchaseHistory - Optional purchase history
 * @returns Subscription suggestion
 */
export async function suggestSubscriptionFromFavorites(
  favorites: Array<{ targetId: string; targetType: 'product' | 'producer' }>,
  userPurchaseHistory?: Array<{
    productId: string
    quantity: number
    purchasedAt: string
  }>
): Promise<SubscriptionSuggestion> {
  // Filter only products
  const productFavorites = favorites.filter(f => f.targetType === 'product')
  
  // Analyze purchase history if available
  const suggestions = productFavorites.map(fav => {
    const history = userPurchaseHistory?.filter(h => h.productId === fav.targetId) || []
    
    // Calculate average quantity
    const avgQuantity = history.length > 0
      ? Math.round(history.reduce((sum, h) => sum + h.quantity, 0) / history.length)
      : 1
    
    // Determine frequency
    // TODO: Analyze purchase dates to determine frequency
    
    return {
      productId: fav.targetId,
      suggestedQuantity: avgQuantity,
      reason: history.length > 0
        ? `Cumpărat ${history.length} ${history.length === 1 ? 'dată' : 'ori'}`
        : 'Produs favorit'
    }
  })
  
  // Limit to top 10
  const topSuggestions = suggestions.slice(0, 10)
  
  return {
    suggestedItems: topSuggestions,
    suggestedFrequency: 'monthly', // Default, can be improved with history analysis
  }
}
```

### 2. UI Component (de implementat)

**Fișier:** `src/app/(site)/account/subscriptions/page.tsx` (Coming soon)

```typescript
'use client'

import { useState, useEffect } from 'react'
import { useFavorites } from '@/lib/store/favorites'
import { suggestSubscriptionFromFavorites, createSubscriptionBasketFromFavorites } from '@/lib/api/subscriptions'

export default function SubscriptionsPage() {
  const favorites = useFavorites()
  const [suggestion, setSuggestion] = useState<SubscriptionSuggestion | null>(null)
  
  useEffect(() => {
    async function loadSuggestion() {
      const suggestion = await suggestSubscriptionFromFavorites(favorites)
      setSuggestion(suggestion)
    }
    
    if (favorites.length > 0) {
      loadSuggestion()
    }
  }, [favorites])
  
  const handleCreateSubscription = async () => {
    if (!suggestion) return
    
    try {
      const basket = await createSubscriptionBasketFromFavorites(
        favorites,
        {
          name: 'Abonament din favorite',
          frequency: suggestion.suggestedFrequency,
          defaultQuantity: 1,
        }
      )
      
      // Redirect to subscription details
      router.push(`/account/subscriptions/${basket.id}`)
    } catch (error) {
      // Handle error
    }
  }
  
  return (
    <div>
      {/* Coming soon message */}
      <div className="text-center py-20">
        <h1>Abonamente</h1>
        <p>Funcționalitatea va fi disponibilă în curând.</p>
      </div>
      
      {/* When ready, show suggestion */}
      {suggestion && (
        <div>
          <h2>Sugestie bazată pe favorite</h2>
          {/* Display suggested items */}
          <button onClick={handleCreateSubscription}>
            Creează abonament
          </button>
        </div>
      )}
    </div>
  )
}
```

---

## 🔄 Integrare cu Backend

### Endpoint: POST /clients/subscriptions (vezi `BACKEND_API_CONTRACT_FAVORITES_SUBSCRIPTIONS_ALERTS.md`)

Când utilizatorul creează un abonament din favorite:

1. **Frontend:** Apelează `createSubscriptionBasketFromFavorites()`
2. **Frontend:** Transformă favorite-urile în `SubscriptionBasketItem[]`
3. **Frontend:** Trimite request la `POST /clients/subscriptions`
4. **Backend:** Validează produsele (există, sunt active, disponibile)
5. **Backend:** Creează abonamentul
6. **Backend:** Calculează `nextDeliveryDate` pe baza `frequency`
7. **Backend:** Returnează `SubscriptionBasket` creat

---

## 📊 Metadata & Analytics

### Metadata în FavoriteItem

```typescript
{
  id: string
  targetType: 'product'
  targetId: string
  createdAt: string
  metadata?: {
    lastPurchasedAt?: string  // Ultima dată când a fost cumpărat
    purchaseCount?: number     // Număr de cumpărături
    averageQuantity?: number   // Cantitate medie cumpărată
    averageFrequency?: 'weekly' | 'biweekly' | 'monthly'  // Frecvență medie
  }
}
```

**Notă:** Metadata poate fi populată de backend pe baza istoricului de comenzi.

---

## 🎯 Use Cases

### Use Case 1: User cu Favorite-uri, fără Istoric

**Scenario:** Utilizatorul are 5 produse favorite, dar nu a cumpărat încă.

**Sugestie:**
- Toate cele 5 produse favorite
- Cantitate: 1 (default)
- Frecvență: 'monthly' (default)
- Reason: "Produs favorit"

### Use Case 2: User cu Favorite-uri și Istoric

**Scenario:** Utilizatorul are 3 produse favorite și a cumpărat frecvent produsul A (săptămânal, cantitate 2).

**Sugestie:**
- Produs A: cantitate 2, frecvență 'weekly', reason: "Cumpărat 10 ori"
- Produs B: cantitate 1, frecvență 'monthly', reason: "Produs favorit"
- Produs C: cantitate 1, frecvență 'monthly', reason: "Produs favorit"

### Use Case 3: User cu Multe Favorite-uri

**Scenario:** Utilizatorul are 50 de produse favorite.

**Sugestie:**
- Top 10 produse (prioritizate după `purchaseCount` sau `lastPurchasedAt`)
- Restul produselor pot fi adăugate manual de utilizator

---

## 🔮 Viitor: Machine Learning

În viitor, sistemul poate folosi ML pentru a îmbunătăți sugestiile:

1. **Predictive Analytics:**
   - Prezice când utilizatorul va cumpăra din nou
   - Sugerează cantități optimale
   - Sugerează frecvență optimă

2. **Personalization:**
   - Ajustează sugestiile pe baza comportamentului utilizatorului
   - Învață din feedback-ul utilizatorului

3. **Seasonal Adjustments:**
   - Ajustează sugestiile pe baza sezonului
   - Sugerează produse sezoniere

---

## ✅ Checklist pentru Backend

Când backend-ul implementează sugestiile:

- [ ] Endpoint pentru purchase history: `GET /clients/purchase-history`
- [ ] Metadata în FavoriteItem (lastPurchasedAt, purchaseCount, etc.)
- [ ] Endpoint pentru analytics: `GET /clients/analytics/subscription-suggestions`
- [ ] Validare produse în abonamente (există, active, disponibile)
- [ ] Calcul automat `nextDeliveryDate` pe baza `frequency`

---

**Ultima actualizare:** 2024  
**Versiune:** 1.0

