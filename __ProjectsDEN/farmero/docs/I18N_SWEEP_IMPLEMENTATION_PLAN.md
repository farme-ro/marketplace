# Frontend i18n Sweep - Implementation Plan

**Data:** 2025-01-27  
**Status:** 🚧 In Progress

---

## 📋 Obiectiv

Completarea traducerilor pentru toate limbile (RO, EN, FR, IT, DE, ES, UK, HU) cu accent pe:
- URL-uri rămân în română (brand signature)
- Conținut, meta, SEO, butoane, label-uri traduse
- Eliminare placeholder-uri `@@AUTO@@`
- Mutare stringuri hardcodate în i18n

---

## 🔍 Status Actual

### Traduceri existente

- **RO:** 2592 keys ✅ (complet)
- **EN:** 2020 keys ⚠️ (lipsesc ~572 keys)
- **FR:** ~3000 keys ⚠️ (multe `@@AUTO@@` placeholders)
- **IT:** ~3000 keys ⚠️ (multe `@@AUTO@@` placeholders)
- **DE:** ~3200 keys ⚠️ (multe `@@AUTO@@` placeholders)
- **ES:** ~3000 keys ⚠️ (multe `@@AUTO@@` placeholders)
- **UK:** ~3100 keys ⚠️ (machine-translated, draft status)
- **HU:** ~3100 keys ⚠️ (machine-translated, draft status)

### Probleme identificate

1. **Placeholder-uri `@@AUTO@@`:** Multe traduceri au placeholder-uri care trebuie înlocuite
2. **Keys lipsă:** EN lipsește ~572 keys față de RO
3. **URL-uri:** Un URL greșit găsit în footer (`/about` → `/despre-noi`)
4. **Stringuri hardcodate:** Trebuie identificate și mutate în i18n

---

## 📝 Plan de Implementare

### Faza 1: Verificare & Corecții URL-uri ✅ (În progres)

- [x] Verificare toate fișierele pentru URL-uri englezești
- [x] Corectare `/about` → `/despre-noi` în footer
- [ ] Verificare link-uri în navbar
- [ ] Verificare link-uri în mega menu
- [ ] Verificare link-uri în mobile menu
- [ ] Verificare link-uri în card-uri și CTA-uri
- [ ] Verificare link-uri în pagini de eroare

### Faza 2: Inventar & Consolidare Keys

- [ ] Identificare toate keys folosite în cod
- [ ] Comparare cu keys existente în RO
- [ ] Identificare keys lipsă
- [ ] Normalizare structură keys (common.*, nav.*, footer.*, etc.)
- [ ] Eliminare duplicate

### Faza 3: Completare Traduceri EN

- [ ] Adăugare keys lipsă în EN
- [ ] Traducere keys noi în EN
- [ ] Verificare consistență ton & stil

### Faza 4: Eliminare Placeholder-uri FR, IT, DE, ES

- [ ] Identificare toate placeholder-urile `@@AUTO@@`
- [ ] Traducere placeholder-uri FR
- [ ] Traducere placeholder-uri IT
- [ ] Traducere placeholder-uri DE
- [ ] Traducere placeholder-uri ES
- [ ] Verificare consistență

### Faza 5: Traduceri UK & HU

- [ ] Review traduceri UK (machine-translated)
- [ ] Corectare & rafinare UK
- [ ] Review traduceri HU (machine-translated)
- [ ] Corectare & rafinare HU

### Faza 6: Mutare Stringuri Hardcodate

- [ ] Identificare stringuri hardcodate în homepage
- [ ] Identificare stringuri hardcodate în navigation
- [ ] Identificare stringuri hardcodate în portaluri
- [ ] Identificare stringuri hardcodate în Jurnal
- [ ] Mutare în i18n cu keys corespunzătoare

### Faza 7: hreflang & SEO

- [ ] Verificare hreflang tags pentru homepage
- [ ] Verificare hreflang tags pentru /produse
- [ ] Verificare hreflang tags pentru /producatori
- [ ] Verificare hreflang tags pentru /despre-noi
- [ ] Verificare hreflang tags pentru /jurnal-de-farmero
- [ ] Verificare hreflang tags pentru /sustine-farmero

### Faza 8: Accessibility & ARIA Labels

- [ ] Verificare aria-label-uri pentru theme toggle
- [ ] Verificare aria-label-uri pentru language switcher
- [ ] Verificare aria-label-uri pentru cart
- [ ] Verificare aria-label-uri pentru notificări
- [ ] Verificare aria-label-uri pentru favorite
- [ ] Verificare aria-label-uri pentru account

### Faza 9: QA Final

- [ ] Test homepage în toate limbile
- [ ] Test /produse în toate limbile
- [ ] Test /producatori în toate limbile
- [ ] Test /portal-producatori în toate limbile
- [ ] Test /jurnal-de-farmero în toate limbile
- [ ] Verificare fallback-uri
- [ ] Verificare build: `npm run lint`, `npm run build`

---

## 🎯 Priorizare

### Critic (P0)
1. ✅ Corecții URL-uri
2. Completare keys EN lipsă
3. Eliminare placeholder-uri `@@AUTO@@` pentru secțiuni critice (nav, footer, common)

### Important (P1)
4. Traduceri complete FR, IT, DE, ES
5. Mutare stringuri hardcodate critice
6. hreflang & SEO pentru pagini principale

### Nice to Have (P2)
7. Traduceri rafinate UK & HU
8. ARIA labels complete
9. QA exhaustiv

---

## 📊 Metrici

- **Keys totale RO:** 2592
- **Keys EN complete:** 2020 / 2592 (78%)
- **Keys EN de completat:** 572
- **Placeholder-uri `@@AUTO@@` estimate:** ~500-800 per limbă (FR, IT, DE, ES)
- **URL-uri corectate:** 1 / ~10-20 estimate

---

## 🔗 Referințe

- `frontend/src/lib/i18n/translations/*.json` - Fișiere traduceri
- `frontend/src/lib/routes.ts` - Rute centralizate
- `frontend/src/lib/i18n/context.tsx` - Context i18n
- `frontend/src/lib/i18n/config.ts` - Config limbi suportate

---

**Last Updated:** 2025-01-27

