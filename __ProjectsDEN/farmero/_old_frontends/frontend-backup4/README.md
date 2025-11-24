# farme.ro Backend API

Backend API pentru marketplace-ul farme.ro - platformă pentru conectarea producătorilor locali cu clienții.

## 📊 Rezumat Rapid

### Modele Prisma Principale
- **User** - Utilizatori (ADMIN, PRODUCER, CUSTOMER)
- **Producer** - Producători (companie/PFA) cu status de verificare
- **Product** - Produse cu status (DRAFT → PENDING_REVIEW → APPROVED)
- **Cart / CartItem** - Coș de cumpărături
- **Order / OrderVendor / OrderItem** - Comenzi split-uite pe producători
- **Commission** - Comisioane marketplace per producător
- **CustomerInvoice / ProducerInvoice** - Referințe către facturi externe
- **Region** - Regiuni/județe pentru organizare geografică

### Module API
- **`/auth`** - Autentificare (register, login, me)
- **`/api/public/*`** - API public pentru marketplace (produse, producători, regiuni)
- **`/products`** - CRUD produse (PRODUCER/ADMIN)
- **`/producers`** - CRUD producători (ADMIN)
- **`/regions`** - CRUD regiuni (ADMIN)
- **`/cart`** - Gestionare coș (CUSTOMER)
- **`/orders`** - Comenzi (checkout, listare, status)
- **`/commissions`** - Gestionare comisioane (ADMIN/PRODUCER)

### Flow Principal: Login → Coș → Comandă
1. **Autentificare**: `POST /auth/register` sau `POST /auth/login` → primește JWT token
2. **Adăugare în coș**: `POST /cart/items` → adaugă produse în coș
3. **Checkout**: `POST /orders/checkout` → creează Order, OrderVendor, OrderItem, Commission
4. **Gestionare**: Producătorii văd sub-comenzile lor, adminii gestionează comisioanele

## 📋 Cuprins

- [Tehnologii](#tehnologii)
- [Instalare și Configurare](#instalare-și-configurare)
- [Structura Proiectului](#structura-proiectului)
- [Modele Prisma](#modele-prisma)
- [Rute API](#rute-api)
- [Flow-uri Principale](#flow-uri-principale)
- [Roluri Utilizatori](#roluri-utilizatori)
- [Scripturi Disponibile](#scripturi-disponibile)

## 🛠 Tehnologii

- **Express.js** - Framework HTTP
- **TypeScript** - Type safety
- **Prisma ORM** - Interacțiune cu baza de date PostgreSQL
- **JWT** - Autentificare și autorizare
- **Zod** - Validare input
- **bcrypt** - Hash-uire parole

## 🚀 Instalare și Configurare

### 1. Instalare dependențe

```bash
npm install
```

### 2. Configurare variabile de mediu

Creează un fișier `.env` în root-ul proiectului:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/farmero_db"

# Server
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
```

### 3. Configurare baza de date

```bash
# Generează Prisma Client
npm run prisma:generate

# Rulează migrările
npm run prisma:migrate
```

### 4. Pornire server

```bash
# Development (cu hot reload)
npm run dev

# Production
npm run start:prod
```

Serverul va rula pe `http://localhost:3001`

## 📁 Structura Proiectului

```
backend/
├── src/
│   ├── index.ts              # Entry point, configurare server Express
│   ├── middleware/
│   │   └── auth.ts           # Middleware pentru autentificare JWT
│   ├── modules/               # Module organizate pe funcționalități
│   │   ├── auth/             # Autentificare (register, login, me)
│   │   ├── cart/             # Coș de cumpărături
│   │   ├── orders/           # Comenzi (checkout, listare, status)
│   │   ├── products/         # CRUD produse
│   │   ├── producers/       # CRUD producători
│   │   ├── regions/          # CRUD regiuni
│   │   ├── commission/      # Gestionare comisioane marketplace
│   │   └── public/           # API public pentru marketplace
│   ├── types/                # Tipuri TypeScript
│   └── utils/                # Utilitare
│       ├── jwt.ts            # Funcții JWT (generate, verify)
│       ├── bcrypt.ts         # Hash-uire parole
│       ├── prisma.ts         # Singleton Prisma Client
│       └── response.ts       # Helper-uri pentru răspunsuri uniforme
├── prisma/
│   └── schema.prisma         # Schema baza de date
└── package.json
```

## 🗄 Modele Prisma

### User
Utilizatori ai platformei (ADMIN, PRODUCER, CUSTOMER).

**Câmpuri principale:**
- `id`, `email`, `passwordHash`, `fullName`, `role`
- Relație 1-1 cu `Producer` (dacă rolul este PRODUCER)
- Relații one-to-many cu `Cart` și `Order`

### Producer
Profilul unui producător (companie sau PFA).

**Câmpuri principale:**
- `id`, `userId`, `name`, `registrationNumber`, `type`, `status`
- `mainRegionId` - regiunea principală de activitate
- Status: `PENDING_VERIFICATION`, `APPROVED`, `REJECTED`

### Region
Regiuni/județe pentru organizarea producătorilor și produselor.

**Câmpuri principale:**
- `id`, `name`, `type` (COUNTY/REGION), `code`

### Product
Produse oferite de producători.

**Câmpuri principale:**
- `id`, `producerId`, `name`, `description`, `price`, `stock`
- `isTraditional` - flag pentru produse tradiționale
- `regionId` - zona tradițională (opțional)
- Status: `DRAFT`, `PENDING_REVIEW`, `APPROVED`, `REJECTED`

### Cart
Coș de cumpărături pentru utilizatori.

**Câmpuri principale:**
- `id`, `customerId`, `status` (ACTIVE/CONVERTED)
- Relație one-to-many cu `CartItem`

### CartItem
Itemi din coș (produs + cantitate).

**Câmpuri principale:**
- `id`, `cartId`, `productId`, `quantity`

### Order
Comandă globală (poate conține produse de la mai mulți producători).

**Câmpuri principale:**
- `id`, `customerId`, `customerType` (B2C/B2B)
- `status` (PENDING/PAID/CANCELLED/COMPLETED)
- `paymentStatus` (UNPAID/PAID/REFUNDED)
- `totalAmount`, `totalCommission`
- Date livrare: `shippingFullName`, `shippingPhone`, `shippingAddressLine1`, etc.
- `shippingRegionId` - regiunea de livrare
- **Date firme B2B:** `companyName`, `companyCui`, `companyRegNo`, `companyAddress`
- Relație one-to-many cu `OrderVendor` și `Commission`
- Relație 1-1 cu `CustomerInvoice`

### OrderVendor
Sub-comandă per producător (split-ul comenzii pe producători).

**Câmpuri principale:**
- `id`, `orderId`, `producerId`
- `status` (PENDING/ACCEPTED/PREPARING/SHIPPED/DELIVERED/CANCELLED)
- `subtotal`, `commissionRate`, `commissionAmount`, `payoutAmount`
- `deliveryMethod`, `trackingNumber`
- Relație one-to-many cu `OrderItem`

### OrderItem
Itemi din comandă (snapshot-ul produsului la momentul comenzii).

**Câmpuri principale:**
- `id`, `orderVendorId`, `productId`, `quantity`
- `unitPrice`, `totalPrice`
- `productNameSnapshot`, `productImageUrlSnapshot` (pentru istoric)

### Commission
Comision marketplace per comandă/producător.

**Câmpuri principale:**
- `id`, `orderId`, `producerId`
- `baseAmount` - valoarea comenzii pentru acel producător
- `commissionRate` - rata comisionului (ex: 0.08 = 8%)
- `commissionAmount` - suma comisionului
- `status` (PENDING/ISSUED/PAID)
- Relație 1-1 cu `ProducerInvoice`

### CustomerInvoice
Factură pentru client (referință către sistemul extern de facturare).

**Câmpuri principale:**
- `id`, `orderId` (unique)
- `externalId` - ID în sistemul extern (ex. SmartBill/Factureaza)
- `pdfUrl` - link către factura PDF
- `issuedAt` - data/ora emiterii

### ProducerInvoice
Factură pentru producător (referință către sistemul extern de facturare).

**Câmpuri principale:**
- `id`, `commissionId` (unique)
- `externalId` - ID în sistemul extern
- `pdfUrl` - link către factura PDF
- `issuedAt` - data/ora emiterii

## 🛣 Rute API - Detalii pe Module

### 📍 API Public (`/api/public`)

**Endpoint-uri publice (fără autentificare) pentru marketplace:**

| Method | Endpoint | Descriere | Filtre |
|--------|----------|-----------|--------|
| GET | `/api/public/products` | Listă produse aprobate | `?q=`, `?regionId=`, `?page=`, `?pageSize=` |
| GET | `/api/public/products/:slug` | Detalii produs | - |
| GET | `/api/public/producers` | Listă producători aprobați | `?q=`, `?regionId=` |
| GET | `/api/public/producers/:slug` | Detalii producător + produse | - |
| GET | `/api/public/regions` | Listă regiuni | `?type=COUNTY\|REGION` |

**Modul:** `src/modules/public/public.routes.ts`

**Filtre detaliate:**
- `/api/public/products`: `?q=` (search), `?regionId=`, `?page=`, `?pageSize=` (default: 20, max: 100)
- `/api/public/producers`: `?q=` (search), `?regionId=`
- `/api/public/regions`: `?type=COUNTY` sau `?type=REGION`

### 🔐 Autentificare (`/auth`)

**Modul:** `src/modules/auth/auth.routes.ts`

| Method | Endpoint | Descriere | Auth | Body |
|--------|----------|-----------|------|------|
| GET | `/auth` | Info despre endpoint-uri | ❌ | - |
| POST | `/auth/register` | Înregistrare utilizator nou | ❌ | `email`, `password`, `fullName`, `role?` |
| POST | `/auth/login` | Autentificare utilizator | ❌ | `email`, `password` |
| GET | `/auth/me` | Informații utilizator curent | ✅ | - |

**Răspuns login/register:** `{ token: string, user: {...} }`

### 📦 Produse (`/products`)

**Modul:** `src/modules/products/product.routes.ts`

| Method | Endpoint | Descriere | Auth | Rol | Filtre |
|--------|----------|-----------|------|-----|--------|
| GET | `/products` | Listă produse | ❌ | - | `regionId`, `producerId`, `status`, `isTraditional` |
| GET | `/products/:id` | Detalii produs | ❌ | - | - |
| POST | `/products` | Creează produs | ✅ | PRODUCER | - |
| PUT | `/products/:id` | Actualizează produs | ✅ | PRODUCER/ADMIN | - |
| DELETE | `/products/:id` | Șterge produs | ✅ | PRODUCER/ADMIN | - |
| PATCH | `/products/:id/approve` | Aprobă produs | ✅ | ADMIN | - |
| PATCH | `/products/:id/reject` | Respinge produs | ✅ | ADMIN | - |

**Status produs:** `DRAFT` → `PENDING_REVIEW` → `APPROVED` / `REJECTED`

### 🏭 Producători (`/producers`)

**Modul:** `src/modules/producers/producer.routes.ts`

| Method | Endpoint | Descriere | Auth | Rol | Filtre |
|--------|----------|-----------|------|-----|--------|
| GET | `/producers` | Listă producători | ✅ | ADMIN | `status`, `regionId` |
| GET | `/producers/me` | Profil producător curent | ✅ | PRODUCER | - |
| POST | `/producers` | Creează producător | ✅ | ADMIN | - |
| PUT | `/producers/:id` | Actualizează producător | ✅ | PRODUCER/ADMIN | - |

**Status producător:** `PENDING_VERIFICATION` → `APPROVED` / `REJECTED`

### 🗺️ Regiuni (`/regions`)

**Modul:** `src/modules/regions/region.routes.ts`

| Method | Endpoint | Descriere | Auth | Rol |
|--------|----------|-----------|------|-----|
| GET | `/regions` | Listă regiuni | ✅ | ADMIN |
| POST | `/regions` | Creează regiune | ✅ | ADMIN |
| PUT | `/regions/:id` | Actualizează regiune | ✅ | ADMIN |
| DELETE | `/regions/:id` | Șterge regiune | ✅ | ADMIN |

**Tipuri:** `COUNTY` (județ) sau `REGION` (regiune)

### 💰 Comisioane (`/commissions`)

**Modul:** `src/modules/commission/commission.routes.ts` + `commission.service.ts`

| Method | Endpoint | Descriere | Auth | Rol | Filtre |
|--------|----------|-----------|------|-----|--------|
| GET | `/commissions` | Listă toate comisioanele | ✅ | ADMIN | `?status=`, `?producerId=`, `?orderId=` |
| GET | `/commissions/mine` | Comisioane pentru producătorul curent | ✅ | PRODUCER | `?status=` |
| PATCH | `/commissions/:id/mark-issued` | Marchează comision ca ISSUED | ✅ | ADMIN | - |
| PATCH | `/commissions/:id/mark-paid` | Marchează comision ca PAID | ✅ | ADMIN | - |

**Status comision:** `PENDING` → `ISSUED` → `PAID` (8% marketplace commission)

### 🛒 Coș (`/cart`)

**Modul:** `src/modules/cart/cart.routes.ts` + `cart.service.ts`

| Method | Endpoint | Descriere | Auth | Body |
|--------|----------|-----------|------|------|
| GET | `/cart` | Obține coșul curent cu itemi | ✅ | - |
| POST | `/cart/items` | Adaugă/actualizează item în coș | ✅ | `productId`, `quantity` |
| PUT | `/cart/items/:id` | Actualizează cantitatea unui item | ✅ | `quantity` |
| DELETE | `/cart/items/:id` | Șterge item din coș | ✅ | - |

**Logica:** Coșul se creează automat la primul item. Se verifică stocul și statusul produsului (trebuie APPROVED).

### 📋 Comenzi (`/orders`)

**Modul:** `src/modules/orders/order.routes.ts` + `order.service.ts`

| Method | Endpoint | Descriere | Auth | Rol | Body |
|--------|----------|-----------|------|-----|------|
| POST | `/orders/checkout` | Procesează checkout din coș | ✅ | CUSTOMER | Date livrare + B2B (dacă e cazul) |
| GET | `/orders` | Listă comenzile customer-ului | ✅ | CUSTOMER | - |
| GET | `/orders/:id` | Detalii comandă | ✅ | CUSTOMER/ADMIN | - |
| GET | `/orders/vendor/orders` | Listă comenzile producătorului | ✅ | PRODUCER | - |
| GET | `/orders/vendor/orders/:id` | Detalii sub-comandă | ✅ | PRODUCER | - |
| PATCH | `/orders/vendor/orders/:id/status` | Actualizează status sub-comandă | ✅ | PRODUCER | `status` |
| GET | `/orders/admin/orders` | Listă toate comenzile | ✅ | ADMIN | `?status=`, `?paymentStatus=`, `?producerId=` |
| GET | `/orders/admin/orders/:id` | Detalii comandă (admin) | ✅ | ADMIN | - |

**Checkout creează:** Order → OrderVendor → OrderItem → Commission (pentru fiecare producător)

## 🔄 Flow-uri Principale

### Flow: User → Cart → Order

#### 1. **Înregistrare/Autentificare**
```
POST /auth/register → User creat → JWT token returnat
POST /auth/login → User autentificat → JWT token returnat
```

#### 2. **Adăugare Produse în Coș**
```
GET /products → Listă produse disponibile
POST /cart/items { productId, quantity } → Item adăugat în coș
GET /cart → Coș cu toți itemii și totalul
```

**Logica coșului:**
- Fiecare user are un coș activ (`status: ACTIVE`)
- Dacă nu există coș activ, se creează automat
- Dacă item-ul există deja, se actualizează cantitatea
- Se verifică stocul disponibil și statusul produsului (trebuie să fie APPROVED)

#### 3. **Checkout (Creare Comandă)**
```
POST /orders/checkout {
  shippingFullName, shippingPhone, shippingAddressLine1,
  shippingCity, shippingPostalCode, shippingRegionId,
  notes, customerType (B2C/B2B),
  // Date firme pentru B2B (obligatorii dacă customerType = B2B):
  companyName, companyCui, companyRegNo, companyAddress
}
```

**Procesul de checkout:**
1. Se găsește coșul activ cu toți itemii
2. Se grupează itemii pe producător
3. Pentru fiecare producător se calculează:
   - `subtotal` = suma produselor
   - `commissionRate` = 12% (B2C) sau 6% (B2B) - pentru OrderVendor
   - `commissionAmount` = subtotal × commissionRate
   - `payoutAmount` = subtotal - commissionAmount
4. Se creează `Order` cu:
   - `totalAmount` = suma tuturor subtotalurilor
   - `totalCommission` = suma tuturor comisioanelor
   - Datele de livrare (inclusiv `shippingRegionId`)
   - Datele firmei (dacă `customerType = B2B`)
5. Se creează `OrderVendor` pentru fiecare producător
6. Se creează `OrderItem` pentru fiecare `CartItem` (cu snapshot-ul produsului)
7. **Se creează `Commission` pentru fiecare producător:**
   - `baseAmount` = subtotalul producătorului
   - `commissionRate` = 8% (marketplace commission, hardcodat)
   - `commissionAmount` = baseAmount × 8%
   - `status` = PENDING
8. Coșul este marcat ca `CONVERTED`
9. **MVP:** Plata este simulată automat (`paymentStatus: PAID`)

#### 4. **Gestionare Comenzi**

**Pentru Customer:**
- `GET /orders` - vede toate comenzile sale
- `GET /orders/:id` - vede detaliile unei comenzi

**Pentru Producer:**
- `GET /orders/vendor/orders` - vede sub-comenzile sale (OrderVendor)
- `GET /orders/vendor/orders/:id` - vede detaliile unei sub-comenzi
- `PATCH /orders/vendor/orders/:id/status` - actualizează statusul (ACCEPTED → PREPARING → SHIPPED → DELIVERED)
- Când toate sub-comenzile sunt DELIVERED, `Order.status` devine COMPLETED automat

**Pentru Admin:**
- `GET /orders/admin/orders` - vede toate comenzile (cu filtre)
- `GET /orders/admin/orders/:id` - vede detaliile oricărei comenzi

### Flow: Producer → Product → Approval

#### 1. **Creare Profil Producer**
```
POST /auth/register (cu rol PRODUCER sau actualizare ulterioară)
POST /producers (doar ADMIN) → Producer creat cu status PENDING_VERIFICATION
```

#### 2. **Aprobare Producer**
```
PUT /producers/:id { status: APPROVED } (doar ADMIN)
```

#### 3. **Creare Produse**
```
POST /products {
  name, description, price, stock,
  isTraditional, regionId
} → Produs creat cu status PENDING_REVIEW
```

#### 4. **Aprobare Produse**
```
PATCH /products/:id/approve (doar ADMIN) → status: APPROVED
PATCH /products/:id/reject (doar ADMIN) → status: REJECTED
```

**Notă:** Dacă un produs aprobat este modificat de producător, revine automat în `PENDING_REVIEW`.

## 👥 Roluri Utilizatori

### ADMIN
- Acces complet la toate resursele
- Poate aproba/respinge producători și produse
- Poate gestiona regiuni
- Poate vedea toate comenzile

### PRODUCER
- Poate crea și gestiona propriile produse
- Poate vedea și gestiona sub-comenzile sale (OrderVendor)
- Poate actualiza statusul sub-comenzilor (ACCEPTED → PREPARING → SHIPPED → DELIVERED)
- Poate vedea propriul profil (`GET /producers/me`)

### CUSTOMER
- Poate naviga și căuta produse
- Poate adăuga produse în coș
- Poate face checkout și crea comenzi
- Poate vedea propriile comenzi

## 📜 Scripturi Disponibile

```bash
# Development
npm run dev              # Pornește server cu hot reload (tsx watch)

# Build & Production
npm run build            # Compilează TypeScript în dist/
npm run start            # Pornește server din dist/
npm run start:prod       # Build + start (pentru producție)

# Prisma
npm run prisma:generate  # Generează Prisma Client
npm run prisma:migrate   # Rulează migrările
npm run prisma:migrate:deploy  # Aplică migrări în producție
npm run prisma:studio    # Deschide Prisma Studio (GUI pentru DB)
npm run prisma:seed      # Rulează seed script pentru date de test

# Testing & Verification
npm run test:endpoints   # Testează automat endpoint-urile backend
npm run check:config     # Verifică configurarea (variabile de mediu)

# Placeholder (de configurat)
npm run lint             # Linting (de configurat)
npm run test             # Tests (de configurat)
```

### Documentație Suplimentară

- **`API_ENDPOINTS_REFERENCE.md`** - Referință completă pentru toate endpoint-urile
- **`ENDPOINT_TESTING_CHECKLIST.md`** - Checklist detaliat pentru testare manuală
- **`TESTING_GUIDE.md`** - Ghidă completă pentru testare (automată și manuală)
- **`STRIPE_SETUP_GUIDE.md`** - Ghidă pas cu pas pentru configurarea Stripe
- **`MIGRATION_TEST_REPORT.md`** - Raport pentru migrațiile Prisma
- **`scripts/README.md`** - Documentație pentru scripturi

## 🔒 Autentificare

API-ul folosește JWT (JSON Web Tokens) pentru autentificare.

**Format header:**
```
Authorization: Bearer <token>
```

Token-ul este returnat la `POST /auth/register` și `POST /auth/login` și conține:
- `userId` - ID-ul utilizatorului
- `role` - Rolul (ADMIN, PRODUCER, CUSTOMER)
- `email` - Email-ul utilizatorului

**Expirare:** 7 zile (configurabil prin `JWT_EXPIRES_IN`)

## 📝 Note

- **MVP:** Plata este simulată automat la checkout (toate comenzile devin PAID imediat)
- **Stoc:** Se verifică stocul disponibil la adăugarea în coș și la checkout
- **Snapshot:** La crearea comenzii, se salvează snapshot-ul produsului (nume, preț) pentru istoric
- **Comisioane OrderVendor:** B2C = 12%, B2B = 6% (configurabile în `order.service.ts`)
- **Comisioane Marketplace:** 8% (hardcodat în `order.service.ts`, pentru Commission)
- **Split comenzi:** Fiecare comandă este împărțită pe producători (OrderVendor) pentru gestionare independentă a fiecărei sub-comenzi
- **B2B Support:** Comenzile B2B necesită `companyName` și `companyCui` obligatorii
- **Regiuni:** Filtrarea produselor după regiune include atât produse tradiționale, cât și produse de la producători din regiunea respectivă

## 🚧 TODO / Îmbunătățiri Viitoare

- [ ] Configurare linting (ESLint)
- [ ] Configurare testing (Jest/Vitest)
- [ ] Integrare gateway de plată reală
- [ ] Upload imagini pentru produse
- [ ] Notificări email pentru comenzi
- [ ] Rate limiting
- [ ] Documentație API (Swagger/OpenAPI)
- [ ] Logging structurat
- [ ] Monitoring și error tracking

