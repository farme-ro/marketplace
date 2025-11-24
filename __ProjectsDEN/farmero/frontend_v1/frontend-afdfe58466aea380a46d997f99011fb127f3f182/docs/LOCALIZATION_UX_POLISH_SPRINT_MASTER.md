# 🌍 Localization & UX Polish Sprint - Master Plan

**Data:** 2025-01-27  
**Status:** 🟡 **În progres**

---

## 📋 Preambul

Acest document acoperă toate cele 6 prompturi pentru localizare și UX polish:
- **L1** - i18n Cleanup: Eliminare texte hardcodate
- **L2** - Audit traduceri EFIGS + rafinare stil
- **L3** - Meta SEO Localization
- **L4** - UX Text Consistency & Tone
- **L5** - Formate locale (date, sume, unități)
- **L6** - Accessibility + Localization

---

## ✅ L1 - i18n Cleanup: Eliminare texte hardcodate

### Status: 🟡 **În progres**

### Implementat:
- ✅ Creat namespace-uri noi: `ui.*`, `errors.*`, `emptyStates.*`, `notifications.*`
- ✅ Migrat texte hardcodate din `orders/page.tsx`
- ✅ Adăugat traduceri în `ro.json`

### Rămas de făcut:
- [ ] Migrat texte hardcodate din portale (producer, business, logistics, investor)
- [ ] Migrat texte hardcodate din componente UI
- [ ] Migrat texte hardcodate din checkout/cart
- [ ] Adăugat traduceri pentru EN, FR, IT, ES, DE pentru namespace-urile noi

### Raport detaliat:
Vezi `docs/LOCALIZATION_SPRINT_L1_REPORT.md`

---

## ⏳ L2 - Audit traduceri EFIGS + rafinare stil

### Status: ⏳ **Pending**

### Obiectiv:
Îmbunătățirea calității traducerilor pentru EN, FR, IT, ES, DE, nu doar traducere literală.

### Plan:
1. **Audit traduceri existente:**
   - Identifică formulări care par traduse mot-a-mot din română
   - Verifică ton natural, lizibilitate, claritate UX

2. **Optimizare:**
   - Rescrie expresii pentru ton natural
   - Păstrează ton prietenos, uman, empatic
   - Evită limbaj excesiv de tehnic

3. **Raportare:**
   - Listează chei modificate
   - Identifică limba care necesită cele mai multe intervenții

### Fișiere de verificat:
- `src/lib/i18n/translations/en.json`
- `src/lib/i18n/translations/fr.json`
- `src/lib/i18n/translations/it.json`
- `src/lib/i18n/translations/es.json`
- `src/lib/i18n/translations/de.json`

---

## ⏳ L3 - Meta SEO Localization

### Status: ⏳ **Pending**

### Obiectiv:
Optimizare meta tags pentru paginile principale în toate limbile.

### Pagini de optimizat:
- [ ] Homepage (`/`)
- [ ] Products (`/products`)
- [ ] Producers (`/producers`)
- [ ] About (`/about`)
- [ ] Fees (`/fees`)
- [ ] Sustine-farmero (`/sustine-farmero`)

### Cerințe:
- Meta title unic, natural în limba respectivă (max 60 caractere)
- Meta description adaptat cultural (max 160 caractere)
- Evitarea traducerilor brute
- Keywords relevante pentru marketplace local
- Formulări SEO-friendly dar umane

### Implementare:
Next.js suportă `generateMetadata` cu locale. Trebuie să:
1. Creez funcții helper pentru meta tags per limbă
2. Actualizez `generateMetadata` în fiecare pagină
3. Adaug traduceri pentru meta tags în i18n

### Exemplu:
```typescript
export async function generateMetadata({ 
  params 
}: { 
  params: { locale: string } 
}): Promise<Metadata> {
  const { t } = await getI18n(params.locale)
  
  return {
    title: t('meta.homepage.title', 'farme.ro - Marketplace pentru produse agricole tradiționale'),
    description: t('meta.homepage.description', 'Descoperă produse agricole tradiționale și bio de la producători locali din România.'),
  }
}
```

---

## ⏳ L4 - UX Text Consistency & Tone

### Status: ⏳ **Pending**

### Obiectiv:
Uniformizarea tonului mesajelor în aplicație.

### Zone de verificat:
- [ ] Empty states
- [ ] Success messages
- [ ] Error messages
- [ ] Fallback messages

### Cerințe:
- Ton coerent: cald, încurajator, orientat spre soluție
- Fără mesaje pasiv-agresive sau seci
- Folosirea persoanei a II-a singular ("Poți", "Alege", "Continuă")
- Rescriere mesaje prea reci sau tehnice cu empatie UX

### Implementare:
1. Audit mesaje existente
2. Identifică inconsistențe de ton
3. Rescrie mesaje pentru consistență
4. Adaugă în i18n cu namespace `ux.*`

---

## ⏳ L5 - Formate locale (date, sume, unități)

### Status: ⏳ **Pending**

### Obiectiv:
Pregătire pentru localizare avansată cu formate locale.

### Audit necesar:
- [ ] Verifică afișarea date/ore
- [ ] Verifică afișarea sumelor de bani
- [ ] Verifică afișarea unităților de măsură

### Propunere:
Sistem centralizat pentru formatarea locale-aware:
- `formatCurrency(locale, amount)` - Formatare sume
- `formatDate(locale, date)` - Formatare date
- `formatTime(locale, time)` - Formatare ore
- `formatUnit(locale, unit)` - Formatare unități

### Locații identificate:
- `src/app/(site)/orders/page.tsx` - `order.total.toFixed(2) lei`
- `src/app/(site)/orders/[id]/page.tsx` - Formate date
- `src/app/(site)/account/subscriptions/page.tsx` - Formate date
- `src/components/**/*.tsx` - Formate în componente

### Implementare:
1. Creez `src/lib/utils/locale-formatting.ts`
2. Implementez funcții helper
3. Înlocuiesc formate hardcodate cu funcții helper
4. Adaug suport pentru toate locale-urile (ro, en, fr, it, es, de)

---

## ⏳ L6 - Accessibility + Localization

### Status: ⏳ **Pending**

### Obiectiv:
Îmbunătățiri accesibilitate în context i18n.

### Verificări:
- [ ] `aria-label` pentru butoane icon-only în toate limbile
- [ ] `alt` text pentru imagini importante
- [ ] Coerența textelor pentru screen reader
- [ ] Lipsa fallback-urilor englezești în mod RO

### Implementare:
1. Audit componente cu butoane icon-only
2. Verifică `aria-label` în toate limbile
3. Adaugă traduceri pentru `aria-label` în i18n
4. Verifică `alt` text pentru imagini
5. Testează cu screen reader

### Namespace propus:
- `aria.*` - Aria labels pentru toate componentele
- `alt.*` - Alt text pentru imagini

---

## 📊 Status General

| Prompt | Status | Progres |
|--------|--------|---------|
| L1 | 🟡 În progres | 30% - Namespace-uri create, migrare în curs |
| L2 | ⏳ Pending | 0% - Neînceput |
| L3 | ⏳ Pending | 0% - Neînceput |
| L4 | ⏳ Pending | 0% - Neînceput |
| L5 | ⏳ Pending | 0% - Neînceput |
| L6 | ⏳ Pending | 0% - Neînceput |

---

## 🎯 Prioritate Implementare

### Faza 1 (Critică):
1. **L1** - Finalizare migrare texte hardcodate (portale, componente)
2. **L3** - Meta SEO pentru homepage și pagini principale

### Faza 2 (Importantă):
3. **L2** - Audit și rafinare traduceri EFIGS
4. **L4** - UX Text Consistency & Tone

### Faza 3 (Nice to have):
5. **L5** - Formate locale (date, sume, unități)
6. **L6** - Accessibility + Localization

---

## 📝 Note

- **NU blochează lansarea** - Toate acestea pot fi făcute incremental
- **NU afectează structura tehnică** - Doar conținut și traduceri
- **Aduce nivel de calitate premium** - Coerență internațională și experiență matură

---

**Document generat:** 2025-01-27  
**Status:** 🟡 **În progres** - L1 început, L2-L6 planificate

