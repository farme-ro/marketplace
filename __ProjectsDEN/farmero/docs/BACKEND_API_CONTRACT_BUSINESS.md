# Backend API Contract - Business Portal

**Data:** 2025-01-27  
**Scop:** Documentație pentru contractele API între frontend (Next.js) și backend (api.farme.ro) pentru Business Portal  
**Status:** Frontend-ready, așteaptă implementare backend

---

## 📋 Preambul

Acest document descrie contractele API pentru funcționalitatea Business Portal:
- **Dashboard Statistics** - Statistici generale pentru business
- **Orders Management** - Gestionarea comenzilor business
- **Order Flow** - Flow-ul comenzilor pe status
- **Subscriptions** - Abonamente active

**IMPORTANT:** 
- Frontend-ul este pregătit și folosește aceste contracte
- Backend-ul trebuie să implementeze aceste endpoint-uri conform specificațiilor
- Toate request-urile folosesc `credentials: 'include'` pentru cookie-based authentication
- Base URL: `https://api.farme.ro`

---

## 🔐 Autentificare

Toate endpoint-urile necesită autentificare via cookies:
- Request-urile includ `credentials: 'include'`
- Backend-ul verifică cookie-ul de sesiune
- Răspunsuri de eroare:
  - `401 Unauthorized` - Nu este autentificat
  - `403 Forbidden` - Autentificat dar fără permisiuni (nu este business user)

---

## 📊 Dashboard Statistics

### GET /business/dashboard

Returnează statistici generale pentru business dashboard.

**Response Body:**

```typescript
interface BusinessDashboardStats {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  activeSubscriptions: number
  averageOrderValue: number
  ordersThisMonth: number
  revenueThisMonth: number
  ordersGrowth?: number  // Percentage growth
  revenueGrowth?: number  // Percentage growth
}
```

**Example Response:**

```json
{
  "totalOrders": 145,
  "totalRevenue": 125000.50,
  "pendingOrders": 8,
  "activeSubscriptions": 3,
  "averageOrderValue": 862.07,
  "ordersThisMonth": 23,
  "revenueThisMonth": 19827.50,
  "ordersGrowth": 15.5,
  "revenueGrowth": 12.3
}
```

**Error Codes:**
- `401` - Nu este autentificat
- `403` - Nu este business user

---

## 📦 Orders Management

### GET /business/orders

Returnează lista de comenzi pentru business.

**Query Parameters:**
- `status` (optional): `'NEW' | 'CONFIRMED' | 'PREPARING' | 'SHIPPED' | 'DELIVERED' | 'CANCELED'`
- `limit` (optional): number - Număr maxim de rezultate
- `offset` (optional): number - Offset pentru paginare

**Response Body:**

```typescript
interface BusinessOrder {
  id: string
  orderNumber: string
  clientName: string
  clientEmail?: string
  total: number
  status: 'NEW' | 'CONFIRMED' | 'PREPARING' | 'SHIPPED' | 'DELIVERED' | 'CANCELED'
  createdAt: string
  deliveryDate?: string
  items: BusinessOrderItem[]
  shippingAddress?: {
    name: string
    address: string
    city: string
    postalCode?: string
    phone?: string
  }
}

interface BusinessOrderItem {
  id: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  total: number
  unit?: string
}
```

**Example Response:**

```json
{
  "data": [
    {
      "id": "order-123",
      "orderNumber": "ORD-2025-001",
      "clientName": "Ion Popescu",
      "clientEmail": "ion@example.ro",
      "total": 250.50,
      "status": "CONFIRMED",
      "createdAt": "2025-01-27T10:30:00Z",
      "deliveryDate": "2025-01-29T14:00:00Z",
      "items": [
        {
          "id": "item-1",
          "productId": "prod-123",
          "productName": "Lapte de vacă",
          "quantity": 2,
          "unitPrice": 12.50,
          "total": 25.00,
          "unit": "l"
        }
      ],
      "shippingAddress": {
        "name": "Ion Popescu",
        "address": "Str. Exemplu, Nr. 1",
        "city": "București",
        "postalCode": "010001",
        "phone": "+40123456789"
      }
    }
  ]
}
```

**Error Codes:**
- `401` - Nu este autentificat
- `403` - Nu este business user

### GET /business/orders/:id

Returnează detaliile unei comenzi specifice.

**Response Body:** `BusinessOrder` (vezi mai sus)

**Error Codes:**
- `401` - Nu este autentificat
- `403` - Nu este business user sau nu are acces la această comandă
- `404` - Comanda nu a fost găsită

---

## 🔄 Order Flow

### GET /business/orders/flow

Returnează statistici despre flow-ul comenzilor (grupate pe status).

**Response Body:**

```typescript
interface BusinessOrderFlow {
  new: number
  confirmed: number
  preparing: number
  shipped: number
  delivered: number
  canceled: number
}
```

**Example Response:**

```json
{
  "new": 5,
  "confirmed": 12,
  "preparing": 8,
  "shipped": 15,
  "delivered": 105,
  "canceled": 2
}
```

**Error Codes:**
- `401` - Nu este autentificat
- `403` - Nu este business user

---

## 📋 Subscriptions

### GET /business/subscriptions

Returnează lista de abonamente active pentru business.

**Response Body:**

```typescript
interface BusinessSubscription {
  id: string
  name: string
  frequency: 'weekly' | 'biweekly' | 'monthly'
  isActive: boolean
  nextDeliveryDate?: string
  items: BusinessSubscriptionItem[]
  createdAt: string
}

interface BusinessSubscriptionItem {
  productId: string
  productName: string
  quantity: number
  unit?: string
}
```

**Example Response:**

```json
{
  "data": [
    {
      "id": "sub-123",
      "name": "Comandă săptămânală",
      "frequency": "weekly",
      "isActive": true,
      "nextDeliveryDate": "2025-02-03T10:00:00Z",
      "items": [
        {
          "productId": "prod-123",
          "productName": "Lapte de vacă",
          "quantity": 2,
          "unit": "l"
        }
      ],
      "createdAt": "2025-01-20T10:00:00Z"
    }
  ]
}
```

**Error Codes:**
- `401` - Nu este autentificat
- `403` - Nu este business user

---

## 📝 Note de Business

1. **Autentificare:** Toate endpoint-urile necesită autentificare ca business user
2. **Filtrare:** Endpoint-urile de listă suportă filtrare după status și paginare
3. **Valută:** Toate sumele sunt în RON (Lei)
4. **Date:** Toate datele sunt în format ISO 8601 (UTC)

---

**Ultima actualizare:** 2025-01-27  
**Versiune:** 1.0

