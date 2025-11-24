# Admin Content Module - Documentație

## Prezentare generală

Modulul Content oferă gestionarea paginilor statice, întrebărilor frecvente (FAQ) și monitorizarea traducerilor (i18n) pentru platforma Farmero.

## Structură modul

### 1. Pagini & Legal (`/content/pages`)

**Descriere:** Gestionare pagini statice și conținut legal cu suport multi-limbă.

**Funcționalități:**
- **Tabel pagini:**
  - Slug (ex: `/despre-noi`, `/privacy`, `/terms`)
  - Titlu (în limba de bază, RO)
  - Tip: `info`, `legal`, `help`, `donations`
  - Status: `draft`, `published`, `archived`
  - Ultima actualizare

- **Filtre:**
  - Tip (info, legal, help, donations)
  - Status (draft, published, archived)
  - Search (după slug sau titlu)

- **Drawer de editare:**
  - Meta informații (slug, tip, status)
  - Editor multi-limbă cu tabs pentru fiecare limbă:
    - RO, EN, FR, IT, DE, ES, UK, HU
  - Editor simplu (textarea) pentru titlu și conținut
  - Indicator pentru limbi fără traducere

- **Acțiuni:**
  - **Salvează draft:** Salvează modificările ca draft
  - **Publică:** Publică pagina (schimbă status la `published`)
  - **Anulează:** Închide drawer-ul (cu confirmare dacă există modificări nesalvate)

**Backend Endpoints:**
- `GET /admin/content/pages` - Listă pagini cu filtre
- `GET /admin/content/pages/:id` - Detalii pagină
- `PATCH /admin/content/pages/:id` - Actualizează pagină

**Permisiuni:**
- `view_content` - Vizualizare pagini
- `manage_content` sau `manage_journal` - Editare și publicare

**Audit Logging:**
- `CONTENT_PAGE_UPDATED` - La salvare draft
- `CONTENT_PAGE_STATUS_CHANGED` - La schimbare status (draft → published, etc.)

---

### 2. FAQ & Ajutor (`/content/faq`)

**Descriere:** Gestionare întrebări frecvente cu suport multi-limbă.

**Funcționalități:**
- **Tabel FAQ:**
  - Key (ex: `faq.delivery.returns`)
  - Categorie (clienți, producători, livrare & plăți, legal, altele)
  - Întrebare (în limba de bază)
  - Status (published, draft)
  - Ordine (pentru sortare)

- **Filtre:**
  - Categorie
  - Status
  - Search (după key sau întrebare)

- **Drawer de editare:**
  - Meta informații (key, categorie, ordine)
  - Editor multi-limbă pentru întrebare și răspuns
  - Tabs pentru fiecare limbă (RO, EN, FR, IT, DE, ES, UK, HU)

- **Acțiuni:**
  - **Adaugă întrebare:** Creează o nouă întrebare
  - **Salvează:** Salvează modificările
  - **Publică:** Publică întrebarea (schimbă status la `published`)
  - **Șterge:** Șterge întrebarea (soft-delete)

**Backend Endpoints:**
- `GET /admin/content/faq` - Listă întrebări cu filtre
- `POST /admin/content/faq` - Creează întrebare nouă
- `PATCH /admin/content/faq/:id` - Actualizează întrebare
- `DELETE /admin/content/faq/:id` - Șterge întrebare (soft-delete)

**Permisiuni:**
- `view_content` - Vizualizare FAQ
- `manage_content` sau `manage_journal` - Editare și publicare

**Audit Logging:**
- `FAQ_ENTRY_CREATED` - La creare întrebare
- `FAQ_ENTRY_UPDATED` - La actualizare întrebare
- `FAQ_ENTRY_DELETED` - La ștergere întrebare

---

### 3. Texte & i18n (`/content/i18n`)

**Descriere:** Monitorizare chei de traducere și acoperire multi-limbă.

**Funcționalități:**
- **Statistici:**
  - Total chei
  - Complete (toate limbile)
  - Parțiale (unele limbi lipsesc)
  - Lipsă (majoritatea limbilor lipsesc)

- **Tabel chei:**
  - Key (ex: `actions.add_to_cart`)
  - Text în limba de bază (RO)
  - Status pentru fiecare limbă:
    - ✅ Traducere completă
    - ✅ Limba de bază (RO)
    - ❌ Traducere lipsă

- **Filtre:**
  - Search (după key sau text)
  - Namespace (actions, nav, home, checkout, etc.)

**Implementare:**
- Folosește snapshot static: `admin/src/lib/i18n/keys-snapshot.json`
- Snapshot-ul trebuie actualizat manual prin export din frontend
- Nu permite editare directă (doar monitorizare)

**Permisiuni:**
- `view_content` - Vizualizare chei de traducere

**Notă:** Această pagină este doar pentru monitorizare. Editarea traducerilor se face în frontend sau prin backend API (dacă este implementat).

---

## Limbi suportate

Modulul suportă următoarele limbi:
- **RO** (Română) - Limba de bază
- **EN** (English)
- **FR** (Français)
- **IT** (Italiano)
- **DE** (Deutsch)
- **ES** (Español)
- **UK** (Українська) - Placeholder
- **HU** (Magyar) - Placeholder

**Fallback:** Dacă o traducere lipsește, se folosește limba de bază (RO).

---

## Limitări actuale

### Backend Endpoints

**Status:** Majoritatea endpoint-urilor nu sunt implementate încă.

**Fallback Behavior:**
- Paginile și FAQ-urile afișează mesaje clare când backend lipsește
- UI-ul este complet funcțional, dar datele nu sunt persistate
- Toate endpoint-urile sunt documentate în `ADMIN_BACKEND_GAPS.md`

### Editor de conținut

- Editor simplu (textarea) - nu suportă Markdown sau HTML rich editing
- Nu există preview pentru conținut
- Nu există validare pentru format (HTML/Markdown)

### i18n Monitoring

- Snapshot static - trebuie actualizat manual
- Nu există sincronizare automată cu frontend
- Nu permite editare directă din admin

---

## Proces de actualizare snapshot i18n

Pentru a actualiza snapshot-ul de chei de traducere:

1. **Export din frontend:**
   - Rulează script de export (dacă există) sau
   - Extrage manual cheile din fișierele JSON de traducere

2. **Actualizează snapshot:**
   - Editează `admin/src/lib/i18n/keys-snapshot.json`
   - Adaugă/actualizează cheile și traducerile

3. **Verifică în admin:**
   - Deschide `/content/i18n`
   - Verifică că statisticile sunt actualizate

**Notă:** Vezi `ADMIN_I18N_MONITORING_NOTES.md` pentru detalii despre proces.

---

## RBAC & Permisiuni

### Roluri cu acces

- **superadmin:** Acces complet (view + manage)
- **admin:** Acces complet (view + manage)
- **content:** Acces complet (view + manage)
- **support:** ❌ Fără acces
- **finance:** ❌ Fără acces

### Permisiuni

- `view_content` - Vizualizare pagini, FAQ, i18n
- `manage_content` - Editare și publicare pagini/FAQ

**Notă:** `manage_journal` poate fi folosit ca alternativă pentru `manage_content` (pentru compatibilitate).

---

## Audit Logging

Toate acțiunile critice sunt loggate în audit trail:

### Pagini

- `CONTENT_PAGE_UPDATED` - La salvare draft
  - Metadata: `{ status: 'draft', slug: '...' }`

- `CONTENT_PAGE_STATUS_CHANGED` - La schimbare status
  - Metadata: `{ oldStatus: '...', newStatus: '...', slug: '...' }`

### FAQ

- `FAQ_ENTRY_CREATED` - La creare întrebare
  - Metadata: `{ key: '...', category: '...' }`

- `FAQ_ENTRY_UPDATED` - La actualizare întrebare
  - Metadata: `{ key: '...', status?: '...' }`

- `FAQ_ENTRY_DELETED` - La ștergere întrebare
  - Metadata: `{ key: '...' }`

---

## Endpoint-uri backend necesare

### Pagini

- `GET /admin/content/pages` - Listă pagini
- `GET /admin/content/pages/:id` - Detalii pagină
- `PATCH /admin/content/pages/:id` - Actualizează pagină

### FAQ

- `GET /admin/content/faq` - Listă întrebări
- `POST /admin/content/faq` - Creează întrebare
- `PATCH /admin/content/faq/:id` - Actualizează întrebare
- `DELETE /admin/content/faq/:id` - Șterge întrebare

**Status:** Toate endpoint-urile sunt documentate în `ADMIN_BACKEND_GAPS.md` cu structuri de request/response sugerate.

---

## Best Practices

1. **Editare pagini:**
   - Salvează întotdeauna ca draft înainte de publicare
   - Verifică toate limbile înainte de publicare
   - Folosește slug-uri descriptive și consistente

2. **Gestionare FAQ:**
   - Folosește key-uri descriptive (ex: `faq.delivery.returns`)
   - Organizează întrebările pe categorii
   - Menține ordinea consistentă

3. **Monitorizare i18n:**
   - Actualizează snapshot-ul periodic
   - Identifică cheile cu traduceri lipsă
   - Prioritizează traducerile pentru limbi importante (EN, FR)

---

## Rezumat

### Pagini noi

- ✅ `/content/pages` - Gestionare pagini statice
- ✅ `/content/faq` - Gestionare FAQ
- ✅ `/content/i18n` - Monitorizare traduceri

### Endpoint-uri backend

**Consumate:**
- ❌ Niciun endpoint nu este implementat încă

**TODO (documentate în ADMIN_BACKEND_GAPS.md):**
- `GET /admin/content/pages`
- `GET /admin/content/pages/:id`
- `PATCH /admin/content/pages/:id`
- `GET /admin/content/faq`
- `POST /admin/content/faq`
- `PATCH /admin/content/faq/:id`
- `DELETE /admin/content/faq/:id`

### Protecție RBAC

- ✅ Secțiunea Content este protejată cu `view_content` / `manage_content`
- ✅ Doar rolurile `content`, `admin`, `superadmin` au acces
- ✅ Acțiunile de editare/publicare necesită `manage_content` sau `manage_journal`

### Status implementare

- ✅ UI complet implementat
- ✅ Fallback-uri graceful pentru endpoint-uri lipsă
- ✅ Audit logging pentru toate acțiunile
- ⏳ Așteaptă implementarea endpoint-urilor backend

