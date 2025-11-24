# Journal Multi-Language Implementation Roadmap

**Data:** 2025-01-27  
**Status:** 📋 Planning Phase

---

## 🎯 Obiectiv

Implementare sistem complet multi-language pentru Jurnal de farme.ro, enterprise-ready, cu suport pentru 8 limbi (RO, EN, FR, IT, DE, ES, HU, UK).

---

## 📊 Faze de implementare

### Faza 1: Backend Foundation ✅ (Prioritate: CRITICĂ)

**Durată estimată:** 2-3 zile

#### Tasks

- [ ] **1.1** Adăugare model Prisma `JournalArticleTranslation`
  - [ ] Definire schema în `schema.prisma`
  - [ ] Relație cu `JournalArticle`
  - [ ] Indexuri pentru performanță

- [ ] **1.2** Creare migration database
  - [ ] Migration script
  - [ ] Testare migration
  - [ ] Rollback plan

- [ ] **1.3** Service layer pentru traduceri
  - [ ] `journal-translation.service.ts`
  - [ ] Funcții CRUD
  - [ ] Fallback logic (RO)

- [ ] **1.4** Validare & Security
  - [ ] Slug uniqueness validation
  - [ ] Language validation
  - [ ] Content validation

**Deliverables:**
- ✅ Model Prisma funcțional
- ✅ Migration aplicată
- ✅ Service layer complet

---

### Faza 2: Backend API Endpoints ✅ (Prioritate: CRITICĂ)

**Durată estimată:** 2-3 zile

#### Tasks

- [ ] **2.1** Public API endpoints
  - [ ] `GET /journal?lang=ro` - Listă cu suport lang
  - [ ] `GET /journal/:slug?lang=ro` - Articol cu suport lang
  - [ ] Fallback logic implementat

- [ ] **2.2** Admin API endpoints
  - [ ] `GET /admin/journal/:id/translations`
  - [ ] `POST /admin/journal/:id/translations`
  - [ ] `PATCH /admin/journal/translations/:id`
  - [ ] `DELETE /admin/journal/translations/:id`

- [ ] **2.3** Testing & Documentation
  - [ ] Unit tests
  - [ ] Integration tests
  - [ ] API documentation actualizată

**Deliverables:**
- ✅ Toate endpoint-urile funcționale
- ✅ Fallback logic testat
- ✅ Documentație API completă

---

### Faza 3: Frontend Public Routes 🌐 (Prioritate: HIGH)

**Durată estimată:** 3-4 zile

#### Tasks

- [ ] **3.1** Structură rute localizate
  - [ ] Next.js App Router setup
  - [ ] Rute pentru fiecare limbă
  - [ ] Fallback la RO

- [ ] **3.2** API Integration
  - [ ] Hook `useJournalArticle` cu suport lang
  - [ ] Service layer actualizat
  - [ ] Error handling

- [ ] **3.3** UI Components
  - [ ] Badge "Traducere indisponibilă"
  - [ ] Language Switcher
  - [ ] Fallback indicators

- [ ] **3.4** SEO Implementation
  - [ ] Metadata dinamică per limbă
  - [ ] Schema.org cu @inLanguage
  - [ ] hreflang tags

**Deliverables:**
- ✅ Rute localizate funcționale
- ✅ Fallback UI implementat
- ✅ SEO optimizat

---

### Faza 4: Admin UI 🎨 (Prioritate: HIGH)

**Durată estimată:** 3-4 zile

#### Tasks

- [ ] **4.1** Tab "Translations" în Journal Editor
  - [ ] Listă limbi cu status
  - [ ] Butoane Edit/Create
  - [ ] Indicators pentru traduceri existente

- [ ] **4.2** Translation Editor
  - [ ] Drawer/Modal pentru editare
  - [ ] WYSIWYG editor pentru content
  - [ ] Câmpuri: title, slug, excerpt, content, metaTitle, metaDescription
  - [ ] Status dropdown

- [ ] **4.3** Sync with RO Feature
  - [ ] Buton "Sincronizează cu RO"
  - [ ] Logic pentru copiere conținut
  - [ ] Confirmare UX

- [ ] **4.4** API Integration
  - [ ] GET translations
  - [ ] POST/PATCH translation
  - [ ] DELETE translation
  - [ ] Sync with RO API call

**Deliverables:**
- ✅ UI complet pentru gestionare traduceri
- ✅ Editor funcțional
- ✅ Sync feature implementat

---

### Faza 5: Sitemap & SEO Advanced 🗺️ (Prioritate: MEDIUM)

**Durată estimată:** 1-2 zile

#### Tasks

- [ ] **5.1** Sitemap dinamic
  - [ ] Include toate versiunile lingvistice
  - [ ] hreflang alternates
  - [ ] lastModified per traducere

- [ ] **5.2** SEO Enhancements
  - [ ] Canonical URLs per limbă
  - [ ] OpenGraph tags per limbă
  - [ ] Twitter Cards per limbă

**Deliverables:**
- ✅ Sitemap complet
- ✅ SEO optimizat per limbă

---

### Faza 6: Testing & Polish 🧪 (Prioritate: MEDIUM)

**Durată estimată:** 2-3 zile

#### Tasks

- [ ] **6.1** Unit Tests
  - [ ] Backend services
  - [ ] Frontend hooks
  - [ ] Admin components

- [ ] **6.2** Integration Tests
  - [ ] API endpoints
  - [ ] Fallback scenarios
  - [ ] Multi-language flows

- [ ] **6.3** E2E Tests
  - [ ] Public routes
  - [ ] Admin translation management
  - [ ] Language switching

- [ ] **6.4** Performance
  - [ ] Database queries optimization
  - [ ] Caching strategy
  - [ ] Load testing

**Deliverables:**
- ✅ Test coverage >80%
- ✅ Performance optimizat
- ✅ Bug fixes

---

## 📅 Timeline estimat

| Faza | Durată | Start | End |
|------|--------|-------|-----|
| Faza 1: Backend Foundation | 2-3 zile | T+0 | T+3 |
| Faza 2: Backend API | 2-3 zile | T+3 | T+6 |
| Faza 3: Frontend Routes | 3-4 zile | T+6 | T+10 |
| Faza 4: Admin UI | 3-4 zile | T+10 | T+14 |
| Faza 5: Sitemap & SEO | 1-2 zile | T+14 | T+16 |
| Faza 6: Testing & Polish | 2-3 zile | T+16 | T+19 |

**Total estimat:** 13-19 zile lucrătoare (~3-4 săptămâni)

---

## 🚨 Blockers & Dependencies

### Blockers

- **Faza 1 → Faza 2:** Necesită model Prisma complet
- **Faza 2 → Faza 3:** Necesită API endpoints funcționale
- **Faza 3 → Faza 4:** Necesită rute frontend funcționale
- **Faza 4 → Faza 5:** Necesită UI complet

### Dependencies

- **WYSIWYG Editor:** Necesită librărie (ex: TipTap, Quill)
- **i18n Context:** Necesită context i18n existent în frontend
- **Database Migration:** Necesită downtime planificat

---

## ✅ Definition of Done

### Backend

- [ ] Model Prisma creat și migrat
- [ ] Toate endpoint-urile funcționale
- [ ] Fallback logic testat
- [ ] Validare completă
- [ ] Documentație API completă

### Frontend Public

- [ ] Rute localizate funcționale
- [ ] Fallback UI implementat
- [ ] SEO optimizat
- [ ] Language Switcher funcțional
- [ ] Sitemap complet

### Admin UI

- [ ] Tab Translations funcțional
- [ ] Editor traducere complet
- [ ] Sync cu RO funcțional
- [ ] Status management funcțional
- [ ] Validare și error handling

### Testing

- [ ] Unit tests >80% coverage
- [ ] Integration tests pentru toate flows
- [ ] E2E tests pentru scenarii critice
- [ ] Performance testat

### Documentation

- [ ] Backend API spec complet
- [ ] Frontend implementation guide
- [ ] Admin UI guide
- [ ] Roadmap actualizat

---

## 🎯 Success Metrics

1. **Funcționalitate:**
   - ✅ Toate cele 8 limbi suportate
   - ✅ Fallback la RO funcțional
   - ✅ Admin UI complet funcțional

2. **Performance:**
   - ✅ API response time <200ms
   - ✅ Page load time <2s
   - ✅ Database queries optimizate

3. **SEO:**
   - ✅ Sitemap complet cu toate versiunile
   - ✅ hreflang tags corecte
   - ✅ Metadata optimizată per limbă

4. **UX:**
   - ✅ Language switcher intuitiv
   - ✅ Badge fallback clar
   - ✅ Editor traducere user-friendly

---

## 📚 Documentație

- ✅ `backend/docs/JOURNAL_TRANSLATIONS_API_SPEC.md` - API Specification
- ✅ `frontend/docs/JOURNAL_I18N_IMPLEMENTATION.md` - Frontend Guide
- ✅ `admin/docs/JOURNAL_TRANSLATION_UI.md` - Admin UI Guide
- ✅ `JOURNAL_I18N_ROADMAP.md` - Acest roadmap

---

## 🔄 Next Steps

1. **Review & Approval:** Review roadmap cu echipa
2. **Kickoff Faza 1:** Începere implementare backend
3. **Daily Standups:** Tracking progres zilnic
4. **Testing Early:** Testing în paralel cu development
5. **Documentation:** Documentație actualizată continuu

---

**Status:** 📋 Ready for Implementation  
**Last Updated:** 2025-01-27

