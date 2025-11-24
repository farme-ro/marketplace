# Backend API Contract - Farmero Marketing & Social Auto-Posting

**Data:** 2025-01-27  
**Scop:** Documentație completă pentru sistemul de marketing și promovare pentru producători  
**Status:** Frontend-ready, așteaptă implementare backend

---

## 📋 Rezumat Executiv

Acest document descrie:
- **Setări de marketing** - Configurare pentru postări automate și promovare
- **Tier-uri de promovare** - Niveluri de vizibilitate (Basic, Boost, Pro)
- **Integrare social media** - Conectare și deconectare platforme (Facebook, Instagram, TikTok)

**IMPORTANT:** 
- Frontend-ul este pregătit și folosește aceste contracte
- Backend-ul trebuie să implementeze aceste endpoint-uri conform specificațiilor
- Toate request-urile folosesc `credentials: 'include'` pentru cookie-based authentication
- Base URL: `https://api.farme.ro`

---

## 🔐 Autentificare

Toate endpoint-urile necesită autentificare ca producător:
- Request-urile includ `credentials: 'include'`
- Backend-ul verifică cookie-ul de sesiune și rolul de producător
- Răspunsuri de eroare:
  - `401 Unauthorized` - Nu este autentificat
  - `403 Forbidden` - Autentificat dar nu este producător sau fără permisiuni

---

## 📊 1. Marketing Settings

### 1.1. Get Producer Marketing Settings

**GET /producer/marketing/settings**

Returnează setările de marketing ale producătorului autentificat.

**Response Body:**

```typescript
interface FarmeroMarketingSettings {
  producerId: string
  autoPostEnabled: boolean
  postFrequency: 'weekly' | 'biweekly' | 'monthly'
  platforms: FarmeroSocialAccount[]
  createdAt?: string
  updatedAt?: string
}

interface FarmeroSocialAccount {
  platform: 'facebook' | 'instagram' | 'tiktok'
  connected: boolean
  connectedAt?: string
  accountName?: string
  accountId?: string
}
```

**Example Response:**

```json
{
  "producerId": "prod-123",
  "autoPostEnabled": true,
  "postFrequency": "weekly",
  "platforms": [
    {
      "platform": "facebook",
      "connected": true,
      "connectedAt": "2025-01-15T10:00:00Z",
      "accountName": "Ferma Popescu",
      "accountId": "fb-123456"
    },
    {
      "platform": "instagram",
      "connected": false
    },
    {
      "platform": "tiktok",
      "connected": false
    }
  ],
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-20T12:00:00Z"
}
```

**Error Codes:**
- `401` - Nu este autentificat
- `403` - Nu este producător sau nu are permisiuni
- `404` - Nu există setări (returnează default în frontend)

---

### 1.2. Update Producer Marketing Settings

**PATCH /producer/marketing/settings**

Actualizează setările de marketing ale producătorului.

**Request Body:**

```json
{
  "autoPostEnabled": true,
  "postFrequency": "biweekly"
}
```

**Response Body:** `FarmeroMarketingSettings` (updated)

**Error Codes:**
- `400` - Date invalide
- `401` - Nu este autentificat
- `403` - Nu este producător sau nu are permisiuni

---

## 🎯 2. Promotion Tiers

### 2.1. Get Producer Promotion Tiers

**GET /producer/marketing/promotion-tiers**

Returnează lista de tier-uri de promovare disponibile.

**Response Body:**

```typescript
interface FarmeroProducerTier {
  id: string
  name: string // "Basic", "Boost", "Pro"
  monthlyPrice: number
  currency: string
  features: string[]
  description?: string
}
```

**Example Response:**

```json
{
  "data": [
    {
      "id": "tier-basic",
      "name": "Basic",
      "monthlyPrice": 0,
      "currency": "RON",
      "features": [
        "Listare produse",
        "Gestionare comenzi",
        "Suport email"
      ],
      "description": "Plan de bază pentru început"
    },
    {
      "id": "tier-boost",
      "name": "Boost",
      "monthlyPrice": 199,
      "currency": "RON",
      "features": [
        "Toate feature-urile Basic",
        "Vizibilitate crescută",
        "Badge 'Recomandat'",
        "Statistici avansate",
        "Postări automate pe social media"
      ],
      "description": "Pentru producători care vor mai multă vizibilitate"
    },
    {
      "id": "tier-pro",
      "name": "Pro",
      "monthlyPrice": 499,
      "currency": "RON",
      "features": [
        "Toate feature-urile Boost",
        "Badge 'Partener Farmero'",
        "Promovare social media automată",
        "Prioritate suport",
        "API acces",
        "Analytics avansate"
      ],
      "description": "Plan complet pentru producători profesioniști"
    }
  ]
}
```

**Note:** Acest endpoint poate returna același tip de date ca `/producer/subscriptions/tiers` sau poate fi un endpoint separat cu focus pe marketing features.

**Error Codes:**
- `401` - Nu este autentificat ca producător

---

## 📱 3. Social Media Integration

### 3.1. Connect Social Platform

**POST /producer/marketing/social/connect**

Inițiază procesul de conectare a unei platforme sociale.

**Request Body:**

```json
{
  "platform": "facebook"
}
```

**Response Body:**

```typescript
interface ConnectSocialPlatformResponse {
  platform: 'facebook' | 'instagram' | 'tiktok'
  authUrl?: string // URL pentru OAuth flow
  connected: boolean
  message?: string
}
```

**Example Response (OAuth Flow):**

```json
{
  "platform": "facebook",
  "authUrl": "https://api.farme.ro/auth/facebook?redirect_uri=...",
  "connected": false,
  "message": "Redirect to auth URL"
}
```

**Example Response (Already Connected):**

```json
{
  "platform": "facebook",
  "connected": true,
  "message": "Platform already connected"
}
```

**Error Codes:**
- `400` - Platformă invalidă sau deja conectată
- `401` - Nu este autentificat ca producător
- `403` - Nu are permisiuni

**OAuth Flow:**
1. Frontend-ul face request la `/producer/marketing/social/connect`
2. Backend-ul returnează `authUrl` pentru OAuth
3. Frontend-ul redirecționează utilizatorul la `authUrl`
4. După autentificare, platforma socială redirecționează înapoi la callback URL
5. Backend-ul procesează callback-ul și actualizează setările
6. Frontend-ul poate apoi face refresh la setări pentru a vedea platforma conectată

---

### 3.2. Disconnect Social Platform

**DELETE /producer/marketing/social/disconnect?platform=facebook**

Deconectează o platformă socială.

**Query Parameters:**
- `platform` (required): 'facebook' | 'instagram' | 'tiktok'

**Response Body:** `FarmeroMarketingSettings` (updated, cu platforma deconectată)

**Example Response:**

```json
{
  "producerId": "prod-123",
  "autoPostEnabled": true,
  "postFrequency": "weekly",
  "platforms": [
    {
      "platform": "facebook",
      "connected": false
    },
    {
      "platform": "instagram",
      "connected": false
    },
    {
      "platform": "tiktok",
      "connected": false
    }
  ]
}
```

**Error Codes:**
- `401` - Nu este autentificat ca producător
- `403` - Nu are permisiuni
- `404` - Platforma nu este conectată

---

## 🔄 4. Integrare cu Alte Sisteme

### 4.1. Integrare cu Subscriptions

- Tier-urile de promovare pot fi aceleași cu tier-urile de abonament (`FarmeroProducerTier`)
- Producătorii cu tier-uri plătite (Boost, Pro) pot avea acces la postări automate
- Tier-ul Basic poate avea funcționalități limitate de marketing

### 4.2. Integrare cu Products

- Postările automate pot include:
  - Produse noi adăugate
  - Produse cu stoc redus
  - Produse recomandate
  - Oferte speciale

### 4.3. Integrare cu Notifications

- Notificări când o platformă este conectată/deconectată
- Notificări despre statusul postărilor automate
- Alerte pentru erori în postări

---

## 📝 5. Business Logic Notes

### 5.1. Auto-Posting Logic

**Când se postează:**
- La frecvența setată (săptămânal/bilunar/lunar)
- Doar pe platformele conectate
- Doar dacă `autoPostEnabled` este `true`

**Ce se postează:**
- Produse noi (dacă există)
- Produse recomandate
- Oferte speciale
- Conținut generat automat bazat pe produsele producătorului

**Limitări:**
- Frecvența minimă: săptămânal
- Număr maxim de postări per platformă: conform limitelor API-ului platformei
- Conținutul trebuie să respecte policy-urile platformelor sociale

### 5.2. Platform-Specific Notes

**Facebook:**
- Necesită Facebook Business Account
- Permisiuni: `pages_manage_posts`, `pages_read_engagement`
- Rate limit: ~200 posts/hour per page

**Instagram:**
- Necesită Instagram Business Account conectat la Facebook Page
- Permisiuni: `instagram_basic`, `instagram_content_publish`
- Rate limit: ~25 posts/day

**TikTok:**
- Necesită TikTok Business Account
- Permisiuni: `video.upload`
- Rate limit: ~10 videos/day

---

## ✅ 6. Checklist Implementare

### Frontend (✅ Complet)
- [x] Tipuri TypeScript pentru marketing settings
- [x] Tipuri TypeScript pentru social accounts
- [x] API client cu fallback
- [x] UI pentru marketing settings în `/producer-portal/marketing`
- [x] UI pentru promotion tiers
- [x] UI pentru social platform connection
- [x] Traduceri i18n
- [x] Documentație API contracts

### Backend (⏳ Așteaptă implementare)
- [ ] Endpoint `/producer/marketing/settings` (GET, PATCH)
- [ ] Endpoint `/producer/marketing/promotion-tiers` (GET)
- [ ] Endpoint `/producer/marketing/social/connect` (POST)
- [ ] Endpoint `/producer/marketing/social/disconnect` (DELETE)
- [ ] OAuth flow pentru Facebook
- [ ] OAuth flow pentru Instagram
- [ ] OAuth flow pentru TikTok
- [ ] Logică de auto-posting (cron jobs sau queue system)
- [ ] Integrare cu Facebook Graph API
- [ ] Integrare cu Instagram Graph API
- [ ] Integrare cu TikTok Marketing API

---

## 🔒 7. Securitate & Privacy

### 7.1. OAuth Tokens

- Token-urile OAuth trebuie stocate securizat (encrypted)
- Nu se expun token-uri în frontend
- Refresh tokens pentru reînnoire automată

### 7.2. Rate Limiting

- Respectă rate limits ale platformelor sociale
- Implementează retry logic pentru erori temporare
- Queue system pentru postări în caz de rate limit

### 7.3. Content Moderation

- Verifică conținutul înainte de postare
- Respectă policy-urile platformelor
- Filtrează conținut inadecvat

---

**Ultima actualizare:** 2025-01-27  
**Versiune:** 1.0

