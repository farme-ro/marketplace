# ⚡ Code Splitting Optimization

**Data:** 2025-01-27  
**Scop:** Ghid pentru optimizarea code splitting în Next.js

---

## 📋 Status Actual

### ✅ Implementat

- ✅ **Route-based code splitting** - Next.js face automat code splitting pentru rute
- ✅ **Dynamic imports** - Secțiuni homepage lazy-loaded (RegionsSection, ProductsSection, ProducersSection)
- ✅ **Component memoization** - ProductCard și ProducerCard memoizate
- ✅ **Image optimization** - next/image folosit pentru toate imaginile

### ⚠️ Optimizări Rămase

- [ ] Verificare bundle size pentru fiecare rută
- [ ] Optimizare vendor chunks dacă este necesar
- [ ] Verificare duplicate dependencies

---

## 🎯 Strategii de Code Splitting

### 1. Route-based Splitting (Automat)

Next.js face automat code splitting pentru fiecare rută:

```
app/
├── page.tsx          → Chunk 1 (Homepage)
├── products/
│   └── page.tsx      → Chunk 2 (Products)
└── producers/
    └── page.tsx      → Chunk 3 (Producers)
```

**Status:** ✅ **AUTOMAT** - Nu necesită acțiune

---

### 2. Component-based Splitting (Dynamic Imports)

Folosește `next/dynamic` pentru componente grele:

```typescript
import dynamic from 'next/dynamic'

// Lazy load component
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSkeleton />,
  ssr: false, // Dacă nu este necesar pentru SSR
})
```

**Exemple implementate:**
- ✅ `RegionsSection` - lazy-loaded pe homepage
- ✅ `ProductsSection` - lazy-loaded pe homepage
- ✅ `ProducersSection` - lazy-loaded pe homepage

---

### 3. Library Splitting

Separează dependențe mari în chunk-uri separate:

```typescript
// next.config.js
module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
          },
          framerMotion: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'framer-motion',
            priority: 20,
          },
        },
      }
    }
    return config
  },
}
```

**Status:** ⚠️ **OPȚIONAL** - Doar dacă bundle analyzer arată probleme

---

### 4. Conditional Imports

Încarcă cod doar când este necesar:

```typescript
// Încarcă doar în browser
if (typeof window !== 'undefined') {
  const HeavyLibrary = await import('heavy-library')
}
```

---

## 📊 Bundle Size Targets

### Per Route
- **Homepage**: < 200KB (first load)
- **Products**: < 150KB
- **Producers**: < 150KB
- **Product Detail**: < 150KB
- **Producer Detail**: < 150KB

### Shared Chunks
- **Vendor (React, Next.js)**: < 100KB
- **UI Components**: < 50KB
- **Utils**: < 30KB

---

## 🔍 Verificare Bundle Size

### 1. Rulează Bundle Analyzer

```bash
npm run analyze
```

### 2. Verifică Rezultate

- **First Load JS** - Ar trebui să fie < 200KB
- **Route chunks** - Ar trebui să fie < 150KB fiecare
- **Vendor chunks** - Ar trebui să fie < 100KB

### 3. Identifică Probleme

- Dependențe mari (> 50KB)
- Duplicate dependencies
- Cod nefolosit

---

## 🛠️ Optimizări Recomandate

### 1. Lazy Load Heavy Components

```typescript
// În loc de:
import { HeavyChart } from './HeavyChart'

// Folosește:
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <ChartSkeleton />,
})
```

### 2. Tree Shake Unused Code

```typescript
// ❌ Bad
import * as lodash from 'lodash'

// ✅ Good
import debounce from 'lodash/debounce'
```

### 3. Optimize Vendor Chunks

Dacă bundle analyzer arată vendor chunks mari:

```javascript
// next.config.js
module.exports = {
  webpack: (config) => {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        default: false,
        vendors: false,
        // Split large vendors
        framerMotion: {
          name: 'framer-motion',
          test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
          priority: 20,
        },
      },
    }
    return config
  },
}
```

---

## 📝 Checklist Optimizare

### Pre-Optimizare
- [ ] Rulează bundle analyzer
- [ ] Identifică chunk-uri mari (> 150KB)
- [ ] Identifică duplicate dependencies
- [ ] Identifică cod nefolosit

### Optimizare
- [ ] Lazy load componente grele
- [ ] Tree shake unused code
- [ ] Optimize vendor chunks (dacă este necesar)
- [ ] Verifică din nou bundle size

### Post-Optimizare
- [ ] Bundle size redus cu cel puțin 10%
- [ ] First Load JS < 200KB
- [ ] Route chunks < 150KB
- [ ] Documentează optimizările

---

## 🔗 Resurse

- [Next.js Code Splitting](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading)
- [Next.js Dynamic Imports](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading#dynamic-imports)
- [Webpack Code Splitting](https://webpack.js.org/guides/code-splitting/)

---

**Ultima actualizare:** 2025-01-27

