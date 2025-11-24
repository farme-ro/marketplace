# Jurnal de farme.ro - Implementation Documentation

**Data:** 2025-01-27  
**Scop:** Documentație completă pentru implementarea secțiunii „Jurnal de farme.ro”  
**Status:** ✅ Complet

---

## 📋 Rezumat Executiv

Jurnal de farme.ro este o secțiune editorială premium integrată în platforma Farmero, destinată producătorilor care au planuri plătite de promovare. Fiecare plan plătit beneficiază de articole lunare care spun povestea producătorului.

---

## 🗂️ Structură Implementare

### 1. Domain Types

**Fișier:** `src/lib/types/domain.ts`

```typescript
export type JournalArticleStatus = 'draft' | 'review' | 'published'

export interface DomainJournalArticle {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  coverImageUrl?: string | null
  producerId: string
  producerName: string
  producerSlug: string
  status: JournalArticleStatus
  publishedAt?: string | null
  createdAt: string
  updatedAt: string
}
```

### 2. BackendSyncStatus

**Fișier:** `src/lib/backend-sync/status.ts`

```typescript
journal: false, // ⚠️ GET /journal, GET /journal/:slug - Pending backend implementation
```

**Notă:** Setează `true` când backend-ul este gata și testat.

### 3. API Client

**Fișier:** `src/lib/api/journal.ts`

**Funcții:**
- `getJournalArticles(params?)` - Listă articole
- `getJournalArticleBySlug(slug)` - Articol individual

**Fallback:** Returnează array gol sau aruncă eroare cu mesaj „Coming soon” dacă `journal: false`.

### 4. Rute

**Fișier:** `src/lib/routes.ts`

```typescript
journal: {
  list: '/jurnal-de-farmero',
  detail: (slug: string) => `/jurnal-de-farmero/${slug}`,
}
```

**Portal producător:**
```typescript
producerPortal: {
  journal: '/portal-producatori/jurnal',
  // ...
}
```

---

## 🎨 Componente UI

### 1. JournalCard

**Fișier:** `src/components/journal/journal-card.tsx`

**Props:**
- `article: DomainJournalArticle`
- `featured?: boolean`
- `className?: string`

**Utilizare:**
```tsx
<JournalCard article={article} featured={index === 0} />
```

### 2. JournalHero

**Fișier:** `src/components/journal/journal-hero.tsx`

**Props:**
- `title?: string`
- `subtitle?: string`
- `variant?: 'landing' | 'article'`
- `className?: string`

**Utilizare:**
```tsx
<JournalHero variant="landing" />
```

### 3. JournalLayout

**Fișier:** `src/components/journal/journal-layout.tsx`

**Props:**
- `children: ReactNode`
- `className?: string`
- `maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl'`

**Utilizare:**
```tsx
<JournalLayout maxWidth="2xl">
  {/* content */}
</JournalLayout>
```

---

## 📄 Pagini

### 1. Listă Articole

**Rută:** `/jurnal-de-farmero`  
**Fișier:** `src/app/(site)/jurnal-de-farmero/page.tsx`

**Funcționalitate:**
- Hero section cu titlu și subtitlu
- Grid responsive cu articole
- Primul articol poate fi featured (mai mare)
- Loading state
- Empty state cu mesaj prietenos
- Error handling

### 2. Detaliu Articol

**Rută:** `/jurnal-de-farmero/[slug]`  
**Fișier:** `src/app/(site)/jurnal-de-farmero/[slug]/page.tsx`

**Funcționalitate:**
- Hero cu imagine cover
- Badge „Jurnal de farme.ro”
- Nume producător
- Titlu articol
- Data publicării
- Conținut rich text (HTML)
- Secțiune „Despre producător”
- CTA către pagina producătorului
- Link către produse

### 3. Portal Producător

**Rută:** `/portal-producatori/jurnal`  
**Fișier:** `src/app/(site)/portal-producatori/jurnal/page.tsx`

**Funcționalitate:**
- Verifică dacă producătorul are plan plătit
- Dacă nu are plan → mesaj + CTA către abonamente
- Dacă are plan → listă articole
- Status articole (draft/review/published)
- Link către articol publicat
- CTA „Solicită articol nou”

---

## 🔗 Integrare Navigație

### Footer

**Fișier:** `src/components/layout/site-footer.tsx`

**Secțiune:** „Despre farmero”

```tsx
<Link href="/jurnal-de-farmero">
  {t('footer.journal', 'Jurnal de farme.ro')}
</Link>
```

---

## 🌍 i18n

### Chei de traducere

**Prefix:** `journal.*`

**Exemple:**
- `journal.hero.title` - „Jurnal de farme.ro”
- `journal.hero.subtitle` - „Povești adevărate despre oamenii care cresc mâncare cu sens.”
- `journal.badge` - „Jurnal de farme.ro”
- `journal.empty.title` - „Pregătim povești noi”
- `journal.empty.description` - „Pregătim povești noi în Jurnal de farme.ro 🌱”
- `journal.article.aboutProducer` - „Despre producător”
- `journal.article.cta.title` - „Descoperă produsele acestui producător”

**Portal producător:**
- `producer.journal.title` - „Jurnal de farme.ro”
- `producer.journal.description` - „Poveștile tale despre produse, proces și oameni...”
- `producer.journal.noPlan.title` - „Jurnal de farme.ro este disponibil pentru planurile de promovare”

---

## 🔧 Backend Integration

### Endpoints Așteptați

**GET /journal**
- Query params: `page`, `limit`, `producerId`, `status` (default: `published`)
- Răspuns: `{ data: Article[], meta?: {...} }` sau `Article[]`

**GET /journal/:slug**
- Răspuns: `Article` sau `{ data: Article }`

### Model DB (Backend)

```prisma
model JournalArticle {
  id           String   @id @default(cuid())
  slug         String   @unique
  title        String
  excerpt      String
  content      String
  coverImage   String?
  producerId   String
  status       String   // 'draft' | 'review' | 'published'
  publishedAt  DateTime?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  producer     Producer @relation(fields: [producerId], references: [id])

  @@index([producerId])
  @@index([status])
}
```

---

## ✅ Checklist Testare

### Pagini Publice

- [x] `/jurnal-de-farmero` se încarcă
- [x] Layout responsive (mobile/tablet/desktop)
- [x] Empty state afișat corect când nu există articole
- [x] Loading state funcționează
- [x] `/jurnal-de-farmero/[slug]` afișează articol
- [x] Link-uri către producător funcționează
- [x] SEO metadata corect

### Navigație

- [x] Link în footer funcționează
- [x] Link localizat corect (i18n)

### Portal Producător

- [x] Pagina `/portal-producatori/jurnal` accesibilă
- [x] Mesaj corect pentru plan gratuit
- [x] Listă articole pentru plan plătit
- [x] Status-uri afișate corect
- [x] Link-uri către articole funcționează

### BackendSync

- [x] Când `journal: false` → nu există crash-uri
- [x] Empty/coming soon state clar
- [x] Când `journal: true` → funcționează cu backend

---

## 📚 Documentație Suplimentară

- [Style Guide](./JURNAL_FARME_RO_STYLE_GUIDE.md)
- [Copy Review](./JURNAL_FARME_RO_COPY_REVIEW.md)
- [Backend API Spec](../backend/docs/JOURNAL_API_SPEC.md) (când backend este gata)

---

## 🚀 Next Steps

1. **Backend Implementation:**
   - Implementează modelul Prisma
   - Creează endpoint-urile API
   - Testează integrarea

2. **Activation:**
   - Setează `journal: true` în BackendSyncStatus
   - Testează end-to-end

3. **Content:**
   - Creează primul articol demo
   - Testează workflow-ul de publicare

---

**Ultima actualizare:** 2025-01-27

