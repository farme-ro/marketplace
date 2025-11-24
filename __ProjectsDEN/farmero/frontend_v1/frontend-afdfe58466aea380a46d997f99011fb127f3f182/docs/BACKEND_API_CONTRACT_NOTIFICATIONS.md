# Backend API Contract - Notifications System

**Data:** 2025-01-27  
**Scop:** Documentație pentru contractele API între frontend (Next.js) și backend (api.farme.ro) pentru Notifications System  
**Status:** Frontend-ready, așteaptă implementare backend

---

## 📋 Preambul

Acest document descrie contractele API pentru sistemul avansat de notificări:
- **Favorite Price Drops** - Notificări când produsele favorite scad la preț
- **Re-stock Alerts** - Notificări când produsele favorite revin în stoc
- **Subscription Reminders** - Reminder-uri pentru abonamente
- **Subscription Delivery** - Notificări când abonamentele sunt livrate
- **Order Status** - Notificări despre schimbarea statusului comenzilor
- **System Messages** - Mesaje de sistem (anunțuri, mentenanță, etc.)
- **Promotions** - Notificări despre promoții și oferte

**IMPORTANT:** 
- Frontend-ul este pregătit și folosește aceste contracte
- Backend-ul trebuie să implementeze aceste endpoint-uri conform specificațiilor
- Toate request-urile folosesc `credentials: 'include'` pentru cookie-based authentication
- Base URL: `https://api.farme.ro`
- **Push Notifications:** Sistemul este pregătit pentru Web Push (viitor)

---

## 🔐 Autentificare

Toate endpoint-urile necesită autentificare via cookies:
- Request-urile includ `credentials: 'include'`
- Backend-ul verifică cookie-ul de sesiune
- Răspunsuri de eroare:
  - `401 Unauthorized` - Nu este autentificat
  - `403 Forbidden` - Autentificat dar fără permisiuni

---

## 📬 Get Notifications

### GET /notifications

Returnează lista de notificări pentru utilizatorul autentificat.

**Query Parameters:**
- `category` (optional): `'favorite_price_drop' | 'favorite_back_in_stock' | 'subscription_reminder' | 'subscription_delivery' | 'order_status' | 'system_message' | 'promotion' | 'other'`
- `status` (optional): `'unread' | 'read' | 'archived'`
- `priority` (optional): `'low' | 'medium' | 'high' | 'urgent'`
- `unreadOnly` (optional): boolean - Doar notificări necitite
- `limit` (optional): number - Număr maxim de rezultate (default: 20)
- `offset` (optional): number - Offset pentru paginare

**Response Body:**

```typescript
interface Notification {
  id: string
  category: NotificationCategory
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'unread' | 'read' | 'archived'
  title: string
  message: string
  createdAt: string
  readAt?: string
  archivedAt?: string
  metadata?: Record<string, unknown>
}
```

**Example Response:**

```json
{
  "data": [
    {
      "id": "notif-123",
      "category": "favorite_price_drop",
      "priority": "medium",
      "status": "unread",
      "title": "Preț redus",
      "message": "Lapte de vacă a scăzut la preț cu 15%",
      "createdAt": "2025-01-27T10:30:00Z",
      "metadata": {
        "productId": "prod-123",
        "productName": "Lapte de vacă",
        "productSlug": "lapte-de-vaca",
        "productImageUrl": "https://example.com/image.jpg",
        "previousPrice": 12.50,
        "currentPrice": 10.63,
        "priceDropPercentage": 15,
        "favoriteId": "fav-123"
      }
    },
    {
      "id": "notif-124",
      "category": "subscription_reminder",
      "priority": "low",
      "status": "unread",
      "title": "Reminder abonament",
      "message": "Abonamentul tău Comandă săptămânală va fi livrat pe 2025-02-03",
      "createdAt": "2025-01-27T09:00:00Z",
      "metadata": {
        "subscriptionId": "sub-123",
        "subscriptionName": "Comandă săptămânală",
        "nextDeliveryDate": "2025-02-03T10:00:00Z",
        "itemsCount": 5
      }
    }
  ]
}
```

**Error Codes:**
- `401` - Nu este autentificat
- `403` - Nu are permisiuni

---

## 📄 Get Notification by ID

### GET /notifications/:id

Returnează detaliile unei notificări specifice.

**Response Body:** `Notification` (vezi mai sus)

**Error Codes:**
- `401` - Nu este autentificat
- `403` - Nu are permisiuni
- `404` - Notificarea nu a fost găsită

---

## ✅ Mark Notification as Read

### POST /notifications/:id/read

Marchează o notificare ca citită.

**Request Body:** (empty)

**Response Body:** `Notification` (updated, cu `status: 'read'` și `readAt` setat)

**Example Response:**

```json
{
  "id": "notif-123",
  "category": "favorite_price_drop",
  "priority": "medium",
  "status": "read",
  "title": "Preț redus",
  "message": "Lapte de vacă a scăzut la preț cu 15%",
  "createdAt": "2025-01-27T10:30:00Z",
  "readAt": "2025-01-27T11:00:00Z",
  "metadata": { ... }
}
```

**Error Codes:**
- `401` - Nu este autentificat
- `403` - Nu are permisiuni
- `404` - Notificarea nu a fost găsită

---

## ✅ Mark All Notifications as Read

### POST /notifications/read-all

Marchează toate notificările (sau toate dintr-o categorie) ca citite.

**Request Body:**

```typescript
{
  category?: NotificationCategory  // Optional: filter by category
}
```

**Response Body:**

```json
{
  "count": 5  // Number of notifications marked as read
}
```

**Error Codes:**
- `401` - Nu este autentificat
- `403` - Nu are permisiuni

---

## 📦 Archive Notification

### POST /notifications/:id/archive

Arhivează o notificare.

**Request Body:** (empty)

**Response Body:** `Notification` (updated, cu `status: 'archived'` și `archivedAt` setat)

**Error Codes:**
- `401` - Nu este autentificat
- `403` - Nu are permisiuni
- `404` - Notificarea nu a fost găsită

---

## ⚙️ Notification Preferences

### GET /notifications/preferences

Returnează preferințele de notificare ale utilizatorului.

**Response Body:**

```typescript
interface NotificationPreferences {
  favoritePriceDrop: boolean
  favoriteBackInStock: boolean
  subscriptionReminder: boolean
  subscriptionDelivery: boolean
  orderStatus: boolean
  systemMessages: boolean
  promotions: boolean
  pushEnabled?: boolean
  emailEnabled?: boolean
}
```

**Example Response:**

```json
{
  "favoritePriceDrop": true,
  "favoriteBackInStock": true,
  "subscriptionReminder": true,
  "subscriptionDelivery": true,
  "orderStatus": true,
  "systemMessages": true,
  "promotions": false,
  "pushEnabled": false,
  "emailEnabled": true
}
```

**Error Codes:**
- `401` - Nu este autentificat
- `403` - Nu are permisiuni
- `404` - Preferințele nu există (returnează defaults)

### PATCH /notifications/preferences

Actualizează preferințele de notificare.

**Request Body:**

```typescript
{
  preferences: Partial<NotificationPreferences>
}
```

**Example Request:**

```json
{
  "preferences": {
    "promotions": true,
    "pushEnabled": true
  }
}
```

**Response Body:** `NotificationPreferences` (updated)

**Error Codes:**
- `400` - Date invalide
- `401` - Nu este autentificat
- `403` - Nu are permisiuni

---

## 📊 Unread Count

### GET /notifications/unread-count

Returnează numărul de notificări necitite.

**Response Body:**

```json
{
  "count": 5
}
```

**Error Codes:**
- `401` - Nu este autentificat
- `403` - Nu are permisiuni

---

## 📝 Tipuri de Notificări

### Favorite Price Drop

**Category:** `favorite_price_drop`

**Metadata:**
```typescript
{
  productId: string
  productName: string
  productSlug?: string
  productImageUrl?: string | null
  previousPrice: number
  currentPrice: number
  priceDropPercentage: number
  favoriteId: string
}
```

### Favorite Back in Stock

**Category:** `favorite_back_in_stock`

**Metadata:**
```typescript
{
  productId: string
  productName: string
  productSlug?: string
  productImageUrl?: string | null
  stock: number
  favoriteId: string
}
```

### Subscription Reminder

**Category:** `subscription_reminder`

**Metadata:**
```typescript
{
  subscriptionId: string
  subscriptionName: string
  nextDeliveryDate: string
  itemsCount: number
}
```

### Subscription Delivery

**Category:** `subscription_delivery`

**Metadata:**
```typescript
{
  subscriptionId: string
  subscriptionName: string
  orderId: string
  orderNumber: string
  deliveryDate: string
}
```

### Order Status

**Category:** `order_status`

**Metadata:**
```typescript
{
  orderId: string
  orderNumber: string
  previousStatus?: string
  currentStatus: string
  estimatedDeliveryDate?: string
}
```

### System Message

**Category:** `system_message`

**Metadata:**
```typescript
{
  messageType: 'announcement' | 'maintenance' | 'update' | 'security' | 'other'
  actionUrl?: string
  actionLabel?: string
}
```

### Promotion

**Category:** `promotion`

**Metadata:**
```typescript
{
  promotionId: string
  promotionType: 'discount' | 'free_shipping' | 'gift' | 'other'
  discountPercentage?: number
  validUntil: string
  actionUrl?: string
}
```

---

## 📝 Note de Business

1. **Autentificare:** Toate endpoint-urile necesită autentificare
2. **Filtrare:** Endpoint-urile de listă suportă filtrare după category, status, priority
3. **Paginare:** Suportă `limit` și `offset` pentru paginare
4. **Date:** Toate datele sunt în format ISO 8601 (UTC)
5. **Push Notifications:** Sistemul este pregătit pentru Web Push (viitor)
6. **Email Notifications:** Sistemul este pregătit pentru email notifications (viitor)
7. **Preferințe:** Utilizatorii pot dezactiva anumite tipuri de notificări
8. **Arhivare:** Notificările arhivate nu apar în lista principală, dar pot fi accesate separat

---

## 🔔 Web Push (Viitor)

Sistemul este pregătit pentru Web Push notifications. Când va fi implementat:

- **POST /notifications/push/subscribe** - Subscribe la push notifications
- **POST /notifications/push/unsubscribe** - Unsubscribe de la push notifications
- **GET /notifications/push/subscription** - Get push subscription status

---

**Ultima actualizare:** 2025-01-27  
**Versiune:** 1.0

