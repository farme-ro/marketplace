# Backend API Contract - Farmero Subscriptions Public

**Data:** 2025-01-27  
**Scop:** Documentație pentru contractele API între frontend (Next.js) și backend (api.farme.ro) pentru Public Subscription Plans (homepage marketing)  
**Status:** Frontend-ready, așteaptă implementare backend

---

## 📋 Preambul

Acest document descrie contractele API pentru planurile publice de abonamente afișate pe homepage:
- **Public Subscription Plans** - Planuri de abonament pentru marketing pe homepage
- **Teaser pentru abonamente** - Afișare planuri publice pentru a atrage clienți

**IMPORTANT:** 
- Frontend-ul este pregătit și folosește aceste contracte
- Backend-ul trebuie să implementeze aceste endpoint-uri conform specificațiilor
- Toate request-urile folosesc `credentials: 'include'` pentru cookie-based authentication
- Base URL: `https://api.farme.ro`

---

## 🔐 Autentificare

Endpoint-ul este public (nu necesită autentificare) pentru a permite afișarea pe homepage.

---

## 📦 Get Public Subscription Plans

### GET /subscriptions/public/plans

Returnează lista de planuri publice de abonamente pentru homepage.

**Query Parameters:**
- `regionId` (optional): string - ID-ul regiunii pentru filtrare

**Response Body:**

```typescript
interface FarmeroSubscriptionPlan {
  id: string
  name: string
  description?: string
  frequency: 'weekly' | 'biweekly' | 'monthly'
  basePrice: number
  currency: string
  isRecommended?: boolean
  producerName?: string
  producerId?: string
  producerSlug?: string
  regionName?: string
  regionId?: string
  itemsCount?: number
  imageUrl?: string | null
  createdAt?: string
}
```

**Example Response:**

```json
{
  "data": [
    {
      "id": "sub-plan-123",
      "name": "Coș săptămânal de lactate",
      "description": "Produse lactate proaspete săptămânal",
      "frequency": "weekly",
      "basePrice": 89.99,
      "currency": "RON",
      "isRecommended": true,
      "producerName": "Ferma Popescu",
      "producerId": "prod-123",
      "producerSlug": "ferma-popescu",
      "regionName": "Argeș",
      "regionId": "region-1",
      "itemsCount": 5,
      "imageUrl": "https://example.com/subscription.jpg",
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

**Error Codes:**
- `404` - Endpoint nu există încă (frontend-ul returnează array gol)

---

## 📝 Note de Business

1. **Public Plans:** Aceste planuri sunt pentru marketing pe homepage, nu pentru gestionarea abonamentelor active

2. **Frequency:**
   - `weekly` - Livrare săptămânală
   - `biweekly` - Livrare la 2 săptămâni
   - `monthly` - Livrare lunară

3. **Recommended Plans:** Planurile cu `isRecommended: true` vor fi evidențiate în UI

4. **Producer Info:** Planurile pot fi asociate cu un producător specific sau pot fi generice

5. **Region Filtering:** Planurile pot fi filtrate după regiune pentru a afișa doar planurile relevante pentru utilizator

6. **Monetization:** Sistemul este pregătit pentru:
   - Abonamente recurente cu facturare automată
   - Planuri personalizate per producător
   - Planuri recomandate de echipa Farmero

---

**Ultima actualizare:** 2025-01-27  
**Versiune:** 1.0

