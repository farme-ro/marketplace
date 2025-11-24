# Admin i18n Monitoring - Note de implementare

## Prezentare generală

Pagina `/content/i18n` oferă monitorizare pentru cheile de traducere și acoperirea multi-limbă. Această pagină folosește un snapshot static al cheilor de traducere.

## Snapshot-ul de chei

**Locație:** `admin/src/lib/i18n/keys-snapshot.json`

**Structură:**
```json
{
  "namespaces": ["actions", "nav", "home", ...],
  "keys": {
    "actions.add_to_cart": {
      "ro": "Adaugă în coș",
      "en": "Add to cart",
      ...
    }
  }
}
```

## Proces de actualizare

### Opțiunea 1: Export manual din frontend

1. **Identifică fișierele de traducere:**
   - Caută fișierele JSON de traducere în frontend (ex: `frontend/src/locales/ro.json`, `en.json`, etc.)

2. **Extrage cheile:**
   - Rulează un script de export (dacă există) sau
   - Extrage manual cheile importante

3. **Actualizează snapshot:**
   - Editează `admin/src/lib/i18n/keys-snapshot.json`
   - Adaugă/actualizează cheile și traducerile

### Opțiunea 2: Script de export (recomandat)

Creează un script în frontend care exportă cheile:

```typescript
// frontend/scripts/export-i18n-keys.ts
import roTranslations from './locales/ro.json'
import enTranslations from './locales/en.json'
// ... alte limbi

const keys: Record<string, Record<string, string>> = {}

// Merge all translations
Object.keys(roTranslations).forEach(key => {
  keys[key] = {
    ro: roTranslations[key],
    en: enTranslations[key] || '',
    // ... alte limbi
  }
})

// Write to admin/src/lib/i18n/keys-snapshot.json
```

**Notă:** Acest script ar trebui să fie rulat periodic sau la fiecare actualizare a traducerilor.

## Limbi suportate

Snapshot-ul suportă următoarele limbi:
- **RO** (Română) - Limba de bază (obligatorie)
- **EN** (English)
- **FR** (Français)
- **IT** (Italiano)
- **DE** (Deutsch)
- **ES** (Español)
- **UK** (Українська) - Placeholder
- **HU** (Magyar) - Placeholder

## Statistici calculate

Pagina calculează automat:
- **Total chei:** Numărul total de chei din snapshot
- **Complete:** Chei cu traduceri în toate limbile
- **Parțiale:** Chei cu traduceri în unele limbi (dar nu toate)
- **Lipsă:** Chei cu traduceri doar în limba de bază (RO)

## Limitări

1. **Snapshot static:**
   - Nu se actualizează automat
   - Trebuie actualizat manual sau prin script

2. **Doar monitorizare:**
   - Nu permite editare directă
   - Nu sincronizează cu frontend

3. **Fără validare:**
   - Nu verifică dacă cheile există în frontend
   - Nu verifică dacă traducerile sunt actualizate

## Recomandări

1. **Actualizează snapshot-ul periodic:**
   - La fiecare release major
   - Când se adaugă traduceri noi
   - Când se modifică chei existente

2. **Automatizează procesul:**
   - Creează un script de export
   - Integrează în CI/CD pipeline
   - Notifică când snapshot-ul este depășit

3. **Monitorizează lacunele:**
   - Identifică cheile cu traduceri lipsă
   - Prioritizează traducerile pentru limbi importante (EN, FR)
   - Planifică sesiuni de traducere

## Viitor

În viitor, ar putea fi implementat:
- Sincronizare automată cu frontend
- Editare directă din admin (dacă backend suportă)
- Validare automată a cheilor
- Notificări pentru traduceri lipsă

