# Checklist Actualizare Link-uri Rute

**Data:** 2025-01-27  
**Scop:** Listă de verificare pentru actualizarea tuturor link-urilor hardcodate

---

## ✅ Link-uri Actualizate

- [x] `src/config/navigation.ts` - Actualizat cu `routes.*`
- [x] `src/components/layout/site-layout-client.tsx` - Link-uri principale actualizate
- [ ] `src/components/layout/site-footer.tsx` - **DE ACTUALIZAT**
- [ ] `src/components/layout/dynamic-mega-menu.tsx` - **DE ACTUALIZAT**
- [ ] `src/components/ui/producer-card.tsx` - **DE ACTUALIZAT**
- [ ] `src/components/ui/product-card.tsx` - **DE ACTUALIZAT**
- [ ] Toate componentele din `src/app/(site)/**/page.tsx` - **DE ACTUALIZAT**
- [ ] Redirect-uri în `RequireAuth` și alte guard-uri - **DE ACTUALIZAT**

---

## 🔍 Căutare Link-uri Hardcodate

Folosiți următoarele comenzi pentru a găsi link-uri hardcodate:

### PowerShell (în directorul frontend):

```powershell
# Caută link-uri către rute vechi
Select-String -Path "src\**\*.tsx" -Pattern 'href=["\x27]/(products|producers|producer-portal|business-portal|logistics-portal|investor-portal|importer-portal|about|fees|faq)' -Recurse

# Caută router.push cu rute vechi
Select-String -Path "src\**\*.tsx" -Pattern 'router\.push\(["\x27]/(products|producers|producer-portal)' -Recurse

# Caută useRouter cu rute vechi
Select-String -Path "src\**\*.tsx" -Pattern 'push\(["\x27]/(products|producers|producer-portal)' -Recurse
```

### Pattern-uri de înlocuit:

| VECHI | NOU | Pattern Search |
|-------|-----|----------------|
| `/products` | `/produse` | `href="/products"` → `href={routes.products.list}` |
| `/products/[slug]` | `/produse/[slug]` | `href={/products/${slug}}` → `href={routes.products.detail(slug)}` |
| `/producers` | `/producatori` | `href="/producers"` → `href={routes.producers.list}` |
| `/producers/[slug]` | `/producatori/[slug]` | `href={/producers/${slug}}` → `href={routes.producers.detail(slug)}` |
| `/producer-portal/*` | `/portal-producatori/*` | `href="/producer-portal/..."` → `href={routes.producerPortal.*}` |
| `/business-portal/*` | `/portal-business/*` | `href="/business-portal/..."` → `href={routes.businessPortal.*}` |
| `/logistics-portal/*` | `/portal-logistica/*` | `href="/logistics-portal/..."` → `href={routes.logisticsPortal.*}` |
| `/investor-portal/*` | `/portal-investitori/*` | `href="/investor-portal/..."` → `href={routes.investorPortal.*}` |
| `/importer-portal/*` | `/portal-importatori/*` | `href="/importer-portal/..."` → `href={routes.importerPortal.*}` |
| `/about` | `/despre-noi` | `href="/about"` → `href={routes.about}` |
| `/fees` | `/comisioane-taxe` | `href="/fees"` → `href={routes.fees}` |
| `/faq` | `/intrebari-frecvente` | `href="/faq"` → `href={routes.faq}` |

---

## 📝 Instrucțiuni Actualizare

### 1. Import routes

Adaugă la începutul fișierului:

```typescript
import { routes } from '@/lib/routes'
```

### 2. Înlocuiește link-uri statice

**Înainte:**
```tsx
<Link href="/products">Produse</Link>
<Link href={`/products/${slug}`}>Vezi produs</Link>
```

**După:**
```tsx
<Link href={routes.products.list}>Produse</Link>
<Link href={routes.products.detail(slug)}>Vezi produs</Link>
```

### 3. Înlocuiește router.push

**Înainte:**
```tsx
router.push('/producer-portal/dashboard')
```

**După:**
```tsx
router.push(routes.producerPortal.dashboard)
```

### 4. Înlocuiește pathname checks

**Înainte:**
```tsx
if (pathname?.startsWith('/producer-portal')) { ... }
```

**După:**
```tsx
if (pathname?.startsWith('/portal-producatori')) { ... }
```

---

## 🎯 Prioritizare

### Prioritate ÎNALTĂ (Link-uri vizibile utilizatorilor):
1. `site-footer.tsx` - Footer links
2. `dynamic-mega-menu.tsx` - Mega menu links
3. `site-layout-client.tsx` - Navbar links (✅ parțial făcut)
4. Card components (producer-card, product-card)

### Prioritate MEDIE (Link-uri interne):
5. Pagini `page.tsx` - Link-uri în componente
6. Redirect-uri în guard-uri
7. Link-uri în componente de secțiuni

### Prioritate SCĂZUTĂ (Link-uri tehnice):
8. Test files
9. Documentation files

---

## ✅ Verificare Finală

După actualizare, verificați:

- [ ] `npm run build` - Fără erori
- [ ] `npm run lint` - Fără erori
- [ ] Toate link-urile funcționează manual
- [ ] Redirect-urile funcționează (accesați vechile URL-uri)
- [ ] Noile URL-uri funcționează corect

---

**Ultima actualizare:** 2025-01-27


