# 🎨 Farmero Visual Guidelines

**Versiune:** 1.0  
**Data:** 2025-01-27  
**Status:** ✅ **Active**

---

## 📋 Preambul

Acest document definește regulile de design și stil pentru aplicația Farmero, asigurând o experiență vizuală coerentă și recognoscibilă în toată aplicația.

---

## 🎯 Principii de Design

### 1. **Cald & Uman**
- Mesaje empatic, nu robotic
- Tone of voice prietenos și încurajator
- Microcopy clar și direct

### 2. **Consistență Vizuală**
- Același stil de carduri peste tot
- Icon-uri uniforme (Lucide React)
- Badge-uri standardizate
- Spacing și tipografie consistente

### 3. **Accesibilitate**
- Focus states clare și vizibile
- Contrast corespunzător
- Suport pentru `prefers-reduced-motion`
- ARIA labels și semantic HTML

### 4. **Modern & Rafinat**
- Micro-interacțiuni subtile
- Tranziții lineare
- Shadow și depth consistent
- Dark/Light mode armonios

---

## 🎨 Paleta de Culori

### Light Mode
- **Background:** Verde pastel cald (`#F3F7F4`)
- **Card:** Alb pur (`#FFFFFF`)
- **Primary:** Verde Farmero (`hsl(136, 53%, 42%)`)
- **Secondary:** Terracotta soft (`hsl(15, 55%, 55%)`)
- **Muted:** Verde deschis cald (`#E7F0EA`)

### Dark Mode
- **Background:** Verde de seară cald (`#1F2E28`)
- **Card:** Verde mai deschis (`#24352E`)
- **Primary:** Terracotta (`hsl(15, 55%, 60%)`)
- **Secondary:** Verde accent (`hsl(136, 50%, 50%)`)
- **Muted:** Verde elevat (`#2C3F36`)

---

## 📐 Tipografie

### Titluri de Pagină (H1)
```tsx
className="text-3xl md:text-4xl font-bold tracking-tight text-foreground"
```
- **Mobile:** `text-3xl` (30px)
- **Desktop:** `text-4xl` (36px)
- **Line-height:** `1.25` (tight)
- **Letter-spacing:** `-0.5px`

### Titluri de Secțiune (H2)
```tsx
className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground"
```
- **Mobile:** `text-2xl` (24px)
- **Desktop:** `text-3xl` (30px)
- **Line-height:** `1.3`

### Titluri de Card (H3)
```tsx
className="text-lg font-semibold text-foreground"
```
- **Size:** `text-lg` (18px)
- **Weight:** `font-semibold`

### Body Text
```tsx
className="text-base text-foreground-body leading-relaxed"
```
- **Size:** `text-base` (16px)
- **Line-height:** `1.5` (relaxed)

### Text Secundar
```tsx
className="text-sm text-muted-foreground"
```
- **Size:** `text-sm` (14px)
- **Color:** `text-muted-foreground`

**Regulă:** Nu folosi fonturi mai mari decât `text-4xl` pentru titluri de pagină, pentru a evita cuvinte izolate pe rând.

---

## 🎴 Carduri

### Standard Card
```tsx
import { FarmeroCard } from '@/components/ui/farmero-card'
import { CardHover } from '@/components/ui/motion/card-hover'

<CardHover intensity="normal">
  <FarmeroCard>
    {/* Card content */}
  </FarmeroCard>
</CardHover>
```

**Caracteristici:**
- Border-radius: `rounded-2xl` (16px)
- Shadow: `shadow-sm` → `shadow-lg` pe hover
- Padding: `p-6` (24px)
- Border: `border-border`
- Background: `bg-card`

### Card Hover Animation
- **Subtle:** `translateY(-2px)`
- **Normal:** `translateY(-4px)` (default)
- **Strong:** `translateY(-6px)`
- **Duration:** `200ms`
- **Easing:** `easeOut`

---

## 🏷️ Badge-uri

### Status Badge
```tsx
import { StatusBadge } from '@/components/ui/status-badge'

<StatusBadge 
  label="Livrat" 
  variant="success" 
  size="md" 
/>
```

**Variante:**
- `success` - Verde (livrat, confirmat)
- `pending` - Galben (în așteptare)
- `warning` - Amber (atenție)
- `error` - Roșu (eroare, anulat)
- `info` - Albastru (informație)
- `processing` - Primary (în procesare)
- `delivered` - Verde (livrat)
- `cancelled` - Gri (anulat)

**Size-uri:**
- `sm` - `px-2 py-0.5 text-xs`
- `md` - `px-3 py-1 text-xs` (default)
- `lg` - `px-4 py-1.5 text-sm`

**Styling:**
- Border-radius: `rounded-full`
- Border: culoare variantă cu opacitate
- Icon: inclus automat dacă nu este specificat altul

---

## 🎭 Empty States

### EmptyState Component
```tsx
import { EmptyState } from '@/components/ui/empty-state'
import { Package } from 'lucide-react'

<EmptyState
  icon={Package}
  illustration="empty-orders"
  title="Momentan nu ai comenzi"
  description="Începe să cumperi pentru a vedea comenzile tale aici."
  action={{
    label: "Vezi produsele",
    href: "/products"
  }}
/>
```

**Cazuri Standard:**
1. **No Orders** - `icon={Package}`, `illustration="empty-orders"`
2. **No Products** - `icon={Package}`, `illustration="empty-products"`
3. **No Subscriptions** - `icon={Package}`, `illustration="empty-subscriptions"`
4. **No Campaigns** - `icon={Package}`, `illustration="empty-campaigns"`

**Pattern:**
- Titlu empatic (ex: "Momentan nu ai comenzi")
- Descriere încurajatoare
- Buton CTA clar

---

## 🔔 Mesaje de Stare

### AlertMessage Component
```tsx
import { AlertMessage } from '@/components/ui/alert-message'

<AlertMessage
  variant="success"
  title="Succes!"
  description="Modificările au fost salvate cu succes."
/>
```

**Variante:**
- `success` - Verde, icon `CheckCircle2`
- `warning` - Amber, icon `AlertCircle`
- `error` - Roșu, icon `XCircle`
- `info` - Albastru, icon `Info`

**Styling:**
- Icon + border left color (`border-l-4`)
- Background soft
- Padding: `p-4`

---

## ⏳ Loading States

### Skeleton Loaders
```tsx
import { Skeleton, SkeletonCard, SkeletonProductCard, SkeletonDashboardStats } from '@/components/ui/skeleton-loader'

<Skeleton variant="text" width="100%" height={16} />
<SkeletonCard />
<SkeletonProductCard />
<SkeletonDashboardStats />
```

**Variante:**
- `text` - Pentru text lines
- `circular` - Pentru avatare, icon-uri
- `rectangular` - Pentru imagini, blocuri
- `card` - Pentru carduri complete

**Pre-configured:**
- `SkeletonCard` - Carduri generice
- `SkeletonProductCard` - Product grid
- `SkeletonDashboardStats` - KPI cards

**Styling:**
- Background: `bg-muted`
- Animation: `animate-pulse` (subtle)

---

## 🎬 Micro-interacțiuni

### Card Hover
```tsx
import { CardHover } from '@/components/ui/motion/card-hover'

<CardHover intensity="normal">
  <Card>...</Card>
</CardHover>
```

### Button Press
```tsx
import { ButtonPress } from '@/components/ui/motion/button-press'

<ButtonPress onClick={handleClick}>
  <Button>Salvează</Button>
</ButtonPress>
```

**Caracteristici:**
- **Card Hover:** `translateY(-4px)` + shadow crescut
- **Button Press:** `scale(0.97)` când este apăsat
- **Duration:** `100-200ms`
- **Easing:** `easeOut` / `easeInOut`
- **Respectă:** `prefers-reduced-motion`

---

## 🎨 Icon-uri

### Icon Set
- **Librărie:** Lucide React Icons
- **Stroke Width:** Consistent (1.5-2px)

### Size Standard
- **Small:** `w-4 h-4` (16px)
- **Medium:** `w-5 h-5` (20px)
- **Large:** `w-6 h-6` (24px)

### CardIcon Component
```tsx
import { CardIcon } from '@/components/ui/card-icon'
import { Package } from 'lucide-react'

<CardIcon icon={Package} size="md" />
```

**Styling:**
- Background: `bg-accent/10`
- Border-radius: `rounded-full`
- Padding: consistent
- Centrat vertical și orizontal

**Regulă:** Folosește același set (Lucide) peste tot, nu amesteca cu alte icon sets.

---

## 🎯 Focus States

### Standard Focus Ring
```tsx
import { focusRing } from '@/lib/design-system/focus'

<button className={cn('...', focusRing)}>
  Button
</button>
```

**Class:**
```
focus:outline-none
focus:ring-2
focus:ring-primary
focus:ring-offset-2
focus:ring-offset-background
```

### Interactive Elements
```tsx
import { focusRingInteractive } from '@/lib/design-system/focus'

<a className={cn('...', focusRingInteractive)}>
  Link
</a>
```

### Form Inputs
```tsx
import { focusRingInput } from '@/lib/design-system/focus'

<input className={cn('...', focusRingInput)} />
```

**Regulă:** Focus states trebuie să fie vizibile, nu doar culoare subtilă.

---

## 📏 Spacing

### Container
```tsx
import { container } from '@/lib/design-system/grid'

<div className={container}>
  {/* Content */}
</div>
```
- Max-width: `max-w-7xl`
- Padding: `px-4 sm:px-6 lg:px-8`
- Centrat: `mx-auto`

### Section Spacing
```tsx
import { sectionSpacing } from '@/lib/design-system/grid'

<section className={sectionSpacing.vertical}>
  {/* Content */}
</section>
```
- **vertical:** `py-12 md:py-16 lg:py-20` (default)
- **verticalSmall:** `py-8 md:py-12`
- **verticalLarge:** `py-16 md:py-24 lg:py-32`

### Grid Gaps
```tsx
import { gridGap } from '@/lib/design-system/grid'

<div className={cn('grid grid-cols-3', gridGap.medium)}>
  {/* Grid items */}
</div>
```
- **small:** `gap-3`
- **medium:** `gap-4 lg:gap-6` (default)
- **large:** `gap-6 lg:gap-8`

---

## 🌓 Dark/Light Mode

### Theme Switch
- Tranziții lineare pentru schimbarea temei
- Duration: `200-300ms`
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`

### Implementation
```tsx
// Theme transitions in globals.css
* {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
```

**Regulă:** Toate componentele trebuie să arate armonios în ambele moduri.

---

## 📝 Microcopy

### Tone of Voice
- **Cald:** "Hai să adaugi primul produs" (nu "Adaugă produs")
- **Clar:** "Salvează modificările" (nu "Submit")
- **Uman:** "Momentan nu ai comenzi" (nu "No orders found")
- **Fără ton robotic:** Evită mesaje tehnice, folosește limbaj natural

### Utilizare
```tsx
import { microcopy } from '@/lib/design-system/microcopy'

<Button>{microcopy.actions.save}</Button>
```

**Categorii:**
- **Actions:** `submit`, `save`, `cancel`, `delete`
- **Empty States:** Mesaje empatic pentru fiecare caz
- **Status Messages:** `loading`, `saving`, `success`, `error`
- **Form Labels:** `email`, `password`, `name`
- **Confirmations:** Mesaje de confirmare clare

---

## ✅ Checklist pentru Pagini Noi

### Design
- [ ] Carduri folosesc `FarmeroCard` + `CardHover`
- [ ] Badge-uri folosesc `StatusBadge`
- [ ] Empty states folosesc `EmptyState`
- [ ] Loading states folosesc `Skeleton` loaders
- [ ] Butoane au `ButtonPress` pentru press effect
- [ ] Focus states sunt clare și vizibile

### Tipografie
- [ ] Titluri de pagină: `text-3xl md:text-4xl`
- [ ] Titluri de secțiune: `text-2xl md:text-3xl`
- [ ] Body text: `text-base`
- [ ] Text secundar: `text-sm text-muted-foreground`
- [ ] Nu există cuvinte izolate pe rând

### Spacing
- [ ] Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- [ ] Section spacing: `py-12 md:py-16 lg:py-20`
- [ ] Grid gaps: `gap-4 lg:gap-6`

### Icon-uri
- [ ] Folosesc Lucide React Icons
- [ ] Size consistent: `w-4 h-4`, `w-5 h-5`, `w-6 h-6`
- [ ] CardIcon pentru icon-uri în carduri

### Accesibilitate
- [ ] Focus states vizibile
- [ ] ARIA labels pentru elemente interactive
- [ ] Suport pentru `prefers-reduced-motion`
- [ ] Contrast corespunzător

### Dark/Light Mode
- [ ] Componentele arată bine în ambele moduri
- [ ] Tranziții lineare pentru theme switch

---

## 📚 Resurse

### Componente
- `src/components/ui/farmero-card.tsx`
- `src/components/ui/status-badge.tsx`
- `src/components/ui/empty-state.tsx`
- `src/components/ui/alert-message.tsx`
- `src/components/ui/skeleton-loader.tsx`
- `src/components/ui/motion/card-hover.tsx`
- `src/components/ui/motion/button-press.tsx`
- `src/components/ui/card-icon.tsx`

### Design System Utilities
- `src/lib/design-system/typography.ts`
- `src/lib/design-system/spacing.ts`
- `src/lib/design-system/grid.ts`
- `src/lib/design-system/focus.ts`
- `src/lib/design-system/microcopy.ts`

### Documentație
- `docs/FARMERO_DESIGN_SYSTEM_SUMMARY.md`
- `docs/FARMERO_DESIGN_POLISH_IMPLEMENTATION.md`
- `docs/FARMERO_DESIGN_POLISH_SUMMARY.md`

---

**Document generat:** 2025-01-27  
**Status:** ✅ **Active**  
**Versiune:** 1.0

