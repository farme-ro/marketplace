# Journal SEO & Discovery - Implementation Summary

**Data:** 2025-01-27  
**Status:** ✅ Complet Implementat

---

## 📝 Ce Am Schimbat în Metadata

### 1. Pagină Listă (`/jurnal-de-farmero`)

**Fișier:** `frontend/src/app/(site)/jurnal-de-farmero/layout.tsx` (NOU)

**Metadata adăugat:**
- **Title:** "Jurnal de farme.ro – Povești și producători locali"
- **Description:** Rezumat friendly despre jurnal
- **OpenGraph:**
  - `title`, `description`
  - `type: 'website'`
  - `url`: URL complet
  - `images`: Imagine generică (`/images/jurnal-farmero-og.png`)
- **Twitter Card:**
  - `card: 'summary_large_image'`
  - `title`, `description`, `images`

**Metodă:** Static metadata export în `layout.tsx` (server component)

---

### 2. Pagină Articol (`/jurnal-de-farmero/[slug]`)

**Fișier:** `frontend/src/app/(site)/jurnal-de-farmero/[slug]/layout.tsx` (NOU)

**Metadata adăugat (dinamic):**
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

**Metodă:** `generateMetadata()` async function (server-side)

**Fallback:** Dacă articolul nu este găsit, returnează metadata generică.

---

## 🔧 Cum Am Generat JSON-LD

**Fișier:** `frontend/src/components/journal/journal-schema.tsx` (NOU)

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

**Injecție:**
- Component renderizat în `page.tsx`
- Next.js injectează automat `<script type="application/ld+json">` în `<head>`

**Folosit în:** `frontend/src/app/(site)/jurnal-de-farmero/[slug]/page.tsx`

---

## 🗺️ Sitemap - Include Articole Jurnal?

### ✅ DA - Cu Limitări

**Fișier:** `frontend/src/app/sitemap.ts` (ACTUALIZAT)

**Ce include:**
1. **Rută statică:**
   - `/jurnal-de-farmero` (priority: 0.8, changeFrequency: 'weekly')

2. **Articole dinamice:**
   - Fetch din API: `getJournalArticles({ limit: 1000 })`
   - Pentru fiecare articol:
     ```typescript
     {
       url: `/jurnal-de-farmero/${article.slug}`,
       lastModified: new Date(article.updatedAt),
       changeFrequency: 'weekly',
       priority: 0.6
     }
     ```

### ⚠️ Limitări

**API accesibil doar runtime:**
- Dacă backend-ul nu este disponibil la build time, articolele nu vor fi incluse
- Sitemap-ul se generează cu success, dar fără articole (cu warning în dev)

**Cod:**
```typescript
try {
  const articles = await getJournalArticles({ limit: 1000 })
  journalRoutes = articles.map(article => ({ ... }))
} catch (error) {
  // If API is not available at build time, log error but don't fail sitemap generation
  console.warn('[Sitemap] Could not fetch journal articles:', error)
}
```

**Soluții viitoare:**
1. **ISR (Incremental Static Regeneration):** Regenerează sitemap-ul periodic
2. **Pre-generare:** Fetch articole la build și salvează într-un fișier static
3. **Runtime generation:** Sitemap generat la fiecare request (mai lent, dar actualizat)

---

## 🔗 Internal Linking

### 1. Pagină Producător → Jurnal

**Fișier:** `frontend/src/components/producers/producer-journal-section.tsx` (NOU)

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

### 2. Pagină Articol → Producător & Jurnal

**Fișier:** `frontend/src/app/(site)/jurnal-de-farmero/[slug]/page.tsx` (ACTUALIZAT)

**Link-uri adăugate:**
- **Înapoi la jurnal:** Buton în partea de sus
- **Vezi producătorul:** Link către pagina producătorului (lângă butonul "Înapoi")
- **Secțiune "Despre producător":** Link către pagina producătorului
- **Secțiune "Produse":** Link către produsele producătorului

**Tracking:**
- Click pe producător → `trackJournalMetrics(articleId, 'click_producer')`
- Click pe produse → `trackJournalMetrics(articleId, 'click_product')`

---

## 📁 Fișiere Create/Modificate

### Create

1. **`frontend/src/app/(site)/jurnal-de-farmero/layout.tsx`**
   - Metadata static pentru listă articole

2. **`frontend/src/app/(site)/jurnal-de-farmero/[slug]/layout.tsx`**
   - Metadata dinamică pentru articole individuale

3. **`frontend/src/components/journal/journal-schema.tsx`**
   - Component Schema.org JSON-LD

4. **`frontend/src/components/producers/producer-journal-section.tsx`**
   - Component pentru secțiunea "În Jurnal" pe pagina producătorului

5. **`frontend/docs/JOURNAL_SEO_NOTES.md`**
   - Documentație completă SEO

### Modificate

1. **`frontend/src/app/sitemap.ts`**
   - Adăugat `/jurnal-de-farmero` (static)
   - Adăugat articole dinamice (cu try/catch pentru fallback)

2. **`frontend/src/app/(site)/jurnal-de-farmero/[slug]/page.tsx`**
   - Adăugat `<JournalSchema article={article} />`
   - Adăugat link către producător lângă butonul "Înapoi"

3. **`frontend/src/app/(site)/producatori/[slug]/_components/producer-detail-content.tsx`**
   - Adăugat `<ProducerJournalSection />` în coloana stângă

---

## ✅ Checklist Final

- [x] Metadata pentru listă articole (static)
- [x] Metadata dinamică pentru articole (generateMetadata)
- [x] OG tags complete (title, description, image, type, dates)
- [x] Twitter Card tags
- [x] Schema.org JSON-LD (BlogPosting)
- [x] Sitemap cu articole jurnal (cu fallback)
- [x] Internal linking (producător → jurnal, articol → producător)
- [x] i18n keys pregătite (folosind chei existente)
- [x] Canonical URLs
- [x] Fallback pentru articole negăsite

---

## 🎯 Impact SEO

### Beneficii

1. **Indexare mai bună:**
   - Sitemap include toate articolele (dacă API este disponibil)
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

## 📚 Documentație

- **SEO Notes:** `frontend/docs/JOURNAL_SEO_NOTES.md`
- **Metadata Layout:** `frontend/src/app/(site)/jurnal-de-farmero/layout.tsx`
- **Metadata Article:** `frontend/src/app/(site)/jurnal-de-farmero/[slug]/layout.tsx`
- **Schema Component:** `frontend/src/components/journal/journal-schema.tsx`
- **Sitemap:** `frontend/src/app/sitemap.ts`

---

## 🎉 Concluzie

Optimizările SEO pentru Jurnal sunt **implementate complet**:

- ✅ Metadata & OG tags pentru toate paginile
- ✅ Schema.org JSON-LD pentru articole
- ✅ Sitemap cu articole (cu fallback pentru API indisponibil)
- ✅ Internal linking complet
- ✅ i18n pregătit

**Gata pentru utilizare!** 🚀

