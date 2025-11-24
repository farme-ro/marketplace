# 🎨 Farmero Design System Summary

**Data:** 2025-01-27  
**Scop:** Documentație completă pentru design system unificat  
**Status:** ✅ **Implementat**

---

## 📋 Preambul

Acest document descrie design system-ul unificat pentru aplicația Farmero, bazat pe design-ul de pe homepage. Toate componentele și stilurile trebuie să respecte aceste standarde pentru consistență vizuală.

**Principiu de bază:** Homepage este referința vizuală pentru întreaga aplicație.

---

## 🎯 Componente UI Standardizate

### 1. Card Components

#### FarmeroCard

**Fișier:** `src/components/ui/farmero-card.tsx`

**Utilizare:**
```tsx
import { FarmeroCard, FarmeroCardContent } from '@/components/ui/farmero-card'

<FarmeroCard variant="default" rounded="2xl">
  <FarmeroCardContent padding="md">
    {/* Content */}
  </FarmeroCardContent>
</FarmeroCard>
```

**Variante:**
- `default` - Border `border-border/60`, shadow `shadow-sm`, hover `shadow-md`
- `elevated` - Shadow `shadow-md`, hover `shadow-lg`
- `muted` - Background `bg-muted/30`, border `border-border/40`

**Rounded:**
- `xl` - `rounded-xl`
- `2xl` - `rounded-2xl` (default, folosit pe homepage)
- `3xl` - `rounded-[32px]` (pentru carduri speciale)

**Padding:**
- `sm` - `p-4 md:p-5`
- `md` - `p-6 md:p-8` (default)
- `lg` - `p-8 md:p-10`

---

#### CardIcon

**Fișier:** `src/components/ui/card-icon.tsx`

**Utilizare:**
```tsx
import { CardIcon } from '@/components/ui/card-icon'
import { Package } from 'lucide-react'

<CardIcon icon={Package} size="md" variant="primary" />
```

**Size:**
- `sm` - `w-12 h-12` (pentru KPI cards)
- `md` - `w-20 h-20 md:w-24 md:h-24` (default, folosit pe homepage)
- `lg` - `w-28 h-28 md:w-32 md:h-32` (pentru carduri mari)

**Variante:**
- `primary` - `bg-primary/10`, `text-primary`
- `emerald` - `bg-emerald-500/10`, `text-emerald-600`
- `amber` - `bg-amber-500/10`, `text-amber-600`
- `orange` - `bg-orange-500/10`, `text-orange-600`
- `blue` - `bg-blue-500/10`, `text-blue-600`
- `green` - `bg-green-500/10`, `text-green-600`

**Styling:**
- Border-radius: `rounded-2xl` (consistent)
- Border: `border border-border/40`
- Icon size: adaptat automat la container size

---

### 2. Motion Components

#### CardHover

**Fișier:** `src/components/ui/motion/card-hover.tsx`

**Utilizare:**
```tsx
import { CardHover } from '@/components/ui/motion/card-hover'

<CardHover intensity="normal">
  <FarmeroCard>
    {/* Card content */}
  </FarmeroCard>
</CardHover>
```

**Intensity:**
- `subtle` - `translateY(-2px)`, `hover:shadow-md`
- `normal` - `translateY(-4px)`, `hover:shadow-lg` (default)
- `strong` - `translateY(-6px)`, `hover:shadow-xl`

**Easing:** `easeOut`, duration `200ms`

---

#### ButtonPress

**Fișier:** `src/components/ui/motion/button-press.tsx`

**Utilizare:**
```tsx
import { ButtonPress } from '@/components/ui/motion/button-press'

<ButtonPress onClick={handleClick}>
  <Button>Salvează</Button>
</ButtonPress>
```

**Efect:** `scale(0.97)` când este apăsat, duration `100ms`, easing `easeInOut`

---

### 3. Status Badge

**Fișier:** `src/components/ui/status-badge.tsx`

**Utilizare:**
```tsx
import { StatusBadge } from '@/components/ui/status-badge'

<StatusBadge 
  label="Livrat" 
  variant="success" 
  size="md" 
/>
```

**Variante:**
- `success` - Verde moale (`bg-green-100`, `text-green-700`)
- `pending` - Galben soft (`bg-yellow-100`, `text-yellow-700`)
- `warning` - Amber (`bg-amber-100`, `text-amber-700`)
- `error` - Roșu soft (`bg-red-100`, `text-red-700`)
- `info` - Albastru (`bg-blue-100`, `text-blue-700`)
- `processing` - Primary (`bg-primary/10`, `text-primary`)
- `delivered` - Verde (același ca success)
- `cancelled` - Gri (`bg-gray-100`, `text-gray-700`)

**Size:**
- `sm` - `px-2 py-0.5 text-xs`, icon `w-3 h-3`
- `md` - `px-3 py-1 text-xs`, icon `w-3.5 h-3.5` (default)
- `lg` - `px-4 py-1.5 text-sm`, icon `w-4 h-4`

**Styling:**
- Border-radius: `rounded-full` (consistent)
- Border: culoare variantă cu opacitate
- Icon: inclus automat dacă nu este specificat altul

---

### 4. Alert Message

**Fișier:** `src/components/ui/alert-message.tsx`

**Utilizare:**
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
- Border-left: `border-l-4` cu culoarea variantă
- Background: culoare soft (`bg-green-50`, etc.)
- Icon: `w-5 h-5`, culoare variantă
- Padding: `p-4`

---

### 5. Empty State

**Fișier:** `src/components/ui/empty-state.tsx`

**Utilizare:**
```tsx
import { EmptyState } from '@/components/ui/empty-state'
import { Package } from 'lucide-react'

<EmptyState
  icon={Package}
  title="Momentan nu ai produse listate"
  description="Hai să adaugi primul produs și să începi să vinzi!"
  action={{
    label: "Adaugă primul produs",
    href: "/producer-portal/products/new"
  }}
/>
```

**Caracteristici:**
- Titlu empatic și cald
- Descriere încurajatoare
- Icon sau ilustrație animată (când este disponibilă)
- Buton CTA clar
- Wrappable în Card (opțional)

**Size:**
- `sm` - Icon `w-12 h-12`, title `text-lg`
- `md` - Icon `w-14 h-14`, title `text-xl` (default)
- `lg` - Icon `w-16 h-16`, title `text-2xl`

---

### 6. Skeleton Loaders

**Fișier:** `src/components/ui/skeleton-loader.tsx`

**Utilizare:**
```tsx
import { Skeleton, SkeletonCard, SkeletonProductCard, SkeletonDashboardStats } from '@/components/ui/skeleton-loader'

// Generic skeleton
<Skeleton variant="text" width="100%" height={16} />

// Pre-configured skeletons
<SkeletonCard />
<SkeletonProductCard />
<SkeletonDashboardStats />
```

**Variante:**
- `text` - Pentru text lines
- `circular` - Pentru avatare, icon-uri
- `rectangular` - Pentru imagini, blocuri
- `card` - Pentru carduri complete

**Styling:**
- Background: `bg-muted` (adaptat automat la theme)
- Animation: `animate-pulse` (subtle)
- Border-radius: adaptat la variantă

---

## 📐 Typography Scale

**Fișier:** `src/lib/design-system/typography.ts`

### Page Titles (h1)

```tsx
import { typography } from '@/lib/design-system/typography'

<h1 className={typography.pageTitle.base}>
  Titlul paginii
</h1>

// Pentru hero sections
<h1 className={typography.pageTitle.hero}>
  Titlu hero
</h1>
```

**Classes:**
- `base`: `text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground`
- `hero`: `text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-foreground`

### Section Titles (h2)

```tsx
<h2 className={typography.sectionTitle.base}>
  Titlul secțiunii
</h2>
```

**Classes:**
- `base`: `text-2xl md:text-3xl font-semibold tracking-tight text-foreground`
- `large`: `text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground`

### Card Titles (h3)

```tsx
<h3 className={typography.cardTitle.base}>
  Titlul cardului
</h3>
```

**Classes:**
- `base`: `text-base md:text-lg font-semibold text-foreground`
- `large`: `text-lg md:text-xl font-bold text-foreground`

### Body Text

```tsx
<p className={typography.body.base}>
  Text body
</p>
```

**Classes:**
- `base`: `text-base text-foreground-body leading-relaxed`
- `small`: `text-sm text-muted-foreground leading-relaxed`
- `large`: `text-lg md:text-xl text-foreground-body leading-relaxed`

### Descriptions

```tsx
<p className={typography.description.base}>
  Descriere
</p>
```

**Classes:**
- `base`: `text-sm text-muted-foreground leading-relaxed`
- `large`: `text-base md:text-lg text-muted-foreground leading-relaxed`

---

## 📏 Spacing System

**Fișier:** `src/lib/design-system/spacing.ts`

### Section Spacing

```tsx
import { spacing } from '@/lib/design-system/spacing'

<section className={spacing.section.vertical}>
  {/* Content */}
</section>
```

**Options:**
- `vertical`: `py-12 md:py-16 lg:py-20` (default)
- `verticalSmall`: `py-8 md:py-12`
- `verticalLarge`: `py-16 md:py-24 lg:py-32`

### Card Spacing

```tsx
<div className={spacing.card.gap}>
  {/* Cards */}
</div>
```

**Options:**
- `padding`: `p-6 md:p-8`
- `paddingSmall`: `p-4 md:p-5`
- `paddingLarge`: `p-8 md:p-10`
- `gap`: `gap-4 lg:gap-6`
- `gapSmall`: `gap-3`
- `gapLarge`: `gap-6 lg:gap-8`

---

## 🎨 Grid System

**Fișier:** `src/lib/design-system/grid.ts`

### Container

```tsx
import { container } from '@/lib/design-system/grid'

<div className={container}>
  {/* Content */}
</div>
```

**Class:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`

### Grid Gaps

```tsx
import { gridGap } from '@/lib/design-system/grid'

<div className={cn('grid grid-cols-3', gridGap.medium)}>
  {/* Grid items */}
</div>
```

**Options:**
- `small`: `gap-3`
- `medium`: `gap-4 lg:gap-6` (default)
- `large`: `gap-6 lg:gap-8`

---

## 🎭 Motion Design

### Card Hover

**Standard:** `translateY(-4px)` + `shadow-lg` pe hover

**Easing:** `easeOut`, duration `200ms`

### Button Press

**Standard:** `scale(0.97)` când este apăsat

**Easing:** `easeInOut`, duration `100ms`

### Toggle Transitions

**Standard:** Tranziții lineare cu easing natural

**Duration:** `200-300ms`

---

## 🎨 Icon System

### Icon Set Principal

**Folosit:** Lucide React Icons

**Stroke Width:** Consistent (1.5-2px)

**Size Standard:**
- Small: `w-4 h-4` (16px)
- Medium: `w-5 h-5` (20px)
- Large: `w-6 h-6` (24px)

**Regulă:** Folosește același set (Lucide) peste tot, nu amesteca cu alte icon sets.

---

## ♿ Focus States

**Fișier:** `src/lib/design-system/focus.ts`

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

---

## 💬 Tone of Voice & Microcopy

**Fișier:** `src/lib/design-system/microcopy.ts`

### Utilizare

```tsx
import { microcopy, getMicrocopy } from '@/lib/design-system/microcopy'

// Direct access
<Button>{microcopy.actions.save}</Button>

// Or via helper
<Button>{getMicrocopy('actions.save')}</Button>
```

### Principii

- **Cald:** "Hai să adaugi primul produs" (nu "Adaugă produs")
- **Clar:** "Salvează modificările" (nu "Submit")
- **Uman:** "Momentan nu ai comenzi" (nu "No orders found")
- **Fără ton robotic:** Evită mesaje tehnice, folosește limbaj natural

### Categorii

- **Actions:** `submit`, `save`, `cancel`, `delete`, etc.
- **Empty States:** Mesaje empatic pentru fiecare caz
- **Status Messages:** `loading`, `saving`, `success`, `error`
- **Form Labels:** `email`, `password`, `name`, etc.
- **Confirmations:** Mesaje de confirmare clare

---

## 📦 Empty States Personalizate

### Cazuri Standard

1. **No Orders**
   - Title: "Momentan nu ai comenzi"
   - Description: "Începe să cumperi pentru a vedea comenzile tale aici."
   - Action: "Vezi produsele"

2. **No Products (Producer)**
   - Title: "Momentan nu ai produse listate"
   - Description: "Hai să adaugi primul produs și să începi să vinzi!"
   - Action: "Adaugă primul produs"

3. **No Subscriptions**
   - Title: "Nu ai abonamente active"
   - Description: "Abonează-te la producătorii tăi preferați pentru a primi produse regulate."
   - Action: "Explorează abonamente"

4. **No Campaigns**
   - Title: "Nu ai campanii active"
   - Description: "Creează prima ta campanie de marketing pentru a-ți crește vizibilitatea."
   - Action: "Creează campanie"

**Pattern:** Titlu empatic + Descriere încurajatoare + Buton CTA clar

---

## 🏷️ Badge System

### Status Badges

**Folosit pentru:**
- Status comenzi
- Status abonamente
- Status livrare
- Status promoții

**Variante standard:**
- `success` - Verde moale
- `pending` - Galben soft
- `warning` - Amber
- `error` - Roșu soft
- `info` - Albastru
- `processing` - Primary
- `delivered` - Verde
- `cancelled` - Gri

**Styling:**
- Border-radius: `rounded-full`
- Font-size: `text-xs` (sm/md) sau `text-sm` (lg)
- Icon: `w-3 h-3` (sm), `w-3.5 h-3.5` (md), `w-4 h-4` (lg)
- Padding: `px-2 py-0.5` (sm), `px-3 py-1` (md), `px-4 py-1.5` (lg)

---

## 📱 Responsive Design

### Breakpoints

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

### Grid Patterns

**1 coloană → 2 coloane → 3 coloane:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
```

**1 coloană → 4 coloane:**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
```

---

## 🌓 Dark/Light Mode

### Color Tokens

Folosește întotdeauna token-uri de culoare, nu culori hardcodate:

- `bg-background` / `text-foreground`
- `bg-card` / `text-card-foreground`
- `bg-muted` / `text-muted-foreground`
- `bg-primary` / `text-primary`
- `border-border`

### Accent Colors

Pentru badge-uri și status-uri, folosește variante cu opacitate:

- Light: `bg-green-100`, `text-green-700`
- Dark: `bg-green-900/30`, `text-green-400`

---

## ✅ Checklist pentru Noi Pagini

Când creezi o pagină nouă, verifică:

- [ ] Folosește `FarmeroCard` sau `Card` cu styling consistent
- [ ] Icon-urile folosesc `CardIcon` cu size și variant corect
- [ ] Typography folosește scale-ul standardizat
- [ ] Spacing folosește constantele din `spacing.ts`
- [ ] Badge-uri folosesc `StatusBadge` cu variant corect
- [ ] Empty states folosesc `EmptyState` cu mesaje empatic
- [ ] Loading states folosesc `Skeleton` loaders
- [ ] Focus states sunt vizibile și accesibile
- [ ] Motion design este subtil și consistent
- [ ] Microcopy folosește tone of voice cald și uman
- [ ] Responsive pe toate breakpoint-urile
- [ ] Dark mode funcționează corect

---

## 📚 Exemple de Utilizare

### Card cu Icon (Homepage Style)

```tsx
import { FarmeroCard, FarmeroCardContent } from '@/components/ui/farmero-card'
import { CardIcon } from '@/components/ui/card-icon'
import { CardHover } from '@/components/ui/motion/card-hover'
import { typography } from '@/lib/design-system/typography'
import { Package } from 'lucide-react'

<CardHover>
  <FarmeroCard rounded="2xl">
    <FarmeroCardContent padding="md">
      <div className="flex items-center justify-center mb-6">
        <CardIcon icon={Package} size="md" variant="primary" />
      </div>
      <h3 className={typography.cardTitle.base}>
        Titlul cardului
      </h3>
      <p className={typography.description.base}>
        Descriere card
      </p>
    </FarmeroCardContent>
  </FarmeroCard>
</CardHover>
```

### Status Badge

```tsx
import { StatusBadge } from '@/components/ui/status-badge'

<StatusBadge 
  label="Livrat" 
  variant="success" 
  size="md" 
/>
```

### Empty State

```tsx
import { EmptyState } from '@/components/ui/empty-state'
import { Package } from 'lucide-react'
import { microcopy } from '@/lib/design-system/microcopy'

<EmptyState
  icon={Package}
  title={microcopy.emptyStates.noProducts.title}
  description={microcopy.emptyStates.noProducts.description}
  action={{
    label: microcopy.emptyStates.noProducts.action,
    href: "/producer-portal/products/new"
  }}
/>
```

---

## 🔗 Referințe

- **Homepage:** `src/app/(site)/_components/home/` - Referință vizuală
- **Card Components:** `src/components/ui/farmero-card.tsx`
- **Icon Components:** `src/components/ui/card-icon.tsx`
- **Motion Components:** `src/components/ui/motion/`
- **Typography:** `src/lib/design-system/typography.ts`
- **Spacing:** `src/lib/design-system/spacing.ts`
- **Grid:** `src/lib/design-system/grid.ts`
- **Microcopy:** `src/lib/design-system/microcopy.ts`
- **Focus:** `src/lib/design-system/focus.ts`

---

**Document generat:** 2025-01-27  
**Status:** ✅ **Design System Implementat**  
**Următorul pas:** Refactorizare carduri din portal-uri pentru a folosi componentele standardizate

