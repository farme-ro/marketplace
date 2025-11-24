# Journal Translation UI - Admin

**Data:** 2025-01-27  
**Scop:** UI pentru gestionarea traducerilor articolelor jurnal în admin  
**Status:** ⚠️ Pending Implementation

---

## 📋 Prezentare generală

Admin UI pentru gestionarea traducerilor multi-language ale articolelor din Jurnal. Permite editarea traducerilor, sincronizarea cu versiunea RO, și managementul statusului traducerilor.

---

## 🎨 UI Components

### Tab "Translations" în Journal Editor

**Locație:** `/jurnal/[id]` → Tab nou "Translations"

**Layout:**
- Listă limbi suportate (RO, EN, FR, IT, DE, ES, HU, UK)
- Pentru fiecare limbă:
  - Status badge (draft, needs-review, published)
  - Buton "Edit" / "Create"
  - Indicator dacă traducerea există

### Editor Translation

**Drawer/Modal pentru editare traducere:**

#### Câmpuri

1. **Language** (read-only, selectat din listă)
2. **Title** (textarea, obligatoriu)
3. **Slug** (input, obligatoriu, validare uniqueness)
4. **Excerpt** (textarea, opțional)
5. **Content** (WYSIWYG editor, obligatoriu)
6. **Meta Title** (input, opțional, max 60 caractere)
7. **Meta Description** (textarea, opțional, max 160 caractere)
8. **Translation Status** (dropdown: draft, needs-review, published)

#### Butoane

- **"Sincronizează cu versiunea RO"** - Copiază title, excerpt, content din RO
- **"Salvează draft"** - Salvează cu status draft
- **"Marchează pentru review"** - Salvează cu status needs-review
- **"Publică"** - Salvează cu status published
- **"Anulează"** - Închide fără salvare

---

## 🔄 Sincronizare cu RO

### Funcționalitate "Sincronizează cu versiunea RO"

**Scop:** Copiază conținutul din versiunea RO în traducerea curentă pentru a facilita traducerea.

**Acțiuni:**
1. Preia title, excerpt, content din versiunea RO
2. Populează câmpurile în editor
3. **NU** copiază slug (rămâne specific pentru limbă)
4. **NU** copiază metaTitle/metaDescription (trebuie traduse manual)

**UX:**
- Buton vizibil doar când se editează o traducere (nu RO)
- Confirmare: "Ești sigur? Conținutul existent va fi înlocuit."

---

## 📊 Status Management

### Translation Status

**draft:**
- Badge: gri/albastru
- Text: "Draft"
- Acțiuni: Edit, Delete (dacă nu e RO)

**needs-review:**
- Badge: galben
- Text: "Necesită review"
- Acțiuni: Edit, Publică, Reject (revino la draft)

**published:**
- Badge: verde
- Text: "Publicat"
- Acțiuni: Edit, Unpublish (revino la draft)

### Validare

- **RO:** Nu poate fi ștearsă, status-ul nu se schimbă (este întotdeauna "published" implicit)
- **Alte limbi:** Pot fi șterse, status-ul poate fi schimbat

---

## 🎯 UI Mockup

### Tab Translations

```
┌─────────────────────────────────────────────────────────┐
│ Translations                                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 🌐 Română (RO)                    [✅ Publicat] [Edit] │
│ 🌐 English (EN)                    [📝 Draft] [Edit]    │
│ 🌐 Français (FR)                   [❌ Nu există] [+]  │
│ 🌐 Italiano (IT)                   [⚠️ Review] [Edit]  │
│ 🌐 Deutsch (DE)                     [❌ Nu există] [+]  │
│ 🌐 Español (ES)                     [❌ Nu există] [+]  │
│ 🌐 Magyar (HU)                      [❌ Nu există] [+]  │
│ 🌐 Українська (UK)                 [❌ Nu există] [+]  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Editor Drawer

```
┌─────────────────────────────────────────────────────────┐
│ Edit Translation: English (EN)                    [X]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Language: English (EN) [read-only]                      │
│                                                         │
│ Title *                                                │
│ [_________________________________________________]     │
│                                                         │
│ Slug *                                                 │
│ [article-slug-en________________________]               │
│                                                         │
│ Excerpt                                                │
│ [_________________________________________________]     │
│ [_________________________________________________]     │
│                                                         │
│ Content * (WYSIWYG Editor)                              │
│ [Rich text editor with formatting tools...]             │
│                                                         │
│ Meta Title (SEO)                                        │
│ [_________________________________________________]     │
│                                                         │
│ Meta Description (SEO)                                  │
│ [_________________________________________________]     │
│ [_________________________________________________]     │
│                                                         │
│ Translation Status                                      │
│ [Draft ▼]                                              │
│                                                         │
│ [Sincronizează cu versiunea RO]                        │
│                                                         │
│ [Salvează draft] [Marchează pentru review] [Publică]   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔌 API Integration

### Get Translations

```typescript
// lib/api/journal.ts
export async function getJournalArticleTranslations(
  articleId: string
): Promise<{
  articleId: string
  baseLanguage: string
  translations: JournalArticleTranslation[]
}> {
  return apiFetch(`/admin/journal/${articleId}/translations`)
}
```

### Create/Update Translation

```typescript
export async function saveJournalArticleTranslation(
  articleId: string,
  translation: {
    language: string
    title: string
    slug: string
    excerpt?: string
    content: string
    metaTitle?: string
    metaDescription?: string
    translationStatus: 'draft' | 'needs-review' | 'published'
  }
): Promise<JournalArticleTranslation> {
  return apiFetch(`/admin/journal/${articleId}/translations`, {
    method: 'POST',
    body: JSON.stringify(translation),
  })
}
```

### Update Translation

```typescript
export async function updateJournalArticleTranslation(
  translationId: string,
  updates: Partial<JournalArticleTranslation>
): Promise<JournalArticleTranslation> {
  return apiFetch(`/admin/journal/translations/${translationId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  })
}
```

### Delete Translation

```typescript
export async function deleteJournalArticleTranslation(
  translationId: string
): Promise<void> {
  return apiFetch(`/admin/journal/translations/${translationId}`, {
    method: 'DELETE',
  })
}
```

### Sync with RO

```typescript
export async function syncTranslationWithRo(
  articleId: string,
  language: string
): Promise<{
  title: string
  excerpt: string
  content: string
}> {
  // Backend returnează conținutul RO
  const roTranslation = await getJournalArticleTranslations(articleId)
  const ro = roTranslation.translations.find(t => t.language === 'ro')
  
  if (!ro) {
    throw new Error('RO translation not found')
  }
  
  return {
    title: ro.title,
    excerpt: ro.excerpt || '',
    content: ro.content,
  }
}
```

---

## 🎨 Component Structure

### JournalTranslationsTab Component

```tsx
'use client'

export function JournalTranslationsTab({ articleId }: { articleId: string }) {
  const [translations, setTranslations] = useState<Translation[]>([])
  const [editingLanguage, setEditingLanguage] = useState<string | null>(null)
  
  // Load translations
  // Render language list
  // Handle edit/create
  // Handle sync with RO
}
```

### TranslationEditor Drawer

```tsx
'use client'

export function TranslationEditor({
  articleId,
  language,
  translation,
  onSave,
  onClose,
}: TranslationEditorProps) {
  // Form fields
  // WYSIWYG editor
  // Sync with RO button
  // Save actions
}
```

---

## 🔐 Validare & Safety

### Slug Validation

- Unic global (nu doar per limbă)
- Format: `^[a-z0-9-]+$`
- Min 3, max 100 caractere
- Validare în timp real (debounce)

### Content Validation

- Title: 3-200 caractere
- Excerpt: max 500 caractere
- Content: min 100 caractere
- MetaTitle: max 60 caractere
- MetaDescription: max 160 caractere

### Safety Rules

- RO nu poate fi ștearsă
- RO nu poate avea status schimbat (implicit published)
- Slug-uri trebuie să fie unice
- Confirmare pentru ștergere traducere

---

## 📝 Checklist implementare

- [ ] Tab "Translations" în `/jurnal/[id]`
- [ ] Listă limbi cu status badges
- [ ] Drawer editor traducere
- [ ] WYSIWYG editor pentru content
- [ ] Buton "Sincronizează cu RO"
- [ ] Validare slug uniqueness
- [ ] Validare câmpuri
- [ ] Status management (draft, needs-review, published)
- [ ] API integration (GET, POST, PATCH, DELETE)
- [ ] Error handling
- [ ] Loading states
- [ ] Success notifications

---

## 🔗 Referințe

- Backend: `JOURNAL_TRANSLATIONS_API_SPEC.md`
- Frontend: `JOURNAL_I18N_IMPLEMENTATION.md`
- Roadmap: `JOURNAL_I18N_ROADMAP.md`

