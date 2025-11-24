# Fix Build Issues - Next.js 404 Errors

## Problema
- Erori 404 pentru `main-app.js` și `app-pages-internals.js`
- Homepage se încarcă cu background maro și fără componente
- Build-ul Next.js este incomplet sau cache-ul este corupt

## Soluții

### 1. Ștergere cache și rebuild (RECOMANDAT)

```bash
# Oprește serverul de development (Ctrl+C)

# Șterge folder .next
rm -rf .next
# SAU pe Windows PowerShell:
Remove-Item -Recurse -Force .next

# Șterge node_modules/.cache dacă există
rm -rf node_modules/.cache

# Rebuild complet
npm run build

# Restart development server
npm run dev
```

### 2. Clear browser cache

- Chrome/Edge: `Ctrl+Shift+Delete` → Clear cached images and files
- SAU: Hard refresh: `Ctrl+Shift+R` sau `Ctrl+F5`
- SAU: Deschide în mod incognito pentru testare

### 3. Verificare erori de compilare

```bash
# Rulează build-ul și verifică erorile
npm run build

# Verifică dacă există erori TypeScript
npx tsc --noEmit
```

### 4. Verificare dacă ToastProvider cauzează probleme

Dacă problema persistă, poți temporar comenta ToastProvider în `src/app/layout.tsx`:

```tsx
// Temporar comentat pentru debugging
// <ToastProvider>
  {children}
// </ToastProvider>
```

### 5. Verificare port și server

- Asigură-te că serverul rulează pe portul corect (3000)
- Verifică că nu există alt proces care folosește portul 3000
- Încearcă să rulezi pe alt port: `npm run dev -- -p 3001`

## Cauze posibile

1. **Build incomplet** - Next.js nu a terminat build-ul corect
2. **Cache corupt** - Folder `.next` conține date vechi/corupte
3. **Browser cache** - Browser-ul cache-uiește versiuni vechi
4. **Eroare de compilare** - Există erori care blochează build-ul
5. **Probleme cu client components** - ToastProvider sau alte componente client pot cauza probleme

## Verificare rapidă

1. Deschide DevTools (F12)
2. Tab Network → Verifică dacă chunk-urile se încarcă
3. Tab Console → Verifică erorile JavaScript
4. Tab Sources → Verifică dacă fișierele există

## Dacă problema persistă

1. Verifică dacă există erori în terminal unde rulează `npm run dev`
2. Verifică dacă există erori în browser console
3. Verifică dacă toate dependențele sunt instalate: `npm install`
4. Verifică versiunea Node.js: `node --version` (recomandat: 18+)

