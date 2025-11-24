# Journal de farme.ro - Manual Testing Checklist

**Data:** 2025-01-27  
**Scop:** Verificare manuală a endpoint-urilor Journal înainte de activare feature flag

---

## 📋 Precondiții

- [ ] Backend-ul rulează (`npm run dev` în `backend/`)
- [ ] Baza de date este conectată și migrațiile sunt aplicate
- [ ] Există cel puțin un utilizator ADMIN în baza de date
- [ ] Există cel puțin un utilizator PRODUCER cu profil Producer în baza de date
- [ ] Producătorul are status `APPROVED` și are promovări active (pentru testare acces)

---

## 🔍 Teste Public Endpoints

### 1. GET /journal

**Test:**
```bash
curl -X GET "http://localhost:3001/journal?page=1&limit=10"
```

**Verificări:**
- [ ] Răspuns 200 OK
- [ ] Body conține `{ data: [], meta: { page, limit, total, totalPages } }`
- [ ] Dacă există articole publicate, acestea apar în `data`
- [ ] Doar articole cu `status = 'published'` apar în listă

**Cazuri speciale:**
- [ ] `?producerId=<id>` filtrează corect după producător
- [ ] `?page=2` funcționează pentru paginare
- [ ] `?limit=50` respectă limita maximă

---

### 2. GET /journal/:slug

**Test cu slug existent:**
```bash
curl -X GET "http://localhost:3001/journal/povestea-mierii-din-inima-maramuresului"
```

**Verificări:**
- [ ] Răspuns 200 OK
- [ ] Body conține articol complet cu:
  - `id`, `slug`, `title`, `excerpt`, `content`
  - `producerId`, `producerName`, `producerSlug`
  - `status: 'published'`
  - `publishedAt` (nu null)
  - `createdAt`, `updatedAt`

**Test cu slug inexistent:**
```bash
curl -X GET "http://localhost:3001/journal/slug-inexistent-12345"
```

**Verificări:**
- [ ] Răspuns 404 Not Found
- [ ] Body conține mesaj de eroare clar

**Test cu articol nepublicat:**
- [ ] Creează un articol cu `status = 'draft'` în DB
- [ ] Încearcă să-l accesezi prin slug
- [ ] Verifică că răspunsul este 404 (nu expune articole nepublicate)

---

### 3. POST /journal/:id/metrics/event

**Test view event:**
```bash
curl -X POST "http://localhost:3001/journal/<article-id>/metrics/event" \
  -H "Content-Type: application/json" \
  -d '{"type": "view", "sessionId": "test-session-123"}'
```

**Verificări:**
- [ ] Răspuns 200 OK sau 201 Created
- [ ] Metrics counter `views` se incrementează în DB
- [ ] Dacă `sessionId` este nou, `uniqueViews` se incrementează

**Test cu ID inexistent:**
```bash
curl -X POST "http://localhost:3001/journal/non-existent-id/metrics/event" \
  -H "Content-Type: application/json" \
  -d '{"type": "view"}'
```

**Verificări:**
- [ ] Răspuns 404 Not Found
- [ ] Nu crapă server-ul (error handling corect)

**Test click_producer:**
```bash
curl -X POST "http://localhost:3001/journal/<article-id>/metrics/event" \
  -H "Content-Type: application/json" \
  -d '{"type": "click_producer", "sessionId": "test-session-123"}'
```

**Verificări:**
- [ ] Counter `clicksToProducer` se incrementează

**Test click_product:**
```bash
curl -X POST "http://localhost:3001/journal/<article-id>/metrics/event" \
  -H "Content-Type: application/json" \
  -d '{"type": "click_product", "sessionId": "test-session-123"}'
```

**Verificări:**
- [ ] Counter `clicksToProducts` se incrementează

---

## 🔐 Teste Producer Endpoints

**Notă:** Aceste endpoint-uri necesită autentificare cu rol PRODUCER.

### 4. GET /producers/me/journal

**Test cu producător cu acces:**
```bash
# Obține token JWT pentru producător (login)
curl -X POST "http://localhost:3001/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "producer@farme.ro", "password": "password"}'

# Folosește token-ul în header
curl -X GET "http://localhost:3001/producers/me/journal" \
  -H "Authorization: Bearer <token>"
```

**Verificări:**
- [ ] Răspuns 200 OK
- [ ] Body conține lista articolelor producătorului (toate status-urile)
- [ ] Include articole cu `status: 'draft'`, `'review'`, `'approved'`, `'published'`

**Test cu producător fără acces (plan gratuit):**
- [ ] Creează un producător fără promovări active
- [ ] Încearcă să accesezi endpoint-ul
- [ ] Verifică că răspunsul este 403 Forbidden
- [ ] Mesajul de eroare este clar: "Planul tău actual nu include Jurnal de farme.ro"

**Test fără autentificare:**
```bash
curl -X GET "http://localhost:3001/producers/me/journal"
```

**Verificări:**
- [ ] Răspuns 401 Unauthorized

---

### 5. POST /producers/me/journal/request-article

**Test creare cerere:**
```bash
curl -X POST "http://localhost:3001/producers/me/journal/request-article" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Idee articol despre procesul de producere",
    "idea": "Aș dori un articol despre cum producem brânzeturile...",
    "season": "spring"
  }'
```

**Verificări:**
- [ ] Răspuns 201 Created
- [ ] Body conține articol creat cu:
  - `status: 'draft'` sau `'review'` (conform spec)
  - `producerId` corect (din token)
  - Slug generat automat
- [ ] Articolul apare în DB
- [ ] O revizie inițială este creată (dacă spec-ul cere asta)

**Test cu producător fără acces:**
- [ ] Verifică că răspunsul este 403 Forbidden

**Test cu date invalide:**
```bash
curl -X POST "http://localhost:3001/producers/me/journal/request-article" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"subject": ""}'
```

**Verificări:**
- [ ] Răspuns 400 Bad Request
- [ ] Body conține detalii despre erorile de validare

---

## 👨‍💼 Teste Admin Endpoints

**Notă:** Aceste endpoint-uri necesită autentificare cu rol ADMIN.

### 6. GET /admin/journal/articles

**Test:**
```bash
curl -X GET "http://localhost:3001/admin/journal/articles?page=1&limit=20" \
  -H "Authorization: Bearer <admin-token>"
```

**Verificări:**
- [ ] Răspuns 200 OK
- [ ] Body conține `{ data: [], meta: {...} }`
- [ ] Include toate articolele (toate status-urile)

**Test cu filtre:**
```bash
# Filtru după status
curl -X GET "http://localhost:3001/admin/journal/articles?status=draft" \
  -H "Authorization: Bearer <admin-token>"

# Filtru după producător
curl -X GET "http://localhost:3001/admin/journal/articles?producerId=<id>" \
  -H "Authorization: Bearer <admin-token>"

# Căutare
curl -X GET "http://localhost:3001/admin/journal/articles?search=mier" \
  -H "Authorization: Bearer <admin-token>"
```

**Verificări:**
- [ ] Filtrele funcționează corect
- [ ] Căutarea funcționează (titlu sau producător)

**Test fără autentificare:**
- [ ] Răspuns 401 Unauthorized

**Test cu rol non-admin:**
- [ ] Răspuns 403 Forbidden

---

### 7. GET /admin/journal/articles/:id

**Test:**
```bash
curl -X GET "http://localhost:3001/admin/journal/articles/<article-id>" \
  -H "Authorization: Bearer <admin-token>"
```

**Verificări:**
- [ ] Răspuns 200 OK
- [ ] Body conține articol complet cu:
  - Toate câmpurile (inclusiv `content`)
  - Metrici (dacă există)
  - Revizii (dacă există)

**Test cu ID inexistent:**
- [ ] Răspuns 404 Not Found

---

### 8. POST /admin/journal/articles

**Test creare articol:**
```bash
curl -X POST "http://localhost:3001/admin/journal/articles" \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Article",
    "excerpt": "Test excerpt",
    "content": "<p>Test content</p>",
    "producerId": "<producer-id>",
    "status": "draft"
  }'
```

**Verificări:**
- [ ] Răspuns 201 Created
- [ ] Slug este generat automat
- [ ] Slug este unic (dacă există deja, se adaugă număr)
- [ ] Articolul apare în DB
- [ ] Record metrics este creat automat

---

### 9. PATCH /admin/journal/articles/:id

**Test update status:**
```bash
curl -X PATCH "http://localhost:3001/admin/journal/articles/<article-id>" \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "review"}'
```

**Verificări:**
- [ ] Răspuns 200 OK
- [ ] Status-ul este actualizat în DB
- [ ] `updatedAt` este actualizat
- [ ] `updatedById` este setat la admin-ul curent

**Test publicare (status = 'published'):**
```bash
curl -X PATCH "http://localhost:3001/admin/journal/articles/<article-id>" \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "published"}'
```

**Verificări:**
- [ ] `publishedAt` este setat automat (dacă nu era setat)
- [ ] O notificare `JournalNotification` este creată pentru producător

**Test update conținut:**
```bash
curl -X PATCH "http://localhost:3001/admin/journal/articles/<article-id>" \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "New Title", "excerpt": "New excerpt"}'
```

**Verificări:**
- [ ] Câmpurile sunt actualizate corect

---

### 10. POST /admin/journal/articles/:id/revisions

**Test creare revizie:**
```bash
curl -X POST "http://localhost:3001/admin/journal/articles/<article-id>/revisions" \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Revised Title",
    "excerpt": "Revised excerpt",
    "content": "<p>Revised content</p>",
    "status": "sent_to_review",
    "notes": "Please review this revision"
  }'
```

**Verificări:**
- [ ] Răspuns 201 Created
- [ ] Revizia este creată în DB
- [ ] `version` este incrementat automat
- [ ] `editorId` este setat la admin-ul curent

---

## ✅ Checklist Final

- [ ] Toate endpoint-urile publice răspund corect
- [ ] Toate endpoint-urile producer necesită autentificare
- [ ] Toate endpoint-urile admin necesită autentificare + rol ADMIN
- [ ] Error handling este corect (404, 401, 403, 400)
- [ ] Validarea input-urilor funcționează (Zod schemas)
- [ ] Slug-urile sunt unice
- [ ] Metrics tracking funcționează
- [ ] Notificările sunt create la publicare
- [ ] Workflow-ul editorial funcționează (draft → review → approved → published)

---

## 🚨 Probleme Identificate

Listează aici orice probleme găsite în timpul testării:

1. 
2. 
3. 

---

## 📝 Note

- Testează cu date reale din baza de date
- Verifică logs-urile backend pentru erori
- Testează edge cases (date invalide, ID-uri inexistente, etc.)

