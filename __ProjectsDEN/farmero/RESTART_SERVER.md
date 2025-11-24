# 🔄 Restart Server pentru a încărca variabilele de mediu

## ⚠️ IMPORTANT: Restart necesar

După ce ai creat sau modificat fișierul `.env.local`, **trebuie să repornești server-ul Next.js** pentru ca variabilele să fie încărcate.

## 📋 Pași pentru restart

### 1. Oprește server-ul actual

În terminal-ul unde rulează `npm run dev`:
- Apasă `Ctrl+C` (sau `Cmd+C` pe Mac)
- Așteaptă ca server-ul să se oprească complet

### 2. Pornește server-ul din nou

```bash
npm run dev
```

### 3. Verifică că variabilele sunt încărcate

1. Accesează `http://localhost:3000/status`
2. Verifică că **API URL** arată `https://api.farme.ro` (nu `http://localhost:3001`)

## 🔍 Verificare rapidă

După restart, în browser console (F12 → Console), poți verifica:

```javascript
// Ar trebui să afișeze: "https://api.farme.ro"
console.log(process.env.NEXT_PUBLIC_API_URL)
```

**Notă:** În browser, variabilele `NEXT_PUBLIC_*` sunt înlocuite la build time, deci poți vedea valoarea direct în codul sursă.

## ❓ De ce este necesar restart-ul?

Next.js încarcă variabilele de mediu doar la pornirea server-ului. Modificările în `.env.local` nu sunt detectate automat în timpul rulării.

## ✅ După restart

După restart, ar trebui să vezi:
- ✅ **API URL:** `https://api.farme.ro`
- ✅ **Backend API:** Status OK (dacă backend-ul este accesibil)
- ✅ **Database:** Status OK (dacă backend-ul raportează)

