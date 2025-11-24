# Journal Translations API - Documentație Completă

## Prezentare generală

API-ul pentru traduceri Journal oferă suport pentru articole multi-language (RO, EN, FR, IT, DE, ES, HU, UK). RO este limba "canonicală" (bază), iar celelalte limbi sunt traduceri opționale.

**Base Path:** 
- Public: `/journal`
- Admin: `/admin/journal/articles/:id/translations`

**Limbi suportate:** `ro`, `en`, `fr`, `it`, `de`, `es`, `hu`, `uk`

---

## Endpoint-uri Publice

### GET /journal?language=xx

Listează articole publicate cu suport pentru limba specificată.

**Query Parameters:**
- `language` (optional, default: `ro`): Limba pentru traduceri
- `page` (optional, default: 1): Număr pagină
- `limit` (optional, default: 20): Rezultate per pagină
- `producerId` (optional): Filtrare după producător

**Response:**
```json
{
  "data": {
    "data": [
      {
        "id": "uuid",
        "slug": "articol-exemplu",
        "title": "Titlu articol",
        "excerpt": "Rezumat articol",
        "coverImageUrl": "https://...",
        "producerId": "uuid",
        "producerName": "Nume Producător",
        "publishedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    },
    "language": "en",
    "languageFallback": "ro"
  },
  "error": null
}
```

**Note:** 
- Dacă `language !== 'ro'` și nu există traduceri, `languageFallback: 'ro'` indică că se folosește limba canonicală
- Frontend poate afișa un badge "Traducere indisponibilă" când `languageFallback` este prezent

---

### GET /journal/:slug?language=xx

Obține un articol după slug, cu suport pentru limba specificată.

**Query Parameters:**
- `language` (optional, default: `ro`): Limba pentru traducere

**Response (cu traducere):**
```json
{
  "data": {
    "id": "uuid",
    "title": "Titlu articol (RO)",
    "slug": "articol-exemplu",
    "excerpt": "Rezumat articol (RO)",
    "content": "Conținut articol (RO)",
    "language": "ro",
    "translation": {
      "id": "uuid",
      "articleId": "uuid",
      "language": "en",
      "title": "Article Title (EN)",
      "slug": "article-example",
      "excerpt": "Article excerpt (EN)",
      "content": "Article content (EN)",
      "metaTitle": "Article Meta Title",
      "metaDescription": "Article meta description",
      "translationStatus": "published",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    },
    "fallback": false
  },
  "error": null
}
```

**Response (fără traducere, fallback la RO):**
```json
{
  "data": {
    "id": "uuid",
    "title": "Titlu articol",
    "slug": "articol-exemplu",
    "excerpt": "Rezumat articol",
    "content": "Conținut articol",
    "language": "ro",
    "fallback": true,
    "languageFallback": "ro"
  },
  "error": null
}
```

**Status Codes:**
- `200 OK` - Succes
- `400 BAD_REQUEST` - Limba nu este suportată
- `404 NOT_FOUND` - Articol negăsit

**Note:**
- Dacă se cere o limbă diferită de RO și nu există traducere, se returnează articolul canonical (RO) cu `fallback: true`
- Frontend poate afișa un badge "Traducere indisponibilă" când `fallback: true`

---

## Endpoint-uri Admin

### GET /admin/journal/articles/:id/translations

Listează toate traducerile pentru un articol.

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "articleId": "uuid",
      "language": "en",
      "title": "Article Title",
      "slug": "article-slug",
      "excerpt": "Article excerpt",
      "content": "Article content",
      "metaTitle": "Meta title",
      "metaDescription": "Meta description",
      "translationStatus": "published",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "error": null
}
```

**Status Codes:**
- `200 OK` - Succes
- `404 NOT_FOUND` - Articol negăsit

---

### GET /admin/journal/articles/:id/translations/:language

Obține o traducere specifică pentru un articol.

**Path Parameters:**
- `id`: UUID al articolului
- `language`: Limba traducerii (`en`, `fr`, `it`, `de`, `es`, `hu`, `uk`)

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "articleId": "uuid",
    "language": "en",
    "title": "Article Title",
    "slug": "article-slug",
    "excerpt": "Article excerpt",
    "content": "Article content",
    "metaTitle": "Meta title",
    "metaDescription": "Meta description",
    "translationStatus": "published",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "error": null
}
```

**Status Codes:**
- `200 OK` - Succes
- `400 BAD_REQUEST` - Limba nu este suportată
- `404 NOT_FOUND` - Articol sau traducere negăsită

---

### PUT /admin/journal/articles/:id/translations/:language

Creează sau actualizează o traducere.

**Path Parameters:**
- `id`: UUID al articolului
- `language`: Limba traducerii (`en`, `fr`, `it`, `de`, `es`, `hu`, `uk`)

**Request Body:**
```json
{
  "title": "Article Title",
  "slug": "article-slug",
  "excerpt": "Article excerpt",
  "content": "Article content",
  "metaTitle": "Meta title",
  "metaDescription": "Meta description",
  "translationStatus": "published"
}
```

**Câmpuri:**
- `title` (optional): Titlul traducerii
- `slug` (optional): Slug-ul traducerii (generat automat din title dacă nu este furnizat)
- `excerpt` (optional): Rezumatul traducerii
- `content` (optional): Conținutul traducerii
- `metaTitle` (optional): Meta title pentru SEO
- `metaDescription` (optional): Meta description pentru SEO
- `translationStatus` (optional): Status (`draft`, `needs-review`, `published`)

**Note:** Cel puțin unul dintre `title`, `content`, sau `slug` trebuie să fie furnizat.

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "articleId": "uuid",
    "language": "en",
    "title": "Article Title",
    "slug": "article-slug",
    "excerpt": "Article excerpt",
    "content": "Article content",
    "metaTitle": "Meta title",
    "metaDescription": "Meta description",
    "translationStatus": "published",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "error": null
}
```

**Status Codes:**
- `200 OK` - Traducere creată/actualizată cu succes
- `400 BAD_REQUEST` - Date invalide sau limba nu este suportată
- `404 NOT_FOUND` - Articol negăsit

---

### DELETE /admin/journal/articles/:id/translations/:language

Șterge o traducere (soft delete by default).

**Path Parameters:**
- `id`: UUID al articolului
- `language`: Limba traducerii

**Query Parameters:**
- `hardDelete` (optional, default: `false`): Dacă `true`, șterge definitiv; dacă `false`, setează status la `draft`

**Response:**
```json
{
  "data": {
    "success": true
  },
  "error": null
}
```

**Status Codes:**
- `200 OK` - Traducere ștearsă cu succes
- `400 BAD_REQUEST` - Limba nu este suportată
- `404 NOT_FOUND` - Articol negăsit

---

## Tipuri de date

### TranslationStatus
- `draft` - Traducere în lucru
- `needs-review` - Necesită revizuire
- `published` - Publicată

### SupportedLanguage
- `ro` - Română (canonical)
- `en` - English
- `fr` - Français
- `it` - Italiano
- `de` - Deutsch
- `es` - Español
- `hu` - Magyar
- `uk` - Українська

---

## Workflow & Logic

### Fallback Logic

1. **Public API:**
   - Dacă `language === 'ro'` → returnează articolul canonical
   - Dacă `language !== 'ro'` și există traducere → returnează traducerea + canonical
   - Dacă `language !== 'ro'` și nu există traducere → returnează canonical cu `fallback: true`

2. **Slug Resolution:**
   - Dacă slug-ul este găsit în traduceri → returnează traducerea
   - Dacă slug-ul este găsit în articole canonical → returnează canonical
   - Dacă slug-ul nu este găsit → 404

### Slug Uniqueness

- Slug-urile traducerilor trebuie să fie unice global (nu doar per articol)
- Constraint: `@@unique([slug])` în Prisma
- Service-ul generează automat slug-uri unice prin adăugare de număr

### Translation Status

- `draft`: Traducere în lucru, nu este afișată public
- `needs-review`: Traducere necesită revizuire
- `published`: Traducere publicată și afișată

---

## Exemple de utilizare

### Obținere articol în engleză
```bash
curl "https://api.farme.ro/journal/articol-exemplu?language=en"
```

### Creare traducere (admin)
```bash
curl -X PUT "https://api.farme.ro/admin/journal/articles/uuid/translations/en" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Article Title",
    "content": "Article content",
    "translationStatus": "published"
  }'
```

### Listare traduceri (admin)
```bash
curl "https://api.farme.ro/admin/journal/articles/uuid/translations" \
  -H "Authorization: Bearer <token>"
```

---

## Note importante

1. **RO este limba canonicală:** Articolele sunt create întotdeauna în RO. Traducerile sunt opționale.

2. **Slug-uri unice:** Slug-urile traducerilor trebuie să fie unice global, nu doar per articol.

3. **Fallback:** Frontend-ul trebuie să gestioneze cazul când `fallback: true` și să afișeze un mesaj corespunzător.

4. **SEO:** Meta title și meta description per traducere permit SEO optimizat per limbă.

5. **Status:** Doar traducerile cu `translationStatus: 'published'` ar trebui să fie afișate public (dacă se implementează acest filtru în viitor).

---

## Migrare DB

Modelul `JournalArticleTranslation` există deja în schema Prisma. Pentru a aplica migrarea:

```bash
npx prisma migrate dev --name add_journal_translations
```

Sau pentru producție:

```bash
npx prisma migrate deploy
```

---

## Integrare Frontend

Frontend-ul trebuie să:
1. Detecteze limba activă (cookie, localStorage, etc.)
2. Trimite parametrul `language` în request-uri
3. Gestioneze `fallback: true` afișând badge "Traducere indisponibilă"
4. Folosească `translation.title`, `translation.content` când este disponibil
5. Folosească `canonical.title`, `canonical.content` când `fallback: true`
