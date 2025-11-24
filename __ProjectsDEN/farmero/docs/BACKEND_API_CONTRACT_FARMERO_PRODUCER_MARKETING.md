# Backend API Contract - Farmero Producer Marketing

**Data:** 2025-01-27  
**Scop:** Documentație pentru contractele API între frontend (Next.js) și backend (api.farme.ro) pentru Producer Marketing & Monetization  
**Status:** Frontend-ready, așteaptă implementare backend

---

## 📋 Preambul

Acest document descrie contractele API pentru sistemul de marketing și monetizare pentru producători:
- **Featured Producers** - Producători recomandați cu vizibilitate crescută
- **Boosted Producers** - Producători cu vizibilitate plătită
- **Sponsored Producers** - Producători parteneri cu highlight special

**IMPORTANT:** 
- Frontend-ul este pregătit și folosește aceste contracte
- Backend-ul trebuie să implementeze aceste endpoint-uri conform specificațiilor
- Toate request-urile folosesc `credentials: 'include'` pentru cookie-based authentication
- Base URL: `https://api.farme.ro`

---

## 🔐 Autentificare

Endpoint-urile pentru featured producers sunt publice (nu necesită autentificare), dar endpoint-ul pentru visibility info poate necesita autentificare în funcție de implementare.

---

## 🌟 Get Featured Producers

### GET /producers/featured

Returnează lista de producători featured/boosted/sponsored pentru homepage.

**Query Parameters:**
- `regionId` (optional): string - ID-ul regiunii pentru filtrare

**Response Body:**

```typescript
interface ProducerWithVisibility {
  id: string
  slug: string
  name: string
  description?: string
  avatarUrl?: string | null
  regionName?: string
  productCount: number
  tags?: string[]
  isVerified?: boolean
  visibility?: {
    producerId: string
    tier: 'featured' | 'boosted' | 'sponsored'
    badgeLabel?: string
    highlightUntil?: string
  }
}
```

**Example Response:**

```json
{
  "data": [
    {
      "id": "prod-123",
      "slug": "ferma-popescu",
      "name": "Ferma Popescu",
      "description": "Producător local de lactate și brânzeturi",
      "avatarUrl": "https://example.com/avatar.jpg",
      "regionName": "Argeș",
      "productCount": 15,
      "tags": ["lactate", "brânzeturi", "bio"],
      "isVerified": true,
      "visibility": {
        "producerId": "prod-123",
        "tier": "featured",
        "badgeLabel": "Recomandat",
        "highlightUntil": "2025-12-31T23:59:59Z"
      }
    }
  ]
}
```

**Error Codes:**
- `404` - Endpoint nu există încă (frontend-ul returnează array gol)

---

## 📊 Get Producer Visibility Info

### GET /producers/:id/visibility

Returnează informații despre vizibilitatea unui producător specific.

**Response Body:**

```typescript
interface ProducerVisibilityInfo {
  producerId: string
  tier: 'none' | 'featured' | 'boosted' | 'sponsored'
  badgeLabel?: string
  highlightUntil?: string
}
```

**Example Response:**

```json
{
  "producerId": "prod-123",
  "tier": "featured",
  "badgeLabel": "Recomandat",
  "highlightUntil": "2025-12-31T23:59:59Z"
}
```

**Error Codes:**
- `401` - Nu este autentificat (dacă endpoint-ul necesită autentificare)
- `404` - Producătorul nu a fost găsit sau endpoint-ul nu există

---

## 📝 Note de Business

1. **Tier Levels:**
   - `none` - Producător normal, fără vizibilitate specială
   - `featured` - Producător recomandat (badge "Recomandat", border accent-secondary)
   - `boosted` - Producător cu vizibilitate crescută (badge "Vizibilitate crescută", border accent-primary)
   - `sponsored` - Producător partener (badge "Partener Farmero", border accent-secondary mai puternic)

2. **Badge Labels:** Pot fi personalizate per producător sau folosite default-urile din frontend

3. **Highlight Until:** Data până la care promoția este activă (ISO 8601)

4. **Monetization:** Sistemul este pregătit pentru:
   - Producători care plătesc pentru vizibilitate crescută
   - Producători parteneri cu contracte speciale
   - Producători recomandați de echipa Farmero

---

**Ultima actualizare:** 2025-01-27  
**Versiune:** 1.0

