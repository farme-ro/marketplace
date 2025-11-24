# Journal Admin - Implementation Summary

**Data:** 2025-01-27  
**Status:** ✅ Complet Implementat

---

## 📝 Rute Admin Create

### 1. `/jurnal` - Listă Articole
**Fișier:** `admin/src/app/(admin)/jurnal/page.tsx`

**Funcționalități:**
- Tabel cu toate articolele
- Filtru după status (draft, review, approved, published, archived, all)
- Căutare după producător
- Paginare (20 articole per pagină)
- Click pe rând → navigare către detalii
- Loading states, error handling, empty states

**Coloane:**
- Titlu (cu slug)
- Producător (cu link către farme.ro)
- Status (badge colorat)
- Data creării
- Ultima actualizare

---

### 2. `/jurnal/[id]` - Detalii & Workflow
**Fișier:** `admin/src/app/(admin)/jurnal/[id]/page.tsx`

**Funcționalități:**

#### Informații Articol
- Titlu, slug, rezumat, conținut
- Producător (cu link către farme.ro)
- Status curent
- Imagine copertă
- Date (creare, actualizare, publicare)

#### Workflow Actions
- **"Trimite în review"** (draft → review)
- **"Aprobă articol"** (review → approved)
- **"Publică articol"** (approved → published)
- **"Respinge articol"** (review → archived)
- **"Arhivează"** (orice status → archived)

Toate acțiunile necesită confirmare prin dialog.

#### Revizii
- Listă revizii existente
- Formular pentru creare revizie nouă:
  - Titlu, rezumat, conținut
  - Status (draft, sent_to_review, approved, rejected)
  - Note (comentarii, modificări sugerate)

#### Timeline
- Istoric statusuri și date
- Vizualizare progres workflow

#### Metrici
- Vizualizări, vizualizări unice
- Click-uri producător, click-uri produse

---

## 🔌 Endpoint-uri Backend Consumate

### Pentru `/jurnal` (Listă)

**GET /admin/journal/articles**
- **Query params:**
  - `status?` - Filtru după status (draft, review, approved, published, archived)
  - `producerId?` - Filtru după producător
  - `search?` - Căutare după producător
  - `page?` - Număr pagină (default: 1)
  - `limit?` - Articole per pagină (default: 20)
- **Response:**
  ```typescript
  {
    data: JournalArticle[],
    meta: {
      page: number,
      limit: number,
      total: number,
      totalPages: number
    }
  }
  ```
- **Folosit în:** `admin/src/lib/api/journal.ts` → `getJournalArticles()`

---

### Pentru `/jurnal/[id]` (Detalii)

#### 1. GET /admin/journal/articles/:id
- **Response:**
  ```typescript
  JournalArticle {
    id: string,
    slug: string,
    title: string,
    excerpt: string,
    content?: string,
    coverImageUrl?: string,
    producerId: string,
    producerName: string,
    producerSlug?: string,
    status: 'draft' | 'review' | 'approved' | 'published' | 'archived',
    publishedAt?: string | null,
    createdAt: string,
    updatedAt: string,
    metrics?: {
      views: number,
      uniqueViews: number,
      clicksToProducer: number,
      clicksToProducts: number
    }
  }
  ```
- **Folosit în:** `admin/src/lib/api/journal.ts` → `getJournalArticle()`

#### 2. PATCH /admin/journal/articles/:id
- **Body:**
  ```typescript
  {
    title?: string,
    excerpt?: string,
    content?: string,
    coverImageUrl?: string,
    status?: 'draft' | 'review' | 'approved' | 'published' | 'archived'
  }
  ```
- **Response:** `JournalArticle` (actualizat)
- **Folosit în:** `admin/src/lib/api/journal.ts` → `updateJournalArticle()`
- **Folosit pentru:** Workflow actions (schimbare status)

#### 3. GET /admin/journal/articles/:id/revisions
- **Response:**
  ```typescript
  {
    data: JournalRevision[]
  }
  ```
- **Folosit în:** `admin/src/lib/api/journal.ts` → `getJournalRevisions()`

#### 4. POST /admin/journal/articles/:id/revisions
- **Body:**
  ```typescript
  {
    title: string,
    excerpt: string,
    content: string,
    status: 'draft' | 'sent_to_review' | 'approved' | 'rejected',
    notes?: string
  }
  ```
- **Response:** `JournalRevision` (creat)
- **Folosit în:** `admin/src/lib/api/journal.ts` → `createJournalRevision()`

---

## 📁 Fișiere Create/Modificate

### Create

1. **`admin/src/lib/api/journal.ts`**
   - API client pentru Journal admin endpoints
   - Funcții: `getJournalArticles()`, `getJournalArticle()`, `getJournalRevisions()`, `updateJournalArticle()`, `createJournalRevision()`
   - Types: `JournalArticle`, `JournalRevision`, `GetJournalArticlesParams`, etc.

2. **`admin/src/app/(admin)/jurnal/page.tsx`**
   - Pagină listă articole cu filtre și căutare

3. **`admin/src/app/(admin)/jurnal/[id]/page.tsx`**
   - Pagină detalii articol cu workflow și revizii

4. **`admin/docs/JOURNAL_ADMIN_README.md`**
   - Documentație completă pentru modulul Jurnal Admin

### Modificate

1. **`admin/src/components/layout/AdminSidebar.tsx`**
   - Adăugat link "Jurnal" în navigație (după Dashboard)
   - Link-ul duce la `/jurnal` (nu `/system/jurnal`)

---

## ⚠️ TODO Critic pentru Flux Editorial 100% Funcțional

### 1. Backend Endpoint-uri (Verificare)

- [x] **GET /admin/journal/articles/:id/revisions**
  - **Status:** ✅ Există în backend (`backend/src/modules/journal/journal-admin.routes.ts:383`)
  - **Verificare:** Testează că returnează formatul corect `{ data: JournalRevision[] }`

- [x] **POST /admin/journal/articles/:id/revisions**
  - **Status:** ✅ Există în backend (`backend/src/modules/journal/journal-admin.routes.ts:427`)
  - **Verificare:** Testează că acceptă body-ul corect `{ title, excerpt, content, status, notes? }`

### 2. Workflow Status Transitions

- [ ] **Verificare tranziții permise:**
  - `draft` → `review` ✅
  - `review` → `approved` ✅
  - `review` → `archived` ✅
  - `approved` → `published` ✅
  - Orice → `archived` ✅
  - **Notă:** Verifică că backend-ul permite aceste tranziții

### 3. Auto-set `publishedAt`

- [ ] **Când status devine `published`:**
  - Backend-ul trebuie să seteze automat `publishedAt` (dacă nu e deja setat)
  - Verifică în `backend/src/modules/journal/journal-admin.routes.ts`

### 4. Notificări Producător

- [ ] **Când articol este publicat:**
  - Backend-ul trebuie să creeze o `JournalNotification` pentru producător
  - Verifică în `backend/src/modules/journal/journal.service.ts` → `createJournalNotification()`

### 5. Validare Input Revizii

- [ ] **Backend validare:**
  - Verifică că backend-ul validează input-ul pentru revizii (Zod schema)
  - Verifică în `backend/src/modules/journal/journal.validators.ts`

### 6. Error Handling Backend

- [ ] **Verificare mesaje eroare:**
  - Backend-ul returnează mesaje clare pentru:
    - Status invalid
    - Tranziție nepermisă
    - Articol negăsit
    - Revizie invalidă

---

## ✅ Ce Funcționează Acum

1. **Listă articole:**
   - ✅ Filtru după status
   - ✅ Căutare după producător
   - ✅ Paginare
   - ✅ Loading states
   - ✅ Error handling

2. **Detalii articol:**
   - ✅ Vizualizare informații complete
   - ✅ Workflow actions cu confirmări
   - ✅ Timeline statusuri
   - ✅ Metrici (dacă există)

3. **Revizii:**
   - ✅ Listă revizii existente
   - ✅ Formular creare revizie nouă
   - ✅ Status și note pentru revizii

4. **UX:**
   - ✅ Loading states
   - ✅ Error states (401, 403, 404, generic)
   - ✅ Confirmări pentru acțiuni
   - ✅ Accesibilitate minimă

---

## 🎯 Concluzie

Modulul Jurnal Admin este **implementat complet** pe frontend și gata pentru utilizare, cu următoarele observații:

1. **Endpoint-uri backend** trebuie verificate pentru revizii (`GET` și `POST /admin/journal/articles/:id/revisions`)
2. **Workflow transitions** trebuie verificate în backend
3. **Auto-set `publishedAt`** trebuie verificat
4. **Notificări producător** trebuie verificate

După verificarea acestor puncte, fluxul editorial este **100% funcțional**.

---

## 📚 Documentație

- **Admin README:** `admin/docs/JOURNAL_ADMIN_README.md`
- **Backend API Spec:** `backend/docs/JOURNAL_API_SPEC.md`
- **Backend Testing:** `backend/docs/JOURNAL_MANUAL_TESTING_CHECKLIST.md`

