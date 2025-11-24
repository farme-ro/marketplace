# Journal API Specification

**Data:** 2025-01-27  
**Scop:** Specificație API pentru secțiunea „Jurnal de farme.ro”  
**Status:** ⚠️ Pending Implementation

---

## 📋 Rezumat Executiv

Acest document descrie endpoint-urile API necesare pentru funcționalitatea „Jurnal de farme.ro” - o secțiune editorială premium pentru producătorii cu planuri plătite de promovare.

---

## 🗄️ Model Database

### Prisma Schema

```prisma
model JournalArticle {
  id           String   @id @default(cuid())
  slug         String   @unique
  title        String
  excerpt      String
  content      String   @db.Text
  coverImage   String?  // URL
  producerId   String
  status       String   // 'draft' | 'review' | 'published'
  publishedAt  DateTime?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  producer     Producer @relation(fields: [producerId], references: [id], onDelete: Cascade)

  @@index([producerId])
  @@index([status])
  @@index([publishedAt])
  @@map("journal_articles")
}
```

**Notă:** Adaptează la schema actuală (nume tabel producător, tip ID, etc.).

---

## 🔌 Endpoints API

### 1. GET /journal

**Descriere:** Returnează lista de articole publicate.

**Query Parameters:**
- `page?: number` - Numărul paginii (default: 1)
- `limit?: number` - Numărul de articole pe pagină (default: 20, max: 50)
- `producerId?: string` - Filtrare după producător
- `status?: 'draft' | 'review' | 'published'` - Filtrare după status (default: `published`)

**Autentificare:** Nu este necesară pentru articole publicate. Pentru `status !== 'published'`, necesită autentificare (admin sau producătorul asociat).

**Răspuns 200:**
```json
{
  "data": [
    {
      "id": "clx123...",
      "slug": "povestea-mierii-maramures",
      "title": "Povestea mierii din inima Maramureșului",
      "excerpt": "O scurtă descriere...",
      "content": "<p>Conținut HTML...</p>",
      "coverImageUrl": "https://...",
      "producerId": "clx456...",
      "producerName": "Ferma Popescu",
      "producerSlug": "ferma-popescu",
      "status": "published",
      "publishedAt": "2025-01-15T10:00:00Z",
      "createdAt": "2025-01-10T10:00:00Z",
      "updatedAt": "2025-01-15T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

**Sau format simplu (dacă nu e paginare):**
```json
[
  {
    "id": "clx123...",
    "slug": "povestea-mierii-maramures",
    // ... rest of fields
  }
]
```

**Erori:**
- `400` - Parametri invalizi
- `500` - Eroare server

---

### 2. GET /journal/:slug

**Descriere:** Returnează un articol individual după slug.

**Parametri:**
- `slug: string` - Slug-ul articolului

**Autentificare:** Nu este necesară pentru articole publicate. Pentru `status !== 'published'`, necesită autentificare (admin sau producătorul asociat).

**Răspuns 200:**
```json
{
  "id": "clx123...",
  "slug": "povestea-mierii-maramures",
  "title": "Povestea mierii din inima Maramureșului",
  "excerpt": "O scurtă descriere...",
  "content": "<p>Conținut HTML...</p>",
  "coverImageUrl": "https://...",
  "producerId": "clx456...",
  "producerName": "Ferma Popescu",
  "producerSlug": "ferma-popescu",
  "status": "published",
  "publishedAt": "2025-01-15T10:00:00Z",
  "createdAt": "2025-01-10T10:00:00Z",
  "updatedAt": "2025-01-15T10:00:00Z"
}
```

**Erori:**
- `404` - Articolul nu a fost găsit
- `403` - Nu ai permisiune să accesezi acest articol (dacă nu e publicat și nu ești admin/producător)
- `500` - Eroare server

---

### 3. POST /journal (Admin Only)

**Descriere:** Creează un articol nou.

**Autentificare:** Necesită rol `admin`.

**Body:**
```json
{
  "slug": "povestea-mierii-maramures",
  "title": "Povestea mierii din inima Maramureșului",
  "excerpt": "O scurtă descriere...",
  "content": "<p>Conținut HTML...</p>",
  "coverImageUrl": "https://...",
  "producerId": "clx456...",
  "status": "draft"
}
```

**Răspuns 201:**
```json
{
  "id": "clx123...",
  "slug": "povestea-mierii-maramures",
  // ... rest of fields
}
```

**Erori:**
- `400` - Date invalide
- `409` - Slug deja există
- `403` - Nu ai permisiune
- `500` - Eroare server

---

### 4. PATCH /journal/:id (Admin Only)

**Descriere:** Actualizează un articol existent.

**Autentificare:** Necesită rol `admin`.

**Body (toate câmpurile opționale):**
```json
{
  "title": "Noul titlu",
  "excerpt": "Nou excerpt",
  "content": "<p>Nou conținut...</p>",
  "coverImageUrl": "https://...",
  "status": "published",
  "publishedAt": "2025-01-20T10:00:00Z"
}
```

**Răspuns 200:**
```json
{
  "id": "clx123...",
  // ... updated fields
}
```

**Erori:**
- `400` - Date invalide
- `404` - Articolul nu a fost găsit
- `403` - Nu ai permisiune
- `500` - Eroare server

---

## 🔐 Logică de Acces

### Articole Publice

- `status === 'published'` → Accesibil pentru toți (fără autentificare)
- `status !== 'published'` → Necesită autentificare:
  - Admin → Acces complet
  - Producător asociat → Poate vedea propriile articole

### Validare Slug

- Slug-ul trebuie să fie unic
- Format: lowercase, cu cratime (ex: `povestea-mierii-maramures`)
- Validare: `/^[a-z0-9-]+$/`

---

## 🔗 Integrare cu Subscriptions/Promotions

### Notă Importantă

În prima fază, logica „cine are dreptul la jurnal” poate rămâne în frontend (prin verificarea planului de promovare).

**Mai târziu se poate adăuga:**
- Validare: producătorul X poate avea max N articole publicate/lună în funcție de plan
- Legătura directă cu un `PromotionSubscription` sau `PromotionTier`
- Endpoint: `GET /producers/:id/journal-articles` (pentru producătorul autentificat)

---

## 📝 Exemple Request/Response

### Exemplu 1: Listă articole publicate

**Request:**
```
GET /journal?limit=10&page=1
```

**Response:**
```json
{
  "data": [
    {
      "id": "clx123...",
      "slug": "povestea-mierii-maramures",
      "title": "Povestea mierii din inima Maramureșului",
      "excerpt": "În inima Maramureșului...",
      "coverImageUrl": "https://cdn.farme.ro/journal/cover-1.jpg",
      "producerId": "clx456...",
      "producerName": "Ferma Popescu",
      "producerSlug": "ferma-popescu",
      "status": "published",
      "publishedAt": "2025-01-15T10:00:00Z",
      "createdAt": "2025-01-10T10:00:00Z",
      "updatedAt": "2025-01-15T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### Exemplu 2: Articol individual

**Request:**
```
GET /journal/povestea-mierii-maramures
```

**Response:**
```json
{
  "id": "clx123...",
  "slug": "povestea-mierii-maramures",
  "title": "Povestea mierii din inima Maramureșului",
  "excerpt": "În inima Maramureșului, familia Popescu...",
  "content": "<h2>O tradiție de generații</h2><p>În inima Maramureșului...</p>",
  "coverImageUrl": "https://cdn.farme.ro/journal/cover-1.jpg",
  "producerId": "clx456...",
  "producerName": "Ferma Popescu",
  "producerSlug": "ferma-popescu",
  "status": "published",
  "publishedAt": "2025-01-15T10:00:00Z",
  "createdAt": "2025-01-10T10:00:00Z",
  "updatedAt": "2025-01-15T10:00:00Z"
}
```

---

### 5. GET /producers/me/journal (Producer Only)

**Descriere:** Returnează articolele asociate producătorului autentificat (toate status-urile).

**Autentificare:** Necesită rol `producer` și verificare că producătorul are plan de promovare valid.

**Query Parameters:**
- `status?: 'draft' | 'review' | 'approved' | 'published'` - Filtrare după status

**Răspuns 200:**
```json
{
  "data": [
    {
      "id": "clx123...",
      "slug": "povestea-mierii-maramures",
      "title": "Povestea mierii din inima Maramureșului",
      "status": "published",
      "publishedAt": "2025-01-15T10:00:00Z",
      "createdAt": "2025-01-10T10:00:00Z"
    }
  ]
}
```

**Erori:**
- `403` - Nu ai acces la Jurnal (plan gratuit sau lipsă plan de promovare)
- `401` - Neautentificat
- `500` - Eroare server

---

### 6. POST /producers/me/journal/request-article (Producer Only)

**Descriere:** Creează o cerere simplă pentru un articol nou.

**Autentificare:** Necesită rol `producer` și verificare că producătorul are plan de promovare valid.

**Body:**
```json
{
  "subject": "Idee articol despre procesul de producere",
  "idea": "Aș dori un articol despre cum producem brânzeturile...",
  "season": "spring" // opțional
}
```

**Răspuns 201:**
```json
{
  "id": "request-123...",
  "status": "pending",
  "message": "Cererea ta a fost înregistrată. Echipa Farmero va reveni cu detalii."
}
```

**Erori:**
- `403` - Nu ai acces la Jurnal
- `400` - Date invalide
- `500` - Eroare server

---

### 7. GET /admin/journal/articles (Admin Only)

**Descriere:** Listă toate articolele pentru management editorial.

**Autentificare:** Necesită rol `admin`.

**Query Parameters:**
- `page?: number`
- `limit?: number`
- `status?: string` - Filtrare după status
- `producerId?: string` - Filtrare după producător
- `search?: string` - Căutare după titlu/producător

**Răspuns 200:**
```json
{
  "data": [...],
  "meta": { "page": 1, "limit": 20, "total": 45, "totalPages": 3 }
}
```

---

### 8. GET /admin/journal/articles/:id (Admin Only)

**Descriere:** Returnează un articol cu toate detaliile pentru editare.

**Autentificare:** Necesită rol `admin`.

**Răspuns 200:**
```json
{
  "id": "clx123...",
  "slug": "povestea-mierii-maramures",
  "title": "...",
  "excerpt": "...",
  "content": "...",
  "coverImageUrl": "...",
  "producerId": "...",
  "producerName": "Ferma Popescu",
  "status": "review",
  "publishedAt": null,
  "createdAt": "...",
  "updatedAt": "...",
  "metrics": {
    "views": 150,
    "uniqueViews": 120,
    "clicksToProducer": 25,
    "clicksToProducts": 18
  },
  "revisions": [...]
}
```

---

### 9. POST /admin/journal/articles (Admin Only)

**Descriere:** Creează un articol nou.

**Autentificare:** Necesită rol `admin`.

**Body:**
```json
{
  "slug": "povestea-mierii-maramures",
  "title": "Povestea mierii din inima Maramureșului",
  "excerpt": "...",
  "content": "<p>...</p>",
  "coverImageUrl": "https://...",
  "producerId": "clx456...",
  "status": "draft"
}
```

**Răspuns 201:**
```json
{
  "id": "clx123...",
  // ... rest of fields
}
```

---

### 10. PATCH /admin/journal/articles/:id (Admin Only)

**Descriere:** Actualizează un articol existent.

**Autentificare:** Necesită rol `admin`.

**Body (toate câmpurile opționale):**
```json
{
  "title": "Noul titlu",
  "excerpt": "...",
  "content": "...",
  "coverImageUrl": "...",
  "status": "published",
  "publishedAt": "2025-01-20T10:00:00Z"
}
```

**Notă:** Când `status` trece la `published`:
- Setează automat `publishedAt` dacă nu e setat
- Generează slug dacă nu există
- Creează `JournalNotification` pentru producător

---

### 11. GET /admin/journal/articles/:id/revisions (Admin Only)

**Descriere:** Returnează istoricul reviziilor pentru un articol.

**Autentificare:** Necesită rol `admin`.

**Răspuns 200:**
```json
{
  "data": [
    {
      "id": "rev-1...",
      "version": 1,
      "status": "approved",
      "editorId": "admin-123",
      "notes": "Aprobat pentru publicare",
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ]
}
```

---

### 12. POST /admin/journal/articles/:id/revisions (Admin Only)

**Descriere:** Creează o nouă revizie pentru un articol.

**Autentificare:** Necesită rol `admin`.

**Body:**
```json
{
  "version": 2,
  "title": "Titlu actualizat",
  "excerpt": "...",
  "content": "...",
  "status": "sent_to_review",
  "notes": "Trimis pentru revizie finală"
}
```

---

### 13. POST /journal/:id/metrics/event (Public)

**Descriere:** Track metrici pentru un articol (views, clicks).

**Autentificare:** Nu este necesară.

**Body:**
```json
{
  "type": "view" | "click_producer" | "click_product",
  "sessionId": "uuid-session" // pentru unique views
}
```

**Răspuns 200:**
```json
{
  "success": true
}
```

**Notă:** Endpoint-ul este fire-and-forget, nu blochează UI-ul.

---

## ✅ Checklist Implementare

- [x] Creează modelele Prisma (`JournalArticle`, `JournalRevision`, `JournalArticleMetrics`, `JournalNotification`)
- [ ] Rulează migrarea
- [ ] Implementează `GET /journal` (public)
- [ ] Implementează `GET /journal/:slug` (public)
- [ ] Implementează `GET /producers/me/journal` (producer)
- [ ] Implementează `POST /producers/me/journal/request-article` (producer)
- [ ] Implementează `GET /admin/journal/articles` (admin)
- [ ] Implementează `GET /admin/journal/articles/:id` (admin)
- [ ] Implementează `POST /admin/journal/articles` (admin)
- [ ] Implementează `PATCH /admin/journal/articles/:id` (admin)
- [ ] Implementează `GET /admin/journal/articles/:id/revisions` (admin)
- [ ] Implementează `POST /admin/journal/articles/:id/revisions` (admin)
- [ ] Implementează `POST /journal/:id/metrics/event` (public)
- [ ] Adaugă validare slug
- [ ] Adaugă logică de acces (public vs. autentificat)
- [ ] Adaugă verificare plan de promovare pentru producători
- [ ] Implementează notificări la publicare
- [ ] Testează endpoint-urile
- [ ] Documentează în Swagger/OpenAPI (dacă aplicabil)

---

## 📚 Referințe

- [Frontend Implementation](../frontend/docs/JURNAL_FARMERO_IMPLEMENTATION.md)
- [Style Guide](../frontend/docs/JURNAL_FARME_RO_STYLE_GUIDE.md)

---

## 🧪 Testing

### Manual Testing Examples

#### 1. Get published articles (public)

```bash
curl -X GET "http://localhost:3001/journal?page=1&limit=10"
```

#### 2. Get article by slug (public)

```bash
curl -X GET "http://localhost:3001/journal/povestea-mierii-din-inima-maramuresului"
```

#### 3. Track metrics (public)

```bash
curl -X POST "http://localhost:3001/journal/{articleId}/metrics/event" \
  -H "Content-Type: application/json" \
  -d '{"type": "view", "sessionId": "session-123"}'
```

#### 4. Get producer's articles (requires auth)

```bash
curl -X GET "http://localhost:3001/producers/me/journal" \
  -H "Cookie: session={jwt_token}"
```

#### 5. Request article (producer, requires auth)

```bash
curl -X POST "http://localhost:3001/producers/me/journal/request-article" \
  -H "Content-Type: application/json" \
  -H "Cookie: session={jwt_token}" \
  -d '{
    "subject": "Povestea noastră despre apicultură",
    "idea": "Vrem să împărtășim cum producem mierea...",
    "season": "spring"
  }'
```

#### 6. Admin - List articles (requires ADMIN auth)

```bash
curl -X GET "http://localhost:3001/admin/journal/articles?status=published&page=1&limit=20" \
  -H "Cookie: session={admin_jwt_token}"
```

#### 7. Admin - Create article (requires ADMIN auth)

```bash
curl -X POST "http://localhost:3001/admin/journal/articles" \
  -H "Content-Type: application/json" \
  -H "Cookie: session={admin_jwt_token}" \
  -d '{
    "slug": "povestea-mierii-maramures",
    "title": "Povestea mierii din inima Maramureșului",
    "excerpt": "În inima Maramureșului...",
    "content": "<p>Conținut articol...</p>",
    "producerId": "{producer-uuid}",
    "status": "draft"
  }'
```

#### 8. Admin - Update article status (requires ADMIN auth)

```bash
curl -X PATCH "http://localhost:3001/admin/journal/articles/{articleId}" \
  -H "Content-Type: application/json" \
  -H "Cookie: session={admin_jwt_token}" \
  -d '{
    "status": "published"
  }'
```

### Integration Tests

Run the backend test suite:

```bash
npm run test:endpoints
```

---

**Ultima actualizare:** 2025-01-27

