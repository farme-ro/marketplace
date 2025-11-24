# Homepage Categories Section Redesign

**Data:** 2025-01-27  
**Scop:** Redesign complet al secțiunii "Browse by Category / Caută după categorie"  
**Status:** ✅ **Implementat**

---

## 📋 Rezumat Executiv

Secțiunea de categorii de pe homepage a fost complet redesigned pentru a fi:
- Mult mai atractivă vizual
- Perfect consistentă cu noul design Farmero (carduri, culori, radius, shadow)
- Foarte clară în toate state-urile (default, hover, active, focus, selected, disabled)
- Accesibilă (aria, contrast, focus ring)
- Responsive și frumoasă pe toate device-urile

---

## 🎯 Obiective Atinse

✅ Cardurile de categorie folosesc noul "Farmero card style"  
✅ Component unic reutilizabil `CategoryCard`  
✅ Toate state-urile sunt foarte clare vizual  
✅ Design funcționează în light și dark mode  
✅ Layout impecabil pe mobile/tablet/desktop  
✅ Accesibilitate completă implementată  
✅ i18n păstrat și extins

---

## 📁 Fișiere Create/Modificate

### Noi

1. **`src/components/categories/category-card.tsx`**
   - Component reutilizabil pentru cardurile de categorie
   - Suportă toate state-urile: default, hover, active, focus, selected, disabled
   - Design consistent cu Farmero card style

### Modificate

1. **`src/app/(site)/_components/home/categories-section.tsx`**
   - Refactorizat complet să folosească `CategoryCard`
   - Layout responsive: mobile (scroll orizontal), tablet (2 coloane), desktop (6 coloane)
   - Detectare automată a categoriei active din URL

2. **`src/lib/i18n/translations/ro.json`**
   - Adăugate chei pentru descrieri: `vegetablesFruitsDesc`, `dairyDesc`, `meatDesc`, `sweetsDesc`, `localDrinksDesc`, `otherDesc`
   - Adăugată cheie `selected` pentru indicatorul de categorie selectată

3. **`src/lib/i18n/translations/en.json`**
   - Adăugate chei pentru descrieri și `selected`

4. **`src/lib/i18n/translations/fr.json`**
   - Adăugate chei pentru descrieri și `selected`

5. **`src/lib/i18n/translations/es.json`**
   - Adăugate chei pentru descrieri și `selected`

6. **`src/lib/i18n/translations/it.json`**
   - Adăugate chei pentru descrieri și `selected`

7. **`src/lib/i18n/translations/de.json`**
   - Adăugate chei pentru descrieri și `selected`

---

## 🎨 Design Pattern - States

### Default State
- `bg-card` - fundal card
- `border-border/60` - border subtil
- `shadow-sm` - umbră subtilă
- `text-foreground` - text principal

### Hover State
- `-translate-y-0.5` - ușor ridicat
- `shadow-md` - umbră mai pronunțată
- `bg-card/95` - fundal ușor mai intens
- `border-primary/60` - border accentuat
- `text-primary` - text accentuat
- Icon: `bg-primary-soft/50` - fundal icon mai intens
- Icon animation: rotate și scale

### Active/Pressed State
- `scale-[0.98]` - ușor comprimat la click
- `shadow-sm` - umbră redusă

### Selected State (isActive)
- `border-primary` - border accentuat
- `shadow-md` - umbră mai pronunțată
- `bg-gradient-to-br from-primary/5 to-primary-soft/10` - gradient subtil
- Icon: `bg-gradient-to-br from-primary/20 to-primary-soft/30` - gradient icon
- Pill indicator în colțul stânga sus cu text "Selectat"

### Focus State (Keyboard)
- `ring-2 ring-primary/50` - inel de focus
- `ring-offset-2 ring-offset-background` - offset pentru claritate
- `outline-none` - elimină outline default

### Disabled State
- `opacity-50` - opacitate redusă
- `cursor-not-allowed` - cursor indică indisponibilitate
- Fără hover/active states
- `aria-disabled="true"`

---

## ♿ Accesibilitate

### ARIA Attributes
- `aria-label` - label descriptiv pentru fiecare card
- `aria-current="page"` - pentru categoria activă (când e Link)
- `aria-pressed` - pentru butoane toggle
- `aria-disabled="true"` - pentru state disabled

### Keyboard Navigation
- `tabIndex={0}` - pentru butoane (când nu e Link)
- `Enter` și `Space` - activează butonul
- Focus ring vizibil și clar

### Contrast
- Toate culorile folosesc theme tokens (nu hardcodate)
- Contrast verificat pentru text pe fundal
- Focus ring cu offset pentru claritate

---

## 📱 Responsive Design

### Mobile (< 768px)
- Scroll orizontal cu snap
- Carduri: `min-w-[140px]`
- Icon: `w-8 h-8`
- Padding: `px-4 py-4`
- Text: `text-sm`

### Tablet (768px - 1023px)
- Grid: `grid-cols-2 sm:grid-cols-3`
- Icon: `w-10 h-10`
- Padding: `px-6 py-5`
- Text: `text-base`

### Desktop (1024px+)
- Grid: `lg:grid-cols-6`
- Icon: `w-10 h-10`
- Padding: `px-6 py-5`
- Text: `text-base`

---

## 🌗 Light & Dark Mode

### Theme Tokens Folosite
- `bg-card` - fundal card (adaptiv la temă)
- `bg-background` - fundal secțiune
- `border-border` - border (adaptiv)
- `text-foreground` - text principal
- `text-muted-foreground` - text secundar
- `text-primary` - accent principal
- `bg-primary-soft` - fundal icon (adaptiv)
- `ring-primary/50` - focus ring

### Testare
- ✅ Light theme - carduri aerisite, fundal light green subtil
- ✅ Dark theme - fundal verde închis, accent terracotta/verde, carduri lizibile

---

## 🔧 Pattern-uri Tehnice

### Component API

```tsx
<CategoryCard
  id="legume-fructe"
  icon={<IconComponent />}
  label="Legume & fructe"
  description="Produse proaspete de sezon"
  href="/products?category=legume-fructe"
  isActive={activeCategory === 'legume-fructe'}
  selectedLabel="Selectat"
  aria-label="Vezi produse din categoria Legume & fructe"
/>
```

### Link vs Button
- Dacă `href` este setat → render ca `<Link>` (Next.js)
- Dacă `onClick` este setat → render ca `<div>` cu `role="button"`
- Dacă `isDisabled` → render ca `<div>` cu `aria-disabled="true"`

### Active Detection
- Folosește `useSearchParams` pentru a detecta categoria activă din URL
- Compară `searchParams.get('category')` cu `category.slug`

---

## 📝 i18n Keys Adăugate

### Română (ro.json)
```json
{
  "home": {
    "categories": {
      "vegetablesFruitsDesc": "Produse proaspete de sezon",
      "dairyDesc": "Lactate și brânzeturi locale",
      "meatDesc": "Carne și mezeluri tradiționale",
      "sweetsDesc": "Dulciuri și conserve tradiționale",
      "localDrinksDesc": "Sucuri și băuturi naturale",
      "otherDesc": "Alte produse locale",
      "selected": "Selectat"
    }
  }
}
```

### Alte Limbi
- Engleză (en.json)
- Franceză (fr.json)
- Spaniolă (es.json)
- Italiană (it.json)
- Germană (de.json)

---

## ✅ Checklist Final

### Design
- [x] Carduri folosesc Farmero card style (rounded-2xl, shadow-sm, bg-card)
- [x] Toate state-urile sunt clare și distincte
- [x] Design consistent cu homepage rework
- [x] Light & dark mode funcționează corect

### Accesibilitate
- [x] ARIA attributes complete
- [x] Keyboard navigation funcțională
- [x] Focus ring vizibil
- [x] Contrast suficient

### Responsive
- [x] Mobile: scroll orizontal cu snap
- [x] Tablet: 2-3 coloane
- [x] Desktop: 6 coloane
- [x] Tap targets ≥ 44x44px

### i18n
- [x] Toate textele folosesc i18n
- [x] Chei adăugate pentru descrieri
- [x] Chei adăugate pentru selected state
- [x] Toate limbile actualizate

### Tehnical
- [x] Nu există warnings/errors la build
- [x] Component reutilizabil
- [x] Type-safe (TypeScript)
- [x] Performance optimizat (memoization unde e cazul)

---

## 🚀 Utilizare

### În Categories Section

```tsx
import { CategoryCard } from '@/components/categories/category-card'

<CategoryCard
  id={category.id}
  icon={<CategoryIcon />}
  label={category.name}
  description={category.description}
  href={`/products?category=${category.slug}`}
  isActive={activeCategory === category.slug}
  selectedLabel={t('home.categories.selected', 'Selectat')}
  aria-label={t('home.categories.categoryAria', 'Vezi produse din categoria {{category}}', { category: category.name })}
/>
```

### În Alte Secțiuni (viitor)

Componenta `CategoryCard` poate fi folosită și în alte părți ale aplicației unde sunt necesare carduri de categorie, asigurând consistență vizuală.

---

## 📌 Note

- Componenta respectă `prefers-reduced-motion` pentru animații
- Icon-urile sunt ReactNode, nu componente, pentru flexibilitate maximă
- Active detection se bazează pe URL params - poate fi extinsă pentru alte cazuri
- Selected indicator poate fi ascuns dacă `selectedLabel` nu este setat

---

## 🔮 Extensii Viitoare (Optional)

- Badge-uri "New / Seasonal" pentru categorii
- Animații mai complexe pentru hover
- Variante de size (sm, md, lg)
- Variante de layout (horizontal vs vertical)

