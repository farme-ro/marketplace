# i18n Conventions & Guidelines

**Last Updated:** 2025-01-27

---

## 📁 File Structure

### Translation Files

All translation files are located in:
```
src/lib/i18n/translations/
├── ro.json  (Reference - Romanian)
├── en.json  (Reference - English)
├── fr.json  (French)
├── it.json  (Italian)
├── de.json  (German)
├── es.json  (Spanish)
├── uk.json  (Ukrainian)
└── hu.json  (Hungarian)
```

### Reference Locales

- **Primary Reference:** `ro.json` (Romanian)
- **Secondary Reference:** `en.json` (English)

All other locales should match the key structure of these reference files.

---

## 🔑 Key Structure

### Naming Convention

Keys use dot notation for nested structure:
```json
{
  "homepage": {
    "hero": {
      "title": "Produse direct de la producători locali",
      "subtitle": "Fără intermediari"
    }
  }
}
```

**Usage:**
```tsx
t('homepage.hero.title')
```

### Namespace Organization

- `common.*` - Common UI elements (buttons, labels, etc.)
- `actions.*` - Action buttons and verbs
- `auth.*` - Authentication flows
- `homepage.*` - Homepage content
- `products.*` - Product-related content
- `producers.*` - Producer-related content
- `checkout.*` - Checkout flow
- `account.*` - User account pages
- `errors.*` - Error messages
- `cookies.*` - Cookie banner and preferences

---

## 🔄 Auto-translation Prefix

### Format

Keys that are auto-generated (machine-translated or copied from EN) are prefixed with:
```
@@AUTO@@ <text>
```

### Example

```json
{
  "homepage": {
    "hero": {
      "title": "@@AUTO@@ Products directly from local producers"
    }
  }
}
```

### Meaning

- `@@AUTO@@` indicates the translation was automatically generated
- **Requires human review** before production
- Should be replaced with proper translation

### Finding Auto-translated Keys

Search for `@@AUTO@@` in translation files:
```bash
grep -r "@@AUTO@@" src/lib/i18n/translations/
```

---

## 🛠️ Synchronization Script

### Running the Sync

```bash
npm run i18n:sync
```

Or directly:
```bash
npx tsx scripts/sync-i18n-keys.ts
```

### What It Does

1. **Loads reference translations** (RO + EN)
2. **For each locale** (FR, IT, DE, ES, UK, HU):
   - Finds missing keys (compared to RO)
   - Adds missing keys with fallback from EN
   - Marks auto-translated keys with `@@AUTO@@` prefix
   - Reports extra keys (keys in locale but not in RO)

3. **Generates report** in `docs/I18N_AUTOFIX_REPORT.md`

### When to Run

- After adding new translation keys to RO/EN
- Before major releases
- When onboarding new languages
- After manual translation updates

### Safety

- **Does NOT remove extra keys** automatically
- **Preserves existing translations** (only adds missing)
- **Backs up** by creating report before changes

---

## 📝 Adding New Translations

### Step 1: Add to Reference

Add the new key to `ro.json` (and `en.json` if different):

```json
{
  "newFeature": {
    "title": "Titlu nou",
    "description": "Descriere nouă"
  }
}
```

### Step 2: Run Sync

```bash
npm run i18n:sync
```

This will:
- Add the key to all other locales
- Mark them as `@@AUTO@@` if not in EN

### Step 3: Translate

Manually translate the `@@AUTO@@` keys in each locale file.

### Step 4: Remove Prefix

Once translated, remove the `@@AUTO@@` prefix:

```json
// Before
"title": "@@AUTO@@ New Title"

// After
"title": "Nouveau Titre"  // (for FR)
```

---

## 🔍 Internal i18n Viewer

### Access

**Development only:**
```
http://localhost:3000/internal/i18n
```

**Production:**
- Protected by admin role check
- Not accessible to regular users

### Features

- **Search** by key or text content
- **Compare** translations across languages
- **Filter** by:
  - Missing translations
  - Auto-translated keys (`@@AUTO@@`)
- **Highlight**:
  - Empty values
  - Auto-translated values

### Usage

1. Navigate to `/internal/i18n` in dev mode
2. Select reference locale (default: RO)
3. Search for keys or browse by namespace
4. Compare translations side-by-side
5. Identify missing or auto-translated keys

**Note:** This tool is for QA and translators only, not for end users.

---

## ✅ Best Practices

### 1. Always Use Reference Structure

When adding new keys, follow the existing namespace structure:
- Don't create flat keys if a namespace exists
- Use consistent naming (camelCase)

### 2. Provide Fallbacks

Always provide a fallback when using `t()`:
```tsx
// Good
t('homepage.hero.title', 'Default Title')

// Avoid
t('homepage.hero.title')  // Will show key if missing
```

### 3. Review Auto-translations

Before production:
- Review all `@@AUTO@@` keys
- Replace with proper translations
- Remove the prefix

### 4. Keep Keys Consistent

- Use the same key structure across all locales
- Don't add locale-specific keys (use the same key, different value)

### 5. Test All Locales

After changes:
- Test UI in all supported locales
- Check for missing keys (they'll show as key path)
- Verify auto-translated keys are replaced

---

## 🚨 Common Issues

### Issue: Key shows as path

**Symptom:** UI shows `homepage.hero.title` instead of translated text

**Cause:** Key missing in current locale

**Fix:**
1. Run `npm run i18n:sync`
2. Check if key exists in RO/EN
3. Manually add if needed

### Issue: Auto-translated text visible

**Symptom:** Text shows `@@AUTO@@ English text`

**Cause:** Translation not reviewed/replaced

**Fix:**
1. Find key in locale file
2. Replace with proper translation
3. Remove `@@AUTO@@` prefix

### Issue: Extra keys in locale

**Symptom:** Key exists in FR but not in RO

**Cause:** Key was added directly to locale, not to reference

**Fix:**
1. Check if key should be in RO
2. If yes, add to RO and sync
3. If no, remove from locale (or document why it's locale-specific)

---

## 📊 Maintenance

### Regular Tasks

- **Weekly:** Review `I18N_AUTOFIX_REPORT.md` for new auto-translations
- **Before Release:** Ensure all `@@AUTO@@` keys are translated
- **After New Features:** Run sync and translate new keys

### Monitoring

- Check console warnings in development for missing keys
- Review `I18N_QA_REPORT.md` for consistency issues
- Use `/internal/i18n` tool for visual inspection

---

## 🔗 Related Documentation

- `docs/I18N_EFIGS_RO_UK_HU_OVERVIEW.md` - i18n system overview
- `docs/I18N_QA_REPORT.md` - Consistency audit report
- `docs/I18N_AUTOFIX_REPORT.md` - Auto-fix sync report
- `docs/I18N_UK_HU_REVIEW_TODO.md` - Review checklist for UK/HU

---

**Questions?** Check the i18n context implementation in `src/lib/i18n/context.tsx`

