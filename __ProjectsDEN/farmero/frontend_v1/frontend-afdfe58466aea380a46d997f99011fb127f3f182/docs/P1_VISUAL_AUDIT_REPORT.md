# 📊 P1 - Audit Vizual Cross-Page - Raport

**Data:** 2025-01-27  
**Status:** 🔄 **În progres**

---

## 🎯 Obiectiv

Uniformizarea stilului vizual în întreaga aplicație pentru o experiență coerentă și premium.

---

## 🔍 Inconsistențe Identificate

### 1. Font Consistency

#### Page Titles (H1)
- ❌ **Inconsistent:** 
  - Mobile: `text-2xl` (Orders, Products) vs `text-3xl` (Subscriptions, Documents)
  - Desktop: `text-3xl md:text-4xl` (majoritatea) vs `text-3xl` (Producer Products)
  - Unele folosesc `font-bold`, altele `font-semibold`

#### Section Titles (H2)
- ❌ **Inconsistent:**
  - `text-2xl md:text-3xl` (homepage) vs `text-xl` (Business Portal Documents)
  - Unele folosesc `font-semibold`, altele `font-bold`

#### Card Titles (H3)
- ❌ **Inconsistent:**
  - `text-base` (Producer Card) vs `text-lg` (Product Card) vs `text-xl` (Producer Products)
  - Unele folosesc `font-semibold`, altele `font-bold`

**Standard recomandat:**
- Page Title: `text-3xl md:text-4xl font-bold tracking-tight` (consistent)
- Section Title: `text-2xl md:text-3xl font-semibold tracking-tight`
- Card Title: `text-base md:text-lg font-semibold`

---

### 2. Card Design Consistency

#### Border Radius
- ❌ **Inconsistent:**
  - `rounded-2xl` (FarmeroCard standard)
  - `rounded-[32px]` (ProductCard, DashboardKpiCard)
  - `rounded-xl` (DocumentCenter, Cookie Preferences)
  - `rounded-lg` (unele componente)

**Standard recomandat:**
- Standard cards: `rounded-2xl` (16px)
- Premium cards (homepage): `rounded-[32px]` (32px) - doar pentru carduri speciale
- Small cards: `rounded-xl` (12px)

#### Shadow
- ❌ **Inconsistent:**
  - `shadow-sm` (FarmeroCard default)
  - `shadow-premium` (ProductCard, DashboardKpiCard) - custom shadow
  - `shadow-md` (unele componente)
  - `shadow-lg` (Cookie Banner)

**Standard recomandat:**
- Default: `shadow-sm hover:shadow-md`
- Elevated: `shadow-md hover:shadow-lg`
- Premium: `shadow-premium hover:shadow-premium-lg` (doar pentru homepage cards)

#### Padding
- ❌ **Inconsistent:**
  - `p-4` (Producer Card)
  - `p-6` (Dashboard KPI Card)
  - `p-6 md:p-8` (FarmeroCardContent default)
  - `p-5 md:p-6` (Producer Card modern)

**Standard recomandat:**
- Small: `p-4 md:p-5`
- Medium: `p-6 md:p-8` (default)
- Large: `p-8 md:p-10`

---

### 3. Icon Consistency

#### Icon Sizing
- ❌ **Inconsistent:**
  - Dashboard KPI: `w-12 h-12` cu `text-2xl` (emoji)
  - CardIcon component: `w-20 h-20 md:w-24 md:h-24` (md)
  - DocumentCenter: `w-10 h-10` cu `w-5 h-5` icon
  - Producer Card: `w-16 h-16 md:w-20 md:h-20` (avatar)

**Standard recomandat:**
- Folosirea `CardIcon` component pentru icon-uri în carduri
- Size-uri: `sm` (w-12 h-12), `md` (w-20 h-20 md:w-24 md:h-24), `lg` (w-28 h-28 md:w-32 md:h-32)

#### Icon Positioning
- ✅ **Mostly consistent** - icon-urile sunt bine poziționate în majoritatea cazurilor

---

### 4. Spacing & Layout Rhythm

#### Section Spacing
- ❌ **Inconsistent:**
  - Unele secțiuni folosesc `py-12 md:py-16`
  - Altele folosesc `py-8 md:py-12`
  - Altele folosesc `mb-6`, `mb-12`, etc.

**Standard recomandat:**
- Large sections: `py-12 md:py-16 lg:py-20`
- Medium sections: `py-8 md:py-12`
- Small sections: `py-6 md:py-8`

#### Card Grid Spacing
- ❌ **Inconsistent:**
  - `gap-4` (unele grid-uri)
  - `gap-4 lg:gap-6` (standard)
  - `gap-6` (unele grid-uri)

**Standard recomandat:**
- Default: `gap-4 lg:gap-6`
- Large: `gap-6 lg:gap-8`

---

### 5. Dark Mode Visual Optimization

#### Contrast Issues
- ⚠️ **Necesită verificare:**
  - Producer Card folosește `dark:bg-[#0B1220]` (hardcoded)
  - Unele componente folosesc `dark:bg-slate-800/50` (hardcoded)
  - Trebuie folosite variabilele de theme (`bg-card`, `bg-background`)

**Standard recomandat:**
- Folosirea variabilelor de theme: `bg-card`, `bg-background`, `bg-muted`
- Evitarea culorilor hardcodate pentru dark mode

---

## ✅ Acțiuni de Uniformizare

### 1. Typography
- [ ] Creează helper functions pentru typography classes
- [ ] Actualizează toate page titles să folosească `typography.pageTitle.base`
- [ ] Actualizează toate section titles să folosească `typography.sectionTitle.base`
- [ ] Actualizează toate card titles să folosească `typography.cardTitle.base`

### 2. Card Design
- [ ] Migrează toate cardurile să folosească `FarmeroCard` component
- [ ] Uniformizează border radius (majoritatea `rounded-2xl`, doar homepage cards `rounded-[32px]`)
- [ ] Uniformizează shadow (majoritatea `shadow-sm`, homepage cards `shadow-premium`)
- [ ] Uniformizează padding folosind `FarmeroCardContent` cu padding prop

### 3. Icons
- [ ] Migrează icon-urile din carduri să folosească `CardIcon` component
- [ ] Uniformizează sizing folosind size props (`sm`, `md`, `lg`)

### 4. Spacing
- [ ] Folosește `spacing.section.*` pentru spacing între secțiuni
- [ ] Uniformizează grid gap folosind `spacing.grid.*`

### 5. Dark Mode
- [ ] Înlocuiește culorile hardcodate cu variabile de theme
- [ ] Verifică contrast în dark mode pentru toate componentele

---

## 📋 Fișiere de Modificat

### Prioritate Înaltă
1. `src/app/(site)/producer-portal/orders/page.tsx` - Page title inconsistency
2. `src/app/(site)/producer-portal/products/page.tsx` - Page title inconsistency
3. `src/components/producers/producer-card.tsx` - Card design inconsistency
4. `src/components/ui/product-card.tsx` - Border radius inconsistency
5. `src/app/(site)/producer-portal/dashboard/_components/dashboard-kpi-card.tsx` - Icon inconsistency

### Prioritate Medie
6. `src/components/documents/document-center.tsx` - Card design, icon inconsistency
7. `src/app/(site)/business-portal/documents/page.tsx` - Typography inconsistency
8. `src/app/(site)/account/subscriptions/page.tsx` - Typography consistency

---

## 🎯 Rezultat Așteptat

După uniformizare:
- ✅ Toate paginile folosesc aceleași clase de typography
- ✅ Toate cardurile folosesc `FarmeroCard` sau stiluri echivalente
- ✅ Icon-urile sunt uniforme și folosesc `CardIcon` component
- ✅ Spacing-ul este consistent între secțiuni
- ✅ Dark mode este optimizat și folosește variabile de theme

---

**Status:** 🔄 **În progres**  
**Următorul pas:** Uniformizare typography și card design

