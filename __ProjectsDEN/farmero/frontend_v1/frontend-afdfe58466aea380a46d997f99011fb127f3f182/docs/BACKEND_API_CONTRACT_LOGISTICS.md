# Backend API Contract - Logistics Portal

**Data:** 2025-01-27  
**Scop:** Documentație pentru contractele API între frontend (Next.js) și backend (api.farme.ro) pentru Logistics Portal  
**Status:** Frontend-ready, așteaptă implementare backend

---

## 📋 Preambul

Acest document descrie contractele API pentru funcționalitatea Logistics Portal:
- **Dashboard Statistics** - Statistici generale pentru logistică
- **Deliveries Management** - Gestionarea livrărilor
- **Delivery Status** - Status-ul livrărilor pe categorii
- **Routes** - Rute de livrare

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
  - `403 Forbidden` - Autentificat dar fără permisiuni (nu este logistics user)

---

## 📊 Dashboard Statistics

### GET /logistics/dashboard

Returnează statistici generale pentru logistics dashboard.

**Response Body:**

```typescript
interface LogisticsDashboardStats {
  totalDeliveries: number
  completedDeliveries: number
  inTransitDeliveries: number
  pendingDeliveries: number
  totalRevenue: number
  averageDeliveryTime?: number  // in hours
  onTimeDeliveryRate?: number  // percentage
  deliveriesThisMonth: number
  revenueThisMonth: number
  deliveriesGrowth?: number  // Percentage growth
  revenueGrowth?: number  // Percentage growth
}
```

**Example Response:**

```json
{
  "totalDeliveries": 342,
  "completedDeliveries": 320,
  "inTransitDeliveries": 15,
  "pendingDeliveries": 7,
  "totalRevenue": 45000.00,
  "averageDeliveryTime": 24.5,
  "onTimeDeliveryRate": 95.5,
  "deliveriesThisMonth": 45,
  "revenueThisMonth": 5925.00,
  "deliveriesGrowth": 8.2,
  "revenueGrowth": 10.5
}
```

**Error Codes:**
- `401` - Nu este autentificat
- `403` - Nu este logistics user

---

## 🚚 Deliveries Management

### GET /logistics/deliveries

Returnează lista de livrări pentru logistics.

**Query Parameters:**
- `status` (optional): `'PENDING' | 'ASSIGNED' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED' | 'CANCELED'`
- `limit` (optional): number - Număr maxim de rezultate
- `offset` (optional): number - Offset pentru paginare

**Response Body:**

```typescript
interface LogisticsDelivery {
  id: string
  deliveryNumber: string
  orderId: string
  orderNumber: string
  clientName: string
  clientPhone?: string
  status: 'PENDING' | 'ASSIGNED' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED' | 'CANCELED'
  pickupAddress: {
    name: string
    address: string
    city: string
    postalCode?: string
    phone?: string
  }
  deliveryAddress: {
    name: string
    address: string
    city: string
    postalCode?: string
    phone?: string
  }
  estimatedPickupTime?: string
  estimatedDeliveryTime?: string
  actualPickupTime?: string
  actualDeliveryTime?: string
  totalValue: number
  deliveryFee: number
  createdAt: string
  assignedAt?: string
  completedAt?: string
}
```

**Example Response:**

```json
{
  "data": [
    {
      "id": "delivery-123",
      "deliveryNumber": "DLV-2025-001",
      "orderId": "order-123",
      "orderNumber": "ORD-2025-001",
      "clientName": "Ion Popescu",
      "clientPhone": "+40123456789",
      "status": "IN_TRANSIT",
      "pickupAddress": {
        "name": "Ferme.ro Warehouse",
        "address": "Str. Depozit, Nr. 10",
        "city": "București",
        "postalCode": "010001",
        "phone": "+40123456789"
      },
      "deliveryAddress": {
        "name": "Ion Popescu",
        "address": "Str. Exemplu, Nr. 1",
        "city": "București",
        "postalCode": "010001",
        "phone": "+40123456789"
      },
      "estimatedPickupTime": "2025-01-27T08:00:00Z",
      "estimatedDeliveryTime": "2025-01-27T14:00:00Z",
      "actualPickupTime": "2025-01-27T08:15:00Z",
      "totalValue": 250.50,
      "deliveryFee": 15.00,
      "createdAt": "2025-01-27T07:00:00Z",
      "assignedAt": "2025-01-27T07:30:00Z"
    }
  ]
}
```

**Error Codes:**
- `401` - Nu este autentificat
- `403` - Nu este logistics user

### GET /logistics/deliveries/:id

Returnează detaliile unei livrări specifice.

**Response Body:** `LogisticsDelivery` (vezi mai sus)

**Error Codes:**
- `401` - Nu este autentificat
- `403` - Nu este logistics user sau nu are acces la această livrare
- `404` - Livrarea nu a fost găsită

---

## 📊 Delivery Status

### GET /logistics/deliveries/status

Returnează statistici despre status-ul livrărilor (grupate pe status).

**Response Body:**

```typescript
interface LogisticsDeliveryStatus {
  pending: number
  assigned: number
  inTransit: number
  delivered: number
  failed: number
  canceled: number
}
```

**Example Response:**

```json
{
  "pending": 7,
  "assigned": 5,
  "inTransit": 15,
  "delivered": 320,
  "failed": 2,
  "canceled": 1
}
```

**Error Codes:**
- `401` - Nu este autentificat
- `403` - Nu este logistics user

---

## 🗺️ Routes

### GET /logistics/routes

Returnează lista de rute de livrare.

**Query Parameters:**
- `status` (optional): `'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED'`
- `region` (optional): string - Filtrare după regiune

**Response Body:**

```typescript
interface LogisticsRoute {
  id: string
  name: string
  region: string
  deliveries: LogisticsDelivery[]
  estimatedDuration?: number  // in hours
  totalDistance?: number  // in km
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED'
}
```

**Example Response:**

```json
{
  "data": [
    {
      "id": "route-123",
      "name": "Ruta București Nord",
      "region": "București",
      "deliveries": [
        {
          "id": "delivery-123",
          "deliveryNumber": "DLV-2025-001",
          // ... (vezi LogisticsDelivery)
        }
      ],
      "estimatedDuration": 6.5,
      "totalDistance": 45.2,
      "status": "IN_PROGRESS"
    }
  ]
}
```

**Error Codes:**
- `401` - Nu este autentificat
- `403` - Nu este logistics user

---

## 📝 Note de Business

1. **Autentificare:** Toate endpoint-urile necesită autentificare ca logistics user
2. **Filtrare:** Endpoint-urile de listă suportă filtrare după status și paginare
3. **Valută:** Toate sumele sunt în RON (Lei)
4. **Date:** Toate datele sunt în format ISO 8601 (UTC)
5. **Timp de livrare:** `averageDeliveryTime` este calculat ca medie între `actualPickupTime` și `actualDeliveryTime`
6. **Rata la timp:** `onTimeDeliveryRate` este calculată ca procentaj de livrări care au fost livrate înainte de `estimatedDeliveryTime`

---

**Ultima actualizare:** 2025-01-27  
**Versiune:** 1.0

