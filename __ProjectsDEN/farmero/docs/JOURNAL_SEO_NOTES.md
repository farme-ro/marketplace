# Journal SEO & Discovery - Implementation Notes

**Data:** 2025-01-27  
**Scop:** Documentație pentru optimizările SEO pentru Jurnal de farme.ro

---

## 📝 Ce Am Optimizat

### 1. Metadata & OG Tags

#### Pagină Listă (`/jurnal-de-farmero`)

**Fișier:** `frontend/src/app/(site)/jurnal-de-farmero/layout.tsx`

**Metadata generat:**
- **Title:** "Jurnal de farme.ro – Povești și producători locali"
- **Description:** Rezumat friendly despre jurnal
- **OpenGraph:**
  - `title`, `description`
  - `type: 'website'`
  - `url`: URL complet
  - `images`: Imagine generică pentru jurnal (`/images/jurnal-farmero-og.png`)
- **Twitter Card:**
  - `card: 'summary_large_image'`
  - `title`, `description`, `images`

**Notă:** Pagina este `'use client'`, dar metadata este generat în `layout.tsx` (server component).

---

#### Pagină Articol (`/jurnal-de-farmero/[slug]`)

**Fișier:** `frontend/src/app/(site)/jurnal-de-farmero/[slug]/layout.tsx`

**Metadata generat dinamic:**
- **Title:** `{article.title} – Jurnal de farme.ro`
- **Description:** `article.excerpt` sau `article.title`
- **OpenGraph:**
  - `type: 'article'`
  - `url`: URL complet al articolului
  - `images`: Imaginea articolului (sau fallback)
  - `publishedTime`: `article.publishedAt`
  - `modifiedTime`: `article.updatedAt`
  - `authors`: `[article.producerName]`
  - `siteName`: 'farmero'
- **Twitter Card:**
  - `card: 'summary_large_image'`
  - `title`, `description`, `images`
- **Canonical URL:** Setat pentru SEO

**Funcție:** `generateMetadata()` - server-side, apelată la build/runtime

**Fallback:** Dacă articolul nu este găsit, returnează metadata generică.

---

### 2. Schema.org JSON-LD

**Fișier:** `frontend/src/components/journal/journal-schema.tsx`

**Component:** `<JournalSchema article={article} />`

**Schema generat:**
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Titlu articol",
  "description": "Excerpt",
  "image": "URL imagine",
  "datePublished": "ISO date",
  "dateModified": "ISO date",
  "author": {
    "@type": "Organization",
    "name": "Nume producător",
    "url": "URL producător"
  },
  "publisher": {
    "@type": "Organization",
    "name": "farmero",
    "url": "https://farme.ro",
    "logo": {...}
  },
  "mainEntityOfPage": {...},
  "url": "URL articol"
}
```

**Injecție:** `<script type="application/ld+json">` în `<head>` (prin Next.js)

**Folosit în:** `frontend/src/app/(site)/jurnal-de-farmero/[slug]/page.tsx`

---

### 3. Sitemap

**Fișier:** `frontend/src/app/sitemap.ts`

**Actualizări:**
- Adăugat `/jurnal-de-farmero` (static route)
  - `changeFrequency: 'weekly'`
  - `priority: 0.8`
- Adăugat toate articolele jurnal (dynamic)
  - Fetch din API: `getJournalArticles({ limit: 1000 })`
  - Fiecare articol:
    - `url`: `/jurnal-de-farmero/{slug}`
    - `lastModified`: `article.updatedAt`
    - `changeFrequency: 'weekly'`
    - `priority: 0.6`

**Funcționare:**
- Sitemap-ul este generat la build time (SSG) sau runtime (ISR)
- Dacă API-ul nu este disponibil la build, sitemap-ul se generează fără articole (cu warning în dev)

**Limitări:**
- ⚠️ **API accesibil doar runtime:** Dacă backend-ul nu este disponibil la build time, articolele nu vor fi incluse în sitemap
- **Soluție viitoare:** ISR (Incremental Static Regeneration) sau pre-generare la build

---

### 4. Internal Linking

#### Pagină Producător → Jurnal

**Fișier:** `frontend/src/components/producers/producer-journal-section.tsx`

**Component:** `<ProducerJournalSection producerId={id} producerSlug={slug} />`

**Funcționalitate:**
- Afișează până la 3 articole din jurnal pentru producător
- Link către fiecare articol
- Link "Vezi toate" către `/jurnal-de-farmero`
- Se ascunde automat dacă nu există articole

**Integrare:**
- Adăugat în `frontend/src/app/(site)/producatori/[slug]/_components/producer-detail-content.tsx`
- Apare în coloana stângă, după secțiunea "Impact social"

**Notă:** Momentan filtrează client-side. Backend-ul ar trebui să suporte `producerId` filter pentru eficiență.

---

#### Pagină Articol → Producător & Jurnal

**Fișier:** `frontend/src/app/(site)/jurnal-de-farmero/[slug]/page.tsx`

**Link-uri adăugate:**
- **Înapoi la jurnal:** Buton în partea de sus
- **Vezi producătorul:** Link către pagina producătorului (lângă butonul "Înapoi")
- **Secțiune "Despre producător":** Link către pagina producătorului
- **Secțiune "Produse":** Link către produsele producătorului

**Tracking:**
- Click pe producător → `trackJournalMetrics(articleId, 'click_producer')`
- Click pe produse → `trackJournalMetrics(articleId, 'click_product')`

---

### 5. i18n (Pregătire)

**Chei i18n pregătite:**

**Pentru producători:**
- `producers.journal.title` - "În Jurnal de farme.ro"
- `producers.journal.description` - "Povești despre acest producător din Jurnal de farme.ro"
- `producers.journal.viewAll` - "Vezi toate"

**Pentru articole (deja existente):**
- `journal.article.backToList` - "Înapoi la jurnal"
- `journal.article.viewProducer` - "Vezi producătorul"
- `journal.article.aboutProducer` - "Despre producător"
- etc.

**Notă:** Nu implementăm multi-language pentru Jurnal încă, dar toate textele sunt pregătite pentru i18n.

---

## 🔧 Cum Sunt Generate Meta & OG Tags

### Listă Articole

**Metodă:** Static metadata în `layout.tsx`

```typescript
export const metadata: Metadata = {
  title: 'Jurnal de farme.ro – Povești și producători locali',
  description: '...',
  openGraph: { ... },
  twitter: { ... }
}
```

**Când:** La build time (static)

---

### Articol Individual

**Metodă:** Dynamic metadata cu `generateMetadata()`

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const article = await getJournalArticleBySlug(params.slug)
  return {
    title: `${article.title} – Jurnal de farme.ro`,
    description: article.excerpt,
    openGraph: {
      type: 'article',
      publishedTime: article.publishedAt,
      // ...
    }
  }
}
```

**Când:** La build time (SSG) sau runtime (ISR/SSR)

**Fallback:** Dacă articolul nu este găsit, returnează metadata generică.

---

## 📊 Cum Este Integrat Jurnalul în Sitemap

### Proces

1. **Static Routes:**
   - `/jurnal-de-farmero` este adăugat manual în sitemap

2. **Dynamic Routes (Articole):**
   - Sitemap-ul apelează `getJournalArticles({ limit: 1000 })`
   - Pentru fiecare articol, generează entry:
     ```typescript
     {
       url: `${baseUrl}/jurnal-de-farmero/${article.slug}`,
       lastModified: new Date(article.updatedAt),
       changeFrequency: 'weekly',
       priority: 0.6
     }
     ```

### Limitări

**⚠️ API accesibil doar runtime:**
- Dacă backend-ul nu este disponibil la build time, articolele nu vor fi incluse
- Sitemap-ul se generează cu success, dar fără articole (cu warning în dev)

**Soluții viitoare:**
1. **ISR (Incremental Static Regeneration):** Regenerează sitemap-ul periodic
2. **Pre-generare:** Fetch articole la build și salvează într-un fișier static
3. **Runtime generation:** Sitemap generat la fiecare request (mai lent, dar actualizat)

---

## ✅ Checklist Final

- [x] Metadata pentru listă articole
- [x] Metadata dinamică pentru articole individuale
- [x] OG tags complete (title, description, image, type, dates)
- [x] Twitter Card tags
- [x] Schema.org JSON-LD (BlogPosting)
- [x] Sitemap cu articole jurnal
- [x] Internal linking (producător → jurnal, articol → producător)
- [x] i18n keys pregătite
- [x] Canonical URLs
- [x] Fallback pentru articole negăsite

---

## 📚 Referințe

- **Metadata Layout:** `frontend/src/app/(site)/jurnal-de-farmero/layout.tsx`
- **Metadata Article:** `frontend/src/app/(site)/jurnal-de-farmero/[slug]/layout.tsx`
- **Schema Component:** `frontend/src/components/journal/journal-schema.tsx`
- **Sitemap:** `frontend/src/app/sitemap.ts`
- **Producer Journal Section:** `frontend/src/components/producers/producer-journal-section.tsx`

---

## 🎯 Impact SEO

### Beneficii

1. **Indexare mai bună:**
   - Sitemap include toate articolele
   - Schema.org ajută Google să înțeleagă structura

2. **Share mai bun:**
   - OG tags complete pentru Facebook, LinkedIn, etc.
   - Twitter Card pentru share-uri Twitter

3. **Descoperire:**
   - Internal linking între producători și articole
   - Link-uri către jurnal din paginile producătorilor

4. **Rich Snippets:**
   - Schema.org BlogPosting poate genera rich snippets în Google

---

## 🔄 Next Steps (Viitoare)

1. **ISR pentru sitemap:** Regenerează periodic
2. **Image optimization:** Optimizează imaginile OG pentru share
3. **Structured data testing:** Testează cu Google Rich Results Test
4. **Analytics:** Track share-uri și click-uri din jurnal
5. **Multi-language:** Extinde i18n pentru EN/RO

