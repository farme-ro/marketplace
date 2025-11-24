# Journal Multi-Language Implementation - Frontend

**Data:** 2025-01-27  
**Scop:** Implementare sistem multi-language pentru Jurnal de farme.ro în frontend  
**Status:** ⚠️ Pending Implementation

---

## 📋 Prezentare generală

Frontend-ul trebuie să suporte afișarea articolelor din Jurnal în multiple limbi, cu fallback automat la limba română și rute localizate.

---

## 🌍 Limbi suportate

- `ro` - Română (limba de bază)
- `en` - English
- `fr` - Français
- `it` - Italiano
- `de` - Deutsch
- `es` - Español
- `hu` - Magyar
- `uk` - Українська

---

## 🛣️ Rute localizate

### Structură rute

- **RO:** `/jurnal-de-farmero` și `/jurnal-de-farmero/[slug]`
- **EN:** `/en/journal` și `/en/journal/[slug]`
- **FR:** `/fr/journal` și `/fr/journal/[slug]`
- **IT:** `/it/journal` și `/it/journal/[slug]`
- **DE:** `/de/journal` și `/de/journal/[slug]`
- **ES:** `/es/journal` și `/es/journal/[slug]`
- **HU:** `/hu/journal` și `/hu/journal/[slug]`
- **UK:** `/uk/journal` și `/uk/journal/[slug]`

### Detalii implementare

#### Next.js App Router

```typescript
// app/[lang]/journal/page.tsx
// app/[lang]/journal/[slug]/page.tsx
```

Sau structură alternativă:
```typescript
// app/jurnal-de-farmero/page.tsx (RO)
// app/[lang]/journal/page.tsx (alte limbi)
// app/jurnal-de-farmero/[slug]/page.tsx (RO)
// app/[lang]/journal/[slug]/page.tsx (alte limbi)
```

---

## 🔄 Fallback Logic

### Detecție limbă

1. **Din URL:** `/en/journal/...` → limba = `en`
2. **Din i18n context:** Dacă există context i18n global
3. **Din browser:** `Accept-Language` header (opțional)
4. **Default:** `ro` (română)

### Fallback la RO

Dacă traducerea nu există pentru limba selectată:

1. **API returnează versiunea RO** cu flag `fallbackToRo: true`
2. **UI afișează badge:** "Traducere indisponibilă – afișăm versiunea RO"
3. **Link-uri rămân în limba selectată** (nu se schimbă la RO)

### Exemplu implementare

```typescript
// lib/api/journal.ts
export async function getJournalArticle(
  slug: string,
  lang: string = 'ro'
): Promise<JournalArticle | null> {
  try {
    const response = await fetch(
      `${API_URL}/journal/${slug}?lang=${lang}`
    )
    const data = await response.json()
    
    // Dacă fallbackToRo, afișăm badge
    if (data.fallbackToRo) {
      // Set flag pentru UI
    }
    
    return data
  } catch (err) {
    // Fallback la RO dacă request eșuează
    return getJournalArticle(slug, 'ro')
  }
}
```

---

## 🎨 UI Components

### Badge "Traducere indisponibilă"

```tsx
{article.fallbackToRo && (
  <div className="rounded bg-yellow-100 px-3 py-1 text-sm text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
    <span>🌐 Traducere indisponibilă – afișăm versiunea RO</span>
  </div>
)}
```

### Language Switcher

```tsx
<LanguageSwitcher
  currentLanguage={lang}
  availableLanguages={['ro', 'en', 'fr', 'it', 'de', 'es', 'hu', 'uk']}
  articleSlug={article.slug}
/>
```

**Funcționalitate:**
- Afișează doar limbi disponibile pentru articol
- Link către versiunea în limba selectată
- Indică limba curentă

---

## 🔍 SEO Implementation

### Metadata dinamică

```tsx
// app/[lang]/journal/[slug]/page.tsx
export async function generateMetadata(
  { params }: { params: { lang: string; slug: string } }
): Promise<Metadata> {
  const article = await getJournalArticle(params.slug, params.lang)
  
  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt,
    openGraph: {
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt,
      images: article.coverImage ? [article.coverImage] : [],
      locale: params.lang,
      alternateLocale: ['ro', 'en', 'fr', 'it', 'de', 'es', 'hu', 'uk'],
    },
    alternates: {
      canonical: `https://farme.ro/${params.lang === 'ro' ? 'jurnal-de-farmero' : `${params.lang}/journal`}/${params.slug}`,
      languages: {
        'ro': `https://farme.ro/jurnal-de-farmero/${article.slugRo}`,
        'en': `https://farme.ro/en/journal/${article.slugEn}`,
        'fr': `https://farme.ro/fr/journal/${article.slugFr}`,
        // ... etc
      },
    },
  }
}
```

### Schema.org cu @inLanguage

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      '@inLanguage': lang,
      headline: article.title,
      description: article.excerpt,
      articleBody: article.content,
      image: article.coverImage,
      datePublished: article.publishedAt,
      author: {
        '@type': 'Organization',
        name: article.producer.name,
      },
    }),
  }}
/>
```

---

## 🗺️ Sitemap Integration

### Sitemap dinamic

```typescript
// app/sitemap.ts
export default async function sitemap(): Promise<Sitemap[]> {
  const articles = await getAllJournalArticles()
  const languages = ['ro', 'en', 'fr', 'it', 'de', 'es', 'hu', 'uk']
  
  const urls: Sitemap[] = []
  
  for (const article of articles) {
    for (const lang of languages) {
      const translation = article.translations.find(t => t.language === lang)
      if (translation || lang === 'ro') {
        const slug = translation?.slug || article.slug
        const path = lang === 'ro' 
          ? `/jurnal-de-farmero/${slug}`
          : `/${lang}/journal/${slug}`
        
        urls.push({
          url: `https://farme.ro${path}`,
          lastModified: translation?.updatedAt || article.updatedAt,
          changeFrequency: 'weekly',
          priority: 0.8,
          alternates: {
            languages: generateAlternateLanguages(article, languages),
          },
        })
      }
    }
  }
  
  return urls
}
```

---

## 🔌 API Integration

### Hook personalizat

```typescript
// hooks/useJournalArticle.ts
export function useJournalArticle(slug: string, lang?: string) {
  const { locale } = useI18n() // sau context i18n
  const currentLang = lang || locale || 'ro'
  
  return useQuery({
    queryKey: ['journal-article', slug, currentLang],
    queryFn: () => getJournalArticle(slug, currentLang),
    staleTime: 5 * 60 * 1000, // 5 minute
  })
}
```

### Service layer

```typescript
// lib/api/journal.ts
export async function getJournalArticles(params?: {
  lang?: string
  page?: number
  limit?: number
  producerId?: string
}): Promise<PaginatedResponse<JournalArticle>> {
  const queryParams = new URLSearchParams()
  if (params?.lang) queryParams.append('lang', params.lang)
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.limit) queryParams.append('limit', params.limit.toString())
  if (params?.producerId) queryParams.append('producerId', params.producerId)
  
  const response = await fetch(`${API_URL}/journal?${queryParams}`)
  return response.json()
}
```

---

## 🧪 Testing

### Test cases

1. **Fallback la RO:**
   - Request pentru EN când traducerea nu există
   - Verifică că se returnează RO
   - Verifică că badge-ul apare

2. **Rute localizate:**
   - `/en/journal/slug` → afișează EN
   - `/ro/jurnal-de-farmero/slug` → afișează RO
   - Link-uri între limbi funcționează corect

3. **SEO:**
   - Metadata corectă per limbă
   - hreflang tags corecte
   - Schema.org cu @inLanguage corect

4. **Language Switcher:**
   - Afișează doar limbi disponibile
   - Link-uri corecte către versiuni alternative

---

## 📝 Checklist implementare

- [ ] Structură rute localizate (Next.js App Router)
- [ ] Hook `useJournalArticle` cu suport multi-language
- [ ] Service layer pentru API calls cu `lang` parameter
- [ ] Fallback logic la RO
- [ ] Badge "Traducere indisponibilă"
- [ ] Language Switcher component
- [ ] Metadata dinamică per limbă
- [ ] Schema.org cu @inLanguage
- [ ] Sitemap cu toate versiunile lingvistice
- [ ] hreflang tags în HTML
- [ ] Testare fallback scenarios
- [ ] Testare rute localizate

---

## 🔗 Referințe

- Backend: `JOURNAL_TRANSLATIONS_API_SPEC.md`
- Admin: `JOURNAL_TRANSLATION_UI.md`
- Roadmap: `JOURNAL_I18N_ROADMAP.md`

