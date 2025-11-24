# Layout Duplication Fix

## Problemă Identificată

Pagina `/sustine-farmero` și alte pagini din `(site)` aveau header și footer duplicate, deoarece:
- `src/app/(site)/layout.tsx` include deja `SiteLayoutClient` (care are header și footer)
- Paginile individuale foloseau `SiteLayoutClient` explicit din nou

## Pagini Corectate

Toate paginile din `(site)` care foloseau `SiteLayoutClient` explicit au fost corectate:

1. ✅ `/sustine-farmero` - Eliminat `SiteLayoutClient` (folosește layout-ul părinte)
2. ✅ `/account` - Eliminat `SiteLayoutClient`
3. ✅ `/orders` - Eliminat `SiteLayoutClient`
4. ✅ `/orders/[id]` - Eliminat `SiteLayoutClient`
5. ✅ `/account/favorites` - Eliminat `SiteLayoutClient`
6. ✅ `/forgot-password` - Eliminat `SiteLayoutClient`

## Pagini Care Rămân OK

- `src/app/not-found.tsx` - Folosește `SiteLayoutClient` explicit (OK, nu este în `(site)`)
- `src/app/(site)/layout.tsx` - Include `SiteLayoutClient` (OK, este layout-ul părinte)

## Structura Layout-ului

```
src/app/
├── layout.tsx (root - doar providers)
└── (site)/
    ├── layout.tsx (include SiteLayoutClient - header + footer)
    └── [toate paginile] (folosesc layout-ul părinte, nu SiteLayoutClient explicit)
```

## Verificare

După corectare, toate paginile din `(site)` folosesc doar layout-ul părinte, eliminând dublarea header-ului și footer-ului.

