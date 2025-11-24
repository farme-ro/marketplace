# 📊 Bundle Analysis Guide

**Data:** 2025-01-27  
**Scop:** Ghid pentru analiza bundle size și optimizări

---

## 🚀 Quick Start

### Rulează Bundle Analyzer

```bash
npm run analyze
```

Aceasta va:
1. Construi aplicația în mod production
2. Genera rapoarte vizuale pentru bundle size
3. Deschide automat în browser două tab-uri:
   - **Client bundles** - JavaScript pentru client
   - **Server bundles** - JavaScript pentru server

---

## 📋 Ce Analizează

### Client Bundles
- **First Load JS** - JavaScript necesar pentru prima încărcare
- **Shared chunks** - Cod partajat între pagini
- **Page chunks** - Cod specific fiecărei pagini
- **Vendor chunks** - Dependențe externe (React, Next.js, etc.)

### Server Bundles
- **Server components** - Componente renderate pe server
- **API routes** - Rute API (dacă există)

---

## 🎯 Target Metrics

### Bundle Size Targets
- **First Load JS**: < 200KB (gzipped)
- **Individual Route**: < 150KB (gzipped)
- **Shared chunks**: < 100KB (gzipped)

### Performance Targets
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

---

## 🔍 Ce Să Cauți

### 1. Dependențe Mari
- Identifică dependențe care ocupă mult spațiu
- Verifică dacă poți folosi alternative mai mici
- Verifică dacă poți tree-shake dependențe nefolosite

### 2. Duplicate Dependencies
- Verifică dacă aceeași dependență apare în multiple chunks
- Optimizează cu `webpack` config dacă este necesar

### 3. Large Components
- Identifică componente mari care pot fi lazy-loaded
- Verifică dacă poți code-split componente grele

### 4. Unused Code
- Verifică dacă există cod nefolosit în bundle
- Folosește tree-shaking pentru a elimina cod nefolosit

---

## 🛠️ Optimizări Recomandate

### 1. Dynamic Imports
Folosește `next/dynamic` pentru componente grele:

```typescript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSkeleton />,
  ssr: false, // Dacă nu este necesar pentru SSR
})
```

### 2. Code Splitting
Next.js face automat code splitting pentru rute, dar poți optimiza:

```typescript
// În loc de:
import { HeavyLibrary } from 'heavy-library'

// Folosește:
const HeavyLibrary = await import('heavy-library')
```

### 3. Tree Shaking
Asigură-te că folosești imports specifice:

```typescript
// ❌ Bad - importă tot
import * as utils from './utils'

// ✅ Good - importă doar ce ai nevoie
import { specificFunction } from './utils'
```

### 4. Image Optimization
Folosește `next/image` pentru toate imaginile:

```typescript
import Image from 'next/image'

<Image
  src="/image.jpg"
  width={800}
  height={600}
  alt="Description"
  priority // Pentru imagini above-the-fold
/>
```

---

## 📊 Interpretare Rezultate

### Bundle Size Breakdown
- **Green (< 50KB)**: Bun, nu necesită optimizare
- **Yellow (50-100KB)**: Acceptabil, dar poate fi optimizat
- **Red (> 100KB)**: Necesită optimizare urgentă

### Common Issues

#### 1. Large Vendor Chunks
**Problema:** Dependențe mari (ex: lodash, moment.js)  
**Soluție:** Folosește alternative mai mici sau imports specifice

#### 2. Duplicate Dependencies
**Problema:** Aceeași dependență în multiple chunks  
**Soluție:** Configurează `webpack` pentru a partaja dependențele

#### 3. Unused Code
**Problema:** Cod nefolosit în bundle  
**Soluție:** Verifică imports și elimină cod nefolosit

---

## 🔄 Workflow Recomandat

1. **Rulează bundle analyzer** după modificări majore
2. **Identifică probleme** (dependențe mari, duplicate, etc.)
3. **Optimizează** (dynamic imports, code splitting, tree shaking)
4. **Verifică din nou** bundle size
5. **Documentează** optimizările făcute

---

## 📝 Note

- Bundle analyzer rulează doar în mod production
- Rezultatele pot varia între build-uri (cache, etc.)
- Compară rezultatele între build-uri pentru a identifica tendințe

---

## 🔗 Resurse

- [Next.js Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)

---

**Ultima actualizare:** 2025-01-27

